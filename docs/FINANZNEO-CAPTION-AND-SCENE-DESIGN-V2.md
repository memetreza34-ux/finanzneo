# FinanzNeo — Caption, Scene Header, Timing & Motion V4

Verbindlicher Qualitätsstandard für neue Reel-Produktionen.

## 1. Premium-Untertitel V4

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
- **kein `WebkitTextStroke`** — siehe Begründung unten
- dunkle halbdeckende Caption-Backplate für klare Trennung vom Bild; sie liefert den Kontrast allein
- ein weicher Tiefenschatten (`0 2px 7px rgba(0,0,0,0.55)`) statt harter Kontur
- Schriftstärke 800 — **nicht 900**
- Standardgröße 50 px; bei langen Einheiten automatisch kleiner, nie unter 40 px
- `letterSpacing: 0` — kein negativer Wert
- Standardposition 285 px über dem unteren Rand
- links 72 px, rechts 140 px
- kurze Pausen halten die vorherige Caption sichtbar
- keine Caption-Lücken

### Warum kein Stroke und kein Weight 900

`WebkitTextStroke` zeichnet die Kontur **mittig auf der Glyphenkante**, wächst
also zur Hälfte in den Buchstaben hinein. Zusammen mit Schriftstärke 900 liefen
die Innenräume von `a`, `e`, `o` und `g` zu — der Untertitel wirkte dick,
klobig und unscharf. Bei 64 px kam eine erdrückende Grundgröße dazu.

Der Standard ist deshalb: **Backplate für Kontrast, weicher Schatten für Tiefe,
keine Kontur.** Der Validator erzwingt das (`npm run validate:design-system`).

### Zahlen im Untertitel

Transkriptionen zerlegen Beträge häufig am Tausenderpunkt in zwei Tokens
(`100` + `.000`), im Untertitel erschien sichtbar `100 .000 Euro`. Die
Zusammenführung passiert zentral in `src/lib/captions.ts` und gilt für alle
Reels — in einzelnen Reels nichts nachbauen.

Technische Standardkomponente: `src/brand/components/Captions.tsx`.
Alle Maße stammen aus `REEL_STYLE.caption` in `src/brand/tokens.ts`. Reels
setzen keine eigenen Caption-Größen; `<Captions words={...} />` genügt.

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
- **mittig zentriert**, nicht linksbündig
- **Headline in FinanzNeo-Grün**, Icon in derselben Farbe
- **jede Szene bekommt ein eigenes, inhaltlich passendes Icon**
- Schriftgröße 46, Icon-Box 46 px, Icon 26 px — kompakt, nicht raumgreifend
- Header steht beim Szenenwechsel **sofort** (4 Frames Einstieg, `at={0}`); er zieht nicht nach

Alle Maße stammen aus `REEL_STYLE.header`. Reels setzen keine eigenen
Header-Größen.

### Die Überschrift trägt die Szenenaussage

Die Zwischenüberschrift benennt, worum es in **dieser** Szene geht — nicht das
Reel-Thema, keine Strukturmarke. Bei stummem Abspielen muss allein aus
Überschrift + Icon + Visual hervorgehen, was die Szene erklärt.

**Die Überschrift ist ein Aussagesatz oder eine Frage — nie nur ein Stichwort
und nie nur eine Zahl.**

Prüffrage: *Wenn jemand nur diese Zeile liest — weiß er dann, was die Szene
erklärt?*

| gut (Aussage) | schlecht | warum schlecht |
|---|---|---|
| `MEHRERE KONTEN WERDEN ADDIERT` | `60.000 € + 50.000 €` | reine Zahlen |
| `JEDE BANK SCHÜTZT SEPARAT` | `80.000 € + 80.000 €` | reine Zahlen |
| `GEMEINSCHAFTSKONTO WIRD GETEILT` | `GEMEINSCHAFTSKONTO` | Stichwort |
| `AKTIEN UND ETFs ZÄHLEN NICHT DAZU` | `AKTIEN & ETFs` | Stichwort |
| `JEDES KONTO EINZELN? FALSCH` | `EINLAGENSICHERUNG` | Reel-Thema |

Zahlen dürfen **in** der Überschrift stehen, nie allein. Länge 3–6 Wörter,
eine Zeile.

## 1a. Untertitel enden an der Szenengrenze

**In einer Szene erscheinen nur die Wörter, die in ihr gesprochen werden.**

Läuft eine Caption über den Szenenwechsel, steht die Aussage der nächsten Szene
schon im Bild, während noch die alte Grafik läuft — der Zuschauer liest die
Pointe, bevor die Szene sie zeigt.

Umsetzung:

- Untertitel **pro Szene** rendern, nicht durchgehend über die Komposition
- Wörter außerhalb des Szenenfensters mit `clipCaptionWords`
  (`src/lib/captions.ts`) wegschneiden
- Caption-Einheiten **innerhalb** des Fensters neu bilden
- Zeitstempel auf den Szenenstart normalisieren

```tsx
<Series.Sequence durationInFrames={scene.durationFrames}>
  {/* Visual */}
  <SceneCaptions
    words={alleWörter}
    startFrame={scene.startFrame}
    durationFrames={scene.durationFrames}
  />
</Series.Sequence>
```

Der Szenenschnitt selbst folgt weiterhin dem echten Wort-Timing. Eine Szene
wird nie gedehnt, damit ein Satz hineinpasst — stattdessen liegt der Schnitt
auf dem passenden Satz-/Phrasenanfang.

## 3. Hauptvisual-Zone tiefer und größer

Für 1080 × 1920:

- Header ungefähr ab Y = 118
- Hauptvisual ungefähr Y = 390–1560
- Untertitel ungefähr 285 px über dem unteren Rand
- zentrale Mechanismen und Einzelobjekte bevorzugt in der mittleren Bildschirmzone
- keine kleinen Animationen direkt unter dem Header
- zentrale Erklärung größer darstellen statt viel leeren Hintergrund zu lassen

Dafür steht `AnimationStage` aus `src/brand/components/ReelStage.tsx` bereit:
Der Wrapper zentriert eine Animation auf der Visualzone und skaliert sie
einheitlich hoch (`REEL_STYLE.visual.animationScale`), damit Grafiken den Raum
füllen statt klein und verloren zu wirken.

## 3a. Szenenübergänge — kurz halten

- Continuity-Schnitt von **3 Frames** (0,1 s), nicht länger
- Bildszenen steigen in **4 Frames** ein
- **kein Fade-to-black**
- Übergänge dürfen die audio-synchronisierten Startframes der Folgeszenen nie verschieben

Träge Blenden lassen ein Reel sofort langsam wirken. Zentrale Komponente:
`SceneTransition` aus `src/brand/components/ReelStage.tsx`; Werte aus
`REEL_STYLE.transition`. Der Validator blockiert Werte über 4 Frames.

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
