import {readFile} from 'node:fs/promises';
import process from 'node:process';

const root = new URL('../', import.meta.url);
const planPath = 'channels/finanzneo/src/animation-system/full-animation-reel/narrative-plan.current.json';
const plan = JSON.parse(await readFile(new URL(planPath, root), 'utf8'));
const scenes = Array.isArray(plan.scenes) ? plan.scenes : [];
const failures = [];

const normalized = (value) => String(value ?? '').trim().toLowerCase();
const uniqueCount = (values) => new Set(values.map(normalized)).size;
const maxRepeated = (values) => {
  const counts = new Map();
  for (const value of values.map(normalized)) counts.set(value, (counts.get(value) ?? 0) + 1);
  return Math.max(0, ...counts.values());
};
const maxConsecutive = (predicate) => {
  let current = 0;
  let maximum = 0;
  for (const scene of scenes) {
    if (predicate(scene)) {
      current += 1;
      maximum = Math.max(maximum, current);
    } else current = 0;
  }
  return maximum;
};

const sceneCount = scenes.length;
const distinctContentBeats = uniqueCount(scenes.map((scene) => scene.contentBeat));
const distinctActions = uniqueCount(scenes.map((scene) => scene.narrativeAction));
const distinctMetaphors = uniqueCount(scenes.map((scene) => scene.visualMetaphor));
const distinctLayouts = uniqueCount(scenes.map((scene) => scene.layoutFamily));
const dataVizScenes = scenes.filter((scene) => scene.dataViz === true).length;
const dashboardScenes = scenes.filter((scene) => scene.dashboardFraming === true).length;
const staticCameraScenes = scenes.filter((scene) => scene.cameraMove === 'static').length;
const repeatedCoreComparisonScenes = scenes.filter((scene) => scene.repeatsCoreComparison === true).length;

if (plan.status === 'rejected') failures.push('Der aktive Storyboard-Plan ist ausdrücklich als rejected markiert.');
if (sceneCount < 5 || sceneCount > 9) failures.push('Es werden 5 bis 9 Szenen benötigt.');
if (distinctContentBeats < Math.max(1, sceneCount - 1)) failures.push(`Nur ${distinctContentBeats} unterschiedliche Inhaltsbeats für ${sceneCount} Szenen.`);
if (distinctActions < Math.ceil(sceneCount * 0.72)) failures.push(`Nur ${distinctActions} unterschiedliche Handlungen für ${sceneCount} Szenen.`);
if (distinctMetaphors < Math.ceil(sceneCount * 0.72)) failures.push(`Nur ${distinctMetaphors} unterschiedliche visuelle Metaphern für ${sceneCount} Szenen.`);
if (distinctLayouts < Math.ceil(sceneCount * 0.58)) failures.push(`Nur ${distinctLayouts} unterschiedliche Layoutfamilien.`);
if (maxRepeated(scenes.map((scene) => scene.layoutFamily)) > 2) failures.push('Eine Layoutfamilie wird öfter als zweimal eingesetzt.');
if (maxConsecutive((scene) => scene.layoutFamily === 'dashboard-card') > 1) failures.push('Dashboard-Karten folgen direkt aufeinander.');
if (dataVizScenes > Math.max(1, Math.floor(sceneCount * 0.4))) failures.push(`${dataVizScenes} reine Datenvisualisierungen sind zu viele.`);
if (maxConsecutive((scene) => scene.dataViz === true) > 1) failures.push('Reine Datenvisualisierungen folgen direkt aufeinander.');
if (dashboardScenes > 1) failures.push(`${dashboardScenes} Dashboard-Szenen sind zu viele; maximal eine ist erlaubt.`);
if (staticCameraScenes > Math.floor(sceneCount * 0.4)) failures.push(`${staticCameraScenes} statische Kameraszenen sind zu viele.`);
if (repeatedCoreComparisonScenes > 2) failures.push(`Der gleiche Kernvergleich wird in ${repeatedCoreComparisonScenes} Szenen wiederholt.`);

for (const scene of scenes) {
  if (!normalized(scene.id) || !normalized(scene.contentBeat) || !normalized(scene.narrativeAction) || !normalized(scene.visualMetaphor)) {
    failures.push('Mindestens eine Szene besitzt unvollständige Storyboard-Metadaten.');
  }
  if (normalized(scene.startState) === normalized(scene.endState)) failures.push(`Szene ${scene.id} hat keine sichtbare Zustandsänderung.`);
  if ((scene.visualMode === 'data-viz') !== (scene.dataViz === true)) failures.push(`Szene ${scene.id} hat widersprüchliche dataViz-Metadaten.`);
}

console.log('Narrative animation plan metrics:');
console.log(JSON.stringify({sceneCount, distinctContentBeats, distinctActions, distinctMetaphors, distinctLayouts, dataVizScenes, dashboardScenes, staticCameraScenes, repeatedCoreComparisonScenes}, null, 2));

if (failures.length > 0) {
  for (const failure of failures) console.error(`Narrative storyboard rejected: ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Narrative storyboard quality gate passed.');
}
