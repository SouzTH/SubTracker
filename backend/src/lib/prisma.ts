// Instância única do Prisma Client, compartilhada por toda a aplicação.
//
// Criar um "new PrismaClient()" em cada arquivo abriria uma conexão nova
// a cada import, esgotando rapidamente o pool de conexões do banco. Este
// padrão (um client, exportado uma vez) é a recomendação oficial do Prisma
// para aplicações Node de processo único como esta.

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
