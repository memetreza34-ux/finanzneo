export const VISUAL_ROUTING_ID = 'finanzneo-visual-routing-v1';

export const VISUAL_ROUTES = [
  'concept-image',
  'money-flow-image',
  'comparison-image',
  'human-context-image',
  'data-line-remotion',
  'data-bar-remotion',
  'data-allocation-remotion',
  'timeline-remotion',
];

const normalize = (value) => String(value ?? '').trim().toLowerCase();

const hasAny = (text, words) => words.some((word) => text.includes(word));

export const recommendVisualRoute = ({
  text = '',
  exactTimeSeries = false,
  exactNumericComparison = false,
  exactAllocation = false,
  exactTimeline = false,
  moneyMovement = false,
  comparison = false,
  humanNarrativeValue = false,
} = {}) => {
  const normalized = normalize(text);

  const inferredTimeSeries = hasAny(normalized, [
    'über 10 jahre', 'über 5 jahre', 'über 20 jahre', 'kursverlauf', 'zeitreihe',
    'entwicklung des etf', 'entwicklung der aktie', 'indexentwicklung', 'drawdown',
  ]);
  if (exactTimeSeries || inferredTimeSeries) return 'data-line-remotion';

  const inferredAllocation = hasAny(normalized, [
    'portfolioaufteilung', 'portfolio aufteilung', '70/30', '60/40', 'anteil im portfolio',
  ]);
  if (exactAllocation || inferredAllocation) return 'data-allocation-remotion';

  const inferredTimeline = hasAny(normalized, [
    'timeline', 'meilenstein', 'jahr für jahr', 'jahr-für-jahr',
  ]);
  if (exactTimeline || inferredTimeline) return 'timeline-remotion';

  const inferredNumericComparison = hasAny(normalized, [
    'kostenvergleich', 'renditevergleich', 'gebührenvergleich', 'ter vergleich',
    'vs.', ' versus ', 'gegenüberstellung der kosten',
  ]);
  if (exactNumericComparison || inferredNumericComparison) return 'data-bar-remotion';

  const inferredMoneyMovement = hasAny(normalized, [
    'geld fließt', 'geld fliesst', 'einkommen', 'fixkosten', 'rücklage', 'ruecklage',
    'notgroschen', 'abbuchung', 'dauerauftrag', 'rate', 'kosten ziehen',
  ]);
  if (moneyMovement || inferredMoneyMovement) return 'money-flow-image';

  if (comparison || hasAny(normalized, ['zwei wege', 'vorher nachher', 'vorher/nachher', 'vergleich'])) {
    return 'comparison-image';
  }

  if (humanNarrativeValue) return 'human-context-image';

  return 'concept-image';
};

export const routeNeedsExactData = (route) => [
  'data-line-remotion',
  'data-bar-remotion',
  'data-allocation-remotion',
  'timeline-remotion',
].includes(route);

export const routeUsesRemotion = (route) => routeNeedsExactData(route);

export const routeUsesGeneratedImage = (route) => !routeUsesRemotion(route);

export const visualEngineForRoute = (route) => routeUsesRemotion(route) ? 'remotion' : 'google-flow';

export const sceneTypeForVisualRoute = (route) => routeUsesRemotion(route) ? 'animation' : 'image';

export const buildVisualRoutingDecision = (input = {}) => {
  const route = recommendVisualRoute(input);
  return {
    contract: VISUAL_ROUTING_ID,
    route,
    engine: visualEngineForRoute(route),
    sceneType: sceneTypeForVisualRoute(route),
    exactDataRequired: routeNeedsExactData(route),
    humanDefaultForbidden: route !== 'human-context-image',
  };
};

export const assertVisualRoute = (route) => {
  if (!VISUAL_ROUTES.includes(route)) {
    throw new Error(`Unbekannte Visual-Route: ${route}. Erlaubt: ${VISUAL_ROUTES.join(', ')}`);
  }
  return route;
};
