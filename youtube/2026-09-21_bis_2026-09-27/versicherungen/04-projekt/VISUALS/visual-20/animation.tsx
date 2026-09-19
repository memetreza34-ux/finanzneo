import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalCoinStack, PhysicalReserveTank, PhysicalTag, YouTubePhysicalStage, ease} from '../../motion-kit';

export const MECHANIC_ID = 'working-life-adds-up';
export const VISUAL_TECHNIQUE_ID = 'yearly-packets-fill-a-container';
export const COMPOSITION_FAMILY_ID = 'physical-accumulation-large';
export const RESULT_HOLD_FRAMES = 44;

export const ANIMATION_NARRATIVE = {
  START: 'Ein leerer Behälter und das erste Arbeitsjahr daneben',
  MECHANISM: 'Jahr für Jahr wandert ein Paket hinein und der Stand steigt',
  RESULT: 'Der Behälter steht voll — ein Arbeitsleben ergibt über eine Million',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Der Behälter, der sich über ein Arbeitsleben füllt',
  SUPPORT: 'Die einzelnen Jahrespakete',
  MATERIAL: 'Gold für die Jahre, Grün für den Gesamtwert',
  DEPTH: 'Pakete links, Behälter rechts',
};

const TANK = {x: 1080, y: 250, width: 420, height: 620};

export const YouTubeVisual20Animation: React.FC = () => {
  const frame = useCurrentFrame();

  // Kanal 1 — die Jahre laufen durch und füllen den Behälter.
  const years = ease(frame, 16, 180);
  const fill = years * 0.88;
  // Kanal 2 — die Jahreszahl läuft mit.
  const age = Math.round(interpolate(years, [0, 1], [30, 67]));

  return (
    <YouTubePhysicalStage>
      {/* Drei Pakete stehen stellvertretend für die Jahre und wandern hinüber. */}
      {[0, 1, 2].map((slot) => {
        const travel = ease(frame, 20 + slot * 44, 20 + slot * 44 + 40);
        const x = interpolate(travel, [0, 1], [260 + slot * 40, TANK.x - 190]);
        const lift = Math.sin(travel * Math.PI) * 80;
        return (
          <div key={slot} style={{position: 'absolute', left: 0, top: 0, transform: `translate(${x}px, ${660 - lift}px)`, opacity: travel < 1 ? travel : 0}}> // zone-ok: relativ zum Container in der Zone
            <PhysicalCoinStack x={0} y={0} count={5} scale={1.2} />
          </div>
        );
      })}

      <div style={{position: 'absolute', left: 250, top: 420, opacity: ease(frame, 8, 30)}}>
        <PhysicalTag material="neutral">{`mit ${age}`}</PhysicalTag>
      </div>

      <PhysicalReserveTank
        x={TANK.x}
        y={TANK.y}
        width={TANK.width}
        height={TANK.height}
        fill={fill}
        label="Arbeitsleben"
      />

      <div style={{position: 'absolute', left: TANK.x + 60, top: TANK.y - 66, opacity: ease(frame, 150, 182)}}>
        <PhysicalTag material="positive">über 1 Million €</PhysicalTag>
      </div>
    </YouTubePhysicalStage>
  );
};
