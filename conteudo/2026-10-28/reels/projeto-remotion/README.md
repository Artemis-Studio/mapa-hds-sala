# Projeto dos reels (Remotion)

Gera os três reels de `../finais/` a partir de código. Serve de molde para os próximos: trocar locução, clipes e textos, e renderizar de novo.

## O que tem aqui

| Caminho | O que é |
|---|---|
| `src/videos.tsx` | A linha do tempo de cada vídeo: qual cena entra em qual segundo e com qual texto |
| `src/scenes.tsx` | As cenas (hook, foto/vídeo com texto, listas, caixinhas, traços, fecho) |
| `src/Captions.tsx` | A legenda palavra a palavra |
| `src/theme.ts` | Cores e fontes do Manual 2025 |
| `src/words/` | O tempo de cada palavra da locução |
| `public/` | Locuções (`v1.wav`…), clipes do Pexels, fotos e logos |

## Renderizar

Precisa de Node 18 a 22.

```bash
npm install
npx remotion render src/index.ts V1 out/mapa-hds-v1.mp4 --codec=h264 --crf=20
```

Troque `V1` por `V2` ou `V3`. Para ver e ajustar antes de renderizar: `npx remotion studio src/index.ts`.

## Fazer um reel novo

1. Gere a locução no ElevenLabs com timestamps e acelere a 1,1x. Salve o áudio em `public/` e o tempo das palavras em `src/words/`.
2. Baixe os clipes (Pexels, 1080×1920) para `public/`.
3. Copie um dos blocos de `src/videos.tsx` e ajuste os tempos pela locução.
4. Registre o vídeo novo em `src/Root.tsx` e renderize.
