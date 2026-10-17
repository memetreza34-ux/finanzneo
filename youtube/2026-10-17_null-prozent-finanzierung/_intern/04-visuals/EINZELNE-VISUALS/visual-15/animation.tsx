import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {DATEN, DatenBuehne, Quelle, Text, euroText, skala} from '../../../../../../src/design-system/daten';

export const MECHANIC_ID = 'price-columns-cut-difference-slice-out';
export const VISUAL_TECHNIQUE_ID = 'two-shop-columns-level-line-lifts-top-slice';
export const COMPOSITION_FAMILY_ID = 'comparison';

/**
 * ANIMATION_NARRATIVE
 * START: Derselbe Fernseher in Shop A „0 % Finanzierung“ als Preissäule 600 €.
 * MECHANISM: Shop B wächst daneben auf 550 €; eine gestrichelte Linie auf Höhe 550 € läuft über beide Säulen
 *   und schneidet das obere Stück von Shop A ab.
 * CONSEQUENCE: Dieses Stück (exakt 50 €) löst sich, färbt sich orange und gleitet nach rechts.
 * RESULT: „+50 €“ als eigenes Stück mit „Zinsen im Preis“; in Shop A bleibt die leere Kontur, 600 € bleibt lesbar.
 *
 * EDITORIAL_VISUAL_NARRATIVE
 * HERO: zwei Preissäulen gleicher Skala
 * SUPPORT: 550-€-Schnittlinie, herausgelöstes Differenzstück
 * SURFACE: helles Off-White
 * SHAPE_LANGUAGE: flache Säulen, gestrichelte Hilfslinie, ein Akzentstück
 */
export const ANIMATION_NARRATIVE = {
  START: 'Shop A mit 0 % Finanzierung: 600 €',
  MECHANISM: 'Shop B 550 €, Schnittlinie bei 550 €, das 50-€-Stück löst sich aus Shop A',
  RESULT: '50 € mehr = Zinsen im Preis',
};

const PREIS_A = 600;
const PREIS_B = 550;
const DIFFERENZ = PREIS_A - PREIS_B; // 50 €

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = Easing.bezier(0.33, 0, 0.2, 1);
const p = (frame: number, von: number, bis: number) => interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing: weich});

// beats: [„Kostet derselbe Fernseher“, „fünfhundertfünfzig Euro“, „fünfzig Euro mehr“, „Die Zinsen stecken“]
const PREVIEW_BEATS = [0, 82, 175, 210];

// Skala: 600 € = 540 px Höhe → 50 € = 45 px. Achse beginnt bei 0 €.
const BASIS_Y = DATEN.mitteY + 270;
const HOEHE_MAX = 540;
const px = skala(PREIS_A, HOEHE_MAX);
const SAEULE = {breite: 220};
const X_A = 680;
const X_B = 980;
const X_STUECK = 1320;
// Alle Preise stehen auf einer gemeinsamen Zeile über der 600-€-Höhe — das Stück gleitet darunter durch.
const PREIS_ZEILE_Y = BASIS_Y - HOEHE_MAX - 50;

const Fernseher: React.FC<{farbe: string}> = ({farbe}) => (
  <svg width={46} height={38} viewBox="0 0 58 46" style={{flexShrink: 0}}>
    <rect x={3} y={3} width={52} height={32} rx={4} fill="none" stroke={farbe} strokeWidth={4} />
    <line x1={20} y1={43} x2={38} y2={43} stroke={farbe} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

export const YouTubeVisual15Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];

  const wachsA = p(frame, at(0) + 4, at(0) + 30);
  const wachsB = p(frame, at(1), at(1) + 26);
  const linie = p(frame, at(1) + 30, at(1) + 50);
  const markiert = p(frame, at(2), at(2) + 10);
  const raus = p(frame, at(2) + 8, at(2) + 34);
  const zinsen = p(frame, at(3), at(3) + 14);

  const hA = px(PREIS_A) * wachsA;
  const hB = px(PREIS_B) * wachsB;
  const hBasisA = Math.min(hA, px(PREIS_B));
  const hStueck = Math.max(0, hA - px(PREIS_B));
  const yLinie = BASIS_Y - px(PREIS_B);
  const yStueckOben = BASIS_Y - px(PREIS_A);

  // Stück wandert von Shop A nach rechts neben die Säulen, gleiche Höhe.
  const stueckX = interpolate(raus, [0, 1], [X_A, X_STUECK]);
  const stueckFarbe = markiert > 0.5 ? DATEN.orange : DATEN.blau;

  const spalten = [
    {x: X_A, shop: 'Shop A', notiz: '0 % Finanzierung', wert: PREIS_A, sichtbar: wachsA, ab: at(0)},
    {x: X_B, shop: 'Shop B', notiz: 'ohne Finanzierung', wert: PREIS_B, sichtbar: wachsB, ab: at(1)},
  ];

  return (
    <DatenBuehne>
      <Quelle>Beispiel: derselbe Fernseher in zwei Shops</Quelle>

      {/* Grundlinie */}
      <div style={{position: 'absolute', left: X_A - 220, width: X_STUECK + 200 - (X_A - 220), top: BASIS_Y, height: 3, backgroundColor: DATEN.neutral}} />

      {/* Shop A: Sockel bis 550 € + oberes Stück (bis 600 €) */}
      <div style={{position: 'absolute', left: X_A - SAEULE.breite / 2, width: SAEULE.breite, top: BASIS_Y - hBasisA, height: hBasisA, backgroundColor: DATEN.blau, borderRadius: hStueck > 0 ? 0 : '10px 10px 0 0', opacity: wachsA > 0 ? 1 : 0}} />
      {/* leere Kontur, wo das Stück herausgelöst wurde */}
      <div style={{position: 'absolute', left: X_A - SAEULE.breite / 2, width: SAEULE.breite, top: yStueckOben, height: px(DIFFERENZ), border: `3px dashed ${DATEN.orange}`, boxSizing: 'border-box', borderRadius: '10px 10px 0 0', opacity: raus}} />
      {hStueck > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: stueckX - SAEULE.breite / 2,
            width: SAEULE.breite,
            top: BASIS_Y - hBasisA - hStueck,
            // Ab der Markierung 4 px Schnittfuge über dem 550-€-Sockel.
            height: Math.max(0, hStueck - 4 * markiert),
            backgroundColor: stueckFarbe,
            borderRadius: raus > 0.02 ? 10 : '10px 10px 0 0',
            boxShadow: raus > 0.02 ? '0 10px 24px rgba(32, 42, 37, 0.14)' : undefined,
          }}
        />
      ) : null}

      {/* Shop B */}
      <div style={{position: 'absolute', left: X_B - SAEULE.breite / 2, width: SAEULE.breite, top: BASIS_Y - hB, height: hB, backgroundColor: DATEN.gruen, borderRadius: '10px 10px 0 0', opacity: wachsB > 0 ? 1 : 0}} />

      {/* Preise über den Säulen */}
      {spalten.map((s) => {
        return (
          <div key={s.shop} style={{position: 'absolute', left: s.x, top: PREIS_ZEILE_Y, transform: 'translate(-50%, -50%)', fontSize: 48, fontWeight: 800, opacity: s.sichtbar, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
            {euroText(Math.round(s.wert * s.sichtbar))}
          </div>
        );
      })}

      {/* Beschriftung unter den Säulen */}
      {spalten.map((s) => {
        const auf = p(frame, s.ab, s.ab + 12);
        return (
          <div key={`${s.shop}-label`} style={{position: 'absolute', left: s.x, top: BASIS_Y + 22, transform: `translateX(-50%) translateY(${((1 - auf) * 12).toFixed(1)}px)`, opacity: auf, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 36, fontWeight: 800}}>
              <Fernseher farbe={DATEN.text} />
              {s.shop}
            </div>
            <div style={{fontSize: 30, fontWeight: 700, color: s.shop === 'Shop A' ? DATEN.blau : DATEN.leise}}>{s.notiz}</div>
          </div>
        );
      })}

      {/* Schnittlinie bei 550 € über beide Säulen */}
      <div style={{position: 'absolute', left: X_A - SAEULE.breite / 2 - 30, top: yLinie - 2, width: (X_B + SAEULE.breite / 2 + 30 - (X_A - SAEULE.breite / 2 - 30)) * linie, height: 0, borderTop: `4px dashed ${DATEN.text}`, opacity: 0.6}} />
      <Text x={X_A - SAEULE.breite / 2 - 44} y={yLinie} groesse={30} gewicht={700} farbe={DATEN.leise} ausrichtung="rechts" ab={at(1) + 40}>
        {euroText(PREIS_B)}
      </Text>

      {/* herausgelöstes Stück: Wert und Bedeutung */}
      <div style={{position: 'absolute', left: X_STUECK, top: PREIS_ZEILE_Y, transform: `translate(-50%, -50%) translateY(${((1 - raus) * 12).toFixed(1)}px)`, opacity: p(frame, at(2) + 24, at(2) + 36), fontSize: 52, fontWeight: 900, color: DATEN.orange, whiteSpace: 'nowrap'}}>
        +{euroText(DIFFERENZ)}
      </div>
      <div
        style={{
          position: 'absolute',
          left: X_STUECK,
          top: yStueckOben + px(DIFFERENZ) + 30,
          transform: `translateX(-50%) translateY(${((1 - zinsen) * 14).toFixed(1)}px)`,
          opacity: zinsen,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{width: 3, height: 40, backgroundColor: DATEN.orange}} />
        <div style={{fontSize: 44, fontWeight: 900, color: DATEN.text}}>Zinsen im Preis</div>
      </div>
    </DatenBuehne>
  );
};
