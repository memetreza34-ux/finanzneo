# Reels

Hier liegen ausschließlich die fertigen FinanzNeo-Reel-Projekte.

Pfad:

`reels/<Wochenordner>/<Wochentag>/<Reel-Ordner>/`

Jedes Reel enthält `00-cover`, `01-voice-script`, `02-audio`, `03-szenen`, `04-caption`, `05-review`, `06-video`, `render` und `timeline`.

## Verbindlicher Szenenvertrag

- Bildszene: `bildprompt.txt`, `szene.md` und genau ein Bild beziehungsweise `placeholder.svg`.
- Remotion-Szene: `remotion.md` und `szene.md`.
- `motionprompt.txt` und `alle-motionprompts.txt` sind verboten.
- Eine Szene darf niemals gleichzeitig `bildprompt.txt` und `remotion.md` enthalten.
- Zoom, Pan und andere einfache Bewegungen von Standbildern werden zentral im Remotion-Code definiert.

Vollständige Regeln: `reels/PRODUKTIONSSTANDARD.md`

Neues Reel erzeugen:

```bash
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"
```

Reel prüfen:

```bash
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
```
