import {createFinanceScenePlanTemplate} from './create-finance-scene-plan-template.mjs';
import {ScenePlan} from './finance-contracts.mjs';

const voiceTexts = [
  'Was kosten dich nur 0,5 Prozent mehr ETF-Gebühren, wenn du 30 Jahre lang jeden Monat sparst?',
  'Bei derselben Sparrate landet durch höhere Kosten jeden Monat etwas weniger Geld tatsächlich in deinem Depot.',
  'Von 10.000 Euro Anlagevermögen ziehen 0,5 Prozent Gebühren bereits 50 Euro pro Jahr ab.',
  'Dieser laufende Abzug verkleinert dein Kapital und damit auch den Betrag, der später weiterwachsen könnte.',
  'Bei 200 Euro monatlicher Einzahlung fehlen dadurch schon früh mehrere Euro, die sonst langfristig mitgewachsen wären.',
  'Ein günstiger ETF lässt bei gleicher Marktentwicklung deshalb mehr von deinem Geld arbeiten als ein teurer ETF.',
  'Nach zehn Jahren ist der Abstand noch überschaubar, nach 30 Jahren kann er deutlich größer sein.',
  'Vergleichst du Kostenquote, Sparrate und Laufzeit gemeinsam, erkennst du den möglichen Unterschied schon vor dem Kauf.',
  'Kleine laufende Gebühren werden langfristig teuer, weil sie jedes Jahr Kapital und mögliche zukünftige Rendite reduzieren, obwohl der monatliche Unterschied zunächst winzig wirkt.',
];

const negatives = [
  'no large headline, subtitle or unwanted extra text inside the image',
  'no dashboard, UI cards, split screen or separate panels',
  'no invented financial machines, fantasy devices or abstract finance containers',
  'no green recoloring of banknotes or real objects; preserve natural colors',
  'no watermark, random logo or unrelated brand',
  'no tiny isolated product render, artificial pedestal or decorative empty stage',
];

const brief = ({sceneMeaning, mainMotif, supportMotifs, causeEffect, worldDetails, composition, motionLayers, stateChange, visibleText}) => [
  sceneMeaning,
  mainMotif,
  ...supportMotifs,
  causeEffect,
  worldDetails,
  composition,
  ...motionLayers,
  `State change: ${stateChange}`,
  `Visible text: ${visibleText}`,
  `Avoid: ${negatives.join(', ')}`,
].join('\n');

const noText = 'Render no text, labels, numbers, headline or subtitle.';

const briefs = {
  hook: brief({
    sceneMeaning: 'A small recurring ETF fee removes part of the same monthly contribution before the full amount reaches the investment.',
    mainMotif: 'Topic-specific anchor: a home-office desk with a smartphone showing a neutral monthly ETF purchase, an open wallet and one small red fee receipt beside the transfer.',
    supportMotifs: ['one realistic monthly bank transfer slip', 'a smaller final investment confirmation beside the red fee receipt'],
    causeEffect: 'The transfer slip enters the smartphone purchase while the red fee receipt pulls a small amount away before completion.',
    worldDetails: 'A believable real-world home office with a dark wooden desk, natural realistic object colors, a refined charcoal overall grade, restrained deep-green screen accents and soft cinematic morning light.',
    composition: 'Smartphone large in the center foreground, wallet on the left, transfer slip near the center and the smaller investment confirmation on the right background.',
    motionLayers: ['smartphone and ETF purchase', 'wallet and transfer slip', 'red fee receipt and final confirmation'],
    stateChange: 'The monthly transfer remains visible while the completed investment confirmation receives a visibly smaller amount after the fee is deducted.',
    visibleText: noText,
  }),
  relevanz: brief({
    sceneMeaning: 'The same monthly savings rate produces a smaller invested amount when a recurring fee is deducted first.',
    mainMotif: 'Topic-specific anchor: a bank consultation desk with two identical standing-order forms, two neutral investment envelopes and one red fee stamp affecting only the right transfer.',
    supportMotifs: ['two equal standing-order forms', 'two investment envelopes with different received amounts'],
    causeEffect: 'Both forms move toward the envelopes, but the red fee stamp removes a small corner from the right form before it enters.',
    worldDetails: 'A believable real-world bank consultation area with a clean desk, natural paper and metal colors, a refined charcoal overall grade, restrained deep-green accents and soft professional lighting.',
    composition: 'Two forms aligned in the left foreground, red fee stamp in the center and both investment envelopes positioned on the right with the smaller result clearly visible.',
    motionLayers: ['standing-order forms', 'red fee stamp', 'investment envelopes'],
    stateChange: 'The left envelope receives the complete form while the right envelope receives a visibly reduced form.',
    visibleText: noText,
  }),
  zahl: brief({
    sceneMeaning: 'The annual fee becomes concrete when fifty euros are visibly separated from ten thousand euros of invested value.',
    mainMotif: 'Topic-specific anchor: an accountant desk with a printed investment statement, a physical calculator and one realistic fifty-euro banknote separated beside the annual cost line.',
    supportMotifs: ['one printed investment statement', 'one physical calculator with a percentage key'],
    causeEffect: 'The calculator applies the fee rate and the fifty-euro banknote is placed beside the annual cost section of the statement.',
    worldDetails: 'A believable real-world accounting office with a dark desk surface, natural realistic paper, calculator and euro colors, a refined charcoal overall grade and restrained deep-green desk-lamp accents.',
    composition: 'Investment statement on the left foreground, calculator centered and the single fifty-euro banknote clearly separated on the right.',
    motionLayers: ['investment statement', 'calculator', 'fifty-euro banknote'],
    stateChange: 'The invested amount remains on the statement while the separate fifty-euro annual cost becomes immediately visible beside it.',
    visibleText: noText,
  }),
  mechanismus: brief({
    sceneMeaning: 'A recurring fee reduces current capital and also leaves less capital available for future growth.',
    mainMotif: 'Topic-specific anchor: an office desk with an ETF factsheet under a magnifying glass, two rows of wooden growth blocks and one early block removed from the fee-affected row.',
    supportMotifs: ['a neutral ETF factsheet under a magnifying glass', 'two comparable rows of wooden growth blocks'],
    causeEffect: 'A red fee marker lifts one early block from the lower row, causing the remaining row to end shorter than the untouched upper row.',
    worldDetails: 'A believable real-world analyst office with a matte desk, natural paper, glass and wood colors, a refined charcoal overall grade, restrained deep-green highlights and soft cinematic side light.',
    composition: 'Factsheet and magnifying glass in the left foreground, removed block in the center and both growth rows extending toward the right background.',
    motionLayers: ['factsheet and magnifying glass', 'red fee marker', 'two growth-block rows'],
    stateChange: 'The fee-affected growth row remains visibly shorter because one early block has been removed.',
    visibleText: noText,
  }),
  beispiel: brief({
    sceneMeaning: 'A small recurring deduction becomes understandable when part of a monthly savings envelope is removed before investing.',
    mainMotif: 'Topic-specific anchor: a kitchen table with a monthly savings envelope, a handwritten household budget sheet, several euro coins and one small red fee envelope taking part of the saved amount.',
    supportMotifs: ['one monthly savings envelope beside the budget sheet', 'one small red fee envelope containing removed coins'],
    causeEffect: 'Several coins move from the savings envelope into the red fee envelope before the remaining coins are placed beside the investment note.',
    worldDetails: 'A believable real-world kitchen with a natural wooden table, realistic euro colors, muted household objects, a refined charcoal evening grade, restrained deep-green accents and warm practical light.',
    composition: 'Budget sheet in the left foreground, savings envelope centered, red fee envelope beside it and the smaller remaining coin group on the right.',
    motionLayers: ['household budget sheet', 'monthly savings envelope', 'red fee envelope and remaining coins'],
    stateChange: 'The savings envelope remains open while the red fee envelope contains removed coins and the investable amount is visibly smaller.',
    visibleText: noText,
  }),
  vergleich: brief({
    sceneMeaning: 'Two ETFs with the same market development can produce different final results because their ongoing costs differ.',
    mainMotif: 'Topic-specific anchor: one financial adviser desk with two neutral ETF folders, identical monthly transfer slips and two transparent result trays containing different final amounts.',
    supportMotifs: ['two neutral ETF folders', 'two result trays receiving identical transfers but different fee deductions'],
    causeEffect: 'Identical transfer slips enter both folders while more red fee receipts leave the expensive option, so its result tray receives less.',
    worldDetails: 'A believable real-world financial adviser office with one coherent desk scene, natural paper, glass and euro colors, a refined charcoal overall grade and restrained deep-green accents.',
    composition: 'Same starting transfer in the center, lower-cost folder and fuller result tray on the left, higher-cost folder and smaller result tray on the right.',
    motionLayers: ['two ETF folders', 'identical transfer slips', 'two result trays and fee receipts'],
    stateChange: 'Both options share the same starting transfer while the higher-cost result tray ends visibly less full.',
    visibleText: noText,
  }),
  entwicklung: brief({
    sceneMeaning: 'The difference caused by recurring fees grows across ten and thirty years of annual investment statements.',
    mainMotif: 'Topic-specific anchor: a home-office wall calendar beside three annual investment statements, with two colored portfolio lines that separate more strongly from the first statement to the last.',
    supportMotifs: ['three annual investment statements pinned beside the calendar', 'two portfolio lines with an increasing gap'],
    causeEffect: 'The lower portfolio line loses a small section at every later statement, so the distance between both final values grows over time.',
    worldDetails: 'A believable real-world home office with a wall calendar, pinned paper statements, natural colors, a refined charcoal overall grade, restrained deep-green accents and soft daylight.',
    composition: 'First statement in the left foreground, middle statement centered and final statement on the right background, with both portfolio lines connecting all three.',
    motionLayers: ['wall calendar', 'three annual statements', 'two separating portfolio lines'],
    stateChange: 'The portfolio lines begin close together and end with a clearly larger gap at the final statement.',
    visibleText: 'Render only these exact German labels and no other text: "10 Jahre" and "30 Jahre"; no headline or subtitle.',
  }),
  rechnung: brief({
    sceneMeaning: 'The calculation connects the invested amount, the fee rate and the annual euro cost before an ETF purchase.',
    mainMotif: 'Topic-specific anchor: a real office desk with a physical calculator, a printed fee disclosure sheet, an investment amount note and one fifty-euro banknote as the practical result.',
    supportMotifs: ['one printed fee disclosure sheet', 'one investment amount note beside the calculator'],
    causeEffect: 'The amount note is placed beside the calculator, the fee rate is entered and the fifty-euro banknote is positioned next to the annual cost line.',
    worldDetails: 'A believable real-world office desk with natural realistic calculator, paper and euro colors, a refined charcoal overall grade, restrained deep-green accents and soft cinematic lighting.',
    composition: 'Investment amount note on the left, calculator large in the center, fee sheet and fifty-euro result on the right foreground.',
    motionLayers: ['investment amount note', 'physical calculator', 'fee disclosure sheet and fifty-euro result'],
    stateChange: 'The completed calculation remains visible through the calculator setup and the separate fifty-euro annual cost beside the disclosure sheet.',
    visibleText: noText,
  }),
};

const contentById = {
  hook: {kicker: 'ETF-KOSTEN', headline: 'Kleine Kosten wirken lange'},
  relevanz: {kicker: 'DEIN SPARPLAN', headline: 'Gleiche Rate, weniger investiert'},
  zahl: {kicker: 'DIE ZAHL', headline: 'So groß ist der Jahresabzug', primaryNumber: '50 €', secondaryNumber: 'bei 10.000 €'},
  mechanismus: {kicker: 'DER EFFEKT', headline: 'Kosten bremsen zweimal'},
  beispiel: {kicker: 'KONKRETES BEISPIEL', headline: 'Ein kleiner Teil fehlt sofort'},
  vergleich: {kicker: 'DIREKTER VERGLEICH', headline: 'Gleiche Basis, anderes Ergebnis'},
  entwicklung: {kicker: 'ÜBER DIE ZEIT', headline: 'Der Abstand wächst langsam'},
  rechnung: {kicker: 'EINFACH GERECHNET', headline: 'So entsteht der Abzug', primaryNumber: '0,5 %', secondaryNumber: '50 € pro Jahr', formula: '10.000 € × 0,5 %', outcome: '50 € jährliche Kosten', calculation: {input: 10000, operation: 'multiply', operand: 0.005, result: 50, currency: 'EUR', tolerance: 0.01}},
  payoff: {kicker: 'MERKSATZ', headline: 'Laufende Kosten wirken mit', body: 'Vergleiche Kostenquote und Laufzeit gemeinsam'},
};

export const createFinanceTestPlan = ({slug = 'finance-test-plan', title = 'ETF-Gebühren über 30 Jahre', topic = 'ETF-Gebühren'} = {}) => {
  const plan = createFinanceScenePlanTemplate({slug, title, topic});
  plan.centralQuestion = 'Was kosten 0,5 Prozent mehr ETF-Gebühren über 30 Jahre?';
  plan.payoff = 'Kleine laufende Gebühren reduzieren jedes Jahr Kapital und mögliche zukünftige Rendite.';
  plan.sources = [];
  plan.scenes = plan.scenes.map((scene, index) => ({
    ...scene,
    voiceText: voiceTexts[index],
    content: {...scene.content, ...contentById[scene.id]},
    ...(briefs[scene.id] ? {imagePrompt: briefs[scene.id]} : {}),
  }));
  plan.scriptText = plan.scenes.map((scene) => scene.voiceText).join(' ');
  return ScenePlan.parse(plan);
};
