// FinanzNeo-Cover V1 (Arman, 30.10.2026): feste Thumbnail-Vorlage statt Flow-Text.
//
// Flow liefert nur die Illustration (rechte Bildhälfte, ohne Text). Der Text wird exakt gesetzt:
// höchstens zwei Zeilen, ein Wort/eine Zahl mit dem gelben FinanzNeo-Marker — derselbe Marker
// wie in den Beleg-Szenen („wir haben nachgeprüft“). Creme bleibt, weil die großen
// Finanzkanäle dunkel/grün sind und Creme im Feed auffällt.
// Kanonische Regel: docs/YOUTUBE-BILDMIX-UND-COVER.md

export const YOUTUBE_COVER_STANDARD_ID = 'finanzneo-youtube-cover-v1';
export const YOUTUBE_COVER_BREITE = 1280;
export const YOUTUBE_COVER_HOEHE = 720;
export const YOUTUBE_COVER_DATEI = '04-visuals/cover.png';
export const YOUTUBE_COVER_KLEIN_DATEI = '04-visuals/cover-feed-vorschau.png';
/** Lesbar in der Feed-Größe am Handy: wenige, kurze Wörter. */
export const YOUTUBE_COVER_MAX_WOERTER = 5;
export const YOUTUBE_COVER_MAX_ZEICHEN_ZEILE = 18;

const FARBEN = {
  grund: '#F6EAD0',
  tinte: '#1E2822',
  rot: '#B8483F',
  gruen: '#3F7A57',
  marker: 'rgba(255, 205, 60, 0.95)',
};

const text = (wert) => typeof wert === 'string' && wert.trim() && !wert.trim().startsWith('[');

/** Phase-1-Prüfung der Cover-Angaben aus visual-plan.mjs (`thumbnail.cover`). */
export const pruefeCover = (cover) => {
  const fehler = [];
  if (!cover) return ['thumbnail.cover fehlt: {zeilen: [..], marker, ton} für die feste FinanzNeo-Vorlage.'];
  const zeilen = Array.isArray(cover.zeilen) ? cover.zeilen : [];
  if (zeilen.length < 1 || zeilen.length > 2 || !zeilen.every(text)) fehler.push('thumbnail.cover.zeilen: eine oder zwei Textzeilen.');
  const woerter = zeilen.join(' ').split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;
  if (woerter > YOUTUBE_COVER_MAX_WOERTER) fehler.push(`thumbnail.cover: ${woerter} Wörter — höchstens ${YOUTUBE_COVER_MAX_WOERTER}, sonst im Feed unlesbar.`);
  for (const z of zeilen) if (typeof z === 'string' && z.length > YOUTUBE_COVER_MAX_ZEICHEN_ZEILE) fehler.push(`thumbnail.cover: Zeile „${z}“ hat ${z.length} Zeichen (max. ${YOUTUBE_COVER_MAX_ZEICHEN_ZEILE}).`);
  if (!text(cover.marker) || !zeilen.some((z) => typeof z === 'string' && z.includes(cover.marker))) fehler.push('thumbnail.cover.marker muss ein Wort oder eine Zahl aus einer der Zeilen sein (bekommt den gelben Marker).');
  if (cover.ton && !['rot', 'gruen', 'tinte'].includes(cover.ton)) fehler.push('thumbnail.cover.ton: rot, gruen oder tinte.');
  if (cover.kicker && (!text(cover.kicker) || cover.kicker.length > 16)) fehler.push('thumbnail.cover.kicker: kurz (max. 16 Zeichen), z. B. „Neu ab 2027“.');
  return fehler;
};

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const mitMarker = (zeile, marker) => {
  const i = zeile.indexOf(marker);
  if (i < 0) return escape(zeile);
  return `${escape(zeile.slice(0, i))}<span class="marker">${escape(marker)}</span>${escape(zeile.slice(i + marker.length))}`;
};

/**
 * HTML des Covers. `bildUrl` = file://-URL der Flow-Illustration (Motiv rechts, links freie Creme).
 * `bildFokus` = CSS object-position, falls das Motiv nicht ganz rechts sitzt.
 */
export const coverHtml = ({bildUrl, zeilen, marker, ton = 'rot', kicker = null, bildFokus = '75% 50%'}) => `<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&display=block" rel="stylesheet">
<style>
  html, body { margin: 0; width: ${YOUTUBE_COVER_BREITE}px; height: ${YOUTUBE_COVER_HOEHE}px; overflow: hidden; background: ${FARBEN.grund}; }
  .bild { position: absolute; right: 0; top: 0; width: 820px; height: 100%; object-fit: cover; object-position: ${bildFokus};
          -webkit-mask-image: linear-gradient(to right, transparent 0, #000 220px); mask-image: linear-gradient(to right, transparent 0, #000 220px); }
  .text { position: absolute; left: 60px; top: 0; bottom: 0; width: 690px; display: flex; flex-direction: column; justify-content: center; gap: 6px;
          font-family: 'Bricolage Grotesque', 'Arial Black', sans-serif; font-weight: 800; letter-spacing: -0.02em; line-height: 0.98; }
  .kicker { align-self: flex-start; margin-bottom: 18px; padding: 10px 20px; border-radius: 12px; background: ${FARBEN.tinte}; color: ${FARBEN.grund}; font-size: 34px; letter-spacing: 0; }
  .zeile { color: ${FARBEN.tinte}; white-space: nowrap; }
  .zeile + .zeile { color: ${FARBEN[ton] ?? FARBEN.rot}; }
  .marker { position: relative; z-index: 0; color: ${FARBEN.tinte}; }
  .marker::before { content: ''; position: absolute; z-index: -1; left: -0.08em; right: -0.08em; top: 0.12em; bottom: 0.02em;
                    background: ${FARBEN.marker}; border-radius: 0.08em; transform: rotate(-1.5deg); }
</style></head>
<body>
  <img class="bild" src="${escape(bildUrl)}">
  <div class="text" id="text">
    ${kicker ? `<div class="kicker">${escape(kicker)}</div>` : ''}
    ${zeilen.map((z) => `<div class="zeile">${mitMarker(z, marker)}</div>`).join('\n    ')}
  </div>
  <script>
    // Größte Schrift, bei der jede Zeile in die linke Spalte passt (max. 176 px, min. 84 px).
    document.fonts.ready.then(() => {
      const zeilen = [...document.querySelectorAll('.zeile')];
      let px = 176;
      const setze = () => zeilen.forEach((z) => { z.style.fontSize = px + 'px'; });
      setze();
      while (px > 84 && zeilen.some((z) => z.scrollWidth > 690)) { px -= 2; setze(); }
      document.body.dataset.fertig = String(px);
    });
  </script>
</body></html>
`;
