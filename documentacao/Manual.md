# Manual do SubTracker

Este documento cobre três partes: **instalação** (como colocar o projeto para rodar),
**operação** (como o sistema funciona por dentro, para quem for mantê-lo) e
**uso** (como um usuário final navega pelo app).

---

## 1. Manual de Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 20 ou superior (inclui o `npm`).
- Um navegador atual (Chrome, Edge, Firefox).
- Git, para clonar o repositório.
- Docker Desktop, para executar o PostgreSQL do backend.

### Passo a passo

1. **Clone o repositório** e entre na pasta do projeto:

   ```bash
   git clone https://github.com/SouzTH/SubTracker.git
   cd SubTracker
   ```

2. **Configure e inicie o backend e o PostgreSQL** seguindo o passo a passo
   de [`backend/README.md`](../backend/README.md).

3. **Instale as dependências do frontend**:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Acesse** [http://localhost:5173](http://localhost:5173) no navegador.

5. **Crie uma conta** pelo link "Cadastre-se" ou use a conta de teste criada
   pelo seed, conforme descrito em `backend/README.md`.

### Build de produção (opcional)

```bash
npm run build    # gera a pasta frontend/dist
npm run preview  # serve o build gerado, para conferir
```

---

## 2. Manual de Operação

### Arquitetura

O frontend React comunica-se com a API Express, que persiste os dados no
PostgreSQL por meio do Prisma. Consulte `backend/README.md` para configurar e
executar a API.

```
SubTracker/
├── documentacao/        → documentos de prototipagem, refinamento e este manual
├── teste.csv             → extrato de exemplo para testar a importação
└── frontend/
    ├── src/
    │   ├── App.tsx        → rotas, layout e estado principal da aplicação
    │   ├── lib/           → chamadas HTTP e configuração do TanStack Query
    │   ├── schemas/       → validações Zod dos formulários
    │   ├── constants/     → catálogo de serviços e formas de pagamento
    │   ├── components/    → componentes pequenos reutilizados
    │   ├── pages/Login/   → telas de login, cadastro e recuperação de senha
    │   └── screens/       → Dashboard, assinaturas, relatório, importação e perfil
    └── package.json
```

### Tecnologias e por que cada uma está aqui

| Tecnologia | Para que serve neste projeto |
|---|---|
| React + Vite + TypeScript | Base da aplicação (ES6, componentes funcionais) |
| Tailwind CSS | Estilização e responsividade (sem media query manual) |
| `react-hook-form` + `zod` | Controle e validação dos formulários (login, cadastro, nova assinatura, perfil, etc.) |
| `@tanstack/react-query` | Busca, cache e sincronização dos dados com a API |
| Express + Prisma + PostgreSQL | API e persistência de dados (veja `backend/README.md`) |
| `react-router-dom` | Rotas (`/`, `/cadastro`, `/esqueci-senha`, `/painel`) |

### Problemas comuns

- **"Erro de conexão ao servidor" no login** → confira se a API está rodando
  conforme as instruções de `backend/README.md`.
- **Porta 3001 ou 5173 já em uso** → feche outro processo usando a porta, ou
  configure a porta do Vite ou a URL da API conforme o ambiente.

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
