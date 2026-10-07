import React from 'react';
import {MOTION_V3} from './motion-tokens';

export const ShapeMorphV3:React.FC<{
  x:number;y:number;progress:number;
  from:{width:number;height:number;radius:number;color?:string};
  to:{width:number;height:number;radius:number;color?:string};
  children?:React.ReactNode;
}> = ({x,y,progress,from,to,children}) => {
  const mix=(a:number,b:number)=>a+(b-a)*progress;
  return <div style={{
    position:'absolute',
    left:x-mix(from.width,to.width)/2,
    top:y-mix(from.height,to.height)/2,
    width:mix(from.width,to.width),
    height:mix(from.height,to.height),
    borderRadius:mix(from.radius,to.radius),
    background:progress<0.5?(from.color??MOTION_V3.blue):(to.color??MOTION_V3.green),
    display:'flex',alignItems:'center',justifyContent:'center',
    color:MOTION_V3.white,fontWeight:900,
  }}>{children}</div>;
};
