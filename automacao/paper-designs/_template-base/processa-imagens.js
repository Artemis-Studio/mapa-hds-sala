// processa-imagens.js — converte para P&B + normaliza contraste + redimensiona
// Uso: node processa-imagens.js
//
// Editar o array `jobs` abaixo com os arquivos que existem em ./assets/

const sharp = require('sharp');
const path = require('path');

const ROOT = __dirname;
const ASSETS = path.join(ROOT, 'assets');

// Listar aqui os arquivos da pasta assets/ que devem ser processados.
// Convenção: input = nome-bruto.jpg → output = nome-bruto-final.jpg
const jobs = [
  // { in: 'exemplo.jpg', out: 'exemplo-final.jpg' },
];

(async () => {
  if (jobs.length === 0) {
    console.log('Nenhum job configurado. Edite o array `jobs` em processa-imagens.js.');
    return;
  }
  for (const job of jobs) {
    const src = path.join(ASSETS, job.in);
    const dst = path.join(ASSETS, job.out);
    await sharp(src)
      .greyscale()
      .normalise()
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(dst);
    console.log(`  ${job.out} ✓`);
  }
  console.log('\nPronto.');
})();
