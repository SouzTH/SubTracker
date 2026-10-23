// Escolhe, na inicialização, qual implementação de repositório a aplicação
// usa — lendo DB_DRIVER do .env (mesma ideia da aula, onde uma variável de
// ambiente decide entre Mongoose e Prisma).
//
// Hoje só existe a implementação Prisma/PostgreSQL. Para somar outra (ex.:
// Mongoose), basta criar src/repositories/mongoose/ implementando as
// interfaces de ./types e acrescentar um `case` abaixo: controllers e
// rotas continuam exatamente como estão.

import { env } from "../lib/env";
import { createPrismaRepositories } from "./prisma";
import type { Repositories } from "./types";

function createRepositories(): Repositories {
  switch (env.dbDriver) {
    case "prisma":
      return createPrismaRepositories();
    default:
      throw new Error(`DB_DRIVER "${env.dbDriver}" não é suportado. Valores aceitos: "prisma".`);
  }
}

export const repositories = createRepositories();
