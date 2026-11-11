---
name: enxoval
description: Monta o enxoval MktOps — o PDF A4 de aprovação que a casa manda pro cliente antes de produzir uma leva de peças de comunicação (anúncios, carrosséis, e-mails, roteiros, LPs). Uma peça por página com arte, copy campo a campo e quadrados de aprovado/ajustar/cortar, mais capa com o lote em números, página de sistema, resumo de veiculação e formulário de retorno. Acionar quando pedir "o enxoval", "enxoval de campanha", "manda pra aprovação", "documento de aprovação", "PDF pro cliente aprovar", ou quando fechar um lote de peças e precisar formalizar a entrega. [triggers: enxoval, aprovação de campanha, doc de aprovação, mandar pro cliente aprovar]
---

# Enxoval MktOps

Quando o estrategista da casa pede **o enxoval**, ele quer este documento — não um markdown,
não um deck, não uma lista no chat. É o PDF A4 que vai pro cliente aprovar peça
a peça antes de qualquer produção.

O formato é canônico e saiu de um documento aprovado. **Não redesenhar, não
propor alternativa, não perguntar onde salvar.** O pipeline está pronto em
`automacao/mktops-enxoval/` — o trabalho aqui é escrever o JSON e rodar.

## Sequência

1. **Ler o pipeline** — `automacao/mktops-enxoval/README.md` tem o esqueleto do
   JSON campo a campo e o exemplo canônico em `enxovais/live-quinta.json`.
   Ler antes de escrever qualquer coisa.

2. **Escrever a copy das peças.** Se as peças ainda não existem, produzir com a
   skill do formato (`ads-create`, `ads-mktops`, `carousel-mktops`,
   `ads-video-scripts`, `market-emails`…) e passar por `copywriting-guardrails`.
   Se já existem, aproveitar o que está aprovado.

3. **Montar o JSON** em `automacao/mktops-enxoval/enxovais/<slug>.json`.
   As artes vão em `automacao/mktops-enxoval/artes/<slug>/`.

4. **Gerar e conferir:**
   ```bash
   cd "automacao/mktops-enxoval"
   node criar-enxoval.mjs <slug> && node conferir.mjs <slug>
   ```
   `conferir.mjs` é obrigatório — a folha tem `overflow:hidden` e texto que não
   coube some sem avisar. Se acusar transbordo, encurtar a copy do campo (não
   mexer no CSS).

5. **Entregar** o `.pdf` de `out/` e dizer quantas páginas saíram.

## Regras do formato

- **Uma peça por página.** Sem agrupar duas numa folha, sem apêndice.
- **A ficha entrega só a copy** — os campos são o que o gestor vai colar no
  gerenciador. `Produção` é a única linha que fala de arte, e fala em uma
  frase, não em briefing. Isso é a Regra 3 do CLAUDE.md dentro do enxoval.
- **O primeiro campo sai em corpo maior** — é a headline. Ordenar pensando nisso.
- **Chips descrevem o eixo da peça**, não o conteúdo: produção, família de
  ângulo, avatar, template. O primeiro fica verde.
- **A página `sistema` é o que segura o lote.** É onde vive a regra que vale pra
  todo criativo (assinatura fixa, o que nunca aparece na arte, formatos). Sem
  ela o lote vira uma pilha de peças soltas. Incluir sempre que houver mais de
  três peças.
- **`resumo` e `aprovacao`** entram quando o cliente vai devolver marcado —
  praticamente sempre. Pular só em enxoval interno.

## Fora de anúncio

O formato serve qualquer entrega de comunicação, não só mídia paga. O que muda
é o `rotuloPeca` e os campos da ficha:

| Entrega | rotuloPeca | Campos típicos |
|---|---|---|
| Anúncio estático | `Anúncio` | Headline · Apoio · Texto primário · Título do link · Descrição · Produção |
| Carrossel | `Carrossel` | Capa · Arco · Oferta · Legenda · Produção |
| E-mail | `E-mail` | Assunto · Pré-header · Abertura · CTA · Envio |
| Roteiro de vídeo | `Roteiro` | Hook · Desenvolvimento · Virada · CTA · Produção |
| Landing page | `Página` | Headline · Subheadline · Prova · Formulário · CTA |

Peça sem arte funciona: é só omitir `arte` e `caption`, e a ficha sobe.

## Não fazer

- Não usar Playwright nem montar render novo — o pipeline é Puppeteer e já está
  configurado.
- Não usar a paleta casa (dark, Exo/Cabin, azul). O enxoval é MktOps.
- Não inventar página nova. São cinco modelos; se algo não cabe neles, cabe
  numa peça ou numa caixa da página de sistema.
- Não encher a ficha de racional estratégico. Se o cliente perguntar por quê,
  o gestor responde no chat.
