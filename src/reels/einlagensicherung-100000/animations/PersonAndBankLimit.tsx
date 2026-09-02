import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT, Icon, a, prog} from '../../../brand';
import {Chip, VISUAL_CENTER_Y} from './shared';

// Szene 02 — Start: Person + Bank + 3 getrennte Konten mit Mini-Schilden.
// Mechanismus: die 3 Mini-Schilde lösen sich auf, alle Konten fließen in
// EINEN gemeinsamen Bank-Schutzrahmen.
// Ergebnis: 100.000 € · PRO PERSON · PRO BANK, „PRO KONTO“ rot durchgestrichen.
export const PersonAndBankLimit: React.FC<{durationFrames: number}> = ({durationFrames}) => {
  const frame = useCurrentFrame();
  const mechStart = Math.round(durationFrames * 0.32);
  const mechEnd = Math.round(durationFrames * 0.62);
  const resultAt = mechEnd + 4;

  const preMerge = prog(frame, mechStart, mechEnd); // 0 -> 1: Konten wandern zusammen
  const frameShrink = 1 - preMerge; // Mini-Schilde schrumpfen weg
  const frameGrow = prog(frame, mechStart, mechEnd); // gemeinsamer Rahmen wächst

  const accounts = ['GIRO', 'TAGESGELD', 'FESTGELD'];

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: VISUAL_CENTER_Y - 280, left: 0, right: 0, height: 560}}>
        <div style={{position: 'relative', width: '100%', height: '100%'}}>
          {/* Person links */}
          <div style={{position: 'absolute', left: 90, top: 200, textAlign: 'center'}}>
            <div style={{
              width: 90, height: 90, borderRadius: 26, background: a(C.white, 0.1),
              border: `2px solid ${a(C.white, 0.4)}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="check" size={38} color={C.white} stroke={2.2} />
            </div>
          </div>

          {/* Konten in der Mitte, wandern nach rechts zusammen */}
          {accounts.map((label, index) => {
            const baseX = 260 + index * 190;
            const mergedX = 480;
            const x = baseX + (mergedX - baseX) * preMerge;
            const y = 90 + index * 8;
            return (
              <div key={label} style={{position: 'absolute', left: x, top: y, opacity: 1 - preMerge * 0.35}}>
                <Chip label={label} tone={C.white} size={22} style={{padding: '8px 14px'}} />
                <div style={{
                  marginTop: 8, width: 30, height: 30, borderRadius: 10, marginInline: 'auto',
                  border: `2px solid ${a(C.negativeLt, 0.7)}`, opacity: frameShrink,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="cross" size={16} color={C.negativeLt} stroke={2.4} glow={false} />
                </div>
              </div>
            );
          })}

          {/* Bank rechts */}
          <div style={{position: 'absolute', right: 70, top: 190, textAlign: 'center'}}>
            <div style={{
              width: 110, height: 100, borderRadius: 22, background: a(C.accent, 0.12),
              border: `2px solid ${a(C.accent, 0.45)}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="bank" size={46} color={C.accentLt} stroke={2} />
            </div>
          </div>

          {/* Gemeinsamer Schutzrahmen wächst um Person+Bank */}
          <div style={{
            position: 'absolute', left: 60, right: 40, top: 40, bottom: 20,
            borderRadius: 44, border: `3px solid ${a(C.accentLt, 0.75)}`,
            opacity: frameGrow, transform: `scale(${0.9 + frameGrow * 0.1})`,
            boxShadow: frameGrow > 0.05 ? `0 0 40px ${a(C.accent, 0.25)}` : 'none',
          }} />
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, top: VISUAL_CENTER_Y + 300,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
        opacity: prog(frame, resultAt, resultAt + 10),
      }}>
        <div style={{
          fontFamily: FONT.title, fontSize: 72, color: C.gold,
          textShadow: `0 0 24px ${a(C.gold, 0.3)}`,
        }}>
          100.000 €
        </div>
        <div style={{display: 'flex', gap: 14, opacity: prog(frame, resultAt + 8, resultAt + 18)}}>
          <Chip label="PRO PERSON" tone={C.accentLt} />
          <Chip label="PRO BANK" tone={C.accentLt} />
          <Chip label="PRO KONTO ✕" tone={C.negativeLt} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
