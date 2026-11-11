# Roteamento de Copy — fonte única da verdade

> **STEP 0 de qualquer tarefa de copy nesta Sala.** Antes de escrever qualquer peça: (1) ache o tipo na tabela, (2) use a skill canônica, (3) carregue os arquivos do Cérebro indicados, (4) a peça passa pelos gates. Isso vale para você e para o cliente — é o índice por intenção que substitui "decorar 100 skills".

---

## 1. Quero X → use Y (mapa de decisão)

Todo output de copy passa SEMPRE por `copywriting-guardrails` (gate, não opção — ver §4). Ad passa também por `copy-format-check`.

### Site / página
- Escrever do zero (sem URL) → **copywriting**
- Melhorar a partir do link → **market-copy** *(wrapper /market — a escrita boa sai do Cérebro, ver §5)*
- Já tenho o texto, só polir → **copy-editing**
- Diagnosticar por que não converte (sem reescrever) → **market-landing**

### Anúncio pago estático
- **Caminho padrão** — campanha, volume de copies → **ads-create** *(exige `brand-profile.json`; rode `ads-dna` antes)*
- Só Google RSA ou iterar anúncios por métrica → **ad-creative**
- Método Paulo Berto / adaptar por DISC / analisar lote → **mktops-creative-ads-pack**

### Carrossel
- **Default da casa** (Narrativa→Princípio→Aplicação→Oferta) → **carousel-mktops**
- Máxima/frase forte P&B aspiracional (1-6 slides) → **molina-style**

### Vídeo / roteiro
- Vender em vídeo (hook→oferta→stack) → **vsl-writer**
- Reel talking-head curto → **molina-reel-script**
- Roteiro de video ad pago Meta (após `ads-create`) → **ads-video-scripts**
- Vídeo de YouTube orgânico (8-20min) → **youtube-content**
- Aula educacional 15-30min a partir de fontes → **aula-script-writer**

### Email
- Frio / prospecção outbound B2B → **cold-email**
- Sequência warm (welcome/nurture/winback) → **email-sequence** *(market-emails = wrapper /market)*

### Editorial / social / pesquisa
- Artigo longo estilo HBR → **substack-hbr-writer**
- Calendário de social (planejar) → **market-social** *(a PEÇA final sai das skills da casa)*
- Pesquisar tese + evidências p/ conteúdo → **content-research-briefing**
- Pesquisa de mercado/concorrência → **market-research-briefing**
- Backlog de ideias de carrossel da semana → **mktops-content-engine**

---

## 2. Cérebro de Copy — auto-load por tipo (a segmentação)

A skill **puxa sozinha** os arquivos do Cérebro abaixo (de `cerebro-de-copy/`) como passo 1, sem frase mágica. Quantos arquivos depende do nível da peça (§3).

| Tipo de copy | Skill canônica | **Rotina** (default) | **Estratégica** (peça-chave) |
|---|---|---|---|
| Carrossel | carousel-mktops | 03·05·11·13 | 02·03·05·06·09·11·13 |
| Ad estático | ads-create | 03·09·11 | 03·05·06·09·11 |
| Roteiro video ad | ads-video-scripts | 03·09·11 | 03·05·06·09·11 |
| Email warm | email-sequence | 03·07·11 | 03·04·06·07·09·11 |
| Cold email | cold-email | 03·07·11 | 03·04·06·07·09·11 |
| VSL | vsl-writer | 03·05·06·11 | 02·03·05·06·09·10·11 |
| Site / landing | copywriting | 03·05·11 | 02·03·05·06·08·09·11 |
| YouTube | youtube-content | 03·05·11 | 02·03·05·06·09·11 |
| Reel Molina | molina-reel-script | 03·09·11 | 03·05·09·11 |
| Carrossel Molina | molina-style | 09·11 | 03·09·11 |
| Aula | aula-script-writer | 05·11 | 01·02·05·09·11 |
| Artigo Substack | substack-hbr-writer | 02·05·11 | 01·02·04·05·11 |

Legenda dos arquivos: 01 psicologia · 02 arquitetura · 03 hooks · 04 bridges · 05 body · 06 closes · 07 emails · 08 oferta · 09 bullets · 10 objeções · 11 anti-padrões · 13 integração-mktops. `11-anti-padroes` entra SEMPRE (é o checklist pré-publicação).

---

## 3. O flag de nível — uma chave, não três triggers

Substitui o antigo `"use o Cérebro"` / `"aplique 03/06/11"` / `"Cérebro completo"` por **um switch**:

- **Rotina** (default): peça de manutenção — ad de retargeting, email diário, variação. Carrega só a coluna Rotina. Prioridade é velocidade.
- **Estratégica**: peça decisiva — lançamento, novo posicionamento, oferta nova, VSL longa, peça-chave de cliente. Carrega a coluna Estratégica completa. O cliente pede dizendo **"peça estratégica"** ou **"caprichada"**; você reconhece pela natureza da peça mesmo sem pedido.

Regra: na dúvida entre os dois, suba para Estratégica. O custo de um arquivo a mais do Cérebro é baixo; o custo de uma peça-chave rasa é alto.

---

## 4. Gates — sempre ativos (não dependem de ninguém lembrar)

- `copywriting-guardrails` roda em **TODA** peça de copy (remove vícios de IA). É **forçado por hook** (`Stop` em `.claude/settings.json`): se uma peça for escrita em `conteudo/` ou `entregas/` sem passar pelo guardrails, a finalização do turno é **bloqueada**.
- `copy-format-check` roda em **todo ad** (valida char-limits por plataforma), depois do guardrails.
- Os gates não são Cérebro e não são opcionais. O Cérebro levanta o teto; os gates garantem o piso.

---

## 5. Obsidian (summaries) e skills genéricas

- **Summaries do Obsidian** (`1-Marketing-IA/summaries/`: Sultanic, Settle, Halbert, Schwartz…) **não entram por peça** — são a matéria-prima que alimenta o Cérebro. Só puxe um summary específico em peça de **posicionamento novo**, e referenciado a partir do arquivo do Cérebro. Em Sala de cliente, os summaries não vêm embarcados; o Cérebro destilado já basta.
- **Skills genéricas / wrappers** (`market-copy`, `market-emails`, `market-social`, `social-content`): servem de porta de entrada ou de planejamento, mas a **escrita final** deve sair pela skill canônica da casa com o Cérebro carregado. Não entregar copy crua dessas skills sem passar pela doutrina + gate.

---

*Canon v2026.14. Esta tabela é canônica — não editar dentro da Sala de um cliente.*
