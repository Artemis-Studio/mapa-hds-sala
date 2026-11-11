# SpyOps — pipeline de espionagem da Meta Ad Library

Pipeline determinístico pra espionar anúncios de qualquer anunciante/keyword na Meta Ad Library **sem token e sem login**, incluindo download e análise dos vídeos. Funciona com qualquer modelo: os scripts fazem o trabalho, o modelo só roda e analisa.

## Regras duras (pra qualquer modelo que operar isso)

1. **NUNCA buscar por palavra-chave achando que aquilo filtra o anunciante.** A busca da Ad Library faz **match amplo**: `--q "Ramper"` devolve anúncio de qualquer um que tenha aquela palavra em algum lugar — numa varredura real isso trouxe 78 cards de apps de vídeo chineses, nenhum da Ramper. Pra ler o que **um** anunciante roda, o caminho é `--page-id` (ver a seção seguinte).
2. **NUNCA usar Playwright.** O motor é Puppeteer, instalado na raiz da Sala pelo `preparar.sh`. Playwright é vetado aqui.
3. **NUNCA tentar a API oficial `/ads_archive` antes de checar o status.** Ela retorna erro `2332002` (ID confirmation pendente em facebook.com/ads/library/api). Enquanto não destravar, o caminho é este pipeline. Não perder tempo re-testando a cada sessão.
4. **NUNCA reinventar o scraping.** Os scripts abaixo já resolvem listagem, scroll, parsing, extração de vídeo, download, frames e transcrição. Se algo faltar, editar o script — não escrever outro do zero.
5. **Rodar sempre da raiz da Sala** — é lá que o `preparar.sh` instalou o motor.
6. Saída de análise vai em `spy/<slug-do-alvo>/` (kebab-case, pt-BR).

## Antes do passo 1 — achar o page id

**Caminho principal (desde 10/2026): pelo nome, no autocomplete da própria Ad Library.**
Responde sem login e traz page id, @ do Instagram e seguidores — escolhe-se a página certa pelo @:

```bash
node automacao/spyops/buscar-anunciante.js "Fundação Dom Cabral" ["outro nome" ...]
```

O `resolver-page-id.js` (abaixo) virou plano B: sem login o Facebook manda o `facebook.com/<handle>`
pra tela de login ou devolve id errado (20/10/2026: "hotmart" caiu numa página aleatória com 0 ads,
"fundacaodomcabral" não resolveu; o buscar-anunciante achou os dois de primeira).

```bash
# plano B: page id a partir do @ do Facebook do concorrente
node automacao/spyops/resolver-page-id.js rampersoftware

# 2. rode a espionagem com o id
node automacao/spyops/spy-ads.js --page-id <id> --country BR --status active --out "spy/ramper"
```

O handle costuma estar no rodapé do site do concorrente (`facebook.com/<handle>`). O
script imprime o id e já monta a linha do `spy-ads.js`.

**Como saber se o id está certo:** a página da Ad Library abre com as abas **Ads** e
**About**. Se elas não aparecem, o id está errado — e o "0 anúncios" que você vê não quer
dizer que o concorrente não anuncia, quer dizer que você olhou pro lugar errado.

**Como saber se um zero é real:** rode o mesmo comando num **anunciante de controle**,
alguém que você sabe que está com campanha no ar. Se ele devolve cards e o alvo devolve
zero, o zero é verdadeiro.

E um limite que não dá pra contornar: a Ad Library só guarda anúncio comercial **enquanto
ele está ativo**. Zero anúncio hoje é fato; "nunca anunciou" não é conclusão.

**Pessoa pública com perfil pessoal (Marçal, Cariani): o resolver erra.** `facebook.com/<handle>`
de perfil pessoal devolve o id do **perfil**, e a Ad Library mostra 0 anúncio (aconteceu em 09/2026
com `pablomarcal1` e `renatocariani`). O caminho: buscar por keyword pelo nome, achar um anúncio
com `page_name` certo no `spy-ads.json` e tirar o page id da página de detalhe do anúncio:

```bash
node automacao/spyops/pageid-from-ad.js --from-json "spy/<slug>/kw-nome/spy-ads.json"   # 1 linha por page_name
node automacao/spyops/pageid-from-ad.js 1437217604887513                                   # ou library ids avulsos
```

Imprime page id + curtidas da página (proxy de tamanho). Influenciador costuma anunciar por página
secundária de poucas curtidas ("Pablo Marçal - SP", 879) — o IG é o número de tamanho que importa.

## Passo 1 — Raspar os anúncios

```bash
node automacao/spyops/spy-ads.js --url "<URL completa da Ad Library>" --out "spy/<slug>"
# ou por keyword / page id:
node automacao/spyops/spy-ads.js --q "concorrente.com" --out "spy/<slug>"
node automacao/spyops/spy-ads.js --page-id 353858751328296 --out "spy/<slug>"
```

Aceita a URL colada do navegador (com `q=`, `view_all_page_id=`, filtros etc.). Rola a página até estabilizar (default 40 scrolls) e escreve:

- `spy-raw-innertext.txt` — texto integral (fonte da verdade; consultar quando o parser falhar)
- `spy-raw-hrefs.json` — links externos = **destinos do funil** (l.facebook.com já decodificado no JSON final)
- `spy-ads.json` — cards parseados (id, data de início, página, copy, duração de vídeo, CTA, low-impressions) + grupos por copy + contagem de destinos
- `spy-ads.md` — resumo legível por criativo

## Passo 2 — Baixar e "assistir" os vídeos

```bash
node automacao/spyops/spy-videos.js --from-json "spy/<slug>/spy-ads.json" --sample 5 \
  --out "spy/<slug>/videos" --frames --transcribe
```

- `--from-json … --sample N` pega 1 library_id de cada um dos N maiores grupos de criativo (cobre os masters). Ou passe `--ids "id1,id2"` manualmente.
- **Como funciona:** a página de detalhe do ad expõe as URLs `.mp4` do fbcdn (network + JSON embutido), mas em **pool do anunciante** — não 1:1 com o ad. O de-para é por **duração**: o card da listagem mostra `0:00 / 0:41` e o script nomeia cada arquivo pela duração sondada via ffprobe.
- **`--order` decide quem sobrevive ao `--max`.** Quando o pool tem mais vídeos únicos que o teto, `spread` (default) pega N durações equidistantes — cobre curto, médio e longo. `asc` pega os mais curtos, `desc` os mais longos. O script imprime o que baixou e o que descartou, sempre.
  - Por que o default é `spread`: até 08/2026 o script ordenava por duração decrescente e cortava no teto, então **entregava só os vídeos longos**. Numa análise real os 5 mais curtos ficaram de fora e eram justamente os criativos de retargeting e os ângulos mais transferíveis — a primeira análise saiu incompleta por isso. Vídeo curto raramente é "versão reduzida"; costuma ser outro ângulo.
  - Para reproduzir o comportamento antigo: `--order desc`.
- `--frames` gera mosaico (1 frame a cada 4s, grade 4×3) pra "ver" o vídeo com a tool Read.
- `--transcribe` chama o Whisper (ver **Pré-requisitos da etapa de vídeo**, no fim). Default pt-BR; use `--lang auto` se o áudio puder ser em inglês. Vídeo sem transcrição útil = vídeo só com música → analisar pelo mosaico.

## Passo 2b — Baixar as ARTES dos anúncios estáticos

Conta que roda estático (a maioria fora de infoproduto) tem a copy que importa **queimada na imagem**, não na legenda. `spy-ads.js` só pega a legenda — as artes vêm daqui:

```bash
node automacao/spyops/spy-images.js --url "<mesma URL da Ad Library>" --out "spy/<slug>/imagens"
# ou: --q "marca.com" | --page-id 123456
```

- **Rodar contra a LISTAGEM, nunca contra a página de detalhe.** A página `?id=<library_id>` embute o **pool de imagens do anunciante inteiro** (~19 URLs em `original_image_url`, idênticas de um ad pro outro) — o mesmo problema dos `.mp4` no `spy-videos.js`. Puxar dali entrega a mesma arte pra todos os anúncios e a análise sai errada. Na listagem cada card é um nó de DOM com o seu `Library ID` e a sua `<img>`: **de-para 1:1, estrutural**. (Diferente do vídeo, onde o de-para é por duração.)
- Salva `<library_id>.jpg` + `image-index.json` com **hash MD5 por arte**. O índice já aponta arte reaproveitada entre ads — que é o sinal de que o anunciante está **testando copy sobre criativo fixo** (e o inverso, várias artes com uma legenda só, sai comparando o `image-index` com os grupos do `spy-ads.json`).
- Resolução: a listagem serve 480×600 / 600×600. Dá pra ler todo o texto da peça; o original de 1080 não é exposto ali.
- **Ler cada `.jpg` com a tool Read.** Transcrever literalmente topo → miolo → rodapé. É isso que vira a seção 2b do relatório.
- `--min-px 300` descarta avatar e ícone · `--only "id1,id2"` limita a ads específicos.

## Passo 3 — Funil (landing pages)

Os destinos estão em `spy-ads.json → destinations`. Raspar cada LP com Puppeteer (goto + scroll + `document.body.innerText` + anchors + forms). Se a LP for estática, `curl -sL` resolve. Procurar: preço/lotes, countdown, forms (campos = o que capturam), provedor de checkout (grep por hotmart|kiwify|ticto|eduzz|greenn|hubla|cakto|lastlink|stripe|pagar.me), badge de builder (Lovable/Framer/Webflow), links de WhatsApp.

## Passo 4 — Relatório

Escrever `spy/<slug>/spy-report-<slug>.md` no formato SpyOps da casa (referências: exemplos internos):

1. Snapshot (tabela) · 2. Criativos-mestre com copy literal · **2b. As artes campo a campo** (só quando houver estático: transcrever o texto de dentro de cada imagem, topo → miolo → rodapé) · 3. Análise da copy (ângulos, nível de consciência, o que testam — inclusive se travam copy e giram criativo, ou o contrário) · 4. Desenho do funil (diagrama ASCII) · 5. Amostragem de vídeos (roteiro por corte, transcrição + frames) · 6. O que vale roubar · Limitações.

## Passo 5 — Padrões × dias no ar (`spy-padroes.js`)

Responde "o que funciona nessa conta" numa imagem só. Cada anúncio é rotulado pelo Jev
(hook, ângulo, oferta, prova, consciência, urgência — esquema em
`automacao/jev-api/esquemas/padrao-anuncio.json`) e cruzado com os dias no ar. A tese:
ninguém paga semanas por anúncio que não converte, então **tempo no ar é proxy de
performance**. Proxy, não métrica — conta grande às vezes esquece anúncio ligado, e conta
que gira criativo toda semana (V4, 10/2026: nada passa de 46 dias) cai pra 30 ou 14 sozinha — sem `--limiar`, o script usa 60 e desce quando menos de 10% dos anúncios chega lá.

```bash
node automacao/spyops/spy-ads.js    --page-id <id> --out spy/<slug>/ads-AAAA-MM-DD
node automacao/spyops/spy-images.js --page-id <id> --out spy/<slug>/ads-AAAA-MM-DD/imagens
node automacao/spyops/spy-padroes.js --dir spy/<slug>/ads-AAAA-MM-DD --titulo "Nome" [--limiar N] [--max N] [--rotulador jev|claude]
```

- `--country` dos dois primeiros tem que ser o mesmo (anunciante gringo: `--country US`).
- **O `spy-images.js` também pega a capa dos vídeos** (`kind: "poster"` no índice). O texto queimado na capa entra no OCR e corrige rótulo: na V4, 4 vídeos que a legenda vendia como "escalar sua agência" saíram como franquia depois do OCR da capa.
- OCR pelo Vision do macOS (`ocr-vision.swift`, compila sozinho na 1ª vez em `.ocr-vision`), pt-BR + en. Não precisa de tesseract.
- Saídas em `<dir>/padroes/`: `padroes.html` (gráfico clicável autocontido, miniaturas em base64 — dá pra mandar pra qualquer um), `padroes.md` (leituras + tabelas + os 10 mais antigos), `dados.json`, e os caches `ocr.json` / `jev.jsonl`. O cache do Jev é por hash de perguntas + state: mudou o esquema ou o OCR, só o que mudou é reclassificado.
- Custo: V4 (65 anúncios) US$ 0,006 · Hormozi (775) US$ 0,07, ~2 min com OCR. HTML de 775 anúncios fica em ~7 MB por causa das miniaturas.
- **Limite:** vídeo é lido pela legenda + texto da capa, não pelo áudio. Talking head vs. UGC vs. motion não é distinguível — o "formato" é tipo de mídia + duração, decidido no script.

## Troubleshooting

| Sintoma | Causa | Fix |
|---|---|---|
| `Cannot find module 'puppeteer'` | Rodou fora da Sala | Rodar da raiz da Sala, ou `NODE_PATH="$PWD/node_modules"` |
| Cards demais, de anunciante que não é o alvo | Buscou por `--q` (match amplo) | Resolver o page id e usar `--page-id` (regra 1) |
| 0 cards e a página não mostra as abas Ads/About | Page id errado | O zero não vale — resolver o id de novo (regra 1) |
| 0 cards capturados | Modal de login/cookie travou | O script já tenta Escape + cookie banner; aumentar `--max-scrolls`; conferir `spy-raw-innertext.txt` |
| Todos os ads com a MESMA arte | Coletou imagem da página de detalhe (pool do anunciante) | Usar `spy-images.js`, que ancora no card da listagem |
| API `2332002` | ID confirmation nunca feita | Ignorar e usar este pipeline (regra 2). Destravar em facebook.com/ads/library/api se quiser o modo API do `automacao/meta-api/fetch_ad_library.py` |
| Vídeos repetidos entre ads | Pool do anunciante (comportamento esperado) | De-para por duração (passo 2) |
| Transcrição vazia/lixo | Vídeo só com música | Analisar pelo mosaico de frames |
| ffprobe/ffmpeg ausente | — | `brew install ffmpeg` |
| `.txt` de transcrição não apareceu | Sem Whisper e sem API key — o script **pula calado** | Conferir `transcript_skipped` no `video-index.json`; ver pré-requisitos abaixo |

## Pré-requisitos da etapa de vídeo

`spy-ads.js`, `spy-images.js` e `resolver-page-id.js` rodam só com Puppeteer. O
`spy-videos.js` chama **binário de sistema**, que não é pacote npm e não entra no
`npm install`:

| Programa | Para quê | Como instalar (macOS) |
|---|---|---|
| `ffprobe` | medir a duração de cada mp4 — é o de-para entre vídeo e ad | `brew install ffmpeg` |
| `ffmpeg` | cortar o mosaico de frames e extrair o áudio | `brew install ffmpeg` |
| `whisper` | transcrever o áudio | `brew install openai-whisper` |

Sem `ffmpeg`/`ffprobe`, a etapa de vídeo não roda. Sem `whisper`, ela baixa e corta os
frames normalmente e **pula a transcrição sem reclamar** — o aviso fica em
`transcript_skipped`, dentro do `video-index.json`. Nada disso afeta `spy-ads.js`.

Duas saídas se não quiser instalar o Whisper:

- `OPENAI_API_KEY` ou `GROQ_API_KEY` no ambiente — o script transcreve pela API quando
  acha uma das duas, e prefere a API ao binário local.
- `SPYOPS_WHISPER=/caminho/do/whisper` pra apontar um binário já instalado. Tem que ser o
  **openai-whisper**: o script passa `--model small --output_format txt --output_dir`, que
  o `whisper-cli` do whisper.cpp não entende.

---

## Google Ads / YouTube — `spy-google.js`

A Ad Library da Meta **não vê anúncio de YouTube**. Alvo que compra mídia no Google devolve
0 cards aqui e parece não anunciar (aconteceu com `projetobase.site` em 09/2026: 0 na Meta,
**71 anúncios ativos** no Google). Quando o link que chegou tem `utm_source=Google`,
`gclid`, `gbraid` ou `wbraid`, o caminho é o Transparency Center:

```bash
node automacao/spyops/spy-google.js --domain concorrente.com  --out "spy/<slug>/google-ads"
node automacao/spyops/spy-google.js --advertiser AR0367…      --out "spy/<slug>/google-ads"
node automacao/spyops/spy-google.js --domain x.com --ids "CR1,CR2" --out "…"   # re-raspar só alguns
```

Duas fases: (1) RPC `SearchService/SearchCreatives` sem browser — lista completa, datas de
primeira/última exibição e dias de veiculação; (2) Puppeteer nas creative pages para tirar
**headline** e **YouTube id**, que só existem no safeframe renderizado.

Saída: `gads-creatives.json` + `gads-ads.md` (agrupado por headline, com o reuso de cada
vídeo — o reuso é o que aponta o criativo-mestre).

**Detalhes que custaram tempo:**

- **`--domain` é busca textual e pode misturar anunciantes** apontando pro mesmo site (a própria UI avisa). Para isolar a conta, rodar de novo com `--advertiser <AR…>`, que sai no JSON.
- **O safeframe entra depois do `networkidle2`.** Com espera fixa curta, metade dos criativos volta sem headline e a leitura vira "headline ausente" quando o que houve foi render lento. O script espera o frame do anúncio aparecer; ainda assim sobra uma minoria — re-rodar com `--ids` resolve.
- **O `assets=` da preview URL é protobuf gzipado**, não JSON. Não vale decodificar: headline e vídeo saem do DOM renderizado.
- **Baixar o vídeo:** `yt-dlp` puro dá **HTTP 403** na maioria dos ids. Com `--cookies-from-browser firefox` baixa tudo. O `--extractor-args player_client=…` não resolve (erro "The page needs to be reloaded").
- Região: `2076` = Brasil, no campo `--region`.

## Funil de quiz — `spy-quiz.js`

Quando o anúncio cai num quiz antes da VSL (VQuiz e similares), este script percorre as telas
e devolve a copy completa, o tracking e o destino:

```bash
node automacao/spyops/spy-quiz.js --url "<url do quiz COM as UTMs do anúncio>" --out "spy/<slug>/quiz"
```

- `steps.json` — texto de cada etapa, opções clicáveis e cadeia de navegação.
- `apis.json` — as respostas JSON. É onde estão as duas coisas que importam: o **quiz inteiro
  como a plataforma entrega** (headline por bloco, opções, scripts, `createdAt`/`updatedAt` —
  dá para ver quando o alvo mexeu no funil) e a **resposta do RedTrack** com o `clickid` e o
  `rtkcmpid` da campanha daquela variante.

**Passar a URL com as UTMs originais do anúncio.** Sem elas o tracking não resolve e o destino
final pode não ser o mesmo. Comparar o `rtkcmpid` de cada rota de quiz é o que revela teste de
pré-frame: rotas diferentes com campanha de tracking própria e a mesma VSL no fim.

**Quiz no Inlead (`inlead.digital/<slug>` ou domínio próprio com rodapé "Criado via inlead.digital"):
usar `spy-inlead.js`.** O conteúdo vem criptografado em `__NEXT_DATA__.props.pageProps.q` e o
`spy-quiz.js` trava na primeira tela com campo de nome. O `spy-inlead.js` intercepta o `JSON.parse`
antes da página carregar e salva o quiz decifrado inteiro — blocos, ramos, textos da oferta, links de
checkout — **sem clicar e sem digitar nada**:

```bash
node automacao/spyops/spy-inlead.js --url "https://inlead.digital/<slug>[,<url2>...]" --out "spy/<slug>/quiz"
```

Gera `<slug>.json` + `<slug>-resumo.txt` (campos de captura, preços, checkout, textos). O resumo é
triagem: preço e captura se confirmam no `.json`.

**Quiz em código próprio (Vue/Next):** a config inteira costuma estar num `<script>` grande da página
(`get S()` com as telas, lógica de diagnóstico, links de checkout e A/B). `curl` + ler o maior script
resolve sem clicar.

**Nunca enviar o formulário de contato do quiz**, nem com dado falso: cria lead no CRM do alvo. Tudo o
que vem depois da captura está no JSON (Inlead) ou no script (código próprio).

O clique do botão final costuma não navegar em headless (o script de tracking reescreve o href
no clique). O destino verdadeiro está no bloco `button` do JSON do quiz — e a cadeia até o
checkout se segue por `curl` no endpoint do RedTrack (`/<rtkcmpid>?format=json` devolve o
clickid; `/click/1?clickid=<id>` devolve 302 para o checkout, e 400 sem clickid).

---

## Transcrição do áudio

Se o `openai-whisper` não estiver instalado, o `--transcribe` do `spy-videos.js` pula
calado. A alternativa que funciona bem
é **whisper.cpp** (`whisper-cli`, via brew), com o modelo `ggml-small` baixado uma vez para
`modelos/ggml-small.bin`:

```bash
ffmpeg -i video.mp4 -vn -ac 1 -ar 16000 -c:a pcm_s16le audio.wav -y
whisper-cli -m "modelos/ggml-small.bin" -l pt -f audio.wav -otxt -of saida
```

Transcreveu uma VSL de 30min48s em poucos minutos, com qualidade suficiente para análise de
copy (erra nome próprio e sigla).
