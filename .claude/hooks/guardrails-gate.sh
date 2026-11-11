#!/usr/bin/env bash
# guardrails-gate.sh — Stop hook.
# Bloqueia a finalização do turno se uma peça de copy foi escrita em conteudo/ ou
# entregas/ SEM passar por copywriting-guardrails neste turno. Fail-open: qualquer
# erro/parse falho → libera (nunca trava trabalho legítimo). jq-free por portabilidade.
set -uo pipefail

input="$(cat 2>/dev/null || true)"

# extrai campos do JSON de stdin sem jq
field() { printf '%s' "$input" | grep -oE "\"$1\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | head -1 | sed -E "s/.*:[[:space:]]*\"([^\"]*)\".*/\1/"; }

# anti-loop: se já estamos num ciclo de Stop disparado por hook, libera
case "$input" in *'"stop_hook_active": true'*|*'"stop_hook_active":true'*) exit 0;; esac

tp="$(field transcript_path)"
[ -z "$tp" ] && exit 0
[ -f "$tp" ] || exit 0

# escopo do TURNO: da última mensagem de usuário até o fim do transcript
last_user="$(grep -nE '"(role|type)"[[:space:]]*:[[:space:]]*"user"' "$tp" 2>/dev/null | tail -1 | cut -d: -f1)"
[ -z "$last_user" ] && last_user=1
turn="$(tail -n +"$last_user" "$tp" 2>/dev/null || true)"
[ -z "$turn" ] && exit 0

# (a) escreveu peça de copy em conteudo/ ou entregas/ (.md)? pega a última ocorrência
write_ln="$(printf '%s' "$turn" | grep -nE '"file_path"[[:space:]]*:[[:space:]]*"[^\"]*/(conteudo|entregas)/[^\"]*\.md"' | tail -1 | cut -d: -f1)"
[ -z "$write_ln" ] && exit 0   # nenhuma peça de copy neste turno → libera

# (b) copywriting-guardrails apareceu DEPOIS da última escrita de copy? (gate rodou pós-produção)
guard_ln="$(printf '%s' "$turn" | grep -nE 'copywriting-guardrails' | tail -1 | cut -d: -f1)"
if [ -n "$guard_ln" ] && [ "$guard_ln" -ge "$write_ln" ]; then
  exit 0   # passou pelo gate
fi

# bloqueia a finalização com razão acionável
cat <<'JSON'
{"decision":"block","reason":"GATE DE COPY: uma peça foi escrita em conteudo/ ou entregas/ mas a skill copywriting-guardrails ainda não rodou neste turno. Rode copywriting-guardrails agora sobre a peça (e copy-format-check depois, se for ad) e então finalize. Se o arquivo NÃO for copy de marketing, mova-o para fora de conteudo/ e entregas/."}
JSON
exit 0
