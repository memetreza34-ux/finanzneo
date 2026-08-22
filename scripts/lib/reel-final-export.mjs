import {existsSync, readdirSync, statSync} from 'node:fs';
import {extname, resolve} from 'node:path';
import {REEL_FINAL_EXPORT} from './reel-contract.mjs';

const VIDEO_EXTENSIONS = new Set(['.mp4']);
const COVER_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

const isNonEmptyFile = (path) => existsSync(path) && statSync(path).isFile() && statSync(path).size > 0;

export const analyzeReelFinalExport = (rootDirectory) => {
  const root = resolve(rootDirectory);
  const directory = resolve(root, REEL_FINAL_EXPORT.directory);
  const videoPath = resolve(root, REEL_FINAL_EXPORT.videoFile);
  const coverPath = resolve(root, REEL_FINAL_EXPORT.coverFile);
  const blockers = [];

  if (!existsSync(directory) || !statSync(directory).isDirectory()) {
    blockers.push(`Exportordner fehlt: ${REEL_FINAL_EXPORT.directory}/`);
    return {ready: false, blockers, videoPath, coverPath};
  }

  if (!isNonEmptyFile(videoPath)) blockers.push(`Finales Reel fehlt oder ist leer: ${REEL_FINAL_EXPORT.videoFile}`);
  if (!isNonEmptyFile(coverPath)) blockers.push(`Finales Cover fehlt oder ist leer: ${REEL_FINAL_EXPORT.coverFile}`);

  const mediaFiles = readdirSync(directory).filter((entry) => {
    const path = resolve(directory, entry);
    if (!statSync(path).isFile()) return false;
    const extension = extname(entry).toLowerCase();
    return VIDEO_EXTENSIONS.has(extension) || COVER_EXTENSIONS.has(extension);
  });
  const videos = mediaFiles.filter((entry) => VIDEO_EXTENSIONS.has(extname(entry).toLowerCase()));
  const covers = mediaFiles.filter((entry) => COVER_EXTENSIONS.has(extname(entry).toLowerCase()));

  if (REEL_FINAL_EXPORT.exactlyOneVideo && videos.length !== 1) {
    blockers.push(`${REEL_FINAL_EXPORT.directory}/ muss genau ein MP4 enthalten; gefunden: ${videos.length}.`);
  }
  if (REEL_FINAL_EXPORT.exactlyOneCover && covers.length !== 1) {
    blockers.push(`${REEL_FINAL_EXPORT.directory}/ muss genau ein Coverbild enthalten; gefunden: ${covers.length}.`);
  }

  return {ready: blockers.length === 0, blockers, videoPath, coverPath};
};
