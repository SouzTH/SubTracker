import type { CookieOptions, Response } from "express";
import { env } from "./env";

export const REFRESH_COOKIE_NAME = "subtracker_refresh";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "lax",
  path: "/api/auth",
};

export function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    ...cookieOptions,
    maxAge: env.jwtRefreshTokenTtlSeconds * 1000,
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions);
}
