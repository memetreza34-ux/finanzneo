# FinanzNeo Image World Consistency Test V1

`IMAGE_WORLD_CONSISTENCY_TEST: finanzneo-image-world-consistency-v1`

## Ziel

Dieser Test prüft **nur die Bildwelt**. Noch keine Remotion-Animation, kein Audio und kein komplettes Reel.

Wir erzeugen fünf bewusst sehr unterschiedliche Finanzmotive in Google Flow. Trotzdem müssen alle fünf Bilder auf den ersten Blick so wirken, als kämen sie aus **derselben FinanzNeo-Welt**.

Kanonische Basis bleibt:

`config/finanzneo-image-worlds/finanzneo-stylized-3d-animated-black-v9.txt`

## Wichtigste Testregel

Jeder Prompt besteht aus zwei Teilen:

1. individuelle Szenenbeschreibung
2. **wortgleich identischer** `FINANZNEO_SHARED_STYLE_LOCK_V1`

Der gemeinsame Stilblock darf zwischen den fünf Prompts nicht umformuliert, gekürzt oder erweitert werden. Ein automatischer Test prüft das im Repo.

## Die fünf Motive

| Nr. | Prompt | Was wird getestet? |
| --- | --- | --- |
| 01 | `prompts/01-notgroschen-waschmaschine.txt` | Haushalt, Defekt, Rechnung, Reserve |
| 02 | `prompts/02-inflation-einkauf.txt` | Lebensmittel, Preisdruck, Kaufkraft |
| 03 | `prompts/03-kredit-zins-tilgung.txt` | Vertrag, Monatsrate, Zins vs. Tilgung |
| 04 | `prompts/04-versicherung-wasserschaden.txt` | Wohnungsschaden, Vertrag, Absicherung |
| 05 | `prompts/05-etf-diversifikation.txt` | Investieren, mehrere Unternehmensbereiche, Streuung |

Die Motive dürfen **nicht** dieselben Objekte wiederverwenden, nur um Konsistenz zu erzeugen. Konsistenz soll aus Rendering, Materialien, Licht, Farbgrammatik, Proportionen und Bildsprache entstehen.

## Google-Flow-Ablauf

Strikt einzeln erzeugen:

```text
01 generieren
→ Ergebnis prüfen
→ umbenennen
→ erst dann 02
→ Ergebnis prüfen
→ umbenennen
→ erst dann 03
→ ...
```

Nicht alle fünf gleichzeitig generieren und nicht promptübergreifend Motive aus einem vorherigen Bild kopieren.

Empfohlene Dateinamen:

```text
01-notgroschen-waschmaschine.png
02-inflation-einkauf.png
03-kredit-zins-tilgung.png
04-versicherung-wasserschaden.png
05-etf-diversifikation.png
```

## Bewertungscheck nach allen fünf Bildern

Jedes Bild einzeln mit 0–2 Punkten bewerten:

- **Stiltreue:** klar stylized 3D, nicht fotorealistisch
- **Schwarze Welt:** nahtloser tiefer schwarzer Hintergrund
- **Materialsprache:** vergleichbare matte/premium Materialien
- **Licht:** gleiche weiche hochwertige Studiologik
- **Farbgrammatik:** Grün positiv, Rot-Orange Problem/Kosten, Gold nur Wert/Geld
- **Objektmaßstab:** Hauptmotiv groß, kein Mini-Diorama
- **Verständlichkeit:** Aussage in 1–2 Sekunden erfassbar
- **Realweltbezug:** konkrete Situation statt Symbolsammlung
- **Textdisziplin:** nur kurze funktionale deutsche Objektlabels
- **Seriengefühl:** wirkt zusammen mit den anderen wie derselbe Kanal

Maximal: **20 Punkte pro Bild**.

### Bestehen

- kein Bild unter **16/20**
- `Seriengefühl` bei jedem Bild mindestens **2/2**
- kein Bild darf fotorealistisch, flach-infografisch oder generisch-stockartig wirken

## Was wir nach diesem Test entscheiden

Erst wenn die fünf Bilder zusammenpassen, gehen wir zu Schritt 2:

**Bild + Remotion Hybrid-Test.**

Bis dahin wird an diesen Testbildern keine Animation gebaut.
