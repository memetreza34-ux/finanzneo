import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalCoinStack, PhysicalTag, YouTubePhysicalStage} from '../../motion-kit';

export const MECHANIC_ID = 'liability-counter-without-ceiling';
export const VISUAL_TECHNIQUE_ID = 'amount-runs-past-every-marker';
export const COMPOSITION_FAMILY_ID = 'physical-scale';
export const RESULT_HOLD_FRAMES = 38;

export const ANIMATION_NARRATIVE = {
  START: 'Drei Marken stehen übereinander: Erspartes, Jahresgehalt, alles zusammen',
  MECHANISM: 'Der Schadensbetrag steigt und zieht an jeder Marke vorbei',
  RESULT: 'Der Betrag verlässt das Bild nach oben, ohne an einer Grenze zu halten',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Der steigende Betrag, der über jede eigene Grenze hinausläuft',
  SUPPORT: 'Drei Marken für das, was man selbst hat',
  MATERIAL: 'Gold für den Betrag, Elfenbein für die eigenen Grenzen',
  DEPTH: 'Marken hinten an der Wand, Betrag davor',
};

const ramp = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** Die Marken liegen in der Zone y 180-990, der Betrag läuft an ihnen vorbei. */
const MARKS = [
  {label: 'Erspartes 8.000 €', y: 820, at: 34},
  {label: 'Jahresgehalt 32.000 €', y: 620, at: 74},
  {label: 'Alles, was du hast', y: 420, at: 116},
];

export const YouTubeVisual11Animation: React.FC = () => {
  const frame = useCurrentFrame();

  // Kanal 1 — der Betrag steigt und hört nicht auf.
  const rise = ramp(frame, 20, 190);
  // Der Betrag steigt bis knapp unter den oberen Zonenrand. Weiter hoch hiesse,
  // dass sein Etikett darueber abgeschnitten wird — die Aussage "hoert nicht auf"
  // traegt die letzte Marke, die er hinter sich laesst, nicht das Verlassen des Bildes.
  const amountY = interpolate(rise, [0, 1], [880, 300]);

  return (
    <YouTubePhysicalStage>
      {MARKS.map((mark) => {
        // Kanal 2 — jede Marke wird gesetzt und beim Passieren blass.
        const set = ramp(frame, mark.at - 22, mark.at);
        const passed = ramp(frame, mark.at + 14, mark.at + 40);
        return (
          <React.Fragment key={mark.label}>
            <div style={{
              position: 'absolute', left: 300, top: mark.y,
              width: `${set * 880}px`, height: 4,
              background: '#F7F7F2', opacity: set * (1 - passed * 0.62),
            }} />
            <div style={{position: 'absolute', left: 1210, top: mark.y - 26, opacity: set * (1 - passed * 0.5)}}>
              <PhysicalTag material="neutral">{mark.label}</PhysicalTag>
            </div>
          </React.Fragment>
        );
      })}

      <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(620px, ${amountY}px) scale(1.34)`}}> // zone-ok: relativ zum Container in der Zone
        <PhysicalCoinStack x={0} y={0} count={7} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(560px, ${amountY - 78}px)`}}> // zone-ok: relativ zum Container in der Zone
        <PhysicalTag material="warning">Schaden</PhysicalTag>
      </div>

      <div style={{position: 'absolute', left: 300, top: 250, opacity: ramp(frame, 168, 196)}}>
        <PhysicalTag material="warning">keine Obergrenze</PhysicalTag>
      </div>
    </YouTubePhysicalStage>
  );
};
