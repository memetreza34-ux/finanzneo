# FinanzNeo – Claude Code Projektregeln

## Full-Animation-Reels

Für vollständig animierte Finanz-Reels ist dieser Workflow verbindlich:

@channels/finanzneo/src/animation-system/full-animation-reel/NARRATIVE_QUALITY_WORKFLOW.md

### Nicht verhandelbare Reihenfolge

1. Skript in 5 bis 9 unterschiedliche Inhaltsbeats zerlegen.
2. `narrative-plan.current.json` vollständig ausfüllen.
3. `npm run finance:full-animation-reel:storyboard-quality` ausführen.
4. Bei einem Fehler stoppen. Noch keine Animation programmieren.
5. Erst nach bestandenem Storyboard-Gate Szenen bauen.
6. Technische Prüfung und kreative Freigabe niemals gleichsetzen.
7. Nach dem Render das vollständige Video und mindestens drei Frames pro Szene manuell prüfen.
8. `approvedByHuman` niemals selbst auf `true` setzen.

### Kreative Grenzen

- Ein neuer Komponentenname beweist keine neue visuelle Idee.
- Derselbe Kernvergleich darf höchstens zweimal vorkommen.
- Reine Diagramme und Datenvisualisierungen dürfen höchstens 40 % des Reels ausmachen.
- Dashboard-Framing ist auf eine Szene begrenzt.
- Jede Szene benötigt eine eigene Handlung, Metapher, Startlage und sichtbare Veränderung.
- Inhalt bevorzugt durch Objekte, Räume, Prozessmaschinen, Transformationen und Ursache-Wirkung erzählen.
- Keine Serie identischer dunkler Karten mit wechselnden Balken, Kurven oder Zahlen bauen.
- Kamera, Übergang und Sound müssen aus der Handlung der Szene entstehen.

### Pflichtbefehle

```bash
npm run finance:full-animation-reel:quality-system
npm run finance:full-animation-reel:storyboard-quality
npm run finance:full-animation-reel:technical-validate
npm run finance:full-animation-reel:approval
npm run finance:full-animation-reel:validate
```

Der aktuelle erste Full-Animation-Versuch ist visuell abgelehnt. Er darf nicht als Qualitätsreferenz verwendet, gemergt oder produktiv aktiviert werden.

## Sicherheitsregeln

- Keine globalen Animations-Feature-Flags aktivieren.
- Kein automatisches Routing aktivieren.
- Keine produktive Composition verändern, solange der Nutzer dies nicht ausdrücklich freigibt.
- Draft-PRs nicht selbst auf „Ready for review“ setzen.
- Nichts nach `main` mergen.
