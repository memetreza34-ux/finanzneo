# ETF-Reel – vorprogrammierter Ausführungsbereich

Diese Regeln gelten für alle Dateien in diesem Ordner.

## Keine kreative oder technische Neuentwicklung durch Codex

Die beiden Animationsszenen und die vollständige Reel-Composition sind bereits programmiert:

- `PrebuiltEtfOrderMatchAnimation`
- `PrebuiltEtfCreationAnimation`
- `EtfKauf100EuroReel`
- `EtfKauf100EuroRoot`

Codex darf diese Komponenten nicht neu entwerfen, ersetzen, vereinfachen oder durch generische Animationsvorlagen austauschen.

## Aufgabe von Codex

Codex soll ausschließlich:

1. den aktuellen Branch laden,
2. den einzigen Gesamtbefehl ausführen,
3. Fehler aus realen Befehlsausgaben berichten,
4. nur einen konkret nachgewiesenen technischen Defekt minimal beheben,
5. anschließend denselben Gesamtbefehl erneut ausführen.

## Einziger normaler Produktionsbefehl

Aus `alles/`:

```bash
npm run finance:etf-reel:build -- \
../reels/2026-08-03_bis_2026-08-09/mittwoch/reel-01_was-passiert-wenn-du-100-euro-in-einen-etf-steckst
```

Dieser Befehl übernimmt Audioverarbeitung, Transkription, Szenenzeiten, Asset-Staging, Tests, TypeScript-Prüfung, Render, Cover, Kontaktbogen und technische QA.

## Token-Sparregel

Codex soll nicht erneut analysieren, wie die Animationen aussehen könnten. Die visuelle Entscheidung ist abgeschlossen. Es soll keine neuen Komponenten, Alternativkonzepte, Storyboards oder Animationsprompts erzeugen.

## Sicherheitsstatus

- Nicht mergen.
- PR nicht auf Ready setzen.
- Keine globalen Feature-Flags aktivieren.
- Keine produktive Standard-Composition ersetzen.
- Manuelle visuelle Freigabe nicht selbst setzen.
