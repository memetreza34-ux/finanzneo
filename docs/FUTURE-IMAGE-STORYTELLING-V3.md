# FinanzNeo Future Image Storytelling V3

Contract: `finanzneo-image-storytelling-v3`

Gilt nur für Reels, die nach Aktivierung dieses Standards neu mit `reel:create` angelegt werden. Bestehende Reels und bereits erzeugte Bilder werden nicht migriert oder verändert.

## Kernregel

**Literal first, creative second.**

Ein statisches Flow-Bild beginnt bei der echten Situation des gesprochenen Beats. Kreativität soll diese Situation klarer, interessanter und hochwertiger machen — nicht durch eine beliebige Metapher ersetzen.

## Reihenfolge für jede Bildszene

1. **Exakten Voiceover-Beat lesen.** Welche Handlung, welches Objekt, welcher Zustand oder welche Konsequenz wird wirklich genannt?
2. **Reale Situation definieren.** Was würde man in der echten Welt sehen?
3. **Kontextanker festlegen.** Zum Beispiel Überweisung, Rechnung, Kreditkarte, Konto, Einkauf, Vertrag, Bankkontakt oder Zahlung.
4. **Voiceover-Match festlegen.** Welches konkrete sichtbare Detail beweist die gesprochene Aussage?
5. **Transferability-Test bestehen.** Könnte dasselbe Bild unverändert zu fünf anderen Finanzthemen passen, ist es zu generisch.
6. **Erst danach Stil und kreative Inszenierung festlegen.**

## Pflichtfelder vor Google Flow

Jeder individuelle `bildprompt.txt` enthält:

- `VISUAL_STRATEGY: literal` oder `metaphor`
- `LITERAL_REAL_WORLD_SITUATION`
- `REAL_WORLD_CONTEXT_ANCHOR`
- `VOICEOVER_VISUAL_MATCH`
- `TRANSFERABILITY_TEST: PASS - ...`
- `METAPHOR_JUSTIFICATION`

Bei `VISUAL_STRATEGY: literal` muss `METAPHOR_JUSTIFICATION: none` gesetzt sein.

Bei `VISUAL_STRATEGY: metaphor` ist eine konkrete Begründung Pflicht: Warum erklärt die reale Situation diesen Beat visuell schlechter als die Metapher?

## Subtitle-off-Test

Überschrift, Untertitel und erklärenden Begleittext gedanklich entfernen.

Ein fremder Zuschauer muss anhand des Bildes ungefähr erkennen können, **welcher konkrete Vorgang** erklärt wird. Reine Stimmung oder ein allgemeines Finanzmotiv reicht nicht.

## Transferability-Test

Frage vor der Bildgenerierung:

> Könnte dieses Bild ohne Änderung auch zu fünf anderen Finanzthemen verwendet werden?

Wenn ja: **FAIL.** Motiv spezifischer planen.

Beispiel:

- Schlecht: Goldmünze vor roter Schranke. Könnte Kredit, Gebühren, Betrug, Sparen oder Schulden bedeuten.
- Gut: Überweisungsbeleg mit Empfängername und IBAN, sichtbare Abweichung, Zahlung noch nicht freigegeben.

## Metaphern

Metaphern bleiben ausdrücklich erlaubt. Sie sind aber ein **Fallback**, nicht der Standard für statische Bilder.

Insbesondere folgende Motive dürfen nicht automatisch aus dem Begriff „Ursache/Wirkung“ entstehen:

- Förderbänder
- Schienen
- Schranken
- Käfige oder Gitter
- Fantasie-Portale
- Sortieranlagen
- große mechanische Hebel
- beliebige Maschinen ohne realen Bezug zum Sprechbeat

Wenn eines dieser Motive die beste Erklärung ist, kann es verwendet werden — aber nur mit `VISUAL_STRATEGY: metaphor` und einer konkreten `METAPHOR_JUSTIFICATION`.

## Gute Referenzlogik

Ein gutes Bild zeigt den Satz möglichst direkt:

- Datum wird erklärt → Kalenderdatum + betroffener Finanzvorgang.
- Name und IBAN werden geprüft → genau Name und IBAN werden sichtbar geprüft.
- Bank kontaktieren → erkennbare Bank-/Kontakt-Situation plus betroffener Vorgang.
- Rückforderung hängt vom Empfänger ab → Rückforderungsanfrage erreicht den Empfänger; Rückgabe ist sichtbar nicht automatisch.

## Was weiterhin gilt

V9-Bildwelt, 1:1-Flow-Format, tiefschwarzer Hintergrund, kurze Objektlabels, Strict-Single-Job Flow V3 und alle bisherigen Sicherheits-/Layoutregeln bleiben unverändert.

V3 ändert **nicht den Look**, sondern die Auswahl und Präzision des Motivs.
