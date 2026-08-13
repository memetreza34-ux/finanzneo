export type AccentTone = 'green' | 'gold' | 'red';

export type SceneCopy = {
  title: string;
  subtitle: string;
  tone?: AccentTone;
};

export const ETF_COST_MODEL = {
  monthlyContribution: 200,
  years: 30,
  months: 360,
  totalContribution: 72000,
  grossAnnualRate: 0.06,
  lowAnnualCost: 0.002,
  highAnnualCost: 0.015,
  lowNetModelRate: 0.058,
  highNetModelRate: 0.045,
  lowEndValue: 193386.74,
  highEndValue: 151877.23,
  modelDifference: 41509.52,
} as const;

// Nur Storyboard-/Code-Preview. Finale Szenenlängen kommen aus echtem Voiceover.
export const ETF_COST_PREVIEW_DURATIONS = [195, 225, 225, 180, 225, 240, 195, 210, 225, 180] as const;
export const ETF_COST_PREVIEW_TOTAL_FRAMES = ETF_COST_PREVIEW_DURATIONS.reduce((a, b) => a + b, 0);

export const ETF_COST_COPY: readonly SceneCopy[] = [
  {title: '0,2 % ODER 1,5 %?', subtitle: '30 JAHRE VERGRÖSSERN DEN ABSTAND', tone: 'gold'},
  {title: 'GLEICHER SPARPLAN', subtitle: 'ZWEI KOSTENWEGE', tone: 'green'},
  {title: 'KOSTEN WIRKEN WEITER', subtitle: 'FEHLENDES KAPITAL WÄCHST NICHT WEITER', tone: 'red'},
  {title: '72.000 € EINGEZAHLT', subtitle: '200 € MONATLICH × 30 JAHRE', tone: 'gold'},
  {title: 'SO RECHNET DAS MODELL', subtitle: '6 % VOR KOSTEN · KEINE PROGNOSE', tone: 'gold'},
  {title: 'ZWEI WEGE, ZWEI ENDWERTE', subtitle: 'GLEICHER INPUT · ANDERE KOSTEN', tone: 'green'},
  {title: 'RUND 41.500 € ABSTAND', subtitle: 'GLEICHE SPARRATE · GLEICHE LAUFZEIT', tone: 'gold'},
  {title: 'MEHR ALS LAUFENDE KOSTEN', subtitle: 'ORDERENTGELTE KÖNNEN DAZUKOMMEN', tone: 'red'},
  {title: 'MEHRERE KRITERIEN ZÄHLEN', subtitle: 'INDEX · STREUUNG · KOSTEN · FONDSGRÖSSE', tone: 'green'},
  {title: 'KOSTEN SIND VERGLEICHBAR', subtitle: 'MARKTRENDITE NICHT', tone: 'green'},
] as const;
