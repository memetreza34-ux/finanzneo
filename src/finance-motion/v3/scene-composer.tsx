import React from 'react';
import {MotionSurfaceV3} from './motion-primitives';

export const EditorialSceneV3:React.FC<{
  children:React.ReactNode;
  surface?:'cream'|'paper'|'mist'|'sage'|'dark';
  safePadding?:number;
}> = ({children,surface='cream',safePadding=70}) => (
  <MotionSurfaceV3 tone={surface}>
    <div style={{
      position:'absolute',
      left:safePadding,
      right:safePadding,
      top:safePadding,
      bottom:safePadding,
    }}>
      {children}
    </div>
  </MotionSurfaceV3>
);
