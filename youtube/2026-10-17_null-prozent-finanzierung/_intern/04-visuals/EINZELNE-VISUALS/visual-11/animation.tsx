import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {DATEN, DatenBuehne, Quelle, Text, Zaehlwerk, euroText, skala} from '../../../../../../src/design-system/daten';

export const MECHANIC_ID = 'installment-blocks-fill-price-tag-length';
export const VISUAL_TECHNIQUE_ID = 'twelve-rate-blocks-chain-under-price-bar-with-end-match';
export const COMPOSITION_FAMILY_ID = 'comparison';

/**
 * ANIMATION_NARRATIVE
 * START: Oben das Preisschild „Kaufpreis 600 €“ als Balken, darunter eine leere Ratenspur gleicher Skala.
 * MECHANISM: Zwölf Ratenblöcke à 50 € (Monat 1–12) setzen sich nacheinander in die Spur;
 *   die Summe zählt mit 50 € pro Block bis 600 €.
 * CONSEQUENCE: Die Ratenkette endet exakt am Ende des Preisschilds — Hilfslinien an beiden Enden.
 * RESULT: „600 € = Kaufpreis“ und „+ 0 € extra“ hinter dem Ende der Kette.
 *
 * EDITORIAL_VISUAL_NARRATIVE
 * HERO: Ratenkette gegen Preisbalken
 * SUPPORT: Zählwerk, Monatsnummern, End-Hilfslinien
 * SURFACE: helles Off-White, weiße Karten
 * SHAPE_LANGUAGE: flache Rechteckblöcke, gleiche Skala für Preis und Raten
 */
export const ANIMATION_NARRATIVE = {
  START: 'Preisschild 600 € und leere Ratenspur',
  MECHANISM: '12 Blöcke à 50 € füllen die Spur, Summe zählt mit',
  RESULT: '12 × 50 € = 600 € = Kaufpreis, 0 € extra',
};

const PREIS = 600;
const RATE = 50;
const ANZAHL = 12;
if (RATE * ANZAHL !== PREIS) throw new Error('12 × 50 € muss 600 € ergeben.');

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = Easing.bezier(0.33, 0, 0.2, 1);
const p = (frame: number, von: number, bis: number) => interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing: weich});

// beats: [„Du zahlst zwölf Raten“, „Zwölf mal fünfzig“, „Wenn sonst nichts dazukommt“, „Keinen Cent mehr“]
const PREVIEW_BEATS = [0, 94, 152, 257];

// Gemeinsame Skala: 600 € = 1200 px → 50 € = 100 px.
const SPUR = {links: 420, breite: 1200};
const px = skala(PREIS, SPUR.breite);
const BLOCK = px(RATE);
const PREIS_Y = DATEN.mitteY - 150;
const RATEN_Y = DATEN.mitteY + 10;
const HOEHE = 104;

export const YouTubeVisual11Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];

  const preis = p(frame, at(0), at(0) + 16);
  // Blöcke verteilen sich gleichmäßig zwischen Beat 0 und kurz nach Beat 1.
  const bauStart = at(0) + 14;
  const bauEnde = Math.max(bauStart + ANZAHL * 4, at(1) + 22);
  const takt = (bauEnde - bauStart) / ANZAHL;
  const blockStart = (i: number) => bauStart + i * takt;
  const blockP = (i: number) => p(frame, blockStart(i), blockStart(i) + 14);
  const stationen = Array.from({length: ANZAHL}, (_, i) => ({ab: blockStart(i) + 4, wert: RATE * (i + 1)}));

  const formel = p(frame, at(1), at(1) + 14);
  const passt = p(frame, at(2), at(2) + 16);
  const extra = p(frame, at(3), at(3) + 12);

  const gruenRand = passt > 0.5 ? DATEN.gruen : DATEN.text;
  const rechts = SPUR.links + SPUR.breite;

  return (
    <DatenBuehne>
      <Quelle>Beispiel: Fernseher für 600 €, 12 Raten à 50 €, keine Zusatzkosten</Quelle>

      {/* Zeilenbeschriftungen */}
      <Text x={DATEN.rand} y={PREIS_Y} groesse={36} gewicht={800} ab={at(0)}>
        Kaufpreis
      </Text>
      <Text x={DATEN.rand} y={RATEN_Y} groesse={36} gewicht={800} ab={at(0) + 6}>
        12 Raten
      </Text>
      <Text x={DATEN.rand} y={RATEN_Y + HOEHE / 2 + 34} groesse={DATEN.minText} gewicht={600} farbe={DATEN.leise} ab={at(0) + 10}>
        Monat
      </Text>

      {/* Preisbalken */}
      <div
        style={{
          position: 'absolute',
          left: SPUR.links,
          top: PREIS_Y - HOEHE / 2,
          width: SPUR.breite * preis,
          height: HOEHE,
          borderRadius: 14,
          backgroundColor: DATEN.papier,
          border: `4px solid ${gruenRand}`,
          boxSizing: 'border-box',
          boxShadow: '0 12px 30px rgba(32, 42, 37, 0.08)',
        }}
      />
      <div style={{position: 'absolute', left: SPUR.links + 36, top: PREIS_Y, transform: 'translateY(-50%)', fontSize: 52, fontWeight: 800, opacity: preis, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 22}}>
        <svg width={58} height={46} viewBox="0 0 58 46">
          <rect x={3} y={3} width={52} height={32} rx={4} fill="none" stroke={DATEN.text} strokeWidth={4} />
          <line x1={20} y1={43} x2={38} y2={43} stroke={DATEN.text} strokeWidth={4} strokeLinecap="round" />
        </svg>
        {euroText(PREIS)}
      </div>

      {/* leere Ratenspur */}
      <div
        style={{
          position: 'absolute',
          left: SPUR.links,
          top: RATEN_Y - HOEHE / 2,
          width: SPUR.breite,
          height: HOEHE,
          borderRadius: 14,
          border: `3px dashed ${DATEN.neutral}`,
          boxSizing: 'border-box',
          opacity: preis,
        }}
      />

      {/* Ratenblöcke à 50 €: Breite exakt px(50) inkl. 6 px Fuge */}
      {Array.from({length: ANZAHL}, (_, i) => {
        const b = blockP(i);
        const x = SPUR.links + i * BLOCK;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: x + 3,
                top: RATEN_Y - HOEHE / 2,
                width: BLOCK - 6,
                height: HOEHE,
                borderRadius: 10,
                backgroundColor: passt > 0.5 ? DATEN.gruen : DATEN.blau,
                opacity: b,
                transform: `translateY(${((1 - b) * -70).toFixed(1)}px)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: DATEN.papier,
                fontSize: 32,
                fontWeight: 800,
                whiteSpace: 'nowrap',
              }}
            >
              {euroText(RATE)}
            </div>
            <div style={{position: 'absolute', left: x + BLOCK / 2, top: RATEN_Y + HOEHE / 2 + 34, transform: 'translate(-50%, -50%)', fontSize: DATEN.minText, fontWeight: 700, color: DATEN.leise, opacity: b}}>
              {i + 1}
            </div>
          </React.Fragment>
        );
      })}

      {/* End-Hilfslinien: Preis und Raten enden an derselben Stelle */}
      {[SPUR.links, rechts].map((x) => (
        <div key={x} style={{position: 'absolute', left: x - 2, top: PREIS_Y - HOEHE / 2 - 20, width: 0, height: (RATEN_Y - PREIS_Y + HOEHE + 40) * passt, borderLeft: `4px dashed ${DATEN.gruen}`}} />
      ))}

      {/* Summe + Formel */}
      <Text x={SPUR.links} y={RATEN_Y + 190} groesse={34} gewicht={700} farbe={DATEN.leise} ab={bauStart}>
        Summe der Raten
      </Text>
      <Zaehlwerk x={SPUR.links + 330} y={RATEN_Y + 190} stationen={stationen} dauer={5} groesse={72} ausrichtung="links" farbe={passt > 0.5 ? DATEN.gruen : DATEN.text} ab={bauStart} />
      <div style={{position: 'absolute', left: SPUR.links + 620, top: RATEN_Y + 190, transform: `translateY(-50%) translateY(${((1 - formel) * 12).toFixed(1)}px)`, opacity: formel, fontSize: 40, fontWeight: 700, color: DATEN.leise, whiteSpace: 'nowrap'}}>
        = 12 × {euroText(RATE)}
      </div>
      <div style={{position: 'absolute', left: SPUR.links + 880, top: RATEN_Y + 190, transform: `translateY(-50%) translateY(${((1 - passt) * 12).toFixed(1)}px)`, opacity: passt, fontSize: 44, fontWeight: 900, color: DATEN.gruen, whiteSpace: 'nowrap'}}>
        = Kaufpreis
      </div>

      {/* 0 € extra hinter dem Ende der Kette */}
      <div
        style={{
          position: 'absolute',
          left: rechts + 34,
          top: PREIS_Y + (RATEN_Y - PREIS_Y) / 2,
          transform: `translateY(-50%) translateX(${((1 - extra) * 16).toFixed(1)}px)`,
          opacity: extra,
          fontSize: 48,
          fontWeight: 900,
          color: DATEN.gruen,
          lineHeight: 1.05,
          whiteSpace: 'nowrap',
        }}
      >
        0 €
        <div style={{fontSize: 32, fontWeight: 800}}>extra</div>
      </div>
    </DatenBuehne>
  );
};
