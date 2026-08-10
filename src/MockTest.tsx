import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { sec, prog, E } from './brand';
import { WindowMock, IconTile } from './brand/components/WindowMock';
import { FONT } from './brand/fonts';

// Nachbau des "DEIN NEUES DEV-TEAM"-TikTok-Mockups — animiert (heller Stil).
export const MockTest: React.FC = () => {
  const f = useCurrentFrame();
  const footer = prog(f, sec(1.6), sec(2.0), E.spring);
  return (
    <AbsoluteFill style={{ background: '#ECEDEF', alignItems: 'center', justifyContent: 'center' }}>
      <WindowMock title="everything-claude-code · team" w={1000} h={560} at={sec(0.1)}>
        <div style={{ textAlign: 'center', fontFamily: FONT.body, fontWeight: 800, fontSize: 28,
          letterSpacing: 4, color: '#5A6068', marginTop: 14, opacity: prog(f, sec(0.4), sec(0.7)) }}>
          DEIN NEUES DEV-TEAM
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 70, marginTop: 56 }}>
          <IconTile letter="R" color="#3B82F6" label="Code-Reviews" at={sec(0.8)} />
          <IconTile letter="M" color="#A855F7" label="Memory" at={sec(1.0)} />
          <IconTile letter="S" color="#F97316" label="Senior Skills" at={sec(1.2)} />
          <IconTile letter="T" color="#22C55E" label="Tests" at={sec(1.4)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 56,
          opacity: footer, fontFamily: FONT.body, fontSize: 24, color: '#8A9099' }}>
          <span style={{ fontStyle: 'italic' }}>läuft in</span>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: '#D97757',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            fontFamily: FONT.title, fontSize: 22 }}>C</div>
          <span style={{ fontWeight: 700, color: '#3A3F47' }}>Claude Code</span>
        </div>
      </WindowMock>
    </AbsoluteFill>
  );
};
