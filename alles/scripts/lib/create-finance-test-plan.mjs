import {createFinanceScenePlanTemplate} from './create-finance-scene-plan-template.mjs';
import {ScenePlan} from './finance-contracts.mjs';

const voiceTexts = [
  'Was kosten dich nur 0,5 Prozent mehr ETF-Gebühren, wenn du 30 Jahre lang jeden Monat sparst?',
  'Bei derselben Sparrate wird zuerst ein kleiner Kostenanteil abgezogen, bevor der restliche Betrag vollständig für dich weiterarbeiten kann.',
  'Von 10.000 Euro Anlagevermögen entsprechen 0,5 Prozent Gebühren bereits 50 Euro pro Jahr, die dem investierten Kapital fehlen.',
  'Dieser laufende Abzug verkleinert nicht nur dein heutiges Kapital, sondern auch den Betrag, der in den folgenden Jahren Rendite erwirtschaften könnte.',
  'Die wirtschaftliche Wirkung ist deshalb größer als der einzelne Jahresbetrag, weil jeder frühe Abzug weniger Kapital für spätere Jahre übrig lässt.',
  'Mit zunehmender Laufzeit wandern zwei anfangs ähnliche Ergebnisse auseinander, obwohl Sparrate und Marktentwicklung in beiden Fällen gleich bleiben.',
  'Bei einer monatlichen Sparrate wirkt der Unterschied zunächst klein, wird aber mit jeder weiteren Einzahlung und jedem weiteren Jahr sichtbarer.',
  'Vergleichst du Kostenquote, Sparrate und Laufzeit vor dem Kauf gemeinsam, kannst du den langfristigen Gebühreneffekt deutlich besser einschätzen.',
  'Der wichtigste Punkt ist deshalb nicht nur die einzelne Gebühr: Laufende Kosten reduzieren jedes Jahr Kapital und mögliche zukünftige Rendite.',
];

const contentById = {
  'scene-01-hook': {kicker: 'ETF-KOSTEN', headline: 'Kleine Kosten, lange Wirkung', icon: 'wallet'},
  'scene-02-mechanism-a': {kicker: 'DER ABZUG', headline: 'Geld verlässt den Sparbetrag', icon: 'document'},
  'scene-03-intermediate-result': {kicker: 'DIE ZAHL', headline: '50 Euro fehlen jedes Jahr', icon: 'coins', primaryNumber: '50 €', secondaryNumber: 'bei 10.000 €'},
  'scene-04-mechanism-b': {kicker: 'ZWEITER EFFEKT', headline: 'Weniger Kapital wächst weiter', icon: 'bank'},
  'scene-05-meaning': {kicker: 'DIE BEDEUTUNG', headline: 'Ein Abzug wirkt länger nach', icon: 'target'},
  'scene-06-mechanism-c': {kicker: 'ÜBER DIE ZEIT', headline: 'Der Abstand wird größer', icon: 'calculator'},
  'scene-07-example-or-consequence': {kicker: 'IM SPARPLAN', headline: 'Kleine Unterschiede sammeln sich', icon: 'cart'},
  'scene-08-solution': {kicker: 'VOR DEM KAUF', headline: 'Drei Werte gemeinsam prüfen', icon: 'shield'},
  'scene-09-payoff': {kicker: 'MERKSATZ', headline: 'Laufende Kosten wirken mit', icon: 'idea', body: 'Kostenquote und Laufzeit gemeinsam vergleichen'},
};

const imageDetails = {
  'scene-01-hook': {
    imagePrompt: 'A coherent realistic home-office process scene about ETF fees. START STATE: one complete monthly savings transfer leaves a wallet on the left. PROCESS PATH: the transfer moves through a smartphone ETF purchase in the center while a small red fee receipt visibly diverts part of it. RESULT STATE: a slightly smaller investment confirmation reaches the right side. Large concrete objects, immediate left-to-right causality, natural euro colors, refined charcoal grade, restrained green accents, no dashboard, no tiny labels, no decorative person standing beside a finance object.',
    processImage: {
      startState: 'Eine vollständige monatliche Sparrate liegt sichtbar im Portemonnaie bereit.',
      processPath: 'Der Betrag läuft durch den ETF-Kauf, während ein kleiner Gebührenanteil sichtbar abzweigt.',
      resultState: 'Ein etwas kleinerer Anlagebetrag erreicht das Depot.',
      instantReadabilitySeconds: 1,
      decorativeOnly: false,
    },
  },
  'scene-03-intermediate-result': {
    imagePrompt: 'A coherent accountant-desk process image. START STATE: a printed investment statement clearly represents 10,000 euros on the left. PROCESS PATH: a physical calculator in the center applies a 0.5 percent fee and directs one separate cost amount toward the right. RESULT STATE: one realistic fifty-euro banknote is visibly separated from the invested value. Large objects, clear calculation path, natural colors, no dashboard, no tiny labels, no decorative figure.',
    processImage: {
      startState: 'Ein Kontoauszug zeigt ein Anlagevermögen von 10.000 Euro.',
      processPath: 'Ein physischer Rechner verbindet den Ausgangsbetrag sichtbar mit der Gebührenquote.',
      resultState: 'Ein 50-Euro-Betrag liegt klar getrennt als jährlicher Kostenabzug daneben.',
      instantReadabilitySeconds: 1,
      decorativeOnly: false,
    },
  },
  'scene-05-meaning': {
    imagePrompt: 'A coherent financial meaning process image in one analyst office. START STATE: two equal rows of investment growth blocks begin together on the left. PROCESS PATH: a red fee marker removes one early block from the lower row in the center. RESULT STATE: the fee-affected row ends visibly shorter on the right, showing less capital available for future growth. Large physical objects, clear cause and result, no dashboard, no miniature transparent box, no tiny labels.',
    processImage: {
      startState: 'Zwei gleich große Kapitalreihen beginnen mit demselben Ausgangswert.',
      processPath: 'Aus einer Reihe wird früh ein Gebührenbaustein entfernt.',
      resultState: 'Die betroffene Kapitalreihe endet sichtbar kürzer und besitzt weniger Wachstumsbasis.',
      instantReadabilitySeconds: 1,
      decorativeOnly: false,
    },
  },
  'scene-07-example-or-consequence': {
    imagePrompt: 'A coherent kitchen-table savings process image. START STATE: a monthly savings envelope and equal euro coins are visible on the left. PROCESS PATH: several coins move along one clear route, while a small red fee envelope takes one coin in the center. RESULT STATE: the smaller remaining coin group reaches an investment note on the right. Real-world setting, large objects, immediate cause and consequence, no dashboard, no tiny labels, no decorative person.',
    processImage: {
      startState: 'Eine monatliche Sparrate liegt als Münzgruppe in einem Umschlag bereit.',
      processPath: 'Ein kleiner Teil wandert vor der Anlage sichtbar in einen Gebührenumschlag.',
      resultState: 'Eine kleinere Münzgruppe erreicht den Anlagehinweis.',
      instantReadabilitySeconds: 1,
      decorativeOnly: false,
    },
  },
  'scene-09-payoff': {
    imagePrompt: 'A coherent final answer process image. START STATE: one monthly contribution begins on the left. PROCESS PATH: a compact visible route passes recurring fee deductions and several time markers through the center. RESULT STATE: two final investment outcomes stand on the right, with the lower-cost result visibly larger. Large simple objects, clear final answer, refined finance style, no dashboard, no tiny labels, no repeated transparent miniature box.',
    processImage: {
      startState: 'Eine identische Sparrate startet für zwei vergleichbare Anlagen.',
      processPath: 'Wiederkehrende Gebühren und Zeitmarker verbinden den Start mit den beiden Endergebnissen.',
      resultState: 'Das Ergebnis mit den niedrigeren laufenden Kosten ist sichtbar größer.',
      instantReadabilitySeconds: 1,
      decorativeOnly: false,
    },
  },
};

const animationDetails = {
  'scene-02-mechanism-a': {
    componentName: 'FixtureFeeDeductionAnimation',
    narrativeAction: 'Eine vollständige Sparraten-Kapsel fährt vom Konto zur ETF-Order; eine kleine Gebührenkapsel wird an einer Kostenweiche abgetrennt und nur der Rest erreicht das Depot.',
    startState: 'Die vollständige Sparrate wartet als geschlossene Kapsel vor der Kostenweiche.',
    endState: 'Der reduzierte Anlagebetrag liegt im Depot und der Gebührenbetrag ist getrennt verbucht.',
    camera: 'Die Kamera verfolgt die Sparraten-Kapsel seitlich von der Quelle bis zum Depot.',
    requiredElements: ['Sparraten-Kapsel', 'Kostenweiche', 'Gebührenkapsel', 'Depot'],
    forbiddenPatterns: ['dashboard card', 'bar chart as the only action', 'counter as the only action'],
  },
  'scene-04-mechanism-b': {
    componentName: 'FixtureLostGrowthBaseAnimation',
    narrativeAction: 'Ein früher Kapitalbaustein wird aus einer Wachstumsstrecke entfernt; alle späteren Wachstumsbausteine bauen sichtbar auf der kleineren Basis auf.',
    startState: 'Zwei gleich hohe Kapitalreihen stehen vor derselben Wachstumsstrecke.',
    endState: 'Die Gebührenreihe endet mit weniger Grundkapital und weniger aufgebauten Wachstumsbausteinen.',
    camera: 'Die Kamera fährt entlang beider Reihen und hebt den entfernten frühen Baustein hervor.',
    requiredElements: ['zwei Kapitalreihen', 'entfernter Gebührenbaustein', 'spätere Wachstumsbausteine'],
    forbiddenPatterns: ['same layout as scene-02-mechanism-a', 'dashboard card', 'static comparison'],
  },
  'scene-06-mechanism-c': {
    componentName: 'FixtureLongTermGapAnimation',
    narrativeAction: 'Zwei gleich gestartete Wertpfade passieren nacheinander mehrere Jahresstationen; an jeder Station verliert ein Pfad einen kleinen Kostenanteil und der Abstand wächst.',
    startState: 'Beide Wertpfade beginnen an derselben Startmarke mit demselben Kapital.',
    endState: 'Nach der letzten Jahresstation liegt zwischen beiden Ergebnissen ein deutlich sichtbarer Abstand.',
    camera: 'Eine Vorwärtsfahrt begleitet beide Pfade durch die Jahresstationen bis zum Endvergleich.',
    requiredElements: ['zwei Wertpfade', 'mehrere Jahresstationen', 'wiederkehrende Kostenabzweige'],
    forbiddenPatterns: ['same layout as another animation', 'dashboard card', 'counter as the only action'],
  },
  'scene-08-solution': {
    componentName: 'FixtureCostComparisonAnimation',
    narrativeAction: 'Drei Prüfobjekte für Kostenquote, Sparrate und Laufzeit fahren in eine gemeinsame Vergleichsschleuse und erzeugen zwei direkt vergleichbare Ergebniswege.',
    startState: 'Kostenquote, Sparrate und Laufzeit liegen als drei getrennte Prüfobjekte bereit.',
    endState: 'Zwei Angebote sind mit denselben Annahmen geprüft und ihre langfristigen Ergebnisse klar vergleichbar.',
    camera: 'Die Kamera zieht von den drei Eingaben durch die Vergleichsschleuse zu den beiden Ergebnissen.',
    requiredElements: ['Kostenquote', 'Sparrate', 'Laufzeit', 'Vergleichsschleuse', 'zwei Ergebnisse'],
    forbiddenPatterns: ['same layout as another animation', 'dashboard card', 'static comparison'],
  },
};

export const createFinanceTestPlan = ({slug = 'finance-test-plan', title = 'ETF-Gebühren über 30 Jahre', topic = 'ETF-Gebühren'} = {}) => {
  const plan = createFinanceScenePlanTemplate({slug, title, topic});
  plan.centralQuestion = 'Was kosten 0,5 Prozent mehr ETF-Gebühren über 30 Jahre?';
  plan.payoff = 'Kleine laufende Gebühren reduzieren jedes Jahr Kapital und mögliche zukünftige Rendite.';
  plan.sources = [];
  plan.scenes = plan.scenes.map((scene, index) => ({
    ...scene,
    voiceText: voiceTexts[index],
    content: {...scene.content, ...contentById[scene.id]},
    ...(imageDetails[scene.id] ?? {}),
    ...(animationDetails[scene.id] ? {animation: animationDetails[scene.id]} : {}),
  }));
  plan.scriptText = plan.scenes.map((scene) => scene.voiceText).join(' ');
  return ScenePlan.parse(plan);
};
