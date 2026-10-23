import { loginSchema, registerSchema, updateProfileSchema } from "@subtracker/shared";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { signToken } from "../lib/jwt";
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

// POST /api/auth/register
export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);
  const email = normalizeEmail(data.email);

  if (await repositories.users.findByEmail(email)) {
    throw new AppError("Este e-mail já está cadastrado.", 409);
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const user = await repositories.users.create({ nome: data.nome, email, passwordHash });

  res.status(201).json({ token: signToken({ userId: user.id }), user: toPublicUser(user) });
}

// POST /api/auth/login
export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);

  const user = await repositories.users.findByEmail(normalizeEmail(data.email));
  const passwordMatches = await bcrypt.compare(data.password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !passwordMatches) {
    throw new AppError("E-mail ou senha incorretos.", 401);
  }

  res.json({ token: signToken({ userId: user.id }), user: toPublicUser(user) });
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
