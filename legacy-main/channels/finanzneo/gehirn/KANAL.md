# 🧠 FinanzNeo — Kanal-Gehirn (Identität)

> Kanal-spezifisch. Ergänzt das geteilte `core/gehirn` (Regeln) + `core/brand-kit` (Bausteine).
> Für Claude, Codex UND die Agenten: SO klingt & aussieht FinanzNeo. Bei Zweifel hier nachschauen.
> Brand-Technik: `channels/finanzneo/brand/brand.ts` (🟢 Grün, „du").

## Was ist FinanzNeo
Deutscher, animierter Finanz-Kanal (faceless, Arman vertont). **Breiter Finanz-Mix**: Sparen, Investieren
(ETF/Aktien), Alltags-Geld, Steuern, Vorsorge — flexibel je Thema. Kein Nischen-Zwang, aber immer:
**komplexes Geld-Wissen einfach und hochwertig erklärt.**

## Zielgruppe
**„Jeder, der mehr aus seinem Geld holen will."** — breit, praktisch, deutschsprachig.
- **Persona:** hat ein Einkommen, lässt aber Geld „liegen" (Sparbuch, keine Ahnung wohin), wenig Zeit,
  kaum Vorwissen, leicht eingeschüchtert von Finanz-Fachsprache. Will **konkrete, ehrliche Antworten**,
  keine Vorträge. Alter 20–45, vom Studenten bis zum Familienvater.
- **Was sie fühlen:** „Ich sollte was mit meinem Geld machen, aber ich blicke nicht durch / hab Angst was falsch zu machen."
- **Unser Job:** diese Angst nehmen → verstehen → anfangen.

## Ton & Stimme — „seriös aber modern"
- **Immer „du"**, nie „man"/„Sie". Nahbar, auf Augenhöhe, nie belehrend.
- **Vertrauenswürdig & ehrlich** — kein Hype, kein „werde reich", keine Zock-Tipps, keine dubiosen Versprechen.
- **Klar & modern** — kurze Sätze, gesprochene Sprache, aber hochwertig (nicht albern, nicht Meme-billig).
- **Kompetent ohne Fachchinesisch** — Fachbegriff nur, wenn sofort erklärt (am besten mit Bild/Metapher).
- Selbstbewusst, ruhig, premium. Wie ein schlauer Freund, der sich wirklich auskennt und nichts verkaufen will.

## USP — warum FinanzNeo
**Komplexes einfach erklärt — mit Animationen statt Fachchinesisch.** Das ist der Kern.
Jedes abstrakte Konzept → **visuelle Metapher + konkrete Zahl**. Wo andere Wörter stapeln, zeigen wir es.
Sekundär (bleibt spürbar): **ehrlich/unabhängig** und **konkrete Zahlen** (nie schwammig).

## Content-Säulen (wiederkehrende Themen/Formate)
1. **Grundlagen-Erklärer** — „Was ist ein ETF/Zinseszins/Inflation?" (Kernformat, zeitlos)
2. **Konkrete Rechnung** — „100 €/Monat → nach 30 Jahren …" (immer echte Zahlen)
3. **Häufiger Fehler** — „Diesen Fehler machen fast alle mit ihrem Geld"
4. **Mythos-Check** — „Sparbuch ist sicher? Rechnen wir nach."
5. **Schritt-für-Schritt** — „So legst du in 5 Minuten deinen ersten Sparplan an"
6. **Aktuelles einfach** — Steuer-/Gesetzesänderung verständlich (wenn relevant)

## 🎨 Visuelle Identität
- **Grün** (`C.green`, Signatur = Wachstum), dunkelgrüner BG. Gold nur für Geld-Zahlen (semantisch), Rot für Verlust/Gefahr.
- Sauber, premium, viel Luft. `LivingBackground`/`ShaderBG` in Grün. Kinetische Untertitel. Lucide-Icons.
- Wiederkehrende Motive: Münze/Wachstumskurve, elegante Icons (nie Emoji-Grafik).

## 🏆 Haus-Stil (Referenz: `src/short01-reel/Reel.tsx`, von Arman bestätigt — bevorzugt ggü. custom-SVG-Vokabular)
Statt aufwendiger custom-SVG-Metapher-Objekte (Vault/Account/Bucket etc. aus `vokabular*.tsx`) ist der bevorzugte
Baustil: **Lucide-Icon + kurzer Text in einer `Card`** (Glas-Look, seitlich reingleitend), **gestaffelte Icon-Grids**
für Wiederholung/Menge (z.B. 60 kleine Coin-Kacheln für "Jahr für Jahr"), **`RollingNumber`** für die große
Payoff-Zahl, **durchgestrichene Verneinungs-Liste** für "das ist es NICHT". Wirkt reduzierter, schneller lesbar,
weniger "gebastelt" als viele einzelne custom-SVG-Bausteine aneinandergereiht. `vokabular*.tsx`-Objekte bleiben
nutzbar für einzelne starke Momente (nicht komplett verbannt), aber **Card+Lucide+RollingNumber ist ab jetzt der
Standard-Ansatz** für neue Reels — erst hier greifen, bevor ein neuer custom-SVG-Baustein gebaut wird.

## 🚫 No-Gos
- Keine **Anlageberatung**/keine konkreten Kauf-Empfehlungen (allgemeine Bildung, ggf. dezenter „keine Anlageberatung"-Hinweis).
- Kein **Get-rich-quick**, keine Krypto-Zock-Hypes, keine Angstmache als Clickbait.
- Kein **Fachchinesisch** ohne sofortige Erklärung. Keine schwammigen Aussagen ohne Zahl.
- Nicht albern/Meme-billig — wir sind seriös-modern, nicht Comedy.

## Verweise
- Reel-Strategie (TikTok/Insta): `channels/finanzneo/gehirn/REELS.md`
- Allgemeine Reel-Regeln: `core/gehirn/REEL-PRINZIPIEN.md` · Bausteine: `core/brand-kit/KATALOG.md`
