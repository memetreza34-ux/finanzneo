// Daten-Baukasten für YouTube-Motion (16:9) — helle Editorial-Welt.
//
// Passt zur Bildwelt `finanzneo-editorial-finance-v1` und zur hellen Motion-Welt
// (docs/FINANZNEO-YOUTUBE-MOTION-WORLD-V1.md): warmes Off-White, dunkle Schrift,
// gedämpfte Farben aus `LIGHT` (Light Motion V3). Grün = positiv, Rot = Kosten/
// Verlust, Gold nur als kleiner Geld-Akzent. Flach, 2D, kein Glow, viel Luft.
// Keine großen Szenentitel — nur Text, der Inhalt trägt.
//
// Verbindlich für jeden Baustein:
// - Größen entstehen aus den Werten (`skala`), nie von Hand. 3 Monate sind
//   dreimal so hoch wie 1 Monat; ein Punkt ist immer gleich viel Geld.
// - Jede Zahl steht am Element. Was eine Zahl zeigt, ist exakt der Wert.
// - Zeitpunkte (`ab`) sind Frames ab Visual-Start und kommen in der Animation
//   aus der Prop `beats` — so erscheint jede Stufe beim gesprochenen Wort.
//
// Koordinaten gelten im 1920×1080-Raster. Rand links/rechts 160 px.
// Bestehende Bausteine nur additiv erweitern: versiegelte Animationen nutzen sie.

import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {E, FONT, prog} from '../brand';
import {
  begrenzen,
  euroText,
  schoeneSkala,
  skala,
  wertBeiStationen,
  zaehlStellen,
  zahlText,
} from './daten-rechnung';
import type {Station} from './daten-rechnung';

export * from './daten-rechnung';

export const DATEN = {
  // Werte aus LIGHT (src/youtube-motion/light-v3/charts.tsx).
  grund: '#FAF8F2',
  papier: '#FFFFFF',
  text: '#202A25',
  leise: '#68746D',
  neutral: '#B9C4BC',
  gruen: '#4F8A67',
  rot: '#C9615B',
  orange: '#D87959',
  blau: '#5E84AE',
  gold: '#C5A050',
  linie: '#DDE4DE',
  rand: 160,
  /** Mindestgröße für Text, der auf dem Handy noch lesbar sein muss. */
  minText: 28,
  /** Unterhalb davon liegen im fertigen YouTube-Video die Untertitel — dort kein Inhalt. */
  sicherUnten: 860,
} as const;

/** Textfarbe zu einer Flächenfarbe: helle Neutralflächen bekommen lesbares Grau. */
export const lesbar = (farbe: string) => (farbe === DATEN.neutral || farbe === DATEN.linie ? DATEN.leise : farbe);

/** Einblenden mit leichtem Anstieg — die Grundbewegung aller Elemente. */
export const einblenden = (frame: number, ab: number, dauer = 12) => {
  const p = prog(frame, ab, ab + dauer);
  return {opacity: p, transform: `translateY(${((1 - p) * 16).toFixed(1)}px)`};
};

type Ausrichtung = 'links' | 'mitte' | 'rechts';
const verschiebung = (ausrichtung: Ausrichtung) =>
  ausrichtung === 'mitte' ? '-50%' : ausrichtung === 'rechts' ? '-100%' : '0';

// ─── Bühne, Kopf, Text, Quelle ───────────────────────────────────────────────

/** Schwarze 16:9-Bühne. Alles darin wird absolut im 1920×1080-Raster gesetzt. */
export const DatenBuehne: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{backgroundColor: DATEN.grund, fontFamily: FONT.body, color: DATEN.text}}>{children}</AbsoluteFill>
);

/** Kurze inhaltliche Zeile oben links (kein Szenentitel wie „Balkendiagramm“). */
export const Kopf: React.FC<{titel: string; ueberzeile?: string; ab?: number}> = ({titel, ueberzeile, ab = 0}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: DATEN.rand, top: 92}}>
      {ueberzeile ? (
        <div style={{fontSize: 24, fontWeight: 800, letterSpacing: 3, color: DATEN.leise, textTransform: 'uppercase', marginBottom: 14, ...einblenden(frame, ab)}}>
          {ueberzeile}
        </div>
      ) : null}
      <div style={{fontSize: 48, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.1, ...einblenden(frame, ab + 4)}}>{titel}</div>
    </div>
  );
};

/** Freies Label an einem Punkt. */
export const Text: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  groesse?: number;
  farbe?: string;
  gewicht?: number;
  ausrichtung?: Ausrichtung;
  ab?: number;
}> = ({x, y, children, groesse = 34, farbe = DATEN.text, gewicht = 700, ausrichtung = 'links', ab = 0}) => {
  const frame = useCurrentFrame();
  const auf = einblenden(frame, ab);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${verschiebung(ausrichtung)}, -50%) ${auf.transform}`,
        opacity: auf.opacity,
        whiteSpace: 'nowrap',
        fontSize: Math.max(DATEN.minText, groesse),
        fontWeight: gewicht,
        lineHeight: 1.1,
        color: farbe,
      }}
    >
      {children}
    </div>
  );
};

/** Beispielrechnung / Quelle unten links — Pflicht bei jeder gerechneten Zahl. */
export const Quelle: React.FC<{children: React.ReactNode; ab?: number}> = ({children, ab = 0}) => {
  const frame = useCurrentFrame();
  return (
    // Oben links: unten liegen im fertigen Video die Untertitel.
    <div style={{position: 'absolute', left: DATEN.rand, top: 40, fontSize: 24, fontWeight: 600, color: DATEN.leise, ...einblenden(frame, ab)}}>
      {children}
    </div>
  );
};

/** Farbfeld + Text, für Legenden. */
export const Legende: React.FC<{x: number; y: number; eintraege: Array<{farbe: string; label: string}>; ab?: number}> = ({x, y, eintraege, ab = 0}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', gap: 40, ...einblenden(frame, ab)}}>
      {eintraege.map((eintrag) => (
        <div key={eintrag.label} style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, fontWeight: 700, color: DATEN.leise}}>
          <span style={{width: 22, height: 22, borderRadius: 6, backgroundColor: eintrag.farbe}} />
          {eintrag.label}
        </div>
      ))}
    </div>
  );
};

// ─── Zählwerk ────────────────────────────────────────────────────────────────

const Ziffernband: React.FC<{position: number; zeile: number; unschaerfe: number}> = ({position, zeile, unschaerfe}) => (
  <span style={{display: 'inline-block', height: zeile, overflow: 'hidden', width: '0.62em', textAlign: 'center'}}>
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        transform: `translateY(${(-position * zeile).toFixed(2)}px)`,
        filter: unschaerfe > 0.4 ? `blur(${unschaerfe.toFixed(1)}px)` : undefined,
      }}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((ziffer, index) => (
        <span key={index} style={{height: zeile, lineHeight: `${zeile}px`}}>
          {ziffer}
        </span>
      ))}
    </span>
  </span>
);

/**
 * Große Zahl als mechanisches Zählwerk. Der Wert gleitet von Station zu
 * Station (`stationen`, je `ab` aus beats); steht er, ist er exakt gerundet —
 * Zählwerk und Text darunter nennen nie verschiedene Beträge.
 */
export const Zaehlwerk: React.FC<{
  x: number;
  y: number;
  stationen: Station[];
  start?: number;
  dauer?: number;
  nachkomma?: 0 | 2;
  einheit?: string;
  groesse?: number;
  farbe?: string;
  ausrichtung?: Ausrichtung;
  ab?: number;
}> = ({x, y, stationen, start = 0, dauer = 24, nachkomma = 0, einheit = '€', groesse = 120, farbe = DATEN.text, ausrichtung = 'mitte', ab = 0}) => {
  const frame = useCurrentFrame();
  const faktor = 10 ** nachkomma;
  const roh = wertBeiStationen(frame, stationen, start, dauer) * faktor;
  const tempo = Math.abs(roh - wertBeiStationen(frame - 1, stationen, start, dauer) * faktor);
  const einheiten = tempo < 1e-6 ? Math.round(roh) : roh;
  const zeile = Math.round(groesse * 1.15);
  const auf = einblenden(frame, ab);
  const zellen: React.ReactNode[] = [];
  for (const {stelle, position, sichtbarkeit} of zaehlStellen(einheiten, nachkomma + 1)) {
    const unschaerfe = begrenzen(tempo / 10 ** stelle / 2, 0, 1) * groesse * 0.08;
    zellen.push(
      <span key={stelle} style={{display: 'inline-flex', opacity: sichtbarkeit}}>
        <Ziffernband position={position} zeile={zeile} unschaerfe={unschaerfe} />
      </span>,
    );
    const ganzStelle = stelle - nachkomma;
    const trenner = nachkomma > 0 && stelle === nachkomma ? ',' : ganzStelle > 0 && ganzStelle % 3 === 0 ? '.' : null;
    if (trenner) {
      zellen.push(
        <span key={`t${stelle}`} style={{display: 'inline-block', width: '0.26em', height: zeile, lineHeight: `${zeile}px`, textAlign: 'center', opacity: sichtbarkeit}}>
          {trenner}
        </span>,
      );
    }
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${verschiebung(ausrichtung)}, -50%) ${auf.transform}`,
        opacity: auf.opacity,
        display: 'flex',
        whiteSpace: 'nowrap',
        fontSize: groesse,
        fontWeight: 800,
        letterSpacing: -1,
        fontVariantNumeric: 'tabular-nums',
        color: farbe,
      }}
    >
      {zellen}
      {einheit ? <span style={{height: zeile, lineHeight: `${zeile}px`, marginLeft: groesse * 0.2}}>{einheit}</span> : null}
    </div>
  );
};

// ─── Säulen (senkrecht) ──────────────────────────────────────────────────────

export type Teil = {wert: number; farbe?: string};
export type Saeule = {
  label: string;
  /** Ein Wert oder gestapelte Teile (unten zuerst). */
  teile: Teil[];
  ab: number;
  /** Zahl über der Säule anzeigen (Standard: ja). */
  wertZeigen?: boolean;
  hervorheben?: boolean;
};
export type Box = {links: number; rechts: number; oben: number; unten: number};

/**
 * Säulen, deren Höhe exakt aus dem Wert folgt. Jede Säule wächst ab ihrem
 * `ab` von der Grundlinie; die Zahl darüber zählt mit und steht am Ende exakt.
 */
export const Saeulen: React.FC<{
  eintraege: Saeule[];
  box: Box;
  max?: number;
  achse?: boolean;
  nachkomma?: 0 | 2;
  dauer?: number;
  maxBreite?: number;
  ziel?: {wert: number; label: string; ab: number};
  labelGroesse?: number;
  wertGroesse?: number;
}> = ({eintraege, box, max, achse = false, nachkomma = 0, dauer = 18, maxBreite = 200, ziel, labelGroesse = 30, wertGroesse = 34}) => {
  const frame = useCurrentFrame();
  const summe = (s: Saeule) => s.teile.reduce((acc, teil) => acc + teil.wert, 0);
  const hoechst = Math.max(...eintraege.map(summe), ziel?.wert ?? 0);
  const skalaInfo = schoeneSkala(hoechst);
  const obergrenze = max ?? (achse ? skalaInfo.max : hoechst);
  const hoehe = box.unten - box.oben;
  const px = skala(obergrenze, hoehe);
  const fach = (box.rechts - box.links) / eintraege.length;
  const breite = Math.min(maxBreite, fach * 0.62);
  const grund = einblenden(frame, Math.min(...eintraege.map((e) => e.ab)) - 6);

  return (
    <>
      {achse
        ? skalaInfo.striche.map((strich) => (
            <React.Fragment key={strich}>
              <div style={{position: 'absolute', left: box.links, width: box.rechts - box.links, top: box.unten - px(strich), height: 1, backgroundColor: DATEN.linie, opacity: grund.opacity}} />
              <Text x={box.links - 20} y={box.unten - px(strich)} groesse={DATEN.minText} farbe={DATEN.leise} gewicht={600} ausrichtung="rechts">
                {euroText(strich)}
              </Text>
            </React.Fragment>
          ))
        : null}
      <div style={{position: 'absolute', left: box.links, width: box.rechts - box.links, top: box.unten, height: 2, backgroundColor: DATEN.neutral, opacity: grund.opacity}} />
      {eintraege.map((eintrag, index) => {
        const p = prog(frame, eintrag.ab, eintrag.ab + dauer, E.out);
        const mitte = box.links + fach * (index + 0.5);
        let sockel = 0;
        const gesamt = summe(eintrag);
        return (
          <React.Fragment key={`${eintrag.label}-${index}`}>
            {eintrag.teile.map((teil, t) => {
              sockel += teil.wert;
              return (
                <div
                  key={t}
                  style={{
                    position: 'absolute',
                    left: mitte - breite / 2,
                    width: breite,
                    top: box.unten - px(sockel) * p,
                    // 3 px Lücke zwischen gestapelten Teilen, damit sie zählbar bleiben.
                    height: Math.max(0, px(teil.wert) * p - (t > 0 ? 3 : 0)),
                    backgroundColor: teil.farbe ?? DATEN.text,
                    borderRadius: t === eintrag.teile.length - 1 ? '8px 8px 0 0' : 0,
                    opacity: p > 0 ? 1 : 0,
                  }}
                />
              );
            })}
            {eintrag.wertZeigen !== false ? (
              <Text x={mitte} y={box.unten - px(gesamt) * p - 36} groesse={wertGroesse} gewicht={800} ausrichtung="mitte" farbe={eintrag.hervorheben ? DATEN.gruen : DATEN.text} ab={eintrag.ab}>
                {euroText(gesamt * p, nachkomma)}
              </Text>
            ) : null}
            <Text x={mitte} y={box.unten + 40} groesse={labelGroesse} gewicht={eintrag.hervorheben ? 800 : 600} ausrichtung="mitte" farbe={eintrag.hervorheben ? DATEN.text : DATEN.leise} ab={eintrag.ab}>
              {eintrag.label}
            </Text>
          </React.Fragment>
        );
      })}
      {ziel ? <ZielLinie y={box.unten - px(ziel.wert)} links={box.links} rechts={box.rechts} label={ziel.label} ab={ziel.ab} /> : null}
    </>
  );
};

/** Gestrichelte waagerechte Linie mit Label rechts — z. B. ein Sparziel. */
export const ZielLinie: React.FC<{y: number; links: number; rechts: number; label: string; ab: number; farbe?: string}> = ({y, links, rechts, label, ab, farbe = DATEN.gold}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, ab, ab + 18);
  return (
    <>
      <div style={{position: 'absolute', left: links, top: y - 1, width: (rechts - links) * p, height: 0, borderTop: `3px dashed ${farbe}`}} />
      <Text x={rechts + 18} y={y} groesse={30} farbe={farbe} gewicht={800} ab={ab + 10}>
        {label}
      </Text>
    </>
  );
};

// ─── Balken (waagerecht) ─────────────────────────────────────────────────────

export type BalkenZeile = {label: string; wert: number; ab: number; farbe?: string; notiz?: string; wertText?: string};

/**
 * Waagerechte Balken für Vergleiche. Länge exakt aus dem Wert; Label links,
 * Zahl am Balkenende zählt mit. Eine Notiz unter dem Label erklärt den Wert.
 */
export const Balken: React.FC<{
  zeilen: BalkenZeile[];
  box: Box;
  max?: number;
  labelBreite?: number;
  nachkomma?: 0 | 2;
  dauer?: number;
  balkenHoehe?: number;
}> = ({zeilen, box, max, labelBreite = 360, nachkomma = 0, dauer = 20, balkenHoehe = 64}) => {
  const frame = useCurrentFrame();
  const obergrenze = max ?? Math.max(...zeilen.map((z) => z.wert));
  const start = box.links + labelBreite;
  // Platz für die Zahl rechts am Balkenende lassen.
  const px = skala(obergrenze, box.rechts - start - 260);
  const fach = (box.unten - box.oben) / zeilen.length;
  return (
    <>
      {zeilen.map((zeile, index) => {
        const p = prog(frame, zeile.ab, zeile.ab + dauer, E.out);
        const mitte = box.oben + fach * (index + 0.5);
        const laenge = px(zeile.wert) * p;
        return (
          <React.Fragment key={`${zeile.label}-${index}`}>
            <Text x={box.links} y={zeile.notiz ? mitte - 18 : mitte} groesse={36} gewicht={800} ab={zeile.ab}>
              {zeile.label}
            </Text>
            {zeile.notiz ? (
              <Text x={box.links} y={mitte + 24} groesse={DATEN.minText} gewicht={600} farbe={DATEN.leise} ab={zeile.ab + 4}>
                {zeile.notiz}
              </Text>
            ) : null}
            <div style={{position: 'absolute', left: start, top: mitte - balkenHoehe / 2, width: laenge, height: balkenHoehe, borderRadius: '0 10px 10px 0', backgroundColor: zeile.farbe ?? DATEN.text, opacity: p > 0 ? 1 : 0}} />
            <Text x={start + laenge + 24} y={mitte} groesse={44} gewicht={800} farbe={lesbar(zeile.farbe ?? DATEN.text)} ab={zeile.ab}>
              {zeile.wertText && p >= 1 ? zeile.wertText : euroText(zeile.wert * p, nachkomma)}
            </Text>
          </React.Fragment>
        );
      })}
    </>
  );
};

// ─── Punkteraster ────────────────────────────────────────────────────────────

export type PunktGruppe = {
  anzahl: number;
  farbe: string;
  ab: number;
  /** Frames, über die die Punkte der Gruppe nacheinander erscheinen. */
  dauer?: number;
  /** Später umfärben, z. B. ausgegebenes Geld rot. */
  wechsel?: {ab: number; farbe: string; dauer?: number};
};

/**
 * Raster, in dem jeder Punkt gleich viel wert ist (`proPunkt` steht in der
 * Legende). Gruppen erscheinen nacheinander; eine Gruppe kann umfärben.
 * Die Punktzahl muss aus den Beträgen berechnet sein: 3.000 € / 100 € = 30.
 */
export const Punkteraster: React.FC<{
  x: number;
  y: number;
  spalten: number;
  gruppen: PunktGruppe[];
  punkt?: number;
  abstand?: number;
}> = ({x, y, spalten, gruppen, punkt = 40, abstand = 18}) => {
  const frame = useCurrentFrame();
  const punkte: React.ReactNode[] = [];
  let index = 0;
  for (const gruppe of gruppen) {
    const dauer = gruppe.dauer ?? 24;
    for (let i = 0; i < gruppe.anzahl; i++) {
      const ab = gruppe.ab + (gruppe.anzahl > 1 ? (dauer * i) / (gruppe.anzahl - 1) : 0);
      const p = prog(frame, ab, ab + 8, E.out);
      const w = gruppe.wechsel ? prog(frame, gruppe.wechsel.ab + ((gruppe.wechsel.dauer ?? 18) * i) / Math.max(1, gruppe.anzahl), gruppe.wechsel.ab + ((gruppe.wechsel.dauer ?? 18) * i) / Math.max(1, gruppe.anzahl) + 8) : 0;
      const spalte = index % spalten;
      const reihe = Math.floor(index / spalten);
      punkte.push(
        <div
          key={index}
          style={{
            position: 'absolute',
            left: x + spalte * (punkt + abstand),
            top: y + reihe * (punkt + abstand),
            width: punkt,
            height: punkt,
            borderRadius: '50%',
            backgroundColor: gruppe.farbe,
            opacity: p,
            transform: `scale(${(0.4 + 0.6 * p).toFixed(3)})`,
          }}
        >
          {gruppe.wechsel ? <div style={{position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: gruppe.wechsel.farbe, opacity: w}} /> : null}
        </div>,
      );
      index++;
    }
  }
  return <>{punkte}</>;
};

/** Breite und Höhe eines Punkterasters — zum Platzieren von Labels daneben. */
export const rasterGroesse = (anzahl: number, spalten: number, punkt = 40, abstand = 18) => ({
  breite: Math.min(anzahl, spalten) * (punkt + abstand) - abstand,
  hoehe: Math.ceil(anzahl / spalten) * (punkt + abstand) - abstand,
});

// ─── Topf (Füllstand mit Entnahmen und Zuflüssen) ────────────────────────────

export type Bewegung = {ab: number; betrag: number; label?: string};

/**
 * Ein Geldtopf, dessen Füllhöhe exakt dem Betrag entspricht. Eine Entnahme
 * löst die passende Scheibe oben ab, färbt sie rot und schiebt sie mit Label
 * neben den Topf. Ein Zufluss fällt als grüne Scheibe hinein. Der Betrag über
 * dem Topf zählt mit.
 */
export const Topf: React.FC<{
  x: number;
  unten: number;
  start: number;
  bewegungen?: Bewegung[];
  kapazitaet?: number;
  breite?: number;
  hoehe?: number;
  titel?: string;
  farbe?: string;
  nachkomma?: 0 | 2;
  ab?: number;
}> = ({x, unten, start, bewegungen = [], kapazitaet, breite = 300, hoehe = 560, titel, farbe = DATEN.gruen, nachkomma = 0, ab = 0}) => {
  const frame = useCurrentFrame();
  const sortiert = [...bewegungen].sort((p, q) => p.ab - q.ab);
  const staende: number[] = [start];
  for (const bewegung of sortiert) staende.push(staende[staende.length - 1] + bewegung.betrag);
  const obergrenze = kapazitaet ?? Math.max(...staende);
  const px = skala(obergrenze, hoehe);
  const auf = einblenden(frame, ab);
  const loesen = 14;
  const wandern = 26;

  // Füllstand: Entnahmen wirken sofort (die Scheibe übernimmt den Platz),
  // Zuflüsse erst, wenn die Scheibe gelandet ist.
  let stand = start;
  sortiert.forEach((bewegung, i) => {
    const fertig = bewegung.betrag < 0 ? frame >= bewegung.ab : frame >= bewegung.ab + loesen + wandern;
    if (fertig) stand = staende[i + 1];
  });

  const zaehlStationen: Station[] = sortiert.map((bewegung, i) => ({ab: bewegung.ab + loesen, wert: staende[i + 1]}));
  const links = x - breite / 2;

  return (
    <div style={{opacity: auf.opacity}}>
      {titel ? (
        <Text x={x} y={unten + 48} groesse={34} gewicht={800} ausrichtung="mitte" farbe={DATEN.leise} ab={ab}>
          {titel}
        </Text>
      ) : null}
      <div style={{position: 'absolute', left: links - 6, top: unten - hoehe - 6, width: breite + 12, height: hoehe + 12, border: `3px solid ${DATEN.neutral}`, borderTop: 'none', borderRadius: '0 0 22px 22px'}} />
      <div style={{position: 'absolute', left: links, top: unten - px(stand), width: breite, height: px(stand), backgroundColor: farbe, borderRadius: '0 0 16px 16px'}} />
      {sortiert.map((bewegung, i) => {
        const vorher = staende[i];
        const scheibe = px(Math.abs(bewegung.betrag));
        if (frame < bewegung.ab) return null;
        if (bewegung.betrag < 0) {
          const rot = prog(frame, bewegung.ab, bewegung.ab + loesen);
          const weg = prog(frame, bewegung.ab + loesen, bewegung.ab + loesen + wandern, E.inOut);
          const dx = weg * (breite + 70);
          const oben = unten - px(vorher);
          return (
            <React.Fragment key={i}>
              <div style={{position: 'absolute', left: links + dx, top: oben, width: breite, height: scheibe, backgroundColor: farbe, borderRadius: 10}}>
                <div style={{position: 'absolute', inset: 0, borderRadius: 10, backgroundColor: DATEN.rot, opacity: rot}} />
              </div>
              <Text x={links + breite + 70 + breite / 2} y={oben - 34} groesse={40} gewicht={800} farbe={DATEN.rot} ausrichtung="mitte" ab={bewegung.ab + loesen + wandern - 6}>
                {euroText(bewegung.betrag, nachkomma)}
              </Text>
              {bewegung.label ? (
                <Text x={links + breite + 70 + breite / 2} y={oben + scheibe + 34} groesse={30} gewicht={700} farbe={DATEN.leise} ausrichtung="mitte" ab={bewegung.ab + loesen + wandern}>
                  {bewegung.label}
                </Text>
              ) : null}
            </React.Fragment>
          );
        }
        const fall = prog(frame, bewegung.ab, bewegung.ab + loesen + wandern, E.inOut);
        if (fall >= 1) return null;
        return (
          <div
            key={i}
            style={{position: 'absolute', left: links, top: unten - px(vorher) - scheibe - (1 - fall) * 260, width: breite, height: scheibe, backgroundColor: farbe, opacity: fall, borderRadius: 10}}
          />
        );
      })}
      <Zaehlwerk x={x} y={unten - hoehe - 90} stationen={zaehlStationen} start={start} nachkomma={nachkomma} groesse={72} ab={ab} />
    </div>
  );
};

// ─── Liniendiagramm ──────────────────────────────────────────────────────────

export type Reihe = {punkte: Array<{x: number; y: number}>; farbe: string; ab: number; dauer?: number; label?: string; dicke?: number};
export type Marke = {reihe: number; x: number; ab: number; text?: string};

/**
 * Liniendiagramm mit geraden Achsen und runden Strichen. Jede Reihe zeichnet
 * sich ab `ab` von links nach rechts; Marken setzen einen Punkt mit Wert genau
 * auf die Kurve.
 */
export const LinienDiagramm: React.FC<{
  box: Box;
  reihen: Reihe[];
  xMax: number;
  yMax?: number;
  xStriche: number[];
  xFormat?: (wert: number) => string;
  yFormat?: (wert: number) => string;
  xTitel?: string;
  marken?: Marke[];
  ab?: number;
}> = ({box, reihen, xMax, yMax, xStriche, xFormat = (w) => zahlText(w), yFormat = (w) => euroText(w), xTitel, marken = [], ab = 0}) => {
  const frame = useCurrentFrame();
  const yInfo = schoeneSkala(yMax ?? Math.max(...reihen.flatMap((r) => r.punkte.map((p) => p.y))));
  const sx = (w: number) => box.links + skala(xMax, box.rechts - box.links)(w);
  const sy = (w: number) => box.unten - skala(yInfo.max, box.unten - box.oben)(w);
  const grund = einblenden(frame, ab);
  const yBei = (reihe: Reihe, x: number) => {
    const punkte = reihe.punkte;
    for (let i = 1; i < punkte.length; i++) {
      if (x <= punkte[i].x) {
        const t = (x - punkte[i - 1].x) / (punkte[i].x - punkte[i - 1].x || 1);
        return punkte[i - 1].y + (punkte[i].y - punkte[i - 1].y) * t;
      }
    }
    return punkte[punkte.length - 1].y;
  };
  return (
    <>
      <div style={{opacity: grund.opacity}}>
        {yInfo.striche.map((strich) => (
          <React.Fragment key={strich}>
            <div style={{position: 'absolute', left: box.links, width: box.rechts - box.links, top: sy(strich), height: 1, backgroundColor: strich === 0 ? DATEN.neutral : DATEN.linie}} />
            <Text x={box.links - 20} y={sy(strich)} groesse={DATEN.minText} farbe={DATEN.leise} gewicht={600} ausrichtung="rechts" ab={ab}>
              {yFormat(strich)}
            </Text>
          </React.Fragment>
        ))}
        {xStriche.map((strich) => (
          <Text key={strich} x={sx(strich)} y={box.unten + 36} groesse={DATEN.minText} farbe={DATEN.leise} gewicht={600} ausrichtung="mitte" ab={ab}>
            {xFormat(strich)}
          </Text>
        ))}
        {xTitel ? (
          <Text x={(box.links + box.rechts) / 2} y={box.unten + 84} groesse={30} farbe={DATEN.text} gewicht={700} ausrichtung="mitte" ab={ab}>
            {xTitel}
          </Text>
        ) : null}
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {reihen.map((reihe, index) => {
          const p = prog(frame, reihe.ab, reihe.ab + (reihe.dauer ?? 60), E.inOut);
          const xEnde = reihe.punkte[0].x + (reihe.punkte[reihe.punkte.length - 1].x - reihe.punkte[0].x) * p;
          const sichtbar = reihe.punkte.filter((punkt) => punkt.x <= xEnde);
          const pfad = [...sichtbar, {x: xEnde, y: yBei(reihe, xEnde)}].map((punkt, i) => `${i === 0 ? 'M' : 'L'}${sx(punkt.x).toFixed(1)},${sy(punkt.y).toFixed(1)}`).join(' ');
          return p > 0 ? (
            <g key={index}>
              <path d={pfad} fill="none" stroke={reihe.farbe} strokeWidth={reihe.dicke ?? 7} strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={sx(xEnde)} cy={sy(yBei(reihe, xEnde))} r={10} fill={reihe.farbe} />
            </g>
          ) : null;
        })}
      </svg>
      {reihen.map((reihe, index) =>
        reihe.label ? (
          <Text key={index} x={sx(reihe.punkte[reihe.punkte.length - 1].x) + 24} y={sy(reihe.punkte[reihe.punkte.length - 1].y)} groesse={30} gewicht={800} farbe={lesbar(reihe.farbe)} ab={reihe.ab + (reihe.dauer ?? 60)}>
            {reihe.label}
          </Text>
        ) : null,
      )}
      {marken.map((marke, index) => {
        const reihe = reihen[marke.reihe];
        const wert = yBei(reihe, marke.x);
        const p = prog(frame, marke.ab, marke.ab + 10);
        return (
          <React.Fragment key={index}>
            <div style={{position: 'absolute', left: sx(marke.x) - 12, top: sy(wert) - 12, width: 24, height: 24, borderRadius: '50%', backgroundColor: DATEN.grund, border: `5px solid ${reihe.farbe}`, opacity: p, boxSizing: 'border-box'}} />
            <Text x={sx(marke.x)} y={sy(wert) - 46} groesse={34} gewicht={800} ausrichtung="mitte" ab={marke.ab}>
              {marke.text ?? yFormat(wert)}
            </Text>
          </React.Fragment>
        );
      })}
    </>
  );
};
