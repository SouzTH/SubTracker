// Lê e valida as variáveis de ambiente uma única vez, na inicialização.
//
// Por quê: se o JWT_SECRET estiver faltando, é muito melhor o servidor
// recusar iniciar com uma mensagem clara do que começar a rodar e falhar
// de forma confusa na primeira tentativa de login.

import { config } from "dotenv";
import { createHmac } from "node:crypto";

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

function positiveInteger(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined) {
    return fallback;
  }

  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Variável de ambiente ${name} precisa ser um inteiro positivo.`);
  }
  return value;
}

const jwtSecret = required("JWT_SECRET");

export const env = {
  // Qual implementação de repositório usar (ver src/repositories/index.ts).
  dbDriver: process.env.DB_DRIVER ?? "prisma",
  port: Number(process.env.PORT ?? 3001),
  jwtSecret,
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET ??
    createHmac("sha256", jwtSecret).update("subtracker:refresh:v1").digest("hex"),
  jwtAccessTokenTtlSeconds: positiveInteger("JWT_ACCESS_TOKEN_TTL_SECONDS", 60 * 60),
  jwtRefreshTokenTtlSeconds: positiveInteger(
    "JWT_REFRESH_TOKEN_TTL_SECONDS",
    7 * 24 * 60 * 60,
  ),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  isProduction: process.env.NODE_ENV === "production",
  enableDemoPasswordReset:
    (process.env.ENABLE_DEMO_PASSWORD_RESET ?? "false").trim().toLowerCase() === "true",
};
