import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT, Icon, a, prog} from '../../../brand';
import {Chip, VISUAL_CENTER_Y} from './shared';

// Szene 12 — Start: Ereignis-Token (Hausverkauf) neben normalem 100.000-€-Rahmen.
// Mechanismus: Rahmen wächst bis BIS 500.000 €, darunter läuft eine
// 6-Monats-Zeitachse sichtbar ab.
// Ergebnis: BESONDERER FALL + MAX. 6 MONATE, normaler Rahmen bleibt Referenz.
export const TemporaryHighBalanceWindow: React.FC<{durationFrames: number}> = ({durationFrames}) => {
  const frame = useCurrentFrame();
  const mechStart = Math.round(durationFrames * 0.26);
  const mechEnd = Math.round(durationFrames * 0.7);
  const resultAt = mechEnd + 4;
  const grow = prog(frame, mechStart, mechEnd);
  const timeline = prog(frame, mechStart + 6, mechEnd + 10);

  const normalSize = 190;
  const grownSize = normalSize + (360 - normalSize) * grow;

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: VISUAL_CENTER_Y - 260, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
        <div style={{position: 'relative', width: 400, height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{
            position: 'absolute', width: normalSize, height: normalSize, borderRadius: '50%',
            border: `2px dashed ${a(C.accentLt, 0.4)}`,
          }} />
          <div style={{
            position: 'absolute', width: grownSize, height: grownSize, borderRadius: '50%',
            border: `3px solid ${a(C.gold, 0.7)}`, boxShadow: grow > 0.05 ? `0 0 44px ${a(C.gold, 0.28)}` : 'none',
          }} />
          <div style={{position: 'relative', textAlign: 'center'}}>
            <Icon name="euro" size={54} color={C.gold} stroke={2} />
            <div style={{marginTop: 8, fontFamily: FONT.body, fontWeight: 800, fontSize: 22, color: C.whiteSoft}}>HAUSVERKAUF</div>
          </div>
        </div>

        <div style={{width: 640, position: 'relative'}}>
          <div style={{height: 10, borderRadius: 6, background: a(C.white, 0.1), overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${timeline * 100}%`, background: a(C.gold, 0.6)}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: FONT.body, fontSize: 20, color: C.whiteSoft}}>
            <span>GUTSCHRIFT</span>
            <span>6 MONATE</span>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, top: VISUAL_CENTER_Y + 240, display: 'flex',
        justifyContent: 'center', gap: 16, opacity: prog(frame, resultAt, resultAt + 10),
      }}>
        <Chip label="BESONDERER FALL" tone={C.gold} />
        <Chip label="MAX. 6 MONATE" tone={C.gold} />
      </div>
    </AbsoluteFill>
  );
};
