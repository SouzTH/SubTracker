# SubTracker API — base do backend real

API REST do SubTracker: **Express + TypeScript + Prisma + PostgreSQL**, com
autenticação JWT e validação Zod **compartilhada com o frontend**
(`../shared`).

> **Importante:** esta pasta é a base da etapa *seguinte* à AV1. O frontend
> continua falando só com o json-server (`frontend/src/lib/api.ts`), como a
> AV1 pede (frontend + json-server, sem backend real). Nada aqui é
> chamado pelo frontend ainda — foi proposital, para não arriscar o que já
> funciona e será avaliado.

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
# edite o .env e troque o JWT_SECRET por uma string longa e aleatória

npm run db:up                     # sobe o PostgreSQL (Docker)
npx prisma migrate dev --name init   # cria as tabelas (gera prisma/migrations/)
npm run seed                      # cria o usuário de teste
npm run dev                       # API em http://localhost:3001
```

Usuário criado pelo seed: `teste@subtracker.com` / `123456`.

Outros comandos: `npm run typecheck` (confere os tipos), `npm run prisma:studio`
(interface visual do banco), `npm run db:down` (para o Postgres; os dados
ficam no volume Docker).

## Rotas

Tudo exige `Authorization: Bearer <token>`, exceto `/health`,
`/api/auth/register` e `/api/auth/login`.

```
GET    /health

POST   /api/auth/register          { nome, email, password } → { token, user }
POST   /api/auth/login             { email, password }       → { token, user }
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

## Testando

```bash
# 1) sobe?
curl -s http://localhost:3001/health

# 2) login → copie o "token" da resposta
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

## O que foi e o que NÃO foi verificado

Este código foi escrito num ambiente **sem acesso ao npm**, então o primeiro
`npm install`, o `prisma migrate` e o Docker precisam ser feitos por você.
O que foi conferido lá:

- **Tipos:** `tsc` limpo sobre o `shared` e o backend, com os tipos reais do
  Zod; Express, Prisma, JWT e bcrypt entraram só como declarações mínimas
  escritas à mão.
- **Comportamento (30 testes):** schemas do `shared` com Zod real, o
  `shared` ligado por link no `node_modules` como o npm faz com `file:`,
  controllers, `requireAuth`, `errorHandler` e as classes de repositório
  Prisma — estas últimas contra um cliente Prisma falso, para checar a
  lógica (filtro por `userId`, PATCH parcial, tradução de erros). Os
  testes não foram incluídos no repositório.
- **Não verificado:** o Prisma contra um Postgres de verdade (incluindo a
  query de `WITH_HISTORY` e o `upsert` por chave composta), `bcryptjs` e
  `jsonwebtoken` reais, e o Express subindo. Se algo falhar, o primeiro
  erro costuma ser de ambiente (veja abaixo).

### Problemas comuns

| Sintoma | Causa / solução |
|---|---|
| `Cannot find module 'zod'` vindo de `shared/` | o `npm install` de dentro de `shared/` não rodou: `cd ../shared && npm install` |
| `@prisma/client did not initialize yet` | `npx prisma generate` |
| `Can't reach database server at localhost:5432` | Docker fechado ou `npm run db:up` não rodou; ou já existe outro Postgres na porta 5432 (troque `5432:5432` no `docker-compose.yml` e a porta no `DATABASE_URL`) |
| `Variável de ambiente JWT_SECRET não foi definida` | falta criar o `.env` |
| CORS bloqueando o frontend | `FRONTEND_URL` no `.env` precisa ser a origem exata do Vite (`http://localhost:5173`) |

## Decisões e próximos passos

- **Senha:** o mínimo é o mesmo do formulário atual (4 caracteres), definido
  em `shared/src/constants.ts` (`PASSWORD_MIN_LENGTH`) — endurecer é mudar um número.
- **Contrato em aberto:** na aula, o frontend não muda porque o contrato
  (método, caminho, corpo, id) é o mesmo nos dois bancos. Aqui o contrato
  difere do json-server de propósito (`/api/subscriptions`, token em vez de
  `?userId=`). Se for preferível o frontend não mudar nada, dá para expor
  também `/subs` e `/users` com o formato antigo — ao custo de perder a
  proteção por token.
- **Ligar o frontend** ao `shared` e depois a esta API: passos em `../shared/README.md`.
- **Esqueci minha senha de verdade** (token por e-mail) precisa de um
  provedor de e-mail e uma tabela de tokens; fora desta base.
- **Testes automatizados** dentro do repositório (ex.: Vitest).
- `start` usa `tsx` (o `shared` é TypeScript sem build); para produção
  de verdade valeria empacotar o `shared` ou usar um bundler.
