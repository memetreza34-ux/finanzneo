# FinanzNeo Future Image Storytelling V5

`IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v5`  
`VISUAL_SEQUENCE_PLAN: finanzneo-visual-sequence-plan-v1`  
`IMAGE_WORLD_LOCK_PRESERVED: finanzneo-stylized-3d-animated-black-v9`

## Ziel

V5 löst ein Problem, das bei V4-Praxistests sichtbar wurde: Einzelne Bilder können korrekt und hochwertig sein, während die gesamte Bildfolge trotzdem zu ähnlich wirkt.

Darum gilt ab V5:

**Erst die gesamte visuelle Sequenz planen, dann einzelne Bildprompts schreiben.**

Die V9-Bildwelt bleibt unverändert. V5 ändert nur Regie, Rhythmus, Szenenwahl, Kamera und Abwechslung.

## Neue Sequenzfelder pro IMAGE-Szene

- `SEQUENCE_ROLE`
- `ENERGY_LEVEL` 1–5
- `VISUAL_ARCHETYPE`
- `LOCATION_FAMILY`
- `HUMAN_PRESENCE`
- `COMPOSITION_FAMILY`
- `MAIN_SUBJECT_FAMILY`
- `TABLE_DOCUMENT_SCENE`

Die bekannten V4-Felder wie `VISUAL_MODE`, `STORY_ACTION`, `VISUAL_HOOK`, `SHOT_SCALE`, `CAMERA_ANGLE`, `DEPTH_PLAN`, `CAUSE_EFFECT`, `PATTERN_INTERRUPT`, `NOVELTY_CHECK` und `TRANSFERABILITY_TEST` bleiben erhalten.

## Erlaubte Sequenzrollen

- `hook`
- `detail`
- `escalation`
- `contrast`
- `reveal`
- `bridge`
- `payoff`

Nicht jedes Reel braucht jede Rolle. Die Reihenfolge muss aber eine bewusste Dramaturgie bilden.

## Erlaubte Visual-Archetypen

- `character-action`
- `pov`
- `macro-object`
- `environment`
- `comparison`
- `scale-reveal`
- `cause-effect`
- `before-after`
- `object-story`
- `grounded-metaphor`

## Harte Anti-Wiederholungsregeln

- gleiche `COMPOSITION_FAMILY` direkt hintereinander: verboten
- gleicher `VISUAL_ARCHETYPE` direkt hintereinander: verboten
- gleiche `LOCATION_FAMILY` mehr als 2 IMAGE-Szenen direkt: verboten
- gleicher `CAMERA_ANGLE` mehr als 2 IMAGE-Szenen direkt: verboten
- gleiche `MAIN_SUBJECT_FAMILY` mehr als 2 IMAGE-Szenen direkt: verboten
- Person/Tisch/Dokumente als Hauptbildsprache: maximal 2 in jedem Fenster aus bis zu 6 IMAGE-Szenen
- mehr als 2 IMAGE-Szenen ohne Pattern Interrupt: verboten

## Energy Arc

`ENERGY_LEVEL` beschreibt die visuelle Intensität:

- 1 = ruhig / Abschluss / Atemraum
- 2 = ruhig, kontrolliert
- 3 = normal erklärend
- 4 = stark / Kontrast / Eskalation
- 5 = Hook / Peak / große Überraschung

Unter den ersten zwei IMAGE-Szenen muss mindestens eine Szene `ENERGY_LEVEL >= 4` besitzen.

## Kamera

Eine konkrete Szenen-Kamera hat Vorrang vor generischer Stilformulierung.

V9 bestimmt:
- Rendering
- Deep Black
- Stylized 3D
- Materialien
- Farbrollen
- Markenregeln
- 1:1
- Same World

V9 bestimmt **nicht**, dass jede Szene aus demselben Kamerawinkel gezeigt werden muss.

## Anti-„Person sitzt am Tisch“

Menschen bleiben erlaubt und wichtig. Sie sind aber kein Default.

Je nach Sprechbeat sind erlaubt:
- `none`
- `hands-only`
- `single-person`
- `multi-person`

Ein Bild soll die beste reale Situation zeigen, nicht automatisch Person + Tisch + Papier.

## Arbeitsablauf

1. Sprechbeats lesen.
2. Alle IMAGE-Szenen in `05-projektdateien/VISUAL-SEQUENCE-PLAN.md` planen.
3. Energy Arc und Pattern Interrupts prüfen.
4. Wiederholungen bei Ort, Archetyp, Komposition, Mensch und Hauptmotiv prüfen.
5. Erst danach Einzelprompts schreiben.
6. V5-Validator ausführen.
7. Google Flow weiterhin strikt als Single-Job: immer genau ein Bild gleichzeitig.

## Unverändert

- `finanzneo-stylized-3d-animated-black-v9`
- Deep-Black-Bildwelt
- 1:1-Bildgenerierung
- Google-Flow-Single-Job
- keine abstrakten Rätsel
- kein Fotorealismus
- keine generischen Finance-Icon-Kompositionen
- bestehende V2/V3/V4-Reels bleiben rückwärtskompatibel
