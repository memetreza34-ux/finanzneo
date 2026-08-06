# Verbindliche Bildzuordnung

| Szene | Richtiger Bildinhalt | Darf nicht gezeigt werden |
|---|---|---|
| 01 | ein einziges gemischtes Konto mit bereits reserviertem Geld | fertige Drei-Konten-Lösung |
| 02 | ein großer ungeteilter Behälter, in dem alle Geldarten vermischt sind | sichtbare Drei-Wege-Aufteilung |
| 03 | Kontostand-Illusion: Gesamtbetrag, verplanter Anteil und wirklich freier Anteil | Rücklagensafe oder Fixkostenhaus |
| 05 | Konto 1: Haus-/Fixkosten-Vault für Miete, Strom, Versicherungen und Verträge | Kontostand-Anzeige oder Rücklagenschild |
| 07 | Konto 2: geschützte Rücklage für Notfälle und geplante Anschaffungen | Fixkostenhaus oder Wochenbudget |
| 10 | fertiges System mit geschützten Fixkosten, Rücklagen und offenem Wochenbudget | ungelöstes Mischkonto |

## Kritischer Kontrollpunkt

Im ersten Test-Render waren die Motive für Szene 03, 05 und 07 vertauscht. Vor dem nächsten Render müssen die Dateien in den lokalen Szenenordnern so liegen:

```text
scene-03/ → Kontostand / verplant / frei
scene-05/ → Konto 1 / Fixkosten
scene-07/ → Konto 2 / Rücklage
```

Der Asset-Sync übernimmt technisch den Ordnernamen. Er kann den Bildinhalt nicht semantisch erkennen. Deshalb ist diese Sichtprüfung verpflichtend.
