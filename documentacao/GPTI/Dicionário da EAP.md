# Dicionário da EAP - SubTracker

**Versão:** 2.0  
**Data:** 03/10/2026

## 1. Finalidade

Este documento detalha os pacotes de trabalho da EAP do SubTracker, com foco em entregas, responsáveis, estimativas de esforço, dependências, riscos e critérios de aceite observáveis.

## 2. Visão Geral da EAP

| Código | Elemento | Nível | Responsável | Origem (UC/requisito) |
| ------ | -------- | ----- | ----------- | --------------------- |
| 1.1.1 | Documentação e acompanhamento do projeto | Pacote | Gerência | Gestão |
| 1.1.2 | Monitoramento, riscos e comunicação | Pacote | Gerência | Gestão e riscos |
| 1.2.1 | Levantamento, priorização e rastreabilidade | Pacote | Ronald, Rodrigo, Thiago | UC01–UC18 |
| 1.2.2 | Prototipagem e matrizes de requisitos | Pacote | Ronald, Rodrigo, Thiago | Prototipagem e requisitos |
| 1.3.1 | Estrutura de front-end e rotas | Pacote | Ronald | UC01–UC18 |
| 1.3.2 | Assinaturas e dashboard | Pacote | Ronald | UC01–UC04, UC17 |
| 1.3.3 | Serviços e cancelamento | Pacote | Thiago | UC05–UC08, UC18 |
| 1.3.4 | Tetos e consumo orçamentário | Pacote | Equipe de desenvolvimento | UC09–UC12 |
| 1.3.5 | Extratos, histórico e conciliação | Pacote | Rodrigo | UC13–UC16 |
| 1.3.6 | Relatório e tutorial | Pacote | Ronald e Thiago | UC17–UC18 |
| 1.4.1 | Estrutura da API e modelagem do banco | Pacote | Rodrigo | Requisito de alto nível |
| 1.4.2 | API de Assinaturas | Pacote | Ronald | UC01–UC04 |
| 1.4.3 | API de Serviços | Pacote | Thiago | UC05–UC08 |
| 1.4.4 | API de Tetos | Pacote | Equipe de desenvolvimento | UC09–UC12 |
| 1.4.5 | Importação de extratos e conciliação | Pacote | Rodrigo | UC13–UC16 |
| 1.4.6 | Relatório, projeção e acesso | Pacote | Ronald e Thiago | UC17–UC18 |
| 1.5.1 | Integração front-end/back-end | Pacote | Ronald, Rodrigo, Thiago | Integridade do sistema |
| 1.5.2 | Testes de validação funcional | Pacote | Ronald, Rodrigo, Thiago | UC01–UC18 |
| 1.5.3 | Ajustes e validação final | Pacote | Ronald, Rodrigo, Thiago | Critérios de sucesso |
| 1.6.1 | Documentação final e entrega | Pacote | Gerência + equipe | Encerramento do projeto |

## 3. Dicionário dos Elementos

### 3.1 Código 1.1.1 - Documentação e acompanhamento do projeto

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Planejar, acompanhar e documentar o progresso do projeto, incluindo entregáveis de gestão, cronograma e comunicação interna. |
| Entregas | Business Case atualizado, Termo de Abertura, Plano do Projeto, EAP e Dicionário da EAP, registros de acompanhamento. |
| Responsável | Gerência (Davi, João, Michael, Vinicius). |
| Início e término previstos | 03/10/2026 a 05/10/2026 |
| Marco relacionado | Marco 1 |
| Critérios de aceitação | Documentos revisados e consistentes com o escopo da versão 1; aprovação do patrocinador/gerência. |
| Dependências | Nenhuma |
| Recursos necessários | Repositório GitHub, documentos de contexto, comunicação por reunião e arquivo de controle. |
| Custo estimado | 20 horas de esforço |
| Premissas e restrições | O projeto é acadêmico; a capacidade de gestão foi informada como 4 h/semana por gerente. O escopo foi consolidado conforme a Fonte de Verde. |
| Riscos associados | Atraso no desenvolvimento; mudanças nos requisitos; dificuldades de comunicação; baixa participação dos integrantes. |

### 3.2 Código 1.1.2 - Monitoramento, riscos e comunicação

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Registrar riscos, indicadores de progresso e comunicação interna para manter o projeto dentro do cronograma e do escopo previsto. |
| Entregas | Registro de riscos, plano de comunicação, indicadores de acompanhamento e ações de replanejamento. |
| Responsável | Gerência. |
| Início e término previstos | 05/10/2026 a 11/12/2026 |
| Marco relacionado | Marcos 1, 2 e 3 |
| Critérios de aceitação | Riscos atualizados, acompanhamento do cronograma e comunicação registrada. |
| Dependências | 1.1.1 |
| Recursos necessários | Repositório GitHub, reuniões, registros de acompanhamento e documentos de gestão. |
| Custo estimado | 12 horas de esforço |
| Premissas e restrições | A gestão funciona com 4 h/semana por gerente e sem orçamento financeiro formal. |
| Riscos associados | Atraso no desenvolvimento; ausência de integrantes; mudanças nos requisitos; dificuldades de comunicação. |

### 3.3 Código 1.2.1 - Levantamento, priorização e rastreabilidade

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Consolidar os requisitos da versão 1, confirmar as prioridades e manter a rastreabilidade entre requisitos, UC e entregas de produto. |
| Entregas | Matriz de priorização, matriz UC x requisito, lista de requisitos e rastreabilidade do escopo. |
| Responsável | Ronald, Rodrigo e Thiago. |
| Início e término previstos | 03/10/2026 a 05/10/2026 |
| Marco relacionado | Marco 1 |
| Critérios de aceitação | Todos os UC01–UC18 estão mapeados e a priorização foi confirmada pela equipe. |
| Dependências | 1.1.1 |
| Recursos necessários | Fonte de Verde, Termo de Abertura, prototipagem e documentação do repositório. |
| Custo estimado | 10 horas de esforço |
| Premissas e restrições | O escopo principal foi definido pela Fonte de Verde e pelo Termo; não há promessa de implementação de módulos fora do escopo. |
| Riscos associados | Mudanças nos requisitos; baixa participação dos integrantes; dificuldades de comunicação. |

### 3.4 Código 1.2.2 - Prototipagem e matrizes de requisitos

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Validar o fluxo do sistema por meio do protótipo e das matrizes de CRUD, perfil x funcionalidade e priorização das telas. |
| Entregas | Protótipo das 7 telas, matrizes CRUD e perfil x funcionalidade, priorização do escopo. |
| Responsável | Ronald, Rodrigo e Thiago. |
| Início e término previstos | 03/10/2026 a 10/10/2026 |
| Marco relacionado | Marco 1 |
| Critérios de aceitação | Prototipagem concluída e consistente com o fluxo de usuário e com os casos de uso da versão 1. |
| Dependências | 1.2.1 |
| Recursos necessários | Repositório, prototipagem e material de requisitos. |
| Custo estimado | 14 horas de esforço |
| Premissas e restrições | O protótipo foi tratado como concluído no repositório e como base para a implementação da versão 1. |
| Riscos associados | Mudanças nos requisitos; dificuldades de comunicação; atraso no desenvolvimento. |

### 3.5 Código 1.3.1 - Estrutura de front-end e rotas

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Definir a estrutura de interface do front-end, incluindo layout, organização dos módulos e rotas da aplicação web responsiva. |
| Entregas | Estrutura inicial do projeto React/Vite/TypeScript, rotas e layout base. |
| Responsável | Ronald. |
| Início e término previstos | 06/10/2026 a 12/10/2026 |
| Marco relacionado | Marco 2 |
| Critérios de aceitação | Rotas e estrutura organizadas e navegáveis, com layout base estável para os módulos do sistema. |
| Dependências | 1.2.2 |
| Recursos necessários | React 19 + Vite + TypeScript, Tailwind CSS, react-router-dom. |
| Custo estimado | 16 horas de esforço |
| Premissas e restrições | O estado real do repositório já possui front-end React + Vite + TypeScript, sem backend real nem hospedagem. |
| Riscos associados | Atraso no desenvolvimento; dificuldades de comunicação; mudanças nos requisitos. |

### 3.6 Código 1.3.2 - Assinaturas e dashboard

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Implementar a gestão de assinaturas, incluindo cadastro, edição, ativação/pausa, exclusão e as telas de painel e dashboard relacionadas. |
| Entregas | Tela de painel, formulário de assinatura, listagem, edição e detalhamento de assinatura. |
| Responsável | Ronald. |
| Início e término previstos | 06/10/2026 a 31/10/2026 |
| Marco relacionado | Marco 2 |
| Critérios de aceitação | UC01–UC04 operacionais no front-end e consistentes com os dados de teste e a lógica da aplicação. |
| Dependências | 1.3.1 |
| Recursos necessários | React, Tailwind, react-hook-form, zod, react-query, json-server. |
| Custo estimado | 20 horas de esforço |
| Premissas e restrições | O histórico de cobranças é parte da assinatura; não há tabela de cobrança separada no escopo da versão 1. |
| Riscos associados | Atraso no desenvolvimento; mudanças nos requisitos; dificuldade de comunicação. |

### 3.7 Código 1.3.3 - Serviços e cancelamento

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Desenvolver o módulo de serviços, incluindo cadastro e manutenção do catálogo e orientações/link de cancelamento. |
| Entregas | Cadastro e consulta de serviços, visualização de links de cancelamento e orientações. |
| Responsável | Thiago. |
| Início e término previstos | 12/10/2026 a 31/10/2026 |
| Marco relacionado | Marco 2 |
| Critérios de aceitação | UC05–UC08 disponíveis na interface e com fluxo de cancelamento informado ao usuário. |
| Dependências | 1.3.1 |
| Recursos necessários | React, rotas, formulário, contexto/estado e dados de serviço. |
| Custo estimado | 12 horas de esforço |
| Premissas e restrições | O cancelamento é orientativo e não automático; o sistema não integra com provedores externos. |
| Riscos associados | Mudanças nos requisitos; atraso no desenvolvimento; dificuldades de comunicação. |

### 3.8 Código 1.3.4 - Tetos e consumo orçamentário

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Implementar a gestão de tetos orçamentários, permitindo cadastro, consulta e acompanhamento do consumo por categoria. |
| Entregas | Formulário de tetos, visão de consumo e indicadores de orçamento por categoria. |
| Responsável | Equipe de desenvolvimento. |
| Início e término previstos | 12/10/2026 a 31/10/2026 |
| Marco relacionado | Marco 2 |
| Critérios de aceitação | UC09–UC12 operacionais, com indicadores de consumo e atualização de valores orçamentários. |
| Dependências | 1.3.1 |
| Recursos necessários | React, Tailwind, estado local e dados de categoria. |
| Custo estimado | 12 horas de esforço |
| Premissas e restrições | Categoria é domínio-base com seed populado, sem manutenção independente. |
| Riscos associados | Atraso no desenvolvimento; mudanças nos requisitos; baixa participação dos integrantes. |

### 3.9 Código 1.3.5 - Extratos, histórico e conciliação

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Permitir o upload de extratos, a leitura da estrutura CSV/OFX e a identificação/descartes de lançamentos recorrentes. |
| Entregas | Tela de importação, histórico de extratos, função de conciliação e descarte de lançamento. |
| Responsável | Rodrigo. |
| Início e término previstos | 06/10/2026 a 17/11/2026 |
| Marco relacionado | Marco 2 |
| Critérios de aceitação | UC13–UC16 funcionais e com histórico preservado; importação aceita CSV e rejeita layouts incompatíveis. |
| Dependências | 1.3.1 |
| Recursos necessários | React, biblioteca de leitura de CSV, controles de upload, json-server e lógica de filtro por datas/descrições/valor. |
| Custo estimado | 16 horas de esforço |
| Premissas e restrições | O repositório já possui importação em CSV; OFX ainda não foi implementado. A autenticação é simulada e os dados ficam em db.json. |
| Riscos associados | Atraso no desenvolvimento; mudanças nos requisitos; falha na importação de extratos. |

### 3.10 Código 1.3.6 - Relatório e tutorial

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Exibir o relatório financeiro e disponibilizar o tutorial de uso e instruções de cancelamento para o usuário. |
| Entregas | Tela de relatório, projeção de impacto e tutorial com link direto para cancelamento. |
| Responsável | Ronald e Thiago. |
| Início e término previstos | 10/11/2026 a 17/11/2026 |
| Marco relacionado | Marco 2 |
| Critérios de aceitação | UC17 e UC18 acessíveis na aplicação e com informações que apoiam a tomada de decisão do usuário. |
| Dependências | 1.3.2, 1.3.3, 1.3.4, 1.3.5 |
| Recursos necessários | React, gráficos e navegação por telas. |
| Custo estimado | 8 horas de esforço |
| Premissas e restrições | O relatório é de projeção e impacto financeiro; não há operação financeira real. |
| Riscos associados | Atraso no desenvolvimento; mudanças nos requisitos; dificuldades de comunicação. |

### 3.11 Código 1.4.1 - Estrutura da API e modelagem do banco

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Definir a estrutura da API e a modelagem do banco com as cinco entidades do domínio: Assinatura, Serviço, Categoria, Extrato Importado e Teto Orçamentário. |
| Entregas | Estrutura da API, diagrama/descrição de entidades e dados de referência. |
| Responsável | Rodrigo. |
| Início e término previstos | 06/10/2026 a 12/10/2026 |
| Marco relacionado | Marco 2 |
| Critérios de aceitação | Estrutura de dados e API alinhadas com os casos de uso da primeira versão e com o modelo do repositório atual. |
| Dependências | 1.2.1 |
| Recursos necessários | json-server, db.json, documentação do domínio e regras do sistema. |
| Custo estimado | 10 horas de esforço |
| Premissas e restrições | Não há backend real, banco relacional real ou hospedagem; o ambiente atual é simulado. |
| Riscos associados | Atraso no desenvolvimento; dificuldades de comunicação; mudanças nos requisitos. |

### 3.12 Código 1.4.2 - API de Assinaturas

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Implementar endpoints e regras de negócio para cadastro, consulta, atualização e remoção de assinaturas, além de controles de status. |
| Entregas | API de associações, regras de edição e eventos de status. |
| Responsável | Ronald. |
| Início e término previstos | 12/10/2026 a 31/10/2026 |
| Marco relacionado | Marco 2 |
| Critérios de aceitação | UC01–UC04 atendidos pelos endpoints e pela lógica de persistência em json-server. |
| Dependências | 1.4.1 |
| Recursos necessários | json-server, db.json, rotas de assinatura, validação de dados. |
| Custo estimado | 8 horas de esforço |
| Premissas e restrições | O sistema não realiza cobrança real; todas as operações são de registro e acompanhamento. |
| Riscos associados | Atraso no desenvolvimento; mudanças nos requisitos; baixa participação do time. |

### 3.13 Código 1.4.3 - API de Serviços

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Implementar a manutenção do catálogo de serviços e as operações de orientação e cancelamento junto ao provedor. |
| Entregas | API de serviços, links de cancelamento, catálogo base e consulta. |
| Responsável | Thiago. |
| Início e término previstos | 12/10/2026 a 31/10/2026 |
| Marco relacionado | Marco 2 |
| Critérios de aceitação | UC05–UC08 atendidos, com acesso ao catálogo e orientação de cancelamento. |
| Dependências | 1.4.1 |
| Recursos necessários | json-server, db.json, roteamento de serviço e UI de consulta. |
| Custo estimado | 8 horas de esforço |
| Premissas e restrições | O cancelamento é sempre conduzido pelo usuário; não há integração automática com provedores externos. |
| Riscos associados | Atraso no desenvolvimento; mudanças nos requisitos; baixa participação dos integrantes. |

### 3.14 Código 1.4.4 - API de Tetos

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Implementar o gerenciamento de tetos orçamentários, incluindo cadastro, consulta, atualização e consumo por categoria. |
| Entregas | Endpoints e dados para cadastro/consulta/uso de tetos orçamentários. |
| Responsável | Equipe de desenvolvimento. |
| Início e término previstos | 12/10/2026 a 31/10/2026 |
| Marco relacionado | Marco 2 |
| Critérios de aceitação | UC09–UC12 simulados e consistentes com os valores de consumo e categoria. |
| Dependências | 1.4.1 |
| Recursos necessários | json-server, db.json e regras de cálculo do orçamento por categoria. |
| Custo estimado | 6 horas de esforço |
| Premissas e restrições | Categoria é base do domínio e não há módulo de manutenção independente. |
| Riscos associados | Mudanças nos requisitos; atraso no desenvolvimento; dificuldades de comunicação. |

### 3.15 Código 1.4.5 - Importação de extratos e conciliação

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Implementar a importação e leitura de extratos, a identificação de lançamentos recorrentes e o descarte de lançamentos inválidos. |
| Entregas | Endpoints de upload e processamento de extratos, histórico de importação e conciliação. |
| Responsável | Rodrigo. |
| Início e término previstos | 06/10/2026 a 17/11/2026 |
| Marco relacionado | Marco 2 |
| Critérios de aceitação | UC13–UC16 atendidos, com leitura de CSV e registros de histórico e descarte. |
| Dependências | 1.4.1 |
| Recursos necessários | json-server, db.json, lógica de parser de CSV, filtro de descrição/valor/data. |
| Custo estimado | 12 horas de esforço |
| Premissas e restrições | OFX ainda não foi implementado. O sistema não conecta diretamente a bancos ou cartões. |
| Riscos associados | Atraso no desenvolvimento; falha na importação; mudanças nos requisitos. |

### 3.16 Código 1.4.6 - Relatório, projeção e acesso

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Gerar relatórios de impacto financeiro e disponibilizar a projeção do gasto recorrente e acesso ao tutorial de cancelamento. |
| Entregas | Métricas de projeção, relatórios e controle de acesso. |
| Responsável | Ronald e Thiago. |
| Início e término previstos | 10/11/2026 a 17/11/2026 |
| Marco relacionado | Marco 2 |
| Critérios de aceitação | UC17 e UC18 atendidos e acessíveis a partir da interface, com projeção e links de cancelamento. |
| Dependências | 1.4.2, 1.4.3, 1.4.4, 1.4.5 |
| Recursos necessários | json-server, dados do sistema, visualização de relatório e acesso ao tutorial. |
| Custo estimado | 6 horas de esforço |
| Premissas e restrições | O cálculo é baseado em dados cadastrados pelo usuário e não em movimentação financeira real. |
| Riscos associados | Mudanças nos requisitos; atraso no desenvolvimento; dificuldades de comunicação. |

### 3.17 Código 1.5.1 - Integração front-end/back-end

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Integrar as telas criadas com a API simulada para garantir que os dados de assinaturas, serviços, tetos e extratos estejam em sincronização. |
| Entregas | Fluxo integrado de dados e comunicação funcional entre front-end e json-server. |
| Responsável | Ronald, Rodrigo e Thiago. |
| Início e término previstos | 18/11/2026 a 24/11/2026 |
| Marco relacionado | Marco 3 |
| Critérios de aceitação | Operações CRUD e importação respondendo corretamente em end-to-end. |
| Dependências | 1.3.2, 1.3.3, 1.3.4, 1.3.5, 1.4.2, 1.4.3, 1.4.4, 1.4.5 |
| Recursos necessários | Front-end na etapa atual, json-server, dados de teste e GitHub. |
| Custo estimado | 10 horas de esforço |
| Premissas e restrições | Não há backend real nem banco externo, somente simulação por json-server. |
| Riscos associados | Atraso no desenvolvimento; dificuldades de comunicação; mudanças nos requisitos. |

### 3.18 Código 1.5.2 - Testes de validação funcional

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Validar o comportamento funcional do sistema contra os requisitos da versão 1, incluindo fluxos principais e cenários de erro. |
| Entregas | Checklist de testes, evidências e correções de falhas observadas. |
| Responsável | Ronald, Rodrigo e Thiago. |
| Início e término previstos | 25/11/2026 a 03/12/2026 |
| Marco relacionado | Marco 3 |
| Critérios de aceitação | Fluxos principais e críticos concluídos e sem divergência importante com o escopo definido. |
| Dependências | 1.5.1 |
| Recursos necessários | Ambiente de teste local, dados de exemplo, repositório e documentação. |
| Custo estimado | 12 horas de esforço |
| Premissas e restrições | Os testes têm foco em integração e validação funcional, não em produção real. |
| Riscos associados | Atraso no desenvolvimento; baixa participação dos integrantes; dificuldades de comunicação. |

### 3.19 Código 1.5.3 - Ajustes e validação final

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Corrigir falhas identificadas nos testes, finalizar fluxos críticos e ajustar a apresentação e a documentação para entrega final. |
| Entregas | Sistema ajustado, registros de correção e versão pronta para avaliação final. |
| Responsável | Ronald, Rodrigo e Thiago. |
| Início e término previstos | 04/12/2026 a 11/12/2026 |
| Marco relacionado | Marco 3 |
| Critérios de aceitação | Sistema estável para a entrega final e documentação suficientemente alinhada ao projeto entregue. |
| Dependências | 1.5.2 |
| Recursos necessários | Repositório, ambiente local, documentação e ajustes finais. |
| Custo estimado | 8 horas de esforço |
| Premissas e restrições | O cronograma final é 07/12/2026 a 11/12/2026, com validação acadêmica e sem operação financeira real. |
| Riscos associados | Atraso no desenvolvimento; mudanças nos requisitos; baixa participação dos integrantes. |

### 3.20 Código 1.6.1 - Documentação final e entrega

| Campo | Descrição |
| ----- | --------- |
| Descrição do trabalho | Encerrar o projeto com documentação final, revisão de artefatos e entrega para avaliação acadêmica. |
| Entregas | Documentação final do projeto, EAP e Dicionário finalizados e artefatos atualizados no repositório. |
| Responsável | Gerência + equipe. |
| Início e término previstos | 07/12/2026 a 11/12/2026 |
| Marco relacionado | Marco 3 |
| Critérios de aceitação | Entregas finais revisadas, repostadas e consistentes com a documentação e a versão entregue. |
| Dependências | 1.5.3 |
| Recursos necessários | Repositório, documentos finales, GIT e feedback dos stakeholders. |
| Custo estimado | 8 horas de esforço |
| Premissas e restrições | O projeto encerra na segunda semana de dezembro de 2026, em linha com o cronograma acadêmico informado. |
| Riscos associados | Atraso no desenvolvimento; ausência de integrantes; dificuldades de comunicação. |

## 4. Observações

- O custo estimado foi tratado em horas de esforço; não há valor/hora oficial, salário ou orçamento real definido para a equipe.
- A infraestrutura foi tratada como cenário acadêmico A, sem custo real de produção: Vercel Hobby + Supabase Free.
- A capacidade total estimada é de 252 horas, calculada como: 3 programadores × 4 h/semana × 9 semanas + 4 gerentes × 4 h/semana × 9 semanas.
- O esforço total estimado da EAP somou 228 horas. A reserva de contingência, separada dos pacotes, equivale a 10% do esforço total, ou seja, 23 horas.
- Em termos de linha de base: esforço total + contingência = 251 horas, dentro da capacidade nominal de 252 horas.

## 5. Premissas confirmadas pelo usuário e lacunas relevantes

| Item | Confirmação |
| ---- | ----------- |
| Programação | Ronald, Rodrigo e Thiago |
| Matheus | Não integra a programação; o papel foi indicado como fora do time de desenvolvimento |
| Dedicação | 4 h/semana por pessoa, sem considerar provas e feriados, salvo nova informação |
| Marcos | Marco 1 = 05/10/2026; Marco 2 = 17/11/2026; entrega final = 07/12/2026 a 11/12/2026 |
| Escopo | UC01–UC18 mantidos |
| Cobranças | Vinculada à Assinatura; sem tabela própria |
| Infraestrutura | Acadêmica, sem custo real de produção |
| Custo | Em horas de esforço e sem valores financeiros reais |
| Reserva | 10% do esforço total, separada dos pacotes |

- Lacuna mantida: a definição do papel de Matheus fora do código de desenvolvimento não foi corroborada por documentos do repositório; a equipe confirmou que ele saiu do time de programação.
- A partir do contexto real disponível, a implementação foi tratada como front-end funcional em React + Vite + TypeScript, com back-end simulado em json-server, sem banco real nem hospedagem em produção.