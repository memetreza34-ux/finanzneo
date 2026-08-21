# FinanzNeo — aktueller Produktionsablauf

> `CLAUDE.md` ist die höchste Regelquelle. Dieses Dokument beschreibt den praktischen Ablauf.

Der Ablauf ist in drei Übergaben gebündelt:

1. normales ChatGPT vervollständigt Inhalt, Skript, Struktur und Prompts
2. der Nutzer erstellt Google-Flow-Bilder, finales Audio und echte Wort-Zeitstempel
3. Antigravity prüft mit `npm run reel:ready -- <Reel-Pfad>` und baut bei Erfolg ohne Zwischenfragen bis zum geprüften Render

Details und zulässige Stopps: `docs/3-PHASEN-WORKFLOW.md`.

## Vor jedem neuen Reel lesen

- `CLAUDE.md`
- `docs/3-PHASEN-WORKFLOW.md`
- `reels/PRODUKTIONSSTANDARD.md`
- `docs/FINANZNEO-IMAGE-WORLD-V3.md`
- `docs/IMAGE-SYSTEM.md`
- `docs/BEAT-TO-IMAGE-RULES.md`
- `docs/IMAGE-PROMPT-LIBRARY.md`
- `docs/IMAGE-QA-CHECKLIST.md`
- `docs/PLATFORM-PUBLISHING.md`

## Schritt 1 — Thema und Recherche

- neues Thema gegen bestehende Reels prüfen
- notwendige Fakten recherchieren
- Quellen und Datenstand festhalten
- Fakten von Beispielannahmen trennen
- keine Zahlen erfinden

## Schritt 2 — Skript

60–90 Sekunden als Standard:

1. Hook innerhalb der ersten 2 Sekunden
2. Problem
3. einfache Erklärung
4. konkretes Beispiel
5. Lösung oder Merksatz
6. kurzer CTA, wenn sinnvoll

Kurze deutsche Sätze, direkte Du-Ansprache, kein unnötiger Fachjargon und keine individuelle Anlageempfehlung.

## Schritt 3 — Szenen- und Visualplan

Je Beat entscheiden:

- KI-Bild
- Remotion
- Kombination

KI-Bilder für konkrete Gegenstände, Alltagssituationen und visuelle Metaphern. Remotion für Überschriften, Karaoke-Untertitel, Zahlen, Quellen, Diagramme, Tabellen und CTA.

## Schritt 4 — Bildprompts

Jeder Bildprompt folgt dem aktuellen FinanzNeo-Stil:

- Premium Fintech Editorial 3D
- eine dominante Finanzmetapher / großes Hauptobjekt
- optional stilisierte erwachsene 3D-Person
- wenn Person: Gesicht mit Augen, Nase und Mund klar sichtbar; frontal oder 3/4 bevorzugt
- deep charcoal green-black Grundwelt
- Emerald/Mint-Akzente
- Gold nur für Geld/Wert
- warmes Rot-Orange nur für Risiko/Verlust/Schulden
- smooth rounded geometry + soft bevelled edges
- nur kurze deutsche Objektlabels, normalerweise 1–3 Wörter
- keine große Headline, kein Untertitel, kein ganzer erklärender Satz im KI-Bild
- keine Dioramen, Neon-Tunnel, Sci-Fi-Korridore, Dashboards oder Game-Level

### Kritische Hintergrundregel

Keine Prozent-Zonen mehr verwenden.

Jeder Prompt verlangt **einen einzigen nahtlosen Hintergrund von oben bis unten**:

- keine horizontalen Bänder
- keine obere/untere Hintergrundzone
- keine Floor-Wall-Grenze
- kein Horizont
- keine Panels
- natürliche freie Fläche oberhalb/unterhalb des Motivs nur durch weniger Inhalt, nicht durch einen anderen Hintergrund

## Schritt 5 — Google Flow

Der Nutzer erzeugt die Bilder selbst. Antigravity erzeugt keine Bilder.

Für jedes benötigte Bild:

```text
PROMPT LESEN
→ GENAU EIN BILD ERZEUGEN
→ SOFORT ENDGÜLTIG UMBENENNEN
→ MOTIV + LABELS + GESICHT + HINTERGRUND + DATEINAME PRÜFEN
→ ERST DANN NÄCHSTES BILD
```

Nummerierung folgt immer der echten Szene. Animationsnummern bleiben reserviert.

Erst nach Abschluss kommen alle Nutzerbilder gemeinsam nach:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

## Schritt 6 — Bild-QA

Neu erzeugen bei:

- zwei sichtbaren Hintergründen/Bändern
- horizontaler Trennkante
- Floor-Wall-Grenze/Horizont
- gesichtsloser oder abgewandter Person
- falschen/zusätzlichen Labels
- großer KI-Headline oder erklärendem Satz
- falscher Bild-Skript-Zuordnung
- Diorama/Game-Level/Tunnel-Look

## Schritt 7 — Voiceover und Timing

- finales Voiceover in `02-audio/`
- echte Wortzeiten aus genau diesem Audio
- Szenenschnitte an Satzanfängen
- keine pauschal gleich langen Szenen

## Schritt 8 — Remotion

- 1080 × 1920, 30 fps
- Bilder mit `contain`
- keine unscharfe Bildkopie als Hintergrund
- Überschriften/Icons in Remotion
- genau ein vollständiger Untertitelsatz sichtbar
- aktuelles Wort grün, Rest weiß
- maximal zwei Untertitelzeilen
- Animationen relativ zur echten Szenendauer

## Schritt 9 — Technische QA

Erst wenn Nutzerbilder und Audio vorhanden sind:

- Asset-Sync/Ingest
- Reel-Validator
- Typecheck
- Preview-Render
- Kontaktbogen/Frames prüfen
- komplette MP4 mit Ton ansehen
- Audio am finalen Export prüfen: ungefähr -16 LUFS, True Peak höchstens -1 dBTP

Ohne tatsächlichen Lauf nicht behaupten, dass Validator, Typecheck oder Render bestanden haben.

## Schritt 10 — Plattform-Ausgabe

Die Hauptstruktur bleibt einfach. Alle Reel-Publishing-Texte liegen in `04-caption/`:

```text
caption.txt
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
word-timings.json
```

`caption.txt` ist die gemeinsame geprüfte Faktenbasis. Danach werden die vier Reel-Plattformdateien passend zum selben finalen Reel erstellt.

### Instagram Reels

- Caption
- CTA
- Quellen/Hinweis
- Hashtags
- optional angehefteter Kommentar

### TikTok

- kurze Caption
- CTA
- Quellen/Hinweis
- passende Hashtags

### Facebook Reels

- Reel-Text
- CTA
- Quellen/Hinweis
- passende Hashtags

### Snapchat

- sehr kurze Caption
- optional CTA
- Hinweis nur wenn nötig

Keine YouTube Shorts erzeugen. `youtube-shorts.txt` ist in aktiven Reel-Projekten verboten. YouTube ist ausschließlich für eigenständige längere Videos unter `youtube/` vorgesehen; Reels werden nicht automatisch dorthin gespiegelt.

Keine plattformspezifischen Fakten erfinden. Wenn aktuelle Plattform-Limits/Funktionen entscheidend sind, vor Veröffentlichung die aktuelle offizielle Plattform-Dokumentation prüfen.

## Nicht mehr gültig

- Prozent-Zonen wie 18/22 oder 15/60/25 in Bildprompts
- alte isometrische Studioarchitektur als Pflicht
- vollständig textfreie Bilder als allgemeine Pflicht
- gesichtslose Figuren
- sichtbare obere/untere Hintergrundbänder
- Antigravity als Bildgenerator
- Longform-YouTube als primäres Reel-Format
- Animation beginnen, bevor Pflichtassets vorhanden sind
