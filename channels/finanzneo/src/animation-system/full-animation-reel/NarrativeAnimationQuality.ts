export type NarrativeVisualMode =
  | 'object-story'
  | 'process-machine'
  | 'environment'
  | 'transformation'
  | 'time-travel'
  | 'kinetic-type'
  | 'data-viz';

export type NarrativeLayoutFamily =
  | 'full-bleed-world'
  | 'spatial-stage'
  | 'split-screen'
  | 'track-race'
  | 'timeline'
  | 'machine'
  | 'chart'
  | 'dashboard-card'
  | 'typography';

export type NarrativeCameraMove =
  | 'push-in'
  | 'pull-out'
  | 'pan'
  | 'follow-subject'
  | 'orbit'
  | 'parallax'
  | 'static';

export type NarrativeScenePlan = {
  readonly id: string;
  readonly contentBeat: string;
  readonly primarySubject: string;
  readonly narrativeAction: string;
  readonly visualMetaphor: string;
  readonly startState: string;
  readonly endState: string;
  readonly visualMode: NarrativeVisualMode;
  readonly layoutFamily: NarrativeLayoutFamily;
  readonly cameraMove: NarrativeCameraMove;
  readonly transitionOut: string;
  readonly dataViz: boolean;
  readonly dashboardFraming: boolean;
  readonly repeatsCoreComparison: boolean;
};

export type NarrativeQualityReport = {
  readonly passed: boolean;
  readonly score: number;
  readonly failures: readonly string[];
  readonly warnings: readonly string[];
  readonly metrics: {
    readonly sceneCount: number;
    readonly distinctContentBeats: number;
    readonly distinctActions: number;
    readonly distinctMetaphors: number;
    readonly distinctLayouts: number;
    readonly dataVizScenes: number;
    readonly dashboardScenes: number;
    readonly staticCameraScenes: number;
    readonly repeatedCoreComparisonScenes: number;
  };
};

const uniqueCount = (values: readonly string[]): number =>
  new Set(values.map((value) => value.trim().toLowerCase())).size;

const maxRepeated = (values: readonly string[]): number => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = value.trim().toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Math.max(0, ...counts.values());
};

const maxConsecutive = <T>(values: readonly T[], predicate: (value: T) => boolean): number => {
  let current = 0;
  let maximum = 0;
  for (const value of values) {
    if (predicate(value)) {
      current += 1;
      maximum = Math.max(maximum, current);
    } else {
      current = 0;
    }
  }
  return maximum;
};

export const evaluateNarrativeAnimationPlan = (
  scenes: readonly NarrativeScenePlan[],
): NarrativeQualityReport => {
  const failures: string[] = [];
  const warnings: string[] = [];
  const sceneCount = scenes.length;
  const distinctContentBeats = uniqueCount(scenes.map((scene) => scene.contentBeat));
  const distinctActions = uniqueCount(scenes.map((scene) => scene.narrativeAction));
  const distinctMetaphors = uniqueCount(scenes.map((scene) => scene.visualMetaphor));
  const distinctLayouts = uniqueCount(scenes.map((scene) => scene.layoutFamily));
  const dataVizScenes = scenes.filter((scene) => scene.dataViz).length;
  const dashboardScenes = scenes.filter((scene) => scene.dashboardFraming).length;
  const staticCameraScenes = scenes.filter((scene) => scene.cameraMove === 'static').length;
  const repeatedCoreComparisonScenes = scenes.filter((scene) => scene.repeatsCoreComparison).length;

  if (sceneCount < 5 || sceneCount > 9) {
    failures.push('Ein vollständig animiertes Reel benötigt 5 bis 9 klar abgegrenzte Szenen.');
  }

  const minimumDistinctBeats = Math.max(1, sceneCount - 1);
  if (distinctContentBeats < minimumDistinctBeats) {
    failures.push(`Zu wenige unterschiedliche Inhaltsbeats: ${distinctContentBeats}/${minimumDistinctBeats}. Eine Rechnung darf nicht über fast alle Szenen wiederholt werden.`);
  }

  const minimumDistinctActions = Math.ceil(sceneCount * 0.72);
  if (distinctActions < minimumDistinctActions) {
    failures.push(`Zu wenige unterschiedliche Handlungen: ${distinctActions}/${minimumDistinctActions}. Zahlen hochzählen, Balken wachsen lassen und Kurven zeichnen zählen nicht als verschiedene Geschichten.`);
  }

  const minimumDistinctMetaphors = Math.ceil(sceneCount * 0.72);
  if (distinctMetaphors < minimumDistinctMetaphors) {
    failures.push(`Zu wenige unterschiedliche visuelle Metaphern: ${distinctMetaphors}/${minimumDistinctMetaphors}.`);
  }

  if (distinctLayouts < Math.ceil(sceneCount * 0.58)) {
    failures.push(`Zu wenige Layoutfamilien: ${distinctLayouts}. Das Reel darf nicht wie eine Serie identischer Dashboard-Karten wirken.`);
  }

  if (maxRepeated(scenes.map((scene) => scene.layoutFamily)) > 2) {
    failures.push('Eine Layoutfamilie wird öfter als zweimal verwendet.');
  }

  if (maxConsecutive(scenes, (scene) => scene.layoutFamily === 'dashboard-card') > 1) {
    failures.push('Dashboard-Karten dürfen nicht in direkt aufeinanderfolgenden Szenen erscheinen.');
  }

  const maxDataViz = Math.max(1, Math.floor(sceneCount * 0.4));
  if (dataVizScenes > maxDataViz) {
    failures.push(`Zu viele reine Datenvisualisierungen: ${dataVizScenes}/${maxDataViz}. Mindestens 60 % des Reels müssen Handlung, Objektmetapher, Raum oder Transformation zeigen.`);
  }

  if (maxConsecutive(scenes, (scene) => scene.dataViz) > 1) {
    failures.push('Reine Datenvisualisierungen dürfen nicht direkt aufeinanderfolgen.');
  }

  if (dashboardScenes > 1) {
    failures.push(`Zu viele Dashboard-Szenen: ${dashboardScenes}. Erlaubt ist höchstens eine Beweis- oder Zahlen-Szene.`);
  }

  if (staticCameraScenes > Math.floor(sceneCount * 0.4)) {
    failures.push(`Zu viele statische Kameraszenen: ${staticCameraScenes}. Die Blickführung muss überwiegend aktiv sein.`);
  }

  if (repeatedCoreComparisonScenes > 2) {
    failures.push(`Der Kernvergleich wird in ${repeatedCoreComparisonScenes} Szenen wiederholt. Derselbe A-gegen-B-Vergleich ist maximal zweimal erlaubt.`);
  }

  for (const scene of scenes) {
    if (!scene.contentBeat.trim() || !scene.narrativeAction.trim() || !scene.visualMetaphor.trim()) {
      failures.push(`Szene ${scene.id} besitzt keinen vollständigen Inhaltsbeat, keine Handlung oder keine Metapher.`);
    }
    if (scene.startState.trim().toLowerCase() === scene.endState.trim().toLowerCase()) {
      failures.push(`Szene ${scene.id} verändert ihren Zustand nicht sichtbar von Anfang bis Ende.`);
    }
    if (scene.dataViz !== (scene.visualMode === 'data-viz')) {
      failures.push(`Szene ${scene.id} hat widersprüchliche Datenvisualisierungs-Metadaten.`);
    }
  }

  if (uniqueCount(scenes.map((scene) => scene.transitionOut)) < Math.min(3, sceneCount)) {
    warnings.push('Weniger als drei unterschiedliche Übergangsideen. Übergänge sollten aus der Handlung entstehen, nicht nur aus Fades.');
  }

  const score = Math.max(0, 100 - failures.length * 13 - warnings.length * 4);
  return {
    passed: failures.length === 0,
    score,
    failures,
    warnings,
    metrics: {
      sceneCount,
      distinctContentBeats,
      distinctActions,
      distinctMetaphors,
      distinctLayouts,
      dataVizScenes,
      dashboardScenes,
      staticCameraScenes,
      repeatedCoreComparisonScenes,
    },
  };
};

export const assertNarrativeAnimationPlan = (scenes: readonly NarrativeScenePlan[]): void => {
  const report = evaluateNarrativeAnimationPlan(scenes);
  if (!report.passed) {
    throw new Error(`Narrative animation quality gate failed:\n- ${report.failures.join('\n- ')}`);
  }
};
