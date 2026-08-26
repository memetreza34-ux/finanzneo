# FinanzNeo — Caption, Scene Header, Timing & Motion V5

Verbindlicher Qualitätsstandard für neue Reel-Produktionen. Technische Quelle für Positionen und Größen ist `REEL_STYLE` in `src/brand/tokens.ts`.

## 1. Premium-Untertitel

Auf dunklen FinanzNeo-Reel-Hintergründen:

- aktives gesprochenes Wort: helles FinanzNeo-Grün
- restliche Wörter: Weiß
- kein Gelb/Gold als Karaoke-Active-Word
- kein schwarzer Untertiteltext
- maximal zwei Zeilen
- kurze satz-/phrasenbasierte Einheiten
- kein Word-Jump
- keine Größenanimation / kein Scale-Pop
- kein `WebkitTextStroke`
- dunkle halbdeckende Caption-Backplate
- weicher Tiefenschatten statt harter Kontur
- Schriftstärke 800
- Standardgröße 50 px; nie unter 40 px
- `letterSpacing: 0`
- **V5-Standardposition: 340 px über dem unteren Rand**
- links 72 px, rechts 140 px
- kurze Pausen halten die vorherige Caption sichtbar
- keine Caption-Lücken

Technische Standardkomponente: `src/brand/components/Captions.tsx`.

### Untertitel enden an der Szenengrenze

In einer Szene erscheinen ausschließlich Wörter, die in dieser Szene gesprochen werden. Kein Wort der nächsten Szene darf vorher sichtbar sein.

- Captions pro Szene rendern
- Wörter mit `clipCaptionWords` auf das Szenenfenster begrenzen
- Caption-Einheiten innerhalb des Szenenfensters bilden
- Zeitstempel auf Szenenstart normalisieren

## 2. Scene Header V5 — normale Typografie

Jede Bild- und Animationsszene benötigt eine kurze Überschrift mit einem passenden Linien-Icon.

Standard:

```tsx
<SceneHeader title="Lokale Währung ist oft günstiger" icon="repeat" />
```

Regeln:

- mittig zentriert
- **top = 154**
- normale Schreibweise / Sentence Case
- Text neutral weiß
- einfaches Icon links neben dem Text
- semantische Farbe primär über das Icon
- Default/positiv: Grün
- Warning: Rot
- Money: Gold
- Neutral: Weiß
- 3–6 Wörter als Richtwert
- Aussage oder Frage, nie nur Stichwort/Zahl
- jede Szene bekommt ein inhaltlich passendes Icon

Streng verboten:

- automatische ALL-CAPS-Transformation
- Capsule
- Chip
- Pill
- Panel/Box um den Header
- UI-/Dashboard-Optik

Die Überschrift trägt die Szenenaussage, nicht das Reel-Thema und keine Strukturmarke.

Beispiele:

| gut | schlecht |
|---|---|
| `Mehrere Konten werden addiert` | `60.000 € + 50.000 €` |
| `Jede Bank schützt separat` | `80.000 € + 80.000 €` |
| `Das Gemeinschaftskonto wird geteilt` | `GEMEINSCHAFTSKONTO` |
| `Aktien und ETFs zählen nicht dazu` | `AKTIEN & ETFs` |

## 3. V5-Vertikallayout

Für 1080 × 1920:

```text
Header               Y = 154
Visual                Y = 320–1480
Caption               bottom = 340
Transition            3 Frames
```

Ziel:

- oben mehr ruhige Luft
- Header etwas tiefer
- Header und Visual näher zusammen
- Bilder und Animationen höher
- Untertitel höher
- unten wieder mehr ruhige Luft

`AnimationStage` nutzt dieselbe Visualzone wie Bildszenen. Animationen dürfen nicht klein und verloren in der Mitte stehen.

## 4. Szenenübergänge

- Continuity-Schnitt: **3 Frames**
- Bildszenen-Einstieg: 4 Frames
- kein Fade-to-black
- keine zufällig wechselnden Transition-Stile
- Übergang darf den audio-synchronisierten Szenenstart nicht verschieben

Zentrale Komponente: `SceneTransition` aus `src/brand/components/ReelStage.tsx`.

## 5. Animationsfarben

- Weiß = neutrale Information
- Grün = Fokus, Lösung, korrekt, geschützt
- Rot = Problem, Warnung, Verlust
- Gold = Geldbetrag, Summe, finanzieller Wert
- Schwarz = auf dunklen Reel-Flächen verboten

Quelle: `ANIMATION_COLORS` in `src/brand/tokens.ts`.

## 6. Animationssprache und Verantwortungsgrenze

Phase 1 liefert für jede Animationsszene bereits den **finalen produktionsreifen `animation.tsx`-Code**. Phase 3 darf keine Ersatzanimation erfinden.

Detailstandard: `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`.

Jede Animation:

```text
STARTZUSTAND
→ SICHTBARE VERÄNDERUNG / MECHANISMUS
→ EINDEUTIGES ERGEBNIS
→ Ergebnis mindestens 15 Frames stabil
```

Pflicht im Code:

- `useCurrentFrame`
- `AnimationStage`
- `ANIMATION_COLORS`
- `prog`, `interpolate` oder `spring`
- `ANIMATION_NARRATIVE` mit START / MECHANISM / RESULT
- `RESULT_HOLD_FRAMES >= 15`

Nicht ausreichend:

- reine Zooms/Fades/Zahlen-Popups
- generische Cards + Text
- dekorative Bewegung ohne Erklärung
- Debug-Boxen/Testflächen
- künstliches Dauerwackeln
- `Math.sin`/`Math.cos` nur um Frame-Diff zu erzeugen

Bei `reel:ready` werden die Phase-1-Animationsquellen per SHA-256 versiegelt. Phase 3 muss direkt diese Dateien verwenden.

## 7. Audio-Synchronität

Das finale Voiceover ist Timing-Autorität.

```text
finales Voiceover
→ echte Wort-Timings
→ Satz-/Phrasenanfang je Beat
→ exakter Szenenstart
→ Animation relativ zur echten Beatdauer
```

- keine gleichmäßig verteilten Szenen
- Bildbeat ideal 3,5–5,5 Sekunden
- Bildbeat absolut maximal 6 Sekunden
- länger = splitten oder animieren

## 8. Renderqualität

Finale Reels:

- 1080 × 1920
- H.264
- CRF 14
- PNG-Zwischenframes
- AAC 320k
- `yuv420p`

## 9. Mobil-QA

Vor Freigabe komplette MP4 ansehen:

1. Header ist normal, ruhig und nicht als Capsule/Chip gestaltet.
2. Header sitzt bei Y154 und ist optisch nah am Visual.
3. Visuals/Animationen nutzen Y320–1480 und sitzen sichtbar höher.
4. Captions sitzen bei bottom340 und sind crisp lesbar.
5. Bildwechsel trifft die gesprochene Aussage.
6. Animationen wirken wie dieselbe Serie und erklären die Aussage ohne Ton.
7. Keine Debug-/Wackel-/Placeholder-Animationen.
8. Übergänge bleiben 3 Frames kurz.
9. Keine schwarzen Texte auf dunklem Hintergrund.
10. Phase-3-Code ersetzt keine versiegelte Phase-1-Animation.
