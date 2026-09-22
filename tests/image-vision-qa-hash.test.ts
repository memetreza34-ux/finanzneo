import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';

const hash = (value: Buffer) => createHash('sha256').update(value).digest('hex');

const write = (root: string, relativePath: string, content: string | Buffer) => {
  const path = join(root, relativePath);
  mkdirSync(join(path, '..'), {recursive: true});
  writeFileSync(path, content);
};

const passingResult = (sceneHash: string, comparedHash: string) => ({
  contractId: 'finanzneo-image-vision-qa-v1',
  evaluatorMode: 'multimodal-pixel-review',
  sceneId: 'scene-02',
  imageFile: 'Bild 02 - Vergleich.png',
  imageSha256: sceneHash,
  comparedImageSha256: [comparedHash],
  scores: {
    planAlignment: 92,
    cameraCompliance: 90,
    actionReadability: 91,
    hookStrength: 80,
    visualInterest: 86,
    worldConsistency: 95,
    compositionClarity: 91,
    sequenceNovelty: 84,
  },
  flags: {
    photorealistic: false,
    genericFinanceIconMain: false,
    staticCatalogLike: false,
    wrongBackground: false,
    headlineOrSentenceInsideImage: false,
    labelBudgetExceeded: false,
    sceneMismatch: false,
    genericDeskScene: false,
    deadSpaceDominant: false,
  },
  observed: {
    cameraAngle: 'low-angle',
    shotScale: 'close-up',
    locationClass: 'retail',
    mainSubjectClass: 'purchase',
    dominantAction: 'shopping basket visibly tips as cost rises',
    labelCount: 0,
  },
  evidence: [
    'The camera is visibly below the basket rim and points upward.',
    'The purchase is the dominant object and the cost consequence is visually clear.',
    'The scene is stylized 3D on a seamless deep-black background.',
  ],
  verdict: 'PASS',
  regenerationInstruction: 'none',
});

test('Novelty-PASS wird ungültig, wenn ein verglichenes Bild später andere Pixel bekommt', () => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-vision-hash-'));
  try {
    const firstBytes = Buffer.from('first-image-version-a');
    const secondBytes = Buffer.from('second-image-stable');
    const firstHash = hash(firstBytes);
    const secondHash = hash(secondBytes);

    write(root, '03-szenen/scene-index.json', JSON.stringify({
      imageStorytellingContract: {hardeningId: 'finanzneo-image-storytelling-v5-hardening-v1'},
      scenes: [
        {id: 'scene-01', type: 'image', googleFlowFileName: 'Bild 01 - Start.png'},
        {id: 'scene-02', type: 'image', googleFlowFileName: 'Bild 02 - Vergleich.png'},
      ],
    }));
    write(root, '03-szenen/00-ALLE-BILDER-HIER-REIN/Bild 01 - Start.png', firstBytes);
    write(root, '03-szenen/00-ALLE-BILDER-HIER-REIN/Bild 02 - Vergleich.png', secondBytes);
    write(root, '03-szenen/vision-qa/requests/scene-02.json', JSON.stringify({
      contractId: 'finanzneo-image-vision-qa-v1',
      sceneId: 'scene-02',
      imageFile: 'Bild 02 - Vergleich.png',
      imageSha256: secondHash,
      isCover: false,
      expected: {labelBudget: 0},
      compareAgainst: [{sceneId: 'scene-01', imageFile: 'Bild 01 - Start.png', imageSha256: firstHash}],
    }));
    write(root, '03-szenen/vision-qa/results/scene-02.json', JSON.stringify(passingResult(secondHash, firstHash)));

    execFileSync(process.execPath, ['scripts/validate-image-vision-qa.mjs', root, '--scene', 'scene-02'], {
      cwd: process.cwd(),
      stdio: 'pipe',
    });

    write(root, '03-szenen/00-ALLE-BILDER-HIER-REIN/Bild 01 - Start.png', Buffer.from('first-image-version-b'));

    assert.throws(() => {
      execFileSync(process.execPath, ['scripts/validate-image-vision-qa.mjs', root, '--scene', 'scene-02'], {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: 'pipe',
      });
    }, (error: unknown) => {
      const stderr = String((error as {stderr?: string}).stderr ?? '');
      assert.match(stderr, /Sequenzvergleich ist veraltet/);
      return true;
    });
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
