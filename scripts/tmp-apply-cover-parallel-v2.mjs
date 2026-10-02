#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';

const path = 'CLAUDE.md';
let text = readFileSync(path, 'utf8');

const replacement = `## 7. Google Flow — Cover Parallel V2 + Scene Single Job

\`\`\`text
FLOW_EXECUTION_MODE: finanzneo-flow-cover-parallel-then-single-v4
FLOW_STATE_MACHINE: finanzneo-flow-state-machine-v2
FLOW_COVER_WORKFLOW: finanzneo-flow-cover-parallel-5pack-v2
FLOW_COVER_CONCURRENCY: 3
FLOW_SCENE_CONCURRENCY: 1
\`\`\`

### Cover-Phase

Vor allen Szenenbildern werden exakt drei Cover-Kandidaten **gleichzeitig** erzeugt:

\`\`\`text
Cover A ┐
Cover B ├→ drei getrennte Einzelbild-Jobs gleichzeitig
Cover C ┘
→ QA
→ Nutzer wählt A/B/C
→ gewähltes Cover = scene-01
\`\`\`

Verbindlich:

- A/B/C sind drei getrennte Jobs, kein Kontaktbogen, keine Collage und kein gemeinsamer Multi-Image-Request
- jedes Cover entsteht direkt in der FinanzNeo-V9-Bildwelt
- Cover-Text muss den tatsächlichen Videoinhalt kurz verdichten
- maximal 2 Zeilen, ideal 2–5 Wörter
- keine langen Sätze
- kein generischer Clickbait ohne direkten Inhaltsbezug
- keine erfundenen Zahlen oder Aussagen
- die drei Cover sollen sichtbar unterschiedliche Ideen/Kompositionen testen
- nach A/B/C genau einmal auf die Nutzerwahl warten
- das gewählte Cover wird finaler Cover-Asset und \`scene-01\`; kein separates \`Bild 00\`

### Kein Cover als Style-Vorlage

Das gewählte Cover ist **ausdrücklich keine Style-Referenz** für die späteren Bilder.

Die einzige Style-Autorität bleibt:

\`\`\`text
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9
\`\`\`

Damit gilt:

- Cover A/B/C orientieren sich direkt an V9
- alle Szenenbilder orientieren sich direkt an V9
- kein Cover wird als Bildreferenz an spätere Prompts übergeben
- kein späteres Szenenbild wird neuer Style-Anker
- keine Bild-zu-Bild-Style-Referenzen im kanonischen Flow
- Bildideen bleiben frei; nur die gemeinsame V9-DNA bleibt fest

### Szenenbilder nach der Cover-Wahl

Nach der Nutzerwahl gilt wieder strikt Single Job:

\`\`\`text
aktuellen Szenenbildblock lesen
→ GENAU EIN Szenenbild starten
→ intern auf Ergebnis warten
→ sofort exakt umbenennen
→ in finalen Bildordner legen
→ V9-QA
→ bei Fehler dieselbe Bildnummer neu erzeugen
→ bei PASS nächstes Bild freischalten
\`\`\`

Die restlichen IMAGE-Szenen werden organisatorisch in 5er-Blöcke geteilt. Ein 5er-Block ist niemals ein Parallel-Batch.

Verboten nach der Cover-Phase:

- parallele Szenenbild-Jobs
- Queue späterer Szenenbilder
- Kontaktbogen/Galerie als Ersatz
- mehrere Szenenbildprompts in einem Request
- Nutzer-„weiter“ zwischen Bildern oder 5er-Blöcken
- spätes Sammel-Umbenennen statt Sofort-Rename
- Cover oder Szenenbild als Style-Referenz verwenden

Nach dem letzten Bild ist ein vollständiger Inventory-/Dateinamen-QA Pflicht; alle finalen Flow-Bilder liegen gemeinsam in \`03-szenen/00-ALLE-BILDER-HIER-REIN/\`.

`;

const next = text.replace(/## 7\. Google Flow[\s\S]*?(?=## 8\. Finales Reel-Layout V5)/, replacement);
if (next === text) {
  throw new Error('CLAUDE Google-Flow section not replaced');
}
writeFileSync(path, next, 'utf8');
console.log('✓ CLAUDE.md Google-Flow-Regel auf Cover Parallel V2 aktualisiert.');
