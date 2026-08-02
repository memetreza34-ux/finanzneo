# FinanzNeo

Eigenständiges Repo für den FinanzNeo-Kanal, extrahiert aus `studio-clon` am 2026-07-31.

## Struktur

```text
core/brand-kit/     — nur die von FinanzNeo tatsächlich genutzten Remotion-Bausteine (@studio/core, getrimmt)
channels/finanzneo/ — der Kanal selbst (src, engine, gehirn, skills, public, reels)
scripts/            — Produktions-/QA-Pipeline (Skript-QA, Creative-QA, Content-Gate, Render, Export)
```

Kein zweiter Kanal, kein KI-Anteil — dieses Repo enthält ausschließlich FinanzNeo.

`core/brand-kit` ist ein **getrimmter Snapshot** aus `studio-clon/core/brand-kit` (nur genutzte Bausteine: Tokens, Theme, Fonts, Lucide, Sound, Captions, PremiumIcon, PremiumGrade) — kein Submodule, Verbesserungen aus `studio-clon/core` kommen nicht automatisch hierher.

## Setup

```bash
npm install
npm test
```

## Bildstil

FinanzNeo verwendet ein verbindliches stilisiertes 3D-Illustrationssystem für alle Bildprompts:

```text
channels/finanzneo/gehirn/BILDSTIL.md
channels/finanzneo/gehirn/MASTER-STYLE-PROMPT.md
channels/finanzneo/gehirn/IMAGE-PROMPT-TEMPLATE.md
```

Der Inhalt jeder Szene darf wechseln, der Master-Stil bleibt unverändert. Bildprompts bestehen aus Kernaussage, einer zusammenhängenden visuellen Metapher, optionalen kurzen deutschen Labels, Kompositionsvorgaben und dem vollständigen Master-Stilblock.

## Reel-Ausgabe

Jedes Reel behält den PDF-Bereich:

```text
04-pdf/inhalt.md
```

Zusätzlich entstehen im Bilderordner zwei Prompt-Dateien:

```text
02-bilder/prompt-manifest.json
02-bilder/alle-bildprompts.txt
```

`alle-bildprompts.txt` enthält alle vollständigen Szenenprompts in chronologischer Reihenfolge und kann komplett kopiert und direkt in Google Flow eingefügt werden.

## Wichtigste Befehle

```bash
npm run finance:new -- <slug> --topic="..." --title="..." --publish-date=YYYY-MM-DD --selection-mode=... --selection-reason="..." --selected-by=assistant
npm run finance:script-qa -- <projektordner>/06-projektdateien/scene-plan.json
npm run finance:creative-qa -- <projektordner>/06-projektdateien/scene-plan.json
npm run finance:content-ready -- <projektordner>
npm run finance:ready -- <projektordner>
npm run finance:render -- <projektordner>
```
