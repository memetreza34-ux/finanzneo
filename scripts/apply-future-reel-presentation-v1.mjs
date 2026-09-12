#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-future-reel-presentation-v1.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-future-reel-presentation-v1';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const read = (path) => readFileSync(path, 'utf8');
const write = (path, content) => writeFileSync(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
const index = JSON.parse(read(indexPath));
const scenes = Array.isArray(index.scenes) ? index.scenes : [];

index.futurePresentationContract = {
  id: CONTRACT_ID,
  appliesToNewReelsOnly: true,
  legacyReelsUntouched: true,
  scene01CoverUsesTitleInsteadOfStandardHeader: true,
  scene01CaptionsForbidden: true,
  standardHeaderRequiredFromScene02: true,
  standardIconRequiredFromScene02: true,
  captionsRequiredFromScene02: true,
  captionsMustUseRealWordTimings: true,
  phase3CompositionMustMountAudio: true,
  phase3CompositionMustMountSceneHeader: true,
  phase3CompositionMustMountCaptions: true,
  renderedHeaderQaRequired: true,
  renderedCaptionQaRequired: true,
  imageMustFeelFrameFilling: true,
  smallSquareCardLookForbidden: true,
  minImageActivePixelRatio: 0.10,
  motionDiversityRequired: true,
  supportToolSwapDoesNotCountAsNewTechnique: true,
  exactMotionSignatureRepeatWithinPreviousFourForbiddenWithoutReason: true,
  sameHeroObjectFamilyMoreThanTwiceWithinPreviousFourForbiddenWithoutReason: true,
};

index.scenes = scenes.map((scene, position) => {
  const isCover = position === 0 && scene.id === 'scene-01';
  const next = {
    ...scene,
    presentation: isCover ? {
      coverTitleRequired: true,
      standardHeaderRequired: false,
      iconRequired: false,
      captionsRequired: false,
    } : {
      coverTitleRequired: false,
      standardHeaderRequired: true,
      iconRequired: true,
      captionsRequired: true,
    },
  };

  if (scene.type === 'animation' && !scene.motionDesign) {
    next.motionDesign = {
      viewerChange: '[EINFÜGEN — was der Zuschauer nach dieser Animation sichtbar verstanden hat]',
      visualMode: '[EINFÜGEN — pure-remotion | svg | data | physical | typography | spatial | hybrid | other]',
      visualTechniqueId: '[EINFÜGEN — eindeutige Haupttechnik als slug]',
      compositionFamilyId: '[EINFÜGEN — visuelle Familie als slug]',
      heroObjectFamily: '[EINFÜGEN — dominierende sichtbare Objektfamilie als slug]',
      primaryAction: '[EINFÜGEN — konkrete sichtbare Hauptaktion, nicht nur Kamera oder Support-Asset]',
      motionSignature: {
        camera: '[EINFÜGEN — z. B. static-close, push-in, orbit, top-down]',
        layout: '[EINFÜGEN — z. B. single-hero, split, timeline, field, layered-depth]',
        transformation: '[EINFÜGEN — z. B. grow, redistribute, replace, compress, reveal]',
      },
      supportTools: [],
      repetitionJustification: 'none',
    };
  }

  return next;
});

write(indexPath, JSON.stringify(index, null, 2));

const projectDir = resolve(root, '05-projektdateien');
mkdirSync(projectDir, {recursive: true});
write(resolve(projectDir, 'future-reel-presentation-v1.md'), `# Future Reel Presentation V1\n\nFUTURE_REEL_PRESENTATION: ${CONTRACT_ID}\n\nDiese Regeln gelten nur für neue Reels ab diesem Vertrag.\n\n## Feste Zuschauer-Hierarchie\n- scene-01: Hero-Bild + exakter Reel-Titel; kein Standard-Header, kein Icon, keine Caption.\n- ab scene-02: jede Szene rendert oben den normalen FinanzNeo-SceneHeader mit passendem Icon.\n- ab scene-02: echte audio-synchrone Captions sind Pflicht. Leere word-timings oder nur vorhandene Caption-Metadaten reichen nicht.\n- Hauptvisual bleibt zwischen Header und Caption klar groß; ein kleines Quadrat in viel Schwarz gilt als Fehler.\n\n## Motion-Diversität\n- Eine andere MECHANIC_ID allein macht noch keine neue Animation.\n- Kamera + Layout + Transformation bilden die sichtbare Motion-Signatur.\n- Gleiche Signatur innerhalb der vorherigen vier Animationsszenen braucht eine konkrete inhaltliche Begründung.\n- Dieselbe dominierende Objektfamilie darf innerhalb der vorherigen vier Animationsszenen nicht mehr als zweimal die Hauptsprache sein, außer ein Vergleich verlangt es ausdrücklich.\n- Lottie, Icons und SVG-Support zählen nicht als neue Haupttechnik, wenn Hauptlayout und Hauptaktion gleich bleiben.\n- Komplexe Finanzthemen dürfen technisch aufwendig sein; sichtbar sollen sie einfacher werden.\n\n## Strukturreferenz\nAls Strukturreferenz darf src/reels/einlagensicherung-100000/EinlagensicherungReel.tsx gelesen werden: Visual in der Mitte, SceneHeader pro normaler Szene, globale audio-synchrone Captions. Nur die Struktur übernehmen, NICHT den alten Hintergrund oder Legacy-Look.\n`);

const append = (relativePath, heading, body) => {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) return;
  const current = read(path);
  if (current.includes(`FUTURE_REEL_PRESENTATION: ${CONTRACT_ID}`)) return;
  write(path, `${current.trim()}\n\n## ${heading}\n\nFUTURE_REEL_PRESENTATION: ${CONTRACT_ID}\n\n${body}\n`);
};

append(
  '05-projektdateien/animationen.md',
  'Future Reel Presentation V1',
  'Animationen müssen sich sichtbar unterscheiden, nicht nur technisch. Pro Animationsszene motionDesign vollständig ausfüllen: viewerChange, visualMode, visualTechniqueId, compositionFamilyId, heroObjectFamily, primaryAction sowie camera/layout/transformation. Lottie/Icons/SVG-Support zählt nicht als neue Haupttechnik, wenn die sichtbare Hauptmechanik gleich bleibt.',
);
append(
  '05-projektdateien/ANTIGRAVITY-AUFTRAG.md',
  'Future Reel Presentation V1',
  'Ab scene-02 MUSS die echte Composition den normalen SceneHeader inklusive Icon und die globalen audio-synchronen Captions rendern. Scene-01 bleibt Cover-Sonderfall. Vor Render prüfen, dass echte word-timings vorhanden sind. Hauptvisuals groß in der Visualzone halten; kein kleines Quadrat in viel Schwarz. Strukturreferenz: src/reels/einlagensicherung-100000/EinlagensicherungReel.tsx nur für Header/Visual/Captions-Hierarchie, nicht für Legacy-Hintergrund. Motion-Design aus Phase 1 nicht durch ähnliche Account/Rechnung/Münzen-Varianten vereinheitlichen.',
);

console.log(`✓ Future Reel Presentation gesetzt: ${CONTRACT_ID}`);
console.log('  scene-01 = Cover-Sonderfall · ab scene-02 Header+Icon+echte Captions Pflicht.');
console.log('  Kleine Quadrat-Visuals und nur technisch verschiedene Wiederholungsanimationen werden künftig blockiert.');
