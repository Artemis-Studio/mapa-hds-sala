---
name: montar-operacao
description: "Monta do zero a estrutura de trabalho com IA de um negócio — a pasta, o arquivo de contexto que o Claude lê em toda sessão, o contexto de marca, os números que já existem e a primeira peça pronta na mesma sessão. Uma skill só: sem instalação, sem terminal, sem pacote pra baixar. Acionar quando: a pessoa disser 'quero montar minha operação', 'montar minha estrutura', 'configurar minha pasta', 'começar do zero com IA', ou estiver numa pasta vazia perguntando por onde começa."
---

# Montar a operação

Do outro lado está o dono do próprio negócio. Ele tem pouco tempo, não é técnico e não sabe o que pedir. Em uma sessão ele precisa sair com quatro coisas: a pasta montada, o contexto do negócio escrito, o histórico que ele já tem registrado e uma peça pronta pra usar.

Leva de 20 a 30 minutos. Diga isso na abertura. Boa parte do tempo é você trabalhando enquanto ele espera.

## Como conduzir

Você já sabe criar pasta, escrever arquivo, abrir site e pesquisar. Faça. Não narre o procedimento, não peça permissão a cada passo, não mande ninguém abrir terminal nem instalar nada.

- **Pergunte pouco.** Duas rodadas de pergunta na sessão inteira: as quatro do Passo 1 e a do Passo 6. Nenhuma além dessas.
- **Nunca trave esperando resposta.** Perguntou, siga trabalhando com a hipótese mais provável e diga qual escolheu e por quê. Se vier resposta diferente, você troca.
- **O que faltar, infira e marque como hipótese** dentro do arquivo, com a palavra hipótese do lado. Isso vale pra arquivo interno — dentro de peça que vai ao ar, a regra é outra, e está no Passo 6.
- **Zero jargão.** Não escreva "skill", "plugin", "MCP", "repositório", "markdown", "commit". Diga "arquivo de contexto", "pasta", "método".
- Uma linha de progresso ao fim de cada etapa. Português brasileiro, direto.

## Passo 1 — Descobrir o negócio

Pergunte numa mensagem só:

1. Site e Instagram (ou o que existir)
2. O que vende e por quanto
3. Quem compra
4. Como o cliente chega hoje

Depois pesquise por conta própria, antes de escrever qualquer coisa.

**Conte com o perfil fechado.** Instagram exige login e quase nunca vai abrir pra você — e o público desta skill é justamente quem só tem Instagram. Tente uma vez; falhou, siga. Não peça pra pessoa resolver isso agora.

O que levantar no lugar, sempre com fonte e data:

- **O negócio aparece na busca?** Procure o nome dele e o serviço mais a cidade. Se os concorrentes aparecem e ele não, esse é o buraco mais barato de tapar, e normalmente ninguém contou isso pra ele.
- **Quem disputa o mesmo cliente**, com endereço e o que cada um faz de diferente. Três bastam.
- **A faixa de preço do mercado** pro que ele vende, pra saber se ele está barato, caro ou no meio.
- **Um número público que mexa com a decisão de compra do cliente dele** — tarifa, preço de insumo, prazo, regra nova, juros. É daqui que costuma sair a melhor peça da sessão.

Guarde tudo em `material/AAAA-MM-DD-pesquisa-<assunto>.md`. Sem esse arquivo, a apuração morre com o fim da conversa e a regra "nenhum número sem fonte" fica sem apoio na próxima sessão.

## Passo 2 — A pasta

Monte a estrutura onde vocês estão. Estas cinco, sempre as cinco:

```
CLAUDE.md      ← o contexto que você lê em toda sessão daqui pra frente
marca/         ← voz, objeções da venda, concorrentes
anuncios/      ← tudo que tem verba atrás
conteudo/      ← post, story, e-mail — o que sai sem verba
material/      ← pesquisa, call, print, e-mail de cliente, avaliação
numeros/       ← o que gastou, o que entrou, o que aprendeu — um arquivo por mês
```

As cinco são o esqueleto e nascem juntas, mesmo que uma ou outra passe a primeira semana vazia. A proibição de pasta vazia, lá embaixo, vale pra pasta nova que você inventar além destas.

Quem toca mais de uma marca ou mais de um cliente repete esse desenho dentro de `clientes/<nome>/`. Nenhum nível além disso.

## Passo 3 — O arquivo de contexto

É a peça que faz toda sessão futura começar boa. Escreva o `CLAUDE.md` cheio, com o conteúdo apurado. Modelo em branco não serve.

```markdown
# <Negócio>

## O que é
O que vende, pra quem, por quanto. Uma frase. Depois, uma linha do que ele não é —
a confusão que o cliente faz e que custa venda.

## Quem compra
O cliente real, com as palavras dele. Se forem vários públicos, separe um a um,
com o que cada um teme e o que cada um compra. E escreva a regra: cada peça fala
com um público só.

## Como falamos
Tom, com exemplo de frase que a marca diria. E, principalmente, o que ela nunca diz.

## Provas
Números, casos, depoimentos. Cada um com data e origem.
Embaixo, a lista do que falta e vale mais que qualquer anúncio.

## Onde fica o quê
O mapa das cinco pastas, uma linha cada.

## Regras da casa
- Toda copy passa por uma última leitura contra vício de IA antes de sair.
- Nenhum número entra numa peça sem fonte.
- Peça nova começa pelo arquivo mais recente em `numeros/`. Enquanto não houver
  o que ler, começa pelo que já se tentou e não funcionou.
```

## Passo 4 — Contexto de marca

Em `marca/contexto.md`:

- **A voz** — três frases que a marca diria e três que ela nunca diria, com o motivo de cada uma. É o que mais economiza tempo depois.
- **As objeções da venda** — o que o cliente pensa antes de pagar, separado por público. Objeção ouvida de cliente vale dez vezes a deduzida; marque qual é qual.
- **Os três concorrentes mais próximos** e o que separa ele de cada um.
- **O buraco** — a desvantagem real, escrita sem maquiagem. É ela que define a primeira peça.

Puxe de material real: site, legendas, e-mail de cliente, avaliação no Google, print de conversa. O que for dedução sua, escreva a palavra hipótese do lado. Nunca invente fato sobre o negócio da pessoa.

Se o perfil não abriu no Passo 1, diga dentro do próprio arquivo que a seção de voz é dedução e o que resolve isso — duas ou três legendas antigas coladas em `material/`.

## Passo 5 — Semear os números

Ninguém chega zerado. Antes de escrever peça, pergunte a si mesmo o que ela já contou e registre em `numeros/AAAA-MM.md`:

- **O que já gastou** em anúncio ou impulsionamento, quanto voltou, e o que ela concluiu daquilo. Concluir errado é comum: R$ 50 num post impulsionado sem oferta e sem destino não prova que anúncio não funciona.
- **O que entra hoje e por qual caminho.** Se ela não mede nada, instale a medição mais barata que existe e diga em uma frase: perguntar "como você soube da gente?" e riscar um tracinho numa folha. Quatro números no fim do mês bastam pra saber onde colocar dinheiro.
- **O que apareceu sozinho** — demanda nova batendo na porta sem ninguém ter feito nada. Costuma ser a peça mais fácil da sessão.
- **A lista do que preencher até o fim do mês**, em caixinhas.

É esse arquivo que a próxima rodada lê. Sem ele, toda campanha recomeça do zero.

## Passo 6 — Uma peça pronta hoje

Pergunte o que é mais urgente — anúncio, post, mensagem pra base — e comece a escrever a que você já sabe ser a mais urgente, dizendo qual escolheu e por quê. Não pare a sessão esperando.

Uma peça fala com **um** público. Se tem verba atrás, salve em `anuncios/`; se sai sem verba, `conteudo/`. Nome do arquivo com a data e o assunto.

Toda peça sai com quatro partes:

1. **A copy**, pronta pra colar. Nada de instrução misturada no meio do texto.
2. **Antes de publicar** — o que só o dono pode preencher: contato, foto, e toda promessa que você deduziu e ele precisa confirmar. Hipótese dentro de arquivo interno é anotação; dentro de peça que vai ao ar é promessa que pode quebrar com cliente pagante. Marque o campo que falta de um jeito impossível de ignorar e diga qual deles impede a publicação.
3. **De onde vieram os números** — cada um com origem e data.
4. **O que anotar depois**, em três linhas, apontando pro arquivo do mês.

**A última leitura.** Passe frase por frase e faça três perguntas:

- *Dá pra conferir?* Se não dá, vira número com fonte ou sai.
- *O concorrente podia assinar essa frase igual?* Se podia, ela não diz nada.
- *Tirando o adjetivo, a frase continua de pé?* Se continua, o adjetivo estava sobrando.

Os cinco que mais aparecem, e a troca:

| Vício | Exemplo | Troca |
|---|---|---|
| Antítese vazia | "não é só uma bike, é liberdade" | corta a frase |
| Superlativo sem prova | "a melhor da região" | número com fonte, ou nada |
| Frase de efeito | "sua jornada começa aqui" | corta a frase |
| Adjetivo no lugar de número | "revisão completa e caprichada" | "revisão completa, R$ 180, pronta no mesmo dia" |
| Promessa que a operação não cumpre | "do quarto mês não custa nada" | o que é verdade, com a conta à mostra |

Uma passada. Releia também o que você escreveu no lugar — a troca costuma trazer o vício de volta por outra porta.

## Passo 7 — A rotina que sustenta

Deixe escrito no `CLAUDE.md` e diga em voz alta no fechamento:

- Peça nova nasce do que já performou, não da cabeça limpa.
- Fim de mês: o que gastou, o que entrou, o que aprendeu → `numeros/AAAA-MM.md`.
- Material novo — print de cliente, foto de serviço, avaliação, e-mail bom — vai pra `material/` no mesmo dia. Senão some.

## O que não fazer

- Criar dezenas de rotinas, comandos e automações. Uma pasta bem descrita rende mais que trinta atalhos que ninguém lembra de chamar.
- Pedir instalação, terminal, chave de API ou qualquer coisa que dependa de alguém técnico.
- Criar pasta além das cinco.
- Entregar a sessão só com arquivo de configuração.
- Fingir que acabou quando faltou material. Dever de casa declarado vale mais que entrega redonda por fora.

## Fechamento

Cinco linhas: o que foi montado, onde está, o que ela tem na mão agora, a rotina em uma frase, e a única tarefa da próxima sessão.

Se o perfil não abriu ou faltou material de peso, diga com todas as letras que a operação fica de pé na segunda sessão, e o que exatamente ela precisa trazer. Nada além disso.
