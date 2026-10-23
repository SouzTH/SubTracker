import type { NextFunction, Request, Response } from "express";
import type { ZodError } from "zod";
import { AppError } from "../utils/AppError";

// Os schemas vêm do pacote @subtracker/shared, que carrega a sua própria
// cópia do Zod. Por isso `err instanceof ZodError` (que compara com a cópia
// do backend) não serve; reconhecemos o erro pelo nome e pela forma.
function isZodError(err: unknown): err is ZodError {
  return err instanceof Error && err.name === "ZodError" && Array.isArray((err as ZodError).issues);
}

// Middleware de erro centralizado: toda rota usa `asyncHandler`, que
// encaminha qualquer exceção para aqui via `next(err)`. Assim nenhum
// controller precisa repetir try/catch — cada um só lança o erro
// (AppError, ou deixa o Zod lançar o dele) e este é o único lugar que
// decide o status HTTP e o formato da resposta de erro.
//
// Erros específicos do banco (ex.: e-mail duplicado) NÃO são tratados aqui:
// o repositório os traduz em AppError, e assim esta camada continua sem
// saber qual banco está por trás.
//
// O parâmetro `_next` precisa existir (mesmo sem uso) para o Express
// reconhecer esta função como error handler pela sua assinatura de 4 argumentos.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (isZodError(err)) {
    res.status(400).json({
      error: "Dados inválidos.",
      details: err.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensagem: issue.message,
      })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error("Erro não tratado:", err);
  res.status(500).json({ error: "Erro interno do servidor." });
}
