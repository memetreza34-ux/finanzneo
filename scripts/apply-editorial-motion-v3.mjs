#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  EDITORIAL_MOTION_LOCK,
  EDITORIAL_MOTION_LIBRARY_ID,
  editorialMotionContractFields,
} from './lib/editorial-motion-contract.mjs';

const target=process.argv[2];
if(!target){
  console.error('Nutzung: node scripts/apply-editorial-motion-v3.mjs <Reel-Pfad>');
  process.exit(1);
}

const root=resolve(target);
const indexPath=resolve(root,'03-szenen/scene-index.json');
if(!existsSync(indexPath)){
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const read=(path)=>readFileSync(path,'utf8');
const write=(path,content)=>writeFileSync(path,content.endsWith('\n')?content:content+'\n','utf8');

const index=JSON.parse(read(indexPath));
index.phase1AnimationCode={
  ...(index.phase1AnimationCode??{}),
  ...editorialMotionContractFields(),
};

const animations=Array.isArray(index.scenes)?index.scenes.filter((scene)=>scene?.type==='animation'):[];

const heading='## FINANZNEO EDITORIAL MOTION V3';
const block=`
${heading}
MOTION_WORLD: ${EDITORIAL_MOTION_LOCK}
FINANCE_MOTION_LIBRARY: ${EDITORIAL_MOTION_LIBRARY_ID}
VISUAL_TARGET_WORLD: finanzneo-editorial-finance-v1
PREFERRED_IMPLEMENTATION: src/finance-motion/v3

V3 DESIGN PROCESS — BEFORE CODING
1. Spoken point verstehen.
2. Genau eine sichtbare Frage formulieren.
3. Drei unterschiedliche visuelle Konzepte entwickeln.
4. Stärkstes Konzept auswählen.
5. Vier Keyframes planen: 10% / 35% / 65% / 90%.
6. Motion-Grammatik wählen: DRAW / FOLLOW / REVEAL / SPLIT / MERGE / STACK / SHIFT / SWAP / EMPHASIZE / COUNT.
7. Erst danach animation.tsx bauen.

V3 QUALITY
- bewegte Editorial-Illustration statt animierter Dashboard-Karte
- wenige große Objekte
- 2D / leichtes 2.5D bevorzugt
- native Remotion-Geometrie und SVG-Pfade bevorzugt
- Kamera standardmäßig still
- Text nur unterstützend
- Resultat visuell stärker als Start
- mindestens 24 Frames Result-Hold anstreben

NICHT ALS DEFAULT
- chart-in-card
- UI-first composition
- PremiumPhysicalStage / Physical*
- glossy 3D coins / podiums
- neon / hologram
- particles / aurora / grids
- dauernde Kamera-Fahrten
- zusätzliche Motion ohne Informationswert

PREFERRED TOOLKIT
- src/finance-motion/v3
- @remotion/paths
- @remotion/shapes
- interpolate / spring / Easing
- @remotion/layout-utils wenn Text dynamisch gemessen werden muss
- @remotion/transitions nur zwischen echten Zuständen
- effects/motion-blur nur zurückhaltend

QA
Nach dem Build repräsentative Frames bei 10%, 35%, 65% und 90% prüfen.
Wenn die vier Frames wie UI-Screens statt wie eine visuelle Geschichte aussehen: redesign.
`;

for(const scene of animations){
  scene.animationVisualMotionLock=EDITORIAL_MOTION_LOCK;
  scene.motionDesignVersion='v3';
  scene.motionConceptCandidatesRequired=3;
  scene.motionKeyframeQa=[10,35,65,90];

  const plan=String(scene.planFile??'').replace(/^03-szenen\//,'');
  const remotionPath=resolve(root,'03-szenen',plan);
  if(!existsSync(remotionPath)){
    console.error('Remotion-Spezifikation fehlt: '+remotionPath);
    process.exit(1);
  }

  const current=read(remotionPath);
  if(!current.includes(heading)){
    write(remotionPath,current.trim()+'\n\n'+block.trim()+'\n');
  }
}

write(indexPath,JSON.stringify(index,null,2));

const overviewPath=resolve(root,'05-projektdateien/animationen.md');
if(existsSync(overviewPath)){
  const overview=read(overviewPath);
  if(!overview.includes(heading)){
    write(overviewPath,overview.trim()+'\n\n'+block.trim()+'\n');
  }
}

console.log('✓ Editorial Motion V3 angewendet.');
console.log('  3 Konzepte -> 4 Keyframes -> Motion Grammar -> Remotion Build -> Keyframe QA.');
console.log('  Preferred implementation: src/finance-motion/v3');
