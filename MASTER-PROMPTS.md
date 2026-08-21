# FinanzNeo — aktuelle Master-Prompts

> `CLAUDE.md` ist die höchste Regelquelle.

Vor neuen Reels zusätzlich lesen:

- `docs/3-PHASEN-WORKFLOW.md`
- `reels/PRODUKTIONSSTANDARD.md`
- `docs/FINANZNEO-IMAGE-WORLD-V3.md`
- `docs/IMAGE-SYSTEM.md`
- `docs/BEAT-TO-IMAGE-RULES.md`
- `docs/IMAGE-PROMPT-LIBRARY.md`
- `docs/IMAGE-QA-CHECKLIST.md`
- `docs/PLATFORM-PUBLISHING.md`

## 1. Phase 1 — ChatGPT bereitet komplett vor

```text
Neues FinanzNeo-Reel.

Thema: [THEMA]

Arbeite nach allen aktuellen Repo-Regeln und erstelle selbstständig:
1. Recherche mit Quellen und Datenstand
2. Lernziel und Kernaussage
3. geprüftes 60–90-Sekunden-Skript
4. Szenen-/Beat-Liste
5. begründete Zuordnung KI-Bild / Remotion / Kombination
6. vollständige Google-Flow-Bildprompts mit echtem Szenen-Dateinamen
7. Remotion-Spezifikationen
8. Master-Caption + Reel-Plattformdateien für Instagram Reels, TikTok, Facebook Reels und Snapchat

Antigravity erzeugt keine Bilder. Der Nutzer erzeugt alle Bilder selbst mit Google Flow.
Keine YouTube Shorts erzeugen. YouTube ist ausschließlich ein separater Longform-Bereich unter `youtube/`.

Schreibe alle Ergebnisse direkt in die verbindliche Reel-Struktur. Entferne alle Platzhalter aus Skript, Recherche, Szenenplan, Bildprompts, scene-index und Plattformtexten. Erzeuge selbst keine finalen Bilder und kein Ersatz-Voiceover.
```

## 2. Phase 3 — Antigravity baut autonom

```text
Mach das Reel: reels/<Woche>/<Tag>/<Reel>

Prüfe zuerst vollständig mit `npm run reel:ready -- <Reel-Pfad>`.
Wenn die Prüfung erfolgreich ist, beginne sofort und arbeite ohne Rückfragen oder Zwischenstopps bis zur technischen und visuellen QA des fertigen Renders.
Triff normale Detailentscheidungen selbst nach CLAUDE.md.
Stoppe nur bei echten Pflichtasset-, Fakten-, Sicherheits-, Validator-, Build- oder Renderblockern. Melde dann alle Blocker gesammelt mit exakten Pfaden.
```

## 3. Bildprompt erstellen

```text
Erstelle einen FinanzNeo-Bildprompt für diesen gesprochenen Satz:
[SATZ]

Verbindlich:
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

## 7. Finale technische QA

```text
Wenn Nutzerbilder und finales Audio vorhanden sind:
- Asset-Sync/Ingest
- Reel-Validator
- Typecheck
- Preview-Render
- Kontaktbogen / erste-mittlere-letzte Frames
- komplette MP4 mit Ton
- Audio-Lautheit am finalen Export

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
