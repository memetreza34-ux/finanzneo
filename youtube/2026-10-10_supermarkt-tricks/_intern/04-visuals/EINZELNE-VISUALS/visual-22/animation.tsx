import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {DATEN, DatenBuehne, Quelle, Text, euroText, skala} from '../../../../../../src/design-system/daten';

export const MECHANIC_ID = 'price-history-trace-reference-check';
export const VISUAL_TECHNIQUE_ID = 'step-line-30-day-window-with-lowest-price-reference';
export const COMPOSITION_FAMILY_ID = 'trend-trace';

/**
 * ANIMATION_NARRATIVE
 * START: 30-Tage-Fenster, Preislinie läuft Tag für Tag flach bei 2,99 €.
 * MECHANISM: Kurz vor der Aktion springt die Linie für fünf Tage auf 3,99 €, dann zurück auf
 *   2,99 € — ein rotes Schild „−25 %, statt 3,99 €“ erscheint.
 * CONSEQUENCE: Die Referenzlinie „niedrigster Preis der letzten 30 Tage: 2,99 €“ zieht sich über
 *   das ganze Fenster und liegt exakt auf dem Aktionspreis.
 * RESULT: Echter Rabatt 0 %, das Schild wird durchgestrichen und als „verboten“ gestempelt.
 *
 * Preise sind Beispielwerte. Regel: § 11 Preisangabenverordnung (seit 28.05.2022).
 */
export const ANIMATION_NARRATIVE = {
  START: '30 Tage Preisverlauf, flach bei 2,99 €',
  MECHANISM: 'Kurz 3,99 €, dann „−25 %“-Schild auf 2,99 €; Referenzlinie = niedrigster Preis der 30 Tage',
  RESULT: 'Echter Rabatt 0 % — das Schild ist verboten',
};

// Beispielverlauf: Tag 1–22: 2,99 € · Tag 23–27: 3,99 € · Tag 28–30 (Aktion): 2,99 €
const NORMAL = 2.99;
const HOCH = 3.99;
const HOCH_AB = 22; // Tagesgrenze (Ende Tag 22)
const AKTION_AB = 27; // Ende Tag 27
const TAGE = 30;
const preisAm = (d: number) => (d >= HOCH_AB && d < AKTION_AB ? HOCH : NORMAL);
/** Preis direkt links von der Tagesgrenze d (Spitze der Linie bleibt auf dem alten Preis, bis die Stufe gezeichnet wird). */
const preisLinks = (d: number) => preisAm(Math.max(0, d - 1e-6));
const NIEDRIGSTER = NORMAL; // Minimum über alle 30 Tage
const WERBE_RABATT = Math.round(((HOCH - NORMAL) / HOCH) * 100); // 25
const ECHTER_RABATT = Math.round(((NIEDRIGSTER - NORMAL) / NIEDRIGSTER) * 100); // 0
if (WERBE_RABATT !== 25 || ECHTER_RABATT !== 0) throw new Error('Rabattrechnung stimmt nicht.');

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = Easing.bezier(0.33, 0, 0.2, 1);
const p = (frame: number, von: number, bis: number) => interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing: weich});

// beats: [„Wer mit einer Preissenkung“, „niedrigsten Preis“, „kurz hochsetzen“, „minus dreißig Prozent“, „Das ist heute verboten“]
const PREVIEW_BEATS = [0, 114, 275, 334, 389];

const DIAGRAMM = {links: 300, rechts: 1250, unten: 760, hoehe: 430};
const Y_MAX = 4.5;
const hoehe = skala(Y_MAX, DIAGRAMM.hoehe);
const xTag = (d: number) => DIAGRAMM.links + (d / TAGE) * (DIAGRAMM.rechts - DIAGRAMM.links);
const yPreis = (preis: number) => DIAGRAMM.unten - hoehe(preis);
const SCHILD = {links: 1370, oben: 280, breite: 380, hoehe: 320};

/** Treppenlinie vom Tag 0 bis zum (stetigen) Tag `bis`. */
const treppe = (bis: number) => {
  let d = `M ${xTag(0)} ${yPreis(preisAm(0))}`;
  for (const grenze of [HOCH_AB, AKTION_AB]) {
    if (bis <= grenze) break;
    d += ` L ${xTag(grenze)} ${yPreis(preisAm(grenze - 0.5))} L ${xTag(grenze)} ${yPreis(preisAm(grenze))}`;
  }
  return `${d} L ${xTag(bis)} ${yPreis(preisLinks(bis))}`;
};

export const YouTubeVisual22Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];

  // Die Linie läuft wie die Zeit: normale Tage während der Regel, dann Hochsetzen, dann Aktion.
  const tag =
    HOCH_AB * interpolate(frame, [at(0) + 10, at(2) - 4], [0, 1], CLAMP) +
    (AKTION_AB - HOCH_AB) * p(frame, at(2), at(2) + 26) +
    (TAGE - AKTION_AB) * p(frame, at(3), at(3) + 14);
  const spitzePreis = preisLinks(tag);

  const achsen = p(frame, at(0), at(0) + 14);
  const fenster = p(frame, at(1), at(1) + 18);
  const hochLabel = p(frame, at(2) + 16, at(2) + 28);
  const schild = p(frame, at(3) + 6, at(3) + 22);
  const referenz = p(frame, at(4), at(4) + 20);
  const streichen = p(frame, at(4) + 22, at(4) + 32);
  const stempel = p(frame, at(4) + 28, at(4) + 38);
  const echt = p(frame, at(4) + 34, at(4) + 46);

  return (
    <DatenBuehne>
      <Quelle>Beispielpreise · Regel: § 11 Preisangabenverordnung, seit 28.05.2022</Quelle>

      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {/* 30-Tage-Fenster */}
        <rect x={xTag(0)} y={DIAGRAMM.unten - DIAGRAMM.hoehe} width={(xTag(TAGE) - xTag(0)) * fenster} height={DIAGRAMM.hoehe} fill={DATEN.blau} opacity={0.08} rx={10} />
        {/* Achsen */}
        <line x1={DIAGRAMM.links} y1={DIAGRAMM.unten} x2={DIAGRAMM.links + (DIAGRAMM.rechts - DIAGRAMM.links) * achsen} y2={DIAGRAMM.unten} stroke={DATEN.text} strokeWidth={3} />
        <line x1={DIAGRAMM.links} y1={DIAGRAMM.unten} x2={DIAGRAMM.links} y2={DIAGRAMM.unten - DIAGRAMM.hoehe * achsen} stroke={DATEN.text} strokeWidth={3} />
        {[NORMAL, HOCH].map((preis) => (
          <line key={preis} x1={DIAGRAMM.links} y1={yPreis(preis)} x2={DIAGRAMM.rechts} y2={yPreis(preis)} stroke={DATEN.linie} strokeWidth={2} strokeDasharray="6 10" opacity={achsen} />
        ))}
        {/* Preislinie */}
        {tag > 0 ? <path d={treppe(tag)} fill="none" stroke={DATEN.text} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" /> : null}
        {tag > 0 ? <circle cx={xTag(tag)} cy={yPreis(spitzePreis)} r={11} fill={DATEN.papier} stroke={DATEN.text} strokeWidth={6} /> : null}
        {/* Referenz: niedrigster Preis der letzten 30 Tage */}
        <line x1={xTag(0)} y1={yPreis(NIEDRIGSTER)} x2={xTag(0) + (xTag(TAGE) - xTag(0)) * referenz} y2={yPreis(NIEDRIGSTER)} stroke={DATEN.gruen} strokeWidth={6} strokeDasharray="16 10" opacity={referenz > 0 ? 1 : 0} />
        {/* Verbindung Schild → Aktionspreis */}
        <line x1={xTag(TAGE) + 18} y1={yPreis(NORMAL)} x2={SCHILD.links - 8} y2={yPreis(NORMAL)} stroke={DATEN.rot} strokeWidth={4} opacity={schild} strokeDasharray="4 8" />
      </svg>

      {/* Achsenbeschriftung */}
      {[NORMAL, HOCH].map((preis) => (
        <Text key={preis} x={DIAGRAMM.links - 18} y={yPreis(preis)} groesse={28} gewicht={700} farbe={DATEN.leise} ausrichtung="rechts" ab={at(0) + 4}>
          {euroText(preis, 2)}
        </Text>
      ))}
      <Text x={DIAGRAMM.links - 18} y={DIAGRAMM.unten} groesse={28} gewicht={700} farbe={DATEN.leise} ausrichtung="rechts" ab={at(0) + 4}>
        0 €
      </Text>
      <Text x={xTag(0)} y={DIAGRAMM.unten + 36} groesse={28} gewicht={700} farbe={DATEN.leise} ab={at(0) + 6}>
        vor 30 Tagen
      </Text>
      <Text x={xTag(TAGE)} y={DIAGRAMM.unten + 36} groesse={28} gewicht={700} farbe={DATEN.leise} ausrichtung="rechts" ab={at(0) + 6}>
        heute
      </Text>
      <Text x={(xTag(0) + xTag(TAGE)) / 2} y={DIAGRAMM.unten - DIAGRAMM.hoehe - 30} groesse={32} gewicht={800} farbe={DATEN.blau} ausrichtung="mitte" ab={at(1)}>
        letzte 30 Tage
      </Text>

      {/* Hochgesetzt */}
      <div style={{position: 'absolute', left: (xTag(HOCH_AB) + xTag(AKTION_AB)) / 2, top: yPreis(HOCH) - 40, transform: 'translate(-50%, -50%)', opacity: hochLabel, fontSize: 28, fontWeight: 800, color: DATEN.rot, whiteSpace: 'nowrap'}}>
        kurz hochgesetzt
      </div>

      {/* Referenz-Label */}
      <div style={{position: 'absolute', left: xTag(0) + 24, top: yPreis(NIEDRIGSTER) - 42, transform: 'translateY(-50%)', opacity: p(frame, at(4) + 10, at(4) + 22), fontSize: 30, fontWeight: 800, color: DATEN.gruen, whiteSpace: 'nowrap'}}>
        niedrigster Preis der letzten 30 Tage: {euroText(NIEDRIGSTER, 2)}
      </div>

      {/* Rabattschild */}
      <div
        style={{
          position: 'absolute',
          left: SCHILD.links,
          top: SCHILD.oben,
          width: SCHILD.breite,
          height: SCHILD.hoehe,
          borderRadius: 26,
          backgroundColor: DATEN.rot,
          color: DATEN.papier,
          opacity: schild,
          transform: `translateX(${((1 - schild) * 60).toFixed(1)}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <div style={{position: 'relative', fontSize: 112, fontWeight: 900, letterSpacing: -2, lineHeight: 1}}>
          −{WERBE_RABATT} %
          <div style={{position: 'absolute', left: -12, right: -12, top: '52%', height: 10, borderRadius: 5, backgroundColor: DATEN.text, transform: `scaleX(${streichen.toFixed(3)})`, transformOrigin: 'left center'}} />
        </div>
        <div style={{fontSize: 34, fontWeight: 700, textDecoration: 'line-through', opacity: 0.9}}>statt {euroText(HOCH, 2)}</div>
        <div style={{fontSize: 52, fontWeight: 900}}>{euroText(NORMAL, 2)}</div>
      </div>

      {/* Stempel „verboten“ */}
      <div
        style={{
          position: 'absolute',
          left: SCHILD.links + SCHILD.breite / 2,
          top: SCHILD.oben + SCHILD.hoehe + 92,
          transform: `translate(-50%, -50%) rotate(-6deg) scale(${(1.25 - 0.25 * stempel).toFixed(3)})`,
          opacity: stempel,
          padding: '8px 30px',
          border: `7px solid ${DATEN.rot}`,
          borderRadius: 16,
          backgroundColor: DATEN.papier,
          color: DATEN.rot,
          fontSize: 60,
          fontWeight: 900,
          letterSpacing: 1,
          whiteSpace: 'nowrap',
        }}
      >
        verboten
      </div>

      {/* Echter Rabatt */}
      <div style={{position: 'absolute', left: SCHILD.links + SCHILD.breite / 2, top: SCHILD.oben + SCHILD.hoehe + 200, transform: `translate(-50%, -50%) translateY(${((1 - echt) * 12).toFixed(1)}px)`, opacity: echt, fontSize: 40, fontWeight: 800, color: DATEN.gruen, whiteSpace: 'nowrap'}}>
        echter Rabatt: {ECHTER_RABATT} %
      </div>
    </DatenBuehne>
  );
};
