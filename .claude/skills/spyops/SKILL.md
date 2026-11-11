---
name: spyops
description: "Espiona anúncios de concorrentes na Meta Ad Library (sem token, sem login) e mapeia o funil completo: copy literal de todos os ads ativos, criativos-mestre, destinos, landing pages, pricing, e download + transcrição + frames dos vídeos. Pipeline determinístico Puppeteer em automacao/spyops/ — NUNCA usar Playwright nem tentar a API oficial (travada, erro 2332002). Acionar quando: pedir pra espiar/analisar anúncios de alguém, mandar link da Ad Library, pedir análise de copy+funil de concorrente, ou disser 'SpyOps' / '/spy'. [triggers: espionar anúncios, biblioteca de anúncios]"
---

# SpyOps — Espionagem de Ads + Funil (Meta Ad Library)

Fluxo 100% roteirizado. **Não improvisar acesso**: os scripts em `automacao/spyops/` resolvem tudo. Ler `automacao/spyops/README.md` antes de rodar se algo der errado.

## Regras duras

1. **NUNCA buscar por palavra-chave achando que aquilo filtra o anunciante.** A busca da Ad Library faz match amplo: `--q "Ramper"` devolve anúncio de qualquer um que tenha a palavra em algum lugar — numa varredura real, 78 cards de apps de vídeo chineses e nenhum da Ramper. Pra ler o que UM anunciante roda, o caminho é `--page-id`. Ver **Como achar o page id**, abaixo.
2. **NUNCA usar Playwright** (vetado no repo). O motor é Puppeteer, instalado na raiz da Sala pelo `preparar.sh`.
3. **NUNCA tentar a Graph API `/ads_archive`** — retorna erro `2332002` (ID confirmation pendente). Não re-testar a cada sessão; ir direto pro pipeline.
4. **Rodar sempre da raiz da Sala** pra o `require("puppeteer")` resolver.
5. Saída em `spy/<slug-do-alvo>/` (kebab-case pt-BR).
6. Vídeos: as URLs mp4 vêm em **pool do anunciante**, não 1:1 por ad — o de-para é por **duração** (card mostra `0:00 / 0:41`). Comportamento esperado, não é bug.
7. Imagens: **nunca** puxar da página de detalhe `?id=` — ela embute o pool de imagens do anunciante e devolve a mesma arte pra todo ad. `spy-images.js` ancora cada `<img>` no card da listagem (de-para 1:1).

## Como achar o page id

O handle do Facebook está no rodapé do site do concorrente (`facebook.com/<handle>`):

```bash
node automacao/spyops/resolver-page-id.js <handle-do-facebook>
```

Ele imprime o id e já monta o comando do `spy-ads.js`. Dois testes antes de confiar no
que voltar:

- **O id é válido?** A página da Ad Library abre com as abas **Ads** e **About**. Sem elas o id está errado — e o "0 anúncios" não quer dizer que o concorrente não anuncia, quer dizer que você olhou pro lugar errado.
- **O zero é real?** Rode o mesmo comando num anunciante de controle, que você sabe que está com campanha no ar. Se ele devolve cards e o alvo devolve zero, o zero é verdadeiro.

A Ad Library só guarda anúncio comercial enquanto ele está ativo: zero hoje é fato,
"nunca anunciou" não é conclusão.

## Fluxo

**1. Raspar os ads** (aceita a URL colada pelo usuário, keyword ou page id):

```bash
node automacao/spyops/spy-ads.js --url "<URL da Ad Library>" --out "spy/<slug>"
# ou: --q "dominio.com" | --page-id 123456  (+ --country BR --status active)
```

Gera `spy-ads.json` (cards + grupos por copy + destinos), `spy-ads.md`, e raws.

**2. Baixar e assistir uma amostra dos vídeos** (mínimo 5, cobrindo cada criativo-mestre):

```bash
node automacao/spyops/spy-videos.js --from-json "spy/<slug>/spy-ads.json" --sample 5 \
  --out "spy/<slug>/videos" --frames --transcribe
```

- Ler os mosaicos (`*-mosaic.jpg`) com a tool Read pra descrever o visual.
- Ler as transcrições (`*.txt`). Transcrição vazia/curta = vídeo só com música → analisar pelo mosaico.
- Áudio possivelmente em inglês → `--lang auto`.
- **Precisa de `ffmpeg`, `ffprobe` e `whisper` instalados** — são binários de sistema, não pacote npm. Sem eles esta etapa não roda (o `spy-ads.js` continua normal). Ver a tabela no fim do `automacao/spyops/README.md`.
- **Conferir as linhas `baixando:` / `descartado:` no log.** Quando o pool passa do `--max`, o `--order spread` (default) pega durações equidistantes — curto, médio e longo. Se o log mostrar muita coisa descartada e a análise depender de cobertura, subir o `--max` e rodar de novo. **Vídeo curto quase nunca é versão reduzida do longo — costuma ser outro ângulo** (retargeting, oferta direta). `--order asc|desc` força o extremo, se precisar.

**2b. Baixar e LER as artes dos estáticos** (obrigatório quando a conta roda estático — a copy que importa está dentro da imagem, não na legenda):

```bash
node automacao/spyops/spy-images.js --url "<mesma URL da Ad Library>" --out "spy/<slug>/imagens"
```

- Gera `<library_id>.jpg` + `image-index.json` com hash por arte (aponta arte repetida entre ads).
- **Ler cada `.jpg` com a tool Read** e transcrever literalmente: headline do topo → objeto/prova do miolo → CTA do rodapé. Nunca resumir "é um mockup de celular".
- Cruzar `image-index.json` com os `creative_groups` do `spy-ads.json`: N artes para 1 copy = testam criativo; 1 arte para N copies = testam copy.

**3. Mapear o funil.** Pra cada destino em `spy-ads.json → destinations`, raspar a LP (Puppeteer: goto + scroll + innerText + anchors + forms; ou `curl -sL` se estática). Levantar: preço/lotes, countdown, campos de form, provedor de checkout (grep hotmart|kiwify|ticto|eduzz|greenn|hubla|cakto|lastlink|stripe|pagar.me), builder da página, links de WhatsApp, downsells.

**4. Relatório** em `spy/<slug>/spy-report-<slug>.md`, seções na ordem:

1. **Snapshot** — tabela: nº de ads, criativos-mestre, janela de veiculação, formatos, destinos, CTAs, oferta, pricing, prova social, stack.
2. **Criativos-mestre** — copy literal em blockquote, um por grupo, com contagem de ads/cards, CTAs, durações de vídeo.
3. **Análise da copy** — ângulo, nível de consciência (Schwartz), o que está sendo testado (texto vs. criativo), vícios a evitar.
4. **Desenho do funil** — diagrama ASCII do tráfego ao back-end, com preços.
5. **Amostragem de vídeos** — tabela roteiro-por-corte (demo mostrado + essência da transcrição) + leitura estratégica.
6. **O que vale roubar** — aplicável aos clientes da casa. Nomear cliente quando óbvio.
7. **Limitações** — Ad Library pública não expõe gasto/impressões/segmentação; checkout não acessado.

O relatório fica ao lado dos dados brutos, em `spy/<slug>/`.

## Troubleshooting

Ver tabela em `automacao/spyops/README.md`. Resumo: `Cannot find module 'puppeteer'` → rodar da raiz da Sala; 0 cards → conferir `spy-raw-innertext.txt` e subir `--max-scrolls`; ffmpeg ausente → `brew install ffmpeg`.
