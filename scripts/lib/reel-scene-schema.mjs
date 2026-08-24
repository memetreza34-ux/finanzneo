// Die eine Definition, was eine gültige Reel-Szene ist.
//
// Vorher führten Scaffold, Quellenvertrag und Readiness je eine eigene
// Vorstellung davon. Der Scaffold erzeugte kein `accent`, die Readiness
// verlangte es — jedes frisch erzeugte Reel scheiterte dadurch in Phase 3,
// obwohl Phase 1 korrekt gearbeitet hatte. Genau dieser Schema-Drift ist das
// größte Risiko in einem mehrstufigen Agentensystem.
//
// Alle Skripte lesen ab jetzt von hier. Wer ein Feld ergänzt, ergänzt es
// genau einmal; der Drift-Test in tests/scene-schema.test.ts stellt sicher,
// dass Scaffold-Ausgabe und Readiness-Prüfung zusammenpassen.

/** Felder, die JEDE Szene braucht — unabhängig vom Typ. */
export const SCENE_REQUIRED_FIELDS = ['id', 'type', 'directory', 'headline', 'icon', 'accent', 'planFile'];

/** Zusätzliche Pflichtfelder für Bildszenen. */
export const IMAGE_SCENE_REQUIRED_FIELDS = ['googleFlowFileName', 'expectedVisual', 'objectLabels', 'imagePresentation'];

/** Zusätzliche Pflichtfelder für Animationsszenen. */
export const ANIMATION_SCENE_REQUIRED_FIELDS = [];

/** Erlaubte Werte für die semantische Akzentfarbe einer Szene. */
export const SCENE_ACCENTS = ['finance-green', 'price-pressure', 'gold', 'warning', 'neutral'];

/** Erlaubte Werte für den Header-Ton. */
export const SCENE_HEADER_TONES = ['default', 'positive', 'warning', 'money', 'neutral'];

/**
 * Ordnet einen Header-Ton der passenden Akzentfarbe zu.
 *
 * `accent` (Bühnenfarbe der Szene) und `headerTone` (Farbe der
 * Zwischenüberschrift) beschreiben dieselbe semantische Absicht. Diese
 * Zuordnung hält beide automatisch konsistent, statt sie doppelt pflegen zu
 * lassen.
 */
export const accentForTone = (tone) => {
  if (tone === 'warning') return 'warning';
  if (tone === 'money') return 'gold';
  if (tone === 'neutral') return 'neutral';
  return 'finance-green';
};

/**
 * Prüft eine einzelne Szene gegen das Schema.
 * Gibt eine Liste von Klartextfehlern zurück (leer = gültig).
 */
export const validateSceneShape = (scene, {index = 0} = {}) => {
  const fehler = [];
  const id = typeof scene?.id === 'string' && scene.id.trim() ? scene.id : `Szene ${index + 1}`;
  const hatPlatzhalter = (wert) => typeof wert === 'string' && /\[|EINFÜGEN|TODO|TBD/i.test(wert);

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

  if (scene?.accent && !SCENE_ACCENTS.includes(scene.accent)) {
    fehler.push(`${id}.accent "${scene.accent}" ist unbekannt. Erlaubt: ${SCENE_ACCENTS.join(', ')}`);
  }

  if (scene?.headerTone && !SCENE_HEADER_TONES.includes(scene.headerTone)) {
    fehler.push(`${id}.headerTone "${scene.headerTone}" ist unbekannt. Erlaubt: ${SCENE_HEADER_TONES.join(', ')}`);
  }

  if (scene?.type === 'image') {
    for (const feld of IMAGE_SCENE_REQUIRED_FIELDS) {
      if (scene[feld] === undefined || scene[feld] === null) fehler.push(`${id}.${feld} fehlt.`);
    }
    if (scene.objectLabels !== undefined && !Array.isArray(scene.objectLabels)) {
      fehler.push(`${id}.objectLabels muss eine Liste sein.`);
    }
  }

  return fehler;
};
