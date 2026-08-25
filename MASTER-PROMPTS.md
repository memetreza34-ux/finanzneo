# FinanzNeo — aktuelle Master-Prompts

> `CLAUDE.md` ist die höchste Regelquelle.

Vor neuen Reels zusätzlich lesen:

- `docs/3-PHASEN-WORKFLOW.md`
- `docs/PHASE-3-COMPLETION-GATE.md`
- `reels/PRODUKTIONSSTANDARD.md`
- `docs/FINANZNEO-IMAGE-WORLD-V3.md`
- `docs/IMAGE-SYSTEM.md`
- `docs/BEAT-TO-IMAGE-RULES.md`
- `docs/IMAGE-PROMPT-LIBRARY.md`
- `docs/IMAGE-QA-CHECKLIST.md`
- `docs/PLATFORM-PUBLISHING.md`

Vor YouTube-Longform zusätzlich lesen:

- `docs/YOUTUBE-LONGFORM-WORKFLOW.md`
- `youtube/PRODUKTIONSSTANDARD.md`

## 1. Phase 1 — ChatGPT bereitet komplett vor

**Nicht diesen Abschnitt kopieren, sondern `docs/PHASE-1-BRIEFING.md`.**

ChatGPT hat keinen Zugriff auf dieses Repository. Ein Prompt wie „halte dich an
die Repo-Regeln" läuft deshalb ins Leere — Phase 1 kann Regeln nicht befolgen,
die sie nicht kennt. Genau daraus entstanden uneinheitliche Reels.

`docs/PHASE-1-BRIEFING.md` enthält alle Regeln ausgeschrieben: Format, Skript,
Zwischenüberschriften, Untertitel, Bildwelt, Nummerierung, Animationen,
Lieferumfang und eine Selbstprüfung. Den Block „Briefing zum Kopieren"
vollständig in ChatGPT einfügen und `[THEMA]` ersetzen.

Nach jeder Regeländerung in `CLAUDE.md` wird das Briefing nachgezogen.

## 2. Phase 3 — Antigravity / Claude Code baut autonom

```text
Mach das Reel: reels/<Woche>/<Tag>/<Reel>

1. Prüfe zuerst vollständig mit:
   npm run reel:ready -- <Reel-Pfad>

2. Wenn grün, lege VOR der Implementierung das Phase-3-Produktionsmanifest an:
   npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>

3. Implementiere JEDE Szene aus scene-index.json. Bildszene = echtes Bildlayer. Animationsszene = echte sichtbare Animationskomponente. Untertitel/SceneHeader allein zählen NIEMALS als Szenenvisual.

4. Vervollständige 05-projektdateien/phase3-production-manifest.json vollständig:
   - jede Szene implemented=true
   - startFrame + durationFrames lückenlos
   - Bildszene: sourceImageFileName + echter assetPath
   - Animationsszene: componentPath + componentExport
   - audioImplemented=true
   - captionsImplemented=true
   - sceneHeadersImplemented=true
   - status=READY_TO_RENDER

5. Vor dem Render MUSS grün sein:
   npm run reel:phase3:preflight -- <Reel-Pfad>

6. Produktiven Finalrender ausschließlich über das validierte Manifest starten:
   npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json

   Dieser Befehl rendert zuerst nur eine *.phase3-candidate.mp4. Eine Candidate-Datei ist NICHT final. Erst die automatische Post-Render-QA prüft jede Bildszene auf sichtbaren Visualinhalt und jede Animationsszene zusätzlich auf messbare Bewegung. Nur bei PASSED wird das finale MP4 freigegeben.

7. Danach exportieren:
   npm run reel:export -- <Reel-Pfad> <Final-MP4>

   Export prüft erneut den exakten SHA-256-Hash des Videos sowie die unveränderten Hashes von scene-index.json und phase3-production-manifest.json.

Das Reel gilt erst als FINAL_COMPLETE, wenn `06-export/` vollständig erzeugt wurde.

VERBOTEN:
- eine vorhandene MP4 als Fertigkeitsnachweis behandeln
- npx remotion render direkt als finalen Abschluss benutzen
- bei fehlendem Bild oder fehlender Animation trotzdem „fertig“ melden
- Caption-only-/Header-only-Szenen akzeptieren, wenn Bild oder Animation geplant ist
- Candidate-MP4 an den Nutzer als final ausgeben

Stoppe nur bei echten Pflichtasset-, Fakten-, Sicherheits-, Validator-, Build-, Render- oder Render-QA-Blockern. Melde dann alle Blocker gesammelt mit exakten Pfaden. Niemals eine nicht bestandene Phase 3 als fertig darstellen.
```

## 3. Bildprompt erstellen

```text
Erstelle einen FinanzNeo-Bildprompt für diesen gesprochenen Satz:
[SATZ]

Verbindlich:
- Google-Flow-Quellbild immer quadratisch 1:1; Breite und Höhe identisch
- kein Portrait-/Hochformat; 9:16 entsteht erst in Remotion
- Premium Fintech Editorial 3D
- EINE dominante Finanzmetapher / großes Hauptobjekt
- optional stilisierte erwachsene 3D-Person
- wenn Person: Gesicht mit Augen, Nase und Mund klar sichtbar; frontal oder natürliche 3/4-Ansicht
- deep charcoal green-black
- vivid emerald/mint
- Gold nur für Geld/Wert
- warmes Rot-Orange nur für Risiko/Verlust/Schulden
- smooth rounded 3D geometry, soft bevelled edges
- nur explizit notwendige kurze deutsche Objektlabels, normalerweise 1–3 Wörter
- keine große Headline, kein Untertitel, kein erklärender Satz
- relevante bekannte Marken erlaubt, wenn sie wirklich zur Aussage gehören und keine Partnerschaft suggeriert wird

KRITISCHER HINTERGRUND:
Use ONE single seamless continuous deep charcoal green-black background from top edge to bottom edge.
No horizontal bands.
No top/bottom sections.
No percentage zones.
No floor-wall boundary.
No horizon line.
No panels.
Leave natural empty space above/below only by reducing objects, never by changing the background.

Nicht verwenden:
- Diorama
- Game-Level
- Neon-Tunnel
- Sci-Fi-Korridor
- Dashboard/App-UI
- Fotorealismus
- gesichtslose Figur

Direkt am Prompt den endgültigen Dateinamen angeben.
Bildnummer = echte Szenennummer; Animationsnummern bleiben reserviert.
```

## 4. Google-Flow-Sammelprompt erstellen

```text
Erstelle `03-szenen/alle-bildprompts.txt` in chronologischer Szenenreihenfolge.

Für jedes benötigte Bild:
1. Prompt lesen
2. GENAU EIN Bild erzeugen
3. sofort endgültig umbenennen
4. Motiv + Labels + Gesicht + nahtlosen Hintergrund + Dateiname prüfen
5. erst dann nächstes Bild

Cover = Bild 00.
Jede Bildszene nutzt ihre echte Szenennummer.
Animationsszenen bekommen kein Bild; ihre Nummer bleibt reserviert.
Erst nach Abschluss alle Bilder gemeinsam nach `03-szenen/00-ALLE-BILDER-HIER-REIN/`.
```

## 5. Bild-QA

```text
Prüfe jedes Nutzerbild nach den aktuellen FinanzNeo-Regeln.

Sofort NEU ERSTELLEN melden bei:
- zwei sichtbaren Hintergründen/Bändern
- horizontaler Trennkante
- Floor-Wall-Grenze/Horizont
- gesichtsloser/abgewandter Person
- falschen oder zusätzlichen Labels
- großer Headline/Untertitel/erklärendem Satz
- Diorama/Game-Level/Tunnel-Look
- falscher Zuordnung zum gesprochenen Satz

Antigravity darf das Bild nicht selbst neu generieren.
```

## 6. Voiceover, Timing und Remotion

```text
Nutze ausschließlich das finale Voiceover.
Erzeuge echte Wort-Timings daraus.
Szenenschnitte beginnen an den echten Satzanfängen.

Baue 1080×1920 bei 30 fps.
Bilder mit contain.
Keine unscharfe Bildkopie als Hintergrund.
Überschriften/Icons in Remotion.
Genau ein vollständiger Untertitelsatz sichtbar.
Aktuelles Wort grün, Rest weiß.
Maximal zwei Zeilen.
Animationen relativ zur tatsächlichen Szenendauer.
```

## 7. Finale technische und visuelle QA

```text
Wenn Nutzerbilder und finales Audio vorhanden sind:
- reel:ready
- Asset-Sync/Ingest
- jede scene-index-Szene im Phase-3-Produktionsmanifest einzeln belegen
- reel:phase3:preflight
- Typecheck
- Preview-Render
- Kontaktbogen / erste-mittlere-letzte Frames
- produktiven Render NUR über reel:render
- automatische Post-Render-Visual-QA: Bildszenen sichtbar, Animationsszenen sichtbar + bewegt
- komplette freigegebene MP4 mit Ton ansehen
- Audio-Lautheit am finalen Export
- reel:export

Eine technisch erzeugte MP4 ist noch kein fertiges Reel.
`phase3-render-qa.json` muss `status: PASSED` enthalten.
Untertitel/Headline allein sind kein gültiger Szeneninhalt.
Keine Prüfung als bestanden behaupten, wenn sie nicht tatsächlich ausgeführt wurde.
```

## 8. Reel-Plattform-Publishing

```text
Erstelle aus der geprüften Master-Caption alle Reel-Veröffentlichungsdateien in `04-caption/`.

Pflichtdateien:
- instagram-reels.txt
- tiktok.txt
- facebook-reels.txt
- snapchat.txt

Instagram Reels:
CAPTION / CTA / QUELLEN-HINWEIS / HASHTAGS / optional ANGEHEFTETER KOMMENTAR

TikTok:
CAPTION / CTA / QUELLEN-HINWEIS / HASHTAGS

Facebook Reels:
REEL-TEXT / CTA / QUELLEN-HINWEIS / HASHTAGS

Snapchat:
CAPTION / optional CTA / Hinweis nur wenn nötig

Keine `youtube-shorts.txt` erstellen. Keine YouTube Shorts vorbereiten oder veröffentlichen.
YouTube ist ausschließlich für eigenständige längere Videos unter `youtube/` und besitzt einen separaten Workflow.

Alle Plattformtexte müssen dieselben geprüften Fakten verwenden. Keine neuen Behauptungen erfinden. Exakte aktuelle Plattform-Limits nur nach Prüfung offizieller Plattformquellen verwenden.
```

## 9. Phase 1 — YouTube-Longform vollständig vorbereiten

```text
Neues eigenständiges FinanzNeo-YouTube-Longform-Video.

Thema: [THEMA]

Arbeite nach CLAUDE.md, docs/YOUTUBE-LONGFORM-WORKFLOW.md und youtube/PRODUKTIONSSTANDARD.md.

Erstelle ohne offene Platzhalter:
1. Briefing, Zielgruppe, Lernziel, Kernversprechen und Begründung für Longform
2. geprüfte Recherche mit Quellen, Datenstand, Annahmen und Rechenwegen
3. Hook, Kapitel-Dramaturgie und Retention-Plan
4. vollständiges deutsches Voiceover-Skript ohne Füllpassagen
5. Visual-Plan mit begründeter Bild-/Remotion-Zuordnung
6. vollständige englische Google-Flow-Prompts mit exakten Dateinamen
7. englischen Thumbnail-Prompt und vollständigen Thumbnail-Brief
8. fünf Titelvarianten und einen finalen Titel
9. Beschreibung, Kapitel, Keywords/Tags, Hashtags, Quellen/Disclaimer
10. angehefteten Kommentar, Community-Post und Upload-Checkliste
11. Promo-Texte für Instagram, TikTok, Facebook und Snapchat

YouTube-Quellbilder und Thumbnail sind horizontal 16:9. Reel-Bilder bleiben separat 1:1.
Der Nutzer erzeugt alle Bilder. Antigravity erzeugt weder Bilder noch Ersatz-Voiceover.
Google Flow arbeitet strikt: genau ein Bild → vollständig warten → sofort exakt umbenennen → prüfen → erst dann das nächste Bild. Thumbnail zuerst und danach nur als Stilreferenz verwenden.
Keine YouTube Shorts und keine gestreckte Reel-Kopie erzeugen.
```

## 10. Phase 3 — YouTube-Longform autonom bauen

```text
Mach das YouTube-Video: youtube/<Projekt>

Prüfe zuerst vollständig mit `npm run youtube:ready -- youtube/<Projekt>`.
Wenn die Prüfung erfolgreich ist, beginne sofort und arbeite ohne Rückfragen oder Zwischenstopps bis zur technischen und visuellen QA des fertigen 1920×1080-Renders.
Leite Timeline, Kapitel, Visualwechsel und Untertitel aus dem finalen Voiceover und dem fertigen Plan ab.
Triff normale Detailentscheidungen selbst nach CLAUDE.md.
Stoppe nur bei echten Pflichtasset-, Fakten-, Sicherheits-, Validator-, Build- oder Renderblockern und melde alle gesammelt mit exakten Pfaden.
```
