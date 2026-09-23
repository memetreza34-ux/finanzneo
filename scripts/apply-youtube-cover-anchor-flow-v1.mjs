#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  COVER_ANCHOR_BLOCK_SIZE,
  COVER_ANCHOR_FLOW_ID,
  assignCoverAnchorSlots,
} from './lib/cover-anchor-flow-v1.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-youtube-cover-anchor-flow-v1.mjs <YouTube-Projekt>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '04-visuals/visual-index.json');
if (!existsSync(indexPath)) {
  console.error('04-visuals/visual-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const visuals = Array.isArray(index.visuals) ? index.visuals : [];
const imageVisuals = visuals.filter((visual) => typeof visual?.googleFlowFileName === 'string' && visual.googleFlowFileName.trim());
if (imageVisuals.length === 0) {
  console.log('✓ YouTube-Projekt ohne Bildvisuals; Cover Anchor Flow übersprungen.');
  process.exit(0);
}
if (imageVisuals[0]?.id !== 'visual-01') {
  console.error('Cover Anchor Flow verlangt visual-01 als erstes bildbasiertes Video-Visual.');
  process.exit(1);
}

const anchor = imageVisuals[0];
const assignments = new Map(assignCoverAnchorSlots(imageVisuals.map((visual) => ({id: visual.id}))).map((item) => [item.sceneId, item]));
const outputDir = String(index.googleFlow?.finalCollectionDirectory ?? '04-visuals/00-ALLE-BILDER-HIER-REIN').replace(/\/$/, '');
index.coverAnchorFlow = {
  id: COVER_ANCHOR_FLOW_ID,
  sourceVisualId: anchor.id,
  sourceFileName: anchor.googleFlowFileName,
  blockSize: COVER_ANCHOR_BLOCK_SIZE,
  firstVisualIsMasterAnchor: true,
  anchorMustPassQaBeforeOtherGeneratedImages: true,
  anchorRequiresExplicitUserApproval: true,
  followupsMustUseApprovedAnchorImageReference: true,
  planningOccursInFiveImageBlocks: true,
  followupBlocksAutoRunAfterUserApproval: true,
  noFurtherUserConfirmationInsideFollowupBlocks: true,
  automaticallyAdvanceToNextFollowupBlock: true,
  generationRemainsStrictSingleJob: true,
  renameImmediatelyAfterEachImage: true,
  unifiedOutputDirectory: outputDir,
  thumbnailIsSeparatePublishingAsset: true,
  thumbnailMayUseApprovedAnchorForArtDirection: true,
  onlyVisual01MayBePersistentGenerationReference: true,
};

for (const visual of imageVisuals) {
  const assignment = assignments.get(visual.id);
  visual.coverAnchor = {
    role: assignment.role,
    referenceFile: anchor.googleFlowFileName,
    block: assignment.block,
    blockSlot: assignment.slot,
  };
}
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

const masterDnaPlaceholder = `COVER_ANCHOR_VISUAL_DNA: [EINFÜGEN — präzise Art-Direction-DNA: Formensprache, Abstraktionsgrad, Stimmung]\nCOVER_ANCHOR_CHARACTER_LANGUAGE: [EINFÜGEN — Gesichter, Körper, Kleidung, Ausdruck]\nCOVER_ANCHOR_ENVIRONMENT_LANGUAGE: [EINFÜGEN — Raum-/Umgebungsdarstellung]\nCOVER_ANCHOR_MATERIAL_LANGUAGE: [EINFÜGEN — Materialien, Kanten, Oberflächen]\nCOVER_ANCHOR_LIGHTING_LANGUAGE: [EINFÜGEN — Lichtcharakter und Schatten]\nCOVER_ANCHOR_COLOR_LANGUAGE: [EINFÜGEN — neutrale Basis + FinanzNeo-Akzentrollen]\nCOVER_ANCHOR_TEXTURE_LANGUAGE: [EINFÜGEN — Texturgrad und Detaildichte]\nCOVER_ANCHOR_QUALITY_BAR: [EINFÜGEN — sichtbare Serienqualität]`;

const directiveFor = (visual) => {
  const assignment = assignments.get(visual.id);
  if (assignment.role === 'MASTER') {
    return `COVER_ANCHOR_FLOW: ${COVER_ANCHOR_FLOW_ID}\nCOVER_ANCHOR_ROLE: MASTER\nCOVER_ANCHOR_REFERENCE_FILE: ${anchor.googleFlowFileName}\nCOVER_ANCHOR_BLOCK: 0\nCOVER_ANCHOR_BLOCK_SLOT: 0\n${masterDnaPlaceholder}\n\nMASTER ANCHOR DIRECTIVE:\nThis first video visual is the canonical art-direction reference for every later generated image in this video. Describe and render it with unusually high specificity. Establish the exact character abstraction, geometry, materials, textures, lighting character, palette treatment, environment rendering and finish quality that later images must inherit. After generation and internal QA, STOP and wait for the user's explicit approval of the actual visual (for example: \"sieht gut aus\", \"passt\" or an equivalent clear approval). QA PASS alone is not enough. Only QA PASS plus explicit user approval may create APPROVED_COVER_ANCHOR. Do not generate any later visual or thumbnail before this approval. Do not create a collage or style sheet.`;
  }
  return `COVER_ANCHOR_FLOW: ${COVER_ANCHOR_FLOW_ID}\nCOVER_ANCHOR_ROLE: FOLLOWUP\nCOVER_ANCHOR_REFERENCE_FILE: ${anchor.googleFlowFileName}\nCOVER_ANCHOR_BLOCK: ${assignment.block}\nCOVER_ANCHOR_BLOCK_SLOT: ${assignment.slot}\n\nANCHOR REFERENCE DIRECTIVE:\nThis follow-up is allowed only after visual-01 has QA PASS and explicit user approval. After that one approval, follow-up blocks run autonomously without asking the user between images. Before generating this visual, use the user-approved ${anchor.googleFlowFileName} as the direct visual reference/template. Match its art-direction DNA — character design language, face abstraction, geometry, materials, textures, lighting character, color treatment, environment rendering and finish quality — while preserving this visual's own subject, camera, composition and script meaning. Do not copy the anchor's scene content.`;
};

const injectBeforePrompt = (source, directive) => {
  if (source.includes(`COVER_ANCHOR_FLOW: ${COVER_ANCHOR_FLOW_ID}`)) return source;
  const marker = 'IMAGE PROMPT:';
  const idx = source.indexOf(marker);
  if (idx === -1) return `${directive}\n\n${source}`;
  return `${source.slice(0, idx)}${directive}\n\n${source.slice(idx)}`;
};

for (const visual of imageVisuals) {
  const promptFile = visual.imagePlanFile ?? visual.planFile;
  if (typeof promptFile !== 'string') continue;
  const path = resolve(root, promptFile);
  if (!existsSync(path)) continue;
  writeFileSync(path, injectBeforePrompt(readFileSync(path, 'utf8'), directiveFor(visual)), 'utf8');
}

const masterPath = resolve(root, '04-visuals/alle-bildprompts.txt');
if (existsSync(masterPath)) {
  let master = readFileSync(masterPath, 'utf8');
  const header = `COVER ANCHOR FLOW V1 — EXECUTION ORDER OVERRIDE\nCOVER_ANCHOR_FLOW: ${COVER_ANCHOR_FLOW_ID}\nMASTER_ANCHOR: visual-01 / ${anchor.googleFlowFileName}\nFOLLOWUP_PLAN_BLOCK_SIZE: ${COVER_ANCHOR_BLOCK_SIZE}\nUNIFIED_OUTPUT_DIRECTORY: ${outputDir}/\nMANUAL_GATE: explicit-user-approval-after-visual-01\nFOLLOWUP_AUTORUN_AFTER_APPROVAL: true\n\n1. Generate visual-01 FIRST and ALONE, even if the thumbnail block appears earlier in this file.\n2. Rename it immediately and run internal QA on its real pixels.\n3. Then STOP completely. Do not generate any later visual or thumbnail. Wait for the user's explicit approval of the actual visual-01, e.g. \"sieht gut aus\" or \"passt\".\n4. Only after QA PASS + explicit user approval mark visual-01 as APPROVED_COVER_ANCHOR.\n5. Use this approved visual-01 file as the direct visual reference for the thumbnail and all later image visuals.\n6. From now on do not ask the user for further approvals. Organize later image visuals in working blocks of at most ${COVER_ANCHOR_BLOCK_SIZE} and process them automatically.\n7. A 5-image block is NOT parallel generation: generate only ONE image at a time, wait, rename immediately, QA, then automatically continue to the next image.\n8. After one 5-image block is complete, automatically start the next block until all image visuals are finished.\n9. Keep every final image together in ${outputDir}/.\n10. The anchor controls art direction, not the later scene's subject/camera/composition.\n\n`;
  if (!master.includes(`COVER ANCHOR FLOW V1 — EXECUTION ORDER OVERRIDE`)) master = `${header}${master}`;
  for (const visual of imageVisuals) {
    const fileIndex = master.indexOf(visual.googleFlowFileName);
    if (fileIndex === -1) continue;
    const promptIndex = master.indexOf('IMAGE PROMPT:', fileIndex);
    if (promptIndex === -1) continue;
    const directive = directiveFor(visual);
    if (master.slice(fileIndex, promptIndex).includes(`COVER_ANCHOR_ROLE:`)) continue;
    master = `${master.slice(0, promptIndex)}${directive}\n\n${master.slice(promptIndex)}`;
  }
  writeFileSync(masterPath, master, 'utf8');
}

const thumbnailPath = resolve(root, '04-visuals/thumbnail-prompt.txt');
if (existsSync(thumbnailPath)) {
  let thumbnail = readFileSync(thumbnailPath, 'utf8');
  if (!thumbnail.includes(`COVER_ANCHOR_FLOW: ${COVER_ANCHOR_FLOW_ID}`)) {
    thumbnail = `COVER_ANCHOR_FLOW: ${COVER_ANCHOR_FLOW_ID}\nTHUMBNAIL_REFERENCE_FILE: ${anchor.googleFlowFileName}\nGenerate visual-01 first and STOP after its internal QA. Only after the user explicitly approves the actual visual-01 may that image be used as the thumbnail's art-direction reference. Do not copy its composition or subject unless the thumbnail brief requires it.\n\n${thumbnail}`;
    writeFileSync(thumbnailPath, thumbnail, 'utf8');
  }
}

const planDir = resolve(root, '06-projektdateien');
mkdirSync(planDir, {recursive: true});
const rows = imageVisuals.map((visual) => {
  const assignment = assignments.get(visual.id);
  return `| ${visual.id} | ${assignment.role} | ${assignment.block} | ${assignment.slot} | ${visual.googleFlowFileName} |`;
});
writeFileSync(resolve(planDir, 'COVER-ANCHOR-PLAN.md'), `# YouTube Cover Anchor Flow V1\n\n- \`visual-01\` ist der visuelle Master-Anchor des Videos und wird zuerst allein erzeugt.\n- Nach interner QA MUSS der Ablauf stoppen und auf eine ausdrückliche Nutzerfreigabe des echten visual-01 warten, z. B. \"sieht gut aus\".\n- Erst QA-PASS + Nutzerfreigabe ergeben APPROVED_COVER_ANCHOR.\n- Danach laufen Thumbnail und weitere Bildvisuals ohne weitere Nutzerstopps automatisch in 5er-Arbeitsblöcken weiter.\n- Innerhalb eines 5er-Blocks bleibt die Generierung strikt einzeln: Bild → warten → sofort umbenennen → QA → automatisch nächstes Bild.\n- Nach einem fertigen 5er-Block beginnt automatisch der nächste, bis alle Bildvisuals fertig sind.\n- Jedes Folge-Bild verwendet ausschließlich das vom Nutzer freigegebene visual-01 als persistente Art-Direction-Referenz.\n- Alle finalen Bilder liegen gemeinsam in \`${outputDir}/\`.\n\n| Visual | Rolle | 5er-Block | Slot | Datei |\n|---|---|---:|---:|---|\n${rows.join('\n')}\n`, 'utf8');

console.log(`✓ YouTube Cover Anchor Flow gesetzt: ${COVER_ANCHOR_FLOW_ID}`);
console.log(`✓ visual-01 = Master-Referenz: ${anchor.googleFlowFileName}`);
console.log('✓ Nach visual-01-QA: einmaliger manueller Nutzer-Gate bis zur ausdrücklichen Freigabe.');
console.log(`✓ Danach Folge-Bilder automatisch in ${COVER_ANCHOR_BLOCK_SIZE}er-Blöcken; Generierung weiterhin strikt einzeln.`);
