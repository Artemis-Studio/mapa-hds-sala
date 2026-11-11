import React from "react";
import { useCurrentFrame } from "remotion";
import { C, POPPINS, FPS } from "./theme";

// words/*.json: tempo de cada palavra da locução (ElevenLabs with-timestamps, já em 1,1x)
export type Word = { w: string; s: number; e: number };
type Group = { words: { text: string; start: number }[]; start: number; end: number };

// O TTS lê número por extenso; na legenda ele vira algarismo.
const NUMEROS: [string[], string][] = [
  [["quarenta", "e", "oito"], "48"],
  [["duzentas"], "200"],
  [["oito", "bilhões"], "8 bilhões"],
  [["seis", "meses"], "6 meses"],
  [["Seis", "meses"], "6 meses"],
  [["oito", "anos"], "8 anos"],
  [["quatro"], "4"],
];

const base = (t: string) => t.replace(/[.,:;!?]/g, "");

const normalizar = (ws: Word[]): Word[] => {
  const out: Word[] = [];
  for (let i = 0; i < ws.length; i++) {
    const hit = NUMEROS.find(([seq]) => seq.every((p, k) => ws[i + k] && base(ws[i + k].w) === p));
    if (hit) {
      const n = hit[0].length;
      const ult = ws[i + n - 1];
      const pont = ult.w.match(/[.,:;!?]$/)?.[0] ?? "";
      out.push({ w: hit[1] + pont, s: ws[i].s, e: ult.e });
      i += n - 1;
    } else out.push(ws[i]);
  }
  return out;
};

const limpa = (t: string) => t.replace(/[.,:;!]/g, "");

// Blocos de até 3 palavras, quebrando na pontuação da fala.
export const agrupar = (raw: Word[]): Group[] => {
  const ws = normalizar(raw);
  const out: Group[] = [];
  let cur: Group | null = null;
  ws.forEach((w, i) => {
    if (!cur) cur = { words: [], start: w.s, end: w.e };
    cur.words.push({ text: limpa(w.w), start: w.s });
    cur.end = w.e;
    const pausa = /[.,:;?!]$/.test(w.w);
    if (cur.words.length >= 3 || pausa || i === ws.length - 1) {
      out.push(cur);
      cur = null;
    }
  });
  out.forEach((g, i) => {
    const prox = out[i + 1];
    g.end = prox ? Math.min(prox.start, g.end + 0.6) : g.end + 0.4;
  });
  return out;
};

// `desde`: a legenda só entra depois do hook de texto, pra não disputar a leitura.
export const Captions: React.FC<{ groups: Group[]; desde: number; until: number }> = ({ groups, desde, until }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (t < desde || t > until) return null;
  const g = groups.find((x) => t >= x.start - 0.05 && t < x.end);
  if (!g) return null;
  const pop = Math.min(1, (t - g.start + 0.05) / 0.12);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1440,
        display: "flex",
        justifyContent: "center",
        transform: `scale(${0.92 + 0.08 * pop})`,
      }}
    >
      <div
        style={{
          background: "rgba(22,47,66,0.92)",
          border: "2px solid rgba(255,255,255,0.14)",
          borderRadius: 22,
          padding: "16px 30px 20px",
          fontFamily: POPPINS,
          fontWeight: 700,
          fontSize: 60,
          lineHeight: 1.15,
          color: C.white,
          maxWidth: 940,
          textAlign: "center",
        }}
      >
        {g.words.map((w, i) => (
          <span key={i} style={{ color: t >= w.start ? C.amber : C.white }}>
            {w.text}
            {i < g.words.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};
