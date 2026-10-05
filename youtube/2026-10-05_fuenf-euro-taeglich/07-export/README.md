# EXPORT — HIER IST AM ENDE ALLES FERTIG

Dieser Ordner ist die einzige Stelle, die nach Phase 3 für den Upload wichtig ist.

```text
07-export/
├── 01-video-und-cover/
│   ├── final-video.mp4
│   └── cover.png
├── 02-youtube/
│   ├── titel.txt
│   └── beschreibung.txt
└── 03-untertitel/
    ├── script-mit-zeitstempeln.txt
    └── untertitel.srt
```

## Regel für Phase 3

- `final-video.mp4` = fertig gerendertes 1920×1080-YouTube-Video.
- `cover.png` = das vom Nutzer gewählte finale Thumbnail.
- `titel.txt` und `beschreibung.txt` = die finalen Upload-Texte.
- `script-mit-zeitstempeln.txt` = das komplette gesprochene Skript in lesbaren Zeitblöcken wie `00:00–00:10`.
- `untertitel.srt` = dieselben finalen Untertitel im normalen SRT-Format.
- Die aktuell eingetragenen Zeiten sind nur Phase-1-Schätzwerte. Sobald das finale Voiceover und echte `word-timings.json` vorhanden sind, MUSS Phase 3 beide Untertiteldateien daraus neu erzeugen und die Schätzwerte ersetzen.
