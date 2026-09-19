# FLOW-ZIP HIER REIN

Die von Google Flow heruntergeladene ZIP-Datei hier ablegen. Danach:

```bash
npm run youtube:images:import -- ${targetArg}
```

Der Import entpackt die ZIP, prueft jeden Dateinamen gegen visual-index.json und legt die geprueften Bilder in die Bilder-Inbox.
