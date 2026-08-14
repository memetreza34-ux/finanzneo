export type ZinseszinsIcon = 'compare' | 'equals' | 'growth' | 'calculator' | 'clock' | 'calendar' | 'bars' | 'time' | 'warning' | 'hourglass';
export type AccentTone = 'green' | 'gold' | 'red';

export type SceneCopy = {
  headline: string;
  accent: string;
  icon: ZinseszinsIcon;
  accentTone?: AccentTone;
};

// Durations calculated from sentence starts: 227, 271, 209, 107, 212, 225, 354, 174, 289, 151 (total 2219)
export const ZINSESZINS_DURATIONS = [227, 271, 209, 107, 212, 225, 354, 174, 289, 151] as const;
export const ZINSESZINS_TOTAL_FRAMES = ZINSESZINS_DURATIONS.reduce((a, b) => a + b, 0);

export const ZINSESZINS_COPY: readonly SceneCopy[] = [
  {headline: '100 ODER 200 EURO?', accent: 'ZEIT ENTSCHEIDET', icon: 'compare'},
  {headline: 'GLEICHE EINZAHLUNG', accent: '36.000 EURO', icon: 'equals'},
  {headline: 'DAS IST DER', accent: 'ZINSESZINS', icon: 'growth'},
  {headline: 'NUR EIN', accent: 'RECHENBEISPIEL', icon: 'calculator'},
  {headline: '100 EURO', accent: '30 JAHRE', icon: 'clock'},
  {headline: '200 EURO', accent: '15 JAHRE', icon: 'calendar'},
  {headline: 'FAST 30.000 EURO', accent: 'UNTERSCHIED', icon: 'bars'},
  {headline: 'ZEIT GIBT ERTRÄGEN', accent: 'MEHR ZEIT', icon: 'time'},
  {headline: 'ABER WICHTIG', accent: 'NICHT GARANTIERT', icon: 'warning', accentTone: 'red'},
  {headline: 'DEIN GRÖSSTER HEBEL', accent: 'IST ZEIT', icon: 'hourglass', accentTone: 'gold'},
] as const;
