# FinanzNeo Design System

`src/design-system` ist ab jetzt der einzige öffentliche Importpfad für neue produktive Reels.

## Warum

Im Repo entstanden zwei parallele Systeme:

- `src/brand` — stabiles Kernsystem
- `src/bausteine` — große Premium-Erweiterung

Beide definierten teilweise eigene Farben, Fonts, Hintergründe und Charts. Das führte zu Stilabweichungen und doppelter Wartung.

## Neue Regel

Neue Produktionsdateien importieren ausschließlich aus:

```ts
import {
  C,
  FONT,
  SAFE_AREA,
  Captions,
  PremiumCharts,
  FinanceConcepts,
} from '../design-system';
```

Direkte Imports aus `src/bausteine` sind in neuen Produktionsdateien nicht erlaubt.

Direkte Imports aus `src/brand` bleiben für bestehende Dateien vorerst kompatibel, sollen bei größeren Überarbeitungen aber ebenfalls auf `src/design-system` umgestellt werden.

## Struktur

### Direkt exportiert

Aus `src/brand` kommen unter anderem:

- `C`, `PREMIUM`, `MEANING`
- `FONT`
- `FORMAT`, `SAFE_AREA`
- `Background`, `Vignette`
- `Captions`
- Kern-Charts und Layouts
- Templates und Branding

Aus `src/finance/calculations.ts` kommen reproduzierbare Finanzrechner.

### Namensräume

Die große Premium-Erweiterung wird in Namensräumen exportiert:

```ts
PremiumCharts.FNLineChartPro
FinanceConcepts.FNEmergencyFund
HookBlocks.FNQuestion
TransitionBlocks.FNWipeIn
```

Das verhindert Namenskollisionen und macht sofort sichtbar, ob eine Komponente zum stabilen Kern oder zur Premium-Erweiterung gehört.

## Autoritative Grundlagen

- Farben: `src/brand/tokens.ts`
- Fonts: `src/brand/fonts.ts`
- Finanzrechner: `src/finance/calculations.ts`
- öffentlicher Importpfad: `src/design-system/index.ts`

`src/bausteine/fn_core.tsx` ist nur noch eine Kompatibilitätsschicht. Dort dürfen keine eigenen Markenfarben oder extern geladenen Fonts mehr definiert werden.

## Migrationsregel

Bei einer bestehenden Datei:

1. Funktion nicht unnötig verändern.
2. direkte `../brand`- oder `../bausteine`-Imports prüfen.
3. passende Exports über `../design-system` verwenden.
4. Render und Typecheck prüfen.
5. erst danach alte Direktimporte entfernen.

Die 163 Premium-Bausteine werden schrittweise konsolidiert. Ein großer einmaliger Rename wird vermieden, weil er unnötig viele bestehende Szenen gefährden würde.
