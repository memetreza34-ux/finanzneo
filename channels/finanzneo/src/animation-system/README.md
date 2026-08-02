# FinanzNeo Animation System (vorbereitet, deaktiviert)

Dieses Verzeichnis enthält die technische Grundlage für spätere Remotion-Finanzanimationen. Das System ist bewusst von der produktiven `image-first-lite`-Pipeline getrennt.

## Sicherheitszustand

Das System ist **nicht produktiv aktiv**:

- `enabled: false`
- `allowHybrid: false`
- `allowFullAnimation: false`
- `allowAutomaticRouting: false`
- Feature Flags sind zusätzlich mit `Object.freeze` zur Laufzeit gesperrt
- keine Registrierung im produktiven `FinanzNeoRoot`
- keine Änderung an bestehenden Scene-Plan-Verträgen
- keine Anbindung an `FinanceProductionLayer`
- ungültige Animationsdaten werden nicht gerendert

Der bestehende Bild-Workflow bleibt unverändert.

## Zielmodi

- `image`: bestehender Bild-Workflow
- `hybrid`: Bild plus gezielte Remotion-Erklärung
- `full-animation`: komplette Szene als Remotion-Animation

## Enthalten

- Typen für Szenenmodi, Entscheidungen, Requests und Template-Daten
- exakte Datenverträge für jedes der zwölf Templates
- sichere Parser für unbekannte KI- und JSON-Eingaben
- sicherer Planner- und Renderer-Einstieg für untrusted Input
- zentral typisierte, eingefrorene und standardmäßig deaktivierte Feature Flags
- gemeinsamer Begriffskatalog und gemeinsame Kandidatenbewertung für Router und Selector
- mehrdeutigkeitssicheres Routing mit Datenabdeckung, Wortgrenzen und Bild-Fallback
- strukturierter Animationsplan mit verständlichen Fallback-Gründen
- generische Szenenprüfung, fachliche Datenvalidierung und Präsentationsgrenzen
- robuste Finanzberechnungen für Zinseszins, Sparplan, Inflation, Kredit und Portfolio-Aufteilung
- kanonische, vollständig validierbare Beispielszenen für alle zwölf Templates
- wiederverwendbare visuelle Primitive:
  - animierte oder bereits framegenau berechnete Zahlen
  - Schutz gegen sichtbares `-0`
  - animierte oder bereits framegenau berechnete Fortschrittsbalken
  - robuste Finanz-Flussknoten
- zwölf getrennte Remotion-Finanztemplates:
  - `money-flow`
  - `budget-split`
  - `compound-growth`
  - `portfolio-allocation`
  - `inflation-erosion`
  - `debt-paydown`
  - `monthly-investment`
  - `before-after-comparison`
  - `risk-return-scale`
  - `timeline-milestones`
  - `income-expense-balance`
  - `tax-fee-flow`
- zentraler `FinanceAnimationRenderer`
- sequenzielle Galerie und Kontaktbogen mit allen zwölf Templates
- Galerie läuft durch denselben Renderer und dieselben Beispielszenen wie die Tests
- Tests für Berechnungen, Router, Kandidatenranking, Selector, Planung, Registry, Renderer, Parser, Datenverträge, Fixtures, Galerie, Primitive, QA und Fallback
- isolierte TypeScript-Konfiguration für das Animationssystem
- dependency-freier Strukturcheck und Produktions-Isolationscheck

## Lokal prüfen

Struktur, Pflichtdateien und gemeinsame Systemverträge prüfen:

```bash
npm run finance:animation-structure
```

Produktionsisolation und deaktivierte Feature Flags prüfen:

```bash
npm run finance:animation-isolation
```

Nur TypeScript prüfen:

```bash
npm run finance:animation-typecheck
```

Nur die Animationstests ausführen:

```bash
npm run finance:animation-test
```

Struktur, Isolation, Typecheck, Tests und Galerie-Kontaktbogen gemeinsam ausführen:

```bash
npm run finance:animation-validate
```

## Sichere Eingabegrenzen

`ingestion/parseFinanceAnimationInput.ts` behandelt unbekannte KI- oder JSON-Daten als `unknown` und prüft sie vor jeder Nutzung.

Geprüft werden unter anderem:

- Request und Daten müssen Objekte sein
- Kernaussage und Voiceover müssen sichtbare Texte sein
- Labels müssen als Textliste vorliegen
- direkte verschachtelte Objekte werden abgelehnt
- strukturierte Arrays bleiben für Portfolio und Timeline erlaubt
- Modus und Template-ID müssen bekannt sein
- anschließend laufen generische QA und templatespezifische Validierung

Für spätere Integrationen stehen zwei abgesicherte Einstiege bereit:

- `planFinanceAnimationInput(input)` für unbekannte Requests
- `SafeFinanceAnimationRenderer` für unbekannte vollständige Szenen

Nur erfolgreich geparste und validierte Werte erreichen Router, Planner oder Renderer.

## Strenge Template-Datenverträge

`templateDataContracts.ts` definiert für jede Template-ID den passenden exakten Datenvertrag. Die Typen besitzen absichtlich keinen offenen String-Index. Tippfehler bei Feldnamen werden dadurch beim Typecheck erkannt.

Beispiele:

- `money-flow` verlangt Betrag, Quelle und Ziel
- `compound-growth` verlangt Startkapital, Sparrate, Rendite und Jahre
- `portfolio-allocation` verlangt Positionen **und den dargestellten Gesamtwert**
- `debt-paydown` verlangt Schuldwerte **und den vollständigen Ratenfortschritt**
- `timeline-milestones` verlangt strukturierte Meilensteine
- `tax-fee-flow` verlangt Brutto, Steuern und Gebühren

Der Renderer erfindet keine Portfoliowerte oder Kreditraten. Jeder sichtbar dargestellte Finanzwert muss in der Szene vorhanden sein.

Prozentfelder verwenden durchgehend Prozentpunkte:

- `7` bedeutet 7 Prozent
- `0.5` bedeutet 0,5 Prozent

Erst der Renderer wandelt Prozentpunkte für Finanzformeln in Dezimalraten um.

## Routing und Mehrdeutigkeit

Router und eigenständiger Template-Selector verwenden dieselbe Kandidatenbewertung.

Bewertet werden:

- vollständige Finanzbegriffe
- vorhandene Pflichtdaten
- ein explizit bevorzugtes Template

Ein echter Gleichstand wird nicht anhand der Registry-Reihenfolge entschieden. Das System bleibt stattdessen im Bildmodus und dokumentiert die Mehrdeutigkeit. Passende Daten oder ein bewusst bevorzugtes Template können den Gleichstand auflösen.

## Kanonische Beispielszenen

Die Datei `fixtures/financeAnimationFixtures.ts` enthält genau eine gültige Beispielszene pro registriertem Template.

Diese Szenen werden gemeinsam verwendet von:

- Galerie
- Kontaktbogen
- Parser-Tests
- Datenvalidierungstests
- Registry-Abgleich
- zentralem Renderer
- späteren Smoke- und Integrationstests

Dadurch können Galerie und Tests nicht unbemerkt mit voneinander abweichenden Daten arbeiten.

## Galerie prüfen

Die Galerie ist vom normalen FinanzNeo-Root getrennt:

```bash
npm run finance:animation-gallery
```

Der Standard-Still zeigt alle zwölf Templates gleichzeitig als Kontaktbogen bei einem mittleren Animationsframe:

```bash
npm run finance:animation-gallery:still
```

Ein Still aus der sequenziellen 9:16-Galerie kann separat erzeugt werden:

```bash
npm run finance:animation-gallery:sequence-still
```

Diese Befehle verwenden ausschließlich den isolierten Galerie-Entry-Point und aktivieren keine Animation im produktiven Reel-Workflow.

## Validierungsregeln

Vor einem Render werden unter anderem geprüft:

- vorhandene Pflichtfelder des ausgewählten Templates
- jeder sichtbar dargestellte Wert ist tatsächlich vorhanden
- endliche, nichtnegative oder fachlich zulässige Zahlenwerte
- gültige Prozentwerte und Laufzeiten
- negative Renditen nur bei Templates, die sie sinnvoll darstellen können
- Zinseszins zeigt tatsächlich Einzahlung oder Wachstum
- Kaufkraftverlust benötigt positive Inflation
- strukturierte Portfolio- und Timeline-Daten
- maximale Anzahl sichtbarer Portfolio-Positionen und Meilensteine
- doppelte Portfolio- und Timeline-Labels
- Budgetanteile und deren Summe
- Portfolio-Prozentwerte und deren Summe
- Verhältnis von Ausgangs- und Restschuld
- bezahlte und gesamte Kreditraten sowie deren logische Entwicklung
- Steuern und Gebühren im Verhältnis zum Bruttobetrag
- Vorher-Nachher-Vergleiche ohne sichtbaren Unterschied
- Kernaussage, Voiceover, leere oder doppelte Labels und Anzahl sichtbarer Labels

Bei einem Fehler erzeugt der Planner keine Animationsszene. Der bestehende Bildmodus bleibt der sichere Rückfall. Die dokumentierten Gründe enthalten verständliche Meldungen statt instabiler interner Fehlercodes.

## Visuelle Konsistenz

Die Template-Logik wurde zusätzlich abgesichert:

- Budgetbalken starten wirklich bei null
- Portfoliogewichte und daraus berechnete Geldwerte bleiben synchron
- Geldfluss-Prozentanzeigen ergeben als ganze Zahlen exakt 100 Prozent
- Schuldstand und bezahlte Raten animieren im gleichen Fortschritt
- Inflation, Kaufkraftbalken und vergangene Jahre laufen synchron
- positive und negative Vorher-Nachher-Ergebnisse erhalten passende Farben
- Überschuss und Defizit werden unterschiedlich dargestellt
- Risiko- und Fortschrittswerte werden sicher begrenzt

## Produktionsisolation

`scripts/verify-finance-animation-isolation.mjs` prüft unabhängig von TypeScript und Remotion:

- alle vier Feature Flags bleiben deaktiviert
- das Flag-Objekt bleibt zur Laufzeit eingefroren
- `FinanceProductionLayer.tsx` importiert das Animationssystem nicht
- `FinanceImageFirstReel.tsx` importiert das Animationssystem nicht
- `FinanzNeoRoot.tsx` registriert weder Renderer noch Galerie
- auch sichere Parser-, Planner- und Renderer-APIs bleiben aus der Produktion ausgeschlossen

`scripts/verify-finance-animation-foundation.mjs` prüft zusätzlich:

- Pflichtdateien und alle zwölf Template-IDs
- gemeinsame Kandidatenbewertung und Mehrdeutigkeits-Fallback
- sichere Parser- und Renderer-Grenze
- Pflichtwerte für Portfolio und Kreditfortschritt
- keine erfundenen Renderer-Defaults
- lokale Prüfskripte und isolierten TypeScript-Umfang

Der GitHub-Actions-Workflow führt die dependency-freien Struktur- und Isolationschecks vor `npm ci`, Typecheck, Tests und Rendering aus.

## Produktionsstatus

Nicht angebunden sind weiterhin:

- `FinanceProductionLayer`
- `FinanceImageFirstReel`
- produktive Scene-Plan-Verträge
- automatische Szenenauswahl für bestehende Reels

Die Grundlage ist technisch vorbereitet, aber erst nach einem bestätigten vollständigen Testlauf und einer visuellen Galerieprüfung aktivierbar.

## Spätere Aktivierung

1. Strukturcheck, Isolationscheck, Typecheck, Tests und Galerie-Render erfolgreich bestätigen.
2. Kontaktbogen und sequenzielle Galerie visuell prüfen.
3. Templates gestalterisch freigeben.
4. mindestens ein vollständiges Test-Reel rendern.
5. Animationsfelder kontrolliert in die produktiven Scene-Plan-Verträge aufnehmen.
6. ausschließlich den sicheren Parser-/Renderer-Einstieg an den bestehenden Bild-Fallback anbinden.
7. Feature Flags einzeln aktivieren.
8. erst danach automatische Auswahl freigeben.

Bis dahin verwendet jedes normale FinanzNeo-Reel weiterhin ausschließlich den bestehenden Bild-Workflow.
