# Warum dein Notgroschen NICHT ins Depot gehört

Eigenständiges FinanzNeo-YouTube-Longform-Projekt nach V4. Ziel: ungefähr 2 Minuten, 1920×1080, 30 fps.

## Formatmix

- 8 Visual Beats
- 2 Google-Flow-Szenenbilder: visual-01 und visual-06
- 6 Remotion-/Data-Animationen: visual-02, visual-03, visual-04, visual-05, visual-07, visual-08
- keine Slideshow
- keine starre Bild-/Animationsquote
- Bilder im `finanzneo-youtube-animated-black-v3`-Look
- präzise Zahlen, Regeln und abstrakte Erklärbeats ausschließlich in Remotion

## Neue Bildlogik

Jeder Sprechbeat wird einzeln betrachtet. Ein Flow-Bild wird nur verwendet, wenn eine konkrete Alltagsszene die Aussage schneller erklärt als Remotion.

- visual-01: konkrete Alltagsszene — kaputte Waschmaschine
- visual-04: bewusst KEIN Flow-Bild mehr; der abstrakte Satz über die persönliche Lebenssituation wird als eigene Remotion-Erklärung umgesetzt
- visual-06: konkrete Handlung — Reparatur wird sofort bezahlt und der Schlüssel zurückgegeben

Die beiden Flow-Szenen haben eigene Scene Signatures für Ort, Kamera, Hauptmotiv, Handlung, Personen und Requisiten. Gleicher Look bedeutet nicht gleiche Szene.

## Google Flow

Der Nutzer kopiert nur:

`04-visuals/alle-bildprompts.txt`

Zuerst werden Thumbnail A/B/C als drei getrennte Bildjobs parallel erzeugt. Nach einmaliger Auswahl folgen nur die zwei wirklich benötigten Szenenbilder als getrennte Jobs im selben Batch. Alle Ergebnisse landen exakt benannt in `04-visuals/00-ALLE-BILDER-HIER-REIN/`.

## Phase 2

Noch erforderlich:
- gewähltes Thumbnail
- zwei finale Flow-Szenenbilder
- genau ein finales Voiceover
- echte Wort-Zeitstempel

Danach darf `youtube:ready` Phase 3 freigeben.
