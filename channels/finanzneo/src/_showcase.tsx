// ════════════════════════════════════════════════════════════════════════════
//  SHOWCASE — unabhängige Demos der neu geholten Bausteine (remotion-bits).
//  KEIN echtes Reel, rührt Diversifikation/Gebührenfalle nicht an.
//  Start: npx remotion studio src/_showcase.tsx --port=3012
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { Composition, registerRoot, AbsoluteFill } from 'remotion';
import { ThemeProvider, Lucide, LightLeak } from '@studio/core';
import { BRAND } from '../brand/brand';
import { MatrixRain } from '../../../core/gehirn/templates/remotion-bits/components/MatrixRain';
import { Particles, Spawner, Behavior } from '../../../core/gehirn/templates/remotion-bits/components/ParticleSystem';
import { TypeWriter } from '../../../core/gehirn/templates/remotion-bits/components/TypeWriter';
import { GradientTransition } from '../../../core/gehirn/templates/remotion-bits/components/GradientTransition';
import LineChart from '../../../core/gehirn/templates/rve-templates/line-chart';
import StatCounter from '../../../core/gehirn/templates/rve-templates/stat-counter';
import ParticleExplosion from '../../../core/gehirn/templates/rve-templates/particle-explosion';
import ComparisonChart from '../../../core/gehirn/templates/rve-templates/comparison-chart';
import PieChart from '../../../core/gehirn/templates/rve-templates/pie-chart';
import DonutChart from '../../../core/gehirn/templates/rve-templates/donut-chart';
import AreaChart from '../../../core/gehirn/templates/rve-templates/area-chart';
import ProgressBars from '../../../core/gehirn/templates/rve-templates/progress-bars';
import CircularProgress from '../../../core/gehirn/templates/rve-templates/circular-progress';
import Starfield from '../../../core/gehirn/templates/rve-templates/starfield';
import BokehCircles from '../../../core/gehirn/templates/rve-templates/bokeh-circles';
import GlitchText from '../../../core/gehirn/templates/rve-templates/glitch-text';
import BounceText from '../../../core/gehirn/templates/rve-templates/bounce-text';
import CardFlip from '../../../core/gehirn/templates/rve-templates/card-flip';
import NotificationPop from '../../../core/gehirn/templates/rve-templates/notification-pop';
import SpotlightReveal from '../../../core/gehirn/templates/rve-templates/spotlight-reveal';
import CountdownTimer from '../../../core/gehirn/templates/rve-templates/countdown-timer';
import SoundWave from '../../../core/gehirn/templates/rve-templates/sound-wave';

const MatrixDemo: React.FC = () => (
  <ThemeProvider value={BRAND}>
    <AbsoluteFill style={{ background: BRAND.bgDeep }}>
      <MatrixRain color={BRAND.accent} fontSize={26} density={0.7} speed={1.2} />
    </AbsoluteFill>
  </ThemeProvider>
);

const ParticlesDemo: React.FC = () => (
  <ThemeProvider value={BRAND}>
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <Particles>
        <Spawner rate={2.5} position={{ x: 540, y: 1400 }} area={{ width: 400, height: 10 }}
          velocity={{ x: 0, y: -3, varianceX: 1.2, varianceY: 0.6 }} lifespan={100}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: BRAND.accent, boxShadow: `0 0 12px ${BRAND.accent}` }} />
        </Spawner>
        <Behavior gravity={{ y: 0.008 }} />
      </Particles>
    </AbsoluteFill>
  </ThemeProvider>
);

const TypeWriterDemo: React.FC = () => (
  <ThemeProvider value={BRAND}>
    <AbsoluteFill style={{ background: BRAND.bg, alignItems: 'center', justifyContent: 'center' }}>
      <TypeWriter text="Diversifikation schützt dein Depot." typeSpeed={4}
        style={{ fontFamily: 'monospace', fontSize: 56, color: '#fff', fontWeight: 900 }} />
    </AbsoluteFill>
  </ThemeProvider>
);

const GradientDemo: React.FC = () => (
  <ThemeProvider value={BRAND}>
    <AbsoluteFill>
      <GradientTransition
        gradient={[
          `linear-gradient(0deg, ${BRAND.bgDeep}, ${BRAND.accent})`,
          `linear-gradient(180deg, ${BRAND.accent}, #3D8BFF)`,
          `linear-gradient(90deg, ${BRAND.bgDeep}, ${BRAND.accent})`,
        ]}
        duration={45}
        style={{ position: 'absolute', inset: 0 }}
      />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Lucide name="trending-up" size={140} color="#fff" />
      </AbsoluteFill>
    </AbsoluteFill>
  </ThemeProvider>
);

const LightLeakDemo: React.FC = () => (
  <ThemeProvider value={BRAND}>
    <AbsoluteFill style={{ background: BRAND.bgDeep, alignItems: 'center', justifyContent: 'center' }}>
      <Lucide name="trending-up" size={140} color="#fff" />
      <LightLeak seed={7} hueShift={140} style={{ mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  </ThemeProvider>
);

const Root = () => (
  <>
    <Composition id="1-MatrixRain" component={MatrixDemo} durationInFrames={120} fps={30} width={1080} height={1920} />
    <Composition id="2-Particles" component={ParticlesDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
    <Composition id="3-TypeWriter" component={TypeWriterDemo} durationInFrames={100} fps={30} width={1080} height={1920} />
    <Composition id="4-GradientTransition" component={GradientDemo} durationInFrames={135} fps={30} width={1080} height={1920} />
    <Composition id="5-LineChart" component={LineChart} durationInFrames={90} fps={30} width={1080} height={1080} />
    <Composition id="6-StatCounter" component={StatCounter} durationInFrames={90} fps={30} width={1080} height={1080} />
    <Composition id="7-ParticleExplosion" component={ParticleExplosion} durationInFrames={90} fps={30} width={1080} height={1080} />
    <Composition id="8-ComparisonChart" component={ComparisonChart} durationInFrames={90} fps={30} width={1080} height={1080} />
    <Composition id="9-PieChart" component={PieChart} durationInFrames={90} fps={30} width={1080} height={1080} />
    <Composition id="10-DonutChart" component={DonutChart} durationInFrames={90} fps={30} width={1080} height={1080} />
    <Composition id="11-AreaChart" component={AreaChart} durationInFrames={90} fps={30} width={1080} height={1080} />
    <Composition id="12-ProgressBars" component={ProgressBars} durationInFrames={90} fps={30} width={1080} height={1080} />
    <Composition id="13-CircularProgress" component={CircularProgress} durationInFrames={90} fps={30} width={1080} height={1080} />
    <Composition id="14-Starfield" component={Starfield} durationInFrames={90} fps={30} width={1080} height={1920} />
    <Composition id="15-BokehCircles" component={BokehCircles} durationInFrames={90} fps={30} width={1080} height={1920} />
    <Composition id="16-GlitchText" component={GlitchText} durationInFrames={90} fps={30} width={1080} height={1080} />
    <Composition id="17-BounceText" component={BounceText} durationInFrames={90} fps={30} width={1080} height={1080} />
    <Composition id="18-CardFlip" component={CardFlip} durationInFrames={90} fps={30} width={1080} height={1080} />
    <Composition id="19-NotificationPop" component={NotificationPop} durationInFrames={90} fps={30} width={1080} height={1080} />
    <Composition id="20-SpotlightReveal" component={SpotlightReveal} durationInFrames={90} fps={30} width={1080} height={1080} />
    <Composition id="21-CountdownTimer" component={CountdownTimer} durationInFrames={150} fps={30} width={1080} height={1080} />
    <Composition id="22-SoundWave" component={SoundWave} durationInFrames={90} fps={30} width={1080} height={1080} />
    <Composition id="23-LightLeak" component={LightLeakDemo} durationInFrames={90} fps={30} width={1080} height={1920} />
  </>
);
registerRoot(Root);
