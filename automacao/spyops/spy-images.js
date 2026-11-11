#!/usr/bin/env node
/**
 * SpyOps — baixa os CRIATIVOS ESTÁTICOS dos anúncios da Meta Ad Library.
 * Motor: Puppeteer (NUNCA Playwright) + curl + sips.
 *
 * ATENÇÃO — por que este script usa a LISTAGEM e não a página de detalhe:
 * a página `?id=<library_id>` embute o POOL de imagens do anunciante inteiro
 * (~19 URLs em "original_image_url", idênticas de um ad pro outro), exatamente
 * como acontece com os .mp4 no spy-videos.js. Puxar dali entrega a mesma arte
 * pra todos os ads — de-para errado, análise errada. Na LISTAGEM cada card é um
 * nó de DOM com o seu "Library ID: <n>" e a sua <img> dentro: associação 1:1.
 * Ao contrário do vídeo (de-para por duração), aqui o vínculo é estrutural.
 *
 * Uso:
 *   node automacao/spyops/spy-images.js --url "<URL da Ad Library>" --out spy/<slug>/imagens
 *   node automacao/spyops/spy-images.js --q "marca.com" --out spy/<slug>/imagens
 *
 * Flags:
 *   --max-scrolls 40   igual ao spy-ads.js
 *   --min-px 300       lado maior mínimo pra considerar criativo (descarta avatar/ícone)
 *   --only "id1,id2"   baixa só esses library_ids
 *
 * Saídas em --out: <library_id>.jpg · image-index.json (com hash pra achar arte repetida)
 * Ler cada .jpg com a tool Read — a copy dentro da arte não está na legenda.
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseArgs() {
  const a = process.argv.slice(2);
  const o = { out: null, maxScrolls: 40, minPx: 300, only: null, country: "BR", status: "active" };
  for (let i = 0; i < a.length; i++) {
    switch (a[i]) {
      case "--url": o.url = a[++i]; break;
      case "--q": o.q = a[++i]; break;
      case "--page-id": o.pageId = a[++i]; break;
      case "--out": o.out = a[++i]; break;
      case "--max-scrolls": o.maxScrolls = parseInt(a[++i], 10); break;
      case "--min-px": o.minPx = parseInt(a[++i], 10); break;
      case "--only": o.only = a[++i].split(",").map((s) => s.trim()).filter(Boolean); break;
      case "--country": o.country = a[++i]; break;
      case "--status": o.status = a[++i]; break;
    }
  }
  if (!o.out) { console.error("faltou --out"); process.exit(1); }
  if (!o.url) {
    const base = "https://www.facebook.com/ads/library/?active_status=" + o.status +
      "&ad_type=all&country=" + o.country + "&media_type=all";
    if (o.pageId) o.url = base + "&search_type=page&view_all_page_id=" + o.pageId;
    else if (o.q) o.url = base + "&search_type=keyword_unordered&q=" + encodeURIComponent(o.q);
    else { console.error("faltou --url, --q ou --page-id"); process.exit(1); }
  }
  return o;
}

function dimensions(file) {
  try {
    const r = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], { encoding: "utf8" });
    const w = /pixelWidth:\s*(\d+)/.exec(r), h = /pixelHeight:\s*(\d+)/.exec(r);
    return w && h ? { w: +w[1], h: +h[1] } : null;
  } catch (_) { return null; }
}

(async () => {
  const opt = parseArgs();
  fs.mkdirSync(opt.out, { recursive: true });

  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--lang=en-US"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
  );
  console.log("Abrindo:", opt.url);
  await page.goto(opt.url, { waitUntil: "networkidle2", timeout: 90000 });
  await sleep(6000);

  let prev = 0, stable = 0;
  for (let i = 0; i < opt.maxScrolls; i++) {
    // rolar com a roda do mouse (o infinite scroll da Ad Library ouve eventos de rolagem
    // reais; o scrollTo seco às vezes não dispara a próxima página) e, quando trava,
    // subir um pouco e descer de novo
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.mouse.move(700, 500);
    await page.mouse.wheel({ deltaY: 2500 });
    await sleep(2500);
    let n = await page.evaluate(
      () => (document.body.innerText.match(/(?:Library ID|Identificação da biblioteca):\s*\d+/g) || []).length
    );
    if (n === prev) {
      // em parte das máquinas a Ad Library pagina com um botão "See more"/"Ver mais" no fim
      // da lista em vez de rolagem infinita (20/10/2026, Windows no GitHub: parava em 29)
      const clicou = await page.evaluate(() => {
        const bs = [...document.querySelectorAll('div[role="button"], button, a[role="button"], span')]
          .filter((e) => /^(see more|ver mais|mostrar mais)$/i.test((e.innerText || "").trim()) && e.offsetParent);
        const b = bs.pop();
        if (b) { b.scrollIntoView({ block: "center" }); b.click(); return true; }
        return false;
      });
      if (clicou) await sleep(3500);
      await page.mouse.wheel({ deltaY: -1800 });
      await sleep(800);
      await page.mouse.wheel({ deltaY: 4000 });
      await sleep(3000);
      n = await page.evaluate(
        () => (document.body.innerText.match(/(?:Library ID|Identificação da biblioteca):\s*\d+/g) || []).length
      );
    }
    process.stdout.write(`scroll ${i + 1}: ${n} cards\n`);
    if (n === prev) { if (++stable >= 4) break; } else stable = 0;
    prev = n;
  }
  {
    // se travou, diz por quê: login pedido pela Meta costuma ser o motivo
    const fim = await page.evaluate(() => document.body.innerText.slice(-400));
    if (/log in|entrar|faça login|see more|ver mais/i.test(fim)) console.log("aviso — fim da página:", fim.replace(/\s+/g, " ").slice(-200));
  }
  // deixa as imagens lazy-loaded assentarem
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(3000);

  // Associação 1:1 — pra cada <img>, sobe na árvore até o ancestral que contém
  // EXATAMENTE um "Library ID: <n>". Esse é o card do anúncio.
  const pairs = await page.evaluate((minPx) => {
    const RE = /(?:Library ID|Identificação da biblioteca):\s*(\d+)/g;
    const out = [];
    // Card de vídeo não tem <img> da arte: a capa é o poster do <video>. Entra com kind
    // "poster" e área fictícia pequena, pra nunca ganhar de uma arte estática do mesmo card.
    const posters = [...document.querySelectorAll("video[poster]")]
      .map((v) => ({ el: v, src: v.poster, naturalWidth: 1, naturalHeight: 1, kind: "poster" }));
    for (const img of [...document.querySelectorAll("img"), ...posters]) {
      if (!img.src || !img.src.startsWith("http")) continue;
      if (!img.kind && Math.max(img.naturalWidth, img.naturalHeight) < minPx) continue;
      let el = (img.el || img).parentElement, id = null;
      for (let hop = 0; hop < 22 && el; hop++, el = el.parentElement) { // vídeo fica 14–15 níveis abaixo do card
        const t = el.innerText || "";
        const ids = [...t.matchAll(RE)].map((m) => m[1]);
        if (ids.length === 1) { id = ids[0]; break; }
        if (ids.length > 1) break; // subiu demais: já pegou vários cards
      }
      if (id) out.push({ library_id: id, src: img.src, w: img.naturalWidth, h: img.naturalHeight, kind: img.kind || "arte" });
    }
    return out;
  }, opt.minPx);

  await browser.close();

  // por card, fica a maior imagem (a arte; o resto é avatar/badge)
  const best = new Map();
  for (const p of pairs) {
    if (opt.only && !opt.only.includes(p.library_id)) continue;
    const cur = best.get(p.library_id);
    if (!cur || p.w * p.h > cur.w * cur.h) best.set(p.library_id, p);
  }
  console.log(`\n${pairs.length} imagens associadas · ${best.size} anúncios com arte`);

  const index = [];
  for (const [id, p] of best) {
    const file = path.join(opt.out, `${id}.jpg`);
    try {
      execFileSync("curl", ["-sL", "--max-time", "60", "-o", file, p.src]);
      const size = fs.existsSync(file) ? fs.statSync(file).size : 0;
      if (size < 3000) { fs.unlinkSync(file); console.log(`✗ ${id}: download vazio`); continue; }
      const dim = dimensions(file) || { w: p.w, h: p.h };
      const hash = crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex").slice(0, 10);
      index.push({ library_id: id, file: `${id}.jpg`, kind: p.kind, ...dim, hash, url: p.src });
      console.log(`✓ ${id}.jpg (${dim.w}x${dim.h}) ${hash}`);
    } catch (e) {
      console.log(`✗ ${id}: ${e.message}`);
    }
  }

  // artes repetidas entre ads (mesmo criativo, copy diferente) — sinal de teste de copy
  const byHash = {};
  index.forEach((r) => (byHash[r.hash] = byHash[r.hash] || []).push(r.library_id));
  const dupes = Object.entries(byHash).filter(([, v]) => v.length > 1);
  fs.writeFileSync(path.join(opt.out, "image-index.json"),
    JSON.stringify({ total: index.length, unique_creatives: Object.keys(byHash).length, images: index, by_hash: byHash }, null, 2));

  console.log(`\n→ ${index.length} imagens · ${Object.keys(byHash).length} artes únicas em ${opt.out}`);
  if (dupes.length) {
    console.log("Arte reaproveitada em mais de um ad (teste de COPY sobre criativo fixo):");
    dupes.forEach(([h, v]) => console.log(`  ${h}: ${v.join(", ")}`));
  }
  console.log("Ler cada .jpg com a tool Read: a copy dentro da arte não está na legenda.");
})();
