import {readFile} from 'node:fs/promises';
import process from 'node:process';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const failures = [];
const requireTokens = (content, path, tokens) => {
  for (const token of tokens) if (!content.includes(token)) failures.push(`${path} enthält ${token} nicht.`);
};

const qualityPath = 'channels/finanzneo/src/animation-system/full-animation-reel/NarrativeAnimationQuality.ts';
const plansPath = 'channels/finanzneo/src/animation-system/full-animation-reel/NarrativeAnimationPlans.ts';
const testsPath = 'channels/finanzneo/src/animation-system/full-animation-reel/NarrativeAnimationQuality.test.ts';
const currentPlanPath = 'channels/finanzneo/src/animation-system/full-animation-reel/narrative-plan.current.json';
const manifestPath = 'channels/finanzneo/src/animation-system/full-animation-reel/full-animation-reel-quality.json';
const workflowPath = 'channels/finanzneo/src/animation-system/full-animation-reel/NARRATIVE_QUALITY_WORKFLOW.md';
const claudePath = 'CLAUDE.md';

const quality = await read(qualityPath);
const plans = await read(plansPath);
const tests = await read(testsPath);
const workflow = await read(workflowPath);
const claude = await read(claudePath);
const currentPlan = JSON.parse(await read(currentPlanPath));
const manifest = JSON.parse(await read(manifestPath));
const packageJson = JSON.parse(await read('package.json'));

requireTokens(quality, qualityPath, [
  'evaluateNarrativeAnimationPlan',
  'assertNarrativeAnimationPlan',
  'Zu viele reine Datenvisualisierungen',
  'Zu viele Dashboard-Szenen',
  'Kernvergleich',
  'verändert ihren Zustand nicht sichtbar',
]);
requireTokens(plans, plansPath, [
  'REJECTED_EARLY_VS_LATE_PLAN',
  'NARRATIVE_REEL_REFERENCE_PLAN',
  "visualMode: 'object-story'",
  "visualMode: 'environment'",
  "visualMode: 'process-machine'",
  "visualMode: 'data-viz'",
]);
requireTokens(tests, testsPath, [
  'rejects the first full-animation reel',
  'accepts a narrative plan',
  'technically renamed plan',
  'visible state change',
]);
requireTokens(workflow, workflowPath, [
  'Storyboard vor Code',
  'Mindestens 60 %',
  'Technische Prüfung ist keine kreative Freigabe',
  'approvedByHuman',
]);
requireTokens(claude, claudePath, [
  '@channels/finanzneo/src/animation-system/full-animation-reel/NARRATIVE_QUALITY_WORKFLOW.md',
  'Bei einem Fehler stoppen. Noch keine Animation programmieren.',
  'Ein neuer Komponentenname beweist keine neue visuelle Idee.',
  'approvedByHuman',
]);

if (currentPlan.status !== 'rejected') failures.push('Der aktuell geprüfte Fehlversuch muss weiterhin als rejected dokumentiert sein.');
if (manifest.status !== 'rejected') failures.push('Das aktuelle Render-Manifest muss weiterhin rejected sein.');
if (manifest.manualEvidence?.approvedByHuman !== false) failures.push('Der aktuelle Render darf keine menschliche Freigabe behaupten.');

for (const script of [
  'finance:full-animation-reel:quality-system',
  'finance:full-animation-reel:storyboard-quality',
  'finance:full-animation-reel:technical-validate',
  'finance:full-animation-reel:approval',
  'finance:full-animation-reel:validate',
]) {
  if (typeof packageJson.scripts?.[script] !== 'string') failures.push(`package.json enthält ${script} nicht.`);
}

const validate = packageJson.scripts?.['finance:full-animation-reel:validate'] ?? '';
for (const required of [
  'finance:full-animation-reel:storyboard-quality',
  'finance:full-animation-reel:technical-validate',
  'finance:full-animation-reel:approval',
]) {
  if (!validate.includes(required)) failures.push(`Der finale Validate-Befehl umgeht ${required}.`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`Narrative quality system check failed: ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Narrative quality system check passed.');
  console.log('Claude Code project memory loads the mandatory storyboard-first workflow.');
  console.log('The rejected reel remains blocked while a passing narrative reference plan is covered by tests.');
}
