import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT, Icon, a, prog} from '../../../brand';
import {Chip, VISUAL_CENTER_Y} from './shared';

// Szene 08 — Start: Bank A + Bank B mit leeren Schutzrahmen.
// Mechanismus: zwei getrennte Münzströme füllen unabhängig je 80.000 € von
// 100.000 € Kapazität.
// Ergebnis: beide Rahmen grün "INNERHALB 100.000 €".
const RATIO = 80000 / 100000;

const BankColumn: React.FC<{label: string; fill: number}> = ({label, fill}) => (
  <div style={{textAlign: 'center'}}>
    <div style={{
      width: 100, height: 100, borderRadius: 24, margin: '0 auto 14px', background: a(C.accent, 0.1),
      border: `2px solid ${a(C.accent, 0.4)}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name="bank" size={44} color={C.accentLt} stroke={2} />
    </div>
    <div style={{fontFamily: FONT.body, fontWeight: 800, color: C.whiteSoft, marginBottom: 10}}>{label}</div>
    <div style={{position: 'relative', width: 60, height: 220, borderRadius: 18, margin: '0 auto', background: a(C.white, 0.08), border: `2px solid ${a(C.accentLt, fill > 0.02 ? 0.6 : 0.25)}`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${fill * RATIO * 100}%`, background: a(C.accent, 0.55)}} />
    </div>
  </div>
);

export const SeparateBankLimits: React.FC<{durationFrames: number}> = ({durationFrames}) => {
  const frame = useCurrentFrame();
  const mechStart = Math.round(durationFrames * 0.3);
  const mechEnd = Math.round(durationFrames * 0.68);
  const resultAt = mechEnd + 4;
  const fill = prog(frame, mechStart, mechEnd);

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: VISUAL_CENTER_Y - 220, display: 'flex', justifyContent: 'center', gap: 100}}>
        <BankColumn label="BANK A · 80.000 €" fill={fill} />
        <BankColumn label="BANK B · 80.000 €" fill={fill} />
      </div>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: VISUAL_CENTER_Y + 260, display: 'flex',
        justifyContent: 'center', gap: 18, opacity: prog(frame, resultAt, resultAt + 10),
      }}>
        <Chip label="INNERHALB 100.000 €" tone={C.accentLt} size={24} />
        <Chip label="INNERHALB 100.000 €" tone={C.accentLt} size={24} />
      </div>
    </AbsoluteFill>
  );
};
