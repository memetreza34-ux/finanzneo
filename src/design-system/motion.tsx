// FinanzNeo Motion — Bewegung fuer Reels und YouTube gleichermassen.
//
// Diese Datei lag vorher in `src/youtube/`. Damit kamen die Reels nicht an sie
// heran, obwohl sie das haeufigere Format sind: neun Projekte gegen zwei. Jede
// Verbesserung haette dort zweimal gebaut werden muessen.
//
// Sie enthaelt bewusst nur Bauteile, keine fertigen Mechaniken. Wie etwas faellt
// steht hier; was faellt und warum, entscheidet die Szene.

import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {fitText} from '@remotion/layout-utils';
import {getLength, getPointAtLength} from '@remotion/paths';
import {FONT} from '../brand/fonts';

/**
 * Bewegung mit Beschleunigung statt linear.
 *
 * Bis hierher lief jede Animation im Projekt auf blankem `interpolate` ohne
 * Easing — 36 von 36. Eine lineare Bewegung startet und stoppt abrupt und wirkt
 * dadurch mechanisch, egal wie gut das Objekt aussieht. Das ist der Hauptgrund,
 * warum die Motion neben den Flow-Bildern billig wirkte.
 *
 * `ease` ist die Standardrampe für alles, was einsetzt, ankommt oder sich
 * aufbaut: schnell los, sanft aus. `settle` ist für Dinge, die physisch an einem
 * Ort ankommen und dabei kurz nachgeben.
 */
export const ease = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

/** Ankommen mit kurzem Nachgeben — für Objekte, die sich irgendwo absetzen. */
export const settle = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.4)),
  });

/** Gleichmäßig — nur für Dinge, die wirklich gleichförmig laufen, etwa Rotation. */
export const linear = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/**
 * Motion-V3-Timing: Beats werden als Anteil der finalen Szenendauer ausgedrückt,
 * damit Phase 3 auf das echte Voiceover retimen kann, ohne einen eingefrorenen
 * Schwanz zu erzeugen.
 */
export const frameAt = (durationInFrames: number, ratio: number) => (
  Math.max(0, Math.round((Math.max(2, durationInFrames) - 1) * clamp01(ratio)))
);

export const progressBetween = (
  frame: number,
  durationInFrames: number,
  startRatio: number,
  endRatio: number,
) => {
  const start = frameAt(durationInFrames, startRatio);
  const end = Math.max(start + 1, frameAt(durationInFrames, endRatio));
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

/**
 * Schriftgröße, bei der ein Text garantiert in seine Breite passt.
 *
 * Labels in Animationen sind unterschiedlich lang — „Dispo" und
 * „Berufsunfähigkeitsversicherung" stehen im selben Feld. Bisher wurde die
 * Größe geschätzt und lange Wörter liefen über oder wurden abgeschnitten.
 * `fitText` misst wirklich nach. `@remotion/layout-utils` lag installiert und
 * ungenutzt im Projekt.
 *
 * Die Schrift muss geladen sein — `fonts.ts` erledigt das auf Modulebene.
 */
export const fitLabel = (
  text: string,
  withinWidth: number,
  options: {max?: number; weight?: number} = {},
) => {
  const {max = 48, weight = 800} = options;
  const {fontSize} = fitText({
    text,
    withinWidth,
    fontFamily: FONT.body,
    fontWeight: String(weight),
  });
  return Math.min(fontSize, max);
};

/**
 * Ein Gegenstand, der hereinfällt und liegen bleibt.
 *
 * Das ist der am häufigsten gebrauchte Bewegungsablauf im Kanal und bisher hat
 * ihn jede Szene neu gebaut — meist als blankes `interpolate` auf y. Herausgekommen
 * ist Bewegung, die aussieht, als würde der Gegenstand gezogen.
 *
 * Diese Funktion liefert den kompletten Zustand eines fallenden Körpers:
 *
 * - `offsetY` — der Fall selbst, mit Überschwingen beim Aufsetzen
 * - `swingX` — ein seitlicher Bogen; eine reine Senkrechte liest sich als Maschine
 * - `rotate` — Drehung, die den Fall überdauert (Nachlauf, verkauft Gewicht)
 * - `scaleX`/`scaleY` — Strecken im Fall, Stauchen beim Aufprall
 * - `impact` — Aufprallpuls 0…1, etwa für Erschütterung der Umgebung
 * - `contact` — 0…1 Nähe zum Boden, für `ContactShadow`
 * - `progress` — 0…1 Sichtbarkeit
 *
 * Alle Werte kommen aus `interpolate` mit Easing und sind damit deterministisch.
 */
export type DropMotion = {
  progress: number;
  offsetY: number;
  swingX: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  impact: number;
  contact: number;
};

export const dropIn = (
  frame: number,
  options: {
    /** Frame, an dem der Gegenstand losfällt. */
    start: number;
    /** Dauer des Falls. Schwerere Gegenstände brauchen mehr. */
    duration?: number;
    /** Fallhöhe über der Ruhelage. */
    from?: number;
    /** Endneigung in Grad. Bogen und Anfangsdrehung leiten sich daraus ab. */
    tilt?: number;
  },
): DropMotion => {
  const {start, duration = 22, from = 260, tilt = 0} = options;
  const land = start + duration;

  const fall = settle(frame, start, land);
  const swing = ease(frame, start, land + 4);
  const spin = ease(frame, start, land + 12);

  // Kurzer Puls genau im Aufschlag, der wieder ausläuft.
  const impact = ease(frame, land - 2, land + 3) - ease(frame, land + 3, land + 16);
  // Im schnellen Teil des Falls längt sich der Körper.
  const stretch = (1 - ease(frame, start, land - 4)) * 0.12;

  return {
    progress: fall,
    offsetY: interpolate(fall, [0, 1], [-from, 0]),
    swingX: interpolate(swing, [0, 1], [tilt * 4.5, 0]),
    rotate: interpolate(spin, [0, 1], [tilt * 3.4, tilt]),
    scaleX: 1 - stretch * 0.55 + impact * 0.13,
    scaleY: 1 + stretch - impact * 0.16,
    impact,
    contact: ease(frame, land - 8, land),
  };
};

/**
 * Langsame Kamerafahrt über der ganzen Szene.
 *
 * Eine stehende Kamera lässt auch gute Bewegung wie eine Grafik wirken. `to`
 * über 1 fährt heran, unter 1 fährt zurück — Zurückfahren passt, wenn etwas
 * wächst und der Rahmen mitwachsen soll.
 */
export const CameraPush: React.FC<{
  children: React.ReactNode;
  from?: number;
  to?: number;
  start?: number;
  end?: number;
}> = ({children, from = 1, to = 1.055, start = 0, end = 200}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{transform: `scale(${interpolate(ease(frame, start, end), [0, 1], [from, to])})`}}>
      {children}
    </AbsoluteFill>
  );
};

/**
 * Bewegungsunschärfe kommt aus dem Brand-Kit.
 *
 * `CameraBlur` dort ist bereits `CameraMotionBlur` mit denselben Vorgaben. Eine
 * zweite Fassung hier waere dieselbe Komponente unter anderem Namen.
 */
export {CameraBlur} from '../brand/components/Effects';

/**
 * Ein Punkt auf einem Pfad.
 *
 * Damit folgt etwas einer Strecke statt sich nur geradeaus zu bewegen: Geld,
 * das durch mehrere Stationen läuft, eine Rate, die ihren Weg zum Depot nimmt,
 * ein Wert entlang einer Kurve. Zusammen mit `DrawnLine`, das denselben Pfad
 * zeichnet, ergibt das Strecke und Reisenden aus einer Quelle.
 */
export const pointOnPath = (d: string, progress: number) => {
  const laenge = getLength(d);
  const punkt = getPointAtLength(d, laenge * Math.max(0, Math.min(1, progress)));
  // Nur bei einem leeren Pfad null. Dann liegt der Reisende im Ursprung.
  return punkt ? {x: punkt.x, y: punkt.y} : {x: 0, y: 0};
};
