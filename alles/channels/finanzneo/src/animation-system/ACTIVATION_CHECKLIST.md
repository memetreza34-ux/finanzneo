# Aktivierungs-Checkliste für FinanzNeo-Animationen

Diese Checkliste verhindert, dass die vorbereitete Foundation versehentlich zu früh in die produktive `image-first-lite`-Pipeline gelangt.

## Gate 1 – Technische Foundation

- [ ] `npm run finance:animation-structure` erfolgreich
- [ ] Foundation-Strukturcheck erfolgreich
- [ ] exakter Datenvertragscheck erfolgreich
- [ ] Aktivierungspolicy-Check erfolgreich
- [ ] Frame-Matrix-Strukturcheck erfolgreich
- [ ] `npm run finance:animation-isolation` erfolgreich
- [ ] `npm run finance:animation-typecheck` erfolgreich
- [ ] `npm run finance:animation-test` erfolgreich
- [ ] `npm run finance:animation-gallery:still` erfolgreich
- [ ] `npm run finance:animation-gallery:sequence-still` erfolgreich
- [ ] `npm run finance:animation-gallery:matrix-still` erfolgreich
- [ ] `npm run finance:animation-test-reel:still` erfolgreich
- [ ] GitHub-Actions-Lauf enthält echte Steps und Logs
- [ ] Galerie-, Frame-Matrix- und Fallback-Artefakte wurden hochgeladen

## Gate 2 – Exakte Datenverträge

- [ ] jedes der zwölf Templates besitzt eine vollständige Laufzeit-Allowlist
- [ ] alle Pflichtfelder sind Teil der jeweiligen Allowlist
- [ ] optionale Felder sind ausdrücklich dokumentiert
- [ ] unbekannte Top-Level-Datenfelder werden blockiert
- [ ] unbekannte Felder in Portfolio-Positionen werden blockiert
- [ ] unbekannte Felder in Timeline-Meilensteinen werden blockiert
- [ ] Portfolio-Positionen mischen `percent` und `value` nicht
- [ ] Prozent-Portfolios ergeben ungefähr 100 Prozent
- [ ] Wert-Portfolios ergeben den dargestellten Gesamtwert
- [ ] doppelte Portfolio- und Timeline-Labels werden blockiert
- [ ] der Renderer erfindet keine sichtbaren Werte

## Gate 3 – Visuelle Freigabe

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
- [ ] jede Zelle verwendet lokal 180 Frames und 1080 × 1920 Pixel
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
- [ ] `gallery/VISUAL_QA_REPORT.md` vollständig ausgefüllt

## Gate 4 – Eingabe- und Fallback-Sicherheit

- [ ] unbekannte JSON-Daten laufen ausschließlich über `parseFinanceAnimationRequest`
- [ ] unbekannte vollständige Szenen laufen ausschließlich über `parseFinanceAnimationScene`
- [ ] produktive Planung unbekannter Requests läuft über `planFinanceAnimationInput`
- [ ] manuelle Testauswahl unbekannter Requests läuft über `planFinanceAnimationInputForTemplate`
- [ ] automatische Testsimulation unbekannter Requests läuft über `planFinanceAnimationInputWithFeatures`
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
- [ ] Blockgründe werden bis in den finalen Plan übernommen und dedupliziert
- [ ] Mehrdeutigkeit zwischen Templates führt zum Bildmodus
- [ ] Input-Limits wurden mit realistischen Maximalwerten getestet

## Gate 5 – Vollständiges Test-Reel und Aktivierungssimulation

- [ ] alle zwölf Templates genau einmal als gültige Test-Reel-Szene enthalten
- [ ] Reihenfolge wird aus `FINANCE_ANIMATION_TEMPLATES` abgeleitet
- [ ] manuelle Hybridplanung wurde für alle zwölf Fixtures simuliert
- [ ] manuelle Planung funktioniert bei `allowAutomaticRouting: false`
- [ ] automatischer Hybridpfad wurde für alle Fixtures simuliert
- [ ] automatischer Vollanimationspfad wurde für alle Fixtures simuliert
- [ ] globaler Produktionspfad bleibt für alle Fixtures im Bildmodus
- [ ] ungültige Feature-Kombinationen führen zum Bildmodus
- [ ] Pflichtdaten-Fallback enthalten
- [ ] Fallback für unsichere Datenstruktur enthalten
- [ ] Fallback für ungültigen Szenenmodus enthalten
- [ ] stabile `FinanceAnimationFallbackPreview`-Composition rendert erfolgreich
- [ ] vollständiger 9:16-Render über `npm run finance:animation-test-reel:render` erfolgreich
- [ ] Szenendauer und Animation sind synchron
- [ ] alle Fallback-Karten zeigen die erwarteten Parserfehler
- [ ] vollständiger Render wurde visuell manuell freigegeben

## Gate 6 – Kontrollierte Produktionsanbindung

Die Aktivierungsreihenfolge ist verbindlich:

### Stufe A – alles deaktiviert

```ts
{
  enabled: false,
  allowHybrid: false,
  allowFullAnimation: false,
  allowAutomaticRouting: false,
}
```

- [ ] bestehender Bild-Workflow unverändert bestätigt

### Stufe B – manuelle Hybridprüfung

```ts
{
  enabled: true,
  allowHybrid: true,
  allowFullAnimation: false,
  allowAutomaticRouting: false,
}
```

- [ ] produktive Scene-Plan-Verträge separat erweitert
- [ ] sichere Parsergrenze vor jede Animationsszene gesetzt
- [ ] `SafeFinanceAnimationRenderer` hinter dem bestehenden Bild-Fallback angebunden
- [ ] Template ausschließlich explizit ausgewählt
- [ ] mindestens ein reales Reel pro freizugebendem Template geprüft
- [ ] Rückfall in den Bildmodus praktisch geprüft

### Stufe C – Vollanimation manuell

```ts
{
  enabled: true,
  allowHybrid: true,
  allowFullAnimation: true,
  allowAutomaticRouting: false,
}
```

- [ ] vollständige Animation zunächst nur mit expliziter Template-Auswahl geprüft
- [ ] Renderzeit und Ressourcenverbrauch geprüft
- [ ] Bild-Fallback weiterhin erreichbar

### Stufe D – automatisches Routing zuletzt

```ts
{
  enabled: true,
  allowHybrid: true,
  allowFullAnimation: true,
  allowAutomaticRouting: true,
}
```

- [ ] Mehrdeutigkeitsfälle praktisch geprüft
- [ ] Fehlklassifizierungen dokumentiert
- [ ] automatische Auswahl erst nach separatem Review aktiviert

## Verbotene Abkürzungen

Vor Abschluss aller Gates nicht erlaubt:

- direkte Registrierung der Galerie im produktiven Root
- direkte Registrierung des Test-Reels im produktiven Root
- direkter Import von `FinanceAnimationRenderer` in die Produktion
- Umgehung von Parser, Allowlist oder Validator
- Ausführung unbekannter Getter, Setter oder Funktionen
- Aktivierung von Vollanimation vor Hybrid
- Aktivierung automatischen Routings vor manueller Hybridprüfung
- Aktivierung von Unterflags bei `enabled: false`
- Entfernung des Bild-Fallbacks
- Merge des Draft-PRs ohne bestätigten Test- und Renderlauf

## Aktueller Zustand

Alle produktionsbezogenen Feature Flags bleiben deaktiviert. Die Foundation ist vorbereitet, aber nicht freigegeben. Der Pull Request bleibt Draft, bis die technischen Prüfungen tatsächlich ausgeführt, die Frame-Matrix und Fallback-Vorschau bestätigt und das vollständige Test-Reel visuell geprüft wurden.
