#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';

const path = 'scripts/apply-flow-autonomous-contract.mjs';
let source = readFileSync(path, 'utf8');

const replacement = `const coverFileHeader = [
  'FLOW_COVER_FILE_BEGIN',
  FLOW_COVER_WORKFLOW_MARKER,
  'COVER_VARIANT_COUNT: 3',
  'COVER_PARALLEL_GENERATION_REQUIRED: true',
  \`COVER_CONCURRENCY: \${FLOW_COVER_CONCURRENCY}\`,
  'COVER_SEPARATE_JOBS_REQUIRED: true',
  'COVER_MULTI_IMAGE_REQUEST_FORBIDDEN: true',
  'COVER_TEXT_REQUIRED: true',
  'COVER_TEXT_MAX_LINES: 2',
  'COVER_TEXT_IDEAL_WORDS: 2-5',
  'COVER_TEXT_MUST_DESCRIBE_REEL_CONTENT: true',
  'COVER_LONG_SENTENCE_FORBIDDEN: true',
  'COVER_SELECTION_REQUIRED: true',
  'SELECTED_COVER_BECOMES_SCENE_01: true',
  'SELECTED_COVER_IS_STYLE_REFERENCE: false',
  'IMAGE_TO_IMAGE_STYLE_REFERENCE_FORBIDDEN: true',
  'STYLE_AUTHORITY: finanzneo-stylized-3d-animated-black-v9',
  '',
  'A/B/C parallel als 3 getrennte Jobs. Alle direkt V9. Hook nur Reel-Inhalt: max. 2 Zeilen, ideal 2–5 Wörter; kein langer Satz, Clickbait oder erfundene Fakten. Danach A/B/C wählen; Gewinner = scene-01, nie Style-Referenz.',
  'FLOW_COVER_FILE_END',
  '',
].join('\\n');`;

const next = source.replace(/const coverFileHeader = \[[\s\S]*?\]\.join\('\\n'\);/, replacement);
if (next === source) throw new Error('coverFileHeader block not replaced');
writeFileSync(path, next, 'utf8');
console.log('✓ Cover-Header unter V9-Limit gekürzt.');
