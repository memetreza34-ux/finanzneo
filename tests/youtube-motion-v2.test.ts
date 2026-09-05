import assert from 'node:assert/strict';
import test from 'node:test';
import {
  requiresYouTubeImage,
  requiresYouTubeMotion,
  validateYouTubeMotionMetadata,
  validateYouTubeMotionVariety,
  YOUTUBE_MOTION_STANDARD_ID,
} from '../scripts/lib/youtube-motion-contract.mjs';

test('YouTube Motion V2 erlaubt Animation, Hybrid und Data ohne Physical-Pflicht', () => {
  assert.equal(YOUTUBE_MOTION_STANDARD_ID, 'finanzneo-youtube-motion-v2');
  assert.equal(requiresYouTubeMotion({type:'animation'}), true);
  assert.equal(requiresYouTubeMotion({type:'hybrid'}), true);
  assert.equal(requiresYouTubeMotion({type:'data'}), true);
  assert.equal(requiresYouTubeMotion({type:'image'}), false);
  assert.equal(requiresYouTubeImage({type:'image'}), true);
  assert.equal(requiresYouTubeImage({type:'hybrid'}), true);
  assert.equal(requiresYouTubeImage({type:'animation'}), false);
});

const motion = (overrides = {}) => ({
  id: 'visual-01',
  type: 'animation',
  animationIntent: 'Zeigt einen klaren Zusammenhang.',
  mechanicId: 'money-flow',
  visualTechniqueId: 'camera-follow-money',
  compositionFamilyId: 'camera-journey',
  animationSourceFile: '04-visuals/EINZELNE-VISUALS/visual-01/animation.tsx',
  animationExport: 'Visual01Animation',
  motionChannels: ['Geld bewegt sich', 'Kamera folgt'],
  visualBeats: ['Start', 'Resultat'],
  repeatTechniqueReason: '',
  ...overrides,
});

test('Motion-Metadaten sind technikoffen und brauchen keine Physical-Komponente', () => {
  assert.deepEqual(validateYouTubeMotionMetadata(motion()), []);
});

test('Doppelte Haupttechnik wird ohne Begründung blockiert', () => {
  const errors = validateYouTubeMotionVariety([
    motion({id:'visual-01'}),
    motion({id:'visual-02', mechanicId:'second-mechanic'}),
  ]);
  assert.ok(errors.some((error) => error.includes('visualTechniqueId')));
});

test('Bewusst begründete Technik-Wiederholung bleibt möglich', () => {
  const errors = validateYouTubeMotionVariety([
    motion({id:'visual-01'}),
    motion({id:'visual-02', mechanicId:'second-mechanic', repeatTechniqueReason:'Direkter Vorher-Nachher-Vergleich derselben visuellen Sprache.'}),
  ]);
  assert.deepEqual(errors, []);
});

test('Mehr als zwei gleiche Composition-Familien in Folge brauchen einen Grund', () => {
  const errors = validateYouTubeMotionVariety([
    motion({id:'visual-01', visualTechniqueId:'tech-1'}),
    motion({id:'visual-02', visualTechniqueId:'tech-2', mechanicId:'m2'}),
    motion({id:'visual-03', visualTechniqueId:'tech-3', mechanicId:'m3'}),
  ]);
  assert.ok(errors.some((error) => error.includes('mehr als zwei Motion-Visuals')));
});
