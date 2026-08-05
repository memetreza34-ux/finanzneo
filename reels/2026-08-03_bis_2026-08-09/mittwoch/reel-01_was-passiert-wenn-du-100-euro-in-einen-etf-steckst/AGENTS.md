# Dieses Reel ist bereits programmiert

Die kreative Planung, die beiden Animationen und die vollständige Remotion-Composition sind abgeschlossen.

Das allgemeine Build-Manifest liegt unter:

```text
timeline/reel-build-manifest.json
```

Es besitzt den Status `prebuilt-ready`. Die Animationen sind für Codex gesperrt.

## Codex darf nicht

- neue Animationen entwerfen,
- vorhandene Animationen neu schreiben,
- alternative Komponenten erzeugen,
- das Storyboard umdeuten,
- feste Mediendateinamen verlangen,
- die Stimme inhaltlich kürzen,
- globale Feature-Flags aktivieren.

## Codex soll nur den allgemeinen Befehl ausführen

Aus `alles/`:

```bash
npm run finance:reel:build -- \
../reels/2026-08-03_bis_2026-08-09/mittwoch/reel-01_was-passiert-wenn-du-100-euro-in-einen-etf-steckst
```

Der Befehl liest Composition, Einstiegspunkt, Animationen, Runtime-Props und Exportpfade aus dem allgemeinen Manifest. Er verarbeitet und transkribiert die Stimme, übernimmt die Bilder, prüft den vorprogrammierten Code, rendert das Reel und erzeugt die technischen Prüfdateien.

## Fehlerbehebung

Nur wenn ein tatsächlich ausgeführter Befehl mit einer konkreten Fehlermeldung scheitert, darf Codex den kleinsten nachweisbaren technischen Defekt beheben. Danach denselben Gesamtbefehl erneut ausführen.

Keine spekulative Refaktorierung. Keine kreative Neuentwicklung. Keine Nutzerfreigabe selbst setzen. Nicht mergen und PR nicht auf Ready stellen.
