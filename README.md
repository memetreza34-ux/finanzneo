# FinanzNeo

Eigenständiges Repo für den FinanzNeo-Kanal, extrahiert aus `studio-clon` am 2026-07-31.

## Struktur

```text
core/brand-kit/     — Remotion-Bausteine (Snapshot aus studio-clon/core/brand-kit, @studio/core)
channels/finanzneo/ — der Kanal selbst (src, engine, gehirn, skills, public, reels)
scripts/            — Produktions-/QA-Pipeline (Skript-QA, Creative-QA, Content-Gate, Render, Export)
```

`core/brand-kit` ist ein **Snapshot** (kein Submodule) — Verbesserungen aus `studio-clon/core` kommen nicht automatisch hierher.

## Setup

```bash
npm install
npm test
```

## Bildstil

Aktuell **kein definierter Bildstil** — das alte v6-System wurde entfernt. Siehe `channels/finanzneo/CLAUDE.md`.

## Wichtigste Befehle

```bash
npm run finance:new -- <slug> --topic="..." --title="..." --publish-date=YYYY-MM-DD --selection-mode=... --selection-reason="..." --selected-by=assistant
npm run finance:script-qa -- <projektordner>/06-projektdateien/scene-plan.json
npm run finance:creative-qa -- <projektordner>/06-projektdateien/scene-plan.json
npm run finance:content-ready -- <projektordner>
npm run finance:ready -- <projektordner>
npm run finance:render -- <projektordner>
```
