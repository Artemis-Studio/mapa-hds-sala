---
name: substack-growth
description: "Motor de crescimento orgânico no Substack pras publicações do estrategista da casa ('Notas de IA' e 'Território Humano') — escreve Notes em 10 formatos, forja títulos e subtítulos com base em dados de 94 mil posts, destila artigo em lote de Notes da semana, define a rotina diária e roda a operação de Recommendations. Sempre entrega texto pronto pra colar, na voz do estrategista da casa (fato seco, atribuição externa, zero guru americano). Acionar quando: pedir 'nota pro Substack', 'notes', 'viralizar no Substack', 'título do artigo', 'crescer no Substack', 'o que eu posto hoje', 'transforma esse artigo em notas', ou mencionar Notas de IA / Território Humano pedindo distribuição. Para ESCREVER o artigo longo use substack-hbr-writer — esta skill cuida da distribuição e do crescimento. [triggers: restack, distribuir artigo]"
---

# Substack Growth

Distribuição e crescimento orgânico no Substack. O artigo é escrito por `substack-hbr-writer`; **esta skill faz o resto** — as Notes que trazem o leitor, o título que faz ele abrir, a rotina que compõe e a rede que multiplica.

**Publicações do estrategista da casa:**
- **Notas de IA** — IA aplicada. Público: empreendedor, líder, gente de marketing e negócios que usa ou quer usar IA de verdade. É a que está crescendo — prioridade.
- **Território Humano** — ensaios estilo HBR na interseção de filosofia, cultura e negócios.

---

## Como o Substack funciona (leia se for a primeira vez)

Três coisas que mudam tudo, e que quase ninguém entende:

1. **Notes é a rede social dentro do Substack.** Post curto, tipo X/Twitter. Desde o fim de 2025 o feed **não prioriza quem você segue** — a maior parte do que o leitor vê vem de gente que ele nunca seguiu. Isso significa que Notes é canal de descoberta de estranhos, não de aviso pra base.
2. **Restack é o compartilhamento.** É o que propaga. Curtida quase não move nada. Restack **com comentário** é o mais forte: entra no feed de quem te segue *e* credita o original.
3. **~40% das assinaturas novas nascem dentro do Substack** (Notes, app, Recommendations). Divulgar no LinkedIn é a segunda alavanca, não a primeira.

Detalhes operacionais em `references/como-funciona-substack.md`.

---

## Modos

| Modo | Quando | Entrega |
|---|---|---|
| **NOTAS** (default) | "me dá notas", "o que posto hoje" | N Notes prontas pra colar |
| **TÍTULO** | "título pra esse artigo" | 8 títulos + subtítulos, ranqueados, com o par de A/B test |
| **DESTILAR** | "transforma esse artigo em notas" | 10–15 Notes de um artigo, com calendário |
| **ROTINA** | "o que eu faço toda semana" | Plano operacional da semana |
| **REDE** | "quero recommendations/colabs" | Alvos mapeados + mensagens de abordagem |

Sem modo declarado: **NOTAS**. Se o pedido tiver artigo anexado ou citado: **DESTILAR**.

---

## Voz — o léxico do Becker

**A voz de referência é a do Alex Becker**, medida nas 15 transcrições em `_nao-incluido/Obsidian/8-Sources/marketing-ia/alex-becker/`. O léxico destilado e 36 textos-modelo vivem em `_nao-incluido/textos-lexico-becker.md` e `copy-mktops-voz-becker.md` — **ler antes de escrever qualquer nota.**

Quase todo conteúdo viral do Substack vem do nicho "escritor escrevendo sobre escrever no Substack": vulnerabilidade, "quase desisti", jornada. Não copiar — o ICP aqui é empresário, e melodrama queima autoridade.

### Os movimentos

| Movimento | Como soa |
|---|---|
| Abertura condicional | "Se você roda tráfego, presta atenção aqui, porque isso vai te custar dinheiro." |
| Redução a duas variáveis | "Se resume a duas coisas. Só duas." |
| Escalada em três degraus | "Isso já te fode porque…" → "Mas fica muito pior." → "O assassino de verdade é…" |
| A/B binário | "De qual você quer mais? A) … B) … Obviamente A." |
| Conta jogada no colo | "Faz essa conta. Eu não vou fazer por você." |
| Autodepreciação | "Conta de quinta série, que é o único nível que eu domino." |
| Anti-hype como argumento | "Simples. Chato. E funciona." |
| Admitir o próprio conflito | "Inclusive os meus." |
| Negar o autodiagnóstico | "Você não está atrasado. Você está distraído." |
| Desjargonização declarada | "Deixa eu colocar em português." |
| Analogia suja e concreta | O analista sênior com a memória apagada toda sexta às 18h. |
| Fecho seco | Acaba no veredito. Sem gancho, sem pergunta, sem CTA. |

Tiques de pontuação: `olha`, `beleza`, `na verdade`, `só`, `de verdade`, `aqui`. Reticências isoladas (`Mas…` / `Então…`). Setas `→` nas viradas.

**Regra acima de todas:** parágrafo de uma linha. Linha com vírgula demais, quebra.

### Proibido (ele já rejeitou)

- "Demiti X clientes" / "Recusei R$ Y" — flex disfarçado de confissão
- "Trabalho 4 horas por dia" — anti-hustle clichê
- "Existem 2 tipos de empresário" — tribal split de LinkedIn
- "O pior conselho que já segui foi…"
- Pergunta-pacto ("Você consegue ficar 30 dias offline?")
- Narrativa polida e sofrida ("deitava à noite pensando em…") — coach de produtividade
- Fecho hedgeado, com dois ou três amortecedores ("pode dar certo, mas tem muitos fatores")
- Aterrissar em duas coisas ligadas por "e". Ele aterrissa em uma.
- Número autorrelatado sem fonte. Todo número é conferível ou vai marcado.

### O teste antes de entregar

1. **Tem uma linha que dói?** Se todas são informativas, refaz.
2. **O fecho é veredito ou é pergunta educada?** Tem que ser veredito.
3. **Dá pra ler em voz alta sem tropeçar?** Se não, quebra mais.
4. **Soa como post de LinkedIn?** Joga fora.

---

## MODO NOTAS

### Anatomia de uma Note

```
[GANCHO]        1 linha. Até 12 palavras. É o que aparece no feed antes do "ver mais".
[CORPO]         Até 150 palavras. Linha curta, quebra a cada 1-2 frases.
[VIRADA]        Opcional, no meio: "O que quase ninguém nota:" + insight contraintuitivo.
[FECHO]         Convite à conversa. NUNCA "assine minha newsletter".
```

**Por que o fecho não vende:** o CTA de assinatura no corpo da Note derruba o engajamento, e é o engajamento que distribui. A assinatura acontece no perfil, depois que a pessoa clicou no seu nome. O trabalho da Note é fazer ela clicar no nome.

**Virada (double-hook):** inserir a reviravolta no 3º–4º parágrafo, e não só na abertura, foi associado a ~47% mais compartilhamentos. Não usar em toda nota — usar nas de tese.

**Comprimento:** as notas que mais circulam ficam abaixo de 150 palavras. Não existe limite técnico de caracteres; existe limite de paciência.

**Links externos:** evitar no corpo. Se precisar apontar pra fora, põe no primeiro comentário da própria nota. *(Não há confirmação oficial de penalidade de alcance por link externo — tratar como hipótese barata de respeitar, não como lei.)*

### Os 10 formatos

Rotacionar. Nunca entregar 5 notas do mesmo formato.

**1. Bastidor com número**
O que ele rodou e o resultado, seco. Sem lição.
> *"Rodei uma auditoria de SEO de 480 páginas ontem. 26 minutos. Antes disso era o trabalho de uma semana de um analista."*

**2. Demo de 60 segundos**
Resolve um problema pequeno e real de quem lê, inteiro dentro da nota.

**3. Contrária**
Desafia um consenso sobre IA. Precisa de argumento, não de provocação.
> *"'Engenheiro de prompt' não é profissão. É o nome que a gente deu pra uma incompetência temporária da ferramenta."*

**4. Erro caro**
O que quebrou, quanto custou, o que ele mudou. Sem redenção heroica.

**5. Generosidade**
Aponta trabalho bom de outra pessoa, com o motivo específico. **É o formato que mais converte assinante, apesar de receber menos curtida** — e é o que constrói a relação que depois vira Recommendation.

**6. Destilado**
Um trecho do artigo dele com o gancho reescrito pra funcionar sozinho. O trecho precisa se sustentar sem o artigo.

**7. Observação de campo**
Padrão que ele vê nos clientes da casa. Anonimizado. É a matéria-prima que ninguém mais tem.
> *"Toda empresa que me contrata pra 'automatizar o processo' descobre no diagnóstico que o processo nunca esteve escrito. O trabalho real é escrever."*

**8. Comparação seca**
Antes/depois em número. Duas linhas. Sem adjetivo.

**9. Pergunta genuína**
Uma que ele de fato não sabe responder. Rende comentário — e comentário pesa mais que curtida no algoritmo.

**10. Restack comentado**
Pega nota alheia e acrescenta dado ou contra-argumento próprio. É a forma mais barata de aparecer pra audiência dos outros.

### Distribuição do dia (3 notas)

| Horário | Formato | Função |
|---|---|---|
| 6–9h | Bastidor, comparação, demo | Maior alcance |
| 11–13h | Observação de campo, contrária | Maior engajamento |
| 19–21h | Generosidade, pergunta, erro caro | Mais comentário e conversão |

### Ao entregar notas

- Numerar, marcar o formato de cada uma e o horário sugerido.
- Texto puro, pronto pra colar. Sem comentário sobre a estratégia no meio.
- Rodar `copywriting-guardrails` antes de entregar (obrigatório — Regra 2 do CLAUDE.md).
- Buscar substância real em `docs/artigo-substack-*.md`, `_nao-incluido/` e no vault Obsidian antes de inventar. **Nunca fabricar número de cliente ou resultado.** Sem fonte, marcar `[CONFIRMAR: ___]`.

---

## MODO TÍTULO

Base: análise de 94.391 posts do Substack. Os números medem **reações**, não assinantes — são o melhor dado público disponível, mas correlação com engajamento, não com crescimento. Usar como prior, não como oráculo.

| Alavanca | Efeito | Quantos usam |
|---|---|---|
| Título de 13–17 palavras | 26,8 vs 21,1 reações (+27%) | 43% ainda usa 1–5 palavras |
| Enquadramento negativo ("não", "nunca", "erro", "falha") | 36,1 vs 22,5 (**+60%**) | só 5% |
| Primeira pessoa ("eu", "meu") | 27,9 vs 21,5 (+30%) | só 5,5% |
| Título começando com número | 34,3 vs 23,4 (+47%) | — |
| Contração negativa ("não é", "não faz") | 30,9 (+37%) | — |
| Imagem de capa | 22,9 vs 12,7 (**+81%**) | — |
| Subtítulo de 6–10 palavras | 24,4 — o ponto ótimo | — |
| Interrogação no título | −6,7% em reação, mais comentário | — |
| Dia da semana | Irrelevante (variação de 2,9) | — |

**Regras:**
- Título longo e específico bate título curto e esperto. Mais palavras = mais superfície pra ser específico.
- Nunca repetir o título no subtítulo. Se o título gera curiosidade, o subtítulo entrega clareza. Se o título é claro, o subtítulo dá o motivo de se importar.
- Criar desconforto leve — algo não resolvido. É o que faz clicar.
- Sempre imagem de capa.
- Post longo (2.000+ palavras) tem 35–37 reações contra 14–16 de posts curtos. O formato natural do estrategista da casa já é esse.

**Entrega do modo:** 8 títulos com o subtítulo de cada, marcando a alavanca usada, ordenados por aposta. No fim, indicar **o par pro A/B test nativo** do Substack (testa em 50% da base por 1 hora e manda o vencedor pros outros 50%). Em quase 60% dos testes o título original perde — sempre rodar.

---

## MODO DESTILAR

Artigo → lote de Notes da semana.

1. Ler o artigo inteiro.
2. Extrair: cada número, cada afirmação contraintuitiva, cada cena concreta, cada erro admitido.
3. Converter em 10–15 Notes usando os formatos 1, 3, 6, 7, 8, 9. Cada uma precisa **funcionar sem o artigo** — quem lê a nota não leu o texto.
4. Distribuir em 5 dias, 3 por dia, respeitando a tabela de horários e sem repetir formato no mesmo dia.
5. Uma delas é restack do próprio artigo com comentário novo — e outra é o mesmo restack 2 dias depois, com um ângulo diferente.

Entrega: calendário de 5 dias com as notas prontas.

---

## MODO ROTINA

Ver `references/rotina-e-rede.md` para o plano completo. O núcleo:

**Todo dia (~40 min):** 3 Notes · 10 comentários com substância em notas de outros · 3–5 restacks com comentário · responder todo comentário que chegar.

**Toda semana:** escrever as 15–21 notas em bloco (~30 min) · 1 artigo longo · revisar de onde vieram os assinantes novos.

**Cadência por fase:**

| Fase | Notes/dia |
|---|---|
| Mês 1–2 | 1–3 |
| Mês 3–6 | 3–5 |
| Mês 6+ | 5–7 |

As primeiras 50–100 notas são dado de treino do algoritmo. A composição aparece entre o 4º e o 6º mês. Antes disso, número baixo não significa que está errado.

**A métrica:** assinantes por origem. **Não curtida.** Existe caso documentado de nota com 85 curtidas convertendo 100 assinantes e outra com 12.000 curtidas convertendo os mesmos 100. Quem otimiza curtida otimiza a coisa errada.

---

## MODO REDE

Recommendations é o único ativo que compõe: 25% das assinaturas pagas da plataforma saem dele, e há caso de publicação com 78% dos assinantes novos vindos daí. É **humano** — ninguém recomenda porque você pediu.

Sequência: mapear 20 publicações com público sobreposto (não concorrentes diretas) → engajar de verdade por 2–3 semanas → só então propor. Scripts de abordagem, critérios de seleção e a checklist de infraestrutura de conversão (About, hero post, botão de assinatura) em `references/rotina-e-rede.md`.

---

## Gates

1. `copywriting-guardrails` — obrigatório em todo output desta skill.
2. Teste do guru americano — se soar traduzido de creator de produtividade, refazer.
3. Fato sem fonte vira `[CONFIRMAR: ___]`. Nunca inventar número de cliente, receita ou resultado.
