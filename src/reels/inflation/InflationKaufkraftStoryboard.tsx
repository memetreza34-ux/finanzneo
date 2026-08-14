import React from 'react';
import {InflationKaufkraft} from './InflationKaufkraft';

const durations=[180,210,225,180,240,210,180,210,240,195];
const starts=durations.map((_,i)=>durations.slice(0,i).reduce((a,b)=>a+b,0));
export const INFLATION_STORYBOARD_FRAMES=durations.reduce((a,b)=>a+b,0);

/** Nur Design-/Animationsprüfung. Keine finalen Timings, keine finalen Bilder, kein finales Audio. */
export const InflationKaufkraftStoryboard:React.FC=()=> <InflationKaufkraft timeline={{sceneStarts:starts,sceneDurations:durations}} storyboard/>;
