# FinanzNeo — verbindlicher 3-Phasen-Workflow

> Bei Widersprüchen gilt `CLAUDE.md`. Layout/Captions/Transition kommen technisch aus `REEL_STYLE`.

## Phase 1 — ChatGPT

Phase 1 liefert vollständig:

- Recherche + Quellen
- geprüftes szenenweises 60–90-Sekunden-Skript
- Dramaturgie und Szenenplan
- natürliche Header + Icons
- Bild-/Animations-Zuordnung
- V9-Flow-Prompts + exakte Dateinamen
- pro Animationsszene `remotion.md` + **produktionsreife `animation.tsx`**
- Master- und Plattform-Captions

Phase 1 besitzt die kreative Animation. Phase 3 darf nichts Fehlendes erfinden oder durch einen technisch leichteren Hack ersetzen.

Bildwelt V9:

```text
finanzneo-stylized-3d-animated-black-v9
```

- nicht realistische stylized 3D animated Welt
- soft rounded shapes, vereinfachte erkennbare Details
- premium + leicht verspielt
- tiefschwarzer Hintergrund Pflicht
- Klarheit/Inhalt vor Objektzahl; keine feste Quote
- mittel-lange Prompts
- Marken/Logos erkennbar, aber stilisiert; kein flach aufgeklebtes Real-Logo/Screenshot

## Phase 2 — Nutzer

1. `03-szenen/alle-bildprompts.txt` verwenden.
2. Strict Single Job: **ein Bild → warten → exakt umbenennen → QA → nächstes Bild**.
3. Cover und Szenenbilder bleiben `1:1`.
4. Keine Bildreferenz verwenden.
5. Alle finalen Bilder gemeinsam nach `03-szenen/00-ALLE-BILDER-HIER-REIN/`.
6. Genau ein finales Voiceover nach `02-audio/`.
7. Aus exakt diesem Audio echte Wort-Timings erzeugen.

## Phase 3 — integrieren, nicht neu erfinden

Erster Befehl immer:

```bash
npm run reel:ready -- <Reel-Pfad>
```

Bei FAIL: STOP und exakte Blocker melden. Keine Ersatzassets erzeugen.

Bei PASS werden die Phase-1-Animationen per SHA-256 versiegelt.

`phase3Executor` entscheidet den Executor:

| Wert | Executor |
|---|---|
| `antigravity` | Antigravity |
| `claude-code` | Claude Code |

Der falsche Executor darf nicht übernehmen.

### Phase-3-Reihenfolge

```bash
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
# jede Szene implementieren + Manifest vervollständigen
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
npm run reel:export -- <Reel-Pfad> <Final-MP4>
```

### Bildszene

- exaktes Nutzerbild sichtbar rendern
- kein Ersatzbild/Stock/Placeholder
- Header/Captions allein zählen nicht

### Animationsszene

- exakte `animationSourceFile` verwenden
- exakten `animationExport` binden
- Hash muss Phase-1-Seal entsprechen
- fehlendes Binding = harter Fehler
- keine Ersatzanimation, kein Dummy, kein QA-Wackeln

### Pure-Black-Canvas

Der Remotion-Reel-Hintergrund ist **immer statisch `#000000`**.

Verboten:

- `FNBgAurora`
- `FNBgParticles`
- `FNBgGrid`
- `FNBgRadial`
- Partikel
- Aurora/Glow-Hintergründe
- bewegte Grids
- dekorative Hintergrund-Gradienten/Vignetten
- Hintergrundbewegung als Ersatz für Szenenanimation

### Finales V5-Layout

```text
Header:     Y154 · 56 px · min. 50 px · max. 2 Zeilen
Icon:       34 px · semantische Farbe
Visual:     Y320–1400
Caption:    bottom340 · 50 px · max. 2 Zeilen
Transition: 3 Frames
```

`AnimationStage` clippt sichtbare Animationen hart auf **Y320–1400**. Kein Animationsinhalt darf sichtbar in Header oder Caption-Zone laufen.

Keine Header-Capsule/Chip/Pill und kein erzwungenes ALL CAPS.

## Hard Completion Gate

Eine MP4 allein ist kein fertiges Reel.

Preflight prüft unter anderem Assets, Timeline, Animation-Seal/Bindings und den Background-Vertrag.

`reel:render` erzeugt zuerst einen Candidate. Post-Render-QA prüft pro Szene:

- visueller Kern tatsächlich belegt
- Bildszene nicht leer/caption-only
- Animationsszene sichtbar + echte Veränderung
- Animation erklärt den gesprochenen Inhalt
- ausreichend aktive Visualfläche
- freier Rand bleibt schwarz
- keine Partikel/Aurora/Grid-Hintergrundeffekte
- Audio vorhanden
- 1080×1920 + korrekte Timeline

Schwarzes/leeres Reel = **FAIL**, nicht „fertig“.

## Einzige zulässige Stopps

- fehlendes/falsch benanntes Nutzerbild
- fehlendes/mehrfaches/unlesbares Audio
- ungültige Wort-Timings
- unvollständige Phase-1-Datei
- fehlende/nicht produktionsreife Animation
- veränderter Animation-Hash
- fehlendes/falsches Animation-Binding
- Fakten-/Sicherheitskonflikt
- Preflight/Build/Render/Render-QA schlägt fehl

## Final

```text
reel:ready PASS
→ Manifest READY_TO_RENDER
→ preflight PASS
→ Candidate render SUCCESS
→ post-render QA PASSED
→ reel:export PASS
→ 06-export vollständig
```

Erst dann darf `FINAL_COMPLETE` gemeldet werden.
