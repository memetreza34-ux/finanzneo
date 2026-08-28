#!/usr/bin/env node
import {appendFileSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = 'reels/2026-08-24_bis_2026-08-30/freitag/reel-02_notgroschen-richtig-aufbauen';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
const promptPath = resolve(root, '03-szenen/alle-bildprompts.txt');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));

// Repo-Vertrag nutzt den Flow-Struktur-Lock V2.
index.googleFlow.structureLockId = 'finanzneo-flow-structure-lock-v2';
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

let masterPrompt = readFileSync(promptPath, 'utf8');
masterPrompt = masterPrompt.replaceAll('finanzneo-flow-structure-lock-v1', 'finanzneo-flow-structure-lock-v2');
writeFileSync(promptPath, masterPrompt, 'utf8');
appendFileSync(
  promptPath,
  '\nFINALER BILDERORDNER NACH RENAME + QA:\n03-szenen/00-ALLE-BILDER-HIER-REIN/\n',
  'utf8',
);

for (const scene of index.scenes) {
  const dir = resolve(root, '03-szenen/EINZELNE-SZENEN', scene.id);
  mkdirSync(dir, {recursive: true});
  const content = `# ${scene.headline}\n\n- Typ: ${scene.type}\n- Icon: ${scene.icon}\n- Header-Ton: ${scene.headerTone}\n- Voiceover: ${scene.audioTrigger}\n- Hauptidee: ${scene.mainIdea}\n- Zieldauer: ${scene.targetSeconds} s\n\nV5: Header Y154, Visual Y320–1400, Caption bottom340.\n`;
  writeFileSync(resolve(dir, 'szene.md'), content, 'utf8');
}

const animationScenes = index.scenes.filter((scene) => scene.type === 'animation');
const animationSummary = `# Animationen — Phase 1\n\nLock: finanzneo-phase1-animation-code-v1\nPremium-Lock: finanzneo-premium-physical-animation-v2\nVisuelles Ziel: finanzneo-stylized-3d-animated-black-v9\n\nJede Animationsszene besitzt bereits ihre kanonische produktionsreife animation.tsx. Phase 3 darf sie nicht ersetzen oder vereinfachen. PremiumPhysicalStage bleibt transparent; der zentrale Reel-Canvas ist statisch #000000. Sichtbare Animation bleibt hart in Y320–1400.\n\n${animationScenes.map((scene) => `- ${scene.id}: ${scene.headline} — ${scene.animationSourceFile} — Export ${scene.animationExport}`).join('\n')}\n`;
writeFileSync(resolve(root, '05-projektdateien/animationen.md'), animationSummary, 'utf8');

const masterCaption = readFileSync(resolve(root, '04-caption/caption.txt'), 'utf8').trim();
writeFileSync(resolve(root, '04-caption/instagram-reels.txt'), `CAPTION:\n${masterCaption}\n\nCTA:\nSpeichere das Reel als Erinnerung für deinen eigenen Notgroschen.\n\nHASHTAGS:\n#Finanzwissen #Notgroschen #Tagesgeld #Finanzen #Geld\n`, 'utf8');
writeFileSync(resolve(root, '04-caption/tiktok.txt'), `CAPTION:\nNotgroschen: sicher, verfügbar und nur für echte Notfälle. Faustregel laut Verbraucherzentrale: zwei bis drei monatliche Nettoeinkommen.\n\nCTA:\nSpeichere dir die drei Regeln.\n\nHASHTAGS:\n#Finanzwissen #Notgroschen #Geld\n`, 'utf8');
writeFileSync(resolve(root, '04-caption/facebook-reels.txt'), `REEL-TEXT:\n${masterCaption}\n\nCTA:\nSpeichere das Reel als Erinnerung.\n`, 'utf8');
writeFileSync(resolve(root, '04-caption/snapchat.txt'), `CAPTION:\nNotgroschen = Reserve für echte unerwartete Ausgaben. Faustregel laut Verbraucherzentrale: zwei bis drei monatliche Nettoeinkommen.\n`, 'utf8');

console.log('✓ Pflichtstruktur, Flow V2 und Plattform-Publishing ausgerichtet.');
