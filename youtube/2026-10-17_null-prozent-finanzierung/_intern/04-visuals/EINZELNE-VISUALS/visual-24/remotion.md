# Remotion-Spezifikation visual-24

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 3 — Vier Fallen
- Sprechtext-Bezug: Kreditrahmen: 0 % nur für den ersten Kauf, alles danach kostet Zinsen — oft mehr als beim Dispo.
- Inhaltlicher Brief (Phase 1 Content): Ein Kreditrahmen als langer leerer Balken (z. B. „Kreditrahmen“). Der erste Kauf „Fernseher“ füllt ein Stück, Label „0 %“. Danach kommen weitere Käufe dazu (z. B. „Handy“, „Konsole“) — diese Stücke färben sich rot und tragen „Zinsen“. Ergebnis-Callout: „oft teurer als der Dispo“. Keine erfundenen Zinsbeträge.
- Startet bei: „Das heißt: Du bekommst nicht nur Geld“ · Stufen bei: „Das heißt“ · „Geld für den Fernseher“ · „ganzen Kreditrahmen“ · „Die null Prozent gelten“ · „Alles, was du danach“ · „kostet Zinsen“ · „Oft sogar mehr“
- Viewer Change: Ein einzelner Kaufblock „Fernseher“ steht in der Mitte; um ihn legt sich ein Rahmen, der sich zu einem großen leeren „Kreditrahmen“ aufzieht; der Fernseher wird grün mit „0 %“ und „nur dieser Kauf“, danach füllen „Handy“ und „Konsole“ den Rahmen, färben sich rot mit „Zinsen“, der Rest zeigt „jeder weitere Kauf: Zinsen“ und darunter erscheint „Zinsen oft höher als beim Dispo“.
- Animation Intent: Der Zuschauer soll erleben, dass der Null-Prozent-Kauf nur ein kleiner Teil eines viel größeren Kredits ist: Die Aufzieh-Bewegung zeigt den versteckten Rahmen, die Farbumkehr zeigt, dass alles danach kostet — ohne erfundene Beträge.
- Mechanik: purchase-reveals-credit-line-later-purchases-turn-costly
- Technik-ID: single-purchase-block-unfolds-into-credit-frame-segments-recolor
- Technikbeschreibung: Kaufblock in der Bildmitte; ein Rahmen umschließt ihn und zieht sich nach links und rechts auf volle Breite auf, der Block wandert an den linken Rand; spätere Käufe wachsen als graue Segmente in den Rahmen und färben sich gemeinsam rot; Etiketten 0 % / Zinsen über den Segmenten, gestrichelter roter Rest, Dispo-Hinweis als Karte. Segmentbreiten schematisch, ohne Euro-Skala.
- Tool Stack: Remotion, React, src/design-system/daten.tsx, SVG-Icons
- Composition Family: credit-line-frame
- Motion Signature Camera: still
- Motion Signature Layout: ein breiter Rahmen in Bildmitte, Etiketten darüber, Hinweis darunter
- Motion Signature Transformation: Einzelkauf entpuppt sich als Teil eines Rahmens, spätere Segmente füllen und färben sich rot
- Startzustand: Ein grauer Kaufblock „Fernseher“ (Icon) in der Bildmitte, Kennzeichnung „Schema: Null-Prozent-Kauf mit gekoppeltem Kreditrahmen“.
- sichtbare Mechanik/Transformation: Bei „Geld für den Fernseher“ füllt sich der Block blau. Bei „ganzen Kreditrahmen“ legt sich ein schwarzer Rahmen um den Block und zieht sich in 30 Frames nach links und rechts auf volle Breite (1.440 px) auf; der Fernseher landet am linken Rand, „Kreditrahmen“ erscheint rechts oben. Bei „Die null Prozent gelten“ wird der Fernseher grün, Etikett „0 %“ darüber, „nur dieser Kauf“ darunter. Bei „Alles, was du danach“ wachsen „Handy“ und „Konsole“ als graue Segmente in den Rahmen; bei „kostet Zinsen“ färben sie sich rot mit Etiketten „Zinsen“, der freie Rest wird gestrichelt rot „jeder weitere Kauf: Zinsen“.
- Resultat: Bei „Oft sogar mehr“ erscheint darunter die Karte „Zinsen oft höher als beim Dispo“; Endbild: 0 % nur am Fernseher, alles andere rot.
- Concept A: Kreditkarte, aus der Käufe als Kassenzettel herausfallen, die rot gestempelt werden — mehr Illustration als Erklärung, Rahmen-Idee fehlt.
- Concept B: Ein Kauf entpuppt sich als kleines Stück in einem großen Kreditrahmen; spätere Käufe füllen den Rahmen und färben sich rot.
- Concept C: Zeitstrahl mit Kauf 1 (0 %) und Folgekäufen (Zinsen) — erklärt die Reihenfolge, aber nicht, dass ein großer Rahmen mitverkauft wird.
- Chosen Concept: B — die Aufzieh-Bewegung ist genau die Überraschung des Skripts („nicht nur Geld für den Fernseher, sondern gleich einen ganzen Kreditrahmen“). Keine Beträge oder Zinssätze; die 15,9 % kommen in visual-27.
- Keyframe 10%: Fernseher-Block allein in der Mitte (grau).
- Keyframe 35%: Kreditrahmen aufgezogen, Fernseher grün mit 0 % und „nur dieser Kauf“.
- Keyframe 65%: Handy und Konsole im Rahmen, noch grau (vor „kostet Zinsen“).
- Keyframe 90%: Handy/Konsole rot mit „Zinsen“, Rest „jeder weitere Kauf: Zinsen“, Dispo-Hinweis.
- Sichtbare Zustände: Ein Kauf: Fernseher → Geld für den Fernseher → Ganzer Kreditrahmen → 0 % nur für diesen Kauf → Weitere Käufe im Rahmen → Alles danach: Zinsen → Zinsen oft höher als beim Dispo
- Motion Channels: Kaufblock Fernseher erscheint und füllt sich, Rahmen zieht sich um den Kauf auf, 0 % und „nur dieser Kauf“ am Fernseher, Handy und Konsole füllen den Rahmen, Spätere Käufe färben sich rot mit „Zinsen“, Dispo-Hinweis erscheint
- SFX-Cues: optional weiches Aufzieh-Geräusch beim Rahmen („ganzen Kreditrahmen“ + 0–30 Frames); dumpfer Akzent beim Rotfärben („kostet Zinsen“). Keine SFX, die mit Stimme oder Hintergrundmusik konkurrieren.

## Timing

- Code: `animation.tsx`, Export `YouTubeVisual24Animation`, Prop `beats` (Frames ab Visual-Start, aus den beatCues).
- Vorschau-Beats ohne Audio (154 Wörter/Minute geschätzt): [0, 70, 152, 175, 292, 386, 409] Frames, Vorschau-Dauer 510 Frames bei 30 fps. Phase 3 setzt die echten Wortzeiten ein; alle Stufen hängen relativ an den Beats, das Endergebnis steht spätestens ca. 20 Frames nach dem letzten Beat und bleibt danach unverändert stehen (mind. 15 Frames Hold bis zum Schnitt).
- Regeln: helles 2D, keine Szenenüberschrift, keine eingebrannten Untertitel, Inhalt vertikal mittig um `DATEN.mitteY`, Kennzeichnung klein oben links, Größen aus Werten.

## Hinweise / Annahmen

Rein schematisch: Segmentbreiten (Fernseher 400 px, Handy 240 px, Konsole 270 px) sind keine Euro-Werte, der Rahmen hat bewusst keine Skala und keinen Betrag. „Zinsen oft höher als beim Dispo“ gibt die Skriptaussage wieder („Oft sogar mehr als beim Dispo“).

## QA (Phase 1, Claude Code Opus 5.5)

- Gerendert über `out/null-prozent-qa/entry.tsx` mit Vorschau-Beats; Stills bei 10/35/65/90 % + letztem Frame + einem Übergangsframe sowie Voll-Clip (Kontaktbogen alle 0,5 s, verkleinert) geprüft: keine Überlappungen, nichts angeschnitten, Werte und Geometrie stimmen.
