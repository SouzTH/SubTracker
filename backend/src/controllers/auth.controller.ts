import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "@subtracker/shared";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { env } from "../lib/env";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
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

async function issueTokens(userId: string, res: Response) {
  const refresh = signRefreshToken(userId);
  await repositories.refreshSessions.create(refresh.jti, userId, refresh.expiresAt);
  setRefreshCookie(res, refresh.token);
  return signAccessToken(userId);
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
  const accessToken = await issueTokens(user.id, res);

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

  const accessToken = await issueTokens(user.id, res);
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

  const accessToken = await issueTokens(user.id, res);
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

// POST /api/auth/reset-password — fluxo demonstrativo para redefinir a senha.
// Requer FLAG ENABLE_DEMO_PASSWORD_RESET="true" no backend.
export async function resetPassword(req: Request, res: Response) {
  if (!env.enableDemoPasswordReset) {
    throw new AppError("A recuperação demonstrativa de senha está desabilitada.", 403);
  }

  const data = resetPasswordSchema.parse(req.body);
  const email = normalizeEmail(data.email);

  const user = await repositories.users.findByEmail(email);
  if (!user) {
    throw new AppError("Não encontramos nenhuma conta com este e-mail.", 404);
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const updated = await repositories.users.resetPassword(
    user.id,
    passwordHash
  );
  if (!updated) {
    throw new AppError("Não foi possível atualizar a senha.", 404);
  }
  await repositories.refreshSessions.revokeAllForUser(user.id);

  res.json({
    ok: true,
    message: "Senha redefinida com sucesso. Esta funcionalidade é demonstrativa.",
  });
}