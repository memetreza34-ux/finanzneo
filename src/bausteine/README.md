# FinanzNeo Premium-Bausteine — Kompatibilitätsschicht

> Neue produktive Reels importieren nicht direkt aus diesem Ordner.
> Verwende `src/design-system/index.ts`.

## Status

`src/bausteine` enthält rund 163 experimentelle und spezialisierte FinanzNeo-Komponenten. Der Ordner bleibt erhalten, damit bestehende Szenen nicht brechen. Er ist aber nicht mehr das zweite unabhängige Designsystem.

Verbindliche Grundlagen:

- Farben: `src/brand/tokens.ts`
- Fonts: `src/brand/fonts.ts`
- öffentlicher Import: `src/design-system/index.ts`
- Finanzrechner: `src/finance/calculations.ts`

`fn_core.tsx` exportiert alte Namen wie `C`, `P`, `bebas` und `inter` nur noch als Kompatibilitäts-Aliase auf diese zentralen Grundlagen.

Die internen Baustein-Showcases verwenden `showcase-utils.tsx` für gemeinsame Sequenz-, Hintergrund- und Beschriftungslogik. Die bestehenden Showcase-Dateien und Exportnamen bleiben als stabile Kompatibilitätspunkte erhalten.

`internal-utils.ts` bündelt kleine historische Animations- und Format-Helfer wie Clamp, Reveal, Cubic-Easing und deterministischen Zufall. Die Datei ist rein intern und wird nicht über `src/design-system` exportiert.

## Interne Abhängigkeitsgrenzen

- Bausteine beziehen `C`, `P`, Fonts und Hintergrund-Aliase direkt aus `fn_core.tsx`.
- `fn_pro.tsx` re-exportiert `P` nur für bestehende Aufrufer. Andere Bausteinmodule dürfen `P` nicht über `fn_pro.tsx` beziehen.
- Spezielle historische Farbvarianten liegen trotzdem zentral in `src/brand/tokens.ts`. Die Glass-Variante verwendet `GLASS_PREMIUM`.
- Gleichnamige Komponenten in verschiedenen Namensräumen sind nicht automatisch Duplikate. Beispiel: `PremiumBlocks.FNRiskReturn` ist eine frei konfigurierbare Fullscreen-Grafik, `FinanceConcepts.FNRiskReturn` eine didaktische Concept-Darstellung mit Titel und Caption. Erst nach Funktionsvergleich konsolidieren.

## Neue Verwendung

```ts
import {
  C,
  FONT,
  PremiumCharts,
  FinanceConcepts,
  HookBlocks,
} from '../design-system';

const Chart = PremiumCharts.FNLineChartPro;
const EmergencyFund = FinanceConcepts.FNEmergencyFund;
```

## Gruppen

| Namensraum im Designsystem | Quelldatei | Zweck |
|---|---|---|
| `PremiumCharts` | `fn_chart_base.tsx` | beschriftete Premium-Charts |
| `ChartBlocks` | `fn_charts.tsx` | KPI-, Balken-, Ring- und Flächencharts |
| `FinanceConcepts` | `fn_concepts.tsx` | Zinseszins, Streuung, Risiko, Notgroschen |
| `FinanceBlocks` | `fn_finance_core.tsx` | Formeln, Rechner, Tilgung, Tabellen |
| `TextBlocks` | `fn_text.tsx` | Textanimationen |
| `DiagramBlocks` | `fn_diagrams.tsx` | Prozess, Timeline, Pipeline, Vergleich |
| `HookBlocks` | `fn_hooks.tsx` | Fragen, Warnungen und Fakten-Hooks |
| `EffectBlocks` | `fn_effects.tsx` | Checkmark, Counter, Confetti und Akzente |
| `ComplexBlocks` | `fn_complex.tsx` | komplexe Daten- und Vergleichsstorys |
| `PremiumBlocks` | `fn_premium.tsx` | finanzspezifische Premium-Visuals |
| `PremiumBlocks2` | `fn_premium2.tsx` | weitere Premium-Karten und Marktvisuals |
| `ProBlocks` | `fn_pro.tsx` | ruhige Grün-Gold-Komponenten |
| `SceneBlocks` | `fn_scenes.tsx` | vollständige Split-Szenen |
| `StoryBlocks` | `fn_story.tsx` | Story-Bausteine |
| `Choreography` | `fn_choreo.tsx` | choreografierte Sequenzen |
| `TransitionBlocks` | `fn_transitions.tsx` | Übergänge |
| `DecorationBlocks` | `fn_decor.tsx` | sparsame Betonung und Dekoration |
| `ExtraBlocks` | `fn_extra.tsx` | Zeit, Karten und Personen-Symbole |
| `UIBlocks` | `fn_ui2.tsx` | Endcards und UI-Helfer |
| `GlassBlocks` | `fn_glass.tsx` | Glas-Layouts |
| `GlobeBlocks` | `fn_globe.tsx` | Welt- und Portfolio-Visuals |
| `LegacyKit` | `fn_kit.tsx` | frühe Basisbausteine |

## Qualitätsregeln

- keine eigenen Markenfarben definieren
- keine externen Fonts laden
- keine Finanzwerte frei im JSX erfinden
- Charts mit Zahlen verwenden zentrale Rechner oder validierte Datendateien
- produktive Szenen bevorzugen ruhige Hintergründe
- neue Komponenten nur ergänzen, wenn keine bestehende Komponente denselben Zweck bereits gut erfüllt

## Schrittweise Konsolidierung

Der Ordner wird nicht auf einmal umbenannt oder gelöscht. Stattdessen werden Komponenten bei tatsächlicher Nutzung geprüft:

1. Duplikat im Kernsystem suchen.
2. bessere Variante bestimmen.
3. Farben und Fonts zentral anbinden.
4. Finanzwerte validieren.
5. über `src/design-system` exportieren.
6. schwächere Variante erst nach erfolgreicher Migration archivieren.
