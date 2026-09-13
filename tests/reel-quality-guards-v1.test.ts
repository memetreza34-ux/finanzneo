import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import test from 'node:test';

const qualityValidator = resolve('scripts/validate-reel-quality-guards-v1.mjs');
const coverValidator = resolve('scripts/validate-future-cover-hook-v3.mjs');
const GUARD = 'finanzneo-reel-quality-guards-v1';

const mkdirWrite = (root: string, relative: string, content: string) => {
  const path = join(root, relative);
  mkdirSync(resolve(path, '..'), {recursive: true});
  writeFileSync(path, content, 'utf8');
};

const baseGuard = {
  id: GUARD,
  appliesToNewReelsOnly: true,
  sceneTypeExclusive: true,
  imageAnimationHybridMainVisualForbidden: true,
  sourceBasedAnimationDiversityRequired: true,
  metadataOnlyDiversityForbidden: true,
  actualPrimitiveReuseLimited: true,
  horizontalAnimationSafeZoneRequired: true,
  animationHorizontalSafeZone: {left:72,right:1008,top:320,bottom:1400,perspectiveGuardPx:24},
  postRenderEdgeBandQaRequired: true,
  edgeBandActivePixelRatioMax: 0.012,
};

const source = (body: string) => `export const X=()=> <PremiumPhysicalStage>${body}</PremiumPhysicalStage>;`;

const makeGuardReel = (scenes: any[], sources: Record<string,string>) => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-quality-guard-'));
  mkdirWrite(root, '03-szenen/scene-index.json', JSON.stringify({reelQualityGuards:baseGuard,scenes}, null, 2));
  mkdirWrite(root, '05-projektdateien/reel-quality-guards-v1.md', `REEL_QUALITY_GUARDS: ${GUARD}\n`);
  for (const [name, content] of Object.entries(sources)) mkdirWrite(root, `03-szenen/${name}/animation.tsx`, content);
  return root;
};

test('unterschiedliche echte Animationsobjekte innerhalb Safe-Zone bestehen', () => {
  const scenes = [
    {id:'scene-01',type:'image',googleFlowFileName:'Bild.png'},
    {id:'scene-02',type:'animation',animationSourceFile:'scene-02/animation.tsx',motionDesign:{repetitionJustification:'none'}},
    {id:'scene-03',type:'animation',animationSourceFile:'scene-03/animation.tsx',motionDesign:{repetitionJustification:'none'}},
    {id:'scene-04',type:'animation',animationSourceFile:'scene-04/animation.tsx',motionDesign:{repetitionJustification:'none'}},
  ];
  const root = makeGuardReel(scenes, {
    'scene-02':source('<PhysicalWasher x={180} y={500}/><PhysicalCoinStack x={520} y={700}/>'),
    'scene-03':source('<PhysicalAccount x={300} y={560}/><PhysicalCoinStack x={650} y={730}/>'),
    'scene-04':source('<PhysicalBill x={180} y={520}/><PhysicalCalendarPage x={580} y={620}/>'),
  });
  try { execFileSync(process.execPath,[qualityValidator,root],{stdio:'pipe'}); }
  finally { rmSync(root,{recursive:true,force:true}); }
});

test('IMAGE mit Animationsfeldern wird als Hybrid blockiert', () => {
  const root = makeGuardReel([{id:'scene-01',type:'image',googleFlowFileName:'Bild.png',animationSourceFile:'scene-01/animation.tsx'}],{});
  try {
    const result = spawnSync(process.execPath,[qualityValidator,root],{encoding:'utf8'});
    assert.notEqual(result.status,0);
    assert.match(result.stderr,/exklusiv|IMAGE/i);
  } finally { rmSync(root,{recursive:true,force:true}); }
});

test('dreifache tatsächliche Primitive-Wiederholung wird blockiert', () => {
  const scenes = ['02','03','04'].map((n) => ({id:`scene-${n}`,type:'animation',animationSourceFile:`scene-${n}/animation.tsx`,motionDesign:{repetitionJustification:'none'}}));
  const root = makeGuardReel(scenes, {
    'scene-02':source('<PhysicalReserveTank x={180} y={500} width={250}/><PhysicalCoinStack x={520} y={700}/>'),
    'scene-03':source('<PhysicalReserveTank x={220} y={520} width={250}/><PhysicalBill x={580} y={620}/>'),
    'scene-04':source('<PhysicalReserveTank x={250} y={540} width={250}/><PhysicalCalendarPage x={600} y={650}/>'),
  });
  try {
    const result = spawnSync(process.execPath,[qualityValidator,root],{encoding:'utf8'});
    assert.notEqual(result.status,0);
    assert.match(result.stderr,/drei der letzten vier|Hauptobjekt-Sprache/i);
  } finally { rmSync(root,{recursive:true,force:true}); }
});

test('statisch zu weit rechts platzierte Animation wird blockiert', () => {
  const root = makeGuardReel([{id:'scene-02',type:'animation',animationSourceFile:'scene-02/animation.tsx',motionDesign:{repetitionJustification:'none'}}],{
    'scene-02':source('<PhysicalAccount x={710} y={560}/><PhysicalCoinStack x={200} y={700}/>'),
  });
  try {
    const result = spawnSync(process.execPath,[qualityValidator,root],{encoding:'utf8'});
    assert.notEqual(result.status,0);
    assert.match(result.stderr,/horizontale Zone|x=710/i);
  } finally { rmSync(root,{recursive:true,force:true}); }
});

test('Cover Hook V3 verlangt Captions und vollständiges Hero-Bild bereits in scene-01 Frame 0', () => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-cover-v3-'));
  const marker = 'finanzneo-cover-hook-v3';
  const index = {
    title:'Test Reel',
    cover:{
      sourceSceneId:'scene-01',
      sameAssetAsFirstScene:true,
      separateGenerationForbidden:true,
      renderedTitleOverlayRequired:true,
      heroImageVisibleFromFrame:0,
      heroImageInitialOpacity:1,
      imageEntranceTransition:'none',
      finalExportSource:'final-video-frame-0',
    },
    transitionContract:{
      imageEnterFrames:4,
      scene01ImageEnterFrames:0,
      scene01ImageFadeInForbidden:true,
      scene01BlackLeadInForbidden:true,
    },
    coverHookContract:{
      id:marker,
      sourceSceneId:'scene-01',
      titleSource:'scene-index.title',
      titleRenderedByRemotion:true,
      titleInGeneratedFlowImageForbidden:true,
      titleVisibleFromFrame:0,
      titleVisibleWithinFirstSecond:true,
      titleHoldMinFrames:30,
      heroImageVisibleFromFrame:0,
      heroImageInitialOpacity:1,
      coverImageFadeInForbidden:true,
      coverImageEntranceTransitionForbidden:true,
      blackLeadInForbidden:true,
      frame0HeroImageRenderQaRequired:true,
      captionsFollowVoiceoverFromFirstSpokenWord:true,
      captionlessSpokenAudioForbidden:true,
      standardSceneHeaderForbiddenDuringScene01:true,
      coverIconForbidden:true,
      secondaryTextForbidden:true,
      noIntroBeforeTitle:true,
      noFadeInDelay:true,
      flowImageMustReserveTitleSafeSpace:true,
      standaloneCoverRequired:true,
      exportedCoverSource:'final-video-frame-0',
    },
    scenes:[{
      id:'scene-01',
      type:'image',
      planFile:'EINZELNE-SZENEN/scene-01/bildprompt.txt',
      coverHook:true,
      captionEnabled:true,
      captionsStartWithVoiceover:true,
      subtitleMode:'sentence-with-audio-synced-active-word',
      titleMode:'reel-title-overlay',
      titleVisibleFromFrame:0,
      coverTitle:'Test Reel',
      imageVisibleFromFrame:0,
      imageInitialOpacity:1,
      imageEnterMode:'none',
    }],
  };
  mkdirWrite(root,'03-szenen/scene-index.json',JSON.stringify(index,null,2));
  for (const p of ['03-szenen/00-cover/cover.txt','03-szenen/EINZELNE-SZENEN/scene-01/bildprompt.txt','05-projektdateien/technische-hinweise.md','05-projektdateien/cover-hook-qa.md']) mkdirWrite(root,p,marker+'\n');
  mkdirWrite(root,'05-projektdateien/ANTIGRAVITY-AUFTRAG.md',`${marker}\nFRAME 0 zeigt das vollständige Hero-Bild. Kein schwarzer Lead-in. Kein Image-Fade-in. Captions starten mit dem ersten gesprochenen Wort. Gesprochenes Audio ohne Captions ist verboten.\n`);
  try { execFileSync(process.execPath,[coverValidator,root],{stdio:'pipe'}); }
  finally { rmSync(root,{recursive:true,force:true}); }
});
