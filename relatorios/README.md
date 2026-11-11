# relatorios/ — o loop de métricas da Sala

**Regra 5 do CLAUDE.md raiz:** antes de escrever ad pra este cliente, a IA lê o relatório mais recente desta pasta. Sem registro aqui, cada rodada de copy recomeça do zero — velocidade sem aprendizado.

## Arquivos

- `AAAA-MM-metricas.md` — fechamento mensal. Copie `_template-AAAA-MM-metricas.md` e preencha.
- `AAAA-Wnn-meta.md` — rascunho semanal gerado automaticamente por `automacao/metrics-loop/` (Meta API, segundas 07h30). Vem com a tabela pronta; falta o que só o gestor sabe.

## A parte que importa

A seção **Aprendizados** vale mais que a tabela: hook vencedor, ângulo que morreu, hipótese pra próxima rodada. Quatro linhas escritas pelo gestor são o que transforma a próxima campanha — a tabela sozinha não ensina nada à IA.

## Convenção no gerenciador

Nomeie campanhas com o cliente no início (`proteção veicular | Conversão |...`) pra automação mapear sozinha. Padrões em `automacao/metrics-loop/clientes-map.json`.
