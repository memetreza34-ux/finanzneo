import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdtempSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {ANIMATION_QUALITY_LOCK} from '../scripts/lib/reel-scene-schema.mjs';
import {
  PREMIUM_ANIMATION_LOCK,
  premiumAnimationContractFields,
} from '../scripts/lib/premium-animation-contract.mjs';

const buildFixture = () => {
  const root = mkdtempSync(resolve('.tmp-animation-quality-'));
  const sceneDir = join(root, '03-szenen', 'EINZELNE-SZENEN', 'scene-02');
  mkdirSync(sceneDir, {recursive: true});

  const index = {
    phase1AnimationCode: {
      required: true,
      qualityLock: ANIMATION_QUALITY_LOCK,
      phase3MayNotReplaceCanonicalAnimation: true,
      ...premiumAnimationContractFields(),
    },
    scenes: [{
      id: 'scene-02',
      type: 'animation',
      headline: 'Die Umrechnung verändert den Betrag',
      icon: 'repeat',
      planFile: 'EINZELNE-SZENEN/scene-02/remotion.md',
      animationSourceFile: 'EINZELNE-SZENEN/scene-02/animation.tsx',
      animationExport: 'Scene02Animation',
      animationIntent: 'Ein lokaler Betrag startet links, wird sichtbar durch eine Umrechnung geführt und endet als klarer Euro-Endbetrag.',
      animationQualityLock: ANIMATION_QUALITY_LOCK,
      animationPremiumVisualLock: PREMIUM_ANIMATION_LOCK,
    }],
  };
  mkdirSync(join(root, '03-szenen'), {recursive: true});
  writeFileSync(join(root, '03-szenen', 'scene-index.json'), `${JSON.stringify(index, null, 2)}\n`);

  const validSource = `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, PhysicalObject, PremiumPhysicalStage} from '../../../../../../src/design-system';

/**
 * ANIMATION_NARRATIVE
 * START: Ein großer lokaler Währungschip steht als klarer Ausgangswert im linken Teil der Visualzone.
 * MECHANISM: Der Chip bewegt sich sichtbar durch die Umrechnung, während ein zweites physisches Ergebnisobjekt erscheint.
 * RESULT: Der umgerechnete Eurobetrag bleibt als klarer physischer Endzustand stabil stehen.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Der große lokale Währungschip ist das sofort erkennbare Hauptmotiv der Szene.
 * SUPPORT: Nur der Ergebnis-Chip unterstützt die Erklärung; keine feste Support-Objekt-Anzahl wird erzwungen.
 * MATERIAL: Neutraler Ivory-Chip wird durch Emerald-Fokus und Gold für den Geld-Endwert ergänzt.
 * DEPTH: Beide Objekte besitzen sichtbare Dicke und klare räumliche Trennung auf transparentem Stage.
 *
 * Der Stage erzeugt keinen eigenen Hintergrund. Die Szene liegt auf dem zentralen
 * statischen schwarzen Reel-Canvas. Die Bewegung folgt ausschließlich der
 * gesprochenen Erklärung und besitzt einen stabilen Endzustand.
 */
export const RESULT_HOLD_FRAMES = 15;

export const Scene02Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame, [12, Math.max(45, durationFrames - RESULT_HOLD_FRAMES - 18)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const resultScale = interpolate(travel, [0.55, 1], [0.72, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <PremiumPhysicalStage>
      <PhysicalObject
        material="neutral"
        width={390}
        height={240}
        x={120 + travel * 210}
        y={650}
        scale={1 - travel * 0.08}
      >
        <div style={{fontSize: 52, fontWeight: 900, padding: 50, textAlign: 'center'}}>100 LOKAL</div>
      </PhysicalObject>
      <PhysicalObject
        material="money"
        width={360}
        height={220}
        x={590}
        y={665}
        scale={resultScale}
        opacity={travel}
      >
        <div style={{fontSize: 58, fontWeight: 900, padding: 46, textAlign: 'center', color: ANIMATION_COLORS.money}}>108 €</div>
      </PhysicalObject>
    </PremiumPhysicalStage>
  );
};
`;
  const sourcePath = join(sceneDir, 'animation.tsx');
  writeFileSync(sourcePath, validSource);
  return {root, sourcePath, validSource};
};

const validate = (root: string) => spawnSync(
  process.execPath,
  [resolve('scripts/validate-animation-source-quality.mjs'), root],
  {encoding: 'utf8'},
);

test('produktionsreifer V9-kompatibler Phase-1-Animationscode besteht den Qualitätsvertrag', () => {
  const fixture = buildFixture();
  try {
    const result = validate(fixture.root);
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  } finally {
    rmSync(fixture.root, {recursive: true, force: true});
  }
});

test('Math.sin-Wackelbewegung wird auch bei sonst vollständiger Animation blockiert', () => {
  const fixture = buildFixture();
  try {
    const cheated = fixture.validSource.replace(
      'const resultScale = interpolate(travel, [0.55, 1], [0.72, 1], {',
      'const wobble = Math.sin(frame / 3);\n  void wobble;\n  const resultScale = interpolate(travel, [0.55, 1], [0.72, 1], {',
    );
    writeFileSync(fixture.sourcePath, cheated);
    const result = validate(fixture.root);
    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}\n${result.stderr}`, /Math\.sin\/Math\.cos/);
  } finally {
    rmSync(fixture.root, {recursive: true, force: true});
  }
});

test('Debug-/Placeholder-Sprache wird nicht als fertige Animation akzeptiert', () => {
  const fixture = buildFixture();
  try {
    const cheated = fixture.validSource.replace(
      'Die Bewegung folgt ausschließlich der',
      'Debug rectangle: Die Bewegung folgt ausschließlich der',
    );
    writeFileSync(fixture.sourcePath, cheated);
    const result = validate(fixture.root);
    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}\n${result.stderr}`, /Hack-Sprache/);
  } finally {
    rmSync(fixture.root, {recursive: true, force: true});
  }
});

test('Partikel-/Aurora-Hintergrundkomponenten werden in Animationen blockiert', () => {
  const fixture = buildFixture();
  try {
    const cheated = fixture.validSource.replace(
      "import React from 'react';",
      "import React from 'react';\nconst FNBgParticles = () => null;",
    );
    writeFileSync(fixture.sourcePath, cheated);
    const result = validate(fixture.root);
    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}\n${result.stderr}`, /Partikel\/Aurora\/Grid/);
  } finally {
    rmSync(fixture.root, {recursive: true, force: true});
  }
});
