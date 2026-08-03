# Aktivierungs-Checkliste für FinanzNeo-Animationen

Diese Checkliste verhindert, dass die vorbereitete Foundation versehentlich zu früh in die produktive `image-first-lite`-Pipeline gelangt.

## Gate 1 – Technische Foundation

- [ ] `npm run finance:animation-structure` erfolgreich
- [ ] `npm run finance:animation-isolation` erfolgreich
- [ ] `npm run finance:animation-typecheck` erfolgreich
- [ ] `npm run finance:animation-test` erfolgreich
- [ ] `npm run finance:animation-gallery:still` erfolgreich
- [ ] `npm run finance:animation-gallery:sequence-still` erfolgreich
- [ ] `npm run finance:animation-gallery:matrix-still` erfolgreich
- [ ] `npm run finance:animation-test-reel:still` erfolgreich
- [ ] GitHub-Actions-Lauf enthält echte Steps und Logs
- [ ] Galerie-, Frame-Matrix- und Fallback-Artefakte wurden hochgeladen

## Gate 2 – Visuelle Freigabe

Die Composition `FinanceAnimationFrameMatrix` muss für jedes der zwölf Templates drei reproduzierbare Zustände zeigen:

- Startframe `0`
- Mittelframe `90`
- Endframe `179`

Das ergibt insgesamt 36 zu prüfende Zustände.

Templates:

- [ ] `money-flow`
- [ ] `budget-split`
- [ ] `compound-growth`
- [ ] `portfolio-allocation`
- [ ] `inflation-erosion`
- [ ] `debt-paydown`
- [ ] `monthly-investment`
- [ ] `before-after-comparison`
- [ ] `risk-return-scale`
- [ ] `timeline-milestones`
- [ ] `income-expense-balance`
- [ ] `tax-fee-flow`

Prüfkriterien:

- [ ] alle 36 Zellen sind vorhanden und eindeutig beschriftet
- [ ] keine abgeschnittenen Texte
- [ ] keine überlappenden Labels
- [ ] keine sichtbaren Sprünge oder Doppelanimationen
- [ ] alle Prozentanzeigen stimmen mit den Daten überein
- [ ] alle Geldwerte stimmen mit den Berechnungen überein
- [ ] negative Ergebnisse werden nicht positiv eingefärbt
- [ ] Startframe enthält keine künstlichen Mindestbalken
- [ ] Mittelframe zeigt einen nachvollziehbaren Erklärungsfortschritt
- [ ] Endframe entspricht exakt den gelieferten Daten
- [ ] Bewegung bleibt erklärend und nicht dekorativ überladen

## Gate 3 – Eingabe- und Fallback-Sicherheit

- [ ] unbekannte JSON-Daten laufen ausschließlich über `parseFinanceAnimationRequest`
- [ ] unbekannte vollständige Szenen laufen ausschließlich über `parseFinanceAnimationScene`
- [ ] Planung unbekannter Requests läuft ausschließlich über `planFinanceAnimationInput`
- [ ] Rendering unbekannter Szenen läuft ausschließlich über `SafeFinanceAnimationRenderer`
- [ ] Getter und Setter werden abgelehnt, ohne ausgeführt zu werden
- [ ] Symbol-Schlüssel werden abgelehnt
- [ ] `__proto__`, `prototype` und `constructor` werden auf allen Eingabeebenen blockiert
- [ ] akzeptierte Daten werden in kopierte Null-Prototyp-Container überführt
- [ ] verschachtelte Objekte, verschachtelte Arrays und ausführbare Werte werden blockiert
- [ ] hostile Proxies erzeugen ein kontrolliertes Fehlerergebnis statt einer Ausnahme
- [ ] ungültige Daten erzeugen immer den bestehenden Bild-Fallback
- [ ] dynamische Fallbacks erhalten ausschließlich eingefrorene Fehler- und Warnungslisten
- [ ] das rohe untrusted Eingabeobjekt wird nicht an Fallback-Komponenten weitergegeben
- [ ] Fallback-Gründe sind verständlich und enthalten keine internen Stacktraces
- [ ] Mehrdeutigkeit zwischen Templates führt zum Bildmodus
- [ ] Input-Limits wurden mit realistischen Maximalwerten getestet

## Gate 4 – Vollständiges Test-Reel

Das isolierte Test-Reel muss alle registrierten Templates enthalten:

- [ ] alle zwölf Templates genau einmal als gültige Szene enthalten
- [ ] Reihenfolge wird aus `FINANCE_ANIMATION_TEMPLATES` abgeleitet
- [ ] vollständiger Hybridpfad wurde für alle Fixtures simuliert
- [ ] vollständiger Vollanimationspfad wurde für alle Fixtures simuliert
- [ ] Pflichtdaten-Fallback enthalten
- [ ] Fallback für unsichere Datenstruktur enthalten
- [ ] Fallback für ungültigen Szenenmodus enthalten
- [ ] stabile `FinanceAnimationFallbackPreview`-Composition rendert erfolgreich
- [ ] vollständiger 9:16-Render über `npm run finance:animation-test-reel:render` erfolgreich
- [ ] Szenendauer und Animation sind synchron
- [ ] alle Fallback-Karten zeigen die erwarteten Parserfehler
- [ ] vollständiger Render wurde visuell manuell freigegeben

## Gate 5 – Kontrollierte Produktionsanbindung

Erst nach Abschluss der vorherigen Gates:

- [ ] produktive Scene-Plan-Verträge separat erweitern
- [ ] sichere Parsergrenze vor jede Animationsszene setzen
- [ ] `SafeFinanceAnimationRenderer` hinter dem bestehenden Bild-Fallback anbinden
- [ ] zuerst nur `allowHybrid` aktivieren
- [ ] automatische Auswahl weiterhin deaktiviert lassen
- [ ] mindestens ein reales Reel mit Hybridmodus prüfen
- [ ] erst danach `allowFullAnimation` aktivieren
- [ ] automatische Auswahl zuletzt und separat aktivieren

## Verbotene Abkürzungen

Vor Abschluss aller Gates nicht erlaubt:

- direkte Registrierung der Galerie im produktiven Root
- direkte Registrierung des Test-Reels im produktiven Root
- direkter Import von `FinanceAnimationRenderer` in die Produktion
- Umgehung von Parser oder Validator
- Ausführung unbekannter Getter, Setter oder Funktionen
- Aktivierung mehrerer Feature Flags in einem Schritt
- Entfernung des Bild-Fallbacks
- Merge des Draft-PRs ohne bestätigten Test- und Renderlauf

## Aktueller Zustand

Alle produktionsbezogenen Feature Flags bleiben deaktiviert. Die Foundation ist vorbereitet, aber nicht freigegeben. Der Pull Request bleibt Draft, bis die technischen Prüfungen tatsächlich ausgeführt, die Frame-Matrix und Fallback-Vorschau bestätigt und das vollständige Test-Reel visuell geprüft wurden.
