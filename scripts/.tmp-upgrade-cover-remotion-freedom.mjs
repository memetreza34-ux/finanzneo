import {existsSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const REEL = resolve('reels/2026-08-31_bis_2026-09-06/donnerstag/reel-04_kreditkarten-teilzahlung');
const read = (p) => readFileSync(resolve(p), 'utf8');
const write = (p, c) => writeFileSync(resolve(p), c.endsWith('\n') ? c : c + '\n', 'utf8');
const mustReplace = (source, from, to, label) => {
  if (!source.includes(from)) throw new Error('Patch marker fehlt: ' + label);
  return source.replace(from, to);
};
const scenePath = (id, file) => resolve(REEL, '03-szenen/EINZELNE-SZENEN', id, file);
const clamp = "const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};";

// ---------------------------------------------------------------------------
// 1) Central animation contract: Remotion is the canvas, primitives are optional.
// ---------------------------------------------------------------------------
{
  const p = 'scripts/lib/premium-animation-contract.mjs';
  let s = read(p);
  s = mustReplace(s,
`  requirePremiumPhysicalStage: true,
  requirePhysicalObjects: true,`,
`  requirePremiumPhysicalStage: false,
  requirePhysicalObjects: false,
  creativeRemotionFreedom: true,
  customCompositionAllowed: true,
  physicalPrimitivesOptional: true,
  safeStageRequired: true,
  visualTechniqueIdRequired: true,
  uniqueVisualTechniquePerAnimationRequired: true,`, 'premium freedom fields');
  write(p, s);
}

{
  const p = 'scripts/apply-premium-animation-v2.mjs';
  let s = read(p);
  s = mustReplace(s,
`- mindestens zwei konkrete Realwelt-Objekte/-Instanzen in der visuellen Handlung
- eindeutige MECHANIC_ID je Animationsszene; keine Mechanik im selben Reel doppelt verwenden
- PRIMARY_ACTION benennt die tatsächliche physische Zustandsänderung
- mehrere koordinierte Motion-Channels statt einer einzigen globalen Progress-Variable
- kurze deutsche Labels dürfen helfen, tragen aber niemals allein die Erklärung
- sichtbare Materialität, Dicke, Tiefe und Kontakt-Schatten
- PremiumPhysicalStage bleibt transparent; der zentrale Reel-Canvas darunter ist statisch #000000
- Ergebnis mindestens 15 Frames stabil halten

Bevorzugte konkrete Primitives, wenn passend:
- PhysicalBill
- PhysicalAccount
- PhysicalWasher
- PhysicalReserveTank
- PhysicalCalendarPage
- PhysicalCoinStack`,
`- Remotion ist die freie Animationsfläche: eigene React-Komponenten, SVG, Masken, Clip-Paths, CSS-3D, Perspektive, Kamera-Choreografie, Morphing und bei Bedarf Three.js sind erlaubt
- vorhandene Physical*-Primitives sind OPTIONALE Helfer und niemals Voraussetzung oder Kreativitätsgrenze
- jede Szene erhält eine eindeutige MECHANIC_ID UND VISUAL_TECHNIQUE_ID; weder Mechanik noch Haupttechnik im selben Reel wiederholen
- PRIMARY_ACTION benennt die tatsächliche sichtbare Zustandsänderung
- mehrere koordinierte Motion-Channels statt einer einzigen globalen Progress-Variable
- kurze deutsche Labels dürfen helfen, tragen aber niemals allein die Erklärung
- AnimationStage oder PremiumPhysicalStage hält die sichtbare Ausgabe in der Visual-Safe-Zone; der zentrale Reel-Canvas darunter bleibt #000000
- Materialität, Tiefe, Perspektive und Kontakt-Schatten einsetzen, wenn sie zur gewählten Technik passen
- Ergebnis mindestens 15 Frames stabil halten

Mögliche Techniken — ausdrücklich keine geschlossene Liste:
- eigene SVG-Illustration und SVG-Morph/Mask-Reveal
- CSS-3D-Objekte, Perspektivräume und Kamerafahrten
- Clip-Path-/Slice-/Cutaway-Mechaniken
- Split-Screen, Match-Cut und Objekt-Transformation
- data-driven Shapes und echte Diagramm-Transformationen
- Canvas / Three.js / @remotion/three, wenn die Szene davon profitiert
- vorhandene Physical*-Primitives nur dann, wenn sie für genau diese Szene die beste Lösung sind`, 'premium contract copy');
  s = mustReplace(s,
`console.log('  Realwelt-Mechanik zuerst · jede Szene eigene MECHANIC_ID · mehrere Motion-Channels.');`,
`console.log('  Remotion-Freiheit aktiv · jede Szene eigene MECHANIC_ID + VISUAL_TECHNIQUE_ID · mehrere Motion-Channels.');`, 'premium log');
  write(p, s);
}

{
  const p = 'scripts/apply-phase1-animation-code-contract.mjs';
  let s = read(p);
  s = mustReplace(s,
` * - reale stylized-3D-Situation statt generischer Kartenreihe\n * - mindestens zwei konkrete Realwelt-Objekte/-Instanzen\n * - mehrere koordinierte Motion-Channels`,
` * - passende Remotion-Technik frei wählen: React/SVG/CSS-3D/Masken/Perspektive/Three.js\n * - Physical*-Primitives sind optional und dürfen die Kreativität nicht begrenzen\n * - mehrere koordinierte Motion-Channels`, 'phase1 placeholder freedom');
  s = mustReplace(s,
` * MECHANIC_ID: [EINDEUTIGE-MECHANIK-FÜR-DIESE-SZENE]\n * PRIMARY_ACTION:`,
` * MECHANIC_ID: [EINDEUTIGE-MECHANIK-FÜR-DIESE-SZENE]\n * VISUAL_TECHNIQUE_ID: [EINDEUTIGE-HAUPTTECHNIK-FÜR-DIESE-SZENE]\n * PRIMARY_ACTION:`, 'phase1 technique marker');
  s = mustReplace(s,
`narrativeMarkersRequired: ['MECHANIC_ID', 'PRIMARY_ACTION', 'START', 'MECHANISM', 'RESULT', 'HERO', 'SUPPORT', 'MATERIAL', 'DEPTH'],`,
`narrativeMarkersRequired: ['MECHANIC_ID', 'VISUAL_TECHNIQUE_ID', 'PRIMARY_ACTION', 'START', 'MECHANISM', 'RESULT', 'HERO', 'SUPPORT', 'MATERIAL', 'DEPTH'],`, 'phase1 marker array');
  s = mustReplace(s,
`console.log('  Jede Animation muss eine eigene reale Mechanik, konkrete Gegenstände und mehrere koordinierte Bewegungen besitzen.');`,
`console.log('  Jede Animation braucht eine eigene Mechanik + eigene visuelle Haupttechnik; Remotion-Komposition ist frei, Physical*-Primitives sind optional.');`, 'phase1 log');
  write(p, s);
}

{
  const p = 'scripts/validate-animation-source-quality.mjs';
  let s = read(p);
  s = mustReplace(s,
`const mechanicIds = new Map();`,
`const mechanicIds = new Map();
const techniqueIds = new Map();
const freeRemotion = index.phase1AnimationCode?.creativeRemotionFreedom === true;`, 'validator freedom state');
  s = mustReplace(s,
`if (index.phase1AnimationCode?.requirePremiumPhysicalStage !== true) fail('PremiumPhysicalStage muss für den Animationsvertrag verpflichtend sein.');
if (index.phase1AnimationCode?.requirePhysicalObjects !== true) fail('Mindestens ein echtes physisches Hauptobjekt muss verpflichtend sein.');`,
`if (freeRemotion) {
  if (index.phase1AnimationCode?.customCompositionAllowed !== true) fail('Remotion-Freedom verlangt customCompositionAllowed=true.');
  if (index.phase1AnimationCode?.physicalPrimitivesOptional !== true) fail('Remotion-Freedom verlangt physicalPrimitivesOptional=true.');
  if (index.phase1AnimationCode?.safeStageRequired !== true) fail('Remotion-Freedom verlangt safeStageRequired=true.');
  if (index.phase1AnimationCode?.visualTechniqueIdRequired !== true) fail('Remotion-Freedom verlangt visualTechniqueIdRequired=true.');
  if (index.phase1AnimationCode?.uniqueVisualTechniquePerAnimationRequired !== true) fail('Remotion-Freedom verlangt uniqueVisualTechniquePerAnimationRequired=true.');
} else {
  if (index.phase1AnimationCode?.requirePremiumPhysicalStage !== true) fail('PremiumPhysicalStage muss für den alten Animationsvertrag verpflichtend sein.');
  if (index.phase1AnimationCode?.requirePhysicalObjects !== true) fail('Mindestens ein echtes physisches Hauptobjekt muss im alten Animationsvertrag verpflichtend sein.');
}`, 'validator metadata mode');
  s = mustReplace(s,
`  if (!/PremiumPhysicalStage/.test(source)) fail(\`${'${id}'}: Animation muss PremiumPhysicalStage verwenden.\`);
  const genericObjects = [...source.matchAll(/<PhysicalObject\\b/g)].length;
  const concreteObjects = [...source.matchAll(realWorldPrimitive)].length;
  if (genericObjects + concreteObjects < 1) fail(\`${'${id}'}: Animation braucht mindestens ein physisches Hauptmotiv.\`);
  if (concreteObjects < 2) {
    fail(\`${'${id}'}: mindestens zwei konkrete Realwelt-Objekte/-Instanzen sind nötig (z. B. Rechnung, Konto, Waschmaschine, Reserve, Kalender, Münzen); generische Karten reichen nicht.\`);
  }
  if (genericObjects >= 3 && concreteObjects < 3) {
    fail(\`${'${id}'}: drei oder mehr generische PhysicalObject-Karten dominieren die Szene; Realwelt-Mechanik muss die Hauptsprache sein.\`);
  }
  if (/<PhysicalRail\\b/.test(source) && concreteObjects < 3) {
    fail(\`${'${id}'}: PhysicalRail/Fortschrittsbalken darf niemals die primäre Animation ersetzen; bei Nutzung müssen mindestens drei konkrete Realwelt-Objekte die Geschichte tragen.\`);
  }`,
`  if (freeRemotion) {
    if (!/(?:PremiumPhysicalStage|AnimationStage)/.test(source)) fail(\`${'${id}'}: freie Remotion-Animation muss AnimationStage oder PremiumPhysicalStage für die Safe-Zone verwenden.\`);
  } else if (!/PremiumPhysicalStage/.test(source)) {
    fail(\`${'${id}'}: alter Animationsvertrag verlangt PremiumPhysicalStage.\`);
  }
  const genericObjects = [...source.matchAll(/<PhysicalObject\\b/g)].length;
  const concreteObjects = [...source.matchAll(realWorldPrimitive)].length;
  if (!freeRemotion) {
    if (genericObjects + concreteObjects < 1) fail(\`${'${id}'}: Animation braucht mindestens ein physisches Hauptmotiv.\`);
    if (concreteObjects < 2) fail(\`${'${id}'}: mindestens zwei konkrete Realwelt-Objekte/-Instanzen sind im alten Vertrag nötig.\`);
    if (genericObjects >= 3 && concreteObjects < 3) fail(\`${'${id}'}: drei oder mehr generische PhysicalObject-Karten dominieren die Szene.\`);
    if (/<PhysicalRail\\b/.test(source) && concreteObjects < 3) fail(\`${'${id}'}: PhysicalRail darf im alten Vertrag nicht die primäre Animation ersetzen.\`);
  }`, 'validator primitive block');
  s = mustReplace(s,
`  if (!/PRIMARY_ACTION:\\s*[^\\n]{18,}/i.test(source)) {`,
`  if (freeRemotion) {
    const techniqueId = source.match(/VISUAL_TECHNIQUE_ID:\\s*([a-z0-9-]+)/i)?.[1];
    if (!techniqueId) {
      fail(\`${'${id}'}: VISUAL_TECHNIQUE_ID fehlt; jede freie Remotion-Szene braucht eine eigene Haupttechnik.\`);
    } else if (techniqueIds.has(techniqueId)) {
      fail(\`${'${id}'}: VISUAL_TECHNIQUE_ID "${'${techniqueId}'}" dupliziert ${'${techniqueIds.get(techniqueId)}'}; Haupttechniken im selben Reel müssen variieren.\`);
    } else {
      techniqueIds.set(techniqueId, id);
    }
  }
  if (!/PRIMARY_ACTION:\\s*[^\\n]{18,}/i.test(source)) {`, 'validator technique id');
  s = mustReplace(s,
`console.log('✓ Jede Animation nutzt eine eigene Realwelt-Mechanik mit konkreten Gegenständen und Start → Aktion → Ergebnis.');`,
`console.log(freeRemotion ? '✓ Remotion-Freedom: eigene Mechanik + eigene visuelle Haupttechnik je Szene; Physical*-Primitives sind optional.' : '✓ Jede Animation nutzt die alte Realwelt-Primitive-Mechanik mit Start → Aktion → Ergebnis.');`, 'validator success log');
  write(p, s);
}

// ---------------------------------------------------------------------------
// 2) Cover: exact 3-frame flash, image + title only, voice starts at frame 3.
// ---------------------------------------------------------------------------
{
  const p = 'scripts/apply-future-cover-hook-v2.mjs';
  let s = read(p);
  s = mustReplace(s,
`  titleHoldMinFrames: 30,`,
`  titleHoldMinFrames: 3,
  coverFlashFrames: 3,
  coverFlashSeconds: 0.1,
  voiceoverForbiddenDuringScene01: true,
  audioStartsAtFrame: 3,
  audioStartsFromSceneId: 'scene-02',`, 'cover contract 3 frames');
  s = mustReplace(s,
`  coverTitle: title,
} : scene);`,
`  coverTitle: title,
  durationFrames: 3,
  plannedDurationSeconds: 0.1,
  targetSeconds: 0.1,
  coverOnly: true,
  voiceoverEnabled: false,
  audioTrigger: '',
} : scene);`, 'cover scene metadata');
  s = s.replace('Der Titel muss mindestens die ersten 30 Frames stabil lesbar sein und darf während scene-01 sichtbar bleiben.', 'Scene-01 dauert exakt 3 Frames = 0,1 s bei 30 fps. Titel und Hero-Bild sind in allen drei Frames sichtbar; danach beginnt sofort scene-02.');
  s = s.replace('- Während scene-01 darf KEINE Caption-/Subtitle-Komponente gemountet oder sichtbar sein. Untertitel beginnen erst mit scene-02.', '- Während scene-01 darf KEINE Caption-/Subtitle-Komponente gemountet oder sichtbar sein. Auch Voiceover ist in diesen 3 Frames gesperrt. Untertitel und Voiceover beginnen ab Frame 3 mit scene-02.');
  s = s.replace("console.log('  Szene 01 = Hero-Bild + exakter Reel-Titel ab Frame 0 · keine Untertitel · Cover-Export aus finalem Frame 0.');", "console.log('  Szene 01 = exakt 3 Frames / 0,1 s · nur Hero-Bild + exakter Reel-Titel · Voiceover und Untertitel starten erst mit scene-02.');");
  write(p, s);
}

{
  const p = 'scripts/validate-future-cover-hook-v2.mjs';
  let s = read(p);
  s = mustReplace(s,
`assert(Number(c.titleHoldMinFrames) >= 30, 'Titel muss mindestens 30 Frames lesbar bleiben.');`,
`const flashCover = Number(c.coverFlashFrames) === 3;
if (flashCover) {
  assert(Number(c.titleHoldMinFrames) === 3, '3-Frame-Cover verlangt titleHoldMinFrames=3.');
  assert(Number(c.coverFlashSeconds) === 0.1, '3-Frame-Cover verlangt coverFlashSeconds=0.1.');
  assert(c.voiceoverForbiddenDuringScene01 === true, 'Voiceover muss während des 3-Frame-Covers gesperrt sein.');
  assert(Number(c.audioStartsAtFrame) === 3, 'Voiceover muss ab Frame 3 starten.');
  assert(c.audioStartsFromSceneId === 'scene-02', 'Voiceover muss mit scene-02 starten.');
} else {
  assert(Number(c.titleHoldMinFrames) >= 30, 'Legacy-Cover muss mindestens 30 Frames lesbar bleiben.');
}`, 'cover validator title duration');
  s = mustReplace(s,
`assert(first?.coverTitle === index.title, 'scene-01.coverTitle muss exakt scene-index.title entsprechen.');`,
`assert(first?.coverTitle === index.title, 'scene-01.coverTitle muss exakt scene-index.title entsprechen.');
if (flashCover) {
  assert(Number(first?.durationFrames) === 3, 'scene-01 muss beim Cover-Flash exakt 3 Frames dauern.');
  assert(Number(first?.plannedDurationSeconds) === 0.1, 'scene-01.plannedDurationSeconds muss 0.1 sein.');
  assert(first?.coverOnly === true, 'scene-01.coverOnly muss true sein.');
  assert(first?.voiceoverEnabled === false, 'scene-01.voiceoverEnabled muss false sein.');
}`, 'cover validator scene checks');
  s = s.replace("console.log('✓ Frame 0 = Hero-Bild + exakter Reel-Titel · keine Untertitel · kein Standard-Header-Icon.');", "console.log(flashCover ? '✓ Cover-Flash = exakt 3 Frames / 0,1 s · nur Hero-Bild + Titel · Voiceover ab scene-02.' : '✓ Legacy-Cover-Hook erfüllt.');");
  write(p, s);
}

{
  const p = 'scripts/validate-visual-beat-contract.mjs';
  let s = read(p);
  s = mustReplace(s,
`    if (!voiceText || PLACEHOLDER.test(voiceText)) fail(prefix + ': voiceText fehlt oder ist Platzhalter.');`,
`    const coverOnlyBeat = scene.id === 'scene-01' && scene.coverOnly === true && scene.voiceoverEnabled === false;
    if ((!voiceText && !coverOnlyBeat) || PLACEHOLDER.test(voiceText)) fail(prefix + ': voiceText fehlt oder ist Platzhalter.');`, 'visual beat cover silence');
  write(p, s);
}

// ---------------------------------------------------------------------------
// 3) Regression tests: existing source gets a technique id; custom no-Physical source passes.
// ---------------------------------------------------------------------------
{
  const p = 'tests/animation-source-quality.test.ts';
  let s = read(p);
  s = mustReplace(s,
` * MECHANIC_ID: cash-exchange-becomes-euro-balance
 * PRIMARY_ACTION:`,
` * MECHANIC_ID: cash-exchange-becomes-euro-balance
 * VISUAL_TECHNIQUE_ID: physical-transfer
 * PRIMARY_ACTION:`, 'test technique marker');
  if (!s.includes("test('freie Remotion-Komposition ohne Physical-Primitives besteht")) {
    s += `

test('freie Remotion-Komposition ohne Physical-Primitives besteht', () => {
  const fixture = buildFixture();
  try {
    const freeSource = \`import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../src/design-system';
/**
 * MECHANIC_ID: debt-slab-slice
 * VISUAL_TECHNIQUE_ID: svg-clip-slice
 * PRIMARY_ACTION: Ein großer Schuldenblock wird sichtbar angeschnitten, ein kleiner bezahlter Teil trennt sich ab und der deutlich größere offene Rest bleibt stehen.
 * ANIMATION_NARRATIVE
 * START: Ein großer 600-Euro-Schuldenblock steht vollständig sichtbar im Zentrum der sicheren Visual-Zone.
 * MECHANISM: Eine Schnittkante fährt durch den Block, der 100-Euro-Teil löst sich räumlich und der verbleibende 500-Euro-Körper rückt in den Fokus.
 * RESULT: Der große Restblock bleibt stabil sichtbar und macht die verbleibende Belastung ohne Karten- oder Dashboard-Sprache eindeutig.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Der individuell gezeichnete Schuldenblock und seine echte Slice-Transformation tragen die komplette visuelle Erklärung.
 * SUPPORT: Kurze Betragslabels markieren nur die getrennten Teile und ersetzen niemals die sichtbare Transformation.
 * MATERIAL: Gold markiert den bezahlten Ausschnitt, warmes Rot den offenen Rest und Emerald bestätigt ausschließlich den entfernten Teil.
 * DEPTH: Der abgetrennte Teil fährt nach vorne links, während der Rest nach hinten rechts stabilisiert und dadurch klare räumliche Trennung entsteht.
 */
export const RESULT_HOLD_FRAMES = 18;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene02Animation: React.FC<{durationFrames?:number}> = ({durationFrames=120}) => {
  const frame = useCurrentFrame();
  const cut = interpolate(frame,[12,54],[0,1],clamp);
  const detach = interpolate(frame,[42,78],[0,1],clamp);
  const settle = interpolate(frame,[70,Math.max(82,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:150,top:610,width:780,height:330,perspective:1000}}>
      <div style={{position:'absolute',left:0,top:0,width:160,height:300,borderRadius:28,background:ANIMATION_COLORS.money,transform:'translate(' + (-detach*90) + 'px,' + (detach*35) + 'px) rotateY(' + (-detach*18) + 'deg)',opacity:0.35+cut*0.65}}><div style={{padding:38,fontSize:42,fontWeight:900}}>100 €</div></div>
      <div style={{position:'absolute',left:160-cut*20,top:0,width:620,height:300,borderRadius:28,background:ANIMATION_COLORS.warning,transform:'translateX(' + (settle*30) + 'px) scale(' + (0.94+settle*0.06) + ')'}}><div style={{padding:46,fontSize:58,fontWeight:950}}>500 € REST</div></div>
      <svg width="780" height="330" style={{position:'absolute',inset:0,pointerEvents:'none'}}><line x1={160} y1={20} x2={160} y2={310} stroke={ANIMATION_COLORS.neutral} strokeWidth={8} opacity={cut}/></svg>
    </div>
  </AnimationStage>;
};
\`;
    writeFileSync(fixture.sourcePath, freeSource);
    const result = validate(fixture.root);
    assert.equal(result.status, 0, \`${'${result.stdout}'}\\n${'${result.stderr}'}\`);
  } finally {
    rmSync(fixture.root, {recursive: true, force: true});
  }
});
`;
  }
  write(p, s);
}

// ---------------------------------------------------------------------------
// 4) Current Thursday reel: 3-frame cover + six genuinely different techniques.
// ---------------------------------------------------------------------------
const indexPath = resolve(REEL, '03-szenen/scene-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const scenes = index.scenes;
const byId = (id) => scenes.find((s) => s.id === id);

index.coverHookContract = {
  ...(index.coverHookContract ?? {}),
  titleHoldMinFrames: 3,
  coverFlashFrames: 3,
  coverFlashSeconds: 0.1,
  voiceoverForbiddenDuringScene01: true,
  audioStartsAtFrame: 3,
  audioStartsFromSceneId: 'scene-02',
};
index.phase1AnimationCode = {
  ...(index.phase1AnimationCode ?? {}),
  requirePremiumPhysicalStage: false,
  requirePhysicalObjects: false,
  creativeRemotionFreedom: true,
  customCompositionAllowed: true,
  physicalPrimitivesOptional: true,
  safeStageRequired: true,
  visualTechniqueIdRequired: true,
  uniqueVisualTechniquePerAnimationRequired: true,
};

const s1 = byId('scene-01');
Object.assign(s1, {
  durationFrames: 3,
  plannedDurationSeconds: 0.1,
  targetSeconds: 0.1,
  coverOnly: true,
  voiceoverEnabled: false,
  audioTrigger: '',
  visualBeats: [{id:'scene-01-cover-flash',kind:'image',voiceText:'',visualChange:'Für exakt drei Frames sind nur das Hero-Bild und der exakte Reel-Titel sichtbar.',startSecond:0,endSecond:0.1}],
});

const s2 = byId('scene-02');
for (const key of ['googleFlowFileName','objectLabels','expectedVisual','imagePresentation']) delete s2[key];
Object.assign(s2, {
  type:'animation',
  durationFrames:168,
  plannedDurationSeconds:5.6,
  targetSeconds:5.6,
  headline:'Kleine Rate – großer Rest',
  icon:'repeat',
  planFile:'EINZELNE-SZENEN/scene-02/remotion.md',
  animationSourceFile:'EINZELNE-SZENEN/scene-02/animation.tsx',
  animationExport:'Scene02Animation',
  animationIntent:'Ein mechanischer Rückzahlungshebel kippt von Vollzahlung auf Teilzahlung; nur eine kleine Rate löst sich, während ein großer Restkörper sichtbar bestehen bleibt.',
  animationQualityLock:'finanzneo-phase1-animation-code-v1',
  animationPremiumVisualLock:'finanzneo-premium-physical-animation-v2',
  animationTechniqueId:'mechanical-lever-reveal',
  audioTrigger:'Eine kleine Kreditkartenrate klingt bequem – kann aber teuer werden. Der entscheidende Punkt ist die Teilzahlung.',
  mainIdea:'Ein physischer Rückzahlungshebel macht sichtbar: Bei Teilzahlung verschwindet nur eine kleine Rate, der große Rest bleibt.',
  visualBeats:[
    {id:'scene-02-beat-01',kind:'animation',voiceText:'Eine kleine Kreditkartenrate klingt bequem – kann aber teuer werden.',visualChange:'Eine Kreditkarte steht vor einem großen offenen Restkörper; eine kleine Monatsrate wirkt im Vordergrund bequem und harmlos.',startSecond:0,endSecond:2.8},
    {id:'scene-02-beat-02',kind:'animation',voiceText:'Der entscheidende Punkt ist die Teilzahlung.',visualChange:'Ein mechanischer Hebel kippt deutlich auf TEILZAHLUNG; die kleine Rate löst sich ab, während der große Rest sichtbar verriegelt bleibt.',startSecond:2.8,endSecond:5.6},
  ],
});

const techniqueByScene = {
  'scene-02':'mechanical-lever-reveal',
  'scene-03':'svg-payment-wipe',
  'scene-05':'debt-layer-extrusion',
  'scene-07':'clip-slice-principal',
  'scene-09':'purchase-drop-vessel',
  'scene-14':'perspective-month-tunnel',
};
for (const [id, technique] of Object.entries(techniqueByScene)) {
  byId(id).animationTechniqueId = technique;
}

byId('scene-03').visualBeats = [
  {id:'scene-03-beat-01',kind:'animation',voiceText:'Bei Vollzahlung wird der offene Kartenbetrag',visualChange:'Eine große 600-Euro-Abrechnung steht vollständig offen; der Abrechnungstermin rastet sichtbar ein.',startSecond:0,endSecond:1.25},
  {id:'scene-03-beat-02',kind:'animation',voiceText:'zum Abrechnungstermin vollständig ausgeglichen.',visualChange:'Ein grüner Transfer-Wipe fährt vollständig über die Abrechnung und löscht den offenen Betrag sichtbar bis 0 Euro.',startSecond:1.25,endSecond:3.1},
  {id:'scene-03-beat-03',kind:'animation',voiceText:'Vollständig ausgeglichen.',visualChange:'Die Abrechnung bleibt stabil auf 0 Euro / BEZAHLT.',startSecond:3.1,endSecond:4.0},
];
byId('scene-05').visualBeats = [
  {id:'scene-05-beat-01',kind:'animation',voiceText:'Auf den restlichen offenen Betrag',visualChange:'Ein massiver 500-Euro-Restblock bleibt sichtbar bestehen.',startSecond:0,endSecond:1.25},
  {id:'scene-05-beat-02',kind:'animation',voiceText:'können je nach Vertrag',visualChange:'Der Kalender klappt in den nächsten Monat und der Restblock bleibt unverändert stehen.',startSecond:1.25,endSecond:2.45},
  {id:'scene-05-beat-03',kind:'animation',voiceText:'Zinsen anfallen.',visualChange:'Eine neue rot-orange Kostenschicht wächst physisch auf den offenen Restblock.',startSecond:2.45,endSecond:4.0},
];
byId('scene-07').visualBeats = [
  {id:'scene-07-beat-01',kind:'animation',voiceText:'500 Euro bleiben offen.',visualChange:'Ein 600-Euro-Schuldenkörper wird an der 100-Euro-Stelle sichtbar durchschnitten.',startSecond:0,endSecond:1.45},
  {id:'scene-07-beat-02',kind:'animation',voiceText:'Die 100 Euro sind weg.',visualChange:'Das kleine 100-Euro-Stück löst sich räumlich und fällt aus der Komposition; der große 500-Euro-Rest bleibt.',startSecond:1.45,endSecond:2.55},
  {id:'scene-07-beat-03',kind:'animation',voiceText:'Auf diesen Rest können weitere Zinsen kommen.',visualChange:'Auf dem verbleibenden 500-Euro-Körper setzt sich eine zusätzliche Warnschicht sichtbar oben drauf.',startSecond:2.55,endSecond:4.0},
];
byId('scene-09').visualBeats = [
  {id:'scene-09-beat-01',kind:'animation',voiceText:'Der offene Saldo',visualChange:'Ein transparenter Schuldenbehälter steht bereits bei 500 Euro.',startSecond:0,endSecond:0.85},
  {id:'scene-09-beat-02',kind:'animation',voiceText:'kann zusätzlich',visualChange:'Ein neuer Einkauf fällt als konkretes Objekt von oben in den Behälter.',startSecond:0.85,endSecond:1.75},
  {id:'scene-09-beat-03',kind:'animation',voiceText:'wachsen.',visualChange:'Der Füllstand schießt sichtbar auf 620 Euro und hält.',startSecond:1.75,endSecond:2.8},
];
byId('scene-14').visualBeats = [
  {id:'scene-14-beat-01',kind:'animation',voiceText:'teuer kann sie werden, wenn aus einem Einkauf',visualChange:'Ein einzelner Einkauf bewegt sich in einen räumlichen Zeittunnel hinein.',startSecond:0,endSecond:1.45},
  {id:'scene-14-beat-02',kind:'animation',voiceText:'mehrere Monate',visualChange:'MONAT 1 und MONAT 2 ziehen als große perspektivische Tore am offenen Einkauf vorbei; die Belastung bleibt angekettet.',startSecond:1.45,endSecond:2.9},
  {id:'scene-14-beat-03',kind:'animation',voiceText:'offene Schulden werden.',visualChange:'MONAT 3 rastet ein; die Kamera stoppt auf dem weiterhin offenen Einkauf und dem Endhinweis MEHRERE MONATE OFFEN.',startSecond:2.9,endSecond:4.2},
];

index.imageSceneCount = scenes.filter((s) => s.type === 'image').length;
index.animationSceneCount = scenes.filter((s) => s.type === 'animation').length;
let cursor = 0;
for (const scene of scenes) {
  scene.startFrame = cursor;
  cursor += Number(scene.durationFrames || 0);
}
write(indexPath, JSON.stringify(index, null, 2));

// Remove old Flow image job for scene-02.
const oldScene2Prompt = scenePath('scene-02','bildprompt.txt');
if (existsSync(oldScene2Prompt)) rmSync(oldScene2Prompt);

const animationSources = {
'scene-02': `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: repayment-mode-lever
 * VISUAL_TECHNIQUE_ID: mechanical-lever-reveal
 * PRIMARY_ACTION: Ein großer mechanischer Rückzahlungshebel kippt sichtbar auf Teilzahlung; eine kleine Rate löst sich ab, während der deutlich größere Restkörper verriegelt stehen bleibt.
 * ANIMATION_NARRATIVE
 * START: Eine stylisierte Kreditkarte steht vor einem großen offenen Restkörper; der Hebel steht noch neutral zwischen Vollzahlung und Teilzahlung.
 * MECHANISM: Der Hebel kippt kräftig zu TEILZAHLUNG, ein kleines 100-Euro-Rateplättchen fährt heraus und der große Restkörper klappt gleichzeitig sichtbar auf.
 * RESULT: Kleine Rate und großer offener Rest stehen gleichzeitig im Bild; TEILZAHLUNG bleibt mechanisch eingerastet.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Der mechanische Hebel und der dahinter aufklappende Restkörper tragen die Aussage wie eine physische Maschine statt wie App-UI.
 * SUPPORT: Kreditkartenkörper und kleines Rateplättchen verankern die Finanzsituation; Labels bleiben kurz.
 * MATERIAL: Dunkles Metall, Emerald am Vollzahlungsende, Gold an der kleinen Rate und warmes Rot am offenen Rest.
 * DEPTH: Karte vorne links, Hebel zentral, großer Restkörper klappt aus der Tiefe rechts auf und erzeugt einen klaren Größenkontrast.
 */
export const RESULT_HOLD_FRAMES = 24;
${clamp}
export const Scene02Animation: React.FC<{durationFrames?:number}> = ({durationFrames=168}) => {
  const frame = useCurrentFrame();
  const cardIn = interpolate(frame,[2,24],[0,1],clamp);
  const lever = interpolate(frame,[42,92],[0,1],clamp);
  const restOpen = interpolate(frame,[70,122],[0,1],clamp);
  const rateOut = interpolate(frame,[82,126],[0,1],clamp);
  const result = interpolate(frame,[124,Math.max(132,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:95,top:535,width:890,height:650,perspective:1300,transformStyle:'preserve-3d'}}>
      <div style={{position:'absolute',left:15,top:130,width:360,height:220,borderRadius:34,background:'linear-gradient(145deg,#21342c,#0d1713)',border:'2px solid rgba(255,255,255,.22)',boxShadow:'0 35px 70px rgba(0,0,0,.5)',transform:'translateX(' + ((1-cardIn)*-90) + 'px) rotateY(' + ((1-cardIn)*18) + 'deg)',opacity:cardIn}}>
        <div style={{position:'absolute',left:34,top:38,width:72,height:52,borderRadius:12,background:ANIMATION_COLORS.money}} />
        <div style={{position:'absolute',left:34,bottom:34,fontSize:31,fontWeight:900,color:'white'}}>KREDITKARTE</div>
      </div>
      <div style={{position:'absolute',left:390,top:88,width:430,height:390,borderRadius:44,border:'3px solid rgba(255,255,255,.18)',background:'linear-gradient(160deg,#202520,#111411)',boxShadow:'0 40px 80px rgba(0,0,0,.55)',transform:'rotateY(' + (-8+restOpen*4) + 'deg)'}}>
        <div style={{position:'absolute',left:55,right:55,top:70,height:18,borderRadius:10,background:'rgba(255,255,255,.12)'}} />
        <div style={{position:'absolute',left:72,top:126,fontSize:27,fontWeight:850,color:'white'}}>VOLLZAHLUNG</div>
        <div style={{position:'absolute',right:55,top:126,fontSize:27,fontWeight:850,color:ANIMATION_COLORS.warning}}>TEILZAHLUNG</div>
        <div style={{position:'absolute',left:200,top:172,width:34,height:150,borderRadius:17,background:'#d9d1be',transformOrigin:'50% 88%',transform:'rotate(' + (-34+lever*68) + 'deg)',boxShadow:'0 14px 24px rgba(0,0,0,.38)'}}><div style={{position:'absolute',left:-19,top:-32,width:72,height:72,borderRadius:'50%',background:lever>.55?ANIMATION_COLORS.warning:ANIMATION_COLORS.focus,border:'5px solid rgba(255,255,255,.45)'}} /></div>
      </div>
      <div style={{position:'absolute',left:535,top:438,width:330,height:150,borderRadius:30,background:ANIMATION_COLORS.warning,boxShadow:'0 25px 55px rgba(0,0,0,.48)',transform:'translateZ(' + (restOpen*70) + 'px) scaleX(' + (0.25+restOpen*0.75) + ')',transformOrigin:'0 50%',opacity:restOpen}}><div style={{padding:'34px 36px',fontSize:34,fontWeight:950,color:'white'}}>GROSSER REST OFFEN</div></div>
      <div style={{position:'absolute',left:405+rateOut*115,top:505-rateOut*85,width:150,height:92,borderRadius:24,background:ANIMATION_COLORS.money,boxShadow:'0 20px 36px rgba(0,0,0,.42)',opacity:rateOut,transform:'rotate(' + (-8+rateOut*10) + 'deg)'}}><div style={{padding:22,fontSize:31,fontWeight:950}}>100 € RATE</div></div>
      <div style={{position:'absolute',left:560,top:600,fontSize:31,fontWeight:950,color:ANIMATION_COLORS.warning,opacity:result}}>TEILZAHLUNG EINGESTELLT</div>
    </div>
  </AnimationStage>;
};`,
'scene-03': `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: full-payment-clears-statement
 * VISUAL_TECHNIQUE_ID: svg-payment-wipe
 * PRIMARY_ACTION: Eine breite Transferwelle wischt die komplette offene Abrechnung physisch von 600 Euro auf 0 Euro frei und hinterlässt einen vollständig bezahlten Endzustand.
 * ANIMATION_NARRATIVE
 * START: Eine große stilisierte Kartenabrechnung zeigt 600 Euro offen; der Abrechnungstermin ist als eingelassene Markierung sichtbar.
 * MECHANISM: Eine Emerald-Transferwelle zieht von links nach rechts über die gesamte Abrechnung und reduziert den offenen Wert entlang derselben Bewegung.
 * RESULT: Der Wipe endet vollständig rechts; 0 Euro und BEZAHLT bleiben stabil sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die große Abrechnung und die einmalige vollflächige SVG-Wipe-Bewegung tragen die komplette Aussage.
 * SUPPORT: Ein kompakter Terminmarker verankert den Zeitpunkt; keine Münz- oder Kartenreihe ist nötig.
 * MATERIAL: Ivory-Papier, Emerald-Transferfläche, weißer Betrag und ein klarer grüner Endstempel.
 * DEPTH: Abrechnung liegt als großes Blatt in leichter Perspektive; die Wipe-Fläche läuft wie eine physische Transferfolie darüber.
 */
export const RESULT_HOLD_FRAMES = 24;
${clamp}
export const Scene03Animation: React.FC<{durationFrames?:number}> = ({durationFrames=120}) => {
  const frame = useCurrentFrame();
  const sheetIn = interpolate(frame,[2,18],[0,1],clamp);
  const wipe = interpolate(frame,[24,82],[0,1],clamp);
  const amountSettle = interpolate(frame,[55,88],[0,1],clamp);
  const stamp = interpolate(frame,[86,Math.max(94,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const amount = Math.round(600*(1-amountSettle));
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:135,top:520,width:810,height:610,perspective:1400}}>
      <div style={{position:'absolute',left:70,top:55,width:670,height:450,borderRadius:34,background:'#eee8db',color:'#182019',boxShadow:'0 42px 75px rgba(0,0,0,.55)',transform:'translateY(' + ((1-sheetIn)*55) + 'px) rotateX(5deg) rotateY(-4deg)',opacity:sheetIn,overflow:'hidden'}}>
        <div style={{padding:'48px 52px',fontSize:31,fontWeight:900}}>KARTENABRECHNUNG</div>
        <div style={{position:'absolute',left:52,top:136,fontSize:75,fontWeight:950,color:amount===0?ANIMATION_COLORS.focus:ANIMATION_COLORS.warning}}>{amount} €</div>
        <div style={{position:'absolute',left:52,bottom:54,fontSize:26,fontWeight:850}}>ABRECHNUNGSTERMIN</div>
        <svg width="670" height="450" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
          <rect x={-690+wipe*690} y="0" width="690" height="450" fill={ANIMATION_COLORS.focus} opacity={0.28+wipe*0.18}/>
          <line x1={-15+wipe*690} y1="0" x2={-15+wipe*690} y2="450" stroke={ANIMATION_COLORS.focus} strokeWidth="18" opacity={wipe}/>
        </svg>
        <div style={{position:'absolute',right:45,bottom:42,padding:'14px 22px',border:'5px solid '+ANIMATION_COLORS.focus,borderRadius:14,color:ANIMATION_COLORS.focus,fontSize:31,fontWeight:950,transform:'rotate(-8deg) scale(' + stamp + ')',opacity:stamp}}>BEZAHLT</div>
      </div>
    </div>
  </AnimationStage>;
};`,
'scene-05': `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: interest-accrues-on-open-balance
 * VISUAL_TECHNIQUE_ID: debt-layer-extrusion
 * PRIMARY_ACTION: Ein massiver 500-Euro-Restblock bleibt über einen Monatswechsel stehen, während eine neue rot-orange Kostenschicht sichtbar auf seiner Oberseite anwächst.
 * ANIMATION_NARRATIVE
 * START: Ein dicker 500-Euro-Restkörper steht allein vor dem ersten Monatsmarker.
 * MECHANISM: Der Monatsmarker klappt räumlich zu Monat zwei um; der Restkörper bleibt exakt bestehen und eine zusätzliche Schicht extrudiert nach oben.
 * RESULT: Der ursprüngliche Rest plus zusätzliche Kostenschicht bleiben gemeinsam als höhere Belastung sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Ein großer extrudierter Schuldenkörper zeigt die verbleibende Hauptschuld körperlich und ohne Dashboard-Sprache.
 * SUPPORT: Ein einzelner 3D-Monatsflip erklärt nur den Zeitablauf; die wachsende Schicht trägt die Kostenfolge.
 * MATERIAL: Warme Ivory-Kanten am Restkörper, Rot-Orange für offene Schuld, Gold für mögliche Zusatzkosten.
 * DEPTH: Der Schuldenblock liegt tief im Raum; Monatsplatte klappt dahinter, Kostenschicht wächst sichtbar in Z-Richtung nach oben.
 */
export const RESULT_HOLD_FRAMES = 24;
${clamp}
export const Scene05Animation: React.FC<{durationFrames?:number}> = ({durationFrames=120}) => {
  const frame = useCurrentFrame();
  const blockIn = interpolate(frame,[2,20],[0,1],clamp);
  const monthFlip = interpolate(frame,[28,68],[0,1],clamp);
  const layerGrow = interpolate(frame,[58,98],[0,1],clamp);
  const result = interpolate(frame,[94,Math.max(100,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:120,top:505,width:840,height:650,perspective:1200,transformStyle:'preserve-3d'}}>
      <div style={{position:'absolute',left:75,top:105,width:220,height:260,transformStyle:'preserve-3d',transform:'rotateY(' + (monthFlip*90) + 'deg)'}}>
        <div style={{position:'absolute',inset:0,borderRadius:26,background:'#eee8db',color:'#182019',backfaceVisibility:'hidden',boxShadow:'0 28px 55px rgba(0,0,0,.45)'}}><div style={{paddingTop:72,textAlign:'center',fontSize:34,fontWeight:950}}>MONAT 1</div></div>
        <div style={{position:'absolute',inset:0,borderRadius:26,background:'#d8d1c3',color:'#182019',transform:'rotateY(180deg)',backfaceVisibility:'hidden',boxShadow:'0 28px 55px rgba(0,0,0,.45)'}}><div style={{paddingTop:72,textAlign:'center',fontSize:34,fontWeight:950}}>MONAT 2</div></div>
      </div>
      <div style={{position:'absolute',left:315,top:175,width:445,height:270,borderRadius:34,background:ANIMATION_COLORS.warning,boxShadow:'0 38px 70px rgba(0,0,0,.55)',transform:'translateY(' + ((1-blockIn)*55) + 'px) rotateX(7deg) rotateY(-5deg) scale(' + (0.9+blockIn*0.1) + ')',opacity:blockIn}}>
        <div style={{padding:'70px 58px',fontSize:66,fontWeight:950,color:'white'}}>500 € REST</div>
        <div style={{position:'absolute',left:18,right:18,bottom:-18,height:18,borderRadius:'0 0 18px 18px',background:'#671b14'}} />
        <div style={{position:'absolute',left:0,right:0,top:-90*layerGrow,height:90*layerGrow,borderRadius:'26px 26px 8px 8px',background:ANIMATION_COLORS.money,boxShadow:'0 -18px 36px rgba(213,167,42,.20)',overflow:'hidden'}}><div style={{padding:20,textAlign:'center',fontSize:27,fontWeight:950,opacity:result}}>+ ZINSEN MÖGLICH</div></div>
      </div>
    </div>
  </AnimationStage>;
};`,
'scene-07': `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: partial-payment-leaves-principal
 * VISUAL_TECHNIQUE_ID: clip-slice-principal
 * PRIMARY_ACTION: Ein einziger 600-Euro-Schuldenkörper wird sichtbar bei 100 Euro durchschnitten; das kleine bezahlte Stück löst sich ab, der große 500-Euro-Rest bleibt und erhält anschließend eine Zusatzkostenschicht.
 * ANIMATION_NARRATIVE
 * START: Ein zusammenhängender 600-Euro-Körper füllt die Bühne und zeigt den gesamten offenen Betrag.
 * MECHANISM: Eine helle Schnittkante fährt durch den Körper; der 100-Euro-Teil trennt sich nach vorne links, während der 500-Euro-Rest an Ort und Stelle bleibt.
 * RESULT: Der 500-Euro-Rest dominiert stabil das Bild und eine dünne Warnschicht zeigt mögliche weitere Zinsen auf genau diesem Rest.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die echte Slice-Transformation eines einzigen Schuldenkörpers erklärt Teilzahlung und Rest ohne Karten-, Balken- oder Konten-Wiederholung.
 * SUPPORT: Betragslabels sitzen direkt auf den beiden Körperteilen; eine dünne Zusatzschicht ergänzt nur die Zinsfolge.
 * MATERIAL: Gold markiert den entfernten 100-Euro-Teil, warmes Rot den Rest und Ivory die sichtbare Schnittkante.
 * DEPTH: Das kleine Stück fährt deutlich nach vorne links aus der Ebene; der Rest stabilisiert leicht nach hinten rechts und bleibt größer.
 */
export const RESULT_HOLD_FRAMES = 24;
${clamp}
export const Scene07Animation: React.FC<{durationFrames?:number}> = ({durationFrames=120}) => {
  const frame = useCurrentFrame();
  const bodyIn = interpolate(frame,[2,18],[0,1],clamp);
  const cut = interpolate(frame,[22,54],[0,1],clamp);
  const detach = interpolate(frame,[48,82],[0,1],clamp);
  const interestLayer = interpolate(frame,[78,102],[0,1],clamp);
  const result = interpolate(frame,[96,Math.max(102,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:120,top:570,width:840,height:520,perspective:1200,opacity:bodyIn}}>
      <div style={{position:'absolute',left:45-detach*105,top:120+detach*45,width:150,height:270,borderRadius:30,background:ANIMATION_COLORS.money,boxShadow:'0 34px 65px rgba(0,0,0,.52)',transform:'rotateY(' + (-detach*22) + 'deg) rotateZ(' + (-detach*7) + 'deg)'}}><div style={{padding:'82px 26px',fontSize:38,fontWeight:950}}>100 €</div></div>
      <div style={{position:'absolute',left:195+detach*35,top:120,width:600,height:270,borderRadius:30,background:ANIMATION_COLORS.warning,boxShadow:'0 38px 72px rgba(0,0,0,.55)',transform:'scale(' + (0.96+detach*0.04) + ')'}}><div style={{padding:'78px 50px',fontSize:64,fontWeight:950,color:'white'}}>500 € REST</div><div style={{position:'absolute',left:0,right:0,top:-54*interestLayer,height:54*interestLayer,borderRadius:'20px 20px 6px 6px',background:'#d48a25'}} /></div>
      <div style={{position:'absolute',left:188,top:95,width:10,height:320,background:'#fff5d8',boxShadow:'0 0 24px rgba(255,245,216,.7)',opacity:cut,transform:'scaleY(' + cut + ')'}} />
      <div style={{position:'absolute',left:475,top:420,fontSize:29,fontWeight:950,color:ANIMATION_COLORS.warning,opacity:result}}>REST BLEIBT OFFEN</div>
    </div>
  </AnimationStage>;
};`,
'scene-09': `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: new-purchase-adds-to-card-balance
 * VISUAL_TECHNIQUE_ID: purchase-drop-vessel
 * PRIMARY_ACTION: Ein konkretes Einkaufspaket fällt von oben in einen transparenten Schuldenbehälter und drückt dessen sichtbaren Füllstand von 500 Euro auf 620 Euro nach oben.
 * ANIMATION_NARRATIVE
 * START: Ein transparenter Kartensaldo-Behälter steht bereits sichtbar bei 500 Euro Füllstand.
 * MECHANISM: Ein neues 120-Euro-Einkaufspaket fällt physisch in den Behälter; beim Aufprall steigt der rote Füllkörper deutlich an.
 * RESULT: Der Behälter hält stabil bei 620 Euro und zeigt, dass der offene Saldo durch neue Käufe weiter wachsen kann.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Der transparente 3D-Behälter und der reale Fall des Einkaufspakets machen das Anwachsen körperlich sichtbar.
 * SUPPORT: 500- und 620-Euro-Markierungen erklären nur Start und Ergebnis; das fallende Paket trägt die Ursache.
 * MATERIAL: Glasartige helle Kontur, warmes Rot für offenen Saldo, Gold für das neue Einkaufspaket.
 * DEPTH: Behälter zentral vorne, Paket fällt aus oberer Tiefe hinein; Füllkörper wächst von unten und erzeugt klare Vertikalbewegung.
 */
export const RESULT_HOLD_FRAMES = 24;
${clamp}
export const Scene09Animation: React.FC<{durationFrames?:number}> = ({durationFrames=84}) => {
  const frame = useCurrentFrame();
  const vesselIn = interpolate(frame,[2,14],[0,1],clamp);
  const drop = interpolate(frame,[18,50],[0,1],clamp);
  const fill = interpolate(frame,[44,66],[0,1],clamp);
  const result = interpolate(frame,[62,Math.max(66,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const fillHeight = 260 + fill*115;
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:245,top:480,width:590,height:700,perspective:1200,opacity:vesselIn}}>
      <div style={{position:'absolute',left:95,top:145,width:400,height:455,border:'7px solid rgba(238,232,219,.8)',borderRadius:'36px 36px 70px 70px',boxShadow:'0 38px 70px rgba(0,0,0,.55), inset 0 0 24px rgba(255,255,255,.08)',overflow:'hidden',transform:'rotateX(3deg)'}}>
        <div style={{position:'absolute',left:0,right:0,bottom:0,height:fillHeight,background:ANIMATION_COLORS.warning,opacity:.88,transition:'none'}} />
        <div style={{position:'absolute',left:28,top:210-fill*85,fontSize:42,fontWeight:950,color:'white'}}>{fill>.55?'620 €':'500 €'}</div>
      </div>
      <div style={{position:'absolute',left:215,top:-30+drop*325,width:165,height:135,borderRadius:28,background:ANIMATION_COLORS.money,boxShadow:'0 26px 50px rgba(0,0,0,.48)',transform:'rotate(' + (-8+drop*13) + 'deg) scale(' + (1-drop*.08) + ')'}}><div style={{padding:'29px 22px',fontSize:27,fontWeight:950,textAlign:'center'}}>NEUER KAUF<br/>120 €</div></div>
      <div style={{position:'absolute',left:178,top:615,fontSize:30,fontWeight:950,color:ANIMATION_COLORS.warning,opacity:result}}>SALDO WÄCHST</div>
    </div>
  </AnimationStage>;
};`,
'scene-14': `import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: single-purchase-spans-multiple-months
 * VISUAL_TECHNIQUE_ID: perspective-month-tunnel
 * PRIMARY_ACTION: Ein einzelner offener Einkauf fährt durch einen räumlichen Tunnel aus drei großen Monatsportalen, bleibt dabei angekettet und erreicht Monat drei noch immer unbezahlt.
 * ANIMATION_NARRATIVE
 * START: Ein einzelner Einkauf steht im Vordergrund vor einem dunklen perspektivischen Zeittunnel.
 * MECHANISM: Drei Monatsportale bewegen sich nacheinander aus der Tiefe an der Kamera vorbei; der Einkauf bleibt über eine sichtbare Kette mit dem offenen Rest verbunden.
 * RESULT: Monat drei rastet groß im Vordergrund ein und derselbe Einkauf steht weiterhin mit dem Hinweis MEHRERE MONATE OFFEN da.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die Kamerafahrt durch den Monatskorridor erzeugt erstmals echte räumliche Zeitdramaturgie statt weiterer Karten-/Münzbewegungen.
 * SUPPORT: Der einzelne Einkauf und eine gespannte Verbindungslinie halten die Ursache über alle Monatsportale hinweg sichtbar.
 * MATERIAL: Ivory-Portale, goldener Einkauf, rot-orange offene Verbindung und Emerald nur für neutrale Monatsmarkierungen.
 * DEPTH: Portale starten stark verkleinert am Fluchtpunkt und wachsen beim Vorbeiziehen; Einkauf bleibt als Anker vorne und erzeugt Parallaxe.
 */
export const RESULT_HOLD_FRAMES = 24;
${clamp}
export const Scene14Animation: React.FC<{durationFrames?:number}> = ({durationFrames=126}) => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame,[8,88],[0,1],clamp);
  const purchaseIn = interpolate(frame,[2,18],[0,1],clamp);
  const chainTight = interpolate(frame,[28,92],[0,1],clamp);
  const finalLock = interpolate(frame,[88,Math.max(98,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const portal = (label, offset) => {
    const local = Math.max(0,Math.min(1,(travel-offset)/0.34));
    const scale = 0.22 + local*1.18;
    const y = 560 - local*170;
    return <div key={label} style={{position:'absolute',left:270,top:y,width:540,height:370,border:'10px solid #e9e1cf',borderRadius:48,transform:'perspective(900px) translateZ(' + (local*220) + 'px) scale(' + scale + ')',opacity:Math.min(1,local*2),boxShadow:'0 36px 76px rgba(0,0,0,.6)'}}><div style={{position:'absolute',top:28,left:0,right:0,textAlign:'center',fontSize:34,fontWeight:950,color:'white'}}>{label}</div></div>;
  };
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',inset:0,perspective:1200,overflow:'hidden'}}>
      {portal('MONAT 1',0.00)}{portal('MONAT 2',0.28)}{portal('MONAT 3',0.56)}
      <svg width="1080" height="1080" style={{position:'absolute',left:0,top:320,pointerEvents:'none'}}><line x1="540" y1="600" x2={540+chainTight*220} y2={600-chainTight*185} stroke={ANIMATION_COLORS.warning} strokeWidth="12" strokeDasharray="20 16" opacity={chainTight}/></svg>
      <div style={{position:'absolute',left:350,top:760-purchaseIn*40,width:380,height:210,borderRadius:38,background:ANIMATION_COLORS.money,boxShadow:'0 36px 70px rgba(0,0,0,.55)',opacity:purchaseIn,transform:'rotateX(7deg) scale(' + (0.9+purchaseIn*.1) + ')'}}><div style={{padding:'55px 42px',fontSize:39,fontWeight:950,textAlign:'center'}}>EIN EINKAUF<br/>WEITER OFFEN</div></div>
      <div style={{position:'absolute',left:325,top:1030,fontSize:34,fontWeight:950,color:ANIMATION_COLORS.warning,opacity:finalLock}}>MEHRERE MONATE OFFEN</div>
    </div>
  </AnimationStage>;
};`,
};

for (const [id, source] of Object.entries(animationSources)) write(scenePath(id,'animation.tsx'), source);

const remotionSpecs = {
  'scene-02':['Kleine Rate – großer Rest','repeat','mechanical-lever-reveal','Mechanischer Rückzahlungshebel kippt auf Teilzahlung; kleine Rate fährt heraus, großer Rest klappt auf.'],
  'scene-03':['Vollzahlung gleicht alles aus','check','svg-payment-wipe','Eine vollflächige SVG-Transferwelle wischt die offene Abrechnung komplett auf 0 Euro.'],
  'scene-05':['Auf dem Rest können Zinsen laufen','percent','debt-layer-extrusion','Ein massiver Restblock bleibt über den Monatsflip stehen; eine zusätzliche Kostenschicht extrudiert oben heraus.'],
  'scene-07':['500 Euro bleiben offen','coins','clip-slice-principal','Ein 600-Euro-Körper wird bei 100 Euro durchschnitten; 100 lösen sich ab, 500 bleiben körperlich stehen.'],
  'scene-09':['Der offene Saldo kann wachsen','chart-up','purchase-drop-vessel','Ein neuer Einkauf fällt in einen transparenten Schuldenbehälter und hebt den Füllstand von 500 auf 620 Euro.'],
  'scene-14':['Teuer wird es über mehrere Monate','clock','perspective-month-tunnel','Ein offener Einkauf fährt durch einen perspektivischen Tunnel aus mehreren Monatsportalen und bleibt bis Monat drei offen.'],
};
for (const [id,[headline,icon,technique,mechanism]] of Object.entries(remotionSpecs)) {
  write(scenePath(id,'remotion.md'), `# Remotion-Spezifikation ${id}

**Zwischenüberschrift:** ${headline}
**Icon:** ${icon}
**Kanonische Codequelle:** animation.tsx
**Quality Lock:** finanzneo-phase1-animation-code-v1
**Visuelle Zielwelt:** finanzneo-stylized-3d-animated-black-v9
**VISUAL_TECHNIQUE_ID:** ${technique}
**Remotion Freedom:** freie React/SVG/CSS-3D-Komposition; Physical*-Primitives sind optional.
**Stage:** AnimationStage oder PremiumPhysicalStage transparent über zentralem #000000 Reel-Canvas; sichtbar hart Y320–1400.

## STARTZUSTAND
${byId(id).visualBeats[0].visualChange}

## SICHTBARER MECHANISMUS
${mechanism}

## ERGEBNIS
${byId(id).visualBeats.at(-1).visualChange}

## RESULT HOLD
Mindestens 15 Frames stabil.

## VERBOTEN
Keine Wiederholung der Haupttechnik einer anderen Animationsszene, kein Dashboard/App-UI als Ersatz für die Geschichte, kein generischer Progressbar-Mechanismus, keine dekorativen Hintergrundeffekte.
`);
}

write(scenePath('scene-01','szene.md'), `# scene-01

**Typ:** image / Cover-Flash
**Dauer:** exakt 3 Frames = 0,1 s bei 30 fps
**Cover:** nur Hero-Bild + exakter Reel-Titel
**Untertitel:** aus
**Voiceover:** aus; Audio startet ab Frame 3 mit scene-02
**Google-Flow-Dateiname:** ${s1.googleFlowFileName}
`);
write(scenePath('scene-02','szene.md'), `# scene-02

**Typ:** animation
**Zwischenüberschrift:** ${s2.headline}
**Icon:** ${s2.icon}
**Sprechtext:** ${s2.audioTrigger}
**Google Flow:** KEIN Bild 02; Nummer 02 bleibt reserviert.
**Animation:** remotion.md + animation.tsx, VISUAL_TECHNIQUE_ID mechanical-lever-reveal.
`);

// Regenerate the Flow master strictly from actual image scenes; scene-02 is now animation.
const masterHeader = `FLOW_AGENT_PROTOCOL: finanzneo-flow-sequential-v1
FLOW_EXECUTION_MODE: finanzneo-flow-strict-single-job-v3
FLOW_STRUCTURE_LOCK: finanzneo-flow-structure-lock-v2
FLOW_STATE_MACHINE: finanzneo-flow-state-machine-v1

STRICT SINGLE-JOB STATE MACHINE — VERBINDLICH
DIES IST KEIN BATCH-AUFTRAG
MAXIMAL 1 LAUFENDER BILDGENERIERUNGSJOB GLEICHZEITIG
ALLE SPÄTEREN BILDBLÖCKE SIND GESPERRT, bis das aktuelle Bild vollständig zurückgegeben, exakt umbenannt und per QA geprüft wurde.
WARTE NIEMALS AUF "WEITER". Nach erfolgreicher QA automatisch fortfahren.
MAX_CONCURRENT_GENERATIONS = 1
FINAL_IMAGE_DIRECTORY: 03-szenen/00-ALLE-BILDER-HIER-REIN/
COVER = SZENE 01
KEIN separates Cover erzeugen
KEIN Bild 00 erzeugen
`;
const sections = scenes.map((scene) => {
  if (scene.type === 'image') return `## ${scene.id}\n\n${readFileSync(scenePath(scene.id,'bildprompt.txt'),'utf8').trim()}`;
  return `## ${scene.id}\n\nREMOTION-ANIMATION — KEIN BILD ${scene.id.slice(-2)} ERZEUGEN. Nummer ${scene.id.slice(-2)} bleibt reserviert.\nVISUAL_TECHNIQUE_ID: ${scene.animationTechniqueId}`;
}).join('\n\n---\n\n');
write(resolve(REEL,'03-szenen/alle-bildprompts.txt'), masterHeader + '\n' + sections + '\n\nABSCHLUSS:\nBeende erst, wenn jedes erwartete Bild einzeln erzeugt, exakt umbenannt und nach V9 geprüft wurde.\n');

// Project docs / timing.
const scenePlanLines = scenes.map((scene) => {
  const voice = scene.coverOnly ? 'COVER OHNE VOICEOVER' : scene.audioTrigger;
  return `- ${scene.id} | ${scene.type} | ${scene.headline} | ${scene.icon} | ${Number(scene.plannedDurationSeconds).toFixed(1)} s | ${voice}`;
});
write(resolve(REEL,'05-projektdateien/szenenplan.md'), `# SZENENPLAN

IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v2

Cover-Flash: scene-01 dauert exakt 3 Frames = 0,1 s und zeigt nur Hero-Bild + Titel. Voiceover und Captions starten ab scene-02.
REMOTION_FREEDOM: Jede Animationsszene nutzt eine eigene visuelle Haupttechnik; Physical*-Primitives sind optional.

${scenePlanLines.join('\n')}
`);

let visual = `# Visual Beats\n\nVISUAL_BEAT_CONTRACT: finanzneo-visual-beats-v2\n\nLieber ein zusätzliches gutes Bild planen als einen neuen konkreten Gedanken in ein überladenes Stillbild zu pressen.\n\nCover-Regel: scene-01 = 0,1 s / 3 Frames / kein Voiceover.\n\n`;
for (const scene of scenes) {
  visual += `## ${scene.id} — ${scene.headline}\n\nSprechtext: ${scene.coverOnly ? '— (Cover ohne Voiceover)' : scene.audioTrigger}\n\nDauer: ${scene.plannedDurationSeconds} s\n\n`;
  for (const [i,beat] of scene.visualBeats.entries()) visual += `- Beat ${i+1}: ${beat.voiceText || '—'} | Sichtbar: ${beat.visualChange} | ${beat.startSecond}–${beat.endSecond} s\n`;
  visual += '\n';
}
write(resolve(REEL,'05-projektdateien/visual-beats.md'), visual);

const timeline = JSON.parse(readFileSync(resolve(REEL,'05-projektdateien/timeline.json'),'utf8'));
timeline.scenes = scenes.map((scene) => ({
  id:scene.id,
  type:scene.type,
  plannedDurationSeconds:scene.plannedDurationSeconds,
  headline:scene.headline,
  voiceText:scene.coverOnly ? '' : scene.audioTrigger,
  timingStatus:'planned-until-real-word-timestamps',
}));
write(resolve(REEL,'05-projektdateien/timeline.json'), JSON.stringify(timeline,null,2));

write(resolve(REEL,'05-projektdateien/animationen.md'), `# ANIMATIONEN — REMOTION FREEDOM

Phase 1 darf Remotion vollständig ausnutzen. Vorhandene Physical*-Primitives sind optionale Helfer, keine Pflicht.

Pflicht bleibt: Safe-Zone Y320–1400, klare Ursache/Wirkung, mehrere koordinierte Motion-Channels, eigene MECHANIC_ID + eigene VISUAL_TECHNIQUE_ID je Szene, stabiler Endzustand und Render-QA.

- scene-02 — mechanical-lever-reveal — mechanischer Rückzahlungshebel
- scene-03 — svg-payment-wipe — vollflächiger SVG-Transfer-Wipe
- scene-05 — debt-layer-extrusion — CSS-3D-Schuldenblock mit wachsender Kostenschicht
- scene-07 — clip-slice-principal — physischer Slice/Cutaway eines 600-Euro-Körpers
- scene-09 — purchase-drop-vessel — fallender Einkauf füllt einen transparenten Schuldenbehälter
- scene-14 — perspective-month-tunnel — perspektivische Kamerafahrt durch Monatsportale
`);

for (const rel of ['05-projektdateien/ANTIGRAVITY-AUFTRAG.md','05-projektdateien/technische-hinweise.md']) {
  const p = resolve(REEL,rel);
  let d = readFileSync(p,'utf8');
  d = d.replace(/Der Titel muss mindestens die ersten 30 Frames stabil lesbar sein[^\n]*/g, 'Scene-01 dauert exakt 3 Frames = 0,1 s. In allen drei Frames sind nur Hero-Bild + exakter Reel-Titel sichtbar.');
  d = d.replace(/Während scene-01 darf KEINE Caption-\/Subtitle-Komponente[^\n]*/g, 'Während scene-01 sind Caption, Subtitle und Voiceover gesperrt. Audio und Untertitel starten ab Frame 3 mit scene-02.');
  if (!d.includes('REMOTION_FREEDOM: unrestricted-explainer-v1')) d += '\n\nREMOTION_FREEDOM: unrestricted-explainer-v1\nAnimationsszenen dürfen eigene React-/SVG-/CSS-3D-/Mask-/Perspektiv-/Three.js-Techniken verwenden. Physical*-Primitives sind optional. Jede Szene braucht eine andere VISUAL_TECHNIQUE_ID.\n';
  write(p,d);
}
write(resolve(REEL,'05-projektdateien/cover-hook-qa.md'), `# Cover Hook QA

COVER_HOOK_CONTRACT: finanzneo-cover-hook-v2

- [ ] scene-01 dauert exakt 3 Frames = 0,1 s bei 30 fps
- [ ] Frame 0–2: Hero-Bild sichtbar
- [ ] Frame 0–2: exakter Reel-Titel sichtbar
- [ ] keine Untertitel / Captions
- [ ] kein normales Header-Icon
- [ ] keine Erklärung / CTA / Zusatzkarte
- [ ] kein Voiceover in Frame 0–2
- [ ] Voiceover startet ab Frame 3 mit scene-02
- [ ] cover.png kommt weiterhin aus finalem Frame 0
`);

// Add an explicit creative-freedom note to design-system docs without rewriting old history.
{
  const p = 'src/design-system/README.md';
  let d = read(p);
  const marker = '## Remotion Freedom — neue Animationsregel';
  if (!d.includes(marker)) d += `\n\n${marker}\n\nNeue Reel-Animationen sind **nicht** auf den Physical*-Katalog beschränkt. Die Komponenten bleiben wiederverwendbare Helfer, aber die visuelle Lösung darf frei aus React, SVG, CSS-3D, Masken/Clip-Paths, Perspektive/Kamera, Canvas oder Three.js aufgebaut werden. Entscheidend sind Erklärwert, Safe-Zone, eindeutige Ursache/Wirkung, eigene VISUAL_TECHNIQUE_ID je Szene und bestandene Render-QA. Wiederholung derselben visuellen Haupttechnik innerhalb eines Reels ist zu vermeiden.\n`;
  write(p,d);
}

console.log('✓ Cover auf exakt 3 Frames / 0,1 s umgestellt.');
console.log('✓ Scene-02 ist jetzt Animation; Voiceover startet erst nach dem Cover.');
console.log('✓ Sechs Animationsszenen nutzen sechs unterschiedliche VISUAL_TECHNIQUE_IDs.');
console.log('✓ Zentraler Validator erlaubt freie Remotion-Komposition ohne Physical*-Pflicht.');
