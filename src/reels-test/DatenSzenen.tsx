// Vier Reel-Szenen, die ohne einen einzigen Flow-Bildjob entstehen.
//
// Die Bildwelt V9 verlangt für Alltagssituationen echte Flow-Bilder, und daran
// ändert sich nichts. Es gibt aber eine Gruppe von Aussagen, für die ein Foto
// oder ein gerendertes Objekt gar nichts beitragen könnte: Aussagen über
// Grössenverhältnisse. Wie unruhig zehn Jahre Weltmarkt wirklich sind, wie viel
// von einem Endwert nie eingezahlt wurde, wie weit ein Puffer noch vom Ziel ist
// — das sind Verhältnisse, und Verhältnisse zeigt man, indem man sie zeichnet.
//
// Deshalb holen die Szenen ihre Zahlen, statt sie zu behaupten: Szene 1 und 4
// aus einer abgerufenen Kursreihe unter public/data/, Szene 2 aus der
// Sparplanrechnung, Szene 3 aus den Fixkosten, die sie selbst nennt. Wo eine
// Zahl gemessen ist, steht die Quelle mit Stand im Bild; wo sie angenommen ist,
// steht die Annahme darunter.
//
// 1 Gemessene Reihe    die echte Kurve zeichnet sich, der tiefste Fall bleibt stehen
// 2 Zwei Flächen       Eingezahltes und Zinsen wachsen getrennt übereinander
// 3 Füllstand          ein Behälter füllt sich, bis die Ziellinie erreicht ist
// 4 Zwei Wege          gerechnete Annahme gegen gemessene Wirklichkeit

import React from 'react';
import {AbsoluteFill, Series, useCurrentFrame} from 'remotion';
import {
  AnimationStage,
  C,
  Captions,
  FONT,
  REEL_STYLE,
  SceneHeader,
  SceneTransition,
  VISUAL_TOP,
  clamp01,
  ease,
  euroText,
  kursPfad,
  kursreiheFuerAnimation,
  settle,
  sparplanFuerAnimation,
} from '../design-system';
import type {CaptionWord} from '../design-system';
import msciWorld from '../../public/data/msci-world-live.json';

const SZENE_FRAMES = 150;
export const DATEN_SZENEN_FRAMES = 4 * SZENE_FRAMES;

/** Der Reel-Hintergrund bleibt #000000 — hier stehen nur Vordergrundtöne. */
const TON = {
  ink: C.white,
  dim: C.graySoft,
  gruen: C.accent,
  gold: C.gold,
  rot: C.negativeLt,
  blau: C.blue,
} as const;

/** Zeichenfläche innerhalb der Visualzone Y320–1400. */
const BUEHNE = {
  links: 96,
  breite: 888,
  oben: VISUAL_TOP + 250,
  hoehe: 520,
} as const;

const MSCI = kursreiheFuerAnimation(msciWorld);

// ── gemeinsame Bausteine ────────────────────────────────────────────────────

/**
 * Quellen- oder Annahmezeile über der Caption-Zone.
 *
 * REEL_STYLE.sourceNote legt die Position fest, damit die Zeile nie in eine
 * zweizeilige Caption hineinragt.
 */
const Herkunft: React.FC<{text: string; at?: number}> = ({text, at = 40}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: REEL_STYLE.sourceNote.bottom,
        textAlign: 'center',
        opacity: ease(frame, at, at + 20) * 0.9,
        fontFamily: FONT.body,
        fontSize: REEL_STYLE.sourceNote.fontSize,
        color: TON.dim,
      }}
    >
      {text}
    </div>
  );
};

/**
 * Eine Kennzahl, die nach der Bewegung stehen bleibt.
 *
 * Erst wenn das Bild seine Aussage gemacht hat, landet die Zahl — sonst liest
 * der Zuschauer die Zahl und schaut an der Animation vorbei.
 */
const Kennzahl: React.FC<{
  x: number;
  wert: string;
  unter: string;
  farbe: string;
  at: number;
  rechts?: boolean;
}> = ({x, wert, unter, farbe, at, rechts = false}) => {
  const frame = useCurrentFrame();
  const auf = settle(frame, at, at + 22);
  return (
    <div
      style={{
        position: 'absolute',
        left: rechts ? undefined : x,
        right: rechts ? x : undefined,
        top: VISUAL_TOP + 90,
        textAlign: rechts ? 'right' : 'left',
        opacity: auf,
        transform: `translateY(${(1 - auf) * 16}px)`,
      }}
    >
      <div style={{fontFamily: FONT.body, fontSize: 84, fontWeight: 800, color: farbe, lineHeight: 1}}>
        {wert}
      </div>
      <div style={{fontFamily: FONT.body, fontSize: 28, fontWeight: 600, color: TON.dim, marginTop: 8}}>
        {unter}
      </div>
    </div>
  );
};

/** Waagerechte Hilfslinien, damit eine Kurve eine Höhe bekommt statt nur eine Form. */
const Raster: React.FC<{auf: number}> = ({auf}) => (
  <svg
    width={BUEHNE.breite}
    height={BUEHNE.hoehe}
    style={{position: 'absolute', left: BUEHNE.links, top: BUEHNE.oben, opacity: auf * 0.5}}
  >
    {[0, 1, 2, 3].map((i) => (
      <line
        key={i}
        x1={0}
        y1={(BUEHNE.hoehe * i) / 3}
        x2={BUEHNE.breite}
        y2={(BUEHNE.hoehe * i) / 3}
        stroke={C.line}
        strokeWidth={2}
      />
    ))}
  </svg>
);

// ── 1 · Gemessene Reihe ─────────────────────────────────────────────────────
// Der Sinn dieser Szene ist nicht die Aufwärtskurve — die kennt jeder. Der Sinn
// ist der markierte Tiefpunkt: 24 Prozent unter dem vorherigen Höchststand,
// mitten in einer Reihe, die insgesamt fast das Dreifache erreicht.

const PFAD = kursPfad(MSCI, {breite: BUEHNE.breite, hoehe: BUEHNE.hoehe, rand: 18});

/** Index des tiefsten Falls gegenüber dem bis dahin höchsten Stand. */
const TIEFPUNKT = (() => {
  let hoch = MSCI.punkte[0].y;
  let schlimmster = 0;
  let index = 0;
  MSCI.punkte.forEach((p, i) => {
    hoch = Math.max(hoch, p.y);
    const fall = (p.y - hoch) / hoch;
    if (fall < schlimmster) {
      schlimmster = fall;
      index = i;
    }
  });
  return index;
})();

const punktBei = (index: number) => {
  const anteil = index / Math.max(1, MSCI.punkte.length - 1);
  return {
    x: BUEHNE.links + 18 + anteil * (BUEHNE.breite - 36),
    y: BUEHNE.oben + 18 + (1 - MSCI.anteil(MSCI.punkte[index])) * (BUEHNE.hoehe - 36),
  };
};

const GemesseneReihe: React.FC = () => {
  const frame = useCurrentFrame();
  const zeichnen = ease(frame, 10, 86);
  const marke = settle(frame, 88, 112);
  const tief = punktBei(TIEFPUNKT);
  const ende = punktBei(MSCI.punkte.length - 1);
  const tiefErreicht = zeichnen >= TIEFPUNKT / (MSCI.punkte.length - 1);

  return (
    <AbsoluteFill>
      <SceneHeader title="Zehn Jahre MSCI World" icon="trending" />
      <AnimationStage>
        <Raster auf={ease(frame, 4, 24)} />

        {/* Die Fläche folgt der Linie, statt vorher da zu sein. */}
        <svg
          width={BUEHNE.breite}
          height={BUEHNE.hoehe}
          style={{position: 'absolute', left: BUEHNE.links, top: BUEHNE.oben}}
        >
          <defs>
            <linearGradient id="reihe-flaeche" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TON.gruen} stopOpacity={0.34} />
              <stop offset="100%" stopColor={TON.gruen} stopOpacity={0} />
            </linearGradient>
            <clipPath id="reihe-schnitt">
              <rect x={0} y={0} width={BUEHNE.breite * zeichnen} height={BUEHNE.hoehe} />
            </clipPath>
          </defs>
          <path
            d={`${PFAD} L${BUEHNE.breite - 18} ${BUEHNE.hoehe} L18 ${BUEHNE.hoehe} Z`}
            fill="url(#reihe-flaeche)"
            clipPath="url(#reihe-schnitt)"
          />
        </svg>

        <svg
          width={BUEHNE.breite}
          height={BUEHNE.hoehe}
          style={{position: 'absolute', left: BUEHNE.links, top: BUEHNE.oben}}
        >
          <path
            d={PFAD}
            stroke={TON.gruen}
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - zeichnen}
          />
        </svg>

        {/* Der Tiefpunkt wird erst markiert, wenn die Linie dort vorbei ist. */}
        {tiefErreicht ? (
          <svg
            width={1080}
            height={1920}
            style={{position: 'absolute', left: 0, top: 0, opacity: marke}}
          >
            <line
              x1={tief.x}
              y1={tief.y}
              x2={tief.x}
              y2={BUEHNE.oben + BUEHNE.hoehe}
              stroke={TON.rot}
              strokeWidth={3}
              strokeDasharray="10 9"
              opacity={0.7}
            />
            <circle cx={tief.x} cy={tief.y} r={14} fill="#000000" stroke={TON.rot} strokeWidth={6} />
          </svg>
        ) : null}

        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          <circle cx={ende.x} cy={ende.y} r={14} fill={TON.gruen} opacity={ease(frame, 80, 94)} />
        </svg>

        <div
          style={{
            position: 'absolute',
            left: BUEHNE.links,
            right: BUEHNE.links,
            top: BUEHNE.oben + BUEHNE.hoehe + 24,
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: FONT.body,
            fontSize: 28,
            color: TON.dim,
            opacity: ease(frame, 12, 34),
          }}
        >
          <span>{MSCI.punkte[0].x.slice(0, 4)}</span>
          <span>{MSCI.punkte[MSCI.punkte.length - 1].x.slice(0, 4)}</span>
        </div>
      </AnimationStage>

      <Kennzahl
        x={BUEHNE.links}
        wert={`${MSCI.faktor.toFixed(2).replace('.', ',')}×`}
        unter="in zehn Jahren"
        farbe={TON.gold}
        at={92}
      />
      <Kennzahl
        x={BUEHNE.links}
        wert={`${Math.round(MSCI.groessterRueckgangProzent)} %`}
        unter="tiefster Einbruch"
        farbe={TON.rot}
        at={104}
        rechts
      />
      <Herkunft text={MSCI.quellenzeile} at={110} />
    </AbsoluteFill>
  );
};

// ── 2 · Zwei Flächen ────────────────────────────────────────────────────────
// Eine einzelne Endsumme sagt nichts darüber, woher sie kommt. Getrennt
// gestapelt wird sichtbar, dass der grössere Teil nie eingezahlt wurde.

const PLAN = sparplanFuerAnimation({monatlich: 200, renditeProzent: 6, jahre: 30});

const flaeche = (werte: number[], maximum: number) => {
  const schritt = BUEHNE.breite / Math.max(1, werte.length - 1);
  const linie = werte
    .map((wert, i) => `${i === 0 ? 'M' : 'L'}${(i * schritt).toFixed(1)} ${(BUEHNE.hoehe * (1 - wert / maximum)).toFixed(1)}`)
    .join(' ');
  return `${linie} L${BUEHNE.breite} ${BUEHNE.hoehe} L0 ${BUEHNE.hoehe} Z`;
};

const ZweiFlaechen: React.FC = () => {
  const frame = useCurrentFrame();
  const wachsen = ease(frame, 12, 104);
  const maximum = PLAN.endwert * 1.06;
  const gesamt = flaeche(PLAN.jahre.map((j) => j.gesamt), maximum);
  const eingezahlt = flaeche(PLAN.jahre.map((j) => j.eingezahlt), maximum);
  const stand = PLAN.endwert * clamp01(wachsen);

  return (
    <AbsoluteFill>
      <SceneHeader title="Woher der Endwert kommt" icon="coins" tone="money" />
      <AnimationStage>
        <Raster auf={ease(frame, 4, 24)} />
        <svg
          width={BUEHNE.breite}
          height={BUEHNE.hoehe}
          style={{position: 'absolute', left: BUEHNE.links, top: BUEHNE.oben}}
        >
          <defs>
            <clipPath id="plan-schnitt">
              <rect x={0} y={0} width={BUEHNE.breite * wachsen} height={BUEHNE.hoehe} />
            </clipPath>
          </defs>
          <g clipPath="url(#plan-schnitt)">
            <path d={gesamt} fill={TON.gold} opacity={0.30} />
            <path d={gesamt} fill="none" stroke={TON.gold} strokeWidth={6} strokeLinejoin="round" />
            <path d={eingezahlt} fill={TON.blau} opacity={0.55} />
            <path d={eingezahlt} fill="none" stroke={TON.blau} strokeWidth={6} strokeLinejoin="round" />
          </g>
        </svg>

        <div
          style={{
            position: 'absolute',
            left: BUEHNE.links,
            right: BUEHNE.links,
            top: BUEHNE.oben + BUEHNE.hoehe + 24,
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: FONT.body,
            fontSize: 28,
            color: TON.dim,
            opacity: ease(frame, 12, 34),
          }}
        >
          <span>Jahr 1</span>
          <span>Jahr 30</span>
        </div>

        <div
          style={{
            position: 'absolute',
            left: BUEHNE.links,
            right: BUEHNE.links,
            top: BUEHNE.oben + BUEHNE.hoehe + 88,
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: FONT.body,
            fontSize: 32,
            fontWeight: 800,
            opacity: settle(frame, 96, 118),
          }}
        >
          <span style={{color: TON.blau}}>
            {euroText(PLAN.eingezahltGesamt)}
            <span style={{color: TON.dim, fontWeight: 600, fontSize: 26}}> eingezahlt</span>
          </span>
          <span style={{color: TON.gold}}>
            {euroText(PLAN.zinsenGesamt)}
            <span style={{color: TON.dim, fontWeight: 600, fontSize: 26}}> Zinsen</span>
          </span>
        </div>
      </AnimationStage>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: VISUAL_TOP + 96,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 92,
          fontWeight: 800,
          color: TON.gold,
          opacity: ease(frame, 10, 28),
        }}
      >
        {euroText(stand)}
      </div>
      <Herkunft text="200 € im Monat · 6 % p. a. · 30 Jahre · Beispielannahme, keine Zusage" at={100} />
    </AbsoluteFill>
  );
};

// ── 3 · Füllstand ───────────────────────────────────────────────────────────
// Die einzige Szene hier mit einem Gegenstand. Der Behälter erklärt nichts
// allein — erst die Ziellinie macht aus dem Füllen eine Aussage: es fehlt noch
// etwas, und man sieht genau wie viel.

const FIXKOSTEN = 2000;
const ZIEL = FIXKOSTEN * 3;
const VORHANDEN = 3720;
/** Der Behälter fasst mehr als das Ziel, sonst läge die Ziellinie auf dem Rand. */
const FASSUNG = ZIEL * 1.3;

const Fuellstand: React.FC = () => {
  const frame = useCurrentFrame();
  const fuellen = ease(frame, 18, 104);
  const stand = VORHANDEN * fuellen;

  const tankB = 360;
  const tankH = 540;
  const tankX = (1080 - tankB) / 2;
  const tankY = BUEHNE.oben - 10;
  const zielY = tankY + tankH * (1 - ZIEL / FASSUNG);

  return (
    <AbsoluteFill>
      <SceneHeader title="Drei Monate Puffer" icon="shield" />
      <AnimationStage>
        {/* Münzen fallen nacheinander hinein, damit das Füllen eine Ursache hat. */}
        {[0, 1, 2].map((i) => {
          const start = 14 + i * 22;
          const fallen = ease(frame, start, start + 26);
          const weg = ease(frame, start + 22, start + 32);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: tankX + 74 + i * 96,
                top: tankY - 190 + fallen * 190,
                width: 66,
                height: 66,
                borderRadius: '50%',
                background: TON.gold,
                opacity: (1 - weg) * ease(frame, start, start + 6),
              }}
            />
          );
        })}

        <div
          style={{
            position: 'absolute',
            left: tankX,
            top: tankY,
            width: tankB,
            height: tankH,
            borderRadius: 26,
            border: `5px solid ${TON.dim}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: tankH * clamp01(stand / FASSUNG),
              background: TON.gruen,
              opacity: 0.85,
            }}
          />
        </div>

        {/* Ziellinie: ohne sie wäre der Füllstand nur eine Bewegung. */}
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          <line
            x1={tankX - 60}
            y1={zielY}
            x2={tankX + tankB + 60}
            y2={zielY}
            stroke={TON.ink}
            strokeWidth={3}
            strokeDasharray="12 10"
            opacity={ease(frame, 8, 26) * 0.7}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: tankX + tankB + 76,
            top: zielY - 22,
            fontFamily: FONT.body,
            fontSize: 30,
            fontWeight: 700,
            color: TON.ink,
            opacity: ease(frame, 8, 26),
          }}
        >
          Ziel {euroText(ZIEL)}
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: tankY + tankH + 46,
            textAlign: 'center',
            fontFamily: FONT.body,
            fontSize: 54,
            fontWeight: 800,
            color: TON.gruen,
          }}
        >
          {euroText(stand)}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: tankY + tankH + 112,
            textAlign: 'center',
            fontFamily: FONT.body,
            fontSize: 32,
            fontWeight: 700,
            color: TON.dim,
            opacity: settle(frame, 100, 122),
          }}
        >
          {`es fehlen noch ${euroText(ZIEL - VORHANDEN)}`}
        </div>
      </AnimationStage>
      <Herkunft text={`Beispielhaushalt · ${euroText(FIXKOSTEN)} Fixkosten im Monat`} at={96} />
    </AbsoluteFill>
  );
};

// ── 4 · Zwei Wege ───────────────────────────────────────────────────────────
// Dieselbe Aussage zweimal: einmal als glatte Rechnung, einmal als gemessene
// Reihe. Der Unterschied zwischen beiden Kurven ist der eigentliche Inhalt der
// Szene — so ruhig, wie die Rechnung aussieht, verläuft es nie.

const GLATT = (() => {
  const plan = sparplanFuerAnimation({monatlich: 200, renditeProzent: 6, jahre: 10});
  const maximum = plan.endwert;
  const schritt = BUEHNE.breite / Math.max(1, plan.jahre.length - 1);
  return plan.jahre
    .map((j, i) => `${i === 0 ? 'M' : 'L'}${(i * schritt).toFixed(1)} ${(BUEHNE.hoehe * (1 - j.gesamt / maximum)).toFixed(1)}`)
    .join(' ');
})();

const ZweiWege: React.FC = () => {
  const frame = useCurrentFrame();
  const glatt = ease(frame, 10, 78);
  const echt = ease(frame, 34, 108);

  return (
    <AbsoluteFill>
      <SceneHeader title="Rechnung und Wirklichkeit" icon="percent" tone="warning" />
      <AnimationStage>
        <Raster auf={ease(frame, 4, 24)} />
        <svg
          width={BUEHNE.breite}
          height={BUEHNE.hoehe}
          style={{position: 'absolute', left: BUEHNE.links, top: BUEHNE.oben}}
        >
          <path
            d={GLATT}
            stroke={TON.blau}
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - glatt}
          />
          <path
            d={PFAD}
            stroke={TON.gruen}
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - echt}
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            left: BUEHNE.links,
            top: BUEHNE.oben + BUEHNE.hoehe + 60,
            fontFamily: FONT.body,
            fontSize: 32,
            fontWeight: 800,
            color: TON.blau,
            opacity: settle(frame, 74, 96),
          }}
        >
          gerechnete Annahme
          <div style={{fontSize: 26, fontWeight: 600, color: TON.dim, marginTop: 6}}>steigt jedes Jahr gleich</div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: BUEHNE.links,
            top: BUEHNE.oben + BUEHNE.hoehe + 60,
            textAlign: 'right',
            fontFamily: FONT.body,
            fontSize: 32,
            fontWeight: 800,
            color: TON.gruen,
            opacity: settle(frame, 104, 126),
          }}
        >
          gemessene Reihe
          <div style={{fontSize: 26, fontWeight: 600, color: TON.dim, marginTop: 6}}>
            {`zwischendurch ${Math.round(MSCI.groessterRueckgangProzent)} %`}
          </div>
        </div>
      </AnimationStage>
      <Herkunft text={MSCI.quellenzeile} at={112} />
    </AbsoluteFill>
  );
};

// ── Untertitel ──────────────────────────────────────────────────────────────
// Echte Wort-Zeitstempel kommen im Produktionsfall aus dem Voiceover. Hier sind
// sie gesetzt, damit die Caption-Zone im richtigen Rhythmus mitläuft und nicht
// leer bleibt — der Test prüft auch das Zusammenspiel der drei Zonen.

const takt = (satz: string, ab: number, dauer: number): CaptionWord[] => {
  const woerter = satz.split(' ');
  const je = dauer / woerter.length;
  return woerter.map((word, i) => ({
    word,
    start: ab + i * je,
    end: ab + (i + 1) * je - 0.02,
  }));
};

const UNTERTITEL: CaptionWord[] = [
  // Jede Zeile bleibt in ihrem Szenenfenster. CLAUDE.md §9: kein Wort der
  // nächsten Szene darf vorgreifen — bei 150 Frames sind das je 5 Sekunden.
  ...takt('Zehn Jahre Weltmarkt sehen ruhig aus.', 0.6, 2.6),
  ...takt('Sind sie aber nicht.', 3.4, 1.4),
  ...takt('Vom Endwert hast du das meiste nie eingezahlt.', 5.4, 3.0),
  ...takt('Die Zinsen machen den Rest.', 8.6, 1.3),
  ...takt('Drei Monatsausgaben sind das Ziel.', 10.4, 2.6),
  ...takt('Bis dahin fehlt noch etwas.', 13.2, 1.7),
  ...takt('Eine Rechnung steigt gleichmäßig.', 15.4, 2.4),
  ...takt('Die Wirklichkeit tut das nie.', 18.0, 1.9),
];

// ── Komposition ─────────────────────────────────────────────────────────────

export const DatenSzenen: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000000'}}>
    <Series>
      <Series.Sequence durationInFrames={SZENE_FRAMES}>
        <SceneTransition durationFrames={SZENE_FRAMES}>
          <GemesseneReihe />
        </SceneTransition>
      </Series.Sequence>
      <Series.Sequence durationInFrames={SZENE_FRAMES}>
        <SceneTransition durationFrames={SZENE_FRAMES}>
          <ZweiFlaechen />
        </SceneTransition>
      </Series.Sequence>
      <Series.Sequence durationInFrames={SZENE_FRAMES}>
        <SceneTransition durationFrames={SZENE_FRAMES}>
          <Fuellstand />
        </SceneTransition>
      </Series.Sequence>
      <Series.Sequence durationInFrames={SZENE_FRAMES}>
        <SceneTransition durationFrames={SZENE_FRAMES}>
          <ZweiWege />
        </SceneTransition>
      </Series.Sequence>
    </Series>
    <Captions words={UNTERTITEL} background={false} />
  </AbsoluteFill>
);
