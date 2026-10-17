# FinanzNeo — kontinuierliche Qualitätsverbesserung (Priorität 0)

> Oberste dauerhafte Produktionspriorität für **Reels und YouTube-Longform**. Ergänzt `CLAUDE.md`, ohne bestehende Video-, Marken- oder Sicherheitsregeln aufzuweichen.

## Ziel

Mit jedem Video **messbar oder nachvollziehbar besser** werden und langfristig exzellente, eigenständige, fachlich korrekte und visuell überzeugende YouTube-Erklärvideos produzieren. Nicht möglichst viele Regeln/Animationen anhäufen, sondern das **tatsächliche Zuschauererlebnis** verbessern. „Perfekt“ ist ein Qualitätsziel, kein ohne Prüfung behaupteter Zustand.

## Verbindliche Lernschleife — für jedes einzelne Video

1. **Vor Phase 1:** `docs/VERBESSERUNGSLOG.md` und die letzten relevanten Video-Reviews lesen. Die 1–3 wichtigsten noch offenen Verbesserungen explizit im neuen Briefing übernehmen; dokumentieren, woran die Umsetzung erkennbar sein soll.
2. **Während Phase 1:** Fakten, Skript/Hook, Spannungsbogen, visuelle Eindeutigkeit, Bildvariation, Motion-Auswahl und Bild-/Skript-Synchronität auf Schwachstellen prüfen; Qualität vor fester Visualzahl, Effektmenge oder Geschwindigkeit.
3. **Nach einem echten Render:** Das **komplette finale Video** mit Ton anschauen und **kritische** Passagen anhand tatsächlicher Frames und Zeitstempel prüfen, nicht nur Dateien, Absichtserklärungen, IDs oder Pixelbewegung. Prüfen: Hook (erste Sekunden), Verständlichkeit ohne Vorwissen, korrekte Zahlen/Quellen, relevante Bilder, individuelle Animation, Abwechslung, natürliche Schnitte, Text-/Caption-Lesbarkeit, Audio/SFX, Cover/Thumbnail, Ende/Payoff, Export. Auch gute Elemente notieren, die erhalten bleiben sollen.
4. **Nach jeder Videoabnahme und nach Nutzerfeedback:** Im jeweiligen Projektordner ein `VIDEO-REVIEW.md` anlegen/aktualisieren (Reel: `05-projektdateien/`; YouTube: `06-projektdateien/`). Benenne konkrete Fehler/Schwächen **mit Szenen-/Zeitangabe**, Ursache, Auswirkung auf Zuschauer, Bewertung und umsetzbaren Fix. Kritik des Nutzers hat Vorrang vor pauschalen Selbsteinschätzungen.
5. **Systemlernen:** Die wichtigsten Erkenntnisse in `docs/VERBESSERUNGSLOG.md` nachtragen. Wiederkehrende oder systematische Fehler **an der gemeinsamen Pipeline, Vorlage, Agent-Anweisung oder dem Test** beheben – nicht nur im einzelnen Video kaschieren. Bei geeigneten technischen Problemen einen Regressionstest hinzufügen; Tests und Qualitätsgates niemals abschwächen, um grün zu werden.
6. **Vor dem nächsten Video:** Offene Prioritäten mit den Änderungen abgleichen und **nachprüfen**, ob der bekannte Fehler tatsächlich nicht erneut auftritt. Ohne Nachweis nicht als behoben markieren.

## Qualitätsbeurteilung statt Formalkontrolle

**Technisch bestanden ≠ inhaltlich gut.** Prüfergebnisse aus Render-QA, CI und vorhandene Komponenten sind Indizien, ersetzen aber keine Sicht-/Hörprüfung. Die beste Lösung kann eine einfache Tabelle, ein Diagramm, eine Szene aus dem Alltag, ein Flow-Bild oder eine komplexere Animation sein; Auswahl immer aus dem Verständnisziel.

Nicht jede Szene muss maximal animiert oder die visuelle Welt bei jedem Video neu gestaltet werden. Konsistente Markenidentität bewahren; Wiederholung ohne Erklärwert vermeiden. Vermeide starre Quoten und künstlich gleich lange Bilder.

## Dokumentationsformat eines Video-Reviews

- Projekt, Video-Version, Format, Datum und tatsächlicher Review-Gegenstand (z. B. MP4 mit Pfad)
- Was gut funktioniert hat (mit Evidenz)
- Was nicht funktioniert hat (Szene/Zeitstempel, **beobachteter** Fehler, konkrete Ursache oder `Ursache offen`)
- Priorisierte Änderungen: P0 = gravierend/falsch/leer, P1 = wesentliche Verständlichkeits-/Qualitätsschwäche, P2 = Feinschliff
- Maximal drei nächste konkrete Maßnahmen: verantwortliche Stelle/Datei, erwarteter Nutzen, Nachweis/Test
- Nutzerfeedback und – sofern **wirklich verfügbar** – Leistungsdaten (z. B. CTR, Retention, Abbruchstellen)
- Status: `OFFEN`, `UMGESETZT` oder `NACHGEPRÜFT`. `UMGESETZT` allein ist kein Wirksamkeitsnachweis.

**Keine erfundenen Messwerte**, Publikumsreaktionen, Sichtprüfungen oder erfolgreichen Tests. Wenn noch kein fertiger Render existiert, den Zustand ausdrücklich als `NOCH NICHT VISUELL GEPRÜFT` festhalten.

## Sicherheit und Grenzen

- Bereits fertige/geschützte Videos oder Assets nicht ohne konkreten Nutzerauftrag überschreiben oder löschen.
- Änderungen an gemeinsamen Regeln/Code auf eigenem Branch entwickeln, testen und über einen PR vorschlagen; nicht direkt `main` verändern oder ohne Freigabe mergen.
- Bei einer Verbesserung nie korrektes Verhalten aus früheren Videos unbeabsichtigt verschlechtern: Regressionen explizit prüfen.
- Auf Systemfehler, falsche Inhalte, Leerbilder oder fehlende Captions zuerst reagieren; rein dekorative Optimierungen sind nachgeordnet.

## Abschlussdefinition

Ein Video hat erst eine **ausgewertete Verbesserungsschleife**, wenn ein konkretes Review dokumentiert, mindestens eine sinnvolle Erkenntnis ins zentrale Log übertragen und die nächste überprüfbare Maßnahme benannt ist. Ein Video kann technisch `FINAL_COMPLETE` sein, ohne dass daraus schon gelernt wurde.
