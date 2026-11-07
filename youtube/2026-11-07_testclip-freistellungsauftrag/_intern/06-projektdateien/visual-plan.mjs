const K0 = 'Hook — Lena und die fehlenden 130 Euro';
const K1 = 'Kapitel 1 — Das steht dir zu';
const K2 = 'Kapitel 2 — So holst du es dir';

export const title = 'Freistellungsauftrag: 1.000 € steuerfrei';

export const story = {
  protagonist: 'Lena',
  reason: 'Lena ist ein Rechenbeispiel (20.000 € Tagesgeld, angenommen 2,5 % Zinsen): 500 € Zinsen, ohne Auftrag 25 % plus Soli = 131,88 €.',
};

export const thumbnail = {
  file: 'YouTube Thumbnail - Freistellungsauftrag.png',
  prompt: 'A simple hand-drawn illustration in the right half of the image: a bank statement with a large bite missing, a few coins falling out. Left half stays empty.',
  cover: {zeilen: ['130 € weg?', 'Unnötig!'], marker: '130 €', ton: 'rot'},
};

const folie = (chapter, cue, beat, inhalt) => ({type: 'folie', chapter, cue, beat, folie: inhalt});

export const visuals = [
  // HOOK
  folie(K0, 'Lena hat zwanzigtausend', 'Lena hat 20.000 € auf dem Tagesgeld.',
    {icon: 'bank', zahl: {wert: '20.000 €', label: 'auf dem Tagesgeld', cue: 'zwanzigtausend'}}),
  folie(K0, 'Zweieinhalb Prozent Zinsen', '2,5 % Zinsen: 500 € im Jahr (Beispiel).',
    {icon: 'muenze', zahl: {wert: '+500 €', label: 'Zinsen im Jahr (Beispiel)', cue: 'fünfhundert', ton: 'gruen'}}),
  folie(K0, 'Trotzdem fehlen auf', 'Rund 130 € fehlen auf dem Konto.',
    {icon: 'geld_fliegt', zahl: {wert: '−130 €', label: 'fehlen auf dem Konto', cue: 'hundertdreißig', ton: 'rot'}}),
  folie(K0, 'Das Geld hat ihre', 'Die Bank führt das Geld ans Finanzamt ab.',
    {ablauf: {von: {icon: 'bank', text: 'Bank', cue: 'Bank'}, nach: {icon: 'behoerde', text: 'Finanzamt', cue: 'Finanzamt'}}}),
  folie(K0, 'Dabei hätte sie', 'Dabei hätte sie nichts zahlen müssen.',
    {icon: 'denken', begriff: {text: 'Gar nichts zahlen', cue: 'nichts', betont: 'nichts'}}),

  // KAPITEL 1
  {type: 'beleg', chapter: K1, cue: 'Das Einkommensteuergesetz gibt', beat: '§ 20 EStG: Sparer-Pauschbetrag von 1.000 € im Jahr.',
    quelle: 'Einkommensteuergesetz, § 20', quellenArt: 'gesetz', url: 'https://www.gesetze-im-internet.de/estg/__20.html',
    markierungen: [{text: 'Sparer-Pauschbetrag', cue: 'Sparer-Pauschbetrag'}]},
  folie(K1, 'Bis dahin bleiben', 'Bis 1.000 € bleiben Kapitalerträge steuerfrei.',
    {icon: 'schild', begriff: {text: 'Bis 1.000 € steuerfrei', cue: 'steuerfrei', betont: 'steuerfrei'}}),
  {type: 'beleg', chapter: K1, cue: 'Darüber werden fünfundzwanzig', beat: '§ 32d EStG: darüber 25 Prozent, dazu Solidaritätszuschlag.',
    quelle: 'Einkommensteuergesetz, § 32d', quellenArt: 'gesetz', url: 'https://www.gesetze-im-internet.de/estg/__32d.html',
    markierungen: [{text: 'beträgt 25 Prozent', cue: 'fünfundzwanzig'}]},
  folie(K1, 'Hast du deinen', 'Kommentarfrage: Freistellungsauftrag schon eingerichtet?',
    {icon: 'frage', begriff: {text: 'Schon eingerichtet?', cue: 'eingerichtet', betont: 'eingerichtet'}}),

  // KAPITEL 2
  {type: 'beleg', chapter: K2, cue: 'Ohne diesen Auftrag', beat: '§ 44a EStG: Kein Steuerabzug nur mit Freistellungsauftrag.',
    quelle: 'Einkommensteuergesetz, § 44a', quellenArt: 'gesetz', url: 'https://www.gesetze-im-internet.de/estg/__44a.html',
    markierungen: [{text: 'ein Freistellungsauftrag des Gläubigers der Kapitalerträge', cue: 'Auftrag'}]},
  {type: 'data', chapter: K2, cue: 'Schau dir Lena an', bridgeObject: 'Freistellungsauftrag',
    beat: 'Vergleich: ohne Auftrag 500 € → rund 370 €, mit Auftrag 500 € → 500 €.',
    brief: 'Zwei große Balken aus je 500 € Zinsen untereinander, Beschriftung „Ohne Auftrag“ und „Mit Auftrag“. Beim Wort „hundertdreißig“ schrumpft der obere Balken wertgenau auf 368,12 €, der abgeschnittene Teil mit der Beschriftung „Steuerabzug“ (131,88 €, gerundet „rund 130 €“) färbt sich rot und fällt ab. Beim Wort „vollen“ leuchtet der untere Balken grün und bleibt bei „500 €“. Bei „Formular“ erscheint daneben die Differenz „+130 €“. Ergebnis mindestens 15 Frames stehen lassen. Kleiner Hinweis: „Beispiel, ohne Kirchensteuer“.'},
  folie(K2, 'So holst du dir', 'So geht es: anmelden, Auftrag suchen, Betrag eintragen.',
    {titel: 'In 3 Schritten', icon: 'handy', zeilen: [
      {text: 'Im Online-Banking anmelden', cue: 'Online-Banking'},
      {text: 'Freistellungsauftrag suchen', cue: 'Suche'},
      {text: 'Betrag eintragen', cue: 'Betrag', betont: 'Betrag'},
    ]}),
  folie(K2, 'Hast du mehrere', 'Mehrere Banken: 1.000 € aufteilen.',
    {icon: 'waage', zahl: {wert: '1.000 €', label: 'auf alle Banken aufteilen', cue: 'tausend'}}),
];
