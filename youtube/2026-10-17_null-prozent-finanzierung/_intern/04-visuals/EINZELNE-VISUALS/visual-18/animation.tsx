import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {DATEN, DatenBuehne, Quelle, Text, Zaehlwerk, euroText, skala} from '../../../../../../src/design-system/daten';

export const MECHANIC_ID = 'monthly-addon-slices-stack-onto-finished-price';
export const VISUAL_TECHNIQUE_ID = 'insurance-ticket-month-ticks-drop-slices-on-price-column';
export const COMPOSITION_FAMILY_ID = 'stacked-surcharge';

/**
 * ANIMATION_NARRATIVE
 * START: Der fertige Kaufpreis steht als Säule 600 € — nichts wird mehr aufgebaut.
 * MECHANISM: Rechts ein Vertragszettel „Versicherung 8 € pro Monat“ mit 12 Monatsfeldern.
 *   Jeder abgehakte Monat schiebt eine 8-€-Scheibe in Orange oben auf die Preissäule.
 * CONSEQUENCE: Der Aufschlag wächst Monat für Monat; der Zähler am Zettel läuft 8 € → 96 €.
 * RESULT: Säule 600 € + 96 € Versicherung = 696 € gesamt; Klammer „+96 €“ am Aufschlag.
 *
 * EDITORIAL_VISUAL_NARRATIVE
 * HERO: Preissäule mit orangem Aufschlag
 * SUPPORT: Versicherungszettel mit Monatsfeldern, Zählwerke
 * SURFACE: helles Off-White, weiße Karte
 * SHAPE_LANGUAGE: flache Säule, dünne gleich hohe Scheiben, Klammer
 */
export const ANIMATION_NARRATIVE = {
  START: 'Fertiger Kaufpreis 600 € als Säule',
  MECHANISM: '12 Monate × 8 € Versicherung legen sich als Scheiben oben auf den Preis',
  RESULT: '600 € + 96 € = 696 €',
};

const PREIS = 600;
const MONATLICH = 8;
const MONATE = 12;
const EXTRA = MONATLICH * MONATE; // 96 €
const GESAMT = PREIS + EXTRA; // 696 €
if (EXTRA !== 96 || GESAMT !== 696) throw new Error('Annahme muss 96 € bzw. 696 € ergeben.');

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = Easing.bezier(0.33, 0, 0.2, 1);
const p = (frame: number, von: number, bis: number) => interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing: weich});

// beats: [„Das klingt vernünftig“, „Nehmen wir an“, „acht Euro im Monat“, „Nach zwölf Monaten“, „Aus sechshundert werden“]
const PREVIEW_BEATS = [0, 70, 140, 187, 269];

// Skala ab 0 €: 696 € = 620 px → 8 € = 7,13 px, 600 € = 534,5 px.
const BASIS_Y = DATEN.mitteY + 360;
const px = skala(GESAMT, 620);
const SAEULE = {x: 600, breite: 280};
const ZETTEL = {links: 1040, oben: DATEN.mitteY - 190, breite: 560, hoehe: 330};
const FELD = {groesse: 64, abstand: 14, spalten: 6};

export const YouTubeVisual18Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];

  const saeule = p(frame, at(0), at(0) + 22);
  const zettel = p(frame, at(1), at(1) + 16);

  // Monat 1 bei „acht Euro im Monat“, Monate 2–12 ab „Nach zwölf Monaten“ zügig hintereinander.
  const monatStart = (i: number) => (i === 0 ? at(2) + 6 : at(3) + 4 + (i - 1) * 4);
  const monatP = (i: number) => p(frame, monatStart(i), monatStart(i) + 12);
  const stationen = Array.from({length: MONATE}, (_, i) => ({ab: monatStart(i) + 2, wert: MONATLICH * (i + 1)}));
  const gesamt = p(frame, at(4), at(4) + 8);
  const klammer = p(frame, at(4) + 4, at(4) + 20);

  const hPreis = px(PREIS) * saeule;
  const yPreisOben = BASIS_Y - px(PREIS);
  const links = SAEULE.x - SAEULE.breite / 2;

  return (
    <DatenBuehne>
      <Quelle>Annahme: Ratenschutzversicherung 8 € pro Monat, 12 Monate</Quelle>

      {/* Grundlinie */}
      <div style={{position: 'absolute', left: links - 120, width: SAEULE.breite + 240, top: BASIS_Y, height: 3, backgroundColor: DATEN.neutral}} />

      {/* Kaufpreis-Säule */}
      <div style={{position: 'absolute', left: links, width: SAEULE.breite, top: BASIS_Y - hPreis, height: hPreis, backgroundColor: DATEN.blau, borderRadius: '10px 10px 0 0', opacity: saeule > 0 ? 1 : 0}} />
      <div style={{position: 'absolute', left: SAEULE.x, top: BASIS_Y - px(PREIS) / 2, transform: 'translate(-50%, -50%)', textAlign: 'center', color: DATEN.papier, opacity: p(frame, at(0) + 12, at(0) + 24), whiteSpace: 'nowrap'}}>
        <div style={{fontSize: 30, fontWeight: 700}}>Kaufpreis</div>
        <div style={{fontSize: 56, fontWeight: 800}}>{euroText(PREIS)}</div>
      </div>

      {/* Versicherungsscheiben à 8 €: exakt px(8) hoch, 1,5 px Fuge */}
      {Array.from({length: MONATE}, (_, i) => {
        const m = monatP(i);
        const unten = yPreisOben - px(MONATLICH * i);
        const h = px(MONATLICH);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: links,
              width: SAEULE.breite,
              top: unten - h + 1.5,
              height: h - 1.5,
              backgroundColor: DATEN.orange,
              borderRadius: i === MONATE - 1 ? '6px 6px 0 0' : 0,
              opacity: m,
              transform: `translate(${((1 - m) * 160).toFixed(1)}px, ${((1 - m) * -60).toFixed(1)}px)`,
            }}
          />
        );
      })}

      {/* Klammer + Beschriftung am Aufschlag */}
      <div style={{position: 'absolute', left: links + SAEULE.breite + 18, top: BASIS_Y - px(GESAMT), width: 16, height: px(EXTRA), borderTop: `3px solid ${DATEN.orange}`, borderRight: `3px solid ${DATEN.orange}`, borderBottom: `3px solid ${DATEN.orange}`, boxSizing: 'border-box', opacity: klammer}} />
      <Text x={links + SAEULE.breite + 50} y={BASIS_Y - px(GESAMT) + px(EXTRA) / 2} groesse={40} gewicht={900} farbe={DATEN.orange} ab={at(4) + 6}>
        +{euroText(EXTRA)}
      </Text>

      {/* Gesamtpreis über der Säule */}
      <div style={{position: 'absolute', left: SAEULE.x, top: BASIS_Y - px(GESAMT) - 70, transform: 'translate(-50%, -50%)', opacity: gesamt, display: 'flex', alignItems: 'baseline', gap: 18, whiteSpace: 'nowrap'}}>
        <span style={{fontSize: 32, fontWeight: 700, color: DATEN.leise}}>gesamt</span>
      </div>
      <Zaehlwerk x={SAEULE.x + 70} y={BASIS_Y - px(GESAMT) - 70} stationen={[{ab: at(4), wert: GESAMT}]} start={PREIS} dauer={20} groesse={64} ausrichtung="links" farbe={DATEN.text} ab={at(4)} />

      {/* Versicherungszettel */}
      <div
        style={{
          position: 'absolute',
          left: ZETTEL.links,
          top: ZETTEL.oben,
          width: ZETTEL.breite,
          height: ZETTEL.hoehe,
          borderRadius: 22,
          backgroundColor: DATEN.papier,
          boxShadow: '0 14px 36px rgba(32, 42, 37, 0.10)',
          borderTop: `8px solid ${DATEN.orange}`,
          boxSizing: 'border-box',
          opacity: zettel,
          transform: `translateY(${((1 - zettel) * 20).toFixed(1)}px)`,
        }}
      >
        <div style={{position: 'absolute', left: 36, top: 28, fontSize: 40, fontWeight: 800, color: DATEN.text}}>Versicherung</div>
        <div style={{position: 'absolute', left: 36, top: 82, fontSize: 32, fontWeight: 700, color: DATEN.orange, opacity: p(frame, at(2), at(2) + 12)}}>
          {euroText(MONATLICH)} pro Monat
        </div>
        {Array.from({length: MONATE}, (_, i) => {
          const m = monatP(i);
          const spalte = i % FELD.spalten;
          const zeile = Math.floor(i / FELD.spalten);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 36 + spalte * (FELD.groesse + FELD.abstand),
                top: 146 + zeile * (FELD.groesse + FELD.abstand),
                width: FELD.groesse,
                height: FELD.groesse,
                borderRadius: 12,
                border: `3px solid ${m > 0.5 ? DATEN.orange : DATEN.linie}`,
                backgroundColor: m > 0.5 ? DATEN.orange : DATEN.papier,
                color: m > 0.5 ? DATEN.papier : DATEN.leise,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 800,
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
      <Text x={ZETTEL.links} y={ZETTEL.oben + ZETTEL.hoehe + 70} groesse={32} gewicht={700} farbe={DATEN.leise} ab={at(2) + 6}>
        Versicherung bisher
      </Text>
      <Zaehlwerk x={ZETTEL.links + 330} y={ZETTEL.oben + ZETTEL.hoehe + 70} stationen={stationen} dauer={6} groesse={60} ausrichtung="links" farbe={DATEN.orange} ab={at(2) + 6} />
    </DatenBuehne>
  );
};
