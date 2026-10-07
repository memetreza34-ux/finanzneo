import React from 'react';

export const ClipRevealV3: React.FC<{
  children:React.ReactNode;
  progress:number;
  direction?:'left'|'right'|'up'|'down';
}> = ({children,progress,direction='left'}) => {
  const pct=Math.max(0,Math.min(100,progress*100));
  const clip = {
    left: `inset(0 ${100-pct}% 0 0)`,
    right: `inset(0 0 0 ${100-pct}%)`,
    up: `inset(${100-pct}% 0 0 0)`,
    down: `inset(0 0 ${100-pct}% 0)`,
  }[direction];
  return <div style={{position:'absolute',inset:0,clipPath:clip}}>{children}</div>;
};

export const FadeRiseV3:React.FC<{
  children:React.ReactNode;
  progress:number;
  distance?:number;
}> = ({children,progress,distance=22}) => (
  <div style={{opacity:progress,transform:`translateY(${(1-progress)*distance}px)`}}>
    {children}
  </div>
);
