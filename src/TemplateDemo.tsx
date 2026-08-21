import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import {
  C, sec, Background, Vignette,
  LogoIntro, SubscribeBar, EndCard,
  HookScene, StatScene, CompareScene, CTAScene,
  Captions, CaptionWord,
} from './brand';

// Beispiel-Captions (sonst aus scripts/captions.py → JSON).
const SAMPLE: CaptionWord[] = [
  { word: '73%', start: 2.2, end: 2.6 }, { word: 'der', start: 2.6, end: 2.8 },
  { word: 'Deutschen', start: 2.8, end: 3.3 }, { word: 'sparen', start: 3.3, end: 3.7 },
  { word: 'komplett', start: 3.7, end: 4.2 }, { word: 'falsch.', start: 4.2, end: 4.7 },
];

// Komplette Mini-Video-Struktur: Intro → Hook → Stat → Vergleich → CTA → Outro.
export const TemplateDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Background grid glow />

      {/* Intro 0–2s */}
      <Sequence from={0} durationInFrames={sec(2)}><LogoIntro at={0} /></Sequence>

      {/* Hook 2–6s (mit Untertiteln) */}
      <HookScene inF={sec(2)} outF={sec(6)} kicker="Achtung" color={C.negative}
        statement="73% der Deutschen sparen komplett falsch."
        highlight={['73%', 'falsch.']} />
      <Captions words={SAMPLE} perGroup={3} highlight={C.negative} />

      {/* Stat 6–11s */}
      <StatScene inF={sec(6)} outF={sec(11)} value={120000} label="möglich nach 30 Jahren" color={C.accent} />

      {/* Vergleich 11–16s */}
      <CompareScene inF={sec(11)} outF={sec(16)} title="Sparbuch vs ETF"
        left={{ title: 'Sparbuch', value: '20k', sub: 'nach 30 J.', icon: 'bank' }}
        right={{ title: 'ETF', value: '120k', sub: 'nach 30 J.', icon: 'chart-up' }} />

      {/* CTA 16–20s */}
      <CTAScene inF={sec(16)} outF={sec(20)} line1="Bleib dran." line2="Es lohnt sich." />

      {/* Outro 20–23s */}
      <Sequence from={sec(20)} durationInFrames={sec(3)}>
        <EndCard at={0} nextHint="Mehr Finanz-Tipps" />
      </Sequence>

      {/* Abonnieren-Bar bei ~8s für 3s */}
      <SubscribeBar at={sec(8)} dur={sec(3)} />

      <Vignette />
    </AbsoluteFill>
  );
};
