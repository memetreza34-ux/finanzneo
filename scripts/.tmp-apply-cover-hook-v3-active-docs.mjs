#!/usr/bin/env node

import {readFileSync, writeFileSync} from 'node:fs';

const patch = (path, replacements) => {
  let source = readFileSync(path, 'utf8');
  for (const [before, after, label] of replacements) {
    if (!source.includes(before)) {
      console.error(`Marker fehlt in ${path}: ${label}`);
      process.exit(1);
    }
    source = source.replace(before, after);
  }
  writeFileSync(path, source, 'utf8');
  console.log(`✓ ${path}`);
};

patch('CLAUDE.md', [
  [
    '> Höchste interne Quelle für Reel-Produktion. Bei Widersprüchen mit älteren Dateien gilt immer diese Datei. Für **neu erzeugte Reels mit `futureProductionStandard.id = finanzneo-future-production-v3`** gelten zusätzlich die strengeren Future-V3-Regeln aus `docs/FUTURE-REEL-PRODUCTION-V3.md`; ältere Reels werden nicht rückwirkend migriert.',
    '> Höchste interne Quelle für Reel-Produktion. Bei Widersprüchen mit älteren Dateien gilt immer diese Datei. Für **neu erzeugte Reels mit `futureProductionStandard.id = finanzneo-future-production-v3`** gelten zusätzlich `docs/FUTURE-REEL-PRODUCTION-V3.md`, `docs/FUTURE-COVER-HOOK-V3.md` und `docs/FUTURE-IMAGE-STORYTELLING-V3.md`; ältere Reels werden nicht rückwirkend migriert.',
    'CLAUDE authority line',
  ],
  [
    '- erzeugt die Szenenbilder mit Google Flow; **scene-01 ist automatisch das Cover**, kein separater Cover-Bildjob und kein Bild 00',
    '- erzeugt die Szenenbilder mit Google Flow; **scene-01 ist automatisch das Cover UND der erste echte Content-Hook**, kein separater Cover-Bildjob und kein Bild 00',
    'CLAUDE phase2 cover bullet',
  ],
  [
    '**Cover-Regel:** `scene-01` ist immer eine Bildszene und automatisch das Cover. Es wird kein separates Cover und kein `Bild 00` erzeugt. `03-szenen/00-cover/cover.txt` ist nur ein technischer Alias/Vertrag auf das Bild von `scene-01`.',
    '**Cover + erster Content-Beat:** `scene-01` ist immer eine Bildszene, automatisch das Cover **und gleichzeitig der erste echte inhaltliche Hook**. Es wird kein separates Cover und kein `Bild 00` erzeugt. Frame 0 ist nur der Cover-Snapshot derselben normalen Szene; es gibt keinen separaten `0,1 s`-/`3 Frames`-Cover-Clip. Das Voiceover beginnt bereits mit dem ersten gesprochenen Wort in `scene-01`. `03-szenen/00-cover/cover.txt` ist nur ein technischer Alias/Vertrag auf das Bild von `scene-01`.',
    'CLAUDE cover rule',
  ],
  [
    'VISUAL_BEAT_COMPATIBILITY_BASE: finanzneo-visual-beats-v1\nFUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3',
    'FUTURE_COVER_HOOK: finanzneo-cover-hook-v3\nVISUAL_BEAT_COMPATIBILITY_BASE: finanzneo-visual-beats-v1\nFUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3',
    'CLAUDE cover marker',
  ],
  [
    '- Hook in den ersten 2 Sekunden',
    '- **Hook beginnt mit dem ersten gesprochenen Wort in scene-01**; nicht erst irgendwann in den ersten 2 Sekunden\n- erste gesprochene Zeile = direkte Frage, klare Aussage, konkretes Problem, Warnung, Kontrast oder konkrete Zahl\n- der konkrete Themenanker muss bereits in Cover-Headline oder erster Hook-Zeile erkennbar sein\n- verboten vor dem Hook: Begrüßung, „Heute geht es um …“, „In diesem Video …“, neutrale Einleitung oder stiller Cover-Vorspann\n- Frame 0 bleibt als Cover-Snapshot caption-frei; danach dürfen Captions bereits innerhalb derselben scene-01 laufen',
    'CLAUDE hook timing bullet',
  ],
]);

patch('docs/PHASE-1-BRIEFING.md', [
  [
    '- 60–90 Sekunden\n- Hook in den ersten 2 Sekunden',
    '- 60–90 Sekunden\n- FUTURE_COVER_HOOK: finanzneo-cover-hook-v3\n- scene-01 = Cover + erster echter Content-Hook\n- Hook beginnt mit dem ersten gesprochenen Wort: Frage / Aussage / Problem / Warnung / Kontrast / konkrete Zahl + klarer Themenanker\n- keine Begrüßung, keine neutrale Einleitung und kein separater 0,1-s-/3-Frame-Cover-Clip',
    'Phase1 format hook',
  ],
  [
    '- alle Flow-Bildszenen strikt 1:1; scene-01 ist automatisch das Cover, kein separates Cover und kein Bild 00',
    '- alle Flow-Bildszenen strikt 1:1; scene-01 ist automatisch das Cover UND der erste Content-Beat, kein separates Cover und kein Bild 00; Frame 0 ist nur der Cover-Snapshot derselben Hook-Szene',
    'Phase1 cover line',
  ],
  [
    'SKRIPT\nSchreibe von Anfang an SZENE FÜR SZENE. Nicht erst Fließtext schreiben und nachträglich schneiden.',
    'SKRIPT\nSchreibe von Anfang an SZENE FÜR SZENE. Nicht erst Fließtext schreiben und nachträglich schneiden.\n\nSZENE 01 — HARTE HOOK-REGEL\n- scene-01 ist bereits der erste gesprochene Inhalt, nicht nur ein Titelbild\n- erste gesprochene Zeile wird zusätzlich als `scene-01.hook.spokenLine` gespeichert\n- `script-fliess-text.txt` muss exakt mit dieser Zeile beginnen\n- `scene-01.hook.form`: question | claim | problem | warning | contrast | number\n- `scene-01.hook.topicAnchor`: konkretes Thema/Objekt, das sofort erkennbar sein muss\n- Cover-Headline muss selbst als Hook funktionieren, nicht nur als neutrale Themenbezeichnung\n- Voiceover startet in scene-01; Captions dürfen nach Frame 0 bereits in scene-01 beginnen',
    'Phase1 script hook block',
  ],
]);

patch('ANLEITUNG.md', [
  [
    '- Hook in den ersten 2 Sekunden',
    '- **Cover Hook V3:** scene-01 ist Cover + erster Content-Beat\n- Hook beginnt mit dem ersten gesprochenen Wort in scene-01\n- erste Zeile = Frage/Aussage/Problem/Warnung/Kontrast/Zahl + konkreter Themenanker\n- kein separater 0,1-s-/3-Frame-Cover-Clip und keine neutrale Vorrede',
    'ANLEITUNG hook bullets',
  ],
  [
    '### Audio und Timings\n\n- genau ein finales Voiceover in `02-audio/`',
    '### Audio und Timings\n\n- genau ein finales Voiceover in `02-audio/`\n- Voiceover startet bereits in scene-01 mit `scene-01.hook.spokenLine`; keine Begrüßung/Vorrede davor\n- Frame 0 ist nur der caption-freie Cover-Snapshot derselben normalen Hook-Szene\n- Captions dürfen nach Frame 0 bereits innerhalb scene-01 starten',
    'ANLEITUNG audio hook',
  ],
]);

patch('START-HIER.md', [
  [
    '- Phase 1: `docs/PHASE-1-BRIEFING.md`\n- Bildwelt: `docs/GLOBAL-IMAGE-WORLD-LOCK.md`',
    '- Phase 1: `docs/PHASE-1-BRIEFING.md`\n- Cover/Hook: `docs/FUTURE-COVER-HOOK-V3.md`\n- Bildwelt: `docs/GLOBAL-IMAGE-WORLD-LOCK.md`',
    'START-HIER cover link',
  ],
  [
    '## Finales Layout',
    '## Cover Hook V3\n\n`scene-01` ist bei neuen Reels **Cover + erster echter Content-Hook**. Frame 0 wird als Cover exportiert, aber die Szene selbst läuft normal weiter. Das Voiceover beginnt mit dem ersten gesprochenen Wort bereits in scene-01. Kein separater 0,1-s-/3-Frame-Cover-Clip, kein Bild 00 und keine neutrale Einleitung.\n\n```text\nFUTURE_COVER_HOOK: finanzneo-cover-hook-v3\n```\n\n## Finales Layout',
    'START-HIER cover section',
  ],
]);

patch('.agents/skills/finanzneo-reel/SKILL.md', [
  [
    '3. `docs/3-PHASEN-WORKFLOW.md`\n4. `docs/PHASE-3-COMPLETION-GATE.md`\n5. `reels/PRODUKTIONSSTANDARD.md`',
    '3. `docs/FUTURE-COVER-HOOK-V3.md`\n4. `docs/3-PHASEN-WORKFLOW.md`\n5. `docs/PHASE-3-COMPLETION-GATE.md`\n6. `reels/PRODUKTIONSSTANDARD.md`',
    'Skill authority cover doc',
  ],
  [
    '## Visual Beat timing',
    '## Cover Hook V3\n\nFor new reels, `scene-01` is **cover + first real content beat**. Frame 0 is only the clean cover snapshot of that same scene; never create a separate 0.1-second / 3-frame cover-only segment. The voiceover starts with the first spoken word already in scene-01. The first line must be a direct question, claim, problem, warning, contrast or concrete number with an immediately recognizable topic anchor. Captions may start after Frame 0 while scene-01 is still active.\n\n`script-fliess-text.txt` must begin exactly with `scene-01.hook.spokenLine`. Generic greetings or neutral topic intros before the hook are invalid.\n\n## Visual Beat timing',
    'Skill cover section',
  ],
]);

console.log('✓ Cover Hook V3 active docs patched.');
