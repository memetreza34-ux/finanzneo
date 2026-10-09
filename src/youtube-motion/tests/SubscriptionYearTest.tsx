import React from 'react';
import {AbsoluteFill, Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {FONT} from '../../brand';
import {DATEN, Zaehlwerk, euroText, skala} from '../../design-system/daten';
import brief from '../../../tests/claude-motion/brief.json';

/**
 * Claude Motion Test 01 — Ein Abo: 9,99 € × 12 Monate = 119,88 €.
 *
 * ANIMATION_NARRATIVE
 * START: Eine echte Abbuchungskarte „Streaming-Abo −9,99 €“ im Januar.
 * MECHANISM: Die Karte schrumpft zum Chip auf dem Januar-Feld einer Monatsleiste
 *   und fällt in den Jahresbalken darunter. Jeden Monat fällt ein weiterer Chip
 *   unter seinem Monat in den Balken; der Zähler springt genau beim Landen.
 * RESULT: Die zwölf Chips verschmelzen zu einem Balken, eine Klammer zeichnet
 *   „12 Abbuchungen × 9,99 €“, der Zähler wird zur großen Jahressumme 119,88 €.
 *
 * EDITORIAL_VISUAL_NARRATIVE
 * HERO: der Jahresbalken aus zwölf gleich langen Abbuchungen (Länge = Betrag)
 * SUPPORT: Monatsleiste mit Abspielmarke, laufender Zähler
 * SURFACE: warmes Off-White, eine weiße Karte mit weichem Schatten
 * SHAPE_LANGUAGE: runde Chips, gerader Balken, gezeichnete Klammer
 *
 * Motion-Grammatik: SHIFT (Karte → Chip) · FOLLOW (Chip → Säule) · STACK · COUNT
 * · MERGE (Chips → Block) · DRAW (Klammer) · EMPHASIZE (Summe).
 * Keyframes: 10 % Karte · 35 % vier Monate gestapelt · 65 % neun Monate · 90 % Ergebnis.
 */

const MONAT_CENT = brief.monthly_cents;
const MONATE = brief.months;
const JAHR_CENT = brief.yearly_cents;
const euro = (cent: number) => euroText(cent / 100, 2);
const MONATSNAMEN = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

// ─── Layout (1920 × 1080) ────────────────────────────────────────────────────
const LEISTE = {links: 200, rechts: 1720, y: 300};
const FACH = (LEISTE.rechts - LEISTE.links) / MONATE;
const slotX = (m: number) => LEISTE.links + (m + 0.5) * FACH;
const SLOT_Y = 372;
const CHIP = {breite: 104, hoehe: 46};
// Jahresbalken direkt unter der Leiste: Länge exakt proportional zum Betrag.
const BALKEN = {links: LEISTE.links, y: 492, hoehe: 96};
const pxCent = skala(JAHR_CENT, LEISTE.rechts - LEISTE.links);
const SEGMENT = pxCent(MONAT_CENT);
const KARTE = {x: 960, y: 640, breite: 980, hoehe: 300};
const ZAEHLER = {x: 960, y: 700};
const SUMME_ZIEL = {x: 960, y: 760};

// ─── Takt (Frames) ───────────────────────────────────────────────────────────
const KARTE_MORPH = [42, 62] as const;
const auswurf = (m: number) => (m === 0 ? KARTE_MORPH[1] : 80 + (m - 1) * 16);
const fallStart = (m: number) => (m === 0 ? KARTE_MORPH[1] : auswurf(m) + 5);
const FALL = 16;
const landung = (m: number) => fallStart(m) + FALL;
const VERSCHMELZEN = [265, 285] as const;
const KLAMMER = [280, 304] as const;
const SUMME = [270, 308] as const;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = Easing.bezier(0.65, 0, 0.35, 1);
const raus = Easing.bezier(0.16, 1, 0.3, 1);
const fallen = Easing.bezier(0.55, 0, 0.75, 0.2);
const zwischen = (frame: number, [von, bis]: readonly [number, number], easing = weich) =>
  interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing});
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Abspielmarke: gleitet zum Monat, sobald dessen Chip ausgeworfen wird. */
const markeX = (frame: number) => {
  let x = slotX(0);
  for (let m = 1; m < MONATE; m++) x = mix(x, slotX(m), zwischen(frame, [auswurf(m) - 8, auswurf(m) + 2], raus));
  return x;
};

export const SubscriptionYearTest: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const dimmen = interpolate(frame, [VERSCHMELZEN[0], VERSCHMELZEN[1]], [1, 0.32], CLAMP);
  const kamera = interpolate(frame, [SUMME[0], SUMME[1]], [1, 1.03], {...CLAMP, easing: weich});
  const luecke = interpolate(frame, [VERSCHMELZEN[0], VERSCHMELZEN[1]], [6, 0], CLAMP);
  const chipText = interpolate(frame, [VERSCHMELZEN[0], VERSCHMELZEN[0] + 10], [1, 0], CLAMP);
  const block = interpolate(frame, [VERSCHMELZEN[1] - 6, VERSCHMELZEN[1]], [0, 1], CLAMP);
  const gelandet = Array.from({length: MONATE}, (_, m) => frame >= landung(m)).filter(Boolean).length;

  // Zähler: erscheint mit der ersten Landung (kein irreführender 0-Zustand) und
  // springt genau dann, wenn ein Chip im Jahresbalken ankommt.
  const summeT = zwischen(frame, SUMME);
  const zaehlerX = mix(ZAEHLER.x, SUMME_ZIEL.x, summeT);
  const zaehlerY = mix(ZAEHLER.y, SUMME_ZIEL.y, summeT);
  const zaehlerGroesse = mix(104, 176, summeT);
  const stationen = Array.from({length: MONATE - 1}, (_, i) => ({ab: landung(i + 1) - 4, wert: ((i + 2) * MONAT_CENT) / 100}));

  // ─── Karte → Chip (SHIFT) ──────────────────────────────────────────────────
  const karteRein = spring({frame, fps, config: {damping: 16, stiffness: 140}});
  const morph = zwischen(frame, KARTE_MORPH);
  const karteSichtbar = frame < KARTE_MORPH[1];
  // Der Karteninhalt schrumpft mit der Karte und blendet erst kurz vor dem Chip-Zustand über.
  const inhalt = interpolate(frame, [KARTE_MORPH[1] - 10, KARTE_MORPH[1] - 5], [1, 0], CLAMP);
  const inhaltSkala = mix(KARTE.breite, CHIP.breite, morph) / KARTE.breite;
  const chipLabelInKarte = interpolate(frame, [KARTE_MORPH[1] - 6, KARTE_MORPH[1]], [0, 1], CLAMP);
  const balkenGrund = interpolate(frame, [52, 66], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{backgroundColor: DATEN.grund, fontFamily: FONT.body, color: DATEN.text, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${kamera.toFixed(4)})`, transformOrigin: '50% 62%'}}>
        {/* Monatsleiste */}
        <div style={{opacity: dimmen}}>
          <div style={{position: 'absolute', left: LEISTE.links, top: LEISTE.y - 2, width: LEISTE.rechts - LEISTE.links, height: 4, borderRadius: 2, backgroundColor: DATEN.linie}} />
          <div style={{position: 'absolute', left: LEISTE.links, top: LEISTE.y - 2, width: Math.max(0, markeX(frame) - LEISTE.links), height: 4, borderRadius: 2, backgroundColor: DATEN.rot, opacity: frame >= KARTE_MORPH[1] ? 1 : 0}} />
          {MONATSNAMEN.map((name, m) => {
            const erledigt = frame >= auswurf(m);
            return (
              <React.Fragment key={name}>
                <div style={{position: 'absolute', left: slotX(m), top: LEISTE.y - 50, transform: 'translate(-50%, -50%)', fontSize: 30, fontWeight: erledigt ? 800 : 600, color: erledigt ? DATEN.text : DATEN.leise}}>
                  {name}
                </div>
                <div style={{position: 'absolute', left: slotX(m) - 8, top: LEISTE.y - 8, width: 16, height: 16, borderRadius: 8, backgroundColor: erledigt ? DATEN.rot : DATEN.grund, border: `3px solid ${erledigt ? DATEN.rot : DATEN.neutral}`, boxSizing: 'border-box'}} />
              </React.Fragment>
            );
          })}
          <div style={{position: 'absolute', left: markeX(frame) - 2, top: LEISTE.y - 26, width: 4, height: 52, borderRadius: 2, backgroundColor: DATEN.text}} />
        </div>

        {/* Leerer Jahresbalken als Rahmen: so lang wie 12 Abbuchungen */}
        <div style={{position: 'absolute', left: BALKEN.links - 6, top: BALKEN.y - BALKEN.hoehe / 2 - 6, width: SEGMENT * MONATE + 12, height: BALKEN.hoehe + 12, borderRadius: 16, border: `3px dashed ${DATEN.neutral}`, boxSizing: 'border-box', opacity: balkenGrund * interpolate(frame, [VERSCHMELZEN[0], VERSCHMELZEN[1]], [1, 0], CLAMP)}} />

        {/* Monats-Chips: Auswurf → Fall in den Balken (FOLLOW → STACK → MERGE) */}
        {Array.from({length: MONATE}, (_, m) => {
          if (frame < auswurf(m)) return null;
          const pop = m === 0 ? 1 : spring({frame: frame - auswurf(m), fps, config: {damping: 13, stiffness: 190}});
          const t = zwischen(frame, [fallStart(m), landung(m)], fallen);
          const breiteT = zwischen(frame, [fallStart(m), landung(m)], raus);
          const x = slotX(m);
          const y = mix(SLOT_Y, BALKEN.y, t);
          const breite = mix(CHIP.breite, SEGMENT - luecke, breiteT);
          const hoehe = mix(CHIP.hoehe, BALKEN.hoehe, breiteT);
          // Landen: kurzes Stauchen, dann steht der Chip.
          const stauch = frame >= landung(m) ? 1 - 0.08 * Math.max(0, 1 - (frame - landung(m)) / 6) : 1;
          return (
            <div
              key={m}
              style={{
                position: 'absolute',
                left: x - breite / 2,
                top: y - hoehe / 2,
                width: breite,
                height: hoehe,
                borderRadius: 12,
                backgroundColor: DATEN.rot,
                transform: `scale(${(0.5 + 0.5 * pop).toFixed(3)}, ${(stauch * (0.5 + 0.5 * pop)).toFixed(3)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: DATEN.papier,
                fontSize: 26,
                fontWeight: 800,
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{opacity: chipText}}>{euro(MONAT_CENT)}</span>
            </div>
          );
        })}
        {/* Verschmolzener Block ohne Nähte */}
        <div style={{position: 'absolute', left: BALKEN.links, top: BALKEN.y - BALKEN.hoehe / 2, width: SEGMENT * MONATE, height: BALKEN.hoehe, borderRadius: 14, backgroundColor: DATEN.rot, opacity: block}} />

        {/* Klammer „12 × 9,99 €“ (DRAW) */}
        <Klammer frame={frame} />

        {/* Laufender Zähler → Jahressumme (COUNT → EMPHASIZE) */}
        {frame >= landung(0) - 6 ? (
          <Zaehlwerk x={zaehlerX} y={zaehlerY} groesse={zaehlerGroesse} nachkomma={2} start={MONAT_CENT / 100} stationen={stationen} dauer={10} ab={landung(0) - 6} />
        ) : null}
        <div style={{position: 'absolute', left: ZAEHLER.x, top: ZAEHLER.y + 74, transform: 'translateX(-50%)', fontSize: 32, fontWeight: 700, color: DATEN.leise, whiteSpace: 'nowrap', opacity: interpolate(frame, [landung(0) - 6, landung(0) + 6, SUMME[0], SUMME[0] + 10], [0, 1, 1, 0], CLAMP)}}>
          bisher abgebucht · {gelandet} {gelandet === 1 ? 'Monat' : 'Monate'}
        </div>
        <div style={{position: 'absolute', left: SUMME_ZIEL.x, top: SUMME_ZIEL.y + 110, transform: `translate(-50%, ${((1 - zwischen(frame, [296, 314], raus)) * 16).toFixed(1)}px)`, opacity: zwischen(frame, [296, 314], raus), fontSize: 42, fontWeight: 700, color: DATEN.leise, whiteSpace: 'nowrap'}}>
          im Jahr — für ein einziges Abo
        </div>
      </AbsoluteFill>

      {/* Einstieg: echte Abbuchung (wird zum Januar-Chip) */}
      {karteSichtbar ? (
        <div
          style={{
            position: 'absolute',
            left: mix(KARTE.x, slotX(0), morph) - mix(KARTE.breite, CHIP.breite, morph) / 2,
            top: mix(KARTE.y, SLOT_Y, morph) - mix(KARTE.hoehe, CHIP.hoehe, morph) / 2,
            width: mix(KARTE.breite, CHIP.breite, morph),
            height: mix(KARTE.hoehe, CHIP.hoehe, morph),
            borderRadius: mix(28, 12, morph),
            backgroundColor: interpolateColors(morph, [0, 0.7, 1], [DATEN.papier, DATEN.papier, DATEN.rot]),
            boxShadow: `0 ${mix(22, 0, morph).toFixed(1)}px ${mix(50, 0, morph).toFixed(1)}px rgba(32, 42, 37, ${(0.13 * (1 - morph)).toFixed(3)})`,
            opacity: karteRein,
            transform: `scale(${(0.94 + 0.06 * karteRein).toFixed(4)})`,
            overflow: 'hidden',
          }}
        >
          <div style={{position: 'absolute', left: 0, top: 0, width: KARTE.breite, height: KARTE.hoehe, boxSizing: 'border-box', padding: '46px 60px', opacity: inhalt, transform: `scale(${inhaltSkala.toFixed(4)})`, transformOrigin: '0 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', whiteSpace: 'nowrap'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 32, fontWeight: 600, color: DATEN.leise}}>
              <span>Abbuchung · 1. Januar</span>
              <span>jeden Monat</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
              <span style={{fontSize: 70, fontWeight: 800, letterSpacing: -1}}>Streaming-Abo</span>
              <span style={{fontSize: 84, fontWeight: 800, color: DATEN.rot, fontVariantNumeric: 'tabular-nums'}}>{euroText(-MONAT_CENT / 100, 2)}</span>
            </div>
          </div>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: chipLabelInKarte, color: DATEN.papier, fontSize: 26, fontWeight: 800, whiteSpace: 'nowrap'}}>
            {euro(MONAT_CENT)}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Klammer: React.FC<{frame: number}> = ({frame}) => {
  const y = BALKEN.y + BALKEN.hoehe / 2 + 26;
  const links = BALKEN.links;
  const rechts = BALKEN.links + SEGMENT * MONATE;
  const mitte = (links + rechts) / 2;
  const pfad = `M ${links} ${y - 14} L ${links} ${y} L ${mitte - 14} ${y} L ${mitte} ${y + 14} L ${mitte + 14} ${y} L ${rechts} ${y} L ${rechts} ${y - 14}`;
  const zug = zwischen(frame, KLAMMER);
  const {strokeDasharray, strokeDashoffset} = evolvePath(zug, pfad);
  const text = zwischen(frame, [KLAMMER[1] - 10, KLAMMER[1] + 6], raus);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {zug > 0 ? <path d={pfad} fill="none" stroke={DATEN.text} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} /> : null}
      </svg>
      <div style={{position: 'absolute', left: mitte, top: y + 52, transform: `translate(-50%, -50%) translateY(${((1 - text) * 10).toFixed(1)}px)`, opacity: text, fontSize: 40, fontWeight: 800, color: DATEN.text, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
        {MONATE} Abbuchungen × {euro(MONAT_CENT)}
      </div>
    </>
  );
};
