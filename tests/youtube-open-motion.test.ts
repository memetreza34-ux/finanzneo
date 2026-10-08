import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {
  YOUTUBE_EDITORIAL_MOTION_WORLD_ID,
  YOUTUBE_EDITORIAL_VISUAL_TARGET_ID,
} from '../scripts/lib/youtube-motion-contract.mjs';

test('YouTube motion uses the open scene-by-scene direction', () => {
  assert.equal(YOUTUBE_EDITORIAL_MOTION_WORLD_ID, 'finanzneo-youtube-open-motion-v1');
  assert.equal(YOUTUBE_EDITORIAL_VISUAL_TARGET_ID, 'finanzneo-youtube-open-motion-v1');

  const scaffold=readFileSync('scripts/scaffold-finanzneo-youtube.mjs','utf8');
  for(const marker of [
    'staticImageStyleCopyRequired:false',
    'fixedArtDirectionForbidden:true',
    'darkBackgroundAllowed:true',
    'blackBackgroundAllowed:true',
    'full3DAllowed:true',
    'simpleComparisonAllowed:true',
    'chartAllowed:true',
    'sceneArtDirectionOpen:true',
    'mixedStyleAcrossScenesAllowed:true',
    'brandStyleMatchRequired:false',
    'minimumMotionPreferred:false',
    'motionDensityStoryDriven:true',
    'physicalPrimitivesOptional:true',
    'semanticVariationRequired:false',
  ]){
    assert.ok(scaffold.includes(marker), 'missing open-motion marker: '+marker);
  }
});

test('Open motion authority explicitly allows different visual worlds', () => {
  const doc=readFileSync('docs/FINANZNEO-YOUTUBE-MOTION-WORLD-V1.md','utf8');
  assert.match(doc,/There is no required animation world/i);
  assert.match(doc,/dark background/i);
  assert.match(doc,/full 3D/i);
  assert.match(doc,/minimal comparison/i);
  assert.match(doc,/completely different visual worlds/i);
});
