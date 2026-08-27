import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdtempSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {ANIMATION_QUALITY_LOCK} from '../scripts/lib/reel-scene-schema.mjs';

const buildFixture = () => {
  const root = mkdtempSync(resolve('.tmp-animation-quality-'));
  const sceneDir = join(root, '03-szenen', 'EINZELNE-SZENEN', 'scene-02');
  mkdirSync(sceneDir, {recursive: true});

  const index = {
    phase1AnimationCode: {
      required: true,
      qualityLock: ANIMATION_QUALITY_LOCK,
      phase3MayNotReplaceCanonicalAnimation: true,
    },
    scenes: [{
      id: 'scene-02',
      type: 'animation',
      headline: 'Die Umrechnung verändert den Betrag',
      icon: 'repeat',
      planFile: 'EINZELNE-SZENEN/scene-02/remotion.md',
      animationSourceFile: 'EINZELNE-SZENEN/scene-02/animation.tsx',
      animationExport: 'Scene02Animation',
      animationIntent: 'Ein lokaler Betrag startet links, wird sichtbar durch die Umrechnung geführt und endet als klarer Euro-Endbetrag.',
      animationQualityLock: ANIMATION_QUALITY_LOCK,
    }],
  };
  mkdirSync(join(root, '03-szenen'), {recursive: true});
  writeFileSync(join(root, '03-szenen', 'scene-index.json'), `${JSON.stringify(index, null, 2)}\n`);

  const validSource = `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../src/design-system';

/**
 * ANIMATION_NARRATIVE
 * START: Links steht ein klar beschrifteter lokaler Kartenbetrag als ruhiger Ausgangswert.
 * MECHANISM: Der Betrag wandert sichtbar durch eine Umrechnungsstrecke, während der neue Wert schrittweise hervorgehoben wird.
 * RESULT: Rechts bleibt der umgerechnete Eurobetrag klar stehen und macht die Ursache-Wirkung-Beziehung sofort verständlich.
 *
 * Die Bewegung folgt ausschließlich der gesprochenen Erklärung. Die Szene hat
 * einen festen Ausgangszustand, eine gerichtete Transformation und einen
 * stabilen Endzustand. Neutrale Information bleibt weiß, der aktive Pfad nutzt
 * FinanzNeo-Grün und Geldwerte verwenden die zentrale Geldfarbe.
 */
export const RESULT_HOLD_FRAMES = 15;

export const Scene02Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 150}) => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame, [12, Math.max(45, durationFrames - RESULT_HOLD_FRAMES - 18)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const amount = Math.round(100 + travel * 8);

  return (
    <AnimationStage>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 44, color: ANIMATION_COLORS.neutralText, fontSize: 42}}>
          <div>100 Lokal</div>
          <div style={{width: 260, height: 10, background: ANIMATION_COLORS.focus, transform: \`scaleX(\${travel})\`, transformOrigin: 'left center'}} />
          <div style={{color: ANIMATION_COLORS.money}}>{amount} €</div>
        </div>
      </div>
    </AnimationStage>
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

test('produktionsreifer Phase-1-Animationscode besteht den Qualitätsvertrag', () => {
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
      'const amount = Math.round(100 + travel * 8);',
      'const wobble = Math.sin(frame / 3);\n  const amount = Math.round(100 + travel * 8 + wobble);',
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
      'Die Bewegung folgt ausschließlich der gesprochenen Erklärung.',
      'Debug rectangle: Die Bewegung folgt ausschließlich der gesprochenen Erklärung.',
    );
    writeFileSync(fixture.sourcePath, cheated);
    const result = validate(fixture.root);
    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}\n${result.stderr}`, /Hack-Sprache/);
  } finally {
    rmSync(fixture.root, {recursive: true, force: true});
  }
});
