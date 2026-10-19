// Lê e valida as variáveis de ambiente uma única vez, na inicialização.
//
// Por quê: se o JWT_SECRET estiver faltando, é muito melhor o servidor
// recusar iniciar com uma mensagem clara do que começar a rodar e falhar
// de forma confusa na primeira tentativa de login.

import { config } from "dotenv";

config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variável de ambiente ${name} não foi definida. Copie .env.example para .env e preencha os valores.`,
    );
  }
  return value;
}

export const env = {
  // Qual implementação de repositório usar (ver src/repositories/index.ts).
  dbDriver: process.env.DB_DRIVER ?? "prisma",
  port: Number(process.env.PORT ?? 3001),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
};
