import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {DATEN, DatenBuehne, Quelle, Text, Zaehlwerk, euroText, skala} from '../../../../../src/design-system/daten';

export const MECHANIC_ID = 'monthly-column-replicates-into-year';
export const VISUAL_TECHNIQUE_ID = 'column-compare-then-twelvefold-row';
export const COMPOSITION_FAMILY_ID = 'value-comparison-to-repetition';

/**
 * ANIMATION_NARRATIVE
 * START: Säule 62 € (2026) wächst; daneben erscheint 55 € (2025) blasser.
 * MECHANISM: Die 62-€-Säule schrumpft in eine Reihe und verdoppelt sich, bis zwölf gleich hohe Säulen stehen;
 *   der Zähler springt bei jeder neuen Säule um 62 €.
 * RESULT: 744 € im Jahr pro Haushalt mit Digital-Abos.
 * Quelle: BearingPoint, Submix-Studie 2026 (11.06.2026).
 */
export const ANIMATION_NARRATIVE = {
  START: 'Säule 62 € pro Monat, daneben 55 € aus dem Vorjahr',
  MECHANISM: 'Die 62-€-Säule wird zwölfmal aneinandergereiht, der Zähler zählt mit',
  RESULT: '744 € im Jahr',
};

const HEUTE = 62;
const VORJAHR = 55;
const MONATE = 12;
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// beats: [„zweiundsechzig Euro“ → 2026-Säule, „fünfundfünfzig“ → 2025-Säule, „siebenhundertvierundvierzig“ → Jahr]
const PREVIEW_BEATS = [0, 75, 150];

const GROSS = {unten: 820, hoehe: skala(70, 440), breite: 170};
const REIHE = {x0: 330, abstand: 114, unten: 820, hoehe: skala(70, 230), breite: 86};

export const YouTubeVisual03Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];
  const wachsen = (ab: number) => spring({frame: frame - ab, fps, config: {damping: 18, stiffness: 120, overshootClamping: true}});

  const heute = wachsen(at(0));
  const vorjahr = wachsen(at(1));
  // Phase Jahr: große Säule wird zur ersten Reihen-Säule (Magic Move).
  const zuReihe = interpolate(frame, [at(2), at(2) + 18], [0, 1], {...CLAMP, easing: (t) => t * t * (3 - 2 * t)});
  const kopieAb = (i: number) => at(2) + 18 + (i - 1) * 6;
  const vorjahrWeg = interpolate(frame, [at(2), at(2) + 12], [1, 0], CLAMP);

  const x = interpolate(zuReihe, [0, 1], [1080, REIHE.x0]);
  const h = interpolate(zuReihe, [0, 1], [GROSS.hoehe(HEUTE), REIHE.hoehe(HEUTE)]) * heute;
  const w = interpolate(zuReihe, [0, 1], [GROSS.breite, REIHE.breite]);
  const delta = interpolate(frame, [at(1) + 14, at(1) + 26], [0, 1], CLAMP) * vorjahrWeg;

  const grundlinie = interpolate(frame, [0, 12], [0, 1], CLAMP);
  return (
    <DatenBuehne>
      {/* Ab Frame 0: worum es geht, während die Studie genannt wird */}
      <div style={{opacity: grundlinie * (1 - zuReihe)}}>
        <div style={{position: 'absolute', left: 560, top: GROSS.unten, width: 720, height: 3, backgroundColor: DATEN.neutral}} />
      </div>
      <Text x={960} y={190} groesse={40} gewicht={800} ausrichtung="mitte" ab={0}>
        Digital-Abos · Ø pro Haushalt
      </Text>
      <Text x={960} y={246} groesse={32} gewicht={700} farbe={DATEN.leise} ausrichtung="mitte" ab={6}>
        BearingPoint Submix-Studie 2026
      </Text>
      {/* 2025 (blass) */}
      <div style={{opacity: vorjahrWeg}}>
        <div style={{position: 'absolute', left: 760 - GROSS.breite / 2, top: GROSS.unten - GROSS.hoehe(VORJAHR) * vorjahr, width: GROSS.breite, height: GROSS.hoehe(VORJAHR) * vorjahr, backgroundColor: DATEN.neutral, borderRadius: '14px 14px 0 0'}} />
        <Text x={760} y={GROSS.unten - GROSS.hoehe(VORJAHR) * vorjahr - 40} groesse={46} gewicht={800} farbe={DATEN.leise} ausrichtung="mitte" ab={at(1)}>
          {euroText(VORJAHR)}
        </Text>
        <Text x={760} y={GROSS.unten + 44} groesse={34} gewicht={700} farbe={DATEN.leise} ausrichtung="mitte" ab={at(1)}>
          2025
        </Text>
      </div>
      {/* Plus 7 € zwischen den Säulen */}
      <div style={{position: 'absolute', left: 920, top: GROSS.unten - GROSS.hoehe(HEUTE) - 70, transform: 'translate(-50%, -50%)', opacity: delta, padding: '8px 18px', borderRadius: 999, backgroundColor: DATEN.rot, color: DATEN.papier, fontSize: 32, fontWeight: 800}}>
        +{euroText(HEUTE - VORJAHR)}
      </div>
      {/* 2026 → erste Säule der Jahresreihe */}
      <div style={{position: 'absolute', left: x - w / 2, top: GROSS.unten - h, width: w, height: h, backgroundColor: DATEN.rot, borderRadius: '14px 14px 0 0'}} />
      <Text x={x} y={GROSS.unten - h - 40} groesse={interpolate(zuReihe, [0, 1], [54, 30])} gewicht={800} ausrichtung="mitte" ab={at(0)}>
        {euroText(HEUTE)}
      </Text>
      <div style={{opacity: 1 - zuReihe}}>
        <Text x={1080} y={GROSS.unten + 44} groesse={34} gewicht={800} ausrichtung="mitte" ab={at(0)}>
          2026 · pro Monat
        </Text>
      </div>
      {/* Elf weitere Monate */}
      {Array.from({length: MONATE - 1}, (_, k) => k + 1).map((i) => {
        const p = spring({frame: frame - kopieAb(i), fps, config: {damping: 14, stiffness: 200, overshootClamping: true}});
        if (frame < kopieAb(i)) return null;
        const hoehe = REIHE.hoehe(HEUTE) * p;
        return <div key={i} style={{position: 'absolute', left: REIHE.x0 + i * REIHE.abstand - REIHE.breite / 2, top: REIHE.unten - hoehe, width: REIHE.breite, height: hoehe, backgroundColor: DATEN.rot, borderRadius: '10px 10px 0 0'}} />;
      })}
      <div style={{position: 'absolute', left: REIHE.x0 - 70, top: REIHE.unten, width: (MONATE - 1) * REIHE.abstand + 140, height: 3, backgroundColor: DATEN.neutral}} />
      {frame >= at(2) + 10 ? (
        <>
          <Zaehlwerk x={960} y={420} groesse={150} start={HEUTE} ab={at(2) + 10} dauer={6} stationen={Array.from({length: MONATE - 1}, (_, k) => ({ab: kopieAb(k + 1), wert: HEUTE * (k + 2)}))} />
          <Text x={960} y={522} groesse={40} gewicht={700} farbe={DATEN.leise} ausrichtung="mitte" ab={kopieAb(MONATE - 1) + 6}>
            im Jahr — 12 × {euroText(HEUTE)}
          </Text>
        </>
      ) : null}
      <Quelle ab={at(0)}>Quelle: BearingPoint, Submix-Studie 2026 · Durchschnitt pro Haushalt mit Digital-Abos</Quelle>
    </DatenBuehne>
  );
};
