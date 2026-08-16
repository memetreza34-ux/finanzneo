import React from 'react';import {Sparrate25} from './Sparrate25';
export const SPARRATE25_STORYBOARD_FRAMES=2400;
const durations=[210,240,240,210,270,270,210,270,270,210];const starts=durations.map((_,i)=>durations.slice(0,i).reduce((a,b)=>a+b,0));
export const Sparrate25Storyboard:React.FC=()=> <Sparrate25 timeline={{sceneStarts:starts,sceneDurations:durations}} storyboard/>;
