# FinanzNeo — Caption, Scene Header, Timing & Motion V3

Verbindlicher Qualitätsstandard für neue Reel-Produktionen.

## 1. Premium-Untertitel V3

Auf dunklen FinanzNeo-Reel-Hintergründen:

- aktives gesprochenes Wort: helles FinanzNeo-Grün
- restliche Wörter: Weiß
- kein Gelb/Gold als Karaoke-Active-Word
- kein schwarzer Untertiteltext
- maximal zwei Zeilen
- kurze satz-/phrasenbasierte Einheiten
- kein Word-Jump
- keine Größenanimation / kein Scale-Pop
- keine Glow-Schrift: Kanten müssen crisp bleiben
- scharfer dunkler Stroke + sehr kurzer Shadow statt weicher Leuchteffekte
- dunkle halbdeckende Caption-Backplate für klare Trennung vom Bild
- Standardgröße ca. 64 px; bei langen Einheiten automatisch kleiner, nie unter ca. 50 px
- Standardposition ca. 285 px über dem unteren Rand
- links ca. 72 px, rechts ca. 140 px
- kurze Pausen halten die vorherige Caption sichtbar
- keine Caption-Lücken

Technische Standardkomponente: `src/brand/components/Captions.tsx`.

## 2. Zwischenüberschrift V3 — jede Szene

Jede Bild- und Animationsszene benötigt eine Zwischenüberschrift mit Icon.

Standard:

```tsx
<SceneHeader title="KONTOAUSZUG PRÜFEN" icon="search" />
```

Regeln:

- Header deutlich tiefer als früher: Standard `top ≈ 118`
- Icon links, Headline rechts
- Icon standardmäßig FinanzNeo-Grün
- Headline Weiß
- kompakte dunkle Premium-Kapsel als Hintergrund
- keine starken Glow-Effekte
- gleiche Position und gleiche Grundgestaltung im gesamten Reel
- kurze direkte Headline, kein Satz
- Rot nur bei Warnung/Problem
- Gold nur bei Geld/Wert

## 3. Hauptvisual-Zone tiefer und größer

Für 1080 × 1920:

- Header ungefähr ab Y = 118
- Hauptvisual ungefähr Y = 390–1560
- Untertitel ungefähr 285 px über dem unteren Rand
- zentrale Mechanismen und Einzelobjekte bevorzugt in der mittleren Bildschirmzone
- keine kleinen Animationen direkt unter dem Header
- zentrale Erklärung größer darstellen statt viel leeren Hintergrund zu lassen

## 4. Animationsfarben

- Weiß = neutrale Information
- Grün = Fokus, Lösung, korrekt, geschützt
- Rot = Problem, Steuer, Warnung, Verlust
- Gold = Geldbetrag, Summe, finanzieller Wert
- Schwarz = auf dunklen Reel-Flächen verboten

## 5. Eine gemeinsame Animationssprache

Alle nativen Remotion-Animationen desselben Reels müssen sich wie Teile EINER Serie anfühlen:

- gleicher dunkler FinanzNeo-Hintergrund
- gleiche Kantenradien und Oberflächen
- gleiche Icon-Sprache
- gleiche Textgrößen-Hierarchie
- gleiche Farben nach Bedeutung
- zentrale Aktionszone statt zufälliger Positionen
- keine Animation darf wie eine komplett andere Infografik-Vorlage aussehen

### Mechanismus-Pflicht

Jede Animation:

```text
STARTZUSTAND
→ SICHTBARE VERÄNDERUNG
→ EINDEUTIGES ERGEBNIS
```

Das Ergebnis muss am Ende mindestens kurz stabil stehen. Reine Zooms, Fades, Zahlen-Popups und dekorative Bewegung reichen nicht.

## 6. Übergänge

Übergänge sollen den Gedankengang verbinden, nicht Aufmerksamkeit stehlen.

Standard:

- kurze 4–6 Frame Continuity-Bewegung
- leichte vertikale Settle-Bewegung / sehr kleine Opacity-Änderung
- kein langer Fade-to-black
- keine zufällig wechselnden Transition-Stile
- zusammengehörige Szenen benutzen denselben Bewegungsfluss
- harte Schnitte sind erlaubt, wenn sie exakt auf einem starken gesprochenen Schlüsselwort liegen

## 7. Audio-Synchronität und Bildwechsel

Das finale Voiceover ist die einzige Timing-Autorität.

Für jeden Szenenwechsel:

- neuer Visual-Beat beginnt am ersten relevanten Wort oder sinnvollen Phrasenanfang
- Zielabweichung höchstens ca. 0,15 Sekunden
- neues Bild nicht deutlich vor der Aussage zeigen
- altes Bild nicht nach Beginn der neuen Aussage stehen lassen
- keine Szenen nach gleichmäßiger Zeit verteilen
- bei langen Sätzen dürfen sinnvolle Phrasenanfänge zusätzliche Visual-Beats auslösen

Reihenfolge:

```text
finales Voiceover
→ echte Wort-Timings
→ Triggerwort / Phrasenstart je Beat
→ exakter Szenenstart
→ Animation relativ zur echten Beatdauer
```

## 8. Bilddauer

- Bildbeat ideal 3,5–5,5 Sekunden
- absolut maximal 6 Sekunden
- wenn länger nötig: splitten oder animieren
- nicht künstlich zu kurz schneiden: Bild muss mindestens seine eine Aussage verständlich transportieren

## 9. Renderqualität — Pflicht für Final Export

Finale Reels niemals mit Preview-/Low-Bitrate-Einstellungen ausgeben.

Standard über `scripts/render-validated.mjs`:

- 1080 × 1920
- H.264
- CRF 14
- PNG-Zwischenframes
- AAC 320k
- `yuv420p`

Nach Render prüfen:

- Untertitelkanten bei 100 % Ansicht scharf
- feine weiße Schrift nicht matschig
- keine sichtbaren Block-/Banding-Artefakte
- keine Preview-Skalierung im Final Export

## 10. Mobil-QA

Vor Freigabe komplette MP4 ansehen, nicht nur Kontaktbogen.

Prüfen:

1. Header sitzt nicht zu hoch.
2. Visuals dominieren die Mitte.
3. Caption ist crisp und sofort lesbar.
4. Bildwechsel trifft die gesprochene Aussage.
5. Animationen wirken wie dieselbe Serie.
6. Jede Animation ist ohne Ton grundlegend verständlich.
7. Übergänge wirken einheitlich.
8. Keine schwarzen Texte auf dunklem Hintergrund.
9. Geldwerte Gold, Warnungen Rot, Fokus Grün, neutrale Info Weiß.
10. Finales Video hat Premium-Renderqualität.
