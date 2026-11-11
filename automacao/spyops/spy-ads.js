#!/usr/bin/env node
/**
 * SpyOps — raspa a Meta Ad Library pública (sem token, sem login).
 * Motor: Puppeteer (NUNCA Playwright — convenção da casa).
 *
 * Uso:
 *   node automacao/spyops/spy-ads.js --url "<URL completa da Ad Library>" --out spy/<slug>
 *   node automacao/spyops/spy-ads.js --q "concorrente.com" --out spy/<slug>
 *   node automacao/spyops/spy-ads.js --page-id 353858751328296 --out spy/<slug>
 *
 * Flags: --country BR · --status active|all|inactive · --max-scrolls 40
 *
 * Saídas em --out:
 *   spy-raw-innertext.txt   texto integral da página (fonte da verdade)
 *   spy-raw-hrefs.json      links externos capturados (destinos dos ads)
 *   spy-ads.json            cards parseados + agrupamento por copy + destinos
 *   spy-ads.md              resumo legível
 *
 * Rodar SEMPRE da raiz da Sala (é lá que o preparar.sh instalou o Puppeteer).
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseArgs() {
  const a = process.argv.slice(2);
  const o = { country: "BR", status: "active", maxScrolls: 40 };
  for (let i = 0; i < a.length; i++) {
    switch (a[i]) {
      case "--url": o.url = a[++i]; break;
      case "--q": o.q = a[++i]; break;
      case "--page-id": o.pageId = a[++i]; break;
      case "--country": o.country = a[++i]; break;
      case "--status": o.status = a[++i]; break;
      case "--out": o.out = a[++i]; break;
      case "--max-scrolls": o.maxScrolls = parseInt(a[++i]); break;
    }
  }
  if (!o.out) { console.error("Faltou --out <dir>"); process.exit(1); }
  if (!o.url) {
    if (o.q) {
      o.url = `https://www.facebook.com/ads/library/?active_status=${o.status}&ad_type=all&country=${o.country}&is_targeted_country=false&media_type=all&q=${encodeURIComponent(o.q)}&search_type=keyword_unordered&sort_data[direction]=desc&sort_data[mode]=total_impressions`;
    } else if (o.pageId) {
      o.url = `https://www.facebook.com/ads/library/?active_status=${o.status}&ad_type=all&country=${o.country}&is_targeted_country=false&media_type=all&search_type=page&view_all_page_id=${o.pageId}&sort_data[direction]=desc&sort_data[mode]=total_impressions`;
    } else {
      console.error("Passe --url, --q ou --page-id"); process.exit(1);
    }
  }
  return o;
}

const PT_MONTHS = { jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6, jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12 };
const EN_MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

function parseStarted(blk) {
  let m = blk.match(/Started running on\s+([A-Za-z]{3})[a-z]*\s+(\d{1,2}),\s*(\d{4})/);
  if (m && EN_MONTHS[m[1]]) return `${m[3]}-${String(EN_MONTHS[m[1]]).padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  m = blk.match(/Veicula[cç][aã]o iniciada em\s+(\d{1,2})\s+de\s+([a-zç]+)\s+de\s+(\d{4})/i);
  if (m && PT_MONTHS[m[2].slice(0, 3).toLowerCase()]) return `${m[3]}-${String(PT_MONTHS[m[2].slice(0, 3).toLowerCase()]).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  return "";
}

const CTA_RE = /\n(Order now|Book now|Sign Up|Shop Now|Get Offer|Apply Now|Contact Us|Watch More|Send Message|Get Quote|Get quote|Install now|Install Now|Play game|Use app|Listen now|Reserve agora|Learn more|Learn More|Saiba mais|Request time|Solicitar hor[aá]rio|See details|Ver detalhes|Send WhatsApp message|Enviar mensagem(?: pelo WhatsApp)?|Sign up|Cadastre-se|Shop now|Comprar agora|Subscribe|Download|Get offer|Apply now|Contact us|Watch more)\n/;

// mesma lista, como linha solta no fim do corpo (case-insensitive)
const CTA_SOLTO = new RegExp("^(?:" + CTA_RE.source.slice(3, -3) + ")$", "i");

function parseCards(text) {
  const blocks = text.split(/\n(?=(?:Library ID|Identifica[cç][aã]o da biblioteca):\s*\d+)/);
  const cards = [];
  for (const blk of blocks) {
    const mId = blk.match(/(?:Library ID|Identifica[cç][aã]o da biblioteca):\s*(\d+)/);
    if (!mId) continue;
    const mGrp = blk.match(/(\d+)\s+(?:ads use this creative and text|an[uú]ncios usam esse criativo)/);
    const mBody = blk.match(
      /\n(?:Sponsored|Patrocinado)\s*\n([\s\S]*?)(?=\n0:00 \/ |\nLow impression count|\n[A-Z0-9][A-Z0-9.\-]+\.[A-Z]{2,}\n|\nSorry,|(?=\n(?:Order now|Book now|Reserve agora|Learn more|Learn More|Saiba mais|See details|Sign up|Shop now|Subscribe|Download|Send WhatsApp message|Enviar mensagem)\n)|\n(?:Library ID|Identifica[cç][aã]o da biblioteca):|$)/
    );
    const mPage = blk.match(/\n([^\n]{2,80})\n(?:Sponsored|Patrocinado)\n/);
    const mCap = blk.match(/\n([A-Z0-9][A-Z0-9.\-]+\.[A-Z]{2,})\n/);
    const mVid = blk.match(/0:00 \/ (\d+:\d+)/);
    const mCta = blk.match(CTA_RE);
    // o corpo às vezes arrasta o rodapé do card: "Sign Up\n\u200b\nActive". Limpa o status,
    // o zero-width e, se a última linha for um botão de CTA conhecido, move pro cta_button.
    let body = mBody ? mBody[1] : "";
    body = body.replace(/[\u200b\u200c\u200d\ufeff]/g, "")
      .replace(/\s*\n\s*(?:Active|Inactive|Ativo|Inativo)\s*$/, "").trim();
    // "Low impression count" já vira low_impressions; legenda do link (DOMINIO.COM.BR, em caixa
    // alta) vai pro link_caption e sai do texto
    let capSolta = "";
    body = body.split("\n").filter((l) => {
      const t = l.trim();
      if (/^Low impression count/i.test(t)) return false;
      if (/^(?:HTTPS?:\/\/)?[A-Z0-9][A-Z0-9.\-]*\.[A-Z]{2,}(?:\/\S*)?$/.test(t)) { capSolta = capSolta || t; return false; }
      return true;
    }).join("\n").trim();
    let cta = mCta ? mCta[1] : "";
    const ultima = body.split("\n").pop().trim();
    if (body.includes("\n") && CTA_SOLTO.test(ultima)) {
      if (!cta) cta = ultima;
      body = body.slice(0, body.lastIndexOf("\n")).trim();
    }
    cta = cta ? cta.charAt(0).toUpperCase() + cta.slice(1).toLowerCase() : "";
    cards.push({
      library_id: mId[1],
      started: parseStarted(blk),
      page_name: mPage ? mPage[1].trim() : "",
      group_size: mGrp ? parseInt(mGrp[1]) : 1,
      low_impressions: /Low impression count/.test(blk),
      primary_text: body,
      video_duration: mVid ? mVid[1] : null,
      link_caption: mCap ? mCap[1] : capSolta,
      cta_button: cta,
      snapshot_url: `https://www.facebook.com/ads/library/?id=${mId[1]}`,
    });
  }
  return cards;
}

function summarize(cards) {
  const byBody = new Map();
  for (const c of cards) {
    // " ." no fim, espaço e linha em branco a mais não fazem outra copy
    const k = c.primary_text.replace(/[ \t]+/g, " ").replace(/\n{2,}/g, "\n").replace(/[\s.]+$/, "").trim();
    if (!byBody.has(k)) byBody.set(k, []);
    byBody.get(k).push(c);
  }
  const groups = [...byBody.entries()]
    .map(([body, g]) => ({
      primary_text: body,
      cards: g.length,
      total_ads: g.reduce((s, c) => s + c.group_size, 0),
      pages: [...new Set(g.map((c) => c.page_name).filter(Boolean))],
      video_durations: [...new Set(g.map((c) => c.video_duration || "estático"))].sort(),
      ctas: [...new Set(g.map((c) => c.cta_button).filter(Boolean))],
      captions: [...new Set(g.map((c) => c.link_caption).filter(Boolean))],
      first_started: g.map((c) => c.started).filter(Boolean).sort()[0] || "",
      library_ids: g.map((c) => c.library_id),
      snapshot_url_sample: g[0].snapshot_url,
    }))
    .sort((a, b) => b.total_ads - a.total_ads);
  return groups;
}

function decodeDest(h) {
  try {
    if (h.includes("l.facebook.com/l.php")) {
      const u = new URL(h).searchParams.get("u");
      return u ? decodeURIComponent(u) : h;
    }
  } catch (_) {}
  return h;
}

(async () => {
  const opt = parseArgs();
  fs.mkdirSync(opt.out, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-blink-features=AutomationControlled", "--lang=pt-BR"],
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1440, height: 1800 });

  console.log(`Abrindo: ${opt.url}`);
  await page.goto(opt.url, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(4000);
  try { await page.click('[data-cookiebanner="accept_button"]'); await sleep(1500); } catch (_) {}
  try { await page.keyboard.press("Escape"); await sleep(800); } catch (_) {}

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

  const data = await page.evaluate(() => ({
    text: document.body.innerText,
    hrefs: Array.from(document.querySelectorAll("a[href]"))
      .map((a) => a.href)
      .filter((h) => h.includes("l.facebook.com/l.php") || (!h.includes("facebook.com") && h.startsWith("http"))),
  }));
  await browser.close();

  fs.writeFileSync(path.join(opt.out, "spy-raw-innertext.txt"), data.text);
  fs.writeFileSync(path.join(opt.out, "spy-raw-hrefs.json"), JSON.stringify(data.hrefs, null, 2));

  const cards = parseCards(data.text);
  const groups = summarize(cards);
  const dests = {};
  for (const h of data.hrefs) {
    const d = decodeDest(h).split("?")[0];
    if (d.includes("facebook.com") || d.includes("metastatus")) continue;
    dests[d] = (dests[d] || 0) + 1;
  }

  const out = {
    captured_at: new Date().toISOString(),
    source_url: opt.url,
    total_cards: cards.length,
    total_ads_with_groups: cards.reduce((s, c) => s + c.group_size, 0),
    destinations: dests,
    creative_groups: groups,
    cards,
  };
  fs.writeFileSync(path.join(opt.out, "spy-ads.json"), JSON.stringify(out, null, 2));

  const md = [
    `# SpyOps — Ad Library`,
    ``,
    `- **Fonte:** ${opt.url}`,
    `- **Capturado em:** ${out.captured_at}`,
    `- **Cards:** ${out.total_cards} · **Ads (com grupos):** ${out.total_ads_with_groups}`,
    ``,
    `## Destinos`,
    ...Object.entries(dests).sort((a, b) => b[1] - a[1]).map(([d, n]) => `- ${n}× ${d}`),
    ``,
    `## Criativos agrupados por copy (mais ads primeiro)`,
    ``,
  ];
  groups.forEach((g, i) => {
    md.push(`### #${i + 1} — ${g.total_ads} ads (${g.cards} cards) · ${g.pages.join(", ")}`);
    if (g.first_started) md.push(`- Primeiro start: ${g.first_started}`);
    if (g.video_durations.length) md.push(`- Formatos: ${g.video_durations.join(", ")}`);
    if (g.ctas.length) md.push(`- CTA: ${g.ctas.join(" / ")}`);
    if (g.captions.length) md.push(`- Destino exibido: ${g.captions.join(" / ")}`);
    md.push(`- Library IDs: ${g.library_ids.slice(0, 8).join(", ")}${g.library_ids.length > 8 ? "…" : ""}`);
    md.push("", "**Primary text:**", "", "> " + (g.primary_text || "_(sem texto)_").replace(/\n/g, "\n> "), "");
    md.push(`[Snapshot →](${g.snapshot_url_sample})`, "", "---", "");
  });
  fs.writeFileSync(path.join(opt.out, "spy-ads.md"), md.join("\n"));

  console.log(`\n→ ${out.total_cards} cards, ${groups.length} copies únicas`);
  console.log(`→ ${path.join(opt.out, "spy-ads.json")}`);
  console.log(`→ ${path.join(opt.out, "spy-ads.md")}`);
})();
