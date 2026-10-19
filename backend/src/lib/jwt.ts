import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "./env";

export interface TokenPayload {
  userId: string;
}

export function signToken(payload: TokenPayload): string {
  // O .env entrega uma string qualquer ("7d", "12h"...); as versões novas de
  // @types/jsonwebtoken só aceitam um tipo literal específico para isso, daí o cast.
  const expiresIn = env.jwtExpiresIn as SignOptions["expiresIn"];
  return jwt.sign(payload, env.jwtSecret, { expiresIn });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
}
