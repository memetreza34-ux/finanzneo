import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {EtfHybrid} from './hybrid/EtfHybrid';
import {NotgroschenHybrid} from './hybrid/NotgroschenHybrid';
import {WaterDamageHybrid} from './hybrid/WaterDamageHybrid';

export const FINANCE_IMAGE_HYBRID_SCENE_FRAMES = 150;
export const FINANCE_IMAGE_HYBRID_FRAMES = FINANCE_IMAGE_HYBRID_SCENE_FRAMES * 3;

export const FinanceImageHybridMotion: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Series>
      <Series.Sequence durationInFrames={FINANCE_IMAGE_HYBRID_SCENE_FRAMES}><NotgroschenHybrid /></Series.Sequence>
      <Series.Sequence durationInFrames={FINANCE_IMAGE_HYBRID_SCENE_FRAMES}><WaterDamageHybrid /></Series.Sequence>
      <Series.Sequence durationInFrames={FINANCE_IMAGE_HYBRID_SCENE_FRAMES}><EtfHybrid /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
