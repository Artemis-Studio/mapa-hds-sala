---
name: campanha-lowticket
description: "Monta a esteira low-ticket completa da casa a partir de um artigo master: advertorial + VSL de entrada, oferta de ingresso pago (R$47-97), série de aulas curtas gravadas de espera, régua de consumo/comparecimento, aula principal ao vivo mensal e ponte de ascensão pra mentoria. Acionar quando: 'campanha low-ticket', 'esteira do artigo', 'workshop pago', 'evento mensal', 'aula ao vivo com pitch', ou quando o usuário der um artigo master e pedir a campanha completa."
metadata:
  version: 1.0.0
---

# Campanha Low-Ticket — esteira mensal derivada de copy master

## Princípio único

Toda campanha nasce de UM artigo master (tese + mecanismo + provas + teaser da oferta no fecho). Nenhuma peça é criada do zero: as 8 peças abaixo são DERIVAÇÕES do artigo. Se o artigo master não existir, pare e escreva ele primeiro (skill do formato + `copywriting-guardrails`). Coerência é a regra: mesma linguagem, mesmos exemplos, mesmos números em todas as peças. O leitor que veio do advertorial precisa reconhecer a voz na aula ao vivo.

Referência do primeiro artigo master: `_nao-incluido/conteudo/artigo-marketing-de-uma-pessoa-so.md`.

## Parâmetros fixos da esteira (decisão de 13/07/2026)

- **Ingresso:** pago, R$47-97 (qualifica o lead e banca parte do tráfego; comprador assiste mais que inscrito grátis)
- **Cadência:** mensal — um dia X por mês, data explícita na copy
- **Ascensão:** mentoria/acompanhamento de implantação. A "pasta pronta" que o artigo teasa entra DENTRO da mentoria: o produto é pasta pronta + implantação junto. A ponte é sempre "montar sozinho vs montar comigo", nunca pitch frio.

Variáveis por campanha (perguntar se faltar): artigo master, promessa do ingresso, dia X, preço exato do ingresso, nome + preço da mentoria.

## As 8 peças (ordem de produção)

### 1. Mapa da campanha (`00-mapa.md`)
Slug, datas, preços, promessa central, links de checkout. Uma página.

### 2. Advertorial (`01-advertorial.md`)
O artigo master cortado pra ~40%, mantendo hook, tese, mecanismo (a pasta) e 1-2 provas — trocando o fecho pelo CTA do ingresso. Deriva, não reescreve.

### 3. VSL de entrada (`02-vsl.md`, 4-6 min)
Skill: `vsl-writer` (VSL curta), alimentada com o esqueleto do artigo. Estrutura: hook do artigo → problema (você não precisa de equipe) → mecanismo (pasta + Claude) → prova → oferta do ingresso → CTA.

### 4. Oferta do ingresso (`03-oferta-ingresso.md`)
O que o comprador leva: aula principal ao vivo no dia X + série de aulas curtas gravadas (acesso imediato) + kit (template de pasta, 2-3 skills prontas, guia de conectores). Order bump: gravação vitalícia ou pack de skills extra. Copy da página: skill `copywriting`.

### 5. Aulas curtas gravadas (`04-aulas/`, 6 × 5-15 min)
Regra: cada aula = uma seção do artigo master cumprida NA TELA, terminando com uma vitória do aluno. Pro artigo "Marketing de uma pessoa só":

1. Setup de 20 min — pasta + Claude Code + CLAUDE.md (aluno sai com a empresa criada)
2. Primeira skill + conectores (WhatsApp/Gmail) — a skill como funcionário
3. O site em 10 minutos — antes e depois real
4. O build vira 3 posts + o ímã ("comente X")
5. A skill que escreve a campanha fria
6. A call do médico + transcrição→spec

Cada roteiro: hook de 15s, demonstração, vitória do aluno, gancho pra próxima aula + 1 frase que insinua o "pronto" (semeia a mentoria sem pitch). Função dupla: prova prática e aluno chegando no dia X com a pasta montada.

### 6. Régua compra→dia X (`05-regua.md`)
Skill: `email-sequence` + versão WhatsApp. Objetivo duplo: consumo das aulas e presença no ao vivo. Usa a mecânica do próprio artigo: lembrete 3 dias antes ("estou preparando algo pra aula"), 1 dia antes ("montei uma coisa baseada no seu negócio"). Culpa é estratégia de comparecimento.

### 7. Roteiro da aula principal ao vivo (`06-aula-ao-vivo.md`)
- **Callback:** reabre com a tese na MESMA linguagem do advertorial
- **Entrega:** monta ao vivo a peça mais desejada (a máquina de clientes rodando de ponta a ponta)
- **Ponte de ascensão** (a venda com base no que foi ensinado): "vocês viram tudo na prática. Dois caminhos: montar sozinho, peça por peça — tudo que mostrei fica com vocês. Ou montar comigo: a pasta pronta + implantação acompanhada." → oferta da mentoria com condição do evento
- Stack, preço, QA, fechamento
- Cérebro de Copy: `06-closes-e-ctas.md`, `08-offers-e-economia.md`

### 8. Pós-evento (`07-pos-evento.md`)
Replay por 48-72h + sequência de carrinho (3-4 emails) + downsell se couber (ex.: só a pasta, sem acompanhamento).

## Gates (obrigatórios, não pular)

- `copywriting-guardrails` em TODA peça (Regra 2 do CLAUDE.md raiz)
- `copy-format-check` em qualquer ad derivado da campanha
- Regra 3 do CLAUDE.md: ads estáticos entregam só copy, sem conceito nem sugestão visual

## Onde salvar

`_nao-incluido/MktOps/campanhas/<slug>/` — um arquivo por peça, numerados na ordem acima.

## Checklist final

- [ ] Toda peça usa linguagem e exemplos do artigo master (teste: trocar o artigo quebraria a peça?)
- [ ] O fecho do artigo teasa exatamente o que a aula ao vivo vende
- [ ] Aulas curtas terminam em vitória prática, não em teoria
- [ ] Ponte de ascensão é "sozinho vs comigo", nunca pitch frio
- [ ] Datas, preços e nome da mentoria consistentes em todas as peças
