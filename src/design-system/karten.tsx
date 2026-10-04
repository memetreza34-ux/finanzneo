// Karten-Baukasten für YouTube (16:9).
//
// Vorbild ist der ruhige Folien-Stil von Finanzbär, übertragen in die
// FinanzNeo-Welt: schwarzer Grund, Inter, weiße Schrift, grüne Hervorhebung.
// Fünf Kartentypen: Stichwort, Zitat, Tabelle, Icon-Ablauf, Zeitstrahl.
// Elemente erscheinen nacheinander im Sprechrhythmus; mehr Bewegung braucht
// eine Karte nicht.
//
// Die Karten rechnen nichts selbst. Zahlen kommen aus der Zentralrechnung
// bzw. einer geprüften Quelle; Zitate müssen belegt sein.
// Alle Zeitangaben sind Frames relativ zum Szenenstart.
//
// Textauszeichnung: **fett** in jedem Textfeld.

import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, E, FONT, Icon, a, prog} from '../brand';
import type {IconName} from '../brand';

export const KARTE = {
  hintergrund: '#000000',
  text: C.white,
  leise: C.gray,
  gruen: C.accent,
  rot: C.negativeLt,
  linie: '#3A3A3A',
  rand: 160,
} as const;

/** Einblenden mit leichtem Anstieg — die einzige Bewegung der meisten Karten. */
const auf = (frame: number, ab: number, dauer = 12) => {
  const p = prog(frame, ab, ab + dauer);
  return {opacity: p, transform: `translateY(${((1 - p) * 18).toFixed(1)}px)`};
};

/** Rendert **fett** als kräftigen Schriftschnitt in weißer Farbe. */
const MitFett: React.FC<{text: string}> = ({text}) => (
  <>
    {text.split(/(\*\*[^*]+\*\*)/g).map((teil, index) =>
      teil.startsWith('**') && teil.endsWith('**') ? (
        <span key={index} style={{fontWeight: 800, color: KARTE.text, fontStyle: 'normal'}}>
          {teil.slice(2, -2)}
        </span>
      ) : (
        <React.Fragment key={index}>{teil}</React.Fragment>
      ),
    )}
  </>
);

/** Schwarze Bühne mit festem Rand; der Inhalt steht links ausgerichtet in der Mitte. */
export const KartenBuehne: React.FC<{children: React.ReactNode; ausrichtung?: 'links' | 'mitte'}> = ({children, ausrichtung = 'links'}) => (
  <AbsoluteFill
    style={{
      backgroundColor: KARTE.hintergrund,
      padding: `0 ${KARTE.rand}px`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: ausrichtung === 'mitte' ? 'center' : 'flex-start',
      textAlign: ausrichtung === 'mitte' ? 'center' : 'left',
      fontFamily: FONT.body,
      color: KARTE.text,
    }}
  >
    {children}
  </AbsoluteFill>
);

// ─── Stichwort ───────────────────────────────────────────────────────────────

/**
 * Großes Stichwort, optional mit Zusatzzeile. Ein Teil davon kann später grün
 * hervorgehoben werden — im Moment, in dem er gesagt wird.
 */
export const StichwortKarte: React.FC<{
  titel: string;
  zusatz?: string;
  hervorheben?: string;
  hervorhebenAb?: number;
  ab?: number;
  ausrichtung?: 'links' | 'mitte';
}> = ({titel, zusatz, hervorheben, hervorhebenAb = 30, ab = 0, ausrichtung = 'links'}) => {
  const frame = useCurrentFrame();
  const markiert = prog(frame, hervorhebenAb, hervorhebenAb + 10);
  const zeile = (text: string) => {
    if (!hervorheben || !text.includes(hervorheben)) return <MitFett text={text} />;
    const [vorher, ...rest] = text.split(hervorheben);
    return (
      <>
        <MitFett text={vorher} />
        <span
          style={{
            color: markiert > 0.5 ? KARTE.gruen : 'inherit',
            backgroundColor: a(KARTE.gruen, 0.16 * markiert),
            borderRadius: 10,
            padding: '0 12px',
            margin: '0 -12px',
          }}
        >
          {hervorheben}
        </span>
        <MitFett text={rest.join(hervorheben)} />
      </>
    );
  };
  return (
    <KartenBuehne ausrichtung={ausrichtung}>
      <div style={{fontSize: 120, fontWeight: 400, letterSpacing: -2, lineHeight: 1.08, ...auf(frame, ab)}}>{zeile(titel)}</div>
      {zusatz ? (
        <div style={{marginTop: 28, fontSize: 64, fontWeight: 400, color: C.whiteSoft, lineHeight: 1.2, ...auf(frame, ab + 10)}}>{zeile(zusatz)}</div>
      ) : null}
    </KartenBuehne>
  );
};

// ─── Zitat ───────────────────────────────────────────────────────────────────

/** Nur das Zitat und der Autor. Zitate müssen belegt sein. */
export const ZitatKarte: React.FC<{zitat: string; autor: string; quelle?: string; ab?: number}> = ({zitat, autor, quelle, ab = 0}) => {
  const frame = useCurrentFrame();
  return (
    <KartenBuehne>
      <div style={{maxWidth: 1500, fontSize: 68, fontWeight: 400, fontStyle: 'italic', lineHeight: 1.32, color: C.whiteSoft, ...auf(frame, ab, 16)}}>
        „<MitFett text={zitat} />“
      </div>
      <div style={{alignSelf: 'flex-end', marginTop: 56, textAlign: 'right', ...auf(frame, ab + 18)}}>
        <div style={{fontSize: 52, fontStyle: 'italic', color: KARTE.gruen}}>– {autor}</div>
        {quelle ? <div style={{marginTop: 12, fontSize: 26, color: KARTE.leise}}>{quelle}</div> : null}
      </div>
    </KartenBuehne>
  );
};

// ─── Tabelle ─────────────────────────────────────────────────────────────────

/** Schlichte Tabelle; Zeilen erscheinen nacheinander, eine Zeile kann grün markiert werden. */
export const TabellenKarte: React.FC<{
  kopf: string[];
  zeilen: string[][];
  titel?: string;
  hervorheben?: number;
  ab?: number;
  abstand?: number;
}> = ({kopf, zeilen, titel, hervorheben, ab = 0, abstand = 8}) => {
  const frame = useCurrentFrame();
  const spalten = `repeat(${kopf.length}, minmax(0, 1fr))`;
  const markierAb = ab + 16 + zeilen.length * abstand + 6;
  const markiert = prog(frame, markierAb, markierAb + 10);
  return (
    <KartenBuehne>
      {titel ? <div style={{fontSize: 56, fontWeight: 800, marginBottom: 36, ...auf(frame, ab)}}>{titel}</div> : null}
      <div style={{width: '100%', maxWidth: 1500}}>
        <div style={{display: 'grid', gridTemplateColumns: spalten, gap: 24, padding: '0 24px 18px', borderBottom: `3px solid ${KARTE.linie}`, fontSize: 34, fontWeight: 800, ...auf(frame, ab + 6)}}>
          {kopf.map((zelle, index) => (
            <div key={index} style={{textAlign: index === 0 ? 'left' : 'right'}}>{zelle}</div>
          ))}
        </div>
        {zeilen.map((zeile, reihe) => {
          const istMarkiert = reihe === hervorheben;
          return (
            <div
              key={reihe}
              style={{
                display: 'grid',
                gridTemplateColumns: spalten,
                gap: 24,
                padding: '18px 24px',
                borderRadius: 12,
                fontSize: 36,
                color: istMarkiert && markiert > 0.5 ? KARTE.gruen : C.whiteSoft,
                fontWeight: istMarkiert ? 800 : 400,
                backgroundColor: istMarkiert ? a(KARTE.gruen, 0.14 * markiert) : reihe % 2 ? 'rgba(255,255,255,0.03)' : 'transparent',
                ...auf(frame, ab + 16 + reihe * abstand, 10),
              }}
            >
              {zeile.map((zelle, index) => (
                <div key={index} style={{textAlign: index === 0 ? 'left' : 'right'}}>
                  <MitFett text={zelle} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </KartenBuehne>
  );
};

// ─── Icon-Ablauf ─────────────────────────────────────────────────────────────

export type AblaufSchritt = {icon: IconName; label?: string; hinweis?: string; farbe?: string};

/** Linien-Icons nacheinander, verbunden durch Bogenpfeile, die sich zeichnen. */
export const IconAblauf: React.FC<{schritte: AblaufSchritt[]; ab?: number; takt?: number; pfeilFarbe?: string}> = ({
  schritte,
  ab = 0,
  takt = 16,
  pfeilFarbe = KARTE.gruen,
}) => {
  const frame = useCurrentFrame();
  const breite = 1600;
  const abstand = breite / schritte.length;
  const mitteY = 470;
  const iconGroesse = 140;
  return (
    <AbsoluteFill style={{backgroundColor: KARTE.hintergrund, fontFamily: FONT.body, color: KARTE.text}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {schritte.slice(1).map((_, index) => {
          const von = 160 + abstand * (index + 0.5) + iconGroesse * 0.55;
          const nach = 160 + abstand * (index + 1.5) - iconGroesse * 0.55;
          const zug = prog(frame, ab + (index + 1) * takt - 8, ab + (index + 1) * takt + 6, E.inOut);
          const bogen = `M ${von} ${mitteY - 30} Q ${(von + nach) / 2} ${mitteY - 150} ${nach} ${mitteY - 40}`;
          return (
            <g key={index} opacity={zug > 0 ? 1 : 0}>
              <path d={bogen} pathLength={1} fill="none" stroke={pfeilFarbe} strokeWidth={6} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - zug} />
              <path
                d={`M ${nach - 26} ${mitteY - 58} L ${nach} ${mitteY - 40} L ${nach - 30} ${mitteY - 28}`}
                fill="none"
                stroke={pfeilFarbe}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={prog(zug, 0.85, 1)}
              />
            </g>
          );
        })}
      </svg>
      {schritte.map((schritt, index) => {
        const x = 160 + abstand * (index + 0.5);
        const start = ab + index * takt;
        return (
          // Oben am Icon verankert, damit ein Hinweis darunter den Schritt nicht verschiebt.
          <div key={index} style={{position: 'absolute', left: x, top: mitteY - iconGroesse / 2, width: abstand - 40, transform: 'translateX(-50%)', textAlign: 'center'}}>
            <div style={{display: 'flex', justifyContent: 'center', ...auf(frame, start)}}>
              <Icon name={schritt.icon} size={iconGroesse} color={schritt.farbe ?? KARTE.text} stroke={1.6} />
            </div>
            {schritt.label ? <div style={{marginTop: 24, fontSize: 36, lineHeight: 1.2, color: C.whiteSoft, ...auf(frame, start + 4)}}>{schritt.label}</div> : null}
            {schritt.hinweis ? (
              <div
                style={{
                  marginTop: 28,
                  display: 'inline-block',
                  padding: '14px 26px',
                  borderRadius: 14,
                  border: `3px solid ${KARTE.gruen}`,
                  fontSize: 32,
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  ...auf(frame, ab + schritte.length * takt + 6),
                }}
              >
                <MitFett text={schritt.hinweis} />
              </div>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Zeitstrahl ──────────────────────────────────────────────────────────────

export type ZeitPunkt = {label: string; wert?: string};

/** Linie mit Punkten, die nacheinander erscheinen; optional ein Sprung-Pfeil zwischen zwei Punkten. */
export const Zeitstrahl: React.FC<{
  punkte: ZeitPunkt[];
  sprung?: {von: number; nach: number; label?: string};
  hervorheben?: number;
  ab?: number;
  takt?: number;
}> = ({punkte, sprung, hervorheben, ab = 0, takt = 10}) => {
  const frame = useCurrentFrame();
  const links = 220;
  const rechts = 1700;
  const y = 560;
  const x = (index: number) => links + ((rechts - links) * index) / Math.max(1, punkte.length - 1);
  const linie = prog(frame, ab, ab + 18, E.inOut);
  const sprungAb = ab + 18 + punkte.length * takt;
  const sprungZug = prog(frame, sprungAb, sprungAb + 18, E.inOut);
  return (
    <AbsoluteFill style={{backgroundColor: KARTE.hintergrund, fontFamily: FONT.body, color: KARTE.text}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={links - 40} x2={links - 40 + (rechts - links + 80) * linie} y1={y} y2={y} stroke={C.whiteSoft} strokeWidth={4} strokeLinecap="round" />
        {punkte.map((_, index) => {
          const da = prog(frame, ab + 14 + index * takt, ab + 22 + index * takt);
          const gruen = index === hervorheben;
          return <circle key={index} cx={x(index)} cy={y} r={(gruen ? 16 : 12) * da} fill={gruen ? KARTE.gruen : C.white} />;
        })}
        {sprung ? (
          <path
            d={`M ${x(sprung.von)} ${y - 28} Q ${(x(sprung.von) + x(sprung.nach)) / 2} ${y - 230} ${x(sprung.nach)} ${y - 32}`}
            pathLength={1}
            fill="none"
            stroke={KARTE.gruen}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={1}
            strokeDashoffset={1 - sprungZug}
          />
        ) : null}
      </svg>
      {punkte.map((punkt, index) => {
        const start = ab + 16 + index * takt;
        const gruen = index === hervorheben;
        return (
          <div key={index} style={{position: 'absolute', left: x(index), top: y + 44, transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap'}}>
            <div style={auf(frame, start)}>
              <div style={{fontSize: 36, fontWeight: 800, color: gruen ? KARTE.gruen : KARTE.text}}>{punkt.label}</div>
              {punkt.wert ? <div style={{marginTop: 10, fontSize: 32, color: C.whiteSoft}}>{punkt.wert}</div> : null}
            </div>
          </div>
        );
      })}
      {sprung?.label ? (
        <div
          style={{
            position: 'absolute',
            left: (x(sprung.von) + x(sprung.nach)) / 2,
            top: y - 200,
            transform: 'translate(-50%, -100%)',
            fontSize: 36,
            fontWeight: 800,
            color: KARTE.gruen,
            whiteSpace: 'nowrap',
            opacity: prog(sprungZug, 0.6, 1),
          }}
        >
          {sprung.label}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ─── Hinweiszeile ────────────────────────────────────────────────────────────

/** Kleine Zeile am unteren Rand, z. B. „Beispielrechnung: …“ oder eine Quelle. */
export const KartenHinweis: React.FC<{children: React.ReactNode; ab?: number}> = ({children, ab = 0}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 56,
        textAlign: 'center',
        fontFamily: FONT.body,
        fontSize: 24,
        fontWeight: 600,
        color: KARTE.leise,
        opacity: prog(frame, ab, ab + 12),
      }}
    >
      {children}
    </div>
  );
};
