import React from 'react';
import runtime from './runtime-data.json';
import {NullProzentFinanzierung} from './NullProzentFinanzierung';
import type {CaptionWord} from '../../lib/captions';
const starts=runtime.sceneStarts as number[];
const durations=runtime.sceneDurations as number[];
export const NULL_PROZENT_FINAL_FRAMES=Math.max(1,starts.length&&durations.length?starts[starts.length-1]+durations[durations.length-1]:1);
export const NullProzentFinanzierungRuntime:React.FC=()=>{if(String(runtime.status)!=='ready')throw new Error('Finale 0%-Finanzierungs-Runtime ist noch nicht bereit.');return <NullProzentFinanzierung timeline={{sceneStarts:starts,sceneDurations:durations}} audioSrc={runtime.audioSrc as string} captionWords={runtime.captionWords as CaptionWord[]}/>};
