// Lokales Chrome für Screenshots (Belege, Cover). Kein npm-Paket nötig.
import {existsSync, globSync} from 'node:fs';

export const findeChrome = () => [
  process.env.FINANZNEO_CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  `${process.env.ProgramFiles}/Google/Chrome/Application/chrome.exe`,
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  ...globSync('node_modules/.remotion/chrome-headless-shell/**/chrome-headless-shell{,.exe}'),
].filter(Boolean).find((p) => existsSync(p));
