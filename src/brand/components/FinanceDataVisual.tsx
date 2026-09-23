import React from 'react';
import { C, a } from '../tokens';
import { FONT } from '../fonts';
import { AreaPremium, BarsPremium, PiePremium } from './PremiumCharts';

type CommonProps = {
  title: string;
  subtitle?: string;
  source: string;
  asOf: string;
  startFrame: number;
  endFrame: number;
  width?: number;
};

type LineProps = CommonProps & {
  kind: 'line';
  data: {x: string | number; y: number}[];
  color?: string;
};

type BarProps = CommonProps & {
  kind: 'bar';
  data: {name: string; value: number; color?: string}[];
};

type AllocationProps = CommonProps & {
  kind: 'allocation';
  data: {name: string; value: number; color: string}[];
  centerLabel?: string;
};

export type FinanceDataVisualProps = LineProps | BarProps | AllocationProps;

const SourceNote: React.FC<{source: string; asOf: string}> = ({source, asOf}) => (
  <div style={{
    marginTop: 26,
    textAlign: 'center',
    fontFamily: FONT.body,
    fontSize: 23,
    fontWeight: 500,
    color: a(C.gray, 0.74),
  }}>
    Quelle: {source} · Stand: {asOf}
  </div>
);

/**
 * Einheitliche FinanzNeo-Hülle für präzise Remotion-Datenvisuals.
 *
 * Wichtig:
 * - Daten werden als echte Werte übergeben; keine erfundene KI-Kurve.
 * - Quelle + Datenstand sind Pflicht.
 * - Bewegung erklärt nur den Datenaufbau (Reveal/Grow), nicht zur Dekoration.
 */
export const FinanceDataVisual: React.FC<FinanceDataVisualProps> = (props) => {
  const width = props.width ?? 900;
  const chartHeight = 600;

  return (
    <div style={{width, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{textAlign: 'center', maxWidth: width}}>
        <div style={{
          fontFamily: FONT.title,
          fontSize: 72,
          lineHeight: 0.98,
          color: C.white,
        }}>
          {props.title}
        </div>
        {props.subtitle ? (
          <div style={{
            marginTop: 18,
            fontFamily: FONT.body,
            fontSize: 30,
            lineHeight: 1.2,
            fontWeight: 600,
            color: C.gray,
          }}>
            {props.subtitle}
          </div>
        ) : null}
      </div>

      <div style={{marginTop: 34}}>
        {props.kind === 'line' ? (
          <AreaPremium
            data={props.data}
            width={width}
            height={chartHeight}
            drawStart={props.startFrame}
            drawEnd={props.endFrame}
            color={props.color ?? C.accent}
          />
        ) : null}

        {props.kind === 'bar' ? (
          <BarsPremium
            data={props.data}
            width={width}
            height={chartHeight}
            growStart={props.startFrame}
            growEnd={props.endFrame}
          />
        ) : null}

        {props.kind === 'allocation' ? (
          <PiePremium
            data={props.data}
            width={width}
            height={chartHeight}
            drawStart={props.startFrame}
            drawEnd={props.endFrame}
            centerLabel={props.centerLabel}
          />
        ) : null}
      </div>

      <SourceNote source={props.source} asOf={props.asOf} />
    </div>
  );
};
