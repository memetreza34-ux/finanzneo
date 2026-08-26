import assert from 'node:assert/strict';
import test from 'node:test';
import {spawnSync} from 'node:child_process';
import {readFileSync, rmSync, existsSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {
  SCENE_REQUIRED_FIELDS,
  IMAGE_SCENE_REQUIRED_FIELDS,
  ANIMATION_SCENE_REQUIRED_FIELDS,
  ANIMATION_QUALITY_LOCK,
  SCENE_ACCENTS,
  accentForTone,
  canonicalSceneAccent,
  canonicalSceneDirectory,
  validateSceneShape,
  validatePhase3Executor,
  PHASE3_EXECUTORS,
  DEFAULT_PHASE3_EXECUTOR,
} from '../scripts/lib/reel-scene-schema.mjs';
import {analyzeReelReadiness} from '../scripts/lib/reel-readiness.mjs';

// Der öffentliche Reel-Ersteller ist die kanonische Erzeugungsstrecke:
// Scaffold + Flow-Lock + Phase3-Lock + Layout V5 + Phase1-Animationscode-Lock.

const TEST_WURZEL = 'reels/2099-01-01_schema-test';

const reelAnlegen = () => {
  const ziel = `${TEST_WURZEL}/montag/reel-01_probe`;
  if (existsSync(resolve(TEST_WURZEL))) rmSync(resolve(TEST_WURZEL), {recursive: true, force: true});
  const result = spawnSync(
    process.execPath,
    [resolve('scripts/create-finanzneo-reel.mjs'),
     '--target', ziel, '--title', 'Schema-Probe',
     '--types', 'image,animation,image,animation,image'],
    {encoding: 'utf8', cwd: resolve('.')},
  );
  return {ziel, result};
};

const reelMitStandard = () => {
  const ziel = `${TEST_WURZEL}/montag/reel-01_standard`;
  if (existsSync(resolve(TEST_WURZEL))) rmSync(resolve(TEST_WURZEL), {recursive: true, force: true});
  const result = spawnSync(
    process.execPath,
    [resolve('scripts/create-finanzneo-reel.mjs'),
     '--target', ziel, '--title', 'Standard-Probe'],
    {encoding: 'utf8', cwd: resolve('.')},
  );
  return {ziel, result};
};

const aufraeumen = () => {
  if (existsSync(resolve(TEST_WURZEL))) rmSync(resolve(TEST_WURZEL), {recursive: true, force: true});
};

test('Reel-Ersteller erzeugt alle Primär-Pflichtfelder des Szenen-Schemas', () => {
  const {ziel, result} = reelAnlegen();
  assert.equal(result.status, 0, `Reel-Erstellung fehlgeschlagen: ${result.stderr}${result.stdout}`);

  const index = JSON.parse(readFileSync(join(resolve(ziel), '03-szenen/scene-index.json'), 'utf8'));
  const fehlend: string[] = [];

  for (const scene of index.scenes) {
    for (const feld of SCENE_REQUIRED_FIELDS) {
      if (scene[feld] === undefined) fehlend.push(`${scene.id}.${feld}`);
    }
    if (scene.type === 'image') {
      for (const feld of IMAGE_SCENE_REQUIRED_FIELDS) {
        if (scene[feld] === undefined) fehlend.push(`${scene.id}.${feld}`);
      }
    }
    if (scene.type === 'animation') {
      for (const feld of ANIMATION_SCENE_REQUIRED_FIELDS) {
        if (scene[feld] === undefined) fehlend.push(`${scene.id}.${feld}`);
      }
    }
  }

  assert.equal(index.layoutVersion, 'finanzneo-reel-layout-v5');
  assert.equal(index.phase1AnimationCode?.qualityLock, ANIMATION_QUALITY_LOCK);
  aufraeumen();
  assert.deepEqual(fehlend, [], `Reel-Ersteller erzeugt Pflichtfelder nicht: ${fehlend.join(', ')}`);
});

test('Reel-Ersteller schreibt V5-Layout und Plain-Header direkt in neue Reels', () => {
  const {ziel, result} = reelAnlegen();
  assert.equal(result.status, 0, `${result.stderr}${result.stdout}`);

  try {
    const index = JSON.parse(readFileSync(join(resolve(ziel), '03-szenen/scene-index.json'), 'utf8'));
    assert.deepEqual(index.layout, {
      headlineY: 154,
      visualTop: 320,
      visualBottom: 1480,
      subtitleBottom: 340,
      subtitleLeft: 72,
      subtitleRight: 140,
    });
    assert.equal(index.sceneHeader?.presentation, 'plain');
    assert.equal(index.sceneHeader?.headlineColor, 'white');
    assert.equal(index.sceneHeader?.semanticColorLivesOnIcon, true);
    assert.equal(index.sceneHeader?.capsuleForbidden, true);
    assert.equal(index.sceneHeader?.uppercaseTransformForbidden, true);
    assert.equal(index.subtitleDisplay?.bottom, 340);
    assert.equal(index.transitionContract?.continuityFrames, 3);
  } finally {
    aufraeumen();
  }
});

test('Jede neu erzeugte Animationsszene besitzt sofort ihre kanonische Phase-1-Codequelle', () => {
  const {ziel, result} = reelAnlegen();
  assert.equal(result.status, 0, `${result.stderr}${result.stdout}`);

  try {
    const reelRoot = resolve(ziel);
    const index = JSON.parse(readFileSync(join(reelRoot, '03-szenen/scene-index.json'), 'utf8'));
    const animations = index.scenes.filter((scene: {type: string}) => scene.type === 'animation');
    assert.ok(animations.length > 0);

    for (const scene of animations) {
      assert.equal(scene.animationQualityLock, ANIMATION_QUALITY_LOCK);
      assert.match(scene.animationSourceFile, /animation\.tsx$/);
      assert.match(scene.animationExport, /^Scene\d{2}Animation$/);
      const sourcePath = join(reelRoot, '03-szenen', scene.animationSourceFile);
      assert.equal(existsSync(sourcePath), true, `${scene.id}: animation.tsx fehlt.`);
      const source = readFileSync(sourcePath, 'utf8');
      assert.match(source, /ANIMATION_NARRATIVE/);
      assert.match(source, /RESULT_HOLD_FRAMES = 15/);
    }
  } finally {
    aufraeumen();
  }
});

test('Reel-Ersteller erzeugt keine strukturellen Readiness-Blocker', () => {
  const {ziel, result} = reelAnlegen();
  assert.equal(result.status, 0);

  const readiness = analyzeReelReadiness(resolve(ziel));
  const strukturell = readiness.phase1Blockers.filter((b: string) => / fehlt\.$/.test(b));

  aufraeumen();
  assert.deepEqual(
    strukturell,
    [],
    `Reel-Ersteller und Readiness sind auseinandergelaufen:\n${strukturell.join('\n')}`,
  );
});

test('Schema erkennt fehlende Primär-Pflichtfelder', () => {
  const fehler = validateSceneShape({id: 'scene-01', type: 'image'});
  assert.ok(fehler.some((f) => f.includes('headline')));
  assert.ok(fehler.some((f) => f.includes('planFile')));
  assert.ok(fehler.some((f) => f.includes('googleFlowFileName')));
});

test('Animationsschema verlangt kanonischen Phase-1-Code', () => {
  const fehler = validateSceneShape({
    id: 'scene-02',
    type: 'animation',
    headline: 'Die Bank rechnet um',
    icon: 'repeat',
    planFile: 'EINZELNE-SZENEN/scene-02/remotion.md',
  });
  assert.ok(fehler.some((f) => f.includes('animationSourceFile')));
  assert.ok(fehler.some((f) => f.includes('animationExport')));
});

test('Directory und Accent werden kanonisch abgeleitet', () => {
  const scene = {
    id: 'scene-02',
    type: 'animation',
    headline: 'Die Grenze gilt pro Bank',
    icon: 'bank',
    headerTone: 'warning',
    planFile: '03-szenen/EINZELNE-SZENEN/scene-02/remotion.md',
    animationSourceFile: 'EINZELNE-SZENEN/scene-02/animation.tsx',
    animationExport: 'Scene02Animation',
    animationIntent: 'Konten starten getrennt, fließen sichtbar zur Bank zusammen und enden als eine gemeinsame Schutzsumme.',
    animationQualityLock: ANIMATION_QUALITY_LOCK,
  };
  assert.equal(canonicalSceneDirectory(scene), 'EINZELNE-SZENEN/scene-02');
  assert.equal(canonicalSceneAccent(scene), 'warning');
  assert.deepEqual(validateSceneShape(scene), []);
});

test('Schema erkennt unbekannte explizite Akzentfarben', () => {
  const fehler = validateSceneShape({
    id: 'scene-01', type: 'animation',
    headline: 'Eine Aussage', icon: 'bank', accent: 'lila', planFile: 'EINZELNE-SZENEN/scene-01/remotion.md',
    animationSourceFile: 'EINZELNE-SZENEN/scene-01/animation.tsx',
    animationExport: 'Scene01Animation',
    animationIntent: 'Startzustand wird sichtbar verändert und endet in einem klaren Ergebnis für den Zuschauer.',
    animationQualityLock: ANIMATION_QUALITY_LOCK,
  });
  assert.ok(fehler.some((f) => f.includes('lila')));
});

test('Header-Ton und Akzentfarbe bleiben konsistent', () => {
  assert.equal(accentForTone('warning'), 'warning');
  assert.equal(accentForTone('money'), 'gold');
  assert.equal(accentForTone('positive'), 'finance-green');
  assert.ok(SCENE_ACCENTS.includes(accentForTone('default')));
});

test('Phase-3-Executor akzeptiert nur bekannte Werte', () => {
  assert.deepEqual(validatePhase3Executor('antigravity'), []);
  assert.deepEqual(validatePhase3Executor('claude-code'), []);
  assert.deepEqual(validatePhase3Executor(undefined), []);
  assert.ok(validatePhase3Executor('claude-code-test')[0].includes('unbekannt'));
});

test('Jeder Executor hat eine benannte Übergabe', () => {
  for (const [name, eintrag] of Object.entries(PHASE3_EXECUTORS)) {
    assert.ok(eintrag.label, `${name} braucht ein Label.`);
    assert.ok(eintrag.handoff, `${name} braucht eine Übergabe.`);
  }
  assert.ok(PHASE3_EXECUTORS[DEFAULT_PHASE3_EXECUTOR], 'Default muss ein gültiger Executor sein.');
});

test('Reel-Standard trifft das Wortbudget und die 60/40-Mischung', () => {
  const {ziel, result} = reelMitStandard();
  assert.equal(result.status, 0);

  const index = JSON.parse(readFileSync(join(resolve(ziel), '03-szenen/scene-index.json'), 'utf8'));
  const bild = index.scenes.filter((s: {type: string}) => s.type === 'image').length;
  const gesamt = index.scenes.length;

  const sekundenProBeat = 75 / gesamt;
  let serie = 0;
  let maxSerie = 0;
  for (const s of index.scenes) {
    serie = s.type === 'image' ? serie + 1 : 0;
    maxSerie = Math.max(maxSerie, serie);
  }

  aufraeumen();
  assert.ok(gesamt >= 14, `Standard hat nur ${gesamt} Beats; ab 14 liegt der Schnitt im Zielkorridor.`);
  assert.ok(sekundenProBeat <= 6, `${sekundenProBeat.toFixed(1)} s pro Beat überschreitet die 6-Sekunden-Grenze.`);
  assert.ok(maxSerie <= 2, `${maxSerie} Bildszenen am Stück; höchstens zwei sind erlaubt.`);
  assert.ok(bild / gesamt >= 0.5 && bild / gesamt <= 0.7, `Bildanteil ${(bild / gesamt * 100).toFixed(0)} % liegt außerhalb 50–70 %.`);
});

test('Reel-Ersteller erzeugt den Flow-Autonomievertrag', () => {
  const {ziel, result} = reelAnlegen();
  assert.equal(result.status, 0);

  const pruefung = spawnSync(
    process.execPath,
    [resolve('scripts/validate-flow-autonomous-contract.mjs'), resolve(ziel)],
    {encoding: 'utf8'},
  );

  aufraeumen();
  assert.equal(
    pruefung.status,
    0,
    `Reel-Ausgabe erfüllt den Autonomievertrag nicht:\n${pruefung.stdout}${pruefung.stderr}`,
  );
});
