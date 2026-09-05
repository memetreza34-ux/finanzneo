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

## Reel-Header — optische Konsistenz

`SceneHeader` ist die einzige produktive Header-Komponente für Reels.

Verbindlich:

- alle Header-Icons sitzen in demselben festen Icon-Slot;
- SVG-Glyphen werden optisch normalisiert, nicht nur technisch auf dieselbe `width/height` gesetzt;
- das Icon ist vertikal an der **ersten Textzeile** ausgerichtet;
- ein zweizeiliger Titel darf das Icon niemals nach unten ziehen;
- die Header-Gruppe bleibt als Ganzes zentriert, der Text innerhalb der Gruppe ist linksbündig;
- dadurch beginnt auch bei einem Zweizeiler die erste Textzeile mit konstantem Abstand direkt neben dem Icon;
- Header-Icons verwenden keinen Glow.

Die Implementierung liegt in:

```text
src/brand/components/SceneHeader.tsx
src/brand/components/Icon.tsx
src/brand/tokens.ts -> REEL_STYLE.header
```

## Reel-Animationen — Cinematic Explainer Standard

Eine Animation ist **keine bewegte Infografik**. Sie muss wie eine kleine visuelle Geschichte dieselbe realitätsnahe stylized-3D-Welt wie die Flow-Bilder verwenden.

Jede produktive Animationsszene braucht:

```text
STARTZUSTAND
→ konkrete physische Hauptaktion
→ sichtbare Ursache/Wirkung
→ eindeutiges Ergebnis
→ stabiler Result-Hold
```

Pflicht:

- konkrete Realwelt-Gegenstände, wenn der Inhalt sie hergibt;
- mindestens zwei konkrete Realwelt-Objekte/-Instanzen in der visuellen Handlung;
- eindeutige `MECHANIC_ID`, die nicht in einer zweiten Szene wiederverwendet wird;
- `PRIMARY_ACTION`, die beschreibt, was sich physisch verändert;
- mehrere koordinierte Motion-Channels statt einer einzigen globalen Progress-Variable;
- Labels nur unterstützend; die Handlung muss auch ohne die Labels verständlich bleiben;
- jede Animationsszene soll eine **andere** Mechanik einsetzen, wenn der Inhalt eine andere Handlung verlangt.

Explizit ungeeignet als Hauptsprache:

- drei beschriftete Rechtecke nebeneinander;
- `A → B → C` nur als Kartenfolge;
- Lade-/Fortschrittsbalken als Ersatz für die Handlung;
- reine Texttafel mit Fade/Scale;
- abstrakte Schutzschild-/Pfeil-Metapher, wenn eine konkrete Alltagssituation darstellbar ist;
- Dashboard, App-UI oder Flowchart als primäre Erklärung.

### Reale Animations-Primitives

Für konkrete Erklärszenen stehen zentral bereit:

```tsx
PhysicalBill
PhysicalAccount
PhysicalWasher
PhysicalReserveTank
PhysicalCalendarPage
PhysicalCoinStack
```

Sie sind absichtlich keine generischen UI-Karten, sondern erkennbare reale Gegenstände für Ursache-Wirkung-Szenen. `PhysicalObject`, `PhysicalTag` und `PhysicalRail` bleiben unterstützende primitives; insbesondere `PhysicalRail` darf nie allein die visuelle Geschichte tragen.

Qualität wird zusätzlich durch `scripts/validate-animation-source-quality.mjs` geprüft.

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
- `SceneHeader` + optisch normalisierte `Icon`-Darstellung
- `PremiumPhysicalStage` + konkrete Realwelt-Animations-Primitives
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
- Reel-Header: `src/brand/components/SceneHeader.tsx`
- optische Icon-Normalisierung: `src/brand/components/Icon.tsx`
- Realwelt-Animations-Primitives: `src/brand/components/PremiumPhysical.tsx`
- Animations-QA: `scripts/validate-animation-source-quality.mjs`
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


## Remotion Freedom — neue Animationsregel

Neue Reel-Animationen sind **nicht** auf den Physical*-Katalog beschränkt. Die Komponenten bleiben wiederverwendbare Helfer, aber die visuelle Lösung darf frei aus React, SVG, CSS-3D, Masken/Clip-Paths, Perspektive/Kamera, Canvas oder Three.js aufgebaut werden. Entscheidend sind Erklärwert, Safe-Zone, eindeutige Ursache/Wirkung, eigene VISUAL_TECHNIQUE_ID je Szene und bestandene Render-QA. Wiederholung derselben visuellen Haupttechnik innerhalb eines Reels ist zu vermeiden.
