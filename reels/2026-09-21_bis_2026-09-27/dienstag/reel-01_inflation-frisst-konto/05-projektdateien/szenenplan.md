# Szenenplan

IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v3

Literal first, creative second. Jede Bildszene zeigt zuerst die konkrete reale
Situation, die im Sprechbeat wirklich passiert.

TRANSFERABILITY-TEST: Ein Bild faellt durch, wenn es genauso gut zu fuenf anderen
Finanzthemen passen wuerde.

SZENENVARIANZ: Jede Bildszene hat ihren eigenen Schauplatz und ihren eigenen Blickwinkel.
Kuechentisch, Flur-Schublade, Briefkasten, Kassenband, Bankfoyer, Geldkassette und
Schreibtisch — gleiche Welt, nie dieselbe Aufnahme zweimal.

VERBOTEN als Ersatz fuer die reale Situation: Förderbänder, Schienen, Schranken, Käfige
und andere generische Fantasiemechaniken.

**Dein Geld auf dem Konto wird jedes Jahr weniger** — 11 Szenen, 50.7 s

| Szene | Typ | Dauer | Zwischenueberschrift | Icon |
|---|---|---|---|---|
| scene-01 | image | 3.6 s | Zehntausend auf dem Konto | bank |
| scene-02 | image | 3.4 s | Sicher, denkst du | shield |
| scene-03 | data | 9.0 s | Was nach zehn Jahren bleibt | trending |
| scene-04 | image | 3.2 s | Der Betrag bleibt gleich | receipt |
| scene-05 | image | 3.0 s | Der Einkauf wird kleiner | warning |
| scene-06 | animation | 7.0 s | Gleicher Betrag, weniger Wert | hourglass |
| scene-07 | image | 3.2 s | Zinsen holen das nicht auf | percent |
| scene-08 | data | 8.5 s | Zehn Jahre Weltmarkt | trending |
| scene-09 | image | 3.2 s | Nicht alles, nur das Geparkte | coins |
| scene-10 | image | 3.2 s | Notgroschen bleibt liegen | lock |
| scene-11 | image | 3.4 s | Der Rest darf arbeiten | rocket |

## Typwahl

Das Flow-Bild ist der Standardfall. Eine Szene verlaesst ihn nur, wenn sie muss:

```text
Kann ein Bild die Aussage tragen?                  -> Flow-Bild
Nein, es braucht eine echte Zahl?                  -> Datenszene
Nein, die Veraenderung selbst IST die Aussage?     -> Animation
```

- Acht der elf Szenen sind Flow-Bilder. Jede zeigt eine eigene Alltagssituation an einem eigenen Ort.
- scene-03 und scene-08 tragen Zahlen, die kein Bild zeigen koennte: ein Verhaeltnis ueber Zeit.
- scene-06 ist die einzige Animation: der Kontostand steht still, waehrend der Stapel daneben schrumpft. Diese Gegenbewegung kann ein Standbild nicht.

## Style-Anker

scene-01 ist der Style-Anker des Reels: Bild 01 - Zehntausend auf dem Konto.png

Es wird zuerst und allein erzeugt. Alle weiteren Bilder laufen danach in Bloecken zu
hoechstens fuenf und bekommen den Anker als Stilreferenz mit.

Der Anker liefert ausschliesslich Hintergrundschwaerze, Lichtrichtung, Materialwirkung,
Figurenstil und Farbtemperatur. Schauplatz, Kamerawinkel, Moebel und Requisiten kommen
nie vom Anker, sondern aus dem jeweiligen Einzelprompt.

## V5

- Header mittig, 56 px, max. 2 Zeilen, weisser Text + semantisch gefaerbtes Icon
- Header Y154; Visual Y320-1400; Caption bottom340
- Untertitel enden an Szenengrenzen
