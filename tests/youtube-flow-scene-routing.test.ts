import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');

test('YouTube Flow ist meaning-first und Präzisionsgrafiken gehören Remotion', () => {
  const wrapper = read('scripts/create-finanzneo-youtube.mjs');
  const world = read('config/finanzneo-image-worlds/finanzneo-youtube-animated-black-v3.txt');
  const standard = read('youtube/PRODUKTIONSSTANDARD.md');

  for (const source of [wrapper, world, standard]) {
    assert.match(source, /BEDEUTUNG ZUERST|MEANING FIRST/i);
    assert.match(source, /Remotion/i);
    assert.doesNotMatch(source, /FLOW_IMAGE_POLICY:\s*scene-first-no-infographic-v1/i);
    assert.doesNotMatch(source, /SIMPLE EXPLAINER/i);
  }

  assert.match(wrapper, /YOUTUBE_FLOW_IMAGE_POLICY_ID/);
  assert.match(wrapper, /sceneFirst = false/);
  assert.match(wrapper, /placeRequired = false/);
  assert.match(wrapper, /peopleRequired = false/);
  assert.match(wrapper, /semanticObjectCompositionsAllowed = true/);
  assert.match(wrapper, /visualMetaphorsAllowed = true/);
  assert.match(wrapper, /PRECISION_GRAPHICS_OWNER: REMOTION/);

  assert.match(world, /FLOW_IMAGE_POLICY: meaning-first-free-visual-v2/);
  assert.match(world, /isolated-object/);
  assert.match(world, /semantic-object-composition/);
  assert.match(world, /visual-metaphor/);
  assert.match(world, /NO location requirement/i);
  assert.match(world, /Objects do not need a table, room or realistic support surface/i);
  assert.match(world, /Charts with axes, exact mathematical diagrams, tables, checklists, UI/i);

  assert.match(standard, /BEDEUTUNG ZUERST — FORM FREI/);
  assert.match(standard, /isoliertes Objekt/i);
  assert.match(standard, /semantische Objektanordnung/i);
  assert.match(standard, /visuelle Metapher/i);
  assert.match(standard, /Person.*Ort.*Oberfläche.*nicht automatisch|Person.*Ort.*Oberfläche/i);
  assert.match(standard, /Charts|Tabellen|UI/i);
});
