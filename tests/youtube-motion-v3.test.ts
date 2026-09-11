import assert from 'node:assert/strict';
import test from 'node:test';
import {
  requiresYouTubeImage,
  requiresYouTubeMotion,
  validateYouTubeMotionMetadata,
  validateYouTubeMotionVariety,
  YOUTUBE_MOTION_STANDARD_ID,
} from '../scripts/lib/youtube-motion-contract.mjs';

test('YouTube Motion V3 erlaubt Animation, Hybrid und Data ohne feste Animationsbibliothek', () => {
  assert.equal(YOUTUBE_MOTION_STANDARD_ID, 'finanzneo-youtube-motion-v3');
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
  viewerChange: 'Monatliche Einzahlungen erscheinen nacheinander und der Renditeanteil wächst sichtbar schneller.',
  animationIntent: 'Macht den Unterschied zwischen Einzahlungen und Rendite über Zeit sichtbar.',
  mechanicId: 'monthly-input-compound-growth',
  visualTechniqueId: 'spatial-time-layer-growth',
  techniqueDescription: 'Jahresebenen bauen sich in der Tiefe auf, während Einzahlungen eintreffen und der Renditebereich nichtlinear anwächst.',
  compositionFamilyId: 'camera-through-time-layers',
  toolStack: ['React Three Fiber', 'Remotion'],
  motionSignature: {
    camera: 'forward travel through depth layers',
    layout: 'stacked yearly planes in z-depth',
    transformation: 'nonlinear portfolio expansion around deposits',
  },
  animationSourceFile: '04-visuals/EINZELNE-VISUALS/visual-01/animation.tsx',
  animationExport: 'Visual01Animation',
  motionChannels: ['Einzahlungen kommen hinzu', 'Renditebereich expandiert'],
  visualBeats: ['Erste Einzahlung', 'Rendite dominiert den Endwert'],
  repeatTechniqueReason: '',
  ...overrides,
});

test('Motion-V3-Metadaten erzwingen Viewer Change, konkrete Technik und Motion-Signatur', () => {
  assert.deepEqual(validateYouTubeMotionMetadata(motion()), []);
  const errors = validateYouTubeMotionMetadata(motion({viewerChange:'', toolStack:[], motionSignature:{camera:'',layout:'',transformation:''}}));
  assert.ok(errors.some((error) => error.includes('viewerChange')));
  assert.ok(errors.some((error) => error.includes('toolStack')));
  assert.ok(errors.some((error) => error.includes('motionSignature.camera')));
});

test('Composition Family ist offen und keine Whitelist', () => {
  assert.deepEqual(validateYouTubeMotionMetadata(motion({compositionFamilyId:'object-disassembly-through-tax-layers'})), []);
});

test('Doppelte Haupttechnik wird ohne Begründung blockiert', () => {
  const errors = validateYouTubeMotionVariety([
    motion({id:'visual-01'}),
    motion({
      id:'visual-02',
      mechanicId:'second-mechanic',
      techniqueDescription:'Andere konkrete Umsetzung.',
      motionSignature:{camera:'static',layout:'split-screen',transformation:'documents compare'},
    }),
  ]);
  assert.ok(errors.some((error) => error.includes('visualTechniqueId')));
});

test('Umbenannte Technik mit identischer echter Motion wird innerhalb der letzten vier Visuals blockiert', () => {
  const errors = validateYouTubeMotionVariety([
    motion({id:'visual-01'}),
    motion({
      id:'visual-02',
      mechanicId:'new-mechanic',
      visualTechniqueId:'completely-new-name',
      techniqueDescription:'Auch die Beschreibung wurde umbenannt.',
    }),
  ]);
  assert.ok(errors.some((error) => error.includes('motionSignature')));
});

test('Bewusst begründete Wiederholung bleibt möglich', () => {
  const errors = validateYouTubeMotionVariety([
    motion({id:'visual-01'}),
    motion({
      id:'visual-02',
      repeatTechniqueReason:'Direkter Vorher-Nachher-Vergleich: identische Kamera und Anordnung sind nötig, damit nur die Zustandsänderung verglichen wird.',
    }),
  ]);
  assert.deepEqual(errors, []);
});

test('Mehr als zwei gleiche freie Composition-Familien in Folge brauchen einen Grund', () => {
  const errors = validateYouTubeMotionVariety([
    motion({id:'visual-01', visualTechniqueId:'tech-1', mechanicId:'m1', techniqueDescription:'desc-1'}),
    motion({id:'visual-02', visualTechniqueId:'tech-2', mechanicId:'m2', techniqueDescription:'desc-2', motionSignature:{camera:'static',layout:'left-right',transformation:'reveal'}}),
    motion({id:'visual-03', visualTechniqueId:'tech-3', mechanicId:'m3', techniqueDescription:'desc-3', motionSignature:{camera:'orbit',layout:'centered',transformation:'assemble'}}),
  ]);
  assert.ok(errors.some((error) => error.includes('mehr als zwei Motion-Visuals')));
});
