#!/usr/bin/env bash
# preparar.sh — liga o motor da Sala (render de carrossel + espionagem de anúncios).
#
# A Sala roda este script sozinha na primeira sessão. Ninguém precisa chamá-lo à mão.
# Rodar de novo é seguro: se já estiver tudo instalado, ele só confere e sai.
set -uo pipefail
cd "$(dirname "$0")"

falhou=0

echo "→ Preparando a Sala"
echo

# 1) Node
if ! command -v node >/dev/null 2>&1; then
  echo "✗ Node não encontrado."
  echo "  Instale a versão LTS em https://nodejs.org e rode este script de novo."
  exit 1
fi
MAJOR="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)"
if [ "$MAJOR" -lt 18 ]; then
  echo "✗ Node $(node -v) é antigo demais. Precisa de 18 ou mais novo."
  exit 1
fi
echo "✓ Node $(node -v)"

# 2) Dependências. Puppeteer baixa um Chromium próprio na primeira vez (~150 MB),
#    específico desta plataforma — por isso a instalação roda aqui e não vem pronta na pasta.
if [ -d node_modules/puppeteer ] && [ -d node_modules/sharp ]; then
  echo "✓ motor de render já instalado"
else
  echo "→ Instalando o motor de render (primeira vez leva 2 a 4 minutos)…"
  if npm install --no-audit --no-fund; then
    echo "✓ motor instalado"
  else
    echo "✗ a instalação falhou — sem ela não sai arte nem espionagem de anúncio."
    echo "  Texto continua funcionando normalmente."
    exit 1
  fi
fi

# 3) Teste de render — prova que a cadeia inteira funciona antes de valer nota
TESTE=".teste-render"
rm -rf "automacao/paper-designs/$TESTE"
if ./automacao/paper-designs/novo-carrossel.sh "$TESTE" >/dev/null 2>&1 \
   && ( cd "automacao/paper-designs/$TESTE" && node gerar.js >/dev/null 2>&1 ); then
  N=$(ls "automacao/paper-designs/$TESTE/out"/*.png 2>/dev/null | wc -l | tr -d ' ')
  echo "✓ render funcionando ($N imagens de teste)"
else
  echo "⚠️  o render de teste falhou. A Sala escreve normalmente, mas a arte pode não sair."
  echo "   Para ver o erro:  cd automacao/paper-designs/$TESTE && node gerar.js"
  falhou=1
fi
rm -rf "automacao/paper-designs/$TESTE"

# 4) Espionagem de anúncios — só confere se o script resolve o Puppeteer
if node -e 'require.resolve("puppeteer")' >/dev/null 2>&1; then
  echo "✓ espionagem de anúncios pronta"
else
  echo "⚠️  a espionagem de anúncios não vai rodar — Puppeteer não resolveu."
  falhou=1
fi

echo
if [ "$falhou" -eq 0 ]; then
  echo "✓ tudo pronto."
else
  echo "⚠️  pronto com ressalvas — veja os avisos acima."
fi
