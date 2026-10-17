import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {editorialMotionContractFields} from '../scripts/lib/editorial-motion-contract.mjs';

test('Editorial Motion V3 requires concept development and keyframe QA', () => {
  const contract=editorialMotionContractFields();
  assert.equal(contract.visualMotionLock,'finanzneo-editorial-motion-v3');
  assert.equal(contract.financeMotionLibraryId,'finanzneo-editorial-motion-v3-library');
  assert.equal(contract.conceptCandidatesRequired,3);
  assert.equal(contract.keyframeQaRequired,true);
  assert.deepEqual(contract.keyframeQaPercentages,[10,35,65,90]);
  assert.equal(contract.motionGrammarRequired,true);
  assert.equal(contract.animatedEditorialIllustrationPreferred,true);
  assert.equal(contract.uiFirstCompositionForbidden,true);
  assert.equal(contract.nativeRemotionGeometryPreferred,true);
});

test('V3 core exposes motion grammar and editorial objects', () => {
  const tokens=readFileSync('src/finance-motion/v3/motion-tokens.ts','utf8');
  const objects=readFileSync('src/finance-motion/v3/editorial-objects.tsx','utf8');
  for(const verb of ['DRAW','FOLLOW','REVEAL','SPLIT','MERGE','STACK','SHIFT','SWAP','EMPHASIZE','COUNT']){
    assert.match(tokens,new RegExp(verb));
  }
  for(const object of ['HouseV3','ContractV3','CalendarV3','PersonV3','PhoneV3','ReceiptV3']){
    assert.match(objects,new RegExp(object));
  }
});

test('V3 showcase contains three non-dashboard visual stories', () => {
  const files=[
    'src/finance-motion/v3/examples/MortgageResetV3.tsx',
    'src/finance-motion/v3/examples/InvestmentCrossroadsV3.tsx',
    'src/finance-motion/v3/examples/RecurringCostsV3.tsx',
  ];
  for(const file of files){
    const source=readFileSync(file,'utf8');
    assert.match(source,/ANIMATION_NARRATIVE/);
    assert.match(source,/EDITORIAL_VISUAL_NARRATIVE/);
    assert.match(source,/RESULT_HOLD_FRAMES\s*=\s*(?:2[4-9]|[3-9]\d)/);
    assert.doesNotMatch(source,/PremiumPhysicalStage/);
    assert.doesNotMatch(source,/<(?:Dashboard|ControlPanel|WindowMock|IconTile)\b/);
  }
});

test('V3 review renderer creates MP4 and four keyframe stills per composition', () => {
  const script=readFileSync('scripts/render-editorial-motion-v3.mjs','utf8');
  assert.ok(script.includes("'remotion','render'"));
  assert.ok(script.includes("'remotion','still'"));
  for(const pct of ["'10'","'35'","'65'","'90'"]){
    assert.ok(script.includes(pct));
  }
});
