import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {DATEN, DatenBuehne, Quelle, Text, Zaehlwerk, euroText, skala, zahlText} from '../../../../../../src/design-system/daten';

export const MECHANIC_ID = 'shrinking-bar-price-rise-normalize-100g';
export const VISUAL_TECHNIQUE_ID = 'chocolate-grid-column-removal-with-per-100g-bars';
export const COMPOSITION_FAMILY_ID = 'shrinkflation-normalization';

/**
 * ANIMATION_NARRATIVE
 * START: Tafel „Milka Alpenmilch“ aus 10 gleichen Spalten (je 10 g) = 100 g, Preisschild 1,49 €.
 * MECHANISM: Eine Spalte schrumpft weg (100 g → 90 g, Lücke bleibt gestrichelt sichtbar);
 *   danach zählt der Preis von 1,49 € auf 1,99 €.
 * CONSEQUENCE: Umrechnung auf 100 g (1,99 € : 90 g × 100 g = 2,21 €); die Tafel rückt nach oben,
 *   zwei wertgenaue Balken „Preis pro 100 g“ erscheinen: vorher 1,49 €, jetzt 2,21 €.
 * RESULT: Der Mehrpreis ist rot abgesetzt: „+48 %“ versteckte Preiserhöhung.
 *
 * Markenname nur als Text, kein Logo. Quelle: Verbraucherzentrale Hamburg (siehe data-notes.md).
 */
export const ANIMATION_NARRATIVE = {
  START: 'Tafel 100 g für 1,49 €',
  MECHANISM: 'Tafel schrumpft auf 90 g, Preis steigt auf 1,99 €, Umrechnung auf 100 g',
  RESULT: 'Pro 100 g: 1,49 € → 2,21 € = +48 % versteckte Preiserhöhung',
};

const GRAMM_VORHER = 100;
const GRAMM_JETZT = 90;
const PREIS_VORHER = 1.49;
const PREIS_JETZT = 1.99;
const PRO100_VORHER = (PREIS_VORHER / GRAMM_VORHER) * 100; // 1,49
const PRO100_JETZT = (PREIS_JETZT / GRAMM_JETZT) * 100; // 2,2111…
const PLUS_PROZENT = (PRO100_JETZT / PRO100_VORHER - 1) * 100; // 48,4 …
if (Math.round(PRO100_JETZT * 100) !== 221 || Math.floor(PLUS_PROZENT) !== 48) throw new Error('Mogelpackungs-Rechnung stimmt nicht.');

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = Easing.bezier(0.33, 0, 0.2, 1);
const p = (frame: number, von: number, bis: number) => interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing: weich});

// beats: [„Das bekannteste Beispiel“, „Die Tafel ist“, „Und der Preis ist“, „Rechnet man das“, „versteckte Preiserhöhung“]
const PREVIEW_BEATS = [0, 79, 193, 366, 504];

const SPALTEN = 10; // 10 Spalten à 10 g
const GRAMM_PRO_SPALTE = GRAMM_VORHER / SPALTEN;
const STUECK = 64;
const FUGE = 6;
const ZEILEN = 3;
const TAFEL = {links: 280, oben: 240, rand: 14};
const TAFEL_HOEHE = ZEILEN * STUECK + (ZEILEN - 1) * FUGE + 2 * TAFEL.rand;
const SCHILD = {links: 1140, oben: 236, breite: 440, hoehe: 210};
const SCHOKO = '#6E4B3A';
const SCHOKO_HELL = '#82604D';
// Balken „Preis pro 100 g“
const BALKEN = {links: 460, max: 880, hoehe: 64, y: [690, 800]};
const breite = skala(PRO100_JETZT, BALKEN.max);
// Die obere Gruppe steht anfangs mittig und rückt für die Umrechnung nach oben.
const VERSATZ_START = 190;

export const YouTubeVisual32Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];

  const auf = p(frame, at(0), at(0) + 14);
  const schrumpf = p(frame, at(1) + 4, at(1) + 34);
  const gramm = GRAMM_VORHER - (GRAMM_VORHER - GRAMM_JETZT) * schrumpf;
  const preisPlus = p(frame, at(2) + 30, at(2) + 42);
  const nachOben = p(frame, at(3), at(3) + 24);
  const versatz = VERSATZ_START * (1 - nachOben);
  const rechnung = p(frame, at(3) + 10, at(3) + 24);
  const balkenVorher = p(frame, at(3) + 24, at(3) + 44);
  const balkenJetzt = p(frame, at(3) + 34, at(3) + 58);
  const plus = p(frame, at(4), at(4) + 16);

  const letzteSpalteBreite = STUECK * (1 - schrumpf);
  // 90 g = exakt 9 von 10 gleich großen Spalten (Fuge vor der letzten Spalte fällt mit weg).
  const tafelBreite = 2 * TAFEL.rand + (SPALTEN - 1) * (STUECK + FUGE) + letzteSpalteBreite - FUGE * schrumpf;
  const spalteX = (k: number) => TAFEL.links + TAFEL.rand + k * (STUECK + FUGE);
  const lueckeX = spalteX(SPALTEN - 1);

  const jetztWert = PRO100_VORHER * Math.min(1, balkenJetzt / 0.6) + (PRO100_JETZT - PRO100_VORHER) * interpolate(balkenJetzt, [0.6, 1], [0, 1], CLAMP);

  return (
    <DatenBuehne>
      <Quelle>Quelle: Verbraucherzentrale Hamburg · Mogelpackung des Jahres 2025</Quelle>

      {/* Obere Gruppe: Tafel + Preisschild */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${versatz.toFixed(1)}px)`}}>
        <Text x={TAFEL.links} y={TAFEL.oben - 40} groesse={34} gewicht={800} ab={at(0)}>
          Milka Alpenmilch
        </Text>
        {/* gestrichelte Lücke der weggefallenen 10 g */}
        <div
          style={{
            position: 'absolute',
            left: lueckeX - 4,
            top: TAFEL.oben + 4,
            width: STUECK + TAFEL.rand,
            height: TAFEL_HOEHE - 8,
            borderRadius: '0 14px 14px 0',
            border: `4px dashed ${DATEN.rot}`,
            borderLeft: 'none',
            opacity: interpolate(schrumpf, [0.5, 1], [0, 1], CLAMP),
          }}
        />
        <div style={{position: 'absolute', left: TAFEL.links, top: TAFEL.oben, width: tafelBreite, height: TAFEL_HOEHE, borderRadius: 14, backgroundColor: SCHOKO, opacity: auf, overflow: 'hidden'}}>
          {Array.from({length: SPALTEN}, (_, k) => {
            const b = k === SPALTEN - 1 ? letzteSpalteBreite : STUECK;
            return Array.from({length: ZEILEN}, (__, z) => (
              <div key={`${k}-${z}`} style={{position: 'absolute', left: spalteX(k) - TAFEL.links, top: TAFEL.rand + z * (STUECK + FUGE), width: b, height: STUECK, borderRadius: 6, backgroundColor: SCHOKO_HELL}} />
            ));
          })}
        </div>
        <div style={{position: 'absolute', left: TAFEL.links, top: TAFEL.oben + TAFEL_HOEHE + 44, transform: 'translateY(-50%)', fontSize: 46, fontWeight: 800, color: schrumpf > 0.02 ? DATEN.rot : DATEN.text, opacity: auf, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
          {zahlText(Math.round(gramm))} g
          {schrumpf > 0.02 ? <span style={{fontSize: 30, fontWeight: 700, color: DATEN.leise, marginLeft: 18}}>statt {GRAMM_VORHER} g</span> : null}
        </div>
        <Text x={lueckeX + STUECK / 2} y={TAFEL.oben + TAFEL_HOEHE + 44} groesse={30} gewicht={800} farbe={DATEN.rot} ausrichtung="mitte" ab={at(1) + 28}>
          −{GRAMM_PRO_SPALTE} g
        </Text>

        {/* Preisschild */}
        <Text x={SCHILD.links} y={SCHILD.oben - 36} groesse={28} gewicht={700} farbe={DATEN.leise} ab={at(0)}>
          Preis pro Tafel
        </Text>
        <div style={{position: 'absolute', left: SCHILD.links, top: SCHILD.oben, width: SCHILD.breite, height: SCHILD.hoehe, borderRadius: 22, backgroundColor: DATEN.papier, border: `3px solid ${DATEN.linie}`, boxShadow: '0 12px 30px rgba(32, 42, 37, 0.08)', opacity: auf}} />
        <Zaehlwerk x={SCHILD.links + SCHILD.breite / 2} y={SCHILD.oben + SCHILD.hoehe / 2} stationen={[{ab: at(2) + 6, wert: PREIS_JETZT}]} start={PREIS_VORHER} dauer={26} nachkomma={2} groesse={104} ab={at(0)} />
        <div style={{position: 'absolute', left: SCHILD.links + SCHILD.breite + 24, top: SCHILD.oben + SCHILD.hoehe / 2, transform: `translateY(-50%) translateX(${((1 - preisPlus) * -12).toFixed(1)}px)`, opacity: preisPlus, fontSize: 34, fontWeight: 800, color: DATEN.rot, whiteSpace: 'nowrap'}}>
          +{euroText(PREIS_JETZT - PREIS_VORHER, 2)}
        </div>
        <div style={{position: 'absolute', left: SCHILD.links + SCHILD.breite / 2, top: SCHILD.oben + SCHILD.hoehe + 44, transform: 'translate(-50%, -50%)', opacity: rechnung, fontSize: 32, fontWeight: 700, color: DATEN.leise, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
          {euroText(PREIS_JETZT, 2)} : {GRAMM_JETZT} g × 100 g = <span style={{color: DATEN.rot, fontWeight: 800}}>{euroText(PRO100_JETZT, 2)}</span>
        </div>
      </div>

      {/* Untere Gruppe: Preis pro 100 g, Länge exakt aus dem Wert */}
      <Text x={BALKEN.links} y={BALKEN.y[0] - 62} groesse={30} gewicht={700} farbe={DATEN.leise} ab={at(3) + 18}>
        Preis pro 100 g
      </Text>
      {[
        {titel: 'vorher', wert: PRO100_VORHER * balkenVorher, ziel: PRO100_VORHER, y: BALKEN.y[0], sichtbar: balkenVorher},
        {titel: 'jetzt', wert: jetztWert, ziel: PRO100_JETZT, y: BALKEN.y[1], sichtbar: balkenJetzt},
      ].map((zeile, i) => {
        const basis = Math.min(zeile.wert, PRO100_VORHER);
        const extra = Math.max(0, zeile.wert - PRO100_VORHER);
        return (
          <React.Fragment key={zeile.titel}>
            <Text x={BALKEN.links - 28} y={zeile.y + BALKEN.hoehe / 2} groesse={34} gewicht={800} ausrichtung="rechts" ab={at(3) + 24 + i * 10}>
              {zeile.titel}
            </Text>
            <div style={{position: 'absolute', left: BALKEN.links, top: zeile.y, width: breite(basis), height: BALKEN.hoehe, borderRadius: extra > 0 ? '12px 0 0 12px' : 12, backgroundColor: DATEN.blau}} />
            {extra > 0 ? <div style={{position: 'absolute', left: BALKEN.links + breite(PRO100_VORHER), top: zeile.y, width: breite(extra), height: BALKEN.hoehe, borderRadius: '0 12px 12px 0', backgroundColor: DATEN.rot}} /> : null}
            <div style={{position: 'absolute', left: BALKEN.links + breite(zeile.ziel) + 22, top: zeile.y + BALKEN.hoehe / 2, transform: 'translateY(-50%)', opacity: interpolate(zeile.sichtbar, [0.85, 1], [0, 1], CLAMP), fontSize: 40, fontWeight: 800, color: i === 1 ? DATEN.rot : DATEN.text, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
              {euroText(zeile.ziel, 2)}
            </div>
          </React.Fragment>
        );
      })}

      {/* +48 % über dem Mehrpreis */}
      <div
        style={{
          position: 'absolute',
          left: BALKEN.links + breite(PRO100_VORHER),
          top: BALKEN.y[1] + BALKEN.hoehe + 44,
          transform: `translateY(-50%) translateY(${((1 - plus) * 10).toFixed(1)}px)`,
          opacity: plus,
          display: 'flex',
          alignItems: 'baseline',
          gap: 16,
          whiteSpace: 'nowrap',
          color: DATEN.rot,
        }}
      >
        <span style={{fontSize: 54, fontWeight: 900}}>+{Math.floor(PLUS_PROZENT)} %</span>
        <span style={{fontSize: 30, fontWeight: 700}}>versteckte Preiserhöhung</span>
      </div>
    </DatenBuehne>
  );
};
