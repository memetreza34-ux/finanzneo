// Flacher Datenbaukasten für Datenszenen.
//
// Stil: schwarzer Grund, kleine grüne Überzeile, große weiße Zahl, die wie ein
// Zählwerk rollt, Balken Jahr für Jahr, Punkteraster, Icon-Reihen und
// gestrichelte Zielbalken. Kein 3D, kein Glow, viel Leerraum.
//
// Die Bausteine rechnen nichts selbst. Zahlen kommen aus `finance-motion.ts`
// (sparplanFuerAnimation, kaufkraftFuerAnimation …) oder aus einer gemessenen
// Reihe — so bleibt jede Zahl im Bild belegt (docs/PHASE-1-DATA-SCENE-STANDARD.md).
//
// Koordinaten gelten im nativen 1080×1920-Raster unter `AnimationStage`.
// Sicher sichtbar ist dort X 140–940 und Y 392–1336.
// Alle Zeitangaben sind Frames relativ zum Szenenstart.

import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, CLAMP, E, FONT, prog} from '../brand';
import type {SparplanFuerAnimation} from './finance-motion';
import {zaehlwerkStellen} from './zaehlwerk';

export {zaehlwerkStellen} from './zaehlwerk';
export type {ZaehlwerkStelle} from './zaehlwerk';

export const FLACH = {
  mitteX: 540,
  links: 140,
  rechts: 940,
  oben: 392,
  unten: 1336,
  weiss: C.white,
  gruen: C.accent,
  grau: C.gray,
  verlust: C.negativeLt,
  inaktiv: '#2E2E2E',
  linie: '#3A3A3A',
} as const;

const begrenzen = (wert: number, min: number, max: number) => Math.max(min, Math.min(max, wert));

/** Einblenden mit leichtem Anstieg, wie alle Elemente dieses Stils. */
const einblenden = (frame: number, ab: number, dauer = 12) => {
  const p = prog(frame, ab, ab + dauer);
  return {opacity: p, lift: (1 - p) * 16};
};

// ─── Text ────────────────────────────────────────────────────────────────────

export const FlachText: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  groesse?: number;
  farbe?: string;
  gewicht?: number;
  ab?: number;
  opacity?: number;
}> = ({x, y, children, groesse = 30, farbe = FLACH.weiss, gewicht = 700, ab = 0, opacity = 1}) => {
  const frame = useCurrentFrame();
  const auf = einblenden(frame, ab);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, ${auf.lift}px)`,
        whiteSpace: 'nowrap',
        fontFamily: FONT.body,
        fontSize: groesse,
        fontWeight: gewicht,
        lineHeight: 1,
        color: farbe,
        opacity: auf.opacity * opacity,
      }}
    >
      {children}
    </div>
  );
};

/** Kleine grüne Überzeile in Großbuchstaben über der Hauptzahl. */
export const Ueberzeile: React.FC<{children: React.ReactNode; y?: number; ab?: number}> = ({children, y = 400, ab = 0}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: FLACH.mitteX,
        top: y,
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
        fontFamily: FONT.body,
        fontSize: 24,
        fontWeight: 800,
        letterSpacing: 5,
        textTransform: 'uppercase',
        color: FLACH.gruen,
        opacity: prog(frame, ab, ab + 10),
      }}
    >
      {children}
    </div>
  );
};

// ─── Zählwerk ────────────────────────────────────────────────────────────────

const ZIFFERN = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const Ziffernband: React.FC<{position: number; groesse: number; unschaerfe: number}> = ({position, groesse, unschaerfe}) => {
  const zeile = Math.round(groesse * 1.1);
  return (
    <span style={{display: 'inline-block', position: 'relative', width: groesse * 0.64, height: zeile, overflow: 'hidden'}}>
      <span
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          transform: `translateY(${-position * zeile}px)`,
          filter: unschaerfe > 0.4 ? `blur(${unschaerfe.toFixed(1)}px)` : undefined,
        }}
      >
        {ZIFFERN.map((ziffer, index) => (
          <span key={index} style={{display: 'block', height: zeile, lineHeight: `${zeile}px`, textAlign: 'center'}}>
            {ziffer}
          </span>
        ))}
      </span>
    </span>
  );
};

/**
 * Große Zahl, die wie ein Zählwerk rollt. Schnell drehende Stellen verschwimmen.
 * `wertBei` liefert den Wert für einen Frame; so laufen Zahl und Grafik synchron.
 */
export const Zaehlwerk: React.FC<{
  x: number;
  y: number;
  wertBei: (frame: number) => number;
  groesse?: number;
  farbe?: string;
  einheit?: string;
  ab?: number;
}> = ({x, y, wertBei, groesse = 128, farbe = FLACH.weiss, einheit = '€', ab = 0}) => {
  const frame = useCurrentFrame();
  const roh = wertBei(frame);
  const tempo = Math.abs(roh - wertBei(frame - 1));
  // Steht die Zahl, wird kaufmännisch gerundet wie in euroText — sonst zeigte
  // 246.362,69 € als 246.362 € an, während der Text 246.363 € sagt.
  const wert = tempo === 0 ? Math.round(roh) : roh;
  const zeile = Math.round(groesse * 1.1);
  const auf = einblenden(frame, ab);
  const zellen: React.ReactNode[] = [];
  for (const {stelle, position, sichtbarkeit} of zaehlwerkStellen(wert)) {
    const unschaerfe = begrenzen(tempo / 10 ** stelle / 2, 0, 1) * groesse * 0.09;
    zellen.push(
      <span key={stelle} style={{display: 'inline-flex', opacity: sichtbarkeit}}>
        <Ziffernband position={position} groesse={groesse} unschaerfe={unschaerfe} />
      </span>,
    );
    if (stelle > 0 && stelle % 3 === 0) {
      zellen.push(
        <span key={`punkt-${stelle}`} style={{display: 'inline-block', width: groesse * 0.26, height: zeile, lineHeight: `${zeile}px`, textAlign: 'center', opacity: sichtbarkeit}}>
          .
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
        transform: `translate(-50%, ${auf.lift}px)`,
        display: 'flex',
        whiteSpace: 'nowrap',
        fontFamily: FONT.body,
        fontSize: groesse,
        fontWeight: 800,
        letterSpacing: -1,
        color: farbe,
        opacity: auf.opacity,
      }}
    >
      {zellen}
      {einheit ? <span style={{height: zeile, lineHeight: `${zeile}px`, marginLeft: groesse * 0.22}}>{einheit}</span> : null}
    </div>
  );
};

// ─── Werte, die nacheinander auftauchen ──────────────────────────────────────

export type ReihenWert = {wert: string; label: string; ab: number};

/**
 * Die Eingangswerte einer Rechnung, je Wert im Moment, in dem er gesagt wird.
 * Ab `ausblendenAb` machen sie Platz für das Ergebnis.
 */
export const WerteReihe: React.FC<{werte: ReihenWert[]; y?: number; abstand?: number; ausblendenAb?: number}> = ({
  werte,
  y = 470,
  abstand = 290,
  ausblendenAb,
}) => {
  const frame = useCurrentFrame();
  const weg = ausblendenAb === undefined ? 0 : prog(frame, ausblendenAb, ausblendenAb + 12, E.inOut);
  return (
    <>
      {werte.map((eintrag, index) => {
        const x = FLACH.mitteX + (index - (werte.length - 1) / 2) * abstand;
        const auf = einblenden(frame, eintrag.ab);
        const stil = {opacity: auf.opacity * (1 - weg), transform: `translate(-50%, ${auf.lift - weg * 40}px)`};
        return (
          <React.Fragment key={eintrag.label}>
            <div style={{position: 'absolute', left: x, top: y, whiteSpace: 'nowrap', fontFamily: FONT.body, fontSize: 92, fontWeight: 800, lineHeight: 1, color: FLACH.weiss, ...stil}}>
              {eintrag.wert}
            </div>
            <div style={{position: 'absolute', left: x, top: y + 110, whiteSpace: 'nowrap', fontFamily: FONT.body, fontSize: 26, fontWeight: 600, lineHeight: 1, color: FLACH.grau, ...stil}}>
              {eintrag.label}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

// ─── Jahresbalken ────────────────────────────────────────────────────────────

/** Jahres-Zeiger, der von `von` bis `bis` sanft durch alle Jahre läuft. */
export const jahrVerlauf = (von: number, bis: number, jahre: number) => (frame: number) =>
  interpolate(frame, [von, bis], [0, jahre], {...CLAMP, easing: E.inOut});

/** Gesamtwert des Sparplans an einem (auch gebrochenen) Jahr. */
export const sparplanWertBei = (sparplan: SparplanFuerAnimation, jahr: number): number => {
  const punkte = sparplan.jahre;
  const unten = Math.floor(jahr);
  if (unten >= punkte.length - 1) return punkte[punkte.length - 1].gesamt;
  if (unten < 0) return punkte[0].gesamt;
  return punkte[unten].gesamt + (punkte[unten + 1].gesamt - punkte[unten].gesamt) * (jahr - unten);
};

export const Legende: React.FC<{eintraege: Array<{farbe: string; label: string}>; y: number; ab?: number}> = ({eintraege, y, ab = 0}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: y,
        display: 'flex',
        justifyContent: 'center',
        gap: 40,
        fontFamily: FONT.body,
        fontSize: 26,
        fontWeight: 600,
        color: FLACH.grau,
        opacity: prog(frame, ab, ab + 12),
      }}
    >
      {eintraege.map((eintrag) => (
        <span key={eintrag.label} style={{display: 'inline-flex', alignItems: 'center', gap: 10}}>
          <span style={{width: 14, height: 14, borderRadius: '50%', background: eintrag.farbe}} />
          {eintrag.label}
        </span>
      ))}
    </div>
  );
};

/**
 * Ein Balken pro Jahr, gestapelt: unten eingezahlt (weiß), oben Zinsen (grün).
 * Die Höhen sind proportional zum Sparplan; `jahrBei` bestimmt, wie weit er
 * schon gewachsen ist.
 */
export const JahresBalken: React.FC<{
  sparplan: SparplanFuerAnimation;
  jahrBei: (frame: number) => number;
  basis?: number;
  links?: number;
  rechts?: number;
  maxHoehe?: number;
  ab?: number;
  legende?: boolean;
}> = ({sparplan, jahrBei, basis = 1220, links = 160, rechts = 920, maxHoehe = 560, ab = 0, legende = true}) => {
  const frame = useCurrentFrame();
  const jahr = jahrBei(frame);
  const punkte = sparplan.jahre.slice(1);
  const raster = (rechts - links) / Math.max(1, punkte.length);
  const skala = maxHoehe / Math.max(1, sparplan.maximum);
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={links - 6} x2={rechts + 6} y1={basis + 1} y2={basis + 1} stroke={FLACH.linie} strokeWidth={2} opacity={prog(frame, ab, ab + 12)} />
        {punkte.map((punkt, index) => {
          const wachstum = E.out(begrenzen(jahr - index, 0, 1));
          if (wachstum <= 0) return null;
          const eingezahlt = punkt.eingezahlt * skala * wachstum;
          const gesamt = punkt.gesamt * skala * wachstum;
          const x = links + index * raster + raster * 0.15;
          const breite = raster * 0.7;
          return (
            <g key={punkt.jahr}>
              <rect x={x} y={basis - eingezahlt} width={breite} height={eingezahlt} fill={FLACH.weiss} />
              <rect x={x} y={basis - gesamt} width={breite} height={Math.max(0, gesamt - eingezahlt)} rx={2} fill={FLACH.gruen} />
            </g>
          );
        })}
      </svg>
      {legende ? (
        <Legende
          y={basis + 26}
          ab={ab}
          eintraege={[
            {farbe: FLACH.weiss, label: 'eingezahlt'},
            {farbe: FLACH.gruen, label: 'Zinsen'},
          ]}
        />
      ) : null}
    </>
  );
};

// ─── Punkteraster ────────────────────────────────────────────────────────────

export type PunktGruppe = {anzahl: number; farbe: string; von: number; bis: number};

/**
 * Viele gleiche Punkte, z. B. „1 Punkt = 1.000 €“. Gruppen füllen sich
 * nacheinander, Zeile für Zeile.
 */
export const Punkteraster: React.FC<{
  gruppen: PunktGruppe[];
  spalten?: number;
  links?: number;
  breite?: number;
  oben?: number;
}> = ({gruppen, spalten = 31, links = FLACH.links, breite = FLACH.rechts - FLACH.links, oben = 660}) => {
  const frame = useCurrentFrame();
  const raster = breite / spalten;
  const radius = raster * 0.33;
  const punkte: React.ReactNode[] = [];
  let index = 0;
  for (const gruppe of gruppen) {
    for (let i = 0; i < gruppe.anzahl; i++, index++) {
      const ab = gruppe.von + (gruppe.anzahl > 1 ? (i / (gruppe.anzahl - 1)) * (gruppe.bis - gruppe.von) : 0);
      const zeigen = prog(frame, ab, ab + 6);
      if (zeigen <= 0) continue;
      punkte.push(
        <circle
          key={index}
          cx={links + raster / 2 + (index % spalten) * raster}
          cy={oben + raster / 2 + Math.floor(index / spalten) * raster}
          r={radius * zeigen}
          fill={gruppe.farbe}
          opacity={zeigen}
        />,
      );
    }
  }
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {punkte}
    </svg>
  );
};

// ─── Icon-Reihe ──────────────────────────────────────────────────────────────

export type FlachIcon = 'wagen' | 'person' | 'schein';

const IconForm: React.FC<{icon: FlachIcon; farbe: string}> = ({icon, farbe}) => {
  if (icon === 'person') {
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <circle cx="12" cy="7.5" r="4" fill={farbe} />
        <path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5z" fill={farbe} />
      </svg>
    );
  }
  if (icon === 'schein') {
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke={farbe} strokeWidth={1.7}>
        <rect x="2.5" y="6" width="19" height="12" rx="1.8" fill={farbe} fillOpacity={0.25} />
        <circle cx="12" cy="12" r="2.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke={farbe} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 3.5h2.6l2.4 11a1.8 1.8 0 0 0 1.8 1.4h8.4a1.8 1.8 0 0 0 1.75-1.4L21 7.5H6.2" />
      <path d="M6.9 8.6h12.7l-1.1 5.1H8z" fill={farbe} stroke="none" />
      <circle cx="9.6" cy="20" r="1.5" fill={farbe} stroke="none" />
      <circle cx="17.6" cy="20" r="1.5" fill={farbe} stroke="none" />
    </svg>
  );
};

/**
 * Gleiche Icons in Reihen. `aktivBei` liefert, wie viele davon aktiv sind
 * (auch gebrochen); der Rest wird von hinten grau.
 */
export const IconReihe: React.FC<{
  anzahl: number;
  aktivBei: (frame: number) => number;
  icon?: FlachIcon;
  spalten?: number;
  oben?: number;
  groesse?: number;
  abstandX?: number;
  abstandY?: number;
  farbe?: string;
  ab?: number;
}> = ({anzahl, aktivBei, icon = 'wagen', spalten = 5, oben = 720, groesse = 132, abstandX = 160, abstandY = 180, farbe = FLACH.weiss, ab = 0}) => {
  const frame = useCurrentFrame();
  const aktiv = aktivBei(frame);
  const zeilenLaenge = Math.min(spalten, anzahl);
  return (
    <>
      {Array.from({length: anzahl}, (_, index) => {
        const fuellung = begrenzen(aktiv - index, 0, 1);
        const auf = einblenden(frame, ab + index * 1.5, 10);
        const spalte = index % spalten;
        const x = FLACH.mitteX + (spalte - (zeilenLaenge - 1) / 2) * abstandX - groesse / 2;
        const y = oben + Math.floor(index / spalten) * abstandY;
        return (
          <div key={index} style={{position: 'absolute', left: x, top: y + auf.lift, width: groesse, height: groesse, opacity: auf.opacity}}>
            <div style={{position: 'absolute', inset: 0}}>
              <IconForm icon={icon} farbe={FLACH.inaktiv} />
            </div>
            <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${((1 - fuellung) * 100).toFixed(2)}% 0 0)`}}>
              <IconForm icon={icon} farbe={farbe} />
            </div>
          </div>
        );
      })}
    </>
  );
};

// ─── Zielbalken ──────────────────────────────────────────────────────────────

export type ZielBalkenEintrag = {label: string; untertitel?: string; wert: number; farbe?: string; von: number; bis: number};

/**
 * Gestrichelte Umrisse zeigen zuerst, wohin es geht; dann füllen sich die
 * Balken nacheinander, jeder mit eigenem Zählwerk.
 */
export const ZielBalken: React.FC<{
  balken: ZielBalkenEintrag[];
  basis?: number;
  maxHoehe?: number;
  breite?: number;
  abstand?: number;
  ab?: number;
}> = ({balken, basis = 1150, maxHoehe = 520, breite = 170, abstand = 270, ab = 0}) => {
  const frame = useCurrentFrame();
  const maximum = Math.max(1, ...balken.map((eintrag) => eintrag.wert));
  const umriss = prog(frame, ab + 6, ab + 20);
  return (
    <>
      {balken.map((eintrag, index) => {
        const x = FLACH.mitteX + (index - (balken.length - 1) / 2) * abstand;
        const hoehe = (eintrag.wert / maximum) * maxHoehe;
        const farbe = eintrag.farbe ?? FLACH.weiss;
        const fuellungBei = (f: number) => interpolate(f, [eintrag.von, eintrag.bis], [0, 1], {...CLAMP, easing: E.inOut});
        const fuellung = fuellungBei(frame);
        return (
          <React.Fragment key={eintrag.label}>
            <div style={{position: 'absolute', left: x - breite / 2, top: basis - hoehe, width: breite, height: hoehe, border: '3px dashed #4A4A4A', borderRadius: 10, opacity: umriss}} />
            <div style={{position: 'absolute', left: x - breite / 2, top: basis - hoehe * fuellung, width: breite, height: hoehe * fuellung, background: farbe, borderRadius: 10}} />
            <Zaehlwerk x={x} y={basis - hoehe - 70} groesse={40} farbe={farbe} wertBei={(f) => eintrag.wert * fuellungBei(f)} ab={eintrag.von - 6} />
            <FlachText x={x} y={basis + 26} groesse={30} gewicht={800} ab={ab}>{eintrag.label}</FlachText>
            {eintrag.untertitel ? (
              <FlachText x={x} y={basis + 66} groesse={26} gewicht={600} farbe={FLACH.grau} ab={ab}>{eintrag.untertitel}</FlachText>
            ) : null}
          </React.Fragment>
        );
      })}
    </>
  );
};
