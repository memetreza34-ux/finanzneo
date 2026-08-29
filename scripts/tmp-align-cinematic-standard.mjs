#!/usr/bin/env node

import {readFileSync, writeFileSync} from 'node:fs';

const path = 'CLAUDE.md';
let text = readFileSync(path, 'utf8');

const headerAnchor = '- lange Titel umbrechen auf maximal zwei Zeilen statt auf kleine Label-Größe zu schrumpfen\n';
const headerExtra = `- Icon immer in festem Slot und optisch normalisiert; unterschiedliche SVG-ViewBox-Füllungen dürfen nicht wie verschiedene Größen wirken
- bei zweizeiligen Titeln bleibt das Icon an der **ersten Textzeile** verankert und springt nicht vertikal
- die gesamte Header-Gruppe bleibt zentriert, der Text innerhalb der Gruppe ist linksbündig, damit der Abstand Icon → erste Textzeile konstant bleibt
`;

if (!text.includes('Icon immer in festem Slot und optisch normalisiert')) {
  if (!text.includes(headerAnchor)) throw new Error('Header anchor not found in CLAUDE.md');
  text = text.replace(headerAnchor, headerAnchor + headerExtra);
}

const animationAnchor = 'Animationen müssen Inhalt **erklären und unterhaltsam visualisieren**, nicht nur Pixel bewegen.\n';
const animationExtra = `
### Cinematic Real-World Animation — Pflicht

Eine Animationsszene ist eine **kleine visuelle Geschichte**, keine bewegte Infografik.

Für jede Animationsszene verbindlich:

\`\`\`text
REALE AUSGANGSSITUATION
→ KONKRETE PHYSISCHE HAUPTAKTION
→ SICHTBARE URSACHE / WIRKUNG
→ EINDEUTIGES ERGEBNIS
\`\`\`

- reale bzw. unmittelbar erkennbare Gegenstände verwenden, wenn der Inhalt sie hergibt: Rechnung, Konto, Waschmaschine, Kalender, Geldstapel, Reservebehälter usw.
- mindestens zwei konkrete Realwelt-Objekte/-Instanzen tragen die Handlung
- jede Szene erhält eine eindeutige \`MECHANIC_ID\`; dieselbe Mechanik nicht mehrfach im Reel wiederholen
- \`PRIMARY_ACTION\` beschreibt die wirkliche physische Zustandsänderung
- mehrere koordinierte Motion-Channels statt einer einzigen globalen Progress-Variable
- deutsche Labels nur unterstützend; die Handlung muss auch ohne Text verständlich sein
- Animationen müssen visuell dieselbe Qualität und Welt wie die Flow-Bilder erreichen

Als Hauptsprache **verboten**:

- drei beschriftete Kästen/Karten nach dem Muster \`A → B → C\`
- Lade- oder Fortschrittsbalken als Ersatz für die eigentliche Animation
- reine Texttafeln mit Fade/Scale
- generische Shield-/Arrow-/Coin-Symbolik, wenn eine konkrete Alltagssituation darstellbar ist
- wiederholte identische Mechanik über mehrere Animationsszenen

Zentrale konkrete Primitives stehen über \`src/design-system\` bereit: \`PhysicalBill\`, \`PhysicalAccount\`, \`PhysicalWasher\`, \`PhysicalReserveTank\`, \`PhysicalCalendarPage\`, \`PhysicalCoinStack\`. Generische \`PhysicalObject\`, \`PhysicalTag\` und \`PhysicalRail\` sind nur Support; insbesondere \`PhysicalRail\` darf niemals die Geschichte allein tragen.
`;

if (!text.includes('### Cinematic Real-World Animation — Pflicht')) {
  if (!text.includes(animationAnchor)) throw new Error('Animation anchor not found in CLAUDE.md');
  text = text.replace(animationAnchor, animationAnchor + '\n' + animationExtra);
}

writeFileSync(path, text, 'utf8');
console.log('✓ CLAUDE.md auf Cinematic Real-World Animation + First-Line Header Lock ausgerichtet.');
