import {AbsoluteFill, Series, useCurrentFrame} from 'remotion';
import {C, bebas, inter, StaticBG} from './fn_core';
import * as TR from './fn_transitions';
import * as DC from './fn_decor';
import * as EX from './fn_extra';
import * as UI from './fn_ui2';

const items: {name: string; node: React.ReactNode}[] = [
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
export const FNEXTRA_FRAMES = items.length * 110;

const Demo: React.FC<{name: string; node: React.ReactNode}> = ({name, node}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticBG />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '120px'}}>{node}</AbsoluteFill>
      <div style={{position: 'absolute', bottom: 50, width: '100%', textAlign: 'center', opacity: Math.min(1, (f - 4) / 12),
        fontFamily: inter, fontSize: 28, letterSpacing: 4, color: 'rgba(255,255,255,0.4)'}}>{name}</div>
    </AbsoluteFill>
  );
};

export const FNExtraShowcase: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Series>
      {items.map((it, i) => <Series.Sequence key={i} durationInFrames={110}><Demo {...it} /></Series.Sequence>)}
    </Series>
  </AbsoluteFill>
);
