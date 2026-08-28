# FinanzNeo — verbindlicher Komponenten-Katalog V9

Dieser Katalog gilt für **neue produktive Reels**. Bei Widerspruch gelten `CLAUDE.md`, `REEL_STYLE` und der Phase-3-Hintergrundvertrag.

Alle neuen Produktionsdateien importieren aus `src/design-system`.

## 1. Hintergrund — genau eine Produktionsregel

```tsx
<FinanceBackground />
```

Für Reels rendert `FinanceBackground` immer denselben Hintergrund:

```text
#000000
statisch
```

Die alten Props `standard`, `data` und `premium` sind nur noch API-Kompatibilität und dürfen **keine** visuelle Variante erzeugen.

Produktiv verboten:

- Aurora
- Grid
- Partikel
- Glow-Feld
- Vignette
- dekorative Background-Gradienten
- bewegter Hintergrund
- Background-Motion als Animationsnachweis

`VerticalSafeAreaGuide` ist ausschließlich Studio-/QA-Hilfe und bleibt im finalen Render deaktiviert.

## 2. Scene Header

Standard:

```tsx
<SceneHeader title="Kontoauszug prüfen" icon="search" />
```

- Position aus `REEL_STYLE`
- Text weiß
- semantische Farbe über das Linien-Icon
- Sentence Case
- keine Capsule / Chip / Pill / Panel
- kein automatisches ALL CAPS

## 3. Untertitel

Standard:

```tsx
<Captions words={words} />
```

- aktuelles Wort grün
- Rest weiß
- max. zwei Zeilen
- Position aus `REEL_STYLE`
- kein Stroke, Jump oder Scale-Pop
- pro Szene clippen

## 4. V9-Animationsbühne

Standard für kanonische Phase-1-Erkläranimationen:

```tsx
<PremiumPhysicalStage>
  <PhysicalObject ... />
</PremiumPhysicalStage>
```

`PremiumPhysicalStage` bleibt transparent. Der Hintergrund kommt ausschließlich vom zentralen `FinanceBackground`.

Pflichtlogik:

```text
START → SICHTBARER MECHANISMUS → ERGEBNIS
```

Es gibt keine feste Support-Objekt-Anzahl. Mindestens ein echtes sichtbares Hauptmotiv ist nötig; zusätzliche Objekte nur, wenn sie die Erklärung verbessern.

## 5. Geldbeträge und Zahlen

Geeignete Komponenten:

- `DramaticNumber` für einen wichtigen Endwert
- `Counter` für nachvollziehbare Entwicklung
- `BigStat` für eine statische Kernaussage

Finanzielle Endwerte müssen aus einer validierten Berechnung oder Datendatei kommen. Zahlen-Popup allein ist keine vollständige Erkläranimation.

## 6. Charts

Für echte Daten bevorzugt:

```tsx
<PremiumCharts.PremiumChart ... />
```

Pflicht:

- beschriftete Achsen, wenn Achsen nötig sind
- Einheit
- Annahmen/Quelle
- korrekte Skalierung
- keine Fantasiedaten

Charts dürfen auf dem schwarzen Canvas liegen, aber keine eigene dekorative Background-Welt erzeugen.

## 7. Vergleiche

Geeignete Komponenten, wenn sie exakt zum gesprochenen Beat passen:

- `CompareSplit`
- `Table`
- `Checklist`
- `Ranking`

Keine Dashboard-artige Ansammlung kleiner Karten als Hauptsprache.

## 8. Abläufe und Ursache-Wirkung

Bei Erklärmechanismen bevorzugt eine einfache physische/stylized-3D-Animation mit wenigen klaren Elementen.

Ein klassischer `Flowchart` ist **nicht** die Standard-Hauptkomposition für FinanzNeo-Reels. Kleine Kästen plus dünne Verbindungslinien, UI-Boards und technische Kontrollflächen sind nach V9 verboten.

## 9. Text-Komponenten

- `Title` / `Body` nur wenn der Beat Text wirklich benötigt
- Text darf das eigentliche Visual nicht ersetzen
- reine Texttafel zählt nicht als fertige Bild-/Animationsszene
- keine konkurrierenden Texteffekte

## 10. CTA und Endcard

- `EndCard` nur für den echten Abschluss
- CTA nie als Fallback für eine fehlende Animationsszene
- fehlendes Animation-Binding muss den Render hart abbrechen

## 11. Übergänge

Reel-Standard ist ausschließlich der kurze V5-Continuity-Schnitt aus `REEL_STYLE`:

```text
3 Frames
kein Fade-to-black
```

Auffällige Kapitelübergänge, Pixel-Dissolve, Zoom-Blur oder Bars-Wipe gehören nicht in den normalen Reel-Produktionspfad.

## 12. Dekoration

Für produktive Reel-Hintergründe gilt:

```text
keine Partikel
keine Aurora
kein Grid
kein Glow-Hintergrund
keine Vignette
```

Lokale Objekt-Highlights, Schatten, Materialverläufe und ein erklärender Pfeil sind erlaubt, wenn sie direkt der Aussage dienen.

## 13. Entscheidungsreihenfolge

1. Was ist die eine gesprochene Aussage?
2. Braucht sie ein Bild oder eine echte Animation?
3. Reicht ein einziges starkes Hauptmotiv?
4. Welche vorhandene Komponente erklärt sie am klarsten?
5. Bleibt der Hintergrund statisch `#000000`?
6. Ist die Szene ohne Caption/Header als echtes Visual verständlich?
7. Erst dann zusätzliche Objekte oder Spezialkomponenten ergänzen.

## 14. Produktionsfreigabe

Eine Komponente oder Composition ist nicht deshalb produktionsreif, weil Remotion sie rendern kann.

Produktive Reels müssen den vollständigen Weg bestehen:

```text
reel:ready
→ Phase-3-Manifest
→ phase3:preflight
→ Candidate-Render
→ Post-Render-QA
→ Final-MP4
→ reel:export
```

`ProductionCompositions` bleibt eine Freigabeliste. Legacy-/Demo-/Test-Compositions gehören in den Experiment-Bereich.
