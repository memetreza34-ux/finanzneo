#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {financeProjectPaths} from './lib/finance-project-structure.mjs';

const reelDirArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
if (!reelDirArg) {
  console.error('Nutzung: node scripts/check-finance-social-caption.mjs <projektordner>');
  process.exit(1);
}
const reelDir = path.resolve(reelDirArg);
const paths = financeProjectPaths(reelDir);
if (!fs.existsSync(paths.socialCaption) || !fs.statSync(paths.socialCaption).isFile() || fs.statSync(paths.socialCaption).size === 0) {
  console.error('✗ [SOCIAL_CAPTION_MISSING] captions/social-caption.md fehlt oder ist leer.');
  process.exit(1);
}

const source = fs.readFileSync(paths.socialCaption, 'utf8');
const findings = [];
if (source.includes('FINANCE_TODO_SOCIAL_CAPTION') || /\bKEYWORD\b/i.test(source)) findings.push('[SOCIAL_CAPTION_PLACEHOLDER] Caption enthält noch TODO oder KEYWORD.');
const content = source
  .split(/\r?\n/)
  .filter((line) => !/^\s*#\s/.test(line) && !/^\s*<!--/.test(line) && !/^\s*-->/.test(line))
  .join('\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();
const firstLine = content.split(/\r?\n/).find((line) => line.trim())?.trim() ?? '';
if (!firstLine.startsWith('💬 Kommentiere ')) findings.push('[SOCIAL_CAPTION_CTA_START] Erste Inhaltszeile muss mit „💬 Kommentiere …“ beginnen.');
if (!/kostenlos/i.test(firstLine)) findings.push('[SOCIAL_CAPTION_FREE_BENEFIT] Erste Zeile muss den kostenlosen Nutzen nennen.');
if (content.length > 2200) findings.push(`[SOCIAL_CAPTION_TOO_LONG] Caption hat ${content.length} Zeichen; maximal 2200.`);
const hashtags = [...content.matchAll(/(^|\s)(#[\p{L}\p{N}_]+)/gu)].map((match) => match[2]);
if (hashtags.length !== 5) findings.push(`[SOCIAL_CAPTION_HASHTAG_COUNT] Genau fünf Hashtags sind Pflicht; gefunden: ${hashtags.length}.`);
if (new Set(hashtags.map((tag) => tag.toLocaleLowerCase('de-DE'))).size !== hashtags.length) findings.push('[SOCIAL_CAPTION_HASHTAG_DUPLICATE] Hashtags dürfen sich nicht wiederholen.');
const contentWithoutHashtags = content.replace(/(^|\s)#[\p{L}\p{N}_]+/gu, ' ').trim();
if (!contentWithoutHashtags.includes('?')) findings.push('[SOCIAL_CAPTION_QUESTION_MISSING] Caption benötigt eine Frage an die Zuschauer.');
if (/<[^>]+>|FINANCE_TODO|\[.+?\]/.test(content)) findings.push('[SOCIAL_CAPTION_NOT_COPY_READY] Caption enthält technische Marker oder Platzhalter.');

if (findings.length) {
  console.error(`✗ Social-Media-Caption nicht freigegeben: ${findings.length} Fehler.`);
  for (const finding of findings) console.error(`  ${finding}`);
  process.exit(1);
}
console.log(`✓ Social-Media-Caption freigegeben: ${content.length} Zeichen, fünf eindeutige Hashtags, Kommentar-CTA und Frage.`);
