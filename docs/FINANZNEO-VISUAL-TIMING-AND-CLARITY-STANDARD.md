# FinanzNeo — Visual Timing & Clarity Standard V9

## Ziel

FinanzNeo-Reels sollen schnell verständlich, hochwertig und dynamisch sein. Zuschauer dürfen nicht erst interpretieren müssen, was ein Visual bedeutet.

## Verhältnis Bild / Animation

- Ziel ungefähr **60 % Google-Flow-Bildbeats / 40 % native Remotion-Animationsbeats**.
- Qualität und Verständlichkeit stehen über der Quote.
- Szenenanzahl wird aus Voiceover-Länge und Aussage abgeleitet.
- Ein Visual wird nie künstlich verlängert, nur um eine Quote oder feste Szenenzahl zu erfüllen.

## Harte Timing-Regeln

### Bildbeats

- ideal: **3,5–5,5 Sekunden**
- absolutes Maximum: **6,0 Sekunden**
- braucht dieselbe Aussage länger: splitten oder animieren

### Animationsbeats

- ideal: **4,5–7,0 Sekunden**
- Animation braucht einen echten Mechanismus:

```text
START → SICHTBARE VERÄNDERUNG → ERGEBNIS
```

## 2-Sekunden-Klarheitsregel

Jeder Bildbeat muss innerhalb ungefähr 1–2 Sekunden verständlich sein.

Pflicht:

- genau eine Hauptaussage oder Hauptaktion
- klar lesbares Hauptmotiv
- Support-Objekte nur, wenn sie die Aussage verbessern
- kurze Labels/Zahlen nur, wenn sie wirklich helfen

Es gibt **keine feste Objektanzahl**. Ein einzelnes starkes Objekt kann besser sein als fünf erklärende Props.

Nicht zulässig:

- Interpretationsbilder ohne klare Aussage
- tote Produktstillleben
- unnötiger Clutter
- Motive, die erst durch lange Voiceover-Erklärung verständlich werden

## Verbindliche Bildwelt

```text
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9
```

Jedes Flow-Bild:

- klar nicht realistisch / nicht photorealistisch
- stylized 3D animated
- soft rounded geometry
- vereinfachte erkennbare Details
- clean materials
- premium und leicht verspielt, nicht kindlich
- Inhalt und Klarheit vor Dekoration

## Deep Black — Pflicht

Der Hintergrund jedes Flow-Bildes ist ein nahtloser, sauberer, tiefschwarzer Hintergrund.

Verboten:

- heller Studiohintergrund
- Boden-Wand-Grenze
- Horizont
- farbige Background-Zonen
- Aurora-/Glow-Feld als Background
- Grid-/Partikel-Hintergrund

Das Motiv trennt sich durch sauberes Studio-Licht, Highlights, Schatten und Material vom Schwarz.

## Farbrollen

- Emerald Green = Fokus / positiv / bevorzugt
- Warm Ivory + Soft Gray = neutral
- Gold = Geld / Wert
- Warm Red-Orange = Warnung / Kosten / Verlust
- Deep Black = Hintergrund

## Alltagsobjekte

Alltagsgegenstände sind sinnvoll, wenn sie die Aussage direkt verständlich machen, z. B. Karte, Terminal, Quittung, Geldbörse, Lupe, Münzen, Smartphone oder Bank-Symbol.

Sie sind **Optionen, keine Pflichtliste**. Keine Props nur zum Auffüllen.

## Marken / Logos

Wenn inhaltlich relevant: erkennbar, aber stilisiert in derselben 3D-Welt. Kein Real-Logo als flacher Sticker, kein Website-/App-Screenshot und keine photorealistische Marken-UI.

## Text im Bild

Erlaubt:

- wenige kurze deutsche Labels
- notwendige Zahlen/Preise

Verboten:

- ganze Sätze
- Untertitel
- CTA
- große Headline
- zufällige Zusatztexte

## Animationen

Native Remotion-Animationen folgen derselben V9-Sprache:

- zentraler Reel-Canvas statisch `#000000`
- `PremiumPhysicalStage` transparent
- keine Partikel, Aurora, Grid, Vignette oder dekorative Background-Bewegung
- mindestens ein echtes sichtbares Hauptobjekt
- keine feste Support-Objekt-Anzahl
- Bewegung erklärt die Aussage
- Background-Motion zählt niemals als Erkläranimation

## QA vor Freigabe

1. Ist die Aussage in 1–2 Sekunden verständlich?
2. Ist das Visual klar stylized 3D statt realistisch?
3. Ist der Hintergrund tiefschwarz und clean?
4. Sind nur notwendige Objekte vorhanden?
5. Sind Labels kurz und korrekt?
6. Ist kein Dashboard/UI/Flowchart/Diorama/Clutter entstanden?
7. Bleibt ein Bildbeat unter 6 Sekunden?
8. Zeigt jede Animation Start → Mechanismus → Ergebnis?
9. Bleibt der Remotion-Hintergrund statisch schwarz?
10. Ist die Animation ohne Ton grundsätzlich verständlich?

Wenn eine Antwort `nein` ist: Visual neu planen oder korrigieren.
