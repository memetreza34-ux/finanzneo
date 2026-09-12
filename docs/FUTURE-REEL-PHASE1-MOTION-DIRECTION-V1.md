# FinanzNeo Future Reel Phase 1 Motion Direction V1

`PHASE1_MOTION_DIRECTION: finanzneo-phase1-individual-motion-v1`

Dieser Standard gilt nur für **neu mit dem aktuellen `reel:create` erzeugte Reels**. Er legt fest, wie Animationsszenen in Phase 1 kreativ geplant werden.

## Kernregel

> **Nicht aus vorhandenen Animationen auswählen. Erst den Sprechpunkt analysieren, dann die beste sichtbare Erklärung für genau diesen Inhalt entwickeln.**

Eine Animation darf technisch auf bestehenden Komponenten, SVGs, Lotties, Icons oder früheren Mechaniken aufbauen. Die **kreative Entscheidung** darf aber nicht daraus entstehen, dass etwas bereits vorhanden oder bequem umzusetzen ist.

## Pflichtreihenfolge pro Animationsszene

### 1. Sprechpunkt verstehen

Zuerst wird festgehalten:

- Was wird in dieser Szene konkret gesagt?
- Was ist die eigentliche finanzielle Aussage?
- Welche Stelle könnte für einen Zuschauer abstrakt oder schwer verständlich sein?

### 2. Verständnisziel festlegen

Danach wird formuliert:

> Was soll der Zuschauer nach dieser Szene **sichtbar verstanden** haben?

Das Ergebnis muss eine konkrete Veränderung, Beziehung oder Ursache/Wirkung beschreiben, nicht nur ein Thema nennen.

### 3. Sichtbare Frage beantworten

Vor der Technik wird die zentrale visuelle Frage formuliert, zum Beispiel:

- Was wächst oder schrumpft?
- Was wird aufgeteilt?
- Wo fließt Geld hin?
- Was verändert sich über Zeit?
- Was wird verglichen?
- Was ist Ursache und was Wirkung?
- Was wird durch Risiko, Gebühren oder Inflation weggenommen?
- Was stabilisiert oder schützt etwas?

### 4. Mechanik individuell herleiten

Erst jetzt wird die sichtbare Hauptmechanik entwickelt.

Beispiele für unterschiedliche Herleitungen:

- Gebühren: Kapital wächst, während kleine Entnahmen langfristig einen großen Abstand erzeugen.
- Kredit: Eine Rate teilt sich sichtbar in Zins und Tilgung, während die Restschuld sinkt.
- Diversifikation: mehrere stark schwankende Einzelverläufe ergeben gemeinsam einen ruhigeren Gesamtverlauf.
- Inflation: gleicher Geldbetrag bleibt nominal gleich, während die sichtbare Kaufmenge abnimmt.
- Rebalancing: Portfolio-Gewichte driften auseinander und werden gezielt auf das Soll zurückgeführt.

Diese Beispiele sind **keine Vorlagenliste**. Für jedes neue Thema darf und soll eine neue sichtbare Lösung entstehen.

### 5. Technik erst danach wählen

Nach der Mechanik wird entschieden, wie sie am besten umgesetzt wird:

- pure Remotion
- SVG / Pfad- oder Vektoranimation
- Datenvisualisierung
- physische Objektlogik
- Typografie
- räumliche / 2.5D-Mechanik
- Flow-Bild + Remotion Hybrid
- Lottie / Icons / SVG als Support
- Kombinationen

Werkzeuge folgen dem Inhalt.

## Keine feste Animationsbibliothek als Auswahlmenü

Unzulässig ist diese Logik:

```text
Wir haben bereits Animation A, B, C, D.
→ Welche davon passt ungefähr?
```

Gewünscht ist:

```text
Sprechpunkt
→ Verständnisziel
→ sichtbare Frage
→ individuell beste Mechanik
→ passende Technik
→ Umsetzung
```

Bestehende Mechaniken dürfen wiederverwendet werden, **wenn sie inhaltlich wirklich die beste Lösung sind**. Dann muss Phase 1 ausdrücklich begründen, warum die Wiederverwendung besser ist als eine neue Darstellung.

## Wiederverwendung ist nicht verboten

Wiederverwendung ist sinnvoll, wenn sie zum Beispiel:

- einen direkten Vergleich zwischen zwei Szenen ermöglicht,
- bewusst Kontinuität erzeugt,
- dieselbe finanzielle Ursache erneut zeigt,
- für den Zuschauer klarer ist als eine künstlich neue Animation.

Nicht zulässig ist Wiederverwendung nur aus Bequemlichkeit, Zeitersparnis oder weil eine fertige Komponente existiert.

## Pflicht-Metadaten in Phase 1

Jede Animationsszene eines neuen Reels dokumentiert zusätzlich unter `phase1MotionDirection`:

- `spokenPoint` — konkrete finanzielle Aussage der Szene
- `viewerMustUnderstand` — sichtbares Verständnisziel
- `visualQuestion` — welche sichtbare Frage beantwortet die Animation?
- `chosenMechanism` — konkrete Hauptmechanik
- `mechanismRationale` — warum erklärt genau diese Mechanik den Inhalt am besten?
- `reuseDecision` — `invent-new` oder `reuse-best-fit`
- `reusedTechniqueId` — nur bei bewusster Wiederverwendung
- `reuseJustification` — konkrete Begründung bei Wiederverwendung

Diese Felder kommen **vor** der technischen Umsetzung und ergänzen `motionDesign` aus Future Reel Presentation V1.

## Verhältnis zu `motionDesign`

`phase1MotionDirection` beantwortet:

> **Warum ist dies die richtige Animation für diesen Sprechpunkt?**

`motionDesign` beantwortet danach:

> **Wie sieht diese gewählte Animation konkret aus und wodurch unterscheidet sie sich sichtbar?**

Die Reihenfolge ist verbindlich:

```text
phase1MotionDirection
→ motionDesign
→ animation.tsx
```

Nicht umgekehrt.

## Qualitätsregel

Eine Animationsszene ist in Phase 1 erst fertig, wenn man ohne Blick auf den Code erklären kann:

1. was der Zuschauer verstehen soll,
2. was dafür sichtbar passiert,
3. warum genau diese Mechanik gewählt wurde,
4. warum sie nicht nur eine zufällige vorhandene Animation ist.

## Support-Werkzeuge

Lottie, Icons und SVGs dürfen weiterhin frei eingesetzt werden.

Sie dürfen aber niemals die kreative Herleitung ersetzen.

Beispiel:

- **falsch:** „Wir haben eine Lupe-Lottie, also bauen wir eine Prüf-Szene.“
- **richtig:** „Der Zuschauer muss sehen, dass Gebühren erst geprüft werden; eine kleine Lupe unterstützt diese bereits gewählte Mechanik.“

## Zusammenhang mit anderen FinanzNeo-Regeln

Dieser Standard ergänzt:

- `docs/FINANZNEO-VISUAL-SELECTION-RULE.md`
- `docs/FUTURE-REEL-PRODUCTION-V3.md`
- `docs/FUTURE-REEL-PRESENTATION-V1.md`
- Reel Layout V5
- Phase-1-Animationscode-Vertrag

Er ersetzt keine bestehenden Safe-Zones, Header-/Caption-Regeln, V9-Bildwelt oder Render-QA.

## Kurzregel

> **Phase 1 analysiert jede Animationsszene von Grund auf. Erst Inhalt und Verständnisziel, dann sichtbare Mechanik, danach Technik. Keine feste Animationsliste. Wiederverwendung nur, wenn sie nachweislich die beste inhaltliche Lösung ist.**
