// Beleg-Szene (finanzneo-youtube-beleg-v1): echter Quellen-Screenshot als Karte auf Creme.
// Die Kamera fährt zu jeder Fundstelle, sobald das passende Wort gesprochen wird, und ein
// Textmarker läuft über genau den Wortlaut, den `npm run youtube:belege` auf der Seite gefunden hat.
// Regel: docs/YOUTUBE-BELEG-SZENEN.md

import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {FONT} from '../brand';
import {DATEN} from '../design-system/daten';

export type BelegRechteck = {x: number; y: number; w: number; h: number};
export type BelegDaten = {
  /** Pfad unter public/ (staticFile). */
  bild: string;
  /** Breite des Screenshots in Seiten-CSS-Pixeln (das PNG hat die doppelte Auflösung). */
  bildBreite: number;
  quelle: string;
  host: string;
  abgerufenAm: string;
  teile: Array<BelegRechteck & {art: string}>;
  markierungen: Array<{rects: BelegRechteck[]}>;
};

const MITTE_X = 960;
const MITTE_Y = 575;
const LUECKE = 28;
const MARKER = 'rgba(255, 210, 70, 0.72)';
/** Höher zoomen macht das 2×-PNG unscharf. */
const MAX_ZOOM = 2.4;
/** Zielhöhe einer markierten Textzeile auf dem 1080p-Bild. */
const ZEILE_PX = 54;
const KAMERA_VORLAUF = 18;
const ZEILE_FRAMES = 12;
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = (frame: number, von: number, bis: number) => interpolate(frame, [von, bis], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});

type Kamera = {cx: number; cy: number; z: number};

/** Seitenkoordinaten → Kartenkoordinaten (Teile liegen mit Lücke untereinander). */
const kartenLayout = (beleg: BelegDaten) => {
  let y = 0;
  const teile = beleg.teile.map((t) => {
    const teil = {...t, kartenY: y};
    y += t.h + LUECKE;
    return teil;
  });
  const breite = Math.max(...beleg.teile.map((t) => t.w));
  const hoehe = y - LUECKE;
  const aufKarte = (r: BelegRechteck): BelegRechteck => {
    const t = teile.find((q) => r.y >= q.y && r.y + r.h <= q.y + q.h + 1) ?? teile[teile.length - 1];
    return {x: r.x - t.x, y: r.y - t.y + t.kartenY, w: r.w, h: r.h};
  };
  return {teile, breite, hoehe, aufKarte};
};

const einstellung = (zeilen: BelegRechteck[], breite: number, uebersicht: Kamera): Kamera => {
  const x0 = Math.min(...zeilen.map((r) => r.x));
  const y0 = Math.min(...zeilen.map((r) => r.y));
  const x1 = Math.max(...zeilen.map((r) => r.x + r.w));
  const y1 = Math.max(...zeilen.map((r) => r.y + r.h));
  const zeile = Math.max(...zeilen.map((r) => r.h));
  const z = Math.max(uebersicht.z, Math.min(MAX_ZOOM, ZEILE_PX / zeile, 1700 / (x1 - x0 + 40), 760 / (y1 - y0 + 40)));
  // Möglichst die ganze Textspalte zeigen; nur verschieben, wenn die Markierung sonst rausfällt.
  const halb = MITTE_X / z;
  const cx = Math.min(Math.max(breite / 2, x1 + 20 - halb), x0 - 20 + halb);
  return {cx, cy: (y0 + y1) / 2, z};
};

export const BelegVisual: React.FC<{beleg: BelegDaten; marken: number[]}> = ({beleg, marken}) => {
  const frame = useCurrentFrame();
  const {teile, breite, hoehe, aufKarte} = kartenLayout(beleg);
  const uebersicht: Kamera = {cx: breite / 2, cy: hoehe / 2, z: Math.min(1600 / breite, 800 / hoehe)};
  const markierungen = beleg.markierungen.map((m) => m.rects.map(aufKarte));
  const einstellungen = markierungen.map((zeilen) => einstellung(zeilen, breite, uebersicht));

  // Kamera: Übersicht, dann nacheinander zu jeder Markierung — jeweils kurz vor ihrem Wort.
  let kamera = uebersicht;
  einstellungen.forEach((ziel, k) => {
    const an = Math.max(14, (marken[k] ?? 0) - KAMERA_VORLAUF);
    const p = weich(frame, an, an + KAMERA_VORLAUF + 4);
    kamera = {cx: kamera.cx + (ziel.cx - kamera.cx) * p, cy: kamera.cy + (ziel.cy - kamera.cy) * p, z: kamera.z + (ziel.z - kamera.z) * p};
  });

  const auftritt = weich(frame, 0, 14);
  const quelle = weich(frame, 6, 20);
  const [jahr, monat, tag] = beleg.abgerufenAm.split('-');

  return (
    <AbsoluteFill style={{backgroundColor: DATEN.grund, overflow: 'hidden', fontFamily: FONT.body}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: breite,
          height: hoehe,
          transformOrigin: '0 0',
          transform: `translate(${MITTE_X - kamera.cx * kamera.z}px, ${MITTE_Y - kamera.cy * kamera.z + (1 - auftritt) * 40}px) scale(${kamera.z})`,
          opacity: auftritt,
          backgroundColor: DATEN.papier,
          borderRadius: 10,
          boxShadow: '0 14px 40px rgba(60, 45, 20, 0.16), 0 2px 6px rgba(60, 45, 20, 0.10)',
          overflow: 'hidden',
        }}
      >
        {teile.map((t, k) => (
          <React.Fragment key={k}>
            <div style={{position: 'absolute', left: 0, top: t.kartenY, width: t.w, height: t.h, overflow: 'hidden'}}>
              <Img src={staticFile(beleg.bild)} style={{position: 'absolute', left: -t.x, top: -t.y, width: beleg.bildBreite, maxWidth: 'none'}} />
            </div>
            {k > 0 ? <div style={{position: 'absolute', left: 32, right: 32, top: t.kartenY - LUECKE / 2, borderTop: `2px dashed ${DATEN.linie}`}} /> : null}
          </React.Fragment>
        ))}
        {markierungen.map((zeilen, k) =>
          zeilen.map((r, z) => {
            const ab = (marken[k] ?? 0) + 2 + z * ZEILE_FRAMES;
            return (
              <div
                key={`${k}-${z}`}
                style={{
                  position: 'absolute',
                  left: r.x - 3,
                  top: r.y - 1,
                  width: r.w + 6,
                  height: r.h + 2,
                  borderRadius: 3,
                  backgroundColor: MARKER,
                  mixBlendMode: 'multiply',
                  transformOrigin: 'left center',
                  transform: `scaleX(${weich(frame, ab, ab + ZEILE_FRAMES)})`,
                }}
              />
            );
          }),
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 48,
          opacity: quelle,
          padding: '14px 24px',
          borderRadius: 14,
          backgroundColor: DATEN.papier,
          boxShadow: '0 10px 28px rgba(32, 42, 37, 0.14)',
          color: DATEN.text,
        }}
      >
        <div style={{fontSize: 32, fontWeight: 800}}>Quelle: {beleg.quelle}</div>
        <div style={{marginTop: 2, fontSize: 24, fontWeight: 600, color: DATEN.leise}}>
          {beleg.host} · abgerufen am {tag}.{monat}.{jahr}
        </div>
      </div>
    </AbsoluteFill>
  );
};
