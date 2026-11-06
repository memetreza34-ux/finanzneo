// Icon-Bibliothek für YouTube-Folien (finanzneo-youtube-icons-v1, Arman 30.10.2026).
//
// Bildwelt nach dem Finanzbär-Prinzip: weiße Folie, wenig Text, ein farbiges 3D-Icon.
// Quelle: Microsoft Fluent Emoji 3D (MIT-Lizenz, kommerziell frei nutzbar),
// https://github.com/microsoft/fluentui-emoji — Lizenztext liegt neben den PNGs.
// Nur Icons aus diesem Katalog sind erlaubt; `npm run youtube:icons` lädt fehlende nach.
// Kanonische Regel: docs/YOUTUBE-BILDMIX-UND-COVER.md

export const YOUTUBE_ICONS_STANDARD_ID = 'finanzneo-youtube-icons-v1';
/** Ordner unter public/ (staticFile). */
export const YOUTUBE_ICONS_DIR = 'icons/fluent-3d';
export const YOUTUBE_ICONS_QUELLE = 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets';

// name → [Fluent-Ordner, Bedeutung]. Personen haben Hautton-Varianten; wir nehmen „Default“.
const ICONS = {
  // Geld
  geldsack: ['Money bag', 'Geld, Vermögen, Sparsumme (Dollarzeichen!)'],
  muenze: ['Coin', 'Münze, kleiner Betrag, Zinsen'],
  euroschein: ['Euro banknote', 'Euro, Bargeld, Betrag'],
  geld_fliegt: ['Money with wings', 'Geld weg, Kosten, Verlust, Ausgaben'],
  kreditkarte: ['Credit card', 'Karte, Zahlung, Kredit, Schulden'],
  quittung: ['Receipt', 'Rechnung, Beleg, Kosten, Gebühren'],
  diamant: ['Gem stone', 'Wert, Premium, Schatz'],
  geld_gesicht: ['Money-mouth face', 'Gier, Profit, reich werden'],
  // Institutionen und Orte
  bank: ['Bank', 'Bank, Sparkasse, Anbieter'],
  behoerde: ['Classical building', 'Staat, Behörde, Gesetz, Bundestag'],
  buero: ['Office building', 'Unternehmen, Arbeitgeber, Konzern'],
  haus: ['House', 'Wohnung, Miete, Immobilie'],
  haus_garten: ['House with garden', 'Eigenheim, Hauskauf'],
  krankenhaus: ['Hospital', 'Krankenversicherung, Gesundheit'],
  // Märkte und Zahlen
  chart_hoch: ['Chart increasing', 'Wachstum, Rendite, ETF, Börse steigt'],
  chart_runter: ['Chart decreasing', 'Verlust, Crash, Inflation frisst'],
  balken: ['Bar chart', 'Vergleich, Statistik, Daten'],
  hundert: ['Hundred points', 'volle Punktzahl, 100 %'],
  // Dinge und Werkzeuge
  aktenkoffer: ['Briefcase', 'Job, Gehalt, Selbstständigkeit'],
  schluessel: ['Key', 'Zugang, Lösung, Schlüssel zum Erfolg'],
  schloss: ['Locked', 'gesperrt, sicher, gebunden'],
  schloss_schluessel: ['Locked with key', 'Sicherheit, Passwort, Konto schützen'],
  schild: ['Shield', 'Schutz, Versicherung, Einlagensicherung'],
  waage: ['Balance scale', 'Recht, Gericht, Abwägen, Vergleich'],
  sanduhr: ['Hourglass not done', 'Zeit, Frist, Wartezeit, Zinseszins'],
  wecker: ['Alarm clock', 'Termin, Frist, jetzt handeln'],
  kalender: ['Spiral calendar', 'Datum, Stichtag, ab 2027'],
  klemmbrett: ['Clipboard', 'Liste, Checkliste, Antrag'],
  dokument: ['Page facing up', 'Vertrag, Bescheid, Formular'],
  notiz: ['Memo', 'Notiz, Steuererklärung, ausfüllen'],
  brief: ['Envelope', 'Post, Brief vom Amt, Mahnung'],
  handy: ['Mobile phone', 'App, Banking-App, SMS'],
  laptop: ['Laptop', 'online, Neobroker, Vergleichsportal'],
  computer: ['Desktop computer', 'Depot, selbst verwalten, online'],
  lupe: ['Magnifying glass tilted left', 'prüfen, Kleingedrucktes, suchen'],
  gluehbirne: ['Light bulb', 'Idee, Tipp, Trick'],
  einkaufswagen: ['Shopping cart', 'Einkauf, Konsum, Preise'],
  einkaufstueten: ['Shopping bags', 'Shopping, Konsum, Ausgaben'],
  zapfsaeule: ['Fuel pump', 'Spritpreis, Energie'],
  auto: ['Automobile', 'Auto, Kfz, Leasing'],
  doktorhut: ['Graduation cap', 'Studium, Bildung, BAföG'],
  geschenk: ['Wrapped gift', 'Bonus, Geschenk, Prämie, gratis'],
  pokal: ['Trophy', 'Sieger, bester Anbieter, Testsieger'],
  zielscheibe: ['Bullseye', 'Ziel, Sparziel, genau richtig'],
  rakete: ['Rocket', 'stark steigend, schnell wachsen'],
  feuer: ['Fire', 'heiß, dringend, brennt'],
  bombe: ['Bomb', 'Risiko, Zeitbombe, Falle'],
  glocke: ['Bell', 'Hinweis, Benachrichtigung'],
  megafon: ['Megaphone', 'Ankündigung, Werbung, News'],
  paket: ['Package', 'Paket, Bündel, Lieferung'],
  stecker: ['Electric plug', 'Strom, Stromvertrag'],
  schneeflocke: ['Snowflake', 'Heizkosten, Winter, eingefroren'],
  setzling: ['Seedling', 'klein anfangen, wächst mit der Zeit'],
  funkeln: ['Sparkles', 'neu, Highlight'],
  roboter: ['Robot', 'KI, automatisch, Sparplan-Automatik'],
  bett: ['Bed', 'passives Einkommen, im Schlaf'],
  besteck: ['Fork and knife', 'Lebensmittel, Essen, Haushalt'],
  // Zeichen
  haken: ['Check mark button', 'ja, richtig, erlaubt'],
  kreuz: ['Cross mark', 'nein, falsch, verboten'],
  warnung: ['Warning', 'Achtung, Risiko, Vorsicht'],
  verboten: ['No entry', 'Verbot, gesperrt, nicht erlaubt'],
  frage: ['Red question mark', 'Frage, unklar'],
  ausruf: ['Red exclamation mark', 'wichtig, Achtung'],
  // Gesichter
  denken: ['Thinking face', 'überlegen, lohnt sich das?'],
  schock: ['Face screaming in fear', 'Schock, böse Überraschung'],
  traurig: ['Pensive face', 'enttäuscht, Verlust'],
  cool: ['Smiling face with sunglasses', 'clever, entspannt, gewonnen'],
  gehirn: ['Brain', 'verstehen, Denkfehler, Psychologie'],
  // Personen (Default-Hautton)
  daumen_hoch: ['Thumbs up', 'gut, empfehlenswert'],
  daumen_runter: ['Thumbs down', 'schlecht, nicht empfehlenswert'],
  baby: ['Baby', 'Geburt, Kindergeld, Elterngeld'],
  kind: ['Child', 'Kind, Kinderzulage'],
  frau: ['Woman', 'Person, Sparerin'],
  mann: ['Man', 'Person, Sparer'],
  seniorin: ['Old woman', 'Rente, Rentnerin, Alter'],
  senior: ['Old man', 'Rente, Rentner, Alter'],
  angestellte: ['Office worker', 'Arbeitnehmer, Gehalt, Büro'],
  detektiv: ['Detective', 'Betrug aufdecken, nachforschen'],
  richter: ['Judge', 'Urteil, Gericht, BGH'],
  umarmung: ['People hugging', 'Familie, Partner, gemeinsam'],
  haendedruck: ['Handshake', 'Vertrag, Einigung, Deal'],
};

const PERSONEN = new Set(['Thumbs up', 'Thumbs down', 'Baby', 'Child', 'Woman', 'Man', 'Old woman', 'Old man', 'Office worker', 'Detective', 'Judge']);

export const YOUTUBE_ICONS = Object.freeze(Object.fromEntries(Object.entries(ICONS).map(([name, [ordner, bedeutung]]) => [name, {ordner, bedeutung}])));
export const istYouTubeIcon = (name) => Object.hasOwn(YOUTUBE_ICONS, name);
export const youtubeIconDatei = (name) => `${YOUTUBE_ICONS_DIR}/${name}.png`;

/** Download-Adresse im Fluent-Repo (Personen in der Default-Hautfarbe). */
export const youtubeIconQuelle = (name) => {
  const {ordner} = YOUTUBE_ICONS[name];
  const datei = ordner.toLowerCase().replaceAll(' ', '_');
  const pfad = PERSONEN.has(ordner) ? `Default/3D/${datei}_3d_default.png` : `3D/${datei}_3d.png`;
  return `${YOUTUBE_ICONS_QUELLE}/${encodeURIComponent(ordner)}/${pfad}`;
};
