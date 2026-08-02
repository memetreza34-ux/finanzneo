# Aktivierungs-Checkliste für FinanzNeo-Animationen

Diese Checkliste verhindert, dass die vorbereitete Foundation versehentlich zu früh in die produktive `image-first-lite`-Pipeline gelangt.

## Gate 1 – Technische Foundation

- [ ] `npm run finance:animation-structure` erfolgreich
- [ ] `npm run finance:animation-isolation` erfolgreich
- [ ] `npm run finance:animation-typecheck` erfolgreich
- [ ] `npm run finance:animation-test` erfolgreich
- [ ] `npm run finance:animation-gallery:still` erfolgreich
- [ ] sequenzieller Galerie-Still erfolgreich
- [ ] GitHub-Actions-Lauf enthält echte Steps und Logs

## Gate 2 – Visuelle Freigabe

Für jedes der zwölf Templates müssen mindestens Start-, Mittel- und Endframe geprüft werden:

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

- [ ] keine abgeschnittenen Texte
- [ ] keine überlappenden Labels
- [ ] keine sichtbaren Sprünge oder Doppelanimationen
- [ ] alle Prozentanzeigen stimmen mit den Daten überein
- [ ] alle Geldwerte stimmen mit den Berechnungen überein
- [ ] negative Ergebnisse werden nicht positiv eingefärbt
- [ ] Startframe enthält keine künstlichen Mindestbalken
- [ ] Endframe entspricht exakt den gelieferten Daten

## Gate 3 – Eingabe- und Fallback-Sicherheit

- [ ] unbekannte JSON-Daten laufen ausschließlich über `parseFinanceAnimationRequest`
- [ ] unbekannte vollständige Szenen laufen ausschließlich über `parseFinanceAnimationScene`
- [ ] Planung unbekannter Requests läuft ausschließlich über `planFinanceAnimationInput`
- [ ] Rendering unbekannter Szenen läuft ausschließlich über `SafeFinanceAnimationRenderer`
- [ ] ungültige Daten erzeugen immer den bestehenden Bild-Fallback
- [ ] Fallback-Gründe sind verständlich und enthalten keine internen Fehlercodes
- [ ] Mehrdeutigkeit zwischen Templates führt zum Bildmodus
- [ ] Input-Limits wurden mit realistischen Maximalwerten getestet

## Gate 4 – Test-Reel

- [ ] separates Testprojekt mit mindestens fünf Szenen erstellt
- [ ] mindestens eine Bildszene enthalten
- [ ] mindestens eine Hybrid-Szene enthalten
- [ ] mindestens eine Vollanimationsszene enthalten
- [ ] mindestens ein absichtlich ungültiger Fall fällt korrekt auf Bild zurück
- [ ] Audio, Szenendauer und Animation sind synchron
- [ ] vollständiger 9:16-Render erfolgreich
- [ ] Render visuell manuell freigegeben

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
- direkter Import von `FinanceAnimationRenderer` in die Produktion
- Umgehung von Parser oder Validator
- Aktivierung mehrerer Feature Flags in einem Schritt
- Entfernung des Bild-Fallbacks
- Merge des Draft-PRs ohne bestätigten Test- und Renderlauf

## Aktueller Zustand

Alle produktionsbezogenen Feature Flags bleiben deaktiviert. Die Foundation ist vorbereitet, aber nicht freigegeben. Der Pull Request bleibt Draft, bis die technischen Prüfungen tatsächlich ausgeführt und die Galerie visuell geprüft wurden.
