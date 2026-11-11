#!/usr/bin/env bash
# Cria a pasta de um carrossel novo a partir do modelo base.
# Uso: ./novo-carrossel.sh carrossel-tema
set -e

if [ -z "${1:-}" ]; then
  echo "uso: $0 <nome-da-pasta>"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")" && pwd)"
DST="$ROOT/$1"

if [ -e "$DST" ]; then
  echo "erro: $DST já existe"
  exit 1
fi

mkdir -p "$DST/assets"
cp "$ROOT/_template-base/template.html"       "$DST/template.html"
cp "$ROOT/_template-base/gerar.js"            "$DST/gerar.js"
cp "$ROOT/_template-base/processa-imagens.js" "$DST/processa-imagens.js"
cp "$ROOT/_template-base/slides.example.json" "$DST/slides.json"

# Sem symlink: o Node sobe a árvore de pastas até achar o node_modules da raiz da Sala.

echo "✓ $1 criado"
echo "  editar slides.json → imagens em assets/ → node processa-imagens.js → node gerar.js"
