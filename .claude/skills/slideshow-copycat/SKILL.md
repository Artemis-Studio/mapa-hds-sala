---
name: slideshow-copycat
description: "Produz em volume slideshows de TikTok (photo mode) e carrosséis de Instagram copiando a ESTRUTURA dos virais dos últimos 7 dias num nicho: coleta os posts recentes dos perfis do nicho com views e salvamentos, compara cada um com a média do próprio perfil, baixa os slides dos vencedores, lê a sequência, o gancho e o formato visual, e gera slideshows novos com copy e imagem próprias, colocando o produto no slide do meio. Pipeline em automacao/slideshow-copycat/ (yt-dlp + gallery-dl + Graph API + Gemini + Puppeteer), 4 moldes prontos (tweet-lista, padrão repetido, setup + passos, nota manuscrita). Acionar quando: pedir slideshow de TikTok, 'copycat de formato', 'o que viralizou essa semana no nicho', 'lote de posts pro TikTok', 'postar todo dia nas contas', 'modelar os virais da semana', ou rodar a rodada semanal de slideshows. Diferente de carousel-mktops (12 slides narrativos com oferta, identidade MktOps) e molina-style (máxima P&B). [triggers: slideshow tiktok, photo mode, virais da semana, copycat]"
---

# Slideshow Copycat: formato validado, criativo novo

Copiar a **estrutura** que viralizou nos últimos 7 dias, nunca o conteúdo. Fica do viral: a sequência de slides, o tipo de gancho e o formato visual. Muda: o texto (sempre novo, com fato da casa), as imagens (sempre novas) e o produto, que entra no **slide do meio**.

A lógica é volume. Formato validado postado todo dia, em várias contas, ganha de esperar a ideia perfeita.

**Default atual:** nicho *marketing com IA / empreender com IA*, produto *Como empreender com IA no digital?* (Google Docs de 2 páginas, `suaempresa.com.br`, oferta Greenn `uYteFe`). Fonte de fatos: `_nao-incluido/MktOps/empreender-com-ia/01-como-empreender-com-ia.md` + `carta-de-vendas.md`. Para outro nicho ou produto, trocar a lista de perfis, as hashtags e a fonte de fatos. O resto do pipeline é igual.

Pipeline e scripts: `automacao/slideshow-copycat/` (ler o `README.md`). Lote de referência completo: `automacao/slideshow-copycat/lotes/2026-10-12/` (é o molde a copiar) + markdown em `_nao-incluido/MktOps/empreender-com-ia/slideshows/2026-10-12-lote-1.md`.

---

## Fluxo (6 passos, sem perguntar)

### 1. Coletar os virais dos últimos 7 dias

```bash
cd "automacao/slideshow-copycat"
L=lotes/$(date +%F); mkdir -p $L
python3 coletar-tiktok.py perfis-tiktok.txt --dias 7 --out $L/tt-recentes.json
python3 baixar-slides.py $L/tt-recentes.json --top 80 --dir $L/ref-tiktok
python3 coletar-instagram-hashtag.py inteligenciaartificial,empreendercomia,marketingcomia,iaparanegocios,chatgpt,claudeai --out $L/ig.json
python3 folha-contato.py $L/ref-tiktok/*/
```

- `coletar-tiktok.py` lista o perfil via `yt-dlp --flat-playlist` (cookies do Firefox), tira a data do próprio id (`id >> 32`) e calcula **`x_mediana`**: views do post ÷ mediana do perfil. Leva ~5 min pra 40 perfis.
- `baixar-slides.py` usa `gallery-dl -j` pra separar slideshow (`imagePost`) de vídeo e traz **salvos, shares, comentários**. Baixa os slides.
- Instagram: `ig_hashtag_search` + `top_media`/`recent_media`. Limite da Meta: **30 hashtags únicas por 7 dias** por conta. Pra baixar os slides de um carrossel: `gallery-dl --cookies-from-browser firefox -D <dir> https://www.instagram.com/p/<code>/`.
- **Perfil novo no nicho:** descobrir pela busca do TikTok no Browser pane, aba Photo (`tiktok.com/search/photo?q=<termo>`). Deslogado, vem com 12 resultados e sem ordem por data. Serve só pra achar perfis. Os handles novos entram em `perfis-tiktok.txt`.

### 2. Ler os vencedores

Ranquear por `x_mediana` e salvamentos, **não** por views absolutas. Um post a 10x a média de uma conta pequena diz mais sobre o formato do que 100 mil views de uma conta grande. Abrir a `_folha.jpg` dos 6-10 melhores (Read mostra todos os slides lado a lado) e anotar, para cada um:

- **Sequência:** quantos slides e o papel de cada um (capa, itens, virada, moral, CTA).
- **Gancho da capa:** lista ("10 prompts…"), proibição ("palavras proibidas…"), padrão repetido ("Um casal se uniu…"), preguiça/atalho ("maneira mais preguiçosa…"), pergunta ("Quanto cobrar…?").
- **Formato visual:** card de texto branco, foto + legenda nativa, fotos empilhadas, manuscrito, print de tela.
- **CTA:** link da bio, ou comentário com palavra-chave. Na segunda opção, comentários ficam acima das curtidas e alguém precisa responder as DMs.

Vídeo talking head fica de fora (não é slideshow) mesmo com muita view.

### 3. Escolher 3-4 estruturas e escrever o `slideshows.json`

Uma estrutura por slideshow. Copiar `lotes/2026-10-12/slideshows.json` e reescrever. Regras da copy:

- **Produto no meio:** slide 4 de 7-8, no mesmo visual dos outros slides, com a imagem das 2 páginas (`assets/ref-docs.png`). Nunca na capa. A capa é só gancho.
- **CTA no último slide**, uma vez.
- **Só número que existe na fonte de fatos.** Os do Docs: lead de R$ 20,70 para R$ 9,43, R$ 79 por reunião com 6 contratos, 18% contra 2% com site, CTR de 9,7%, diagnóstico de R$ 1.200, implementação de R$ 3 a 4 mil, manutenção a partir de R$ 800/mês, conta de R$ 12 mil/mês. Inventar número é proibido.
- Legenda curta, uma ou duas frases + 4-5 hashtags.
- Aplicar `copywriting-guardrails` inline: sem travessão, sem antítese vazia, sem frase-sentença oca, emoji só onde o molde usa (❌/✅). Não usar "renda extra" (a Meta reprovou o anúncio do Docs por isso).
- Voz do estrategista da casa: tom calmo, fato seco, o mérito vai pra IA, nada de guru.

### 4. Gerar as imagens

Só os moldes com foto (`split`, `moral`, `foto`) precisam. Copiar `lotes/2026-10-12/gerar-imagens.sh` e escrever `$L/prompts.tsv`, separado por tab: `id · ratio · ref (ou "-") · prompt`.

- **O campo ref vazio quebra:** o `read` do bash engole tab duplo. Sempre `-` quando não houver referência.
- Ratio `3:2` para as metades do `split`, `4:5` para foto cheia. Prompt em inglês, "candid iPhone photo, realistic, no readable text, no logos". Pra tela mostrando o Docs: `--ref assets/ref-docs.png`.
- Roda nano-banana-pro, 4 em paralelo, e pula o que já existe. **Erro 402** = acabou o crédito pré-pago do Gemini. Avisar o estrategista da casa pra recarregar no AI Studio e, enquanto isso, reaproveitar imagens do lote.

### 5. Renderizar e conferir

```bash
$L/gerar-imagens.sh
node gerar.js $L            # 1080×1350 em $L/out/<slug>/NN.png
python3 folha-contato.py $L/out/*/
```

1080×1350 serve pros dois canais: carrossel do Instagram e photo mode do TikTok. O `gerar.js` avisa no terminal quando um texto passa da borda. Ler a `_folha.jpg` de cada slideshow antes de entregar.

### 6. Entregar

- Markdown do lote em `clientes/<cliente>/.../slideshows/AAAA-MM-DD-lote-N.md`: tabela das referências (perfil, data, números, estrutura copiada), copy slide a slide, legenda, plano de postagem. Modelo: `2026-10-12-lote-1.md`.
- Mandar as 4 `_folha.jpg` com `SendUserFile`.
- Na resposta: o que viralizou, os slideshows novos e as pendências (créditos, perfil, rótulo de IA).

---

## Moldes do `gerar.js`

| Molde | Kinds | Viral de origem | Quando usar |
|---|---|---|---|
| tweet-lista | `tweet-capa` `tweet-par` `tweet-produto` `tweet-cta` | @lucasvillano.ai (74 mil views, 2.094 salvos) | Lista que se salva: pares NÃO/SIM, prompts, frases |
| padrão repetido | `split` `moral` `moral-cta` | @heyinvestidor (20 mil views) | Frase que repete com virada: "Um… / E virou…" |
| setup + passos | `foto` (`pos: meio` na capa e no CTA) | @dropshark.oficial (7-10x a média) | Uma ferramenta ou etapa por slide, gancho de atalho |
| nota manuscrita | `nota` `nota-produto` | @fabianocarvalhojr (até 27x a média) | Pergunta + resposta grifada, número em destaque |

Campos de cada kind: ver `lotes/2026-10-12/slideshows.json`. Markdown leve: `**x**` vira destaque e `\n` vira quebra.

**Molde novo:** quando o viral da semana não cabe em nenhum dos quatro, criar um `case` novo em `slide()` dentro do `gerar.js` e uma linha nesta tabela. Copiar o layout do viral (proporção, posição do texto, fonte parecida no Google Fonts), nunca o logo, a foto ou o texto dele.

O bloco `autor` do JSON define nome, handle e avatar. `verificado: true` só se a conta for de fato verificada.

---

## Plano de postagem (vai no markdown do lote)

- **2 posts por dia por conta**, de manhã (11h-12h) e à noite (19h-21h).
- **Várias contas:** o mesmo slideshow pode rodar em contas diferentes com capa e ordem dos itens trocadas. Na mesma conta, nunca o mesmo post duas vezes na semana.
- **Repost do que performou:** depois de 72h, o que passar de 3x a mediana da própria conta volta pra fila 2-3 semanas depois, com capa nova. Pra medir as contas do estrategista da casa, rodar o `coletar-tiktok.py` nelas com `--dias 30`.
- **No TikTok:** escolher um áudio em alta na hora de postar e ligar o rótulo "conteúdo gerado por IA" quando houver foto gerada.

---

## Armadilhas já pagas

- Busca e perfil do TikTok deslogados não dão data nem lista completa. A lista de verdade sai do `yt-dlp` no perfil.
- `business_discovery` da Graph só acha conta business/creator com o handle exato do Instagram. Os handles do TikTok quase nunca batem. Pro IG, usar hashtag.
- `top_media` com `limit=50` ou com `children{media_url}` volta "reduce the amount of data". Usar 25 por página e pedir os `children` depois, só dos vencedores.
- Cookies do Firefox, nunca do Chrome (o Chrome trava pedindo Keychain). Puppeteer `headless: 'shell'`, nunca Playwright.
- Confirmar o handle de cada conta antes de renderizar: handle errado já saiu em lote.
