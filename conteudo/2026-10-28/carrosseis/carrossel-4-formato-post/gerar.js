// gerar.js — carrossel em formato de post (avatar + nome + texto + imagem), identidade Mapa HDS.
// Uso: node gerar.js → out/01.png … (1080×1350)
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = __dirname;
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'slides.json'), 'utf8'));
const OUT = path.join(ROOT, 'out');
const AVATAR = 'file://' + path.join(ROOT, 'img', 'avatar.png');
fs.mkdirSync(OUT, { recursive: true });

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const paras = (t) => t.split('\n\n').map((p) => `<p>${esc(p)}</p>`).join('');

const slide = (s) => `
<div class="slide ${s.img ? 'com-img' : 'so-texto'}">
  <div class="post">
    <div class="autor">
      <img class="avatar" src="${AVATAR}">
      <div><div class="nome">${DATA.nome}</div><div class="handle">${DATA.handle}</div></div>
    </div>
    <div class="texto">${paras(s.texto)}</div>
    ${s.img ? `<div class="foto" style="background-image:url('file://${path.join(ROOT, s.img)}')"></div>` : ''}
  </div>
</div>`;

const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Roboto:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #DADADA; }
  .slide { width: 1080px; height: 1350px; background: #FFFFFF; display: flex; align-items: center; padding: 0 64px; overflow: hidden; }
  .post { width: 100%; }
  .autor { display: flex; align-items: center; gap: 20px; margin-bottom: 36px; }
  .avatar { width: 84px; height: 84px; border-radius: 50%; display: block; }
  .nome { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 32px; color: #1A1A1A; line-height: 1.15; }
  .handle { font-family: 'Roboto', sans-serif; font-size: 26px; color: rgba(26,26,26,0.55); }
  .texto p { font-family: 'Roboto', sans-serif; font-size: 37px; line-height: 1.38; color: #1A1A1A; margin-bottom: 30px; }
  .texto p:last-child { margin-bottom: 0; }
  .so-texto .texto p { font-size: 42px; }
  .foto { margin-top: 44px; width: 100%; height: 520px; border-radius: 28px; background-size: cover; background-position: center; }
</style></head><body>${DATA.slides.map(slide).join('')}</body></html>`;

fs.writeFileSync(path.join(OUT, 'preview.html'), html);

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(OUT, 'preview.html'), { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  // Texto que não coube some calado: acusa slide em que o post passou da altura.
  const estouro = await page.$$eval('.slide', (els) =>
    els.map((e, i) => (e.querySelector('.post').scrollHeight > 1350 - 96 ? i + 1 : 0)).filter(Boolean));
  if (estouro.length) console.log('⚠ estourou:', estouro.join(', '));
  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) {
    await slides[i].screenshot({ path: path.join(OUT, String(i + 1).padStart(2, '0') + '.png') });
  }
  await browser.close();
  console.log(`${slides.length} slides em ${OUT}`);
})();
