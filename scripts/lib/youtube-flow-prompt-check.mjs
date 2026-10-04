// Findet abstrakte KI-Poster-Motive in Flow-Bildprompts. Auslöser war der erste
// echte Flow-Lauf (Notgroschen, 2026-10-04): „investment value block“ und
// „3.000-euro value stack“ wurden zu leuchtenden roten Glasbalken.
// Geprüft wird nur, was ein Prompt positiv verlangt — „no glowing bars“ ist erlaubt.

const ABSTRACT_FLOW_TERMS = [
  {pattern: /\b(?:investment[- ])?value[- ](?:blocks?|stacks?|columns?|towers?|bars?)\b/i, label: 'Wertblock/Wertstapel'},
  {pattern: /\binvestment[- ](?:blocks?|stacks?|columns?|towers?)\b/i, label: 'Investment-Block'},
  {pattern: /\b(?:glass|crystal|translucent|acrylic)[- ](?:bars?|columns?|blocks?|towers?|arrows?|charts?)\b/i, label: 'Glas-/Kristall-Symbol'},
  {pattern: /\b(?:glowing|neon|holographic|hologram)\b/i, label: 'Leuchten/Neon/Hologramm'},
  {pattern: /\b(?:bar|line|pie)[- ](?:charts?|graphs?)\b/i, label: 'Diagramm (gehört zu Remotion)'},
  {pattern: /\bfalling[- ](?:bars?|arrows?|charts?|graphs?)\b/i, label: 'fallende Balken/Pfeile'},
  {pattern: /\b(?:coin|money|cash|banknote)[- ](?:mountains?|towers?|walls?)\b/i, label: 'Geldberg/Geldturm'},
  {pattern: /\b(?:smoke|sparks|explosions?|lightning|lens flares?)\b/i, label: 'Effekt-Drama (Rauch/Funken/Flares)'},
  {pattern: /\b(?:epic|dramatic)[- ](?:glow|lighting|light|red|poster|scene)\b/i, label: 'KI-Poster-Drama'},
];

const NEGATION = /\b(?:no|not|never|without|avoid|nothing|kein|keine|nicht|ohne)\b/i;

// Nur Prompt-Absätze im festen FinanzNeo-Format prüfen, nicht die Verbotslisten drumherum.
const promptParagraphs = (text) => text
  .split('\n')
  .filter((line) => /Stylized 3D animated feature film still/i.test(line));

const positiveText = (sentence) => {
  const kept = [];
  for (const clause of sentence.split(/[,;]|\s[—–-]\s/)) {
    const negation = clause.search(NEGATION);
    if (negation === -1) {
      kept.push(clause);
      continue;
    }
    // Ab der ersten Verneinung gilt der Rest des Satzes als Verbotsliste („no X, Y or Z“).
    kept.push(clause.slice(0, negation));
    break;
  }
  return kept.join(',');
};

export const findAbstractFlowPromptTerms = (text) => {
  const findings = [];
  for (const paragraph of promptParagraphs(text)) {
    for (const sentence of paragraph.split(/(?<=[.!?])\s+/)) {
      const positive = positiveText(sentence);
      for (const {pattern, label} of ABSTRACT_FLOW_TERMS) {
        const match = positive.match(pattern);
        if (match) findings.push({label, term: match[0], sentence: sentence.trim()});
      }
    }
  }
  return findings;
};
