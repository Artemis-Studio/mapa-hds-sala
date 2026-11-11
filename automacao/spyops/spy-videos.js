#!/usr/bin/env node
/**
 * SpyOps — baixa e prepara os VÍDEOS dos anúncios da Meta Ad Library.
 * Motor: Puppeteer (NUNCA Playwright) + ffprobe/ffmpeg (homebrew) + curl.
 *
 * Como funciona: a página de detalhe (facebook.com/ads/library/?id=<library_id>)
 * autoplay-a vídeos do anunciante — capturamos as URLs fbcdn .mp4 via network +
 * JSON embutido. As URLs vêm em POOL do anunciante (não 1:1 com o ad); o de-para
 * é feito pela DURAÇÃO, que aparece no card da listagem como "0:00 / 0:41".
 *
 * Uso:
 *   node automacao/spyops/spy-videos.js --ids "123,456,789" --out spy/<slug>/videos
 *   node automacao/spyops/spy-videos.js --from-json spy/<slug>/spy-ads.json --sample 5 --out spy/<slug>/videos
 *
 * Flags:
 *   --max 12          teto de vídeos únicos a baixar
 *   --order spread    quais baixar quando o pool passa do --max: spread (default, N durações
 *                     equidistantes) | asc (os mais curtos) | desc (os mais longos)
 *   --frames          gera mosaico de frames (1 frame/4s, grade 4x3) por vídeo
 *   --transcribe      transcreve com Whisper (ver pré-requisitos no README)
 *   --lang Portuguese idioma pro Whisper (use "auto" pra detectar)
 *
 * Saídas em --out: <dur>s-<hash>.mp4 · *-mosaic.jpg · *.txt · video-index.json
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Whisper local (opcional): venv próprio; no skill/plugin, a própria pasta.
const SKILL_ROOT = process.env.CLAUDE_SKILL_DIR || process.env.CLAUDE_PLUGIN_ROOT || path.resolve(__dirname, "..");
const REPO_WHISPER = path.join(__dirname, "..", "..", "automacao", "whisper", ".venv", "bin", "whisper");
const WHISPER = process.env.SPYOPS_WHISPER
  || (fs.existsSync(REPO_WHISPER) ? REPO_WHISPER : path.join(SKILL_ROOT, ".venv", "bin", "whisper"));

// ffmpeg/ffprobe: usa o do sistema; senão cai nos pacotes estáticos (via npm).
function resolveBin(sys, staticPkg, field) {
  try { execFileSync(sys, ["-version"], { stdio: "ignore" }); return sys; } catch (_) {}
  try { const m = require(staticPkg); return field ? m[field] : m; } catch (_) {}
  return sys;
}
const FFMPEG = resolveBin("ffmpeg", "ffmpeg-static");
const FFPROBE = (() => {
  try { execFileSync("ffprobe", ["-version"], { stdio: "ignore" }); return "ffprobe"; } catch (_) {}
  try { return require("ffprobe-static").path; } catch (_) {}
  return null;
})();
// Whisper dentro do Node (transformers.js): transcreve sem chave e sem Python
const LOCAL_TR = path.join(__dirname, "transcrever.mjs");
const temLocal = () => { try { require.resolve("@huggingface/transformers"); return fs.existsSync(LOCAL_TR); } catch (_) { return false; } };

// API key de transcrição (opcional): env ou <SKILL_ROOT>/.env. OpenAI ou Groq.
function transcribeKey() {
  const pick = (k) => k
    ? { key: k.startsWith("gsk_") ? k : k, url: k.startsWith("gsk_")
        ? "https://api.groq.com/openai/v1/audio/transcriptions"
        : "https://api.openai.com/v1/audio/transcriptions",
        model: k.startsWith("gsk_") ? "whisper-large-v3" : "whisper-1" }
    : null;
  if (process.env.OPENAI_API_KEY) return pick(process.env.OPENAI_API_KEY);
  if (process.env.GROQ_API_KEY) return pick(process.env.GROQ_API_KEY);
  try {
    const envf = path.join(SKILL_ROOT, ".env");
    if (fs.existsSync(envf)) {
      const o = {};
      for (const line of fs.readFileSync(envf, "utf8").split("\n")) {
        const t = line.trim();
        if (!t || t.startsWith("#")) continue;
        const i = t.indexOf("=");
        if (i > 0) o[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      }
      return pick(o.OPENAI_API_KEY || o.GROQ_API_KEY);
    }
  } catch (_) {}
  return null;
}

function parseArgs() {
  const a = process.argv.slice(2);
  const o = { max: 12, lang: "Portuguese", sample: 5, order: "spread" };
  for (let i = 0; i < a.length; i++) {
    switch (a[i]) {
      case "--ids": o.ids = a[++i].split(",").map((s) => s.trim()).filter(Boolean); break;
      case "--from-json": o.fromJson = a[++i]; break;
      case "--sample": o.sample = parseInt(a[++i]); break;
      case "--out": o.out = a[++i]; break;
      case "--max": o.max = parseInt(a[++i]); break;
      case "--order": o.order = a[++i]; break;
      case "--frames": o.frames = true; break;
      case "--transcribe": o.transcribe = true; break;
      case "--lang": o.lang = a[++i]; break;
    }
  }
  if (!o.out) { console.error("Faltou --out <dir>"); process.exit(1); }
  if (!["spread", "asc", "desc"].includes(o.order)) {
    console.error(`--order inválido: "${o.order}". Use spread | asc | desc.`); process.exit(1);
  }
  if (!o.ids && o.fromJson) {
    // Semeia só com anúncios de VÍDEO, 1 por duração distinta (os maiores grupos primeiro).
    // Antes pegava os N maiores grupos de copy, e em conta com muito estático as sementes
    // eram imagens: o pool vinha com vídeo de outros anunciantes e quase nada do alvo
    // (teste 20/10/2026, FDC: 1 de 5 vídeos era da FDC).
    const j = JSON.parse(fs.readFileSync(o.fromJson, "utf-8"));
    const toS = (d) => { const [m, ss] = String(d).split(":").map(Number); return m * 60 + ss; };
    const cards = (j.cards || []).filter((c) => c.video_duration)
      .sort((x, y) => (y.group_size || 1) - (x.group_size || 1));
    const porDur = new Map();
    for (const c of cards) if (!porDur.has(c.video_duration)) porDur.set(c.video_duration, c);
    o.cardDurs = cards.map((c) => ({ s: toS(c.video_duration), id: c.library_id, d: c.video_duration }));
    o.ids = [...porDur.values()].slice(0, Math.max(o.sample, Math.min(o.max, porDur.size))).map((c) => c.library_id);
    if (!o.ids.length) { console.log("Nenhum anúncio de vídeo no spy-ads.json — nada a baixar."); process.exit(0); }
  }
  if (!o.ids || !o.ids.length) { console.error("Passe --ids ou --from-json"); process.exit(1); }
  return o;
}

// Escolhe até `max` durações da lista (já ordenada asc). O corte importa: os criativos
// de retargeting costumam ser os vídeos MAIS CURTOS do pool, e a ordenação decrescente
// antiga descartava justamente eles quando --max < total.
//   spread (default) — N pontos equidistantes, cobre curtos, médios e longos
//   asc              — os N mais curtos
//   desc             — os N mais longos (comportamento anterior)
function pickDurations(sortedAsc, max, order) {
  if (!Number.isFinite(max) || max <= 0 || max >= sortedAsc.length) return sortedAsc.slice();
  if (order === "asc") return sortedAsc.slice(0, max);
  if (order === "desc") return sortedAsc.slice().reverse().slice(0, max);
  if (max === 1) return [sortedAsc[Math.floor((sortedAsc.length - 1) / 2)]];
  const step = (sortedAsc.length - 1) / (max - 1);
  const out = [];
  for (let i = 0; i < max; i++) out.push(sortedAsc[Math.round(i * step)]);
  return [...new Set(out)];
}

function ffprobeDuration(url) {
  const p = ffprobeInfo(url);
  return p ? p.dur : null;
}

// duração + altura do stream de vídeo (0 = só áudio). A altura escolhe HD sobre SD.
function ffprobeInfo(url) {
  // ffprobe se existir (sistema); senão o próprio ffmpeg lendo o cabeçalho. O pacote
  // ffprobe-static pesava 335 MB no npm install do comprador e saiu do produto.
  if (FFPROBE) {
    try {
      const r = execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration:stream=codec_type,height",
        "-of", "json", url], { timeout: 45000 }).toString();
      const j = JSON.parse(r);
      const d = parseFloat(j.format && j.format.duration);
      if (!d) return null;
      const v = (j.streams || []).find((s) => s.codec_type === "video");
      return { dur: Math.round(d * 10) / 10, h: v ? v.height || 0 : 0 };
    } catch (_) { return null; }
  }
  const r = spawnSync(FFMPEG, ["-hide_banner", "-i", url], { encoding: "utf8", timeout: 45000 });
  const t = r.stderr || "";
  const m = t.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const d = +m[1] * 3600 + +m[2] * 60 + parseFloat(m[3]);
  const v = t.match(/Stream #[^\n]*Video:[^\n]*?(\d{2,5})x(\d{2,5})/);
  return { dur: Math.round(d * 10) / 10, h: v ? +v[2] : 0 };
}

(async () => {
  const opt = parseArgs();
  fs.mkdirSync(opt.out, { recursive: true });

  // 1. coleta URLs de vídeo nas páginas de detalhe
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--lang=pt-BR"] });
  const urls = new Set();
  for (const id of opt.ids) {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    );
    page.on("response", (res) => {
      const u = res.url();
      if (/\.mp4/.test(u)) urls.add(u.split("&bytestart")[0]);
    });
    try {
      await page.goto(`https://www.facebook.com/ads/library/?id=${id}`, { waitUntil: "networkidle2", timeout: 60000 });
      await sleep(4000);
      const found = await page.evaluate(() => {
        const out = new Set();
        document.querySelectorAll("video").forEach((v) => {
          if (v.src && v.src.startsWith("http")) out.add(v.src);
          v.querySelectorAll("source").forEach((s) => s.src && out.add(s.src));
        });
        const html = document.documentElement.innerHTML;
        for (const key of ["video_hd_url", "video_sd_url", "playable_url_quality_hd", "playable_url"]) {
          const re = new RegExp('"' + key + '":"(https:[^"]+)"', "g");
          let m;
          while ((m = re.exec(html))) { try { out.add(JSON.parse('"' + m[1] + '"')); } catch (_) {} }
        }
        return Array.from(out);
      });
      found.forEach((u) => urls.add(u));
      console.log(`id ${id}: pool acumulado ${urls.size} URLs`);
    } catch (e) {
      console.log(`id ${id}: ERRO ${e.message}`);
    }
    await page.close();
  }
  await browser.close();

  // 2. sonda duração e deduplica (mesmo vídeo aparece em SD+HD com duração ±0.3s)
  console.log(`\nSondando durações de ${urls.size} URLs…`);
  // mantém a URL de maior resolução por duração (o pool traz SD e HD do mesmo vídeo;
  // pegar a primeira que aparecia entregava 360p mesmo com 720p/1080p disponível)
  const byDur = new Map();
  const heightOf = new Map();
  for (const u of urls) {
    const info = ffprobeInfo(u);
    if (!info || !info.h) continue;
    const near = [...byDur.keys()].find((k) => Math.abs(k - info.dur) <= 0.3);
    if (near === undefined) { byDur.set(info.dur, u); heightOf.set(info.dur, info.h); }
    else if (info.h > heightOf.get(near)) { byDur.set(near, u); heightOf.set(near, info.h); }
  }
  console.log(`${byDur.size} vídeos únicos por duração: ${[...byDur.keys()].sort((a, b) => a - b).map((d) => `${d}s@${heightOf.get(d)}p`).join(", ")}`);

  // 3. com --from-json, só fica vídeo cuja duração bate com algum anúncio do alvo. O pool
  // da página de detalhe traz vídeo de outros anunciantes (e da própria Meta); sem esse
  // filtro eles entravam no relatório como se fossem do concorrente. O card mostra m:ss
  // truncado, então 45,1 s ↔ "0:45".
  let allDurs = [...byDur.keys()].sort((a, b) => a - b);
  const casa = (dur) => (opt.cardDurs || []).filter((c) => dur >= c.s - 0.5 && dur < c.s + 1.5);
  if (opt.cardDurs) {
    const fora = allDurs.filter((d) => !casa(d).length);
    allDurs = allDurs.filter((d) => casa(d).length);
    if (fora.length) console.log(`fora (duração não bate com nenhum anúncio do alvo, provável outro anunciante): ${fora.join("s, ")}s`);
    const semVideo = [...new Set(opt.cardDurs.map((c) => c.d))].filter((d) => !allDurs.some((x) => casa(x).some((c) => c.d === d)));
    if (semVideo.length) console.log(`durações dos anúncios sem vídeo achado no pool: ${semVideo.join(", ")}`);
  }

  // 4. seleciona quais baixar (até --max, conforme --order), gera mosaico e transcreve
  const selected = pickDurations(allDurs, opt.max, opt.order);
  if (selected.length < allDurs.length) {
    const skipped = allDurs.filter((d) => !selected.includes(d));
    console.log(`\nteto --max ${opt.max} (--order ${opt.order}): baixando ${selected.length} de ${allDurs.length}`);
    console.log(`  baixando:   ${selected.slice().sort((a, b) => a - b).join("s, ")}s`);
    console.log(`  descartado: ${skipped.join("s, ")}s`);
  }

  const index = [];
  for (const dur of selected) {
    const u = byDur.get(dur);
    const base = `${String(dur).replace(".", "_")}s-${Buffer.from(u).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(-8)}`;
    const mp4 = path.join(opt.out, `${base}.mp4`);
    try {
      execFileSync("curl", ["-sL", "-o", mp4, u], { timeout: 180000 });
      const entry = { file: `${base}.mp4`, duration_s: dur, url: u };
      if (opt.cardDurs) entry.anuncios = [...new Set(casa(dur).map((c) => c.id))];
      if (opt.frames) {
        spawnSync(FFMPEG, ["-y", "-v", "error", "-i", mp4, "-vf", "fps=1/4,scale=320:-1,tile=4x3", "-frames:v", "1",
          path.join(opt.out, `${base}-mosaic.jpg`)], { timeout: 120000 });
        entry.mosaic = `${base}-mosaic.jpg`;
      }
      if (opt.transcribe) {
        const tk = transcribeKey();
        if (tk) {
          // extrai áudio e manda pra API (OpenAI/Groq)
          const audio = path.join(opt.out, `${base}.mp3`);
          const ff = spawnSync(FFMPEG, ["-y", "-v", "error", "-i", mp4, "-vn", "-ac", "1", "-ar", "16000", "-b:a", "64k", audio], { timeout: 120000 });
          if (ff.status === 0 && fs.existsSync(audio)) {
            // a API quer código ISO ("pt"), o Whisper local quer o nome ("Portuguese")
            const iso = { portuguese: "pt", english: "en", spanish: "es" }[opt.lang.toLowerCase()]
              || (/^[a-z]{2}$/i.test(opt.lang) ? opt.lang.toLowerCase() : null);
            const r = spawnSync("curl", ["-s", tk.url, "-H", `Authorization: Bearer ${tk.key}`,
              "-F", `file=@${audio}`, "-F", `model=${tk.model}`, "-F", "response_format=text",
              ...(iso ? ["-F", `language=${iso}`] : [])],
              { encoding: "utf8", timeout: 180000, maxBuffer: 20 * 1024 * 1024 });
            const out = (r.stdout || "").trim();
            if (out && !out.startsWith("{")) {
              fs.writeFileSync(path.join(opt.out, `${base}.txt`), out);
              entry.transcript = `${base}.txt`;
            } else {
              entry.transcript_error = (out || "sem resposta da API").slice(0, 200);
            }
            try { fs.unlinkSync(audio); } catch (_) {}
          }
        } else if (temLocal()) {
          if (!index.some((e) => e.transcript)) console.log("  transcrevendo no computador (na 1ª vez baixa o modelo, ~250 MB)…");
          const txt = path.join(opt.out, `${base}.txt`);
          const lr = spawnSync(process.execPath, [LOCAL_TR, mp4, txt, opt.lang], { encoding: "utf8", timeout: 900000 });
          if (lr.status === 0 && fs.existsSync(txt)) entry.transcript = `${base}.txt`;
          else entry.transcript_error = ((lr.stderr || "") + (lr.error ? lr.error.message : "")).trim().split("\n").pop().slice(0, 200) || "falhou";
        } else if (fs.existsSync(WHISPER)) {
          const args = [mp4, "--model", "small", "--output_format", "txt", "--output_dir", opt.out];
          if (opt.lang !== "auto") args.push("--language", opt.lang);
          spawnSync(WHISPER, args, { timeout: 600000 });
          entry.transcript = `${base}.txt`;
        } else {
          entry.transcript_skipped = "sem transcritor: npm install na pasta da skill (ou chave OPENAI_API_KEY/GROQ_API_KEY no .env)";
        }
      }
      index.push(entry);
      console.log(`✓ ${base}.mp4 (${dur}s)`);
    } catch (e) {
      console.log(`✗ ${dur}s: ${e.message}`);
    }
  }
  fs.writeFileSync(path.join(opt.out, "video-index.json"), JSON.stringify(index, null, 2));
  console.log(`\n→ ${index.length} vídeos em ${opt.out} (índice em video-index.json)`);
  console.log(`De-para com os ads: case "duration_s" com o "video_duration" dos cards no spy-ads.json.`);
})();
