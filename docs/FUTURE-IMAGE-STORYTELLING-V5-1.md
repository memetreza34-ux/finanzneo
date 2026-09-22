# FinanzNeo Image Storytelling V5.1 — Dynamic Staging

## Zweck

V5.1 ergänzt V5 + Hardening dort, wo reale Google-Flow-Tests noch zu brav wirkten: zu viel leerer Schwarzraum, kleine Studio-Showcases, sauber nebeneinander arrangierte Erklärgegenstände, neutrale Figuren und zu schwache sichtbare Ursache→Wirkung.

Die globale Bildwelt bleibt **`finanzneo-stylized-3d-animated-black-v9`**. V5.1 ändert nicht Stil, Farben, 1:1-Format oder Deep Black, sondern nur die Regie innerhalb dieser Welt.

## Vertrag

`IMAGE_STORYTELLING_STAGING: finanzneo-image-storytelling-v5-staging-v1`

Neue Reels erhalten den Vertrag automatisch über `reel:create`. Bestehende V5-Hardening-Reels ohne `stagingId` bleiben rückwärtskompatibel.

## Pflichtfelder je IMAGE-Szene

- `FRAME_OCCUPANCY_CLASS`: `tight | balanced | environmental`
- `STAGING_MODE`: `active-collision | active-use | environmental-action | comparison-action | reveal | payoff-action`
- `CAUSE_EFFECT_STRENGTH`: `explicit | implied`
- `HUMAN_REACTION`: `none | pressured | concerned | surprised | decisive | relieved | neutral-justified`
- `HUMAN_REACTION_JUSTIFICATION`: normalerweise `none`; bei `neutral-justified` konkrete Begründung
- `SPATIAL_PRESSURE`: `foreground-dominant | subject-dominant | environmental-depth | balanced-depth`
- `IMPACT_COMPOSITION`: `none | extreme-close-up | strong-pov | low-angle-scale | foreground-blocking | environment-wide | reveal`

## Inszenierungsregeln

1. **Deep Black ist Welt, nicht Leerraum.** Das Hauptmotiv darf nicht klein im schwarzen Studio schweben. Entweder die Handlung oder sinnvoller lokaler Kontext trägt einen großen Teil des Frames.
2. **Keine Katalog-Anordnung.** Relevante Objekte werden benutzt oder erzeugen sichtbar eine Konsequenz. Bevorzugte Verben: verdrängen, blockieren, drücken, entziehen, schrumpfen, wachsen, wiederkehren, überdecken, kippen, öffnen, schließen.
3. **Cause/Effect sichtbar machen.** In jedem vollständigen 6-IMAGE-Fenster mindestens drei `explicit`-Szenen; bei 4–5 Bildern mindestens zwei.
4. **Menschen reagieren.** Sichtbare Menschen oder Hände brauchen lesbare Körper-/Hand-/Gesichtsreaktion. Keine Melodramatik. `neutral-justified` ist nur mit Begründung erlaubt.
5. **Räumlichen Druck verwenden.** Vordergrund, Überdeckung, Nähe und Tiefenstaffelung sind aktive Erzählmittel, nicht nur Dekoration.
6. **Impact Composition.** In jedem gleitenden 4-IMAGE-Fenster mindestens eine echte Impact-Komposition.
7. **Staging rotiert.** In jedem vollständigen 6-IMAGE-Fenster mindestens drei unterschiedliche `STAGING_MODE`-Werte; bei 4–5 Bildern mindestens drei über die Gesamtfolge.
8. **Echte Orte dürfen sichtbar sein.** Küche, Supermarkt, Garage, Flur, Arbeitsplatz, Werkstatt, Bahnsteig usw. dürfen mehr Raum bekommen, solange sie organisch in die V9-Deep-Black-Welt auslaufen.

## Prompt-Compiler

Nach finaler Planung:

```bash
npm run reel:image-prompts:compile -- <Reel-Pfad>
```

Der bestehende V5-Compiler schreibt V5.1 direkt in `V5_COMPILED_DIRECTION`. Google Flow sieht damit Frame Occupancy, Staging Mode, Cause/Effect-Stärke, Human Reaction, Spatial Pressure und Impact Composition im echten Bildprompt.

## Post-Generation Vision-QA

Bei V5.1 prüft die vorhandene hashgebundene Pixel-/Vision-QA zusätzlich:

- `spatialStaging`
- `causeEffectStrength`
- `humanReactionReadability`
- `impactComposition`

Hard-Fail-Flags:

- `studioShowcaseLike`
- `objectsNeatlyArranged`
- `actionConsequenceWeak`
- `humanReactionWeak`
- `emptyBlackDominant`

Ein FAIL bedeutet: **gleiche Bildnummer regenerieren**, nicht zum nächsten Flow-Job springen.

## Was unverändert bleibt

- V9-Bildwelt
- Deep Black
- 1:1-Quellbilder
- Farbrollen
- non-photorealistic stylized 3D
- Google Flow Strict-Single-Job
- V5 Sequence-first Planung
- V5-Hardening / Prompt-Compiler
- SHA-256-gebundene Vision-QA
