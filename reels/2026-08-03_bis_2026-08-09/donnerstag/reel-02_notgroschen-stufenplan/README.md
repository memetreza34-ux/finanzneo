# Notgroschen in drei Stufen

Die Reel-Struktur ist bewusst einfach gehalten.

```text
reel-02_notgroschen-stufenplan/
├── 01-script/
│   └── script-fliess-text.txt
├── 02-audio/
│   └── README.md + später genau eine finale Audiodatei
├── 03-szenen/
│   ├── alle-bildprompts.txt
│   ├── 00-cover/
│   ├── 00-ALLE-BILDER-HIER-REIN/
│   ├── EINZELNE-SZENEN/
│   ├── bildwelt.txt
│   └── scene-index.json
├── 04-caption/
│   ├── caption.txt
│   └── word-timings.json
└── 05-projektdateien/
    ├── animationen.md
    ├── szenenplan.md
    ├── recherche-quellen.md
    ├── technische-hinweise.md
    └── timeline.json
```

## Dein Ablauf

1. `01-script/script-fliess-text.txt` öffnen und daraus das Voiceover erzeugen.
2. Die fertige Audiodatei in `02-audio/` legen.
3. `03-szenen/alle-bildprompts.txt` an Google Flow geben.
4. Google Flow erzeugt immer nur ein Bild, benennt es sofort korrekt um und macht erst danach das nächste Bild.
5. Animationsszenen bekommen kein Bild; ihre Szenennummer bleibt reserviert.
6. Wenn alle Bilder fertig sind, legt Google Flow alle gemeinsam in `03-szenen/00-ALLE-BILDER-HIER-REIN/`.
7. `04-caption/caption.txt` ist die **eine universelle Social-Caption** für Instagram Reels, TikTok, Facebook Reels und Snapchat. Sie wird überall unverändert genutzt: starke ehrliche Hook-Zeile, kurzer Nutzen/Aha, natürlicher CTA wenn passend und genau 5 relevante Hashtags.
8. `04-caption/word-timings.json` enthält ausschließlich die echten Wort-Zeitstempel für die Video-Untertitel.
9. `05-projektdateien/` ist für Animationen, Recherche und technische Umsetzung.

## Reel
- 1080 × 1920
- 30 fps
- ca. 60 Sekunden
- 10 Szenen
- 6 Bildszenen
- 4 Remotion-Animationen
- keine Musik und keine SFX

Bildszenen: 01, 02, 04, 06, 09, 10.  
Animationsszenen: 03, 05, 07, 08.
