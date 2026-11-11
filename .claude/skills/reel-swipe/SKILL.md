---
name: reel-swipe
description: "Baixa Reels do Instagram (um, vários ou os melhores de um perfil), transcreve o áudio e entrega a copy literal no chat — pronta pra ser adaptada pro contexto do usuário. Motor: yt-dlp + ffmpeg + whisper, com cookies do navegador. Nunca gerar relatório nem arquivo de análise: a saída é a transcrição, direto na conversa. Acionar quando: colar link de reel/post do Instagram, pedir pra baixar ou transcrever reel, pedir a copy/o texto de um vídeo, pedir os melhores reels de um perfil, ou dizer 'reel-swipe' / 'rouba esse reel' / 'adapta essa copy pro meu negócio'. [triggers: adaptar essa copy]"
---

# Reel Swipe — link → transcrição → copy adaptada

Três passos, sem cerimônia: **baixa, transcreve, entrega o texto no chat.** Depois, se o usuário pedir, adapta a copy pro contexto dele.

**Não gere relatório, não crie arquivo.md de análise, não escreva seções de "estrutura" e "molde".** Isso demora e ninguém lê. A saída é a transcrição literal. Só isso.

---

## Regras

1. Cookies vêm do navegador: `--cookies-from-browser firefox`. Nunca pedir senha nem login. Se o usuário não usa Firefox: `safari`, `edge`, `brave`. No macOS, `chrome` trava pedindo Keychain — último recurso.
2. Colar o link **é** o pedido. Não perguntar "quer que eu baixe?". Baixar e transcrever direto.
3. Conteúdo público. Perfil privado ou post que exige seguir: parar e avisar.
4. `sleep 3` entre downloads. Em paralelo o Instagram bloqueia por ~15 min.
5. Apagar os `.mp4` e `.wav` no fim. O que interessa é o texto.

Setup, se faltar: `brew install yt-dlp ffmpeg whisper-cpp gallery-dl` (Linux: `pipx install yt-dlp gallery-dl` + `apt install ffmpeg`).

```bash
BROWSER=firefox
WORK=$(mktemp -d)
```

---

## 1. Baixar

**Um ou vários links** (o usuário cola quantos quiser):

```bash
cd "$WORK" && yt-dlp --no-update --cookies-from-browser $BROWSER --socket-timeout 25 \
  --sleep-interval 3 -o "%(id)s.%(ext)s" --write-info-json \
  "<URL1>" "<URL2>" "<URL3>"
```

**Perfil inteiro.** O `yt-dlp` não lista perfil (o extractor `instagram:user` está quebrado) — a listagem sai do `gallery-dl`, que ainda devolve as curtidas pra ranquear:

```bash
gallery-dl --cookies-from-browser $BROWSER -j --range 1-40 \
  "https://www.instagram.com/<perfil>/reels/" 2>/dev/null > "$WORK/raw.json"

python3 - <<PY
import json
raw = json.load(open("$WORK/raw.json"))
v = {}
for it in raw:
    if isinstance(it, list) and len(it) > 1 and isinstance(it[1], dict):
        m = it[1]; u = m.get("post_url")
        if u and u not in v:
            v[u] = m.get("likes") or 0
for u, l in sorted(v.items(), key=lambda x: -x[1]):
    print(f"{l:>9,} | {u}")
PY
```

Mostrar o ranking, pegar quantos o usuário quiser (default 10) e baixar as URLs do topo com o comando acima.

## 2. Transcrever

```bash
for f in "$WORK"/*.mp4; do
  ffmpeg -v error -i "$f" -ar 16000 -ac 1 -c:a pcm_s16le -y "${f%.mp4}.wav"
done

# whisper-cpp (rápido, Metal no Mac) — precisa de um modelo ggml baixado:
whisper-cli -m <modelo.bin> -f "<arquivo>.wav" -l auto -np -nt

# ou openai-whisper:
whisper "<arquivo>.wav" --language pt --model small --output_format txt
```

Sem whisper na máquina, não instalar nada no meio da tarefa: avisar o usuário, sugerir `brew install whisper-cpp` e seguir com a legenda do post (o `.info.json` traz `description`).

Se a transcrição voltar `"Thank you."`, `"Obrigado."` ou uma linha solta sem sentido, é **alucinação do Whisper em vídeo sem fala** (só música). Descartar — nunca apresentar isso como se fosse o áudio. Nesse caso, extrair o texto de tela:

```bash
ffmpeg -v error -i "<arquivo>.mp4" -vf "fps=1/3,scale=320:-1,tile=4x3" -frames:v 1 -y frames.jpg
```

...e ler `frames.jpg` com a tool Read.

## 3. Entregar no chat

Um bloco por reel, nada além disso:

```
### @autor · 0:37 · 234.678 curtidas
<transcrição literal, corrida, sem timestamps>

**Legenda do post:** <caption>
```

Sem análise, sem comentário, sem "o que podemos aprender". O usuário lê e decide.

Ao final, uma linha só: *"Quer que eu adapte alguma dessas pro seu contexto?"*

---

## 4. Adaptar (quando o usuário pedir)

Ele diz o negócio/produto/público e escolhe qual copy. Você reescreve **mantendo a estrutura e o ritmo do original** e trocando o assunto:

- Mesma abertura (mesmo tipo de frase de entrada, mesmo tamanho).
- Mesma sequência de blocos e mesma duração aproximada.
- Mesmo tipo de fechamento (CTA, pergunta, loop ou nada).
- Assunto, exemplos e números: os do usuário.

Entregar **só o roteiro pronto pra gravar**. Sem explicar o que foi adaptado, sem tabela comparativa, sem "princípio aplicado". Se ele quiser saber por que funciona, ele pergunta.

Rodar `copywriting-guardrails` no texto final quando a skill estiver disponível.

---

## Troubleshooting

| Sintoma | Fix |
|---|---|
| `Instagram sent an empty media response` | Faltou `--cookies-from-browser` |
| `could not find <browser> cookies database` | Trocar de navegador; conferir se está logado no Instagram nele |
| Chrome trava pedindo senha | Keychain do macOS. Usar `firefox` ou `safari` |
| `Unsupported URL:.../reels/` | Listagem de perfil é pelo `gallery-dl`, não pelo `yt-dlp` |
| Resposta vazia após vários downloads | Rate limit. Esperar 10–15 min e baixar em lotes menores |
| Transcrição = `"Thank you."` | Vídeo sem fala. Descartar e ler o texto de tela pelos frames |

**Limite:** curtida mede alcance, não venda. A copy de um reel com 600 mil curtidas otimiza atenção. O que faz comprar aparece em anúncio pago que segue no ar depois de semanas — outra skill, outro método.
