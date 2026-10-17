import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {DATEN, DatenBuehne, Quelle, Text, Zaehlwerk, euroText, skala} from '../../../../../../src/design-system/daten';

export const MECHANIC_ID = 'flat-payment-plan-then-balloon-column-jump';
export const VISUAL_TECHNIQUE_ID = 'twelve-month-columns-same-scale-final-balloon-with-running-total';
export const COMPOSITION_FAMILY_ID = 'data-viz';

/**
 * ANIMATION_NARRATIVE
 * START: Leerer Zahlungsplan mit 12 Monatsplätzen, Summe 0 €.
 * MECHANISM: Monat 1–11 wachsen nacheinander als flache 30-€-Säulen; die laufende Summe zählt 30 € pro Monat bis 330 €.
 *   Dann schießt Säule 12 auf derselben Skala auf 270 € hoch — neunmal so hoch wie eine Monatsrate.
 * CONSEQUENCE: Die Summe springt von 330 € auf 600 €.
 * RESULT: Ein flacher Plan mit einer riesigen letzten Säule; Callout „Schlussrate = 9 Monatsraten auf einmal“.
 *
 * EDITORIAL_VISUAL_NARRATIVE
 * HERO: Säule 12 (270 €) gegen elf flache 30-€-Säulen
 * SUPPORT: laufende Summe, Klammer 11 × 30 €, Schlussraten-Callout
 * SURFACE: helles Off-White
 * SHAPE_LANGUAGE: Säulendiagramm ab 0 €, eine Akzentfarbe
 */
export const ANIMATION_NARRATIVE = {
  START: 'Leerer Zahlungsplan, 12 Monate',
  MECHANISM: '11 Säulen à 30 €, dann Säule 12 mit 270 € auf derselben Skala',
  RESULT: '11 × 30 € + 270 € = 600 €; Schlussrate = 9 Monatsraten',
};

const RATE = 30;
const KLEINE = 11;
const SCHLUSS = 270;
const SUMME = RATE * KLEINE + SCHLUSS; // 600 €
if (SUMME !== 600) throw new Error('11 × 30 € + 270 € muss 600 € ergeben.');

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = Easing.bezier(0.33, 0, 0.2, 1);
const raus = Easing.bezier(0.2, 0.9, 0.25, 1);
const p = (frame: number, von: number, bis: number, easing = weich) => interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing});

// beats: [„Zum Beispiel elf Raten“, „Und dann zweihundertsiebzig“, „Zusammen sind das“, „Aber die letzte Zahlung“]
const PREVIEW_BEATS = [0, 82, 152, 222];

// Skala ab 0 €: 270 € = 540 px → 30 € = 60 px.
const BASIS_Y = DATEN.mitteY + 290;
const px = skala(SCHLUSS, 540);
const PLAN = {links: 300, rechts: 1620};
const FACH = (PLAN.rechts - PLAN.links) / 12;
const BREITE = 72;
const mitte = (i: number) => PLAN.links + FACH * (i + 0.5);

export const YouTubeVisual30Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];

  const grund = p(frame, at(0), at(0) + 12);
  const kleinStart = (i: number) => at(0) + 8 + i * 6;
  const kleinP = (i: number) => p(frame, kleinStart(i), kleinStart(i) + 12);
  const klammer = p(frame, kleinStart(KLEINE - 1) + 10, kleinStart(KLEINE - 1) + 24);
  const schluss = p(frame, at(1), at(1) + 22, raus);
  const summeAuf = p(frame, at(2), at(2) + 14);
  const callout = p(frame, at(3), at(3) + 14);

  // Zählwerk 1: 30 € pro Monatssäule (schnell); Zählwerk 2 übernimmt bei „Zusammen sind das“ und rollt 330 € → 600 €.
  const stationenMonate = Array.from({length: KLEINE}, (_, i) => ({ab: kleinStart(i) + 4, wert: RATE * (i + 1)}));
  const zusammen = frame >= at(2);

  const x12 = mitte(11);
  const yTop12 = BASIS_Y - px(SCHLUSS);

  return (
    <DatenBuehne>
      <Quelle>Beispiel: 600 € mit Schlussrate</Quelle>

      {/* Grundlinie + Monatsnummern */}
      <div style={{position: 'absolute', left: PLAN.links, width: PLAN.rechts - PLAN.links, top: BASIS_Y, height: 3, backgroundColor: DATEN.neutral, opacity: grund}} />
      <Text x={PLAN.links - 24} y={BASIS_Y + 40} groesse={DATEN.minText} gewicht={600} farbe={DATEN.leise} ausrichtung="rechts" ab={at(0)}>
        Monat
      </Text>
      {Array.from({length: 12}, (_, i) => (
        <Text key={i} x={mitte(i)} y={BASIS_Y + 40} groesse={30} gewicht={i === 11 ? 800 : 600} farbe={i === 11 ? DATEN.text : DATEN.leise} ausrichtung="mitte" ab={at(0) + 2}>
          {i + 1}
        </Text>
      ))}

      {/* Monat 1–11: je 30 € */}
      {Array.from({length: KLEINE}, (_, i) => {
        const k = kleinP(i);
        const h = px(RATE) * k;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: mitte(i) - BREITE / 2, width: BREITE, top: BASIS_Y - h, height: h, backgroundColor: DATEN.blau, borderRadius: '8px 8px 0 0', opacity: k > 0 ? 1 : 0}} />
            <div style={{position: 'absolute', left: mitte(i), top: BASIS_Y - px(RATE) - 30, transform: 'translate(-50%, -50%)', fontSize: 28, fontWeight: 700, color: DATEN.text, opacity: k, whiteSpace: 'nowrap'}}>
              {euroText(RATE)}
            </div>
          </React.Fragment>
        );
      })}

      {/* Klammer unter … über Monat 1–11 */}
      <div style={{position: 'absolute', left: mitte(0) - BREITE / 2, width: (mitte(KLEINE - 1) - mitte(0) + BREITE) * klammer, top: BASIS_Y - px(RATE) - 70, height: 16, borderTop: `3px solid ${DATEN.blau}`, borderLeft: `3px solid ${DATEN.blau}`, borderRight: klammer > 0.98 ? `3px solid ${DATEN.blau}` : undefined, boxSizing: 'border-box'}} />
      <Text x={(mitte(0) + mitte(KLEINE - 1)) / 2} y={BASIS_Y - px(RATE) - 110} groesse={38} gewicht={800} farbe={DATEN.blau} ausrichtung="mitte" ab={kleinStart(KLEINE - 1) + 14}>
        11 × {euroText(RATE)} = {euroText(RATE * KLEINE)}
      </Text>

      {/* Monat 12: Schlussrate 270 € */}
      <div style={{position: 'absolute', left: x12 - BREITE / 2, width: BREITE, top: BASIS_Y - px(SCHLUSS) * schluss, height: px(SCHLUSS) * schluss, backgroundColor: DATEN.orange, borderRadius: '8px 8px 0 0', opacity: schluss > 0 ? 1 : 0}} />
      <div style={{position: 'absolute', left: x12, top: BASIS_Y - px(SCHLUSS) * schluss - 34, transform: 'translate(-50%, -50%)', fontSize: 40, fontWeight: 900, color: DATEN.orange, opacity: schluss, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
        {euroText(Math.round(SCHLUSS * schluss))}
      </div>

      {/* Laufende Summe */}
      <Text x={PLAN.links} y={yTop12 - 10} groesse={34} gewicht={700} farbe={DATEN.leise} ab={at(0) + 8}>
        Summe
      </Text>
      {zusammen ? (
        <Zaehlwerk x={PLAN.links + 140} y={yTop12 - 10} stationen={[{ab: at(2), wert: SUMME}]} start={RATE * KLEINE} dauer={18} groesse={76} ausrichtung="links" farbe={summeAuf > 0.5 ? DATEN.text : DATEN.leise} ab={-100} />
      ) : (
        <Zaehlwerk x={PLAN.links + 140} y={yTop12 - 10} stationen={stationenMonate} dauer={4} groesse={76} ausrichtung="links" farbe={DATEN.leise} ab={at(0) + 8} />
      )}

      {/* Callout an Säule 12 */}
      <div
        style={{
          position: 'absolute',
          left: x12 - BREITE / 2 - 34,
          top: yTop12 + 110,
          transform: `translate(-100%, -50%) translateX(${((1 - callout) * -16).toFixed(1)}px)`,
          opacity: callout,
          padding: '18px 28px',
          borderRadius: 16,
          backgroundColor: DATEN.papier,
          borderRight: `8px solid ${DATEN.orange}`,
          boxShadow: '0 12px 30px rgba(32, 42, 37, 0.10)',
          textAlign: 'right',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{fontSize: 46, fontWeight: 900, color: DATEN.orange}}>Schlussrate</div>
        <div style={{fontSize: 30, fontWeight: 700, color: DATEN.text}}>= {SCHLUSS / RATE} Monatsraten auf einmal</div>
      </div>
    </DatenBuehne>
  );
};
