// FinanzNeo Objekt-Baukasten — gezeichnete Alltagsgegenstände für Animationen.
//
// Warum es diese Datei gibt: Der Standard verbietet beschriftete Kästen als
// Hauptsprache (CLAUDE.md §11), aber der Baukasten hatte bisher nur
// `PhysicalObject` und `PhysicalTag` anzubieten — also genau Kästen. Wer einen
// Koffer brauchte, schrieb `<PhysicalObject>Koffer</PhysicalObject>`.
//
// Ein gezeichneter Gegenstand erkennt man ohne Ton und ohne Beschriftung. Die
// Objekte hier sind bewusst SVG und nicht CSS-Divs mit Farbverlauf: eine Form
// mit echten Pfaden bleibt bei jeder Größe scharf, lässt sich über
// `strokeDasharray` oder `clipPath` aufdecken und liest sich nicht als Karte.
//
// Diese Datei wächst mit der Produktion. Jede Szene, die einen neuen Gegenstand
// braucht, legt ihn hier ab statt in ihrer eigenen animation.tsx — sonst
// zeichnet die nächste Szene ihn erneut.

import React from 'react';
import {evolvePath} from '@remotion/paths';

/**
 * Eine Linie, die sich selbst zeichnet.
 *
 * Das ist das allgemeinste Bauteil im ganzen Kasten: Geldfluss, Pfeil,
 * Wachstumskurve, Verbindung zwischen zwei Dingen, Zeitstrahl — alles davon ist
 * eine Linie, die entsteht. Bisher wurde so etwas mit wachsenden `<div>`-Balken
 * gebaut, was nur waagerecht und senkrecht funktioniert.
 *
 * `evolvePath` aus `@remotion/paths` rechnet dafür `strokeDasharray` und
 * `strokeDashoffset` aus. Das Paket lag installiert und ungenutzt im Projekt.
 *
 * `d` ist ein normaler SVG-Pfad im Koordinatensystem `width × height`.
 */
export const DrawnLine: React.FC<{
  d: string;
  /** 0 = noch nichts gezeichnet, 1 = fertig. */
  progress: number;
  width: number;
  height: number;
  stroke?: string;
  strokeWidth?: number;
  round?: boolean;
  style?: React.CSSProperties;
}> = ({d, progress, width, height, stroke = '#DDE6EC', strokeWidth = 6, round = true, style}) => {
  const evolution = evolvePath(Math.max(0, Math.min(1, progress)), d);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={style}>
      <path
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={round ? 'round' : 'butt'}
        strokeDasharray={evolution.strokeDasharray}
        strokeDashoffset={evolution.strokeDashoffset}
        fill="none"
      />
    </svg>
  );
};
DrawnLine.displayName = 'DrawnLine';

/**
 * Grundformen zum Zusammensetzen.
 *
 * Bewusst nur durchgereicht, nicht verpackt: aus Kreis, Rechteck, Dreieck,
 * Kreissegment und Pfeil lässt sich jeder Gegenstand bauen, den ein Thema
 * gerade braucht. Ein fertiger Katalog von Gegenständen würde dagegen immer nur
 * zu den Themen passen, für die er gemacht wurde.
 *
 * `Pie` ist für Anteile direkt brauchbar, `Arrow` ersetzt Pfeile als Textzeichen.
 */
export {Arrow, Circle, Ellipse, Pie, Polygon, Rect, Star, Triangle} from '@remotion/shapes';

/** Gemeinsame Materialtöne, damit alle Objekte aus derselben Welt stammen. */
export const OBJECT_TONES = {
  steel: '#B9C2C8',
  steelDark: '#6C757B',
  rubber: '#23282C',
  ivory: '#D9CFBB',
  ivoryEdge: '#8E8878',
  ivoryMid: '#B3A992',
  glass: 'rgba(190,220,238,0.16)',
  glassRim: '#DDE6EC',
  slate: '#6E767C',
  slateRim: '#9AA6AD',
} as const;

export type ObjectProps = {
  /** Sichtbare Breite in Frame-Pixeln. Die Höhe folgt dem Seitenverhältnis. */
  width: number;
};

/** Brille: zwei Gläser, Steg, Bügel. Seitenverhältnis 200 × 72. */
export const ObjectGlasses: React.FC<ObjectProps> = ({width}) => (
  <svg width={width} height={width * 0.36} viewBox="0 0 200 72" fill="none">
    <path d="M8 24 H42" stroke={OBJECT_TONES.slateRim} strokeWidth={6} strokeLinecap="round" />
    <path d="M192 24 H158" stroke={OBJECT_TONES.slateRim} strokeWidth={6} strokeLinecap="round" />
    <circle cx={66} cy={40} r={26} fill={OBJECT_TONES.glass} stroke={OBJECT_TONES.glassRim} strokeWidth={7} />
    <circle cx={134} cy={40} r={26} fill={OBJECT_TONES.glass} stroke={OBJECT_TONES.glassRim} strokeWidth={7} />
    <path d="M92 36 q8 -8 16 0" stroke={OBJECT_TONES.glassRim} strokeWidth={6} fill="none" strokeLinecap="round" />
  </svg>
);
ObjectGlasses.displayName = 'ObjectGlasses';

/** Koffer: Hartschale mit Griff, Riemen und zwei Schlössern. 250 × 160. */
export const ObjectSuitcase: React.FC<ObjectProps> = ({width}) => (
  <svg width={width} height={width * 0.64} viewBox="0 0 250 160" fill="none">
    <path d="M96 20 q29 -14 58 0" stroke={OBJECT_TONES.ivoryEdge} strokeWidth={10} fill="none" strokeLinecap="round" />
    <rect x={10} y={22} width={230} height={128} rx={18} fill={OBJECT_TONES.ivory} stroke={OBJECT_TONES.ivoryEdge} strokeWidth={3} />
    <rect x={10} y={22} width={230} height={128} rx={18} fill="url(#fnCaseShade)" />
    <path d="M78 22 V150" stroke={OBJECT_TONES.ivoryMid} strokeWidth={7} />
    <path d="M172 22 V150" stroke={OBJECT_TONES.ivoryMid} strokeWidth={7} />
    <rect x={66} y={74} width={24} height={20} rx={5} fill={OBJECT_TONES.ivoryEdge} />
    <rect x={160} y={74} width={24} height={20} rx={5} fill={OBJECT_TONES.ivoryEdge} />
    <defs>
      <linearGradient id="fnCaseShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.30)" />
      </linearGradient>
    </defs>
  </svg>
);
ObjectSuitcase.displayName = 'ObjectSuitcase';

/** Fahrrad-Laufrad: Reifen, Felge, acht Speichen, Nabe. Quadratisch. */
export const ObjectBikeWheel: React.FC<ObjectProps> = ({width}) => (
  <svg width={width} height={width} viewBox="0 0 170 170" fill="none">
    <circle cx={85} cy={85} r={77} stroke={OBJECT_TONES.rubber} strokeWidth={15} />
    <circle cx={85} cy={85} r={65} stroke={OBJECT_TONES.steel} strokeWidth={5} />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <path
        key={deg}
        d={`M85 85 L${(85 + 63 * Math.cos((deg * Math.PI) / 180)).toFixed(2)} ${(85 + 63 * Math.sin((deg * Math.PI) / 180)).toFixed(2)}`}
        stroke={OBJECT_TONES.slateRim}
        strokeWidth={3}
      />
    ))}
    <circle cx={85} cy={85} r={11} fill={OBJECT_TONES.steel} stroke={OBJECT_TONES.steelDark} strokeWidth={3} />
  </svg>
);
ObjectBikeWheel.displayName = 'ObjectBikeWheel';

/** Namenloser Gegenstand für "und viele mehr". 186 × 104. */
export const ObjectCrate: React.FC<ObjectProps> = ({width}) => (
  <svg width={width} height={width * 0.559} viewBox="0 0 186 104" fill="none">
    <rect x={6} y={8} width={174} height={90} rx={14} fill={OBJECT_TONES.slate} stroke={OBJECT_TONES.slateRim} strokeWidth={3} />
    <path d="M6 40 H180" stroke={OBJECT_TONES.slateRim} strokeWidth={3} />
  </svg>
);
ObjectCrate.displayName = 'ObjectCrate';

/**
 * Tisch in leichter Aufsicht, mit durchhängender Platte.
 *
 * `sag` biegt die Platte nach unten. Eine Fläche, die unter Last nachgibt, ist
 * ein eigener Bewegungskanal: die Gegenstände fallen, und unabhängig davon
 * reagiert der Untergrund. Ohne so eine Fläche schweben Gegenstände im Nichts.
 */
export const ObjectTable: React.FC<{width?: number; sag?: number}> = ({width = 980, sag = 0}) => (
  <svg width={width} height={width * 0.153} viewBox="0 0 980 150" fill="none">
    <path
      d={`M60 20 H920 L968 ${72 + sag} Q490 ${94 + sag * 2.4} 12 ${72 + sag} Z`}
      fill="url(#fnTableTop)"
      stroke="#5A6268"
      strokeWidth={2}
    />
    <path
      d={`M12 ${72 + sag} Q490 ${94 + sag * 2.4} 968 ${72 + sag} L968 ${90 + sag} Q490 ${112 + sag * 2.4} 12 ${90 + sag} Z`}
      fill="#4A5157"
    />
    <path d={`M96 ${88 + sag} L84 150`} stroke="#3C4348" strokeWidth={14} strokeLinecap="round" />
    <path d={`M884 ${88 + sag} L896 150`} stroke="#3C4348" strokeWidth={14} strokeLinecap="round" />
    <defs>
      <linearGradient id="fnTableTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8D959B" />
        <stop offset="100%" stopColor="#636B71" />
      </linearGradient>
    </defs>
  </svg>
);
ObjectTable.displayName = 'ObjectTable';

/**
 * Kontaktschatten unter einem Gegenstand.
 *
 * Auf reinem Schwarz ist ein Schatten unsichtbar — er wirkt nur dort, wo etwas
 * Helles darunter liegt: Tisch, Koffer, Platte. Genau so verhält sich ein
 * echter Schatten auch. Ohne ihn schwebt jeder Gegenstand, egal wie gut die
 * Bewegung ist.
 *
 * `spread` ist die Breite relativ zum Gegenstand: beim Aufsetzen schmal und
 * dunkel, aus der Höhe breit und blass.
 */
export const ContactShadow: React.FC<{
  x: number;
  y: number;
  width: number;
  /** 0 = weit weg (breit, blass), 1 = aufgesetzt (schmal, dunkel). */
  contact: number;
  opacity?: number;
}> = ({x, y, width, contact, opacity = 1}) => {
  const tight = Math.max(0, Math.min(1, contact));
  const spread = width * (1.15 - tight * 0.35);
  const height = Math.max(12, width * 0.19 * (1.2 - tight * 0.35));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        translate: `${x + width / 2 - spread / 2}px ${y - height / 2}px`,
        width: spread,
        height,
        borderRadius: '50%',
        background: `radial-gradient(ellipse at center, rgba(0,0,0,${(0.3 + tight * 0.45).toFixed(3)}) 0%, rgba(0,0,0,0) 70%)`,
        opacity,
      }}
    />
  );
};
ContactShadow.displayName = 'ContactShadow';
