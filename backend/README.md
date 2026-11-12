# SubTracker API — base do backend real

API REST do SubTracker: **Express + TypeScript + Prisma + PostgreSQL**, com
autenticação JWT e validação Zod **compartilhada com o frontend**
(`../shared`).

O frontend usa esta API Express com PostgreSQL. O login devolve um JWT de
acesso de uma hora; o refresh token é rotacionado pelo servidor e mantido
em cookie `HttpOnly` por até sete dias. Assinaturas e orçamentos são sempre
isolados pelo ID do usuário autenticado.

## Alinhamento com a aula 10 (MongoDB e Prisma no lugar do JSON)

Montado a partir do título, capítulos e resumo da aula.

| O que a aula mostra | Onde está no projeto |
|---|---|
| Parar de gravar JSON em disco e delegar a persistência a um banco | PostgreSQL, em `docker-compose.yml` |
| PostgreSQL rodando em container Docker | `npm run db:up` |
| Prisma: `schema.prisma` mapeando modelos e chaves estrangeiras | `prisma/schema.prisma` |
| Migrations (SQL versionado) | `npm run prisma:migrate` → `prisma/migrations/` |
| Zod no lugar da validação manual, o mesmo schema no front e no back, via pacote npm local | `../shared` (`@subtracker/shared`); os controllers chamam `.parse()` |
| Padrão DAO/Repository: interface + implementação, escolhida por variável de ambiente | `src/repositories/types.ts` (interfaces), `src/repositories/prisma/` (implementação), `src/repositories/index.ts` + `DB_DRIVER` no `.env` |
| Converter o formato do banco para o que o front espera (`_id` vira `id`) | `src/repositories/prisma/mappers.ts` |
| Relacionamento 1:N carregado junto (populate / JOIN) | assinatura + histórico de pagamentos (`WITH_HISTORY`) |
| Testar a validação isolada com requisições erradas; conferir o banco por `psql` | veja "Testando" abaixo |
| MongoDB + Mongoose | **não implementado.** O último capítulo da aula é "Escolha um dos dois bancos"; aqui foi escolhido o Postgres. A camada de repositório é o ponto onde um `src/repositories/mongoose/` entraria, sem tocar em controllers nem rotas |

## Arquitetura

```
requisição → routes → middleware (requireAuth) → controllers → repositories → banco
                                                     │
                                            Zod (do shared) valida
                                            o corpo antes de tudo
```

- **controllers** conhecem só as *interfaces* de `src/repositories/types.ts`.
  Nenhum tipo do Prisma aparece neles.
- **repositories/prisma** é a implementação. Ela também traduz erros do
  banco (e-mail duplicado vira `AppError 409`), então o `errorHandler` não
  precisa saber qual banco está por trás.
- Isolamento entre contas: todo método de assinatura recebe o `userId` e
  filtra por ele. Pelo json-server qualquer um lia os dados de qualquer
  usuário trocando o número na URL; aqui o servidor descobre o usuário
  pelo token.

## Como rodar

Pré-requisitos: **Node 20+** e **Docker Desktop** aberto.

```bash
cd backend
npm install            # instala o backend e também o ../shared (postinstall)

# crie o .env a partir do exemplo
cp .env.example .env              # Git Bash / Linux / macOS
# Copy-Item .env.example .env     # PowerShell
# confirme a DATABASE_URL para localhost:5433 e troque o JWT_SECRET por uma string longa e aleatória

npm run db:up                     # sobe o PostgreSQL (Docker)
npx prisma migrate deploy         # aplica as migrações versionadas
npx prisma generate               # gera o cliente Prisma
npm run seed                      # cria o usuário de teste
npm run dev                       # API em http://localhost:3001
```

O PostgreSQL do Compose escuta na porta `5432` dentro do contêiner e é publicado
em `localhost:5433` para evitar conflito com instalações locais do PostgreSQL.
Use o usuário e a senha configurados no Compose (`subtracker`) na `DATABASE_URL`.

Usuário criado pelo seed: `teste@subtracker.com` / `123456`.

Outros comandos: `npm run typecheck` (confere os tipos), `npm run prisma:studio`
(interface visual do banco), `npm run db:down` (para o Postgres; os dados
ficam no volume Docker).

Documentação interativa OpenAPI: <http://localhost:3001/api-docs>.
O documento JSON fica em <http://localhost:3001/api-docs/openapi.json>.

### Configurar envio de recuperação pelo Brevo

1. Crie uma conta no <https://www.brevo.com/> e verifique um remetente
   autorizado para envio (endereço ou domínio, conforme a configuração da conta).
2. Em <https://app.brevo.com/settings/keys/smtp>, copie o login SMTP e gere uma
   **chave SMTP**. Não use uma chave de API.
3. No arquivo local `backend/.env` (não no `.env.example`), configure:

   ```dotenv
   SMTP_HOST="smtp-relay.brevo.com"
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER="login-smtp-do-brevo"
   SMTP_PASSWORD="chave-smtp-do-brevo"
   PASSWORD_RESET_EMAIL_FROM="remetente-verificado@seudominio.com"
   ```

   `SMTP_USER` é o login SMTP mostrado no painel; `SMTP_PASSWORD` é a chave
   SMTP gerada ali; `PASSWORD_RESET_EMAIL_FROM` precisa ser um remetente
   verificado no Brevo. Não compartilhe nem versione a chave SMTP.
4. Reinicie o backend (`Ctrl+C` no terminal e `npm run dev` novamente).
5. Solicite a recuperação com o e-mail cadastrado na conta SubTracker e confira
   a caixa de entrada e a pasta de spam desse endereço.

Para renovar uma sessão, o frontend envia o refresh cookie automaticamente
quando uma rota protegida retorna 401. O refresh token é de uso único e o
servidor o troca por um novo cookie e access token.

## Testes automatizados

Com o PostgreSQL ativo e as migrações aplicadas, rode `npm test` na pasta
`backend`. A suíte contém testes unitários de tokens e testes HTTP de API que
verificam login, renovação/rotação, logout, rotas protegidas e isolamento das
assinaturas entre usuários. Os testes de API criam contas temporárias e as
removem ao terminar.

## Rotas

Rotas de perfil, assinaturas e orçamentos exigem autenticação Bearer. Saúde,
documentação, cadastro e login são públicos; renovação e logout usam o cookie
HttpOnly de refresh.

```
GET    /health

POST   /api/auth/register          { nome, email, password } → { accessToken, user }
POST   /api/auth/login             { email, password }       → { accessToken, user }
POST   /api/auth/refresh            cookie HttpOnly           → { accessToken }
POST   /api/auth/logout             cookie HttpOnly           → 204
POST   /api/auth/password-reset/request  { email }            → resposta genérica
POST   /api/auth/password-reset/complete { token, password }  → senha redefinida
GET    /api/auth/me
PATCH  /api/auth/me                { nome?, telefone?, paymentMethod? }

GET    /api/subscriptions
GET    /api/subscriptions/:id
POST   /api/subscriptions
PATCH  /api/subscriptions/:id      (parcial)
DELETE /api/subscriptions/:id      → 204

GET    /api/budgets                → { Streaming: 120, Trabalho: 350, ... }
PUT    /api/budgets                { "Streaming": 150 }  (parcial)
```

Erros voltam como `{ "error": "mensagem" }`; erros de validação trazem
também `"details": [{ "campo": "password", "mensagem": "..." }]`.

## Exemplos manuais

```bash
# 1) sobe?
curl -s http://localhost:3001/health

# 2) login → copie o "accessToken" da resposta
curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@subtracker.com","password":"123456"}'

# 3) rota protegida
curl -s http://localhost:3001/api/subscriptions -H "Authorization: Bearer COLE_O_TOKEN"

# 4) validação com dado propositalmente errado (senha curta) → 400 com "details"
curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana","email":"ana@x.com","password":"abc"}'
```

Insomnia ou Postman funcionam igual. Para conferir o que de fato foi gravado,
direto no Postgres (como a aula faz com `psql`):

```bash
docker exec -it subtracker-postgres psql -U subtracker -d subtracker \
  -c "select email from users;" -c "select count(*) from subscriptions;"
```

### Problemas comuns

| Sintoma | Causa / solução |
|---|---|
| `Cannot find module 'zod'` vindo de `shared/` | o `npm install` de dentro de `shared/` não rodou: `cd ../shared && npm install` |
| `@prisma/client did not initialize yet` | `npx prisma generate` |
| `Can't reach database server at localhost:5433` | Docker fechado ou `npm run db:up` não rodou; confira se a `DATABASE_URL` usa `localhost:5433` e o usuário/senha do Compose |
| `Variável de ambiente JWT_SECRET não foi definida` | falta criar o `.env` |
| CORS bloqueando o frontend | `FRONTEND_URL` no `.env` precisa ser a origem exata do Vite (`http://localhost:5173`) |

## Notas de segurança

- O refresh token é `HttpOnly`, tem chave de assinatura separada derivada do
  `JWT_SECRET`, é armazenado no banco por identificador e só pode ser usado
  uma vez. O logout e a redefinição de senha revogam sessões.
- A recuperação envia um token aleatório por SMTP, guarda somente seu hash no
  banco e invalida o token após o uso. O link expira em 20 minutos; os endpoints
  têm limite de tentativas por IP. Ao redefinir a senha, refresh tokens e
  access tokens anteriores são invalidados.
- Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`,
  `SMTP_PASSWORD` e `PASSWORD_RESET_EMAIL_FROM` no `.env` para habilitar o
  envio. O usuário SMTP deve estar autorizado a enviar usando o endereço
  configurado em `PASSWORD_RESET_EMAIL_FROM`.
- Em produção, configure `JWT_SECRET` com um valor aleatório forte, defina
  `JWT_REFRESH_SECRET` com outra chave forte, sirva a aplicação por HTTPS e
  use `NODE_ENV=production` para habilitar o atributo `Secure` do cookie.
- `start` usa `tsx` (o `shared` é TypeScript sem build); para produção
  valeria empacotar o `shared` ou usar um bundler.
