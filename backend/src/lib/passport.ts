// Configuração do Passport com a estratégia JWT (passport-jwt).
//
// O Passport lê o header "Authorization: Bearer <token>", confere assinatura
// e validade com o JWT_SECRET e, se estiver tudo certo, chama `verify` com o
// conteúdo (payload) do token. Quem ASSINA o token continua sendo
// `lib/jwt.ts` (login/cadastro); o Passport só cuida de VALIDAR.

import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { repositories } from "../repositories";
import { env } from "./env";
import type { AccessTokenPayload } from "./jwt";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.jwtSecret,
    },
    async (payload: AccessTokenPayload, done) => {
      try {
        if (payload.tokenUse !== "access") {
          done(null, false);
          return;
        }

        // Token válido mas de uma conta que foi apagada → não autentica.
        const user = await repositories.users.findById(payload.userId);
        done(null, user ? { userId: user.id } : false);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

export default passport;
