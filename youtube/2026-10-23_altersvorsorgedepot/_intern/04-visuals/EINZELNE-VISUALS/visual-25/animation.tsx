import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {DATEN, DatenBuehne, euroText, skala} from '../../../../../../src/design-system/daten';

export const MECHANIC_ID = 'cost-drag-two-wealth-curves-gap-band';
export const VISUAL_TECHNIQUE_ID = 'timeline-arrow-axis-sequential-compound-curves-red-gap-band-callout';
export const COMPOSITION_FAMILY_ID = 'trend-trace';

/**
 * ANIMATION_NARRATIVE
 * START: Der Zeitstrahl aus Bild 24 liegt als Achse am Boden: „28“ links, „65“ rechts (37 Jahre).
 * MECHANISM: Die Vermögenskurve „1 % Kosten“ zeichnet sich von 0 € bis 65 (rund 198.000 €);
 *   danach zeichnet sich „0,2 % Kosten“ auf derselben Skala darüber (rund 238.000 €).
 *   Beide Kurven sind im Code mit derselben Formel gerechnet: v = v · (1 + r/12) + 195 € je Monat,
 *   444 Monate, r = 4,0 % bzw. 4,8 % netto (5 % Rendite minus Kosten).
 * CONSEQUENCE: Die Fläche zwischen den Kurven füllt sich rot von links nach rechts — fast nichts
 *   am Anfang, breit am Ende.
 * RESULT: „rund 40.000 € Unterschied — nur wegen der Kosten“, Pfeil zeigt auf die Lücke bei 65.
 *
 * EDITORIAL_VISUAL_NARRATIVE
 * HERO: rote Lücke zwischen den Kurven + „rund 40.000 €“
 * SUPPORT: Zeitstrahl-Pfeil 28 → 65 (Bridge), Endwerte mit Kostensatz rechts
 * SURFACE: Flow-Creme DATEN.grund, Stift-Kontur am Zeitstrahl
 * SHAPE_LANGUAGE: zwei dicke runde Kurven, eine flache Fläche, keine Gitterlinien
 */
export const ANIMATION_NARRATIVE = {
  START: 'Zeitstrahl 28 → 65 als Achse, noch keine Kurve',
  MECHANISM: 'Kurve 1 % Kosten bis rund 198.000 €, dann Kurve 0,2 % Kosten bis rund 238.000 €',
  RESULT: 'Rote Lücke: rund 40.000 € Unterschied, nur wegen der Kosten',
};

// Beispielrechnung (Annahme, keine Prognose): 150 € + 45 € Zulage = 195 € im Monat, 28 → 65 Jahre.
const JAHRE = 65 - 28;
const MONATE = JAHRE * 12;
const EINZAHLUNG = 195;
const RENDITE = 0.05;
const KOSTEN_HOCH = 0.01;
const KOSTEN_NIEDRIG = 0.002;
const verlauf = (netto: number) => {
  const werte = [0];
  let v = 0;
  for (let monat = 1; monat <= MONATE; monat++) {
    v = v * (1 + netto / 12) + EINZAHLUNG;
    werte.push(v);
  }
  return werte;
};
const TEUER = verlauf(RENDITE - KOSTEN_HOCH);
const GUENSTIG = verlauf(RENDITE - KOSTEN_NIEDRIG);
const ENDE_TEUER = TEUER[MONATE];
const ENDE_GUENSTIG = GUENSTIG[MONATE];
if (Math.round(ENDE_TEUER) !== 197856 || Math.round(ENDE_GUENSTIG) !== 238158) {
  throw new Error('Kurvenwerte weichen von 197.856 € / 238.158 € ab.');
}
const rund = (wert: number) => Math.round(wert / 1000) * 1000;
if (rund(ENDE_GUENSTIG - ENDE_TEUER) !== 40000) throw new Error('Unterschied muss rund 40.000 € sein.');

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = Easing.bezier(0.33, 0, 0.2, 1);
const zeichnen = Easing.bezier(0.45, 0, 0.55, 1);
const p = (frame: number, von: number, bis: number, easing = weich) => interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing});

// beats: [„Bei einem Prozent Kosten“, „rund hundertachtundneunzigtausend“, „Bei null Komma zwei Prozent“,
//         „rund zweihundertachtunddreißigtausend“, „Rund vierzigtausend Euro Unterschied“, „Nur wegen der Kosten“]
const PREVIEW_BEATS = [0, 101, 139, 304, 342, 393];

// Gemeinsame Skala: x = Alter 28 → 65, y = Vermögen 0 → 240.000 € (560 px), Nulllinie = Zeitstrahl.
const X_START = 250;
const X_ZIEL = 1250;
const BASIS = 820;
const yPx = skala(240000, 560);
const xBei = (monat: number) => X_START + (monat / MONATE) * (X_ZIEL - X_START);
const yBei = (wert: number) => BASIS - yPx(wert);
const wertBei = (werte: number[], monat: number) => {
  const m0 = Math.floor(monat);
  const m1 = Math.min(MONATE, m0 + 1);
  return werte[m0] + (werte[m1] - werte[m0]) * (monat - m0);
};
const PUNKTE_TEUER = TEUER.map((wert, monat) => `${xBei(monat).toFixed(1)},${yBei(wert).toFixed(1)}`);
const PUNKTE_GUENSTIG = GUENSTIG.map((wert, monat) => `${xBei(monat).toFixed(1)},${yBei(wert).toFixed(1)}`);

const kurve = (werte: number[], punkte: string[], anteil: number) => {
  const monat = anteil * MONATE;
  const ganz = Math.floor(monat);
  const spitze = {x: xBei(monat), y: yBei(wertBei(werte, monat))};
  return {d: `M${punkte.slice(0, ganz + 1).join(' L')} L${spitze.x.toFixed(1)},${spitze.y.toFixed(1)}`, spitze};
};

type Ausrichtung = 'links' | 'mitte' | 'rechts';
const T: React.FC<{
  x: number;
  y: number;
  groesse: number;
  gewicht?: number;
  farbe?: string;
  ausrichtung?: Ausrichtung;
  sicht?: number;
  heben?: number;
  children: React.ReactNode;
}> = ({x, y, groesse, gewicht = 800, farbe = DATEN.text, ausrichtung = 'links', sicht = 1, heben = 0, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(${ausrichtung === 'mitte' ? '-50%' : ausrichtung === 'rechts' ? '-100%' : '0'}, -50%) translateY(${heben.toFixed(1)}px)`,
      opacity: sicht,
      fontSize: Math.max(DATEN.minText, groesse),
      fontWeight: gewicht,
      color: farbe,
      lineHeight: 1.1,
      whiteSpace: 'nowrap',
      letterSpacing: groesse >= 80 ? -1.5 : 0,
    }}
  >
    {children}
  </div>
);

const Endwert: React.FC<{x: number; y: number; wert: number; sicht: number}> = ({x, y, wert, sicht}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translateY(-50%) translateX(${((1 - sicht) * 14).toFixed(1)}px)`, opacity: sicht, whiteSpace: 'nowrap', lineHeight: 1.1, display: 'flex', alignItems: 'baseline', gap: 12}}>
    <span style={{fontSize: 40, fontWeight: 700, color: DATEN.leise}}>rund</span>
    <span style={{fontSize: 56, fontWeight: 900, letterSpacing: -1, color: DATEN.text}}>{euroText(rund(wert))}</span>
  </div>
);

export const YouTubeVisual25Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];

  const grund = p(frame, 0, 12);
  // Kurve 1 % Kosten zeichnet sich bis zum gesprochenen Endwert.
  const name1 = p(frame, at(0) + 2, at(0) + 14);
  const k1Ab = at(0) + 6;
  const k1Bis = Math.max(k1Ab + 50, at(1) + 4);
  const zug1 = p(frame, k1Ab, k1Bis, zeichnen);
  const wert1 = p(frame, k1Bis, k1Bis + 12);
  // Kurve 0,2 % Kosten — gleiche Formel, gleiche Skala.
  const name2Ab = Math.max(at(2), k1Bis + 8);
  const name2 = p(frame, name2Ab, name2Ab + 12);
  const k2Bis = Math.max(at(3) + 4, name2Ab + 54);
  const k2Ab = Math.max(name2Ab + 4, k2Bis - 130);
  const zug2 = p(frame, k2Ab, k2Bis, zeichnen);
  const wert2 = p(frame, k2Bis, k2Bis + 12);
  // Lücke und Ergebnis.
  const lueckeAb = Math.max(at(4), k2Bis + 6);
  const luecke = p(frame, lueckeAb, lueckeAb + 30, zeichnen);
  const kante = p(frame, lueckeAb + 22, lueckeAb + 32);
  const callout = p(frame, lueckeAb + 6, lueckeAb + 20);
  const pfeil = p(frame, lueckeAb + 16, lueckeAb + 30);
  const grundText = p(frame, Math.max(at(5), lueckeAb + 20), Math.max(at(5), lueckeAb + 20) + 12);

  const teuer = kurve(TEUER, PUNKTE_TEUER, zug1);
  const guenstig = kurve(GUENSTIG, PUNKTE_GUENSTIG, zug2);

  // Fläche zwischen den Kurven bis zum aktuellen Monat der Füll-Bewegung.
  const bisMonat = Math.round(luecke * MONATE);
  const flaeche =
    luecke > 0
      ? `M${PUNKTE_GUENSTIG.slice(0, bisMonat + 1).join(' L')} L${PUNKTE_TEUER.slice(0, bisMonat + 1).reverse().join(' L')} Z`
      : '';

  const yEndeTeuer = yBei(ENDE_TEUER);
  const yEndeGuenstig = yBei(ENDE_GUENSTIG);
  const pfeilZiel = {x: xBei(MONATE - 10), y: (yBei(wertBei(TEUER, MONATE - 10)) + yBei(wertBei(GUENSTIG, MONATE - 10))) / 2};
  const pfeilStart = {x: 1010, y: 326};
  const pfeilD = `M${pfeilStart.x},${pfeilStart.y} Q${(pfeilStart.x + pfeilZiel.x) / 2},${pfeilStart.y - 34} ${pfeilZiel.x - 10},${pfeilZiel.y - 4}`;

  const SPALTE = X_ZIEL + 42;

  return (
    <DatenBuehne>
      <T x={DATEN.rand} y={64} groesse={34} gewicht={700} farbe={DATEN.leise}>
        Beispiel, Annahme 5 % Rendite vor Kosten
      </T>

      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <filter id="v25-stift" x="-2%" y="-20%" width="104%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={11} result="rauschen" />
            <feDisplacementMap in="SourceGraphic" in2="rauschen" scale={3.5} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Bridge „Zeitstrahl“: Pfeil 28 → 65 ist zugleich die 0-€-Linie */}
        <g filter="url(#v25-stift)" fill="none" stroke={DATEN.text} strokeLinecap="round" strokeLinejoin="round" opacity={grund}>
          <path d={`M${X_START - 40},${BASIS} L${X_ZIEL + 86},${BASIS}`} strokeWidth={6} />
          <path d={`M${X_ZIEL + 62},${BASIS - 18} L${X_ZIEL + 88},${BASIS} L${X_ZIEL + 62},${BASIS + 18}`} strokeWidth={6} />
          <path d={`M${X_START},${BASIS - 14} L${X_START},${BASIS + 14}`} strokeWidth={5} />
          <path d={`M${X_ZIEL},${BASIS - 14} L${X_ZIEL},${BASIS + 14}`} strokeWidth={5} />
        </g>

        {/* Lücke = Kostenwirkung, füllt sich von 28 nach 65 */}
        {flaeche ? <path d={flaeche} fill={DATEN.rot} fillOpacity={0.3} /> : null}

        {zug1 > 0 ? <path d={teuer.d} fill="none" stroke={DATEN.rot} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" /> : null}
        {zug2 > 0 ? <path d={guenstig.d} fill="none" stroke={DATEN.gruen} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" /> : null}

        {kante > 0 ? (
          <line x1={X_ZIEL} y1={yEndeGuenstig + 10} x2={X_ZIEL} y2={yEndeGuenstig + 10 + (yEndeTeuer - yEndeGuenstig - 20) * kante} stroke={DATEN.rot} strokeWidth={6} strokeLinecap="round" />
        ) : null}

        {zug1 > 0 ? <circle cx={teuer.spitze.x} cy={teuer.spitze.y} r={13} fill={DATEN.rot} stroke={DATEN.text} strokeWidth={4} /> : null}
        {name2 > 0 ? <circle cx={guenstig.spitze.x} cy={guenstig.spitze.y} r={13} fill={DATEN.gruen} stroke={DATEN.text} strokeWidth={4} opacity={name2} /> : null}

        {pfeil > 0 ? (
          <g fill="none" stroke={DATEN.rot} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={pfeil}>
            <path d={pfeilD} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pfeil} />
            {pfeil > 0.85 ? (
              <path d={`M${pfeilZiel.x - 34},${pfeilZiel.y - 22} L${pfeilZiel.x - 8},${pfeilZiel.y - 3} L${pfeilZiel.x - 38},${pfeilZiel.y + 8}`} />
            ) : null}
          </g>
        ) : null}
      </svg>

      {/* Zeitstrahl-Beschriftung wie in Bild 24 */}
      <T x={X_START} y={BASIS + 58} groesse={64} gewicht={800} ausrichtung="mitte" sicht={grund}>
        28
      </T>
      <T x={X_ZIEL} y={BASIS + 58} groesse={64} gewicht={800} ausrichtung="mitte" sicht={grund}>
        65
      </T>
      <T x={(X_START + X_ZIEL) / 2} y={BASIS + 58} groesse={36} gewicht={600} farbe={DATEN.leise} ausrichtung="mitte" sicht={grund}>
        Jonas: {euroText(EINZAHLUNG)} im Monat inkl. Zulage · {JAHRE} Jahre
      </T>

      {/* Endwerte rechts: Name beim Zeichnen, Betrag beim gesprochenen Wert */}
      <T x={SPALTE} y={yEndeGuenstig - 56} groesse={40} gewicht={800} farbe={DATEN.gruen} sicht={name2}>
        0,2 % Kosten
      </T>
      <Endwert x={SPALTE} y={yEndeGuenstig} wert={ENDE_GUENSTIG} sicht={wert2} />
      <Endwert x={SPALTE} y={yEndeTeuer} wert={ENDE_TEUER} sicht={wert1} />
      <T x={SPALTE} y={yEndeTeuer + 56} groesse={40} gewicht={800} farbe={DATEN.rot} sicht={name1}>
        1 % Kosten
      </T>

      {/* Ergebnis-Callout im freien Feld über den Kurven */}
      <div
        style={{
          position: 'absolute',
          left: 290,
          top: 326,
          transform: `translateY(-50%) translateY(${((1 - callout) * 14).toFixed(1)}px)`,
          opacity: callout,
          display: 'flex',
          alignItems: 'baseline',
          gap: 18,
          whiteSpace: 'nowrap',
          lineHeight: 1,
          color: DATEN.rot,
        }}
      >
        <span style={{fontSize: 56, fontWeight: 800}}>rund</span>
        <span style={{fontSize: 124, fontWeight: 900, letterSpacing: -2}}>{euroText(rund(ENDE_GUENSTIG - ENDE_TEUER))}</span>
      </div>
      <T x={292} y={426} groesse={52} gewicht={800} sicht={callout} heben={(1 - callout) * 12}>
        Unterschied
      </T>
      <T x={292} y={490} groesse={44} gewicht={700} farbe={DATEN.leise} sicht={grundText} heben={(1 - grundText) * 12}>
        nur wegen der Kosten
      </T>
    </DatenBuehne>
  );
};
