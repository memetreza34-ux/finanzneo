#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const args=process.argv.slice(2);
const target=args.find((arg)=>!arg.startsWith('--'));
const requireFinal=args.includes('--final')||args.includes('--require-final-assets');
const postRender=args.includes('--post-render');

if(!target){
  console.error('Nutzung: node scripts/validate-reel-quality-contract.mjs <Reel-Projektordner> [--final] [--post-render]');
  process.exit(1);
}
if(postRender&&!requireFinal){
  console.error('--post-render darf nur zusammen mit --final verwendet werden.');
  process.exit(1);
}

const root=resolve(target);
const indexPath=resolve(root,'03-szenen/scene-index.json');
if(!existsSync(indexPath)){
  console.error('✗ scene-index.json fehlt.');
  process.exit(1);
}

const index=JSON.parse(readFileSync(indexPath,'utf8'));
const contract=index.productionQualityContract;
if(Number(index.version)<17&&!contract){
  console.log('↷ Quality Contract V2: Legacy/V16-Reel wird nicht nachträglich blockiert.');
  process.exit(0);
}

const errors=[];
const warnings=[];
const assert=(condition,message)=>{if(!condition)errors.push(message);};
const placeholder=(value)=>/\[(?:EINFÜGEN|PLACEHOLDER|WARUM)/i.test(String(value??''));
const scenes=Array.isArray(index.scenes)?index.scenes:[];

assert(Number(index.version)>=17,'Neue Reels mit Quality Contract müssen scene-index Version 17+ verwenden.');
assert(contract?.version===2,'productionQualityContract.version muss 2 sein.');
assert(Number(contract?.targetAnimationShare)===0.60,'Zielwert Animation muss 60 % sein.');
assert(Number(contract?.minAnimationDurationShare)===0.55&&Number(contract?.maxAnimationDurationShare)===0.65,'Finale Animationslaufzeit muss 55–65 % erlauben.');
assert(Number(contract?.minImageDurationShare)===0.35&&Number(contract?.maxImageDurationShare)===0.45,'Finale Bildlaufzeit muss 35–45 % erlauben.');
assert(Number(contract?.maxConsecutiveImageScenes)===1,'Mehr als eine Bildszene hintereinander muss verboten sein.');
assert(Number(contract?.maxImageSceneSeconds)===8,'Standard-Maximum für Bildszenen muss 8 Sekunden sein.');
assert(contract?.animationFirstForDynamicInformation===true,'Dynamische Information muss animation-first sein.');
assert(contract?.finalTimelineMustBeResolved===true,'Finale Timeline muss aufgelöst sein.');
assert(contract?.fullMp4QaRequired===true,'Vollständige MP4-QA muss Pflicht sein.');
assert(contract?.imageSemanticQaRequired===true,'Semantische Bild-QA muss Pflicht sein.');
assert(contract?.audioQaRequired===true,'Audio-QA muss Pflicht sein.');

const imageScenes=scenes.filter((scene)=>scene.type==='image');
const animationScenes=scenes.filter((scene)=>scene.type==='animation');
assert(imageScenes.length+animationScenes.length===scenes.length,'Jede Szene muss image oder animation sein.');
assert(Number(index.imageSceneCount)===imageScenes.length,'imageSceneCount stimmt nicht.');
assert(Number(index.animationSceneCount)===animationScenes.length,'animationSceneCount stimmt nicht.');

if(scenes.length){
  const expectedAnimations=Math.round(scenes.length*0.60);
  assert(animationScenes.length===expectedAnimations,`Planungsmix falsch: ${scenes.length} Szenen brauchen standardmäßig ${expectedAnimations} Animationen, gefunden ${animationScenes.length}.`);
}

let consecutiveImages=0;
for(const scene of scenes){
  if(scene.type==='image')consecutiveImages+=1;
  else consecutiveImages=0;
  assert(consecutiveImages<=1,`Zwei Bildszenen direkt hintereinander sind im V2-Standard verboten (bei ${scene.id}).`);

  const role=String(scene.visualRole??'').trim();
  const reason=String(scene.visualSelectionReason??'').trim();
  if(!role||placeholder(role))warnings.push(`${scene.id}: visualRole noch nicht final ausgefüllt.`);
  if(reason.length<12||placeholder(reason))warnings.push(`${scene.id}: Visualtyp-Begründung noch nicht final ausgefüllt.`);

  if(requireFinal){
    assert(role&&!placeholder(role),`${scene.id}: visualRole fehlt im Finalmodus.`);
    assert(reason.length>=12&&!placeholder(reason),`${scene.id}: Visualtyp-Begründung fehlt/ist zu kurz.`);
    if(scene.type==='image'){
      const expected=String(scene.expectedVisual??'').trim();
      assert(expected.length>=12&&!placeholder(expected),`${scene.id}: expectedVisual fehlt für die Bild-QA.`);
    }
  }
}

const subtitle=index.subtitleDisplay??{};
assert(Number(subtitle.maxSentences)===1,'Es darf immer nur eine Caption-Einheit gleichzeitig sichtbar sein.');
assert(Number(subtitle.maxLines)===2,'Captions dürfen maximal zwei Zeilen haben.');
assert(Number(subtitle.minFontSizePx)>=42,'Caption-Schrift darf nicht unter 42 px fallen.');
assert(Number(subtitle.maxWordsPerCaptionUnit)<=12,'Caption-Einheit darf maximal 12 Wörter haben.');
assert(Number(subtitle.maxCharactersPerCaptionUnit)<=68,'Caption-Einheit darf maximal 68 Zeichen haben.');
assert(subtitle.horizontalOverflowForbidden===true&&subtitle.clippingForbidden===true,'Caption-Overflow/Clipping muss ausdrücklich verboten sein.');

const timingPath=resolve(root,'04-caption/word-timings.json');
assert(existsSync(timingPath),'04-caption/word-timings.json fehlt.');
let timing=null;
if(existsSync(timingPath)){
  timing=JSON.parse(readFileSync(timingPath,'utf8'));
  const rules=timing.rules??{};
  assert(Number(rules.maxCaptionUnitsVisible??rules.maxSentencesVisible)===1,'word-timings: maximal eine Caption-Einheit gleichzeitig.');
  assert(Number(rules.maxLines)===2,'word-timings: maximal zwei Zeilen.');
  assert(Number(rules.minFontSizePx)>=42,'word-timings: Mindestschriftgröße 42 px fehlt.');
  assert(Number(rules.maxWordsPerCaptionUnit)<=12,'word-timings: max. 12 Wörter pro Einheit fehlt.');
  assert(Number(rules.maxCharactersPerCaptionUnit)<=68,'word-timings: max. 68 Zeichen pro Einheit fehlt.');
  assert(rules.horizontalOverflowForbidden===true&&rules.clippingForbidden===true,'word-timings: Overflow/Clipping muss verboten sein.');

  if(requireFinal){
    assert(timing.timingStatus==='final-audio-aligned','Finalmodus BLOCKED: Wortzeiten sind nicht final-audio-aligned.');
    assert(Array.isArray(timing.sentences)&&timing.sentences.length>0,'Finalmodus BLOCKED: echte Caption-/Wortzeiten fehlen.');
    for(const sentence of timing.sentences??[]){
      const text=String(sentence.text??'').trim();
      const wordCount=text.split(/\s+/).filter(Boolean).length;
      assert(wordCount<=12,`${sentence.id??'Caption'}: ${wordCount} Wörter; maximal 12.`);
      assert(text.length<=68,`${sentence.id??'Caption'}: ${text.length} Zeichen; maximal 68.`);
    }
  }
}

const timelinePath=resolve(root,'05-projektdateien/timeline.json');
assert(existsSync(timelinePath),'05-projektdateien/timeline.json fehlt.');
if(existsSync(timelinePath)){
  const timeline=JSON.parse(readFileSync(timelinePath,'utf8'));
  const entries=Array.isArray(timeline.scenes)?timeline.scenes:[];
  assert(entries.length===scenes.length,'Timeline-Szenenanzahl stimmt nicht mit scene-index überein.');

  if(requireFinal&&entries.length){
    const byId=new Map(scenes.map((scene)=>[scene.id,scene]));
    let lastEnd=0;
    let animationFrames=0;
    let imageFrames=0;

    for(let i=0;i<entries.length;i+=1){
      const entry=entries[i];
      const start=Number(entry.startFrame);
      const duration=Number(entry.durationFrames);
      assert(Number.isFinite(start)&&start>=0,`${entry.id}: ungültiger startFrame.`);
      assert(Number.isFinite(duration)&&duration>0,`${entry.id}: durationFrames muss im Finalmodus > 0 sein.`);
      if(i===0)assert(start===0,'Finale Timeline muss bei Frame 0 beginnen.');
      if(i>0)assert(Math.abs(start-lastEnd)<=1,`${entry.id}: Timeline hat Lücke/Overlap; Start ${start}, erwartet ca. ${lastEnd}.`);
      lastEnd=start+duration;

      const type=byId.get(entry.id)?.type??entry.type;
      if(type==='animation')animationFrames+=duration;
      if(type==='image'){
        imageFrames+=duration;
        assert(duration<=30*8,`${entry.id}: statische Bildszene dauert ${(duration/30).toFixed(1)} s; Standardmaximum 8 s.`);
      }
    }

    const total=animationFrames+imageFrames;
    if(total>0){
      const animationShare=animationFrames/total;
      const imageShare=imageFrames/total;
      assert(animationShare>=0.55&&animationShare<=0.65,`Finale Animationslaufzeit ${(animationShare*100).toFixed(1)} %; erlaubt 55–65 %.`);
      assert(imageShare>=0.35&&imageShare<=0.45,`Finale Bildlaufzeit ${(imageShare*100).toFixed(1)} %; erlaubt 35–45 %.`);
    }

    if(timing?.sentences?.length){
      const frames=timing.sentences.flatMap((sentence)=>Array.isArray(sentence.frames)?sentence.frames:[]).filter(Number.isFinite);
      const lastTimingFrame=frames.length?Math.max(...frames):NaN;
      if(Number.isFinite(lastTimingFrame)){
        assert(Math.abs(lastEnd-lastTimingFrame)<=30,`Timeline-Ende (${lastEnd}) weicht mehr als 1 s vom letzten gesprochenen Wort (${lastTimingFrame}) ab.`);
      }
    }
  }
}

const qaPath=resolve(root,'05-projektdateien/final-qa.json');
assert(existsSync(qaPath),'05-projektdateien/final-qa.json fehlt für V17-Reel.');

if(existsSync(qaPath)){
  const qa=JSON.parse(readFileSync(qaPath,'utf8'));
  assert(['pending','passed'].includes(qa.status),'final-qa.json status muss pending oder passed sein.');

  if(postRender){
    assert(qa.status==='passed','Post-Render-Finalmodus BLOCKED: final-qa.json status muss passed sein.');
    for(const key of [
      'inspectedFullMp4','inspectedEveryScene','imageSemanticMatchPassed','generatedTextQaPassed',
      'sceneAudioSyncPassed','subtitleSafeAreaPassed','subtitleSyncPassed','visualMixPassed',
      'noLongStaticTailPassed','audioLevelsPassed',
    ]) assert(qa[key]===true,`Post-Render-QA fehlt/fehlgeschlagen: ${key}.`);

    assert(typeof qa.renderPath==='string'&&qa.renderPath.trim(),'Post-Render-QA: renderPath fehlt.');
    const lufs=Number(qa.measuredIntegratedLufs);
    const peak=Number(qa.measuredTruePeakDbtp);
    assert(Number.isFinite(lufs)&&lufs>=-17&&lufs<=-15,`Audio-Loudness ${qa.measuredIntegratedLufs} LUFS; Zielbereich -17 bis -15 LUFS.`);
    assert(Number.isFinite(peak)&&peak<=-1,`True Peak ${qa.measuredTruePeakDbtp} dBTP; muss <= -1 dBTP sein.`);
  }
}

for(const warning of warnings)console.warn(`⚠ ${warning}`);
if(errors.length){
  for(const error of errors)console.error(`✗ ${error}`);
  process.exit(1);
}

const mode=postRender?'POST-RENDER':requireFinal?'PRE-RENDER-FINAL':'BASIS';
console.log(`✓ Reel Quality Contract V2 erfüllt (${mode}).`);
