# Mapa HDS — Sala de Operações MktOps

> A operação de marketing da Mapa inteira. Tudo mora aqui dentro, e já vem configurado.

## Primeira vez — três passos

**1. Instale o Claude Code** *(uma vez só, na máquina)*
```bash
npm install -g @anthropic-ai/claude-code
```
Precisa do Node 18 ou superior. No Windows, instale antes o **Git for Windows** — sem ele o Claude Code não consegue abrir suas pastas.

**2. Ligue o motor de arte e de espionagem** *(uma vez só, dentro desta pasta)*
```bash
./preparar.sh
```
Leva de 2 a 4 minutos na primeira vez. Sem ele, o texto funciona normalmente, mas não sai arte de carrossel nem leitura de anúncio de concorrente.

**3. Abra a Sala e peça a primeira peça**
```bash
cd "caminho/para/esta/pasta"
claude
```

Não há configuração inicial a fazer. A pesquisa de mercado, a leitura dos anúncios da Mapa e dos concorrentes, o contexto de marca e a identidade visual (Manual de Identidade Visual 2025) já estão prontos.

---

## Como pedir

Peça em português. Não existe comando para decorar.

> *"3 anúncios de Personalidade para gestoras de RH formadas em psicologia, pelo ângulo do instrumento raso que não enxerga a vaga crítica."*
> *"Um carrossel sobre por que um afastamento começa meses antes do atestado, e gera a arte."*
> *"Roteiro de 30 segundos para uma psicóloga da Mapa explicar o que o teste enxerga num piloto."*
> *"Espiona os anúncios que o Grou está rodando agora."*
> *"Uma sequência de 5 e-mails para quem usa só o Teste de Personalidade conhecer o Inventário Psicossocial."*

Pedido bom tem três partes: **o que** você quer · **para quem** · **com que ângulo**.

Se não souber qual rotina usar, abra o `copy-routing.md` — é o índice por intenção.

---

## O que tem aqui

| Pasta | O que guarda |
|---|---|
| `CLAUDE.md` | As regras da operação. Lido toda vez que a Sala abre |
| `brand-context.md` | Quem a Mapa é de verdade. Lido antes de cada peça |
| `copy-routing.md` | "Quero X → use Y" |
| `cerebro-de-copy/` | A camada estratégica: hooks, arquitetura de argumento, oferta, objeção |
| `playbook-narrativas-mktops.md` | O modelo de carrossel em 4 atos |
| `design-system/` | Cores, tipografia, logos, faixas curvas e o guia visual |
| `pesquisa-mercado/` | A pesquisa do mercado de avaliação de pessoas e NR-01 |
| `spy/` | O que os concorrentes estão anunciando, com copy literal, artes e vídeos transcritos |
| `automacao/` | Os motores: render de carrossel e espionagem de anúncios |
| `relatorios/` | Os números, mês a mês |
| `conteudo/` | Peças em produção |
| `entregas/` | Finais, por mês |

---

## As duas coisas que esta Sala faz e um chat comum não faz

**Ela sabe quem a Mapa é.** O `brand-context.md` é lido antes de cada peça: os três motores de compra, o tom humano, o que nunca dizer. Ninguém precisa reexplicar o negócio toda vez.

**Ela olha para fora.** Não inventa o que o mercado está fazendo: abre a biblioteca pública de anúncios e lê a copy literal do que os concorrentes estão rodando **hoje**. É a diferença entre um palpite e um dado.

---

## A regra de ouro

Todo texto passa por uma revisão de qualidade antes de virar arquivo final. Anúncio passa também por uma conferência dos limites de caractere de cada plataforma. Isso roda sozinho — ninguém precisa pedir.

---

## Quando algo der errado

- **A Sala não sabe quem é a Mapa** → o Claude Code foi aberto fora desta pasta. Feche e abra dentro dela.
- **A peça saiu genérica** → falta contexto no pedido, ou o `brand-context.md` precisa de atualização. Peça: *"vamos atualizar o contexto de marca com isto: …"*.
- **A cor saiu errada** → peça para refazer seguindo `design-system/design-system.md`.
- **A arte não saiu** → o motor não foi instalado. Rode `./preparar.sh`.
- **Qualquer outra coisa** → escreva `travei` e conte o que aconteceu.

---
*Método v2026.14 · Sala gerada em 2026-10-28*
