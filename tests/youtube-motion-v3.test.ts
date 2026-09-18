import assert from 'node:assert/strict';
import test from 'node:test';
import {YOUTUBE_MOTION_STANDARD_ID, YOUTUBE_VISUAL_ZONE, findYouTubeZoneEscapes, requiresYouTubeImage, requiresYouTubeMotion, validateYouTubeMotionMetadata, validateYouTubeMotionSource, validateYouTubeMotionVariety} from '../scripts/lib/youtube-motion-contract.mjs';
import {YOUTUBE_STYLE} from '../src/youtube/layout';

test('YouTube Motion V3 erlaubt Animation, Hybrid und Data ohne feste Animationsbibliothek', () => {
  assert.equal(YOUTUBE_MOTION_STANDARD_ID, 'finanzneo-youtube-motion-v3');
  assert.equal(requiresYouTubeMotion({type:'animation'}), true);
  assert.equal(requiresYouTubeMotion({type:'hybrid'}), false);
  assert.equal(requiresYouTubeMotion({type:'data'}), true);
  assert.equal(requiresYouTubeMotion({type:'image'}), false);
  assert.equal(requiresYouTubeImage({type:'image'}), true);
  assert.equal(requiresYouTubeImage({type:'hybrid'}), false);
  assert.equal(requiresYouTubeImage({type:'animation'}), false);
});

const motion = (overrides = {}) => ({
  id: 'visual-01',
  type: 'animation',
  viewerChange: 'Monatliche Einzahlungen erscheinen nacheinander und der Renditeanteil wächst sichtbar schneller.',
  animationIntent: 'Macht den Unterschied zwischen Einzahlungen und Rendite über Zeit sichtbar.',
  mechanicId: 'monthly-input-compound-growth',
  visualTechniqueId: 'spatial-time-layer-growth',
  techniqueDescription: 'Jahresebenen bauen sich in der Tiefe auf, während Einzahlungen eintreffen und der Renditebereich nichtlinear anwächst.',
  compositionFamilyId: 'camera-through-time-layers',
  toolStack: ['React Three Fiber', 'Remotion'],
  motionSignature: {
    camera: 'forward travel through depth layers',
    layout: 'stacked yearly planes in z-depth',
    transformation: 'nonlinear portfolio expansion around deposits',
  },
  animationSourceFile: '04-projekt/VISUALS/visual-01/animation.tsx',
  animationExport: 'Visual01Animation',
  motionChannels: ['Einzahlungen kommen hinzu', 'Renditebereich expandiert'],
  visualBeats: ['Erste Einzahlung', 'Rendite dominiert den Endwert'],
  repeatTechniqueReason: '',
  ...overrides,
});

test('Motion-V3-Metadaten erzwingen Viewer Change, konkrete Technik und Motion-Signatur', () => {
  assert.deepEqual(validateYouTubeMotionMetadata(motion()), []);
  const errors = validateYouTubeMotionMetadata(motion({viewerChange:'', toolStack:[], motionSignature:{camera:'',layout:'',transformation:''}}));
  assert.ok(errors.some((error) => error.includes('viewerChange')));
  assert.ok(errors.some((error) => error.includes('toolStack')));
  assert.ok(errors.some((error) => error.includes('motionSignature.camera')));
});

test('Composition Family ist offen und keine Whitelist', () => {
  assert.deepEqual(validateYouTubeMotionMetadata(motion({compositionFamilyId:'object-disassembly-through-tax-layers'})), []);
});

test('Doppelte Haupttechnik wird ohne Begründung blockiert', () => {
  const errors = validateYouTubeMotionVariety([
    motion({id:'visual-01'}),
    motion({
      id:'visual-02',
      mechanicId:'second-mechanic',
      techniqueDescription:'Andere konkrete Umsetzung.',
      motionSignature:{camera:'static',layout:'split-screen',transformation:'documents compare'},
    }),
  ]);
  assert.ok(errors.some((error) => error.includes('visualTechniqueId')));
});

test('Umbenannte Technik mit identischer echter Motion wird innerhalb der letzten vier Visuals blockiert', () => {
  const errors = validateYouTubeMotionVariety([
    motion({id:'visual-01'}),
    motion({
      id:'visual-02',
      mechanicId:'new-mechanic',
      visualTechniqueId:'completely-new-name',
      techniqueDescription:'Auch die Beschreibung wurde umbenannt.',
    }),
  ]);
  assert.ok(errors.some((error) => error.includes('motionSignature')));
});

test('Bewusst begründete Wiederholung bleibt möglich', () => {
  const errors = validateYouTubeMotionVariety([
    motion({id:'visual-01'}),
    motion({
      id:'visual-02',
      repeatTechniqueReason:'Direkter Vorher-Nachher-Vergleich: identische Kamera und Anordnung sind nötig, damit nur die Zustandsänderung verglichen wird.',
    }),
  ]);
  assert.deepEqual(errors, []);
});

test('Mehr als zwei gleiche freie Composition-Familien in Folge brauchen einen Grund', () => {
  const errors = validateYouTubeMotionVariety([
    motion({id:'visual-01', visualTechniqueId:'tech-1', mechanicId:'m1', techniqueDescription:'desc-1'}),
    motion({id:'visual-02', visualTechniqueId:'tech-2', mechanicId:'m2', techniqueDescription:'desc-2', motionSignature:{camera:'static',layout:'left-right',transformation:'reveal'}}),
    motion({id:'visual-03', visualTechniqueId:'tech-3', mechanicId:'m3', techniqueDescription:'desc-3', motionSignature:{camera:'orbit',layout:'centered',transformation:'assemble'}}),
  ]);
  assert.ok(errors.some((error) => error.includes('mehr als zwei Motion-Visuals')));
});

test('Bildsprache: Pfeile als Textzeichen gelten nicht als Visual', () => {
  const errors = validateYouTubeMotionSource(
    {id: 'visual-07', type: 'animation'},
    'const a = interpolate(f,[0,1],[0,1]); const b = spring({frame}); <div style={{transform:`translateX(${a}px)`}}>↗︎ mehr</div>',
  );
  assert.ok(errors.some((error) => error.includes('Pfeile oder Haken als Textzeichen')));
});

test('Bildsprache: eine Szene braucht zwei unabhängige Motion-Treiber', () => {
  const errors = validateYouTubeMotionSource(
    {id: 'visual-23', type: 'animation'},
    'const p = interpolate(frame,[0,90],[0,1]); <div style={{transform:`translateY(${p}px)`}}/>',
  );
  assert.ok(errors.some((error) => error.includes('zwei unabhängige Motion-Treiber')));
});

test('Bildsprache: reines Ein-/Ausblenden reicht für eine Animationsszene nicht', () => {
  const faded = 'const a = interpolate(f,[0,1],[0,1]); const b = spring({frame}); <div style={{opacity:a, transform:`scale(${b})`}}/>';
  const animation = validateYouTubeMotionSource({id: 'visual-01', type: 'animation'}, faded);
  assert.ok(animation.some((error) => error.includes('nur Ein-/Ausblenden und Zoom')));

  // Bei data trägt der Chart einen Teil der Aussage, die Bewegung hebt nur hervor.
  const data = validateYouTubeMotionSource({id: 'visual-08', type: 'data'}, faded);
  assert.ok(!data.some((error) => error.includes('nur Ein-/Ausblenden und Zoom')));
});

test('Bildsprache: eine echte Mechanik mit zwei Treibern passiert sauber', () => {
  const source = [
    'const flip = progressBetween(frame, durationInFrames, 0.1, 0.3);',
    'const settle = spring({frame: frame - 20, fps});',
    '<div style={{transform:`rotateX(${-82 * flip}deg) translateY(${settle}px)`}}>',
    '  <PhysicalCalendarPage x={200} y={300} month="Monat 1" />',
    '</div>',
  ].join('\n');
  assert.deepEqual(validateYouTubeMotionSource({id: 'visual-24', type: 'animation'}, source), []);
});

test('Zone: was oberhalb der Visualzone gezeichnet wird, wird gemeldet', () => {
  // Genau der Fehler aus dem Notgroschen-Video: eine Textzeile auf y 150. Die
  // Bühne clippt ab y 180, also war sie im Render abgeschnitten.
  const escapes = findYouTubeZoneEscapes(
    "<div style={{position:'absolute',left:250,top:150,fontSize:46}}>Gesetzliche Einlagensicherung</div>",
  );
  assert.equal(escapes.length, 1);
  assert.equal(escapes[0].top, 150);
});

test('Zone: ein Wert innerhalb der Zone ist kein Fund', () => {
  assert.deepEqual(
    findYouTubeZoneEscapes("<div style={{position:'absolute',left:250,top:320}}/>"),
    [],
  );
});

test('Zone: ein bewusst relativer Wert wird mit zone-ok stillgelegt', () => {
  assert.deepEqual(
    findYouTubeZoneEscapes("<div style={{position:'absolute',left:0,top:65}}/> // zone-ok: relativ zum Container"),
    [],
  );
});

test('Zone: die Prüfung nutzt dieselbe Grenze wie das Layout', () => {
  // YOUTUBE_VISUAL_ZONE ist eine Kopie, weil layout.ts TypeScript ist. Läuft sie
  // auseinander, prüft der Validator gegen eine Grenze, die es nicht mehr gibt.
  assert.equal(YOUTUBE_VISUAL_ZONE.top, YOUTUBE_STYLE.visual.top);
  assert.equal(YOUTUBE_VISUAL_ZONE.bottom, YOUTUBE_STYLE.visual.bottom);
});

test('Bildsprache: eine Animationsszene ohne reale Gegenstände wird abgelehnt', () => {
  // Die Texttafel aus visual-04: zwei Treiber, echte Transformation — und trotzdem
  // nur Text. Vorher lief so etwas durch.
  const source = [
    'const a = interpolate(frame,[0,60],[0,1]);',
    'const b = spring({frame, fps});',
    '<div style={{transform:`translateY(${a * 40}px) scale(${b})`}}>1.000 €</div>',
  ].join('\n');
  const errors = validateYouTubeMotionSource({id: 'visual-04', type: 'animation'}, source);
  assert.ok(errors.some((error) => error.includes('keine realen Gegenstände')));
});

test('Bildsprache: mit einem Physical-Primitive ist die Szene in Ordnung', () => {
  const source = [
    'const fill = interpolate(frame,[0,60],[0,1]);',
    'const walk = interpolate(frame,[0,90],[0,400]);',
    '<PhysicalReserveTank x={700} y={300} fill={fill} />',
    '<div style={{transform:`translateX(${walk}px)`}}><PhysicalCoinStack x={0} y={0} /></div>',
  ].join('\n');
  assert.deepEqual(validateYouTubeMotionSource({id: 'visual-04', type: 'animation'}, source), []);
});

test('Bildsprache: eine data-Szene braucht keine Physical-Primitives', () => {
  const source = [
    'const grow = interpolate(frame,[0,60],[0,1]);',
    'const shift = spring({frame, fps});',
    '<div style={{height:`${grow * 200}px`, transform:`translateY(${shift}px)`}}/>',
  ].join('\n');
  const errors = validateYouTubeMotionSource({id: 'visual-10', type: 'data'}, source);
  assert.ok(!errors.some((error) => error.includes('keine realen Gegenstände')));
});
