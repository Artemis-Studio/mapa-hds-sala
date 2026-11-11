# Mapa HDS — Sala de Operações MktOps

> Este arquivo é lido automaticamente toda vez que a Sala é aberta. É ele que faz cada peça sair com a cara da Mapa, sem precisar explicar tudo de novo.
> Base do método herdada e versionada — snapshot `v2026.14`.

---

## ⚠️ REGRA 0 — RESTRIÇÕES DESTE NEGÓCIO

A Mapa trabalha com avaliação psicológica de pessoas e ambientes de trabalho. A comunicação fala **das pessoas e da relação delas com o trabalho**, nunca do prejuízo nem do medo.

- **Sem preço**, parcela ou valor por avaliação em qualquer peça.
- **Sem linha financeira como argumento principal** ("contratação errada custa X% do salário", "prejuízo", "ROI"). Decisão da Mapa.
- **Sem medo de multa ou fiscalização** na NR-01 ("multas pesadas", "interdição", "o fiscal vai cobrar"). O trabalho da Mapa vai além da norma.
- **Cliente pelo nome** (empresas da carteira) só com autorização confirmada, peça a peça.
- **Sem citar concorrente pelo nome** e sem atacar quem usa outra ferramenta. Comparar instrumento com instrumento, de forma genérica ("perfil de 4 tipos", "questionário genérico").
- **Parceiros de tecnologia e white label** não são citados sem autorização.
- **Validação do Conselho Federal de Psicologia / SATEPSI** só entra em peça depois de confirmado o parecer (ver `brand-context.md` §4).
- **Número de prova:** até a Mapa padronizar, use só "mais de 1 milhão de avaliações". Nada de quantidade de clientes nem de anos de mercado.
- Saúde mental sem promessa clínica ("previne burnout", "acaba com o assédio") e sem diagnóstico individual em público.
- **Personalidade e Psicossocial em peças separadas.** São compradores diferentes. Só a linha "operação de risco" junta os dois.

**Antes de produzir qualquer texto, ler o `brand-context.md` na raiz desta pasta.** Os pontos marcados **[GAP]** ainda não podem ir pra peça pública.

---

## ⚠️ REGRA 1 — MÉTODO PRIMEIRO

A Sala já sabe executar as tarefas de marketing mais comuns. Nunca escreva do zero o que o método já sabe fazer:

1. Identificar o tipo de tarefa
2. Consultar `copy-routing.md` (o índice por intenção)
3. Ler as instruções da rotina indicada
4. Executar

Se nada cobrir o caso, execute manualmente e diga por quê.

Esta Sala traz o **catálogo completo** em `.claude/skills/`, não só as rotinas de copy do `copy-routing.md`: pesquisa e estratégia, anúncios por plataforma e auditoria de conta, SEO, CRO de página e formulário, e-mail, conteúdo, vídeo, precificação, lançamento e documentos (Word, PDF, planilha, apresentação). O Claude escolhe a rotina pela descrição de cada uma. Para copy, o `copy-routing.md` continua sendo a porta de entrada.

Algumas rotinas dependem de um motor que não vem nesta pasta (vídeo em Remotion, documento de aprovação, quadro branco, slideshow em lote). Quando uma delas pedir um motor ausente, entregue o texto e avise que a parte visual precisa do motor instalado.

---

## ⚠️ REGRA 2 — GATE DE QUALIDADE SEMPRE ATIVO

Todo texto — anúncio, carrossel, e-mail, artigo, roteiro, legenda, página — passa por `copywriting-guardrails` antes de virar arquivo final. Isso elimina os vícios que fazem um texto soar como escrito por máquina. Anúncio passa **também** por `copy-format-check`, que confere os limites de caractere de cada plataforma.

**Isso não depende de ninguém lembrar.** Um gate automático bloqueia a finalização se uma peça for salva em `conteudo/` ou `entregas/` sem a revisão ter rodado.

---

## ⚠️ REGRA 3 — A CAMADA ESTRATÉGICA CARREGA SOZINHA

`cerebro-de-copy/` é a camada de cima do método: hooks e aberturas, arquitetura de argumento, pontes, corpo de texto, fechamentos, engenharia de oferta, tratamento de objeção e o checklist de anti-padrões.

**Ninguém precisa pedir por ela.** A tabela do `copy-routing.md` diz quais arquivos cada tipo de peça carrega, em dois níveis:

- **Rotina** (padrão): peça de manutenção — variação de anúncio, e-mail do dia a dia. Prioridade é velocidade.
- **Estratégica**: peça decisiva — lançamento, oferta nova, posicionamento novo, página de vendas. Carrega a coluna completa.

Na dúvida entre os dois, suba para Estratégica. `11-anti-padroes.md` entra sempre — é o checklist antes de publicar.

---

## ⚠️ REGRA 4 — ANTES DE ESCREVER ANÚNCIO, OLHE PARA FORA

Copy de anúncio não nasce de intuição quando dá para ver o mercado.

1. Se houver histórico em `relatorios/`, leia o mais recente. Hook, ângulo e oferta com melhor resultado são o ponto de partida da próxima rodada.
2. Se `relatorios/` estiver vazia, leia `spy/SINTESE-CONCORRENCIA.md`. Se ela tiver mais de 30 dias ou o assunto for um concorrente específico, rode a espionagem de novo:

```bash
node automacao/spyops/spy-ads.js --page-id <id-da-página> --out "spy/<slug>"
```

3. Sem histórico e sem espionagem, escreva assim mesmo e **declare na entrega**: "primeira rodada é hipótese".

Anúncio que o concorrente roda há meses é anúncio que funciona. Isso é dado, não palpite — e não se inventa: ou saiu no arquivo, ou não existe.

---

## ⚠️ REGRA 5 — CARROSSEL EM 4 ATOS

Carrossel segue o `playbook-narrativas-mktops.md` — 12 slides:

- **Ato 1 · Narrativa (1–4):** uma história que se sustenta sozinha
- **Ato 2 · Princípio (5–7):** a lição que a história revela
- **Ato 3 · Aplicação (8–10):** o que isso muda para quem está lendo
- **Ato 4 · Oferta (11–12):** a Mapa como consequência natural

A arte sai do mesmo lugar que o texto. Depois da copy aprovada:

```bash
bash automacao/paper-designs/novo-carrossel.sh carrossel-<tema>
# escrever slides.json → node gerar.js → imagens em out/
```

**Nunca gerar arte de copy que ainda não foi aprovada.**

---

## ⚠️ REGRA 6 — FORMATO DE ENTREGA DE ANÚNCIO

Anúncio estático entrega **somente o texto**, pronto para colar no gerenciador:

```
## #N Anúncio
**Headline:** …
**Subheadline:** …
**Descrição:** …   ← só quando necessária
**CTA:** …
```

Proibido no arquivo final: explicação de conceito, sugestão de imagem, tabela-resumo, comentário sobre a própria copy. Estratégia se explica na conversa, não dentro do arquivo.

---

## ⚠️ REGRA 7 — IDENTIDADE VISUAL

Toda peça visual sai de `design-system/design-system.md`, que é o Manual de Identidade Visual 2025 da Mapa. **Nenhuma cor que não esteja nesse arquivo entra numa peça.**

- `design-system/guia-visual.html` mostra tudo aplicado (logo, cores, letras, faixas e as peças-padrão). Abra no navegador antes de desenhar.
- `design-system/tokens.css` traz as cores e as fontes prontas para qualquer HTML.
- Os logos estão em `design-system/logo/`: laranja pra fundo claro, branco pra fundo escuro ou foto, preto pra quando o laranja disputa com a imagem, e os dois avatares de rede social.
- Títulos em **Poppins Bold**, corpo em **Roboto Regular**, texto alinhado à esquerda.
- Destaque é **cor**: laranja `#FF560B` só em título grande sobre branco, vermelho `#D94021` em texto menor e âmbar `#FF971A` sobre fundo escuro. Sem itálico, sublinhado ou contorno.
- **Roxo e lilás são proibidos** (cor de concorrente direto).
- O motor de carrossel (`automacao/paper-designs/`) já sai com a identidade da Mapa.
- Algumas rotinas citam a paleta do método (Paper `#F3EEE6`, Ink, DM Sans, glifo recortado). **Nesta Sala ela não vale:** toda peça usa só a identidade da Mapa.

---

## Quem é a Mapa HDS

Empresa de Human Data Science de Belo Horizonte: une ciências humanas e ciência de dados pra entender pessoas e a relação delas com o trabalho. Mais de 80% do time é formado por psicólogos. A história começa em 1984, com avaliação de pessoas no papel; o primeiro teste próprio é de 2003.

Avalia **pessoas, relações e ambiente** numa plataforma com serviço de psicólogos:
- **Teste de Personalidade** — validado pelo Conselho Federal de Psicologia, até 48 traços. Seleção, promoção, sucessão e liderança.
- **Inventário Psicossocial** — gestão do risco psicossocial do ambiente (NR-01): matriz de risco, visão por área, cargo e GHE, plano de ação.
- **Inventário Socioemocional** — jovens entrando no mercado (aprendiz, trainee).
- **Diagnósticos de campo**, **parametrização** de competências sob medida, **certificação** e **Programa de Parcerias** pra consultorias de RH e clínicas de SST.

Mais de 1 milhão de avaliações aplicadas. Carteira forte em operação de risco: aviação, mineração, siderurgia, logística, indústria.

**Esta Sala foi entregue com pesquisa de mercado, espionagem de anúncios, contexto de marca e identidade visual já feitos.** O `brand-context.md` ainda tem pontos **[GAP]** que dependem de confirmação da Mapa.

## Cliente ideal

- **Personalidade:** gestora de RH formada em psicologia e psicóloga organizacional, em empresa consolidada com RH estruturado. Chega porque já usou a Mapa em outro emprego, por projeto interno ou por vaga crítica. Dor nº 1: "o instrumento que usamos é raso ou pouco científico".
- **Psicossocial:** RH de gestão e SST (engenheiro de segurança, QSMS, médico do trabalho) em empresa que precisa gerir risco psicossocial e não confia no método da clínica nem tem os dados na mão. Em conta grande, compra de comitê.
- **Operação de risco:** mineração, porto, aviação, manutenção industrial. É onde Personalidade e Psicossocial entram juntos.
- **Parceiros:** consultorias de RH e clínicas de SST que atendem empresa média e grande.

## Tom de voz

Humano, técnico sem ser duro, respeitoso com quem é avaliado. Equilíbrio entre empresa e trabalhador: o trabalhador precisa ser ouvido e ter o diagnóstico correto. Explica com a clareza de uma psicóloga experiente falando com um gestor. Imagem de gente brasileira trabalhando de verdade, fora do escritório sempre que possível.

**Bandeira central:** o diagnóstico correto. Instrumento validado e lido por psicólogo, pra empresa decidir certo e pra pessoa ser tratada com justiça.

## Objetivo do momento

1. Abrir a linha de **Personalidade** nos anúncios (hoje só roda Psicossocial e Parcerias).
2. Primeira linha de **vídeo com gente da casa** (psicóloga explicando, marketing em formato de conteúdo).
3. LP própria do **Programa de Parcerias** e nova versão da LP do Planner NR-01, sem tom de multa.
4. Jornadas no CRM: venda cruzada pra quem só usa Personalidade e recompra do Psicossocial antes do próximo ciclo.
5. Fechar os **[GAP]** do `brand-context.md`.

---

## Onde está o quê

```
mapa-hds/
├── CLAUDE.md                       ← este arquivo
├── brand-context.md                ← quem a Mapa é de verdade (lido antes de toda peça)
├── copy-routing.md                 ← "quero X → use Y" (comece por aqui)
├── playbook-narrativas-mktops.md   ← o modelo de carrossel
├── cerebro-de-copy/                ← a camada estratégica (carrega sozinha)
├── automacao/
│   ├── paper-designs/              ← motor que desenha os carrosséis
│   └── spyops/                     ← motor que lê os anúncios dos concorrentes
├── design-system/                  ← identidade visual, logos e guia
├── pesquisa-mercado/               ← a pesquisa do mercado
├── spy/                            ← o que os concorrentes estão anunciando
├── relatorios/                     ← números mês a mês
├── conteudo/                       ← peças em produção
│   └── 2026-10-28/                 ← 3 carrosséis com arte + 3 reels prontos e o projeto que os gera
└── entregas/                       ← finais por mês
```

---

## Como trabalhar aqui

- **Primeira vez nesta máquina:** se `node_modules/` não existir, rode `./preparar.sh` (ou peça "prepara o motor de render") antes da primeira arte ou espionagem. Texto funciona sem isso.
- Peça em português. Não existe comando para decorar.
- Pedido bom tem três partes: **o que** · **para quem** · **com que ângulo**.
- Peça em produção fica em `conteudo/`; quando for aprovada, vai para `entregas/<mês>/`.
- Nada é enviado para lista, publicado ou disparado sem aprovação explícita na hora.
- Chave de acesso vai no `.env` — nunca dentro de um documento, nunca no chat.

---
*Sala configurada em 2026-10-28 · método v2026.14*
