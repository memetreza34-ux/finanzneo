import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedNumber, FlowNode} from '../primitives';

export type TaxFeeFlowTemplateProps = {
  gross: number;
  taxes: number;
  fees: number;
  currency?: string;
};

export const TaxFeeFlowTemplate: React.FC<TaxFeeFlowTemplateProps> = ({
  gross,
  taxes,
  fees,
  currency = '€',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const net = Math.max(0, gross - taxes - fees);
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
        <FlowNode label="Brutto" value={`${gross.toLocaleString('de-DE')} ${currency}`} />
        <div style={{display: 'grid', gap: 22}}>
          <div style={{opacity: revealTax, transform: `translateX(${(1 - revealTax) * 36}px)`}}>
            <FlowNode label="Steuern" value={`− ${taxes.toLocaleString('de-DE')} ${currency}`} />
          </div>
          <div style={{opacity: revealFees, transform: `translateX(${(1 - revealFees) * 36}px)`}}>
            <FlowNode label="Gebühren" value={`− ${fees.toLocaleString('de-DE')} ${currency}`} />
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
        <div style={{fontSize: 28, opacity: 0.72, marginBottom: 10}}>Netto</div>
        <div style={{fontSize: 78, fontWeight: 950}}>
          <AnimatedNumber value={net} suffix={` ${currency}`} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
