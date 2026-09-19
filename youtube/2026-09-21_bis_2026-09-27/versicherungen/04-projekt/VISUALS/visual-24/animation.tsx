import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalBill, PhysicalObject, PhysicalTag, YouTubePhysicalStage, ease} from '../../motion-kit';

export const MECHANIC_ID = 'replace-the-whole-room';
export const VISUAL_TECHNIQUE_ID = 'room-empties-then-price-appears';
export const COMPOSITION_FAMILY_ID = 'physical-replacement';
export const RESULT_HOLD_FRAMES = 46;

export const ANIMATION_NARRATIVE = {
  START: 'Ein eingerichtetes Zimmer mit Sofa, Regal und Tisch',
  MECHANISM: 'Ein Möbelstück nach dem anderen verschwindet, an ihrer Stelle stapeln sich Rechnungen',
  RESULT: 'Das Zimmer ist leer und der Betrag für den Neukauf steht da',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Das Zimmer, das sich in Rechnungen verwandelt',
  SUPPORT: 'Drei erkennbare Möbelstücke',
  MATERIAL: 'Polster und Holz gegen Papier',
  DEPTH: 'Möbel auf einer Standlinie, Rechnungen davor',
};

const FURNITURE = [
  {key: 'sofa', label: 'Sofa', x: 240, y: 560, w: 420, h: 220, at: 18},
  {key: 'shelf', label: 'Regal', x: 730, y: 420, w: 260, h: 360, at: 58},
  {key: 'table', label: 'Tisch', x: 1060, y: 610, w: 300, h: 170, at: 98},
];

export const YouTubeVisual24Animation: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <YouTubePhysicalStage>
      {FURNITURE.map((piece, index) => {
        // Kanal 1 — das Möbelstück verschwindet.
        const gone = ease(frame, piece.at, piece.at + 30);
        // Kanal 2 — an seiner Stelle erscheint die Rechnung dafür.
        const billed = ease(frame, piece.at + 22, piece.at + 52);

        return (
          <React.Fragment key={piece.key}>
            <div style={{opacity: 1 - gone, transform: `translateY(${gone * 40}px)`}}>
              <PhysicalObject x={piece.x} y={piece.y} width={piece.w} height={piece.h} material="neutral" radius={22}>
                <div style={{padding: 26, fontSize: 28, fontWeight: 900, color: '#142019'}}>{piece.label}</div>
              </PhysicalObject>
            </div>
            <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${piece.x + 20}px, ${interpolate(billed, [0, 1], [piece.y + 30, piece.y - 40])}px) scale(0.52)`, opacity: billed}}> // zone-ok: Position steckt im transform darunter
              <PhysicalBill x={0} y={0} amount={['1.400 €', '900 €', '600 €'][index]} label={piece.label} rotate={index % 2 === 0 ? -5 : 4} />
            </div>
          </React.Fragment>
        );
      })}

      <div style={{position: 'absolute', left: 1440, top: 640, opacity: ease(frame, 150, 184)}}>
        <PhysicalTag material="warning">alles zusammen</PhysicalTag>
      </div>
    </YouTubePhysicalStage>
  );
};
