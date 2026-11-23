import type { NextFunction, Request, Response } from "express";
import passport from "../lib/passport";
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
 * Exige um header "Authorization: Bearer <token>" válido, validado pelo
 * Passport (estratégia JWT, ver lib/passport.ts). Em caso de sucesso, popula
 * `req.userId` para as rotas usarem. Qualquer rota que leia ou altere dados
 * de um usuário deve passar por este middleware — é o que garante o
 * isolamento entre contas.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Callback próprio para manter o formato de erro { error } da API
  // (o padrão do Passport responderia só "Unauthorized").
  passport.authenticate(
    "jwt",
    { session: false },
    (err: unknown, user: { userId: string } | false, info?: Error) => {
      if (err) {
        next(err);
        return;
      }
      if (!user) {
        const ausente = info?.message === "No auth token";
        res.status(401).json({
          error: ausente
            ? "Token de autenticação ausente."
            : "Token inválido ou expirado. Faça login novamente.",
        });
        return;
      }
      req.userId = user.userId;
      next();
    },
  )(req, res, next);
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
