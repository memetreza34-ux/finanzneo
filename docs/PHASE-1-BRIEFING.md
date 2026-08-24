# Phase-1-Briefing für ChatGPT

Dieses Dokument ist **die einzige Übergabe an Phase 1**. Es wird vollständig in
ChatGPT eingefügt — inklusive aller Regeln.

**Warum vollständig:** ChatGPT hat keinen Zugriff auf dieses Repository. Ein
Prompt wie „halte dich an die Repo-Regeln" läuft deshalb ins Leere: Phase 1
kann Regeln nicht befolgen, die sie nicht kennt. Genau daraus entstanden
uneinheitliche Reels. Alle Regeln stehen deshalb hier ausgeschrieben.

Nach jeder Regeländerung in `CLAUDE.md` wird dieses Briefing nachgezogen.

---

## So wird es benutzt

1. Den kompletten Block unter „Briefing zum Kopieren" in ChatGPT einfügen
2. `[THEMA]` ersetzen
3. Ergebnisse in die Reel-Struktur legen
4. Phase 2 (Bilder + Voiceover) selbst erledigen
5. Phase 3 mit `npm run reel:ready -- <Reel-Pfad>` starten

Der Validator prüft danach automatisch, ob Phase 1 sauber geliefert hat.

---

## Briefing zum Kopieren

```text
Du bereitest ein FinanzNeo-Reel vor (Phase 1). Halte dich exakt an alle Regeln
unten. Sie sind vollständig — frage nicht nach weiteren Dateien.

THEMA: [THEMA]

════════════════════════════════════════════════════════════════════
1. KANAL
════════════════════════════════════════════════════════════════════
FinanzNeo erklärt Finanzgrundlagen auf Deutsch für Menschen ohne Vorwissen.
Ansprache: direkt mit „du", einfach, professionell, nahbar.
Plattformen: TikTok, Instagram Reels, Facebook Reels, Snapchat.
KEINE YouTube Shorts.

════════════════════════════════════════════════════════════════════
2. FORMAT
════════════════════════════════════════════════════════════════════
- Video 1080 × 1920, 9:16, 30 fps
- Länge 60–90 Sekunden
- Hook in den ersten 2 Sekunden
- Ziel etwa 60 % Bildszenen / 40 % Remotion-Animationen
- Bildbeat 3,5–5,5 s ideal, ABSOLUT MAXIMAL 6,0 s
- Animationsbeat 4,5–6,5 s
- Google-Flow-Quellbilder IMMER quadratisch 1:1 (nie 9:16)

WICHTIG ZUR 6-SEKUNDEN-GRENZE:
Szenenschnitte folgen später den echten Wortzeiten des Voiceovers. Plane die
Sätze deshalb so, dass kein Bildbeat länger als 6 Sekunden gesprochen wird.
Lange Erklärungen in zwei Sätze/zwei Szenen aufteilen oder als Animation lösen.
Ein zu langer Bildbeat ist ein Fehler, den der Validator blockiert.

════════════════════════════════════════════════════════════════════
3. SKRIPT — WIRD SZENE FÜR SZENE GESCHRIEBEN
════════════════════════════════════════════════════════════════════
WICHTIGSTE REGEL DIESES BRIEFINGS:
Schreibe NICHT erst einen Fließtext und teile ihn danach in Szenen auf.
Schreibe das Skript von Anfang an SZENE FÜR SZENE. Jede Szene ist ein Satz
oder eine kurze Satzgruppe, die genau zu EINEM Bild oder EINER Animation passt.

Der Grund: Die Szenenschnitte folgen später den echten Wortzeiten des
Voiceovers. Ist ein Satz zu lang, steht das Bild zu lange still und der
Zuschauer wischt weg. Ist er zu kurz, wirkt der Schnitt hektisch. Beides
entsteht im Skript — später lässt es sich nicht mehr reparieren, ohne das
Voiceover neu aufzunehmen.

WORTBUDGET PRO SZENE (deutsche Erklärsprache ≈ 2,5 Wörter pro Sekunde):

  Bildszene       3,5–5,5 s   →   9–14 Wörter    (absolut max. 15 Wörter)
  Animationsszene 4,5–6,5 s   →  11–16 Wörter    (absolut max. 17 Wörter)

Zähle die Wörter jeder Szene. Über dem Maximum: Satz teilen und daraus zwei
Szenen machen — oder die Aussage als Animation lösen.
Unter 7 Wörtern: Szene wirkt gehetzt, mit der Nachbarszene zusammenlegen.

BILD ODER ANIMATION — so entscheidest du:

  Bild        eine Situation, ein Zustand, ein Gegenstand, ein Beispiel
              („So sieht das aus", „Das gehört dazu")
  Animation   eine Veränderung, ein Mechanismus, ein Vorher/Nachher,
              eine Rechnung, ein Vergleich
              („Daraus wird…", „Beides zusammen ergibt…")

Faustregel: Passiert in der Aussage etwas, ist es eine Animation.
Beschreibt sie einen Zustand, ist es ein Bild.

Ziel etwa 60 % Bild / 40 % Animation. Bild und Animation wechseln sich ab —
nie mehr als zwei Bildszenen direkt hintereinander.

SO SIEHT DAS AUS (Beispiel, 3 Szenen):

  Szene 01 · BILD · 12 Wörter
  „100.000 Euro Einlagensicherung klingt, als wäre jedes Konto einzeln
  geschützt."

  Szene 02 · ANIMATION · 13 Wörter
  „Die gesetzliche Grenze gilt aber pro Person und Bank, nicht pro Konto."

  Szene 03 · BILD · 11 Wörter
  „Dazu zählen Girokonto, Tagesgeld, Festgeld, Sparguthaben und Sparbriefe."

INHALTLICHE REGELN:
- kurze, verständliche deutsche Sätze
- kein unnötiger Fachjargon, keine Füllsätze
- Logik: Hook → Problem → Erklärung → Beispiel → Lösung/Merksatz → CTA
- Zahlen nur nach Prüfung; Annahmen klar als Beispiel kennzeichnen
- keine individuelle Anlageempfehlung, Rendite nie als sicher darstellen
- Problem-Szenen dürfen die spätere Lösung nicht vorwegnehmen
- Beträge in Euro
- Gesamtlänge 60–90 s (bei ~2,5 Wörtern/s also etwa 150–225 Wörter)

LIEFERUNG:
Der szenenweise geschriebene Text wird zusätzlich als durchgehender Fließtext
in 01-script/script-fliess-text.txt gelegt — das ist die Vorlage fürs
Voiceover. Die Szenenzuordnung steht in 05-projektdateien/szenenplan.md und
im scene-index.json. Beides muss denselben Wortlaut verwenden.

════════════════════════════════════════════════════════════════════
4. ZWISCHENÜBERSCHRIFT — PFLICHT IN JEDER SZENE
════════════════════════════════════════════════════════════════════
Jede Bild- UND Animationsszene bekommt eine Zwischenüberschrift mit Icon.

PFLICHTREGEL: Die Überschrift ist ein AUSSAGESATZ oder eine FRAGE.
Niemals nur ein Stichwort. Niemals nur eine Zahl.

Prüffrage vor jeder Szene:
„Wenn jemand nur diese Zeile liest — weiß er dann, was die Szene erklärt?"
Wenn nein, ist die Überschrift falsch.

GUT (Aussage)                        SCHLECHT              WARUM
MEHRERE KONTEN WERDEN ADDIERT        60.000 € + 50.000 €   reine Zahlen
JEDE BANK SCHÜTZT SEPARAT            80.000 € + 80.000 €   reine Zahlen
ZUSAMMEN SIND ES 110.000 €           110.000 €             Zahl ohne Aussage
GEMEINSCHAFTSKONTO WIRD GETEILT      GEMEINSCHAFTSKONTO    Stichwort
AKTIEN UND ETFs ZÄHLEN NICHT DAZU    AKTIEN & ETFs         Stichwort
PRÜFE, WO DEIN GELD WIRKLICH LIEGT   BANK PRÜFEN           zu vage
JEDES KONTO EINZELN? FALSCH          EINLAGENSICHERUNG     Reel-Thema
NUR SECHS MONATE LANG                WICHTIG / TEIL 3      sagt nichts

- Zahlen dürfen IN der Überschrift stehen, nie allein
- Länge 3–6 Wörter, maximal eine Zeile (Richtwert bis 40 Zeichen)
- keine zwei Szenen mit identischer Überschrift
- Darstellung: mittig zentriert, in FinanzNeo-Grün

ICON — jede Szene bekommt ein eigenes, inhaltlich passendes Icon.
Nicht dasselbe Icon für verschiedene Aussagen wiederverwenden.

Verfügbare Icons (nur diese Namen verwenden):
euro, clock, hourglass, shield, check, cross, coins, bank, rocket, wallet,
percent, flame, target, bulb, lock, trending, calendar, phone, search,
receipt, repeat, document, list, warning

TON (headerTone) — nach Bedeutung:
- default   = normale Erklärung (grün)
- positive  = Lösung, Schutz, richtig
- warning   = Warnung, Problem, Irrtum, Verlust (rot) — nur bei echter Warnung
- money     = Geldbetrag, Summe, Wert (gold)

════════════════════════════════════════════════════════════════════
5. UNTERTITEL
════════════════════════════════════════════════════════════════════
- satzbasiert, aktives Wort grün, restliche Wörter weiß
- kein gelbes/goldenes aktives Wort, kein schwarzer Text
- maximal zwei Zeilen

KEIN VORGREIFEN: In einer Szene erscheinen NUR die Wörter, die in dieser Szene
gesprochen werden. Kein Wort der nächsten Szene darf vorher sichtbar sein.
Achte beim Szenenplan darauf, dass die Schnitte auf Satz- bzw. sinnvollen
Phrasenanfängen liegen.

════════════════════════════════════════════════════════════════════
6. BILDWELT — STYLIZED 3D EDITORIAL
════════════════════════════════════════════════════════════════════
Jeder Bildprompt enthält diese Kopfzeilen wörtlich:

FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
STYLIZED_3D_LOCK: finanzneo-stylized-3d-editorial-v5
GENERATED_IMAGE_ASPECT_RATIO: 1:1
FLOW_AGENT_PROTOCOL: finanzneo-flow-sequential-v1
GOOGLE FLOW – FINALER DATEINAME:
Bild XX - Kurzer Szenenname.png

STIL (in jedem Prompt ausschreiben):
- premium stylized 3D CGI financial editorial explainer
- chunky volumetrische Objekte, weiche Bevels, abgerundete Formen
- deep charcoal green-black Grundwelt, smaragdgrüne Akzente
- Gold NUR für Geld/Wert, Rot-Orange NUR für Verlust/Risiko/Warnung
- cinematic soft key light + smaragdgrünes Rim Light
- NICHT fotorealistisch, kein Büro-/Stockfoto, kein Pixar/Clay/Toy
- kein Dashboard, UI, Gameboard, Diorama, Neon-Tunnel

EIN NAHTLOSER HINTERGRUND (höchste Bildregel) — wörtlich einbauen:
Use ONE single seamless continuous deep charcoal green-black background across
the entire square 1:1 image. NO horizontal divisions. NO visible top or bottom
section. NO dark bands. NO floor-wall boundary. NO horizon line. NO panel
background. Objects may cast soft contact shadows, but the background itself
remains one uninterrupted surface.

VERBOTEN: Prozent-Zonen wie „top 15% / middle 60% / bottom 25%".

TEXT IM BILD:
- NIEMALS Überschrift, Untertitel, ganzer Satz, CTA, Absatz
- ERLAUBT: kurze deutsche Objektlabels, 1–3 Wörter, direkt am Objekt
- wenige Labels pro Bild
Jeder Prompt enthält: „No headline. No subtitle. No explanatory sentence."

PERSON (optional): stilisiert, Gesicht IMMER klar sichtbar, frontal oder
3/4-Ansicht. Keine gesichtslose Figur, keine reine Rückenansicht.
Jeder Prompt enthält eine Gesichtsregel (Wort „face" oder „Gesicht").

BILDLOGIK: ein dominantes Hauptmotiv, 2–5 unterstützende Alltagsobjekte,
klarer Ursache-Wirkungs-Zusammenhang.

MARKEN (Netflix, Spotify, …) nur wenn konkret relevant, korrekt geschrieben,
keine erfundene Partnerschaft.

════════════════════════════════════════════════════════════════════
7. NUMMERIERUNG DER BILDER
════════════════════════════════════════════════════════════════════
Cover = Bild 00, Szene 01 = Bild 01, Szene 02 = Bild 02 …
BILDNUMMER = ECHTE SZENENNUMMER, nicht die Anzahl erzeugter Bilder.
Animationsszenen bekommen KEIN Bild; ihre Nummer bleibt reserviert.

Beispiel:
Szene 01 = Bild      → Bild 01
Szene 02 = Animation → kein Bild 02
Szene 03 = Bild      → Bild 03

════════════════════════════════════════════════════════════════════
8. REMOTION-ANIMATIONEN
════════════════════════════════════════════════════════════════════
Jede Animation braucht zwingend:
STARTZUSTAND → SICHTBARER MECHANISMUS → EINDEUTIGES ERGEBNIS

- die Bewegung muss die Aussage erklären, nicht dekorieren
- Start und Ergebnis sichtbar beschriftet
- ohne Ton grundsätzlich verständlich
- reine Zooms/Fades/Zahlen-Popups reichen NICHT
- Ergebnis mindestens ~0,5 s stabil halten

FARBEN auf dunklem Hintergrund:
- Weiß = neutrale Information
- Grün = Fokus, Lösung, Schutz
- Rot = Warnung, Problem, Verlust
- Gold = Geldbetrag, Summe, Wert
- SCHWARZ IST VERBOTEN

Halte Beschriftungen kurz — lange Chips laufen seitlich aus dem Bild.

════════════════════════════════════════════════════════════════════
9. WAS DU LIEFERST
════════════════════════════════════════════════════════════════════
01-script/script-fliess-text.txt      fertiger Voiceover-Fließtext
03-szenen/bildwelt.txt                Bildwelt-Definition mit 1:1-Lock
03-szenen/00-cover/cover.txt          Cover-Prompt inkl. Dateinamen
03-szenen/alle-bildprompts.txt        EINZIGE Übergabedatei an Google Flow
03-szenen/EINZELNE-SZENEN/scene-XX/   je bildprompt.txt ODER remotion.md
                                      (genau eine Produktionsquelle) + szene.md
03-szenen/scene-index.json            vollständige Szenenmetadaten
04-caption/caption.txt                Master-Caption
04-caption/instagram-reels.txt        Plattformtext
04-caption/tiktok.txt                 Plattformtext
04-caption/facebook-reels.txt         Plattformtext
04-caption/snapchat.txt               Plattformtext
05-projektdateien/recherche-quellen.md  Quellen mit Datenstand
05-projektdateien/szenenplan.md         Szenenplan
05-projektdateien/animationen.md        Animationsspezifikationen

Pro Szene im scene-index.json:
  id, type (image|animation), headline, icon, headerTone,
  planFile, expectedVisual (bei Bildszenen), googleFlowFileName (bei Bildszenen)

KEINE PLATZHALTER. Kein „[EINFÜGEN]", kein „TODO", kein „…".
Erzeuge KEINE Bilder und KEIN Ersatz-Voiceover — das macht der Nutzer.

alle-bildprompts.txt enthält zusätzlich das Arbeitsprotokoll wörtlich:
- Erzeuge GENAU EIN Bild pro Schritt
- Benenne es SOFORT exakt um
- Bei Fehlern: Erzeuge DIESELBE Bildnummer neu
- Kein vorheriges Bild als Referenz hochladen / keine Bildreferenz
- Jede Szene bekommt eine eigene frische Komposition
- Zielordner: 03-szenen/00-ALLE-BILDER-HIER-REIN/

════════════════════════════════════════════════════════════════════
10. SELBSTPRÜFUNG VOR ABGABE
════════════════════════════════════════════════════════════════════
[ ] Skript SZENE FÜR SZENE geschrieben, nicht nachträglich zerteilt
[ ] jede Bildszene 9–14 Wörter, jede Animationsszene 11–16 Wörter (gezählt!)
[ ] keine Szene über dem Maximum (15 bzw. 17 Wörter)
[ ] Bild/Animation nach Zustand-vs-Veränderung zugeordnet
[ ] nie mehr als zwei Bildszenen direkt hintereinander
[ ] Skript 60–90 s, Hook in den ersten 2 Sekunden
[ ] alle Zahlen geprüft, Annahmen als Beispiel gekennzeichnet
[ ] jede Szene hat eine Überschrift, die als AUSSAGE sagt, worum es geht
[ ] keine Überschrift ist nur eine Zahl oder nur ein Stichwort
[ ] keine zwei Szenen mit identischer Überschrift
[ ] jede Szene hat ein eigenes passendes Icon aus der erlaubten Liste
[ ] kein Bildbeat müsste länger als 6 Sekunden stehen
[ ] Bildnummern = echte Szenennummern, Animationsnummern übersprungen
[ ] jeder Bildprompt: 1:1, nahtloser Hintergrund, Locks, Dateiname, Gesichtsregel
[ ] jeder Bildprompt verbietet Headline/Untertitel/Satz im Bild
[ ] jede Animation hat Start → Mechanismus → Ergebnis
[ ] keine schwarzen Texte auf dunklem Hintergrund
[ ] alle vier Plattformtexte vorhanden
[ ] keine Platzhalter in irgendeiner Datei
```

---

## Was Phase 3 automatisch prüft

Nach Phase 2 blockiert `npm run reel:ready -- <Reel-Pfad>` unter anderem:

- fehlende oder platzhalterhafte Zwischenüberschriften
- Überschriften, die nur aus Zahlen oder einem Stichwort bestehen
- doppelte Überschriften
- fehlende oder unbekannte Icons
- Bildbeats über 6 Sekunden
- Lücken oder Überlappungen in der Timeline
- fehlende Bildwelt-Locks, falsches Seitenverhältnis, Prozent-Zonen
- fehlende Plattformtexte, fehlende Wortzeiten, fehlendes Audio

Was der Validator meldet, ist ein Phase-1-Fehler und wird dort korrigiert —
nicht in Phase 3 überschrieben.
