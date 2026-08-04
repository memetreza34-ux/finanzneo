// ════════════════════════════════════════════════════════════════════════
//  FINANZNEO · FONTS
//  Bebas Neue (Titel/Zahlen) + Inter (Text) — lokal geladen, render-sicher.
// ════════════════════════════════════════════════════════════════════════
import {continueRender, delayRender, staticFile} from 'remotion';

export const FONT = {
  title: 'Bebas Neue', // große Titel & Zahlen
  display: 'Bebas Neue', // semantischer Alias für datenbasierte Templates
  body: 'Inter', // Fließtext & Labels
} as const;

const canLoadBrowserFonts =
  typeof FontFace !== 'undefined' &&
  typeof document !== 'undefined' &&
  typeof document.fonts?.add === 'function';

// Nur echte Browser-/Remotion-Renderumgebungen erhalten einen Delay-Handle.
// Node-basierte Typechecks und Vitest-Läufe besitzen weder FontFace noch
// document.fonts und dürfen deshalb beim Modulimport nicht abstürzen.
const handle = canLoadBrowserFonts
  ? delayRender('FinanzNeo Fonts laden', {timeoutInMilliseconds: 900000})
  : null;

let fontsDone = false;
const finishFonts = () => {
  if (fontsDone) return;
  fontsDone = true;
  if (handle !== null) continueRender(handle);
};

if (canLoadBrowserFonts) {
  const faces: FontFace[] = [
    new FontFace('Bebas Neue', `url(${staticFile('fonts/BebasNeue-400.woff2')})`, {weight: '400'}),
    new FontFace('Inter', `url(${staticFile('fonts/Inter-400.woff2')})`, {weight: '400'}),
    new FontFace('Inter', `url(${staticFile('fonts/Inter-600.woff2')})`, {weight: '600'}),
    new FontFace('Inter', `url(${staticFile('fonts/Inter-700.woff2')})`, {weight: '700'}),
    new FontFace('Inter', `url(${staticFile('fonts/Inter-800.woff2')})`, {weight: '800'}),
    new FontFace('Inter', `url(${staticFile('fonts/Inter-900.woff2')})`, {weight: '900'}),
  ];

  Promise.all(
    faces.map((face) => face.load().then((loaded) => document.fonts.add(loaded))),
  )
    .then(finishFonts)
    .catch((error) => {
      console.error('Font load error', error);
      finishFonts();
    });

  setTimeout(finishFonts, 8000);
} else {
  finishFonts();
}
