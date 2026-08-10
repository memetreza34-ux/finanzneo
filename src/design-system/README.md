# FinanzNeo Design System

`src/design-system` ist der einzige öffentliche Importpfad für neue produktive Reels.

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
  FinanceBackground,
  VerticalSafeAreaGuide,
  PremiumCharts,
  FinanceConcepts,
} from '../design-system';
```

Direkte Imports aus `src/bausteine` sind in neuen Produktionsdateien nicht erlaubt.

Direkte Imports aus `src/brand` bleiben für bestehende Dateien vorerst kompatibel, sollen bei größeren Überarbeitungen aber ebenfalls auf `src/design-system` umgestellt werden.

## Verbindlicher Komponenten-Katalog

Vor jeder Komponentenwahl gilt:

```text
docs/COMPONENT-CATALOG.md
```

Dort ist festgelegt:

- welche Komponente Standard ist
- wann eine Premium-Alternative erlaubt ist
- welche dekorativen oder synthetischen Komponenten nicht für reale Finanzbehauptungen verwendet werden dürfen
- welche Zahleneffekte, Charts, Vergleiche und CTA-Komponenten bevorzugt werden

## Hintergründe

Neue Produktionen verwenden nur:

```tsx
<FinanceBackground variant="standard" />
<FinanceBackground variant="data" />
<FinanceBackground variant="premium" />
```

- `standard`: normale Erklärung, KI-Bild und Text
- `data`: Charts, Tabellen und Marktdaten
- `premium`: seltener Hook oder Payoff

Die übrigen Hintergrundmodule in `src/bausteine/fn_backgrounds.tsx` bleiben nur als experimentelle Kompatibilitätsvarianten erhalten.

Für Studio- und Keyframe-Prüfungen:

```tsx
<VerticalSafeAreaGuide enabled />
```

Der Guide zeigt die obere 18-Prozent- und untere 22-Prozent-Safe-Area. Vor dem finalen Render muss er deaktiviert werden.

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
- Hintergründe und Safe-Area-Guide: `src/design-system/FinanceBackground.tsx`
- öffentlicher Importpfad: `src/design-system/index.ts`
- Komponentenwahl: `docs/COMPONENT-CATALOG.md`

`src/bausteine/fn_core.tsx` ist nur noch eine Kompatibilitätsschicht. Dort dürfen keine eigenen Markenfarben oder extern geladenen Fonts mehr definiert werden.

## Migrationsregel

Bei einer bestehenden Datei:

1. Funktion nicht unnötig verändern.
2. direkte `../brand`- oder `../bausteine`-Imports prüfen.
3. passende Exports über `../design-system` verwenden.
4. Finanzwerte an zentrale Rechner oder validierte Daten anbinden.
5. Render und Typecheck prüfen.
6. erst danach alte Direktimporte entfernen.

Die Premium-Bausteine werden schrittweise konsolidiert. Ein großer einmaliger Rename wird vermieden, weil er unnötig viele bestehende Szenen gefährden würde.
