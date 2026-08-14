import React from 'react';
import {KreditkarteTeilzahlung} from './KreditkarteTeilzahlung';

const durations=[210,240,240,210,240,240,210,240,240,210];
const starts=durations.map((_,i)=>durations.slice(0,i).reduce((a,b)=>a+b,0));
export const KREDITKARTE_STORYBOARD_FRAMES=durations.reduce((a,b)=>a+b,0);
export const KreditkarteTeilzahlungStoryboard:React.FC=()=> <KreditkarteTeilzahlung timeline={{sceneStarts:starts,sceneDurations:durations}} storyboard/>;
