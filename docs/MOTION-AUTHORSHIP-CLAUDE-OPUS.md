# FinanzNeo — Claude Code Opus 5.5 als Motion-Graphics-Owner

**Geltung:** nur neue Motion-Graphics-Arbeiten an FinanzNeo Reels und YouTube-Longform. Bestehende versiegelte Produktionen, KI-Bilder, Cover, Voiceover, Captioning, Publishing und gewählte Bildwelten bleiben unverändert. Die vorhandenen Validatoren und Production-Seals behalten Vorrang.

## Eindeutige Aufgabenverteilung

| Rolle | Verantwortlich | Darf nicht |
| --- | --- | --- |
| ChatGPT / Storyboard | recherchiertes Skript, Zahlen und Annahmen, visuelle Beats, Shot-/Motion-Brief, Flow-Prompts | fertige Motion als bestanden melden, solange Opus den Clip nicht erstellt und geprüft hat |
| **Claude Code Opus 5.5** | Motion-Regie, kreative Konzeption, endgültige `animation.tsx`, Remotion-Komponenten, visuelle Mehrframe-/Vollclip-QA und Motion-Fixes | Bilder, Cover, Nutzer-Voiceover, Publishing oder anderes Asset eigenmächtig ersetzen |
| Nutzer | finale Bilder via Google Flow, finale Sprachaufnahme und erforderliche Bestätigung | — |
| Antigravity / Phase-3-Executor | approved motion einbinden, Wortzeiten/SFX/Timeline integrieren, technische QA, rendern und exportieren | Motion neu erfinden, vereinfachen, Text-Fade-Fallback statt echter Animation einsetzen oder die Seal-/QA-Gates umgehen |

**Phase 1 besteht künftig aus zwei aufeinanderfolgenden Teilaufgaben:** ChatGPT liefert den Motion-Brief; **Claude Code Opus 5.5 produziert und prüft die finale Animation**. Erst danach darf Phase 1 als abgeschlossen gelten und die Quelle versiegelt werden. Im Zweifel gilt weiterhin der projektspezifische Produktionsstandard.

## Tatsächliche Claude-Code-Konfiguration

Projekt-Agent: `.claude/agents/finanzneo-motion-director.md` mit festem `model: claude-opus-5-5`.

Im lokalen Repository starten:

```bash
claude update
claude --agent finanzneo-motion-director
```

Oder in einer normalen Claude-Code-Sitzung `@agent-finanzneo-motion-director` ausdrücklich für die Motion-Aufgabe ansprechen. Das Modell der aktiven Sitzung lässt sich in Claude Code mit `/model` prüfen. Voraussetzung sind installiertes Claude Code, eigene Anmeldung/Modellberechtigung und ein Checkout, der diese Konfiguration enthält. Das Agentenfile installiert oder startet Claude Code NICHT von allein. Es erzwingt keine Modellwahl in Antigravity oder ChatGPT.

Bewusst **keine** globale `.claude/settings.json` mit `model: claude-opus-5-5`: andere Claude-Code-Aufgaben sollen ihr Modell unabhängig wählen dürfen.

## Übergabe: ChatGPT → Motion-Agent

Für jede neue Szene den bestehenden `visual-index.json` bzw. `scene-index.json` und `remotion.md` mit diesen Angaben füllen (vorhandene Schemas beibehalten):

- Projekt/Format und Visual-ID, Sprechtext, ungefähre Szene-Dauer/Beats, Auslöser der Bewegung.
- `coreMessage` / `viewerChange`: eine konkrete sichtbare Veränderung, keine Toolwahl.
- Startzustand → erklärende Mechanik → sichtbare Konsequenz → Ergebnis und ausreichend langer Hold.
- Zahlenwerte, Maße, Quellen, Annahmen und ggf. mathematischer Zusammenhang.
- Layoutvorgaben: YouTube 1920×1080 hell/2D Light-V3; Reel 1080×1920 gemäß aktuellem Reel-Contract.
- Exakter Dateipfad, Exportname und relevante Medienabhängigkeiten.

Der Agent entwirft zuerst drei unterschiedliche mögliche Mechaniken und setzt die beste *inhaltlich passende* Variante um. Eine vorhandene Library-Funktion ist optional, nicht die kreative Obergrenze.

## Qualität vor Übergabe: Motion-Agent → Phase 3

1. Finale, korrekte `animation.tsx` ohne Dummy-/TODO-/Fake-Frame-Diff-Code.
2. Daten- und Einheitenprüfung: Text, Geometrie, Prozentwerte und Bewegung erzählen dieselben Fakten.
3. Bewegungslogik: START, Veränderung, Konsequenz, RESULT; keine vorzeitige Preisgabe des Payoffs.
4. Render aus der wirklichen Produktionsquelle bzw. dem exakten Clip: 10/35/65/90%-Frames und vollständige Wiedergabe sichten, nicht nur Hashes oder erfolgreiche CI.
5. Mobile Lesbarkeit, Kontrast, Berührungen/Überlagerungen, Clipping, Bildruhe im Result Hold und Voiceover-Kohärenz prüfen.
6. Projektbezogene Validierungen und Phase-1-Seal ausführen; Fehlschläge sind Blocker und dürfen nicht wegkonfiguriert werden.
7. Übergabe der verbindlichen Dateipfade, Exporte, Dauer/Timing-Annahmen, QA-Belege und offener Probleme an den Phase-3-Executor.

Fehler in der Motion bedeuten **zurück an Claude Code Opus 5.5**, Änderung am kanonischen Source, neue QA, neuer Seal. Kein kreativer Hotfix während des finalen Antigravity-Renderings.

## Versions- und Branch-Schutz

Die aktuelle Light-2D-Motion-V3 ist auf dem separaten PR-#122-Branch; ältere Motion-Libraries unter `src/finance-motion/` und frühere Renderbeispiele bleiben Legacy/Experimente. Nicht ungeprüft mit alten Reels oder YouTube-Layouts vermischen. Neues Motion-Ownership gilt erst auf Branches/Checkouts, die diese Konfiguration enthalten. Keine automatischen Merges, Pull Requests oder externen Claude-Code-Aufrufe werden dadurch ausgelöst.
