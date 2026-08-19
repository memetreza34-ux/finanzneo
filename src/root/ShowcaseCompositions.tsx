import React from 'react';
import {Composition} from 'remotion';
import {Showcase} from '../Showcase';
import {Showcase2} from '../Showcase2';
import {Showcase3} from '../Showcase3';
import {Showcase4} from '../Showcase4';
import {Showcase5} from '../Showcase5';
import {Overview} from '../Overview';
import {TemplateDemo} from '../TemplateDemo';
import {TemplateDemo2} from '../TemplateDemo2';
import {Sizzle} from '../Sizzle';
import {UpgradeShowcase, UPGRADE_SHOWCASE_DURATION} from '../UpgradeShowcase';
import {LottieFinanzGrid} from '../LottieFinanzGrid';
import {FNShowcase, FN_FRAMES} from '../bausteine/FNShowcase';
import {FNKitShowcase, FNKIT_FRAMES} from '../bausteine/FNKitShowcase';
import {FNKit2Showcase, FNKIT2_FRAMES} from '../bausteine/FNKit2Showcase';
import {FNKit3Showcase, FNKIT3_FRAMES} from '../bausteine/FNKit3Showcase';
import {FNProShowcase, FNPRO_FRAMES} from '../bausteine/FNProShowcase';
import {FNPremiumShowcase, FNPREM_FRAMES} from '../bausteine/FNPremiumShowcase';
import {FNPremium2Showcase, FNPREM2_FRAMES} from '../bausteine/FNPremium2Showcase';
import {FNConceptsShowcase, FNCONCEPTS_FRAMES} from '../bausteine/FNConceptsShowcase';
import {FNChartProShowcase, FNCHARTPRO_FRAMES} from '../bausteine/FNChartProShowcase';
import {FNExtraShowcase, FNEXTRA_FRAMES} from '../bausteine/FNExtraShowcase';
import {FNScenesShowcase, FNSCENES_FRAMES} from '../bausteine/FNScenesShowcase';
import {FNFinanceCoreShowcase, FNFC_FRAMES} from '../bausteine/FNFinanceCoreShowcase';
import {FORMAT} from '../brand/tokens';

// Formatwerte kommen ausschließlich aus src/brand/tokens.ts, damit Registry
// und Design-System nicht auseinanderlaufen können.
const FPS = FORMAT.fps;
const VERTICAL = FORMAT.vertical;
const WIDE = FORMAT.landscape;

/**
 * Dokumentations- und Komponentenübersichten für den internen Baukasten.
 * Diese Compositions zeigen Fähigkeiten, sind aber keine fertigen Kanalvideos.
 */
export const ShowcaseCompositions: React.FC = () => (
  <>
    <Composition id="Showcase" component={Showcase} durationInFrames={780} fps={FORMAT.fps} width={FORMAT.vertical.width} height={FORMAT.vertical.height} />
    <Composition id="Overview" component={Overview} durationInFrames={90} fps={FORMAT.fps} width={FORMAT.vertical.width} height={FORMAT.vertical.height} />
    <Composition id="Showcase2" component={Showcase2} durationInFrames={690} fps={FORMAT.fps} width={FORMAT.vertical.width} height={FORMAT.vertical.height} />
    <Composition id="Showcase3" component={Showcase3} durationInFrames={840} fps={FORMAT.fps} width={FORMAT.vertical.width} height={FORMAT.vertical.height} />
    <Composition id="Showcase4" component={Showcase4} durationInFrames={750} fps={FORMAT.fps} width={FORMAT.vertical.width} height={FORMAT.vertical.height} />
    <Composition id="Showcase5" component={Showcase5} durationInFrames={450} fps={FORMAT.fps} width={FORMAT.vertical.width} height={FORMAT.vertical.height} />
    <Composition id="TemplateDemo" component={TemplateDemo} durationInFrames={690} fps={FORMAT.fps} width={FORMAT.vertical.width} height={FORMAT.vertical.height} />
    <Composition id="TemplateDemo2" component={TemplateDemo2} durationInFrames={690} fps={FORMAT.fps} width={FORMAT.vertical.width} height={FORMAT.vertical.height} />
    <Composition id="Sizzle" component={Sizzle} durationInFrames={510} fps={FPS} {...VERTICAL} />
    <Composition id="UpgradeShowcase" component={UpgradeShowcase} durationInFrames={UPGRADE_SHOWCASE_DURATION} fps={FPS} {...WIDE} />
    <Composition id="LottieFinanzGrid" component={LottieFinanzGrid} durationInFrames={90} fps={FPS} {...WIDE} />

    {/* Baustein-Übersichten: zeigen je eine Gruppe aus src/bausteine im Zusammenhang. */}
    <Composition id="FNShowcase" component={FNShowcase} durationInFrames={FN_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="FNKitShowcase" component={FNKitShowcase} durationInFrames={FNKIT_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="FNKit2Showcase" component={FNKit2Showcase} durationInFrames={FNKIT2_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="FNKit3Showcase" component={FNKit3Showcase} durationInFrames={FNKIT3_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="FNProShowcase" component={FNProShowcase} durationInFrames={FNPRO_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="FNPremiumShowcase" component={FNPremiumShowcase} durationInFrames={FNPREM_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="FNPremium2Showcase" component={FNPremium2Showcase} durationInFrames={FNPREM2_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="FNConceptsShowcase" component={FNConceptsShowcase} durationInFrames={FNCONCEPTS_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="FNChartProShowcase" component={FNChartProShowcase} durationInFrames={FNCHARTPRO_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="FNExtraShowcase" component={FNExtraShowcase} durationInFrames={FNEXTRA_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="FNScenesShowcase" component={FNScenesShowcase} durationInFrames={FNSCENES_FRAMES} fps={FPS} {...VERTICAL} />
    <Composition id="FNFinanceCoreShowcase" component={FNFinanceCoreShowcase} durationInFrames={FNFC_FRAMES} fps={FPS} {...VERTICAL} />
  </>
);
