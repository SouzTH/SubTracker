# Correção da AV1 — PSW — SubTracker

Repositório: https://github.com/SouzTH/SubTracker

A nota de cada aluno é a parte comum do grupo mais a qualidade individual. Quem não tem commit no aplicativo recebe a parte comum do grupo, sem a parte individual. A parte comum vale 60 pontos: stack da disciplina (30) e escopo funcionando (30). Os 40 restantes avaliam a qualidade do que o próprio aluno fez.

| Aluno | Nota |
| --- | ---: |
| Thiago Souza da Silva | 96 |
| Ronald Teixeira de Assis | 96 |
| Rodrigo Americo Nascimento D'Icarahy | 60 |
| Matheus Jasbick Conceicao Machado | 0 |

## Parte comum — 60/60

A correção usou a branch `main`. O README pede o JSON Server e o Vite a partir de `frontend`. Subi `npm run server` na porta 3000 e `npm run dev` em `http://127.0.0.1:5174`. O `json-server` 1.0.0-beta.15 avisa que prefere um Node mais novo. Com o Node 20 desta máquina, o servidor escreveu que estava na porta 3000 e a tela atendeu. Entrei com `admin@teste.com` e senha `1234`.

A stack vale 30/30.

- 5 pontos. React. As rotas de `frontend/src/App.tsx` são `/`, `/cadastro`, `/esqueci-senha` e `/painel`. Lista, cadastro, edição, detalhe, relatório, importação e perfil são telas trocadas por estado dentro de `/painel`.
- 5 pontos. React Hook Form com `zodResolver` no cadastro da assinatura, na edição, no perfil, na importação, no login e na senha.
- 5 pontos. Zod valida esses formulários.
- 5 pontos. TanStack Query 5 grava com `useMutation` em pausar, confirmar pagamento, excluir, editar, cadastrar, perfil e importação. `frontend/src/lib/api.ts` rejeita a resposta quando `response.ok` falha.
- 5 pontos. O JSON Server sobe com `npm run server`.
- 5 pontos. Tailwind 4 entra pelo plugin do Vite.

O escopo vale 30/30. A régua é `documentacao/Refinamento_da_Prototipagem_SubTracker.md`. UC05, UC07 e UC08, o catálogo administrativo de serviços, e UC15 e UC16, o histórico e o descarte de extrato, ficam de fora desta conta. O próprio refinamento marca as cinco como fora da entrega, depois da orientação para reduzir o escopo quando um integrante saiu. O catálogo permanece em `frontend/src/constants/catalog.ts`, e a opção "Outro" continua no cadastro. Zerar a meta cumpre a exclusão do teto, como a UC12 descreve.

- 12 pontos, assinatura. O cadastro da Disney+, R$ 33,90, apareceu no painel e em `GET /subs`. A edição gravou R$ 44,90. Pausar gravou o status Pausada. Excluir devolveu 404 para `GET /subs/An1B_MLkzWw`.
- 10 pontos, teto. Em Meu Perfil, Streaming passou para 150 e Música para 0. `GET /users` do `admin1` devolveu esses dois valores. O painel mostrou Streaming como R$ 55,90 / R$ 150,00 e Música como limite R$ 21,90 / R$ 0,00.
- 8 pontos, extrato. O arquivo `teste.csv` (colunas data, descrição e valor) abriu a revisão com 6 assinaturas. Supermercado, Uber e iFood ficaram de fora da lista. Netflix, Spotify e Academia vieram como confirmação de pagamento. Adobe Creative, GitHub Pro e Canva Pro foram criadas. `GET /subs?userId=admin1` ficou com esses seis nomes, um de cada. O relatório de outubro mostrou o total R$ 272,70 e 6 assinaturas. O link "Cancelar no Provedor" está na ficha da assinatura.

Os dois commits de gestão do Ronald, o business case e o envio de arquivos, ficam de fora da nota de PSW.

## Thiago Souza da Silva — 96

O frontend inicial está no commit `8a484b3`, "feat: desenvolvimento inicial do frontend do projeto", com o e-mail `Thiago.souza.th3@gmail.com`. Esse commit cria o painel, o cadastro, a ficha, o relatório e a importação. A nota reúne os 60 pontos do grupo e 36 de qualidade.

O painel, o relatório e o cadastro que a correção usou continuam nessa estrutura.

Desconto na parte individual:

- 2 pontos. `frontend/index.html`, no mesmo commit, deixa o título da página como `<!-- figma:title -->`.
- 2 pontos. `frontend/src/screens/Dashboard.tsx` escreve `Em ${days} dias` para qualquer distância. Com a próxima cobrança da Netflix em 05/10/2026 e a correção em 13/10/2026, o painel mostrou "Em -8 dias". O mesmo texto apareceu na Spotify e na Academia.

## Ronald Teixeira de Assis — 96

React Hook Form, Zod, TanStack Query, a edição, o login e o motor de importação estão nos commits de TeTeuTX e Ronald Teixeira de Assis, com o e-mail `ronaldteixeirardr@gmail.com`. A nota reúne os 60 pontos do grupo e 36 de qualidade.

A Disney+ foi editada, pausada e excluída por essa camada, e a importação do CSV gravou as três assinaturas novas e atualizou as três que já existiam.

Desconto na parte individual:

- 2 pontos. O commit `dd1f287` coloca estilo direto na cor e no degradê em `SubscriptionDetails.tsx`, `Dashboard.tsx`, `Report.tsx`, `ImportStatement.tsx` e `EditSubscription.tsx`.
- 2 pontos. `frontend/src/screens/ImportStatement.tsx` acrescenta o lançamento ao histórico sempre que a linha casa com uma assinatura já existente. Depois da importação, a Netflix do `admin1` tinha o pagamento de 05/09/2026 repetido no histórico.

## Rodrigo Americo Nascimento D'Icarahy — 60

O único commit no nome dele é `185f198`, "corrigindo README", autor Ramerico11, e-mail `rodsamerico2005@gmail.com`. O diff tem três linhas no `README.md`. A tela de extrato, que o refinamento atribui a ele, está no commit inicial do Thiago e no motor de importação do Ronald. A nota é a parte comum do grupo, 60 pontos. Sem commit no aplicativo, não há parte individual a avaliar.

## Matheus Jasbick Conceicao Machado — 0

Não há commit no nome dele. O refinamento registra que ele trancou a disciplina e que os tetos ficaram com a equipe. A meta que a correção gravou está no perfil implementado pelo Ronald. Com o trancamento, a AV1 fica 0.
