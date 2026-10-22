# FinanzNeo — Approved External Asset Sources

Datenstand: 15.09.2026

Ziel: Icons, B-Roll, Fotos und kleine Support-Animationen dürfen FinanzNeo ergänzen, ohne Bildwelt, Rechteklarheit oder Reproduzierbarkeit zu beschädigen.

## Grundregel

External Assets sind Support, nicht Default. Die Reihenfolge bleibt:

1. konkrete visuelle Erklärung bestimmen
2. prüfen, ob native Remotion-/SVG-Erklärung reicht
3. bei realem Bewegungsmehrwert B-Roll verwenden
4. bei semantischer Kurzschrift Icon verwenden
5. kleine Status-/Fokusbewegung optional mit Lottie
6. Flow-Bild nutzen, wenn die grounded FinanzNeo-Welt die Aussage besser trägt

Kein Asset wird nur verwendet, weil es verfügbar ist.

## A — bevorzugte kostenlose B-Roll-/Fotoquellen

### Pexels — PRIMARY
- Fotos + Videos
- kommerzielle Nutzung kostenlos
- Namensnennung laut Pexels-Lizenz nicht erforderlich, aber möglich
- kostenlose API verfügbar
- API-Standardlimit aktuell 200 Requests/Stunde und 20.000/Monat
- sehr gut für: Alltag, Reparatur, Auto/Werkstatt, Einkauf, Arbeit, Wohnen, Banking-Kontext ohne Markenfokus
- Website: https://www.pexels.com/
- Lizenz: https://www.pexels.com/license/
- API: https://www.pexels.com/api/

### Pixabay — SECONDARY
- Fotos + Videos + Audio
- kostenlos nutzbar und bearbeitbar im Rahmen der Pixabay Content License
- Namensnennung laut Lizenzzusammenfassung nicht erforderlich
- kostenlose API, aktuell standardmäßig 100 Requests pro 60 Sekunden
- Video-API unterstützt auch `animation` als Filter
- Website: https://pixabay.com/
- Lizenz: https://pixabay.com/service/license-summary/
- API: https://pixabay.com/api/docs/

### Coverr — MANUAL FALLBACK
- kostenlose Stockvideos für kommerzielle und nicht-kommerzielle Nutzung
- bei normalen Free-Downloads keine Attribution erforderlich
- gute filmische B-Roll
- API vorhanden, aber API-Nutzung hat eigene Bedingungen; daher für FinanzNeo nicht als automatische Hauptquelle verwenden
- Website: https://coverr.co/
- Lizenz: https://coverr.co/license

### Mixkit — MANUAL FALLBACK
- kostenlose Videos, Musik, SFX und Templates
- NUR Assets mit `Mixkit Video Free License` für monetisierte/kommerzielle FinanzNeo-Videos verwenden
- `Restricted License` nicht für kommerzielle Nutzung einsetzen
- keine Attribution für Free-License-Videos erforderlich
- Website: https://mixkit.co/free-stock-video/
- Lizenz: https://mixkit.co/license/

### Unsplash — STILL PHOTO FALLBACK
- starke Fotos; kommerzielle Nutzung im Rahmen der Unsplash License möglich, Attribution nicht verpflichtend
- nur als Fotoquelle, wenn Flow/3D nicht besser passt
- Vorsicht bei Marken, Logos, identifizierbaren Personen und geschützter Kunst im Bild
- Website: https://unsplash.com/

## B — bevorzugte Iconquellen

### Lucide — PRIMARY
- konsistente Outline-SVGs
- ISC License
- sehr passend zur ruhigen FinanzNeo-Sprache
- Website: https://lucide.dev/

### Phosphor — SECONDARY
- sehr große, konsistente Iconfamilie
- MIT License
- mehrere Gewichte; gut, wenn Lucide ein Motiv nicht besitzt
- Website: https://phosphoricons.com/

### Heroicons — FALLBACK
- saubere SVG-Icons
- MIT License
- Website: https://heroicons.com/

### Tabler Icons — FALLBACK
- große Outline-Iconbibliothek
- MIT License
- Website: https://tabler.io/icons

### SVG Repo — ONLY WITH PER-ASSET LICENSE CHECK
- viele SVGs, aber Lizenzen können pro Asset variieren
- nur verwenden, wenn das einzelne Asset eindeutig kommerziell nutzbar ist
- Lizenz im Asset-Ledger dokumentieren
- Website: https://www.svgrepo.com/

## C — kleine Animationen

### LottieFiles Free Animations
- kostenlose Animationen unter Lottie Simple License können kommerziell genutzt und verändert werden
- Attribution ist bei Free Animations laut aktuellem Lizenzhinweis nicht verpflichtend, aber erwünscht
- Lizenz der konkreten Animation trotzdem vor Download prüfen
- nur kleine Support-Cues: Check, Warning, Search, Document, Clock, Status
- niemals Haupt-Erklärung einer Finanzmechanik
- Website: https://lottiefiles.com/free-animations

### Pixabay Animations
- Video-API unterstützt den Typ `animation`
- sinnvoll für neutrale kurze Motion-Assets, wenn sie stilistisch passen
- gleiche Pixabay-Lizenzprüfung wie bei Video/Bild

## D — nur mit Attribution / deshalb nicht Default

Diese Quellen können funktionieren, erzeugen aber zusätzlichen Lizenz-/Credit-Aufwand und werden deshalb NICHT automatisch gewählt:

- Noun Project Free: Attribution zum Creator erforderlich
- Flaticon Free: Attribution erforderlich
- Wikimedia Commons: Lizenz variiert pro Datei; Attribution/ShareAlike kann erforderlich sein
- Openverse: Suchmaschine für offen lizenzierte Medien; Lizenzinformationen müssen beim Originalwerk erneut geprüft werden

## Rechte- und Qualitätsgate

Vor Verwendung jedes externen Assets:

- kommerzielle/monetarisierte YouTube-Nutzung erlaubt
- keine `NonCommercial`-Lizenz
- keine unklare Lizenz
- keine sichtbaren Marken/Logos, wenn sie nicht notwendig und rechtlich sauber sind
- erkennbare Personen nicht in negativen/irreführenden Finanzkontext setzen
- keine implizierte Empfehlung durch Person/Marke
- keine Stockdatei als eigenes Stockasset weiterverteilen
- Asset lokal herunterladen; KEINE Remote-URL aus `animation.tsx` laden
- Quelle, Asset-URL, Lizenz, Creator falls nötig, Abrufdatum und lokale Datei dokumentieren
- B-Roll muss technisch mindestens 1080p bevorzugt horizontal sein; für 16:9 Longform kein Hochformat als Default
- wenn Stocklook die FinanzNeo-Bildwelt sichtbar verschlechtert: Asset verwerfen

## Automationsregel

Für agentische Suche:

1. zuerst Pexels API
2. falls kein guter Treffer: Pixabay API
3. Coverr/Mixkit nur manuell bzw. nach expliziter Einzelprüfung
4. Icon zuerst Lucide, dann Phosphor
5. Lottie nur als Support
6. nie automatisch ein Asset übernehmen; erst Treffer prüfen, dann lokal speichern

API-Schlüssel gehören ausschließlich in lokale Environment-Variablen/Secrets, niemals in GitHub-Dateien.

## Asset-Ledger

Jedes verwendete externe Asset bekommt einen Eintrag mit:

```text
assetId
visualId
localFile
source
sourceUrl
assetPageUrl
creator
license
licenseUrl
retrievedAt
commercialUseChecked
attributionRequired
attributionText
notes
```

So bleibt jeder spätere Render nachvollziehbar und austauschbar.