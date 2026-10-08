import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {FONT} from '../brand';
import {EDITORIAL_MOTION_COLORS as E} from '../brand/components/EditorialMotion';

export const EDITORIAL_MOTION_EXAMPLE_FRAMES = 180;

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const progress = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], clamp);

const points = [
  {x: 150, y: 1110, value: '3.000 €', year: 'Start'},
  {x: 380, y: 1050, value: '3.100 €', year: 'Jahr 1'},
  {x: 610, y: 990, value: '3.200 €', year: 'Jahr 2'},
  {x: 875, y: 650, value: '3.800 €', year: 'Jobwechsel'},
] as const;

const Milestone: React.FC<{
  x: number;
  y: number;
  value: string;
  label: string;
  reveal: number;
  highlight?: boolean;
}> = ({x, y, value, label, reveal, highlight = false}) => {
  const dotSize = highlight ? 34 : 26;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - dotSize / 2,
          top: y - dotSize / 2,
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          background: highlight ? E.green : E.blue,
          border: '5px solid #FBF8F1',
          opacity: reveal,
          transform: `scale(${0.75 + reveal * 0.25})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x - 105,
          top: y - 100,
          width: 210,
          textAlign: 'center',
          fontFamily: FONT.title,
          fontSize: highlight ? 42 : 34,
          fontWeight: 900,
          color: highlight ? E.greenDark : E.ink,
          opacity: reveal,
          transform: `translateY(${(1 - reveal) * 12}px)`,
        }}
      >
        {value}
      </div>
      <div
        style={{
          position: 'absolute',
          left: x - 100,
          top: 1215,
          width: 200,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 25,
          fontWeight: 800,
          color: highlight ? E.greenDark : E.inkSoft,
          opacity: reveal,
        }}
      >
        {label}
      </div>
    </>
  );
};

export const EditorialMotionExample: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const first = progress(frame, 4, 18);
  const seg1 = progress(frame, 22, 50);
  const second = progress(frame, 43, 58);
  const seg2 = progress(frame, 58, 86);
  const third = progress(frame, 80, 95);
  const jump = progress(frame, 98, 132);
  const fourth = progress(frame, 123, 140);
  const payoff = progress(frame, 136, 154);

  const jumpSpring = spring({
    frame: Math.max(0, frame - 123),
    fps,
    config: {damping: 19, stiffness: 145, mass: 0.75},
  });

  const activeX = interpolate(
    frame,
    [4, 22, 50, 58, 86, 98, 132],
    [150, 150, 380, 380, 610, 610, 875],
    clamp,
  );
  const activeY = interpolate(
    frame,
    [4, 22, 50, 58, 86, 98, 132],
    [1110, 1110, 1050, 1050, 990, 990, 650],
    clamp,
  );

  return (
    <AbsoluteFill style={{background: '#F4EFE4', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 250,
          bottom: 250,
          borderRadius: 48,
          background: '#FBF8F1',
          border: '2px solid #DDD7CA',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 125,
          top: 380,
          fontFamily: FONT.body,
          fontSize: 28,
          fontWeight: 800,
          color: E.inkSoft,
          letterSpacing: 0.2,
        }}
      >
        Monatsgehalt
      </div>

      <div
        style={{
          position: 'absolute',
          left: 125,
          top: 425,
          width: 650,
          fontFamily: FONT.title,
          fontSize: 54,
          lineHeight: 1.08,
          fontWeight: 900,
          color: E.ink,
        }}
      >
        Kleine Schritte.
        <br />
        Dann ein echter Sprung.
      </div>

      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{position: 'absolute', inset: 0}}
      >
        <line
          x1="130"
          y1="1165"
          x2="930"
          y2="1165"
          stroke="#D8D9D3"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <line
          x1={points[0].x}
          y1={points[0].y}
          x2={interpolate(seg1, [0, 1], [points[0].x, points[1].x], clamp)}
          y2={interpolate(seg1, [0, 1], [points[0].y, points[1].y], clamp)}
          stroke={E.blue}
          strokeWidth="10"
          strokeLinecap="round"
        />

        <line
          x1={points[1].x}
          y1={points[1].y}
          x2={interpolate(seg2, [0, 1], [points[1].x, points[2].x], clamp)}
          y2={interpolate(seg2, [0, 1], [points[1].y, points[2].y], clamp)}
          stroke={E.blue}
          strokeWidth="10"
          strokeLinecap="round"
        />

        <line
          x1={points[2].x}
          y1={points[2].y}
          x2={interpolate(jump, [0, 1], [points[2].x, points[3].x], clamp)}
          y2={interpolate(jump, [0, 1], [points[2].y, points[3].y], clamp)}
          stroke={E.green}
          strokeWidth="14"
          strokeLinecap="round"
        />

        <line
          x1={points[3].x}
          y1={points[3].y + 25}
          x2={points[3].x}
          y2="1165"
          stroke="#C9D7CC"
          strokeWidth="4"
          strokeDasharray="12 14"
          opacity={fourth}
        />
      </svg>

      <Milestone
        x={points[0].x}
        y={points[0].y}
        value={points[0].value}
        label={points[0].year}
        reveal={first}
      />
      <Milestone
        x={points[1].x}
        y={points[1].y}
        value={points[1].value}
        label={points[1].year}
        reveal={second}
      />
      <Milestone
        x={points[2].x}
        y={points[2].y}
        value={points[2].value}
        label={points[2].year}
        reveal={third}
      />
      <Milestone
        x={points[3].x}
        y={points[3].y}
        value={points[3].value}
        label={points[3].year}
        reveal={fourth}
        highlight
      />

      <div
        style={{
          position: 'absolute',
          left: activeX - 19,
          top: activeY - 19,
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: E.ink,
          border: '6px solid #FBF8F1',
          boxSizing: 'border-box',
          opacity: first,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 720,
          top: 780,
          width: 245,
          minHeight: 92,
          padding: '18px 22px',
          borderRadius: 22,
          background: '#E7EEE8',
          border: `3px solid ${E.green}`,
          color: E.greenDark,
          fontFamily: FONT.title,
          fontSize: 40,
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          opacity: payoff,
          transform: `scale(${0.88 + jumpSpring * 0.12})`,
        }}
      >
        +600 €
      </div>

      <div
        style={{
          position: 'absolute',
          left: 125,
          right: 125,
          top: 1360,
          padding: '24px 30px',
          borderRadius: 24,
          background: '#EEEAE1',
          color: E.ink,
          fontFamily: FONT.body,
          fontSize: 30,
          fontWeight: 800,
          textAlign: 'center',
          opacity: payoff,
        }}
      >
        Der größte Gehaltssprung kommt hier nicht durch die jährliche Erhöhung.
      </div>
    </AbsoluteFill>
  );
};

/**
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: salary-path-with-job-change-jump
 * FOCAL_PATH: Das Auge folgt der Gehaltslinie von 3.000 € über zwei kleine Erhöhungen bis zum deutlich höheren Jobwechsel-Punkt.
 * PRIMARY_ACTION: Die Linie steigt zweimal nur leicht und springt beim Jobwechsel sichtbar stark auf 3.800 €.
 * CAMERA_ROLE: still — die Entwicklung soll ohne Kamerabewegung direkt vergleichbar bleiben.
 * PAYOFF: 3.800 € und +600 € stehen am Ende stabil als klarer Gehaltssprung.
 *
 * ANIMATION_NARRATIVE
 * START: 3.000 € Monatsgehalt erscheint als erster ruhiger Punkt.
 * MECHANISM: Zwei kleine Gehaltsschritte bauen sich nacheinander auf, danach steigt die Linie beim Jobwechsel deutlich steiler.
 * RESULT: Der Endpunkt 3.800 € wird grün hervorgehoben und +600 € erscheint als klarer Unterschied.
 *
 * EDITORIAL_VISUAL_NARRATIVE
 * HERO: Eine einfache Gehaltslinie mit vier großen Meilensteinen.
 * SUPPORT: Kurze Jahreslabels, ein dezenter Jobwechsel-Hinweis und ein einzelner +600-€-Payoff.
 * SURFACE: Warmes Creme und Off-White ohne Glow, Dashboard oder Materialeffekte.
 * SHAPE_LANGUAGE: Flache Editorial-Formen mit sehr leichter Tiefe nur durch Ebenen und Liniengewicht.
 *
 * RESULT_HOLD_FRAMES = 26
 */
