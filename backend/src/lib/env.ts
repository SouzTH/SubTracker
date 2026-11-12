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

function booleanValue(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined) {
    return fallback;
  }
  if (raw.trim().toLowerCase() === "true") {
    return true;
  }
  if (raw.trim().toLowerCase() === "false") {
    return false;
  }
  throw new Error(`Variável de ambiente ${name} precisa ser "true" ou "false".`);
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
  smtpHost: process.env.SMTP_HOST?.trim(),
  smtpPort: positiveInteger("SMTP_PORT", 587),
  smtpSecure: booleanValue("SMTP_SECURE", false),
  smtpUser: process.env.SMTP_USER?.trim(),
  smtpPassword: process.env.SMTP_PASSWORD,
  passwordResetEmailFrom: process.env.PASSWORD_RESET_EMAIL_FROM?.trim(),
};
