import assert from 'node:assert/strict';
import test from 'node:test';
import {
  COVER_ANCHOR_BLOCK_SIZE,
  COVER_ANCHOR_FLOW_ID,
  assignCoverAnchorSlots,
  coverAnchorDirectionText,
} from '../scripts/lib/cover-anchor-flow-v1.mjs';

test('cover anchor uses scene 01 as master and groups follow-ups into planning blocks of five', () => {
  const scenes = Array.from({length: 12}, (_, index) => ({id: `scene-${String(index + 1).padStart(2, '0')}`}));
  const assigned = assignCoverAnchorSlots(scenes);

  assert.equal(COVER_ANCHOR_BLOCK_SIZE, 5);
  assert.equal(assigned[0].role, 'MASTER');
  assert.equal(assigned[0].block, 0);
  assert.equal(assigned[0].slot, 0);

  for (let index = 1; index <= 5; index += 1) {
    assert.equal(assigned[index].role, 'FOLLOWUP');
    assert.equal(assigned[index].block, 1);
    assert.equal(assigned[index].slot, index);
  }
  assert.equal(assigned[6].block, 2);
  assert.equal(assigned[6].slot, 1);
  assert.equal(assigned[11].block, 3);
  assert.equal(assigned[11].slot, 1);
});

test('master direction turns first scene into detailed cover and visual DNA source', () => {
  const text = coverAnchorDirectionText({
    coverAnchorRole: 'MASTER',
    coverAnchorReferenceFile: 'Bild 01 - Cover.png',
    coverAnchorVisualDna: 'editorial stylized 3D with bold readable silhouettes',
    coverAnchorCharacterLanguage: 'minimal faces and expressive posture',
    coverAnchorEnvironmentLanguage: 'real room simplified into strong shapes',
    coverAnchorMaterialLanguage: 'matte surfaces with restrained highlights',
    coverAnchorLightingLanguage: 'soft key plus controlled rim',
    coverAnchorColorLanguage: 'neutral graphite with semantic accents',
    coverAnchorTextureLanguage: 'subtle tactile grain, never plastic AI gloss',
    coverAnchorQualityBar: 'instantly recognizable premium FinanzNeo frame',
  });

  assert.match(text, /COVER \/ MASTER VISUAL ANCHOR/);
  assert.match(text, /canonical visual reference/);
  assert.match(text, /minimal faces/);
  assert.match(text, /never plastic AI gloss/);
  assert.match(text, /Bild 01 - Cover\.png/);
});

test('follow-up direction requires approved cover as style reference without copying content', () => {
  const text = coverAnchorDirectionText({
    coverAnchorRole: 'FOLLOWUP',
    coverAnchorReferenceFile: 'Bild 01 - Cover.png',
    coverAnchorBlock: 2,
    coverAnchorBlockSlot: 4,
  });

  assert.equal(COVER_ANCHOR_FLOW_ID, 'finanzneo-cover-anchor-flow-v1');
  assert.match(text, /direct visual reference\/template/);
  assert.match(text, /block: 2, slot 4 of 5/i);
  assert.match(text, /Do NOT copy the anchor's subject, camera, composition, pose or props/);
  assert.match(text, /Only the approved scene-01 anchor/);
});
