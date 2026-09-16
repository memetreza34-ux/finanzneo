# FinanzNeo YouTube Image World

## Scope

Gilt nur für FinanzNeo YouTube-Longform-Bildgenerierung. Reel-Regeln und die Reel-Bildwelt bleiben unverändert.

`CLAUDE.md` bleibt höchste Repo-Autorität.

## Lock

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
YOUTUBE_VISUAL_WORLD_LOCK: finanzneo-youtube-cg-animated-black-v2
SOURCE_VISUAL_LANGUAGE: finanzneo-stylized-3d-animated-black-v9
GENERATED_IMAGE_ASPECT_RATIO: 16:9
```

Kanonische Definition: `config/finanzneo-image-worlds/finanzneo-youtube-cg-animated-black-v2.txt`

Abgeschafft: `finanzneo-youtube-animated-feature-3d-v1` und `finanzneo-youtube-grounded-3d-black-v1`. Beide nicht wiederherstellen.

## Kernsatz

**Real in der Identität, animiert im Rendering.**

- Identität echt: der Gegenstand ist genau das Ding, das ein deutscher Haushalt besitzt, mit den Merkmalen, an denen man ihn erkennt.
- Material und Licht CGI: modelliert, sauber, als Animationsfilm-Asset beleuchtet.
- Nichts im Bild wurde jemals fotografiert.

## Das Wort Pixar steht nie im Prompt

Bildmodelle lesen `Pixar`, `cartoon`, `clay` und `toy` als Knetfiguren, glatte Klumpen und Badespielzeug. Genau daran ist die Vorgängerwelt gescheitert.

Stattdessen das Handwerk ausschreiben:

> Frame from a fully CG 3D animated feature film. Everything is modeled and rendered — nothing is photographic. No photo texture, no scanned material, no camera grain. Clean sculpted CG materials. Shapes appealing and slightly simplified while staying completely recognizable. Warm cinematic key light with a soft rim light.

## Keine Bild-zu-Bild-Referenz

Nie ein Bild als Referenz hochladen, anhängen oder in Flow als Reference/Style Image wählen — auch kein freigegebenes aus derselben Serie.

Flow hat zwischen zwei Jobs kein Gedächtnis. Eine Bildreferenz schleppt Motiv und Layout mit, während der Renderstil trotzdem auf den fotografischen Default zurückfällt.

Einheitlichkeit entsteht **nur** durch den ausgeschriebenen Style Lock in jedem einzelnen Prompt.

## Drei harte Regeln

1. **Mindestens ein echtes 3D-Objekt pro Bild.** Nie eine Szene nur aus Papier und Dokumenten — Papier rendert das Modell per Default fotografisch.
2. **Eine Beziehung pro Bild:** groß/klein, nah/fern, offen/zu, kippt/steht, drückt/wird gedrückt, passt/passt nicht. Dazu ein sprechendes Detail, das genau diese Beziehung zeigt.
3. **Keine Typografie als Motiv.** Nie ein Wort oder eine Zahl als großes 3D-Objekt. Labels klein, gedruckt, direkt am Objekt.

## Identität

- Geld sind erkennbare Euro-Scheine: richtige Farbe zum Wert, lesbare Wertzahl. Kein generisches farbiges Papier, keine Dollarnoten. Geld behält seine echte Farbe, auch wenn sie nicht in die Farbrolle passt.
- Rechnung, Kontoauszug, Lohnzettel, Mietschreiben und Vertrag folgen deutschem Layout.
- Auto, Geräte, Verpackungen und Lebensmittel sind europäische Alltagsobjekte.
- Kein erfundener Text, keine Formularfelder, keine Adressen, keine erfundene Zahl.

## Hintergrund

Reines Schwarz. Ein kleiner zweckgebundener Ausschnitt eines echten Ortes ist erlaubt, wenn die Situation ihn braucht — ein Regalabschnitt, eine Tür, eine Ecke, eine Waschecke — und löst sich nach kurzer Distanz ins Schwarz auf.

Nie ein ganzer Raum, nie ein Studioboden, nie eine Schreibtisch- oder Tischfläche, nie Holz, nie ein Verlaufshintergrund.

## Menschen

Eine stilisierte anonyme 3D-Animationsfilm-Person darf auftreten, wenn die Situation menschlich ist — einkaufen, entscheiden, tragen, warten, arbeiten.

- Gesicht immer klar sichtbar, stilisierte Augen, Nase, Mund
- frontal oder natürliche Dreiviertelansicht
- eine Person, einfache natürliche Pose, die wirklich etwas tut
- nie eine reale oder identifizierbare Person, nie fotorealistische Haut, nie eine gesichtslose Figur, nie ein glattes leeres Gesicht, nie reine Rückenansicht, nie eine Menschenmenge

Die Situation muss auch ohne die Person lesbar bleiben.

## Nicht Spielzeug, nicht Clay

Kein Clay-, Knet-, Marzipan-, Seifenstück- oder Badespielzeug-Look. Keine merkmalslosen Rundklumpen. Keine Spielzeugstadt, keine Spielzeughäuser, keine Spielzeugautos, kein Tischdiorama.

Reale Objekte behalten ihre Konstruktion: Waschmaschine mit Türdichtung, Drehregler und Füßen; Auto mit Spaltmaßen, Scheinwerfern und Gummireifen; Rechnung mit echtem Druckbild und Papierstärke.

Pastellmint und Babyblau sind außerhalb der Palette.

## Palette

Deep Black = Welt. Emerald Green = Reserve, Lösung, positiver Wert. Warm Red-Orange = Kosten, Verlust, Warnung, Schulden. Warm Ivory und Soft Gray = neutrale reale Objekte. Gold = nur Geldakzent.

Kein Regenbogen, kein Cyberpunk-Neon, kein übermäßiges Glühen. Geld ist die Ausnahme und behält seine echte Farbe.

## Komposition

Horizontal 16:9. Eine klare Hauptsituation. Ursache und Wirkung im selben Frame. In ein bis zwei Sekunden ohne Ton verständlich.

Oben ruhiger schwarzer Freiraum: das Hauptmotiv sitzt im mittleren und unteren Drittel, damit später in Remotion eine Zwischenüberschrift über dem Bild stehen kann.

Abwechslung über die Serie: nicht Szene für Szene dieselbe Objektfamilie.

## Promptlänge und Aufbau

Kurz halten, etwa fünfzig Zeilen inklusive Metadatenblock. Lange Regelblöcke fressen die Aufmerksamkeit, die der Szene fehlt.

Aufbau: **Stilblock → SCENE → kurze Stil-Erinnerung am Ende.** Der Stil steht vorne und hinten; Bildmodelle gewichten das Ende stark.

Jeder Prompt wird einzeln für den exakten Sprechpunkt geschrieben. Nie ein generischer Master-Prompt mit ausgetauschten Substantiven.

## Daten und abstrakte Beats

Geprüfte Zahlen, Charts, Zeitachsen und Betragsvergleiche gehören nach Remotion. Diese Welt wird nicht auf jeden Beat gezwungen.

## Hard QA fail — dieselbe Bildnummer neu erzeugen

- fotorealistisch, oder wie ein Foto von Papier auf einem echten Schreibtisch
- Clay, Knete, Seifenstück, Badespielzeug
- merkmalslose Rundklumpen ohne echte Konstruktion
- Spielzeugstadt, Spielzeughäuser, Spielzeugautos, Tischdiorama
- ein Wort oder eine Zahl als großes 3D-Objekt
- erfundener Text, Formularfelder oder eine nicht recherchierte Zahl
- Geld wie generisches farbiges Papier oder wie Dollar
- Szene nur aus Papier und Dokumenten
- Person ohne klar sichtbares Gesicht oder von hinten
- Schwarz nicht mehr dominant, oder ein ganzer Raum entstanden
- mehr als eine Beziehung, Aussage nicht mehr lesbar
- Tresor, Safe, Sparschwein, Münzstapel, Schild oder Pfeil statt der realen Situation
- obere Kante zugestellt, kein Platz für die Zwischenüberschrift

## Google Flow

Genau ein Bild, vollständig abwarten, sofort exakt umbenennen, prüfen, bei Fehler dieselbe Bildnummer neu erzeugen, erst dann weiter. Nie Batch, nie parallel.

## Reels sind geschützt

Diese Regel darf keine Reel-Bildwelt, Reel-Prompts oder Reel-Validatoren umschreiben. Sie ist ausdrücklich YouTube-only.
