import React from 'react';
import {DrawnPathV3, PathFollowerV3} from './motion-primitives';

export const FollowPathV3: React.FC<{
  d:string;
  progress:number;
  stroke?:string;
  width?:number;
  followerColor?:string;
  followerSize?:number;
  followerText?:React.ReactNode;
}> = ({d,progress,stroke,width,followerColor,followerSize,followerText}) => (
  <>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
      <DrawnPathV3 d={d} progress={progress} stroke={stroke} width={width}/>
    </svg>
    <PathFollowerV3 d={d} progress={progress} color={followerColor} size={followerSize}>
      {followerText}
    </PathFollowerV3>
  </>
);
