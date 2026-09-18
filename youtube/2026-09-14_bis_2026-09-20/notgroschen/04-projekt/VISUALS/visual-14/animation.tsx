import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalAccount, PhysicalBill, PhysicalObject, PhysicalTag, PhysicalWasher, YouTubePhysicalStage} from '../../motion-kit';

export const MECHANIC_ID = 'four-factors-take-the-table';
export const VISUAL_TECHNIQUE_ID = 'objects-enter-and-line-up';
export const COMPOSITION_FAMILY_ID = 'physical-collection';
export const RESULT_HOLD_FRAMES = 60;

export const ANIMATION_NARRATIVE = {
  START: 'Ein leerer Tisch — die Frage nach der eigenen Höhe ist noch unbeantwortet',
  MECHANISM: 'Vier reale Dinge kommen nacheinander herein und stellen sich nebeneinander',
  RESULT: 'Vier Gegenstände stehen aufgereiht: das ist es, was die eigene Höhe bestimmt',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Die Reihe aus vier konkreten Dingen, die zusammen den Bedarf ergeben',
  SUPPORT: 'Kaputtes Gerät, Rechnung, Arbeitsweg, schrumpfendes Einkommen',
  MATERIAL: 'Metall für das Gerät, Papier für die Rechnung, Warnrot für das sinkende Einkommen',
  DEPTH: 'Alle vier auf einer Standlinie, das zuletzt eingetroffene vorn',
};

const ramp = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/**
 * Die vier Fragen aus dem Skript als vier Gegenstände.
 *
 * Die Vorgängerfassung zeigte Fortschrittsbalken — laut Standard als Hauptsprache
 * verboten. Jede Frage bekommt hier das Ding, nach dem sie fragt: die unerwartete
 * Ausgabe, die laufenden Kosten, das für Arbeit Nötige, das sinkende Einkommen.
 *
 * Alles sitzt in der Visualzone y 180–990.
 */
const ARRIVALS = [
  {key: 'unerwartet', x: 120, label: 'Unerwartet', start: 8},
  {key: 'fixkosten', x: 570, label: 'Fixkosten', start: 60},
  {key: 'arbeitsweg', x: 1010, label: 'Arbeitsweg', start: 112},
  {key: 'einkommen', x: 1450, label: 'Weniger Einkommen', start: 164},
];

const STAND_Y = 420;

export const YouTubeVisual14Animation: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <YouTubePhysicalStage>
      {ARRIVALS.map((arrival) => {
        // Kanal 1 — das Ding kommt von unten herein und setzt sich auf die Standlinie.
        const enter = ramp(frame, arrival.start, arrival.start + 30);
        // Kanal 2 — das Etikett wird erst danach lesbar, damit der Gegenstand zuerst wirkt.
        const named = ramp(frame, arrival.start + 26, arrival.start + 46);
        const drop = interpolate(enter, [0, 1], [190, 0]);

        return (
          <div
            key={arrival.key}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translateY(${drop}px)`,
              opacity: enter,
            }}
          >
            {arrival.key === 'unerwartet' ? (
              <PhysicalWasher x={arrival.x} y={STAND_Y} broken scale={1.08} />
            ) : null}
            {arrival.key === 'fixkosten' ? (
              <PhysicalBill x={arrival.x} y={STAND_Y + 20} amount="1.500 €" label="Monatliche Kosten" rotate={-3} scale={1.06} />
            ) : null}
            {arrival.key === 'arbeitsweg' ? (
              <PhysicalObject x={arrival.x} y={STAND_Y + 60} width={300} height={280} material="neutral" radius={30}>
                <div style={{padding: 30, fontSize: 30, fontWeight: 900, color: '#142019'}}>Auto für den Weg zur Arbeit</div>
              </PhysicalObject>
            ) : null}
            {arrival.key === 'einkommen' ? (
              <PhysicalAccount x={arrival.x} y={STAND_Y + 70} label="Einkommen" balance="− 40 %" state="danger" scale={1.02} />
            ) : null}

            <div
              style={{
                position: 'absolute',
                left: arrival.x + 10,
                top: STAND_Y + 380,
                opacity: named,
                transform: `translateY(${(1 - named) * 16}px)`,
              }}
            >
              <PhysicalTag material={arrival.key === 'einkommen' ? 'warning' : 'neutral'}>{arrival.label}</PhysicalTag>
            </div>
          </div>
        );
      })}
    </YouTubePhysicalStage>
  );
};
