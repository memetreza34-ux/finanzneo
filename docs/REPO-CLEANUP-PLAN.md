# FinanzNeo — Repo-Cleanup-Status

Stand: 25. September 2026

`CLAUDE.md` bleibt höchste interne Regelquelle. Dieses Dokument protokolliert nur den technischen Bereinigungsstand.

## Jetzt sauber verankert

- getrennte Reel- und YouTube-Produktionswelten mit eindeutigen Einstiegsketten
- YouTube Mode A = statisches fertiges Layout; Mode B = dasselbe Layout + Animation
- Flow-Bilder in YouTube niemals fullscreen
- `src/root/` trennt Production, Experiments und Showcases
- Production-Registry bleibt leer, bis alle Produktions-Gates bestanden sind
- aktive Reel-Regeln werden über `config/finanzneo-production-standard.json` geroutet
- veraltete Widersprüche zu `Bild 00`, alten Bildbeat-Zeiten und getrennten Plattform-Captions aus den Root-Arbeitsdokumenten entfernt
- `START-HIER.md` ist jetzt die zentrale Routing-Seite
- `docs/REPOSITORY-ARCHITECTURE.md` dokumentiert Ordnerrollen und Autorität
- Datenpipeline besitzt Quellenregister, Fetcher und lokale Snapshot-Validierung
- offizielle ECB- und Bundesbank-Zeitreihen können vor dem Render als lokale JSON-Snapshots geholt werden
- ETF-/Index-/Proxy-Unterscheidung ist in der Datenpipeline ausdrücklich festgehalten

## Bewusst noch nicht massenhaft verschoben

`src/` enthält historisch gewachsene Root-Demos und experimentelle Dateien wie `Mock*`, `Showcase*`, `Thumbnail*`, `RealDataDemo.tsx`, `LottieTest.tsx` sowie ältere `zins/`-Szenen.

Diese Dateien werden **nicht in einem großen Commit verschoben**, weil dadurch viele Imports und Regressionen gleichzeitig entstehen würden. Neue Arbeit darf dort nicht weiter ungeordnet anwachsen.

Nächster Struktur-Schritt, separat und in kleinen grünen Commits:

```text
src/experiments/
src/showcases/
```

mit schrittweiser Migration der historischen Demo-Dateien und sofortiger CI-Prüfung nach jeder Gruppe.

## Dokumentationsregel

Dateien mit `V2`, `V3`, `FUTURE-*` oder anderen alten Versionsnamen sind nicht automatisch aktiv. Sie gelten nur, wenn eine aktuelle autoritative Quelle darauf verweist.

Autorität:

```text
CLAUDE.md
→ aktiver config-Standard
→ Format-PRODUKTIONSSTANDARD
→ aktueller Workflow
→ übrige Dokumentation
```

## Qualitätsbefehle

```bash
npm ci
npm run validate
npm run build
npm run smoke
npm run data:validate
npm audit --audit-level=high
```

## Produktionsfreigabe

Eine Composition wird erst Production, wenn Fakten, Assets, Audio, Timings, Layout, Visual-QA, Render-QA und Export-Gates tatsächlich bestanden sind. Eine vorhandene MP4 oder ein grüner Typecheck allein genügt nicht.
