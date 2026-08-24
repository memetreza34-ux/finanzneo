import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT, Icon, a, prog} from '../../../brand';
import {Chip, VISUAL_CENTER_Y} from './shared';

// Szene 10 — Start: Gemeinschaftskonto in der Mitte, zwei Personen daneben.
// Mechanismus: Guthaben teilt sich sichtbar 50/50 auf die zwei Personen auf.
// Ergebnis: zwei Schutzrahmen, insgesamt BIS 200.000 €, mit Hinweis.
export const JointAccountTwoHolders: React.FC<{durationFrames: number}> = ({durationFrames}) => {
  const frame = useCurrentFrame();
  const mechStart = Math.round(durationFrames * 0.28);
  const mechEnd = Math.round(durationFrames * 0.66);
  const resultAt = mechEnd + 4;
  const split = prog(frame, mechStart, mechEnd);

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: VISUAL_CENTER_Y - 220, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40}}>
        <div style={{textAlign: 'center', opacity: 0.4 + split * 0.6, transform: `scale(${0.9 + split * 0.15})`}}>
          <div style={{
            width: 100, height: 100, borderRadius: 30, background: a(C.accent, 0.12),
            border: `2.5px solid ${a(C.accent, 0.5 + split * 0.3)}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="check" size={40} color={C.accentLt} stroke={2} />
          </div>
          <div style={{marginTop: 10, fontFamily: FONT.body, color: C.whiteSoft, fontWeight: 700}}>PERSON A</div>
        </div>

        <div style={{textAlign: 'center', opacity: 1 - split * 0.5, transform: `scale(${1 - split * 0.12})`}}>
          <Icon name="wallet" size={64} color={C.white} stroke={1.8} />
          <div style={{marginTop: 6, fontFamily: FONT.body, color: C.whiteSoft, fontWeight: 700}}>GEMEINSCHAFT</div>
        </div>

        <div style={{textAlign: 'center', opacity: 0.4 + split * 0.6, transform: `scale(${0.9 + split * 0.15})`}}>
          <div style={{
            width: 100, height: 100, borderRadius: 30, background: a(C.accent, 0.12),
            border: `2.5px solid ${a(C.accent, 0.5 + split * 0.3)}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="check" size={40} color={C.accentLt} stroke={2} />
          </div>
          <div style={{marginTop: 10, fontFamily: FONT.body, color: C.whiteSoft, fontWeight: 700}}>PERSON B</div>
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, top: VISUAL_CENTER_Y + 200, display: 'flex',
        flexDirection: 'column', alignItems: 'center', gap: 12, opacity: prog(frame, resultAt, resultAt + 10),
      }}>
        <div style={{fontFamily: FONT.title, fontSize: 68, color: C.gold}}>BIS 200.000 €</div>
        <Chip label="wenn keine andere Aufteilung vereinbart" tone={C.whiteSoft} size={22} />
      </div>
    </AbsoluteFill>
  );
};
