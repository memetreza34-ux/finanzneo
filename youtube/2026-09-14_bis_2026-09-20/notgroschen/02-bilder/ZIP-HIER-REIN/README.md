# FLOW-ZIP HIER REIN

Die von Google Flow heruntergeladene ZIP-Datei hier ablegen. Danach:

```bash
npm run youtube:images:import -- youtube/2026-09-14_bis_2026-09-20/notgroschen
```

Der Import entpackt die ZIP, prüft jeden Dateinamen gegen `04-projekt/visual-index.json`
und legt nur geprüfte Bilder in `02-bilder/00-ALLE-BILDER-HIER-REIN/`.

Gemeldet werden gesammelt:

- fehlende Bilder → unter derselben Bildnummer neu erzeugen
- falsch benannte Bilder → exakt umbenennen

Die ZIP darf liegen bleiben, sie wird nicht gelöscht.
