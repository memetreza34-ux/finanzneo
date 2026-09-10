# FinanzNeo Design System

`src/design-system` ist der öffentliche Importpfad für neue produktive Reels.

## Zweck

Im Repo existieren ein stabiles Kernsystem in `src/brand` und eine größere Sammlung älterer bzw. spezialisierter Bausteine in `src/bausteine`. Neue Produktionen sollen diese Historie nicht kennen müssen.

Darum gilt:

```ts
import {
  C,
  FONT,
  SAFE_AREA,
  Captions,
  SceneHeader,
  FinanceBackground,
  PremiumCharts,
  FinanceConcepts,
} from '../design-system';
```

Direkte Imports aus `src/bausteine` sind für neue Produktionsdateien nicht vorgesehen. Bestehende Dateien werden nur bei ohnehin nötigen Überarbeitungen migriert.

## Aktiver Standard

Die aktuell gültige Kombination aus Layout, Hintergrund, Bildwelt, Flow und Animationsstandard steht in:

```text
config/finanzneo-production-standard.json
```

Der verbindliche Komponenten-Katalog liegt in:

```text
docs/COMPONENT-CATALOG.md
```

## Hintergrund

Für produktive Reels gibt es nur einen Hintergrund:

```tsx
<FinanceBackground />
```

Er ist statisch und rein schwarz. Die Props `standard`, `data` und `premium` existieren nur noch aus Kompatibilitätsgründen und erzeugen keine unterschiedlichen visuellen Varianten.

`VerticalSafeAreaGuide` ist ausschließlich eine Studio-/QA-Hilfe und darf im finalen Render nicht sichtbar sein.

## Verbindlicher Kern

- Farben und Layout-Tokens: `src/brand/tokens.ts`
- Fonts: `src/brand/fonts.ts`
- Header: `src/brand/components/SceneHeader.tsx`
- Icons: `src/brand/components/Icon.tsx`
- Captions: Exports aus `src/brand`
- physische Animations-Primitives: `src/brand/components/PremiumPhysical.tsx`
- Finanzrechner: `src/finance/calculations.ts`
- Reel-Hintergrund: `src/design-system/FinanceBackground.tsx`

## Premium-/Legacy-Bausteine

Die Module unter `src/bausteine` bleiben vorerst kompatibel und werden über Namensräume exportiert, damit keine Namenskollisionen entstehen. Sie sind jedoch nicht automatisch Produktionsstandard.

Beispiele:

```ts
PremiumCharts.PremiumChart
FinanceConcepts.FNEmergencyFund
HookBlocks.FNQuestion
```

Vor Verwendung entscheidet `docs/COMPONENT-CATALOG.md`, ob ein Baustein für die jeweilige Szene geeignet ist.

## Migrationsregel

Bei bestehenden Dateien:

1. Funktion nicht unnötig verändern.
2. direkte `brand`-/`bausteine`-Imports prüfen.
3. wenn sinnvoll auf `design-system` umstellen.
4. Finanzwerte an zentrale Rechner oder validierte Daten anbinden.
5. Typecheck, Validatoren und Render prüfen.
6. erst danach alte Direktimporte entfernen.

Große einmalige Renames oder Löschaktionen sind ausdrücklich nicht Teil normaler Produktionsarbeit. Legacy-Code wird schrittweise entfernt, sobald er nachweislich nicht mehr referenziert wird.
