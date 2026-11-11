import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  Easing,
} from "remotion";
import { C, POPPINS, ROBOTO, FPS } from "./theme";

// Todo `at` é em segundos ABSOLUTOS do vídeo (o tempo da locução). `t0` é o início da cena.
const useAbs = (t0: number) => useCurrentFrame() / FPS + t0;

const entra = (t: number, at: number, dur = 0.35) =>
  interpolate(t, [at, at + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

// Destaque é cor, nunca itálico: as palavras em `hl` saem na cor de destaque.
const Texto: React.FC<{
  text: string;
  hl?: string;
  cor: string;
  corHl: string;
  size: number;
  weight?: number;
}> = ({ text, hl, cor, corHl, size, weight = 700 }) => {
  const partes = hl ? text.split(hl) : [text];
  return (
    <div
      style={{
        fontFamily: POPPINS,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.12,
        letterSpacing: "-0.01em",
        color: cor,
      }}
    >
      {partes.map((p, i) => (
        <React.Fragment key={i}>
          {p}
          {i < partes.length - 1 && <span style={{ color: corHl }}>{hl}</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export type Linha = { text: string; at: number; hl?: string; size?: number };

const Linhas: React.FC<{ linhas: Linha[]; t: number; cor: string; corHl: string; gap?: number }> = ({
  linhas,
  t,
  cor,
  corHl,
  gap = 28,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap }}>
    {linhas.map((l, i) => {
      const p = entra(t, l.at);
      return (
        <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 26}px)` }}>
          <Texto text={l.text} hl={l.hl} cor={cor} corHl={corHl} size={l.size ?? 84} />
        </div>
      );
    })}
  </div>
);

// Faixas curvas: o traço do "m" ampliado, sangrando pra fora do quadro.
export const Faixas: React.FC<{ t: number; at: number; cores: string[]; variante?: 0 | 1 }> = ({
  t,
  at,
  cores,
  variante = 0,
}) => {
  const paths =
    variante === 0
      ? ["M -120 1720 C 260 1500, 520 1900, 1200 1540", "M -120 1880 C 300 1640, 700 2050, 1200 1720"]
      : ["M 1200 120 C 820 260, 980 -60, 560 -120", "M 1220 330 C 760 420, 900 40, 380 -140"];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {paths.map((d, i) => {
        const p = entra(t, at + i * 0.15, 0.9);
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={cores[i % cores.length]}
            strokeWidth={86}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
          />
        );
      })}
    </svg>
  );
};

const fundo = { branco: C.white, mist: C.mist, navy: C.navy, petrol: C.petrol } as const;
type Fundo = keyof typeof fundo;
const escuro = (f: Fundo) => f === "navy" || f === "petrol";

// ── Statement: título grande alinhado à esquerda, com faixas ──────────────────
export const Statement: React.FC<{ t0: number; bg: Fundo; linhas: Linha[]; faixas?: boolean; top?: number }> = ({
  t0,
  bg,
  linhas,
  faixas = true,
  top = 300,
}) => {
  const t = useAbs(t0);
  const dark = escuro(bg);
  return (
    <AbsoluteFill style={{ background: fundo[bg] }}>
      {faixas && <Faixas t={t} at={t0} cores={dark ? [C.amber, C.teal] : [C.orange, C.petrol]} />}
      <div style={{ position: "absolute", left: 80, right: 90, top }}>
        <div style={{ width: 8, height: 90, background: C.orange, marginBottom: 36, borderRadius: 4 }} />
        <Linhas linhas={linhas} t={t} cor={dark ? C.white : C.ink} corHl={dark ? C.amber : C.orange} />
      </div>
    </AbsoluteFill>
  );
};

// ── Foto: Ken Burns + véu navy na região do texto ─────────────────────────────
export const Foto: React.FC<{ t0: number; dur: number; src: string; linhas?: Linha[]; foco?: string; rotulo?: { text: string; at: number } }> = ({
  t0,
  dur,
  src,
  linhas = [],
  foco = "50% 30%",
  rotulo,
}) => {
  const t = useAbs(t0);
  const video = src.endsWith(".mp4");
  // Clipe do Pexels tem 6 s: cena mais longa desacelera em vez de congelar no último quadro.
  const z = interpolate(t, [t0, t0 + dur], video ? [1.0, 1.05] : [1.04, 1.14]);
  const estilo: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: foco,
    transform: `scale(${z})`,
    transformOrigin: foco,
  };
  return (
    <AbsoluteFill style={{ background: C.navy, overflow: "hidden" }}>
      {video ? (
        <OffthreadVideo src={staticFile(src)} muted playbackRate={Math.min(1, 5.9 / dur)} style={estilo} />
      ) : (
        <Img src={staticFile(src)} style={estilo} />
      )}
      {linhas.length > 0 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 860,
            bottom: 0,
            background: "linear-gradient(180deg, rgba(22,47,66,0) 0%, rgba(22,47,66,0.55) 28%, rgba(22,47,66,0.8) 100%)",
          }}
        />
      )}
      {rotulo && (
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 200,
            opacity: entra(t, rotulo.at),
            background: C.white,
            color: C.ink,
            fontFamily: POPPINS,
            fontWeight: 500,
            fontSize: 34,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "12px 22px",
            borderRadius: 12,
          }}
        >
          {rotulo.text}
        </div>
      )}
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 560 }}>
        <Linhas linhas={linhas} t={t} cor={C.white} corHl={C.amber} gap={18} />
      </div>
    </AbsoluteFill>
  );
};

// ── Hook de texto: legível no quadro 0 (é a capa do reel), sem fade de entrada ──
export const Hook: React.FC<{ t0: number; dur: number; src: string; grita: string; completa: string; foco?: string }> = ({
  t0,
  dur,
  src,
  grita,
  completa,
  foco = "50% 50%",
}) => {
  const f = useCurrentFrame();
  const soco = interpolate(f, [0, 5], [1.06, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill>
      <Foto t0={t0} dur={dur} src={src} foco={foco} />
      <AbsoluteFill style={{ background: "rgba(22,47,66,0.38)" }} />
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 300,
          transform: `scale(${soco})`,
          transformOrigin: "left top",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 18,
        }}
      >
        <div
          style={{
            background: C.orange,
            color: C.white,
            fontFamily: POPPINS,
            fontWeight: 800,
            fontSize: grita.length > 30 ? 76 : 92,
            lineHeight: 1.04,
            letterSpacing: "-0.015em",
            textTransform: "uppercase",
            padding: "24px 32px 28px",
            borderRadius: 26,
            boxDecorationBreak: "clone",
          }}
        >
          {grita}
        </div>
        <div
          style={{
            background: C.white,
            color: C.ink,
            fontFamily: POPPINS,
            fontWeight: 700,
            fontSize: 58,
            lineHeight: 1.12,
            padding: "16px 28px 20px",
            borderRadius: 20,
          }}
        >
          {completa}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Lista: itens que entram na hora em que a locução fala ─────────────────────
export const Lista: React.FC<{
  t0: number;
  bg: Fundo;
  titulo?: Linha;
  eyebrow?: string;
  itens: { text: string; at: number }[];
  numerada?: boolean;
}> = ({ t0, bg, titulo, eyebrow, itens, numerada = true }) => {
  const t = useAbs(t0);
  const dark = escuro(bg);
  return (
    <AbsoluteFill style={{ background: fundo[bg] }}>
      <Faixas t={t} at={t0} cores={dark ? [C.amber, C.teal] : [C.orange, C.amber]} variante={1} />
      <div style={{ position: "absolute", left: 80, right: 90, top: 300 }}>
        {eyebrow && (
          <div
            style={{
              fontFamily: POPPINS,
              fontWeight: 500,
              fontSize: 34,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: dark ? C.amber : C.red,
              marginBottom: 26,
              opacity: entra(t, t0),
            }}
          >
            {eyebrow}
          </div>
        )}
        {titulo && <Linhas linhas={[titulo]} t={t} cor={dark ? C.white : C.ink} corHl={dark ? C.amber : C.orange} />}
        <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 50 }}>
          {itens.map((it, i) => {
            const p = entra(t, it.at);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  opacity: p,
                  transform: `translateX(${(1 - p) * -40}px)`,
                  background: dark ? "rgba(255,255,255,0.08)" : C.white,
                  borderRadius: 22,
                  padding: "26px 30px",
                }}
              >
                {numerada && (
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      flexShrink: 0,
                      borderRadius: "22%",
                      background: [C.orange, C.amber, C.petrol, C.red][i % 4],
                      color: i % 4 === 1 ? C.ink : C.white,
                      fontFamily: POPPINS,
                      fontWeight: 700,
                      fontSize: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </div>
                )}
                <div style={{ fontFamily: POPPINS, fontWeight: 700, fontSize: 52, lineHeight: 1.15, color: dark ? C.white : C.ink }}>
                  {it.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── V1: 8 bilhões de pontinhos que se encaixam em 4 caixinhas ─────────────────
const CAIXAS = [
  { x: 110, y: 640, cor: C.orange, txt: C.white },
  { x: 560, y: 640, cor: C.amber, txt: C.ink },
  { x: 110, y: 1010, cor: C.petrol, txt: C.white },
  { x: 560, y: 1010, cor: C.red, txt: C.white },
];
const LADO = 410;

export const Caixinhas: React.FC<{
  t0: number;
  encaixe: number;
  rotulos: { text: string; at: number }[];
  linhas: Linha[];
}> = ({ t0, encaixe, rotulos, linhas }) => {
  const f = useCurrentFrame();
  const t = useAbs(t0);
  const p = spring({ frame: f - Math.round((encaixe - t0) * FPS), fps: FPS, config: { damping: 18, mass: 0.9 } });
  const preenche = entra(t, encaixe + 1.0, 0.5);
  const N = 520;
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {CAIXAS.map((c, i) => (
          <rect
            key={i}
            x={c.x}
            y={c.y}
            width={LADO}
            height={LADO - 40}
            rx={40}
            fill={c.cor}
            fillOpacity={preenche}
            stroke={c.cor}
            strokeWidth={8}
            strokeOpacity={p}
          />
        ))}
        {Array.from({ length: N }).map((_, i) => {
          const sx = random(`x${i}`) * 1080;
          const sy = 520 + random(`y${i}`) * 1000;
          const drift = Math.sin(f / 22 + i) * 6;
          const c = CAIXAS[i % 4];
          const tx = c.x + 30 + random(`tx${i}`) * (LADO - 60);
          const ty = c.y + 30 + random(`ty${i}`) * (LADO - 100);
          const x = sx + (tx - sx) * p + drift * (1 - p);
          const y = sy + (ty - sy) * p;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={7}
              fill={p > 0.5 ? c.cor : C.ink}
              fillOpacity={(0.55 + 0.45 * p) * (1 - preenche)}
            />
          );
        })}
      </svg>
      {rotulos.map((r, i) => {
        const c = CAIXAS[i];
        const q = entra(t, r.at, 0.25);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.x + 34,
              top: c.y + 34,
              width: LADO - 68,
              height: LADO - 108,
              display: "flex",
              alignItems: "flex-end",
              fontFamily: POPPINS,
              fontWeight: 700,
              fontSize: r.text.length > 12 ? 44 : 60,
              lineHeight: 1.1,
              color: c.txt,
              opacity: q,
              transform: `scale(${0.9 + 0.1 * q})`,
            }}
          >
            {r.text}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 80, right: 80, top: 230 }}>
        <Linhas linhas={linhas} t={t} cor={C.ink} corHl={C.orange} gap={10} />
      </div>
    </AbsoluteFill>
  );
};

// ── V1: traços com intensidade (barras) ───────────────────────────────────────
export const Tracos: React.FC<{ t0: number; linhas: Linha[]; intensidade: number; numero: number }> = ({
  t0,
  linhas,
  intensidade,
  numero,
}) => {
  const t = useAbs(t0);
  const n = 18;
  const grande = entra(t, numero, 0.4);
  return (
    <AbsoluteFill style={{ background: C.petrol }}>
      <div style={{ position: "absolute", left: 80, right: 80, top: 230 }}>
        <Linhas linhas={linhas} t={t} cor={C.white} corHl={C.amber} gap={16} />
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 760, display: "flex", flexDirection: "column", gap: 16 }}>
        {Array.from({ length: n }).map((_, i) => {
          const alvo = 0.15 + random(`b${i}`) * 0.85;
          const p = entra(t, t0 + 0.4 + i * 0.07, 0.6);
          const pulso = entra(t, intensidade, 0.8);
          const w = alvo * p * (0.75 + 0.25 * Math.sin(pulso * Math.PI * 2 + i));
          return (
            <div key={i} style={{ height: 18, background: "rgba(255,255,255,0.12)", borderRadius: 9 }}>
              <div style={{ width: `${w * 100}%`, height: "100%", borderRadius: 9, background: i % 3 === 0 ? C.amber : C.white }} />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          right: 70,
          top: 980,
          opacity: grande,
          transform: `scale(${0.8 + 0.2 * grande})`,
          background: C.navy,
          borderRadius: 32,
          padding: "26px 40px",
          fontFamily: POPPINS,
          fontWeight: 800,
          color: C.amber,
          fontSize: 150,
          lineHeight: 1,
        }}
      >
        48
        <div style={{ fontSize: 40, fontWeight: 500, color: C.white, letterSpacing: "0.08em" }}>TRAÇOS</div>
      </div>
    </AbsoluteFill>
  );
};

// ── V2: pessoas + ambiente = um problema só ───────────────────────────────────
export const Junta: React.FC<{ t0: number; une: number; linhas: Linha[] }> = ({ t0, une, linhas }) => {
  const t = useAbs(t0);
  const p = entra(t, une, 0.9);
  const a = entra(t, t0 + 0.2);
  const b = entra(t, t0 + 2.0);
  const d = 230 * (1 - p);
  const circ = (cx: number, cor: string, txt: string, op: number, txtCor: string) => (
    <div
      style={{
        position: "absolute",
        left: cx - 250,
        top: 820,
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: cor,
        opacity: op * 0.92,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: POPPINS,
        fontWeight: 700,
        fontSize: 54,
        color: txtCor,
        mixBlendMode: "normal",
      }}
    >
      <span style={{ opacity: 1 - p }}>{txt}</span>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <div style={{ position: "absolute", left: 80, right: 80, top: 230 }}>
        <Linhas linhas={linhas} t={t} cor={C.white} corHl={C.amber} gap={16} />
      </div>
      {circ(540 - d, C.amber, "Pessoas", a, C.ink)}
      {circ(540 + d, C.teal, "Ambiente", b, C.white)}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1030,
          textAlign: "center",
          fontFamily: POPPINS,
          fontWeight: 800,
          fontSize: 64,
          color: C.white,
          opacity: p,
        }}
      >
        um problema só
      </div>
    </AbsoluteFill>
  );
};

// ── V3: a descrição de cargo vaga ─────────────────────────────────────────────
export const Documento: React.FC<{ t0: number; vaga: number }> = ({ t0, vaga }) => {
  const t = useAbs(t0);
  const p = entra(t, t0, 0.5);
  const v = entra(t, vaga, 0.4);
  const itens = [
    { txt: "Atividades diversas", vago: true },
    { txt: "Apoiar a área quando necessário", vago: true },
    { txt: "Emitir relatório semanal", vago: false },
    { txt: "Demais atribuições pertinentes", vago: true },
    { txt: "Outras demandas da gestão", vago: true },
  ];
  return (
    <AbsoluteFill style={{ background: C.mist }}>
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 330,
          background: C.white,
          borderRadius: 28,
          padding: "60px 56px",
          boxShadow: "0 30px 80px rgba(22,47,66,0.18)",
          opacity: p,
          transform: `translateY(${(1 - p) * 60}px) rotate(${-1.5 * p}deg)`,
        }}
      >
        <div style={{ fontFamily: POPPINS, fontWeight: 500, fontSize: 30, letterSpacing: "0.12em", color: C.red }}>
          DESCRIÇÃO DO CARGO
        </div>
        <div style={{ fontFamily: POPPINS, fontWeight: 700, fontSize: 58, color: C.ink, margin: "14px 0 40px" }}>
          Analista
        </div>
        {itens.map((it, i) => (
          <div
            key={i}
            style={{
              fontFamily: ROBOTO,
              fontSize: 42,
              lineHeight: 1.45,
              color: it.vago ? C.ink : "rgba(26,26,26,0.45)",
              padding: "10px 16px",
              marginBottom: 10,
              borderRadius: 10,
              background: it.vago ? `rgba(217,64,33,${0.14 * v})` : "transparent",
              borderLeft: `6px solid ${it.vago ? `rgba(217,64,33,${v})` : "transparent"}`,
            }}
          >
            {it.txt}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── Fecho ──────────────────────────────────────────────────────────────────────
export const Fecho: React.FC<{ t0: number; frase: string }> = ({ t0, frase }) => {
  const t = useAbs(t0);
  const p = entra(t, t0 + 0.1, 0.5);
  const q = entra(t, t0 + 0.5, 0.5);
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Faixas t={t} at={t0} cores={[C.orange, C.petrol]} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 640 }}>
        <Img src={staticFile("logo-laranja.png")} style={{ width: 620, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }} />
        <div
          style={{
            marginTop: 60,
            fontFamily: POPPINS,
            fontWeight: 700,
            fontSize: 64,
            lineHeight: 1.15,
            color: C.ink,
            opacity: q,
          }}
        >
          {frase}
        </div>
        <div style={{ marginTop: 34, fontFamily: ROBOTO, fontSize: 40, color: "rgba(26,26,26,0.62)", opacity: q }}>
          mapahds.com
        </div>
      </div>
    </AbsoluteFill>
  );
};
