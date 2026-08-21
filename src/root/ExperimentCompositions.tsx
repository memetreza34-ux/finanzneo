import React from 'react';
import {Composition} from 'remotion';
import {MockTest} from '../MockTest';
import {MockMindmap} from '../MockMindmap';
import {PassivTest} from '../PassivTest';
import {PremiumTest} from '../PremiumTest';
import {Signature} from '../Signature';
import {V1Clean, V2Glass, V3Editorial, V4Neon, V5Gradient, V6Duotone} from '../Variants';
import {RealDataDemo, REAL_DATA_FRAMES} from '../RealDataDemo';
import {LottieTest} from '../LottieTest';
import {Scene01Hook, SCENE01_FRAMES} from '../zins/Scene01Hook';
import {Scene02Zinseszins, SCENE02_FRAMES} from '../zins/Scene02Zinseszins';
import {Scene03SparbuchVs, SCENE03_FRAMES} from '../zins/Scene03SparbuchVs';
import {Scene04MachtDerZeit, SCENE04_FRAMES} from '../zins/Scene04MachtDerZeit';
import {Scene05EchtesBeispiel, SCENE05_FRAMES} from '../zins/Scene05EchtesBeispiel';
import {Scene06Killer, SCENE06_FRAMES} from '../zins/Scene06Killer';
import {Scene07GroessterFehler, SCENE07_FRAMES} from '../zins/Scene07GroessterFehler';
import {Scene08WieVielReicht, SCENE08_FRAMES} from '../zins/Scene08WieVielReicht';
import {Scene09RisikoEhrlich, SCENE09_FRAMES} from '../zins/Scene09RisikoEhrlich';
import {Scene10ErsterSchritt, SCENE10_FRAMES} from '../zins/Scene10ErsterSchritt';
import {Scene11PayoffCTA, SCENE11_FRAMES} from '../zins/Scene11PayoffCTA';
import {
  ReelTemplateDemo,
  REEL_TEMPLATE_DEMO_FRAMES,
} from '../production/reel-template';
import {FORMAT} from '../brand/tokens';

// Formatwerte kommen ausschließlich aus src/brand/tokens.ts, damit Registry
// und Design-System nicht auseinanderlaufen können.
const FPS = FORMAT.fps;
const VERTICAL = FORMAT.vertical;
const WIDE = FORMAT.landscape;

/**
 * Stiltests, technische Prototypen und nicht freigegebene Reel-Entwürfe.
 * Diese Compositions dürfen nicht ungeprüft als Produktionsvideos gerendert werden.
 */
export const ExperimentCompositions: React.FC = () => (
  <>
    <Composition id="ReelTemplateDemo" component={ReelTemplateDemo} durationInFrames={REEL_TEMPLATE_DEMO_FRAMES} fps={FPS} {...VERTICAL} />

    <Composition id="S1Hook" component={Scene01Hook} durationInFrames={SCENE01_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S2Zinseszins" component={Scene02Zinseszins} durationInFrames={SCENE02_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S3SparbuchVs" component={Scene03SparbuchVs} durationInFrames={SCENE03_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S4MachtDerZeit" component={Scene04MachtDerZeit} durationInFrames={SCENE04_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S5EchtesBeispiel" component={Scene05EchtesBeispiel} durationInFrames={SCENE05_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S6Killer" component={Scene06Killer} durationInFrames={SCENE06_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S7GroessterFehler" component={Scene07GroessterFehler} durationInFrames={SCENE07_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S8WieVielReicht" component={Scene08WieVielReicht} durationInFrames={SCENE08_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S9RisikoEhrlich" component={Scene09RisikoEhrlich} durationInFrames={SCENE09_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S10ErsterSchritt" component={Scene10ErsterSchritt} durationInFrames={SCENE10_FRAMES} fps={FPS} {...WIDE} />
    <Composition id="S11PayoffCTA" component={Scene11PayoffCTA} durationInFrames={SCENE11_FRAMES} fps={FPS} {...WIDE} />

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
    <Composition id="RealDataDemo" component={RealDataDemo} durationInFrames={REAL_DATA_FRAMES} fps={FPS} {...VERTICAL} />

    <Composition id="LottieTest" component={LottieTest} durationInFrames={90} fps={FORMAT.fps} width={FORMAT.vertical.width} height={FORMAT.vertical.height} />
  </>
);
