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
→ nur dieses Bild per Editorial-Finance-QA prüfen
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

## Bildreferenzen

Bildreferenzen sind **erlaubt und erwünscht**, wenn eine Szene als stufenweise Fortsetzung einer vorherigen Bildszene geplant ist.

Dann gilt:

1. Das vorherige Bild muss bereits fertig, umbenannt und freigegeben sein.
2. Genau dieses freigegebene Bild wird als visuelle Referenz an Flow angehängt.
3. Der neue Prompt bleibt vollständig und selbstständig formuliert.
4. Der Prompt wiederholt die gesamte Grundkomposition.
5. Nur die geplante neue Information oder kleine Änderung wird ergänzt.
6. Bei einer weiteren Fortsetzung wird wieder das zuletzt freigegebene Bild als Referenz verwendet.

Nur „gleiches Bild wie vorher“ oder „wie Szene 04“ im Text reicht **nicht**, wenn keine echte Referenzdatei angehängt ist.

Unabhängige Szenen benötigen keine Bildreferenz.

## Warten

`warten` bedeutet ausschließlich: intern auf die technische Rückgabe des **aktuell einzigen Bildjobs** warten.

Es bedeutet niemals auf eine Nutzernachricht warten.

## QA nach jedem Einzelbild

Prüfen:

- passt exakt zum Sprechgedanken
- Hauptidee auf den ersten Blick verständlich
- saubere, bewusst gestaltete Editorial-Komposition
- wenige sinnvolle große Elemente statt unnötiger visueller Dichte
- Text/Labels nur wenn hilfreich und lesbar
- keine unnötige AI-Slop-/Neon-/Dashboard-/Miniaturwelt-Optik
- bei Fortsetzungs-Szenen: Referenzkomposition bleibt stabil und nur die geplante Änderung wurde vorgenommen
- korrekter finaler Dateiname
- korrektes Quellformat

Bei Fehler bleibt der nächste Bildblock gesperrt.

## Bildwelt

Kanonische Bildwelt:

```text
finanzneo-editorial-finance-v1
```

Regeln: `docs/FINANZNEO-IMAGE-WORLD.md`.

## Technische Absicherung

- `npm run reel:create` setzt den Vertrag über den zentralen Flow-Contract.
- `npm run reel:validate -- <Reel-Pfad>` prüft ihn.
- `npm run reel:ready -- <Reel-Pfad>` blockiert Phase 3, wenn der Vertrag verletzt ist.
