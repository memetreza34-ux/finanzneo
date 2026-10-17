const K0 = 'Hook — Null Prozent, geschenktes Geld?';
const K1 = 'Kapitel 1 — Wer bezahlt die Zinsen?';
const K2 = 'Kapitel 2 — Wann null Prozent wirklich gratis ist';
const K3 = 'Kapitel 3 — Vier Fallen';
const K4 = 'Kapitel 4 — Viele kleine Raten';
const K5 = 'Kapitel 5 — Neue Regeln ab 20. November';
const K6 = 'Kapitel 6 — Der Vier-Punkte-Check';
const K7 = 'Fazit';

export const title = '0 % Finanzierung: Wann sie wirklich gratis ist – und wann sie teuer wird';

export const thumbnail = {
  file: 'YouTube Thumbnail - Null Prozent Falle.png',
  prompt: 'A bold, simple YouTube thumbnail on a warm cream background. On the right, a big friendly green price tag reads "0 %". A thin chain hangs from the tag and leads down to a dark red credit card at the bottom right, half hidden. On the left, a short bold dark hand-lettered headline in German: "0 % Finanzierung" and below it, smaller in red: "Die Falle". Very few elements, strong contrast, readable at small size, generous empty space.',
};

const img = (chapter, cue, beat, name, expected, prompt, labels, extra = {}) => ({type: 'image', chapter, cue, beat, name, expected, prompt, labels, ...extra});

export const visuals = [
  // HOOK
  img(K0, 'Null Prozent Finanzierung', 'Null Prozent Finanzierung: kein Zins, kleine Monatsrate — klingt wie geschenktes Geld.', 'Null Prozent Schild', 'Großes Ladenschild „0 % Finanzierung“ neben einem Fernseher mit „nur 50 € im Monat“',
    'Inside a bright electronics store, a big hanging sign reads "0 % Finanzierung". Below it stands a flat-screen TV with a price card "nur 50 € im Monat". A customer looks at it with interest. Calm, friendly, few elements.', ['Ladenschild', 'Fernseher', 'Ratenkarte']),
  img(K0, 'Aber manchmal unterschreibst du', 'Manchmal unterschreibst du einen zweiten Vertrag, den du gar nicht wolltest.', 'Zweiter Vertrag', 'Hand unterschreibt einen Vertrag, darunter lugt ein zweites Blatt hervor',
    'A hand signs a contract on a desk. Underneath the top sheet, a second document peeks out and is slightly highlighted, labeled "Kreditrahmen". The person does not notice it. Simple desk scene, warm light colors.', ['Vertrag', 'zweites Blatt', 'Hand']),
  img(K0, 'In diesem Video zeige ich dir', 'Woran du den Unterschied erkennst.', 'Zwei Angebote Lupe', 'Zwei gleich aussehende 0-%-Angebote, eine Lupe zeigt beim rechten winziges Kleingedrucktes',
    'Two almost identical sale cards side by side, both reading "0 %". A large magnifying glass hovers over the right card and reveals a line of tiny fine print at its bottom. The left card has no fine print. Clean comparison layout.', ['Angebotskarten', 'Lupe', 'Kleingedrucktes']),
  // KAPITEL 1
  img(K1, 'Fangen wir mit einer Frage an', 'Wer bezahlt eigentlich die Zinsen? Verschenken will niemand etwas.', 'Wer zahlt die Zinsen', 'Kunde vor „0 % Zinsen“-Schild mit großer Denkblase „Wer zahlt?“',
    'A customer stands in front of a sign "0 % Zinsen" and has a large thought bubble with the German question "Wer zahlt die Zinsen?". Simple, slightly humorous, warm colors.', ['Kunde', 'Schild', 'Denkblase'], {akzente: [{cue: 'Denn verschenken will niemand etwas', text: 'Niemand verschenkt Geld', ton: 'neutral'}]}),
  img(K1, 'Im Elektronikmarkt leiht dir', 'Meistens leiht nicht der Händler das Geld, sondern eine Partnerbank.', 'Dreieck Kunde Haendler Bank', 'Dreieck aus Kunde, Händler und Partnerbank; Geldpfeil von der Bank zum Kunden',
    'A simple triangle diagram with three illustrated icons: a customer labeled "Kunde", a store labeled "Händler" and a bank building labeled "Partnerbank". A thick green arrow with a banknote goes from the bank to the customer. Thin gray lines connect all three. Clean infographic style.', ['Kunde', 'Händler', 'Partnerbank', 'Geldpfeil']),
  img(K1, 'Und die Bank will verdienen', 'Oft zahlt der Händler der Bank einen Teil der Zinsen, weil er dadurch mehr verkauft.', 'Haendler zahlt Zinsen', 'Gleiches Dreieck, jetzt zusätzlich Pfeil „Zinsen“ vom Händler zur Bank und volle Einkaufstüten beim Händler', 'The exact same triangle diagram as the reference with "Kunde", "Händler" and "Partnerbank". Add only one change: a terracotta arrow labeled "Zinsen" goes from the store to the bank, and next to the store stand several full shopping bags to show more sales. Keep everything else unchanged.', ['Pfeil Zinsen', 'Einkaufstüten'], {ref: 5, change: 'Pfeil „Zinsen“ vom Händler zur Bank und Einkaufstüten beim Händler ergänzt'}),
  img(K1, 'Manchmal verdient die Bank aber auch', 'Manchmal verdient die Bank später an dir.', 'Bank verdient spaeter', 'Bankgebäude, daneben Kalenderblatt „später“ und ein kleiner Münzpfeil vom Kunden zur Bank',
    'A bank building on the right. On the left a small customer figure. Between them a calendar page labeled "später" and a small dotted arrow with a coin going from the customer to the bank. Calm, simple composition.', ['Bank', 'Kalender später', 'Münze']),
  img(K1, 'Wichtig ist', 'Eine Null-Prozent-Finanzierung ist ein ganz normaler Kredit.', 'Kreditvertrag', 'Dokument mit Überschrift „Kreditvertrag“ und Stempel „0 % Sollzins“',
    'A single clean document lying flat on a cream surface. The heading reads "Kreditvertrag". A round stamp on it reads "0 % Sollzins". A pen lies beside it. Simple editorial still life, illustrated.', ['Kreditvertrag', 'Stempel']),
  img(K1, 'Mit Vertrag, mit Prüfung deiner Bonität', 'Mit Vertrag, Bonitätsprüfung und Schufa-Eintrag.', 'Vertrag Bonitaet Schufa', 'Drei Symbole nebeneinander: Vertrag, Lupe über Person „Bonität“, Akte „Schufa-Eintrag“',
    'Three simple illustrated icons in a row with short German labels: a contract sheet labeled "Vertrag", a magnifying glass over a person silhouette labeled "Bonität", and a file folder labeled "Schufa-Eintrag". Thin connecting line between them. Clean, readable.', ['Vertrag', 'Bonität', 'Schufa-Eintrag']),
  // KAPITEL 2
  img(K2, 'Damit es fair bleibt', 'Es gibt echte Null-Prozent-Finanzierungen. Beispiel: Fernseher für 600 €.', 'Fernseher 600 Euro', 'Fernseher mit Preisschild „600 €“ und grünem Haken „echte 0 %“',
    'A flat-screen TV standing on a low sideboard with a price tag "600 €". Next to it a small green badge with a check mark reads "echte 0 %". Calm living-room hint, cream background.', ['Fernseher', 'Preisschild 600 €', 'Haken']),
  {type: 'animation', chapter: K2, cue: 'Du zahlst zwölf Raten', beat: '12 Raten à 50 € = 600 € — genau der Kaufpreis, keinen Cent mehr.',
    brief: 'Zwölf Ratenblöcke à 50 € (Monat 1–12) bauen sich nacheinander zu einem Balken auf, der exakt so lang ist wie das Preisschild „600 €“. Ergebnis: „600 € = Kaufpreis“, darunter „0 € extra“. Beispiel kennzeichnen. Andere Mechanik als ein Wochenraster (das gab es im letzten Video).'},
  img(K2, 'Dann ist das wirklich ein guter Deal', 'Guter Deal: Du behältst dein Geld länger und zahlst nichts drauf.', 'Guter Deal', 'Person entspannt auf dem Sofa vor dem neuen Fernseher, daneben volles Sparschwein',
    'A relaxed person sits on a sofa watching the new TV. On the side table a full piggy bank with a small label "bleibt länger bei dir". Warm, positive, simple.', ['Person', 'Fernseher', 'Sparschwein']),
  img(K2, 'Aber dafür muss alles drumherum stimmen', 'Alles drumherum muss stimmen — und da liegen vier Fallen.', 'Vier Fallen', 'Vier nummerierte Warnschilder 1–4 nebeneinander auf einem Weg',
    'A simple path leads into the distance. Along it stand four small triangular warning signs numbered "1", "2", "3" and "4". Calm, clear, slightly playful, lots of empty space.', ['Weg', 'Warnschilder 1–4']),
  // KAPITEL 3
  img(K3, 'Falle eins: der Preis', 'Null Prozent sagt nur etwas über den Zins, nicht über den Preis.', 'Zins ist nicht Preis', 'Zwei Etiketten: „Zins: 0 %“ grün, „Preis: ?“ mit großem Fragezeichen',
    'Two large paper labels side by side. The left label in green reads "Zins: 0 %". The right label reads "Preis: ?" with a big question mark. A small number "1" in a warning triangle in the corner. Clean and clear.', ['Etikett Zins', 'Etikett Preis', 'Warnschild 1']),
  {type: 'data', chapter: K3, cue: 'Kostet derselbe Fernseher in einem anderen Shop', beat: 'Gleicher Fernseher: 600 € mit 0 % vs. 550 € woanders → 50 € mehr, die Zinsen stecken im Preis.',
    brief: 'Beispielrechnung (als „Beispiel“ gekennzeichnet): zwei Shops, gleicher Fernseher. Shop A „0 % Finanzierung“ 600 €, Shop B ohne Finanzierung 550 €. Die Differenz von 50 € wird sichtbar herausgelöst und als „Zinsen im Preis“ beschriftet.'},
  img(K3, 'Vergleich also immer zuerst den Preis', 'Erst den Preis vergleichen, dann die Finanzierung.', 'Preise vergleichen', 'Person im Laden vergleicht auf dem Handy den Preis desselben Fernsehers',
    'A customer in an electronics store holds a smartphone showing a simple price comparison list for the same TV with three prices. The TV with its price tag stands in front of them. Friendly, simple.', ['Kunde', 'Handy Preisvergleich', 'Fernseher']),
  img(K3, 'Falle zwei: die Extras', 'Beim Abschluss werden Extras angeboten: Ratenschutz, Garantie, Zubehör.', 'Extras an der Kasse', 'Verkäufer schiebt drei Angebotskarten über den Tresen: Ratenschutz, Garantie, Zubehör',
    'At a store counter, a friendly salesperson slides three cards toward a customer. The cards read "Ratenschutzversicherung", "Garantie +2 Jahre" and "Zubehörpaket". A small "2" in a warning triangle in the corner. Simple, readable.', ['Verkäufer', 'Angebotskarten', 'Warnschild 2']),
  {type: 'data', chapter: K3, cue: 'Das klingt vernünftig, kostet aber extra', beat: 'Versicherung 8 € pro Monat × 12 = 96 € → aus 600 € werden 696 €.',
    brief: 'Beispielrechnung (als „Annahme“ gekennzeichnet): Kaufpreis-Balken 600 €. Zwölf kleine Zusatzstücke à 8 € hängen sich Monat für Monat an → 96 €. Gesamt 696 €. Die Zusatzstücke in anderer Farbe, Label „Versicherung“.'},
  img(K3, 'Solche Extras sind in der Regel freiwillig', 'Extras sind in der Regel freiwillig — frag nach und sag im Zweifel Nein.', 'Nein danke', 'Hand schiebt die Angebotskarten zurück, Sprechblase „Nein, danke“',
    'A customer\'s hand gently pushes three offer cards back across a counter. A speech bubble reads "Nein, danke". Confident, friendly, minimal.', ['Hand', 'Angebotskarten', 'Sprechblase']),
  img(K3, 'Kurze Frage an dich', 'Kommentarfrage: Schon mal mit null Prozent finanziert? Hat es sich gelohnt?', 'Frage an dich', 'Große Sprechblase „Schon mal mit 0 % finanziert?“',
    'A large friendly speech bubble on a cream background with the German question "Schon mal mit 0 % finanziert?". Below it two small answer bubbles "Ja, gelohnt" and "Ja, bereut". Minimal, warm colors.', ['Sprechblase', 'Antwortblasen']),
  img(K3, 'Schreib es mir in die Kommentare', 'Schreib es in die Kommentare.', 'Kommentare', 'Handy mit Kommentarfeld und Stift-Symbol, ein Daumen tippt',
    'A hand holds a smartphone. On the screen a simple comment field with a few short lines of handwriting-like text and a small pencil icon. A thumb is typing. Very simple, illustrated, not a real app interface.', ['Handy', 'Kommentarfeld']),
  img(K3, 'Falle drei ist die teuerste', 'Falle drei ist die teuerste — und steht im Kleingedruckten.', 'Kleingedrucktes Lupe', 'Lupe über dem Kleingedruckten eines Vertrags, vergrößert lesbar: „Kreditrahmen“',
    'A contract page with tiny fine print at the bottom. A large magnifying glass enlarges one line of the fine print so it becomes readable: "inklusive Kreditrahmen". A small "3" in a warning triangle in the corner. Clean, focused.', ['Vertrag', 'Lupe', 'Warnschild 3']),
  img(K3, 'Manche Null-Prozent-Angebote sind an eine Kreditkarte', 'Manche 0-%-Angebote sind an eine Kreditkarte oder einen Rahmenkredit gekoppelt.', 'Preisschild an Kreditkarte', 'Preisschild „0 %“ mit einer Kette an eine Kreditkarte gekoppelt',
    'A green price tag reading "0 %" is connected by a short metal chain to a dark red credit card. Both lie on a cream surface. Simple, symbolic, very clear.', ['Preisschild', 'Kette', 'Kreditkarte']),
  {type: 'animation', chapter: K3, cue: 'Das heißt: Du bekommst nicht nur Geld', beat: 'Kreditrahmen: 0 % nur für den ersten Kauf, alles danach kostet Zinsen — oft mehr als beim Dispo.',
    brief: 'Ein Kreditrahmen als langer leerer Balken (z. B. „Kreditrahmen“). Der erste Kauf „Fernseher“ füllt ein Stück, Label „0 %“. Danach kommen weitere Käufe dazu (z. B. „Handy“, „Konsole“) — diese Stücke färben sich rot und tragen „Zinsen“. Ergebnis-Callout: „oft teurer als der Dispo“. Keine erfundenen Zinsbeträge.'},
  img(K3, 'Wie ernst das ist', 'Ein Fall der Verbraucherzentrale Nordrhein-Westfalen.', 'Verbraucherschutz Klage', 'Verbraucherschützerin mit Akte „Klage“ vor einem Gerichtsgebäude',
    'A consumer advocate holds a folder labeled "Klage" in front of a simple courthouse building with columns. Calm, serious but friendly illustration.', ['Verbraucherschützerin', 'Akte Klage', 'Gericht']),
  img(K3, 'Sie hat gegen die Online-Shops', 'Klage gegen die Online-Shops von Media Markt und Saturn.', 'Online-Shop 0 Prozent', 'Laptop mit einem Elektronik-Online-Shop und Banner „0 % Finanzierung“, daneben ein Brief „Klage“',
    'A laptop shows a simple electronics online shop page with a banner "0 % Finanzierung". Next to the laptop lies a letter with the heading "Klage". No real logos, simple illustrated interface.', ['Laptop', 'Banner 0 %', 'Brief Klage']),
  img(K3, 'Dort lag der effektive Jahreszins', 'Effektiver Jahreszins des gekoppelten Kreditrahmens: 15,9 %.', 'Jahreszins 15,9 Prozent', 'Großes Preisschild „15,9 %“ an einer Kreditkarte, darüber „eff. Jahreszins“',
    'A dark red credit card with a large attached tag showing "15,9 %" and above it the small label "effektiver Jahreszins". Cream background, strong contrast, very readable.', ['Kreditkarte', '15,9 %']),
  img(K3, 'Das Oberlandesgericht München', 'OLG München 2023: Auf den Kreditrahmen muss klar und unmissverständlich hingewiesen werden.', 'Urteil OLG Muenchen', 'Richterhammer neben einem Urteil mit Zeile „klar und unmissverständlich hinweisen“',
    'A judge\'s gavel lies next to a court document titled "Urteil OLG München 2023". One line on the document is highlighted: "klar und unmissverständlich hinweisen". Calm editorial illustration.', ['Richterhammer', 'Urteil']),
  img(K3, 'Falle vier: die letzte Rate', 'Kleine Monatsraten und am Ende eine große Schlussrate.', 'Grosse Schlussrate', 'Reihe kleiner Münzstapel, am Ende ein riesiger Stapel',
    'A row of eleven small equal coin stacks on a cream surface, and at the very end one huge coin stack towering over them. A small "4" in a warning triangle in the corner. Simple and clear.', ['kleine Stapel', 'großer Stapel', 'Warnschild 4']),
  {type: 'data', chapter: K3, cue: 'Zum Beispiel elf Raten zu dreißig Euro', beat: '11 × 30 € + 270 € Schlussrate = 600 € — die letzte Zahlung trifft viele unvorbereitet.',
    brief: 'Beispiel: Monatsbalken-Diagramm mit 12 Säulen. Säulen 1–11 je 30 € erscheinen ruhig nacheinander; Säule 12 schießt auf 270 € hoch (wertgenau, gleiche Skala). Summe „600 €“. Callout an Säule 12: „Schlussrate“.'},
  img(K3, 'Schau dir deshalb den ganzen Zahlungsplan an', 'Den ganzen Zahlungsplan lesen, nicht nur die erste Rate.', 'Zahlungsplan bis zum Ende', 'Finger fährt eine Ratentabelle bis zur letzten, markierten Zeile entlang',
    'A paper payment schedule table with twelve rows "Monat 1" to "Monat 12". A finger follows the table down to the last row, which is highlighted in yellow. Simple, readable.', ['Ratentabelle', 'Finger', 'letzte Zeile']),
  // KAPITEL 4
  img(K4, 'Das größte Risiko ist aber oft', 'Das größte Risiko ist nicht ein einzelner Vertrag.', 'Viele kleine Vertraege', 'Stapel aus mehreren kleinen Ratenverträgen auf einem Tisch',
    'A small stack of several thin installment contracts on a kitchen table, slightly fanned out so you can see there are many. Calm, simple.', ['Vertragsstapel']),
  {type: 'animation', chapter: K4, cue: 'Fünfzig Euro für den Fernseher', beat: '50 € + 35 € + 25 € = 110 € — jeden Monat.',
    brief: 'Drei Ratenkarten erscheinen nacheinander: „Fernseher 50 €“, „Handy 35 €“, „Kopfhörer 25 €“ — jede einzeln klein und harmlos. Dann rutschen sie zusammen zu einer Monatslast „110 € jeden Monat“, die sichtbar schwerer wirkt (z. B. Balken im Monatsbudget).'},
  img(K4, 'Die Finanzaufsicht BaFin hat Menschen befragt', 'BaFin-Umfrage unter Menschen, die mit Buy now, pay later einkaufen.', 'BaFin Umfrage', 'Klemmbrett „Umfrage“ mit Fragebogen, daneben Einkaufstüten',
    'A clipboard with a simple survey sheet titled "Umfrage" and a few checkboxes. Next to it two shopping bags. Small label "BaFin" on the clipboard. Clean, simple.', ['Klemmbrett', 'Einkaufstüten']),
  img(K4, 'Jeder Siebte von ihnen', 'Jeder Siebte hat schon den Überblick über offene Rechnungen verloren.', 'Jeder Siebte', 'Sieben Figuren, eine davon unter einem Berg offener Rechnungen, Label „1 von 7“',
    'Seven simple person figures in a row. Six stand calmly; the seventh is half buried under a pile of open bills and envelopes. A label above reads "1 von 7". Slightly humorous, very clear.', ['sieben Figuren', 'Rechnungsberg', '1 von 7']),
  img(K4, 'Und für die Schufa ist jede Finanzierung', 'Für die Schufa ist jede Finanzierung ein eigener Kredit; mehrere können die Bonität verschlechtern.', 'Bonitaet sinkt', 'Halbkreis-Tacho „Bonität“, dessen Zeiger nach unten rutscht, daran hängen mehrere kleine Kreditkarten',
    'A simple semicircle gauge labeled "Bonität" with a needle sliding from green toward orange. Several small contract cards hang from the gauge like weights. Clean infographic style.', ['Tacho Bonität', 'Kreditkarten']),
  img(K4, 'Das merkst du dann', 'Du merkst es, wenn du wirklich einen Kredit brauchst, zum Beispiel für ein Auto.', 'Kredit fuer Auto', 'Person am Bankschalter mit Auto-Prospekt, Bankberater schaut skeptisch auf ein Blatt',
    'A person sits at a bank desk holding a car brochure. The bank advisor looks skeptically at a sheet with a downward arrow. Calm, simple, slightly concerned mood.', ['Person', 'Bankberater', 'Auto-Prospekt']),
  // KAPITEL 5
  img(K5, 'Übrigens: Ab dem zwanzigsten November', 'Ab 20. November 2026 gelten neue EU-Regeln für Verbraucherkredite.', 'Neue Regeln 20 November', 'Kalenderblatt „20. November 2026“ mit EU-Sternenkreis und „Neue Regeln“',
    'A large tear-off calendar page showing "20. November 2026". In the corner a small circle of yellow stars on blue. A note pinned to it reads "Neue Regeln für Kredite". Clean, simple.', ['Kalender', 'EU-Sterne']),
  img(K5, 'Dann fallen auch zinsfreie Kredite', 'Auch zinsfreie Kredite und „jetzt kaufen, später zahlen“ fallen unter das Kreditrecht.', 'Spaeter zahlen Kreditrecht', 'Knopf „Später zahlen“ mit Paragrafen-Stempel „Kreditrecht“',
    'A big friendly button labeled "Später zahlen", like on a shop checkout, drawn by hand. Next to it a round stamp with a "§" sign and the word "Kreditrecht". Minimal, clear.', ['Knopf', 'Stempel §']),
  img(K5, 'Anbieter müssen dann genauer prüfen', 'Anbieter müssen genauer prüfen, ob du die Raten bezahlen kannst.', 'Genauer pruefen', 'Bankmitarbeiterin prüft mit Lupe einen Haushaltsplan „Einnahmen / Ausgaben“',
    'A bank employee examines a simple household budget sheet with two columns "Einnahmen" and "Ausgaben" through a magnifying glass. Calm, simple.', ['Bankmitarbeiterin', 'Haushaltsplan', 'Lupe']),
  img(K5, 'Das schützt dich', 'Das schützt dich, ersetzt aber nicht deinen eigenen Blick in den Vertrag.', 'Schutz und selbst lesen', 'Person unter einem Schutzschild liest trotzdem selbst den Vertrag',
    'A person stands under a large soft shield shape and still reads a contract closely in their hands. Calm, reassuring, simple.', ['Schutzschild', 'Person', 'Vertrag']),
  // KAPITEL 6
  img(K6, 'Darum mein Vier-Punkte-Check', 'Der Vier-Punkte-Check vor jeder Null-Prozent-Finanzierung.', 'Vier Punkte Check', 'Klemmbrett „4-Punkte-Check“ mit vier leeren Kästchen',
    'A clipboard with the heading "4-Punkte-Check" and four empty checkboxes numbered 1 to 4, a pen beside it. Minimal, calm.', ['Klemmbrett', 'vier Kästchen']),
  img(K6, 'Erstens', 'Erstens: Was kostet das Produkt woanders?', 'Check Preis', 'Zwei Preisschilder desselben Fernsehers, eins günstiger, grüner Haken',
    'Two price tags for the same TV side by side: "600 €" and "550 €". The cheaper one has a green check mark. A big number "1" in a circle in the corner. Clean.', ['Preisschilder', 'Haken', '1']),
  img(K6, 'Zweitens', 'Zweitens: Was zahle ich insgesamt?', 'Check Gesamtkosten', 'Taschenrechner, der Raten und Extras zu „Gesamt“ addiert',
    'A simple calculator next to a short list "Raten", "Extras" and a bold line "Gesamt". A big number "2" in a circle in the corner. Clean, readable.', ['Taschenrechner', 'Liste', '2']),
  img(K6, 'Drittens', 'Drittens: Hängt ein Kreditrahmen dran? Genau lesen und danach nicht nutzen.', 'Check Kreditrahmen', 'Kreditkarte in einer Schublade mit kleinem Vorhängeschloss',
    'A dark red credit card lies in an open drawer that has a small padlock. A big number "3" in a circle in the corner. Simple, symbolic.', ['Kreditkarte', 'Schublade', 'Schloss', '3']),
  img(K6, 'Viertens', 'Viertens: Passt die Rate ins Budget — zusammen mit allen anderen Raten?', 'Check Budget', 'Geldbörse, in die mehrere Ratenzettel gerade noch hineinpassen',
    'An open wallet with a few small installment slips tucked in, still fitting comfortably. A small label "Budget". A big number "4" in a circle in the corner. Simple, clear.', ['Geldbörse', 'Ratenzettel', '4']),
  img(K6, 'Und falls du schon unterschrieben hast', 'Bei Verbraucherkrediten in der Regel 14 Tage Widerrufsrecht.', 'Widerruf 14 Tage', 'Kalender mit markierten 14 Tagen und Dokument „Widerruf“',
    'A small calendar with fourteen days circled in green and next to it a short document titled "Widerruf". A pen lies on top. Calm, reassuring.', ['Kalender 14 Tage', 'Widerruf']),
  // FAZIT
  img(K7, 'Null Prozent kann ein richtig guter Deal sein', 'Guter Deal, wenn Preis stimmt, nichts dazukommt und kein Kreditrahmen dranhängt.', 'Guter Deal Checkliste', 'Fernseher, daneben drei abgehakte Punkte: Preis, keine Extras, kein Kreditrahmen',
    'A TV on a sideboard. Next to it a short checklist with three green check marks: "Preis verglichen", "keine Extras", "kein Kreditrahmen". Warm, positive, simple.', ['Fernseher', 'Checkliste']),
  img(K7, 'Dann nutzt du das Geld der Bank', 'Dann nutzt du das Geld der Bank, ohne dafür zu bezahlen.', 'Geld der Bank gratis', 'Münzen fließen von der Bank zur Person, Etikett „0 € Zinsen“',
    'A simple bank building on the left, a happy person on the right. A gentle stream of coins flows from the bank to the person. A small tag on the stream reads "0 € Zinsen". Friendly, minimal.', ['Bank', 'Münzen', 'Person']),
  img(K7, 'Aber wer nur auf die kleine Monatsrate schaut', 'Wer nur auf die Monatsrate schaut, zahlt am Ende oft mehr.', 'Nur Monatsrate im Blick', 'Person schaut durchs Fernglas nur auf „50 €/Monat“, hinter ihr ein langer Kassenbon „Gesamt“',
    'A person looks through binoculars at a small tag "50 € im Monat" in front of them, while behind their back a very long receipt with the bold word "Gesamt" curls on the floor. Slightly humorous, clear.', ['Fernglas', 'Monatsrate', 'langer Bon']),
  img(K7, 'Wenn dir das Video geholfen hat', 'Abonnier FinanzNeo.', 'Abonnieren', 'Notizbuch mit handgeschriebenem „FinanzNeo“ und kleiner Glocke',
    'An open notebook on a cream desk with the hand-lettered word "FinanzNeo" and a small bell doodle next to it. A pen and a cup of tea beside it. Calm, warm, minimal.', ['Notizbuch', 'Glocke']),
];
