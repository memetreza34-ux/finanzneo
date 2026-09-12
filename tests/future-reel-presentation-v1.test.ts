import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import test from 'node:test';

const validator = resolve('scripts/validate-future-reel-presentation-v1.mjs');
const CONTRACT_ID = 'finanzneo-future-reel-presentation-v1';

const contract = {
  id: CONTRACT_ID,
  appliesToNewReelsOnly: true,
  legacyReelsUntouched: true,
  scene01CoverUsesTitleInsteadOfStandardHeader: true,
  scene01CaptionsForbidden: true,
  standardHeaderRequiredFromScene02: true,
  standardIconRequiredFromScene02: true,
  captionsRequiredFromScene02: true,
  captionsMustUseRealWordTimings: true,
  phase3CompositionMustMountAudio: true,
  phase3CompositionMustMountSceneHeader: true,
  phase3CompositionMustMountCaptions: true,
  renderedHeaderQaRequired: true,
  renderedCaptionQaRequired: true,
  imageMustFeelFrameFilling: true,
  smallSquareCardLookForbidden: true,
  minImageActivePixelRatio: 0.10,
  motionDiversityRequired: true,
  supportToolSwapDoesNotCountAsNewTechnique: true,
  exactMotionSignatureRepeatWithinPreviousFourForbiddenWithoutReason: true,
  sameHeroObjectFamilyMoreThanTwiceWithinPreviousFourForbiddenWithoutReason: true,
};

const coverPresentation = {
  coverTitleRequired: true,
  standardHeaderRequired: false,
  iconRequired: false,
  captionsRequired: false,
};

const normalPresentation = {
  coverTitleRequired: false,
  standardHeaderRequired: true,
  iconRequired: true,
  captionsRequired: true,
};

const motion = ({
  technique,
  family,
  hero,
  camera,
  layout,
  transformation,
  supportTools = [],
  reason = 'none',
}: {
  technique: string;
  family: string;
  hero: string;
  camera: string;
  layout: string;
  transformation: string;
  supportTools?: string[];
  reason?: string;
}) => ({
  viewerChange: 'Der Zuschauer erkennt eine konkrete finanzielle Ursache und ihre sichtbare Wirkung.',
  visualMode: 'pure-remotion',
  visualTechniqueId: technique,
  compositionFamilyId: family,
  heroObjectFamily: hero,
  primaryAction: 'Die Hauptobjekte verändern ihren Zustand sichtbar und erklären dadurch den Finanzmechanismus.',
  motionSignature: {camera, layout, transformation},
  supportTools,
  repetitionJustification: reason,
});

const makeReel = (animationMotions: ReturnType<typeof motion>[]) => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-presentation-v1-'));
  const write = (relative: string, content: string) => {
    const path = join(root, relative);
    mkdirSync(resolve(path, '..'), {recursive: true});
    writeFileSync(path, content, 'utf8');
  };

  const scenes = [
    {
      id: 'scene-01',
      type: 'image',
      presentation: coverPresentation,
    },
    ...animationMotions.map((motionDesign, index) => ({
      id: `scene-${String(index + 2).padStart(2, '0')}`,
      type: 'animation',
      presentation: normalPresentation,
      motionDesign,
    })),
  ];

  write('03-szenen/scene-index.json', JSON.stringify({
    futurePresentationContract: contract,
    scenes,
  }, null, 2));
  write(
    '05-projektdateien/future-reel-presentation-v1.md',
    `# Future Reel Presentation\n\nFUTURE_REEL_PRESENTATION: ${CONTRACT_ID}\n\nSceneHeader und Captions sind im finalen Render Pflicht.\n`,
  );

  return root;
};

test('sichtbar unterschiedliche Motion-Signaturen bestehen Future Reel Presentation V1', () => {
  const root = makeReel([
    motion({technique:'calendar-time-lapse',family:'time-progression',hero:'calendar',camera:'static-close',layout:'single-hero',transformation:'replace'}),
    motion({technique:'weighted-rebalance',family:'spatial-balance',hero:'portfolio-weights',camera:'top-down',layout:'split-balance',transformation:'redistribute'}),
    motion({technique:'purchasing-power-compression',family:'spatial-compression',hero:'shopping-basket',camera:'push-in',layout:'layered-depth',transformation:'compress'}),
  ]);
  try {
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('gleiche sichtbare Motion-Signatur innerhalb der letzten vier Animationen wird blockiert', () => {
  const root = makeReel([
    motion({technique:'price-step-one',family:'price-objects',hero:'price-tag',camera:'static-close',layout:'single-hero',transformation:'grow'}),
    motion({technique:'price-step-two',family:'other-family',hero:'receipt',camera:'static-close',layout:'single-hero',transformation:'grow',supportTools:['lottie-search']}),
  ]);
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /camera\+layout\+transformation|Signatur/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('ein anderes Support-Lottie macht dieselbe Hauptanimation nicht neu', () => {
  const root = makeReel([
    motion({technique:'account-flow-a',family:'account-flow',hero:'account-bill-coins',camera:'static-close',layout:'single-hero',transformation:'redistribute',supportTools:['lottie-warning']}),
    motion({technique:'account-flow-b',family:'account-flow-variant',hero:'account-bill-coins',camera:'static-close',layout:'single-hero',transformation:'redistribute',supportTools:['lottie-search']}),
  ]);
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Signatur/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('dieselbe Hero-Objektfamilie zum dritten Mal innerhalb der letzten vier wird blockiert', () => {
  const root = makeReel([
    motion({technique:'account-transfer',family:'flow-a',hero:'account-bill-coins',camera:'static-close',layout:'single-hero',transformation:'redistribute'}),
    motion({technique:'account-fee',family:'flow-b',hero:'account-bill-coins',camera:'top-down',layout:'split-balance',transformation:'subtract'}),
    motion({technique:'account-tax',family:'flow-c',hero:'account-bill-coins',camera:'push-in',layout:'layered-depth',transformation:'replace'}),
  ]);
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /heroObjectFamily|dritten Mal/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('bestehende Reels ohne Presentation-V1-Marker bleiben rückwärtskompatibel', () => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-presentation-legacy-'));
  try {
    mkdirSync(join(root, '03-szenen'), {recursive: true});
    writeFileSync(join(root, '03-szenen/scene-index.json'), JSON.stringify({scenes: []}), 'utf8');
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
