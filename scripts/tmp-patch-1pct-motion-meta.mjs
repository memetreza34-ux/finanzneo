#!/usr/bin/env node
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root=resolve('reels/2026-09-28_bis_2026-10-04/freitag/reel-01_1-prozent-kosten-test');
const path=resolve(root,'03-szenen/scene-index.json');
const index=JSON.parse(readFileSync(path,'utf8'));

const specs={
  'scene-03':{
    motionDesign:{
      viewerChange:'Der Zuschauer erkennt sichtbar, wie 10.000 Euro Startkapital und wiederkehrende 300-Euro-Raten gemeinsam den Investmentwert aufbauen.',
      visualMode:'physical',
      visualTechniqueId:'envelope-deposit-growth',
      compositionFamilyId:'folder-deposit-stage',
      heroObjectFamily:'investment-folder',
      primaryAction:'Mehrere physische 300-Euro-Umschläge gleiten nacheinander in den Investmentordner und erhöhen den sichtbaren Goldwertstapel.',
      motionSignature:{camera:'static-three-quarter',layout:'single-hero-input-stream',transformation:'deposit-stack-growth'},
      supportTools:[],repetitionJustification:'none'
    },
    direction:{
      spokenPoint:'Du startest mit 10.000 Euro und investierst zusätzlich jeden Monat 300 Euro.',
      viewerMustUnderstand:'Startkapital und monatliche Sparrate fließen in dasselbe Investment und bauen gemeinsam Vermögen auf.',
      visualQuestion:'Wie kommen Startkapital und monatliche Sparrate sichtbar im selben Investment zusammen?',
      chosenMechanism:'Ein Investmentordner startet mit 10.000 Euro; wiederkehrende 300-Euro-Umschläge wandern hinein und lassen den Wertstapel wachsen.',
      mechanismRationale:'Die physische Einzahlungskette übersetzt Startbetrag und regelmäßige Monatsrate direkt in eine verständliche Ursache-Wirkung-Bewegung.',
      implementationDecision:'custom-build',financeMotionId:'none',libraryFitReason:'none',parameterPlan:'none',
      customReason:'Keine vorhandene Library-Mechanik verbindet konkrete Monatsumschläge, Startkapital und denselben wachsenden Investmentordner in dieser Story-Sprache.',
      libraryPromotionCandidate:true
    }
  },
  'scene-07':{
    motionDesign:{
      viewerChange:'Der Zuschauer sieht, dass zwei anfangs gleiche Depots trotz identischer Einzahlungen mit der Zeit immer weiter auseinanderlaufen.',
      visualMode:'data',
      visualTechniqueId:'dual-depot-divergence',
      compositionFamilyId:'side-by-side-growth',
      heroObjectFamily:'twin-depot-vessels',
      primaryAction:'Zwei identische Depotbehälter erhalten gleiche Einzahlungen, während der 7-Prozent-Wertstapel sichtbar schneller wächst als der 6-Prozent-Stapel.',
      motionSignature:{camera:'subtle-push',layout:'dual-column-stage',transformation:'diverging-stack-growth'},
      supportTools:[],repetitionJustification:'none'
    },
    direction:{
      spokenPoint:'Mit jedem weiteren Jahr vergrößert der Zinseszinseffekt den Abstand zwischen 7 Prozent und 6 Prozent Rendite.',
      viewerMustUnderstand:'Gleiche Einzahlungen können durch nur einen Prozentpunkt Renditeunterschied langfristig deutlich verschiedene Vermögensstände erzeugen.',
      visualQuestion:'Wie wird aus einem kleinen Renditeunterschied über Zeit ein sichtbar wachsender Vermögensabstand?',
      chosenMechanism:'Zwei gleich gestartete Depots bekommen dieselben Einzahlungen; ihre Goldstapel wachsen unterschiedlich schnell und öffnen einen immer größeren Gap.',
      mechanismRationale:'Die parallele Bewegung hält Einzahlung und Startbedingungen konstant und isoliert dadurch den einen Renditepunkt als sichtbare Ursache des wachsenden Abstands.',
      implementationDecision:'custom-build',financeMotionId:'none',libraryFitReason:'none',parameterPlan:'none',
      customReason:'Die Library bietet keinen Best-Fit, der gleiche Einzahlungen und eine kontinuierlich divergierende 7-gegen-6-Prozent-Depotentwicklung in derselben V9-Welt zeigt.',
      libraryPromotionCandidate:true
    }
  },
  'scene-11':{
    motionDesign:{
      viewerChange:'Der Zuschauer versteht sichtbar, wo laufende Kosten bei Fonds, Depot und Beratung gesucht und geprüft werden müssen.',
      visualMode:'physical',
      visualTechniqueId:'magnifier-document-scan',
      compositionFamilyId:'document-scan-stage',
      heroObjectFamily:'magnifier-documents',
      primaryAction:'Eine große physische Lupe wandert über Fonds-, Depot- und Beratungsunterlagen und hebt TER, Depotkosten und Servicekosten nacheinander hervor.',
      motionSignature:{camera:'horizontal-follow',layout:'three-document-spread',transformation:'scan-highlight-reveal'},
      supportTools:[],repetitionJustification:'none'
    },
    direction:{
      spokenPoint:'Bei Fonds, Depot und Beratung lohnt es sich, die laufenden Kosten gezielt zu prüfen.',
      viewerMustUnderstand:'Laufende Kosten stehen in konkreten Unterlagen und können als TER, Depotkosten oder Servicekosten identifiziert werden.',
      visualQuestion:'Wo findet man die laufenden Kosten und wie wird das Prüfen als klare Handlung sichtbar?',
      chosenMechanism:'Eine Lupe scannt drei reale Dokumente nacheinander, markiert die relevante Kostenzeile und endet mit einem grünen Prüfhaken.',
      mechanismRationale:'Die bekannte Handlung des Prüfens mit einer Lupe verbindet die drei Kostenarten direkt mit echten Dokumenten und vermeidet abstrakte Dashboard-Symbolik.',
      implementationDecision:'custom-build',financeMotionId:'none',libraryFitReason:'none',parameterPlan:'none',
      customReason:'Keine vorhandene Library-Animation bildet den konkreten Dokumenten-Scan mit TER, Depotkosten und Servicekosten als physische Prüfhandlung passend ab.',
      libraryPromotionCandidate:false
    }
  }
};
for(const scene of index.scenes??[]){
  const spec=specs[scene.id];
  if(!spec) continue;
  scene.motionDesign=spec.motionDesign;
  scene.phase1MotionDirection=spec.direction;
}
writeFileSync(path,JSON.stringify(index,null,2)+'\n','utf8');
console.log('✓ Motion-Director- und Phase-1-Motion-Metadaten für 3 Animationen gesetzt.');
