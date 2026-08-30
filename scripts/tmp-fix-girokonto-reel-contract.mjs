#!/usr/bin/env node

import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = 'reels/2026-08-31_bis_2026-09-06/montag/reel-01_girokonto-oder-tagesgeld';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));

const labels = {
  'scene-01':['Girokonto','Tagesgeld'],
  'scene-02':['Girokonto','Gehalt','Miete'],
  'scene-04':['Tagesgeld','Rücklage'],
  'scene-05':['Notgroschen','Später'],
  'scene-07':['Tagesgeld','Zinsen'],
  'scene-08':['Girokonto','Tagesgeld'],
};

const visualExplanations = {
  'scene-01':'The viewer must immediately understand without narration that the Girokonto serves moving everyday money while the Tagesgeld holds money aside for later. Make the relationship visually clear through physical placement: daily-payment objects belong visibly to the Girokonto side, while the reserve stays calm and separate on the Tagesgeld side. This is a real-life cause-and-purpose comparison, not a symbolic split-screen infographic.',
  'scene-02':'Make the cause and effect immediately understandable without narration: salary visibly arrives at the Girokonto, while rent and everyday spending visibly belong to the same active money area. The viewer should clearly recognize that this account is continuously used for normal incoming and outgoing payments. Keep the arrangement as one believable real-life situation rather than separate finance cards or UI tiles.',
  'scene-04':'The viewer must immediately understand without narration that this money is intentionally parked for later but still reachable. Show the reserve physically resting instead of circulating through shopping or bills, while the access cue remains simple and believable. The relationship should clearly read as “set aside, but available” inside one real-world-grounded stylized 3D situation, not as an abstract savings diagram.',
  'scene-05':'Make the meaning obvious without narration: both concrete future needs are visibly funded from the same separated Tagesgeld reserve, while no everyday checkout or bill-payment action touches it. The viewer should immediately recognize why this money is being kept aside. Use a coherent real-life planning situation with physical objects and visible purpose, never a row of generic finance cards.',
  'scene-07':'The viewer must immediately understand without narration that the small additional money represents interest added to the existing Tagesgeld reserve. Keep the extra amount visibly secondary to the saved money so the scene never implies guaranteed high returns. The cause-and-effect relationship is simple: money is parked on Tagesgeld and a modest amount labeled “Zinsen” is added, with no fixed percentage or promise.',
  'scene-08':'Make the relationship immediately understandable without narration: the grocery purchase is physically completed through the Girokonto-linked payment, while the Tagesgeld reserve stays outside the payment action. The viewer should clearly recognize that normal shopping uses the everyday account and does not directly spend from the reserve. Keep this as one believable real-life checkout situation rather than a prohibition icon or comparison dashboard.',
};

index.scenes = index.scenes.map((scene) => labels[scene.id]
  ? {...scene, objectLabels: labels[scene.id]}
  : scene);
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

for (const [sceneId, explanation] of Object.entries(visualExplanations)) {
  const promptPath = resolve(root, `03-szenen/EINZELNE-SZENEN/${sceneId}/bildprompt.txt`);
  let prompt = readFileSync(promptPath, 'utf8');
  const marker = '\n\nFINANZNEO_WORLD_ID:';
  if (!prompt.includes(explanation)) {
    if (!prompt.includes(marker)) throw new Error(`${sceneId}: FINANZNEO marker missing`);
    prompt = prompt.replace(marker, `\n\n${explanation}${marker}`);
  }
  writeFileSync(promptPath, prompt, 'utf8');
}

const coverPath = resolve(root, '03-szenen/00-cover/cover.txt');
const cover = `COVER = SZENE 01 — KEIN SEPARATER BILDJOB\n\nDie erste Reel-Szene ist automatisch das Cover. Google Flow darf KEIN separates Cover erzeugen und KEIN Bild 00 erzeugen. Für Reel und Cover wird exakt dieselbe fertige Datei aus scene-01 verwendet.\n\nSOURCE_SCENE_ID: scene-01\nGOOGLE FLOW – FINALER DATEINAME:\nBild 01 - Zwei Konten zwei Aufgaben.png\n\nEXACT SHORT GERMAN OBJECT LABELS:\n- Girokonto\n- Tagesgeld\n\nIMAGE PROMPT:\nThis file is a technical alias only and must never start a second image-generation job. The canonical cover is exactly the final scene-01 image unchanged. It shows a real-life, real-world-grounded stylized 3D everyday finance situation with two visibly different jobs for money: the Girokonto is connected to ordinary daily-payment objects, while the Tagesgeld reserve stays physically separate and calm for later. The viewer must immediately understand without narration that one account handles everyday money movement and the other holds a reserve. Preserve the exact scene-01 composition, proportions, materials, object labels and cause-and-purpose relationship. Do not redesign, recrop into a different concept or replace the real situation with symbols.\n\nFINANZNEO_WORLD_ID: finanzneo-connected-studio-v3\nFINANZNEO_SERIES_LOCK: finanzneo-same-world-v1\nPREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9\nGENERATED_IMAGE_ASPECT_RATIO: 1:1\n\nSTYLE:\nKeep the exact scene-01 premium real-world-grounded stylized 3D visual language. Recognizable everyday proportions, polished materials and soft rounded construction; never photorealistic and never an icon pack.\n\nBACKGROUND:\nUse the exact same seamless deep black background as scene-01. Keep it clean, minimal and uninterrupted.\n\nCOMPOSITION:\nThe visual explanation must remain readable in 1–2 seconds: Girokonto for today's everyday payments, Tagesgeld as separated reserve money for later.\n\nFORBIDDEN:\nNo separate cover generation, no Bild 00, no photorealism, no dashboard, no app UI, no flowchart, no abstract symbol-only replacement and no decorative clutter.\n`;
writeFileSync(coverPath, cover, 'utf8');

const masterPath = resolve(root, '03-szenen/alle-bildprompts.txt');
let master = readFileSync(masterPath, 'utf8');
const coverGuard = 'COVER = SZENE 01\nKEIN separates Cover erzeugen.\nKEIN Bild 00 erzeugen.\nDie finale scene-01-Datei ist gleichzeitig das Cover.\n\n';
if (!/COVER = SZENE 01/i.test(master)) master = coverGuard + master;
if (!master.includes('03-szenen/00-ALLE-BILDER-HIER-REIN/')) {
  master += '\nFINALER BILDERORDNER:\n03-szenen/00-ALLE-BILDER-HIER-REIN/\nAlle sechs fertig geprüften Einzelbilder werden ausschließlich dort gesammelt.\n';
}
writeFileSync(masterPath, master, 'utf8');

console.log('✓ Reel-Vertragsdetails und alle sechs V9-Szenenprompts produktionsreif nachgeschärft.');
