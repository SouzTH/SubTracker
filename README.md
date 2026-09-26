# SubTracker

Aplicação web para gestão e acompanhamento de subscrições (assinaturas) mensais e anuais. O SubTracker reúne alertas de cobrança, registros de pagamentos, relatórios de gastos e importação de faturas em formato CSV.

Projeto desenvolvido para a disciplina de Programação de Software Web.

**Integrantes:**
* Rodrigo Américo Nascimento D'icarahy
* Ronald Teixeira de Assis
* Thiago Souza da Silva

## Funcionalidades atuais

| Tela | Funcionalidades |
| :--- | :--- |
| **Dashboard** | Resumo de gastos mensais, barras de progresso comparando gastos com as metas por categoria e lista ordenada de próximas cobranças. |
| **Nova / Editar Subscrição** | Cadastro (em dois passos) e edição de serviços, incluindo valor, periodicidade, data de cobrança e categoria. |
| **Detalhes da Assinatura** | Visualização do histórico de pagamentos, projeção anual de custos, atalhos para cancelar no provedor e opções para pausar ou excluir o registo. |
| **Relatórios** | Gráfico (donut) da distribuição de despesas ativas por categoria e top 3 das subscrições mais caras. |
| **Importar Fatura** | Leitura de arquivo CSV com identificação automática de serviços e cruzamento inteligente para evitar duplicados (cria nova assinatura ou apenas confirma pagamento). |
| **Meu Perfil** | Atualização de dados pessoais e definição de metas (orçamentos) personalizados para cada categoria de gasto. |

## Tecnologias

React 18, Vite, TypeScript, HTML e CSS. A interface utiliza componentes funcionais e gestão de estado local do React. O back-end é simulado de forma integral utilizando a biblioteca `json-server`.

## Como executar

É necessário ter o [Node.js](https://nodejs.org/) instalado na máquina.

```bash
git clone https://github.com/SEU_USUARIO/SubTracker.git
cd SubTracker
npm install
```

Para executar o projeto, precisará de dois terminais abertos em simultâneo:

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

## Build de produção

```bash
npm run build
npm run preview
```
O build é gerado na pasta `dist/`. O comando de preview permite conferir essa versão compilada localmente antes de a enviar para um servidor.

## Organização do código

* **`src/App.tsx`:** Estado compartilhado, roteamento e barra de navegação.
* **`src/pages/`:** Páginas abertas que não exigem login (Login, Registo, Esqueci a Senha).
* **`src/screens/`:** Ecrãs principais protegidos (Dashboard, Relatórios, Detalhes, etc.).
* **`db.json`:** Banco de dados simulado (utilizadores, subscrições e histórico).

A aplicação utiliza o `index.html` na raiz como ponto de entrada.

## Como funcionam a gestão e os cálculos

* O sistema isola totalmente os dados cruzando o `userId` logado com a propriedade `userId` de cada subscrição guardada no `db.json`.
* Na importação de extratos (CSV), o sistema percorre as linhas e pesquisa palavras-chave (ex: "NETFLIX"). Se encontrar, compara com as assinaturas "Ativas" do utilizador. Se já existir, confirma o pagamento do mês atual e recalcula a próxima data de cobrança com base na periodicidade. Se não existir, cria um novo registo do zero.
* As metas no Dashboard e nos Relatórios convertem sempre os pagamentos "Anuais" ou "Trimestrais" no seu peso mensal equivalente (ex: valor anual a dividir por 12) para que as médias e barras de progresso sejam precisas.

## Limitações atuais

* A autenticação é simulada: a segurança da sessão depende unicamente do registo local no navegador (`localStorage`), sem a emissão de um token JWT verdadeiro.
* As palavras-passe guardadas no `db.json` estão em texto limpo para fins académicos de demonstração.
* A importação de CSV depende da estrutura fixa (`data,descricao,valor`).
* O armazenamento local via `json-server` (`db.json`) não garante integridade transacional num ambiente de produção com milhares de utilizadores simultâneos.