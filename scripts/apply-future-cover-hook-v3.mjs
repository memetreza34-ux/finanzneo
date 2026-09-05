#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-future-cover-hook-v3.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-cover-hook-v3';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const scenes = Array.isArray(index.scenes) ? index.scenes : [];
const first = scenes[0];
if (!first || first.id !== 'scene-01' || first.type !== 'image') {
  console.error('Cover-Hook V3 verlangt scene-01 als Bildszene.');
  process.exit(1);
}

const title = String(index.title ?? '').trim();
if (!title) {
  console.error('scene-index.title fehlt; Cover-Hook V3 braucht eine starke Cover-Hook-Headline.');
  process.exit(1);
}

index.coverHookContract = {
  id: CONTRACT_ID,
  appliesToNewReelsOnly: true,
  sourceSceneId: 'scene-01',
  scene01IsCover: true,
  scene01IsFirstContentBeat: true,
  dedicatedCoverOnlySceneForbidden: true,
  zeroPointOneSecondCoverOnlyIntroForbidden: true,
  standaloneCoverSceneForbidden: true,
  standaloneCoverRequired: false,
  coverSnapshotFrame: 0,
  dedicatedCoverHoldFrames: 0,
  voiceoverRequiredInScene01: true,
  voiceoverStartsInScene01: true,
  hookRequiredAtFirstSpokenWord: true,
  genericIntroForbidden: true,
  concreteTopicAnchorRequired: true,
  allowedHookForms: ['question', 'claim', 'problem', 'warning', 'contrast', 'number'],
  coverTitleMustFunctionAsHook: true,
  titleSource: 'scene-index.title',
  titleRenderedByRemotion: true,
  titleInGeneratedFlowImageForbidden: true,
  titleVisibleFromFrame: 0,
  noIntroBeforeHook: true,
  noFadeInDelay: true,
  coverFrameImagePlusTitleOnly: true,
  coverFrameCaptionFree: true,
  captionsAllowedInsideScene01AfterCoverFrame: true,
  captionStartsFromSceneId: 'scene-01',
  standardSceneHeaderForbiddenDuringScene01: true,
  coverIconForbidden: true,
  flowImageMustReserveTitleSafeSpace: true,
  exportedCoverSource: 'final-video-frame-0',
  scene01TimingSource: 'first-spoken-hook-beat',
  scene01MinimumContentFramesWhenKnown: 24,
  scene01RecommendedSeconds: '1.8-3.0',
};

index.cover = {
  ...(index.cover ?? {}),
  sourceSceneId: 'scene-01',
  sameAssetAsFirstScene: true,
  separateGenerationForbidden: true,
  separateCoverSceneForbidden: true,
  renderedTitleOverlayRequired: true,
  finalExportSource: 'final-video-frame-0',
};

index.scenes = scenes.map((scene, i) => i === 0 ? {
  ...scene,
  coverHook: true,
  contentHook: true,
  coverOnlyIntro: false,
  voiceoverRequired: true,
  voiceoverStartsHere: true,
  captionEnabled: true,
  coverFrameCaptionFree: true,
  titleMode: 'reel-title-overlay',
  titleVisibleFromFrame: 0,
  coverTitle: title,
  coverSnapshotFrame: 0,
  durationPolicy: 'content-driven-from-hook-voiceover',
  hook: {
    form: '[EINFÜGEN: question|claim|problem|warning|contrast|number]',
    spokenLine: '[EINFÜGEN: exakte erste gesprochene Hook-Zeile des Gesamtskripts]',
    topicAnchor: '[EINFÜGEN: konkretes Thema/Objekt, das sofort erkennbar sein muss]',
    coverHeadline: title,
    startsAtFirstSpokenWord: true,
    noGenericIntro: true,
  },
} : scene);

writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const appendOnce = (relativePath, marker, block) => {
  const path = relativePath.startsWith('EINZELNE-SZENEN/') ? resolve(root, '03-szenen', relativePath) : resolve(root, relativePath);
  if (!existsSync(path)) return;
  let source = readFileSync(path, 'utf8');
  if (!source.includes(marker)) {
    source += '\n\n' + block.trim() + '\n';
    writeFileSync(path, source, 'utf8');
  }
};

const promptBlock = `FUTURE_COVER_HOOK: ${CONTRACT_ID}

COVER-HOOK V3 — SZENE 01 IST COVER UND ERSTER INHALT:
- Szene 01 ist KEIN vorgeschalteter Cover-Clip und KEIN 0,1-s-Titelvorspann. Frame 0 ist nur der Cover-Snapshot derselben normalen Hook-Szene.
- Das Voiceover beginnt bereits in Szene 01 mit dem ersten gesprochenen Wort. Kein Schweigen, keine neutrale Einleitung und kein "Heute geht es um ..." davor.
- Die erste gesprochene Zeile ist eine konkrete Frage, Behauptung, Problem-/Warn-Aussage, ein Kontrast oder eine konkrete Zahl und macht sofort klar, worum es geht.
- Das generierte Flow-Bild enthält KEINEN Reel-Titel, KEINE Headline, KEINEN Untertitel und KEINEN CTA. Der exakte Cover-Hook-Titel kommt aus Remotion ab Frame 0.
- Zeige ein starkes, sofort verständliches Hero-Motiv, das exakt zur ersten gesprochenen Hook-Zeile passt und den konkreten Themenanker sichtbar macht.
- Reserviere im oberen Bereich ruhige tiefschwarze Negativfläche für den Remotion-Titel.
- Kein Symbolrätsel, keine dekorative Objektansammlung, keine neutrale Titelkarte und kein Motiv, das auch zu fünf anderen Finanzthemen passen könnte.
- Szene 01 läuft nach Frame 0 normal als erster Content-Beat weiter; ihre Dauer folgt dem echten Hook-Voiceover, nicht einer künstlichen Cover-Dauer.`;

appendOnce('03-szenen/00-cover/cover.txt', `FUTURE_COVER_HOOK: ${CONTRACT_ID}`, promptBlock);
if (typeof first.planFile === 'string') {
  appendOnce(first.planFile, `FUTURE_COVER_HOOK: ${CONTRACT_ID}`, promptBlock);
}

const sceneDir = typeof first.directory === 'string' && first.directory.trim()
  ? first.directory.trim().replace(/^03-szenen\//, '').replace(/\/$/, '')
  : 'EINZELNE-SZENEN/scene-01';
const hookPlanBlock = `FUTURE_COVER_HOOK: ${CONTRACT_ID}

HOOK_FORM: [question|claim|problem|warning|contrast|number]
HOOK_SPOKEN_LINE: [EXAKTE ERSTE GESPROCHENE ZEILE DES GESAMTSKRIPTS]
HOOK_TOPIC_ANCHOR: [KONKRETES THEMA/OBJEKT]
HOOK_COVER_HEADLINE: ${title}
HOOK_STARTS_AT_FIRST_WORD: true
NO_GENERIC_INTRO: true
NO_STANDALONE_COVER_BEAT: true

Pflicht: Diese Szene ist bereits der erste inhaltliche Sprechbeat. Die erste gesprochene Zeile muss ohne Vorrede direkt neugierig machen UND den konkreten Gegenstand des Reels benennen/erkennbar machen.`;
appendOnce(`${sceneDir}/szene.md`, `FUTURE_COVER_HOOK: ${CONTRACT_ID}`, hookPlanBlock);

const projectDir = resolve(root, '05-projektdateien');
mkdirSync(projectDir, {recursive: true});
const handoffPath = resolve(projectDir, 'ANTIGRAVITY-AUFTRAG.md');
if (!existsSync(handoffPath)) {
  const beatContractId = String(index.visualBeatContract?.id ?? 'scene-index.visualBeatContract');
  writeFileSync(handoffPath, `# ANTIGRAVITY — PHASE 3\n\n1. Nutzer liefert alle finalen Google-Flow-Bilder aus 03-szenen/00-ALLE-BILDER-HIER-REIN/.\n2. Nutzer liefert genau ein finales Voiceover in 02-audio/.\n3. Erzeuge oder übernehme echte Wort-Zeitstempel aus diesem Voiceover.\n4. Retiming folgt ${beatContractId}; keine künstlich gleich langen Szenen und keine tote visuelle Wartezeit.\n5. Nutze exakt die versiegelten Phase-1-animation.tsx-Dateien; nach dem Seal keine Mechanik kreativ ersetzen.\n6. SFX nur framegenau und unterhalb der Voiceover-Priorität.\n7. Playwright-/Render-QA ist Pflicht; sichtbarer Timing-, Layout- oder Erklärfehler = FAIL.\n8. Danach Preflight → Candidate → Render-QA → automatischer Export nach 06-export/.\n\nAntigravity erzeugt weder die finalen Google-Flow-Bilder noch das Haupt-Voiceover.\n`, 'utf8');
}

const antigravityBlock = `COVER_HOOK_CONTRACT: ${CONTRACT_ID}

## Szene 01 — Cover = erster Content-Beat

- Szene 01 ist gleichzeitig Reel-Cover UND der erste inhaltliche Hook. Es gibt davor und darin KEINEN separaten 0,1-s-Cover-Clip, keine stille Titelkarte und keinen künstlichen 3-Frame-Hold.
- Frame 0 dient ausschließlich als Cover-Snapshot derselben Szene: Hero-Bild + exakter Hook-Titel aus scene-index.title, ohne Caption, Standard-Header-Icon, CTA oder Zusatzkarte.
- Das Voiceover beginnt bereits in Szene 01 ab dem ersten gesprochenen Wort. Die Timeline darf Audio nicht bis scene-02 verzögern.
- Szene 01 bleibt nach Frame 0 normal aktiv und dauert so lange, wie der erste echte Hook-Sprechbeat laut Wort-Timestamps benötigt.
- Captions dürfen innerhalb von Szene 01 nach dem Cover-Frame erscheinen und folgen dort bereits den echten Wort-Timestamps. Nur der exportierte Frame 0 bleibt caption-frei.
- Rendere den exakten Titel bereits bei Frame 0 ohne Fade-in oder Intro davor. Das Flow-Bild selbst enthält den Titel nicht.
- Kein normales SceneHeader-Icon in Szene 01; der Hook-Titel ist dort die einzige obere Textebene.
- Playwright/Render-QA prüft Frame 0 UND einen späteren Frame derselben Szene: Frame 0 = sauberes Cover; später = derselbe Hook-Beat mit laufendem Inhalt/Voiceover-Caption-Verhalten.
- Der finale Export erzeugt cover.png aus Frame 0 der bereits geprüften finalen MP4.`;

appendOnce('05-projektdateien/ANTIGRAVITY-AUFTRAG.md', `COVER_HOOK_CONTRACT: ${CONTRACT_ID}`, antigravityBlock);
appendOnce('05-projektdateien/technische-hinweise.md', `COVER_HOOK_CONTRACT: ${CONTRACT_ID}`, antigravityBlock);

const qaPath = resolve(projectDir, 'cover-hook-qa.md');
writeFileSync(qaPath, `# Cover Hook QA\n\nCOVER_HOOK_CONTRACT: ${CONTRACT_ID}\n\n## Inhaltliche Hook-Prüfung\n- [ ] Szene 01 ist der erste echte Content-Beat, keine separate Cover-Szene\n- [ ] erste gesprochene Zeile beginnt sofort, ohne Vorrede\n- [ ] Hook-Form = Frage / Aussage / Problem / Warnung / Kontrast / konkrete Zahl\n- [ ] konkretes Thema ist bereits in der ersten Zeile bzw. unmittelbar im Hook eindeutig\n- [ ] Cover-Headline funktioniert selbst als Hook und ist nicht nur eine neutrale Themenbezeichnung\n\n## Render-Prüfung\n- [ ] Frame 0: Hero-Bild + exakter Hook-Titel sichtbar\n- [ ] Frame 0: keine Caption / kein Standard-Header-Icon / kein CTA / keine Zusatzkarte\n- [ ] kein separater 0,1-s- oder 3-Frame-Cover-Hold\n- [ ] Voiceover startet in scene-01, nicht erst scene-02\n- [ ] Captions dürfen nach Frame 0 bereits innerhalb scene-01 starten\n- [ ] scene-01-Dauer folgt dem echten ersten Sprechbeat\n- [ ] cover.png stammt aus finalem Video-Frame 0\n\nErst bei vollständigem PASS darf Phase 3 finalisieren.\n`, 'utf8');

console.log('✓ Future Cover Hook gesetzt: ' + CONTRACT_ID);
console.log('  scene-01 = Cover + erster echter Hook-Beat · Frame 0 ist nur der Cover-Snapshot, kein separater Cover-Clip.');
console.log('  Voiceover startet in scene-01 sofort; Captions dürfen nach Frame 0 bereits in derselben Szene laufen.');
