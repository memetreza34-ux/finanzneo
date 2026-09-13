# Playwright Visual QA — Girokonto oder Tagesgeld?

## Pflichtchecks

### Alle Bildszenen
Je einen stabilen Frame prüfen: scene-01, scene-02, scene-04, scene-05, scene-07, scene-08.

Prüfen: Header-Icon-Größe, Header-Abstand, Visual Y320–1400, Caption-Zone frei, Hauptidee in 1–2 Sekunden lesbar, keine ungewollte UI-/Dashboard-Optik, keine übermäßige schwarze Leere.

### Alle Animationen
Für scene-03, scene-06, scene-09 und scene-10 jeweils START / TRIGGER / MID / NEAR RESULT / FINAL HOLD prüfen.

Zusätzlich:
- sichtbare physische Ursache/Wirkung,
- Start und Ergebnis klar verschieden,
- Geldbewegungen groß genug,
- Tagesgeld in scene-06 und scene-10 sichtbar stabil,
- keine Objekte schneiden Header oder Caption,
- Result-Hold mindestens 15 Frames,
- keine generische Kartenreihe/Progress-Bar als Erklärung.

Sichtbarer Fehler = FAIL, auch wenn TypeScript, Bundle oder Smoke-Render technisch grün sind.
