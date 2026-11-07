# YouTube — Beleg-Szenen (`finanzneo-youtube-beleg-v1`)

> Arman, 30.10.2026: „Wir sollten nicht nur KI-Bilder erstellen, sondern auch richtige Screenshots wie Finanzbär im Video.“
> Bei Widersprüchen gilt `CLAUDE.md`. Gilt für YouTube-Longform; Reels sind nicht betroffen.

## Warum

Gezeichnete Flow-Bilder erklären gut, beweisen aber nichts. Bei Zahlen, Gesetzen, Fristen und Aussagen Dritter zeigt eine Beleg-Szene die **echte Quelle**. Die Kamera zoomt auf die Fundstelle, und ein Textmarker läuft über den Wortlaut, sobald er gesprochen wird. Das schafft Glaubwürdigkeit: „Das hat jemand geprüft.“

## Wann Beleg statt Bild

| Sprechpunkt | Visual |
|---|---|
| Zahl, Grenze, Frist oder Datum aus Gesetz/Behörde („höchstens 540 €“, „ab 1. Januar 2027“) | **beleg** |
| „Der Bundestag hat beschlossen …“, „Die Verbraucherzentrale warnt …“ | **beleg** |
| Preis/Konditionen eines Anbieters, Statistik (Destatis, Bundesbank) | **beleg** |
| Gefühl, Metapher, Alltagsszene, Figur | **image** (Flow) |
| Rechnung oder Entwicklung über Zeit | **animation / data** |

## Pflicht ab Qualitätsregel V3 (`finanzneo-youtube-quality-v3`)

- Einen Beleg je volle 90 s Sprechzeit, **mindestens 3** pro Video.
- Der erste Beleg kommt spätestens im ersten inhaltlichen Kapitel nach dem Hook.
- Jeder Markierungs-`cue` fällt im Sprechabschnitt seines Belegs.
- Belege mit Markierungen zählen bei der Standzeit-Regel wie Bilder mit Akzenten: Jede Markierung ist neue Information.

`youtube:create` legt neue Projekte mit V3 an. Ältere Projekte werden nicht rückwirkend migriert.

## Im Visual-Plan

```js
{
  type: 'beleg',
  chapter: K1,
  cue: 'Für das Standarddepot gilt',             // Start der Szene im Skript
  beat: 'Kostendeckel: geplant 1,5 Prozent, Verbraucherschützer protestieren.',
  quelle: 'Deutscher Bundestag',                 // wird im Video angezeigt
  quellenArt: 'behoerde',                        // gesetz | behoerde | statistik | verbraucherschutz | unternehmen | presse
  url: 'https://www.bundestag.de/dokumente/textarchiv/2026/kw12-pa-finanzen-1152002',
  markierungen: [                                // 1–3; exakter Wortlaut der Seite
    {text: 'den Kostendeckel von 1,5 Prozent für Standardprodukte ganz aufzuheben', cue: 'eineinhalb Prozent'},
    {text: 'war dem Bundesverband der Verbraucherzentralen der geplante Deckel viel zu hoch', cue: 'Verbraucherschützer haben'},
  ],
  entfernen: ['.newsletter-box'],                // optional: weitere störende Elemente (CSS-Selektoren)
}
```

Danach:

```bash
node scripts/youtube-plan-anwenden.mjs youtube/<Projekt>
npm run youtube:belege -- youtube/<Projekt>
npm run youtube:validate -- youtube/<Projekt>
```

## Was `youtube:belege` macht

1. Öffnet die URL im lokalen Chrome (headless, 1440 px breit, doppelte Auflösung).
2. Entfernt Cookie-Banner und Overlays.
3. Sucht jede Markierung im **echten Seitentext**. Steht der Text nicht auf der Seite, bricht es ab. Erfundene oder umformulierte Zitate sind damit unmöglich.
4. Speichert `beleg.png` und `beleg.json` im Visual-Ordner:
   - die Ausschnitte: Logo-Zeile, Titel, Textblock
   - die exakten Positionen der Markierungen
   - das Abrufdatum

Bilder, Videos und Werbung zwischen Titel und Text fallen automatisch weg. Am Wortlaut wird nichts verändert.

Wenn eine Seite den Abruf blockiert (Bot-Schutz, Paywall), nimm eine andere Primärquelle: Pressemitteilung, Bundestag, Ministerium, Gesetzestext.

## Im Video

`BelegVisual` (`src/youtube-projekt/BelegVisual.tsx`) zeigt:

- die Seite als weiße Karte auf dem Kanal-Creme `DATEN.grund`
- oben links die Quelle mit Domain und Abrufdatum
- eine Kamerafahrt zu jeder Fundstelle kurz vor ihrem gesprochenen Wort und einen gelben Textmarker, der Zeile für Zeile über den Wortlaut läuft

Die Zeitpunkte setzt `youtube:zusammenbau` aus den echten Wort-Zeitstempeln. Der Zoom ist auf 2,4 begrenzt, damit der Screenshot scharf bleibt.

## Recht und Fairness

- **Amtliche Texte** (Gesetze, Bundestag, Ministerien, Behörden; § 5 UrhG) und **eigene Angaben** von Anbietern und Verbänden sind die bevorzugten Quellen.
- **Presse** (`quellenArt: 'presse'`) nur als kurzer Beleg-Ausschnitt: höchstens 700 Zeichen, mit sichtbarer Quelle (Zitatrecht, § 51 UrhG). Keine ganzen Artikel, keine Paywall-Inhalte, keine Artikelfotos.
- Keine Screenshots von Privatpersonen (Social-Media-Posts, Kommentare, Namen).
- Die Quelle gehört zusätzlich in `_intern/05-publishing/sources-disclaimer.txt` und in die Videobeschreibung.
