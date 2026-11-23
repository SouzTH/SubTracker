import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../src/lib/jwt";
import { env } from "../src/lib/env";

test("refresh JWTs are unique, verifiable, and distinct from access JWTs", () => {
  const first = signRefreshToken("user-1");
  const second = signRefreshToken("user-1");

  assert.notEqual(first.jti, second.jti);
  assert.ok(first.expiresAt.getTime() > Date.now());
  assert.deepEqual(verifyRefreshToken(first.token), {
    userId: "user-1",
    tokenUse: "refresh",
    jti: first.jti,
  });
  assert.equal(verifyRefreshToken(signAccessToken("user-1")), null);

  const accessPayload = jwt.verify(signAccessToken("user-1"), env.jwtSecret);
  assert.equal(typeof accessPayload, "object");
  assert.equal((accessPayload as jwt.JwtPayload).tokenUse, "access");
  assert.equal((accessPayload as jwt.JwtPayload).authVersion, 0);
});
