# FinanzNeo — Repo-Status nach der Bereinigung

Stand: 21. August 2026

`CLAUDE.md` bleibt die höchste interne Regelquelle. Dieses Dokument hält nur den technischen Bereinigungsstand fest.

## Abgeschlossen

- alle bestehenden Reel-Projekte sowie alten Reel- und `Short*`-Compositions entfernt
- veraltetes paralleles System `legacy-main/` entfernt
- Produktionsregistry geleert; Freigabe erfolgt künftig erst nach Manifest-, Fakten- und Asset-Prüfung
- Reel-CLI auf einen gemeinsamen Vertrag und einen funktionierenden `reel:validate`-Wrapper vereinheitlicht
- YouTube-Shorts-Widerspruch aus Scaffold und Validatoren entfernt
- falschen Demo-Endwert `248.000 €` durch die zentrale Sparplanberechnung ersetzt
- Remotion und zusammengehörige Pakete auf `4.0.514` vereinheitlicht
- bekannte npm-Sicherheitslücken auf null reduziert
- TypeScript `strict` aktiviert
- ESLint mit Null-Warnungen ergänzt und tote Imports entfernt
- reproduzierbare Finanz- und Reel-Vertragstests ergänzt
- Registry-, Design-System-, Finanz-, Reel- und Setup-Validatoren gebündelt
- Render-Smoke-Test für jede registrierte Composition ergänzt
- Standard-Render auf die funktionierende `ReelTemplateDemo` umgestellt
- CI um Lint, Tests, Dependency-Audit, Bundle und Render-Smoke-Test ergänzt

## Verbindliche Qualitätsbefehle

```bash
npm ci
npm run validate
npm run build
npm run smoke
npm run render
npm audit --audit-level=high
```

## Noch extern zu bestätigen

- erster grüner GitHub-Actions-Lauf nach Push des Cleanup-Branches
- Bereinigung alter Remote-Branches nur nach ausdrücklicher Freigabe, da ungemergte Arbeit enthalten sein kann

## Künftige Produktionsfreigabe

Ein neues Reel bleibt zunächst in `ExperimentCompositions.tsx`. Erst nach vollständigen Nutzerbildern, finalem Audio, echten Wortzeiten, Faktenprüfung, Manifest, Preview und Sichtprüfung darf es nach `ProductionCompositions.tsx` verschoben werden.
