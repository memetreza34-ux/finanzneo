# Bildprompts – Warum dein Gehalt sofort kleiner wird

## Einheitliche Figur

In allen Bildszenen dieselbe generische fiktive Person verwenden:

- junger erwachsener Charakter
- kurze dunkle Haare
- anthrazitfarbene Jacke
- gedeckt beige Hose
- schlichte dunkle Schuhe
- neutrale, vereinfachte Gesichtszüge
- keine Ähnlichkeit mit realen Personen

## Erforderliche Bilder

| Szene | Datei | Kernaussage | Promptdatei |
|---|---|---|---|
| 01 Hook | `images/scene-01-hook.png` | Das Gehalt wird schon vor dem ersten bewussten Kauf abgezogen. | `prompts/scene-01-hook.txt` |
| 02 Fixkosten | `images/scene-02-fixed-costs.png` | Miete, Strom, Versicherung und Verträge greifen gleichzeitig zu. | `prompts/scene-02-fixed-costs.txt` |
| 04 Alltag | `images/scene-04-everyday-spending.png` | Viele kleine Alltagskäufe leeren gemeinsam den Rest. | `prompts/scene-04-everyday-spending.txt` |
| 05 Abos | `images/scene-05-subscriptions.png` | Wiederkehrende Abbuchungen ziehen unbemerkt Geld ab. | `prompts/scene-05-subscriptions.txt` |
| 07 Payoff | `images/scene-07-payoff.png` | Vier klar getrennte Geldziele schaffen Kontrolle. | `prompts/scene-07-payoff.txt` |

## Generierungsregeln

1. Jedes Bild vertikal im Format 9:16 erzeugen, idealerweise 1080 × 1920 oder höher.
2. Keine Texte, Zahlen, Marken, Logos oder Wasserzeichen in den Bildern erzeugen.
3. Hauptmotiv muss auf dem Smartphone sofort erkennbar sein.
4. Die oberen Bereiche für spätere Remotion-Überschriften freihalten.
5. Die unteren 330 Pixel möglichst ruhig halten, da dort die Wortuntertitel liegen.
6. Keine Dashboard-Karten, schwebenden Icons oder flachen Infografiken verwenden.
7. Die wiederkehrende Figur, Materialien, Beleuchtung und Farbwelt über alle fünf Bilder konsistent halten.
8. Jedes Bild nach der Generierung einzeln kontrollieren. Ein schönes, aber inhaltlich falsches Bild wird neu erzeugt.

## Übergabe an Codex

Die finalen PNG-Dateien exakt unter `02-bilder/images/` mit den oben genannten Dateinamen ablegen. Danach das Voiceover unter `01-script-audio/audio/voiceover-final.wav` speichern. Erst anschließend darf `assetsSuppliedByUser` im Codex-Paket auf `true` gesetzt werden.
