# @subtracker/shared

Pacote local com o que o **frontend** e o **backend** precisam concordar:
os schemas de validação (Zod) e as constantes de domínio (categorias,
periodicidades, metas padrão, tamanho mínimo da senha).

É o mesmo passo que o professor mostra na aula 10: a pasta de validações
vira um pacote npm local, e os dois lados importam exatamente a mesma regra.
Sem isso as regras acabam em duas cópias que divergem — aqui já tinham
divergido (senha mínima de 4 caracteres no formulário, 6 na API).

## O que exporta

| Arquivo | Conteúdo |
|---|---|
| `src/constants.ts` | `CATEGORY_VALUES`, `PERIOD_VALUES`, `DEFAULT_BUDGETS`, `PASSWORD_MIN_LENGTH` e os tipos `Category`, `Period`, `CategoryBudgets`... |
| `src/auth.ts` | `loginSchema`, `registerSchema` |
| `src/subscription.ts` | `subscriptionSchema` (campos do formulário), `createSubscriptionSchema` (corpo completo do POST), `updateSubscriptionSchema` (PATCH parcial) |
| `src/profile.ts` | `personalInfoSchema`, `budgetsSchema`, `updateProfileSchema`, `updateBudgetsSchema` |

Os schemas de API são **derivados** dos de formulário (`.extend()` e
`.partial()`), então uma regra muda em um lugar só.

## Sem build

O pacote é TypeScript puro (`"main": "src/index.ts"`): não existe passo de
compilação. Quem importa precisa de uma ferramenta que leia `.ts` — o
backend usa `tsx`, o frontend usa o Vite.

## Como é instalado

Quem consome declara `"@subtracker/shared": "file:../shared"` no
`package.json`; o npm cria um link em `node_modules`. O `backend` já está
assim, e o seu `postinstall` roda `npm install` aqui dentro também (o `zod`
do pacote precisa estar instalado nesta pasta). Para rodar à mão:

```bash
cd shared
npm install
npm run typecheck
```

## Ligar o frontend a este pacote (próximo passo, ainda não feito)

Não foi feito agora de propósito, para não mexer no frontend que já está
funcionando e será avaliado. Foi conferido que os schemas atuais do
frontend (`login`, `register`, `subscription`, `personalInfo`, `budgets`)
se comportam de forma idêntica aos daqui — mesmas mensagens e mesmos
campos, em entradas válidas e inválidas — então a troca não muda nada para
o usuário. Passos:

1. Em `frontend/package.json`, adicione em `dependencies`:
   `"@subtracker/shared": "file:../shared"` e rode `npm install`.
2. Em `frontend/vite.config.ts`, permita o Vite a servir a pasta vizinha e
   evite duas cópias do Zod:
   ```ts
   export default defineConfig({
     // ...o que já existe
     resolve: { dedupe: ["zod"] },
     server: { fs: { allow: [".."] } },
   });
   ```
3. Em `frontend/src/schemas/auth.ts`, `subscription.ts` e `profile.ts`,
   troque as definições por re-exportações, mantendo os nomes que as telas
   já importam. Exemplo para `auth.ts` (os schemas de "esqueci a senha"
   continuam locais, pois só existem no frontend):
   ```ts
   import { z } from "zod";
   import type { LoginInput, RegisterInput } from "@subtracker/shared";

   export { loginSchema, registerSchema } from "@subtracker/shared";
   export type LoginFormValues = LoginInput;
   export type RegisterFormValues = RegisterInput;

   // forgotEmailSchema e resetPasswordSchema ficam aqui, como já estão
   ```
4. Teste login, cadastro, nova assinatura e perfil na tela.
