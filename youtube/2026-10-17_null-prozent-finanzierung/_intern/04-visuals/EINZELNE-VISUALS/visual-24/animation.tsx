import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {DATEN, DatenBuehne, Quelle} from '../../../../../../src/design-system/daten';

export const MECHANIC_ID = 'purchase-reveals-credit-line-later-purchases-turn-costly';
export const VISUAL_TECHNIQUE_ID = 'single-purchase-block-unfolds-into-credit-frame-segments-recolor';
export const COMPOSITION_FAMILY_ID = 'credit-line-frame';

/**
 * ANIMATION_NARRATIVE
 * START: Ein einzelner Kauf „Fernseher“ als Block in der Bildmitte — scheinbar nur ein Kredit für ein Gerät.
 * MECHANISM: Um den Block legt sich ein Rahmen, der sich zu einem viel größeren leeren Rahmen aufzieht:
 *   der Kreditrahmen. Der Fernseher-Teil wird grün und bekommt „0 %“.
 * CONSEQUENCE: Weitere Käufe („Handy“, „Konsole“) füllen den Rahmen und färben sich rot mit „Zinsen“;
 *   der freie Rest trägt „jeder weitere Kauf: Zinsen“.
 * RESULT: 0 % nur für den Fernseher, alles danach rot — Hinweis „Zinsen oft höher als beim Dispo“.
 *
 * Keine Beträge, keine Zinssätze (die 15,9 % kommen im nächsten Bild). Segmentbreiten sind
 * ausdrücklich keine Euro-Werte; der Rahmen hat bewusst keine Skala.
 *
 * EDITORIAL_VISUAL_NARRATIVE
 * HERO: großer Kreditrahmen mit Kaufsegmenten
 * SUPPORT: 0-%-Marke, Zinsen-Marken, Dispo-Hinweis
 * SURFACE: helles Off-White, weiße Karte
 * SHAPE_LANGUAGE: ein langer Rahmen, flache Segmente, kleine Etiketten
 */
export const ANIMATION_NARRATIVE = {
  START: 'Ein Kauf: Fernseher',
  MECHANISM: 'Kauf entpuppt sich als Teil eines großen Kreditrahmens; spätere Käufe färben sich rot',
  RESULT: '0 % nur für den Fernseher, alles danach kostet Zinsen — oft mehr als der Dispo',
};

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = Easing.bezier(0.33, 0, 0.2, 1);
const p = (frame: number, von: number, bis: number) => interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing: weich});
/** Farbmischung zweier Hex-Farben; Ergebnis wieder als Hex, damit es erneut gemischt werden kann. */
const mischen = (a: string, b: string, t: number) => {
  const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [rgb(a), rgb(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
};

// beats: [„Das heißt“, „Geld für den Fernseher“, „ganzen Kreditrahmen“, „Die null Prozent gelten“,
//         „Alles, was du danach“, „kostet Zinsen“, „Oft sogar mehr“]
const PREVIEW_BEATS = [0, 70, 152, 175, 292, 386, 409];

const RAHMEN = {links: 240, breite: 1440, hoehe: 170, y: DATEN.mitteY - 40};
// Segmentbreiten: rein schematisch (keine Euro-Werte), Fernseher größter Einzelkauf.
const SEGMENTE = [
  {id: 'fernseher', label: 'Fernseher', breite: 400},
  {id: 'handy', label: 'Handy', breite: 240},
  {id: 'konsole', label: 'Konsole', breite: 270},
];
const FUGE = 8;

const Icon: React.FC<{id: string; farbe: string}> = ({id, farbe}) => {
  const s = {fill: 'none', stroke: farbe, strokeWidth: 4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  if (id === 'fernseher') {
    return (
      <svg width={44} height={36} viewBox="0 0 58 46">
        <rect x={3} y={3} width={52} height={32} rx={4} {...s} />
        <line x1={20} y1={43} x2={38} y2={43} {...s} />
      </svg>
    );
  }
  if (id === 'handy') {
    return (
      <svg width={28} height={40} viewBox="0 0 28 44">
        <rect x={3} y={3} width={22} height={38} rx={5} {...s} />
        <line x1={11} y1={34} x2={17} y2={34} {...s} />
      </svg>
    );
  }
  return (
    <svg width={48} height={34} viewBox="0 0 56 38">
      <path d="M14 4 H42 C50 4 54 12 54 22 C54 32 48 35 44 33 L38 27 H18 L12 33 C8 35 2 32 2 22 C2 12 6 4 14 4 Z" {...s} />
      <line x1={14} y1={14} x2={14} y2={22} {...s} />
      <line x1={10} y1={18} x2={18} y2={18} {...s} />
      <circle cx={40} cy={16} r={1.5} {...s} />
      <circle cx={44} cy={20} r={1.5} {...s} />
    </svg>
  );
};

const Marke: React.FC<{x: number; y: number; text: string; farbe: string; sichtbar: number}> = ({x, y, text, farbe, sichtbar}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%, -50%) translateY(${((1 - sichtbar) * 12).toFixed(1)}px)`,
      opacity: sichtbar,
      padding: '6px 18px',
      borderRadius: 10,
      backgroundColor: farbe,
      color: DATEN.papier,
      fontSize: 34,
      fontWeight: 900,
      whiteSpace: 'nowrap',
    }}
  >
    {text}
  </div>
);

export const YouTubeVisual24Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];

  const kaufAuf = p(frame, at(0), at(0) + 14);
  const kaufFuellen = p(frame, at(1), at(1) + 18);
  const rahmen = p(frame, at(2), at(2) + 30);
  const nullProzent = p(frame, at(3), at(3) + 16);
  const handy = p(frame, at(4), at(4) + 18);
  const konsole = p(frame, at(4) + 26, at(4) + 44);
  const zinsen = p(frame, at(5), at(5) + 16);
  const dispo = p(frame, at(6), at(6) + 16);

  // Fernseher-Block: beginnt mittig, rutscht beim Aufziehen des Rahmens an den linken Rand.
  const fernseher = SEGMENTE[0];
  const startX = 960 - fernseher.breite / 2;
  const zielX = RAHMEN.links + FUGE;
  const fernseherX = interpolate(rahmen, [0, 1], [startX, zielX]);
  const fernseherFarbe = mischen(mischen(DATEN.leise, DATEN.blau, kaufFuellen), DATEN.gruen, nullProzent);

  const oben = RAHMEN.y - RAHMEN.hoehe / 2;
  const innenH = RAHMEN.hoehe - 2 * FUGE;
  const xHandy = zielX + fernseher.breite + FUGE;
  const xKonsole = xHandy + SEGMENTE[1].breite + FUGE;
  const xRest = xKonsole + SEGMENTE[2].breite + FUGE;
  const rechts = RAHMEN.links + RAHMEN.breite;
  // Der Rahmen umschließt zuerst nur den Fernseher und zieht sich dann nach links und rechts auf.
  const rahmenLinks = interpolate(rahmen, [0, 1], [startX - FUGE, RAHMEN.links]);
  const rahmenRechts = interpolate(rahmen, [0, 1], [startX + fernseher.breite + FUGE, rechts]);

  const spaeterFarbe = mischen(DATEN.leise, DATEN.rot, zinsen);

  const segmentStil = (x: number, breite: number, farbe: string, sichtbar: number): React.CSSProperties => ({
    position: 'absolute',
    left: x,
    top: oben + FUGE,
    width: breite * sichtbar,
    height: innenH,
    borderRadius: 12,
    backgroundColor: farbe,
    opacity: sichtbar > 0 ? 1 : 0,
    overflow: 'hidden',
  });

  const inhalt = (id: string, label: string, sichtbar: number) => (
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, color: DATEN.papier, fontSize: 38, fontWeight: 800, whiteSpace: 'nowrap', opacity: sichtbar}}>
      <Icon id={id} farbe={DATEN.papier} />
      {label}
    </div>
  );

  return (
    <DatenBuehne>
      <Quelle>Schema: Null-Prozent-Kauf mit gekoppeltem Kreditrahmen</Quelle>

      {/* Kreditrahmen: zeichnet sich vom Fernseher aus nach rechts */}
      <div
        style={{
          position: 'absolute',
          left: rahmenLinks,
          top: oben,
          width: rahmenRechts - rahmenLinks,
          height: RAHMEN.hoehe,
          borderRadius: 20,
          border: `4px solid ${DATEN.text}`,
          backgroundColor: DATEN.papier,
          boxSizing: 'border-box',
          opacity: rahmen > 0 ? 1 : 0,
          boxShadow: '0 14px 36px rgba(32, 42, 37, 0.08)',
        }}
      />
      <div style={{position: 'absolute', left: RAHMEN.links + RAHMEN.breite, top: oben - 54, transform: 'translate(-100%, -50%)', fontSize: 40, fontWeight: 800, opacity: p(frame, at(2) + 22, at(2) + 36), whiteSpace: 'nowrap'}}>
        Kreditrahmen
      </div>

      {/* Fernseher */}
      <div style={{...segmentStil(fernseherX, fernseher.breite, fernseherFarbe, kaufAuf)}}>{inhalt(fernseher.id, fernseher.label, kaufAuf)}</div>
      <Marke x={zielX + fernseher.breite / 2} y={oben - 54} text="0 %" farbe={DATEN.gruen} sichtbar={nullProzent} />
      <div style={{position: 'absolute', left: zielX + fernseher.breite / 2, top: oben + RAHMEN.hoehe + 44, transform: 'translate(-50%, -50%)', fontSize: 30, fontWeight: 700, color: DATEN.gruen, opacity: nullProzent, whiteSpace: 'nowrap'}}>
        nur dieser Kauf
      </div>

      {/* spätere Käufe */}
      <div style={segmentStil(xHandy, SEGMENTE[1].breite, spaeterFarbe, handy)}>{inhalt(SEGMENTE[1].id, SEGMENTE[1].label, p(frame, at(4) + 8, at(4) + 18))}</div>
      <div style={segmentStil(xKonsole, SEGMENTE[2].breite, spaeterFarbe, konsole)}>{inhalt(SEGMENTE[2].id, SEGMENTE[2].label, p(frame, at(4) + 34, at(4) + 44))}</div>
      <Marke x={xHandy + SEGMENTE[1].breite / 2} y={oben - 54} text="Zinsen" farbe={DATEN.rot} sichtbar={zinsen} />
      <Marke x={xKonsole + SEGMENTE[2].breite / 2} y={oben - 54} text="Zinsen" farbe={DATEN.rot} sichtbar={p(frame, at(5) + 6, at(5) + 22)} />

      {/* freier Rest: jeder weitere Kauf kostet ebenfalls Zinsen */}
      <div
        style={{
          position: 'absolute',
          left: xRest,
          top: oben + FUGE,
          width: rechts - FUGE - xRest,
          height: innenH,
          borderRadius: 12,
          border: `3px dashed ${DATEN.rot}`,
          boxSizing: 'border-box',
          opacity: p(frame, at(5) + 12, at(5) + 28),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: DATEN.rot,
          fontSize: 32,
          fontWeight: 800,
          whiteSpace: 'nowrap',
        }}
      >
        jeder weitere Kauf: Zinsen
      </div>

      {/* Dispo-Hinweis unter den roten Käufen */}
      <div
        style={{
          position: 'absolute',
          left: xHandy,
          top: oben + RAHMEN.hoehe + 100,
          transform: `translateY(${((1 - dispo) * 16).toFixed(1)}px)`,
          opacity: dispo,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '20px 30px',
          borderRadius: 16,
          backgroundColor: DATEN.papier,
          borderLeft: `8px solid ${DATEN.rot}`,
          boxShadow: '0 12px 30px rgba(32, 42, 37, 0.10)',
          whiteSpace: 'nowrap',
        }}
      >
        <svg width={40} height={40} viewBox="0 0 40 40">
          <path d="M20 34 V8 M9 18 L20 7 L31 18" fill="none" stroke={DATEN.rot} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{fontSize: 44, fontWeight: 800, color: DATEN.text}}>Zinsen oft höher als beim Dispo</span>
      </div>
    </DatenBuehne>
  );
};
