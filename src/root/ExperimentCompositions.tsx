import React from 'react';
import {Composition} from 'remotion';
import {MockTest} from '../MockTest';
import {MockMindmap} from '../MockMindmap';
import {PassivTest} from '../PassivTest';
import {PremiumTest} from '../PremiumTest';
import {PremiumReel} from '../PremiumReel';
import {MegaReel} from '../MegaReel';
import {Signature} from '../Signature';
import {V1Clean, V2Glass, V3Editorial, V4Neon, V5Gradient, V6Duotone} from '../Variants';
import {CleanReel, CLEAN_REEL_FRAMES} from '../CleanReel';
import {RealDataDemo, REAL_DATA_FRAMES} from '../RealDataDemo';
import {LottieTest} from '../LottieTest';
import {
  ReelTemplateDemo,
  REEL_TEMPLATE_DEMO_FRAMES,
} from '../production/reel-template';
import {FORMAT} from '../brand/tokens';

const FPS = 30;
const VERTICAL = {width: 1080, height: 1920} as const;
const WIDE = {width: 1920, height: 1080} as const;

/**
 * Stiltests, technische Prototypen und nicht freigegebene Reel-Entwürfe.
 * Diese Compositions dürfen nicht ungeprüft als Produktionsvideos gerendert werden.
 */
export const ExperimentCompositions: React.FC = () => (
  <>
    <Composition id="ReelTemplateDemo" component={ReelTemplateDemo} durationInFrames={REEL_TEMPLATE_DEMO_FRAMES} fps={FPS} {...VERTICAL} />

    <Composition id="MockTest" component={MockTest} durationInFrames={90} fps={FPS} {...WIDE} />
    <Composition id="MockMindmap" component={MockMindmap} durationInFrames={150} fps={FPS} {...WIDE} />
    <Composition id="PassivTest" component={PassivTest} durationInFrames={360} fps={FPS} {...VERTICAL} />
    <Composition id="PremiumTest" component={PremiumTest} durationInFrames={150} fps={FORMAT.fps} width={FORMAT.vertical.width} height={FORMAT.vertical.height} />

    <Composition id="V1Clean" component={V1Clean} durationInFrames={30} fps={FPS} {...VERTICAL} />
    <Composition id="V2Glass" component={V2Glass} durationInFrames={30} fps={FPS} {...VERTICAL} />
    <Composition id="V3Editorial" component={V3Editorial} durationInFrames={30} fps={FPS} {...VERTICAL} />
    <Composition id="V4Neon" component={V4Neon} durationInFrames={30} fps={FPS} {...VERTICAL} />
    <Composition id="V5Gradient" component={V5Gradient} durationInFrames={30} fps={FPS} {...VERTICAL} />
    <Composition id="V6Duotone" component={V6Duotone} durationInFrames={30} fps={FPS} {...VERTICAL} />

    <Composition id="Signature" component={Signature} durationInFrames={300} fps={FPS} {...VERTICAL} />
    <Composition id="CleanReel" component={CleanReel} durationInFrames={CLEAN_REEL_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="RealDataDemo" component={RealDataDemo} durationInFrames={REAL_DATA_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="PremiumReel" component={PremiumReel} durationInFrames={465} fps={FPS} {...VERTICAL} />
    <Composition id="MegaReel" component={MegaReel} durationInFrames={3780} fps={FPS} {...VERTICAL} />

    <Composition id="LottieTest" component={LottieTest} durationInFrames={90} fps={FORMAT.fps} width={FORMAT.vertical.width} height={FORMAT.vertical.height} />
  </>
);
