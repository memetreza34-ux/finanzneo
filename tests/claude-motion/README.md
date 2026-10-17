# Claude Motion Test 01 — Ein Abo: 9,99 € × 12 Monate

## Ziel

Ein **wirklich gerenderter 12-Sekunden-Motion-Graphics-Clip** für den FinanzNeo-YouTube-Kanal. Kein Konzeptpapier, kein bloßes Beispiel und keine neue generische Motion-Bibliothek. Die gesamte Szene muss Claude Code Opus 5.5 selbst auf Grundlage der vorhandenen Light-Motion-V3-Engine konzipieren und implementieren.

Der Test ist strikt **ein isoliertes Experiment**, keine Produktionsfreigabe. Es werden keine echten Nutzerbilder, Cover, Audio- oder YouTube-Projekte geändert.

## Konkreter Sprechertext (nur Timing-/Erklärungsreferenz)

> „Neun Euro neunundneunzig im Monat klingt nach wenig. Aber zwölf Abbuchungen im Jahr ergeben insgesamt hundertneunzehn Euro und achtundachtzig Cent – für ein einziges Abo.“

Keine Text-zu-Sprache, keine künstliche Audiodatei, keine Untertitel: Es soll ein **stummer Motion-Clip** entstehen. Die Bewegungsdramaturgie folgt trotzdem dem Sprechertext.

## Mathematisch verbindlich

- 1 Monat: **9,99 €**, also **999 Cent**.
- 12 Monate, ohne Preisänderung und ohne Gebühren: **12 × 999 Cent = 11.988 Cent = 119,88 €**.
- Ein einzelnes Abo. Nicht auf mehrere Abos hochskalieren.
- Ein laufender Jahresbetrag muss mathematisch zu den **bereits gezeigten Abbuchungen** passen.
- Keine fiktiven Zusatzgebühren, Gewinnprozente oder nicht belegten Diagrammachsen.

Kanonischer maschinenlesbarer Vertrag: `tests/claude-motion/brief.json`. Der User muss für diesen Test keine Daten nachliefern.

## Erwartete visuelle Geschichte

1. **Frame 0–59 (0–2 s):** eine klare Alltags-Abbuchung von 9,99 €; der Zuschauer erkennt die wiederkehrende monatliche Belastung, ohne eine lange Texttafel lesen zu müssen.
2. **Frame 60–264 (2–8,8 s):** zwölf nachvollziehbare monatliche Abbuchungen visualisieren. Kalender-/Zeitverlauf und die steigende Gesamtsumme müssen zusammenhängen. Es darf kein bloßer Loading-Bar-/Zahlencounter-Fake sein.
3. **Frame 265–314 (8,8–10,5 s):** die entscheidende Transformation zur echten Jahressumme **119,88 €**; das finale Ergebnis nicht schon im Startzustand preisgeben.
4. **Frame 315–359 (10,5–12 s):** klares, stabiles und lesbares Ergebnis. Nichts Wichtiges soll hektisch ausblenden.

Der Mechanismus ist **nicht** fest vorgegeben. Claude prüft zuerst **drei substanziell unterschiedliche Konzepte** und wählt die verständlichste, hochwertigste Form. Kein bloßes Umfärben eines bestehenden Democharts.

## Design Lock

- **YouTube 1920 × 1080, 30 fps, exakt 360 Frames**, helle hochwertige Editorial-2D-Welt.
- Keine dunkle Reel-/3D-Welt; keine glitzernden Effekte, keine KI-Slop-Symbole, keine dekorative Riesenheadline.
- Gut lesbare Euro-Beträge, sinnvolle Beschriftungen, sichtbare Bedeutung durch Objekte und echte Bewegung.
- Große kompositorische Elemente, großzügige aber nicht leere Flächen; mobile Lesbarkeit in verkleinertem Preview berücksichtigen.
- Timeline-/Bewegungsmechanik muss die 12 Monate und die 12 Zahlungsereignisse **eindeutig** kommunizieren.
- Keine generischen, gleich aussehenden drei Karten mit Slide/Fade. Keine reinen Zahlencounter als komplette Animation.
- Verwende `src/youtube-motion/light-v3/` als Grundgerüst, wenn sinnvoll; eigene Komponenten sind erlaubt, sofern sie die Idee klarer vermitteln.

## Exakte technische Abgabe (Claude erzeugt erst beim Testlauf)

1. Quelldatei: `src/youtube-motion/tests/SubscriptionYearTest.tsx` mit benanntem Export `SubscriptionYearTest`.
2. Registrierte Composition **`ClaudeMotionSubscriptionYearTest`** in `src/root/ExperimentCompositions.tsx`; **nicht** in `ProductionCompositions.tsx`.
3. Quellcode ist deterministisch (kein `Math.random`, keine Timer/Runtime-Fetches), TS-typisiert, an echte Daten gebunden. Animation via Remotion-Frames.
4. MP4: `out/claude-motion-test/SubscriptionYearTest.mp4`.
5. Kontaktbogen aus der **gerenderten MP4**, vier Zeitpunkte: `out/claude-motion-test/qa/contact.png`.
6. Claude erstellt `out/claude-motion-test/review.md`: drei Ideen + Begründung der Auswahl, tatsächlich geprüfte Frames, 1–10-Bewertung für Verständlichkeit, Motion, Ästhetik und Lesbarkeit, gefundene/behobene Fehler sowie offene Mängel.

## Abnahmekette (keine Abkürzungen)

```bash
npm run motion:claude:test:setup
npm run motion:claude:test:preflight
npm run typecheck
npm run motion:claude:test:render
npm run motion:claude:test:qa
```

Danach die echte `mp4` ansehen und die Bilder bei 10/35/65/90 % inhaltlich prüfen. Die automatische QA belegt **nur Codec, Format, Timing und sichtbare Frame-Unterschiede**. Sie beweist keine gestalterische Qualität. Bei einem Qualitätsproblem die originale Komponente verbessern, erneut rendern und erneut prüfen.

**Echte Qualitätsabnahme**: Ohne verständlichen start→change→result-Ablauf, korrekte Beträge, Lesbarkeit und überzeugendes Motion-Design nicht als PASS markieren. Bei schlecht lesbaren Kontakten, problematischer Datenlogik oder generischen Chart-Übergängen weiter verbessern. Kein Placebo-Check, kein Test durch bloßen Source-String-Vergleich.

## Bei Fehlschlag

Diagnose ausgeben und an der Ursache beheben. Nichts aus `CLAUDE.md`, `AGENTS.md`, bestehenden Validatoren oder der bestehenden V3-Engine abschwächen. Kein Merge nach `main`, keine Überschreibung bestehender Videos. Änderungen verbleiben auf dem Test-Branch.

## Test-Ergebnis dem Nutzer

Zum Schluss ausschließlich reale Ergebnisse nennen: Commit-/Änderungsdateien, getestete Befehle mit PASS/FAIL, genauen Video-/Kontaktbogenpfad und reale visuelle Schwächen. **Keinen erfolgreichen Test behaupten**, wenn das Rendern/visuelle Öffnen nicht möglich war.
