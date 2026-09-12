import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import test from 'node:test';

const validator = resolve('scripts/validate-future-reel-phase1-motion-direction-v1.mjs');
const CONTRACT_ID = 'finanzneo-phase1-individual-motion-v1';

const makeRoot = (directionOverrides: Record<string, unknown> = {}, withContract = true) => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-phase1-motion-'));
  mkdirSync(join(root, '03-szenen'), {recursive: true});
  mkdirSync(join(root, '05-projektdateien'), {recursive: true});

  const direction = {
    spokenPoint: 'Die Kreditrate besteht aus Zins und Tilgung und verändert sich über die Laufzeit.',
    viewerMustUnderstand: 'Der Zuschauer sieht, dass der Zinsanteil sinkt, während der Tilgungsanteil steigt.',
    visualQuestion: 'Wie verändert sich die Aufteilung einer gleichbleibenden Kreditrate sichtbar über die Zeit?',
    chosenMechanism: 'Eine feste Monatsrate teilt sich dynamisch in zwei Flächen, während parallel die Restschuld schrumpft.',
    mechanismRationale: 'Die Aufteilung zeigt direkt die beiden Aufgaben derselben Rate und verbindet sie sichtbar mit der sinkenden Restschuld.',
    reuseDecision: 'invent-new',
    reusedTechniqueId: 'none',
    reuseJustification: 'none',
    ...directionOverrides,
  };

  const index = {
    ...(withContract ? {
      phase1MotionDirectionContract: {
        id: CONTRACT_ID,
        appliesToNewReelsOnly: true,
        legacyReelsUntouched: true,
        analyzeSpokenPointBeforeTechnique: true,
        viewerUnderstandingBeforeImplementation: true,
        visualQuestionBeforeTechnique: true,
        mechanismDerivedFromContent: true,
        noFixedAnimationMenu: true,
        toolsFollowContent: true,
        templateReuseOnlyWhenBestFit: true,
        reuseNeedsExplicitJustification: true,
        supportAssetsCannotDriveSceneConcept: true,
        phase1DirectionMustPrecedeMotionDesign: true,
        phase1DirectionMustPrecedeAnimationCode: true,
      },
    } : {}),
    scenes: [{
      id: 'scene-02',
      type: 'animation',
      phase1MotionDirection: direction,
      motionDesign: {viewerChange: 'Die Aufteilung der Rate wird sichtbar verständlich.'},
      animationSourceFile: '03-szenen/EINZELNE-SZENEN/scene-02/animation.tsx',
    }],
  };

  writeFileSync(join(root, '03-szenen/scene-index.json'), JSON.stringify(index, null, 2));
  writeFileSync(
    join(root, '05-projektdateien/phase1-motion-direction-v1.md'),
    `PHASE1_MOTION_DIRECTION: ${CONTRACT_ID}\nSprechpunkt -> Verständnisziel -> Mechanik.\nKeine Animations-Auswahlliste.\n`,
  );
  return root;
};

test('akzeptiert eine sauber Content-first hergeleitete neue Animation', () => {
  const root = makeRoot();
  try {
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('blockiert eine Animation ohne konkrete Mechanik-Begründung', () => {
  const root = makeRoot({mechanismRationale: 'passt'});
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /mechanismRationale/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('blockiert Template-Reuse ohne inhaltliche Best-Fit-Begründung', () => {
  const root = makeRoot({
    reuseDecision: 'reuse-best-fit',
    reusedTechniqueId: 'loan-split-bar',
    reuseJustification: 'none',
  });
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /reuseJustification|Wiederverwendung/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('akzeptiert begründete Wiederverwendung, wenn sie für den Inhalt der beste Fit ist', () => {
  const root = makeRoot({
    reuseDecision: 'reuse-best-fit',
    reusedTechniqueId: 'loan-split-bar',
    reuseJustification: 'Der direkte Vergleich zur vorherigen Kredit-Szene ist nur mit derselben sichtbaren Teilungsmechanik sofort verständlich.',
  });
  try {
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('ältere Reels ohne neuen Marker bleiben rückwärtskompatibel', () => {
  const root = makeRoot({}, false);
  try {
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
