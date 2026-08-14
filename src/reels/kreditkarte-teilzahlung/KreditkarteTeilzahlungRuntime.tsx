import React from 'react';
import runtime from './runtime-data.json';
import {KreditkarteTeilzahlung} from './KreditkarteTeilzahlung';
import type {CaptionWord} from '../../lib/captions';

const starts=runtime.sceneStarts as number[];
const durations=runtime.sceneDurations as number[];
export const KREDITKARTE_FINAL_FRAMES=Math.max(1,starts.length&&durations.length?starts[starts.length-1]+durations[durations.length-1]:1);
export const KreditkarteTeilzahlungRuntime:React.FC=()=>{if(runtime.status!=='ready')throw new Error('Finale Kreditkarten-Runtime ist noch nicht bereit.');return <KreditkarteTeilzahlung timeline={{sceneStarts:starts,sceneDurations:durations}} audioSrc={runtime.audioSrc as string} captionWords={runtime.captionWords as CaptionWord[]}/>};
