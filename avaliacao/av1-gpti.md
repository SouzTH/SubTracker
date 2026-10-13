# Correção da AV1 — GPTI — SubTracker

Repositório: https://github.com/SouzTH/SubTracker

Artefatos: `documentacao/GPTI/Bussiness Case.md`, `documentacao/GPTI/TermoAbertura.md`, `documentacao/GPTI/Plano_de_Projeto.md`, `documentacao/GPTI/Dicionário da EAP.md`.

A nota é do Grupo E de GPTI e vale para cada aluno do grupo. Nesta etapa, a ausência de commit não zera ninguém. O nome na atividade do cronograma é o contrato da etapa seguinte. A especificação de referência é `documentacao/Prototipagem_SubTracker.md` e o refinamento: assinatura, serviço, teto, extrato e cancelamento, UC01 a UC18. A prototipagem lista Ronald Teixeira de Assis, Rodrigo Américo Nascimento D'Icarahy, Thiago Souza da Silva e Matheus Jasbick.

| Aluno | Nota |
| --- | ---: |
| Davi Luiz Rodrigues da Conceição | 75 |
| Michael Patrick Ferreira da Silva Borba | 75 |
| João Henrique Lima Gualberto | 75 |
| Vinicius da Silva Mendes | 75 |

## Parte comum — 75/100

| Parte | Nota |
| --- | ---: |
| Business case | 10/10 |
| Termo de abertura | 14/15 |
| Escopo e EAP | 14/15 |
| Cronograma com nomes | 10/25 |
| Custo, partes e riscos | 13/15 |
| Dicionário da EAP | 10/15 |
| Um projeto só | 4/5 |

### Business case — 10/10

O caso é o do SubTracker: problema, oportunidade, alternativas, análise financeira em horas da disciplina (esforço restante de 138 h mais 14 h de contingência) e riscos iniciais com resposta, entre eles a saída de um integrante de PSW e a capacidade de 4 h por semana. É o produto da prototipagem, na ordem de grandeza do protótipo.

### Termo de abertura — 14/15

O termo nomeia o patrocinador e os quatro gerentes, a autoridade do patrocinador, os marcos de 05/10, 17/11 e 11/12 e as premissas.

Desconto:

- 1 ponto. A equipe de produto é Ronald, Rodrigo e Thiago. Matheus Jasbick, que a prototipagem e o Grupo 5 oficial incluem, saiu com base numa confirmação oral que o próprio plano registra como lacuna "não corroborada por documentos do repositório" (P9). O termo é o lugar de registrar essa mudança de equipe com a decisão do patrocinador.

### Escopo e EAP — 14/15

A EAP cobre 1.3 frontend e 1.4 API por módulo (assinaturas, serviços, tetos, extratos, relatório), 1.5 integração e testes, 1.6 entrega, e cada pacote aponta os UC que atende. Tetos, extratos e cancelamento da prototipagem estão lá.

Desconto:

- 1 ponto. A seção 7.6 do plano mostra que os pacotes pedem 192 h dos três desenvolvedores contra 108 h de capacidade (178%) e deixa a decisão D4 aberta ao patrocinador para 13/10. A linha de base de escopo está aprovada sem o corte por prioridade que a própria seção 2.2 anuncia.

### Cronograma com nomes — 10/25

A seção 5.2 é uma rede de pacotes com predecessora e tipo de relação, esforço, duração em dias úteis, folga e caminho crítico marcado. A RAM da seção 8.2 põe um A por pacote de produto: Ronald em assinaturas, Rodrigo em extratos e API, Thiago em serviços e tetos.

Descontos:

- 10 pontos. Não há lista de atividades com uma pessoa, uma predecessora e uma duração, nem a tabela semanal com uma pessoa, uma tarefa e as horas. O cronograma para no pacote.
- 5 pontos. Na gestão, a coluna da RAM é "Gerência". A divisão nominal (Davi em 1.1.1, João em 1.1.2, Michael em 1.6.1, Vinicius no controle de mudanças) está escrita como proposta "[confirmar]".

### Custo, partes e riscos — 13/15

A contingência é 10% do esforço, separada dos pacotes e ligada a eventos. Os riscos têm causa, evento e consequência na mesma frase, origem, probabilidade, impacto, resposta, dono e gatilho; R2 é a sobrecarga de 192 h contra 108 h, com quatro opções para o patrocinador; O1 é a oportunidade de reaproveitar componentes, com resposta "explorar" e dono Ronald. A seção 7.6 compara carga e capacidade.

Descontos:

- 1 ponto. O plano declara "Sem reserva de gestão". O molde separa contingência e reserva gerencial.
- 1 ponto. O dono de parte dos riscos e das comunicações é "Gerência", com o nome entre parênteses só em R2.

### Dicionário da EAP — 10/15

Cada pacote tem descrição, entregas, datas, marco, critérios, dependências, recursos, horas e riscos. Ronald, Rodrigo e Thiago estão como responsáveis de vários pacotes de produto.

Descontos:

- 2 pontos. Não há coluna A separada do R. Em 1.3.4 e 1.4.4 (Tetos) o responsável é "Equipe de desenvolvimento"; em 1.1.1, 1.1.2 e 1.6.1 é "Gerência". O plano mesmo anota, em D5, que a RAM precisava de um A nesses pacotes.
- 3 pontos. O critério de aceitação da gestão é "Documentos revisados e consistentes" e "Riscos atualizados, acompanhamento do cronograma e comunicação registrada". Isso não é observável do jeito que o molde pede: o que alguém vê funcionando ou entregue.

### Um projeto só — 4/5

Caso, termo, plano e dicionário descrevem o SubTracker, com os mesmos UC e os mesmos marcos.

Desconto:

- 1 ponto. O caso mede 138 h de esforço restante mais 14 h de contingência (152 h). O plano mede 228 h de pacotes mais 23 h de contingência. As duas linhas de base convivem sem a frase que diga qual é a aprovada.

## O que esta nota deixa para a etapa seguinte

A divisão de gestão está no plano como proposta, entre colchetes de confirmação: Davi Luiz Rodrigues da Conceição em 1.1.1, João Henrique Lima Gualberto em 1.1.2, Michael Patrick Ferreira da Silva Borba em 1.6.1, Vinicius da Silva Mendes no controle de mudanças. Enquanto estiver como proposta, a etapa seguinte cobra o bloco "Gerência", não uma pessoa. Em produto, a RAM marca Ronald nas assinaturas, Rodrigo nos extratos e Thiago nos serviços e nos tetos. Matheus Jasbick não está nessa matriz.
