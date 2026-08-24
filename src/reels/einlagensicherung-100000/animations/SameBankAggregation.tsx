import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, Icon, a, prog} from '../../../brand';
import {Block, Chip, VISUAL_CENTER_Y} from './shared';

// Szene 04 — Start: Konto A + Konto B getrennt bei derselben Bank.
// Mechanismus: beide Beträge wandern zusammen und werden sichtbar addiert.
// Ergebnis: GESAMTGUTHABEN BEI DIESER BANK.
const AMOUNT_A = 60000;
const AMOUNT_B = 50000;

export const SameBankAggregation: React.FC<{durationFrames: number}> = ({durationFrames}) => {
  const frame = useCurrentFrame();
  const mechStart = Math.round(durationFrames * 0.3);
  const mechEnd = Math.round(durationFrames * 0.68);
  const resultAt = mechEnd + 4;
  const merge = prog(frame, mechStart, mechEnd);

  const countProgress = prog(frame, mechStart + 4, mechEnd);
  const total = interpolate(countProgress, [0, 1], [0, AMOUNT_A + AMOUNT_B]);

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: VISUAL_CENTER_Y - 220, display: 'flex', justifyContent: 'center', gap: 60}}>
        <div style={{textAlign: 'center', transform: `translateX(${merge * 26}px)`, opacity: 1 - merge * 0.74}}>
          <Block w={220} h={140} tone={C.white} fill={0.08}>
            <div style={{fontFamily: FONT.title, fontSize: 40, color: C.white}}>60.000 €</div>
          </Block>
          <div style={{marginTop: 10, fontFamily: FONT.body, fontWeight: 700, color: C.whiteSoft}}>KONTO A</div>
        </div>
        <div style={{textAlign: 'center', transform: `translateX(${-merge * 26}px)`, opacity: 1 - merge * 0.74}}>
          <Block w={220} h={140} tone={C.white} fill={0.08}>
            <div style={{fontFamily: FONT.title, fontSize: 40, color: C.white}}>50.000 €</div>
          </Block>
          <div style={{marginTop: 10, fontFamily: FONT.body, fontWeight: 700, color: C.whiteSoft}}>KONTO B</div>
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: VISUAL_CENTER_Y - 60, display: 'flex', justifyContent: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{
            width: 90, height: 90, borderRadius: 22, margin: '0 auto', background: a(C.accent, 0.14),
            border: `2px solid ${a(C.accent, 0.45)}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="bank" size={40} color={C.accentLt} stroke={2} />
          </div>
          <div style={{marginTop: 12, fontFamily: FONT.body, color: C.whiteSoft, fontWeight: 700}}>DIESELBE BANK</div>
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, top: VISUAL_CENTER_Y + 190, display: 'flex',
        flexDirection: 'column', alignItems: 'center', gap: 12, opacity: prog(frame, mechStart + 4, mechStart + 14),
      }}>
        <div style={{fontFamily: FONT.title, fontSize: 84, color: C.gold}}>
          {Math.round(total).toLocaleString('de-DE')} €
        </div>
        <div style={{opacity: prog(frame, resultAt, resultAt + 10)}}>
          <Chip label="GESAMTGUTHABEN BEI DIESER BANK" tone={C.gold} size={26} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
