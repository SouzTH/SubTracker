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
| 28/09 | Ajustes de acessibilidade, tipografia e revisão visual dos estados vazios (empty states) | Planejada |
| 30/09 | Testes rigorosos no fluxo completo para garantir a estabilidade do JSON Server | Planejada |
| 02/10 | Organização do repositório, simplificar código e atualizar o README.md com instruções | Planejada |
| 05/10 | Ensaiar a apresentação do projeto e corrigir potenciais anomalias finais | Planejada |
| 06/10 | Conferir a versão final e realizar a entrega oficial | Planejada |

Os responsáveis por cada etapa ainda serão definidos pelo grupo. O planeamento considera o trabalho paralelo na validação e na infraestrutura simulada da API. As datas intermediárias podem ser ajustadas conforme a disponibilidade dos integrantes.

### Pontos a resolver durante a implementação

* Padronizar a estilização visual (ex: consolidar uso de classes/frameworks como conversado) antes de criar novas telas.
* Manter assinaturas, serviços, categorias e histórico de custos vinculados ao usuário correto da sessão.
* Ao editar ou excluir assinaturas, recalcular imediatamente os limites de gastos e as barras de progresso do Dashboard; preservar a integridade do JSON Server.
* Conferir cálculos de dias restantes para a próxima cobrança e atualização das projeções anuais, garantindo que a tela de Detalhes corresponda exatamente aos dados.
* Validar cada etapa antes de avançar e registrar as mudanças em commits separados por funcionalidade.

### Conferência final

- [ ] Cadastrar uma assinatura nova e configurar os seus detalhes (valor, período, método de pagamento).
- [ ] Atualizar o status de uma assinatura (pausar/reativar) e registrar um pagamento, verificando se o histórico atualiza.
- [ ] Editar e excluir assinaturas, conferindo o efeito imediato no recálculo do total gasto no mês.
- [ ] Alternar entre usuários (ex: sair de uma conta e entrar noutra) sem misturar dados, testando o isolamento.
- [ ] Verificar campos inválidos nos formulários, estados de carregamento (loading), mensagens de erro e listas vazias.
- [ ] Usar todas as telas no celular, no computador e verificar a navegação pelo teclado.
- [ ] Instalar o projeto do zero seguindo o README, rodar o json-server junto com o front-end, e gerar o build sem erros.
- [ ] Conferir no GitHub os commits que compõem a versão entregue.

Até a entrega, a prioridade é concluir esses fluxos no front-end utilizando o JSON Server. Back-end definitivo, banco de dados real e sistema robusto de autenticação ficam para uma etapa posterior.