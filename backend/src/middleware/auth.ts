import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { AppError } from "../utils/AppError";

// Estende o tipo Request do Express para incluir o usuário autenticado,
// preenchido por este middleware depois de validar o token.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Exige um header "Authorization: Bearer <token>" válido. Em caso de
 * sucesso, popula `req.userId` para as rotas usarem. Qualquer rota que
 * leia ou altere dados de um usuário deve passar por este middleware —
 * é o que garante o isolamento entre contas (equivalente ao filtro por
 * `userId` que o frontend já fazia manualmente contra o json-server).
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "Token de autenticação ausente." });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado. Faça login novamente." });
  }
}

/**
 * Lê o id do usuário autenticado dentro de um controller. Só funciona em
 * rotas protegidas por `requireAuth`; se for chamado numa rota que esqueceu
 * o middleware, falha com 401 em vez de seguir com um id indefinido.
 */
export function getUserId(req: Request): string {
  if (!req.userId) {
    throw new AppError("Não autenticado.", 401);
  }
  return req.userId;
}
