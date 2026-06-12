import React from 'react';
import { Composition } from 'remotion';
import { Showcase } from './Showcase';
import { Showcase2 } from './Showcase2';
import { Showcase3 } from './Showcase3';
import { Showcase4 } from './Showcase4';
import { Showcase5 } from './Showcase5';
import { TemplateDemo } from './TemplateDemo';
import { TemplateDemo2 } from './TemplateDemo2';
import { Thumbnail } from './Thumbnail';
import { MockTest } from './MockTest';
import { MockMindmap } from './MockMindmap';
import { PassivTest } from './PassivTest';
import { Sizzle } from './Sizzle';
import { Signature } from './Signature';
import { V1Clean, V2Glass, V3Editorial, V4Neon, V5Gradient, V6Duotone } from './Variants';
import { PremiumReel } from './PremiumReel';
import { MegaReel } from './MegaReel';
import { PremiumTest } from './PremiumTest';
import { Overview } from './Overview';
import { LottieTest } from './LottieTest';
import { CleanReel, CLEAN_REEL_FRAMES } from './CleanReel';
import { RealDataDemo, REAL_DATA_FRAMES } from './RealDataDemo';
import { UpgradeShowcase, UPGRADE_SHOWCASE_DURATION } from './UpgradeShowcase';
import { DisclaimerPreview } from './DisclaimerPreview';
// FullVideoSynced = Audio-Sync-Vorlage. Erst registrieren, wenn echtes Audio + Captions da sind
// (public/audio/<name>.mp3 + public/captions/<name>.json) — siehe Kopf von FullVideoSynced.tsx.
import { FORMAT } from './brand/tokens';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Baukasten-Demo (bewegt) */}
    <Composition
      id="Showcase"
      component={Showcase}
      durationInFrames={780}
      fps={FORMAT.fps}
      width={FORMAT.vertical.width}
      height={FORMAT.vertical.height}
    />
    {/* Übersichts-Poster (statisch) */}
    <Composition
      id="Overview"
      component={Overview}
      durationInFrames={90}
      fps={FORMAT.fps}
      width={FORMAT.vertical.width}
      height={FORMAT.vertical.height}
    />
    {/* Neue Bausteine: Übergänge, Text-FX, Donut, Mockup */}
    <Composition
      id="Showcase2"
      component={Showcase2}
      durationInFrames={690}
      fps={FORMAT.fps}
      width={FORMAT.vertical.width}
      height={FORMAT.vertical.height}
    />
    {/* Finanz-Bausteine: Stat, Vergleich, Tabelle, Tacho, Checkliste, Zitat */}
    <Composition
      id="Showcase3"
      component={Showcase3}
      durationInFrames={840}
      fps={FORMAT.fps}
      width={FORMAT.vertical.width}
      height={FORMAT.vertical.height}
    />
    <Composition id="Showcase4" component={Showcase4} durationInFrames={750} fps={FORMAT.fps} width={FORMAT.vertical.width} height={FORMAT.vertical.height} />
    <Composition id="PremiumTest" component={PremiumTest} durationInFrames={150} fps={FORMAT.fps} width={FORMAT.vertical.width} height={FORMAT.vertical.height} />
    <Composition id="Showcase5" component={Showcase5} durationInFrames={450} fps={FORMAT.fps} width={FORMAT.vertical.width} height={FORMAT.vertical.height} />
    <Composition id="TemplateDemo" component={TemplateDemo} durationInFrames={690} fps={FORMAT.fps} width={FORMAT.vertical.width} height={FORMAT.vertical.height} />
    <Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={30} width={1280} height={720} />
    <Composition id="MockTest" component={MockTest} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="MockMindmap" component={MockMindmap} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="TemplateDemo2" component={TemplateDemo2} durationInFrames={690} fps={FORMAT.fps} width={FORMAT.vertical.width} height={FORMAT.vertical.height} />
    <Composition id="PassivTest" component={PassivTest} durationInFrames={360} fps={30} width={1080} height={1920} />
    <Composition id="Sizzle" component={Sizzle} durationInFrames={510} fps={30} width={1080} height={1920} />
    <Composition id="PremiumReel" component={PremiumReel} durationInFrames={465} fps={30} width={1080} height={1920} />
    <Composition id="MegaReel" component={MegaReel} durationInFrames={3780} fps={30} width={1080} height={1920} />
    <Composition id="V1Clean" component={V1Clean} durationInFrames={30} fps={30} width={1080} height={1920} />
    <Composition id="V2Glass" component={V2Glass} durationInFrames={30} fps={30} width={1080} height={1920} />
    <Composition id="V3Editorial" component={V3Editorial} durationInFrames={30} fps={30} width={1080} height={1920} />
    <Composition id="V4Neon" component={V4Neon} durationInFrames={30} fps={30} width={1080} height={1920} />
    <Composition id="V5Gradient" component={V5Gradient} durationInFrames={30} fps={30} width={1080} height={1920} />
    <Composition id="V6Duotone" component={V6Duotone} durationInFrames={30} fps={30} width={1080} height={1920} />
    <Composition id="Signature" component={Signature} durationInFrames={300} fps={30} width={1080} height={1920} />
    <Composition id="CleanReel" component={CleanReel} durationInFrames={CLEAN_REEL_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="RealDataDemo" component={RealDataDemo} durationInFrames={REAL_DATA_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="UpgradeShowcase" component={UpgradeShowcase} durationInFrames={UPGRADE_SHOWCASE_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="DisclaimerVertical" component={DisclaimerPreview} durationInFrames={300} fps={30} width={1080} height={1920} />
    <Composition id="DisclaimerWide" component={DisclaimerPreview} durationInFrames={300} fps={30} width={1920} height={1080} />
    {/* Lottie-Test-Raster */}
    <Composition
      id="LottieTest"
      component={LottieTest}
      durationInFrames={90}
      fps={FORMAT.fps}
      width={FORMAT.vertical.width}
      height={FORMAT.vertical.height}
    />
  </>
);
