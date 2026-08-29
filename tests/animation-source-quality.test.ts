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
import {ANIMATION_COLORS, PhysicalAccount, PhysicalBill, PhysicalCoinStack, PremiumPhysicalStage} from '../../../../../../src/design-system';

/**
 * MECHANIC_ID: cash-exchange-becomes-euro-balance
 * PRIMARY_ACTION: Ein konkreter Geldstapel bewegt sich von einer Wechselquittung zu einem realen Euro-Konto, während Betrag, Quittungsstatus und Kontozustand sichtbar gemeinsam wechseln.
 *
 * ANIMATION_NARRATIVE
 * START: Eine reale Wechselquittung, ein lokaler Geldstapel und ein neutrales Zielkonto stehen als verständliche Ausgangssituation auf der Bühne.
 * MECHANISM: Der Geldstapel wandert sichtbar von der Quittung zum Euro-Konto, während die Quittung kleiner wird und das Zielkonto in den bestätigten Zustand wechselt.
 * RESULT: Der Eurobetrag steht stabil auf dem Konto und die abgeschlossene Quittung bleibt als nachvollziehbarer Ursprung daneben sichtbar.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Geldstapel, Quittung und Konto bilden eine konkrete reale Umrechnungssituation statt einer abstrakten Kartenreihe.
 * SUPPORT: Kurze Beträge erklären nur Start und Ergebnis; die physische Bewegung des Geldes trägt die eigentliche Aussage.
 * MATERIAL: Ivory-Papier, Gold für Geld und Emerald für den bestätigten Euro-Endzustand verbinden die Szene mit der FinanzNeo-Welt.
 * DEPTH: Quittung links, bewegter Geldstapel mittig und Konto rechts liegen auf gestaffelten Z-Ebenen mit klarer Leserichtung.
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
  const receiptSettle = interpolate(frame, [34, 82], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const resultScale = interpolate(travel, [0.55, 1], [0.72, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const confirm = interpolate(frame, [70, 105], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <PremiumPhysicalStage>
      <PhysicalBill
        x={90}
        y={650 + receiptSettle * 18}
        label="Wechsel"
        amount="100 Lokal"
        scale={0.72 - receiptSettle * 0.08}
        opacity={1 - receiptSettle * 0.18}
        paid={confirm > 0.7}
      />
      <PhysicalCoinStack
        x={345 + travel * 260}
        y={735 - travel * 55}
        count={5}
        scale={0.82 - travel * 0.08}
      />
      <PhysicalAccount
        x={650}
        y={650 - confirm * 12}
        label="Euro-Konto"
        balance="108 €"
        state={confirm > 0.55 ? 'protected' : 'normal'}
        scale={resultScale}
      />
      <div style={{position:'absolute',left:700,top:900,opacity:confirm,color:ANIMATION_COLORS.positive,fontSize:28,fontWeight:900}}>UMGERECHNET</div>
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
    const cheated = fixture.validSource
      .replace(
        "import React from 'react';",
        "import React from 'react';\nconst FNBgParticles = () => null;",
      )
      .replace(
        '<PremiumPhysicalStage>',
        '<PremiumPhysicalStage>\n      <FNBgParticles />',
      );
    writeFileSync(fixture.sourcePath, cheated);
    const result = validate(fixture.root);
    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}\n${result.stderr}`, /Partikel\/Aurora\/Grid/);
  } finally {
    rmSync(fixture.root, {recursive: true, force: true});
  }
});
