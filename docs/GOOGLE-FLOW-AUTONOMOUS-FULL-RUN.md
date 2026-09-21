# FinanzNeo — Google Flow Style-Anker V4

Dieser Vertrag gilt für alle neuen Reels und jede `03-szenen/alle-bildprompts.txt`.

## Verbindliche Marker

```text
FLOW_EXECUTION_MODE: finanzneo-flow-style-anchor-v4
FLOW_STATE_MACHINE: finanzneo-flow-state-machine-v1
FLOW_STRUCTURE_LOCK: finanzneo-flow-structure-lock-v2
SCENE_VARIANCE_LOCK: finanzneo-scene-variance-v1
```

Autonom bedeutet: bis zum letzten Bild ohne Nutzer-„weiter“ fortsetzen.
Autonom bedeutet ausdrücklich **nicht Batch**.

Bestandsreels mit `finanzneo-flow-strict-single-job-v3` bleiben gültig und werden nicht migriert.

## Harte State Machine

```text
ANKER = scene-01, allein und zuerst
→ GENAU EIN Bildjob
→ vollständig auf Ergebnis warten
→ sofort exakt umbenennen
→ V9-QA
→ FAIL: dieselbe Bildnummer neu, alles andere bleibt gesperrt
→ PASS: Blöcke zu höchstens 5 Bildern freischalten
→ je Block: jedes Bild einzeln, jedes mit Anker-Stilreferenz
→ je Bild: Rename → V9-QA → Anker-Abgleich → Varianz-Abgleich
→ bis zum letzten Bild wiederholen
```

Zu jedem Zeitpunkt:

```text
MAX_CONCURRENT_GENERATIONS = 1
MAX_IMAGES_PER_BLOCK = 5
```

## Der Anker ist Stilreferenz, keine Bildvorlage

Das ist die zentrale Regel von V4. Die erste Fassung hat sie nicht ausgesprochen, und das Ergebnis war ein Reel aus acht Varianten desselben Bildes: derselbe Tisch, dieselbe Tasse, dieselbe Hand, derselbe Kamerawinkel.

```text
Vom Anker kommen:        Hintergrundschwärze, Lichtführung, Materialwirkung,
                         Figurenstil, Farbtemperatur
Vom Anker kommen NICHT:  Schauplatz, Möbel, Kamerawinkel, Bildaufbau,
                         Requisiten, Objektanordnung
```

Jeder Bildjob sagt dem Generator beides ausdrücklich: übernimm Licht, Material, Schwärze und Figurenstil — übernimm nicht Schauplatz, Kamerawinkel, Möbel oder Requisiten.

## Szenenvarianz

Gleiche Welt heißt gleicher Look, nicht gleiche Szene.

- jedes Bild zeigt eine sichtbar andere Situation als das Bild davor und als der Anker
- Schauplatz, Kameraabstand und Blickwinkel wechseln, sobald der Sprechbeat es zulässt
- eine Requisite kehrt nur wieder, wenn genau sie den Beat erklärt
- Deko-Requisiten wiederholen sich nie
- eine neue, überraschende Situation ist besser als die sichere Wiederholung der vorigen

### Varianz-Abgleich je Bild

FAIL, wenn:

- das Bild wie eine zweite Aufnahme des Ankers oder des Vorgängers wirkt
- Schauplatz und Blickwinkel gleich geblieben sind, obwohl der Beat gewechselt hat
- eine Deko-Requisite des Vorgängers ohne Grund wieder im Frame liegt

Fällt dieselbe Bildnummer zweimal an der Varianz durch, wird sie **ohne Anker-Referenz** erzeugt — nur mit dem geschriebenen V9-Lock.

## Gesperrt

- mehrere Bilder in einem Generierungsaufruf
- mehr als 5 Bilder in einem Block
- einen Block starten, bevor der Anker die QA bestanden hat
- Referenz auf irgendein anderes Bild als den Anker
- Komposition, Schauplatz, Kamerawinkel oder Requisiten des Ankers übernehmen
- dieselbe Szenerie in mehreren Bildern wiederholen ohne inhaltlichen Grund
- parallele Generierung, spätere Bilder vorab queueen
- Galerie / Kontaktbogen / Collage / Multi-Panel als Ersatz für Einzelbilder
- erst alle Bilder generieren und später gesammelt umbenennen
- Nutzer nach jedem Bild um `weiter`, `okay` oder Freigabe bitten

## Warten

`warten` bedeutet ausschließlich: intern auf die technische Rückgabe des **aktuell einzigen Bildjobs** warten.

Es bedeutet niemals auf eine Nutzernachricht warten.

## V9-QA nach jedem Einzelbild

Prüfen:

- korrekte Beat-Zuordnung
- exakter finaler Dateiname
- `1:1`
- stylized 3D animated V9
- tiefschwarzer cleaner Hintergrund
- keine feste Objektquote; nur sinnvolle Objekte
- erlaubte Labels korrekt
- Person mit erkennbarem Gesicht, falls Person nötig
- Marken erkennbar aber stilisiert; kein Screenshot/Flat-Paste
- keine UI/Dashboard/Flowchart/Diorama/Clutter
- Anker-Abgleich: Schwärze, Lichtrichtung, Material, Figurenstil, Farbtemperatur
- Varianz-Abgleich: anderer Schauplatz oder Blickwinkel als Anker und Vorgänger

Bei Fehler bleibt der nächste Bildblock gesperrt.

## Nummerierung

- `scene-01` ist Anker **und** Cover; es gibt kein separates `Bild 00`
- Bildnummer = echte Szenennummer
- Animations- und Datennummern bleiben reserviert und erzeugen kein Bild

## Technische Absicherung

- `npm run reel:create` setzt den Vertrag über den zentralen Flow-Contract.
- `npm run reel:validate -- <Reel-Pfad>` prüft ihn.
- `npm run reel:ready -- <Reel-Pfad>` blockiert Phase 3, wenn der Vertrag verletzt ist.
