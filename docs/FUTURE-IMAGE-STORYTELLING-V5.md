# FinanzNeo Future Image Storytelling V5

`IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v5`  
`IMAGE_STORYTELLING_HARDENING: finanzneo-image-storytelling-v5-hardening-v1`  
`VISUAL_SEQUENCE_PLAN: finanzneo-visual-sequence-plan-v1`  
`IMAGE_WORLD_LOCK_PRESERVED: finanzneo-stylized-3d-animated-black-v9`

## Ziel

V5 löst ein Problem, das bei V4-Praxistests sichtbar wurde: Einzelne Bilder können korrekt und hochwertig sein, während die gesamte Bildfolge trotzdem zu ähnlich wirkt.

Darum gilt ab V5:

**Erst die gesamte visuelle Sequenz planen, dann einzelne Bildprompts schreiben.**

V5-Hardening ergänzt eine zweite Schutzschicht:

**Nach fertiger Planung wird die Regie automatisch direkt in den finalen `IMAGE PROMPT` kompiliert.** Google Flow soll Kamera, Handlung, Ort und visuelle Konsequenz nicht mehr aus vorgelagerten Metadaten erraten müssen.

Die V9-Bildwelt bleibt unverändert. V5 ändert nur Regie, Rhythmus, Szenenwahl, Kamera und Abwechslung.

## Sequenzfelder pro IMAGE-Szene

- `SEQUENCE_ROLE`
- `ENERGY_LEVEL` 1–5
- `VISUAL_ARCHETYPE`
- `LOCATION_FAMILY`
- `LOCATION_CLASS`
- `HUMAN_PRESENCE`
- `COMPOSITION_FAMILY`
- `MAIN_SUBJECT_FAMILY`
- `MAIN_SUBJECT_CLASS`
- `TABLE_DOCUMENT_SCENE`
- `LIGHTING_VARIATION`
- `LABEL_BUDGET`
- `PATTERN_INTERRUPT_TYPE`

Die bekannten V4-Felder wie `VISUAL_MODE`, `STORY_ACTION`, `VISUAL_HOOK`, `SHOT_SCALE`, `CAMERA_ANGLE`, `DEPTH_PLAN`, `CAUSE_EFFECT`, `PATTERN_INTERRUPT`, `NOVELTY_CHECK` und `TRANSFERABILITY_TEST` bleiben erhalten.

## Keine kreativen Defaultwerte

Neue Reels starten bei kreativen Regieentscheidungen bewusst mit Platzhaltern bzw. ungültigen Planwerten. Insbesondere dürfen `VISUAL_MODE`, `ENERGY_LEVEL`, `SHOT_SCALE`, `CAMERA_ANGLE`, `TABLE_DOCUMENT_SCENE`, `LOCATION_CLASS`, `MAIN_SUBJECT_CLASS`, `LIGHTING_VARIATION` und `PATTERN_INTERRUPT_TYPE` nicht versehentlich durch einen generischen Default bestehen.

Jede dieser Entscheidungen wird in Phase 1 bewusst gewählt.

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

## Semantische Klassen

Freie Familiennamen bleiben für die konkrete Szene erhalten, aber die grobe Kategorie wird zusätzlich normalisiert.

`LOCATION_CLASS`:
- `home`
- `retail`
- `work`
- `transport`
- `banking`
- `street`
- `food`
- `services`
- `leisure`
- `other`

`MAIN_SUBJECT_CLASS`:
- `money`
- `bill`
- `purchase`
- `account`
- `vehicle`
- `housing`
- `subscription`
- `savings`
- `person`
- `device`
- `document`
- `other`

Dadurch zählen `Küche`, `Küchentisch` und `Wohnküche` nicht mehr automatisch als drei echte Ortswechsel, wenn die visuelle Hauptwelt faktisch gleich bleibt.

## Harte Anti-Wiederholungsregeln

- gleiche `COMPOSITION_FAMILY` direkt hintereinander: verboten
- gleicher `VISUAL_ARCHETYPE` direkt hintereinander: verboten
- gleiche `LOCATION_FAMILY` mehr als 2 IMAGE-Szenen direkt: verboten
- gleicher `CAMERA_ANGLE` mehr als 2 IMAGE-Szenen direkt: verboten
- gleiche `MAIN_SUBJECT_FAMILY` mehr als 2 IMAGE-Szenen direkt: verboten
- Person/Tisch/Dokumente als Hauptbildsprache: maximal 2 in jedem Fenster aus bis zu 6 IMAGE-Szenen
- mehr als 2 IMAGE-Szenen ohne Pattern Interrupt: verboten

Zusätzlich gilt mit V5-Hardening:

- in jedem vollständigen 6-IMAGE-Fenster mindestens 3 unterschiedliche `VISUAL_ARCHETYPE`
- mindestens 3 unterschiedliche `COMPOSITION_FAMILY`
- mindestens 3 unterschiedliche `CAMERA_ANGLE`
- mindestens 3 unterschiedliche `LOCATION_CLASS`
- mindestens 3 unterschiedliche `MAIN_SUBJECT_CLASS`
- bei einer Gesamtreihe aus 4–5 IMAGE-Szenen gelten dieselben Mindestwerte über die gesamte Reihe

Damit reicht ein A-B-A-B-A-B-Muster nicht mehr als scheinbare Vielfalt.

## Energy Arc

`ENERGY_LEVEL` beschreibt die visuelle Intensität:

- 1 = ruhig / Abschluss / Atemraum
- 2 = ruhig, kontrolliert
- 3 = normal erklärend
- 4 = stark / Kontrast / Eskalation
- 5 = Hook / Peak / große Überraschung

Unter den ersten zwei IMAGE-Szenen muss mindestens eine Szene `ENERGY_LEVEL >= 4` besitzen.

## Pattern Interrupt

`PATTERN_INTERRUPT` beschreibt konkret, was sich ändert. `PATTERN_INTERRUPT_TYPE` macht diese Änderung maschinenprüfbar:

- `none`
- `camera-change`
- `scale-change`
- `location-change`
- `human-change`
- `comparison`
- `cause-effect`
- `reveal`

Ein behaupteter Wechsel muss im Plan tatsächlich stattfinden. Beispiel: `camera-change` ist nur gültig, wenn sich der `CAMERA_ANGLE` gegenüber dem vorherigen IMAGE-Beat ändert.

## Lighting Variation

Die V9-Bildwelt bleibt unverändert, aber die Lichtregie darf innerhalb dieses Locks variieren:

- `soft-key`
- `side-key`
- `top-light`
- `rim-heavy`
- `warm-practical`
- `dramatic-low-key`

Deep Black, Farbrollen, Materiallogik und stylized 3D bleiben unverändert.

## Label Budget

`LABEL_BUDGET` ist 0–3.

- 0–2 Labels: bevorzugter Normalfall, `LABEL_BUDGET_JUSTIFICATION: none`
- 3 Labels: nur mit konkreter Begründung

Das Bild soll sich primär visuell erklären und nicht zu einer beschrifteten 3D-Infografik werden.

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

`TABLE_DOCUMENT_SCENE` ist keine reine Selbstauskunft mehr: der Hardening-Validator prüft zusätzlich eine Prompt-Plausibilität. Ein als `false` deklarierter Beat darf nicht gleichzeitig im eigentlichen `IMAGE PROMPT` Tisch/Schreibtisch plus Rechnung/Dokument als Hauptsprache beschreiben.

## Prompt-Compiler

Nach abgeschlossener Sequenz- und Einzelbildplanung ist dieser Schritt Pflicht:

```bash
npm run reel:image-prompts:compile -- <Reel-Pfad>
```

Der Compiler liest die kanonischen Werte aus `scene-index.json` und schreibt einen `V5_COMPILED_DIRECTION`-Block direkt in jeden finalen `IMAGE PROMPT`.

Dieser Block enthält unter anderem:
- Kamera
- Archetyp
- Energy
- Location
- Human Presence
- Composition
- Main Subject
- Lighting
- reale Situation
- Voiceover-Visual-Match
- Story Action
- Konsequenz
- Hook
- Cause/Effect
- Pattern Interrupt
- Label Budget

`reel:validate` blockiert einen fehlenden oder veralteten Compile-Block. Nach jeder relevanten Planänderung muss erneut kompiliert werden.

## Arbeitsablauf

1. Sprechbeats lesen.
2. Alle IMAGE-Szenen in `05-projektdateien/VISUAL-SEQUENCE-PLAN.md` planen.
3. Energy Arc und Pattern Interrupts prüfen.
4. Wiederholungen bei Ort, Archetyp, Komposition, Mensch und Hauptmotiv prüfen.
5. Erst danach Einzelprompts schreiben.
6. `npm run reel:image-prompts:compile -- <Reel-Pfad>` ausführen.
7. `npm run reel:validate -- <Reel-Pfad>` ausführen.
8. Google Flow weiterhin strikt als Single-Job: immer genau ein Bild gleichzeitig.

## Unverändert

- `finanzneo-stylized-3d-animated-black-v9`
- Deep-Black-Bildwelt
- 1:1-Bildgenerierung
- Google-Flow-Single-Job
- keine abstrakten Rätsel
- kein Fotorealismus
- keine generischen Finance-Icon-Kompositionen
- bestehende V2/V3/V4-Reels bleiben rückwärtskompatibel
