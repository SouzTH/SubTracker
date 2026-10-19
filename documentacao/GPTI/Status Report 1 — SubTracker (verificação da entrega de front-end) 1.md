# Status Report 1 — SubTracker

Verificação da entrega de front-end da PSW (Marco 1) · Grupo de gerência: Davi Luiz Rodrigues da Conceição, João Henrique Lima Gualberto, Michael Patrick Ferreira da Silva Borba e Vinicius da Silva Mendes

## 1. Data de status e período coberto

- **Data de status (corte):** 06/10/2026, data da entrega da PSW.
- **Período coberto:** 25/08/2026 a 06/10/2026.
- **Entrega verificada:** front-end com backend simulado por `json-server` e `db.json` (Marco 1). A API própria pertence ao Marco 2 e não é tratada como falta.
- **Linha de base:** declaração do escopo (Plano do Projeto, seção 2.3), EAP, Dicionário da EAP (arquivo verificado: versão 2.0, 03/10/2026), pacotes 1.3.1 a 1.3.6, e matriz de rastreabilidade (Plano, seção 2.2).
- **Como foi verificado:** instalação seguindo o manual (`npm install`), `npm run build`, `npm run server` e `npm run dev`, e testes no navegador com contas de teste. A verificação foi feita até 12/10/2026 sobre a versão disponível no repositório. A PSW não forneceu commit ou tag do congelamento, então não é possível afirmar que a versão testada é idêntica à de 06/10 (Q-13).
- **Origem da evidência:** parte dos testes foi executada pelo grupo (itens 2, 3, 7 a 10 e 13 a 15 do questionário de verificação) e parte pela ferramenta GitHub Copilot, que leu o repositório e executou a bateria de testes. O `db.json` foi copiado antes da bateria da ferramenta e restaurado ao final (SHA-256 `AE9F32537D06F05BA172146B1F486143C626A4A32D8C65C82785474031AC56B6`). Os resultados da ferramenta entram como evidência; a conclusão de cada pacote é do grupo. A base de teste continha um valor inserido pelo próprio grupo (Spotify trimestral de R$ 200.000.001,90); ele não é defeito da PSW e não entra nas questões.
- **Fora deste relatório:** cronograma, custo e valor agregado (Status Report 2). Os resultados abaixo comparam a entrega com o critério do Dicionário e não avaliam prazo.

## 2. Situação geral

**VERMELHO — a entrega não está pronta para recomendação de aceite.**

Justificativa, ligada a fatos do escopo:

- Dos seis pacotes do Marco 1, **um passou** (1.3.1) e **cinco falharam** (1.3.2 a 1.3.6) no critério do Dicionário.
- Seis casos de uso da linha de base não estão disponíveis na interface: UC05, UC07 e UC08 (manutenção do catálogo de serviços), UC12 (exclusão de teto), UC15 (histórico de extratos) e UC16 (descarte de lançamento).
- A importação aceita arquivos incompatíveis (CSV com colunas diferentes e PDF) como “Analisado”, com zero resultados, em vez de rejeitá-los.
- Não há tutorial de uso dentro da aplicação (pacote 1.3.6).
- O painel mostra uma cobrança vencida como “Em -7 dias”.

**Recomendação ao patrocinador:** aceitar o pacote 1.3.1 e não aceitar os pacotes 1.3.2 a 1.3.6 neste corte. Pede-se decisão sobre as mudanças de escopo da seção 5 e nova verificação independente depois das correções. Este relatório registra a entrega verificada e uma recomendação; **não declara aceite formal de nenhum pacote**.

## 3. Escopo: verificado, pendente e não demonstrado

| Pacote | Resultado | Recomendação |
| --- | --- | --- |
| 1.3.1 — Estrutura de front-end e rotas | **Passou** | Aceitar |
| 1.3.2 — Assinaturas e dashboard | **Falhou** | Não aceitar |
| 1.3.3 — Serviços e cancelamento | **Falhou** | Não aceitar |
| 1.3.4 — Tetos e consumo orçamentário | **Falhou** | Não aceitar |
| 1.3.5 — Extratos, histórico e conciliação | **Falhou** | Não aceitar |
| 1.3.6 — Relatório e tutorial | **Falhou** | Não aceitar |

Os números entre parênteses indicam o item do questionário de verificação.

### 1.3.1 — Estrutura de front-end e rotas

- **Critério (Dicionário):** “Rotas e estrutura organizadas e navegáveis, com layout base estável para os módulos do sistema.”
- **Resultado:** Passou.
- **Evidência:** `npm run build` concluiu sem erro (4); login levou ao painel (7); Início, Adicionar, Relatório, importação, perfil e detalhes abriram sem tela em branco (8); menu e cabeçalho mantiveram o layout (9); a 390 px não houve rolagem horizontal e a navegação móvel apareceu (10).
- **Ressalva:** F5 em tela interna mantém a sessão, mas volta ao painel, porque as telas internas ficam sob `/painel` (11). O resultado desse item divergiu entre testadores e está registrado como Q-12.
- **Não demonstrado:** uso do fluxo principal só com teclado (59), fora do critério deste pacote (Q-02).

### 1.3.2 — Assinaturas e dashboard

- **Critério:** “UC01–UC04 operacionais no front-end e consistentes com os dados de teste e a lógica da aplicação.”
- **Resultado:** Falhou.
- **Operacional (passou):** criar assinatura e vê-la na listagem (13); persistência após F5 (14); edição refletida no painel (15); pausar e reativar com reflexo no total (16, 17); excluir com confirmação e persistência (18); bloqueio de valor vazio e negativo (19); histórico e “Confirmar Pagamento” persistindo (20); próximas cobranças em ordem cronológica (22).
- **Consistência (falhou):** a cobrança de Netflix de 05/10/2026 aparece no painel como “Em -7 dias” (23). O total mensal do painel confere com a soma das assinaturas ativas (24), inclusive com o valor atípico inserido pelo grupo no teste.
- **Nota:** o “-7” foi observado em 12/10; no corte de 06/10 seria “-1”. O defeito é o mesmo: cobrança vencida exibida como contagem negativa.

### 1.3.3 — Serviços e cancelamento

- **Critério:** “UC05–UC08 disponíveis na interface e com fluxo de cancelamento informado ao usuário.”
- **Resultado:** Falhou.
- **Evidência:** o catálogo é fixo; não há cadastro, edição nem exclusão de serviço (25, 26, 27 — UC05, UC07, UC08). O usuário consulta os serviços disponíveis (28) e o link “Cancelar no Provedor” aparece nos detalhes (29), mas não há passo a passo de cancelamento (30). Não há perfil Administrador distinto (31, 32).
- **Não demonstrado:** a página externa de destino do link não foi aberta (54; Q-02).

### 1.3.4 — Tetos e consumo orçamentário

- **Critério:** “UC09–UC12 operacionais, com indicadores de consumo e atualização de valores orçamentários.”
- **Resultado:** Falhou.
- **Evidência:** definir teto por categoria (33), alteração persistente (34), consumo versus teto no painel (35), consumo atualizado ao criar ou pausar assinatura (36) e indicação “Limite” quando excede (39). Não existe ação de excluir teto (37) e definir zero mantém a categoria com teto de R$ 0,00 (38), logo UC12 não é atendida.

### 1.3.5 — Extratos, histórico e conciliação

- **Critério:** “UC13–UC16 funcionais e com histórico preservado; importação aceita CSV e rejeita layouts incompatíveis.”
- **Resultado:** Falhou.
- **Evidência:** `teste.csv` válido (9 lançamentos) levou à revisão com seis serviços reconhecidos (40, 41); a confirmação criou as assinaturas e elas persistiram (42); desmarcar um lançamento impediu sua criação (44); reimportar não duplicou assinaturas (43), mas repetiu entradas no histórico de pagamentos.
- **Falhas:** não há histórico de arquivos importados (45, UC15) nem registro persistente de descarte (46, UC16); CSV com colunas diferentes e PDF foram mostrados como “Analisado” com zero resultados, sem rejeição clara (47, 48); arquivo vazio fica sem mensagem (49).
- **Não demonstrado:** os limiares de importação do Plano (mínimo de 10 lançamentos e 80% de reconhecimento) não podem ser medidos com `teste.csv`, que tem 9 lançamentos (Q-09).

### 1.3.6 — Relatório e tutorial

- **Critério:** “UC17 e UC18 acessíveis na aplicação e com informações que apoiam a tomada de decisão do usuário.”
- **Resultado:** Falhou.
- **Evidência:** relatório com distribuição por categoria, ranking e projeção; a projeção do mês seguinte e o custo anual conferem com o cálculo manual (R$ 272,70 × 12 = R$ 3.272,40) (50, 51, 52). Não foi encontrado tutorial de uso dentro da aplicação (53). Conta nova mostra zeros, sem mensagem explícita de lista vazia (55).
- **Não demonstrado:** abertura da página externa do link de cancelamento (54).

### As três perguntas do controle do escopo

1. **O que está na EAP deste marco foi entregue? Não integralmente.** Há estrutura navegável, painel, gestão de assinaturas, tetos, relatório e importação de CSV. Faltam UC05, UC07, UC08, UC12, UC15, UC16 e o tutorial.
2. **O que foi entregue está na EAP? Em grande parte, sim.** As exceções são “Confirmar Pagamento” (56) e as telas “Criar Conta” e “Esqueceu a senha?” (57), registradas como CHG-04 e CHG-05.
3. **O que foi entregue atende ao aceite do Dicionário? Não integralmente:** um pacote passou e cinco falharam. Nenhum resultado equivale a aceite formal.

## 4. Requisitos do Marco 1 atendidos e pendentes

Rastreabilidade conforme Plano do Projeto, seção 2.2. “Sem pacote verificado” significa que nenhum pacote de front-end com critério passado cobre integralmente o requisito neste corte; não significa que o requisito foi excluído. As APIs (pacotes 1.4.x) ficam para o Marco 2.

| Requisito | Pacotes | Situação no corte | Lacuna |
| --- | --- | --- | --- |
| **RQ01** — Total mensal, próximas cobranças ordenadas e consumo frente às metas | 1.3.2, 1.3.4 | Parcial; sem pacote verificado | Total, ordenação e consumo funcionam (22, 24, 35); “Em -7 dias”; 1.3.2 e 1.3.4 falharam |
| **RQ02** — Identificar assinaturas recorrentes por extrato e confirmar em lote | 1.3.5 | Parcial; sem pacote verificado | Detecção e confirmação persistem (40 a 42); faltam UC15 e UC16, rejeição de layout e verificação dos limiares |
| **RQ03** — Cadastrar, consultar, editar, pausar e excluir assinatura com histórico | 1.3.2 | Operações atendidas; sem pacote verificado | Todas as operações persistem (13 a 20); o pacote falhou por consistência (Q-01) |
| **RQ04** — Definir teto por categoria e acompanhar consumo | 1.3.4 | Parcial; sem pacote verificado | Falta exclusão de teto (UC12) |
| **RQ05** — Acessar cancelamento do provedor e manter catálogo (administrador) | 1.3.3, 1.3.6 | Parcial; sem pacote verificado | Link existe (29); sem CRUD do catálogo, sem perfil Administrador e sem tutorial |
| **RQ06** — Distribuição, ranking, projeção do mês seguinte e custo anual | 1.3.6 | Funções de relatório atendidas; sem pacote verificado | Cálculos conferidos (50 a 52); falta o tutorial |
| **RQ07** — Usabilidade móvel e perfis distintos (Usuário e Administrador) | 1.3.1 | Parcial | Móvel atendido (10); perfis distintos não existem (31) |
| **RQ08** — CSV como formato; sem pagamentos nem conexão direta a bancos ou cartões | 1.3.5 | Parcial | Não há pagamento real nem conexão a banco ou cartão (58); a validação do formato CSV é deficiente (47, 48) |

Nenhum dos oito requisitos está integralmente atendido neste corte.

## 5. Questões e mudanças solicitadas

### Registro de questões

Prazos propostos pela gerência. Os donos seguem o Dicionário da EAP e precisam ser confirmados pela PSW (Q-14).

| ID | Questão e evidência | Pacote / requisito | Dono | Prazo |
| --- | --- | --- | --- | --- |
| Q-01 | Cobrança vencida exibida como “Em -7 dias” no painel (23). Corrigir estado e texto de cobrança vencida. | 1.3.2 / RQ01 | Ronald | 19/10/2026 |
| Q-02 | Não demonstrados: abertura da página externa do link de cancelamento (54) e fluxo principal só com teclado (59). Reteste independente. | 1.3.1, 1.3.3, 1.3.6 | Gerência | 16/10/2026 |
| Q-03 | Cadastro, edição e exclusão de serviço não existem; o catálogo é fixo (25 a 27; UC05, UC07, UC08). | 1.3.3 / RQ05 | Thiago | 19/10/2026 |
| Q-04 | Não há perfil Administrador distinto do usuário comum (31, 32). | 1.3.1 e 1.3.3 / RQ05, RQ07 | Ronald | 19/10/2026 |
| Q-05 | Não há exclusão de teto; definir zero mantém a categoria com R$ 0,00 (37, 38; UC12). | 1.3.4 / RQ04 | Equipe de desenvolvimento (responsável a nomear) | 19/10/2026 |
| Q-06 | Não há histórico de arquivos importados nem descarte persistente de lançamento (45, 46; UC15, UC16). | 1.3.5 / RQ02 | Rodrigo | 19/10/2026 |
| Q-07 | CSV com colunas diferentes e PDF chegam à revisão como “Analisado” com zero resultados; arquivo vazio não gera mensagem (47 a 49). | 1.3.5 / RQ02, RQ08 | Rodrigo | 19/10/2026 |
| Q-08 | Reimportar o mesmo arquivo repete entradas no histórico de pagamentos (43). | 1.3.5 / RQ02 | Rodrigo | 19/10/2026 |
| Q-09 | `teste.csv` tem 9 lançamentos; os limiares do Plano (mínimo de 10 lançamentos, 80% de reconhecimento) não podem ser medidos (41). Fornecer arquivo de teste adequado. | 1.3.5 / RQ02 | Rodrigo | 16/10/2026 |
| Q-10 | Não há tutorial de uso dentro da aplicação (53); a orientação de cancelamento se limita a um link e uma frase curta (30). | 1.3.6 / RQ05, RQ06 | Ronald e Thiago | 19/10/2026 |
| Q-11 | Conta nova abre painel e relatório com zeros, sem mensagem explícita de lista vazia (55). | 1.3.6 | Ronald | 19/10/2026 |
| Q-12 | F5 em tela interna volta ao painel; as telas internas ficam sob `/painel` (11). Resultado divergente entre testadores; reteste. | 1.3.1 | Ronald | 19/10/2026 |
| Q-13 | A PSW não forneceu commit, tag ou data de congelamento; não é possível confirmar que a versão testada é a de 06/10 nem se a entrega foi parcial ou atrasada (1, 61). | Linha de base / todos | PSW (responsável a nomear) | 16/10/2026 |
| Q-14 | Responsáveis atuais por pacote não foram confirmados após a saída de um integrante (63). | Todos | PSW (responsável a nomear) | 16/10/2026 |
| Q-15 | O Dicionário e o Plano marcam os pacotes 1.3.x como Marco 2, e a orientação vigente define o front-end como Marco 1. Formalizar a interpretação e atualizar os artefatos. | Linha de base / todos | Gerência | 16/10/2026 |

### Registro de mudanças e decisões de escopo

Não foi localizada solicitação de mudança aprovada para nenhum dos itens abaixo (62). Até a decisão do patrocinador, a linha de base original permanece vigente.

| ID | Mudança ou esclarecimento | Situação observada | Decisão pedida ao patrocinador | Prazo |
| --- | --- | --- | --- | --- |
| CHG-01 | Redução de 1.3.3: remover cadastro, edição e exclusão de serviço (UC05, UC07, UC08). Ver Q-03. | Catálogo fixo no código; sem aprovação formal. | Aprovar a redução ou manter o critério original e pedir a conclusão. | 16/10/2026 |
| CHG-02 | Redução de 1.3.5: remover histórico de arquivos (UC15) e descarte persistente (UC16). Ver Q-06. | Não implementados; prioridade baixa não é autorização de mudança. | Aprovar a redução ou manter o critério original e pedir a conclusão. | 16/10/2026 |
| CHG-03 | UC12: exclusão real do teto ou “definir zero” como substituto. Ver Q-05. | Definir zero mantém a categoria com R$ 0,00. | Aprovar a interpretação e atualizar a linha de base, ou exigir a exclusão. | 16/10/2026 |
| CHG-04 | Ação “Confirmar Pagamento”, fora da EAP, feita sem solicitação de mudança (56). | Registra “Pago” e avança a próxima cobrança; não processa pagamento real (58). | Incorporar formalmente ao escopo, ou registrar como detalhe interno do pacote com justificativa. | 16/10/2026 |
| CHG-05 | Telas “Criar Conta” e “Esqueceu a senha?” (57). | Presentes na aplicação; falta confirmar se constam na linha de base. | Confirmar se estão no escopo ou incorporá-las formalmente. | 16/10/2026 |

## 6. Próximas ações e decisões pedidas ao patrocinador

| Ação ou decisão | Responsável | Prazo |
| --- | --- | --- |
| Informar commit ou tag do congelamento da entrega, confirmar se foi parcial ou atrasada e confirmar os responsáveis por pacote (Q-13, Q-14). | PSW | 16/10/2026 |
| Decidir CHG-01 a CHG-05. | Patrocinador | 16/10/2026 |
| Corrigir as questões Q-01 e Q-03 a Q-12 e apresentar evidências de teste de cada correção. | PSW, donos indicados | 16/10/2026 e 19/10/2026, conforme a seção 5 |
| Formalizar a separação Marco 1 (front-end com backend simulado) e Marco 2 (API própria) e atualizar Plano, EAP, Dicionário e matriz de rastreabilidade após as decisões (Q-15). | Gerência e PSW | 19/10/2026 |
| Retestar os itens não demonstrados (Q-02). | Gerência | 16/10/2026 |
| Realizar verificação independente da versão corrigida, antes da decisão de aceite. | Verificador independente a designar | 23/10/2026 (proposto) |
| Iniciar nesta semana o apontamento de horas por aluno e por atividade do cronograma, com esforço restante. As horas não entram neste relatório; são insumo do Status Report 2. | PSW e Gerência | 16/10/2026 |

**Decisão formal de aceite:** reservada ao patrocinador, depois deste relatório e da verificação independente. Nenhum item é marcado como aceito neste documento.

---

## Pontos a confirmar antes de entregar (apagar esta seção na versão final)

1. **Data de corte e versão testada.** O corte usado é 06/10, mas a ferramenta usou 12/10. Obtenham o commit da PSW em 06/10 (`git log --until="2026-10-06 23:59"`) e confirmem que o código testado corresponde a ele; se houve commits depois, refaçam a bateria nessa versão.
2. **Respostas divergentes entre vocês e a ferramenta:** item 4 (build: vocês não sabiam, a ferramenta diz que passou), item 5 (`npm run server`), item 6 (backup do `db.json`: vocês não fizeram, a ferramenta diz que fez e restaurou), item 11 (F5 voltando ao painel) e item 12 (a ferramenta viu dois usuários; confirmem que o `db.json` tem mais de um). Rodem `git status` e `git diff frontend/db.json` para garantir que o `db.json` não ficou com dados inseridos por vocês (como o valor do Spotify); se ficou, restaurem a base original a partir do git.
3. **Reproduzam vocês mesmos** os itens que decidem o resultado: 16 a 20, 23, 25 a 27, 37, 38, 43, 45 a 49, 53, 55 e 56. O professor compara este relatório com a verificação dele, e uma diferença sem explicação pesa contra o grupo.
4. **Conferir contra o Plano (seções 2.2 e 2.3):** matriz RQ01 a RQ08, o que é UC12 e UC18 (se UC18 for só o link de cancelamento, o pacote 1.3.6 pode mudar de resultado), e os limiares de 10 lançamentos e 80%.
5. **Dicionário:** o arquivo verificado é a versão 2.0; confirmem se a vigente é outra.
6. **Decisão do grupo sobre 1.3.2:** as operações passaram, e o “Falhou” vem do critério de consistência (“Em -7 dias”). Se considerarem isso só um defeito de apresentação, o resultado muda para Passou e o defeito permanece em Q-01.
7. **Prazos:** os prazos das seções 5 e 6 são propostas; ajustem à realidade da PSW.
