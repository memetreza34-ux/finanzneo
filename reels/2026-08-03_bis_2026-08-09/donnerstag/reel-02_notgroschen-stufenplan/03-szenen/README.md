# 03-szenen

Hier liegt alles, was zu Cover, Bildszenen und Szenenplanung gehört.

## Wichtig für Google Flow

Öffne zuerst `alle-bildprompts.txt`.

Google Flow arbeitet immer:

```text
1 Bild erzeugen
→ sofort umbenennen
→ Motiv + Labels + Gesicht + EINEN nahtlosen Hintergrund prüfen
→ erst dann nächstes Bild
```

Cover = `Bild 00`.
Danach entspricht die Bildnummer immer der echten Szenennummer.
Animationsszenen bekommen kein Bild; ihre Nummer bleibt trotzdem reserviert.

Beispiel:
- Szene 01 = Bild → `Bild 01`
- Szene 02 = Animation → kein `Bild 02`
- Szene 03 = Bild → `Bild 03`

## Kritische Bildregel

- EIN durchgehender deep-charcoal-green-black Hintergrund von oben bis unten
- keine Prozent-Zonen
- keine horizontalen Bänder
- keine Boden-Wand-Grenze
- kein Horizont
- keine separaten Panels
- freie Fläche oberhalb/unterhalb nur natürlich, ohne Hintergrundwechsel
- Person immer mit sichtbarem Gesicht, falls eine Person vorkommt
- nur kurze deutsche Objektlabels
- keine große Headline, Untertitel oder erklärenden Sätze im KI-Bild

Erst wenn alle benötigten Bilder vollständig fertig und korrekt benannt sind, legt Google Flow alle gemeinsam in:
`00-ALLE-BILDER-HIER-REIN/`

## Inhalt dieses Ordners
- `alle-bildprompts.txt` = alle Google-Flow-Prompts in chronologischer Reihenfolge
- `00-cover/` = Cover-Prompt
- `00-ALLE-BILDER-HIER-REIN/` = gemeinsamer finaler Ablageordner für alle fertigen Nutzerbilder
- `EINZELNE-SZENEN/` = technische Einzelordner für Szene 01 bis 10
- `bildwelt.txt` = gemeinsame FinanzNeo-Bildwelt
- `scene-index.json` = technische Szenenzuordnung

Bildszenen: `01`, `02`, `04`, `06`, `09`, `10`.
Remotion-Szenen: `03`, `05`, `07`, `08`.
