// Erro "esperado" (regra de negócio), diferente de um bug. Controllers
// lançam isso para dizer exatamente qual status HTTP e mensagem devolver;
// o errorHandler central é quem decide o resto.
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}
