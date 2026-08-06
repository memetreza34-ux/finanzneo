# FinanzNeo — verbindliches Projekt-Gehirn

> Diese Datei ist die höchste interne Quelle für Strategie, Gestaltung und Produktion.
> Bei Widersprüchen mit älteren Dateien gilt immer `CLAUDE.md`.

## 1. Kanal und Ziel

- Kanalname: **FinanzNeo**
- Sprache: Deutsch
- Inhalt: Finanzgrundlagen für Menschen mit wenig oder keinem Vorwissen
- Hauptziel: Reichweite, Vertrauen und später Einnahmen
- Plattformen: TikTok, Instagram Reels, YouTube Shorts, Facebook Reels und Snapchat
- Primärformat: vertikale Videos von 60 bis 90 Sekunden
- Longform-YouTube ist eine spätere Erweiterung und aktuell nicht der Standard
- Ansprache: direkt mit **du**, einfach, professionell und nahbar
- Keine feste Figur, kein Avatar und kein sichtbarer Moderator

## 2. Monetarisierung

Die Reihenfolge ist verbindlich:

1. hochwertige kostenlose Finanzbildung
2. kostenlose PDFs, Checklisten oder Vorlagen als Kommentar- oder DM-Angebot
3. Aufbau einer E-Mail- oder Interessentenliste
4. später transparente Affiliate-Empfehlungen
5. langfristig eigene Rechner, Vorlagen, digitale Produkte oder Apps

Werbung, Affiliate-Links und Interessenkonflikte müssen klar gekennzeichnet werden.

## 3. Verbindlicher Reel-Standard

- Format: 1080 × 1920, 30 fps
- Dauer: 60 bis 90 Sekunden
- Hook innerhalb der ersten 2 Sekunden
- Thema sofort verständlich
- ungefähr 6 bis 10 visuelle Beats
- jeder Satz besitzt einen klaren visuellen Zweck
- Untertitel sind bei jedem vertikalen Video Pflicht
- keine langen Intros
- kein Disclaimer vor der Hook
- kleiner Hinweis „Keine Anlageberatung“ darf dezent eingeblendet werden
- ausführliche Hinweise und Quellen gehören in Caption oder Beschreibung

### Bild- und Animationsanteil

Standardziel:

```text
55–65 % Bildszenen
35–45 % native Remotion-Animationen
```

Bei zehn Szenen ist der bevorzugte Aufbau:

```text
6 Bildszenen
4 Remotion-Animationen
```

Eine schwache Animation wird nicht nur zur Erfüllung einer Quote verwendet. Bilder müssen die Handlung erklären und dürfen keine bedeutungslose Hintergrundtapete sein.

## 4. Skriptregeln

- kurze und verständliche Sätze
- kein unnötiger Fachjargon
- konkrete Zahlen nur nach Prüfung
- keine Füllsätze und keine Wiederholungen
- klare Struktur: Hook → Problem → Erklärung → Beispiel → Lösung oder Merksatz → CTA
- Vergleiche, Ursachen, Entwicklungen und Ergebnisse klar trennen
- keine individuelle Anlageempfehlung
- keine Behauptung ohne nachvollziehbare Quelle oder klar erkennbare Beispielannahme
- Problem-Szenen dürfen visuell noch nicht die spätere Lösung zeigen

## 5. Verbindliche Bildwelt: Image World V3

Alle neuen FinanzNeo-Bildszenen verwenden genau diese Welt:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
```

Verbindliche Dokumente:

- `docs/FINANZNEO-IMAGE-WORLD-V3.md`
- `docs/IMAGE-SYSTEM.md`
- `docs/BEAT-TO-IMAGE-RULES.md`
- `docs/IMAGE-PROMPT-LIBRARY.md`
- `docs/IMAGE-QA-CHECKLIST.md`

### Weltreferenz pro Reel

Vor den eigentlichen Szenenbildern wird zuerst eine Weltreferenz erzeugt:

```text
03-szenen/bildwelt.txt
03-szenen/bildwelt-referenz.png
```

Alle weiteren Bilder desselben Reels verwenden `bildwelt-referenz.png` ausschließlich als Referenz für:

- Kamera und Perspektive
- Kamerahöhe und Blickrichtung
- Architektur und räumliche Tiefe
- Lichtführung
- Materialien
- Farbpalette
- Größe des Hauptmotivs

Die finanzielle Handlung darf wechseln. Die Bildwelt darf nicht wechseln.

### Unveränderliche Serienmerkmale

- leicht isometrische Drei-Viertel-Kamera
- ungefähr 35-mm-äquivalente Perspektive
- gebogene dunkle Anthrazit-Rückwand
- nahtlos verbundener matter Studioboden
- integrierte smaragdgrüne Lichtkanäle
- weiches Hauptlicht links oben
- grünes Kantenlicht rechts
- Gold ausschließlich für Geld und finanzielle Werte
- Rot ausschließlich für Risiko, Verlust oder blockierte Ausgaben
- hochwertige matte Materialien
- wenige kontrollierte Glasdetails
- nicht fotorealistisch
- nicht kindlich oder cartoonhaft
- kein Pixar- oder Clay-Stil

### Keine leeren oder zufälligen Hintergründe

Jedes Bild enthält:

1. unterstützenden Vordergrund
2. erklärende Handlung im Mittelgrund
3. ruhige, sichtbare Studioarchitektur im Hintergrund

Verboten:

- isoliertes Objekt vor schwarzem Nichts
- reiner Verlauf oder Glow ohne Raum
- freigestellter Produkt-Render
- schwebende Werbeplattform
- zufällige neue Umgebung pro Szene
- sichtbarer Stilwechsel zwischen Bildern

Die oberen und unteren Randbereiche bleiben crop-sicher und detailarm, zeigen aber weiterhin dieselbe Wand, denselben Boden und dieselbe Lichtwelt. Sie dürfen nicht wie leere schwarze Balken aussehen.

### Einheitliche Komposition

- vertikale 9:16-Quelle
- Hauptaktion im mittleren 64-%-Bereich der Quellhöhe
- obere 18 % ruhig und crop-sicher
- untere 18 % ruhig und crop-sicher
- Hauptszene füllt ungefähr 68–78 % der nutzbaren Breite
- zwei bis vier große verbundene Hauptelemente
- wichtigstes Objekt über alle Bilder ähnlich groß
- klare Leserichtung oder ein klarer Prozessweg
- Aussage innerhalb einer Sekunde auf dem Smartphone verständlich
- keine kleinen Dashboard-Panels oder zufälligen Mini-Icons

### Sämtlicher Text im KI-Bild ist verboten

Neue Szenenbilder enthalten:

- keine Überschrift
- keinen Untertitel
- keine Labels
- keine Zahlen
- keine Konto-Namen
- keine Logos
- keine Wasserzeichen
- keine App-Oberflächen

Remotion rendert alle Texte, Zahlen, Pfeile, Quellen und geprüften Rechenwerte. Dadurch können generierte Schreibfehler oder abgeschnittene Bildbeschriftungen nicht mehr entstehen.

### Verbindliche Promptmarker

Jeder Bildprompt enthält:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
SERIES CONTINUITY LOCK:
ENVIRONMENT:
COMPOSITION LOCK:
TEXT:
CONSISTENCY NEGATIVES:
SCENE MESSAGE:
CONNECTED VISUAL STORY:
```

Der Weltblock bleibt unverändert. Nur Aussage, Objekte und Handlung werden pro Szene angepasst.

## 6. Aufgabenverteilung Bild und Remotion

### KI-Bild

Das Bild übernimmt:

- konkrete Gegenstände
- räumliche Situationen
- Ursache-Wirkungs-Szenen
- visuelle Metaphern
- Problem-, Schutz- und Ergebnissituationen
- eine zusammenhängende erklärende Handlung

### Remotion

Remotion übernimmt:

- Überschriften und passende Icons
- Untertitel und grüne Wortverfolgung
- Zahlen, Beträge und Formeln
- Diagramme und Tabellen
- Quellen und Datenstand
- zusätzliche Pfeile und Hervorhebungen
- Übergänge und Fortschritt
- CTA

### Bilddarstellung in Remotion

- Vordergrundbild verwendet `object-fit: contain`.
- Keine sichtbare unscharfe Kopie desselben Bildes als Hintergrund.
- Freie Fläche wird durch die einheitliche FinanzNeo-Studiobühne gefüllt.
- Source-Crop oben höchstens `0.20`.
- Source-Crop unten höchstens `0.20`.
- Source-Crop insgesamt höchstens `0.34`.
- zusätzliche Skalierung höchstens `1.04`.
- nur nachweislich ruhige Umgebungsfläche darf entfernt werden.
- Motive, Geld, Pfeile oder erklärende Elemente dürfen nie abgeschnitten werden.

## 7. Überschriften und Untertitel

### Überschriften

- immer oben
- erste Zeile weiß
- Schwerpunktzeile grün oder bei Geldrechnungen gold
- passendes Linien-Icon neben der Schwerpunktzeile
- Icon und Schwerpunktzeile besitzen ungefähr dieselbe visuelle Höhe
- keine Kicker-Pille im Untertitelbereich

### Karaoke-Untertitel

- immer genau ein vollständiger Satz sichtbar
- nur das aktuell gesprochene Wort FinanzNeo-grün
- alle übrigen Wörter weiß
- höchstens zwei fest berechnete, ausgewogene Zeilen
- keine springenden Wörter
- keine Größenanimation
- keine Wort-für-Wort-Einblendung
- vorheriger Satz bleibt während kurzer Sprechpausen sichtbar
- keine leeren Caption-Lücken

### Plattform-Safe-Area bei 1080 × 1920

```text
Headline ungefähr ab Y = 78
Visual ungefähr Y = 270–1350
Untertitel 320 px über dem unteren Rand
links 62 px Abstand
rechts 150 px Abstand für die Reels-Bedienleiste
```

## 8. Satzbasierte Szenenschnitte

Szenenschnitte folgen dem finalen Audio, nicht einem starren Zeitraster.

Verbindlicher Ablauf:

```text
finales Voiceover
→ echte Wort-Zeitstempel
→ Satzanfänge
→ Szenenstarts
→ relative Animationsdauern
```

Der Beginn einer neuen Szene entspricht dem Beginn des ersten Satzes, der zu dieser Szene gehört.

Standardmäßig verboten:

- jede Szene pauschal sechs Sekunden lang machen
- Bildwechsel noch während des vorherigen Satzes
- Animationen mit festen absoluten Frames bauen, wenn die Szenendauer variabel ist

Animationen steuern ihre Phasen relativ zur tatsächlichen Szenendauer.

## 9. Audio

Ziel für den veröffentlichten Export:

```text
Integrated Loudness: ungefähr -16 LUFS
True Peak: höchstens -1 dBTP
```

- finale Werte am gerenderten MP4 messen
- Code-Gain ist nur eine Vorschauhilfe
- nach Änderungen an Audio oder Sprechtempo Wortzeiten und Timeline erneut prüfen
- keine Ersatz-Audiodatei erzeugen, wenn das finale Voiceover fehlt

## 10. Technisches Designsystem

- Neue produktive Remotion-Dateien importieren ausschließlich aus `src/design-system`.
- Direkte Imports aus `src/bausteine` sind in neuer Produktion nicht erlaubt.
- Direkte Imports aus `src/brand` bleiben nur für bestehende Altdateien vorübergehend kompatibel.
- Farben, Premium-Palette, Formate und Safe Areas stammen aus `src/brand/tokens.ts`.
- Fonts stammen aus `src/brand/fonts.ts`.
- Finanzrechner stammen aus `src/finance/calculations.ts`.
- `src/bausteine/fn_core.tsx` ist nur eine Kompatibilitätsschicht.
- Vor einer neuen Komponente muss geprüft werden, ob bereits eine gleichwertige Komponente existiert.
- Neue Produktion darf keine frei erfundenen Finanzwerte direkt im JSX enthalten.

Verbindliche technische Dokumentation:

- `src/design-system/README.md`
- `src/bausteine/README.md`

## 11. Finanzdaten und Faktenprüfung

- keine erfundenen Zahlen
- jede Rechnung reproduzierbar
- Annahmen nennen
- historische Daten mit Quelle und Stand
- Beispielrechnungen als Beispiel kennzeichnen
- keine Rendite als sicher darstellen
- bei aktuellen Fakten zuerst recherchieren
- Diagramme nur mit validierten Daten
- Geldbeträge standardmäßig in Euro

## 12. Produktionsablauf

1. Thema auswählen
2. Fakten und Quellen recherchieren
3. Skript schreiben
4. Zahlen und Aussagen prüfen
5. visuelle Beats planen
6. pro Beat Bild, Remotion oder Kombination festlegen
7. finales Voiceover ablegen
8. echte Wort-Zeitstempel erzeugen
9. Szenenstarts aus den Satzanfängen ableiten
10. `03-szenen/bildwelt.txt` erstellen
11. Weltreferenz generieren und als `03-szenen/bildwelt-referenz.png` speichern
12. alle Bildprompts mit demselben V3-Weltblock erstellen
13. alle Szenenbilder mit derselben Weltreferenz generieren
14. jedes Bild gegen den exakten Satz prüfen
15. alle Bilder als Kontaktbogen auf Weltkonsistenz prüfen
16. Remotion-Animationen relativ zu den echten Szenendauern bauen
17. Überschriften, Icons und Karaoke-Untertitel einbinden
18. Asset-Sync, Validatoren und Typecheck ausführen
19. Preview rendern
20. Anfang, Mitte und Ende jeder Bildszene prüfen
21. komplette MP4 mit Kopfhörern ansehen
22. Audio-Lautheit messen
23. Caption, Quellen, CTA und gegebenenfalls PDF-Angebot erstellen
24. erst nach menschlicher Sichtprüfung final freigeben

## 13. Qualitätsprüfung pro Reel

### Inhalt

- Hook in den ersten zwei Sekunden klar?
- Thema sofort verständlich?
- Bild und gesprochener Satz passen exakt zusammen?
- zeigt eine Problem-Szene noch keine vorweggenommene Lösung?
- sind Zahlen und Aussagen geprüft?

### Bildsatz

- verwenden alle Bilder dieselbe V3-Weltreferenz?
- sind Kamera, Perspektive und Kamerahöhe gleich?
- sind Architektur, Licht, Materialien und Palette gleich?
- wirken die Hauptmotive ähnlich groß?
- besitzt jedes Bild Vordergrund, Mittelgrund und Hintergrund?
- gibt es keinen leeren schwarzen Hintergrund?
- ist sämtlicher Text aus den Bildern entfernt?
- erklärt jedes Bild genau eine Aussage?

### Render

- Vordergrundbilder vollständig und mit `contain` sichtbar?
- keine sichtbaren Blur-Streifen?
- keine wichtigen Motivteile abgeschnitten?
- Szenenschnitte exakt an Satzanfängen?
- genau ein Untertitelsatz sichtbar?
- aktuelles Wort grün?
- höchstens zwei Untertitelzeilen?
- keine Caption-Lücken?
- Untertitel außerhalb der Reels-Totzone?
- Audio ungefähr -16 LUFS und höchstens -1 dBTP?

### Freigaberegel

- Ein einzelnes Bild aus einer anderen Welt führt zur Neuerstellung dieses Bildes.
- Eine visuell falsche Satzzuordnung führt zur Neuerstellung oder Neuzuordnung.
- Technischer Erfolg ist keine kreative Freigabe.
- Unter 8/10 wird überarbeitet.
- „9/10“ muss durch Kontaktbogen, geprüfte Frames und vollständige MP4-Prüfung begründet sein.

## 14. Aktive technische Prioritäten

1. Image World V3 und Bildsatz-QA konsequent verwenden
2. Caption-, Safe-Area- und Satzschnittsystem stabil halten
3. produktive Videos, Experimente und Showcases trennen
4. `src/brand` und `src/bausteine` über `src/design-system` konsolidieren
5. falsche Demo-Finanzzahlen entfernen und Berechnungen zentralisieren
6. Typecheck, Tests und Render-Smoke-Tests ergänzen
7. standardisierte Reel-Vorlage für 60–90 Sekunden weiter automatisieren
8. erst danach größere Serienproduktion starten

Der detaillierte Bereinigungsplan steht in `docs/REPO-CLEANUP-PLAN.md`.
