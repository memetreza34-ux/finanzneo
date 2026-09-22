import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');

test('new reel pipeline applies cover anchor after creative concept', () => {
  const source = read('scripts/create-finanzneo-reel.mjs');
  const creative = source.indexOf('apply-image-creative-concept-v1.mjs');
  const anchor = source.indexOf('apply-cover-anchor-flow-v1.mjs');
  assert.ok(creative >= 0);
  assert.ok(anchor > creative);
  assert.match(source, /scene-01 = erste Szene \+ Cover \+ Master Visual Anchor/);
});

test('reel flow keeps single-job generation but uses approved cover as only persistent reference', () => {
  const source = read('scripts/lib/flow-autonomy.mjs');
  assert.match(source, /MAXIMAL 1 LAUFENDER BILDGENERIERUNGSJOB/);
  assert.match(source, /scene-01 IST ZUERST ZU ERZEUGEN/);
  assert.match(source, /PLANBLÖCKEN ZU MAXIMAL 5 BILDERN/);
  assert.match(source, /KEIN ANDERES VORHERIGES BILD DARF ALS PERSISTENTE GENERIERUNGSREFERENZ/);
  assert.doesNotMatch(source, /Keine Bildreferenz verwenden\. Kein vorheriges Bild als Generierungsreferenz hochladen/);
});

test('youtube pipeline applies the same master-anchor principle', () => {
  const source = read('scripts/create-finanzneo-youtube.mjs');
  assert.match(source, /apply-youtube-cover-anchor-flow-v1\.mjs/);
  assert.match(source, /visual-01 ist das Master-Anchor-Bild/);
  const validator = read('scripts/validate-youtube-cover-anchor-flow-v1.mjs');
  assert.match(validator, /blockSize muss/);
  assert.match(validator, /visual-01 muss das erste bildbasierte Video-Visual sein/);
});

test('production standard registers the anchor contract and five-image planning blocks', () => {
  const standard = JSON.parse(read('config/finanzneo-production-standard.json'));
  assert.equal(standard.imageStorytelling.coverAnchorFlowId, 'finanzneo-cover-anchor-flow-v1');
  assert.equal(standard.imageStorytelling.coverAnchorBlockSize, 5);
  assert.equal(standard.flow.followupPlanBlockSize, 5);
  assert.equal(standard.flow.generationMode, 'strict-single-job');
});
