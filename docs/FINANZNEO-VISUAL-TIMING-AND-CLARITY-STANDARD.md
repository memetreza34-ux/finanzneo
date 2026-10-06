# FinanzNeo — Visual Timing & Style Standard V9

## Zweck

Dieses Dokument regelt nur Timing und die visuelle V9-Identität. Es schreibt **keine globale Bildidee, Motivlogik oder Promptstruktur** mehr vor.

## Verhältnis Bild / Animation

- Ziel ungefähr **60 % Google-Flow-Bildbeats / 40 % native Remotion-Animationsbeats**.
- Qualität steht über der Quote.
- Szenenanzahl wird aus Voiceover-Länge und Aussage abgeleitet.
- Ein Visual wird nie künstlich verlängert, nur um eine Quote oder feste Szenenzahl zu erfüllen.

## Timing

### Bildbeats

- ideal: **3,5–5,5 Sekunden**
- absolutes Maximum: **6,0 Sekunden**
- längere unveränderte Holds vermeiden

### Animationsbeats

- ideal: **4,5–7,0 Sekunden**
- Animation braucht sichtbare Entwicklung über die Zeit

## Verbindliche Bildwelt

```text
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9
```

Visuell bleiben:

- premium stylized 3D animated
- klar nicht fotorealistisch
- soft rounded / vereinfachte erkennbare Formen
- clean, hochwertige Materialien
- nahtloser tiefer schwarzer Hintergrund
- Emerald / Ivory / Soft Gray / Gold / Red-Orange
- sauberes weiches Studio-Licht
- konsistente Rendering-Sprache

## Kreative Bildprompt-Regeln

Die frühere globale Promptlogik ist entfernt. Dieses Dokument verlangt **nicht**:

- reale Alltagsszene
- Literal-first
- Ursache/Wirkung im selben Bild
- feste Objektanzahl
- Pflicht-Labels
- bestimmte Metaphern
- Transferability-Test
- bestimmte Prompt-Länge
- eine feste Komposition

Maßgeblich ist `docs/IMAGE-PROMPT-BASELINE.md`.

Keine Überschrift automatisch in das generierte Bild setzen. Andere Textelemente sind nur szenenspezifisch, wenn sie ausdrücklich geplant werden.

## Animationen

Native Remotion-Animationen folgen weiterhin der V9-Sprache:

- zentraler Reel-Canvas statisch `#000000`
- `PremiumPhysicalStage` transparent
- keine Partikel, Aurora, Grid, Vignette oder dekorative Background-Bewegung
- Bewegung erklärt die Aussage
- Background-Motion zählt niemals als Erkläranimation

## QA vor Freigabe

1. Ist der V9-Rendering-Look erkennbar?
2. Bleibt der Flow-Hintergrund im aktiven Bildwelt-Lock?
3. Bleibt der Bildbeat innerhalb der Timing-Grenzen?
4. Zeigt jede Animation echte sichtbare Entwicklung?
5. Bleibt der Remotion-Hintergrund statisch schwarz?

Die inhaltliche Bildidee wird nicht mehr durch eine globale Promptformel validiert.
