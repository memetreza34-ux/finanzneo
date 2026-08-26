# FinanzNeo — verbindlicher 3-Phasen-Workflow

> Bei Widersprüchen gilt `CLAUDE.md`. Für Layout, Captions und Übergänge gilt technisch `REEL_STYLE` in `src/brand/tokens.ts`.

## Phase 1 — ChatGPT liefert Inhalt UND finalen Animationscode

Phase 1 erstellt vollständig:

- Recherche, Quellen und Datenstand
- geprüftes 60–90-Sekunden-Skript
- Hook, Dramaturgie und Szenenplan
- pro Szene natürliche Überschrift + passendes Icon
- Bild-/Animations-Zuordnung
- Cover- und Bildprompts für Google Flow
- exakte endgültige Dateinamen
- pro Animationsszene `remotion.md`
- pro Animationsszene **produktionsreife `animation.tsx`**
- Master-Caption und Texte für Instagram Reels, TikTok, Facebook Reels und Snapchat

Phase 1 ist vollständig für die kreative und technische Qualität der Animationen verantwortlich. Phase 3 darf keine fehlende Animation erfinden oder ersetzen.

Verbindliche Quellen:

- `docs/PHASE-1-BRIEFING.md`
- `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`

In Phase 1 bleiben keine Platzhalter. ChatGPT erzeugt keine finalen Bilder und kein Ersatz-Voiceover.

## Phase 2 — Nutzer erstellt Bilder und Audio

1. Jedes Cover-/Szenenbild einzeln mit Google Flow erzeugen.
2. Ausschließlich `03-szenen/alle-bildprompts.txt` an den Flow-Agenten übergeben.
3. Strict Single Job: ein Bild → intern warten → sofort umbenennen → QA → erst dann nächstes Bild.
4. Alle Quellbilder inklusive Cover bleiben quadratisch `1:1`.
5. Bei Fehler dieselbe Bildnummer neu erzeugen; nie parallel/batchen.
6. Keine Bildreferenz verwenden.
7. Alle Bilder gemeinsam in `03-szenen/00-ALLE-BILDER-HIER-REIN/` ablegen.
8. Genau ein finales Voiceover in `02-audio/` ablegen.
9. Aus genau diesem Audio echte Wort-Zeitstempel erzeugen.

## Phase 3 — integrieren, nicht neu erfinden

Auftrag:

```text
Mach das Reel: reels/<Woche>/<Tag>/<Reel>
```

Zuerst immer:

```bash
npm run reel:ready -- reels/<Woche>/<Tag>/<Reel>
```

`reel:ready` prüft Phase 1 + Phase 2 und **versiegelt danach jede kanonische Phase-1-`animation.tsx` per SHA-256** in:

```text
05-projektdateien/phase1-animation-seal.json
```

`phase3Executor` entscheidet:

| Wert | Ausführung | Übergabe |
|---|---|---|
| `antigravity` | Antigravity | `MASTER-PROMPTS.md`, Phase-3-Abschnitt |
| `claude-code` | Claude Code | `05-projektdateien/CLAUDE-CODE-AUFTRAG.md` |

### V5-Layout in Phase 3

Phase 3 verwendet nur zentrale `REEL_STYLE`-Werte:

```text
Header:     Y = 154 · Plain · weißer Text · semantisches Linien-Icon
Visual:     Y = 320–1480
Caption:    bottom = 340
Transition: 3 Frames
```

Keine Header-Capsule, kein Chip, keine ALL-CAPS-Transformation.

### Kanonische Animationen

Für jede Animationsszene gilt:

- `scene-index.animationSourceFile` ist die einzige zulässige Animationsquelle.
- `componentPath` im Phase-3-Manifest muss exakt auf diese Datei zeigen.
- `componentExport` muss dem Phase-1-Export entsprechen.
- SHA-256 muss dem Seal entsprechen.
- Phase 3 darf die Datei nicht verändern.
- Phase 3 darf keine Ersatzkomponente erstellen.

Insbesondere verboten:

- wackelnde Rechtecke
- Debug-/Testflächen
- Placeholder-/Dummy-Komponenten
- `Math.sin`/`Math.cos` als künstliches Dauerwackeln für Frame-Diff
- generische Bewegung nur zum Bestehen der QA

### Hard Completion Gate

Eine erzeugte MP4 ist noch kein fertiges Reel. Details: `docs/PHASE-3-COMPLETION-GATE.md`.

Reihenfolge:

```bash
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
# Bildszenen integrieren; versiegelte Phase-1-Animationen direkt verwenden
# Timeline + Manifest vervollständigen
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
npm run reel:export -- <Reel-Pfad> <Final-MP4>
```

Der Executor:

1. synchronisiert Bilder
2. leitet Timeline aus finalem Audio ab
3. bindet die versiegelten Phase-1-Animationsquellen direkt ein
4. nutzt Plain `SceneHeader` + passendes Icon
5. clippt Captions pro Szene
6. vervollständigt `phase3-production-manifest.json`
7. führt Preflight aus
8. führt Validatoren, Tests und Typecheck aus
9. prüft Preview
10. rendert zunächst nur `*.phase3-candidate.mp4`
11. Post-Render-QA prüft jede Szene auf echten visuellen Inhalt und Animationen auf sichtbare Veränderung
12. nur QA `PASSED` erzeugt Final-MP4
13. komplette MP4 mit Ton prüfen; Animationen zusätzlich ohne Ton
14. Export mit Hash-Gates durchführen

## Einzige zulässige Stopps

- fehlendes/falsch benanntes Nutzerbild
- fehlendes/mehrfaches/unlesbares Audio
- ungültige Wort-Timings
- unvollständige Phase-1-Datei
- fehlende oder nicht produktionsreife `animation.tsx`
- Animationshash wurde nach `reel:ready` verändert
- Phase 3 versucht eine Ersatzanimation zu verwenden
- Fakten-/Sicherheits-/Quellenkonflikt
- Phase-3-Preflight schlägt fehl
- Post-Render-QA erkennt leere/Caption-only-Szene oder fehlende Animation
- Finalvideo enthält keinen Audio-Stream
- nicht selbst lösbarer Validator-/Build-/Renderfehler

Keine Rückfragen zu Geschmack oder bereits entschiedenen Standards.

## Abschluss

```bash
npm run reel:export -- <Reel-Pfad> <exakter-gerenderter-MP4-Pfad>
```

Export verlangt bestandene Render-QA und passende Hashes von Video, `scene-index.json` und Produktionsmanifest.

`06-export/` muss vollständig enthalten:

- finale visuell geprüfte MP4
- Cover
- `bilder.zip`
- Universal-/Instagram-/TikTok-/Facebook-/Snapchat-Caption
- `untertitel.srt`
- `UPLOAD.md`

Erst dann ist `FINAL_COMPLETE` zulässig.
