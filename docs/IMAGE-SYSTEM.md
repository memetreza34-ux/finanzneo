# FinanzNeo — verbindliches Bildsystem V9

Dieses Dokument gilt für neue FinanzNeo-Reels. Bei Widerspruch gilt `CLAUDE.md`; der maschinenlesbare Lock liegt in `config/finanzneo-image-world-lock.json`.

## Kanonische IDs

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9
GENERATED_IMAGE_ASPECT_RATIO: 1:1
```

Es gibt keinen aktiven V4/V7/V8-Physical-Explainer-Lock mehr. Neue Prompts verwenden ausschließlich V9.

## Ziel

Jedes Bild erklärt genau eine Aussage innerhalb ungefähr 1–2 Sekunden.

Die Bildwelt ist:

- klar **stylized 3D animated**, nicht realistisch
- soft rounded, vereinfacht und gut erkennbar
- hochwertig, sauber und leicht verspielt, aber nicht kindlich
- inhaltlich klarer als dekorativ
- über die Serie konsistent, ohne identische Kompositionen zu erzwingen

## Schwarzer Hintergrund — harte Pflicht

Jedes Google-Flow-Quellbild verwendet genau einen nahtlosen tiefschwarzen Hintergrund.

```text
Use one seamless deep black background.
Keep it clean, minimal and uninterrupted.
No bright studio background.
No floor-wall boundary.
No horizon line.
No colored background zones.
```

Das Motiv wird ausschließlich durch Licht, Material, Highlights und Schatten vom Schwarz getrennt. Keine grünen Hintergrundfelder, keine Aurora, kein Grid und keine dekorativen Hintergrundzonen.

## Komposition — keine Objektquote

Es gibt **keine feste Mindest- oder Höchstzahl** für Objekte.

- ein einziges starkes Hauptobjekt kann reichen
- Support-Objekte nur, wenn sie die Aussage verbessern
- keine Props zum Auffüllen
- klare Hauptaktion oder klare visuelle Gegenüberstellung
- lieber einfach und sofort verständlich als komplex und überladen

Damit sind alte Regeln wie `2–5`, `3–6`, `supportingObjectsMin` oder `supportingObjectsMax` für neue Reels ungültig.

## Farbrollen

- Deep Black = Hintergrund
- Emerald Green = positiv / bevorzugter Weg / Fokus
- Warm Ivory + Soft Gray = neutral
- Gold = Geld / Wert
- Warm Red-Orange = Warnung / Kosten / Verlust

## Licht und Material

- clean soft studio lighting
- klare Highlights
- lesbare Schatten
- gute Trennung vom schwarzen Hintergrund
- weiche Kontaktschatten
- sichtbare, aber einfache 3D-Materialität

Objekte dürfen lokale Materialverläufe und Schatten besitzen. Der **Hintergrund selbst** bleibt clean und schwarz.

## Marken und Logos

Wenn eine Marke, Bank, App oder ein Logo inhaltlich notwendig ist:

- erkennbar, aber in derselben stylized-3D-Welt interpretiert
- vereinfachte, abgerundete 3D-Formen
- gleiche Licht- und Materiallogik wie die restliche Szene

Verboten:

- flach aufgeklebtes Real-Logo
- Website-/App-Screenshot
- photorealistische Marken-UI
- fremder Screenshot als Bildbestandteil

## Text im KI-Bild

Erlaubt:

- nur ausdrücklich verlangte kurze deutsche Objektlabels
- kurze Zahlen/Preise, wenn sie für die Aussage nötig sind

Verboten:

- Headline
- Untertitel
- erklärender Satz
- CTA
- zufällige Zusatztexte
- schwebende UI-Badges

## Streng verboten

- Realismus / Photorealismus
- Produktfoto-/Stockfoto-Look
- Dashboard / App UI als Komposition
- Flowchart als Hauptkomposition
- kleine technische Kästen und dünne Connector-Linien
- floating Info-Cards / HUD
- Microchip-/Circuit-Board-Look
- Miniatur-Diorama
- unnötiger Clutter
- helle oder farbige Background-Welt

## Keine Bildreferenz-Abhängigkeit

Kein vorheriges Reel-Bild wird als Image-to-Image-Referenz benötigt. Konsistenz entsteht über denselben ausgeschriebenen V9-Lock, nicht durch Kopieren des Covers oder einer vorherigen Szene.

## Timing

- Bildbeat ideal 3,5–5,5 s
- absolut max. 6,0 s
- länger nötig: splitten oder animieren
- ungefähr 60 % Bild / 40 % Animation als Ziel, Qualität vor Quote

## Pflichtinhalt jedes Bildprompts

1. exakter finaler Dateiname
2. konkrete Bildaussage
3. Hauptmotiv/Hauptaktion
4. nur notwendige Support-Objekte
5. V9-Lock
6. deep-black Hintergrund
7. Farb-/Lichtlogik
8. erlaubte kurze Labels
9. kurze Forbidden-Liste
10. QA: Aussage in 1–2 Sekunden verständlich

Einzelprompts bleiben mittel-lang; die eigentliche Bildidee steht vor dem Regelblock.

## Google Flow — Strict Single Job

```text
GENAU EIN Bild erzeugen
→ vollständig warten
→ sofort exakt umbenennen
→ V9-QA
→ bei Fehler dieselbe Bildnummer neu
→ erst nach PASS nächstes Bild
```

Kein Batch, kein paralleles Queueing, kein späteres Sammel-Umbenennen und kein Nutzer-„weiter“.

## QA

Neu erzeugen, wenn:

- Hintergrund nicht tiefschwarz ist
- Bild realistisch/produktfotoartig wirkt
- Aussage nicht sofort verständlich ist
- unnötige Objekte oder Clutter auftauchen
- Dashboard/UI/Flowchart/Diorama entsteht
- Labels falsch sind
- Marken wie echte Screenshots/aufgeklebte Logos wirken

Technische Prüfung:

```bash
npm run validate:image-world
npm run reel:validate -- <Reel-Pfad>
```
