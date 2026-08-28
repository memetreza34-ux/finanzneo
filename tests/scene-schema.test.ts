import assert from 'node:assert/strict';
import test from 'node:test';
import {spawnSync} from 'node:child_process';
import {readFileSync, rmSync, existsSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {
  SCENE_REQUIRED_FIELDS,
  IMAGE_SCENE_REQUIRED_FIELDS,
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

// Was der Scaffold erzeugt, muss strukturell mit Readiness und dem zentralen
// Schema zusammenpassen. Redundante Metadaten dürfen fehlen, wenn sie sicher
// aus Primärdaten abgeleitet werden können.

const TEST_WURZEL = 'reels/2099-01-01_schema-test';

const scaffoldAnlegen = () => {
  const ziel = `${TEST_WURZEL}/montag/reel-01_probe`;
  if (existsSync(resolve(TEST_WURZEL))) rmSync(resolve(TEST_WURZEL), {recursive: true, force: true});
  const result = spawnSync(
    process.execPath,
    [resolve('scripts/scaffold-finanzneo-reel.mjs'),
     '--target', ziel, '--title', 'Schema-Probe',
     '--types', 'image,animation,image,animation,image'],
    {encoding: 'utf8', cwd: resolve('.')},
  );
  return {ziel, result};
};

const scaffoldMitStandard = () => {
  const ziel = `${TEST_WURZEL}/montag/reel-01_standard`;
  if (existsSync(resolve(TEST_WURZEL))) rmSync(resolve(TEST_WURZEL), {recursive: true, force: true});
  const result = spawnSync(
    process.execPath,
    [resolve('scripts/scaffold-finanzneo-reel.mjs'),
     '--target', ziel, '--title', 'Standard-Probe'],
    {encoding: 'utf8', cwd: resolve('.')},
  );
  return {ziel, result};
};

const aufraeumen = () => {
  if (existsSync(resolve(TEST_WURZEL))) rmSync(resolve(TEST_WURZEL), {recursive: true, force: true});
};

test('Scaffold erzeugt alle Primär-Pflichtfelder des Szenen-Schemas', () => {
  const {ziel, result} = scaffoldAnlegen();
  assert.equal(result.status, 0, `Scaffold fehlgeschlagen: ${result.stderr}${result.stdout}`);

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
  }

  aufraeumen();
  assert.deepEqual(fehlend, [], `Scaffold erzeugt Pflichtfelder nicht: ${fehlend.join(', ')}`);
});

test('Scaffold-Ausgabe erzeugt keine strukturellen Readiness-Blocker', () => {
  const {ziel, result} = scaffoldAnlegen();
  assert.equal(result.status, 0);

  const readiness = analyzeReelReadiness(resolve(ziel));
  const strukturell = readiness.phase1Blockers.filter((b: string) => / fehlt\.$/.test(b));

  aufraeumen();
  assert.deepEqual(
    strukturell,
    [],
    `Scaffold und Readiness sind auseinandergelaufen:\n${strukturell.join('\n')}`,
  );
});

test('Schema erkennt fehlende Primär-Pflichtfelder', () => {
  const fehler = validateSceneShape({id: 'scene-01', type: 'image'});
  assert.ok(fehler.some((f) => f.includes('headline')));
  assert.ok(fehler.some((f) => f.includes('planFile')));
  assert.ok(fehler.some((f) => f.includes('googleFlowFileName')));
});

test('Directory und Accent werden kanonisch abgeleitet', () => {
  const scene = {
    id: 'scene-02',
    type: 'animation',
    headline: 'DIE GRENZE GILT PRO BANK',
    icon: 'bank',
    headerTone: 'warning',
    planFile: '03-szenen/EINZELNE-SZENEN/scene-02/remotion.md',
  };
  assert.equal(canonicalSceneDirectory(scene), 'EINZELNE-SZENEN/scene-02');
  assert.equal(canonicalSceneAccent(scene), 'warning');
  assert.deepEqual(validateSceneShape(scene), []);
});

test('Schema erkennt unbekannte explizite Akzentfarben', () => {
  const fehler = validateSceneShape({
    id: 'scene-01', type: 'animation',
    headline: 'EINE AUSSAGE', icon: 'bank', accent: 'lila', planFile: 'EINZELNE-SZENEN/scene-01/remotion.md',
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

test('Scaffold-Standard trifft das Wortbudget und die 60/40-Mischung', () => {
  const {ziel, result} = scaffoldMitStandard();
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

test('Scaffold erzeugt den Flow-Autonomievertrag ohne Nachbearbeitung', () => {
  const {ziel, result} = scaffoldAnlegen();
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
    `Scaffold-Ausgabe erfüllt den Autonomievertrag nicht:\n${pruefung.stdout}${pruefung.stderr}`,
  );
});
