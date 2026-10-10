import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {DATEN, DatenBuehne, Text, euroText} from '../../../../../src/design-system/daten';

export const MECHANIC_ID = 'subscription-list-times-twelve-strike';
export const VISUAL_TECHNIQUE_ID = 'notepad-rows-yearly-recount';
export const COMPOSITION_FAMILY_ID = 'checklist-calculation';

/**
 * ANIMATION_NARRATIVE
 * START: Notizzettel, fünf Abos mit Monatspreis werden nacheinander aufgeschrieben.
 * MECHANISM: Spalte „× 12“ rechnet jede Zeile zum Jahresbetrag, die Summe zählt hoch.
 *   Eine Markierung prüft jede Zeile („Würde ich das heute noch zahlen?“).
 * RESULT: Zwei Zeilen werden durchgestrichen, die Jahressumme sinkt von 575,40 € auf 335,64 €.
 */
export const ANIMATION_NARRATIVE = {
  START: 'Fünf Abos mit Monatspreis',
  MECHANISM: 'Jede Zeile × 12, Summe zählt hoch, jede Zeile wird geprüft',
  RESULT: 'Zwei Abos gestrichen: 575,40 € → 335,64 € im Jahr',
};

type Abo = {titel: string; cent: number; kuendigen: boolean};
const ABOS: Abo[] = [
  {titel: 'Musik', cent: 1099, kuendigen: false},
  {titel: 'Video', cent: 1399, kuendigen: false},
  {titel: 'Cloud', cent: 299, kuendigen: false},
  {titel: 'Fitness-App', cent: 999, kuendigen: true},
  {titel: 'Zeitung digital', cent: 999, kuendigen: true},
];
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = (t: number) => t * t * (3 - 2 * t);
const euro = (cent: number) => euroText(cent / 100, 2);
const jahr = (abo: Abo) => abo.cent * 12;

// beats: [„Schreib jedes Abo auf“, „mal zwölf“, „Würde ich diesen Jahresbetrag“, „Alles, wo du zögerst“]
const PREVIEW_BEATS = [0, 60, 130, 210];

const ZETTEL = {links: 420, rechts: 1500, oben: 96, zeile: 94};
const SPALTE = {name: ZETTEL.links + 70, monat: ZETTEL.links + 620, jahr: ZETTEL.rechts - 70};
const zeileY = (i: number) => ZETTEL.oben + 124 + i * ZETTEL.zeile;

export const YouTubeVisual17Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];
  const zeileAb = (i: number) => at(0) + 6 + i * 8;
  const rechnenAb = (i: number) => at(1) + i * 6;
  const pruefAb = (i: number) => at(2) + i * Math.max(8, Math.round((at(3) - at(2)) / (ABOS.length + 1)));
  const streichAb = (k: number) => at(3) + 6 + k * 12;

  const rechnen = ABOS.map((_, i) => interpolate(frame, [rechnenAb(i), rechnenAb(i) + 18], [0, 1], {...CLAMP, easing: weich}));
  const streichen = ABOS.filter((abo) => abo.kuendigen).map((_, k) => interpolate(frame, [streichAb(k), streichAb(k) + 16], [0, 1], {...CLAMP, easing: weich}));
  let k = -1;
  const streichFuer = ABOS.map((abo) => (abo.kuendigen ? streichen[++k] : 0));
  const summe = ABOS.reduce((acc, abo, i) => acc + jahr(abo) * rechnen[i] * (1 - streichFuer[i]), 0);
  const pruefIndex = ABOS.findIndex((_, i) => frame >= pruefAb(i) && frame < pruefAb(i + 1));
  const summeY = zeileY(ABOS.length) + 30;
  const gespart = interpolate(frame, [streichAb(1) + 16, streichAb(1) + 30], [0, 1], CLAMP);

  return (
    <DatenBuehne>
      {/* Notizzettel */}
      <div style={{position: 'absolute', left: ZETTEL.links, top: ZETTEL.oben, width: ZETTEL.rechts - ZETTEL.links, height: summeY - ZETTEL.oben + 90, borderRadius: 24, backgroundColor: DATEN.papier, boxShadow: '0 20px 50px rgba(32, 42, 37, 0.10)', opacity: interpolate(frame, [at(0), at(0) + 10], [0, 1], CLAMP)}} />
      <Text x={SPALTE.name} y={ZETTEL.oben + 56} groesse={28} gewicht={700} farbe={DATEN.leise} ab={at(0)}>
        Abo
      </Text>
      <Text x={SPALTE.monat} y={ZETTEL.oben + 56} groesse={28} gewicht={700} farbe={DATEN.leise} ausrichtung="rechts" ab={at(0)}>
        pro Monat
      </Text>
      <Text x={SPALTE.jahr} y={ZETTEL.oben + 56} groesse={28} gewicht={800} farbe={DATEN.rot} ausrichtung="rechts" ab={at(1)}>
        × 12 = pro Jahr
      </Text>
      {/* Prüf-Markierung */}
      {pruefIndex >= 0 ? (
        <div style={{position: 'absolute', left: ZETTEL.links + 20, top: zeileY(pruefIndex) - 44, width: ZETTEL.rechts - ZETTEL.links - 40, height: 88, borderRadius: 14, backgroundColor: DATEN.gold, opacity: 0.22}} />
      ) : null}
      {ABOS.map((abo, i) => {
        const y = zeileY(i);
        const gestrichen = streichFuer[i];
        const pfad = `M ${SPALTE.name - 16} ${y} L ${SPALTE.jahr + 16} ${y}`;
        const strich = evolvePath(gestrichen, pfad);
        const blass = 1 - 0.55 * gestrichen;
        return (
          <React.Fragment key={abo.titel}>
            <div style={{opacity: blass}}>
              <Text x={SPALTE.name} y={y} groesse={44} gewicht={700} ab={zeileAb(i)}>
                {abo.titel}
              </Text>
              <Text x={SPALTE.monat} y={y} groesse={44} gewicht={700} farbe={DATEN.leise} ausrichtung="rechts" ab={zeileAb(i)}>
                {euro(abo.cent)}
              </Text>
              {rechnen[i] > 0 ? (
                <Text x={SPALTE.jahr} y={y} groesse={44} gewicht={800} farbe={DATEN.rot} ausrichtung="rechts" ab={rechnenAb(i)}>
                  {euro(Math.round(jahr(abo) * rechnen[i]))}
                </Text>
              ) : null}
            </div>
            {gestrichen > 0 ? (
              <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
                <path d={pfad} fill="none" stroke={DATEN.text} strokeWidth={6} strokeLinecap="round" strokeDasharray={strich.strokeDasharray} strokeDashoffset={strich.strokeDashoffset} />
              </svg>
            ) : null}
          </React.Fragment>
        );
      })}
      {/* Summe */}
      <div style={{position: 'absolute', left: ZETTEL.links + 40, top: summeY - 26, width: ZETTEL.rechts - ZETTEL.links - 80, height: 3, backgroundColor: DATEN.text, opacity: rechnen[0]}} />
      {rechnen[0] > 0 ? (
        <>
          <Text x={SPALTE.name} y={summeY + 32} groesse={44} gewicht={800} ab={at(1)}>
            Summe
          </Text>
          <Text x={SPALTE.jahr} y={summeY + 32} groesse={56} gewicht={800} ausrichtung="rechts" ab={at(1)}>
            {euro(Math.round(summe))}
          </Text>
        </>
      ) : null}
      <div style={{position: 'absolute', left: ZETTEL.rechts + 40, top: summeY + 2, opacity: gespart, transform: `translateY(${((1 - gespart) * 14).toFixed(1)}px)`, padding: '10px 22px', borderRadius: 999, backgroundColor: DATEN.gruen, color: DATEN.papier, fontSize: 34, fontWeight: 800, whiteSpace: 'nowrap'}}>
        −{euro(ABOS.filter((abo) => abo.kuendigen).reduce((acc, abo) => acc + jahr(abo), 0))}
      </div>
    </DatenBuehne>
  );
};
