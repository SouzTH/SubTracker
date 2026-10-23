# Cronograma do SubTracker

Entrega: 6 de outubro de 2026. Concluir o front-end com dados simulados via JSON Server, incluindo gestão de subscrições, importação de faturas, relatórios e isolamento de utilizadores. O README descreve o que já está implementado.

## Etapas

| Data | Entrega prevista | Situação |
| :--- | :--- | :--- |
| 19/09 | Configuração inicial do projeto, rotas estruturais e json-server | Concluída |
| 21/09 | Implementação de Login, Registo e navegação responsiva (Desktop/Mobile) | Concluída |
| 22/09 | Desenvolvimento do Dashboard com leitura de dados da API e cálculo de metas | Concluída |
| 23/09 | Criação do fluxo de Adicionar Subscrição e visualização de Detalhes (Leitura e Exclusão) | Concluída |
| 24/09 | Lógica de ações rápidas: Pausar/Reativar subscrições e Histórico de Pagamentos | Concluída |
| 25/09 | Implementação do Perfil de Utilizador, Relatórios gráficos e isolamento de estado de Sessão | Concluída |
| 26/09 | Criação da importação de extratos (CSV) e Ecrã de Edição de Subscrições | Concluída |
| 28/09 | Migração de toda a estilização para **Tailwind CSS** (framework de mercado), eliminando CSS manual e a lógica de media query em JavaScript | Concluída |
| 30/09 | Adoção de **react-hook-form + Zod** em todos os formulários e **TanStack Query** em toda a comunicação com o JSON Server, substituindo `fetch`/`useState` manuais | Concluída |
| 01/10 | Revisão de código: eliminação de duplicações (catálogo de serviços, lista de formas de pagamento, componente `Field`); atualização da documentação de Prototipagem e Refinamento com o status real de cada caso de uso | Concluída |
| 02/10 | Organização do repositório e atualização do README.md | **Em andamento** — ver pendências abaixo |
| 05/10 | Ensaiar a apresentação do projeto e corrigir potenciais anomalias finais | Planejada |
| 06/10 | Conferir a versão final e realizar a entrega oficial | Planejada |

Os responsáveis por cada etapa ainda serão definidos pelo grupo. O planeamento considera o trabalho paralelo na validação e na infraestrutura simulada da API. As datas intermediárias podem ser ajustadas conforme a disponibilidade dos integrantes.

### ⚠️ Pendências antes de 02/10 fechar

- [ ] Mesclar a branch com o código final na `main` do GitHub e dar `push` — hoje a `main` só tem o commit inicial.
- [ ] Atualizar o README.md do repositório com as dependências novas (Tailwind, react-hook-form, zod, @tanstack/react-query).

### Pontos a resolver durante a implementação

* ~~Padronizar a estilização visual (ex: consolidar uso de classes/frameworks como conversado) antes de criar novas telas.~~ **Resolvido** — Tailwind aplicado em 100% das telas.
* ~~Manter assinaturas, serviços, categorias e histórico de custos vinculados ao usuário correto da sessão.~~ **Resolvido** — isolamento por `userId`, inclusive no cache do TanStack Query.
* ~~Ao editar ou excluir assinaturas, recalcular imediatamente os limites de gastos e as barras de progresso do Dashboard; preservar a integridade do JSON Server.~~ **Resolvido** — toda mutação invalida o cache e o Dashboard relê os dados automaticamente.
* Conferir cálculos de dias restantes para a próxima cobrança e atualização das projeções anuais, garantindo que a tela de Detalhes corresponda exatamente aos dados. — **A confirmar**: a lógica não foi alterada nas últimas mudanças, mas não foi reverificada manualmente depois delas.
* Validar cada etapa antes de avançar e registrar as mudanças em commits separados por funcionalidade. — **Pendente**: ver "Pendências" acima.

### Conferência final

- [x] Cadastrar uma assinatura nova e configurar os seus detalhes (valor, período, método de pagamento).
- [x] Atualizar o status de uma assinatura (pausar/reativar) e registrar um pagamento, verificando se o histórico atualiza.
- [x] Editar e excluir assinaturas, conferindo o efeito imediato no recálculo do total gasto no mês.
- [x] Alternar entre usuários (ex: sair de uma conta e entrar noutra) sem misturar dados, testando o isolamento.
- [ ] Verificar campos inválidos nos formulários, estados de carregamento (loading), mensagens de erro e listas vazias. — formulários e loading/erro já cobertos (Zod + TanStack Query); **estados de lista vazia** (ex.: dashboard sem nenhuma assinatura) ainda não foi revisado com atenção.
- [ ] Usar todas as telas no celular, no computador e verificar a navegação pelo teclado. — responsivo (mobile/desktop) testado; **navegação por teclado** ainda não foi verificada.
- [ ] Instalar o projeto do zero seguindo o README, rodar o json-server junto com o front-end, e gerar o build sem erros. — instalação e execução testadas; **`npm run build`** (build de produção) ainda não confirmado sem erros; README ainda não reflete as dependências novas.
- [ ] Conferir no GitHub os commits que compõem a versão entregue. — **pendente**, ver "Pendências" acima.

Até a entrega, a prioridade é concluir esses fluxos no front-end utilizando o JSON Server. Back-end definitivo, banco de dados real e sistema robusto de autenticação ficam para uma etapa posterior.