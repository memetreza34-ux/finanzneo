import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');

test('zentraler Reel-Layoutvertrag nutzt die finale Mobile-Hierarchie', () => {
  const tokens = read('src/brand/tokens.ts');
  assert.match(tokens, /fontSize:56,minFontSize:50/);
  assert.match(tokens, /maxWidth:880,maxLines:2/);
  assert.match(tokens, /iconBox:40,iconSize:34,gap:14/);
  assert.match(tokens, /top:320,bottom:1400/);
  assert.match(tokens, /sourceNote:\{\s*bottom:514/);
  assert.match(tokens, /caption:\{[\s\S]*bottom:340/);
});

test('SceneHeader darf lange Titel zweizeilig statt winzig darstellen', () => {
  const source = read('src/brand/components/SceneHeader.tsx');
  assert.match(source, /whiteSpace: 'normal'/);
  assert.match(source, /WebkitLineClamp: H\.maxLines/);
  assert.match(source, /Math\.max\(\s*H\.minFontSize/);
});

test('SceneHeader hält Icon-Größe, Abstand und erste Textzeile optisch konstant', () => {
  const header = read('src/brand/components/SceneHeader.tsx');
  const icon = read('src/brand/components/Icon.tsx');
  assert.match(header, /data-finanzneo-header-layout="icon-first-line-lock-v1"/);
  assert.match(header, /alignItems: 'flex-start'/);
  assert.match(header, /height: firstLineHeight/);
  assert.match(header, /width: H\.iconBox/);
  assert.match(header, /textAlign: 'left'/);
  assert.match(header, /opticalNormalize/);
  assert.match(icon, /HEADER_OPTICAL_SCALE/);
  assert.match(icon, /opticalNormalize \? \(HEADER_OPTICAL_SCALE\[name\] \?\? 1\) : 1/);
});

test('AnimationStage begrenzt sichtbaren Inhalt hart auf die Visualzone', () => {
  const source = read('src/brand/components/ReelStage.tsx');
  assert.match(source, /data-finanzneo-animation-safezone="visual-only"/);
  assert.match(source, /clipPath: `inset\(\$\{V\.top\}px 0 \$\{VISUAL_CLIP_BOTTOM\}px 0\)`/);
  assert.match(source, /const VISUAL_CLIP_BOTTOM = FORMAT\.vertical\.height - V\.bottom/);
});

test('SourceNote verwendet zentralen Abstand oberhalb der Caption', () => {
  const source = read('src/production/reel-template/ReelTemplate.tsx');
  assert.match(source, /bottom: REEL_STYLE\.sourceNote\.bottom/);
  assert.match(source, /fontSize: REEL_STYLE\.sourceNote\.fontSize/);
  assert.match(source, /maxWidth: REEL_STYLE\.sourceNote\.maxWidth/);
});

test('Scaffolder und Layout-Validator erzeugen und verlangen dieselbe Safe-Zone', () => {
  const scaffold = read('scripts/scaffold-finanzneo-reel.mjs');
  const apply = read('scripts/apply-reel-layout-v5.mjs');
  const validate = read('scripts/validate-reel-layout-v5.mjs');

  for (const source of [scaffold, apply]) {
    assert.match(source, /visualBottom:\s*1400/);
    assert.match(source, /hardClipAnimations:\s*true/);
  }
  assert.match(validate, /visualBottom === 1400/);
  assert.match(validate, /hardClipAnimations === true/);
});
