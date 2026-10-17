import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {DATEN, DatenBuehne, Quelle, Zaehlwerk, euroText, skala} from '../../../../../../src/design-system/daten';

export const MECHANIC_ID = 'separate-installment-cards-merge-into-monthly-load';
export const VISUAL_TECHNIQUE_ID = 'three-rate-cards-bars-slide-into-one-stacked-month-bar-with-month-repeat';
export const COMPOSITION_FAMILY_ID = 'merge-stack';

/**
 * ANIMATION_NARRATIVE
 * START: Drei getrennte Ratenkarten erscheinen nacheinander — Fernseher 50 €, Handy 35 €, Kopfhörer 25 € —
 *   jede mit einem kurzen Balken auf gemeinsamer Skala.
 * MECHANISM: „Jede Rate allein wirkt harmlos“: die Karten stehen ruhig nebeneinander, Balken klein.
 *   Dann lösen sich die drei Balken aus ihren Karten und rutschen Ende an Ende zu einem Monatsbalken zusammen.
 * CONSEQUENCE: Der gemeinsame Balken ist so lang wie alle drei zusammen; das Zählwerk zählt 50 → 85 → 110 €.
 * RESULT: „110 € jeden Monat“; darunter leuchten 12 Monatsfelder nacheinander — die Last kommt jeden Monat wieder.
 *
 * EDITORIAL_VISUAL_NARRATIVE
 * HERO: zusammengeschobener Monatsbalken 110 €
 * SUPPORT: drei Ratenkarten, Zählwerk, Monatsreihe
 * SURFACE: helles Off-White, weiße Karten
 * SHAPE_LANGUAGE: flache Balken auf einer Skala (8 px pro Euro), Karten mit Icon
 */
export const ANIMATION_NARRATIVE = {
  START: 'Drei kleine Raten auf getrennten Karten',
  MECHANISM: 'Die drei Balken rutschen zu einem Monatsbalken zusammen, Zählwerk bis 110 €',
  RESULT: '110 € jeden Monat',
};

const RATEN = [
  {id: 'fernseher', label: 'Fernseher', wert: 50, farbe: DATEN.blau},
  {id: 'handy', label: 'Handy', wert: 35, farbe: DATEN.gruen},
  {id: 'kopfhoerer', label: 'Kopfhörer', wert: 25, farbe: DATEN.gold},
];
const SUMME = RATEN.reduce((acc, r) => acc + r.wert, 0); // 110 €
if (SUMME !== 110) throw new Error('50 € + 35 € + 25 € muss 110 € ergeben.');

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = Easing.bezier(0.33, 0, 0.2, 1);
const p = (frame: number, von: number, bis: number) => interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing: weich});

// beats: [„Fünfzig Euro für den Fernseher“, „Fünfunddreißig für das Handy“, „Fünfundzwanzig für die Kopfhörer“,
//         „Jede Rate allein“, „Zusammen sind es“, „Jeden Monat“]
const PREVIEW_BEATS = [0, 58, 105, 152, 210, 269];

// Gemeinsame Skala für Karten und Monatsbalken: 1 € = 8 px.
const px = skala(SUMME, 880);
const KARTE = {breite: 480, hoehe: 230, oben: DATEN.mitteY - 300, abstand: 60};
const kartenLinks = (i: number) => (1920 - 3 * KARTE.breite - 2 * KARTE.abstand) / 2 + i * (KARTE.breite + KARTE.abstand);
const BALKEN_H = 64;
const KARTE_BALKEN_Y = KARTE.oben + 150;
// Monatsbalken + Zählwerk rechts daneben bilden zusammen eine mittige Gruppe.
const MONAT = {links: (1920 - px(SUMME)) / 2 - 150, y: DATEN.mitteY + 110};
const MONATE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

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
    <svg width={42} height={40} viewBox="0 0 44 42">
      <path d="M6 26 V20 C6 11 13 4 22 4 C31 4 38 11 38 20 V26" {...s} />
      <rect x={3} y={24} width={9} height={15} rx={3} {...s} />
      <rect x={32} y={24} width={9} height={15} rx={3} {...s} />
    </svg>
  );
};

export const YouTubeVisual33Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];

  const harmlos = p(frame, at(3), at(3) + 14);
  const harmlosWeg = p(frame, at(4) - 2, at(4) + 8);
  // Zusammenrutschen: gestaffelt, Fernseher zuerst.
  const merge = (i: number) => p(frame, at(4) + i * 8, at(4) + i * 8 + 24);
  const monatsLabel = p(frame, at(4) + 30, at(4) + 42);
  const jeden = p(frame, at(5), at(5) + 12);
  // Monatsreihe steht ab „Zusammen sind es“ leer bereit und leuchtet zu „Jeden Monat“ zügig durch (fertig bei Beat + 11 Frames).
  const reihe = p(frame, at(4) + 36, at(4) + 48);
  const monatStart = (m: number) => at(5) - 6 + m;

  let sockel = 0;
  const ziele = RATEN.map((r) => {
    const x = MONAT.links + px(sockel);
    sockel += r.wert;
    return x;
  });
  const stationen = RATEN.map((r, i) => ({ab: at(4) + i * 8 + 18, wert: RATEN.slice(0, i + 1).reduce((acc, q) => acc + q.wert, 0)}));

  return (
    <DatenBuehne>
      <Quelle>Beispiel: drei Finanzierungen gleichzeitig</Quelle>

      {RATEN.map((rate, i) => {
        const auf = p(frame, at(i), at(i) + 14);
        const m = merge(i);
        const kx = kartenLinks(i);
        const balkenX = interpolate(m, [0, 1], [kx + 40, ziele[i]]);
        const balkenY = interpolate(m, [0, 1], [KARTE_BALKEN_Y, MONAT.y]);
        return (
          <React.Fragment key={rate.id}>
            {/* Karte: wird nach dem Zusammenrutschen zur leisen Erinnerung */}
            <div
              style={{
                position: 'absolute',
                left: kx,
                top: KARTE.oben,
                width: KARTE.breite,
                height: KARTE.hoehe,
                borderRadius: 22,
                backgroundColor: DATEN.papier,
                boxShadow: '0 14px 36px rgba(32, 42, 37, 0.08)',
                opacity: auf * (1 - 0.45 * merge(2)),
                transform: `translateY(${((1 - auf) * 20).toFixed(1)}px)`,
              }}
            >
              <div style={{position: 'absolute', left: 40, top: 32, display: 'flex', alignItems: 'center', gap: 16, fontSize: 38, fontWeight: 800, color: DATEN.text, whiteSpace: 'nowrap'}}>
                <Icon id={rate.id} farbe={DATEN.text} />
                {rate.label}
              </div>
              <div style={{position: 'absolute', right: 40, top: 30, fontSize: 44, fontWeight: 900, color: rate.farbe, whiteSpace: 'nowrap'}}>{euroText(rate.wert)}</div>
              {/* leere Spur, wo der Balken lag */}
              <div style={{position: 'absolute', left: 40, top: 150 - BALKEN_H / 2, width: px(rate.wert), height: BALKEN_H, borderRadius: 10, border: `3px dashed ${DATEN.linie}`, boxSizing: 'border-box', opacity: m}} />
            </div>

            {/* „wirkt harmlos“ unter jeder Karte, verschwindet beim Zusammenrutschen */}
            <div style={{position: 'absolute', left: kx + KARTE.breite / 2, top: KARTE.oben + KARTE.hoehe + 40, transform: `translate(-50%, -50%) translateY(${((1 - harmlos) * 10).toFixed(1)}px)`, opacity: harmlos * (1 - harmlosWeg), display: 'flex', alignItems: 'center', gap: 12, fontSize: 32, fontWeight: 700, color: DATEN.leise, whiteSpace: 'nowrap'}}>
              <svg width={30} height={30} viewBox="0 0 30 30">
                <path d="M6 15 L12 21 L24 8" fill="none" stroke={DATEN.gruen} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              wirkt harmlos
            </div>

            {/* Ratenbalken: Länge exakt aus dem Betrag, wandert in den Monatsbalken */}
            <div
              style={{
                position: 'absolute',
                left: balkenX,
                top: balkenY - BALKEN_H / 2 + (1 - auf) * 20,
                width: px(rate.wert) * p(frame, at(i) + 6, at(i) + 22) - (m > 0.98 && i < RATEN.length - 1 ? 4 : 0),
                height: BALKEN_H,
                borderRadius: 10,
                backgroundColor: rate.farbe,
                opacity: auf,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: rate.farbe === DATEN.gold ? DATEN.text : DATEN.papier,
                fontSize: 30,
                fontWeight: 800,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <span style={{opacity: m}}>{euroText(rate.wert)}</span>
            </div>
          </React.Fragment>
        );
      })}

      {/* Monatslast */}
      <div style={{position: 'absolute', left: MONAT.links, top: MONAT.y - BALKEN_H / 2 - 50, transform: 'translateY(-50%)', fontSize: 34, fontWeight: 700, color: DATEN.leise, opacity: monatsLabel, whiteSpace: 'nowrap'}}>
        zusammen
      </div>
      <Zaehlwerk x={MONAT.links + px(SUMME) + 36} y={MONAT.y} stationen={stationen} dauer={6} groesse={84} ausrichtung="links" farbe={DATEN.rot} ab={at(4) + 10} />
      <div style={{position: 'absolute', left: MONAT.links + px(SUMME) + 40, top: MONAT.y + 70, transform: `translateY(-50%) translateY(${((1 - jeden) * 12).toFixed(1)}px)`, fontSize: 40, fontWeight: 900, color: DATEN.rot, opacity: jeden, whiteSpace: 'nowrap'}}>
        jeden Monat
      </div>

      {/* 12 Monate: die gleiche Last kehrt jeden Monat wieder */}
      {MONATE.map((name, m) => {
        const an = p(frame, monatStart(m), monatStart(m) + 6);
        const breite = px(SUMME) / 12;
        return (
          <div
            key={name}
            style={{
              position: 'absolute',
              left: MONAT.links + m * breite + 4,
              top: MONAT.y + 92,
              width: breite - 8,
              height: 54,
              borderRadius: 10,
              backgroundColor: an > 0.5 ? DATEN.rot : DATEN.papier,
              border: `3px solid ${an > 0.5 ? DATEN.rot : DATEN.linie}`,
              boxSizing: 'border-box',
              color: an > 0.5 ? DATEN.papier : DATEN.leise,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 800,
              opacity: reihe,
            }}
          >
            {name}
          </div>
        );
      })}
    </DatenBuehne>
  );
};
