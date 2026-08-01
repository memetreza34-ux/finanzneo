# FinanzNeo Bildstil — verbindlich

## Ziel

FinanzNeo verwendet eine konsistente, moderne 3D-Illustrationswelt für Finanzwissen. Die Bildsprache orientiert sich an hochwertigen deutschsprachigen Fintech-Erklärformaten, ohne deren konkrete Motive, Figuren oder Markenauftritt zu kopieren.

Jedes Bild erklärt genau eine finanzielle Aussage. Der Inhalt darf wechseln, der Stil nicht.

## Kernstil

- hochwertige stilisierte 3D-Illustration
- klar illustrativ, nicht fotorealistisch
- freundlich und verständlich, aber nicht kindlich
- reduzierte, abgerundete Formen
- weiche Materialien mit leichtem Glanz
- kompakte Miniaturszenen und klare visuelle Metaphern
- dunkler Anthrazit-Hintergrund
- smaragdgrüne und mintgrüne Akzente
- warme Gold- oder Orangetöne nur für Kontrast, Warnung oder Konsum
- sanfte Studiobeleuchtung, dezenter Bloom, weiche Bodenschatten
- vertikales Format 9:16

## Figuren

Figuren dürfen verwendet werden, wenn eine Handlung dadurch klarer wird.

Verbindlich:

- vereinfachte stilisierte 3D-Menschen
- harmonische Proportionen
- freundliche, neutrale Gesichtszüge
- keine realen Personen
- keine Fotorealistik
- keine überzeichneten Pixar-Gesichter
- Kleidung in ruhigen natürlichen Farben mit einzelnen grünen Akzenten
- Figuren zeigen eine konkrete Handlung: investieren, einkaufen, sparen, vergleichen, arbeiten, entscheiden

## Objekte und Orte

- sofort erkennbare stilisierte Alltagsobjekte
- vereinfachte Gebäude, Supermärkte, Wohnungen, Banken, Fabriken, ETFs, Münzen, Geldbörsen, Diagramme oder Bäume
- keine realistische Architekturvisualisierung
- keine sterile UI-Darstellung
- keine abstrakten Fantasiemaschinen
- keine beliebigen Dekoelemente ohne Aussage

## Komposition

- ein klares Hauptmotiv
- eine Aussage pro Bild
- höchstens drei bis fünf unterstützende Elemente
- Illustration statt Dashboard
- echte Szene oder visuelle Metapher statt lose angeordneter Icons
- oberste 15 % des Bildes freihalten für die Remotion-Überschrift
- unterste 25 % des Bildes bewusst frei und ruhig halten — dort dürfen keine Gesichter, Labels oder wichtigen Bildinhalte liegen, weil dort der Untertitel eingeblendet wird
- zentrale oder leicht versetzte Hauptkomposition
- klare Blickführung
- keine Überladung

## Farbe

Grundpalette:

- Hintergrund: dunkles Anthrazit bis tiefes Grün-Schwarz
- Primärakzent: Smaragdgrün, kräftig und leuchtend statt blass
- Sekundärakzent: Mintgrün, kräftig und leuchtend statt blass
- positive Entwicklung: sattes, deutlich sichtbares Grün
- neutrale Objekte: natürliche, leicht stilisierte Farben
- Warnung, Verlust oder Konsum: dezentes Orange, Rot oder warmes Gold

Nicht das gesamte Bild grün einfärben. Grün dient der Führung und Bedeutung, nicht als globaler Farbfilter. Das Bild soll insgesamt mutig und kontrastreich wirken, nicht zurückhaltend oder blass — starker Kontrast zwischen dunklem Hintergrund und leuchtenden Akzenten, kein verwaschener Look.

## Beleuchtung und Material

- selbstbewusstes Keylight von vorne oder seitlich oben
- deutlicher, kräftig leuchtender grüner Rim-Light-Akzent
- weiche Umgebungsbeleuchtung mit klaren Lichtakzenten am Hauptmotiv
- dezente Reflexionen
- leicht abgerundete Kanten
- glatte, hochwertige Oberflächen
- geringe bis mittlere Tiefenschärfe
- keine harten Hochglanz-Produkt-Renderings
- keine düstere Cyberpunk-Optik

## Text im Bild

Bildtext ist optional und sparsam einzusetzen.

Erlaubt:

- kurze deutsche Labels mit ein bis drei Wörtern
- maximal drei bis fünf Labels
- Begriffe wie „ETF“, „Inflation“, „Konsum“, „Miete“, „Vermögen“, „Notgroschen“

Nicht erlaubt:

- lange Sätze
- englische Begriffe, wenn eine gute deutsche Form existiert
- große Überschriften im generierten Bild
- Untertitel im generierten Bild
- Logos, Marken oder Wasserzeichen

Überschrift, Kicker, Untertitel und CTA entstehen grundsätzlich in Remotion.

## Verbotene Stilabweichungen

- Fotorealismus
- echte Menschen
- Pixar- oder Kinderfilmstil
- Clay- oder Knetoptik
- UI-Dashboard als Hauptmotiv
- flache 2D-Infografik
- sterile Apple-Produktvisualisierung
- realistische Miniaturstadt mit zu vielen Gebäuden
- komplexes Netzwerk aus vielen Lichtleitungen
- schwebende Icons ohne räumlichen Zusammenhang
- übermäßige Partikel, Glow oder Neon
- mehrere unverbundene Aussagen in einem Bild

## Prompt-Aufbau

Jeder Bildprompt besteht aus vier Teilen:

1. **Aussage:** Was soll der Zuschauer verstehen?
2. **Szene:** Welche konkrete Handlung oder Metapher zeigt das?
3. **Beschriftungen:** Nur notwendige kurze deutsche Labels.
4. **Masterstil:** Der unveränderte Stilblock aus `MASTER-STYLE-PROMPT.md`.

Der Agent verändert nur Aussage, Szene, Figuren, Objekte und Labels. Der Masterstil bleibt unverändert.

## Qualitätsprüfung

Ein Bild ist nur freigegeben, wenn:

1. die Aussage ohne Prompt verständlich ist,
2. der Blick sofort auf das Hauptmotiv fällt,
3. die Szene wie eine Illustration und nicht wie ein Diagramm wirkt,
4. Figuren und Objekte stilisiert statt realistisch sind,
5. maximal eine zentrale Finanzidee gezeigt wird,
6. natürliche Farben mit gezielten grünen Akzenten verwendet werden,
7. kurze deutsche Labels korrekt geschrieben sind,
8. genug Platz für Remotion-Text bleibt,
9. das Bild zur bestehenden FinanzNeo-Bildwelt passt.
