// FinanzNeo YouTube Timeline — Szenen aus Voiceover und Visual-Index ableiten.
//
// Schnitte folgen dem echten Voiceover, nicht einer festen Szenenlänge. Grundlage
// sind die Satzgrenzen aus word-timings.json: eine Szene läuft von einem Satzanfang
// bis zum nächsten. Damit entstehen automatisch ungleich lange Szenen, und der
// Ton liegt nie mitten in einem Schnitt.

import {YOUTUBE_FORMAT, YOUTUBE_STYLE} from './layout';

export type YouTubeSentence = {start: number; end: number; text?: string};

export type YouTubeVisual = {
  id: string;
  type: 'image' | 'animation' | 'data';
  chapter?: string;
  scriptBeat?: string;
  googleFlowFileName?: string;
  animationExport?: string;
  /** Erster und letzter Satz dieser Szene, 1-basiert und inklusiv. */
  sentenceSpan?: {from: number; to: number};
  headline?: string;
  icon?: string;
  /** Semantische Icon-Farbe: warning rot, money gold, positive gruen. */
  tone?: 'default' | 'positive' | 'warning' | 'money' | 'neutral';
  infoText?: string;
};

export type YouTubeScene = {
  id: string;
  type: YouTubeVisual['type'];
  startFrame: number;
  durationInFrames: number;
  startSeconds: number;
  endSeconds: number;
  sentenceSpan: {from: number; to: number};
  headline?: string;
  icon?: string;
  tone?: 'default' | 'positive' | 'warning' | 'money' | 'neutral';
  infoText?: string;
  imageFileName?: string;
  animationId?: string;
};

export type YouTubeTimeline = {
  fps: number;
  durationInFrames: number;
  scenes: YouTubeScene[];
  /** Hinweise, die ein Mensch vor dem Render lesen muss. Kein stiller Automatismus. */
  notes: string[];
};

const toFrames = (seconds: number, fps: number) => Math.max(1, Math.round(seconds * fps));

/**
 * Verteilt Sätze auf Visuals, wenn Phase 1 keine Zuordnung mitgibt.
 *
 * Bewusst als Notbehelf markiert: die Aufteilung folgt nur der Reihenfolge und
 * kennt den Inhalt nicht. Jede so erzeugte Szene landet in `notes`, damit sie vor
 * dem Render geprüft wird, statt als gesetzte Wahrheit durchzurutschen.
 */
const distributeSentences = (count: number, sentenceCount: number) => {
  const base = Math.floor(sentenceCount / count);
  const rest = sentenceCount % count;
  const spans: {from: number; to: number}[] = [];
  let cursor = 1;
  for (let index = 0; index < count; index += 1) {
    const size = Math.max(1, base + (index < rest ? 1 : 0));
    spans.push({from: cursor, to: Math.min(sentenceCount, cursor + size - 1)});
    cursor += size;
  }
  return spans;
};

export const buildYouTubeTimeline = (
  visuals: YouTubeVisual[],
  sentences: YouTubeSentence[],
  fps: number = YOUTUBE_FORMAT.fps,
): YouTubeTimeline => {
  const notes: string[] = [];

  if (visuals.length === 0) throw new Error('Timeline: visual-index.json enthält keine Visuals.');
  if (sentences.length === 0) throw new Error('Timeline: word-timings.json enthält keine satzbasierten Caption-Gruppen.');
  if (sentences.length < visuals.length) {
    throw new Error(`Timeline: ${sentences.length} Sätze reichen nicht für ${visuals.length} Visuals. Phase 1 muss Beats zusammenlegen.`);
  }

  const fallback = distributeSentences(visuals.length, sentences.length);
  const scenes: YouTubeScene[] = [];
  let frameCursor = 0;

  visuals.forEach((visual, index) => {
    let span = visual.sentenceSpan;
    if (!span) {
      span = fallback[index];
      notes.push(`${visual.id}: keine sentenceSpan in visual-index.json — Sätze ${span.from}–${span.to} nur der Reihe nach zugeteilt. Vor dem Render prüfen.`);
    }
    const first = sentences[span.from - 1];
    const last = sentences[span.to - 1];
    if (!first || !last) throw new Error(`${visual.id}: sentenceSpan ${span.from}–${span.to} liegt außerhalb der ${sentences.length} Sätze.`);
    if (span.to < span.from) throw new Error(`${visual.id}: sentenceSpan endet vor ihrem Anfang.`);

    const startSeconds = first.start;
    const endSeconds = last.end;
    const durationInFrames = toFrames(endSeconds - startSeconds, fps);

    scenes.push({
      id: visual.id,
      type: visual.type,
      startFrame: frameCursor,
      durationInFrames,
      startSeconds,
      endSeconds,
      sentenceSpan: span,
      headline: visual.headline,
      icon: visual.icon,
      tone: visual.tone,
      infoText: visual.infoText,
      imageFileName: visual.googleFlowFileName,
      animationId: visual.animationExport ? visual.id : undefined,
    });
    frameCursor += durationInFrames;
  });

  return {fps, durationInFrames: frameCursor, scenes, notes};
};

/**
 * Prüft die fertige Timeline gegen den Produktionsstandard.
 *
 * Die harte Regel „keine pauschal gleich langen Visuals" wird hier messbar:
 * wenn alle Szenen dieselbe Länge haben, folgte der Schnitt nicht dem Voiceover.
 */
export const validateYouTubeTimeline = (timeline: YouTubeTimeline, audioDurationSeconds?: number): string[] => {
  const errors: string[] = [];
  const {scenes, fps} = timeline;

  if (scenes.length === 0) errors.push('Timeline enthält keine Szenen.');

  const minFrames = YOUTUBE_STYLE.transition.continuityFrames * 2 + 1;
  scenes.forEach((scene) => {
    if (scene.durationInFrames < minFrames) {
      errors.push(`${scene.id}: ${scene.durationInFrames} Frames sind zu kurz für einen Szenenwechsel (mindestens ${minFrames}).`);
    }
  });

  for (let index = 1; index < scenes.length; index += 1) {
    const previous = scenes[index - 1];
    const current = scenes[index];
    if (current.startFrame !== previous.startFrame + previous.durationInFrames) {
      errors.push(`${current.id}: Lücke oder Überlappung zur vorherigen Szene.`);
    }
  }

  const lengths = new Set(scenes.map((scene) => scene.durationInFrames));
  if (scenes.length > 2 && lengths.size === 1) {
    errors.push('Alle Szenen sind exakt gleich lang. Schnitte müssen dem Voiceover folgen, nicht einem festen Raster.');
  }

  if (typeof audioDurationSeconds === 'number') {
    const timelineSeconds = timeline.durationInFrames / fps;
    if (Math.abs(timelineSeconds - audioDurationSeconds) > 1.5) {
      errors.push(`Timeline ist ${timelineSeconds.toFixed(1)} s lang, das Voiceover ${audioDurationSeconds.toFixed(1)} s. Abweichung über 1,5 s.`);
    }
  }

  return errors;
};

/**
 * Sammelt fehlende Animationsbindungen, bevor gerendert wird.
 *
 * React-frei, damit die Regel ohne Remotion-Laufzeit getestet werden kann — und
 * damit Phase 3 sie vor dem Bundle aufrufen kann statt erst im Renderfehler.
 */
export const missingYouTubeBindings = (timeline: YouTubeTimeline, availableIds: string[] = []): string[] => {
  const available = new Set(availableIds);
  const missing: string[] = [];
  timeline.scenes.forEach((scene) => {
    if (scene.type === 'image') return;
    if (!scene.animationId) {
      missing.push(`${scene.id}: keine animationId im Visual-Index.`);
      return;
    }
    if (!available.has(scene.animationId)) {
      missing.push(`${scene.id}: animations["${scene.animationId}"] fehlt.`);
    }
  });
  return missing;
};

/** Bildszenen ohne Dateinamen — dasselbe Prinzip wie bei den Animationen. */
export const missingYouTubeImages = (timeline: YouTubeTimeline): string[] => (
  timeline.scenes
    .filter((scene) => scene.type === 'image' && !scene.imageFileName)
    .map((scene) => `${scene.id}: kein googleFlowFileName im Visual-Index.`)
);
