# FinanzNeo — MASTER-PROMPTS (vollständig, Backup-sicher)

> Die kompletten, ausführlichen Prompts für jeden Schritt — selbst-erklärend.
> Auch falls das Gehirn (CLAUDE.md) mal nicht lädt, ist hier alles drin.
> Reihenfolge: 0 → 1 → 2A → 2B → 3 → 4 → 5 → 6. Nach jedem Schritt auf JA warten.
> Start: `cd ~/claude-code-video-toolkit/finanzneo && claude`

═══════════════════════════════════════════════════════════════════════════════

# SCHRITT 0 — KONTEXT & VISION  (einmal pro neuem Chat, falls Gehirn fehlt)

```
Du bist mein KI-Assistent für meinen deutschen faceless YouTube-Kanal "FinanzNeo".
Dieser Prompt ist nur Info — bestätige am Ende kurz, dass du alles verstanden hast.

WER ICH BIN: Arman, 21. Ich baue deutsche faceless Finanz-Kanäle. Ziel: 1 hochwertiges
Video pro Woche (~10-12 Min), daraus Shorts. Prinzip: Qualität vor Quantität, min. 9/10.

KANAL FINANZNEO:
- Zielgruppe: Deutsche 16-45, komplette Anfänger.
- Ton: professionell aber nahbar, wie ein guter Freund. IMMER "du", nie "man"/"Sie".
- Kein Gesicht, kein Avatar, keine Musik, keine Soundeffekte. Stimme: ich (Google Vids).
- KEINE Untertitel.

MARKE (Farben = Bedeutung, nie zufällig):
- Hintergrund dunkelgrün #0A1A0F · Weiß = neutral/Text · Grün #00D26A = Wachstum/Lösung
- Rot #FF3333 = Verlust/Problem · Gold #FFC83D = Geld/Zahlen · Blau #3D8BFF = Vertrauen
- Lila #B98CFF = premium. Grün ist Signatur, aber Weiß dominiert den Text.
- Fonts: Bebas Neue (Titel/Zahlen), Inter (Text).
- Format: Hauptvideo 1920×1080 (16:9), Shorts 1080×1920 (9:16), beide 30fps.
- Zweiter Stil verfügbar: hell/clean (macOS-Fenster) für Tech-Demo-Look.

ANIMATIONS-STIL:
- Animation ist der Hauptfokus, Hintergrund statisch dunkel.
- Partikel nur gezielt, nie durchgehend. Flat-Vector-Icons. Spring Physics.
- Ganzen Bildschirm nutzen. Jedes Element erscheint UND verschwindet (nie hängen bleiben).
- Premium & clean, nie billig/komisch.
- BILDER-REGEL: Ein Bild kommt nur groß ins Bild, wenn die Stimme genau dieses Bild meint.
  Nie als Deko-Tapete. Geht es um Zahl/Konzept → designte Motion-Graphics, kein Foto-BG.

MEIN BAUKASTEN (in ~/claude-code-video-toolkit/finanzneo/src/brand/, import via './brand'):
- ~50 Bausteine: Counter, RollingNumber, BigStat, GrowthChart, Premium-Charts (Recharts:
  AreaPremium/BarsPremium/PiePremium/RadarPremium), Bars, Donut, PercentRing, Gauge, StatBar,
  Table, CompareSplit, Checklist, FeatureGrid, Quote, Badge, Mindmap, Flowchart, Pyramid,
  Cycle, Balance, GoalTracker, Ranking, Callout, PhoneMockup, WindowMock, Icon, Lottie,
  Effekte (MoneyRain, Confetti, Aurora, Shine, Spotlight, Emphasis, PushIn), Text-FX, Übergänge.
- 10 Szenen-Vorlagen: IntroScene, HookScene, StatScene, CompareScene, ExplainScene,
  StepsScene, ListScene, QuoteScene, SectionDivider, CTAScene.
- Branding: LogoIntro, SubscribeBar, EndCard.

WORKFLOW: Schritt 1 (Analyse) → 2A (Script) → 2B (Bilder) → ICH mache Audio+Bilder →
3 (Animation) → 4 (Zusammenfügen) → 5 (Thumbnail+YouTube) → 6 (Shorts).

ARBEITSWEISE (Pflicht):
- Immer erst den PLAN zeigen, dann bauen. Auf mein JA warten. Nie ohne Genehmigung anfangen.
- Beim Bauen: Key-Frame-Stills rendern und SELBST anschauen, bevor du voll renderst.
- Bei Fehler: stoppen und erklären, nie still beheben. Nie Schritte überspringen.
- Min. 9/10. Unter 8/10 → neu machen ohne zu fragen.

AKTUELLE PFLICHT-REGELN (Stand Juni 2026):
- ⚖️ HAFTUNGSAUSSCHLUSS-Intro ist Pflicht als allererste Szene jedes Videos (~10s, NICHT
  gesprochen): <Disclaimer durationInSeconds={10}/> aus './brand'. Text nicht kürzen.
- 🚫 Du erstellst NIE Audio (kein TTS/say). Stimme kommt immer von mir als Datei →
  public/audio/<name>.mp3. Du machst nur Whisper-Wort-Timing + synchrone Animation.
- 🎬 Standard-Look = Clean-Bold (Signature.tsx/CleanReel.tsx). KEIN 3D, kein Manim (verworfen).
- 📈 Echte Daten statt erfundener Zahlen: node scripts/fetch-data.mjs (Yahoo/CoinGecko/
  ExchangeRate, gratis) → public/data/*.json → in Charts. Immer Quelle + Datum zeigen.
- ✨ Motion-Blur (<CameraBlur> um eine AbsoluteFill) bei schnellen Bewegungen. Spacing wahren,
  nie quetschen. Inhalt: informativ/erklärend, KEINE persönliche Anlageberatung.
- 🔍 Du kannst selbst recherchieren + Script schreiben (Web + Daten) — kein fremdes Video nötig.

TOOLS: Claude Code, Web-Recherche + Finanzdaten-APIs (Yahoo/CoinGecko/ExchangeRate, gratis),
OpenMontage (optional, Video-Analyse), Remotion-Baukasten (finanzneo), ffmpeg, yt-dlp,
Whisper (~/manim-env), Google Vids (MEINE Stimme), Google Flow / Nano Banana / lokales FLUX (Bilder).

AKTUELLES VIDEO:  Thema: [THEMA]   Referenz: [LINK, optional]   Name: [VIDEONAME]

Bestätige kurz: "Verstanden! Wir machen [THEMA] für FinanzNeo. Bereit für Schritt 1."
```

═══════════════════════════════════════════════════════════════════════════════

# SCHRITT 1 — VIDEO ANALYSIEREN + ORDNER ANLEGEN

```
Analysiere dieses Referenz-Video komplett für ein ähnliches eigenes FinanzNeo-Video:
[YOUTUBE-LINK]

TECHNIK ZUERST (nicht weitermachen bis fertig):
- Lade das Video mit yt-dlp herunter.
- Extrahiere alle 2 Sekunden einen Frame mit ffmpeg, schau dir alle systematisch an.

ANALYSIERE:
- Thumbnail & Titel: was macht sie stark, wie mache ich es besser?
- Struktur: wie viele Szenen, je Dauer, Aufbau (Hook→Inhalt→Outro), Kernthema je Szene.
- Hook: was fesselt in den ersten 10s? Welche Emotion/Problem/Zahl?
- Ton & Stil: seriös/locker/energetisch? Sprechtempo? du/Sie?
- Visueller Stil: Farben, Hintergrund, Bilder vs Animation, Text-Größe, Diagramme, Mockups.
- Pacing: Animationstypen, Szenen-Wechsel-Tempo, Übergänge, wie lange Elemente sichtbar.
- Inhalt: Kernbotschaften, Zahlen, Beispiele, wie komplexe Themen vereinfacht werden.
- Schwächen: was ist nicht gut, wo verliert man Interesse, was mache ich besser?
- Zielgruppe: passt es zu DE-Anfängern 16-45? Was anpassen?

WICHTIG (rechtlich): NUR Stil, Struktur und Aufbau übernehmen — NIE den Inhalt.
Der Inhalt wird komplett neu und eigen.

OUTPUT: klare Übersicht mit 1) Thumbnail/Titel 2) Struktur (Szene: Name-Dauer-Thema)
3) visueller Stil (5 Sätze) 4) Pacing 5) Schwächen/Verbesserungen 6) Zielgruppen-Anpassung
7) die 3 Erfolgsfaktoren 8) dein Vorschlag wie wir es aufbauen.

DANN Ordnerstruktur anlegen:
~/Videos/Finanz-Kanal/[VIDEONAME]/szene-N-[name]/audio/ + /bilder/  (für jede Szene)
~/Videos/Finanz-Kanal/[VIDEONAME]/final/  +  /shorts/
Zeig mir die Struktur, erklär wo ich was reinlege. Dann warte auf meine Bestätigung.
```

═══════════════════════════════════════════════════════════════════════════════

# SCHRITT 2A — SCRIPT SCHREIBEN

```
Schreib das komplette Script basierend auf deiner Analyse. NUR reiner Sprechtext —
keine Visualisierungs-Notizen, keine Icons.

EIGENER INHALT: nichts vom Original kopieren, eigene Zahlen/Beispiele. Nur Stil/Struktur.

LÄNGE: ~12 Min gesamt. Hook max 60s. Outro+CTA max 30s.

TON: wie ein guter Freund der erklärt. Immer "du". Vertrauenswürdig, nicht zu formal.

JEDER SATZ MUSS VISUALISIERBAR SEIN (denk beim Schreiben schon: "wie animiere ich das?"):
- Zahlen → Counter/Chart · Vergleiche → Icons/Split · Probleme → Rot · Lösungen → Grün
- Schritte → nummeriert · Wachstum → Kurve · Zeitverlauf → Timeline.
Vermeide abstrakte Sätze, ersetze vage Begriffe durch konkrete Zahlen/Vergleiche.

REGELN: kurze einfache Sätze, kein Fachjargon, keine Füllwörter (halt/quasi/sozusagen),
nie dieselbe Info zweimal, "..." für natürliche Pausen (KI-Stimme klingt natürlicher).

SPANNUNGSBOGEN: Anfang Problem zeigen (Emotion wecken: "das betrifft mich!") →
Mitte Lösung Schritt für Schritt → Ende Motivation + klarer CTA (max 2 Aufforderungen).
Jede Szene endet mit Überleitung zur nächsten (Neugier wecken).

CHECK vor dem Zeigen: klingt es laut vorgelesen natürlich? Füllwörter raus? doppelte Info raus?
alles "du"? Spannungsbogen klar? ~12 Min? jeder Satz visualisierbar?

FORMAT pro Szene:  SZENE N – [Name] · Dauer · Wörter · "Sprechtext"
Zeig mir alle Szenen auf einmal. Dann warte. (Ich mache daraus das Audio in Google Vids.)
```

═══════════════════════════════════════════════════════════════════════════════

# SCHRITT 2B — BILDER PLANEN

```
Analysiere jede Szene aus dem Script: braucht sie ein Bild — oder reichen Animation/Icons?

REGEL: Bilder sind KEINE Pflicht. Frag pro Szene: "Macht ein Bild diese Szene besser?"
DIE BILDER-REGEL: Großes Bild NUR wenn die Stimme über genau dieses Bild redet
(emotional/Storytelling). Sonst Motion-Graphics aus dem Baukasten — KEIN Foto-Hintergrund.

OPTIONEN:
- A (klein 30-40%): Bild als Element, Animation dominiert → Erklär-Szenen mit Zahlen.
- B (groß 70-75%): Bild füllt Screen, Stimme redet drüber → emotionale/Story-Szenen.
- Kein Bild: reine Animations-Szene.

BILD-STIL: futuristisch/cinematic, dunkler Hintergrund + grüner Glow, KEIN Text/Logo, 1920×1080.

FORMAT pro Szene: JA/NEIN. Bei JA: Option A/B + Grund + Was/Stil/Stimmung/Wann/Wie lange.
Am Ende: Gesamtliste aller Bilder. Zeig mir alles, dann warte.
(Ich generiere die Bilder in Google Flow / Nano Banana und lege sie in szene-N/bilder/.)
```

> ⏸️ JETZT MACHE ICH: Audio in Google Vids → szene-N/audio/ · Bilder → szene-N/bilder/

═══════════════════════════════════════════════════════════════════════════════

# SCHRITT 3 — ANIMATIONEN BAUEN  (Hauptschritt)

```
Bau die Animationen mit dem FinanzNeo-Baukasten (src/brand). Audio + Bilder liegen in den Ordnern.
Format: 1920×1080 (16:9) fürs Hauptvideo.

PRO SZENE so vorgehen:
1. Audio mit Whisper wortgenau transkribieren (word_timestamps) → exakte Zeiten je Wort.
2. Analysieren: was wird gesagt? welche Bilder? Dauer? beste Visualisierung?
3. BEAT-FÜR-BEAT-PLAN zeigen: [Zeit] Gesagt / Animation / welcher Baustein / Bild A-B-keins /
   Bildschirm-Aufteilung / Tempo / Übergang. Dann fragen "Sieht der Plan gut aus?" → JA abwarten.
4. Bauen. Nutze Szenen-Vorlagen + Bausteine. Für ernste Charts die Premium-Charts (Recharts).
5. Key-Frame-Stills rendern und SELBST anschauen — Fehler vor dem Voll-Render fangen.
6. Selbst-Eval 1-10. Unter 9 → fixen, dann zeigen.

REGELN:
- Sync: jede Animation startet exakt beim gesprochenen Wort. Pause = ruhige Animation.
- Lifecycle: alles erscheint UND verschwindet, nie hängen bleiben, Screen aufräumen.
- Pacing: max 1-2 Animationen pro Satz. Ruhig↔dynamisch je nach Moment.
- Übergänge abwechslungsreich, NIE 2× derselbe hintereinander (Glitch/Fade/Zoom/Slide/Wipe).
- Farben nach Bedeutung. Bilder nie als Deko-Tapete. Partikel nur gezielt.
- Spring Physics, premium, nie billig/komisch.

Fang mit Szene 1 an: erst Plan zeigen, dann warte.
```

═══════════════════════════════════════════════════════════════════════════════

# SCHRITT 4 — ZUSAMMENFÜGEN + QUALITÄTSPRÜFUNG

```
Füge alle Szenen in richtiger Reihenfolge zu EINEM Video zusammen (16:9).
- Original-Audio läuft durchgehend, lückenlos. Smoothe Übergänge zwischen Szenen (kein harter Schnitt).
- Output: ~/Videos/Finanz-Kanal/[VIDEONAME]/final/[VIDEONAME]-final.mp4

DANN komplette QA von Anfang bis Ende:
- Audio durchgehend ohne Sprünge? gleiche Lautstärke?
- Sync: jede Animation passt zum Text, startet/endet richtig?
- Visuell: jeder Frame professionell? nichts hängt? keine Überlappungen? alles lesbar? Bilder korrekt?
- Übergänge smooth & stimmungspassend? fließt es natürlich Szene zu Szene?
- Konsistenz: Farben/Fonts/Stil überall gleich? fühlt sich wie EIN Video an?
- Tempo: überall angemessen? kann man folgen?
- Story: klarer Spannungsbogen? starkes CTA-Ende?

Bewerte: Gesamt 1-10 + Einzelbereiche (Audio/Sync/Visuell/Übergänge/Konsistenz/Tempo/Story).
Alles unter 9/10 → SOFORT fixen ohne zu fragen. Erst dann zeigen.
Finale Frage an dich: "Würde ich das stolz hochladen? Versteht ein 16-Jähriger alles?"
Nur wenn ja → zeigen. Mit Speicherort, Dauer, Größe, Note, "Bereit für YouTube: JA/NEIN".
```

═══════════════════════════════════════════════════════════════════════════════

# SCHRITT 5 — THUMBNAIL + YOUTUBE-VORBEREITUNG

```
1) THUMBNAIL (1280×720, Brand): dunkelgrün, fette große Zahl (Bebas Neue), Hook-Text,
   Wachstums-Pfeil/Kurve, FinanzNeo-Logo. Hoher Kontrast, klickstark, faceless, kein Foto-Gesicht.
   Render als PNG.

2) 5 TITEL-OPTIONEN (max 60 Zeichen, Zahlen nutzen, Neugier, Keywords vorne, kein Clickbait)
   + Empfehlung mit Begründung.

3) YOUTUBE-BESCHREIBUNG: Hook (2-3 Zeilen) → kurze Zusammenfassung → "Du lernst: ✅✅✅"
   → Kapitel mit Timestamps → CTA (Abonnieren/Kommentieren) → Keywords natürlich eingebaut.

4) TAGS: 5 Haupt-Keywords + 10 Neben + 5 Long-Tail, alle deutsch, SEO-optimiert.

Zeig mir alles auf einmal. Dann warte.
```

═══════════════════════════════════════════════════════════════════════════════

# SCHRITT 6 — SHORTS

```
Analysiere das fertige Video und finde die 3 besten Momente für virale Shorts.
Denk wie ein viraler Creator: "Welcher Moment stoppt den Daumen und hält bis zum Ende?"
Suche: starke Zahl/Fakt, emotionaler Höhepunkt, überraschende Erkenntnis, einfacher wertvoller Tipp.

PRO SHORT (mind. 3):
- Short 1 stärkster Hook · Short 2 überraschendste Erkenntnis · Short 3 emotional stärkster Moment.
- 1080×1920 (9:16), 60-75s. Aufbau: 0-3s starker Hook → Inhalt → starkes Ende + CTA.
- Audio aus dem langen Video. Animationen aufs Hochformat anpassen, kein schwarzer Rand.
- KEINE Untertitel.

OUTPUT je Short in ~/Videos/Finanz-Kanal/[VIDEONAME]/shorts/short-N-[name]/:
- short-N.mp4
- short-N-info.txt: Timestamp im langen Video, Titel, Caption (Hook-Zeile + max 3-4 Zeilen),
  5 Hashtags (2 groß + 2 mittel + 1 spezifisch, deutsch), Thumbnail-Beschreibung,
  Warum-viral, Hook-Stärke 1-10, Viral-Potenzial 1-10.

Zeig mir pro Short die Übersicht. Dann warte.
```

═══════════════════════════════════════════════════════════════════════════════

## SPAR-TIPPS
- Modell: Opus 4.8 · High für die meiste Arbeit. Max nur bei harten Problemen. Sonnet für Kleinkram.
- Großer neuer Schritt = neuer Chat (frischer Kontext). Das Gehirn lädt automatisch.
- "Zu langweilig/billig/unpassend?" → sofort sagen, Claude ändert vor dem Voll-Render.
