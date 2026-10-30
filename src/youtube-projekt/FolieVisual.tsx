// Erklär-Folie (finanzneo-youtube-folie-v1): Stichpunkte oder eine große Zahl auf Kanal-Creme.
// Jede Zeile erscheint beim gesprochenen Wort; der betonte Teil bekommt den gelben FinanzNeo-Marker
// (derselbe wie in Belegen und auf dem Cover). Die aktuelle Zeile ist voll, ältere treten zurück.
// Regel: docs/YOUTUBE-BILDMIX-UND-COVER.md

import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {FONT} from '../brand';
import {DATEN} from '../design-system/daten';

export type FolieDaten = {
  titel?: string;
  zeilen?: Array<{text: string; betont?: string}>;
  zahl?: {wert: string; label: string};
};

const MARKER = 'rgba(255, 205, 60, 0.85)';
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = (frame: number, von: number, dauer: number) => interpolate(frame, [von, von + dauer], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});

/** Text mit gelbem Marker hinter `betont`, der ab Frame `ab` von links nach rechts läuft. */
const MitMarker: React.FC<{text: string; betont?: string; ab: number}> = ({text, betont, ab}) => {
  const frame = useCurrentFrame();
  const i = betont ? text.indexOf(betont) : -1;
  if (!betont || i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span style={{position: 'relative', display: 'inline-block'}}>
        <span
          style={{
            position: 'absolute',
            left: '-0.1em',
            right: '-0.1em',
            top: '0.12em',
            bottom: '0.02em',
            zIndex: 0,
            borderRadius: '0.08em',
            backgroundColor: MARKER,
            transformOrigin: 'left center',
            transform: `rotate(-1deg) scaleX(${weich(frame, ab, 12)})`,
          }}
        />
        <span style={{position: 'relative', zIndex: 1}}>{betont}</span>
      </span>
      {text.slice(i + betont.length)}
    </>
  );
};

const Titel: React.FC<{titel: string; gross?: boolean}> = ({titel, gross}) => {
  const frame = useCurrentFrame();
  const p = weich(frame, 0, 12);
  return (
    <div style={{opacity: p, transform: `translateY(${((1 - p) * 16).toFixed(1)}px)`, textAlign: gross ? 'center' : 'left'}}>
      <div style={{fontSize: 80, fontWeight: 800, color: DATEN.text, letterSpacing: -0.5}}>{titel}</div>
      <div style={{width: 96, height: 8, borderRadius: 4, backgroundColor: DATEN.gruen, marginTop: 18, marginLeft: gross ? 'auto' : 0, marginRight: gross ? 'auto' : 0}} />
    </div>
  );
};

const Liste: React.FC<{folie: FolieDaten; marken: number[]}> = ({folie, marken}) => {
  const frame = useCurrentFrame();
  const zeilen = folie.zeilen ?? [];
  // Die zuletzt erschienene Zeile ist die aktuelle; alle anderen treten etwas zurück.
  const aktuell = marken.reduce((a, m, k) => (frame >= m ? k : a), -1);
  return (
    // Block als Ganzes mittig, Text darin linksbündig — so bleibt keine leere rechte Hälfte.
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 52, maxWidth: 1920 - 2 * DATEN.rand}}>
      {folie.titel ? <Titel titel={folie.titel} /> : null}
      <div style={{display: 'flex', flexDirection: 'column', gap: 40}}>
        {zeilen.map((z, k) => {
          const ab = marken[k] ?? 0;
          const p = weich(frame, ab, 12);
          const zurueck = k < aktuell ? 0.5 : 1;
          return (
            <div
              key={k}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                opacity: p * zurueck,
                transform: `translateY(${((1 - p) * 18).toFixed(1)}px)`,
                fontSize: 72,
                fontWeight: 700,
                color: DATEN.text,
                lineHeight: 1.15,
              }}
            >
              <span style={{flex: 'none', width: 68, height: 68, borderRadius: 34, backgroundColor: DATEN.gruen, color: DATEN.papier, fontSize: 38, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {k + 1}
              </span>
              <span>
                <MitMarker text={z.text} betont={z.betont} ab={ab + 6} />
              </span>
            </div>
          );
        })}
      </div>
      </div>
    </AbsoluteFill>
  );
};

const Zahl: React.FC<{folie: FolieDaten; marken: number[]}> = ({folie, marken}) => {
  const frame = useCurrentFrame();
  const ab = marken[0] ?? 0;
  const p = weich(frame, ab, 14);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 36}}>
      {folie.titel ? <Titel titel={folie.titel} gross /> : null}
      <div style={{opacity: p, transform: `scale(${(0.9 + 0.1 * p).toFixed(3)})`, fontSize: 230, fontWeight: 800, color: DATEN.text, letterSpacing: -4, lineHeight: 1}}>
        <MitMarker text={folie.zahl?.wert ?? ''} betont={folie.zahl?.wert} ab={ab + 8} />
      </div>
      <div style={{opacity: weich(frame, ab + 8, 12), fontSize: 56, fontWeight: 700, color: DATEN.leise}}>{folie.zahl?.label}</div>
    </AbsoluteFill>
  );
};

export const FolieVisual: React.FC<{folie: FolieDaten; marken: number[]}> = ({folie, marken}) => (
  <AbsoluteFill style={{backgroundColor: DATEN.grund, fontFamily: FONT.body}}>
    {folie.zahl ? <Zahl folie={folie} marken={marken} /> : <Liste folie={folie} marken={marken} />}
  </AbsoluteFill>
);
