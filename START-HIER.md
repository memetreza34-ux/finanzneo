# FinanzNeo — Start hier

> `CLAUDE.md` ist die höchste Regelquelle für Produktionsverantwortung und Agent-Verhalten.

## Aktiver Produktionsstandard

Welche Versionen aktuell zusammengehören, steht nur noch in:

```text
config/finanzneo-production-standard.json
```

Der Index verweist auf die jeweils autoritative Quelle für Layout, Hintergrund, Bildwelt, Google Flow, Animationscode und Produktions-Gates. Versionsnummern nicht aus alten Dokumenten zusammensuchen oder frei kombinieren.

Wichtige Quellen:

- Layout und Safe-Zones: `src/brand/tokens.ts -> REEL_STYLE`
- Reel-Hintergrund: `src/design-system/FinanceBackground.tsx`
- Bildwelt und Flow: `config/finanzneo-image-world-lock.json`
- Komponentenwahl: `docs/COMPONENT-CATALOG.md`
- Phase 1: `docs/PHASE-1-BRIEFING.md`
- Animationscode: `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`
- Gesamtworkflow: `docs/3-PHASEN-WORKFLOW.md`
- Phase 3: `docs/PHASE-3-COMPLETION-GATE.md`

## Drei Phasen

```text
PHASE 1 — ChatGPT
Recherche + Skript + Bildprompts + produktionsreife animation.tsx

        ↓

PHASE 2 — Nutzer
Flow-Bilder + genau ein finales Voiceover + echte Wort-Timings

        ↓

PHASE 3 — konfigurierter Executor
Assets integrieren + Animationen binden + Preflight + Render + QA + Export
```

## Neuer Reel

```bash
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"
```

Danach gilt der im aktiven Standard referenzierte Workflow. Ein Reel ist erst final, wenn die dort definierten Produktions-Gates vollständig bestanden sind. Eine vorhandene MP4 allein ist kein Fertigkeitsnachweis.

## Phase 3 — Befehle

```bash
npm run reel:ready -- <Reel>
npm run reel:phase3:init -- <Reel> <Composition-ID>
npm run reel:phase3:preflight -- <Reel>
npm run reel:render -- <Reel>/05-projektdateien/phase3-production-manifest.json
npm run reel:export -- <Reel> <Final-MP4>
```

## Grundregel für Änderungen

Neue Regeln nicht parallel in mehreren Dokumenten neu definieren. Stattdessen die autoritative Quelle ändern und bei Bedarf nur darauf verweisen. Alte Versionsdokumente sind keine Grundlage für neue Produktionen, sofern sie nicht vom aktiven Produktionsstandard referenziert werden.
