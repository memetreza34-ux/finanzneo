# FinanzNeo — Reel-Strategie V1

Diese Datei beschreibt nur Dramaturgie, Sprache und redaktionelle Qualität. Technische Grenzwerte stehen ausschließlich in `engine/config/finance-v1.json`; Produktionsablauf und Pflichtdateien stehen in `CLAUDE.md`.

## Format

- 60–75 Sekunden, ideal ca. 68 Sekunden
- 150–200 Wörter
- eine zentrale Zuschauerfrage
- drei bis fünf Hauptgedanken
- ein klarer Payoff
- 10–14 visuelle Beats
- direkte deutsche „du“-Ansprache

## Spannungsbogen

```text
0–2 s      Hook: Hauptmotiv, Konflikt und persönliche Folge sofort sichtbar
2–7 s      Relevanz: Warum betrifft das den Zuschauer?
7–50 s     Entwicklung: Ursache → Mechanismus → Konsequenz
50–68 s    Payoff: Rechnung, Vergleich oder klare Antwort
letzte 3–5 s CTA: kurze Handlung mit konkretem Nutzen
```

Die Zeitblöcke sind Richtwerte. Der gesprochene Inhalt wird in `scene-plan.json` vollständig auf `voiceText`-Blöcke verteilt und anschließend am finalen Transkript ausgerichtet.

## Redaktionelle Regeln

- Hook verspricht nur, was das Reel erklärt.
- Konflikt oder persönliche Konsequenz wird spätestens innerhalb der ersten 1,5 Sekunden sichtbar.
- persönliche Relevanz erscheint in den ersten Sekunden.
- Zahlen und veränderliche Finanzbehauptungen erhalten Quellen im Szenenplan.
- Der Wortlaut darf niemals stärker oder absoluter sein als die Quelle.
- keine Begrüßung und kein Intro.
- keine künstliche Panik oder Get-rich-quick-Sprache.
- keine Wiederholung derselben Aussage in mehreren ähnlichen Szenen.
- jeder Beat beantwortet genau einen Teil der zentralen Frage.

## Drei Textebenen

Jede Szene verwendet eine klare Hierarchie:

1. oben: kurze Zwischenüberschrift mit semantischem Icon
2. Mitte: verdichtete Hauptaussage, Zahl, Vergleich oder Prozess
3. unten: gesprochene Captions

Kicker, Headline und Caption dürfen nicht denselben Satz wiederholen. Die Headline verdichtet die Aussage als Folge, Kontrast oder Merksatz.

## Regie vor Layout

Für jeden Beat zuerst beantworten:

1. Was muss der Zuschauer jetzt verstehen?
2. Welche sichtbare Handlung erklärt es?
3. Welche Information spricht die Stimme genau in dieser Szene?
4. Welches vorhandene Layout transportiert es am klarsten?
5. Welche Assets oder Remotion-Elemente sind wirklich nötig?

Nicht zuerst ein Template wählen und danach Inhalt hineinpressen.

## Bild und Remotion

Generierte Bilder liefern:

- konkrete Welt und Hauptmotiv
- Gegenstände und Metaphern
- Raum, Licht und Materialität
- trennbare Vorder- und Hintergründe

Remotion liefert:

- editierbare Zahlen und Labels
- Kurven, Vergleiche und Rechnungen
- Fokus, Überblendungen und Zustandswechsel
- zeitliche Entwicklung

Kritische Werte werden möglichst nicht dauerhaft in KI-Bilder eingebrannt.

## Keine toten Stellen

- Eine echte inhaltliche Veränderung folgt spätestens ungefähr alle 2,5–2,8 Sekunden.
- `visualPhases` beginnen immer bei `at: 0` und beschreiben tatsächlich sichtbare Zustände.
- Zoom, Glow, Text-Fade oder langsames Schweben zählen nicht allein als neue Phase.
- Reine Text-Punch-Szenen bleiben höchstens 4,5 Sekunden lang.
- Pro Reel ist höchstens eine reine Textszene erlaubt; alle anderen längeren Szenen brauchen Motiv, Zahl, Vergleich, Chart, Rechnung oder Prozess.
- Generierte Bilder entwickeln sich durch Fokus, Assetwechsel, editierbare Information oder Zustandsänderung – nicht nur durch Ken-Burns-Drift.

## Audio und Timing

```text
Originalstimme
→ Pausen kürzen
→ leicht beschleunigen
→ normalisieren
→ finale Stimme speichern
→ finale Stimme transkribieren
→ Szenen anhand der transkribierten Wörter ausrichten
```

Keine proportionale Streckung eines alten Szenenplans. Kein zusätzliches `playbackRate` im Renderer.

Die technische Lautheit bleibt stabil, aber Hook, Wendepunkt, wichtige Zahl und Payoff werden hörbar stärker betont. Keine monotone Betonung.

Ohne Musikbett sind typischerweise drei bis fünf leise semantische SFX sinnvoll: Zahl landet, Warnung erscheint, Vergleich kippt oder Ergebnis bestätigt sich. Kein Effekt nur wegen eines Schnitts.

## Captions

- Wort-Zeitstempel stammen aus der finalen Stimme.
- aktuelles Wort hervorheben, nicht jedes Wort einzeln hineinpoppen.
- kein schwarzer Kasten.
- innerhalb der Plattform-Sicherheitszone; nicht zu nah am unteren Rand.
- Caption unterstützt die Szene, ist aber nicht ihre einzige verständliche Ebene.
- Captionende und Audioende müssen innerhalb der konfigurierten Toleranz liegen.

## CTA

- 3–5 Sekunden
- Handlung und Nutzen sofort lesbar
- kein leerer Nachlauf
- letzte gesprochene Wörter, letzte Caption und Reel-Ende fallen sauber zusammen

## Pflichtprüfung

- Frame 0 als Einzelbild prüfen.
- Hook-Konflikt spätestens bei 1,5 Sekunden prüfen.
- Hook, Übergänge, Payoff und CTA als Kontrollframes rendern.
- Smartphone-Lesbarkeit und Caption-Safe-Zone prüfen.
- Audio-, Caption- und Planende vergleichen.
- keine langen statischen Passagen oder übergroßen Phasenabstände.
- kein Zoom als einzige Entwicklung.
- höchstens eine reine Textszene.
- keine Füll-Icons oder dreifache Inhaltsdopplung.
- Fakten und genaue Formulierung gegen die im Szenenplan gespeicherten Quellen prüfen.