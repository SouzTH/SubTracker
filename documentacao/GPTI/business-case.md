# Business Case - SubTracker

**Versão:** 2.0  
**Data:** 03/10/2026  
**Patrocinador:** Diogo Silveira Mendonça  
**Gerentes do projeto:** Davi Luiz Rodrigues da Conceição, João Henrique Lima Gualberto, Michael Patrick Ferreira da Silva Borba e Vinicius da Silva Mendes  
**Equipe de desenvolvimento:** Ronald Teixeira de Assis, Rodrigo Américo Nascimento D'Icarahy e Thiago Souza da Silva

> Este documento justifica o projeto, compara alternativas, resume custo, benefício e risco e recomenda uma opção. Os valores em reais são **hipóteses declaradas** na seção 8.1; nenhum deles é previsão de mercado. Os dados externos foram conferidos nas páginas originais e têm a fonte indicada na seção 12.

## 1. Resumo Executivo

O SubTracker é uma aplicação web responsiva que centraliza as assinaturas recorrentes do usuário, importa extratos em CSV para identificar cobranças recorrentes, acompanha tetos de gasto por categoria, projeta o custo mensal e anual e orienta o cancelamento junto ao provedor.

- **Problema:** muitos consumidores acumulam várias assinaturas, e boa parte dos que cancelam diz não ter aproveitado o serviço como deveria.
- **Solução:** um painel único com total mensal e anual, importação de extrato, metas por categoria e atalho de cancelamento.
- **Estado atual:** front-end implementado (13 dos 18 casos de uso); back-end real, banco de dados, autenticação segura e publicação serão feitos até o Marco 3 (segunda semana de dezembro de 2026).
- **Investimento:** 152 horas de esforço, equivalentes a **R$ 1.520,00** em custo econômico. O desembolso de caixa é **R$ 0,00**, pois nenhum recurso financeiro foi pré-aprovado (Termo de Abertura, seção 11).
- **Resultado financeiro (hipotético, se houver cobrança):** cenário-base com VPL de **R$ 124,54** em 12 meses; o projeto só se paga com cerca de **48 assinantes pagantes** ao fim desse período.
- **Recomendação:** seguir com o desenvolvimento como projeto acadêmico e **adiar a decisão de cobrar** para depois do Marco 3, condicionando-a à validação de demanda (seção 11).

## 2. Problema ou Oportunidade

As cobranças de serviços por assinatura se espalham pelo mês e ficam fáceis de perder de vista. Os dados abaixo foram conferidos nas páginas originais (seção 12).

**Pesquisa Assinaturas 2025 (Opinion Box e Vindi, 2.023 brasileiros, maio de 2025).** Só participaram pessoas que tinham algum tipo de assinatura, então os percentuais não representam toda a população.

- 77% pagam por uma a quatro assinaturas e 19% por cinco a dez.
- 56% gastam entre R$ 51 e R$ 200 por mês com assinaturas, planos e mensalidades recorrentes, e 17% gastam mais de R$ 200.
- 69% têm assinaturas digitais e 20% combinam serviços digitais e físicos.
- 66% já assinaram um serviço só para usar o período gratuito e cancelaram em seguida.
- Entre os que já cancelaram algum serviço, 39% apontaram a sensação de não aproveitar a assinatura como deveriam.

**Abecs (primeiro trimestre de 2026).** Os pagamentos recorrentes com cartões (assinaturas, streamings, academias, clubes e softwares) somaram R$ 41,7 bilhões, 36% a mais que no mesmo período de 2025.

**Oportunidade:** o consumidor sente o peso crescente das assinaturas, mas as ferramentas existentes são genéricas. Falta uma ferramenta simples, focada em assinaturas, que mostre o total, detecte cobranças recorrentes no extrato e facilite o cancelamento.

## 3. Justificativa do Projeto

Se o projeto terminar bem, o **valor que muda** é a capacidade do usuário de ver quanto compromete por mês e por ano e de decidir com dados o que manter, pausar ou cancelar (Termo de Abertura, seção 2). O valor tem dono (o usuário-alvo, consumidores de serviços por assinatura) e é observável (total mensal e anual, ranking dos maiores gastos e consumo das metas por categoria).

Para a equipe, o projeto entrega a experiência de gerenciar e construir um sistema completo (front-end, back-end, banco, testes e publicação), com desembolso de caixa nulo.

## 4. Objetivos de Negócio

Metas propostas, a validar com o patrocinador. "Quando medir" refere-se a datas dos marcos do Termo de Abertura.

| # | Objetivo | Indicador e meta | Quando medir | Quem valida |
| - | -------- | ---------------- | ------------ | ----------- |
| O1 | Entregar o sistema integrado | 100% dos casos de uso do escopo aprovado funcionando com front-end, back-end e banco | Marco 3 (segunda semana de dezembro de 2026) | Patrocinador |
| O2 | Facilitar a descoberta de assinaturas | Em extrato CSV de teste com pelo menos 10 lançamentos, reconhecer 80% ou mais das assinaturas do catálogo presentes | Marco 3 | Gerentes |
| O3 | Dar clareza ao usuário | Em teste com 5 usuários-alvo, pelo menos 4 encontram o total mensal e a projeção anual em até 30 segundos | Marco 3 | Gerentes |
| O4 | Controlar o custo | Desembolso de caixa de R$ 0,00 e custo econômico de até R$ 1.520,00 (152 h) até o Marco 3 | Marco 3 | Patrocinador |
| O5 | Viabilidade da cobrança (hipotético) | Se houver cobrança, atingir 48 assinantes pagantes ou mais em 12 meses (ponto de equilíbrio do VPL) | 12 meses após o lançamento | Equipe e patrocinador |

## 5. Solução Proposta

O SubTracker é uma aplicação web responsiva (Termo de Abertura, seção 5).

**Dentro do escopo:** gestão de assinaturas e serviços (catálogo, serviço personalizado e controle de status), importação de extrato em CSV com conciliação, histórico de cobranças, projeção de gastos mensais e anuais por categoria com tetos orçamentários, relatório de impacto financeiro e links e orientações de cancelamento.

**Fora do escopo:** pagamento ou processamento financeiro real, cancelamento automático no provedor, integração direta com bancos ou cartões, sincronização com serviços externos e aplicativos nativos.

**Estado atual (repositório em 03/10/2026):** front-end em React com dados simulados por `json-server`; 13 dos 18 casos de uso implementados. Pendentes até o Marco 3: back-end real, banco de dados, autenticação segura, publicação, integração e testes. A situação de UC05, UC07, UC08, UC15 e UC16 depende de decisão do patrocinador (ver `EAP.md`, seção 4).

## 6. Benefícios Esperados

### Cadeia de valor

| Elo | No SubTracker |
| --- | ------------- |
| Saída | Sistema integrado, testado e publicado |
| Entrega | Usuário com acesso ao painel, ao relatório, à importação de extrato e aos atalhos de cancelamento |
| Resultado | O usuário passa a ver o total recorrente, as metas por categoria e os maiores gastos |
| Benefício | Economia: cancelar uma única assinatura de R$ 20/mês poupa R$ 240/ano, cerca de 2 vezes o custo anual do SubTracker a R$ 9,90/mês (R$ 118,80) |
| Desbenefício | O usuário precisa informar dados financeiros e mantê-los atualizados; a equipe consome horas e terá custo de manutenção |

### Benefícios tangíveis

- Receita hipotética de assinaturas do próprio SubTracker (seção 8).
- Economia do usuário ao cancelar serviços pouco usados (exemplo acima).
- Custo de caixa zero durante o projeto (Termo de Abertura, seção 11).

### Benefícios intangíveis

- Conhecimentos adquiridos pela equipe em desenvolvimento e gerenciamento de projetos.
- Maior organização financeira do usuário.
- Portfólio acadêmico com sistema publicado.

## 7. Alternativas Consideradas

| Opção | Custo | Benefício | Risco | Parecer |
| ----- | ----- | --------- | ----- | ------- |
| A. Não fazer nada (planilha ou controle manual) | R$ 0,00; custo é o tempo do usuário | Nenhum ganho novo | Assinaturas esquecidas continuam; sem projeção nem alerta | Não resolve o problema |
| B. Usar app financeiro genérico (ex.: Mobills) | Versão gratuita com limitações e plano Premium pago (preço vigente não verificado) | Ferramenta madura, com controle de contas, receitas, despesas e cartões | Foco amplo em finanças pessoais, não específico em assinaturas e cancelamento | Alternativa real, mas generalista |
| C. Desenvolver o SubTracker | R$ 1.520,00 em horas; R$ 0,00 de caixa | Foco em assinaturas, importação de extrato, metas e link de cancelamento | Baixa adoção, concorrência e capacidade limitada da equipe (4 h por semana por pessoa) | **Recomendada** |

**Trade-off:** a opção C troca maturidade de produto por foco no problema e custo de caixa zero; só se justifica financeiramente se houver adoção (seção 8.9).

## 8. Análise Financeira

### 8.1 Premissas financeiras

Todas são hipóteses declaradas e devem ser revisadas quando houver dados reais.

| # | Premissa | Valor |
| - | -------- | ----- |
| P1 | Valor da hora de trabalho: salário de referência de programador de R$ 1.500/mês, 6 h/dia em escala 5x2 (30 h/semana). Divisor padrão de 150 h/mês (30 ÷ 6 x 30) | R$ 10,00 por hora, bruto, sem encargos |
| P2 | O mesmo valor da hora é usado para os gerentes (só foi informado o do programador) | R$ 10,00 por hora |
| P3 | Esforço restante: 138 h (88 h de programação e 50 h de gestão) mais 14 h de reserva de contingência de 10% (`Dicionário da EAP`, seção 5) | 152 h |
| P4 | O esforço do front-end já feito não foi registrado e é custo afundado; fica fora do investimento | Excluído |
| P5 | Horizonte de análise | 12 meses |
| P6 | Taxa de desconto: meta Selic de 13,75% ao ano (desde 16/09/2026), convertida em taxa mensal | 1,079% ao mês |
| P7 | Preço hipotético da assinatura premium; não há referência de preço de mercado verificada | R$ 9,90 por mês |
| P8 | Adoção: assinantes pagantes crescem linearmente de zero até o valor do cenário no mês 12 | Pessimista 15, base 50, otimista 120 |
| P9 | Hospedagem paga sem restrição de uso comercial (o plano gratuito do Vercel só permite uso não comercial): Render Starter e Postgres mais domínio, no limite superior da faixa de R$ 71 a R$ 76/mês, com câmbio de R$ 5,2226 por dólar. O front seria servido junto com a API (a confirmar no pacote 1.4.1) | R$ 76,00 por mês |
| P10 | Manutenção após o projeto: 4 h por mês | R$ 40,00 por mês |
| P11 | Taxas de meio de pagamento, impostos e marketing não foram considerados | R$ 0,00 |
| P12 | O investimento ocorre integralmente no mês 0 (visão conservadora) | R$ 1.520,00 |

### 8.2 Investimento inicial

| Item | Horas | Custo |
| ---- | ----- | ----- |
| Programação (3 pessoas) | 88 | R$ 880,00 |
| Gestão (4 gerentes) | 50 | R$ 500,00 |
| Subtotal | 138 | R$ 1.380,00 |
| Reserva de contingência (10%) | 14 | R$ 140,00 |
| Infraestrutura durante o projeto (plano gratuito, uso acadêmico) | – | R$ 0,00 |
| **Investimento inicial (custo econômico)** | **152** | **R$ 1.520,00** |

O **desembolso de caixa é R$ 0,00**: o Termo de Abertura (seção 11) informa que nenhum recurso financeiro foi pré-aprovado e que o projeto usa horas dos integrantes, o repositório GitHub e ferramentas gratuitas. O **custo econômico** é o valor dos recursos consumidos mesmo sem saída de dinheiro: aqui, as 152 horas dos integrantes valoradas a R$ 10,00 por hora. Ninguém será pago, mas essas horas poderiam ter outro uso, e ignorá-las faria o projeto parecer gratuito. Por isso entram na análise como investimento, de forma conservadora.

**Origem das horas** (pacotes do `Dicionário da EAP.md`, versão 3.0; são estimativas por julgamento, sem base histórica de projetos anteriores):

| Grupo | Pacotes (horas) | Total |
| ----- | --------------- | ----- |
| Programação | 1.3.7 (4), 1.4.1 (12), 1.4.2 (16), 1.4.3 (12), 1.4.4 (8), 1.4.5 (8), 1.4.6 (8), 1.5.1 (12), 1.5.2 (8) | 88 h |
| Gestão | 1.1.1 (16), 1.1.2 (20), 1.5.3 (6), 1.6.1 (8) | 50 h |

### 8.3 Benefícios esperados (receita hipotética)

Receita mensal = preço (R$ 9,90) x assinantes pagantes do mês. Custo operacional = R$ 76,00 de hospedagem + R$ 40,00 de manutenção = **R$ 116,00 por mês**.

### 8.4 Fluxo de caixa (cenário-base: 50 pagantes no mês 12)

| Mês | Pagantes | Receita | Custo operacional | Investimento | Fluxo líquido | Valor presente | Acumulado |
| --- | -------- | ------- | ----------------- | ------------ | ------------- | -------------- | --------- |
| 0 | 0,0 | R$ 0,00 | R$ 0,00 | R$ 1.520,00 | -R$ 1.520,00 | -R$ 1.520,00 | -R$ 1.520,00 |
| 1 | 4,2 | R$ 41,25 | R$ 116,00 | – | -R$ 74,75 | -R$ 73,95 | -R$ 1.594,75 |
| 2 | 8,3 | R$ 82,50 | R$ 116,00 | – | -R$ 33,50 | -R$ 32,79 | -R$ 1.628,25 |
| 3 | 12,5 | R$ 123,75 | R$ 116,00 | – | R$ 7,75 | R$ 7,50 | -R$ 1.620,50 |
| 4 | 16,7 | R$ 165,00 | R$ 116,00 | – | R$ 49,00 | R$ 46,94 | -R$ 1.571,50 |
| 5 | 20,8 | R$ 206,25 | R$ 116,00 | – | R$ 90,25 | R$ 85,53 | -R$ 1.481,25 |
| 6 | 25,0 | R$ 247,50 | R$ 116,00 | – | R$ 131,50 | R$ 123,30 | -R$ 1.349,75 |
| 7 | 29,2 | R$ 288,75 | R$ 116,00 | – | R$ 172,75 | R$ 160,24 | -R$ 1.177,00 |
| 8 | 33,3 | R$ 330,00 | R$ 116,00 | – | R$ 214,00 | R$ 196,39 | -R$ 963,00 |
| 9 | 37,5 | R$ 371,25 | R$ 116,00 | – | R$ 255,25 | R$ 231,74 | -R$ 707,75 |
| 10 | 41,7 | R$ 412,50 | R$ 116,00 | – | R$ 296,50 | R$ 266,32 | -R$ 411,25 |
| 11 | 45,8 | R$ 453,75 | R$ 116,00 | – | R$ 337,75 | R$ 300,13 | -R$ 73,50 |
| 12 | 50,0 | R$ 495,00 | R$ 116,00 | – | R$ 379,00 | R$ 333,19 | R$ 305,50 |

### 8.5 Valor presente (VP) e valor presente líquido (VPL)

O VP traz cada fluxo ao valor de hoje: VP = fluxo ÷ (1 + 1,079%)^mês. No cenário-base:

- VP dos benefícios (receitas): R$ 2.943,60.
- VP dos custos (investimento mais custos operacionais): R$ 2.819,06.
- **VPL = R$ 2.943,60 - R$ 2.819,06 = R$ 124,54** (positivo, mas pequeno).

### 8.6 Payback

No cenário-base, o payback ocorre no **mês 12** (o acumulado passa de -R$ 73,50 para +R$ 305,50), tanto simples quanto descontado.

### 8.7 ROI, TIR e benefício-custo

- **ROI** = lucro líquido acumulado em 12 meses ÷ investimento inicial. No cenário-base, R$ 305,50 ÷ R$ 1.520,00 = **20,1%**.
- **TIR:** 1,9% ao mês (cerca de 25,4% ao ano), acima da taxa de desconto de 1,079% ao mês.
- **Benefício-custo (B/C)** = VP dos benefícios ÷ VP dos custos = **1,04**.

### 8.8 Cenários e sensibilidade

| Cenário | Pagantes no mês 12 | Receita em 12 meses | VPL | Payback | TIR | B/C | ROI |
| ------- | ------------------ | ------------------- | --- | ------- | --- | --- | --- |
| Pessimista | 15 | R$ 965,25 | -R$ 1.935,98 | Não ocorre em 12 meses | Negativa | 0,31 | -128,1% |
| Base | 50 | R$ 3.217,50 | R$ 124,54 | Mês 12 | 1,9% ao mês | 1,04 | 20,1% |
| Otimista | 120 | R$ 7.722,00 | R$ 4.245,58 | Mês 7 | 19,3% ao mês | 2,51 | 316,4% |

No cenário pessimista, o ROI fica abaixo de -100% porque o custo operacional também gera prejuízo, além do investimento.

**VPL com outros preços e infraestrutura:**

| Variação | Pessimista (15) | Base (50) | Otimista (120) |
| -------- | --------------- | --------- | -------------- |
| Preço R$ 9,90 | -R$ 1.935,98 | R$ 124,54 | R$ 4.245,58 |
| Preço R$ 14,90 | -R$ 1.489,98 | R$ 1.611,20 | R$ 7.813,58 |

- Com hospedagem de R$ 238,35/mês (Vercel Pro mais Supabase Pro mais domínio) e manutenção, o VPL do cenário-base cai para **-R$ 1.693,59**.
- **Sem cobrança** (projeto acadêmico), o VPL é de **-R$ 1.520,00**: o retorno não é monetário (seção 6).

### 8.9 Ponto de equilíbrio

- O VPL zera com cerca de **48 assinantes pagantes** ao final de 12 meses (cenário de crescimento linear).
- Em regime, o custo operacional mensal de R$ 116,00 é coberto com cerca de **12 assinantes pagantes** (R$ 116,00 ÷ R$ 9,90).

## 9. Premissas e Riscos Iniciais

### 9.1 Premissas e risco associado

As premissas do produto estão no Termo de Abertura (seção 8). As premissas financeiras (P1 a P12, seção 8.1) têm este risco associado:

| Premissa | Risco se estiver errada |
| -------- | ----------------------- |
| P1 e P2: R$ 10,00/h para programadores e gerentes | Custo real maior (encargos ou salário superior) e investimento subestimado |
| P3: 152 h de esforço | Estouro de horas; a capacidade informada é de 4 h por semana por pessoa |
| P6: taxa de desconto de 13,75% ao ano | Mudança da Selic altera o VPL |
| P7: preço de R$ 9,90/mês, sem referência de mercado verificada | Usuários podem não aceitar pagar; preço menor reduz a receita. Validar o preço com pesquisa antes de cobrar |
| P8: 50 pagantes no mês 12 | Sem divulgação, a adoção pode ficar no cenário pessimista |
| P9: hospedagem de R$ 76/mês | Custos de hospedagem maiores que o previsto |
| P11: sem taxas, impostos e marketing | Margem real menor que a calculada |

### 9.2 Riscos iniciais

| Risco | Probabilidade | Impacto | Resposta |
| ----- | ------------- | ------- | -------- |
| Atraso no desenvolvimento | Média | Alta | Replanejamento das atividades |
| Ausência de integrantes da equipe (um integrante de PSW já trancou matrícula) | Baixa | Alta | Redistribuição das tarefas ou cancelamento do projeto |
| Mudanças nos requisitos | Alta | Média | Revisões frequentes do escopo |
| Dificuldades de comunicação entre os participantes | Média | Média | Alertar o patrocinador |
| Baixa participação dos integrantes da equipe | Baixa | Alta | Alertar o patrocinador |
| Baixa adoção pelos usuários | Alta | Alta | Validar a demanda antes de cobrar; decidir a monetização só após o Marco 3 |
| Concorrência de apps financeiros genéricos | Alta | Média | Manter o foco em assinaturas, extrato e cancelamento; preço abaixo do app genérico |
| Monetização indefinida e restrição de uso comercial da hospedagem gratuita | Média | Média | Revisar a hospedagem antes de cobrar (custo de R$ 76/mês na premissa P9) |
| Exposição de dados financeiros por falha de segurança | Média | Alta | Senha com hash, isolamento por usuário e testes de segurança (pacotes 1.4.2 e 1.5.2) |
| Capacidade limitada (4 h por semana por pessoa) | Média | Alta | Reserva de contingência de 10% e corte por prioridade com aprovação do patrocinador |

## 10. Viabilidade

### Viabilidade técnica

O front-end em React 19, Vite e TypeScript já funciona com 13 dos 18 casos de uso (README e `Refinamento da Prototipagem`, seção 4). Falta o back-end real, o banco, a autenticação segura e a publicação, com 88 h de programação previstas contra uma capacidade de cerca de 120 h até a segunda semana de dezembro (folga de aproximadamente 23 h após a contingência). A equipe ainda não comprovou o back-end real, e esse é o principal ponto de atenção.

### Viabilidade econômica

O desembolso de caixa é nulo (Termo de Abertura, seção 11). O custo econômico das horas é R$ 1.520,00. Se houver cobrança, o VPL do cenário-base é positivo, mas a margem é estreita: R$ 124,54, com ponto de equilíbrio em cerca de 48 assinantes contra 50 do cenário-base. A viabilidade da cobrança precisa ser testada antes de ser assumida.

### Viabilidade operacional

O sistema usa fluxos simples (cadastro em dois passos, painel, importação de CSV) e há um manual de utilização no repositório. A meta O3 (teste com 5 usuários-alvo) mede se o uso dispensa treinamento. O sistema não armazena dados de cartões (Termo de Abertura, seção 6.2).

## 11. Recomendação Final

**Seguir** com o desenvolvimento do SubTracker (opção C), porque o custo de caixa é zero, o custo econômico é de R$ 1.520,00 e o produto ataca um problema documentado em pesquisas: consumidores com várias assinaturas, parte delas pouco aproveitada.

**Adiar** a decisão de cobrar. O VPL do cenário-base é positivo, mas apenas por R$ 124,54, e o resultado depende de adoção sem marketing e de premissas ainda não validadas. Recomenda-se decidir a monetização depois do Marco 3, desde que haja evidência de demanda de pelo menos 48 assinantes pagantes em 12 meses. Se a cobrança for adotada, rever a hospedagem, pois o plano gratuito do Vercel só permite uso não comercial.

## 12. Fontes e referências

- Termo de Abertura do SubTracker, versão 1.0 (seções 2, 5, 6, 8, 10 e 11).
- Repositório github.com/SouzTH/SubTracker: README, `documentacao/Cronograma.md` e `documentacao/Refinamento_da_Prototipagem_SubTracker.md`.
- `EAP.md` e `Dicionário da EAP.md`, versão 3.0 (esforço de 138 h e contingência de 14 h).
- Selic: o Copom reduziu a meta de 14% para 13,75% ao ano em 16/09/2026 (Poder360 e Itatiaia, 16/09/2026).
- Pesquisa Assinaturas 2025 (Opinion Box e Vindi, 2.023 brasileiros, maio de 2025): InvestNews, "Tudo por assinatura", 18/05/2026.
- Percentuais de assinaturas digitais (69%) e motivos de cancelamento: Exame, 16/08/2025.
- Pagamentos recorrentes com cartões no 1º trimestre de 2026 (R$ 41,7 bilhões, +36%): Panorama Abecs, 11/05/2026.
- Mobills: descrição pública do aplicativo na App Store (versão gratuita com limitações e plano Premium).
- Câmbio de R$ 5,2226 por dólar (28/09/2026) e preços de lista de hospedagem (Vercel, Render e Supabase) consultados entre agosto e setembro de 2026; podem mudar e devem ser reconfirmados antes de qualquer contratação.
