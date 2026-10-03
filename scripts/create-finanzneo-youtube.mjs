#!/usr/bin/env node
import {existsSync, readFileSync, renameSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const args = process.argv.slice(2);
const targetIndex = args.indexOf('--target');
const target = targetIndex >= 0 ? args[targetIndex + 1] : undefined;

if (!target) {
  console.error('Nutzung: npm run youtube:create -- --target youtube/<Projekt> --title "Titel" [--types ...]');
  process.exit(1);
}

const scaffold = spawnSync(
  process.execPath,
  [resolve('scripts/scaffold-finanzneo-youtube.mjs'), ...args],
  {stdio: 'inherit'},
);

if (scaffold.status !== 0) {
  process.exit(scaffold.status ?? 1);
}

const projectRoot = resolve(target);
const legacyPromptPath = resolve(projectRoot, '04-visuals/alle-bildprompts.txt');
const masterPromptPath = resolve(projectRoot, 'GOOGLE-FLOW-PROMPT.txt');

if (!existsSync(legacyPromptPath)) {
  console.error('Interner Scaffold-Flow-Prompt fehlt; Master-Prompt konnte nicht erzeugt werden.');
  process.exit(1);
}

renameSync(legacyPromptPath, masterPromptPath);

const simpleVisualForms = `FINANZNEO SIMPLE EXPLAINER FORMS — VERBINDLICH\n\nDie Bildwelt bleibt fest, aber die visuelle Form ist frei. Nicht jeder Beat braucht eine komplexe 3D-Szene. Wähle immer die EINFACHSTE Form, die den gesprochenen Punkt sofort verständlich macht. Erlaubt und ausdrücklich erwünscht sind:\n- SYMBOL / ICON FOCUS: ein großes inhaltsspezifisches Symbol oder Objekt\n- NUMBER FOCUS: ein zentraler Betrag, Prozentsatz, Zeitpunkt oder Zielwert\n- SIMPLE CHART: sauberer Balken-, Linien-, Flächen- oder Vergleichschart\n- ROUTE / GOAL / METAPHOR: z. B. Zielscheibe, Bergpfad, Bank, Haus oder anderes direkt passendes Motiv\n- UI / APP MOCKUP: frontal, unbranded und nur wenn die Oberfläche selbst etwas erklärt\n- ASSET / OBJECT GROUP: wenige konkrete Objekte für Kategorien, Vermögen, Optionen oder Trade-offs\n- CONCEPT CLUSTER: ein zentrales Objekt mit wenigen umliegenden Begriffen/Faktoren\n- QUOTE / KEY STATEMENT CARD: kurze, überprüfte Aussage, wenn die exakte Formulierung selbst der Inhalt ist\n- klassische Story-/Objektszene, Vergleich, Editorial, Illustration, Metapher oder Hybrid\n\nEINFACH BEDEUTET NICHT BILLIG: keine zufälligen Stock-Icons, keine generischen Präsentationsvorlagen, keine fremde Clipart-Welt. Auch reduzierte Visuals müssen wie dieselbe FinanzNeo-V9-Serie aussehen. Ein einzelnes Symbol, eine große Zahl oder ein sauberer Chart darf den ganzen Frame tragen, wenn das die beste Erklärung ist.\n`;

const masterPrompt = readFileSync(masterPromptPath, 'utf8');
const expandedVisualForms = masterPrompt.replace(
  'VISUAL_FORM: [character-story | object-story | comparison | chart | diagram | editorial | illustration | metaphor | hybrid]',
  'VISUAL_FORM: [character-story | object-story | symbol-icon | number-focus | comparison | chart | diagram | ui-mockup | quote-card | asset-group | concept-cluster | editorial | illustration | metaphor | hybrid]',
);
writeFileSync(masterPromptPath, `${simpleVisualForms}\n\n${expandedVisualForms}`);

const readmePath = resolve(projectRoot, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
writeFileSync(
  readmePath,
  `${readme.trim()}\n\n## Google Flow — Nutzerübergabe\n\nDer Nutzer kopiert **nur eine einzige Datei** vollständig in den Google-Flow-Agenten:\n\n\`GOOGLE-FLOW-PROMPT.txt\`\n\nDieser eine Master-Prompt enthält Cover A/B/C, die einmalige Cover-Auswahl, alle Szenenbild-Jobs, Dateinamen, QA, die komplette V9-Bildwelt und die erlaubten einfachen Erklärformen wie Symbol-, Zahl-, Chart-, UI-, Metapher-, Asset-, Concept-Cluster- und kurze Statement-Visuals. Dateien unter \`04-visuals/EINZELNE-VISUALS/\` sowie \`04-visuals/thumbnail-prompt.txt\` sind interne Produktions-/Validatorquellen und werden nicht manuell in Flow kopiert.\n`,
);

console.log('✓ Google Flow: genau ein nutzerseitiger Master-Prompt erzeugt: GOOGLE-FLOW-PROMPT.txt');
console.log('✓ Visualformen: komplexe V9-Szenen UND reduzierte Symbol-/Zahl-/Chart-/UI-/Metapher-Visuals erlaubt.');
