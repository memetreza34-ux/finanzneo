export const YOUTUBE_MOTION_STANDARD_ID = 'finanzneo-youtube-motion-v3';

// Hartes Entweder-oder wie bei den Reels: eine Szene ist ein Bild ODER Bewegung.
// `hybrid` gab es kurzzeitig als YouTube-Ausnahme; ein Bild mit Erklaeranimation
// darueber ist in der Praxis weder ruhiges Bild noch klare Mechanik geworden.
export const YOUTUBE_VISUAL_TYPES = ['image', 'animation', 'data'];
export const YOUTUBE_MOTION_VISUAL_TYPES = new Set(['animation', 'data']);
export const YOUTUBE_IMAGE_VISUAL_TYPES = new Set(['image']);

// Beispiele zur Inspiration, ausdrücklich KEINE Whitelist.
// Neue compositionFamilyId-Werte sind erlaubt, wenn sie die konkrete Szene besser beschreiben.
export const YOUTUBE_MOTION_FAMILY_EXAMPLES = [
  'spatial-3d',
  'vector-motion',
  'css-3d',
  'kinetic-type',
  'data-viz',
  'timeline',
  'document-motion',
  'image-composite',
  'simulation',
  'comparison',
  'camera-journey',
  'physical-process',
  'material-transformation',
  'map-journey',
  'macro-to-micro',
  'network-simulation',
  'custom',
];

// Kompatibilitätsalias für bestehende Imports. Semantik in V3: Beispiele, keine erlaubte Endmenge.
export const YOUTUBE_MOTION_FAMILIES = YOUTUBE_MOTION_FAMILY_EXAMPLES;
export const YOUTUBE_MOTION_RECENT_WINDOW = 4;
export const YOUTUBE_MOTION_SIGNATURE_FIELDS = ['camera', 'layout', 'transformation'];

export const requiresYouTubeMotion = (visual) => YOUTUBE_MOTION_VISUAL_TYPES.has(visual?.type);
export const requiresYouTubeImage = (visual) => YOUTUBE_IMAGE_VISUAL_TYPES.has(visual?.type);

export const motionSourcePathFor = (visual) => visual?.animationSourceFile ?? '';

const normalized = (value) => typeof value === 'string' ? value.trim().toLowerCase() : '';
const validStringArray = (value, minimum) => Array.isArray(value)
  && value.length >= minimum
  && value.every((item) => typeof item === 'string' && item.trim());

export const validateYouTubeMotionMetadata = (visual) => {
  if (!requiresYouTubeMotion(visual)) return [];
  const id = visual?.id ?? 'Unbekanntes Visual';
  const errors = [];
  const requiredString = (field) => {
    if (typeof visual?.[field] !== 'string' || !visual[field].trim()) {
      errors.push(`${id}: ${field} fehlt.`);
    }
  };

  // Content-first: Erst beschreiben, was der Zuschauer tatsächlich sehen soll,
  // danach Mechanik und Technik festlegen.
  requiredString('viewerChange');
  requiredString('animationIntent');
  requiredString('mechanicId');
  requiredString('visualTechniqueId');
  requiredString('techniqueDescription');
  requiredString('compositionFamilyId');
  requiredString('animationSourceFile');
  requiredString('animationExport');

  if (!validStringArray(visual?.toolStack, 1)) {
    errors.push(`${id}: toolStack benötigt mindestens 1 konkretes Werkzeug / Verfahren.`);
  }
  if (!validStringArray(visual?.motionChannels, 2)) {
    errors.push(`${id}: motionChannels benötigt mindestens 2 sinnvolle Kanäle.`);
  }
  if (!validStringArray(visual?.visualBeats, 2)) {
    errors.push(`${id}: visualBeats benötigt mindestens 2 sichtbare Zustände.`);
  }

  const signature = visual?.motionSignature;
  for (const field of YOUTUBE_MOTION_SIGNATURE_FIELDS) {
    if (typeof signature?.[field] !== 'string' || !signature[field].trim()) {
      errors.push(`${id}: motionSignature.${field} fehlt.`);
    }
  }

  // V3 hat bewusst KEINE feste Liste erlaubter compositionFamilyId-Werte.
  if (visual?.animationSourceFile && !visual.animationSourceFile.endsWith('/animation.tsx')) {
    errors.push(`${id}: animationSourceFile muss auf animation.tsx zeigen.`);
  }
  return errors;
};

const sameSignature = (a, b) => YOUTUBE_MOTION_SIGNATURE_FIELDS.every(
  (field) => normalized(a?.motionSignature?.[field])
    && normalized(a?.motionSignature?.[field]) === normalized(b?.motionSignature?.[field]),
);

export const validateYouTubeMotionVariety = (visuals = []) => {
  const errors = [];
  const motion = visuals.filter(requiresYouTubeMotion);
  const techniqueOwner = new Map();
  const mechanicOwner = new Map();
  const descriptionOwner = new Map();

  for (const visual of motion) {
    const repeatReason = visual?.repeatTechniqueReason?.trim();
    const checks = [
      ['visualTechniqueId', normalized(visual?.visualTechniqueId), techniqueOwner],
      ['mechanicId', normalized(visual?.mechanicId), mechanicOwner],
      ['techniqueDescription', normalized(visual?.techniqueDescription), descriptionOwner],
    ];

    for (const [label, value, owners] of checks) {
      if (!value) continue;
      if (owners.has(value) && !repeatReason) {
        errors.push(`${visual.id}: ${label} wiederholt die Motion von ${owners.get(value)}. Wiederholung braucht repeatTechniqueReason.`);
      } else if (!owners.has(value)) {
        owners.set(value, visual.id);
      }
    }
  }

  let runFamily = null;
  let runLength = 0;
  for (const visual of motion) {
    const family = normalized(visual?.compositionFamilyId) || null;
    if (family === runFamily) runLength += 1;
    else {
      runFamily = family;
      runLength = 1;
    }
    if (family && runLength > 2 && !visual?.repeatTechniqueReason?.trim()) {
      errors.push(`${visual.id}: mehr als zwei Motion-Visuals hintereinander aus '${visual.compositionFamilyId}'. Nutze eine passendere andere Umsetzung oder begründe die Wiederholung.`);
    }
  }

  // Anti-Fake-Variation: Ein neuer Technikname reicht nicht, wenn Kamera,
  // räumlicher Aufbau UND Transformation in den letzten vier Motion-Visuals identisch sind.
  for (let index = 0; index < motion.length; index += 1) {
    const visual = motion[index];
    if (visual?.repeatTechniqueReason?.trim()) continue;
    const previous = motion.slice(Math.max(0, index - YOUTUBE_MOTION_RECENT_WINDOW), index);
    const match = previous.find((candidate) => sameSignature(candidate, visual));
    if (match) {
      errors.push(`${visual.id}: motionSignature ist innerhalb der letzten ${YOUTUBE_MOTION_RECENT_WINDOW} Motion-Visuals identisch zu ${match.id}. Ändere die tatsächliche Bewegungslogik oder begründe die Wiederholung.`);
    }
  }

  return errors;
};

// ── Bildsprache ─────────────────────────────────────────────────────────────
// Die Metadaten eines Projekts können vielfältig sein, während der Code dahinter
// aus Kästen, Balken und ein-/ausgeblendetem Text besteht. CLAUDE.md Abschnitt 11
// verbietet genau das als Hauptsprache, aber die Vertragsprüfung allein sieht es
// nicht — sie liest nur visual-index.json.

/** Pfeile und Haken als Textzeichen. Dafür gibt es Icon und echte Objekte. */
const TYPOGRAPHIC_SYMBOLS = /[\u2191-\u2199\u2194\u2195\u21BA\u21BB\u21E7\u21E9\u2794\u279C\u2713\u2714\u2717\u2718]/;

/** Verschieben, drehen, aufdecken, Ausdehnung ändern. Fade und Zoom zählen nicht. */
const REAL_TRANSFORMATION = /translate|rotate|clipPath|clip-path|strokeDash|skew|perspective|\bd=\{|height:\s*`|width:\s*`|bottom:\s*`|left:\s*`|top:\s*`/;

/** Codeseitiges Gegenstück zu den zwei Motion Channels, die der Vertrag verlangt. */
const MOTION_DRIVERS = /\b(?:interpolate|spring|progressBetween)\s*\(/g;

/**
 * Die Visualzone aus YOUTUBE_STYLE, gespiegelt für die statische Prüfung.
 *
 * `src/youtube/layout.ts` ist TypeScript und hier nicht importierbar. Die Werte
 * müssen deshalb übereinstimmen; `tests/youtube-motion-v3.test.ts` hält sie
 * zusammen, damit sie nicht auseinanderlaufen.
 */
export const YOUTUBE_VISUAL_ZONE = {top: 180, bottom: 990};

/**
 * Markierung für Koordinaten, die bewusst klein sind.
 *
 * Ein `top` unter 180 ist harmlos, wenn das Element in einem Container sitzt, der
 * selbst schon in der Zone steht — dann ist der Wert relativ. Das ist statisch
 * nicht entscheidbar, also trägt der Autor es ein.
 */
const ZONE_OK_MARKER = /zone-ok/;

/** Absolut positionierte Elemente mit ihrem top-Wert. */
const ABSOLUTE_TOP = /position\s*:\s*'absolute'[^}]*?\btop\s*:\s*(-?\d+)|\btop\s*:\s*(-?\d+)[^}]*?position\s*:\s*'absolute'/g;

/**
 * Findet Inhalt, der außerhalb der Visualzone gezeichnet wird.
 *
 * Die Animationsbühne behält das volle 1920x1080-Koordinatensystem, zeigt aber nur
 * y 180–990 und clippt den Rest hart weg. Wer darüber hinaus zeichnet, sieht es
 * in der Preview nicht und im Render nur als abgeschnittene Kante. Genau so sind
 * im Notgroschen-Video drei Textzeilen verschwunden, zwei davon halb sichtbar.
 *
 * Geprüft wird der rohe top-Wert. Sitzt ein Element in einem Container, der selbst
 * schon in der Zone steht, ist der Wert relativ und harmlos — dann gehört
 * `zone-ok` als Kommentar in dieselbe Zeile.
 */
export const findYouTubeZoneEscapes = (source = '') => {
  const escapes = [];
  const lines = source.split('\n');
  lines.forEach((line, index) => {
    if (ZONE_OK_MARKER.test(line)) return;
    ABSOLUTE_TOP.lastIndex = 0;
    let match;
    while ((match = ABSOLUTE_TOP.exec(line)) !== null) {
      const raw = match[1] ?? match[2];
      if (raw === undefined) continue;
      const top = Number(raw);
      if (top < YOUTUBE_VISUAL_ZONE.top) {
        escapes.push({line: index + 1, top});
      }
    }
  });
  return escapes;
};

/**
 * Reale Gegenstände aus dem Baukasten.
 *
 * Eine Animationsszene erzählt mit Dingen, die es gibt — Rechnung, Konto,
 * Waschmaschine, Kalenderblatt, Geldstapel, Reservebehälter. Was ohne sie gebaut
 * wird, landet erfahrungsgemäß bei beschrifteten Kästen, Pfeilen und Balken:
 * im Notgroschen-Video wurden so eine Texttafel, ein Flowchart und drei
 * Fortschrittsbalken produziert, obwohl der Standard alle drei verbietet.
 * Der Validator hatte nichts, woran er das festmachen konnte.
 *
 * Für `data` gilt das nicht — dort trägt die Darstellung der Zahlen die Aussage.
 */
const PHYSICAL_PRIMITIVE = /<Physical[A-Z][A-Za-z]*/;

export const validateYouTubeMotionSource = (visual, source = '') => {
  const errors = [];
  const id = visual?.id ?? 'Unbekanntes Visual';

  if (TYPOGRAPHIC_SYMBOLS.test(source)) {
    errors.push(`${id}: Pfeile oder Haken als Textzeichen sind kein Visual. Icon oder echtes Objekt verwenden.`);
  }
  if ((source.match(MOTION_DRIVERS) ?? []).length < 2) {
    errors.push(`${id}: mindestens zwei unabhängige Motion-Treiber (interpolate/spring/progressBetween) müssen die Szene steuern.`);
  }
  // Bei data traegt der Chart einen Teil der Aussage. Bei einer reinen Animation
  // traegt die Bewegung sie allein.
  if (visual?.type === 'animation' && !REAL_TRANSFORMATION.test(source)) {
    errors.push(`${id}: nur Ein-/Ausblenden und Zoom. Eine Animationsszene braucht eine sichtbare Transformation.`);
  }

  if (visual?.type === 'animation' && !PHYSICAL_PRIMITIVE.test(source)) {
    errors.push(
      `${id}: keine realen Gegenstände. Eine Animationsszene baut auf den Physical-Primitives des Baukastens auf `
      + '(PhysicalBill, PhysicalAccount, PhysicalWasher, PhysicalReserveTank, PhysicalCalendarPage, PhysicalCoinStack …). '
      + 'Ohne sie entstehen beschriftete Kästen, Balken und Texttafeln, die der Standard als Hauptsprache ausschließt.',
    );
  }

  for (const escape of findYouTubeZoneEscapes(source)) {
    errors.push(
      `${id}: Zeile ${escape.line} zeichnet auf y ${escape.top}, die Visualzone beginnt bei ${YOUTUBE_VISUAL_ZONE.top}. `
      + 'Das wird im Render abgeschnitten. Nach unten setzen — oder, wenn der Wert relativ zu einem Container in der Zone ist, `zone-ok` in die Zeile schreiben.',
    );
  }

  return errors;
};
