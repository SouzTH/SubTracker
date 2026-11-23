import { NextFunction, Request, RequestHandler, Response } from "express";

// Express não entende "async function" direto: se um handler async lançar,
// a exceção vira uma Promise rejeitada que o Express não captura sozinho
// (em versões 4.x), e a requisição trava sem resposta. Este wrapper garante
// que qualquer erro (throw de AppError, erro do Prisma, erro do Zod) chegue
// até o errorHandler central via next(err).
type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export function asyncHandler(fn: AsyncRouteHandler): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
