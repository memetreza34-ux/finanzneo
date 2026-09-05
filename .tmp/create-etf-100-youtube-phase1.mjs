#!/usr/bin/env node
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const target = 'youtube/etf-100-euro-kompletter-weg';
const title = 'Was passiert wirklich mit deinen 100 € im ETF?';
const types = [
  'hybrid','animation','image','animation','data','hybrid','animation','animation','image','animation','hybrid','data','image','animation','hybrid','data','animation','image','animation','data','hybrid','animation','image','data','hybrid','animation','image','animation',
];

const run = (cmd, args) => {
  const result = spawnSync(cmd, args, {stdio:'inherit', encoding:'utf8'});
  if (result.status !== 0) process.exit(result.status ?? 1);
};

if (!existsSync(resolve(target))) {
  run('npm', ['run','youtube:create','--','--target',target,'--title',title,'--types',types.join(',')]);
}

const root = resolve(target);
const write = (path, content) => {
  const full = resolve(root, path);
  mkdirSync(resolve(full, '..'), {recursive:true});
  writeFileSync(full, content.endsWith('\n') ? content : `${content}\n`);
};
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const idx = (n) => String(n).padStart(2,'0');

const script = `Du klickst bei deinem Broker auf „Kaufen“, 100 Euro verschwinden vom Verrechnungskonto und kurz danach steht ein ETF in deinem Depot. Aber wo sind diese 100 Euro jetzt eigentlich? Wurden sie in diesem Moment direkt auf Apple, Microsoft, Nestlé und Hunderte andere Unternehmen verteilt? Nicht ganz. Und genau dieser Unterschied ist wichtig, wenn du verstehen willst, was ein ETF wirklich ist. In diesem Video verfolgen wir beispielhaft 100 Euro vom Kaufauftrag bis ins Fondsvermögen. Wir schauen uns an, was an der Börse passiert, wie der ETF einen Index nachbildet, wo Dividenden landen, welche Kosten entstehen, warum der Kurs schwankt und was mit deinen Anteilen passiert, wenn dein Broker oder die Fondsgesellschaft Probleme bekommt.

Fangen wir beim Kauf an. Ein ETF ist zunächst ein Investmentfonds, dessen Anteile an der Börse gehandelt werden. Wenn du einen normalen Börsenauftrag erteilst, gibst du deinem Broker den Auftrag, ETF-Anteile an einem Handelsplatz zu kaufen. Bei einem Sparplan kann der Broker viele Kundenaufträge bündeln und dir gegebenenfalls auch Bruchstücke intern gutschreiben. Für das Grundprinzip ist entscheidend: Du kaufst einen Anteil an einem Fonds. Du kaufst nicht in deinem eigenen Namen gleichzeitig jede einzelne Aktie, die später im ETF steckt.

An der Börse trifft dein Kaufauftrag auf Verkaufsangebote. Professionelle Market Maker stellen fortlaufend Kauf- und Verkaufspreise und sorgen damit dafür, dass ETF-Anteile handelbar bleiben. Häufig kaufst du einen bereits existierenden ETF-Anteil von einem anderen Marktteilnehmer. Deine konkreten 100 Euro gehen dann zunächst an die Gegenseite des Handels. Trotzdem bleibt der Preis des ETF eng mit dem Wert seines Fondsportfolios verbunden. Dafür gibt es einen besonderen Mechanismus im Hintergrund: Creation und Redemption.

Authorized Participants, oft große professionelle Marktteilnehmer, können mit der Fondsgesellschaft große Pakete von ETF-Anteilen gegen einen passenden Wertpapierkorb tauschen. Wenn zusätzliche ETF-Anteile gebraucht werden, kann ein Authorized Participant die benötigten Wertpapiere beschaffen und gegen neue ETF-Anteile eintauschen. Umgekehrt können ETF-Anteile zurückgegeben und gegen den Wertpapierkorb getauscht werden. Dieser Primärmarkt-Prozess verbindet den sichtbaren Börsenhandel mit den Vermögenswerten im Fonds. Er hilft auch dabei, größere Abweichungen zwischen dem Börsenpreis des ETF und dem Wert des zugrunde liegenden Portfolios zu begrenzen.

Was steckt nun im Fonds? Das hängt vom Index und von der Nachbildungsmethode ab. Ein Index legt nach festen Regeln fest, welche Wertpapiere enthalten sind und wie stark sie gewichtet werden. Ein ETF versucht, diese Wertentwicklung möglichst genau nachzubilden. Bei einer physischen Replikation hält der Fonds tatsächlich Wertpapiere aus dem Index. Bei sehr breiten Indizes wird häufig nicht jede einzelne Position eins zu eins gekauft. Stattdessen kann eine repräsentative Auswahl genutzt werden, sogenanntes Sampling. Bei synthetischer Replikation kann die Indexentwicklung zusätzlich über ein Tauschgeschäft, einen Swap, abgebildet werden. Deshalb ist „ETF“ nicht automatisch gleichbedeutend mit „der Fonds hält jede Aktie des Index exakt in derselben Stückzahl“.

Für dich als Anleger bleibt aber der zentrale Punkt gleich: Du besitzt ETF-Anteile. Diese Anteile geben dir einen wirtschaftlichen Anteil am Fondsvermögen. Bei einem breit gestreuten Aktien-ETF kann dieses Fondsvermögen in sehr viele Unternehmen aus unterschiedlichen Ländern und Branchen investieren. Genau darin liegt der Diversifikationseffekt. Fällt ein einzelnes Unternehmen stark, muss das nicht den gesamten ETF im gleichen Ausmaß treffen. Aber Diversifikation bedeutet nicht, dass Verluste ausgeschlossen sind. Wenn ganze Aktienmärkte fallen, kann auch ein sehr breit gestreuter ETF deutlich an Wert verlieren.

Und nicht jeder ETF ist automatisch breit gestreut. Ein ETF auf eine einzelne Branche, ein enges Thema oder wenige große Unternehmen kann wesentlich konzentrierter sein. Deshalb ist der Name ETF allein noch kein Qualitätsmerkmal. Entscheidend sind unter anderem der zugrunde liegende Index, seine Streuung, die Kosten und die Konstruktion des Fonds.

Was passiert mit Dividenden? Zahlen Unternehmen im Fonds Dividenden, fließen diese grundsätzlich in das Fondsvermögen. Bei einem ausschüttenden ETF werden Erträge nach den Fondsregeln an die Anleger ausgezahlt. Bei einem thesaurierenden ETF werden sie im Fonds wiederangelegt. In beiden Fällen gehören diese Erträge wirtschaftlich zum Investment. Sie sind allerdings kein kostenloser Bonus: Rund um eine Dividendenzahlung verändert sich auch der Wert des Unternehmens beziehungsweise des Fonds entsprechend.

Jetzt zu den Kosten. Beim Kauf können je nach Broker und Handelsplatz Orderkosten entstehen. Zusätzlich gibt es beim Börsenhandel den Spread, also die Differenz zwischen Kauf- und Verkaufspreis. Und im Fonds selbst fallen laufende Kosten an. Diese werden nicht als separate Rechnung von deinem Konto abgebucht, sondern im Fondsvermögen berücksichtigt und mindern damit die Wertentwicklung. Bei vielen breit gestreuten ETFs liegen die laufenden Kosten deutlich unter denen klassischer aktiv gemanagter Fonds. Trotzdem lohnt sich der Vergleich, denn auch kleine jährliche Unterschiede wirken über lange Zeit.

Ein einfaches Größenbeispiel: Eine laufende Kostenquote von 0,2 Prozent entspricht bei einem Fondsvermögen von 100 Euro rechnerisch ungefähr 20 Cent pro Jahr, solange wir Kursänderungen ignorieren. Bei 10.000 Euro wären es ungefähr 20 Euro. Das ist nur eine Veranschaulichung. Die tatsächliche Abweichung eines ETF von seinem Index hängt nicht nur von der ausgewiesenen Kostenquote ab, sondern zum Beispiel auch von Transaktionskosten, Steuern auf Fondsebene und der Qualität der Indexnachbildung.

Warum steigt oder fällt dein ETF im Depot? Nicht weil die App eine Zahl hoch- oder runtersetzt, sondern weil sich der Marktwert der Vermögenswerte verändert, die der ETF abbildet. Steigen viele große Positionen, steigt typischerweise auch der Wert des Fonds. Fallen sie, fällt er. Ein Verlust von 20 Prozent würde aus 100 Euro rechnerisch 80 Euro machen. Das ist kein Prognosewert, sondern nur ein Beispiel dafür, dass auch ein breit gestreuter Aktien-ETF zwischenzeitlich deutlich fallen kann. Breite Streuung reduziert das Einzelwertrisiko, sie beseitigt das allgemeine Marktrisiko nicht.

Was passiert, wenn dein Broker pleitegeht? Wertpapiere und Investmentfondsanteile im Depot sind keine normalen Bankeinlagen. Sie werden für dich verwahrt. Im Insolvenzfall kannst du grundsätzlich die Herausgabe beziehungsweise Übertragung deiner Wertpapiere verlangen, sofern keine besonderen Gegenansprüche bestehen. Und auch das Fondsvermögen selbst ist vom Vermögen der Kapitalverwaltungsgesellschaft getrennt. Bei Investmentfonds wird es als Sondervermögen beziehungsweise getrenntes Fondsvermögen verwahrt. Eine Insolvenz des Brokers oder der Fondsgesellschaft ist also etwas anderes als ein Kursverlust des ETF. Gegen fallende Märkte schützt diese rechtliche Trennung nicht.

Wenn du also 100 Euro in einen ETF investierst, ist die richtige Vorstellung nicht: Mein Geld wird sofort in hundert kleine Münzen geteilt und direkt an hundert Unternehmen geschickt. Die bessere Vorstellung ist: Dein Broker führt einen Kauf aus. Du erhältst einen Anteil an einem Fonds. Der Börsenpreis dieses Anteils wird durch den Handel und den Creation-Redemption-Mechanismus eng an das Fondsportfolio gekoppelt. Der Fonds bildet nach festen Regeln einen Index oder eine Strategie nach. Die darin enthaltenen Vermögenswerte bestimmen langfristig deinen wirtschaftlichen Wert, Erträge und Risiken.

Und bevor du irgendeinen ETF auswählst, prüfe mindestens drei Dinge: Was bildet der Index wirklich ab? Wie breit ist er gestreut? Und welche Kosten sowie Risiken hat genau dieser Fonds? Denn der wichtigste Satz dieses Videos ist vielleicht nicht „ETFs sind einfach“, sondern: ETFs können einfach zu nutzen sein, wenn du verstanden hast, was du tatsächlich kaufst.

Wenn du willst, können wir im nächsten Video genau dort weitermachen: Was ist der Unterschied zwischen MSCI World, FTSE All-World und anderen Weltindizes – und warum steckt hinter dem Wort „Welt-ETF“ nicht immer dasselbe?`;

const sources = `# Recherche und Quellen

Datenstand: 05.09.2026

## Kernquellen

1. Verbraucherzentrale — ETF-Kauf: Auswahlkriterien, Stand 12.03.2026
https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/etfkauf-auf-diese-kriterien-sollten-sie-bei-der-auswahl-achten-16605
- ETF = börsengehandelter Investmentfonds, der typischerweise einen Index nachbildet.
- Breite Streuung, Kosten und Fondsvolumen sind wichtige Auswahlkriterien.
- Weltweit gestreute Indizes können sehr viele Aktien umfassen.

2. Verbraucherzentrale — Vorteile und Nachteile von ETFs, Stand 21.07.2025
https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/welche-vorteile-und-nachteile-haben-etfs-16603
- ETFs sind nicht risikofrei.
- Laufende Kosten sind meist deutlich niedriger als bei klassischen aktiven Aktienfonds.
- Kauf über Bank/Broker und Börsenhandel können Orderkosten verursachen.

3. Verbraucherzentrale — Wie baut ein ETF einen Index nach?
https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/wie-baut-ein-etf-einen-index-nach-16608
- Physische Replikation, optimiertes Sampling und mögliche Wertpapierleihe.
- Sehr breite Indizes werden in der Praxis oft optimiert nachgebildet statt jede Position exakt 1:1 zu halten.

4. Deutsche Börse — ETF / Creation-Redemption
https://live.deutsche-boerse.com/en/know-how/lexikon/etf-exchange-traded-fund
https://live.deutsche-boerse.com/news/aus-dem-etf-magazin-einfach-clever-konstruiert
- ETFs werden an der Börse gehandelt.
- Market Maker stellen Kauf- und Verkaufspreise.
- Authorized Participants können Wertpapierkörbe gegen ETF-Anteile tauschen; Creation/Redemption verbindet Sekundär- und Primärmarkt.

5. BaFin — Das kleine ABC der Geldanlage, 2026
https://www.bafin.de/SharedDocs/Downloads/DE/Broschuere/dl_b_ABC_der_Geldanlage_leichte_sprache.pdf?__blob=publicationFile&v=4
- Fondsvermögen ist vom Vermögen der Kapitalverwaltungsgesellschaft getrennt und wird über eine Verwahrstelle gehalten.

6. BaFin — Einlagensicherung und Anlegerentschädigung
https://bafin.de/DE/verbraucherinnen-verbraucher/themen-finanzprodukte/geldanlage/einlagensicherung-anlegerentschaedigung/einlagensicherung-anlegerentschaedigung.html
- Wertpapiere und Investmentfondsanteile sind keine Einlagen.
- Verwahrte Wertpapiere können im Insolvenzfall grundsätzlich herausverlangt oder übertragen werden; Marktrisiken bleiben bestehen.

7. ESMA — UCITS Artikel 52/53
https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/ucits/article-52
https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/ucits/article-53
- Regulatorische Diversifikationsgrenzen für UCITS und besondere Regeln für indexnachbildende Fonds.

## Rechenannahmen im Video

- 0,2 % von 100 € = 0,20 €; 0,2 % von 10.000 € = 20 €.
- 100 € minus 20 % = 80 €.
- Beide Zahlen dienen nur der Größenordnung, nicht als Rendite- oder Verlustprognose.

## Inhaltliche Grenzen

- Keine individuelle Anlageberatung.
- Keine Aussage, dass jeder ETF breit diversifiziert oder für jeden Zweck geeignet ist.
- Keine Aussage, dass Sondervermögen vor Marktverlusten schützt.
- Steuerdetails werden bewusst nicht vertieft; sie hängen von Produkt, Erträgen und persönlicher Situation ab.`;

write('01-recherche/briefing.md', `# Briefing

- Thema: Was passiert wirklich mit 100 Euro, wenn sie in einen ETF investiert werden?
- Zielgruppe: Finanzanfänger im deutschsprachigen Raum
- Ziellänge: 8–10 Minuten
- Lernziel: Der Zuschauer versteht den Weg vom Brokerauftrag über Börse und ETF-Anteil bis zum Fondsportfolio sowie Replikation, Erträge, Kosten, Risiken und Insolvenztrennung.
- Kernversprechen: Nach dem Video kann der Zuschauer in eigenen Worten erklären, was er beim ETF-Kauf tatsächlich besitzt und warum die 100 Euro nicht einfach direkt an hunderte Unternehmen überwiesen werden.
- Warum Longform nötig ist: Sekundärmarkt, Creation/Redemption, Indexnachbildung, Sondervermögen, Kosten und Marktrisiko sind mehrere zusammenhängende Mechanismen und lassen sich nicht seriös in einem kurzen Reel erklären.
- Datenstand: 05.09.2026
- Ton: ruhig, direkt, anfängerfreundlich, ohne Finanzhype und ohne Kaufempfehlung.
`);
write('01-recherche/recherche-quellen.md', sources);
write('02-script/script-fliess-text.txt', script);
write('02-script/kapitel-dramaturgie.md', `# Kapitel und Dramaturgie

1. Hook — Wo sind die 100 Euro nach dem Klick auf Kaufen?
2. Der Kaufauftrag — Broker, Börse und ETF-Anteil
3. Der unsichtbare Mechanismus — Market Maker und Creation/Redemption
4. Was im Fonds steckt — Index, physische Replikation, Sampling, synthetisch
5. Was du wirklich besitzt — Fondsanteil, Diversifikation und Konzentrationsrisiko
6. Erträge — Dividenden, Ausschüttung und Thesaurierung
7. Kosten — Orderkosten, Spread, laufende Kosten und Tracking
8. Risiko — Warum breite Streuung Marktverluste nicht verhindert
9. Insolvenz — Broker, Verwahrung und getrenntes Fondsvermögen
10. Payoff — Der komplette 100-Euro-Weg in einem Bild + Drei-Punkte-Check
11. Next-video bridge — Weltindizes im Vergleich
`);
write('02-script/retention-plan.md', `# Retention-Plan

- 0:00 offene Frage: Deine 100 Euro landen nicht so direkt bei den Unternehmen, wie viele denken.
- Frühester Payoff: Innerhalb der ersten Minute sichtbar machen, dass zuerst ein Fondsanteil gekauft wird.
- Pattern Interrupt 1: Sekundärmarkt oben, Creation/Redemption als zweite Ebene darunter.
- Pattern Interrupt 2: Wechsel von Börsenmechanik zu greifbarer Index-/Portfolio-Welt.
- Pattern Interrupt 3: kurze Data-Visuals statt dauerhaft 3D-Szenen.
- Mitte: Überraschung „Nicht jeder ETF hält jede Index-Aktie exakt 1:1“.
- Zweiter Payoff: Sondervermögen klar von Marktrisiko trennen.
- Risikoabschnitt bewusst visuell ruhiger und kontrastreicher.
- Schluss: kompletter Geldweg wird in einer einzigen Kamerafahrt noch einmal zusammengesetzt.
- Kein künstliches Cliffhanger-Spamming; jede offene Frage wird innerhalb weniger Visuals beantwortet.
`);

const visualSpecs = [
  {type:'hybrid',chapter:'Hook',beat:'100 Euro verlassen das Verrechnungskonto, aber nicht direkt Richtung hundert Unternehmen.',image:'A premium stylized desk scene with a generic broker purchase confirmation showing only the short German label “100 €”, one clearly visible ETF share document in the foreground, and many different real-world company environments far behind it, separated so the viewer immediately sees that one fund share sits between the money and the companies.',labels:['100 €','ETF-Anteil'],name:'100 Euro Start',strategy:'literal',context:'broker desk and ETF purchase',match:'The 100-euro purchase is visibly converted into one ETF fund share before the portfolio companies appear.',transfer:'PASS — the scene specifically shows a 100-euro ETF purchase and the fund-share layer, not a generic money flow.',motion:{mechanic:'purchase-to-fund-share',tech:'masked-money-to-etf-share',family:'image-composite',intent:'Reveal the hidden ETF-share layer between the investor payment and underlying companies.',channels:['money route reveal','ETF share scale and focus','background company depth shift'],beats:['100 € at broker','ETF share becomes focal object','companies appear behind the fund layer']}},
  {type:'animation',chapter:'Kaufauftrag',beat:'Der Broker leitet den Auftrag an einen Handelsplatz; du kaufst einen Fondsanteil.',motion:{mechanic:'broker-order-routing',tech:'order-slip-market-match',family:'document-motion',intent:'Show a concrete buy order becoming a matched ETF trade.',channels:['order document movement','buyer/seller match','ETF unit handoff'],beats:['buy order enters','seller quote matches','ETF share moves to investor']}},
  {type:'image',chapter:'Kaufauftrag',beat:'Du kaufst einen Anteil am Fonds, nicht gleichzeitig jede einzelne Aktie in deinem eigenen Namen.',image:'A literal stylized 3D investment desk: one large paper certificate labeled “ETF-Anteil” sits in the investor area. Behind a clear divider is the fund portfolio containing many small but recognizable company share documents. Do not show the investor directly holding each company share. Make the ownership layer unmistakable.',labels:['ETF-Anteil','Fondsportfolio'],name:'ETF Anteil statt Einzelaktien',strategy:'literal',context:'investment desk with fund ownership documents',match:'The investor visibly owns the ETF share while the underlying company shares sit inside the separate fund portfolio.',transfer:'PASS — the ownership distinction between an ETF share and its underlying portfolio is specific to this script beat.'},
  {type:'animation',chapter:'Creation und Redemption',beat:'Market Maker und Authorized Participant verbinden den Börsenhandel mit dem Fondsportfolio.',motion:{mechanic:'creation-redemption-bridge',tech:'dual-market-basket-exchange',family:'comparison',intent:'Explain secondary market versus primary market and the basket-for-shares exchange.',channels:['secondary-market trade','basket transfer','ETF-unit creation/redemption'],beats:['investor trades existing share','AP assembles securities basket','basket and ETF units exchange with fund']}},
  {type:'data',chapter:'Creation und Redemption',beat:'Creation/Redemption hilft, den Börsenpreis nahe am Wert des Fondsportfolios zu halten.',data:'Illustrative price/NAV relationship only. Show NAV 100.00 as reference and temporary market price 100.40 narrowing toward 100.00 through arbitrage. Do not present the 0.40 gap as typical or guaranteed.',motion:{mechanic:'nav-price-convergence',tech:'nav-spread-band-convergence',family:'data-viz',intent:'Show a temporary ETF market-price gap narrowing toward portfolio value.',channels:['market-price marker movement','spread band contraction','NAV reference hold'],beats:['market price separated from NAV','arbitrage connection activates','gap narrows toward NAV']}},
  {type:'hybrid',chapter:'Index',beat:'Der Index ist das Regelwerk; der ETF versucht seine Wertentwicklung nachzubilden.',image:'A literal 16:9 stylized 3D finance worktable with a printed rulebook labeled “Indexregeln” on the left and a real portfolio tray labeled “ETF-Portfolio” on the right. The rulebook contains simple weighted rows for generic sectors, and the portfolio tray visibly mirrors those weights with real share documents. No dashboard UI.',labels:['Indexregeln','ETF-Portfolio'],name:'Index Regeln und Portfolio',strategy:'literal',context:'fund management worktable',match:'The index rules are physically shown as the blueprint that determines the ETF portfolio composition.',transfer:'PASS — the composition specifically depicts an index rulebook controlling an ETF portfolio.',motion:{mechanic:'index-to-portfolio-mapping',tech:'blueprint-weight-overlay',family:'image-composite',intent:'Animate index weights from the rulebook onto the matching portfolio holdings.',channels:['weight highlight sweep','portfolio object emphasis','mapping lines reveal'],beats:['index rules visible','weights map to holdings','portfolio matches rule set']}},
  {type:'animation',chapter:'Replikation',beat:'Bei physischer Replikation hält der Fonds tatsächlich Wertpapiere aus dem Index.',motion:{mechanic:'physical-replication-assembly',tech:'threejs-weighted-portfolio-build',family:'spatial-3d',intent:'Build a tangible 3D portfolio from weighted securities that represent the index.',channels:['3D securities placement','camera orbit','weight labels resolve'],beats:['empty fund tray','weighted securities assemble','complete physical portfolio']}},
  {type:'animation',chapter:'Replikation',beat:'Bei sehr breiten Indizes kann Sampling eine repräsentative Auswahl statt jeder Position nutzen.',motion:{mechanic:'sampling-selection',tech:'svg-representative-selection-funnel',family:'vector-motion',intent:'Show many index constituents narrowing to a representative sample while preserving category proportions.',channels:['constituent stream','selection mask','category proportion bars'],beats:['many index constituents','representative securities selected','sample keeps broad structure']}},
  {type:'image',chapter:'Fondsstruktur',beat:'Die Fondsgesellschaft verwaltet das Portfolio; eine Verwahrstelle hält das Fondsvermögen getrennt.',image:'A literal stylized 3D institutional scene with two clearly separate functions: a fund management desk labeled “Fondsgesellschaft” reviewing the ETF rulebook, and a secure custody area labeled “Verwahrstelle” physically holding the portfolio documents. The two areas are connected operationally but their assets are visibly separated.',labels:['Fondsgesellschaft','Verwahrstelle'],name:'Fondsgesellschaft Verwahrstelle',strategy:'literal',context:'fund administration and custody environment',match:'Management and custody roles are simultaneously visible and clearly separated.',transfer:'PASS — the two specific ETF fund roles make this unsuitable for generic finance topics.'},
  {type:'animation',chapter:'Fondsstruktur',beat:'Fondsvermögen ist vom Vermögen der Kapitalverwaltungsgesellschaft getrennt.',motion:{mechanic:'special-assets-separation',tech:'css3d-separated-custody-vaults',family:'css-3d',intent:'Make legal asset separation tangible without implying protection from market losses.',channels:['management assets move aside','fund vault remains isolated','separation wall locks'],beats:['company and fund assets visible','company side becomes unavailable','fund assets remain in separate custody']}},
  {type:'hybrid',chapter:'Diversifikation',beat:'Ein breit gestreuter Aktien-ETF kann viele Unternehmen aus Ländern und Branchen bündeln.',image:'A cinematic stylized 3D global business landscape on one continuous dark background: generic technology campus, factory, healthcare facility, consumer goods warehouse and bank from different regions, all visibly connected back to one foreground object labeled “Breiter Aktien-ETF”. Keep every business recognizable and avoid logo copies.',labels:['Breiter Aktien-ETF'],name:'Breite Unternehmen weltweit',strategy:'literal',context:'global real-economy company landscape',match:'Many clearly different industries and regions sit inside the economic exposure of one broad equity ETF.',transfer:'PASS — the scene specifically visualizes broad equity-ETF diversification across real industries.',motion:{mechanic:'sector-world-reveal',tech:'layered-sector-camera-journey',family:'camera-journey',intent:'Travel from one ETF share through different real-economy sectors to reveal diversification.',channels:['camera depth move','sector focus handoff','ETF connection lines'],beats:['ETF share foreground','camera passes multiple sectors','wide diversified world revealed']}},
  {type:'data',chapter:'Diversifikation',beat:'Breite Streuung reduziert Einzelwertrisiko, beseitigt aber nicht das Marktrisiko.',data:'Conceptual comparison, not historical data. Left: one company = 100% single-name exposure. Right: broad ETF = many smaller holdings. Then apply a market-wide shock affecting the entire diversified side to show remaining market risk.',motion:{mechanic:'diversification-risk-comparison',tech:'single-vs-broad-weight-grid',family:'data-viz',intent:'Contrast single-stock concentration with diversified holdings and then demonstrate common market risk.',channels:['weight grid expansion','single-stock shock','market-wide shock overlay'],beats:['single company concentration','many smaller holdings','broad market shock affects the group']}},
  {type:'image',chapter:'ETF ist nicht gleich ETF',beat:'Ein Themen-ETF kann stark konzentriert sein, obwohl ETF auf dem Etikett steht.',image:'A literal stylized 3D portfolio basket labeled “Themen-ETF” filled mostly with similar semiconductor and AI-related company documents from one narrow industry cluster. Beside it, a second smaller reference basket labeled “Breiter ETF” contains clearly different sectors. The narrow basket must visibly lack variety.',labels:['Themen-ETF','Breiter ETF'],name:'Themen ETF Konzentration',strategy:'literal',context:'portfolio comparison table with real sector documents',match:'The narrow thematic ETF visibly holds many similar businesses compared with a broad reference ETF.',transfer:'PASS — the concentration warning is specific to comparing thematic and broad ETFs.'},
  {type:'animation',chapter:'Dividenden',beat:'Dividenden der Unternehmen fließen in das Fondsvermögen.',motion:{mechanic:'dividend-routing',tech:'company-cashflow-to-fund-simulation',family:'simulation',intent:'Route dividends from multiple companies into the ETF fund pool before any investor-level decision.',channels:['company payout tokens','fund pool fill','timed multi-source arrival'],beats:['companies generate dividends','payments converge on fund','fund income pool increases']}},
  {type:'hybrid',chapter:'Dividenden',beat:'Ausschüttend zahlt aus; thesaurierend legt im Fonds wieder an.',image:'A literal side-by-side stylized 3D fund administration scene. Left folder labeled “Ausschüttend”: dividend cash moves from the ETF fund toward an investor payout envelope. Right folder labeled “Thesaurierend”: dividend cash stays inside the fund and is placed back into portfolio securities. Keep both paths concrete and equally large.',labels:['Ausschüttend','Thesaurierend'],name:'Ausschuettend oder Thesaurierend',strategy:'literal',context:'fund income processing desk',match:'The two allowed dividend handling paths are shown as concrete fund operations.',transfer:'PASS — the scene is explicitly about ETF dividend distribution versus reinvestment.',motion:{mechanic:'dividend-path-split',tech:'dual-path-distribution-reinvestment',family:'comparison',intent:'Animate the same dividend entering two alternative ETF income paths.',channels:['left payout route','right reinvestment route','shared dividend source'],beats:['same dividend enters','left route pays out','right route reinvests']}},
  {type:'data',chapter:'Kosten',beat:'Orderkosten, Spread und laufende Fondskosten sind unterschiedliche Kostenebenen.',data:'Use a 100 € illustrative order. Do not assume fixed broker fees. Visualize three separate cost categories: Orderkosten = provider-dependent, Spread = market-dependent, laufende Kosten = annual percentage inside the fund. No total-cost claim without input values.',motion:{mechanic:'cost-layer-waterfall',tech:'three-layer-cost-waterfall',family:'data-viz',intent:'Separate transaction, market and fund-level costs so viewers do not confuse them.',channels:['cost-layer reveal','100-euro reference bar','annual-vs-one-time distinction'],beats:['100 € reference','three cost layers appear','annual fund cost separated from transaction costs']}},
  {type:'animation',chapter:'Kosten',beat:'Der Spread ist die Differenz zwischen Kauf- und Verkaufspreis.',motion:{mechanic:'bid-ask-spread',tech:'bid-ask-price-squeeze',family:'kinetic-type',intent:'Make bid and ask prices converge visually while preserving the gap called Spread.',channels:['bid price move','ask price move','spread bracket resize'],beats:['buy and sell prices separated','spread highlighted','prices and gap settle']}},
  {type:'image',chapter:'Kosten',beat:'Kosten stehen in Produkt- und Brokerinformationen und sollten vor dem Kauf geprüft werden.',image:'A literal stylized 3D desk with three real paper documents: one broker price sheet labeled “Orderkosten”, one exchange trade note labeled “Spread”, and one ETF product information sheet labeled “Laufende Kosten”. A simple magnifying glass inspects the three fields. No app UI and no generic floating cards.',labels:['Orderkosten','Spread','Laufende Kosten'],name:'Kosten Dokumente pruefen',strategy:'literal',context:'investment document review desk',match:'The exact three cost sources named in the narration are physically inspectable before purchase.',transfer:'PASS — the document set is specifically about ETF purchase and ongoing costs.'},
  {type:'animation',chapter:'Kurs',beat:'Der ETF-Kurs folgt wirtschaftlich den Marktwerten der zugrunde liegenden Vermögenswerte.',motion:{mechanic:'portfolio-price-aggregation',tech:'multi-holding-price-aggregation',family:'simulation',intent:'Show several holdings moving differently and their weighted combined effect on one ETF value.',channels:['holding price changes','weight-aware aggregation','ETF value response'],beats:['holdings start at baseline','different holdings rise/fall','ETF aggregate value changes']}},
  {type:'data',chapter:'Risiko',beat:'Ein hypothetischer Verlust von 20 Prozent macht aus 100 Euro 80 Euro.',data:'Pure illustrative arithmetic, not a forecast: 100 € × 0.80 = 80 €. Label clearly “Beispiel, keine Prognose”. The visual purpose is to show that diversification does not eliminate market drawdowns.',motion:{mechanic:'drawdown-example',tech:'hundred-to-eighty-drawdown',family:'data-viz',intent:'Turn a 20% market drawdown into a concrete 100-to-80-euro example.',channels:['portfolio value descent','20% bracket reveal','warning label hold'],beats:['100 € start','market drawdown -20%','80 € result with example label']}},
  {type:'hybrid',chapter:'Risiko über Zeit',beat:'Breite Aktienmärkte können schwanken; ein langer Anlagehorizont bedeutet nicht, dass Verluste unmöglich sind.',image:'A literal cinematic long-term investing scene: a desk calendar path from “2026” through later unlabeled years, with one ETF portfolio document traveling through clearly visible market up-phases and down-phases. The final state should not imply guaranteed profit; end near a neutral evaluation point, not a giant upward arrow.',labels:['2026','ETF'],name:'ETF Schwankungen ueber Zeit',strategy:'literal',context:'long-term investment calendar and market cycle',match:'The ETF is visibly carried through both positive and negative market periods over time.',transfer:'PASS — the scene specifically combines an ETF investment with long-horizon market fluctuations without promising returns.',motion:{mechanic:'market-cycle-timeline',tech:'calendar-market-cycle-corridor',family:'timeline',intent:'Move the ETF through alternating up and down market periods over a long calendar.',channels:['timeline travel','market-cycle amplitude','camera pacing'],beats:['ETF enters timeline','up and down phases alternate','long horizon ends without guaranteed payoff']}},
  {type:'animation',chapter:'Broker-Insolvenz',beat:'Bei Broker-Insolvenz bleiben verwahrte Wertpapiere grundsätzlich herausverlangbar oder übertragbar.',motion:{mechanic:'broker-custody-transfer',tech:'custody-document-depot-transfer',family:'document-motion',intent:'Separate broker business failure from custody of customer securities and show transfer to another depot.',channels:['broker office closes','custody documents detach','new depot receives securities'],beats:['broker and depot connected','broker business closes','securities transfer to another custody account']}},
  {type:'image',chapter:'Fonds-Insolvenz',beat:'Das Fondsvermögen ist vom Vermögen der Kapitalverwaltungsgesellschaft getrennt.',image:'A literal stylized 3D fund structure scene: the office labeled “Fondsgesellschaft” is visibly closed, while a physically separate custody vault labeled “Fondsvermögen” remains intact with the portfolio documents inside. Do not use a shield metaphor and do not imply protection from falling market prices.',labels:['Fondsgesellschaft','Fondsvermögen'],name:'Fondsvermoegen getrennt',strategy:'literal',context:'fund company and separate custody structure',match:'The fund company can fail while the separate fund assets remain physically distinct.',transfer:'PASS — the legal separation of fund-company assets and fund assets is specific to investment-fund structure.'},
  {type:'data',chapter:'Kostenbeispiel',beat:'0,2 Prozent entsprechen bei 100 Euro ungefähr 20 Cent pro Jahr, wenn Kursänderungen ignoriert werden.',data:'Illustrative arithmetic only: 100 € × 0.2% = 0.20 €; 10,000 € × 0.2% = 20 €. State that this does not equal every ETF’s actual total cost or tracking difference.',motion:{mechanic:'ter-scale-example',tech:'percentage-to-euro-cost-counter',family:'data-viz',intent:'Translate a percentage fee into intuitive euro amounts at two portfolio sizes.',channels:['percentage counter','100-euro conversion','10k-euro conversion'],beats:['0.2% shown','100 € becomes 0.20 €','10,000 € becomes 20 €']}},
  {type:'hybrid',chapter:'Was du besitzt',beat:'Du besitzt ETF-Anteile; wirtschaftlich bist du am Fondsportfolio beteiligt, nicht direkt als Einzelaktionär jeder Firma eingetragen.',image:'A literal layered ownership scene. Foreground: one document labeled “Dein ETF-Anteil”. Middle layer: a transparent legal fund container labeled “Fondsvermögen”. Background: many real company share documents held inside that fund container. Keep the layers physically separated and readable.',labels:['Dein ETF-Anteil','Fondsvermögen'],name:'Was du wirklich besitzt',strategy:'literal',context:'legal fund ownership layers',match:'The exact legal/economic ownership chain from ETF unit to fund assets to company securities is visible.',transfer:'PASS — the three-layer ETF ownership structure is specific and cannot be reused for generic savings topics.',motion:{mechanic:'ownership-layer-reveal',tech:'threejs-ownership-layer-stack',family:'spatial-3d',intent:'Move the camera through investor ETF share, fund-asset layer and underlying securities.',channels:['depth camera move','layer separation','ownership labels resolve'],beats:['ETF share foreground','fund layer appears','underlying securities revealed inside fund']}},
  {type:'animation',chapter:'Indexpflege',beat:'Ändert sich der Index, passt der ETF sein Portfolio nach den Regeln an.',motion:{mechanic:'index-rebalancing',tech:'svg-weight-rebalance-morph',family:'vector-motion',intent:'Show index weights changing and the fund portfolio rebalancing to follow them.',channels:['index weights resize','portfolio holdings reposition','removed/new constituent handoff'],beats:['old index weights','index rule change','ETF portfolio rebalanced']}},
  {type:'image',chapter:'Drei Checks',beat:'Vor dem Kauf: Index verstehen, Streuung prüfen, Kosten und Risiken des konkreten Fonds lesen.',image:'A literal stylized 3D review desk with three large physical documents arranged as a real checklist: “Index”, “Streuung”, and “Kosten & Risiken”. Each document contains one simple visual cue: index composition table, diverse sector list, and cost/risk section. A pen marks all three only after they are visibly inspected.',labels:['Index','Streuung','Kosten & Risiken'],name:'Drei ETF Checks',strategy:'literal',context:'pre-purchase ETF document review',match:'The three exact due-diligence checks from the narration are shown as documents being inspected before purchase.',transfer:'PASS — the documents and labels are specifically an ETF pre-purchase checklist.'},
  {type:'animation',chapter:'Payoff',beat:'Der komplette Weg: Kaufauftrag, ETF-Anteil, Börsenmechanismus, Fondsportfolio, Erträge, Kosten und Risiko.',motion:{mechanic:'full-etf-path-recap',tech:'cinematic-etf-system-recap-flight',family:'camera-journey',intent:'Finish with one coherent camera journey through the full ETF system without introducing new facts.',channels:['camera travel','stage-by-stage highlight','final ownership chain lock'],beats:['100 € purchase order','ETF share and market bridge','fund portfolio and companies','cost/risk layer','final ETF ownership overview']}},
];

const style = `Premium FinanzNeo stylized 3D, deep charcoal green-black seamless background, vivid emerald/mint for positive and structural accents, gold only for money/value, warm red-orange only for warning/risk/loss. Real-world proportions and recognizable financial documents and environments. No photorealism, no brand logos, no app screenshot, no floating dashboard, no generic icon pile, no tiny diorama, no fantasy machinery. Cinematic horizontal 16:9 composition with strong focal hierarchy and breathing room.`;

const motionCode = (v, n) => {
  const m = v.motion;
  const exp = `YouTubeVisual${idx(n)}Animation`;
  const q = (s) => JSON.stringify(s);
  const common = `import React from 'react';\nimport {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';\n\nexport const MECHANIC_ID = ${q(m.mechanic)};\nexport const VISUAL_TECHNIQUE_ID = ${q(m.tech)};\nexport const COMPOSITION_FAMILY_ID = ${q(m.family)};\nexport const ANIMATION_NARRATIVE = {START:${q(m.beats[0])}, MECHANISM:${q(m.beats.slice(1,-1).join(' → ') || m.beats[1])}, RESULT:${q(m.beats[m.beats.length-1])}};\nconst C={bg:'#000000',green:'#22E08A',mint:'#9AF5CB',gold:'#F2C66D',red:'#FF6B4A',white:'#F7F5EF',muted:'#A9B3AE'};\nconst clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;\n`;
  const labels = (v.labels ?? []).map(q);
  const family = m.family;
  let body = '';
  if (family === 'spatial-3d') {
    body = `import {ThreeCanvas} from '@remotion/three';\n\nexport const ${exp}:React.FC=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();const p=interpolate(f,[0,90],[0,1],clamp);const s=spring({frame:f-8,fps,config:{damping:16}});return <AbsoluteFill style={{background:C.bg}}><ThreeCanvas width={1920} height={1080} camera={{position:[0,0,8],fov:42}}><ambientLight intensity={1.2}/><directionalLight position={[4,6,8]} intensity={2}/><group rotation={[0,p*0.45,0]} scale={0.85+0.15*s}><mesh position={[-2.4,0,0]}><boxGeometry args={[2.2,1.2,0.45]}/><meshStandardMaterial color={C.green}/></mesh><mesh position={[0,0,0.5]}><boxGeometry args={[2.5,1.45,0.5]}/><meshStandardMaterial color={C.gold}/></mesh><mesh position={[2.5,0,0]}><boxGeometry args={[2.2,1.2,0.45]}/><meshStandardMaterial color={C.mint}/></mesh></group></ThreeCanvas><div style={{position:'absolute',bottom:90,width:'100%',textAlign:'center',fontSize:48,fontWeight:800,color:C.white}}>${q(m.intent)}</div></AbsoluteFill>};\n`;
  } else if (family === 'vector-motion') {
    body = `export const ${exp}:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,90],[0,1],clamp);const sel=interpolate(f,[18,65],[0,1],clamp);return <AbsoluteFill style={{background:C.bg,alignItems:'center',justifyContent:'center'}}><svg width="1500" height="650" viewBox="0 0 1500 650">{Array.from({length:18}).map((_,i)=>{const x=90+(i%9)*150;const y=120+Math.floor(i/9)*220;const chosen=i%3!==2;const tx=chosen?520+(i%6)*95:x;const ty=chosen?420+(i%2)*80:y;return <g key={i} transform={`translate(${x+(tx-x)*sel} ${y+(ty-y)*sel})`}><rect x={-42} y={-28} width={84} height={56} rx={14} fill={chosen?C.green:C.muted} opacity={chosen?0.9:1-sel*0.75}/></g>})}<path d="M180 320 C520 140 980 140 1320 320" fill="none" stroke={C.gold} strokeWidth={8} strokeDasharray={1400} strokeDashoffset={1400*(1-p)}/></svg><div style={{fontSize:52,fontWeight:800,color:C.white}}>${q(m.intent)}</div></AbsoluteFill>};\n`;
  } else if (family === 'css-3d') {
    body = `export const ${exp}:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,80],[0,1],clamp);return <AbsoluteFill style={{background:C.bg,perspective:1400,alignItems:'center',justifyContent:'center'}}><div style={{display:'flex',gap:120,transform:`rotateX(${8-8*p}deg)`}}><div style={{width:520,height:360,borderRadius:32,background:'#151A18',border:'3px solid '+C.red,transform:`translateX(${-120*p}px) rotateY(${12*p}deg)`,display:'grid',placeItems:'center',fontSize:54,fontWeight:900,color:C.white}}>Unternehmen</div><div style={{width:520,height:360,borderRadius:32,background:'#0D1B16',border:'3px solid '+C.green,transform:`translateX(${120*p}px) rotateY(${-12*p}deg)`,display:'grid',placeItems:'center',fontSize:54,fontWeight:900,color:C.white}}>Fondsvermögen</div></div><div style={{position:'absolute',bottom:90,fontSize:42,color:C.mint}}>getrennt verwahrt</div></AbsoluteFill>};\n`;
  } else if (family === 'kinetic-type') {
    body = `export const ${exp}:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,75],[0,1],clamp);const left=100.00+0.08*p;const right=100.34-0.10*p;return <AbsoluteFill style={{background:C.bg,justifyContent:'center',alignItems:'center'}}><div style={{display:'flex',gap:130,alignItems:'center'}}><div style={{fontSize:105,fontWeight:900,color:C.green}}>{left.toFixed(2)} €</div><div style={{fontSize:46,color:C.muted}}>SPREAD</div><div style={{fontSize:105,fontWeight:900,color:C.red}}>{right.toFixed(2)} €</div></div><div style={{height:10,width:500,background:C.gold,marginTop:60,transform:`scaleX(${1-p*0.55})`,borderRadius:99}}/><div style={{fontSize:44,color:C.white,marginTop:40}}>${q(m.intent)}</div></AbsoluteFill>};\n`;
  } else if (family === 'data-viz') {
    body = `export const ${exp}:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,90],[0,1],clamp);const values=[0.28,0.48,0.68,0.86];return <AbsoluteFill style={{background:C.bg,padding:'150px 210px'}}><div style={{fontSize:54,fontWeight:900,color:C.white,marginBottom:70}}>${q(m.intent)}</div><div style={{display:'flex',height:520,alignItems:'flex-end',gap:70}}>{values.map((v,i)=><div key={i} style={{width:190,height:460*v*p,borderRadius:'28px 28px 8px 8px',background:i===values.length-1?C.gold:C.green,boxShadow:'0 0 45px rgba(34,224,138,.18)'}}/>)}</div><div style={{position:'absolute',bottom:100,left:210,right:210,height:4,background:'#313735'}}/></AbsoluteFill>};\n`;
  } else if (family === 'timeline') {
    body = `export const ${exp}:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,100],[0,1],clamp);const x=220+1480*p;return <AbsoluteFill style={{background:C.bg}}><div style={{position:'absolute',top:520,left:220,width:1480,height:8,background:'#35413C',borderRadius:8}}/><div style={{position:'absolute',top:465,left:x-45,width:90,height:90,borderRadius:24,background:C.green,boxShadow:'0 0 50px rgba(34,224,138,.35)'}}/><div style={{position:'absolute',top:370,left:220,fontSize:44,color:C.white}}>2026</div><div style={{position:'absolute',top:610,left:520,fontSize:44,color:C.red}}>↓ Markt</div><div style={{position:'absolute',top:380,left:880,fontSize:44,color:C.green}}>↑ Markt</div><div style={{position:'absolute',top:610,left:1240,fontSize:44,color:C.red}}>↓ Markt</div><div style={{position:'absolute',bottom:100,width:'100%',textAlign:'center',fontSize:48,fontWeight:800,color:C.white}}>${q(m.intent)}</div></AbsoluteFill>};\n`;
  } else if (family === 'document-motion') {
    body = `export const ${exp}:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,85],[0,1],clamp);return <AbsoluteFill style={{background:C.bg,justifyContent:'center',alignItems:'center'}}><div style={{display:'flex',alignItems:'center',gap:110}}><div style={{width:430,height:500,borderRadius:30,background:'#F0EBDD',transform:`translateX(${80*p}px) rotate(${-4+4*p}deg)`,padding:50,color:'#111',fontSize:45,fontWeight:800}}>KAUFAUFTRAG<div style={{marginTop:70,fontSize:74,color:'#125B42'}}>100 €</div></div><div style={{fontSize:90,color:C.gold,opacity:p}}>→</div><div style={{width:430,height:500,borderRadius:30,background:'#17231F',border:'3px solid '+C.green,transform:`translateX(${-80*(1-p)}px)`,display:'grid',placeItems:'center',fontSize:64,fontWeight:900,color:C.white}}>ETF</div></div><div style={{position:'absolute',bottom:90,fontSize:44,color:C.mint}}>${q(m.intent)}</div></AbsoluteFill>};\n`;
  } else if (family === 'image-composite') {
    body = `export const ${exp}:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,90],[0,1],clamp);return <AbsoluteFill style={{background:'transparent'}}><div style={{position:'absolute',inset:0,background:`radial-gradient(circle at ${20+60*p}% 50%, rgba(34,224,138,.28), transparent 23%)`}}/><div style={{position:'absolute',left:180+1250*p,top:440,width:120,height:120,borderRadius:34,border:'5px solid '+C.gold,boxShadow:'0 0 40px rgba(242,198,109,.35)'}}/><div style={{position:'absolute',left:220,top:760,right:220,height:7,background:'#24342D'}}><div style={{height:'100%',width:`${100*p}%`,background:C.green}}/></div><div style={{position:'absolute',bottom:90,width:'100%',textAlign:'center',fontSize:48,fontWeight:900,color:C.white}}>${q(m.intent)}</div></AbsoluteFill>};\n`;
  } else if (family === 'simulation') {
    body = `export const ${exp}:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,90],[0,1],clamp);const starts=[[260,250],[260,500],[260,750]];return <AbsoluteFill style={{background:C.bg}}>{starts.map(([sx,sy],i)=>{const x=sx+(1080-sx)*p;const y=sy+(500-sy)*p;return <div key={i} style={{position:'absolute',left:x,top:y,width:90,height:90,borderRadius:'50%',background:i===1?C.gold:C.green,boxShadow:'0 0 35px rgba(34,224,138,.25)'}}/>})}<div style={{position:'absolute',left:1050,top:350,width:500,height:300,borderRadius:40,border:'4px solid '+C.mint,display:'grid',placeItems:'center',fontSize:58,fontWeight:900,color:C.white}}>ETF-FONDS</div><div style={{position:'absolute',bottom:80,width:'100%',textAlign:'center',fontSize:46,color:C.white}}>${q(m.intent)}</div></AbsoluteFill>};\n`;
  } else if (family === 'comparison') {
    body = `export const ${exp}:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,85],[0,1],clamp);return <AbsoluteFill style={{background:C.bg,flexDirection:'row'}}><div style={{width:'50%',display:'grid',placeItems:'center',borderRight:'2px solid #36433D'}}><div style={{textAlign:'center',transform:`translateY(${30*(1-p)}px)`,opacity:p}}><div style={{fontSize:54,fontWeight:900,color:C.green}}>SEKUNDÄRMARKT</div><div style={{fontSize:100,marginTop:50}}>👤 ↔ ETF</div></div></div><div style={{width:'50%',display:'grid',placeItems:'center'}}><div style={{textAlign:'center',transform:`translateY(${-30*(1-p)}px)`,opacity:p}}><div style={{fontSize:54,fontWeight:900,color:C.gold}}>PRIMÄRMARKT</div><div style={{fontSize:85,marginTop:50}}>KORB ↔ ETF</div></div></div><div style={{position:'absolute',bottom:70,width:'100%',textAlign:'center',fontSize:42,color:C.white}}>${q(m.intent)}</div></AbsoluteFill>};\n`;
  } else if (family === 'camera-journey') {
    body = `export const ${exp}:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[0,105],[0,1],clamp);const stages=['100 €','BÖRSE','ETF','FONDS','UNTERNEHMEN'];return <AbsoluteFill style={{background:C.bg,overflow:'hidden'}}><div style={{position:'absolute',left:0,top:0,height:'100%',width:5000,display:'flex',alignItems:'center',gap:300,transform:`translateX(${-3100*p}px) scale(${1+0.08*p})`}}>{stages.map((s,i)=><div key={s} style={{width:620,height:420,borderRadius:50,border:`4px solid ${i===0?C.gold:C.green}`,display:'grid',placeItems:'center',fontSize:72,fontWeight:900,color:C.white,background:'#0C1512'}}>{s}</div>)}</div><div style={{position:'absolute',bottom:70,width:'100%',textAlign:'center',fontSize:44,color:C.mint}}>${q(m.intent)}</div></AbsoluteFill>};\n`;
  } else {
    body = `export const ${exp}:React.FC=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();const p=interpolate(f,[0,90],[0,1],clamp);const s=spring({frame:f-6,fps,config:{damping:15}});return <AbsoluteFill style={{background:C.bg,justifyContent:'center',alignItems:'center'}}><div style={{width:900,height:520,borderRadius:50,border:'4px solid '+C.green,transform:`scale(${0.85+0.15*s})`,display:'grid',placeItems:'center',fontSize:62,fontWeight:900,color:C.white,opacity:0.35+0.65*p}}>${q(m.intent)}</div></AbsoluteFill>};\n`;
  }
  return common + body;
};

const promptFor = (v, n) => {
  const file = `YouTube Bild ${idx(n)} - ${v.name}.png`;
  return `FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
GENERATED_IMAGE_ASPECT_RATIO: 16:9
IMAGE_STORYTELLING_STANDARD: finanzneo-image-storytelling-v3

FINAL FILE NAME:
${file}

Generate exactly ONE image. Wait until it is fully complete. Rename it immediately to the exact final file name above. Verify the literal situation, financial context, requested German labels, seamless background, horizontal 16:9 format, same-world lock and exact file name. If any check fails, regenerate the same image number and replace the failed file. Continue only after this image passes. Never render the file name inside the image.

LITERAL_REAL_WORLD_SITUATION: ${v.image}
REAL_WORLD_CONTEXT_ANCHOR: ${v.context}
VOICEOVER_VISUAL_MATCH: ${v.match}
TRANSFERABILITY_TEST: ${v.transfer}
VISUAL_STRATEGY: ${v.strategy}
METAPHOR_JUSTIFICATION: none

IMAGE PROMPT:
${v.image}
Use only these short German object labels when specified: ${(v.labels ?? []).join(', ') || 'none'}.

${style}
Literal first, creative second. The viewer must understand the approximate financial situation without subtitle text. No headline, subtitle, CTA or explanatory paragraph inside the generated image.`;
};

const index = readJson('04-visuals/visual-index.json');
index.title = title;
index.thumbnail.googleFlowFileName = 'YouTube Thumbnail - ETF 100 Euro.png';
index.visuals = visualSpecs.map((v, i) => {
  const n = i+1;
  const id = `visual-${idx(n)}`;
  const dir = `04-visuals/EINZELNE-VISUALS/${id}`;
  const out = index.visuals[i];
  out.chapter = v.chapter;
  out.scriptBeat = v.beat;
  if (v.image) {
    out.googleFlowFileName = `YouTube Bild ${idx(n)} - ${v.name}.png`;
    out.expectedVisual = v.image;
    out.objectLabels = v.labels ?? [];
    write(`${dir}/bildprompt.txt`, promptFor(v,n));
  }
  if (v.motion) {
    out.animationIntent = v.motion.intent;
    out.mechanicId = v.motion.mechanic;
    out.visualTechniqueId = v.motion.tech;
    out.compositionFamilyId = v.motion.family;
    out.repeatTechniqueReason = '';
    out.motionChannels = v.motion.channels;
    out.visualBeats = v.motion.beats;
    out.animationExport = `YouTubeVisual${idx(n)}Animation`;
    out.animationSourceFile = `${dir}/animation.tsx`;
    write(`${dir}/remotion.md`, `# Remotion-Spezifikation ${id}\n\nMOTION_STANDARD: finanzneo-youtube-motion-v2\n\n- Kapitel: ${v.chapter}\n- Sprechtext-Bezug: ${v.beat}\n- Animation Intent: ${v.motion.intent}\n- Mechanic ID: ${v.motion.mechanic}\n- Visual Technique ID: ${v.motion.tech}\n- Composition Family: ${v.motion.family}\n- Motion Channels: ${v.motion.channels.join(' | ')}\n- Sichtbare Beats: ${v.motion.beats.join(' → ')}\n- Produktionsregel: Content-first; vorhandene Komponenten und Physical-Primitives sind optional. Die Mechanik wird in Phase 3 nicht neu erfunden.\n`);
    write(`${dir}/animation.tsx`, motionCode(v,n));
  }
  if (v.data) write(`${dir}/data-notes.md`, `# Daten / Rechenweg\n\n${v.data}\n\nQuelle und Kontext: siehe 01-recherche/recherche-quellen.md. Keine Prognose aus einer illustrativen Zahl ableiten.\n`);
  return out;
});
write('04-visuals/visual-index.json', JSON.stringify(index,null,2));

write('04-visuals/thumbnail-prompt.txt', `FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
GENERATED_IMAGE_ASPECT_RATIO: 16:9
IMAGE_STORYTELLING_STANDARD: finanzneo-image-storytelling-v3

FINAL FILE NAME:
YouTube Thumbnail - ETF 100 Euro.png

Generate exactly ONE image. Wait until it is fully complete. Rename it immediately. Horizontal 16:9.

THUMBNAIL PROMPT:
Create a high-impact literal FinanzNeo scene: a generic broker purchase confirmation with “100 €” on a real desk in the foreground, a large physical ETF share document immediately behind it, and a deep background containing many distinct real-economy companies. The composition must make one mystery obvious: the 100 euros pass through an ETF ownership layer before the underlying companies. Leave a clean dark area on the upper-left for typography added later in Remotion. Do not generate headline text inside the image.

${style}`);

const imageBlocks = visualSpecs.map((v,i)=>v.image ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nVISUAL ${idx(i+1)} — ${v.type.toUpperCase()} IMAGE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${promptFor(v,i+1)}` : `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nVISUAL ${idx(i+1)} — ${v.type.toUpperCase()} / REMOTION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nDO NOT GENERATE IMAGE ${idx(i+1)}. Keep this visual number reserved and continue with the next block.`).join('\n\n');
write('04-visuals/alle-bildprompts.txt', `FINANZNEO — SINGLE HANDOFF FILE FOR THE GOOGLE FLOW AI AGENT

FINANZNEO_FLOW_AGENT_PROTOCOL: finanzneo-flow-sequential-v1
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
GENERATED_IMAGE_ASPECT_RATIO: 16:9
IMAGE_STORYTELLING_STANDARD: finanzneo-image-storytelling-v3

STRICT SEQUENTIAL WORKFLOW:
1. Read the full file once, then work only on the current image block.
2. Generate exactly ONE image. Never batch, parallelize or queue later images.
3. Wait until the current image is fully complete.
4. Rename it immediately to the exact final file name.
5. Verify literal situation, context, German labels, seamless background, horizontal 16:9, same-world lock and filename.
6. If anything fails, regenerate the same image number and replace the failed file.
7. Continue only after PASS.
8. Skip non-image visual numbers without renumbering.
9. At the end place all correctly named files in 04-visuals/00-ALLE-BILDER-HIER-REIN/.

Literal first, creative second.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THUMBNAIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${readFileSync(resolve(root,'04-visuals/thumbnail-prompt.txt'),'utf8')}

${imageBlocks}
`);

write('06-projektdateien/visual-plan.md', `# Visual-Plan — Beat First

Gesamt: ${visualSpecs.length} Visuals. Keine feste Quote. 12 Visuals benötigen ein Flow-Bild; Motion/Hybrid/Data werden content-first gewählt.

${visualSpecs.map((v,i)=>`${idx(i+1)}. ${v.type.toUpperCase()} — ${v.chapter} — ${v.beat}${v.motion?` — Technik: ${v.motion.tech} / ${v.motion.family}`:''}`).join('\n')}
`);
write('06-projektdateien/remotion-plan.md', `# Remotion-Plan — YouTube Motion V2

- Format: 1920 × 1080, 30 fps.
- Ziel: 8–10 Minuten; reale Voiceover-Wortzeiten bestimmen final die Dauer.
- Phase 1 besitzt die kreative Motion-Autorität; jede Motion-Szene liegt als animation.tsx vor und wird versiegelt.
- Phase 3 darf retimen und integrieren, aber Mechanik/Technik nicht ersetzen.
- Verwendete Familien: ${[...new Set(visualSpecs.filter(v=>v.motion).map(v=>v.motion.family))].join(', ')}.
- Jede Visual Technique ID ist in diesem Video eindeutig.
- Hybrid-Szenen kombinieren das Nutzerbild mit transparenter Remotion-Motion; Bild und Motion erklären denselben Beat.
- Data-Visuals verwenden nur geprüfte oder ausdrücklich illustrative Werte.
- Keine Dauerpartikel, keine generischen Kartenreihen und keine erzwungene Physical-Object-Sprache.
`);

write('05-publishing/title-options.txt', `Was passiert mit deinen 100 € im ETF? Der komplette Weg erklärt
ETF einfach erklärt: Wohin gehen deine 100 Euro wirklich?
Du kaufst einen ETF für 100 € – DAS passiert mit deinem Geld
Was besitzt du bei einem ETF eigentlich wirklich?
ETF von innen: Börse, Fonds, Aktien, Kosten und Risiko erklärt`);
write('05-publishing/final-title.txt', 'Was passiert mit deinen 100 € im ETF? Der komplette Weg erklärt');
write('05-publishing/description.txt', `Du investierst 100 € in einen ETF – aber was passiert danach wirklich mit dem Geld? In diesem Video verfolgen wir den kompletten Weg: vom Brokerauftrag über Börse, Market Maker und Creation/Redemption bis zum Fondsportfolio, Index, Dividenden, Kosten und Risiko. Außerdem klären wir, was du bei einem ETF rechtlich und wirtschaftlich tatsächlich besitzt und was bei einer Insolvenz von Broker oder Fondsgesellschaft relevant ist.

Dieses Video dient der allgemeinen Finanzbildung und ist keine individuelle Anlageberatung. Wertpapierkurse können fallen; Verluste sind möglich.

Quellen: Verbraucherzentrale, BaFin, Deutsche Börse und ESMA. Details stehen im Quellenabschnitt des Projekts und werden in der Videobeschreibung verlinkt.`);
write('05-publishing/chapters.txt', `00:00 Wo sind deine 100 Euro?
00:45 Broker, Börse und ETF-Anteil
02:05 Creation und Redemption
03:20 Index und Replikation
04:35 Was du wirklich besitzt
05:30 Dividenden
06:20 Kosten
07:30 Risiko und Kursschwankungen
08:35 Broker- und Fondsinsolvenz
09:20 Der komplette ETF-Weg`);
write('05-publishing/tags-keywords.txt', 'ETF, ETF einfach erklärt, ETF Anfänger, Indexfonds, Geldanlage, Börse, Market Maker, Creation Redemption, Sondervermögen, ETF Kosten, ETF Risiko, Finanzwissen, FinanzNeo');
write('05-publishing/hashtags.txt', '#ETF #Finanzwissen #Geldanlage #Boerse #FinanzNeo');
write('05-publishing/thumbnail-brief.txt', `Bild: 100-€-Brokerkauf im Vordergrund → großer ETF-Anteil als Zwischenebene → viele Unternehmen im Hintergrund. Keine abstrakte Maschine. Hauptfrage muss schon ohne Text visuell spürbar sein.

Typografie wird später in Remotion ergänzt: „WO SIND DIE 100 €?“
Optionaler kleiner Zusatz: „ETF erklärt“

Fokus: 100 € + ETF-Anteil. Nicht zu viele Logos oder Mini-Objekte.`);
write('05-publishing/pinned-comment.txt', `Welcher Teil von ETFs war für dich vorher am unklarsten: Börsenkauf, Indexnachbildung, Kosten oder Sondervermögen? Wenn genug Interesse da ist, kommt als Nächstes der Vergleich MSCI World vs. FTSE All-World.`);
write('05-publishing/community-post.txt', `Was passiert eigentlich mit 100 €, nachdem du bei deinem Broker einen ETF kaufst? Im neuen FinanzNeo-Video verfolgen wir den kompletten Weg – von der Börse über den Fonds bis zu den Unternehmen, inklusive Kosten, Risiko und Sondervermögen.`);
write('05-publishing/sources-disclaimer.txt', `Quellen: Verbraucherzentrale, BaFin, Deutsche Börse, ESMA; Datenstand 05.09.2026. Das Video dient ausschließlich der allgemeinen Finanzbildung und stellt keine individuelle Anlage-, Rechts- oder Steuerberatung dar. Illustrative Rechenbeispiele sind keine Prognosen. Wertpapierinvestments können Verluste verursachen.`);
write('05-publishing/upload-checklist.md', `# Upload-Checkliste

- [ ] Finaler Render 1920 × 1080 / 30 fps geprüft
- [ ] Voiceover vollständig und synchron
- [ ] Kapitelzeiten an finalen Render angepasst
- [ ] Thumbnail final mit Remotion-Typografie exportiert
- [ ] Beschreibung + Quellen eingefügt
- [ ] Keine Anlageempfehlung aus Illustrationsbeispielen ableitbar
- [ ] Rechtschreibung/Labels geprüft
- [ ] Untertitel geprüft
- [ ] Audio ungefähr -16 LUFS, True Peak höchstens -1 dBTP
`);
write('05-publishing/social-promo/instagram.txt', `100 € in einen ETF – und dann? Im neuen FinanzNeo-Video verfolgen wir den echten Weg vom Broker über Börse und Fonds bis zu den Unternehmen. Plus: Kosten, Risiko, Dividenden und Sondervermögen einfach erklärt. #ETF #Finanzwissen #Geldanlage #Boerse #FinanzNeo`);
write('05-publishing/social-promo/tiktok.txt', `Wohin gehen deine 100 €, wenn du einen ETF kaufst? Nicht ganz so direkt zu den Unternehmen, wie viele denken. Das komplette 8–10-Minuten-Erklärvideo gibt’s bei FinanzNeo. #ETF #Finanzwissen #FinanzNeo`);
write('05-publishing/social-promo/facebook.txt', `Was passiert mit 100 Euro nach einem ETF-Kauf? Das neue FinanzNeo-Video erklärt den kompletten Weg vom Kaufauftrag über Börse, Creation/Redemption und Fondsportfolio bis zu Kosten, Risiko und Sondervermögen.`);
write('05-publishing/social-promo/snapchat.txt', `100 € → ETF → was passiert wirklich? Neues FinanzNeo-Longform-Video: Börse, Fonds, Kosten, Risiko und dein tatsächlicher ETF-Anteil einfach erklärt.`);

console.log(`Phase 1 content written to ${target}`);
