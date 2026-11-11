import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { C, sec } from "./theme";
import { Captions, Word, agrupar } from "./Captions";
import { Caixinhas, Documento, Fecho, Foto, Hook, Junta, Lista, Statement, Tracos } from "./scenes";
import w1 from "./words/v1.json";
import w2 from "./words/v2.json";
import w3 from "./words/v3.json";

// Locução: ElevenLabs, voz Roberto Valença, acelerada a 1,1x. Clipes reais: Pexels, 1080×1920.
// Cada bloco recebe t0 = início em segundos (o tempo absoluto da locução).
type Bloco = { de: number; ate: number; cena: (t0: number, dur: number) => React.ReactNode };

const Reel: React.FC<{ audio: string; words: Word[]; fimHook: number; fimFala: number; blocos: Bloco[] }> = ({
  audio,
  words,
  fimHook,
  fimFala,
  blocos,
}) => {
  const grupos = React.useMemo(() => agrupar(words), [words]);
  return (
    <AbsoluteFill style={{ background: C.white }}>
      {blocos.map((b, i) => (
        <Sequence key={i} from={sec(b.de)} durationInFrames={sec(b.ate) - sec(b.de)}>
          {b.cena(b.de, b.ate - b.de)}
        </Sequence>
      ))}
      <Captions groups={grupos} desde={fimHook} until={fimFala} />
      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};

export const V1_DUR = 43.0;
export const V1: React.FC = () => (
  <Reel
    audio="v1.wav"
    words={w1 as Word[]}
    fimHook={4.6}
    fimFala={40.5}
    blocos={[
      {
        de: 0,
        ate: 4.6,
        cena: (t0, d) => (
          <Hook t0={t0} dur={d} src="a01.mp4" grita="Te colocaram numa caixinha" completa="e chamaram de teste de personalidade" />
        ),
      },
      {
        de: 4.6,
        ate: 16.2,
        cena: (t0) => (
          <Caixinhas
            t0={t0}
            encaixe={9.9}
            linhas={[
              { text: "8 bilhões de pessoas.", at: 4.9, size: 80 },
              { text: "4 tipos.", at: 10.0, hl: "4 tipos.", size: 80 },
            ]}
            rotulos={[
              { text: "Você", at: 11.29 },
              { text: "Sua chefe", at: 12.46 },
              { text: "O piloto do seu próximo voo", at: 13.23 },
            ]}
          />
        ),
      },
      {
        de: 16.2,
        ate: 23.0,
        cena: (t0, d) => (
          <Foto
            t0={t0}
            dur={d}
            src="a02.mp4"
            foco="50% 40%"
            linhas={[
              { text: "Pra conversa de corredor, serve.", at: 16.29, size: 62 },
              { text: "Pra liderar 200 pessoas?", at: 18.41, hl: "200 pessoas?", size: 76 },
            ]}
          />
        ),
      },
      {
        de: 23.0,
        ate: 31.7,
        cena: (t0) => (
          <Tracos
            t0={t0}
            intensidade={25.6}
            numero={30.42}
            linhas={[
              { text: "Personalidade se mede em traços.", at: 23.07, hl: "traços.", size: 76 },
              { text: "E cada traço tem uma intensidade.", at: 25.16, size: 50 },
            ]}
          />
        ),
      },
      {
        de: 31.7,
        ate: 34.9,
        cena: (t0) => (
          <Statement
            t0={t0}
            bg="mist"
            top={520}
            linhas={[
              { text: "Quem interpreta o resultado", at: 31.8, size: 76 },
              { text: "é um psicólogo.", at: 33.5, hl: "psicólogo.", size: 96 },
            ]}
          />
        ),
      },
      {
        de: 34.9,
        ate: 40.45,
        cena: (t0, d) => (
          <Foto
            t0={t0}
            dur={d}
            src="c05.mp4"
            foco="50% 40%"
            linhas={[
              { text: "Do outro lado do relatório tem uma pessoa.", at: 35.0, hl: "uma pessoa.", size: 64 },
              { text: "Ela merece um diagnóstico correto.", at: 37.9, hl: "diagnóstico correto.", size: 64 },
            ]}
          />
        ),
      },
      { de: 40.45, ate: V1_DUR, cena: (t0) => <Fecho t0={t0} frase="Entenda pessoas e sua relação com o trabalho." /> },
    ]}
  />
);

export const V2_DUR = 51.3;
export const V2: React.FC = () => (
  <Reel
    audio="v2.wav"
    words={w2 as Word[]}
    fimHook={4.7}
    fimFala={48.8}
    blocos={[
      {
        de: 0,
        ate: 4.7,
        cena: (t0, d) => (
          <Hook t0={t0} dur={d} src="b01.mp4" grita="Piloto: avaliado a cada 6 meses" completa="E o seu líder, foi avaliado quando?" />
        ),
      },
      {
        de: 4.7,
        ate: 9.8,
        cena: (t0, d) => (
          <Foto
            t0={t0}
            dur={d}
            src="v2-lider.png"
            foco="50% 30%"
            linhas={[
              { text: "Quem lidera a operação mais crítica", at: 4.9, size: 62 },
              { text: "foi avaliado quando?", at: 8.1, hl: "quando?", size: 76 },
            ]}
          />
        ),
      },
      {
        de: 9.8,
        ate: 14.8,
        cena: (t0, d) => (
          <Foto
            t0={t0}
            dur={d}
            src="b02.mp4"
            foco="50% 50%"
            linhas={[
              { text: "Na cabine,", at: 9.9, size: 64 },
              { text: "reagir sob pressão faz parte da segurança do voo.", at: 11.3, hl: "segurança do voo.", size: 64 },
            ]}
          />
        ),
      },
      {
        de: 14.8,
        ate: 21.9,
        cena: (t0) => (
          <Lista
            t0={t0}
            bg="navy"
            eyebrow="Na cabine também conta"
            itens={[
              { text: "Decidir com pouco tempo", at: 14.85 },
              { text: "Discordar do copiloto", at: 17.47 },
              { text: "Quanto arriscar", at: 20.12 },
            ]}
          />
        ),
      },
      {
        de: 21.9,
        ate: 23.0,
        cena: (t0, d) => <Foto t0={t0} dur={d} src="b03.mp4" rotulo={{ text: "Mineração", at: 21.95 }} />,
      },
      {
        de: 23.0,
        ate: 23.75,
        cena: (t0, d) => <Foto t0={t0} dur={d} src="b04.mp4" rotulo={{ text: "Porto", at: 23.0 }} />,
      },
      {
        de: 23.75,
        ate: 27.0,
        cena: (t0, d) => (
          <Foto
            t0={t0}
            dur={d}
            src="b05.mp4"
            foco="40% 50%"
            rotulo={{ text: "Manutenção industrial", at: 23.75 }}
            linhas={[{ text: "Vale a mesma conta.", at: 25.2, size: 84 }]}
          />
        ),
      },
      {
        de: 27.0,
        ate: 32.7,
        cena: (t0) => (
          <Junta t0={t0} une={31.3} linhas={[{ text: "O comportamento das pessoas e o ambiente em que elas trabalham", at: 27.08, size: 58 }]} />
        ),
      },
      {
        de: 32.7,
        ate: 39.4,
        cena: (t0, d) => (
          <Foto
            t0={t0}
            dur={d}
            src="c04.mp4"
            foco="50% 35%"
            linhas={[
              { text: "Última avaliação: na contratação?", at: 32.9, hl: "na contratação?", size: 62 },
              { text: "8 anos atrás?", at: 36.6, size: 62 },
              { text: "Vale olhar de novo.", at: 37.9, hl: "olhar de novo.", size: 76 },
            ]}
          />
        ),
      },
      {
        de: 39.4,
        ate: 48.78,
        cena: (t0) => (
          <Statement
            t0={t0}
            bg="branco"
            top={380}
            linhas={[
              { text: "A Mapa HDS avalia", at: 39.5, size: 60 },
              { text: "pessoas e ambiente na mesma leitura.", at: 41.4, hl: "mesma leitura.", size: 84 },
              { text: "Com psicólogos lendo cada resultado.", at: 45.7, size: 56 },
            ]}
          />
        ),
      },
      { de: 48.78, ate: V2_DUR, cena: (t0) => <Fecho t0={t0} frase="Pessoas, relações e ambiente." /> },
    ]}
  />
);

export const V3_DUR = 47.7;
export const V3: React.FC = () => (
  <Reel
    audio="v3.wav"
    words={w3 as Word[]}
    fimHook={6.0}
    fimFala={45.2}
    blocos={[
      {
        de: 0,
        ate: 6.0,
        cena: (t0, d) => (
          <Hook
            t0={t0}
            dur={d}
            src="c01.mp4"
            foco="40% 50%"
            grita="Tem um documento sobrecarregando alguém do seu time"
            completa="e quase ninguém relê"
          />
        ),
      },
      { de: 6.0, ate: 11.5, cena: (t0) => <Documento t0={t0} vaga={8.27} /> },
      {
        de: 11.5,
        ate: 19.2,
        cena: (t0) => (
          <Lista
            t0={t0}
            bg="navy"
            eyebrow="Então ela abraça o mundo"
            itens={[
              { text: "Responde fora de hora", at: 13.49 },
              { text: "Assume o que ficou sem dono", at: 15.09 },
              { text: "Vira referência pra tudo", at: 17.28 },
            ]}
          />
        ),
      },
      {
        de: 19.2,
        ate: 24.3,
        cena: (t0, d) => (
          <Foto t0={t0} dur={d} src="c02.mp4" foco="50% 40%" linhas={[{ text: "6 meses depois.", at: 19.3, hl: "6 meses", size: 90 }]} />
        ),
      },
      {
        de: 24.3,
        ate: 29.0,
        cena: (t0, d) => (
          <Foto t0={t0} dur={d} src="c03.mp4" foco="50% 40%" linhas={[{ text: "Dava pra ver antes.", at: 24.4, hl: "antes.", size: 86 }]} />
        ),
      },
      {
        de: 29.0,
        ate: 33.2,
        cena: (t0, d) => (
          <Foto
            t0={t0}
            dur={d}
            src="v3-escuta.png"
            foco="50% 35%"
            linhas={[{ text: "Perguntando pra quem trabalha.", at: 29.0, hl: "quem trabalha.", size: 70 }]}
          />
        ),
      },
      {
        de: 33.2,
        ate: 45.21,
        cena: (t0) => (
          <Lista
            t0={t0}
            bg="petrol"
            eyebrow="Inventário Psicossocial"
            titulo={{ text: "O que ele faz", at: 33.3, size: 80 }}
            itens={[
              { text: "Escuta as pessoas", at: 36.66 },
              { text: "Mapeia o ambiente por área e cargo", at: 38.29 },
              { text: "Mostra onde a sobrecarga nasce", at: 41.53 },
            ]}
          />
        ),
      },
      { de: 45.21, ate: V3_DUR, cena: (t0) => <Fecho t0={t0} frase="Pessoas, relações e ambiente." /> },
    ]}
  />
);
