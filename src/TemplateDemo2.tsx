import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, sec, IntroScene, StepsScene, ListScene, QuoteScene, SectionDivider } from './brand';

// Demo der 5 neuen Szenen-Vorlagen.
export const TemplateDemo2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <IntroScene inF={0} outF={sec(4)} title="So fängst du 2026 an" kicker="FinanzNeo" />
    <SectionDivider inF={sec(4)} outF={sec(8)} part="TEIL 1" title="Die Grundlagen" />
    <StepsScene inF={sec(8)} outF={sec(13)} title="3 Schritte zum Depot"
      steps={[
        { label: 'ETF verstehen', icon: 'bulb' },
        { label: 'Depot eröffnen', icon: 'bank' },
        { label: 'Sparplan starten', icon: 'rocket' },
      ]} />
    <ListScene inF={sec(13)} outF={sec(18)} title="Das brauchst du" solveAll
      items={['Ein Depot', '100 € im Monat', 'Etwas Geduld']} />
    <QuoteScene inF={sec(18)} outF={sec(23)}
      text="Der beste Zeitpunkt war gestern. Der zweitbeste ist heute."
      author="Investoren-Weisheit" />
  </AbsoluteFill>
);
