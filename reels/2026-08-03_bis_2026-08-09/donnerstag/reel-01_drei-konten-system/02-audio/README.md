# Audio

Die finale Voiceover-Datei wird lokal direkt in diesem Ordner abgelegt und anschließend in den öffentlichen Remotion-Assetpfad synchronisiert.

## Zielwerte

```text
Integrated Loudness: ungefähr -16 LUFS
True Peak: höchstens -1 dBTP
```

Der aktuelle Remotion-Preview-Code verwendet als Ausgangspunkt einen Gain von `1.55`, weil der analysierte Referenzrender ungefähr 3,8 dB zu leise war. Dieser Gain ist nur eine Vorschauhilfe. Vor Veröffentlichung muss der tatsächlich gerenderte MP4 erneut gemessen werden.

## Timing

- Wort-Zeitstempel müssen aus genau der finalen Audiodatei stammen.
- Szenenstarts werden aus den Satzanfängen abgeleitet.
- Keine starren gleich langen Sechs-Sekunden-Szenen.
- Nach jeder Änderung an Audio oder Sprechtempo müssen Wortzeiten und Timeline neu erzeugt beziehungsweise geprüft werden.
