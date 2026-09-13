import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Captions, SceneHeader, type CaptionWord, type IconName, type SceneHeaderTone} from '../../brand';

const makeCaptionWords = (text: string): CaptionWord[] => {
  const words = text.trim().split(/\s+/);
  const start = 0.45;
  const end = 4.62;
  const step = (end - start) / Math.max(1, words.length);
  return words.map((word, index) => ({word, start: start + step * index, end: start + step * (index + 0.82)}));
};

export const HybridShell: React.FC<{title: string; icon: IconName; tone?: SceneHeaderTone; caption: string; children: React.ReactNode}> = ({title, icon, tone = 'default', caption, children}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <SceneHeader title={title} icon={icon} tone={tone} />
    <div style={{position: 'absolute', left: 94, right: 94, top: 352, height: 930, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
    <Captions words={makeCaptionWords(caption)} />
  </AbsoluteFill>
);

export const HYBRID_IMAGE_FRAME: React.CSSProperties = {position: 'relative', width: 800, height: 800, borderRadius: 44, overflow: 'hidden', boxShadow: '0 28px 90px rgba(0,0,0,0.48)'};
export const HYBRID_LABEL: React.CSSProperties = {position: 'absolute', zIndex: 5, borderRadius: 18, padding: '13px 18px', fontFamily: 'Inter, Arial, sans-serif', fontSize: 28, fontWeight: 800, lineHeight: 1, letterSpacing: -0.4, color: '#fff', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 8px 26px rgba(0,0,0,0.34)'};
