// Die eine Definition, was eine gültige Reel-Szene ist.
//
// Doppelte Metadaten sind absichtlich NICHT mehr überall Pflicht. `directory`
// lässt sich aus planFile ableiten, `accent` aus headerTone und objectLabels
// stehen bereits im Bildprompt. Genau diese Doppelpflege hatte Bestandsreels
// und Readiness auseinanderlaufen lassen.

/** Felder, die JEDE Szene tatsächlich als Primärdaten braucht. */
export const SCENE_REQUIRED_FIELDS = ['id', 'type', 'headline', 'icon', 'planFile'];

/** Zusätzliche Primärdaten für Bildszenen. */
export const IMAGE_SCENE_REQUIRED_FIELDS = ['googleFlowFileName', 'expectedVisual', 'imagePresentation'];

/**
 * Zusätzliche Primärdaten für Animationsszenen.
 *
 * V5: Phase 1 ist für die kreative und technische Animation verantwortlich.
 * Deshalb reicht eine remotion.md-Spezifikation nicht mehr: jede Animation
 * besitzt bereits in Phase 1 eine kanonische produktionsreife TSX-Quelle.
 */
export const ANIMATION_SCENE_REQUIRED_FIELDS = [
  'animationSourceFile',
  'animationExport',
  'animationIntent',
  'animationQualityLock',
];

export const ANIMATION_QUALITY_LOCK = 'finanzneo-phase1-animation-code-v1';

/** Erlaubte Werte für eine explizit gespeicherte semantische Akzentfarbe. */
export const SCENE_ACCENTS = ['finance-green', 'price-pressure', 'gold', 'warning', 'neutral'];

/** Erlaubte Werte für den Header-Ton. */
export const SCENE_HEADER_TONES = ['default', 'positive', 'warning', 'money', 'neutral'];

export const accentForTone = (tone) => {
  if (tone === 'warning') return 'warning';
  if (tone === 'money') return 'gold';
  if (tone === 'neutral') return 'neutral';
  return 'finance-green';
};

/**
 * Kanonischer Szenenordner. Alte Reels ohne `directory` bleiben damit lesbar,
 * solange ihr planFile korrekt auf den Szenenordner zeigt.
 */
export const canonicalSceneDirectory = (scene) => {
  const explicit = typeof scene?.directory === 'string' ? scene.directory.trim() : '';
  if (explicit) return explicit.replace(/^03-szenen\//, '').replace(/\/$/, '');

  const planFile = typeof scene?.planFile === 'string' ? scene.planFile.trim().replace(/^03-szenen\//, '') : '';
  const slash = planFile.lastIndexOf('/');
  return slash > 0 ? planFile.slice(0, slash) : '';
};

/**
 * Kanonischer Akzent. Neue Reels dürfen ihn speichern, Phase 3 muss ihn aber
 * nicht doppelt pflegen: headerTone bleibt die semantische Primärquelle.
 */
export const canonicalSceneAccent = (scene) => {
  const explicit = typeof scene?.accent === 'string' ? scene.accent.trim() : '';
  if (SCENE_ACCENTS.includes(explicit)) return explicit;
  return accentForTone(scene?.headerTone ?? scene?.tone ?? 'default');
};

/**
 * Prüft eine einzelne Szene gegen das gemeinsame Schema.
 * Gibt eine Liste von Klartextfehlern zurück (leer = gültig).
 */
export const validateSceneShape = (scene, {index = 0} = {}) => {
  const fehler = [];
  const id = typeof scene?.id === 'string' && scene.id.trim() ? scene.id : `Szene ${index + 1}`;
  const hatPlatzhalter = (wert) => typeof wert === 'string' && /\[|EINFÜGEN|TODO|TBD|PLACEHOLDER/i.test(wert);

  for (const feld of SCENE_REQUIRED_FIELDS) {
    const wert = scene?.[feld];
    if (typeof wert !== 'string' || !wert.trim()) {
      fehler.push(`${id}.${feld} fehlt.`);
    } else if (hatPlatzhalter(wert)) {
      fehler.push(`${id}.${feld} enthält noch einen Platzhalter.`);
    }
  }

  if (scene?.type && !['image', 'animation'].includes(scene.type)) {
    fehler.push(`${id}.type muss image oder animation sein.`);
  }

  if (!canonicalSceneDirectory(scene)) {
    fehler.push(`${id}: Szenenordner kann weder aus directory noch aus planFile abgeleitet werden.`);
  }

  if (scene?.accent !== undefined && scene?.accent !== null && scene?.accent !== '') {
    if (typeof scene.accent !== 'string' || !SCENE_ACCENTS.includes(scene.accent.trim())) {
      fehler.push(`${id}.accent "${scene?.accent}" ist unbekannt. Erlaubt: ${SCENE_ACCENTS.join(', ')}`);
    }
  }

  if (scene?.headerTone && !SCENE_HEADER_TONES.includes(scene.headerTone)) {
    fehler.push(`${id}.headerTone "${scene.headerTone}" ist unbekannt. Erlaubt: ${SCENE_HEADER_TONES.join(', ')}`);
  }

  if (scene?.type === 'image') {
    for (const feld of IMAGE_SCENE_REQUIRED_FIELDS) {
      if (scene[feld] === undefined || scene[feld] === null) fehler.push(`${id}.${feld} fehlt.`);
      else if (typeof scene[feld] === 'string' && (!scene[feld].trim() || hatPlatzhalter(scene[feld]))) {
        fehler.push(`${id}.${feld} fehlt oder enthält einen Platzhalter.`);
      }
    }

    // objectLabels sind hilfreiche Metadaten, aber keine zweite Wahrheit neben
    // dem eigentlichen Bildprompt. Wenn vorhanden, müssen sie sauber sein.
    if (scene.objectLabels !== undefined) {
      if (!Array.isArray(scene.objectLabels)) {
        fehler.push(`${id}.objectLabels muss eine Liste sein.`);
      } else if (scene.objectLabels.some((label) => typeof label !== 'string' || !label.trim() || hatPlatzhalter(label))) {
        fehler.push(`${id}.objectLabels enthalten ungültige Werte oder Platzhalter.`);
      }
    }
  }

  if (scene?.type === 'animation') {
    for (const feld of ANIMATION_SCENE_REQUIRED_FIELDS) {
      const wert = scene?.[feld];
      if (typeof wert !== 'string' || !wert.trim()) {
        fehler.push(`${id}.${feld} fehlt.`);
      } else if (hatPlatzhalter(wert)) {
        fehler.push(`${id}.${feld} enthält noch einen Platzhalter.`);
      }
    }

    if (scene.animationQualityLock && scene.animationQualityLock !== ANIMATION_QUALITY_LOCK) {
      fehler.push(`${id}.animationQualityLock muss ${ANIMATION_QUALITY_LOCK} sein.`);
    }
    if (typeof scene.animationSourceFile === 'string' && !/\.tsx$/i.test(scene.animationSourceFile.trim())) {
      fehler.push(`${id}.animationSourceFile muss auf eine .tsx-Datei zeigen.`);
    }
    if (typeof scene.animationExport === 'string' && !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(scene.animationExport.trim())) {
      fehler.push(`${id}.animationExport ist kein gültiger TypeScript-Exportname.`);
    }
    if (typeof scene.animationIntent === 'string' && scene.animationIntent.trim().length < 18) {
      fehler.push(`${id}.animationIntent ist zu vage; Start/Mechanismus/Ergebnis müssen konkret beschrieben sein.`);
    }
  }

  return fehler;
};

/** Wer Phase 3 ausführt. */
export const PHASE3_EXECUTORS = {
  antigravity: {
    label: 'Antigravity',
    handoff: 'MASTER-PROMPTS.md, Abschnitt „Phase 3 — Antigravity baut autonom"',
  },
  'claude-code': {
    label: 'Claude Code',
    handoff: '05-projektdateien/CLAUDE-CODE-AUFTRAG.md im jeweiligen Reel',
  },
};

export const DEFAULT_PHASE3_EXECUTOR = 'antigravity';

/** Prüft die Executor-Angabe eines Reels. Leere Liste = gültig. */
export const validatePhase3Executor = (wert) => {
  if (wert === undefined || wert === null) return [];
  if (typeof wert !== 'string' || !PHASE3_EXECUTORS[wert]) {
    return [`phase3Executor "${wert}" ist unbekannt. Erlaubt: ${Object.keys(PHASE3_EXECUTORS).join(', ')}`];
  }
  return [];
};
