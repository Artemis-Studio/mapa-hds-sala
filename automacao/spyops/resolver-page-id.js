// resolver-page-id.js — descobre o page id numérico de um anunciante no Facebook.
//
// Por que existe: a busca por palavra-chave na Ad Library faz match amplo e devolve
// anúncio de gente que não tem nada a ver. O caminho confiável é `--page-id`, e este
// script acha o id a partir do @ da página.
//
// Uso (da raiz da Sala):
//   node automacao/spyops/resolver-page-id.js <handle> [handle...]
//
// O handle é o que vem depois de facebook.com/ — geralmente está no rodapé do site
// do concorrente. Ex: facebook.com/rampersoftware → o handle é "rampersoftware".

const puppeteer = require("puppeteer");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Ordem importa. Página na "nova experiência" expõe dois ids: `userID` é o do PERFIL
// (100064…, a Ad Library mostra 0 anúncio e o About vem "Identificação: undefined") e
// `associated_page_id` é o da PÁGINA, que é o que a Ad Library usa. Caso real 09/2026:
// facebook.com/queroPassagem → userID 100064734034715 (0 ads) vs associated_page_id
// 327243384008272 (18 ads). Por isso associated_page_id vem primeiro.
const PADROES = [
  /"associated_page_id"\s*:\s*"?(\d{6,})"?/,
  /"pageID"\s*:\s*"(\d{6,})"/,
  /"page_id"\s*:\s*"?(\d{6,})"?/,
  /"delegate_page_id"\s*:\s*"?(\d{6,})"?/,
  /"entity_id"\s*:\s*"(\d{6,})"/,
  /"userID"\s*:\s*"?(\d{6,})"?/,
  /profile_id=(\d{6,})/,
];

(async () => {
  const handles = process.argv.slice(2);
  if (!handles.length) {
    console.error("uso: node automacao/spyops/resolver-page-id.js <handle> [handle...]");
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  console.log("");

  for (const h of handles) {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    );
    let id = null;
    try {
      await page.goto("https://www.facebook.com/" + h, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      await sleep(3000);
      const html = await page.content();
      for (const p of PADROES) {
        const m = html.match(p);
        if (m) { id = m[1]; break; }
      }
    } catch (e) {
      id = null;
      console.log(`  ${h.padEnd(22)} erro: ${e.message.slice(0, 60)}`);
      await page.close();
      continue;
    }

    if (id) {
      console.log(`  ${h.padEnd(22)} ${id}`);
      console.log(`  ${" ".repeat(22)} node automacao/spyops/spy-ads.js --page-id ${id} --country BR --status active --out "spy/${h.toLowerCase().replace(/[^a-z0-9]+/g, "-")}"`);
    } else {
      console.log(`  ${h.padEnd(22)} (não encontrado — a página pode exigir login ou não existir)`);
    }
    console.log("");
    await page.close();
  }

  await browser.close();
})();
