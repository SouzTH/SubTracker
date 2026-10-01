# Manual do SubTracker

Este documento cobre três partes: **instalação** (como colocar o projeto para rodar),
**operação** (como o sistema funciona por dentro, para quem for mantê-lo) e
**uso** (como um usuário final navega pelo app).

---

## 1. Manual de Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior (inclui o `npm`).
- Um navegador atual (Chrome, Edge, Firefox).
- Git, para clonar o repositório.

### Passo a passo

1. **Clone o repositório** e entre na pasta do frontend:

   ```bash
   git clone https://github.com/SouzTH/SubTracker.git
   cd SubTracker/frontend
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

   Isso instala o React, o Vite, o Tailwind CSS, o `react-hook-form`, o `zod`, o
   `@tanstack/react-query` e o `json-server` (todos listados em `package.json`).

3. **Suba os dois servidores em dois terminais separados** (os dois precisam
   ficar rodando ao mesmo tempo):

   ```bash
   # Terminal 1 — API fake (json-server), na porta 3000
   npm run server
   ```

   ```bash
   # Terminal 2 — aplicação React (Vite), na porta 5173
   npm run dev
   ```

4. **Acesse** [http://localhost:5173](http://localhost:5173) no navegador.

5. **Faça login** com uma conta já existente em `db.json` (veja a seção
   "Dados iniciais" abaixo) ou crie uma conta nova pelo link "Cadastre-se".

### Build de produção (opcional)

```bash
npm run build    # gera a pasta frontend/dist
npm run preview  # serve o build gerado, para conferir
```

---

## 2. Manual de Operação

### Arquitetura

O SubTracker é um projeto **só de frontend**. Ele não tem um backend "de
verdade" — em vez disso, usa o [json-server](https://github.com/typicode/json-server),
que transforma o arquivo `frontend/db.json` numa API REST fake (`GET`, `POST`,
`PATCH`, `DELETE`) rodando em `http://localhost:3000`.

```
SubTracker/
├── documentacao/        → documentos de prototipagem, refinamento e este manual
├── teste.csv             → extrato de exemplo para testar a importação
└── frontend/
    ├── db.json           → "banco de dados" usado pelo json-server
    ├── src/
    │   ├── App.tsx        → rotas, layout e estado principal da aplicação
    │   ├── lib/
    │   │   ├── api.ts         → todas as chamadas HTTP ao json-server, centralizadas
    │   │   └── queryClient.ts → configuração do TanStack Query
    │   ├── schemas/       → validações Zod usadas pelos formulários (react-hook-form)
    │   ├── pages/Login/   → telas de login, cadastro e recuperação de senha
    │   └── screens/       → Dashboard, Nova Assinatura, Editar, Detalhes, Relatório,
    │                          Importar Extrato e Perfil
    └── package.json
```

### Tecnologias e por que cada uma está aqui

| Tecnologia | Para que serve neste projeto |
|---|---|
| React + Vite + TypeScript | Base da aplicação (ES6, componentes funcionais) |
| Tailwind CSS | Estilização e responsividade (sem media query manual) |
| `react-hook-form` + `zod` | Controle e validação dos formulários (login, cadastro, nova assinatura, perfil, etc.) |
| `@tanstack/react-query` | Busca, cache e sincronização dos dados com o json-server (substitui `fetch` + `useState` manuais) |
| `json-server` | Simula uma API REST a partir do `db.json` |
| `react-router-dom` | Rotas (`/`, `/cadastro`, `/esqueci-senha`, `/painel`) |

### Dados iniciais

O `db.json` já vem com usuários de teste cadastrados, por exemplo:

| Email | Senha |
|---|---|
| `admin@teste.com` | `1234` |

Para **resetar os dados** para o estado inicial, basta restaurar o `db.json`
a partir do histórico do Git (`git checkout -- frontend/db.json`) — ele é o
único arquivo que muda enquanto o sistema é usado (novas assinaturas, novos
usuários, pagamentos confirmados etc. são gravados nele pelo json-server).

### Problemas comuns

- **"Erro de conexão ao servidor" no login** → o `npm run server` não está
  rodando. Os dois terminais (servidor e frontend) precisam estar abertos ao
  mesmo tempo.
- **Porta 3000 ou 5173 já em uso** → feche outro processo usando a porta, ou
  ajuste a porta no script `server` do `package.json` (e em `frontend/src/lib/api.ts`,
  que tem a URL base).

---

## 3. Manual do Usuário

### Criar conta e entrar

1. Na tela inicial, clique em **"Cadastre-se"**.
2. Preencha nome, email e senha (mínimo 4 caracteres) e confirme.
3. Você será redirecionado ao login — entre com o email e a senha cadastrados.
4. Esqueceu a senha? Use o link **"Esqueceu a senha?"**, informe o email da
   conta e defina uma nova senha.

### Dashboard

Ao entrar, você vê:

- O **total gasto no mês** com as assinaturas ativas.
- **Metas por categoria** (Streaming, Trabalho, Fitness, Música, Jogos,
  Outros) com barra de progresso — configuráveis na tela de Perfil.
- A lista de **próximas cobranças**, ordenada por data.

### Cadastrar uma assinatura

1. Toque em **"+" (Nova Subscrição)**.
2. Escolha um serviço do catálogo (ou "Outro" para um serviço não listado).
3. Preencha valor, periodicidade, data da próxima cobrança, categoria e forma
   de pagamento.
4. Toque em **"Salvar assinatura"**.

### Gerenciar uma assinatura existente

Na tela de detalhes de qualquer assinatura (toque nela a partir do Dashboard),
você pode:

- **Confirmar Pagamento** — registra a cobrança atual no histórico e já
  calcula a próxima data, conforme a periodicidade.
- **Pausar / Reativar** — muda o status sem apagar os dados.
- **Editar** — altera valor, periodicidade, data, categoria ou forma de
  pagamento.
- **Cancelar no Provedor** — abre o link oficial de cancelamento do serviço
  (quando disponível).
- **Excluir assinatura** — remove definitivamente (pede confirmação antes).

### Importar extrato bancário

1. No Dashboard, toque em **"Importar Extrato"**.
2. Envie um arquivo `.csv` no formato `data,descricao,valor` (veja o arquivo
   `teste.csv` na raiz do projeto como exemplo).
3. O sistema cruza as descrições com o catálogo de serviços conhecidos e
   mostra o que encontrou. Cada item aparece marcado como:
   - **"nova assinatura"** — vai criar uma assinatura nova; ou
   - **"confirma pagamento"** — já existe uma assinatura ativa com esse nome,
     então a cobrança só confirma o pagamento dela, em vez de duplicar.
4. Marque o que deseja processar e toque em **"Confirmar e Monitorar"**.

### Meu Perfil

Acessível pelo avatar no Dashboard (ou pelo menu lateral no computador):

- **Dados pessoais**: nome, telefone (opcional) e forma de pagamento padrão.
  (Guardamos só um rótulo como "Cartão de crédito" — o sistema não processa
  nem armazena número de cartão real.)
- **Metas por categoria**: define o limite mensal de gasto para cada
  categoria, usado nas barras de progresso do Dashboard.
- **Sair da conta**: encerra a sessão.
