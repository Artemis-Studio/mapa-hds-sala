// gerar.js — Carrossel Mapa HDS (template base do método, com a identidade da marca)
// Lê slides.json + template.html → renderiza N PNGs 1080×1350 + preview.html
// Uso: node gerar.js
//
// Markdown leve no texto:
//   **palavra**  → <strong>negrito</strong>
//   __palavra__  → <em>destaque na cor da marca</em>
//   \n\n         → quebra de parágrafo dentro do body

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = __dirname;
const TEMPLATE = fs.readFileSync(path.join(ROOT, 'template.html'), 'utf8');
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'slides.json'), 'utf8'));
const OUT = path.join(ROOT, 'out');
// Logos vivem em design-system/logo/ na raiz da Sala (3 níveis acima da pasta do carrossel).
const LOGO_DIR = path.resolve(ROOT, '..', '..', '..', 'design-system', 'logo');
const LOGO_LIGHT = 'file://' + path.join(LOGO_DIR, 'logo-laranja.png');
const LOGO_DARK = 'file://' + path.join(LOGO_DIR, 'logo-branco.png');
fs.mkdirSync(OUT, { recursive: true });

function md(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br><br>');
}

function imageUrl(rel) {
  return 'file://' + path.join(ROOT, rel);
}

function pageNo(n, total) {
  return String(n).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
}

function topBlock(handleText) {
  return `
    <div class="top">
      <div class="lockup">
        <img class="logo logo-light" src="${LOGO_LIGHT}" alt="Mapa HDS">
        <img class="logo logo-dark" src="${LOGO_DARK}" alt="Mapa HDS">
      </div>
      <div class="handle">${handleText}</div>
    </div>`;
}

function topBlockWithPage(n, total) {
  return topBlock(pageNo(n, total));
}

function footBlock(n, total, isLast, customLast) {
  const arrowText = isLast
    ? (customLast || 'mapahds.com')
    : (n === 1 ? 'arraste' : 'continua');
  const arrowSym = isLast ? '' : '<span class="arr">→</span>';
  return `
    <div class="foot">
      <span>${pageNo(n, total)}</span>
      <span class="arrow">${arrowText} ${arrowSym}</span>
    </div>`;
}

// =============================================================================
// RENDER FUNCTIONS — uma por kind
// =============================================================================

function renderCover(slide, total) {
  const blockHtml = md(slide.coverBlock).split('\n\n').map(p =>
    `<p>${p.replace(/\n/g, '<br>')}</p>`
  ).join('');
  if (slide.withImage && slide.image) {
    const imageStyle = `background-image: url('${imageUrl(slide.image)}')`;
    return `
  <div class="slide cover with-image" data-n="${slide.n}">
    <div class="header-strip">${topBlock(DATA.handle)}</div>
    <div class="image-zone" style="${imageStyle}"></div>
    <div class="text-strip">
      <div>
        <div class="cover-block">${blockHtml}</div>
        <div class="cover-hook"><span class="arr">→</span><span>${md(slide.coverHook)}</span></div>
      </div>
      ${footBlock(slide.n, total, false)}
    </div>
  </div>`.trim();
  }
  return `
  <div class="slide cover" data-n="${slide.n}">
    ${topBlock(DATA.handle)}
    <div class="content">
      <div class="cover-block">${blockHtml}</div>
      <div class="cover-hook"><span class="arr">→</span><span>${md(slide.coverHook)}</span></div>
    </div>
    ${footBlock(slide.n, total, false)}
  </div>`.trim();
}

function renderNarrativeWithImage(slide, total) {
  const eyebrow = slide.eyebrow ? `<div class="eyebrow">${slide.eyebrow}</div>` : '';
  const body = slide.body ? `<div class="body-text">${md(slide.body)}</div>` : '';
  const source = slide.source ? `<div class="source">${md(slide.source)}</div>` : '';
  const cap = slide.imageCaption ? `<div class="img-caption">${slide.imageCaption}</div>` : '';
  const imageStyle = `background-image: url('${imageUrl(slide.image)}')`;
  return `
  <div class="slide narrative with-image" data-n="${slide.n}">
    <div class="header-strip">
      ${topBlockWithPage(slide.n, total)}
    </div>
    <div class="image-zone" style="${imageStyle}"></div>
    ${cap}
    <div class="text-strip">
      <div>
        ${eyebrow}
        <h1 class="title">${md(slide.title)}</h1>
        ${body}
        ${source}
      </div>
      ${footBlock(slide.n, total, false)}
    </div>
  </div>`.trim();
}

function renderMechlist(slide, total) {
  const eyebrow = slide.eyebrow ? `<div class="eyebrow">${slide.eyebrow}</div>` : '';
  const pairs = (slide.pairs || []).map(([from, to]) => `
    <div class="pair">
      <span class="pair-from">${md(from)}</span>
      <span class="pair-arrow">→</span>
      <span class="pair-to">${md(to)}</span>
    </div>`).join('');
  const closing = slide.closing ? `<div class="closing">${md(slide.closing)}</div>` : '';
  return `
  <div class="slide mechlist" data-n="${slide.n}">
    ${topBlockWithPage(slide.n, total)}
    <div class="content">
      ${eyebrow}
      <h1 class="title">${md(slide.title)}</h1>
      <div class="pair-list">${pairs}</div>
      ${closing}
    </div>
    ${footBlock(slide.n, total, false)}
  </div>`.trim();
}

function renderViaCards(slide, total) {
  const eyebrow = slide.eyebrow ? `<div class="eyebrow">${slide.eyebrow}</div>` : '';
  const vias = (slide.vias || []).map(v => `
    <div class="via">
      <div class="via-n">${v.n}</div>
      <div class="via-content">
        <div class="via-label">${md(v.label)}</div>
        <div class="via-text">${md(v.text)}</div>
      </div>
    </div>`).join('');
  const closing = slide.closing ? `<div class="closing">${md(slide.closing)}</div>` : '';
  const cap = slide.imageCaption ? `<div class="img-caption">${slide.imageCaption}</div>` : '';
  const imageStyle = slide.image ? `background-image: url('${imageUrl(slide.image)}')` : '';
  return `
  <div class="slide via-cards with-image" data-n="${slide.n}">
    <div class="header-strip">
      ${topBlockWithPage(slide.n, total)}
    </div>
    <div class="image-zone" style="${imageStyle}"></div>
    ${cap}
    <div class="text-strip">
      <div>
        ${eyebrow}
        <h1 class="title">${md(slide.title)}</h1>
        <div class="vias">${vias}</div>
        ${closing}
      </div>
      ${footBlock(slide.n, total, false)}
    </div>
  </div>`.trim();
}

function renderScenelist(slide, total) {
  const eyebrow = slide.eyebrow ? `<div class="eyebrow">${slide.eyebrow}</div>` : '';
  const scenes = (slide.scenes || []).map(s => `<div class="scene-item">${md(s)}</div>`).join('');
  const closing = slide.closing ? `<div class="closing">${md(slide.closing)}</div>` : '';
  return `
  <div class="slide scenelist" data-n="${slide.n}">
    ${topBlockWithPage(slide.n, total)}
    <div class="content">
      ${eyebrow}
      <h1 class="title">${md(slide.title)}</h1>
      <div class="scene-list">${scenes}</div>
      ${closing}
    </div>
    ${footBlock(slide.n, total, false)}
  </div>`.trim();
}

function renderRebuttal(slide, total) {
  const eyebrow = slide.eyebrow ? `<div class="eyebrow">${slide.eyebrow}</div>` : '';
  const body = slide.body ? `<div class="body-text">${md(slide.body)}</div>` : '';
  const strike = slide.strike ? `
    <div class="strike-block">
      <div class="strike-x">✕</div>
      <div class="strike-content">
        <div class="strike-text">${md(slide.strike)}</div>
        ${slide.strikeNote ? `<div class="strike-note">${md(slide.strikeNote)}</div>` : ''}
      </div>
    </div>` : '';
  return `
  <div class="slide rebuttal" data-n="${slide.n}">
    ${topBlockWithPage(slide.n, total)}
    <div class="content">
      ${eyebrow}
      <h1 class="title">${md(slide.title)}</h1>
      ${strike}
      ${body}
    </div>
    ${footBlock(slide.n, total, false)}
  </div>`.trim();
}

function renderPrinciple(slide, total) {
  const eyebrow = slide.eyebrow ? `<div class="eyebrow">${slide.eyebrow}</div>` : '';
  const body = slide.body ? `<div class="body-text">${md(slide.body)}</div>` : '';
  return `
  <div class="slide principle" data-n="${slide.n}">
    ${topBlockWithPage(slide.n, total)}
    <div class="content">
      ${eyebrow}
      <h1 class="title">${md(slide.title)}</h1>
      ${body}
    </div>
    ${footBlock(slide.n, total, false)}
  </div>`.trim();
}

function renderSlam(slide, total) {
  const eyebrow = slide.eyebrow ? `<div class="eyebrow">${slide.eyebrow}</div>` : '';
  const body = slide.body ? `<div class="body-text">${md(slide.body)}</div>` : '';
  const cap = slide.imageCaption ? `<div class="img-caption">${slide.imageCaption}</div>` : '';
  const imageStyle = slide.image ? `background-image: url('${imageUrl(slide.image)}')` : '';
  const finalLines = (slide.finalLines || []).map(l => `<div class="final-line">${md(l)}</div>`).join('');
  return `
  <div class="slide slam with-image" data-n="${slide.n}">
    <div class="header-strip">
      ${topBlockWithPage(slide.n, total)}
    </div>
    <div class="image-zone" style="${imageStyle}"></div>
    ${cap}
    <div class="text-strip">
      <div>
        ${eyebrow}
        <h1 class="title">${md(slide.title)}</h1>
        ${body}
        ${finalLines ? `<div class="final-block">${finalLines}</div>` : ''}
      </div>
      ${footBlock(slide.n, total, false)}
    </div>
  </div>`.trim();
}

function renderOffer(slide, total) {
  const eyebrow = slide.eyebrow ? `<div class="eyebrow">${slide.eyebrow}</div>` : '';
  const list = (slide.pastaList || []).map(([k, v]) =>
    `<div class="pasta-line"><span class="pasta-key">${k}</span>${md(v)}</div>`
  ).join('');
  const closing = slide.pastaClosing ? `<div class="pasta-closing">${md(slide.pastaClosing)}</div>` : '';
  return `
  <div class="slide offer" data-n="${slide.n}">
    ${topBlockWithPage(slide.n, total)}
    <div class="content top-aligned">
      ${eyebrow}
      <h1 class="title">${md(slide.title)}</h1>
      <div class="pasta-list">${list}</div>
      ${closing}
    </div>
    ${footBlock(slide.n, total, false)}
  </div>`.trim();
}

function renderCta(slide, total) {
  const eyebrow = slide.eyebrow ? `<div class="eyebrow">${slide.eyebrow}</div>` : '';
  // Verbose CTA = tem ctaCall ou body. Minimalista = só eyebrow + title.
  const isVerbose = slide.ctaCall || slide.body;
  const klass = isVerbose ? 'cta-verbose' : 'cta';
  const ctaCall = slide.ctaCall ? `<div class="cta-call">${md(slide.ctaCall)}</div>` : '';
  const body = slide.body ? `<div class="body-text">${md(slide.body)}</div>` : '';
  return `
  <div class="slide ${klass}" data-n="${slide.n}">
    ${topBlockWithPage(slide.n, total)}
    <div class="content">
      ${eyebrow}
      <h1 class="title">${md(slide.title)}</h1>
      ${ctaCall}
      ${body}
    </div>
    ${footBlock(slide.n, total, true, slide.footText)}
  </div>`.trim();
}

function renderStandard(slide, total) {
  const klass = slide.kind || 'scene';
  const eyebrow = slide.eyebrow ? `<div class="eyebrow">${slide.eyebrow}</div>` : '';
  const body = slide.body ? `<div class="body-text">${md(slide.body)}</div>` : '';
  const source = slide.source ? `<div class="source">${md(slide.source)}</div>` : '';
  const isLast = slide.n === total;
  return `
  <div class="slide ${klass}" data-n="${slide.n}">
    ${topBlockWithPage(slide.n, total)}
    <div class="content">
      ${eyebrow}
      <h1 class="title">${md(slide.title)}</h1>
      ${body}
      ${source}
    </div>
    ${footBlock(slide.n, total, isLast)}
  </div>`.trim();
}

function renderSlide(slide, total) {
  const klass = slide.kind || 'scene';
  if (klass === 'cover') return renderCover(slide, total);
  if (klass === 'cta') return renderCta(slide, total);
  if (klass === 'principle') return renderPrinciple(slide, total);
  if (klass === 'mechlist') return renderMechlist(slide, total);
  if (klass === 'via-cards') return renderViaCards(slide, total);
  if (klass === 'scenelist') return renderScenelist(slide, total);
  if (klass === 'rebuttal') return renderRebuttal(slide, total);
  if (klass === 'slam') return renderSlam(slide, total);
  if (klass === 'offer') return renderOffer(slide, total);
  if (slide.withImage) return renderNarrativeWithImage(slide, total);
  return renderStandard(slide, total);
}

const slidesHtml = DATA.slides.map(s => renderSlide(s, DATA.totalSlides)).join('\n');
const fullHtml = TEMPLATE.replace('<!-- SLIDES_INJECTED_HERE -->', slidesHtml);
fs.writeFileSync(path.join(OUT, 'preview.html'), fullHtml, 'utf8');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(OUT, 'preview.html'), { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const slides = await page.$$('.slide');
  console.log(`Renderizando ${slides.length} slides…`);

  for (let i = 0; i < slides.length; i++) {
    const n = String(i + 1).padStart(2, '0');
    const file = path.join(OUT, `${n}.png`);
    await slides[i].screenshot({ path: file, omitBackground: false });
    process.stdout.write(`  ${n}.png ✓\n`);
  }

  await browser.close();
  console.log(`\nPronto: ${OUT}`);
})();
