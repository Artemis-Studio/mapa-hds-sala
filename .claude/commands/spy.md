# /spy — SpyOps de anúncios + funil

Use a skill `spyops` (`.claude/skills/spyops/SKILL.md`) com o alvo passado em `$ARGUMENTS` (URL da Meta Ad Library, domínio/keyword ou page id).

Regras inegociáveis (detalhe na skill):
- Pipeline pronto em `automacao/spyops/` (Puppeteer). **NUNCA Playwright.**
- **NUNCA tentar a Graph API `/ads_archive`** — travada com erro 2332002.
- Saída em `spy/<slug>/`, relatório no formato SpyOps da casa.
- Vídeos: baixar amostra ≥5 com `spy-videos.js --frames --transcribe` e analisar mosaicos + transcrições.
