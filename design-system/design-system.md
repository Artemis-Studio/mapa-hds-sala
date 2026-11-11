# Mapa HDS — Design System

> Fonte da verdade visual da Sala. Toda peça (carrossel, estático, story, capa de vídeo, e-mail, página) sai daqui. **Nenhuma cor que não esteja neste arquivo entra numa peça.**
>
> **Base:** Manual de Identidade Visual Mapa HDS 2025 (38 páginas), aprovado como referência em 23/10/2026. Os logos foram tirados do site oficial e recoloridos para a cor do manual.
>
> **Tokens prontos pra HTML:** `design-system/tokens.css`.

---

## 1. Logo

Arquivos em `design-system/logo/`:

| Arquivo | Quando usar |
|---|---|
| `logo-laranja.svg` / `.png` | Fundo branco ou claro. Versão principal |
| `logo-preto.svg` / `.png` | Fundo claro quando o laranja disputa com a foto ou com o grafismo |
| `logo-branco.svg` / `.png` | Fundo laranja, petróleo, azul-marinho, preto ou foto escura |
| `simbolo-laranja.png` | O "m" sozinho. Selo pequeno, marca d'água de canto, favicon |
| `avatar-laranja.png` / `avatar-preto.png` | Avatar de rede social (1000×1000, símbolo numa área de 600×700). **Só essas duas variações** |

Anatomia: "Mapa" em traço cheio, com o "m" orgânico de linha contínua, + "HDS" em contorno. Os dois são uma peça só.

**Regras (do manual):**
- Área de proteção = altura do "m" em volta do logo inteiro.
- Tamanho mínimo: 250 px de largura em tela, 70 mm impresso.
- **Proibido:** mudar a cor · girar · distorcer · aplicar sobre fundo que prejudique a leitura · usar sem o "HDS" · degradê ou efeito · sombra · trocar a fonte do logotipo.

> O SVG do site usa o laranja `#EA5B0C`. O manual define `#FF560B`. Os arquivos desta pasta já estão em `#FF560B`. Se a marca preferir o tom do site, troque aqui e no `tokens.css`, nos dois lugares ao mesmo tempo.

## 2. Paleta

### Principais

| Token | Hex | Nome no manual | Uso |
|---|---|---|---|
| `--mapa-orange` | `#FF560B` | Orange (Pantone) | **Cor da marca.** Logo, título grande, faixa curva, fundo de destaque |
| `--mapa-amber` | `#FF971A` | Princeton Orange | Ícone de Personalidade, segunda faixa, detalhe |
| `--mapa-petrol` | `#065156` | Midnight Green | Ícone de Psicossocial, fundo escuro de slide de princípio |
| `--mapa-navy` | `#162F42` | Prussian Blue | Fundo escuro institucional, texto sobre claro |
| `--mapa-red` | `#D94021` | Chilli Red | Ícone de Avaliações e resultados, destaque em texto menor |
| `--mapa-ink` | `#1A1A1A` | Eerie Black | Texto corrido, logo preto |
| `--mapa-white` | `#FFFFFF` | White | Fundo padrão |

### Secundárias (apoio, nunca protagonista)

Alice Blue `#E4EEF0` (fundo claro alternativo) · Mustard `#FFDE5A` · Tiffany Blue `#6BD0D8` · Atomic Tangerine `#FF9469` · Spanish Orange `#EC691B` · Moonstone `#549EA3` · Coral `#FF5D38`

**O que cada cor diz (manual):** laranja = energia e movimento · azul-esverdeados = confiança e estabilidade · branco e cinza = precisão e neutralidade técnica.

### Contraste (medido)

| Combinação | Razão | Pode usar em |
|---|---|---|
| `--mapa-ink` sobre branco ou `#E4EEF0` | 17,4 / 14,7:1 | Qualquer texto |
| Branco sobre `--mapa-navy` | 13,8:1 | Qualquer texto |
| Branco sobre `--mapa-petrol` | 9,1:1 | Qualquer texto |
| `--mapa-amber` sobre `--mapa-navy` | 6,4:1 | Destaque em fundo escuro |
| `--mapa-orange` sobre `--mapa-ink` | 5,5:1 | Destaque em fundo preto |
| `--mapa-red` sobre branco | 4,5:1 | Destaque em texto médio, em bold |
| `--mapa-orange` sobre branco / branco sobre `--mapa-orange` | 3,2:1 | **Só título grande** (32 px+ bold). Nunca corpo de texto |

**Proibido:** **roxo e lilás** (cor de concorrente direto) · preto puro `#000` · cores fora desta lista · degradê entre cores da marca no logo.

## 3. Tipografia

| Papel | Fonte | Peso |
|---|---|---|
| Título | **Poppins** | Bold (700). Capa pode ir a 800 |
| Subtítulo | Poppins | Bold (700), menor, em `--mapa-ink` |
| Corpo | **Roboto** | Regular (400) |
| Texto pequeno, legenda, rodapé | Roboto | Regular (400) |
| Label / eyebrow | Poppins | Medium (500), caixa alta, espaçamento 0,12em |

O manual também cita a **Asap** como alternativa de corpo. Use uma das duas por peça, sem misturar.

- Texto **sempre alinhado à esquerda**, com entrelinha generosa (1,45 no corpo).
- Destaque = **cor** (laranja no título grande, vermelho no texto menor), nunca sublinhado nem contorno.
- Assinatura de seção, como no manual: barra vertical laranja de 4 px à esquerda do título.

## 4. Grafismo — as faixas curvas

O elemento mais reconhecível depois do logo: **faixas grossas e curvas**, o traço do "m" ampliado, que se cruzam e sangram pra fora do quadro.

- Cores das faixas: `--mapa-orange`, `--mapa-amber`, `--mapa-petrol`, `--mapa-teal`, `--mapa-red`. Duas a três por peça.
- Espessura entre 6% e 9% da largura da peça. Pontas arredondadas, curvas de raio grande e nenhum ângulo reto.
- Fundo: branco, `#E4EEF0` ou foto.
- Faixa nunca passa por cima de rosto nem de texto.
- Variação "arco": um único arco grosso saindo do canto, atrás da pessoa na foto (ver os KVs do manual).

## 5. Ícones de produto

Quadrado de canto arredondado (raio ~22%), cor chapada e desenho interno em tom mais claro da mesma família:

| Ícone | Cor de fundo | Produto | Linha de apoio aprovada |
|---|---|---|---|
| Nós conectados (linhas e pontos) | `--mapa-amber` | **Traços de personalidade** | Competências e habilidades para recrutamento e DHO |
| Círculos e quadrados | `--mapa-petrol` | **Fatores psicossociais** | Gerenciamento, planos de ação e matriz de risco |
| Barras arredondadas | `--mapa-red` | **Avaliações e resultados** | Visão única de RH e SST integrados em uma só plataforma |

Ícone novo segue a mesma regra: traço curvo, canto arredondado e cor chapada. **[GAP]** Os arquivos-fonte dos 3 ícones ainda não vieram. Até chegarem, use só o texto do produto e não redesenhe os ícones.

## 6. Fotografia

**O que a marca quer (manual + call de 21/10/2026):**
- **Gente brasileira trabalhando de verdade**, com cara de campanha de utilidade pública: operador de porto, piloto no cockpit, técnico de capacete, motorista, colheita, chão de fábrica, além do escritório.
- Expressão autêntica, sorriso acolhedor, luz natural, composição limpa, fundo desfocado.
- Diversidade de pele, idade, gênero e cargo, do operacional à liderança.
- Imagem gerada por IA é permitida, desde que pareça foto real e tenha traços brasileiros.

**Evitar:** banco de imagem genérico, modelo de estúdio, executivo de terno em sala de vidro como regra, "aperto de mão corporativo", gente olhando gráfico holográfico.

**Tratamento:** foto em bloco de canto arredondado (28 px em peça 1080), podendo sobrepor uma faixa curva. Em foto escura, o texto vai em branco sobre a própria foto com um véu `--mapa-navy` a 55% na região do texto.

## 7. Peças-padrão

### 7.1 Feed 1080×1350 / Story 1080×1920 — "pessoa + promessa" (KV padrão do manual)
- Foto da pessoa em ~60% da peça, com um arco grosso laranja ou petróleo atrás dela.
- Título em Poppins Bold (64–84 px), branco sobre foto escura ou `--mapa-ink` sobre fundo claro. **Uma** palavra-chave em laranja.
- Os três ícones de produto em coluna, com uma linha de apoio cada (só quando a peça é institucional).
- Logo branco ou laranja no canto inferior, respeitando a área de proteção.

### 7.2 Feed — "plataforma"
- Fundo `#E4EEF0` ou branco, mockup de notebook ou tablet com a tela real da plataforma no centro, faixas laranja e petróleo atravessando atrás.
- Título curto no topo, centralizado. É a única peça em que o centralizado é aceito, como no KV "Leve decisões mais confiáveis para sua empresa".

### 7.3 Carrossel 1080×1350
- Motor: `automacao/paper-designs/` (já sai com a identidade da Mapa).
- Capa: foto + título grande. Slides de texto: fundo branco ou `#E4EEF0`. Slide de princípio: fundo `--mapa-petrol` ou `--mapa-navy` com destaque em `--mapa-amber`.
- Rodapé de todo slide: logo pequeno + "mapahds.com".

### 7.4 Capa de relatório, e-book ou material rico
- Fundo `#E4EEF0` com duas ou três faixas curvas cruzando o topo.
- Título no terço inferior direito, em `--mapa-navy`, com o nome do material em Bold.

## 8. Checklist antes de entregar

1. Todas as cores estão na seção 2? Algum roxo, lilás ou preto puro?
2. O logo tem área de proteção e está acima de 250 px? Usa o arquivo certo pro fundo?
3. Laranja sobre branco só em título grande?
4. Texto alinhado à esquerda (exceto a peça 7.2)?
5. A foto mostra gente trabalhando de verdade, e não banco de imagem?
6. Faixa curva passando por rosto ou texto? Corrigir.
7. Ícone de produto redesenhado à mão? Tirar até chegarem os arquivos oficiais.

---
*Pendências com a marca:* arquivos-fonte dos 3 ícones de produto · banco de fotos do time (Julia, Vanessa e psicólogas) · confirmação do tom de laranja do logo (`#FF560B` do manual × `#EA5B0C` do site).
