#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {AssetManifest} from './lib/finance-contracts.mjs';
import {loadFinanceConfig} from './lib/load-finance-config.mjs';
import {financeProjectPaths} from './lib/finance-project-structure.mjs';

const config = loadFinanceConfig();
const args = process.argv.slice(2);
const rootArg = args.find((arg) => !arg.startsWith('--'));
if (!rootArg) {
  console.error('Nutzung: node scripts/ingest-finance-assets.mjs <projektordner> [--slug=name] [--out=asset-manifest.json]');
  process.exit(1);
}
const option = (name, fallback) => {
  const hit = args.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const root = path.resolve(rootArg);
if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`Projektordner nicht gefunden: ${root}`);
const paths = financeProjectPaths(root);
const readSlug = () => {
  for (const file of [paths.scenePlan, paths.status]) {
    if (!fs.existsSync(file)) continue;
    try {
      const value = JSON.parse(fs.readFileSync(file, 'utf8')).slug;
      if (typeof value === 'string' && value.trim()) return value.trim();
    } catch {
      // Die Vertragsprüfung meldet ungültiges JSON später.
    }
  }
  return undefined;
};
const slug = option('slug', readSlug());
if (!slug) throw new Error('Reel-Slug fehlt in 06-projektdateien.');
const out = path.resolve(option('out', paths.manifest));

const imageExt = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);
const audioExt = new Set(['.wav', '.mp3', '.m4a', '.aac', '.flac', '.ogg']);
const videoExt = new Set(['.mp4', '.mov', '.webm', '.mkv']);
const captionsExt = new Set(['.srt', '.vtt']);
const normalized = (value) => value.split(path.sep).join('/');

const walk = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
};

const runtimeFiles = [
  ...walk(paths.audioDir),
  ...walk(paths.imagesDir),
  ...(fs.existsSync(paths.captionsFinal) ? [paths.captionsFinal] : []),
].filter((file) => !file.endsWith('.DS_Store') && !['.md', '.txt', '.pdf'].includes(path.extname(file).toLowerCase()));

const cleanId = (value) => value
  .replace(/\.[^.]+$/, '')
  .replace(/[^a-zA-Z0-9äöüÄÖÜß]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .toLowerCase();
const idFrom = (relative) => {
  const value = normalized(relative);
  const mappings = [
    ['01-script-audio/audio/', 'audio-'],
    ['02-bilder/images/', 'images-'],
    ['03-caption/', 'captions-'],
  ];
  for (const [prefix, idPrefix] of mappings) {
    if (value.startsWith(prefix)) return `${idPrefix}${cleanId(value.slice(prefix.length))}`;
  }
  return cleanId(value);
};

const classifySfxRole = (lower) => {
  if (lower.includes('whoosh')) return 'sfx-soft-whoosh';
  if (lower.includes('impact') || lower.includes('hit')) return 'sfx-number-impact';
  if (lower.includes('click') || lower.includes('tap')) return 'sfx-click';
  if (lower.includes('warning') || lower.includes('alert')) return 'sfx-warning';
  if (lower.includes('success') || lower.includes('positive')) return 'sfx-success';
  return 'sfx';
};
const classify = (file) => {
  const ext = path.extname(file).toLowerCase();
  const lower = normalized(path.relative(root, file)).toLowerCase();
  if (imageExt.has(ext)) return {kind: 'image', role: lower.includes('cover') ? 'cover' : 'scene-image'};
  if (audioExt.has(ext)) {
    if (/01-script-audio\/audio\/voiceover-final\.(wav|mp3|m4a)$/.test(lower)) return {kind: 'audio', role: 'voiceover-final'};
    if (lower.includes('/sfx/')) return {kind: 'audio', role: classifySfxRole(lower)};
    return {kind: 'audio', role: 'audio'};
  }
  if (videoExt.has(ext)) return {kind: 'video', role: 'scene-video'};
  if (captionsExt.has(ext) || (ext === '.json' && lower.includes('caption'))) return {kind: 'captions', role: 'word-timestamps'};
  if (ext === '.json') return {kind: 'data', role: 'data'};
  return {kind: 'other', role: 'other'};
};
const mediaDuration = (file) => {
  try {
    return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file], {encoding: 'utf8'}).trim());
  } catch {
    return undefined;
  }
};
const digest = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const meanAndStdDev = (data, width, startRow, endRow) => {
  let sum = 0;
  let sumSquares = 0;
  let count = 0;
  for (let y = startRow; y < endRow; y += 1) for (let x = 0; x < width; x += 1) {
    const value = data[y * width + x];
    sum += value;
    sumSquares += value * value;
    count += 1;
  }
  const mean = count ? sum / count : 0;
  const variance = count ? Math.max(0, sumSquares / count - mean * mean) : 0;
  return {mean, stdDev: Math.sqrt(variance)};
};
const imageAnalysis = async (file, metadata) => {
  const stats = await sharp(file).stats();
  const channels = stats.channels.slice(0, Math.min(3, stats.channels.length));
  const brightness = channels.length ? channels.reduce((sum, channel) => sum + channel.mean, 0) / channels.length / 255 : 0.5;
  const entropy = Number.isFinite(stats.entropy) ? stats.entropy : 0;
  const visualDensity = entropy < config.imageAnalysis.lowDensityEntropy ? 'low' : entropy > config.imageAnalysis.highDensityEntropy ? 'high' : 'medium';
  const {data, info} = await sharp(file).resize(90, 160, {fit: 'cover', position: 'attention'}).greyscale().raw().toBuffer({resolveWithObject: true});
  const whole = meanAndStdDev(data, info.width, 0, info.height);
  const zoneRows = Math.max(1, Math.round(info.height * config.imageAnalysis.safeZoneHeightRatio));
  const top = meanAndStdDev(data, info.width, 0, zoneRows);
  const bottom = meanAndStdDev(data, info.width, info.height - zoneRows, info.height);
  let weightedX = 0;
  let weightedY = 0;
  let totalWeight = 0;
  for (let y = 0; y < info.height; y += 1) for (let x = 0; x < info.width; x += 1) {
    const weight = Math.abs(data[y * info.width + x] - whole.mean) + 1;
    weightedX += x * weight;
    weightedY += y * weight;
    totalWeight += weight;
  }
  const hashBuffer = await sharp(file).resize(8, 8, {fit: 'cover', position: 'attention'}).greyscale().raw().toBuffer();
  const hashMean = [...hashBuffer].reduce((sum, value) => sum + value, 0) / hashBuffer.length;
  const aspect = metadata.width && metadata.height ? metadata.width / metadata.height : 9 / 16;
  return {
    brightness: Number(brightness.toFixed(4)),
    entropy: Number(entropy.toFixed(4)),
    visualDensity,
    recommendedFit: aspect >= config.imageAnalysis.portraitAspectMin && aspect <= config.imageAnalysis.portraitAspectMax ? 'cover' : 'contain',
    focalPoint: {x: Number(((weightedX / totalWeight) / Math.max(1, info.width - 1)).toFixed(4)), y: Number(((weightedY / totalWeight) / Math.max(1, info.height - 1)).toFixed(4))},
    safeTop: top.stdDev <= config.imageAnalysis.safeZoneMaximumStdDev,
    safeBottom: bottom.stdDev <= config.imageAnalysis.safeZoneMaximumStdDev,
    perceptualHash: [...hashBuffer].map((value) => value >= hashMean ? '1' : '0').join(''),
  };
};

const assets = [];
for (const file of runtimeFiles) {
  const relative = normalized(path.relative(root, file));
  const extension = path.extname(file).toLowerCase();
  const {kind, role} = classify(file);
  const stat = fs.statSync(file);
  const asset = {id: idFrom(relative), kind, role, file: relative, extension, bytes: stat.size, sha256: digest(file)};
  if (kind === 'image') {
    try {
      const metadata = await sharp(file).metadata();
      if (metadata.width) asset.width = metadata.width;
      if (metadata.height) asset.height = metadata.height;
      asset.imageAnalysis = await imageAnalysis(file, metadata);
    } catch (error) {
      console.warn(`Warnung: Bildanalyse nicht möglich (${relative}): ${error.message}`);
    }
  }
  if (kind === 'audio' || kind === 'video') {
    const durationSeconds = mediaDuration(file);
    if (Number.isFinite(durationSeconds) && durationSeconds > 0) asset.durationSeconds = Number(durationSeconds.toFixed(3));
  }
  assets.push(asset);
}
assets.sort((a, b) => a.file.localeCompare(b.file, 'de'));
const manifest = AssetManifest.parse({version: 'finance-v1', slug, root: normalized(path.relative(process.cwd(), root) || '.'), generatedAt: new Date().toISOString(), assets});
fs.mkdirSync(path.dirname(out), {recursive: true});
fs.writeFileSync(out, JSON.stringify(manifest, null, 2));
const counts = assets.reduce((acc, asset) => ({...acc, [asset.kind]: (acc[asset.kind] || 0) + 1}), {});
console.log(`✓ ${assets.length} Render-Assets erfasst → ${out}`);
console.log(counts);
