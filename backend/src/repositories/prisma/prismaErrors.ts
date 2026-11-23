import { Prisma } from "@prisma/client";

// Códigos de erro do Prisma que as regras de negócio tratam. Ficam aqui
// dentro da implementação Prisma: quem chama o repositório recebe um
// AppError ou um null, e nunca precisa conhecer códigos do Prisma.
function hasCode(error: unknown, code: string): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}

/** P2002: violação de restrição única (ex.: e-mail já cadastrado). */
export const isUniqueViolation = (error: unknown) => hasCode(error, "P2002");

/** P2025: update/delete em um registro que não existe (mais). */
export const isRecordNotFound = (error: unknown) => hasCode(error, "P2025");
