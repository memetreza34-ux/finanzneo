import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {DATEN, DatenBuehne, Quelle, Text} from '../../../../../src/design-system/daten';

export const MECHANIC_ID = 'auto-renewal-lock-versus-monthly-exits';
export const VISUAL_TECHNIQUE_ID = 'two-contract-timelines-split';
export const COMPOSITION_FAMILY_ID = 'before-after-timelines';

/**
 * ANIMATION_NARRATIVE
 * START: Zeitleiste „Vertrag vor März 2022“: 24 Monate Mindestlaufzeit zeichnen sich.
 * MECHANISM: Am Ende rastet ein roter Block „+12 Monate“ mit Schloss ein. Darunter zeichnet sich
 *   „Vertrag ab März 2022“: nach 24 Monaten folgen einzelne Monate, jeder mit offenem Ausgang.
 * RESULT: Alt: ein weiteres Jahr gebunden. Neu: unbefristet, jederzeit mit 1 Monat Frist kündbar.
 * Recht: § 309 Nr. 9 BGB (Gesetz für faire Verbraucherverträge), Verträge ab 1. März 2022.
 */
export const ANIMATION_NARRATIVE = {
  START: '24 Monate Mindestlaufzeit',
  MECHANISM: 'Alt: +12 Monate rasten ein. Neu: einzelne Monate mit Ausgang',
  RESULT: 'Heute nach der Mindestlaufzeit jederzeit mit einem Monat Frist kündbar',
};

const MONAT_PX = 42;
const MINDEST = 24;
const VERLAENGERUNG = 12;
const LINKS = 200;
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const weich = (t: number) => t * t * (3 - 2 * t);

// beats: [„Früher hat sich“, „weiteres Jahr“ → Schloss, „ersten März“ → neue Leiste, „Mindestlaufzeit läuft“ → Einzelmonate, „einem Monat Frist“ → Schloss offen]
const PREVIEW_BEATS = [0, 60, 120, 190, 260];

const Schloss: React.FC<{x: number; y: number; farbe: string; offen?: number}> = ({x, y, farbe, offen = 0}) => (
  <svg width={40} height={48} viewBox="0 0 40 48" style={{position: 'absolute', left: x - 20, top: y - 24}}>
    <path d={`M 10 22 V ${14 - offen * 6} a 10 10 0 0 1 20 0 V 22`} fill="none" stroke={farbe} strokeWidth={5} strokeLinecap="round" transform={`translate(${offen * 10} 0)`} />
    <rect x={4} y={22} width={32} height={24} rx={5} fill={farbe} />
  </svg>
);

export const YouTubeVisual11Animation: React.FC<{beats?: number[]}> = ({beats}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (step: number) => beats?.[step] ?? PREVIEW_BEATS[step];
  const zeichnen = (ab: number) => interpolate(frame, [ab, ab + 24], [0, 1], {...CLAMP, easing: weich});

  const altBreite = MINDEST * MONAT_PX * zeichnen(at(0));
  const einrasten = spring({frame: frame - at(1), fps, config: {damping: 11, stiffness: 170}});
  const neuBreite = MINDEST * MONAT_PX * zeichnen(at(2));
  const ende = LINKS + MINDEST * MONAT_PX;
  const yAlt = 300;
  const yNeu = 640;
  const H = 96;

  // Beide Leisten stehen schon als leere Spur da, während „Die gute Nachricht …“ gesprochen wird.
  const spur = interpolate(frame, [0, 12], [0, 1], CLAMP);
  return (
    <DatenBuehne>
      {[yAlt, yNeu].map((y) => (
        <div key={y} style={{position: 'absolute', left: LINKS, top: y - H / 2, width: (MINDEST + VERLAENGERUNG) * MONAT_PX + 6, height: H, borderRadius: 12, border: `3px dashed ${DATEN.linie}`, boxSizing: 'border-box', opacity: spur}} />
      ))}
      {/* Vertrag vor März 2022 */}
      <Text x={LINKS} y={yAlt - 86} groesse={36} gewicht={800} ab={0}>
        Vertrag vor März 2022
      </Text>
      <div style={{position: 'absolute', left: LINKS, top: yAlt - H / 2, width: altBreite, height: H, borderRadius: '12px 0 0 12px', backgroundColor: DATEN.neutral}} />
      <Text x={LINKS + 24} y={yAlt} groesse={34} gewicht={800} farbe={DATEN.papier} ab={at(0) + 14}>
        24 Monate Mindestlaufzeit
      </Text>
      {frame >= at(1) ? (
        <>
          <div style={{position: 'absolute', left: ende + 6, top: yAlt - H / 2, width: VERLAENGERUNG * MONAT_PX, height: H, borderRadius: '0 12px 12px 0', backgroundColor: DATEN.rot, transform: `translateX(${((1 - einrasten) * 120).toFixed(1)}px)`, opacity: Math.min(1, einrasten * 2), display: 'flex', alignItems: 'center', paddingLeft: 70, boxSizing: 'border-box', color: DATEN.papier, fontSize: 32, fontWeight: 800}}>
            +12 Monate
          </div>
          <div style={{transform: `translateX(${((1 - einrasten) * 120).toFixed(1)}px)`, opacity: Math.min(1, einrasten * 2)}}>
            <Schloss x={ende + 40} y={yAlt} farbe={DATEN.papier} />
          </div>
          <Text x={ende + 6} y={yAlt + 80} groesse={32} gewicht={700} farbe={DATEN.rot} ab={at(1) + 10}>
            automatisch verlängert
          </Text>
        </>
      ) : null}

      {/* Vertrag ab März 2022 */}
      <Text x={LINKS} y={yNeu - 86} groesse={36} gewicht={800} ab={6}>
        Vertrag ab März 2022
      </Text>
      <div style={{position: 'absolute', left: LINKS, top: yNeu - H / 2, width: neuBreite, height: H, borderRadius: '12px 0 0 12px', backgroundColor: DATEN.neutral}} />
      <Text x={LINKS + 24} y={yNeu} groesse={34} gewicht={800} farbe={DATEN.papier} ab={at(2) + 14}>
        24 Monate Mindestlaufzeit
      </Text>
      {Array.from({length: VERLAENGERUNG}, (_, m) => {
        const ab = at(3) + m * 4;
        const p = spring({frame: frame - ab, fps, config: {damping: 14, stiffness: 200, overshootClamping: true}});
        if (frame < ab) return null;
        const x = ende + 6 + m * MONAT_PX;
        return (
          <React.Fragment key={m}>
            <div style={{position: 'absolute', left: x + 2, top: yNeu - H / 2, width: MONAT_PX - 4, height: H, borderRadius: m === VERLAENGERUNG - 1 ? '4px 12px 12px 4px' : 4, backgroundColor: DATEN.gruen, opacity: p, transform: `scaleY(${(0.5 + 0.5 * p).toFixed(3)})`}} />
            {/* offener Ausgang über jedem Monat */}
            <div style={{position: 'absolute', left: x + MONAT_PX / 2 - 2, top: yNeu - H / 2 - 22 * p, width: 4, height: 18 * p, borderRadius: 2, backgroundColor: DATEN.gruen}} />
          </React.Fragment>
        );
      })}
      {frame >= at(3) ? (
        <>
          <Schloss x={ende + 6 + VERLAENGERUNG * MONAT_PX + 40} y={yNeu} farbe={DATEN.gruen} offen={interpolate(frame, [at(4), at(4) + 14], [0, 1], CLAMP)} />
          <Text x={ende + 6} y={yNeu + 80} groesse={32} gewicht={700} farbe={DATEN.gruen} ab={at(4)}>
            jederzeit kündbar · 1 Monat Frist
          </Text>
        </>
      ) : null}
      <Quelle ab={at(0)}>§ 309 Nr. 9 BGB · gilt in den meisten Fällen für Verträge ab 1. März 2022</Quelle>
    </DatenBuehne>
  );
};
