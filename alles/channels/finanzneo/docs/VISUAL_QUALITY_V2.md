# FinanzNeo Visual Quality V2

Dieses Profil gilt für alle FinanzNeo-Reels, die nach dem ETF-Testreel geplant werden.

## Szenenverteilung

Zielverteilung:

```text
60 % Bildszenen
40 % Remotion-Animationsszenen
```

Wegen ganzzahliger Szenen gilt der erlaubte Bereich:

```text
55–65 % Bilder
35–45 % Animationen
```

Zulässige Standardverteilungen:

| Szenen | Bilder | Animationen |
|---:|---:|---:|
| 5 | 3 | 2 |
| 7 | 4 | 3 |
| 8 | 5 | 3 |
| 9 | 5 | 4 |

Bevorzugter Produktionsstandard: **9 Szenen = 5 Prozessbilder + 4 hochwertige Animationen**. Damit passen die neuen Reels zugleich zum bestehenden 60–75-Sekunden- und 9–14-Beat-System.

Eine Animation wird nur verwendet, wenn sie einen Ablauf, eine Transformation, Ursache-Wirkung oder einen Zustandswechsel besser erklärt als ein Standbild. Schwache Animationen werden nicht ergänzt, nur um die Quote zu erreichen.

## Prozessbilder

Jede Bildszene muss wie eine eingefrorene Prozessanimation funktionieren und im Paket drei getrennte Angaben besitzen:

1. `startState` — sichtbare Ausgangslage,
2. `processPath` — Richtung, Verbindung oder Handlung,
3. `resultState` — sichtbares Ergebnis.

Zusätzliche Regeln:

- Kernaussage innerhalb ungefähr einer Sekunde erfassbar.
- Große Hauptobjekte statt vieler kleiner Dekorationen.
- Ursache und Ergebnis räumlich eindeutig verbunden.
- Pfeile, Schienen, Leitungen, Übergaben oder mechanische Verbindungen nur dann, wenn sie inhaltlich helfen.
- Keine Figur, die nur dekorativ neben einem Finanzobjekt steht.
- Keine wiederholten transparenten Miniaturkästen als Standardmotiv.
- Keine winzigen Beschriftungen im generierten Bild.
- Remotion ergänzt nur kontrollierten Zoom, Bildfahrt, Überschrift, Icon und Captions.

## Überschriftensystem

Alle zukünftigen Compositions verwenden:

```text
alles/channels/finanzneo/src/reels/shared/FinanzNeoSceneHeader.tsx
```

Profilname:

```text
finanzneo-scene-header-v2
```

Verbindlich:

- Hauptüberschrift mindestens 72 px, Standard 78 px.
- maximal zwei Zeilen.
- sehr helle Schrift (`#F7FAF5` oder vergleichbar).
- passendes Szenen-Icon mit 56–72 px sichtbarer Größe.
- weicher dunkler Verlauf im oberen Bildbereich.
- deutlicher Textschatten für wechselnde Bildhintergründe.
- Kicker in hellem Grün oder Mint.
- niemals schwarze oder dunkelgraue Hauptschrift auf dunklem Hintergrund.
- keine harte schwarze Rechteckbox hinter der Überschrift.

## Animationen

Jede Animation benötigt:

- eigenen Startzustand,
- sichtbare Handlung,
- eigenen Endzustand,
- andere Raum- oder Bewegungslogik als die übrigen Animationen,
- relative Phasen anhand der endgültigen transkriptbasierten Szenendauer.

Nicht zulässig:

- Dashboard-Karte als Haupthandlung,
- Balken oder Zähler als einzige Bewegung,
- statische Vergleichsgrafik ohne Zustandsänderung,
- wiederverwendete Animation mit nur ausgetauschtem Text.

## Qualitätsprofil im Paket

Neue `codex-reel-package.json`-Dateien setzen:

```json
{
  "creativeRules": {
    "visualQualityProfile": "finanzneo-process-v2",
    "targetImageShare": 0.6,
    "targetAnimationShare": 0.4,
    "minimumAnimationShare": 0.35,
    "maximumAnimationShare": 0.45,
    "maximumAnimationScenes": 4
  }
}
```

Das bestehende ETF-Testreel bleibt aus Kompatibilitätsgründen im bisherigen Profil. Die neuen Regeln werden bei zukünftigen V2-Reels automatisch geprüft.
