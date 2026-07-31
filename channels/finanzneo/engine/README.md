# FinanzNeo Engine V1

Einfaches, datenbasiertes Gerüst für hochwertige Finanz-Reels. Entwicklung ausschließlich im Repository-Klon auf `finance-v1`.

## Ziel

- 60–75 Sekunden
- 150–200 Wörter
- finale bearbeitete Stimme als Zeitquelle
- 10–14 Beats
- mindestens vier technische Layoutarten
- zwölf sichtbare Layoutmuster
- keine Slideshow und keine Füll-Icons
- wenig Dateien und ein klarer Claude-Code-Ablauf

## Arbeitsfluss

```text
PLANEN
Quellen + claimIds + Skript + voiceText + Szenen
→ scene-plan.json

BAUEN
Originalstimme
→ vorbereiten und transkribieren
→ Bilder und optionale SFX ablegen
→ asset-manifest.json
→ Szenen am finalen Transkript ausrichten

PRÜFEN
Skript + Vertrag + Audio + Captions + Assets + Layoutregeln
→ qa-report.json
→ generischer FinanceV1-Render
→ automatische MP4-QA + acht Kontrollframes
```

## Pflichtdateien

- `scene-plan.json`
- `asset-manifest.json`
- `qa-report.json`
- optional `revision-patch.json`

Zusätzliche Planungsdateien werden nicht standardmäßig angelegt.

## Eine Konfiguration und ein Vertrag

- `config/finance-v1.json` — einzige Grenzwertquelle
- `scripts/lib/finance-contracts.mjs` — einzige Laufzeitvalidierung
- `src/engine/contracts.ts` — nur TypeScript-Typen für den Renderer

Keine parallelen Finance-Schemas hinzufügen.

## Kernbereiche

- `src/engine/FinanceReel.tsx` — allgemeiner Renderer
- `src/engine/FinanceProductionLayer.tsx` — durchgehende Captions und optionale SFX
- `src/FinanceV1Root.tsx` — einzige produktive Finance-V1-Composition
- `engine/LAYOUTS.md` — Muster und Varianten
- `skills/` — drei kompakte Arbeitsschritte
- `gehirn/REELS.md` — Dramaturgie und Sprache
- `CLAUDE.md` — einzige zentrale Finance-Agentenanweisung (Bildstil aktuell nicht definiert, v6 entfernt)

## Technische Grundlayouts

```text
full-bleed
framed-image
big-number
split-comparison
process
chart
text-punch
cta
```

Varianten erzeugen daraus zwölf sichtbare Muster. Neue Komponenten werden nur bei wiederkehrendem Bedarf ergänzt.

## Befehle

```bash
npm run finance:new -- <slug> --title="Titel"
npm run voice:prepare -- <original-audio> --out=<voiceover-final.wav> --captions=<captions.json>
npm run finance:assets -- channels/finanzneo/public/reels/<slug>
npm run finance:align -- <scene-plan.json> <captions.json> <voiceover-final.wav>
npm run finance:validate -- channels/finanzneo/public/reels/<slug>
npm run finance:render -- channels/finanzneo/public/reels/<slug>
```

`finance:align` richtet Szenen anhand der tatsächlich gesprochenen Wörter aus. Es gibt keine proportionale Szenenstreckung.

`finance:render` verwendet ein festes H.264-/AAC-Profil und startet danach automatisch die finale MP4-QA.

## Plattformübergreifender Render

Remotion-CLI-Aufrufe laufen über `scripts/lib/run-command.mjs`. Unter Windows werden `.cmd`-Dateien automatisch mit Shell-Unterstützung gestartet, damit `npx.cmd` unter aktuellen Node-Versionen keinen `EINVAL`-Fehler erzeugt.

Lokale Pflichtprüfung auf Windows:

```bash
npm ci
npm run typecheck
npm test
npm run finance:e2e
npm run finance:render-qa-test
```

Finance-spezifische Tests befinden sich in:

- `scripts/lib/finance-contracts.test.ts`
- `scripts/finance-qa.test.ts`

Der GitHub-Workflow enthält zusätzlich einen `windows-latest`-Smoke-Job, der den E2E-Render tatsächlich über die Windows-Remotion-CLI ausführt.

## Layout-Galerie

```bash
npm run finance:gallery
```

Die Galerie prüft Layouts, Bildgrößen, Crops, Split-, Multi-Panel-, Caption- und CTA-Verhalten mit neutralen Daten.

## Neutraler End-to-End-Test

```bash
npm run finance:e2e
```

Der Test erzeugt temporär Audio, SFX, Wort-Captions und Platzhalterbilder und prüft:

```text
Vertrag
→ Asset-Ingest und Bildanalyse
→ Transkript-Alignment
→ Skript- und Final-QA
→ allgemeiner FinanceV1-Kontrollframe
```

Die Fixture wird anschließend gelöscht.

## Komplexitätsregel

- nur relevante Dateien laden
- keine Agentenkette
- bestehende Komponenten wiederverwenden
- keine doppelten Regeln oder Verträge
- gezielt patchen
- neue Abstraktionen nur bei wiederkehrendem Bedarf

## Status

Der Branch bleibt Draft, bis die Windows-Pflichtprüfung beziehungsweise ein tatsächlich gestarteter Ubuntu-/Windows-CI-Lauf vollständig besteht und anschließend ein echtes Test-Reel visuell geprüft wurde.
