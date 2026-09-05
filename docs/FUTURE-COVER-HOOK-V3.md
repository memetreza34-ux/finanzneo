# FinanzNeo Future Cover Hook V3

`FUTURE_COVER_HOOK: finanzneo-cover-hook-v3`

Dieser Standard gilt für **neu mit `npm run reel:create` erzeugte Reels**. Bestehende Reels mit `finanzneo-cover-hook-v2` bleiben unverändert und werden weiterhin nach V2 validiert.

## Kernregel

**Szene 01 ist gleichzeitig Cover und erster echter Content-Beat.**

Es gibt **keine separate Cover-Szene**, keinen stillen Titelvorspann und keinen künstlichen `0,1 s`-/`3 Frames`-Cover-Clip vor dem eigentlichen Inhalt.

Stattdessen:

```text
Frame 0 = Cover-Snapshot derselben scene-01
scene-01 läuft normal weiter
Voiceover startet bereits mit dem ersten gesprochenen Wort in scene-01
Dauer folgt dem echten ersten Hook-Sprechbeat
```

## Hook-Pflicht

Die erste gesprochene Zeile muss sofort zwei Dinge leisten:

1. **Neugier erzeugen**
2. **klar machen, worum es konkret geht**

Erlaubte Hook-Formen:

- direkte Frage
- klare Behauptung
- konkretes Problem
- Warnung
- Kontrast / überraschender Gegensatz
- konkrete Zahl oder messbarer Fakt

Beispiele für die Struktur:

```text
Frage: "3 % Tagesgeld? Wie lange gilt dieser Zins wirklich?"
Behauptung: "Der hohe Tagesgeldzins kann nach wenigen Monaten wieder verschwinden."
Problem: "Du vergleichst Tagesgeld nach 3 % – und übersiehst den Zins danach."
Warnung: "Diese hohe Tagesgeldzahl kann nur ein Aktionszins sein."
Kontrast: "3 % heute können später deutlich weniger sein."
Zahl: "3 % klingt stark – entscheidend sind aber die Monate danach."
```

Nicht erlaubt:

```text
"Hallo ..."
"Willkommen ..."
"Heute geht es um Tagesgeld."
"In diesem Video erkläre ich ..."
"Schauen wir uns das einmal an."
```

Die Hook-Zeile beginnt mit dem **ersten gesprochenen Wort des gesamten Voiceovers**. Es gibt keine Vorrede davor.

## Cover-Headline

`scene-index.title` ist gleichzeitig die Cover-Hook-Headline.

Sie darf keine neutrale Ein-Wort-Themenbezeichnung sein. Sie muss als eigenständige Frage/Aussage/Problem-/Warn-Hook funktionieren und zusammen mit dem scene-01-Hero-Motiv das Thema sofort verständlich machen.

Der Titel wird **nicht von Google Flow in das Bild gerendert**. Er kommt aus Remotion ab Frame 0.

## Frame 0

Frame 0 dient als sauberer Cover-Snapshot:

- Hero-Bild sichtbar
- exakter Cover-Hook-Titel sichtbar
- kein normales SceneHeader-Icon
- keine Caption
- kein CTA
- keine Zusatzkarte
- kein Fade-in

`cover.png` wird aus **Frame 0 der bereits geprüften finalen MP4** exportiert.

Frame 0 ist **kein eigener Zeitblock**. Er verlängert scene-01 nicht künstlich.

## Voiceover und Captions

Voiceover startet bereits in scene-01.

Captions dürfen **nach Frame 0 innerhalb derselben scene-01** beginnen und folgen den echten Wort-Timestamps. Es ist ausdrücklich falsch, Captions oder Audio pauschal erst ab scene-02 zu starten.

Damit gilt:

```text
Frame 0: sauberes Cover
ab dem laufenden Hook-Beat: Voiceover + normale Caption-Logik
```

## Timing

Scene-01-Dauer ist `content-driven-from-hook-voiceover`.

- kein fester Cover-Hold
- `dedicatedCoverHoldFrames = 0`
- wenn eine echte Dauer bereits bekannt ist, darf scene-01 nicht als 3-Frame-/0,1-s-Clip geplant sein
- Future-V3-Rhythmus bleibt maßgeblich: statische Beats typischerweise ca. 1,8–3,0 s; echtes Voiceover entscheidet final

## Bildlogik

Das scene-01-Flow-Bild ist nicht einfach "ein hübsches Cover". Es ist das **erste visuelle Erklärbild des Reels**.

Es muss:

- exakt zur ersten gesprochenen Hook-Zeile passen
- den konkreten Themenanker sichtbar machen
- ohne Untertitel schnell verständlich sein
- Literal-first V3 erfüllen
- oben ausreichend ruhige tiefschwarze Fläche für den Remotion-Titel lassen

Verboten sind neutrale Titelkarten, Symbolsammlungen oder generische Finanzmotive, die auch zu vielen anderen Themen passen könnten.

## Maschinenlesbare Pflichtfelder

`scene-index.json -> coverHookContract`:

```text
id: finanzneo-cover-hook-v3
scene01IsCover: true
scene01IsFirstContentBeat: true
dedicatedCoverOnlySceneForbidden: true
zeroPointOneSecondCoverOnlyIntroForbidden: true
coverSnapshotFrame: 0
dedicatedCoverHoldFrames: 0
voiceoverRequiredInScene01: true
voiceoverStartsInScene01: true
hookRequiredAtFirstSpokenWord: true
genericIntroForbidden: true
captionStartsFromSceneId: scene-01
coverFrameCaptionFree: true
captionsAllowedInsideScene01AfterCoverFrame: true
exportedCoverSource: final-video-frame-0
scene01TimingSource: first-spoken-hook-beat
```

`scene-01.hook`:

```text
form: question | claim | problem | warning | contrast | number
spokenLine: exakte erste gesprochene Zeile des Gesamtskripts
topicAnchor: konkretes Thema / Objekt
coverHeadline: exakt scene-index.title
startsAtFirstSpokenWord: true
noGenericIntro: true
```

## QA

Ein neues Reel fällt durch, wenn:

- scene-01 nur 0,1 s / 3 Frames als separates Cover steht
- Voiceover erst in scene-02 startet
- die erste gesprochene Zeile nur begrüßt oder das Thema neutral ankündigt
- Cover-Headline nur eine generische Themenbezeichnung ist
- `script-fliess-text.txt` nicht exakt mit `scene-01.hook.spokenLine` beginnt
- der konkrete Themenanker weder in Hook-Zeile noch Cover-Headline erkennbar ist
- Frame 0 bereits Caption/CTA/Standard-Header-Icon enthält
- Google Flow den Cover-Titel in das Bild selbst schreibt

Ziel: **Das Reel beginnt inhaltlich sofort – und genau dieser erste starke Moment ist gleichzeitig das Cover.**
