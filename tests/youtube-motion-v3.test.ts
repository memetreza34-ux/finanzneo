import assert from 'node:assert/strict';
import test from 'node:test';
import {
  requiresYouTubeImage,
  requiresYouTubeMotion,
  validateYouTubeMotionMetadata,
  validateYouTubeMotionVariety,
  YOUTUBE_MOTION_STANDARD_ID,
} from '../scripts/lib/youtube-motion-contract.mjs';

const support = (overrides = {}) => ({
  id: 'szene-01',
  type: 'animation',
  animationIntent: 'Macht einen ETF-Handel als sichtbaren Prozess verständlich.',
  viewerTakeaway: 'Der Zuschauer erkennt, dass sein Kauf zunächst ein Börsenhandel ist.',
  qualityTier: 'support',
  mechanicId: 'order-meets-counterparty',
  visualTechniqueId: 'camera-follow-order-ticket',
  compositionFamilyId: 'process-flow',
  animationSourceFile: '03-szenen/szene-01/animation.tsx',
  animationExport: 'Scene01Animation',
  motionChannels: ['Order bewegt sich', 'Kamera folgt', 'Gegenorder erscheint'],
  visualBeats: ['Order startet', 'Börse wird sichtbar', 'Gegenorder kommt', 'Handel ist abgeschlossen'],
  motionEvents: ['Klick', 'Order startet', 'Match', 'ETF-Anteil wechselt'],
  previewDurationFrames: 180,
  maxQuietFrames: 75,
  repeatTechniqueReason: '',
  ...overrides,
});

test('Motion V3 erlaubt Animation, Hybrid und Data ohne Physical-Pflicht', () => {
  assert.equal(YOUTUBE_MOTION_STANDARD_ID, 'finanzneo-youtube-motion-v3');
  assert.equal(requiresYouTubeMotion({type:'animation'}), true);
  assert.equal(requiresYouTubeMotion({type:'hybrid'}), true);
  assert.equal(requiresYouTubeMotion({type:'data'}), true);
  assert.equal(requiresYouTubeMotion({type:'image'}), false);
  assert.equal(requiresYouTubeImage({type:'image'}), true);
  assert.equal(requiresYouTubeImage({type:'hybrid'}), true);
  assert.deepEqual(validateYouTubeMotionMetadata(support()), []);
});

test('Hero-Motion braucht mehr echte Story-Beats und Events als Support-Motion', () => {
  const errors = validateYouTubeMotionMetadata(support({
    qualityTier:'hero',
    motionChannels:['a','b','c'],
    visualBeats:['a','b','c','d'],
    motionEvents:['a','b','c','d'],
  }));
  assert.ok(errors.some((error) => error.includes('mindestens 4 sinnvolle Motion-Channels')));
  assert.ok(errors.some((error) => error.includes('mindestens 5 sichtbare Story-Beats')));
  assert.ok(errors.some((error) => error.includes('mindestens 6 konkrete Motion-Events')));
});

test('Doppelte Haupttechnik und Mechanik werden ohne Grund blockiert', () => {
  const errors = validateYouTubeMotionVariety([
    support({id:'szene-01'}),
    support({id:'szene-02'}),
  ]);
  assert.ok(errors.some((error) => error.includes('visualTechniqueId')));
  assert.ok(errors.some((error) => error.includes('mechanicId')));
});

test('Mehr als zwei gleiche Composition-Familien hintereinander werden blockiert', () => {
  const errors = validateYouTubeMotionVariety([
    support({id:'szene-01',visualTechniqueId:'t1',mechanicId:'m1'}),
    support({id:'szene-02',visualTechniqueId:'t2',mechanicId:'m2'}),
    support({id:'szene-03',visualTechniqueId:'t3',mechanicId:'m3'}),
  ]);
  assert.ok(errors.some((error) => error.includes("mehr als zwei Motion-Visuals hintereinander")));
});

test('Längere Longform-Produktion braucht mindestens 30 Prozent Hero-Motion', () => {
  const motions = Array.from({length:6}, (_, i) => support({
    id:`szene-0${i + 1}`,
    visualTechniqueId:`tech-${i}`,
    mechanicId:`mechanic-${i}`,
    compositionFamilyId:i % 2 === 0 ? 'process-flow' : 'camera-journey',
    qualityTier:i === 0 ? 'hero' : 'support',
    motionChannels:i === 0 ? ['a','b','c','d'] : ['a','b','c'],
    visualBeats:i === 0 ? ['a','b','c','d','e'] : ['a','b','c','d'],
    motionEvents:i === 0 ? ['a','b','c','d','e','f'] : ['a','b','c','d'],
  }));
  const errors = validateYouTubeMotionVariety(motions);
  assert.ok(errors.some((error) => error.includes('mindestens 30 % Hero-Motion')));
});
