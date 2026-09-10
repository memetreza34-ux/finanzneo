import * as TR from './fn_transitions';
import * as DC from './fn_decor';
import * as EX from './fn_extra';
import * as UI from './fn_ui2';
import {FNShowcaseCatalog, showcaseFrames} from './showcase-utils';

const BEAT = 110;
const items = [
  {name: 'Wipe In', node: <TR.FNWipeIn />}, {name: 'Circle Reveal', node: <TR.FNCircleReveal />},
  {name: 'Slide Over', node: <TR.FNSlideOver />}, {name: 'Zoom Blur', node: <TR.FNZoomBlur />},
  {name: 'Bars Wipe', node: <TR.FNBarsWipe />}, {name: 'Fade Through', node: <TR.FNFadeThrough />},
  {name: 'Pixel Dissolve', node: <TR.FNPixelDissolve />}, {name: 'Blur In', node: <TR.FNBlurIn />},
  {name: 'Wave Divider', node: <DC.FNWaveDivider />}, {name: 'Marquee', node: <DC.FNMarquee />},
  {name: 'Gradient Bar', node: <DC.FNGradientBar />}, {name: 'Dots Pattern', node: <DC.FNDotsPattern />},
  {name: 'Spinner', node: <DC.FNSpinner />}, {name: 'Ticker Tape', node: <DC.FNTickerTape />},
  {name: 'Arrow Pointer', node: <DC.FNArrowPointer />}, {name: 'Circle Highlight', node: <DC.FNCircleHighlight />},
  {name: 'Underline', node: <DC.FNUnderline />}, {name: 'Spotlight', node: <DC.FNSpotlight />},
  {name: 'Big Arrow Up', node: <DC.FNBigArrowUp />}, {name: 'Zoom Box', node: <DC.FNZoomBox />},
  {name: 'Countdown', node: <EX.FNCountdown />}, {name: 'Clock', node: <EX.FNClock />},
  {name: 'Calendar', node: <EX.FNCalendar />}, {name: 'Progress Days', node: <EX.FNProgressDays />},
  {name: 'Hourglass', node: <EX.FNHourglass />}, {name: 'Schedule', node: <EX.FNSchedule />},
  {name: 'World Dots', node: <EX.FNWorldDots />}, {name: 'Location Pin', node: <EX.FNLocationPin />},
  {name: 'Connection Arc', node: <EX.FNConnectionArc />}, {name: 'Region Highlight', node: <EX.FNRegionHighlight />},
  {name: 'Avatar', node: <EX.FNAvatar />}, {name: 'Persona Card', node: <EX.FNPersonaCard />},
  {name: 'Team Grid', node: <EX.FNTeamGrid />}, {name: 'Crowd Grow', node: <EX.FNCrowdGrow />},
  {name: 'Follow Bar', node: <UI.FNFollowBar />}, {name: 'Next Video', node: <UI.FNNextVideo />},
  {name: 'Logo Sting', node: <UI.FNLogoSting />}, {name: 'Thanks', node: <UI.FNThanks />},
  {name: 'Badge', node: <UI.FNBadge />}, {name: 'Chip', node: <UI.FNChip />},
  {name: 'Lower Third', node: <UI.FNLowerThird />}, {name: 'List Reveal', node: <UI.FNListReveal />},
];
export const FNEXTRA_FRAMES = showcaseFrames(items.length, BEAT);

export const FNExtraShowcase: React.FC = () => (
  <FNShowcaseCatalog items={items} beat={BEAT} background="static" contentPadding="120px" />
);
