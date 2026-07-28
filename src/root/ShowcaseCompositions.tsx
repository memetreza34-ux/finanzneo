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
import {FORMAT} from '../brand/tokens';

const FPS = 30;
const VERTICAL = {width: 1080, height: 1920} as const;
const WIDE = {width: 1920, height: 1080} as const;

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
  </>
);
