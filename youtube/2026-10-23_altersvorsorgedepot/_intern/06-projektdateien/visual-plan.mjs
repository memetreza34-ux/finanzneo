const K0 = 'Hook — Jonas und die 540 Euro';
const K1 = 'Kapitel 1 — Was ist das Altersvorsorgedepot?';
const K2 = 'Kapitel 2 — So viel legt der Staat drauf';
const K3 = 'Kapitel 3 — Haken eins: die Kosten';
const K4 = 'Kapitel 4 — Haken zwei und drei: gebunden und versteuert';
const K5 = 'Kapitel 5 — Für wen es sich lohnt';
const K6 = 'Fazit';

export const title = 'Altersvorsorgedepot 2027: 540 € vom Staat – und drei Haken';

export const story = {
  protagonist: 'Jonas',
  reason: 'Jonas (28, Angestellter, spart schon 150 € im Monat per ETF-Sparplan) trägt alle Rechenbeispiele: volle Zulage, Kostenvergleich über 37 Jahre, seine Entscheidung im Fazit.',
  figurBild: 'Thumbnail',
};

export const thumbnail = {
  file: 'YouTube Thumbnail - Altersvorsorgedepot Haken.png',
  prompt: 'A bold, simple YouTube thumbnail on a warm cream background. On the right stands Jonas, a 28-year-old man with short dark brown hair, light stubble, a mustard-yellow sweater and dark jeans. He holds a large glass jar labeled "Altersvorsorgedepot" filled with coins. A big green tag on the jar reads "+540 €". From the tag hangs a small dark fishing hook that Jonas looks at skeptically. On the left a short bold dark hand-lettered headline in German: "Altersvorsorgedepot" and below it, smaller in red: "Der Haken". Very few elements, strong contrast, readable at small size, generous empty space.',
};

const img = (chapter, cue, beat, keyword, name, expected, prompt, labels, extra = {}) => ({type: 'image', chapter, cue, beat, keyword, name, expected, prompt, labels, ...extra});
const JONAS = 'Jonas (short dark brown hair, light stubble, mustard-yellow sweater, dark jeans)';

export const visuals = [
  // HOOK
  img(K0, 'Jonas ist achtundzwanzig', 'Jonas, 28, legt jeden Monat 150 € in einen ETF-Sparplan.', 'Sparplan', 'Jonas Sparplan', 'Jonas am Küchentisch, auf dem Handy „ETF-Sparplan 150 € im Monat“',
    `${JONAS} sits at a small kitchen table with a cup of coffee and looks at his smartphone. The phone screen shows a simple card "ETF-Sparplan" and "150 € im Monat". Calm morning scene, few elements.`, ['Jonas', 'Handy', 'ETF-Sparplan'], {figur: true}),
  img(K0, 'Ab Januar kann er genau dasselbe tun', 'Ab Januar kann er dasselbe tun.', 'Januar', 'Kalender Januar 2027', 'Jonas vor einem großen Abreißkalender „Januar 2027“',
    `${JONAS} stands next to a large tear-off wall calendar showing "Januar 2027". He points at it with a curious smile. Simple, lots of empty space.`, ['Jonas', 'Kalender Januar 2027'], {figur: true}),
  img(K0, 'Und der Staat legt jedes Jahr', 'Der Staat legt jedes Jahr bis zu 540 € obendrauf — das neue Altersvorsorgedepot.', 'Staat', 'Staat legt drauf', 'Hand aus einem Regierungsgebäude legt Münzen „+540 €“ in ein Depot-Glas „Altersvorsorgedepot“',
    'On the left a simple government building with columns and a small German flag. A large friendly hand reaches out of it and drops a stack of coins into a big glass jar on the right. The jar is labeled "Altersvorsorgedepot" and a green tag on it reads "+540 € im Jahr". Clean, symbolic.', ['Regierungsgebäude', 'Münzen', 'Depot-Glas']),
  img(K0, 'Jonas fragt sich', 'Wo ist der Haken?', 'Haken', 'Wo ist der Haken', 'Jonas betrachtet skeptisch ein Geschenk, an dessen Schleife ein Angelhaken hängt',
    `${JONAS} holds a small gift box with a ribbon and looks at it skeptically. A dark fishing hook hangs from the ribbon. A thought bubble above him shows a question mark. Slightly humorous, minimal.`, ['Jonas', 'Geschenk', 'Angelhaken'], {figur: true}),

  // KAPITEL 1
  img(K1, 'Fangen wir vorne an', 'Das Altersvorsorgedepot ist der Nachfolger der Riester-Rente.', 'Riester', 'Nachfolger Riester', 'Alter Ordner „Riester-Rente“ übergibt einen Staffelstab an ein Depot-Glas „Altersvorsorgedepot“',
    'A worn old file folder labeled "Riester-Rente" with little arms hands a relay baton to a fresh glass jar labeled "Altersvorsorgedepot". The old folder is gray and dusty, the jar is bright and clean. Simple, slightly playful.', ['Ordner Riester-Rente', 'Staffelstab', 'Depot-Glas']),
  img(K1, 'Der Bundestag hat das Gesetz', 'Gesetz im März beschlossen, Start am 1. Januar 2027.', 'Bundestag', 'Gesetz beschlossen', 'Kuppel des Bundestags, davor ein Dokument „Gesetz beschlossen“ und ein Kalenderblatt „1. Januar 2027“',
    'A simple drawing of a parliament building with a glass dome. In front of it lies a document with a stamp "beschlossen" and next to it a calendar page "1. Januar 2027". Calm, clear, few elements.', ['Parlament', 'Dokument beschlossen', 'Kalender']),
  img(K1, 'Riester galt als kompliziert', 'Riester: kompliziert, teuer, oft in Versicherungen mit hohen Kosten.', 'Versicherungen', 'Riester kompliziert', 'Dicker, verknoteter Papierstapel „Versicherung“ mit mehreren Kosten-Etiketten',
    'A thick, messy stack of paperwork tied with tangled string. The top sheet reads "Versicherung". Several small price tags with the word "Kosten" hang from the stack. Slightly heavy, gray mood but still friendly illustration.', ['Papierstapel', 'Versicherung', 'Kosten-Etiketten']),
  img(K1, 'Das neue Depot funktioniert anders', 'Neu: direkt in Wertpapiere sparen, zum Beispiel ETFs.', 'ETFs', 'Depot mit ETFs', 'Offenes Depot-Glas, in das kleine Karten „ETF“ mit Aufwärtskurve gelegt werden',
    'A clean open glass jar labeled "Altersvorsorgedepot". A hand drops small cards into it. Each card shows a tiny rising line chart and the word "ETF". Bright, simple, positive.', ['Depot-Glas', 'ETF-Karten']),
  img(K1, 'Eine Garantie kannst du wählen', 'Garantie wählbar, aber keine Pflicht.', 'Garantie', 'Garantie wahlweise', 'Schalter „Garantie“ mit den Stellungen „ja“ und „nein“',
    'A large simple toggle switch on a cream surface labeled "Garantie". One side reads "ja", the other side reads "nein". A finger rests on it, free to choose. Minimal.', ['Schalter Garantie']),
  img(K1, 'Und neu: Auch Selbstständige', 'Neu: auch Selbstständige werden gefördert.', 'Selbstständige', 'Selbststaendige gefoerdert', 'Selbstständige Grafikerin am Laptop bekommt einen Gutschein „Förderung“',
    'A self-employed graphic designer sits at a laptop in a small studio. A friendly hand hands her a coupon that reads "Förderung". Warm, simple, few elements.', ['Grafikerin', 'Laptop', 'Gutschein Förderung']),

  // KAPITEL 2
  img(K2, 'Jetzt zum Geld', 'Wie viel legt der Staat drauf? Die Förderung hat zwei Stufen.', 'Stufen', 'Zwei Stufen', 'Treppe mit zwei Stufen „Stufe 1“ und „Stufe 2“, auf jeder Stufe ein Münzstapel',
    'A simple staircase with exactly two wide steps on a cream background. The lower step is labeled "Stufe 1", the upper step "Stufe 2". On each step lies a stack of coins. Clean infographic style.', ['Treppe', 'Stufen', 'Münzstapel']),
  {type: 'data', chapter: K2, cue: 'Auf die ersten dreihundertsechzig Euro', bridgeObject: 'Stufen',
    beat: 'Zulagen-Staffel: 50 % auf die ersten 360 € (bis 180 €), 25 % auf 360–1.800 € (bis 360 €) = maximal 540 € im Jahr.',
    brief: 'Ein waagrechter Balken „Eigenbeitrag im Jahr“ von 0 bis 1.800 €, in zwei Zonen geteilt wie die zwei Stufen aus dem Bild davor: Zone 1 (0–360 €) Label „50 %“, Zone 2 (360–1.800 €) Label „25 %“. Beim Sprechen von Stufe 1 wächst darüber ein Zulagen-Stück auf „180 €“ (halb so lang wie Zone 1, wertgenau). Bei Stufe 2 wächst ein zweites Stück auf „360 €“ (ein Viertel von Zone 2). Ergebnis: beide Stücke rutschen zusammen zu „540 € im Jahr“. Quelle oben links: „Altersvorsorgereformgesetz, Bundestag 27.03.2026“. Zahlen exakt, keine weiteren Werte erfinden.'},
  img(K2, 'Für Jonas heißt das', '150 € im Monat = 1.800 € im Jahr.', 'Monat', 'Jonas 1800 im Jahr', 'Jonas mit Depot-Glas, Notiz „150 € im Monat = 1.800 € im Jahr“',
    `${JONAS} holds a small glass jar labeled "Altersvorsorgedepot". Next to him a sticky note reads "150 € im Monat" and below it "= 1.800 € im Jahr". Simple, clear.`, ['Jonas', 'Depot-Glas', 'Notiz'], {figur: true}),
  img(K2, 'Er bekommt die vollen', 'Er bekommt die vollen 540 € — 30 % obendrauf.', 'Prozent', 'Jonas volle Zulage', 'Jonas freut sich, auf sein Depot-Glas fällt ein Münzstapel „+540 €“, Etikett „+30 %“',
    `${JONAS} smiles as a stack of coins labeled "+540 €" drops onto his glass jar "Altersvorsorgedepot". A green tag on the jar reads "+30 %". Warm, positive, minimal.`, ['Jonas', 'Depot-Glas', 'Münzstapel'], {figur: true}),
  img(K2, 'Spannend ist', 'Wer weniger spart, bekommt prozentual mehr.', 'weniger', 'Weniger sparen mehr Prozent', 'Kleines und großes Depot-Glas; auf dem kleinen ein großes Plus-Zeichen, auf dem großen ein kleineres',
    'Two glass jars side by side: a small one with a few coins and a big one with many coins. Above the small jar floats a big green plus sign, above the big jar a smaller green plus sign. Clean, symbolic comparison, no numbers.', ['kleines Glas', 'großes Glas', 'Plus-Zeichen']),
  img(K2, 'Mit dreißig Euro im Monat', '30 € im Monat → 180 € im Jahr dazu = 50 %.', 'Prozent', 'Dreissig Euro fuenfzig Prozent', 'Kleines Depot-Glas „30 € im Monat“, darauf Münzen „+180 € im Jahr“ und großes Etikett „50 %“',
    'A small glass jar labeled "30 € im Monat". Coins labeled "+180 € im Jahr" drop onto it. A big green tag on the jar reads "50 %". Simple, very readable.', ['kleines Depot-Glas', 'Münzen', 'Etikett 50 %']),
  img(K2, 'Für Kinder gibt es extra', 'Kinderzulage bis 300 € pro Kind und Jahr, voll ab 25 € im Monat.', 'Kinder', 'Kinderzulage', 'Mutter mit Kind vor einem Depot-Glas, Etikett „Kinderzulage bis 300 €“',
    'A mother and her small child stand next to a glass jar. The child drops a coin into it. A tag on the jar reads "Kinderzulage" and "bis 300 € im Jahr". Warm family moment, simple.', ['Mutter', 'Kind', 'Depot-Glas'], {akzente: [{cue: 'Dafür reichen fünfundzwanzig Euro', text: 'voll ab 25 € im Monat', ton: 'neutral'}]}),
  img(K2, 'Wer vor seinem fünfundzwanzigsten', 'Start vor dem 25. Geburtstag: einmalig 200 € Bonus.', 'Bonus', 'Bonus unter 25', 'Junge Frau mit Geburtstagstorte „24“ bekommt ein Geschenk „200 € Bonus“',
    'A young woman in her early twenties holds a birthday cake with the candles "24". A friendly hand hands her a small gift box with a tag "200 € Bonus". Cheerful, minimal.', ['junge Frau', 'Torte 24', 'Geschenk Bonus']),
  img(K2, 'Wichtig: Du musst mindestens', 'Mindestens 120 € im Jahr, sonst keine Zulage.', 'Zulage', 'Mindestbeitrag 120', 'Waagrechte Linie „mindestens 120 € im Jahr“; darüber bekommt ein Glas Zulage, darunter ein Glas nichts',
    'A horizontal dashed line labeled "mindestens 120 € im Jahr". Above the line a jar receives a green coin with "Zulage". Below the line a nearly empty jar receives nothing and has a small gray "0 €". Clean infographic style.', ['Linie 120 €', 'zwei Gläser', 'Zulage']),
  img(K2, 'Und wer gut verdient', 'Beiträge auch steuerlich absetzbar; Finanzamt wählt das Günstigere.', 'Steuer', 'Steuer oder Zulage', 'Finanzbeamter mit Waage: links „Zulage“, rechts „Steuer sparen“',
    'A friendly tax office clerk at a desk holds a simple balance scale. The left pan holds a coin labeled "Zulage", the right pan a paper labeled "Steuer sparen". Small sign on the desk: "Finanzamt". Calm, clear.', ['Finanzbeamter', 'Waage', 'Finanzamt'], {akzente: [{cue: 'Das Finanzamt prüft', text: 'Finanzamt wählt das Günstigere', ton: 'neutral'}]}),

  // KAPITEL 3
  img(K3, 'Klingt stark', 'Der erste Haken: die Kosten.', 'Kosten', 'Haken eins Kosten', 'Angelhaken mit Nummer „1“, an dem ein Preisschild „Kosten“ hängt',
    'A large dark fishing hook hangs from above. A small round badge on it shows the number "1". A price tag with the word "Kosten" dangles from the hook. Minimal, lots of empty space.', ['Angelhaken 1', 'Preisschild Kosten']),
  img(K3, 'Für das sogenannte Standarddepot', 'Kostendeckel im Standarddepot: höchstens 1 % im Jahr.', 'Kostendeckel', 'Kostendeckel', 'Depot-Glas „Standarddepot“ mit großem Deckel „max. 1 % Kosten im Jahr“',
    'A glass jar labeled "Standarddepot". On top sits a big lid. The lid reads "max. 1 % Kosten im Jahr". Simple, clear, centered.', ['Depot-Glas Standarddepot', 'Deckel 1 %']),
  img(K3, 'Geplant waren sogar', 'Geplant waren 1,5 %, Verbraucherschützer protestierten. 1 % klingt wenig — ist es aber nicht.', 'Verbraucherschützer', 'Verbraucherschuetzer protestieren', 'Zettel „1,5 %“ durchgestrichen, daneben „1 %“; dahinter Verbraucherschützer mit Schildern „Zu teuer!“',
    'A sheet of paper with "1,5 %" crossed out in red and "1 %" written next to it. Behind it a small group of consumer advocates hold simple protest signs reading "Zu teuer!". Friendly, clear illustration.', ['Zettel 1,5 %', 'Zettel 1 %', 'Verbraucherschützer']),
  img(K3, 'Rechnen wir mit Jonas', 'Beispiel Jonas: 150 € + Zulage im Monat, 37 Jahre bis 65, Annahme 5 % Rendite.', 'Jonas', 'Jonas Zeitstrahl', 'Zeitstrahl von „28“ bis „65“, links junger Jonas, rechts älterer Jonas mit grauem Haar',
    `A long horizontal timeline arrow from "28" on the left to "65" on the right. On the left stands ${JONAS}. On the right stands the same Jonas aged 65 with gray hair and the same mustard-yellow sweater. Along the arrow small coins are placed at regular intervals. Clean, calm.`, ['Jonas', 'Zeitstrahl', 'Münzen'], {figur: true, akzente: [{cue: 'siebenunddreißig Jahre lang', text: '195 € im Monat · 37 Jahre', ton: 'neutral'}, {cue: 'Wir nehmen an', text: 'Annahme: 5 % Rendite im Jahr', ton: 'neutral'}]}),
  {type: 'data', chapter: K3, cue: 'Bei einem Prozent Kosten hat Jonas', bridgeObject: 'Zeitstrahl',
    beat: '37 Jahre, 195 € im Monat, 5 % vor Kosten: 1 % Kosten → rund 198.000 €, 0,2 % Kosten → rund 238.000 € — rund 40.000 € Unterschied.',
    brief: 'Waagrechte Achse wie der Zeitstrahl aus dem Bild davor: „28“ bis „65“ (Jahre). Zwei Vermögenskurven wachsen gleichzeitig von 0 nach rechts: Kurve „1 % Kosten“ endet bei „rund 198.000 €“, Kurve „0,2 % Kosten“ endet bei „rund 238.000 €“ (wertgenau, gleiche Skala; monatliche Einzahlung 195 €, 4,0 % bzw. 4,8 % netto). Am Ende öffnet sich zwischen beiden Endpunkten eine farbige Lücke mit Callout „rund 40.000 € Unterschied“. Kennzeichnung oben: „Beispiel, Annahme 5 % Rendite vor Kosten“. Keine weiteren Zahlen erfinden.'},
  img(K3, 'Der Deckel ist also', 'Deckel = Obergrenze, kein Richtwert. Anbieter vergleichen.', 'Anbieter', 'Anbieter vergleichen', 'Drei Anbieter-Karten „Anbieter A/B/C“ mit unterschiedlich langen Kostenbalken unter einer Linie „max. 1 %“; eine Hand zeigt auf den kürzesten',
    'Three simple cards side by side, each with a small bank icon, labeled "Anbieter A", "Anbieter B" and "Anbieter C". Each card shows one short horizontal bar of a different length. A dashed line across all cards is labeled "max. 1 %". A hand points at the card with the shortest bar, which has a green check mark. Clean comparison layout, no other numbers.', ['Anbieter-Karten', 'Hand', 'Haken']),
  img(K3, 'Kurze Frage an dich', 'Kommentarfrage: Altersvorsorgedepot ab Januar oder beim normalen Depot bleiben?', 'Depot', 'Frage an dich', 'Große Sprechblase „Altersvorsorgedepot ab Januar?“ mit Antwortblasen „Ja“ und „Ich bleibe beim normalen Depot“',
    'A large friendly speech bubble on a cream background with the German question "Altersvorsorgedepot ab Januar?". Below it two small answer bubbles: "Ja" and "Ich bleibe beim normalen Depot". Minimal, warm colors.', ['Sprechblase', 'Antwortblasen']),
  img(K3, 'Schreib es mir in die Kommentare', 'Schreib es in die Kommentare.', 'Kommentare', 'Kommentare', 'Handy mit Kommentarfeld, ein Daumen tippt',
    'A hand holds a smartphone. On the screen a simple comment field with a few short lines of handwriting-like text and a small pencil icon. A thumb is typing. Very simple, illustrated, not a real app interface.', ['Handy', 'Kommentarfeld']),

  // KAPITEL 4
  img(K4, 'Der zweite Haken', 'Der zweite Haken: Das Geld ist gebunden, Auszahlung frühestens mit 65.', 'fünfundsechzig', 'Haken zwei gebunden', 'Depot-Glas mit Vorhängeschloss, Anhänger „ab 65“, daneben Angelhaken „2“',
    'A glass jar labeled "Altersvorsorgedepot" full of coins, closed with a padlock. A tag on the padlock reads "ab 65". In the corner a small dark fishing hook with a round badge "2". Simple, symbolic.', ['Depot-Glas', 'Vorhängeschloss', 'Angelhaken 2']),
  {type: 'animation', chapter: K4, cue: 'Und nicht alles auf einmal', bridgeObject: 'Depot-Glas',
    beat: 'Ab 65: höchstens 30 % auf einen Schlag, der Rest als lebenslange Rente oder Auszahlplan bis mindestens 85.',
    brief: 'Das Depot-Glas aus dem Bild davor steht links bei „65“ auf einem Zeitstrahl „65 → 85“. Das Schloss geht auf. Ein Stück von genau „30 %“ des Inhalts löst sich und springt als Block „bis 30 % auf einmal“ heraus. Der Rest (70 %) fließt danach in vielen gleich großen Monatsportionen nach rechts entlang des Zeitstrahls bis „85“, Label „Auszahlplan bis mind. 85“; alternativ kurzer Hinweis-Pfeil über 85 hinaus „oder lebenslange Rente“. Ergebnis: Glas leert sich gleichmäßig. Keine Eurobeträge erfinden.'},
  img(K4, 'Brauchst du das Geld vorher', 'Geld vorher entnehmen, z. B. fürs Auto, wird teuer.', 'Auto', 'Geld fuers Auto', 'Jonas vor einem Auto, greift in sein verschlossenes Depot-Glas, Warnschild „vorher“',
    `${JONAS} stands next to a small car with a "zu verkaufen" sign. He reaches toward his locked glass jar "Altersvorsorgedepot". A small orange warning triangle next to the jar reads "vorher". Clear, slightly tense.`, ['Jonas', 'Auto', 'Depot-Glas'], {figur: true}),
  img(K4, 'Dann musst du Zulagen', 'Dann Zulagen und Steuervorteile zurückzahlen.', 'Zulagen', 'Zulagen zurueck', 'Münzen fliegen aus dem Depot-Glas zurück zum Regierungsgebäude, Etikett „Zulagen zurück“',
    'Coins fly out of an open glass jar back toward a simple government building with columns. A tag on the stream of coins reads "Zulagen zurück". The jar looks lighter. Clean, symbolic.', ['Depot-Glas', 'Münzen', 'Regierungsgebäude']),
  img(K4, 'Eine Ausnahme gibt es', 'Ausnahme: die eigene Wohnung, unter bestimmten Bedingungen.', 'Wohnung', 'Ausnahme Wohnung', 'Kleines Wohnhaus mit Schlüssel, daneben Depot-Glas mit grünem Haken „Ausnahme“',
    'A small cozy apartment house with a front door key in the foreground. Next to it a glass jar with a green check mark tag that reads "Ausnahme". Warm, calm.', ['Wohnhaus', 'Schlüssel', 'Depot-Glas']),
  img(K4, 'Der dritte Haken', 'Der dritte Haken: die Steuer. Beim Sparen keine Steuern auf Gewinne.', 'Steuer', 'Haken drei Steuer', 'Pflanze wächst in einem Depot-Glas, Etikett „steuerfrei beim Sparen“, daneben Angelhaken „3“',
    'A small green plant grows out of coins inside a glass jar. A tag on the jar reads "steuerfrei beim Sparen". In the corner a small dark fishing hook with a round badge "3". Calm, positive, minimal.', ['Pflanze', 'Depot-Glas', 'Angelhaken 3']),
  img(K4, 'Aber im Alter musst du', 'Im Alter: Auszahlung mit persönlichem Steuersatz versteuern.', 'Alter', 'Steuer im Alter', 'Älterer Mann bekommt einen Umschlag „Auszahlung“, eine Hand vom Finanzamt nimmt ein Stück „Steuer“ heraus',
    'An older man with gray hair opens an envelope labeled "Auszahlung". A hand from a small building labeled "Finanzamt" takes out one slice of the banknotes, labeled "Steuer". Calm, clear, not dramatic.', ['älterer Mann', 'Umschlag Auszahlung', 'Finanzamt']),
  img(K4, 'Als Rentner ist der Steuersatz', 'Rentner-Steuersatz oft niedriger — aber nicht garantiert.', 'Rentner', 'Steuersatz Rentner', 'Zwei Balken: hoch „Steuersatz im Berufsleben“, niedriger „Steuersatz als Rentner“ mit Fragezeichen',
    'Two simple vertical bars drawn by hand. The left, taller bar is labeled "im Berufsleben". The right, shorter bar is labeled "als Rentner" and has a small question mark next to it. Above both the word "Steuersatz". No numbers. Clean.', ['Balken Berufsleben', 'Balken Rentner', 'Fragezeichen'], {akzente: [{cue: 'Garantiert ist das aber nicht', text: 'nicht garantiert', ton: 'neutral'}]}),

  // KAPITEL 5
  img(K5, 'Für wen lohnt sich das Ganze', 'Für wen lohnt es sich?', 'lohnt', 'Fuer wen lohnt es sich', 'Drei Personen-Silhouetten vor einem Depot-Glas, Schild „Für wen lohnt es sich?“',
    'Three different people stand in a row in front of a large glass jar: a young woman, a parent with a child, an older man. Above them a small sign reads "Für wen lohnt es sich?". Simple, friendly.', ['drei Personen', 'Depot-Glas', 'Schild']),
  img(K5, 'Erstens für alle', 'Erstens: wer fürs Alter spart und das Geld bis zur Rente nicht braucht.', 'Rente', 'Bis zur Rente liegen lassen', 'Person stellt ein Depot-Glas in ein Regal und geht entspannt weg, Zettel „bis zur Rente“',
    'A person places a glass jar on a high shelf and walks away relaxed, hands in pockets. A note on the jar reads "bis zur Rente". A small number "1" in a circle in the corner. Calm, simple.', ['Person', 'Regal', 'Depot-Glas', '1']),
  img(K5, 'Zweitens für kleine Sparer', 'Zweitens: kleine Sparer und Familien — höchste Förderung in Prozent.', 'Familien', 'Kleine Sparer und Familien', 'Familie mit kleinem Depot-Glas, daneben großes grünes Etikett „%“',
    'A family of three (two parents and a child) stand around a small glass jar. A large green tag with a percent sign hangs on the jar. A small number "2" in a circle in the corner. Warm, simple.', ['Familie', 'kleines Depot-Glas', 'Prozent-Etikett', '2']),
  img(K5, 'Drittens für junge Leute', 'Drittens: junge Leute — Bonus und viel Zeit zum Wachsen.', 'junge', 'Junge Leute Zeit', 'Junger Mensch pflanzt einen kleinen Geldbaum, dahinter derselbe Baum groß und voll',
    'A young person plants a small sapling with coin-shaped leaves. Behind it, faintly drawn, the same tree is big and full of coin leaves. A small number "3" in a circle in the corner. Calm, hopeful.', ['junge Person', 'Geldbaum', '3']),
  img(K5, 'Weniger passend ist es', 'Nicht für flexibles Geld: Notgroschen und kurzfristige Sparziele bleiben draußen.', 'flexibel', 'Flexibles Geld getrennt', 'Verschlossenes Depot-Glas neben offenen Gläsern „Notgroschen“ und „Urlaub“',
    'Three jars on a shelf. The left one, labeled "Altersvorsorgedepot", is closed with a padlock. The two jars on the right are open and labeled "Notgroschen" and "Urlaub". A thin line separates them. Clean, clear.', ['Depot-Glas', 'Glas Notgroschen', 'Glas Urlaub'], {akzente: [{cue: 'Dein Notgroschen', text: 'Notgroschen bleibt flexibel', ton: 'neutral'}]}),
  img(K5, 'Und wer schon einen Riester-Vertrag hat', 'Riester-Besitzer: ab 2027 keine neuen Riester-Verträge.', 'Riester', 'Riester geschlossen', 'Älteres Paar mit Ordner „Riester-Vertrag“ vor einer Tür mit Schild „Neue Verträge ab 2027: geschlossen“',
    'An older couple holds a file folder labeled "Riester-Vertrag". Behind them a door with a hanging sign "Neue Verträge ab 2027: geschlossen". Calm, slightly humorous.', ['älteres Paar', 'Ordner Riester-Vertrag', 'Schild geschlossen']),
  img(K5, 'Dein alter Vertrag bleibt', 'Alter Vertrag bleibt; Guthaben kann ins neue Depot übertragen werden.', 'Guthaben', 'Riester uebertragen', 'Münzen wandern über einen Pfeil vom Ordner „Riester-Vertrag“ in das Depot-Glas',
    'On the left a file folder labeled "Riester-Vertrag". On the right a glass jar labeled "Altersvorsorgedepot". A wide curved arrow carries a row of coins from the folder into the jar. The arrow is labeled "Guthaben übertragen". Clean infographic style.', ['Ordner Riester-Vertrag', 'Pfeil', 'Depot-Glas']),
  img(K5, 'Prüf vorher', 'Vorher Garantien und Kosten des alten Vertrags prüfen.', 'Kosten', 'Alten Vertrag pruefen', 'Lupe über einem Vertrag, vergrößert die Zeilen „Garantie“ und „Kosten“',
    'A contract page titled "Riester-Vertrag". A large magnifying glass enlarges two lines so they become readable: "Garantie" and "Kosten". Clean, focused.', ['Vertrag', 'Lupe']),

  // FAZIT
  img(K6, 'Und Jonas? Er teilt auf', 'Jonas teilt auf: 150 € im Monat ins Altersvorsorgedepot, bei einem günstigen Anbieter.', 'Altersvorsorgedepot', 'Jonas teilt auf', 'Jonas legt Münzen in das Depot-Glas „Altersvorsorgedepot“, Etikett „günstiger Anbieter“',
    `${JONAS} drops coins into a glass jar labeled "Altersvorsorgedepot". A small green tag on the jar reads "günstiger Anbieter". Next to it stands a second, smaller jar labeled "normales Depot". Calm, confident.`, ['Jonas', 'Depot-Glas', 'zweites Glas'], {figur: true}),
  img(K6, 'Für flexible Ziele spart er', 'Für flexible Ziele spart er normal weiter. Keine Anlageberatung.', 'Ziele', 'Flexible Ziele', 'Jonas mit dem Glas „normales Depot“, daneben kleine Zettel „Reise“ und „Auto“',
    `${JONAS} holds the smaller glass jar labeled "normales Depot". Above it float two small notes: "Reise" and "Auto". Simple, positive.`, ['Jonas', 'Glas normales Depot', 'Zettel'], {figur: true, akzente: [{cue: 'Das ist keine Anlageberatung', text: 'Keine Anlageberatung', ton: 'neutral'}]}),
  img(K6, 'Geld vom Staat gibt es also wirklich', 'Geld vom Staat gibt es wirklich — wenn Kosten niedrig sind und das Geld bis zur Rente liegen bleibt.', 'Staat', 'Fazit zwei Bedingungen', 'Volles Depot-Glas mit Etikett „+ Zulage vom Staat“, daneben zwei grüne Haken „Kosten niedrig“ und „bis zur Rente“',
    'A full glass jar labeled "Altersvorsorgedepot" with a green tag "+ Zulage vom Staat". Next to it a short checklist with two green check marks: "Kosten niedrig" and "bis zur Rente". Warm, positive, minimal.', ['Depot-Glas', 'Checkliste'], {akzente: [{cue: 'Aber nur, wenn', text: 'Kosten niedrig · Geld bis zur Rente', ton: 'neutral'}]}),
  img(K6, 'Wenn dir das Video geholfen hat', 'Abonnier FinanzNeo.', 'FinanzNeo', 'Abonnieren', 'Notizbuch mit handgeschriebenem „FinanzNeo“ und kleiner Glocke',
    'An open notebook on a cream desk with the hand-lettered word "FinanzNeo" and a small bell doodle next to it. A pen and a cup of tea beside it. Calm, warm, minimal.', ['Notizbuch', 'Glocke'], {akzente: [{cue: 'Dann verpasst du nichts', text: 'Anbieter-Preise ab Januar', ton: 'neutral'}]}),
];
