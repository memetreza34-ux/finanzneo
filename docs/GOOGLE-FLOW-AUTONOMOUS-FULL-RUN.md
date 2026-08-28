# FinanzNeo — Google Flow Strict Single Job V3

Dieser Vertrag gilt für alle neuen Reels und jede `03-szenen/alle-bildprompts.txt`.

## Verbindliche Marker

```text
FLOW_EXECUTION_MODE: finanzneo-flow-strict-single-job-v3
FLOW_STATE_MACHINE: finanzneo-flow-state-machine-v1
FLOW_STRUCTURE_LOCK: finanzneo-flow-structure-lock-v2
```

Autonom bedeutet: bis zum letzten Bild ohne Nutzer-„weiter“ fortsetzen.
Autonom bedeutet ausdrücklich **nicht Batch**.

## Harte State Machine

```text
ACTIVE_STEP = erstes benötigtes Bild
→ GENAU EIN Bildjob
→ vollständig auf Ergebnis warten
→ sofort exakt umbenennen
→ nur dieses Bild per V9-QA prüfen
→ FAIL: dieselbe Bildnummer neu
→ PASS: genau nächsten Bildblock freischalten
→ bis zum letzten Bild wiederholen
```

Zu jedem Zeitpunkt:

```text
MAX_CONCURRENT_GENERATIONS = 1
```

## Gesperrt

- mehrere Bilder in einem Generierungsaufruf
- mehrere Bildprompts gemeinsam an die Generierung senden
- parallele Generierung
- spätere Bilder vorab queueen
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

Bei Fehler bleibt der nächste Bildblock gesperrt.

## Nummerierung

- Cover = `Bild 00`
- Bildnummer = echte Szenennummer
- Animationsnummern bleiben reserviert und erzeugen kein Bild

## Keine Bildreferenz

Kein Cover und kein vorheriges Szenenbild als Image-to-Image-/Referenzbild verwenden. Die Same-World-Konsistenz entsteht über den geschriebenen V9-Lock.

## Technische Absicherung

- `npm run reel:create` setzt den Vertrag über den zentralen Flow-Contract.
- `npm run reel:validate -- <Reel-Pfad>` prüft ihn.
- `npm run reel:ready -- <Reel-Pfad>` blockiert Phase 3, wenn der Vertrag verletzt ist.

Der alte Modus `finanzneo-flow-autonomous-full-run-v2` ist nicht mehr aktiv, weil er von Agenten als Batch-Auftrag missverstanden werden konnte.
