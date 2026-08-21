# FinanzNeo Composition-Registry

Neue Remotion-Compositions werden nicht mehr direkt in `src/Root.tsx` registriert.

## Bereiche

### `ProductionCompositions.tsx`

Nur Inhalte, die veröffentlicht oder direkt als Kanal-Asset exportiert werden können:

- fertige Reels und vertikale Kurzvideos
- freigegebene Longform-Szenen
- Thumbnails
- Profilbilder
- notwendige Produktions-Assets

Produktive Compositions benötigen vor dem finalen Render ein Asset-Manifest und eine Faktenprüfung.

Nach der Bereinigung ist diese Registry bewusst leer. Neue Inhalte werden erst nach vollständiger Freigabe aus `ExperimentCompositions.tsx` hierher verschoben.

### `ExperimentCompositions.tsx`

Nicht freigegebene Arbeit:

- Stiltests
- technische Versuche
- Prototypen
- Variantenvergleiche
- unfertige Reel-Entwürfe

Experimente dürfen nicht ungeprüft als Kanalvideo veröffentlicht werden.

### `ShowcaseCompositions.tsx`

Interne Übersichten:

- Komponenten-Demos
- Baukasten-Showcases
- Funktionsübersichten
- Präsentationen des Designsystems

Showcases sind Dokumentation und keine fertigen Inhalte.

## Verbindliche Regeln

1. Jede Composition-ID darf im gesamten Repo nur einmal vorkommen.
2. Bestehende IDs werden nicht ohne Migrationsgrund umbenannt.
3. Neue produktive Videos erhalten eine beschreibende ID, keine Namen wie `Test2` oder `FinalNeu`.
4. Test-Compositions gehören niemals in `ProductionCompositions.tsx`.
5. Produktionsrender laufen über ein Manifest und den Asset-Validator.
6. `src/Root.tsx` bleibt klein und enthält nur die drei Bereichs-Registries.

## Neue Composition hinzufügen

1. Kategorie bestimmen.
2. Component und Dauer-Konstante in der passenden Registry importieren.
3. `Composition` mit eindeutiger ID registrieren.
4. `npm run validate:compositions` ausführen.
5. Bei Produktionsinhalten ein Manifest unter `manifests/` ergänzen.
