import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "./env";

export interface AccessTokenPayload {
  userId: string;
  tokenUse: "access";
  authVersion: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenUse: "refresh";
  jti: string;
}

export function signAccessToken(userId: string, authVersion = 0): string {
  return jwt.sign({ userId, tokenUse: "access", authVersion }, env.jwtSecret, {
    expiresIn: env.jwtAccessTokenTtlSeconds,
    algorithm: "HS256",
  });
}

export function signRefreshToken(userId: string) {
  const jti = randomUUID();
  const expiresAt = new Date(Date.now() + env.jwtRefreshTokenTtlSeconds * 1000);
  const token = jwt.sign({ userId, tokenUse: "refresh" }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshTokenTtlSeconds,
    jwtid: jti,
    algorithm: "HS256",
  });

  return { token, jti, expiresAt };
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const payload = jwt.verify(token, env.jwtRefreshSecret, {
      algorithms: ["HS256"],
    });
    if (
      typeof payload === "string" ||
      typeof payload.userId !== "string" ||
      payload.tokenUse !== "refresh" ||
      typeof payload.jti !== "string"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      tokenUse: "refresh",
      jti: payload.jti,
    };
  } catch {
    return null;
  }
}

// A validação do token de acesso é feita pelo Passport (lib/passport.ts).
