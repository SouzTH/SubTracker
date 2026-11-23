import {
  forgotEmailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "@subtracker/shared";
import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import type { Request, Response } from "express";
import { env } from "../lib/env";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { getPasswordResetTransport, sendPasswordResetEmail } from "../lib/passwordResetEmail";
import { clearRefreshCookie, REFRESH_COOKIE_NAME, setRefreshCookie } from "../lib/refreshCookie";
import { getUserId } from "../middleware/auth";
import { repositories } from "../repositories";
import { AppError } from "../utils/AppError";
import { toPublicUser } from "../utils/serializers";

const SALT_ROUNDS = 10;

// Hash descartável, usado só para que o login de um e-mail inexistente
// gaste o mesmo tempo de bcrypt que o de um e-mail existente — assim o
// tempo de resposta não revela quais e-mails estão cadastrados.
const DUMMY_HASH = bcrypt.hashSync("senha-que-nao-existe", SALT_ROUNDS);

const normalizeEmail = (email: string) => email.trim().toLowerCase();

async function issueTokens(userId: string, authVersion: number, res: Response) {
  const refresh = signRefreshToken(userId);
  await repositories.refreshSessions.create(refresh.jti, userId, refresh.expiresAt);
  setRefreshCookie(res, refresh.token);
  return signAccessToken(userId, authVersion);
}

// POST /api/auth/register
export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);
  const email = normalizeEmail(data.email);

  if (await repositories.users.findByEmail(email)) {
    throw new AppError("Este e-mail já está cadastrado.", 409);
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const user = await repositories.users.create({
    nome: data.nome,
    email,
    passwordHash,
  });
  const accessToken = await issueTokens(user.id, user.authVersion, res);

  res.status(201).json({
    accessToken,
    user: toPublicUser(user),
  });
}

// POST /api/auth/login
export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);

  const user = await repositories.users.findByEmail(
    normalizeEmail(data.email)
  );
  const passwordMatches = await bcrypt.compare(
    data.password,
    user?.passwordHash ?? DUMMY_HASH
  );

  if (!user || !passwordMatches) {
    throw new AppError("E-mail ou senha incorretos.", 401);
  }

  const accessToken = await issueTokens(user.id, user.authVersion, res);
  res.json({
    accessToken,
    user: toPublicUser(user),
  });
}

// POST /api/auth/refresh
export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  const payload = typeof token === "string" ? verifyRefreshToken(token) : null;

  if (!payload || !(await repositories.refreshSessions.consume(
    payload.jti,
    payload.userId,
    new Date(),
  ))) {
    clearRefreshCookie(res);
    throw new AppError("Sessão expirada. Faça login novamente.", 401);
  }

  const user = await repositories.users.findById(payload.userId);
  if (!user) {
    clearRefreshCookie(res);
    throw new AppError("Sessão expirada. Faça login novamente.", 401);
  }

  const accessToken = await issueTokens(user.id, user.authVersion, res);
  res.json({ accessToken });
}

// POST /api/auth/logout
export async function logout(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  const payload = typeof token === "string" ? verifyRefreshToken(token) : null;
  if (payload) {
    await repositories.refreshSessions.consume(
      payload.jti,
      payload.userId,
      new Date(),
    );
  }

  clearRefreshCookie(res);
  res.status(204).send();
}

// GET /api/auth/me
export async function me(req: Request, res: Response) {
  const user = await repositories.users.findById(getUserId(req));

  if (!user) {
    throw new AppError("Usuário não encontrado.", 404);
  }

  res.json(toPublicUser(user));
}

// PATCH /api/auth/me — tela de Perfil (dados pessoais + forma de pagamento)
export async function updateMe(req: Request, res: Response) {
  const patch = updateProfileSchema.parse(req.body);

  const user = await repositories.users.update(getUserId(req), patch);

  if (!user) {
    throw new AppError("Usuário não encontrado.", 404);
  }

  res.json(toPublicUser(user));
}

const PASSWORD_RESET_TTL_MS = 20 * 60 * 1000;
const PASSWORD_RESET_MIN_RESPONSE_MS = 250;
const PASSWORD_RESET_RESPONSE =
  "Se houver uma conta com esse e-mail, você receberá um link para redefinir a senha.";

// POST /api/auth/password-reset/request
export async function requestPasswordReset(req: Request, res: Response) {
  const startedAt = Date.now();
  const data = forgotEmailSchema.parse(req.body);
  getPasswordResetTransport();
  const email = normalizeEmail(data.email);
  const user = await repositories.users.findByEmail(email);

  if (user) {
    const token = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    await repositories.passwordResets.create(
      user.id,
      tokenHash,
      new Date(Date.now() + PASSWORD_RESET_TTL_MS),
    );

    const resetUrl = new URL("/esqueci-senha", env.frontendUrl);
    resetUrl.searchParams.set("token", token);
    void sendPasswordResetEmail(email, resetUrl.toString()).catch(async (error) => {
      const mailError = error as NodeJS.ErrnoException;
      console.error("Falha ao enviar e-mail de redefinição de senha.", {
        code: mailError.code,
        message: mailError.message,
      });
      try {
        await repositories.passwordResets.delete(tokenHash);
      } catch (cleanupError) {
        const cleanup = cleanupError as NodeJS.ErrnoException;
        console.error("Falha ao invalidar token não enviado.", {
          code: cleanup.code,
          message: cleanup.message,
        });
      }
    });
  }

  const remainingDelay = PASSWORD_RESET_MIN_RESPONSE_MS - (Date.now() - startedAt);
  if (remainingDelay > 0) {
    await new Promise((resolve) => setTimeout(resolve, remainingDelay));
  }
  res.status(202).json({ message: PASSWORD_RESET_RESPONSE });
}

// POST /api/auth/password-reset/complete
export async function resetPassword(req: Request, res: Response) {
  const data = resetPasswordSchema.parse(req.body);
  const tokenHash = createHash("sha256").update(data.token).digest("hex");
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const reset = await repositories.passwordResets.consumeAndResetPassword(
    tokenHash,
    passwordHash,
    new Date(),
  );

  if (!reset) {
    throw new AppError("O link de redefinição é inválido ou expirou.", 400);
  }

  res.json({ ok: true, message: "Senha redefinida. Faça login com a nova senha." });
}