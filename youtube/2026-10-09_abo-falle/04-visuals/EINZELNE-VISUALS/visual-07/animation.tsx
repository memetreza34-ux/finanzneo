import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {DATEN, DatenBuehne, Text, Zaehlwerk, euroText} from '../../../../../src/design-system/daten';

export const MECHANIC_ID = 'free-trial-days-flip-to-monthly-debits';
export const VISUAL_TECHNIQUE_ID = 'day-strip-scrub-then-month-row';
export const COMPOSITION_FAMILY_ID = 'timeline-state-flip';

/**
 * ANIMATION_NARRATIVE
 * START: 30 Tagesfelder, eine Marke läuft über die Probezeit, jedes Feld wird grün „0 €“.
 * MECHANISM: Tag 31 kippt rot; die 30 Tage schrumpfen zu „Monat 1 · gratis“, danach erscheinen
 *   Monat 2 bis 12 als rote Abbuchungen à 12,99 €, der Zähler läuft mit.
 * RESULT: 11 × 12,99 € = 142,89 € in den ersten zwölf Monaten (Beispielpreis, keine Marke).
 */
export const ANIMATION_NARRATIVE = {
  START: 'Probezeit: 30 Tage gratis',
  MECHANISM: 'Tag 31 kippt rot, danach jeden Monat eine Abbuchung',
  RESULT: '142,89 € in den ersten zwölf Monaten',
};

const TAGE = 30;
const PREIS = 12.99;
const MONATE = 12;
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = (t: number) => t * t * (3 - 2 * t);

// beats: [„Trick eins“ → Probezeit läuft, „Tag einunddreißig“ → kippt, „Ab jetzt jeden Monat“ → Abbuchungen]
const PREVIEW_BEATS = [0, 110, 160];

const STREIFEN = {links: 200, rechts: 1600, y: 360, hoehe: 84};
const ZELLE = (STREIFEN.rechts - STREIFEN.links) / TAGE;
const MONAT = {links: 168, breite: 124, abstand: 8, y: 560, hoehe: 96};
const monatX = (m: number) => MONAT.links + m * (MONAT.breite + MONAT.abstand);

export const YouTubeVisual07Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];
  const tagBis = Math.max(at(1) - 6, at(0) + 30);
  const tagJetzt = interpolate(frame, [at(0) + 8, tagBis], [0, TAGE], CLAMP);
  const kippen = spring({frame: frame - at(1), fps, config: {damping: 12, stiffness: 160}});
  // 30 Tage schrumpfen zum ersten Monatsfeld (Magic Move).
  const zuMonat = interpolate(frame, [at(2), at(2) + 20], [0, 1], {...CLAMP, easing: weich});
  const monatAb = (m: number) => at(2) + 20 + (m - 1) * 4;
  const streifenLinks = interpolate(zuMonat, [0, 1], [STREIFEN.links, monatX(0)]);
  const streifenBreite = interpolate(zuMonat, [0, 1], [STREIFEN.rechts - STREIFEN.links, MONAT.breite]);
  const streifenY = interpolate(zuMonat, [0, 1], [STREIFEN.y, MONAT.y]);
  const streifenH = interpolate(zuMonat, [0, 1], [STREIFEN.hoehe, MONAT.hoehe]);
  const zelle = streifenBreite / TAGE;
  const tag31X = STREIFEN.rechts + 16;

  return (
    <DatenBuehne>
      <Text x={STREIFEN.links} y={STREIFEN.y - 92} groesse={40} gewicht={800} farbe={DATEN.gruen} ab={at(0)}>
        Probezeit: 30 Tage gratis
      </Text>
      {/* Tagesfelder (später: Monat 1) */}
      {Array.from({length: TAGE}, (_, t) => {
        const an = tagJetzt > t;
        return (
          <div
            key={t}
            style={{
              position: 'absolute',
              left: streifenLinks + t * zelle + (zuMonat < 1 ? 2 : 0),
              top: streifenY - streifenH / 2,
              width: Math.max(1, zelle - (zuMonat < 1 ? 4 * (1 - zuMonat) : 0)),
              height: streifenH,
              borderRadius: interpolate(zuMonat, [0, 1], [8, t === 0 ? 12 : 0]),
              backgroundColor: an ? DATEN.gruen : DATEN.linie,
              opacity: interpolate(frame, [at(0), at(0) + 10], [0, 1], CLAMP),
            }}
          />
        );
      })}
      <div style={{opacity: 1 - zuMonat}}>
        {[1, 10, 20, 30].map((tag) => (
          <Text key={tag} x={STREIFEN.links + (tag - 0.5) * ZELLE} y={STREIFEN.y + 74} groesse={30} gewicht={700} farbe={DATEN.leise} ausrichtung="mitte" ab={at(0)}>
            Tag {tag}
          </Text>
        ))}
      </div>
      {/* Tag 31 */}
      {frame >= at(1) && zuMonat < 1 ? (
        <div style={{opacity: 1 - zuMonat}}>
          <div style={{position: 'absolute', left: tag31X, top: STREIFEN.y - STREIFEN.hoehe / 2, width: 150, height: STREIFEN.hoehe, borderRadius: 10, backgroundColor: DATEN.rot, transform: `scale(${(0.6 + 0.4 * kippen).toFixed(3)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: DATEN.papier, fontSize: 32, fontWeight: 800}}>
            −{euroText(PREIS, 2)}
          </div>
          <Text x={tag31X + 75} y={STREIFEN.y + 74} groesse={30} gewicht={800} farbe={DATEN.rot} ausrichtung="mitte" ab={at(1)}>
            Tag 31
          </Text>
        </div>
      ) : null}
      {/* Monatsreihe */}
      {zuMonat > 0 ? (
        <>
          <Text x={monatX(0) + MONAT.breite / 2} y={MONAT.y + 84} groesse={28} gewicht={700} farbe={DATEN.gruen} ausrichtung="mitte" ab={at(2) + 14}>
            gratis
          </Text>
          {Array.from({length: MONATE - 1}, (_, k) => k + 1).map((m) => {
            const p = spring({frame: frame - monatAb(m), fps, config: {damping: 14, stiffness: 200, overshootClamping: true}});
            if (frame < monatAb(m)) return null;
            return (
              <React.Fragment key={m}>
                <div style={{position: 'absolute', left: monatX(m), top: MONAT.y - MONAT.hoehe / 2, width: MONAT.breite, height: MONAT.hoehe, borderRadius: 12, backgroundColor: DATEN.rot, transform: `translateY(${((1 - p) * -40).toFixed(1)}px) scale(${(0.7 + 0.3 * p).toFixed(3)})`, opacity: Math.min(1, p * 1.5), display: 'flex', alignItems: 'center', justifyContent: 'center', color: DATEN.papier, fontSize: 24, fontWeight: 800, whiteSpace: 'nowrap'}}>
                  −{euroText(PREIS, 2)}
                </div>
              </React.Fragment>
            );
          })}
          {Array.from({length: MONATE}, (_, m) => (
            <Text key={m} x={monatX(m) + MONAT.breite / 2} y={MONAT.y - 80} groesse={28} gewicht={700} farbe={DATEN.leise} ausrichtung="mitte" ab={m === 0 ? at(2) + 14 : monatAb(m)}>
              Monat {m + 1}
            </Text>
          ))}
          {frame >= monatAb(1) ? (
            <>
              <Zaehlwerk x={960} y={740} groesse={110} nachkomma={2} start={PREIS} dauer={4} ab={monatAb(1)} stationen={Array.from({length: MONATE - 2}, (_, k) => ({ab: monatAb(k + 2), wert: Math.round(PREIS * 100 * (k + 2)) / 100}))} farbe={DATEN.rot} />
              <Text x={960} y={826} groesse={34} gewicht={700} farbe={DATEN.leise} ausrichtung="mitte" ab={monatAb(MONATE - 1)}>
                bezahlt in den ersten 12 Monaten · Beispielpreis
              </Text>
            </>
          ) : null}
        </>
      ) : null}
    </DatenBuehne>
  );
};
