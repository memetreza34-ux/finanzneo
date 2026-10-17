import React from 'react';
import {Sequence} from 'remotion';
import {
  Balken,
  DATEN,
  DatenBuehne,
  Kopf,
  Legende,
  LinienDiagramm,
  Punkteraster,
  Quelle,
  Saeulen,
  Text,
  Topf,
  Zaehlwerk,
  euroText,
  rasterGroesse,
} from '../design-system/daten';
import type {Saeule} from '../design-system/daten';

/**
 * Referenz für den hellen Daten-Baukasten (YouTube 16:9): fünf typische Finanzszenen,
 * jede gebaut wie eine echte `animation.tsx` — Stufen kommen aus `beats`.
 * Alle Zahlen sind Beispielrechnungen und stehen als Quelle im Bild.
 */

// ─── 1 · Topf: Notgroschen zahlt eine Reparatur ──────────────────────────────

const NOTGROSCHEN = 3000;
const REPARATUR = 800;

export const DemoTopf: React.FC<{beats?: number[]}> = ({beats}) => {
  const at = (i: number) => beats?.[i] ?? [0, 24, 100, 170][i];
  return (
    <DatenBuehne>
      <Kopf ueberzeile="Beispielrechnung" titel="Der Notgroschen zahlt sofort" ab={at(0)} />
      <Topf x={620} unten={900} hoehe={500} start={NOTGROSCHEN} titel="Tagesgeld" ab={at(1)} bewegungen={[{ab: at(2), betrag: -REPARATUR, label: 'Waschmaschine'}]} />
      <Text x={1300} y={520} groesse={46} gewicht={800} farbe={DATEN.gruen} ab={at(3)}>
        Kein Verkauf nötig
      </Text>
      <Text x={1300} y={590} groesse={46} gewicht={800} farbe={DATEN.gruen} ab={at(3) + 8}>
        Kein Kredit nötig
      </Text>
      <Text x={1300} y={668} groesse={32} gewicht={600} farbe={DATEN.leise} ab={at(3) + 16}>
        {euroText(NOTGROSCHEN - REPARATUR)} bleiben auf dem Konto
      </Text>
      <Quelle ab={at(1)}>
        Beispielrechnung: {euroText(NOTGROSCHEN)} Rücklage, Reparatur {euroText(REPARATUR)}
      </Quelle>
    </DatenBuehne>
  );
};

// ─── 2 · Säulen + Zählwerk: ein Abo über ein Jahr ────────────────────────────

const ABO = 9.99;
const MONATE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

export const DemoAboJahr: React.FC<{beats?: number[]}> = ({beats}) => {
  const at = (i: number) => beats?.[i] ?? [0, 30, 66, 300][i];
  // Monat 1 auf „neun neunundneunzig“, ab „zwölf Abbuchungen“ folgen die übrigen im Takt.
  const monatAb = (m: number) => (m === 0 ? at(1) : at(2) + (m - 1) * 20);
  const eintraege: Saeule[] = MONATE.map((label, m) => ({
    label,
    ab: monatAb(m),
    teile: [
      {wert: ABO * m, farbe: DATEN.neutral},
      {wert: ABO, farbe: DATEN.rot},
    ],
    wertZeigen: m === 0 || m === MONATE.length - 1,
    hervorheben: m === MONATE.length - 1,
  }));
  const jahr = Math.round(ABO * 100 * MONATE.length) / 100;
  return (
    <DatenBuehne>
      <Kopf ueberzeile="Ein Abo, zwölf Abbuchungen" titel="Was 9,99 € im Monat kosten" ab={at(0)} />
      <Saeulen eintraege={eintraege} box={{links: 160, rechts: 1180, oben: 330, unten: 860}} nachkomma={2} labelGroesse={28} wertGroesse={32} />
      <Zaehlwerk x={1490} y={520} groesse={104} nachkomma={2} ab={at(1)} stationen={MONATE.map((_, m) => ({ab: monatAb(m), wert: Math.round(ABO * 100 * (m + 1)) / 100}))} dauer={16} />
      <Text x={1490} y={612} groesse={32} gewicht={700} farbe={DATEN.leise} ausrichtung="mitte" ab={at(1)}>
        bisher abgebucht
      </Text>
      <Text x={1490} y={720} groesse={40} gewicht={800} farbe={DATEN.text} ausrichtung="mitte" ab={at(3)}>
        12 × {euroText(ABO, 2)} = {euroText(jahr, 2)}
      </Text>
      <Legende x={160} y={940} ab={at(2)} eintraege={[{farbe: DATEN.rot, label: 'neue Abbuchung'}, {farbe: DATEN.neutral, label: 'schon bezahlt'}]} />
    </DatenBuehne>
  );
};

// ─── 3 · Punkteraster: 1 Punkt = 100 € ───────────────────────────────────────

const PRO_PUNKT = 100;

export const DemoPunkte: React.FC<{beats?: number[]}> = ({beats}) => {
  const at = (i: number) => beats?.[i] ?? [0, 24, 110, 180][i];
  const gesamt = NOTGROSCHEN / PRO_PUNKT;
  const weg = REPARATUR / PRO_PUNKT;
  const spalten = 10;
  const punkt = 58;
  const abstand = 22;
  const groesse = rasterGroesse(gesamt, spalten, punkt, abstand);
  const x = 200;
  const y = 400;
  const rechts = x + groesse.breite + 90;
  const letzteReihe = y + groesse.hoehe - punkt / 2;
  return (
    <DatenBuehne>
      <Kopf ueberzeile="So viel ist 3.000 €" titel="Jeder Punkt sind 100 €" ab={at(0)} />
      <Punkteraster
        x={x}
        y={y}
        spalten={spalten}
        punkt={punkt}
        abstand={abstand}
        gruppen={[
          {anzahl: gesamt - weg, farbe: DATEN.gruen, ab: at(1), dauer: 30},
          {anzahl: weg, farbe: DATEN.gruen, ab: at(1) + 34, dauer: 10, wechsel: {ab: at(2), farbe: DATEN.rot}},
        ]}
      />
      <Text x={rechts} y={letzteReihe} groesse={44} gewicht={800} farbe={DATEN.rot} ab={at(2) + 10}>
        {euroText(-REPARATUR)} Reparatur
      </Text>
      <Text x={rechts} y={y + punkt / 2} groesse={44} gewicht={800} farbe={DATEN.gruen} ab={at(3)}>
        {euroText(NOTGROSCHEN - REPARATUR)} bleiben
      </Text>
      <Legende x={x} y={y + groesse.hoehe + 70} ab={at(1)} eintraege={[{farbe: DATEN.gruen, label: `1 Punkt = ${euroText(PRO_PUNKT)}`}]} />
      <Quelle ab={at(1)}>Beispielrechnung: {euroText(NOTGROSCHEN)} Rücklage, Reparatur {euroText(REPARATUR)}</Quelle>
    </DatenBuehne>
  );
};

// ─── 4 · Balken: wie groß soll die Rücklage sein? ────────────────────────────

const FIXKOSTEN = 1500;

export const DemoBalken: React.FC<{beats?: number[]}> = ({beats}) => {
  const at = (i: number) => beats?.[i] ?? [0, 24, 70, 120][i];
  return (
    <DatenBuehne>
      <Kopf ueberzeile="Faustregel" titel="Drei bis sechs Monatsausgaben" ab={at(0)} />
      <Balken
        box={{links: 160, rechts: 1760, oben: 330, unten: 900}}
        zeilen={[
          {label: '1 Monat', notiz: `${euroText(FIXKOSTEN)} feste Kosten`, wert: FIXKOSTEN, ab: at(1), farbe: DATEN.neutral},
          {label: '3 Monate', notiz: 'Minimum', wert: FIXKOSTEN * 3, ab: at(2), farbe: DATEN.gruen},
          {label: '6 Monate', notiz: 'sehr sicher', wert: FIXKOSTEN * 6, ab: at(3), farbe: DATEN.blau},
        ]}
      />
      <Quelle ab={at(1)}>Beispiel: {euroText(FIXKOSTEN)} feste Kosten pro Monat (Miete, Strom, Versicherungen, Essen)</Quelle>
    </DatenBuehne>
  );
};

// ─── 5 · Linie: Inflation frisst Kaufkraft ───────────────────────────────────

const GUTHABEN = 10000;
const INFLATION = 0.02;
const JAHRE = 20;

export const DemoLinie: React.FC<{beats?: number[]}> = ({beats}) => {
  const at = (i: number) => beats?.[i] ?? [0, 20, 60, 150, 200][i];
  const jahre = Array.from({length: JAHRE + 1}, (_, j) => j);
  return (
    <DatenBuehne>
      <Kopf ueberzeile="Beispielrechnung" titel="Gleicher Betrag, weniger Kaufkraft" ab={at(0)} />
      <LinienDiagramm
        box={{links: 360, rechts: 1500, oben: 300, unten: 840}}
        xMax={JAHRE}
        yMax={GUTHABEN}
        xStriche={[0, 5, 10, 15, 20]}
        xTitel="Jahre"
        ab={at(1)}
        reihen={[
          {punkte: jahre.map((j) => ({x: j, y: GUTHABEN})), farbe: DATEN.neutral, ab: at(1), dauer: 30, label: 'Kontostand', dicke: 5},
          {punkte: jahre.map((j) => ({x: j, y: GUTHABEN / (1 + INFLATION) ** j})), farbe: DATEN.rot, ab: at(2), dauer: 120, label: 'Kaufkraft'},
        ]}
        marken={[
          {reihe: 1, x: 10, ab: at(3)},
          {reihe: 1, x: 20, ab: at(4)},
        ]}
      />
      <Quelle ab={at(1)}>Beispielrechnung: {euroText(GUTHABEN)} ohne Zinsen, 2 % Inflation pro Jahr</Quelle>
    </DatenBuehne>
  );
};

// ─── Ablauf ──────────────────────────────────────────────────────────────────

const SZENEN: Array<{komponente: React.FC<{beats?: number[]}>; dauer: number}> = [
  {komponente: DemoTopf, dauer: 270},
  {komponente: DemoAboJahr, dauer: 390},
  {komponente: DemoPunkte, dauer: 270},
  {komponente: DemoBalken, dauer: 210},
  {komponente: DemoLinie, dauer: 300},
];

export const DATEN_DEMO_FRAMES = SZENEN.reduce((summe, szene) => summe + szene.dauer, 0);

export const DatenBaukastenDemo: React.FC = () => {
  let start = 0;
  return (
    <>
      {SZENEN.map(({komponente: Szene, dauer}, index) => {
        const von = start;
        start += dauer;
        return (
          <Sequence key={index} from={von} durationInFrames={dauer}>
            <Szene />
          </Sequence>
        );
      })}
    </>
  );
};
