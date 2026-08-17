import React from 'react';
import {NullProzentFinanzierung} from './NullProzentFinanzierung';
export const NULL_PROZENT_STORYBOARD_FRAMES=2340;
const durations=[210,240,240,210,250,250,210,260,260,210];
const starts=durations.map((_,i)=>durations.slice(0,i).reduce((a,b)=>a+b,0));
export const NullProzentFinanzierungStoryboard:React.FC=()=> <NullProzentFinanzierung timeline={{sceneStarts:starts,sceneDurations:durations}} storyboard/>;
