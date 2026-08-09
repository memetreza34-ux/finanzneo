# Bilder – Google Flow

Vollständige Prompts: `alle-bildprompts.txt`
Animationsplan: `animationen.md`

## Google Flow arbeitet immer einzeln

1. Prompt für das nächste benötigte Bild lesen.
2. GENAU EIN Bild erzeugen.
3. Sofort mit dem direkt beim Prompt angegebenen endgültigen Dateinamen umbenennen.
4. Bild und Dateiname prüfen.
5. Erst danach das nächste Bild erzeugen.

Animationsszenen werden übersprungen, aber ihre Nummer bleibt reserviert.

Beispiel:
- Szene 01 Bild → `Bild 01`
- Szene 02 Animation → kein `Bild 02`
- Szene 03 Bild → `Bild 03`

Das zweite tatsächlich erzeugte Szenenbild kann also `Bild 03` heißen.

## Ganz am Ende

Erst wenn ALLE Bilder vollständig erzeugt, endgültig benannt und geprüft sind, legt Google Flow sie gemeinsam in:

`00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

Google Flow verteilt die Bilder nicht auf einzelne Szenenordner.
