import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getYouTubeMotionPreset,
  getYouTubeMotionReason,
  requiresYouTubeImage,
  requiresYouTubeMotion,
  requiresYouTubeRealAsset,
  validateYouTubeMotionMetadata,
  validateYouTubeMotionVariety,
  YOUTUBE_MOTION_STANDARD_ID,
  YOUTUBE_STANDARD_MOTION_PRESETS,
} from '../scripts/lib/youtube-motion-contract.mjs';

test('YouTube Motion V4 Simple trennt Motion, Flow-Bilder und echte Assets sauber', () => {
  assert.equal(YOUTUBE_MOTION_STANDARD_ID, 'finanzneo-youtube-motion-v4-simple');
  assert.equal(requiresYouTubeMotion({type:'animation'}), true);
  assert.equal(requiresYouTubeMotion({type:'hybrid'}), true);
  assert.equal(requiresYouTubeMotion({type:'data'}), true);
  assert.equal(requiresYouTubeMotion({type:'image'}), false);
  assert.equal(requiresYouTubeMotion({type:'real-asset'}), false);
  assert.equal(requiresYouTubeImage({type:'image'}), true);
  assert.equal(requiresYouTubeImage({type:'hybrid'}), true);
  assert.equal(requiresYouTubeImage({type:'animation'}), false);
  assert.equal(requiresYouTubeRealAsset({type:'real-asset'}), true);
});

const motion = (overrides = {}) => ({
  id: 'visual-01',
  type: 'animation',
  viewerChange: 'Zwei Kostenbalken wachsen auf ihre Werte und werden direkt vergleichbar.',
  reason: 'Zwei Balken erklären den Gebührenunterschied schneller als eine komplexe Szene.',
  motionPreset: 'BAR_GROW',
  animationSourceFile: '04-visuals/EINZELNE-VISUALS/visual-01/animation.tsx',
  animationExport: 'Visual01Animation',
  ...overrides,
});

test('Motion V4 verlangt nur die klaren Kernmetadaten', () => {
  assert.deepEqual(validateYouTubeMotionMetadata(motion()), []);
  const errors = validateYouTubeMotionMetadata(motion({viewerChange:'', reason:'', motionPreset:''}));
  assert.ok(errors.some((error) => error.includes('viewerChange')));
  assert.ok(errors.some((error) => error.includes('reason')));
  assert.ok(errors.some((error) => error.includes('motionPreset')));
});

test('Standard-Presets enthalten die einfachen Finanz-Erklärbewegungen', () => {
  for (const preset of ['FADE_IN','SLIDE_UP','SCALE_IN','COUNT_UP','BAR_GROW','LINE_DRAW','HIGHLIGHT','SLOW_ZOOM']) {
    assert.ok(YOUTUBE_STANDARD_MOTION_PRESETS.includes(preset));
  }
});

test('Wiederholung derselben klaren Erklärmechanik wird nicht künstlich blockiert', () => {
  const errors = validateYouTubeMotionVariety([
    motion({id:'visual-01'}),
    motion({id:'visual-02'}),
    motion({id:'visual-03'}),
  ]);
  assert.deepEqual(errors, []);
});

test('CUSTOM braucht bei neuen V4-Visuals eine inhaltliche advancedReason', () => {
  const withoutReason = validateYouTubeMotionMetadata(motion({motionPreset:'CUSTOM'}));
  assert.ok(withoutReason.some((error) => error.includes('advancedReason')));

  const withReason = validateYouTubeMotionMetadata(motion({
    motionPreset:'CUSTOM',
    advancedReason:'Ein SVG-Pfad muss mehrere Geldströme exakt zusammenführen; ein Standard-Balken zeigt die Ursache-Wirkung nicht.',
  }));
  assert.deepEqual(withReason, []);
});

test('Legacy-V3-Metadaten bleiben lesbar, damit bestehende Projekte nicht sofort brechen', () => {
  const legacy = motion({
    reason: undefined,
    motionPreset: undefined,
    animationIntent: 'Die Bewegung erklärt die Veränderung.',
    visualTechniqueId: 'legacy-technique',
  });
  assert.equal(getYouTubeMotionReason(legacy), 'Die Bewegung erklärt die Veränderung.');
  assert.equal(getYouTubeMotionPreset(legacy), 'CUSTOM');
  assert.deepEqual(validateYouTubeMotionMetadata(legacy), []);
});
