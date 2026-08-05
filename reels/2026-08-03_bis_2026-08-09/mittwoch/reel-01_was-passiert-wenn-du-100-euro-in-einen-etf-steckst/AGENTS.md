# Dieses Reel ist bereits programmiert

Die kreative Planung, die beiden Animationen und die vollständige Remotion-Composition sind abgeschlossen.

## Codex darf nicht

- neue Animationen entwerfen,
- vorhandene Animationen neu schreiben,
- alternative Komponenten erzeugen,
- das Storyboard umdeuten,
- feste Mediendateinamen verlangen,
- die Stimme erneut inhaltlich bearbeiten,
- globale Feature-Flags aktivieren.

## Codex soll nur diesen Befehl ausführen

Aus `alles/`:

```bash
npm run finance:etf-reel:build -- \
../reels/2026-08-03_bis_2026-08-09/mittwoch/reel-01_was-passiert-wenn-du-100-euro-in-einen-etf-steckst
```

Der Befehl prüft den vorprogrammierten Code, verarbeitet und transkribiert die Stimme, übernimmt die Bilder, rendert das Reel und erzeugt die technischen Prüfdateien.

## Fehlerbehebung

Nur wenn ein tatsächlich ausgeführter Befehl mit einer konkreten Fehlermeldung scheitert, darf Codex den kleinsten nachweisbaren technischen Defekt beheben. Danach denselben Gesamtbefehl erneut ausführen.

Keine spekulative Refaktorierung. Keine kreative Neuentwicklung. Keine Nutzerfreigabe selbst setzen. Nicht mergen und PR nicht auf Ready stellen.
