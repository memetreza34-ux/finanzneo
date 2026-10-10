import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {
  YOUTUBE_EDITORIAL_MOTION_WORLD_ID,
  YOUTUBE_EDITORIAL_VISUAL_TARGET_ID,
} from '../scripts/lib/youtube-motion-contract.mjs';

test('YouTube motion uses the light 2D direction', () => {
  assert.equal(YOUTUBE_EDITORIAL_MOTION_WORLD_ID, 'finanzneo-youtube-light-motion-v2');
  assert.equal(YOUTUBE_EDITORIAL_VISUAL_TARGET_ID, 'finanzneo-youtube-light-motion-v2');

  const scaffold=readFileSync('scripts/scaffold-finanzneo-youtube.mjs','utf8');
  for(const marker of [
    'staticImageStyleCopyRequired:false',
    'fixedArtDirectionForbidden:false',
    'darkBackgroundAllowed:false',
    'blackBackgroundAllowed:false',
    'full3DAllowed:false',
    'simpleComparisonAllowed:true',
    'chartAllowed:true',
    'sceneArtDirectionOpen:false',
    'mixedStyleAcrossScenesAllowed:true',
    'brandStyleMatchRequired:false',
    'minimumMotionPreferred:false',
    'motionDensityStoryDriven:true',
    'lightBackgroundRequired:true',
    'flat2DPreferred:true',
    'genericSceneHeadlinesForbidden:true',
  ]){
    assert.ok(scaffold.includes(marker), 'missing light-motion marker: '+marker);
  }
});

test('Light motion authority allows design variety without dark or 3D scenes', () => {
  const doc=readFileSync('docs/FINANZNEO-YOUTUBE-MOTION-WORLD-V1.md','utf8');
  assert.match(doc,/light visual worlds/i);
  const verboten = doc.slice(doc.indexOf('## Do not use'), doc.indexOf('## Text rule'));
  assert.match(verboten,/^- full 3D$/m);
  assert.match(verboten,/^- dark backgrounds$/m);
  assert.match(verboten,/^- black motion worlds$/m);
  assert.match(verboten,/^- large generic scene headlines$/m);
  assert.match(doc,/different scenes may still have completely different designs/i);
});
