// Gemeinsame Typen der Finance Motion Library. Eigene Datei, damit die
// Kern-Mechaniken (core.tsx) und der Library-Index sich nicht gegenseitig
// importieren müssen.

export type MotionBaseProps = {durationFrames?: number};
export type FinanceTone = 'positive' | 'warning' | 'money' | 'neutral' | 'trust';
export type ValueUnit = '€' | '%' | '';
