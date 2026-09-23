# Refinamento da Prototipagem: SubTracker

**Integrantes:**
- Ronald Teixeira de Assis
- Rodrigo Américo Nascimento D'icarahy
- Thiago Souza da Silva
- Matheus Jasbick

## 1. Matriz CRUD (Validação da Consistência dos Requisitos)

A matriz cruza as funcionalidades com as entidades de domínio definidas no projeto (Assinatura, Serviço, Categoria, Extrato Importado e Teto Orçamentário). Nela, identificam-se as operações de criação (C), leitura/consulta (R), atualização (U) e exclusão (D).

**Entidades:**
- **E1:** Assinatura
- **E2:** Serviço (Provedor/Catálogo)
- **E3:** Categoria
- **E4:** Extrato Importado
- **E5:** Teto Orçamentário

| Funcionalidade / Caso de Uso | E1: Assinatura | E2: Serviço | E3: Categoria | E4: Extrato Importado | E5: Teto Orçamentário |
|---|---|---|---|---|---|
| UC01: Cadastrar Assinatura | C | R | R | — | R |
| UC02: Consultar/Listar Assinaturas | R | R | R | — | R |
| UC03: Atualizar Assinatura (pausar/reativar/editar) | U | R | R | — | — |
| UC04: Excluir Assinatura | D | — | — | — | — |
| UC05: Cadastrar Serviço | — | C | R | — | — |
| UC06: Consultar Serviços Disponíveis | — | R | R | — | — |
| UC07: Atualizar Dados do Serviço (link de cancelamento) | — | U | — | — | — |
| UC08: Excluir Serviço | — | D | — | — | — |
| UC09: Cadastrar Teto Orçamentário | — | — | R | — | C |
| UC10: Consultar Tetos e Consumo Vigente | R | — | R | — | R |
| UC11: Atualizar Teto Orçamentário | — | — | — | — | U |
| UC12: Excluir Teto Orçamentário | — | — | — | — | D |
| UC13: Fazer Upload de Extrato Bancário | — | — | — | C | — |
| UC14: Detectar e Conciliar Lançamentos | C | R | R | R, U | — |
| UC15: Consultar Histórico de Extratos | — | — | — | R | — |
| UC16: Descartar Lançamento de Extrato | — | — | — | D | — |
| UC17: Emitir Relatório de Projeção e Impacto | R | R | R | — | R |
| UC18: Acessar Tutorial e Link Direto de Cancelamento | R | R | — | — | — |
| **Status de Consistência do Ciclo de Vida** | **C, R, U, D** | **C, R, U, D** | **R\*** | **C, R, U, D** | **C, R, U, D** |

**\*Nota sobre a entidade Categoria:** As categorias (Streaming, Trabalho, Fitness, etc.) atuam prioritariamente como domínio base de classificação no fluxo principal do usuário final. O ciclo de manutenção cadastral administrativa das categorias é executado na retaguarda do sistema.

## 2. Matriz Perfil x Funcionalidade

A matriz analisa o escopo de permissão de cada perfil de acesso sobre os casos de uso declarados no sistema, destacando os pontos de maior esforço e adaptação de interface:

- **Usuário:** Cliente que monitora assinaturas, importa extratos, define tetos orçamentários e executa cancelamentos.
- **Administrador:** Responsável pela manutenção global da base de dados, curadoria do catálogo de provedores e integridade dos links externos de cancelamento.

| Funcionalidade / Caso de Uso | Usuário | Administrador | Esforço e Impacto na Interface |
|---|---|---|---|
| UC01: Cadastrar Assinatura | X | — | Interface mobile focada em etapas e formulário ágil |
| UC02: Consultar/Listar Assinaturas | X | — | Visão principal (cards cronológicos no Dashboard) |
| UC03: Atualizar Assinatura | X | — | Botões de ação rápida (Pausar/Reativar e Edição) |
| UC04: Excluir Assinatura | X | — | Confirmação com modal de segurança |
| UC05: Cadastrar Serviço | X | X | Maior Esforço: Usuário cria serviço avulso ("Outro"); Admin cadastra no catálogo global |
| UC06: Consultar Serviços Disponíveis | X | X | Maior Esforço: Grade visual de ícones para o usuário; tabela administrativa para o Admin |
| UC07: Atualizar Dados do Serviço | — | X | Painel administrativo de curadoria de URLs |
| UC08: Excluir Serviço | — | X | Exclusivo de administração |
| UC09: Cadastrar Teto Orçamentário | X | — | Definição de limites financeiros por categoria |
| UC10: Consultar Tetos e Consumo Vigente | X | — | Barras de progresso com cálculo de estouro de meta |
| UC11: Atualizar Teto Orçamentário | X | — | Ajuste rápido de limites orçamentários |
| UC12: Excluir Teto Orçamentário | X | — | Remoção de limites prévios |
| UC13: Fazer Upload de Extrato Bancário | X | — | Componente de upload e dropzone (.OFX e .CSV) |
| UC14: Detectar e Conciliar Lançamentos | X | — | Lista com caixas de seleção (checkbox) em lote |
| UC15: Consultar Histórico de Extratos | X | — | Auditoria de arquivos previamente processados |
| UC16: Descartar Lançamento de Extrato | X | — | Descarte de despesas não recorrentes |
| UC17: Emitir Relatório de Projeção | X | — | Painel analítico de métricas financeiras |
| UC18: Acessar Link Direto de Cancelamento | X | — | Abertura de deep links oficiais externos |

## 3. Priorização dos Requisitos e Responsáveis

A ordenação prioriza primeiro as funcionalidades onde o valor direto para o cliente é gerado (detecção automática, auditoria financeira e cancelamento), seguidas pelas funcionalidades facilitadoras do fluxo e, por último, os cadastros básicos:

### Ordem de Prioridade para Desenvolvimento

**1. Prioridade Máxima — Geração Direta de Valor**
- UC13 e UC14 (Upload e Conciliação Automática de Extrato): Elimina a barreira de entrada manual ao detectar assinaturas em lote.
- UC18 (Link Direto de Cancelamento): Resolve o atrito de cancelamento nas plataformas.
- UC17 (Relatório de Projeção e Impacto Financeiro): Entrega clareza sobre o custo anual e desvios de orçamento.

**2. Prioridade Média — Núcleo Operacional e Metas**
- UC02 (Listagem e Dashboard Principal): Exibe a linha do tempo e status de pagamentos.
- UC09 e UC10 (Definição e Consulta de Tetos Orçamentários): Monitora limites de gastos por categoria.
- UC01 e UC03 (Cadastro Manual e Atualização de Assinaturas): Habilita inclusões pontuais e pausas de contrato.

**3. Prioridade Básica — Gestão Complementar**
- UC04 (Exclusão de Assinatura)
- UC11 e UC12 (Manutenção de Tetos Orçamentários)
- UC15 e UC16 (Histórico e Descarte de Extratos)
- UC05, UC06, UC07 e UC08 (Manutenção do Catálogo de Provedores)

### Divisão de Responsabilidades por Integrante

- **Ronald Teixeira de Assis**
  - Entidade de Foco: Assinatura
  - Casos de Uso: UC01, UC02, UC03, UC04 e UC17

- **Rodrigo Américo Nascimento D'icarahy**
  - Entidade de Foco: Extrato Importado
  - Casos de Uso: UC13, UC14, UC15 e UC16

- **Thiago Souza da Silva**
  - Entidade de Foco: Serviço (Provedores e Cancelamento)
  - Casos de Uso: UC05, UC06, UC07, UC08 e UC18

- **Matheus Jasbick**
  - Entidade de Foco: Teto Orçamentário
  - Casos de Uso: UC09, UC10, UC11 e UC12

**Link do repositório:** [https://github.com/SouzTH/SubTracker](https://github.com/SouzTH/SubTracker)
