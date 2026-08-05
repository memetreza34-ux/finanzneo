# FinanzNeo – erster Full-Animation-Versuch

## Status: visuell abgelehnt

Das 40-Sekunden-Reel **„100 € ab 20 oder 200 € ab 30?“** ist technisch renderbar und mathematisch korrekt, hat die kreative und visuelle Prüfung aber nicht bestanden.

Festgestellte Probleme:

- sieben Komponenten wiederholen überwiegend denselben Früh-gegen-spät-Vergleich
- fünf von sieben Szenen sind reine Datenvisualisierungen
- alle sieben Szenen verwenden Dashboard- oder Karten-Framing
- die Kameraführung bleibt praktisch statisch
- Inhalt wird überwiegend angezeigt statt durch Objekte, Räume und Handlungen animiert
- finales Voiceover und sinnvolles Sounddesign fehlen

Der Versuch bleibt als **abgelehntes Referenzbeispiel** erhalten. Er darf nicht als Qualitätsvorlage, freigegebenes Reel oder Nachweis für narrative Animationsqualität bezeichnet werden.

## Technisch bestätigte Eigenschaften

- 40 Sekunden
- 1.200 Frames
- 30 fps
- 1080 × 1920
- isolierte Remotion-Composition
- korrekte Beispielrechnung
- keine normalen Bildszenen
- keine produktive Aktivierung

Diese Eigenschaften beweisen nur die technische Funktionsfähigkeit.

## Neues verbindliches Quality Gate

Vor jeder weiteren Full-Animation-Produktion gelten vier getrennte Prüfungen:

```bash
npm run finance:full-animation-reel:quality-system
npm run finance:full-animation-reel:storyboard-quality
npm run finance:full-animation-reel:technical-validate
npm run finance:full-animation-reel:approval
```

Der Gesamtbefehl lautet:

```bash
npm run finance:full-animation-reel:validate
```

Der aktuelle Versuch muss bei `storyboard-quality` und `approval` fehlschlagen. Das ist beabsichtigt: Ein abgelehntes Reel darf nicht mehr allein wegen bestandener TypeScript-, Mathematik- oder Renderprüfungen als erfolgreich gelten.

## Neue Mindestanforderungen

- 5 bis 9 unterschiedliche Inhaltsbeats
- mindestens 60 % narrative Objekt-, Raum-, Prozess- oder Transformationsszenen
- höchstens 40 % reine Datenvisualisierung
- höchstens eine Dashboard-Szene
- derselbe Kernvergleich maximal zweimal
- eine Layoutfamilie maximal zweimal
- überwiegend aktive Kameraführung
- sichtbarer Start- und Endzustand in jeder Szene
- finales Voiceover und Sounddesign
- vollständige menschliche Video- und Frameprüfung

Die vollständige Arbeitsweise steht in [`NARRATIVE_QUALITY_WORKFLOW.md`](./NARRATIVE_QUALITY_WORKFLOW.md).

## Dateien zur Qualitätskontrolle

- `NarrativeAnimationQuality.ts` – automatisierte Qualitätsregeln
- `NarrativeAnimationPlans.ts` – abgelehntes und positives Referenz-Storyboard
- `narrative-plan.current.json` – aktiver, maschinenprüfbarer Szenenplan
- `full-animation-reel-quality.json` – manuelle Render- und Audiofreigabe
- `NarrativeAnimationQuality.test.ts` – Tests gegen bloß umbenannte, aber visuell gleiche Szenen

## Sicherheitszustand

- keine Registrierung im produktiven `FinanzNeoRoot`
- keine globalen Feature-Flags aktiviert
- kein automatisches Routing aktiviert
- keine Änderung an `main`
- keine Freigabe und kein Merge
