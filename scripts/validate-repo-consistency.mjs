#!/usr/bin/env node

// Hält Code, Regelwerk und Anleitungen auf EINEM Stand.
// Verbindliche Layoutquelle ist REEL_STYLE in src/brand/tokens.ts.

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const errors = [];
const notes = [];
const read = (p) => (existsSync(resolve(p)) ? readFileSync(resolve(p), 'utf8') : null);

const PHASENDOKUMENTE = {
  'Phase 1 (ChatGPT)': 'docs/PHASE-1-BRIEFING.md',
  'Phase 2 (Nutzer)': 'docs/3-PHASEN-WORKFLOW.md',
  'Phase 3': 'MASTER-PROMPTS.md',
  'Projekt-Gehirn': 'CLAUDE.md',
  'Produktionsstandard': 'reels/PRODUKTIONSSTANDARD.md',
  'Animationscode-Standard': 'docs/PHASE-1-ANIMATION-CODE-STANDARD.md',
};

for (const [phase, datei] of Object.entries(PHASENDOKUMENTE)) {
  if (!existsSync(resolve(datei))) errors.push(`${phase}: Pflichtdokument fehlt: ${datei}`);
}

const tokens = read('src/brand/tokens.ts');
if (!tokens) {
  errors.push('src/brand/tokens.ts fehlt — ohne diese Quelle ist keine Prüfung möglich.');
} else {
  const zahl = (regex, name) => {
    const treffer = tokens.match(regex);
    if (!treffer) {
      errors.push(`REEL_STYLE: ${name} fehlt in src/brand/tokens.ts.`);
      return null;
    }
    return Number(treffer[1]);
  };

  const werte = {
    headerTop: zahl(/header:\s*\{[\s\S]*?top:\s*(\d+)/, 'header.top'),
    captionBottom: zahl(/caption:\s*\{[\s\S]*?bottom:\s*(\d+)/, 'caption.bottom'),
    captionSize: zahl(/caption:\s*\{[\s\S]*?fontSize:\s*(\d+)/, 'caption.fontSize'),
    visualTop: zahl(/visual:\s*\{[\s\S]*?top:\s*(\d+)/, 'visual.top'),
    visualBottom: zahl(/visual:\s*\{[\s\S]*?bottom:\s*(\d+)/, 'visual.bottom'),
  };

  if (werte.headerTop !== 154) errors.push(`V5 verlangt header.top=154, Code hat ${werte.headerTop}.`);
  if (werte.visualTop !== 320 || werte.visualBottom !== 1480) errors.push(`V5 verlangt Visual 320–1480, Code hat ${werte.visualTop}–${werte.visualBottom}.`);
  if (werte.captionBottom !== 340) errors.push(`V5 verlangt caption.bottom=340, Code hat ${werte.captionBottom}.`);
  if (!tokens.includes("presentation: 'plain'")) errors.push('REEL_STYLE.header muss presentation=plain verwenden.');
  if (!tokens.includes('headlineColor: C.whiteSoft')) errors.push('V5-Headertext muss neutral weiß aus REEL_STYLE kommen.');

  const VERALTET = [
    {muster: /Y\s*=\s*78\b/, hinweis: `Header Y=78 statt ${werte.headerTop}`},
    {muster: /Y\s*=\s*118\b/, hinweis: `Header Y=118 statt ${werte.headerTop}`},
    {muster: /270\s*[–-]\s*1350/, hinweis: `Visual 270–1350 statt ${werte.visualTop}–${werte.visualBottom}`},
    {muster: /390\s*[–-]\s*1560/, hinweis: `Visual 390–1560 statt ${werte.visualTop}–${werte.visualBottom}`},
    {muster: /285\s*px über dem unteren Rand|bottom\s*=\s*285\b/, hinweis: `Untertitel 285 statt ${werte.captionBottom}`},
    {muster: /320\s*px über dem unteren Rand/, hinweis: `Untertitel 320 statt ${werte.captionBottom}`},
    {muster: /Headline in FinanzNeo-Grün|Headline immer grün|grüne Headline|Headline.*grün/i, hinweis: 'grüner Headertext statt weißem V5-Text'},
    {muster: /textTransform:\s*['"]uppercase['"]/, hinweis: 'automatische ALL-CAPS-Transformation im Header'},
    {muster: /Bild 00.{0,40}(Stilreferenz|als Referenz)/i, hinweis: 'Bild 00 als Stilreferenz, obwohl Bildreferenzen verboten sind'},
  ];

  const PRUEFEN = [
    'CLAUDE.md',
    'reels/PRODUKTIONSSTANDARD.md',
    'docs/PHASE-1-BRIEFING.md',
    'docs/FINANZNEO-CAPTION-AND-SCENE-DESIGN-V2.md',
    'docs/3-PHASEN-WORKFLOW.md',
    'MASTER-PROMPTS.md',
    'src/production/reel-template/README.md',
    'START-HIER.md',
  ];

  for (const datei of PRUEFEN) {
    const inhalt = read(datei);
    if (!inhalt) continue;
    for (const {muster, hinweis} of VERALTET) {
      const zeilen = inhalt.split('\n').filter((z) => muster.test(z));
      const echte = zeilen.filter((z) => !/\bkeine?\b|\bnie(mals)?\b|statt|nicht|verboten|untersagt|früher|alt(?:e|en|er)?|V4|✗|max\.|>/i.test(z));
      if (echte.length > 0) {
        errors.push(`${datei} nennt ${hinweis}: "${echte[0].trim().slice(0, 90)}"`);
      }
    }
  }

  const briefing = read('docs/PHASE-1-BRIEFING.md');
  if (briefing) {
    const PFLICHT = [
      ['Wortbudget pro Szene', /WORTBUDGET PRO SZENE/],
      ['szenenweises Skript', /SZENE FÜR SZENE/],
      ['natürliche Überschrift als Aussage/Frage', /AUSSAGESATZ|Aussage oder Frage/],
      ['Plain Header', /KEINE Capsule|Plain-Header|plain/i],
      ['V5 Header Y154', /Y\s*=\s*154/],
      ['V5 Visual 320–1480', /320[–-]1480/],
      ['V5 Caption bottom 340', /340 px/],
      ['Untertitel ohne Vorgreifen', /KEIN VORGREIFEN/],
      ['nahtloser Hintergrund', /ONE single seamless continuous/],
      ['1:1-Quellbilder', /GENERATED_IMAGE_ASPECT_RATIO: 1:1/],
      ['Icon-Liste', /euro, clock, hourglass/],
      ['fertiger Phase-1-Animationscode', /animation\.tsx/],
      ['Animationscode-Lock', /finanzneo-phase1-animation-code-v1/],
      ['Math.sin-Hack verboten', /Math\.sin\/Math\.cos|Math\.sin/],
      ['Selbstprüfung', /SELBSTPRÜFUNG VOR ABGABE/],
    ];
    for (const [name, muster] of PFLICHT) {
      if (!muster.test(briefing)) errors.push(`Phase-1-Briefing enthält keine Regel zu: ${name}`);
    }

    const iconSource = read('src/brand/components/Icon.tsx');
    if (iconSource) {
      const start = iconSource.indexOf('const PATHS');
      const block = iconSource.slice(start, iconSource.indexOf('\n};', start));
      const echteIcons = [...block.matchAll(/^\s+'?([a-z][a-zA-Z-]*)'?\s*:/gm)].map((m) => m[1]);
      const fehlend = echteIcons.filter((i) => !briefing.includes(i));
      if (fehlend.length > 3) errors.push(`Phase-1-Briefing listet ${fehlend.length} vorhandene Icons nicht: ${fehlend.slice(0, 6).join(', ')}…`);
    }
    notes.push('Phase-1-Briefing enthält V5-Layout, Plain-Header und kanonischen Animationscode-Vertrag.');
  }

  notes.push(`Layoutwerte konsistent: Header Y=${werte.headerTop} · Visual ${werte.visualTop}–${werte.visualBottom} · Untertitel ${werte.captionBottom} · ${werte.captionSize} px.`);
}

const gehirn = read('CLAUDE.md');
if (gehirn && !gehirn.includes('PHASE-1-BRIEFING')) errors.push('CLAUDE.md verweist nicht auf das Phase-1-Briefing.');
if (gehirn && !gehirn.includes('PHASE-1-ANIMATION-CODE-STANDARD')) errors.push('CLAUDE.md verweist nicht auf den Phase-1-Animationscode-Standard.');
const master = read('MASTER-PROMPTS.md');
if (master && !master.includes('PHASE-1-BRIEFING')) errors.push('MASTER-PROMPTS.md verweist nicht auf das Phase-1-Briefing.');

if (errors.length) {
  console.error('\nRepo-Konsistenz verletzt:\n');
  errors.forEach((e) => console.error(`- ${e}`));
  console.error('\nVerbindliche Quelle ist REEL_STYLE in src/brand/tokens.ts sowie CLAUDE.md für Produktionsverantwortung.');
  process.exit(1);
}

console.log('\n✓ Repo-Konsistenz erfüllt.');
notes.forEach((n) => console.log(`✓ ${n}`));
console.log('✓ Alle drei Phasen haben ein auffindbares Einstiegsdokument.');
