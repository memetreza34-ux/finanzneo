#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {V5_CONTRACT_ID, V5_HARDENING_ID} from './lib/image-storytelling-v5-hardening.mjs';
import {V5_STAGING_ID} from './lib/image-storytelling-v5-staging.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-future-image-storytelling-v5-staging.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const contract = index.imageStorytellingContract;
if (contract?.id !== V5_CONTRACT_ID || contract?.hardeningId !== V5_HARDENING_ID) {
  console.log('✓ Kein gehärtetes V5-Reel; V5.1-Staging wird nicht angewendet.');
  process.exit(0);
}

Object.assign(contract, {
  stagingId: V5_STAGING_ID,
  dynamicStagingRequired: true,
  frameOccupancyRequired: true,
  explicitCauseEffectQuotaRequired: true,
  humanReactionRequired: true,
  spatialPressureRequired: true,
  impactCompositionQuotaRequired: true,
  catalogArrangementForbidden: true,
  minExplicitCauseEffectPerSixImages: 3,
  maxImagesWithoutImpactComposition: 3,
  minDistinctStagingModesPerSixImages: 3,
});

Object.assign(index.visualSequencePlan?.rules ?? {}, {
  dynamicStagingRequired: true,
  minExplicitCauseEffectPerSixImages: 3,
  maxImagesWithoutImpactComposition: 3,
  minDistinctStagingModesPerSixImages: 3,
  blackWorldMustNotBecomeDeadSpace: true,
  activeCauseEffectPreferredOverObjectDisplay: true,
});

const imageScenes = (Array.isArray(index.scenes) ? index.scenes : []).filter((scene) => scene?.type === 'image');
for (const scene of imageScenes) {
  const meta = scene.imageStorytelling ?? {};
  Object.assign(meta, {
    frameOccupancyClass: '[EINFÜGEN — tight / balanced / environmental]',
    stagingMode: '[EINFÜGEN — active-collision / active-use / environmental-action / comparison-action / reveal / payoff-action]',
    causeEffectStrength: '[EINFÜGEN — explicit / implied]',
    humanReaction: '[EINFÜGEN — none / pressured / concerned / surprised / decisive / relieved / neutral-justified]',
    humanReactionJustification: '[EINFÜGEN — none; nur bei neutral-justified konkrete Begründung]',
    spatialPressure: '[EINFÜGEN — foreground-dominant / subject-dominant / environmental-depth / balanced-depth]',
    impactComposition: '[EINFÜGEN — none / extreme-close-up / strong-pov / low-angle-scale / foreground-blocking / environment-wide / reveal]',
  });
  scene.imageStorytelling = meta;
}
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const planning = `FRAME_OCCUPANCY_CLASS: [EINFÜGEN — tight / balanced / environmental]\nSTAGING_MODE: [EINFÜGEN — active-collision / active-use / environmental-action / comparison-action / reveal / payoff-action]\nCAUSE_EFFECT_STRENGTH: [EINFÜGEN — explicit / implied]\nHUMAN_REACTION: [EINFÜGEN — none / pressured / concerned / surprised / decisive / relieved / neutral-justified]\nHUMAN_REACTION_JUSTIFICATION: [EINFÜGEN — none; nur bei neutral-justified konkrete Begründung]\nSPATIAL_PRESSURE: [EINFÜGEN — foreground-dominant / subject-dominant / environmental-depth / balanced-depth]\nIMPACT_COMPOSITION: [EINFÜGEN — none / extreme-close-up / strong-pov / low-angle-scale / foreground-blocking / environment-wide / reveal]`;

const policy = `IMAGE_STORYTELLING_STAGING: ${V5_STAGING_ID}\n\nV5.1 DYNAMIC STAGING — VERBINDLICH:\n- FinanzNeo V9 bleibt unverändert. V5.1 verändert ausschließlich Inszenierung, Bildraum, Handlung und sichtbare Ursache/Wirkung.\n- Keine Black-Stage-Showcases mit kleinem Motiv in viel leerem Schwarz. Deep Black bleibt die Welt, aber Hauptaktion oder sinnvoller lokaler Kontext müssen den Frame aktiv tragen.\n- FRAME_OCCUPANCY_CLASS wird bewusst gewählt: tight für dominante Nahwirkung, balanced für Aktion plus Kontext, environmental für echte räumliche Szene, die ins Schwarz ausläuft.\n- STAGING_MODE darf nie Katalog-Anordnung sein. Gegenstände werden benutzt, kollidieren, verdrängen, blockieren, schrumpfen, wachsen, wiederkehren oder erzeugen sichtbar eine Konsequenz.\n- In jedem vollständigen 6-IMAGE-Fenster müssen mindestens 3 Szenen CAUSE_EFFECT_STRENGTH=explicit haben; bei 4–5 IMAGE-Szenen mindestens 2.\n- HUMAN_REACTION ist bei sichtbaren Menschen/Händen Pflicht. Reaktion über Körperhaltung, Hände und Gesicht lesbar machen, aber nicht melodramatisch. neutral-justified braucht eine konkrete Begründung. Bei HUMAN_PRESENCE=none gilt HUMAN_REACTION=none.\n- SPATIAL_PRESSURE nutzt Vordergrund, Nähe, Überdeckung und Tiefenstaffelung bewusst. Nicht alle Erklärgegenstände sauber nebeneinander aufstellen.\n- In jedem gleitenden Fenster aus 4 IMAGE-Szenen braucht mindestens eine Szene eine echte IMPACT_COMPOSITION: extreme-close-up, strong-pov, low-angle-scale, foreground-blocking, environment-wide oder reveal.\n- In jedem vollständigen 6-IMAGE-Fenster mindestens 3 unterschiedliche STAGING_MODE-Werte; bei 4–5 Bildern ebenfalls mindestens 3 über die gesamte Folge.\n- Umweltkontext darf Küche, Supermarkt, Garage, Flur, Arbeitsplatz, Werkstatt, Bahnsteig, Straße oder andere reale Orte zeigen, wenn er die Aussage stärkt. Er muss weiterhin organisch in die Deep-Black-Welt übergehen.\n- Der finale Flow-Prompt muss diese V5.1-Regie über den bestehenden Prompt-Compiler direkt enthalten.\n- Nach Flow prüft die bestehende Vision-QA zusätzlich Studio-Showcase, geordnete Katalog-Anordnung, schwache Cause/Effect-Handlung, schwache Human Reaction und dominanten leeren Schwarzraum.`;

const stagePrompt = (source) => {
  let next = source.replace(/^(FRAME_OCCUPANCY_CLASS|STAGING_MODE|CAUSE_EFFECT_STRENGTH|HUMAN_REACTION|HUMAN_REACTION_JUSTIFICATION|SPATIAL_PRESSURE|IMPACT_COMPOSITION):.*\r?\n?/gm, '');
  next = next.replace(/(^|\n)IMAGE PROMPT:/g, `$1${planning}\n\nIMAGE PROMPT:`);
  if (!next.includes(`IMAGE_STORYTELLING_STAGING: ${V5_STAGING_ID}`)) next += `\n\n${policy}\n`;
  return next;
};

const updatePromptFile = (relativePath) => {
  const path = relativePath.startsWith('EINZELNE-SZENEN/') ? resolve(root, '03-szenen', relativePath) : resolve(root, relativePath);
  if (!existsSync(path)) return;
  writeFileSync(path, stagePrompt(readFileSync(path, 'utf8')), 'utf8');
};

for (const scene of imageScenes) if (typeof scene.planFile === 'string') updatePromptFile(scene.planFile);
updatePromptFile('03-szenen/00-cover/cover.txt');
updatePromptFile('03-szenen/alle-bildprompts.txt');

for (const relativePath of ['03-szenen/bildwelt.txt', '05-projektdateien/szenenplan.md', '05-projektdateien/ANTIGRAVITY-AUFTRAG.md', '05-projektdateien/VISUAL-SEQUENCE-PLAN.md']) {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) continue;
  let source = readFileSync(path, 'utf8');
  if (!source.includes(`IMAGE_STORYTELLING_STAGING: ${V5_STAGING_ID}`)) source += `\n\n${policy}\n`;
  writeFileSync(path, source, 'utf8');
}

console.log(`✓ V5.1 Dynamic Staging gesetzt: ${V5_STAGING_ID}`);
console.log('✓ Neue Reels planen Frame-Füllung, aktive Inszenierung, Cause/Effect, Human Reaction, Spatial Pressure und Impact Composition bewusst.');
console.log('✓ V9-Bildwelt bleibt unverändert. Nach finaler Planung weiterhin reel:image-prompts:compile ausführen.');
