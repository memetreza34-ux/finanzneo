---
name: finanzneo-motion-test
description: Erstelle den verbindlichen 12-Sekunden-YouTube-Motion-Test von FinanzNeo mit Claude Code Opus 5.5, inklusive echter Remotion-Produktion, Render und visueller Qualitätskontrolle.
disable-model-invocation: true
---

# /finanzneo-motion-test

Dies ist ein **explizit vom Nutzer ausgelöster** Projekttest, kein autonomer Produktionslauf.

1. Arbeite ausschließlich in einem hierfür vorgesehenen Feature-/Test-Branch; wenn der Checkout `main` ist, **stoppe und fordere einen sicheren Feature-Branch an**, statt direkt auf main zu schreiben. Keine anderen Projekte ändern.
2. Prüfe, dass der aktive Claude-Code-Agent `finanzneo-motion-director` und **Modell `claude-opus-5-5`** verwendet werden. Bei fehlender Berechtigung/nicht verfügbarem Modell nichts anderes heimlich einsetzen. In der CLI lässt sich Modell und Status über `/status` prüfen.
3. Lies `CLAUDE.md`, `AGENTS.md`, `docs/MOTION-AUTHORSHIP-CLAUDE-OPUS.md`, `docs/YOUTUBE-LIGHT-MOTION-V3-ENGINE.md`, `docs/FINANZNEO-YOUTUBE-MOTION-WORLD-V1.md` und das **vollständige** Briefing `tests/claude-motion/README.md` sowie `tests/claude-motion/brief.json`.
4. **Führe nun die Arbeit vollständig durch.** Nicht lediglich Aufgaben zurückerzählen, keine bloßen Prompts, keine Demo-Library. Erzeuge die echte 12-Sekunden-Animation aus der Briefdatei und registriere die Test-Composition. Entwickle zuerst 3 unterschiedliche Mechanismen, entscheide dann.
5. Verwende die exakten Dateien, Zahlen, Formate und Namen aus dem Brief. Nicht in produktive Composition-Registry, bestehende YouTube-Videos, Bilder, Cover oder Audio eingreifen.
6. Führe `npm run motion:claude:test:setup`, `npm run motion:claude:test:preflight`, `npm run typecheck`, `npm run motion:claude:test:render` und `npm run motion:claude:test:qa` aus. Falls Bibliotheken fehlen, zunächst `npm ci`. Fehler **an der Quelle** lösen; QA nicht abschwächen.
7. Prüfe die gerenderte MP4 und den Kontaktbogen **visuell**, inklusive kleiner Vorschau. Vergleiche Timing und tatsächliche 12×9,99€-Logik. Verbesserungsrunde bei Schwächen.
8. Schreibe einen auf tatsächlich gesichteter Ausgabe beruhenden Bericht nach `out/claude-motion-test/review.md`; gebe absolute/relative Wege der Ausgabe und klare PASS/FAIL-Aussagen zurück. Wenn du die Ausgabe nicht ansehen konntest, **keine visuelle Freigabe behaupten**.

Der Nutzer bewertet danach die gerenderte Motion und entscheidet über Änderungen. Es erfolgt kein automatischer Merge oder Publishing.
