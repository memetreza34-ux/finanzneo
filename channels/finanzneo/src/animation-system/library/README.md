# FinanzNeo Animationsbibliothek · Batch 1

Diese Bibliothek erweitert das bestehende Animationssystem um sechs wiederverwendbare Finanzanimationen, die in den bisherigen zwölf Foundation-Templates noch nicht abgedeckt waren.

## Kategorien und Animationen

| Kategorie | ID | Anzeigename | Geeignet für |
|---|---|---|---|
| Börse & Märkte | `market-crash-recovery` | Crash und Erholung | Börsencrash, Korrektur, Tiefpunkt, Erholung, Marktzyklus |
| Investieren | `dividend-snowball` | Dividenden-Schneeball | Dividenden, Ausschüttungen, Wiederanlage, passives Einkommen |
| Sparen & Sicherheit | `emergency-fund-progress` | Notgroschen-Fortschritt | Rücklage, Monatsausgaben, finanzielle Sicherheit |
| Immobilien & Kredite | `mortgage-amortization` | Baufinanzierung und Tilgung | Immobilienkredit, Zinsen, Tilgung, Restschuld |
| Vermögen | `net-worth-stack` | Nettovermögens-Stapel | Vermögenswerte, Schulden, Nettovermögen |
| Finanzielle Freiheit | `fire-progress` | FIRE-Fortschritt | Zielvermögen, Entnahmerate, finanzielle Freiheit |

## Status

Alle sechs Einträge besitzen den Status `library-ready`:

- echte Remotion-Komponente vorhanden
- eigener Name, Zweck, Kategorie und Keyword-Satz vorhanden
- feste Demo-Daten für die Galerie vorhanden
- mathematische Hilfsfunktionen sind separat testbar
- 180 Frames pro Bibliotheksvorschau

`library-ready` bedeutet nicht automatisch produktiv aktiviert. Die Komponenten sind bewusst isoliert und werden noch nicht vom automatischen FinanzNeo-Routing ausgewählt.

## Compositions

- `FinanzNeoAnimationLibraryBatchOne`: alle sechs Animationen nacheinander, 1080 × 1920
- `FinanzNeoAnimationLibraryOverview`: Kontaktbogen aller sechs Animationen, 1920 × 1080

## Befehle

```bash
npm run finance:animation-library:structure
npm run finance:animation-library:validate
npm run finance:animation-library:studio
npm run finance:animation-library:overview
npm run finance:animation-library:render
```

## Ausgaben

```text
/tmp/finanzneo-animation-library-overview.png
/tmp/finanzneo-animation-library-batch-one.mp4
```

## Sicherheitszustand

- kein Import in `FinanceProductionLayer`
- keine Registrierung im produktiven `FinanzNeoRoot`
- globale Feature-Flags bleiben deaktiviert
- kein automatisches Routing
- keine Änderung an `main`

Nach lokaler technischer und visueller Prüfung können einzelne Bibliothekseinträge später kontrolliert in Datenverträge, Renderer und Router übernommen werden.
