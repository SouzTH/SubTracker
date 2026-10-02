# SubTracker

Aplicação web para gestão e acompanhamento de subscrições (assinaturas) mensais, trimestrais e anuais. O SubTracker reúne cadastro e edição de assinaturas, confirmação de pagamentos, alertas de próxima cobrança, metas de gasto por categoria, relatórios e importação de faturas em formato CSV — tudo isolado por utilizador.

Projeto desenvolvido para a disciplina de Programação de Software Web.

**Integrantes:**
* Rodrigo Américo Nascimento D'icarahy
* Ronald Teixeira de Assis
* Thiago Souza da Silva

## Funcionalidades atuais

| Tela | Funcionalidades |
| :--- | :--- |
| **Login / Registo / Esqueci a Senha** | Autenticação por email e senha contra o `json-server`; recuperação de senha num fluxo simplificado de duas etapas (sem envio de email real). |
| **Dashboard** | Resumo do gasto mensal (já convertendo periodicidades trimestrais e anuais ao seu equivalente mensal), barras de progresso comparando gastos com as metas por categoria e lista ordenada de próximas cobranças. |
| **Nova / Editar Subscrição** | Cadastro (em dois passos: escolha do serviço e detalhes) e edição de assinaturas — valor, periodicidade, data da próxima cobrança, categoria e forma de pagamento. Validado com Zod via `react-hook-form`. |
| **Detalhes da Assinatura** | Histórico de pagamentos, projeção anual de custos, confirmação do pagamento do ciclo atual (atualiza histórico e recalcula a próxima cobrança), pausar/reativar, atalho para cancelar no provedor, editar e excluir o registo. |
| **Relatórios** | Gráfico (donut) da distribuição de despesas ativas por categoria, ranking das 3 assinaturas mais caras e resumo financeiro (mensal/anual). |
| **Importar Fatura** | Leitura de arquivo `.csv` com identificação automática de serviços conhecidos. Cada lançamento encontrado é cruzado com as assinaturas já ativas do utilizador: se já existir, confirma o pagamento; se não existir, cadastra uma assinatura nova — nunca duplica. |
| **Meu Perfil** | Dados pessoais (nome, telefone, forma de pagamento padrão — nunca número de cartão real) e metas (orçamentos) por categoria de gasto, usadas pelo Dashboard. |

## Tecnologias

* **React 19** + **Vite** + **TypeScript**
* **Tailwind CSS** — estilização e responsividade (sem CSS manual nem media query escrita à mão)
* **react-hook-form** + **zod** — controlo e validação de todos os formulários
* **@tanstack/react-query** — busca, cache e sincronização de dados com o `json-server` (substitui `fetch` + `useState` manuais)
* **react-router-dom** — rotas (`/`, `/cadastro`, `/esqueci-senha`, `/painel`)
* **json-server** — simula integralmente o back-end a partir de `frontend/db.json`

## Como executar

É necessário ter o [Node.js](https://nodejs.org/) (18+) instalado na máquina.

```bash
git clone https://github.com/SouzTH/SubTracker.git
cd SubTracker/frontend
npm install
```

Para executar o projeto, precisará de dois terminais abertos em simultâneo, ambos dentro de `SubTracker/frontend`:

**Terminal 1 (Base de Dados Simulada):**
```bash
npm run server
```
*(O json-server ficará a correr em http://localhost:3000)*

**Terminal 2 (Front-end da Aplicação):**
```bash
npm run dev
```
*Abra o endereço exibido pelo Vite no Terminal 2 (normalmente `http://localhost:5173/`).*
*No PowerShell, caso a execução de scripts esteja bloqueada, use `npm.cmd` no lugar de `npm`.*

Uma conta de teste já vem cadastrada em `db.json`: `admin@teste.com` / `1234`.

## Build de produção

Dentro de `SubTracker/frontend`:

```bash
npm run build
npm run preview
```
O build (`tsc` + Vite) é gerado na pasta `frontend/dist/`. O comando de preview permite conferir essa versão compilada localmente antes de a enviar para um servidor.

## Organização do código

```
SubTracker/
├── documentacao/          → Prototipagem, Refinamento, Manual e Cronograma
├── teste.csv               → extrato de exemplo para testar a importação
└── frontend/
    ├── db.json              → banco de dados simulado (utilizadores, subscrições, histórico)
    └── src/
        ├── App.tsx           → rotas, estado principal e layout (sidebar/bottom nav)
        ├── lib/
        │   ├── api.ts            → todas as chamadas HTTP ao json-server, centralizadas
        │   ├── queryClient.ts    → configuração do TanStack Query
        │   └── money.ts          → formatação de moeda e normalização mensal, compartilhadas
        ├── schemas/          → validações Zod usadas pelos formulários
        ├── constants/        → catálogo de serviços e formas de pagamento (fonte única)
        ├── components/       → componentes pequenos reaproveitados entre telas
        ├── pages/Login/      → Login, Registo e Esqueci a Senha (não exigem sessão)
        └── screens/          → Dashboard, Nova/Editar Subscrição, Detalhes, Relatório,
                                   Importar Extrato e Perfil (exigem sessão)
```

## Como funcionam a gestão e os cálculos

* O sistema isola totalmente os dados cruzando o `userId` da sessão com a propriedade `userId` de cada subscrição guardada no `db.json` — inclusive na chave de cache do TanStack Query, para que nunca se misturem dados entre contas.
* Na importação de extratos (CSV), o sistema percorre as linhas e procura palavras-chave conhecidas (ex: "NETFLIX"). Se encontrar, compara com as assinaturas **ativas** do utilizador: se já existir uma, confirma o pagamento do ciclo atual e recalcula a próxima cobrança conforme a periodicidade; se não existir, cria um novo registo do zero.
* O total do Dashboard, as metas por categoria e os totais do Relatório convertem sempre assinaturas **Anuais** (÷12) e **Trimestrais** (÷3) para o seu peso mensal equivalente, para que o "gasto no mês" seja comparável entre assinaturas de periodicidades diferentes.

## Documentação

A pasta [`documentacao/`](./documentacao) reúne:
* **Prototipagem_SubTracker.md** — levantamento original de telas e casos de uso.
* **Refinamento_da_Prototipagem_SubTracker.md** — matriz CRUD, priorização e o status de implementação de cada caso de uso (com justificativa para o que não entrou no escopo final).
* **Manual.md** — instalação, operação e manual do usuário.
* **Cronograma.md** — planeamento e acompanhamento das entregas.

## Limitações atuais

* A autenticação é simulada: a sessão depende unicamente do registo local no navegador (`localStorage`), sem a emissão de um token JWT verdadeiro.
* As palavras-passe guardadas no `db.json` estão em texto limpo, para fins académicos de demonstração.
* A recuperação de senha não envia email real — confirma o email na hora e já deixa redefinir a senha.
* A importação de CSV depende da estrutura fixa (`data,descricao,valor`).
* O catálogo de serviços reconhecidos na importação e no cadastro é uma lista fixa no código (`src/constants/catalog.ts`), não uma área administrativa com CRUD próprio — ver justificativa de escopo em `Refinamento_da_Prototipagem_SubTracker.md`.
* O armazenamento via `json-server` (`db.json`) não garante integridade transacional num ambiente de produção com múltiplos utilizadores simultâneos.
