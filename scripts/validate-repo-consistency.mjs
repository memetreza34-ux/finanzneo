#!/usr/bin/env node

// Hält Code, Regelwerk und Anleitungen auf EINEM Stand.
//
// Das Repo führt dieselben Werte an mehreren Stellen: im Code (REEL_STYLE),
// im Projekt-Gehirn (CLAUDE.md), im Produktionsstandard und im Phase-1-
// Briefing für ChatGPT. Laufen sie auseinander, baut jede Phase nach einer
// anderen Wahrheit — genau so entstanden uneinheitliche Reels
// (Doku forderte Y=78 und weiße Headlines, der Code lieferte Y=118 und grüne).
//
// Verbindliche Quelle ist immer der Code. Dieser Validator prüft, dass die
// Dokumente dazu passen und dass jede Phase einen Einstieg hat.

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const errors = [];
const notes = [];
const read = (p) => (existsSync(resolve(p)) ? readFileSync(resolve(p), 'utf8') : null);

// ── Pflichtdokumente je Phase ───────────────────────────────────────────────
const PHASENDOKUMENTE = {
  'Phase 1 (ChatGPT)': 'docs/PHASE-1-BRIEFING.md',
  'Phase 2 (Nutzer)': 'docs/3-PHASEN-WORKFLOW.md',
  'Phase 3 (Antigravity)': 'MASTER-PROMPTS.md',
  'Projekt-Gehirn': 'CLAUDE.md',
  'Produktionsstandard': 'reels/PRODUKTIONSSTANDARD.md',
};

for (const [phase, datei] of Object.entries(PHASENDOKUMENTE)) {
  if (!existsSync(resolve(datei))) errors.push(`${phase}: Pflichtdokument fehlt: ${datei}`);
}

// ── Werte aus dem Code lesen (die eine Wahrheit) ────────────────────────────
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

  // Dokumente dürfen keine abweichenden Layoutwerte nennen.
  const VERALTET = [
    {muster: /Y\s*=\s*78\b/, hinweis: `Header-Position 78 statt ${werte.headerTop}`},
    {muster: /270\s*[–-]\s*1350/, hinweis: `Visualzone 270–1350 statt ${werte.visualTop}–${werte.visualBottom}`},
    {muster: /320\s*px über dem unteren Rand/, hinweis: `Untertitel 320 statt ${werte.captionBottom}`},
    {muster: /Headline immer weiß|Headline weiß/, hinweis: 'weiße Headline statt FinanzNeo-Grün'},
    {muster: /scharfer.{0,12}Stroke/i, hinweis: 'Text-Stroke, der repo-weit verboten ist'},
  ];

  // Reel-Projektordner sind Archiv und werden nicht rückwirkend geprüft.
  const PRUEFEN = [
    'CLAUDE.md',
    'reels/PRODUKTIONSSTANDARD.md',
    'docs/PHASE-1-BRIEFING.md',
    'docs/FINANZNEO-CAPTION-AND-SCENE-DESIGN-V2.md',
    'docs/3-PHASEN-WORKFLOW.md',
    'MASTER-PROMPTS.md',
    'src/production/reel-template/README.md',
  ];

  for (const datei of PRUEFEN) {
    const inhalt = read(datei);
    if (!inhalt) continue;
    for (const {muster, hinweis} of VERALTET) {
      // Erklärende Nennungen ("statt", "nicht", "verboten") sind erlaubt.
      const zeilen = inhalt.split('\n').filter((z) => muster.test(z));
      const echte = zeilen.filter((z) => !/statt|nicht |verboten|früher|alt\b|✗|Weight 900|max\.|>/i.test(z));
      if (echte.length > 0) {
        errors.push(`${datei} nennt ${hinweis}: "${echte[0].trim().slice(0, 70)}"`);
      }
    }
  }

  // Das Briefing muss die Kernregeln tatsächlich enthalten.
  const briefing = read('docs/PHASE-1-BRIEFING.md');
  if (briefing) {
    const PFLICHT = [
      ['Wortbudget pro Szene', /WORTBUDGET PRO SZENE/],
      ['szenenweises Skript', /SZENE FÜR SZENE/],
      ['Überschrift als Aussage', /AUSSAGESATZ|ist eine Aussage/],
      ['Untertitel ohne Vorgreifen', /KEIN VORGREIFEN/],
      ['nahtloser Hintergrund', /ONE single seamless continuous/],
      ['1:1-Quellbilder', /GENERATED_IMAGE_ASPECT_RATIO: 1:1/],
      ['Icon-Liste', /euro, clock, hourglass/],
      ['Selbstprüfung', /SELBSTPRÜFUNG VOR ABGABE/],
    ];
    for (const [name, muster] of PFLICHT) {
      if (!muster.test(briefing)) errors.push(`Phase-1-Briefing enthält keine Regel zu: ${name}`);
    }

    // Die Icon-Liste im Briefing muss zu den tatsächlichen Icons passen.
    const iconSource = read('src/brand/components/Icon.tsx');
    if (iconSource) {
      const start = iconSource.indexOf('const PATHS');
      const block = iconSource.slice(start, iconSource.indexOf('\n};', start));
      const echteIcons = [...block.matchAll(/^\s+'?([a-z][a-zA-Z-]*)'?\s*:/gm)].map((m) => m[1]);
      const fehlend = echteIcons.filter((i) => !briefing.includes(i));
      if (fehlend.length > 3) {
        errors.push(`Phase-1-Briefing listet ${fehlend.length} vorhandene Icons nicht: ${fehlend.slice(0, 6).join(', ')}…`);
      }
      const briefingListe = briefing.match(/euro, clock[\s\S]{0,400}?warning/);
      if (briefingListe) {
        const genannt = briefingListe[0].split(/,\s*|\n/).map((x) => x.trim()).filter(Boolean);
        const erfunden = genannt.filter((i) => /^[a-z][a-zA-Z-]*$/.test(i) && !echteIcons.includes(i));
        if (erfunden.length > 0) {
          errors.push(`Phase-1-Briefing nennt Icons, die es nicht gibt: ${erfunden.join(', ')}`);
        }
      }
    }
    notes.push('Phase-1-Briefing enthält alle Kernregeln und nur existierende Icons.');
  }

  notes.push(`Layoutwerte konsistent: Header Y=${werte.headerTop} · Visual ${werte.visualTop}–${werte.visualBottom} · Untertitel ${werte.captionBottom} · ${werte.captionSize} px.`);
}

// ── Jede Phase braucht einen auffindbaren Einstieg ──────────────────────────
const gehirn = read('CLAUDE.md');
if (gehirn && !gehirn.includes('PHASE-1-BRIEFING')) {
  errors.push('CLAUDE.md verweist nicht auf das Phase-1-Briefing.');
}
const master = read('MASTER-PROMPTS.md');
if (master && !master.includes('PHASE-1-BRIEFING')) {
  errors.push('MASTER-PROMPTS.md verweist nicht auf das Phase-1-Briefing.');
}

if (errors.length) {
  console.error('\nRepo-Konsistenz verletzt:\n');
  errors.forEach((e) => console.error(`- ${e}`));
  console.error('\nVerbindliche Quelle ist der Code (src/brand/tokens.ts). Dokumente dorthin nachziehen.');
  process.exit(1);
}

console.log('\n✓ Repo-Konsistenz erfüllt.');
notes.forEach((n) => console.log(`✓ ${n}`));
console.log('✓ Alle drei Phasen haben ein auffindbares Einstiegsdokument.');
