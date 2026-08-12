# FinanzNeo — Bild- und Render-QA

> Bei Widerspruch gilt `CLAUDE.md`.

## Einzelbild — allgemein

- [ ] Bild erklärt exakt den gesprochenen Satz bzw. beim Cover das Reel-Thema.
- [ ] Eine dominante Finanzmetapher / Hero-Objekt.
- [ ] Premium Fintech Editorial 3D.
- [ ] Deep charcoal green-black + Emerald/Mint.
- [ ] Gold nur für Geld/Wert; Rot-Orange für Risiko/Verlust/Schulden.
- [ ] Genau EIN nahtloser Hintergrund von oben bis unten.
- [ ] Keine horizontalen Bänder, Panels, Floor-Wall-Grenze oder Horizont.
- [ ] Wenn Person: Gesicht klar sichtbar, frontal/3⁄4, Augen/Nase/Mund erkennbar.
- [ ] Keine Dioramen, Game-Level, Neon-Tunnel, Sci-Fi-Korridore oder Dashboards.
- [ ] Quelle ist vertikal 9:16 und wichtige Motive/Texte liegen sicher im Frame.

## Cover `Bild 00` — Pflicht

- [ ] Eine große deutsche Cover-Überschrift ist direkt im Google-Flow-Bild vorhanden.
- [ ] Überschrift entspricht **exakt** dem Block `COVER-ÜBERSCHRIFT – EXAKT SO:` im Cover-Prompt.
- [ ] Sie nennt konkret das Reel-Thema.
- [ ] Ungefähr 3–8 Wörter, maximal zwei Zeilen.
- [ ] Auf Smartphone sofort gut lesbar.
- [ ] Keine falsche Schreibweise, fehlenden Buchstaben oder abgeschnittenen Wörter.
- [ ] Kein zusätzlicher Subtitle, CTA oder erklärender Satz.
- [ ] Keine separate Textbox, kein Header-Balken, kein zweiter Hintergrund hinter der Überschrift.
- [ ] Remotion legt **keine zusätzliche/reparierende Cover-Headline** darüber.

Wenn die Pflichtüberschrift fehlt, falsch geschrieben, abgeschnitten oder schlecht lesbar ist: **Cover in Google Flow neu erzeugen. Nicht in Remotion reparieren.**

## Szenenbilder `Bild 01+`

- [ ] Nur erlaubte kurze deutsche Objektlabels.
- [ ] Keine KI-Headline.
- [ ] Kein KI-Untertitel.
- [ ] Kein erklärender Satz/CTA.
- [ ] Szenenheadline kommt später aus Remotion.

## Remotion-Bilddarstellung — Pflicht

- [ ] `full-frame-no-crop`.
- [ ] Nutzerbild läuft über die komplette 1080×1920-Szenenfläche.
- [ ] Bild beginnt bei Y=0 und endet bei Y=1920.
- [ ] Kein kleiner mittlerer `VisualStage`/Bildcontainer.
- [ ] Kein absichtlicher Crop, Zoom oder Focal-Point-Vertrag.
- [ ] Kein sichtbarer rechteckiger Bildrand.
- [ ] Keine unscharfe Bildkopie als Hintergrund.
- [ ] Bei Szenen 01+: Headline liegt als Overlay über demselben Vollbild.
- [ ] Cover: keine zusätzliche Remotion-Headline.
- [ ] Untertitel liegt als Overlay über demselben Vollbild.
- [ ] Für Lesbarkeit nur ein weicher kontinuierlicher transparenter Scrim.
- [ ] Kein harter grüner Header-Hintergrund.
- [ ] Kein schwarzer/separater Footer unter dem Bild.

## Native Remotion-Szenen

- [ ] Hintergrund läuft über komplette 1080×1920-Fläche.
- [ ] Kein sichtbarer Boden.
- [ ] Kein Horizont.
- [ ] Kein Wand-/Studio-Split.
- [ ] Keine obere/untere Hintergrundzone.
- [ ] Animation nutzt den verfügbaren Mittelraum sichtbar groß.

## Layout / Plattform-Safe-Area

Richtwerte 1080×1920:

- [ ] Szenenheadline 01+ ungefähr ab Y 72.
- [ ] Bildszene selbst full-frame Y 0–1920.
- [ ] Native Animationsinhalte ungefähr Y 220–1490.
- [ ] Caption ungefähr 300 px über Bottom.
- [ ] unten mindestens ca. 260 px Plattform-UI-Sicherheitszone.
- [ ] rechts mindestens ca. 150 px Abstand für Plattform-Buttons.
- [ ] keine unnötig großen leeren Bereiche zwischen Headline, Motiv und Caption.

## Untertitel / Synchronität

- [ ] Wortzeiten stammen aus dem exakten finalen Voiceover.
- [ ] Keine gleichmäßig geschätzte Wortverteilung.
- [ ] **Genau ein vollständiger Satz gleichzeitig.**
- [ ] Niemals zwei Sätze gleichzeitig.
- [ ] Hart maximal zwei sichtbare Zeilen.
- [ ] Schrift auf Smartphone gut lesbar; keine Mini-Schrift.
- [ ] Zu langer Satz wird sinnvoll geteilt statt extrem verkleinert.
- [ ] Aktives Wort exakt während seiner echten `start/end`-Zeit grün.
- [ ] Rest weiß.
- [ ] Satzwechsel beim ersten gesprochenen Wort des nächsten Satzes.
- [ ] Kurze Sprachpause hält den bisherigen Satz sichtbar.
- [ ] Keine Caption-Lücken oder Wort-Sprünge.
- [ ] Keine undurchsichtige/schwarze Caption-Karte.

## Gesamtreel

1. Alle Nutzerbilder als Kontaktbogen prüfen.
2. Cover separat auf exakte Google-Flow-Pflichtüberschrift prüfen.
3. Für jede Bildszene Anfang/Mitte/Ende prüfen.
4. Prüfen, dass das Bild an keiner Stelle vor dem unteren Frame endet.
5. Prüfen, dass kein zweiter/dritter Hintergrundbereich sichtbar wird.
6. Native Animationen auf Boden/Horizont/Studio-Splits prüfen.
7. Caption-Safe-Area auf Plattform-UI prüfen.
8. Karaoke-Sync stichprobenartig an kurzen und langen Wörtern prüfen.
9. Vollständige MP4 mit Ton ansehen.
10. Wenn ein Fehler technisch behebbar ist: fixen, neu rendern, erneut prüfen.

## Sofortige Ablehnung

Cover neu erzeugen bei:

- Pflichtüberschrift fehlt/falsch geschrieben/abgeschnitten/schlecht lesbar
- zusätzlichem Subtitle/CTA/erklärendem Satz
- separatem Headline-Balken/Panel
- zwei sichtbaren Hintergründen/Bändern
- Floor-Wall-Grenze/Horizont
- gesichtsloser/abgewandter Person
- falscher Bildaussage

Szenenbild neu erzeugen bei:

- zwei sichtbaren Hintergründen/Bändern im Quellbild
- Floor-Wall-Grenze/Horizont
- gesichtsloser/abgewandter Person
- falschen Labels
- großer KI-Headline/Satz
- falscher Bildaussage

Remotion reparieren bei:

- Remotion-Headline über dem Cover
- kleinem Poster/Inlay
- Bild endet sichtbar vor Y=1920
- harter Header-/Footer-Hintergrund
- sichtbarem Bildrand
- absichtlichem Crop des Nutzerbildes
- schwarzer Caption-Karte
- zwei Caption-Sätzen gleichzeitig
- zu kleiner Caption-Schrift
- Caption in Plattform-UI

## Protokoll

```text
Cover-Headline aus Google Flow: [BESTANDEN / NICHT BESTANDEN]
Bildwelt: [BESTANDEN / NICHT BESTANDEN]
Full Frame No Crop: [BESTANDEN / NICHT BESTANDEN]
Ein Hintergrund / keine Panels: [BESTANDEN / NICHT BESTANDEN]
Genau 1 Untertitelsatz: [BESTANDEN / NICHT BESTANDEN]
Max. 2 Zeilen: [BESTANDEN / NICHT BESTANDEN]
Caption Safe Area: [BESTANDEN / NICHT BESTANDEN]
Wort-Sync: [BESTANDEN / NICHT BESTANDEN]
Full-MP4-QA: [BESTANDEN / NICHT BESTANDEN]
```
