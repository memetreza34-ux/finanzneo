import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalBill, PhysicalReserveTank, PhysicalTag, YouTubePhysicalStage, ease} from '../../motion-kit';

export const MECHANIC_ID = 'reserve-and-policy-same-job';
export const VISUAL_TECHNIQUE_ID = 'two-catchers-one-falling-damage';
export const COMPOSITION_FAMILY_ID = 'physical-pairing';
export const RESULT_HOLD_FRAMES = 46;

export const ANIMATION_NARRATIVE = {
  START: 'Zwei Auffangbehälter stehen nebeneinander, einer klein, einer groß',
  MECHANISM: 'Derselbe Vorgang läuft zweimal: ein kleiner Schaden fällt links, ein großer rechts',
  RESULT: 'Beide fangen ab — nur die Größe ist verschieden',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Die zwei unterschiedlich großen Auffangbehälter',
  SUPPORT: 'Zwei Schadensbelege in passender Größe',
  MATERIAL: 'Derselbe Behältertyp in zwei Größen',
  DEPTH: 'Behälter auf einer Linie, Belege fallen davor',
};

export const YouTubeVisual31Animation: React.FC = () => {
  const frame = useCurrentFrame();

  // Kanal 1 — der kleine Schaden fällt in den kleinen Behälter.
  const smallFall = ease(frame, 22, 68);
  const smallFill = ease(frame, 60, 86);
  // Kanal 2 — der große Schaden fällt in den großen Behälter.
  const largeFall = ease(frame, 96, 148);
  const largeFill = ease(frame, 140, 170);

  return (
    <YouTubePhysicalStage>
      <PhysicalReserveTank x={300} y={560} width={280} height={300} fill={smallFill * 0.8} label="Notgroschen" />
      <PhysicalReserveTank x={1120} y={300} width={440} height={560} fill={largeFill * 0.8} label="Versicherung" />

      <div style={{
        position: 'absolute', left: 0, top: 0, // zone-ok: Position steckt im transform darunter
        transform: `translate(350px, ${interpolate(smallFall, [0, 1], [200, 520])}px) scale(0.38)`,
        opacity: smallFall < 1 ? smallFall : 0,
      }}>
        <PhysicalBill x={0} y={0} amount="250 €" label="klein" rotate={-4} />
      </div>

      <div style={{
        position: 'absolute', left: 0, top: 0, // zone-ok: Position steckt im transform darunter
        transform: `translate(1180px, ${interpolate(largeFall, [0, 1], [190, 260])}px) scale(0.86)`,
        opacity: largeFall < 1 ? largeFall : 0,
      }}>
        <PhysicalBill x={0} y={0} amount="480.000 €" label="groß" rotate={3} />
      </div>

      <div style={{position: 'absolute', left: 330, top: 900, opacity: smallFill}}>
        <PhysicalTag material="positive">fängt ab</PhysicalTag>
      </div>
      <div style={{position: 'absolute', left: 1240, top: 900, opacity: largeFill}}>
        <PhysicalTag material="positive">fängt ab</PhysicalTag>
      </div>
    </YouTubePhysicalStage>
  );
};
