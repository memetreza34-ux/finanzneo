import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {
  between, cubicPoint, donutSlices, mix, polylinePath, progressAt, rankOrder,
  rankPositions, ringArcPath, tracePolyline, trendPositions,
} from '../src/youtube-motion/light-v3/core';

const data = [
  {id:'A',label:'A',color:'#abc',start:90,end:10},
  {id:'B',label:'B',color:'#bcd',start:30,end:120},
  {id:'C',label:'C',color:'#cde',start:60,end:60},
];

test('ranking really reorders and does not mutate data',()=>{
  assert.deepEqual(rankOrder(data.map(d=>d.start)),[0,2,1]);
  assert.deepEqual(rankOrder(data.map(d=>d.end)),[1,2,0]);
  const before=rankPositions(data,0,10,110,100);
  const mid=rankPositions(data,60,10,110,100);
  const after=rankPositions(data,120,10,110,100);
  assert.deepEqual(before.map(d=>d.y),[0,200,100]);
  assert.deepEqual(after.map(d=>d.y),[200,0,100]);
  assert.ok(mid[0].y>0 && mid[0].y<200);
  assert.ok(mid[1].y>0 && mid[1].y<200);
  assert.deepEqual(data.map(d=>d.start),[90,30,60]);
});

test('rank ties are stable in source order',()=>{
  assert.deepEqual(rankOrder([4,9,9,1]),[1,2,0,3]);
});

test('donut arcs use actual values, sum to 100% and reject invalid input',()=>{
  const slices=donutSlices([
    {id:'one',label:'One',value:25,color:'#aaa'},
    {id:'two',label:'Two',value:75,color:'#bbb'},
  ]);
  assert.equal(slices.length,2);
  assert.equal(slices[0].startAngle,-90);
  assert.equal(slices[0].endAngle,0);
  assert.equal(slices[1].endAngle,270);
  assert.equal(slices.reduce((sum,s)=>sum+s.share,0),1);
  assert.match(ringArcPath(200,200,150,50,-90,0),/^M /);
  assert.equal(ringArcPath(200,200,150,50,-90,-90),'');
  assert.throws(()=>donutSlices([{id:'x',label:'X',value:0,color:'#fff'}]));
  assert.throws(()=>donutSlices([{id:'x',label:'X',value:-1,color:'#fff'}]));
});

test('trend path is continuous between point samples',()=>{
  const positions=trendPositions([
    {id:'x',label:'X',value:0},{id:'y',label:'Y',value:100},{id:'z',label:'Z',value:0},
  ],100,100,400,200,0,100);
  const partial=tracePolyline(positions,0.25);
  assert.equal(partial.length,2);
  assert.deepEqual(partial[1],{x:200,y:200});
  const done=tracePolyline(positions,1);
  assert.deepEqual(done[done.length-1],{x:500,y:300});
  assert.match(polylinePath(partial),/^M /);
});

test('motion math remains deterministic and clamped',()=>{
  assert.equal(progressAt(-10,0,10),0);
  assert.equal(progressAt(40,0,10),1);
  assert.equal(mix(4,20,2),20);
  assert.equal(between(12,0,10,3,8),8);
  const p=cubicPoint({x:0,y:0},{x:0,y:100},{x:100,y:100},{x:100,y:0},.5);
  assert.equal(p.x,50);
  assert.equal(p.y,75);
});

test('V3 scenes stay light and QA captures four points',()=>{
  const scenes=readFileSync('src/youtube-motion/light-v3/LightMotionV3.tsx','utf8');
  const qa=readFileSync('scripts/qa-youtube-light-motion-v3.mjs','utf8');
  for(const id of ['RankRaceV3','DonutBuildV3','TrendTraceV3','FlowTokensV3','HeatmapFillV3','SortableTableV3','WaffleGrowV3','DeltaCompareV3']){
    assert.ok(scenes.includes('id:\''+id+'\''),'scene missing: '+id);
  }
  assert.ok(scenes.includes('MOTION_V3_SCENE_FRAMES = 165'));
  assert.ok(qa.includes('[10,35,65,90]'));
  assert.ok(qa.includes('statSync(p).size<1000'));
  assert.ok(qa.includes('sourceVideo:movie'));
  assert.ok(qa.includes('byte-identical'));
  assert.ok(qa.includes('sourceFrameIndices:frames'));
});
