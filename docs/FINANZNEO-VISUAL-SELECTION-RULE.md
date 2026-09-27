# FinanzNeo Visual Selection Rule V3

`VISUAL_SELECTION_STANDARD: finanzneo-visual-selection-v3`

## Kernprinzip

Nicht mit einem Tool beginnen. Immer zuerst:

```text
Sprechpunkt
→ was muss der Zuschauer verstehen oder erinnern?
→ stärkste statische Visualisierung bestimmen
→ erst dann prüfen, ob Bewegung zusätzlich hilft
→ erst danach Werkzeug wählen
```

**Komplexer Inhalt bedeutet nicht komplexes Visual.**

## Script und Visual werden zusammen gebaut

Das Voiceover ist nicht unabhängig vom Visual.

Vor Script-Lock braucht jeder Beat:
- klare Kernaussage;
- konkrete Visualidee;
- gewählte Visualform;
- statische Alternative;
- bei Motion: klarer Bewegungsmehrwert;
- bei Hybrid: klare Aufgabenteilung ohne semantische Überlappung;
- Variety-Check gegen die letzten Szenen.

Kanonisch: `docs/YOUTUBE-SCRIPT-VISUAL-PLANNING.md`.

## YouTube Longform

`YOUTUBE_VISUAL_PROFILE: finanzneo-youtube-simple-finance-v2`

Phase B ist **content-first und static-first in der Prüfung**: zuerst die beste statische Denkstütze suchen; Motion wird nur genommen, wenn sie stärker erklärt.

### Fünf mögliche Hauptformen

#### 1. Starkes Bild

Nutzen, wenn konkrete Situation, Emotion, Alltag oder räumliche Ursache/Wirkung die beste Denkstütze ist.

#### 2. Statischer Explainer

Nutzen, wenn ein Diagramm, Vergleich, Vorher/Nachher, eine Beispielrechnung, Infokarte oder ein Schema klarer ist als eine animierte Szene.

Ein Phase-B-Video darf bewusst statische Erklärbilder enthalten. Phase B erlaubt Motion; sie verpflichtet nicht dazu.

#### 3. Bild + Remotion

Nur nutzen, wenn beide Ebenen unterschiedliche Aufgaben haben.

Gutes Beispiel:
- Bild zeigt die reale Einkaufssituation;
- Remotion zeigt den exakten Preisunterschied oder die Veränderung über Zeit.

Schlechtes Beispiel:
- Bild zeigt bereits einen schrumpfenden Einkauf;
- Animation zeigt nochmals denselben schrumpfenden Einkauf.

**Wenn Bild und Motion dasselbe sagen, nur die stärkere Ebene behalten.**

#### 4. Reine Remotion

Nur nutzen, wenn Veränderung, Reihenfolge, Prozess oder Aufbau in Bewegung tatsächlich klarer ist.

Beispiele:
- Geldfluss;
- Zeitverlauf;
- schrittweiser Aufbau;
- Aufteilung;
- Wert verändert sich sichtbar über mehrere Zustände.

Nicht nutzen, wenn ein starkes Standbild, Diagramm oder Beispiel gleich gut oder besser funktioniert.

#### 5. Echtes Asset

Nutzen für reale Website, App, Dokument, Factsheet, Quelle, Logo oder Produkt, wenn Realität wichtig ist.

## Keine Quoten

Es gibt keine Zielprozente für Bild, Hybrid oder Remotion.

Die Mischung ist ein Ergebnis des Scripts, kein Produktionsziel.

Verboten:
- Animation einbauen, nur um mehr Motion zu haben;
- Hybrid einbauen, nur um Abwechslung vorzutäuschen;
- ein gutes Bild durch schwächere Animation ersetzen;
- dieselbe Visual-Schablone mehrfach nutzen, nur weil sie schnell produzierbar ist.

## Animation-Gate

Vor jeder geplanten Animation:

1. Was ist die beste statische Alternative?
2. Welche Information liefert nur die Bewegung?
3. Würde der Zuschauer ohne Motion genauso schnell verstehen?
4. Sieht die statische Lösung sogar besser und merkbarer aus?

Wenn 2 nicht klar beantwortet werden kann oder 3/4 für statisch sprechen: **keine Animation**.

## Hybrid-Overlap-Guard

Bild und Motion brauchen getrennte Rollen.

- `IMAGE_JOB`: Kontext, Situation, räumlicher Anker, Emotion oder konkretes Beispiel.
- `MOTION_JOB`: Veränderung, Ablauf, Zahl, Hervorhebung oder zeitliche Beziehung, die das Bild nicht bereits erklärt.

Wenn sich `IMAGE_JOB` und `MOTION_JOB` inhaltlich überschneiden, Szene neu planen oder eine Ebene entfernen.

## Visual-Vielfalt

Nicht immer dieselben Bilder und nicht immer dieselben Diagramme.

Mögliche Familien:
- 3D-Storybild;
- konkretes Beispiel;
- Vorher/Nachher;
- Side-by-Side;
- Diagramm;
- Chart;
- Beispielrechnung;
- Timeline;
- Infokarte;
- Ursache/Wirkung-Schema;
- reales Asset;
- Animation bei echter zeitlicher Veränderung.

Mehrere benachbarte Szenen mit derselben Logik brauchen einen inhaltlichen Grund.

## Menschen-Regel

Menschen/Figuren sind **kein Default**.

Ein Mensch ist sinnvoll, wenn mindestens einer dieser Punkte erfüllt ist:
- Reaktion erklärt etwas;
- Entscheidung ist der Kern;
- Aufmerksamkeit/Fokus ist der Kern;
- Konsequenz wird durch die Person klarer.

Nicht sinnvoll:
- Mensch steht nur dekorativ neben einer Zahl;
- dieselbe Figur schaut immer wieder fragend auf Objekte;
- mehrere Szenen hintereinander nutzen dieselbe Menschen-Schablone.

## Abstraktions-Guard

Abstrakte Balken, Blöcke, Wege, Karten oder 3D-Schemata nur nutzen, wenn sie den Gedanken wirklich schneller erklären.

Prüfung:

> Würde der Zuschauer das Schema ohne Voiceover in 1–2 Sekunden ungefähr verstehen?

Wenn nein:
- konkreten visuellen Anker ergänzen;
- oder statisches Beispiel/Diagramm wählen;
- oder das Schema vereinfachen.

## Flow-Regel

Wenn Flow gewählt wird, bleibt die freigegebene Bildwelt verbindlich:

`config/finanzneo-image-worlds/finanzneo-youtube-grounded-3d-black-v1.txt`

Referenz:

`youtube/warum-dein-geld-verschwindet-images-only`

Pflicht:
- premium stylized 3D animation-film look;
- deep-black FinanzNeo-Welt;
- hochwertige gerundete Geometrie;
- stilisierte, nicht photorealistische Figuren;
- kein blanker Faceless-Mannequin-Look;
- sichtbare Story/Beziehung statt Katalog-Inszenierung.

Flow-Bilder selbst bleiben niemals fullscreen.

## Text und Zahlen

Wichtige exakte Texte, Zahlen, Vergleiche und Labels gehören in Remotion bzw. das finale Video-Layout.

Ausnahme Thumbnail:
- finale Headline ist Pflicht;
- sie muss vor Export sichtbar sein;
- wenn Flow die kurze Headline erzeugt, muss sie exakt stimmen, sonst regenerieren;
- bevorzugt wird exakte Typografie im finalen Thumbnail-Layout.

## Full-Frame-Motion

In Phase B darf eine reine Remotion-Szene die komplette 1920×1080-Fläche nutzen.

- keine künstliche Beschränkung auf das Flow-Visualfenster;
- mindestens ca. 64 px Safe Area für kritische Inhalte;
- keine wichtigen Elemente außerhalb des Frames;
- kein unbeabsichtigtes Clipping/Cropping;
- Überschrift/Icon können als Teil der Full-Frame-Komposition integriert werden.

Bei Bild + Remotion bleibt das Flow-Bild contained; Motion darf darüber hinausgehen, wenn sie einen **anderen** Erklärjob übernimmt.

## Qualitätsfragen

Vor jeder Szene:

1. Was soll der Zuschauer nach 1–2 Sekunden verstanden haben?
2. Was ist die beste statische Lösung?
3. Braucht die Szene wirklich Bewegung?
4. Wenn Motion: was erklärt Bewegung zusätzlich?
5. Wenn Hybrid: sind `IMAGE_JOB` und `MOTION_JOB` klar getrennt?
6. Würde ein Diagramm, Beispiel oder Vergleich besser aussehen/funktionieren?
7. Braucht die Szene wirklich einen Menschen?
8. Wiederholt sie unnötig die Visual-Logik der letzten Szenen?
9. Wenn Flow: passt das Bild exakt zur freigegebenen Bildwelt?
10. Ist wichtige Schrift/Zahl exakt und lesbar?
11. Kann etwas entfernt werden, ohne Verständnis zu verlieren?

## Reels

Die bestehenden Reel-Regeln bleiben unverändert. Diese YouTube-Hybrid-Regeln werden nicht automatisch auf Reels übertragen.

## Kurzregel

> **YouTube Phase B: erst statisch denken. Motion muss ihren Mehrwert verdienen. Hybrid nur mit getrennten Rollen. Wenn Bild und Animation dasselbe sagen, nur das stärkere behalten. Script und Visual werden gemeinsam geplant.**
