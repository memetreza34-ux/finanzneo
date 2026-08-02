import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedNumber, FlowNode} from '../primitives';

export type TaxFeeFlowTemplateProps = {
  gross: number;
  taxes: number;
  fees: number;
  currency?: string;
};

export type TaxFeeFlowBreakdown = {
  gross: number;
  taxes: number;
  fees: number;
  net: number;
  taxPercent: number;
  feePercent: number;
  netPercent: number;
};

export const resolveTaxFeeFlow = (
  gross: number,
  taxes: number,
  fees: number,
): TaxFeeFlowBreakdown => {
  const safeGross = Math.max(0, Number.isFinite(gross) ? gross : 0);
  const safeTaxes = Math.max(0, Number.isFinite(taxes) ? taxes : 0);
  const safeFees = Math.max(0, Number.isFinite(fees) ? fees : 0);
  const deductions = Math.min(safeGross, safeTaxes + safeFees);
  const net = Math.max(0, safeGross - deductions);
  const ratio = (value: number): number => safeGross > 0 ? value / safeGross * 100 : 0;

  return {
    gross: safeGross,
    taxes: safeTaxes,
    fees: safeFees,
    net,
    taxPercent: ratio(safeTaxes),
    feePercent: ratio(safeFees),
    netPercent: ratio(net),
  };
};

export const TaxFeeFlowTemplate: React.FC<TaxFeeFlowTemplateProps> = ({
  gross,
  taxes,
  fees,
  currency = '€',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const resolved = resolveTaxFeeFlow(gross, taxes, fees);
  const revealTax = interpolate(frame, [fps * 0.2, fps * 0.7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const revealFees = interpolate(frame, [fps * 0.55, fps * 1.05], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const revealNet = interpolate(frame, [fps * 0.95, fps * 1.45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #07120B 0%, #0B1B11 100%)',
        color: '#F5F7F4',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: 72,
        boxSizing: 'border-box',
      }}
    >
      <div style={{fontSize: 58, fontWeight: 900, marginBottom: 54}}>Was vom Brutto übrig bleibt</div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'center'}}>
        <FlowNode label="Brutto" value={`${resolved.gross.toLocaleString('de-DE')} ${currency}`} />
        <div style={{display: 'grid', gap: 22}}>
          <div style={{opacity: revealTax, transform: `translateX(${(1 - revealTax) * 36}px)`}}>
            <FlowNode label={`Steuern · ${resolved.taxPercent.toFixed(1)} %`} value={`− ${resolved.taxes.toLocaleString('de-DE')} ${currency}`} accent="#FF7C83" />
          </div>
          <div style={{opacity: revealFees, transform: `translateX(${(1 - revealFees) * 36}px)`}}>
            <FlowNode label={`Gebühren · ${resolved.feePercent.toFixed(1)} %`} value={`− ${resolved.fees.toLocaleString('de-DE')} ${currency}`} accent="#F2C14E" />
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 62,
          borderRadius: 34,
          padding: '38px 42px',
          background: 'rgba(8, 33, 18, 0.88)',
          border: '1px solid rgba(92, 255, 154, 0.24)',
          opacity: revealNet,
          transform: `scale(${0.94 + revealNet * 0.06})`,
        }}
      >
        <div style={{fontSize: 28, opacity: 0.72, marginBottom: 10}}>Netto · {resolved.netPercent.toFixed(1)} %</div>
        <div style={{fontSize: 78, fontWeight: 950}}>
          <AnimatedNumber value={resolved.net} suffix={` ${currency}`} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
