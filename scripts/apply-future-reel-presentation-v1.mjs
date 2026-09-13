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
const coverCaptionsFollowSpeech = index.coverHookContract?.id === 'finanzneo-cover-hook-v3';

index.futurePresentationContract = {
  id: CONTRACT_ID,
  appliesToNewReelsOnly: true,
  legacyReelsUntouched: true,
  scene01CoverUsesTitleInsteadOfStandardHeader: true,
  ...(coverCaptionsFollowSpeech
    ? {scene01CaptionsFollowSpeech: true, captionlessSpokenAudioForbidden: true}
    : {scene01CaptionsForbidden: true}),
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
      captionsRequired: coverCaptionsFollowSpeech,
      captionsFollowVoiceover: coverCaptionsFollowSpeech,
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
      visualMode: '[EINFÜGEN — pure-remotion | svg | data | physical | typography | spatial | other]',
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
write(resolve(projectDir, 'future-reel-presentation-v1.md'), `# Future Reel Presentation V1\n\nFUTURE_REEL_PRESENTATION: ${CONTRACT_ID}\n\n## Feste Zuschauer-Hierarchie\n- scene-01: Hero-Bild + exakter Reel-Titel; kein Standard-SceneHeader und kein Header-Icon.\n- Bei Cover-Hook V3 laufen echte audio-synchrone Captions bereits ab dem ersten gesprochenen Wort in scene-01. Gesprochenes Audio ohne Captions ist verboten.\n- ab scene-02: normaler SceneHeader + passendes Icon + echte audio-synchrone Captions.\n- Hauptvisual bleibt zwischen Header und Caption klar groß; ein kleines Quadrat in viel Schwarz gilt als Fehler.\n\n## Motion-Diversität\n- Eine andere MECHANIC_ID allein macht noch keine neue Animation.\n- Kamera + Layout + Transformation bilden die geplante Motion-Signatur; zusätzlich prüft der Source-Diversity-Guard die tatsächlich verwendeten TSX-Hauptobjekte.\n- Lottie, Icons und SVG-Support zählen nicht als neue Haupttechnik, wenn Hauptlayout und Hauptaktion gleich bleiben.\n- Komplexe Finanzthemen dürfen technisch aufwendig sein; sichtbar sollen sie einfacher werden.\n`);

const append = (relativePath, heading, body) => {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) return;
  const current = read(path);
  if (current.includes(`FUTURE_REEL_PRESENTATION: ${CONTRACT_ID}`)) return;
  write(path, `${current.trim()}\n\n## ${heading}\n\nFUTURE_REEL_PRESENTATION: ${CONTRACT_ID}\n\n${body}\n`);
};

append('05-projektdateien/animationen.md', 'Future Reel Presentation V1', 'Animationen müssen sich sichtbar unterscheiden, nicht nur technisch. motionDesign vollständig ausfüllen; die tatsächlichen TSX-Hauptobjekte werden zusätzlich durch den Source-Diversity-Guard geprüft.');
append('05-projektdateien/ANTIGRAVITY-AUFTRAG.md', 'Future Reel Presentation V1', 'Scene-01 bleibt Cover-Sonderfall ohne normalen Header/Icon. Bei Cover-Hook V3 starten globale audio-synchrone Captions mit dem ersten gesprochenen Wort. Ab scene-02 sind SceneHeader+Icon+Captions Pflicht. Hauptvisuals groß halten; keine ähnlichen Standard-Objektkompositionen für verschiedene Animationen.');

console.log(`✓ Future Reel Presentation gesetzt: ${CONTRACT_ID}`);
console.log(coverCaptionsFollowSpeech ? '  scene-01: Cover-Titel + Captions ab erstem gesprochenen Wort.' : '  scene-01: Legacy-Cover ohne Captions.');
