// Prüft Flow-Bildprompts. Auslöser war der erste echte Flow-Lauf (Notgroschen,
// 2026-10-04): „investment value block“ und „3.000-euro value stack“ wurden zu
// leuchtenden roten Glasbalken, und jeder Prompt war anders und zu lang formuliert.
// Geprüft wird nur, was ein Prompt positiv verlangt — „no glowing bars“ ist erlaubt.
import {
  YOUTUBE_FLOW_PROMPT_CLOSING,
  YOUTUBE_FLOW_PROMPT_MAX_TEXTS,
  YOUTUBE_FLOW_PROMPT_MAX_WORDS,
  YOUTUBE_FLOW_PROMPT_OPENING,
} from './youtube-contract.mjs';

// Diese Wörter schieben Flow Richtung Hochglanz-KI-Poster. Den Look legt der feste Anfang fest.
const STYLE_BUZZWORDS = /\b(?:premium|cinematic|epic|dramatic|masterpiece|hyper[- ]?(?:detailed|realistic)|ultra[- ]detailed|8k|4k|glossy|luxurious|stunning|breathtaking|award[- ]winning)\b/i;

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

// Nur Prompt-Zeilen im festen FinanzNeo-Format prüfen, nicht Regeltexte oder Verbotslisten drumherum.
const promptParagraphs = (text) => text
  .split('\n')
  .filter((line) => /^\s*Stylized 3D animated (?:feature )?film still/i.test(line));

export const countFlowPrompts = (text) => promptParagraphs(text).length;

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

// Jeder Prompt hat dieselbe kurze Form — sonst ist er nicht einheitlich.
export const findFlowPromptFormIssues = (text) => {
  const issues = [];
  for (const paragraph of promptParagraphs(text)) {
    const prompt = paragraph.trim();
    const preview = prompt.slice(0, 80);
    if (!prompt.startsWith(YOUTUBE_FLOW_PROMPT_OPENING)) issues.push(`beginnt nicht exakt mit „${YOUTUBE_FLOW_PROMPT_OPENING}“: "${preview}"`);
    if (!prompt.endsWith(YOUTUBE_FLOW_PROMPT_CLOSING)) issues.push(`endet nicht exakt mit „${YOUTUBE_FLOW_PROMPT_CLOSING}“: "${preview}"`);
    const words = prompt.split(/\s+/).length;
    if (words > YOUTUBE_FLOW_PROMPT_MAX_WORDS) issues.push(`hat ${words} Wörter, erlaubt sind ${YOUTUBE_FLOW_PROMPT_MAX_WORDS}: "${preview}"`);
    const texts = prompt.match(/"[^"]+"/g) ?? [];
    if (texts.length > YOUTUBE_FLOW_PROMPT_MAX_TEXTS) issues.push(`verlangt ${texts.length} Texte im Bild, erlaubt sind ${YOUTUBE_FLOW_PROMPT_MAX_TEXTS}: "${preview}"`);
    for (const sentence of prompt.split(/(?<=[.!?])\s+/)) {
      const buzzword = positiveText(sentence).match(STYLE_BUZZWORDS);
      if (buzzword) issues.push(`nutzt Hochglanz-Wort „${buzzword[0]}“: "${sentence.trim().slice(0, 80)}"`);
    }
  }
  return issues;
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
