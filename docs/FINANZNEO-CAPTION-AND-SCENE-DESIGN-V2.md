# FinanzNeo — Caption, Scene Header, Timing & Motion V5

Verbindlicher Qualitätsstandard für neue Reel-Produktionen.

## 1. Untertitel V5

- aktives gesprochenes Wort: helles FinanzNeo-Grün
- restliche Wörter: Weiß
- kein Gelb/Gold als Karaoke-Active-Word
- kein schwarzer Untertiteltext
- maximal zwei Zeilen
- keine Größenanimation / kein Scale-Pop
- kein Word-Jump
- kein `WebkitTextStroke`
- dunkle halbdeckende Backplate für Kontrast
- Schriftstärke 800
- Standardgröße 50 px, automatisch kleiner bei langen Einheiten, nie unter 40 px
- `letterSpacing: 0`
- Position aus `REEL_STYLE.caption`: `bottom = 340`, `left = 72`, `right = 140`
- kurze Pausen halten die vorherige Caption sichtbar
- Untertitel werden pro Szene geclippt; kein Wort der nächsten Szene darf vorgreifen

Technische Standardkomponente: `src/brand/components/Captions.tsx`.

## 2. Zwischenüberschrift V5

Jede Bild- und Animationsszene benötigt eine Zwischenüberschrift mit passendem Linien-Icon.

Standard:

```tsx
<SceneHeader title="Kontoauszug prüfen" icon="search" />
```

Verbindlich:

- `top = 154`
- mittig zentriert
- normale Schreibweise / Sentence Case
- neutral weißer Text
- einfaches Linien-Icon links neben dem Text
- semantische Farbe primär über das Icon
- keine Capsule
- kein Chip
- keine Pill
- kein Panel
- keine automatische ALL-CAPS-Transformation
- 3–6 Wörter, möglichst eine Zeile
- Aussage oder Frage; nie nur ein Stichwort oder eine Zahl
- `warning` nur für echte Warnung/Problem
- `money` nur für Geld/Wert

Technische Standardkomponente: `src/brand/components/SceneHeader.tsx`.

## 3. V5-Layout

Einzige technische Quelle ist `REEL_STYLE` in `src/brand/tokens.ts`.

```text
Header       Y = 154
Visual       Y = 320–1480
Untertitel   340 px über dem unteren Rand
Transition   3 Frames
```

Ziel des Layouts:

- Überschrift näher am Visual
- Bilder und Animationen etwas höher
- Untertitel ebenfalls höher
- oben und unten mehr ruhige Luft
- keine große tote Lücke zwischen Header und Szeneninhalt

`AnimationStage` aus `src/brand/components/ReelStage.tsx` verwendet dieselbe Visualzone und verschiebt native Vollbild-Animationen zentral nach oben.

## 4. Szenenschnitt und Captions

Das finale Voiceover ist die Timing-Autorität.

```text
finales Voiceover
→ echte Wort-Timings
→ Satz-/Phrasenanfänge
→ Szenenstarts
→ relative Animationsdauern
```

Untertitel werden pro `Series.Sequence` gerendert. Wörter außerhalb des Szenenfensters werden abgeschnitten. Eine Caption-Einheit darf nie über die Szenengrenze laufen.

## 5. Animationsfarben

Auf dunklem Reel-Hintergrund gilt `ANIMATION_COLORS`:

- Weiß = neutrale Information
- Grün = Fokus/Lösung
- Rot = Warnung/Problem/Verlust
- Gold = Geldbetrag/Summe/Wert
- Schwarz = verboten

## 6. Eine gemeinsame Animationssprache

Alle nativen Remotion-Animationen eines Reels müssen wie Teile derselben Serie wirken:

- gleicher dunkler FinanzNeo-Hintergrund
- gleiche Text- und Icon-Hierarchie
- gleiche semantische Farblogik
- gleiche Visualzone
- klare, ruhige Flächen statt zufälliger Infografik-Stile
- keine überlappenden Texte/Objekte
- kein UI-/Dashboard-Look, wenn die Szene keinen UI-Inhalt erklärt

## 7. Phase-1-Verantwortung für Animationen

Für neue Reels liefert Phase 1 pro Animationsszene bereits produktionsreifen Code:

```text
03-szenen/EINZELNE-SZENEN/scene-XX/animation.tsx
```

Verbindlicher Lock:

```text
finanzneo-phase1-animation-code-v1
```

Jede Animation muss im Code eindeutig enthalten:

```text
STARTZUSTAND
→ SICHTBARER MECHANISMUS
→ EINDEUTIGES ERGEBNIS
→ RESULT mindestens 15 Frames stabil
```

Zusätzlich enthält die Quelldatei einen `ANIMATION_NARRATIVE`-Block mit `START`, `MECHANISM` und `RESULT`.

Phase 3 darf diese kreative Definition nicht ersetzen, vereinfachen oder durch einen eigenen Ersatzmechanismus austauschen.

Verbindliche Detailquelle: `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`.

## 8. Verbotene Fake-Animationen

Nicht zulässig:

- Dummy-/Placeholder-Komponenten
- Debug-Flächen
- bunte Rechtecke nur für Sichtbarkeit
- kontinuierliches Wackeln ohne inhaltliche Bedeutung
- `Math.sin()`/`Math.cos()` nur zum Erzeugen eines Frame-Diffs
- reine Zooms/Fades/Zahlen-Popups als alleinige Erkläranimation
- Bewegung, die nur das QA austrickst

Die Bewegung muss die gesprochene Aussage erklären.

## 9. Phase-3-Schutz

Bei `reel:ready` werden die Phase-1-Animationsquellen per SHA-256 versiegelt. Phase 3 muss exakt dieselben `animation.tsx`-Dateien verwenden.

Der Preflight blockiert unter anderem:

- fehlende Animationsquelle
- anderer `componentPath` als die Phase-1-Quelle
- veränderter Hash nach Phase 1
- fehlender Export
- Placeholder-/Fake-Motion-Code
- unvollständige Timeline

Post-Render-QA prüft zusätzlich sichtbaren Inhalt und reale Bewegung. Diese technische QA ersetzt jedoch nicht den narrativen Phase-1-Vertrag.

## 10. Bilddauer und Übergänge

- Bildbeat ideal 3,5–5,5 Sekunden
- absolut maximal 6 Sekunden
- länger = splitten oder animieren
- Continuity-Schnitt 3 Frames
- kein Fade-to-black
- Übergänge dürfen audio-synchronisierte Szenenstarts nicht verschieben

## 11. Renderqualität

Finale Reels über `scripts/render-validated.mjs`:

- 1080 × 1920
- H.264
- CRF 14
- PNG-Zwischenframes
- AAC 320k
- `yuv420p`

## 12. Mobil-QA

Vor Freigabe komplette MP4 ansehen und prüfen:

1. Header sitzt bei Y≈154 und wirkt wie normale Typografie.
2. Kein Header-Chip/Capsule/Panel ist sichtbar.
3. Visuals dominieren die Zone 320–1480.
4. Bilder und Animationen wirken nicht zu tief.
5. Untertitel sitzen höher und bleiben crisp.
6. Bildwechsel treffen die gesprochene Aussage.
7. Animationen entsprechen ihrem `ANIMATION_NARRATIVE`.
8. Keine Fake-/Placeholder-Bewegung ist sichtbar.
9. Animationen sind ohne Ton grundsätzlich verständlich.
10. Geldwerte Gold, Warnungen Rot, Fokus Grün, neutrale Info Weiß.
11. Finale Renderqualität ist sauber.
