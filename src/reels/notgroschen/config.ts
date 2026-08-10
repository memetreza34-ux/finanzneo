export type NotgroschenIcon = 'warning' | 'shield' | 'range' | 'coins' | 'steps' | 'check' | 'calculator' | 'calendar' | 'bank' | 'refresh';
export type AccentTone = 'green' | 'gold' | 'red';

export type SceneCopy = {
  headline: string;
  accent: string;
  icon: NotgroschenIcon;
  accentTone?: AccentTone;
};

export const NOTGROSCHEN_DURATIONS = [180, 150, 225, 195, 210, 150, 165, 225, 135, 165] as const;
export const NOTGROSCHEN_TOTAL_FRAMES = 1800;

export const NOTGROSCHEN_COPY: readonly SceneCopy[] = [
  {headline: 'EIN DEFEKT WIRD', accent: 'ZUR SCHULDENFALLE', icon: 'warning', accentTone: 'red'},
  {headline: 'DAFÜR BRAUCHST DU', accent: 'EINEN NOTGROSCHEN', icon: 'shield'},
  {headline: 'WIE GROSS SOLL', accent: 'DER PUFFER SEIN?', icon: 'range'},
  {headline: 'STARTE MIT', accent: '500 EURO', icon: 'coins', accentTone: 'gold'},
  {headline: 'BAUE IHN', accent: 'IN 3 STUFEN', icon: 'steps'},
  {headline: 'IST DAS WIRKLICH', accent: 'EIN NOTFALL?', icon: 'check'},
  {headline: 'BEISPIEL MIT', accent: '1.800 EURO NETTO', icon: 'calculator', accentTone: 'gold'},
  {headline: '150 EURO', accent: 'JEDEN MONAT', icon: 'calendar', accentTone: 'gold'},
  {headline: 'PARKEN, NICHT', accent: 'VERSTECKEN', icon: 'bank'},
  {headline: 'NACH DEM NOTFALL', accent: 'WIEDER AUFFÜLLEN', icon: 'refresh'},
] as const;
