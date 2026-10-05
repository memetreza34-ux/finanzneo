import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, CLAMP, E, FONT, prog} from '../brand';

/**
 * Vergleichsdemo: echtes Liniendiagramm mit X- und Y-Achse in Remotion (16:9).
 *
 * Beispielrechnung: 10.000 € einmalig angelegt, 7 % p. a., ohne Kosten und
 * Steuern. Die Kurve zeichnet sich so, wie der Sprechtext es sagt — erst flach,
 * dann steil — und jeder Punkt liegt exakt auf dem gerechneten Wert.
 */

export const ZINSESZINS_DIAGRAMM_FRAMES = 300;

const START = 10000;
const RATE = 0.07;
const YEARS = 30;
const Y_MAX = 80000;
const wert = (jahr: number) => START * (1 + RATE) ** jahr;
const euro = (n: number) => `${Math.round(n).toLocaleString('de-DE')} €`;

// Diagrammfläche im 1920×1080-Raster.
const L = 300;
const R = 1640;
const T = 250;
const B = 900;
const x = (jahr: number) => L + ((R - L) * jahr) / YEARS;
const y = (betrag: number) => B - ((B - T) * betrag) / Y_MAX;

const Label: React.FC<{
  left: number;
  top: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  align?: 'left' | 'center' | 'right';
  opacity?: number;
}> = ({left, top, children, size = 26, color = C.gray, weight = 600, align = 'center', opacity = 1}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      transform: align === 'center' ? 'translate(-50%, -50%)' : align === 'right' ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
      whiteSpace: 'nowrap',
      fontFamily: FONT.body,
      fontSize: size,
      fontWeight: weight,
      color,
      opacity,
    }}
  >
    {children}
  </div>
);

export const ZinseszinsLinienDiagramm: React.FC = () => {
  const frame = useCurrentFrame();
  const intro = prog(frame, 0, 14);
  const achsen = prog(frame, 4, 22, E.inOut);
  const ohneZinsen = prog(frame, 24, 50, E.inOut);
  const jahr = interpolate(frame, [58, 232], [0, YEARS], {...CLAMP, easing: E.inOut});
  const payoff = prog(frame, 238, 256);

  const kurve: string[] = [];
  for (let t = 0; t <= jahr + 1e-6; t += 0.1) kurve.push(`${x(t).toFixed(1)},${y(wert(t)).toFixed(1)}`);
  kurve.push(`${x(jahr).toFixed(1)},${y(wert(jahr)).toFixed(1)}`);

  const meilensteine = [10, 20, 30];
  const zeichnet = jahr > 0 && jahr < YEARS;
  const nahMeilenstein = Math.min(...meilensteine.map((m) => Math.abs(jahr - m)), jahr);
  const spitzeSichtbar = zeichnet ? interpolate(nahMeilenstein, [1.5, 3], [0, 1], CLAMP) : 0;
  // Ein Meilenstein erscheint, wenn die Kurve ihn erreicht — der letzte endet genau bei Jahr 30.
  const erreicht = (m: number) => (m === YEARS ? prog(jahr, m - 0.6, m) : prog(jahr, m - 0.05, m + 0.6));
  const spitzenWert = Math.round(wert(jahr) / 100) * 100;

  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      <Label left={160} top={92} size={22} weight={800} color={C.accent} align="left" opacity={intro}>
        <span style={{letterSpacing: 5}}>BEISPIELRECHNUNG</span>
      </Label>
      <Label left={160} top={140} size={54} weight={800} color={C.white} align="left" opacity={intro}>
        Was aus 10.000 € wird
      </Label>

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {[0, 20000, 40000, 60000, 80000].map((betrag) => (
          <line key={betrag} x1={L} x2={L + (R - L) * achsen} y1={y(betrag)} y2={y(betrag)} stroke="#262626" strokeWidth={2} />
        ))}
        {[5, 10, 15, 20, 25, 30].map((t) => (
          <line key={t} x1={x(t)} x2={x(t)} y1={B} y2={B - (B - T) * achsen} stroke="#1C1C1C" strokeWidth={2} />
        ))}
        <line x1={L} x2={L + (R - L) * achsen} y1={B} y2={B} stroke="#8A8A8A" strokeWidth={3} />
        <line x1={L} x2={L} y1={B} y2={B - (B - T) * achsen} stroke="#8A8A8A" strokeWidth={3} />

        <line x1={L} x2={L + (R - L) * ohneZinsen} y1={y(START)} y2={y(START)} stroke="#7A7A7A" strokeWidth={6} strokeLinecap="round" />

        {jahr > 0 ? (
          <polyline points={kurve.join(' ')} fill="none" stroke={C.accent} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        ) : null}

        {meilensteine.map((m) => {
          const da = erreicht(m);
          return da > 0 ? <circle key={m} cx={x(m)} cy={y(wert(m))} r={11 * da} fill={C.accent} stroke="#000000" strokeWidth={4} /> : null;
        })}
        {zeichnet ? <circle cx={x(jahr)} cy={y(wert(jahr))} r={13} fill={C.white} stroke={C.accent} strokeWidth={5} /> : null}
        <circle cx={x(0)} cy={y(START)} r={10 * prog(frame, 50, 58)} fill={C.white} />

        <line
          x1={x(YEARS)}
          x2={x(YEARS)}
          y1={y(START) - 14}
          y2={y(wert(YEARS)) + 18}
          stroke={C.accent}
          strokeWidth={4}
          strokeDasharray="10 10"
          opacity={payoff}
        />
      </svg>

      {[0, 20000, 40000, 60000, 80000].map((betrag) => (
        <Label key={betrag} left={L - 22} top={y(betrag)} align="right" opacity={achsen}>
          {betrag === 0 ? '0 €' : euro(betrag)}
        </Label>
      ))}
      {[0, 5, 10, 15, 20, 25, 30].map((t) => (
        <Label key={t} left={x(t)} top={B + 32} opacity={achsen}>
          {t}
        </Label>
      ))}
      <Label left={(L + R) / 2} top={B + 82} size={28} color={C.whiteSoft} opacity={achsen}>
        Jahre
      </Label>
      <div
        style={{
          position: 'absolute',
          left: 128,
          top: (T + B) / 2,
          transform: 'translate(-50%, -50%) rotate(-90deg)',
          fontFamily: FONT.body,
          fontSize: 28,
          fontWeight: 600,
          color: C.whiteSoft,
          opacity: achsen,
        }}
      >
        Vermögen
      </div>

      <Label left={x(0) + 18} top={y(START) - 34} size={28} weight={800} color={C.white} align="left" opacity={prog(frame, 50, 60)}>
        10.000 €
      </Label>
      <Label left={x(YEARS) + 20} top={y(START)} size={26} color="#9A9A9A" align="left" opacity={prog(frame, 44, 56)}>
        ohne Zinsen
      </Label>
      <Label left={x(14)} top={y(wert(14)) + 48} size={28} weight={800} color={C.accent} opacity={prog(jahr, 13, 15)}>
        7 % Zinsen
      </Label>

      {meilensteine.map((m) => (
        <Label
          key={m}
          left={x(m) - (m === YEARS ? 0 : 6)}
          top={y(wert(m)) - (m === YEARS ? 52 : 44)}
          size={m === YEARS ? 40 : 30}
          weight={800}
          color={m === YEARS ? C.accent : C.white}
          align={m === YEARS ? 'center' : 'right'}
          opacity={erreicht(m)}
        >
          {euro(wert(m))}
        </Label>
      ))}

      <Label
        left={x(jahr) - 22}
        top={y(wert(jahr)) - 40}
        size={28}
        weight={800}
        color={C.whiteSoft}
        align="right"
        opacity={spitzeSichtbar}
      >
        {euro(spitzenWert)}
      </Label>

      <Label left={x(YEARS) - 40} top={(y(START) + y(wert(YEARS))) / 2 + 110} size={32} weight={800} color={C.accent} align="right" opacity={payoff}>
        +{euro(wert(YEARS) - START)} durch Zinsen
      </Label>

      <Label left={960} top={1028} size={22} color={C.gray} opacity={intro}>
        Beispielrechnung: 10.000 € einmalig angelegt, 7 % p. a., ohne Kosten und Steuern
      </Label>
    </AbsoluteFill>
  );
};
