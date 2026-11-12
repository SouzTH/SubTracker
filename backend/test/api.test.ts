import assert from "node:assert/strict";
import { once } from "node:events";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { AddressInfo } from "node:net";
import test, { after, before } from "node:test";
import app from "../src/app";
import { prisma } from "../src/lib/prisma";
import { repositories } from "../src/repositories";

let server: ReturnType<typeof app.listen>;
let baseUrl: string;
const testEmails: string[] = [];

function cookieFrom(response: Response): string {
  const cookie = response.headers
    .get("set-cookie")
    ?.split(";")[0];
  assert.ok(cookie, "Expected the server to set a refresh cookie");
  return cookie;
}

async function post(path: string, body?: unknown, cookie?: string, accessToken?: string) {
  return fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(cookie ? { Cookie: cookie } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (testEmails.length > 0) {
    await prisma.user.deleteMany({ where: { email: { in: testEmails } } });
  }
  server.close();
  await once(server, "close");
  await prisma.$disconnect();
});

test("API rotates refresh cookies, protects routes, and isolates subscription ownership", async () => {
  const suffix = randomUUID();
  const firstEmail = `api-test-${suffix}@example.test`;
  const secondEmail = `api-test-other-${suffix}@example.test`;
  testEmails.push(firstEmail, secondEmail);

  const registered = await post("/api/auth/register", {
    nome: "API Test",
    email: firstEmail,
    password: "password-test-123",
  });
  assert.equal(registered.status, 201);
  const registrationCookie = cookieFrom(registered);
  assert.match(registered.headers.get("set-cookie") ?? "", /httponly/i);
  const registrationBody = await registered.json() as { accessToken: string; user: { id: string } };
  assert.ok(registrationBody.accessToken);
  assert.ok(registrationBody.user.id);
  assert.equal("passwordHash" in registrationBody.user, false);

  const openApi = await fetch(`${baseUrl}/api-docs/openapi.json`);
  assert.equal(openApi.status, 200);
  const openApiBody = await openApi.json() as { paths: Record<string, unknown> };
  assert.ok("/api/auth/refresh" in openApiBody.paths);
  assert.ok("/api/auth/password-reset/request" in openApiBody.paths);
  assert.ok("/api/auth/password-reset/complete" in openApiBody.paths);
  assert.ok("/api/subscriptions/{id}" in openApiBody.paths);
  const docsUi = await fetch(`${baseUrl}/api-docs`);
  assert.equal(docsUi.status, 200);

  const unauthorized = await fetch(`${baseUrl}/api/subscriptions`);
  assert.equal(unauthorized.status, 401);

  const loggedIn = await post("/api/auth/login", {
    email: firstEmail,
    password: "password-test-123",
  });
  assert.equal(loggedIn.status, 200);
  const firstCookie = cookieFrom(loggedIn);
  const loginBody = await loggedIn.json() as { accessToken: string };
  assert.ok(loginBody.accessToken);

  const me = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Authorization: `Bearer ${loginBody.accessToken}` },
  });
  assert.equal(me.status, 200);

  const secondRegistered = await post("/api/auth/register", {
    nome: "Outro usuário",
    email: secondEmail,
    password: "password-test-456",
  });
  assert.equal(secondRegistered.status, 201);
  const secondBody = await secondRegistered.json() as { accessToken: string };

  const createdSubscription = await fetch(`${baseUrl}/api/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loginBody.accessToken}`,
    },
    body: JSON.stringify({
      name: "Teste de propriedade",
      category: "Streaming",
      value: 10,
      period: "Mensal",
      nextCharge: "2026-12-01",
      paymentMethod: "Cartão de crédito",
      status: "Ativa",
      color: "#123456",
      icon: "TV",
      history: [],
    }),
  });
  assert.equal(createdSubscription.status, 201);
  const subscription = await createdSubscription.json() as { id: string };

  const otherUserRead = await fetch(`${baseUrl}/api/subscriptions/${subscription.id}`, {
    headers: { Authorization: `Bearer ${secondBody.accessToken}` },
  });
  assert.equal(otherUserRead.status, 404);

  const refreshResponse = await post("/api/auth/refresh", undefined, firstCookie);
  assert.equal(refreshResponse.status, 200);
  const rotatedCookie = cookieFrom(refreshResponse);
  const refreshedBody = await refreshResponse.json() as { accessToken: string };
  assert.ok(refreshedBody.accessToken);

  const reusedRefreshToken = await post("/api/auth/refresh", undefined, firstCookie);
  assert.equal(reusedRefreshToken.status, 401);

  const logoutResponse = await post("/api/auth/logout", undefined, rotatedCookie);
  assert.equal(logoutResponse.status, 204);
  const refreshAfterLogout = await post("/api/auth/refresh", undefined, rotatedCookie);
  assert.equal(refreshAfterLogout.status, 401);

  const cleanupRegistrationSession = await post("/api/auth/logout", undefined, registrationCookie);
  assert.equal(cleanupRegistrationSession.status, 204);

  const activeResetSession = await post("/api/auth/login", {
    email: firstEmail,
    password: "password-test-123",
  });
  assert.equal(activeResetSession.status, 200);
  const activeResetCookie = cookieFrom(activeResetSession);

  const rawResetToken = randomBytes(32).toString("base64url");
  const resetTokenHash = createHash("sha256").update(rawResetToken).digest("hex");
  await repositories.passwordResets.create(
    registrationBody.user.id,
    resetTokenHash,
    new Date(Date.now() + 60_000),
  );

  const completedReset = await post("/api/auth/password-reset/complete", {
    token: rawResetToken,
    password: "new-password-123",
  });
  assert.equal(completedReset.status, 200);

  const reusedResetToken = await post("/api/auth/password-reset/complete", {
    token: rawResetToken,
    password: "another-password-123",
  });
  assert.equal(reusedResetToken.status, 400);

  const revokedResetSession = await post("/api/auth/refresh", undefined, activeResetCookie);
  assert.equal(revokedResetSession.status, 401);
  const revokedAccessToken = await fetch(`${baseUrl}/api/subscriptions`, {
    headers: { Authorization: `Bearer ${loginBody.accessToken}` },
  });
  assert.equal(revokedAccessToken.status, 401);

  const loginWithOldPassword = await post("/api/auth/login", {
    email: firstEmail,
    password: "password-test-123",
  });
  assert.equal(loginWithOldPassword.status, 401);

  const loginWithNewPassword = await post("/api/auth/login", {
    email: firstEmail,
    password: "new-password-123",
  });
  assert.equal(loginWithNewPassword.status, 200);
  const newPasswordSession = cookieFrom(loginWithNewPassword);
  await post("/api/auth/logout", undefined, newPasswordSession);
});
