import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {DATEN, DatenBuehne, Text, Zaehlwerk, euroText, skala} from '../../../../../src/design-system/daten';

export const MECHANIC_ID = 'yearly-cost-stacks-turn-into-savings';
export const VISUAL_TECHNIQUE_ID = 'cumulative-years-then-swap-to-savings';
export const COMPOSITION_FAMILY_ID = 'cumulative-columns-reversal';

/**
 * ANIMATION_NARRATIVE
 * START: Ein Chip „9,99 € / Monat“.
 * MECHANISM: Der Chip wird zur Jahressäule 119,88 €; Jahr für Jahr kommt eine gleich hohe Säule
 *   obendrauf (239,76 € → 359,64 €). Dann kippt die Rechnung: zwei gekündigte Abos werden
 *   zu zwei grünen Jahresblöcken, die zusammen 239,76 € ergeben.
 * RESULT: „bleiben dir — rund 240 € im Jahr“.
 */
export const ANIMATION_NARRATIVE = {
  START: '9,99 € pro Monat',
  MECHANISM: 'Monatspreis wird Jahresbetrag, Jahr um Jahr stapelt er sich; dann zwei gekündigte Abos werden grün',
  RESULT: 'rund 240 € mehr im Jahr',
};

const MONAT_CENT = 999;
const JAHR_CENT = MONAT_CENT * 12;
const JAHRE = 3;
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = (t: number) => t * t * (3 - 2 * t);
const euro = (cent: number) => euroText(cent / 100, 2);

// beats: [„nie nur den Monatspreis“, „mal zwölf“, „Jedes Jahr, bis du kündigst“, „zwei Abos … kündigst“]
const PREVIEW_BEATS = [0, 50, 100, 170];

const BODEN = 800;
const px = skala(JAHR_CENT * JAHRE, 560);
const SAEULE = {x: 760, breite: 220};

export const YouTubeVisual20Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];
  const chipRein = spring({frame: frame - at(0), fps, config: {damping: 16, stiffness: 150}});
  const zuJahr = interpolate(frame, [at(1), at(1) + 22], [0, 1], {...CLAMP, easing: weich});
  const jahrAb = (j: number) => at(2) + j * 14;
  const kippen = interpolate(frame, [at(3), at(3) + 18], [0, 1], {...CLAMP, easing: weich});
  const gruenAb = (k: number) => at(3) + 14 + k * 12;

  // Chip (Monat) → erste Jahressäule (Magic Move)
  const chipBreite = interpolate(zuJahr, [0, 1], [440, SAEULE.breite]);
  const chipHoehe = interpolate(zuJahr, [0, 1], [110, px(JAHR_CENT)]);
  const chipY = interpolate(zuJahr, [0, 1], [540 - 55, BODEN - px(JAHR_CENT)]);
  const chipX = interpolate(zuJahr, [0, 1], [960, SAEULE.x]);
  const kostenWeg = 1 - kippen;

  return (
    <DatenBuehne>
      <div style={{opacity: kostenWeg}}>
        <div style={{position: 'absolute', left: chipX - chipBreite / 2, top: chipY, width: chipBreite, height: chipHoehe, borderRadius: interpolate(zuJahr, [0, 1], [24, 10]), backgroundColor: DATEN.rot, opacity: chipRein, transform: `scale(${(0.9 + 0.1 * chipRein).toFixed(3)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: DATEN.papier, fontSize: 44, fontWeight: 800, whiteSpace: 'nowrap'}}>
          {zuJahr < 0.5 ? `${euro(MONAT_CENT)} / Monat` : `Jahr 1`}
        </div>
        {Array.from({length: JAHRE - 1}, (_, k) => k + 1).map((j) => {
          const p = spring({frame: frame - jahrAb(j), fps, config: {damping: 13, stiffness: 190}});
          if (frame < jahrAb(j)) return null;
          return (
            <div key={j} style={{position: 'absolute', left: SAEULE.x - SAEULE.breite / 2, top: BODEN - px(JAHR_CENT * (j + 1)) + 4, width: SAEULE.breite, height: px(JAHR_CENT) - 4, borderRadius: 10, backgroundColor: DATEN.rot, opacity: p, transform: `translateY(${((1 - p) * -60).toFixed(1)}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: DATEN.papier, fontSize: 40, fontWeight: 800}}>
              Jahr {j + 1}
            </div>
          );
        })}
        <div style={{position: 'absolute', left: SAEULE.x - 170, top: BODEN, width: 340, height: 3, backgroundColor: DATEN.neutral, opacity: zuJahr}} />
        {frame >= at(1) ? (
          <Zaehlwerk x={1260} y={520} groesse={110} nachkomma={2} start={MONAT_CENT / 100} dauer={14} ab={at(1)} farbe={DATEN.rot} stationen={[{ab: at(1) + 4, wert: JAHR_CENT / 100}, ...Array.from({length: JAHRE - 1}, (_, k) => ({ab: jahrAb(k + 1), wert: (JAHR_CENT * (k + 2)) / 100}))]} />
        ) : null}
        <Text x={1260} y={612} groesse={36} gewicht={700} farbe={DATEN.leise} ausrichtung="mitte" ab={at(2)}>
          bis du kündigst
        </Text>
      </div>
      {/* Umkehr: zwei gekündigte Abos = Geld, das bleibt */}
      {frame >= at(3) ? (
        <>
          {[0, 1].map((k) => {
            const p = spring({frame: frame - gruenAb(k), fps, config: {damping: 14, stiffness: 170, overshootClamping: true}});
            const x = 640 + k * 300;
            return (
              <React.Fragment key={k}>
                <div style={{position: 'absolute', left: x - SAEULE.breite / 2, top: BODEN - px(JAHR_CENT) * p, width: SAEULE.breite, height: px(JAHR_CENT) * p, borderRadius: '12px 12px 0 0', backgroundColor: DATEN.gruen}} />
                <Text x={x} y={BODEN + 40} groesse={28} gewicht={700} farbe={DATEN.leise} ausrichtung="mitte" ab={gruenAb(k)}>
                  Abo {k + 1} gekündigt
                </Text>
                <Text x={x} y={BODEN - px(JAHR_CENT) * p - 38} groesse={36} gewicht={800} farbe={DATEN.gruen} ausrichtung="mitte" ab={gruenAb(k)}>
                  +{euro(JAHR_CENT)}
                </Text>
              </React.Fragment>
            );
          })}
          <div style={{position: 'absolute', left: 480, top: BODEN, width: 620, height: 3, backgroundColor: DATEN.neutral}} />
          <Text x={1240} y={480} groesse={44} gewicht={700} farbe={DATEN.leise} ab={gruenAb(1) + 10}>
            bleiben dir
          </Text>
          <Text x={1240} y={570} groesse={110} gewicht={800} farbe={DATEN.gruen} ab={gruenAb(1) + 14}>
            ≈ 240 €
          </Text>
          <Text x={1244} y={658} groesse={40} gewicht={700} ab={gruenAb(1) + 20}>
            im Jahr · genau {euro(JAHR_CENT * 2)}
          </Text>
        </>
      ) : null}
    </DatenBuehne>
  );
};
