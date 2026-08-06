# Verbindliche Bildzuordnung und Bildwelt

Alle Bildszenen verwenden:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
```

Vor der Neuerstellung wird zuerst `03-szenen/bildwelt-referenz.png` aus `03-szenen/bildwelt.txt` erzeugt. Jede Szene verwendet genau diese Datei als Stil- und Umgebungsreferenz.

| Szene | Richtiger Bildinhalt | Darf nicht gezeigt werden |
|---|---|---|
| 01 | ein einziges gemischtes Konto mit bereits reserviertem Geld | fertige Drei-Konten-Lösung |
| 02 | ein großer ungeteilter Behälter, in dem alle Geldarten vermischt sind | sichtbare Drei-Wege-Aufteilung oder bereits gelöstes System |
| 03 | Kontostand-Illusion: großer gebundener Anteil und deutlich kleinerer freier Anteil | Rücklagensafe oder Fixkostenhaus |
| 05 | Konto 1: integrierter Haus-/Fixkosten-Vault für Miete, Strom, Versicherungen und Verträge | Kontostand-Anzeige oder Rücklagenschild |
| 07 | Konto 2: geschützte Rücklage für Notfälle und geplante Anschaffungen | Fixkostenhaus oder Wochenbudget |
| 10 | fertiges System mit geschützten Fixkosten, Rücklagen und offenem Wochenbudget | ungelöstes Mischkonto |

## Szene 02

Das im analysierten Render verwendete Bild zeigt bereits eine sichtbare Aufteilung und passt deshalb nicht zur Problemaussage. Es muss vor der finalen Veröffentlichung mit dem neuen V3-Prompt neu erzeugt werden.

Pflichtmerkmale:

- genau ein ungeteilter Behälter
- gesunder, ausreichend großer Geldzufluss
- verschiedene Geldzwecke innerhalb desselben ungeschützten Raums
- keine Trennwände
- keine drei Konten
- keine sichtbare Lösung

## Bestehende Legacy-Zuordnung

Die aktuell lokal vorhandenen Motive für die logischen Szenen 03, 05 und 07 werden im Remotion-Code noch über folgende Legacy-Dateien verwendet:

```text
logische Szene 03 → Asset scene-05
logische Szene 05 → Asset scene-07
logische Szene 07 → Asset scene-03
```

Bei einer vollständigen V3-Neugenerierung sollen die Bilder anschließend wieder direkt in den semantisch passenden Ordnern liegen. Danach darf diese Legacy-Umsortierung aus dem Code entfernt werden.

## Set-Prüfung

Vor dem finalen Render alle sechs Bilder nebeneinander prüfen:

- gleiche Kamera und Kamerahöhe
- gleiche Studioarchitektur
- gleiche Lichtführung
- gleiche Materialien und Palette
- ähnliche Hauptmotivgröße
- kein leerer schwarzer Hintergrund
- kein Text oder Zahlen im Bild
