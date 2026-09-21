// Verbindlicher Google-Flow-Vertrag — eine Quelle für alle Reels.
//
// V3 behebt einen echten Produktionsfehler: Ein Agent interpretierte den alten
// "autonomen Gesamtdurchlauf" trotz "GENAU EIN Bild" als Batch-Auftrag und
// startete mehrere Bilder auf einmal. Deshalb ist Autonomie jetzt ausdrücklich
// eine STATE MACHINE mit maximal EINEM laufenden Generierungsjob.
//
// V4 hat einen zweiten realen Fehler erzeugt: Der Style-Anker wurde als
// Bildvorlage mitgegeben, nicht als Stilreferenz. Flow hat daraufhin die ganze
// Szene geklont — jedes Bild zeigte denselben Tisch, dieselbe Tasse, denselben
// Kamerawinkel. Deshalb trennt der Vertrag jetzt hart zwischen Look (kommt vom
// Anker) und Szene (kommt ausschliesslich aus dem Einzelprompt).

import {
  FLOW_AGENT_PROTOCOL_MARKER,
  FLOW_EXECUTION_MODE_ID,
  FLOW_EXECUTION_MODE_MARKER,
  FLOW_STATE_MACHINE_ID,
  FLOW_STATE_MACHINE_MARKER,
  FLOW_STRUCTURE_LOCK_ID,
  FLOW_STRUCTURE_LOCK_MARKER,
  FLOW_BLOCK_SIZE,
  SCENE_VARIANCE_LOCK_ID,
  SCENE_VARIANCE_LOCK_MARKER,
} from './reel-contract.mjs';

/** Kopfblock: Szene 01 als Style-Anker, danach Bloecke zu hoechstens fuenf. */
export const AUTONOMY_BLOCK = [
  FLOW_EXECUTION_MODE_MARKER,
  FLOW_STRUCTURE_LOCK_MARKER,
  FLOW_STATE_MACHINE_MARKER,
  SCENE_VARIANCE_LOCK_MARKER,
  '',
  'STYLE-ANKER STATE MACHINE — VERBINDLICH',
  '- SZENE 01 IST DER STYLE-ANKER DES GESAMTEN REELS UND WIRD IMMER ZUERST UND IMMER ALLEIN ERZEUGT.',
  '- SOLANGE DER ANKER DIE QA NICHT BESTANDEN HAT, IST JEDER WEITERE BILDBLOCK GESPERRT.',
  '- BESTEHT DER ANKER DIE QA NICHT, WIRD AUSSCHLIESSLICH DIESELBE BILDNUMMER NEU ERZEUGT.',
  '- NACH BESTANDENER ANKER-QA LAUFEN DIE RESTLICHEN BILDER IN BLOECKEN VON HOECHSTENS 5 BILDERN.',
  '- JEDES BILD IN JEDEM BLOCK MUSS DEN STYLE-ANKER ALS REFERENZ MITGEBEN. DAS IST PFLICHT.',
  '- DER ANKER IST EINE STILREFERENZ UND KEINE BILDVORLAGE.',
  '- DER ANKER BESTIMMT NUR: HINTERGRUNDSCHWAERZE, LICHTFUEHRUNG, MATERIALWIRKUNG, FIGURENSTIL UND FARBTEMPERATUR.',
  '- DER ANKER BESTIMMT NIEMALS: SCHAUPLATZ, MOEBEL, KAMERAWINKEL, BILDAUFBAU, REQUISITEN ODER OBJEKTANORDNUNG.',
  '- KOPIERE NIEMALS DIE KOMPOSITION DES ANKERS. JEDES BILD IST EINE EIGENE SZENE.',
  '- DIE BILDAUSSAGE KOMMT AUS DEM EINZELPROMPT, DER LOOK KOMMT VOM ANKER.',
  '- ERZEUGE KEINE GALERIE, KEINEN KONTAKTBOGEN, KEIN MULTI-PANEL, KEINE COLLAGE UND KEIN BILD MIT MEHREREN SZENEN.',
  '- JEDES BILD WIRD EINZELN ZURUECKGEGEBEN, EINZELN UMBENANNT UND EINZELN GEPRUEFT.',
  '- EIN DURCHGEFALLENES BILD WIRD EINZELN MIT DEMSELBEN ANKER NEU ERZEUGT; DER BLOCK GILT ERST DANN ALS FERTIG.',
  '- EIN NEUER BLOCK STARTET ERST, WENN DER VORIGE BLOCK VOLLSTAENDIG PASS IST.',
  '- REMOTION-/ANIMATIONS-/DATENNUMMERN WERDEN OHNE GENERIERUNG UEBERSPRUNGEN.',
  '- WARTE NIEMALS AUF "WEITER", "MACH WEITER", "OKAY", BESTAETIGUNG ODER FREIGABE DES NUTZERS.',
  '- KEINE REFERENZ AUF IRGENDEIN ANDERES BILD ALS DEN ANKER.',
  '- STRUKTUR, DATEINAMENLOGIK, V9-BILDWELT, FARBROLLEN, LICHT UND QA BIS ZUM LETZTEN BILD UNVERAENDERT BEIBEHALTEN.',
  '- STOPP NUR BEI EINEM ECHTEN TECHNISCHEN HARD-BLOCKER. KEIN NUTZER-ZWISCHENSTOPP.',
  '',
  'SZENENVARIANZ — VERBINDLICH',
  '- GLEICHE WELT HEISST GLEICHER LOOK. GLEICHE WELT HEISST NICHT GLEICHER TISCH UND NICHT DIESELBE REQUISITE IN JEDEM BILD.',
  '- JEDES BILD ZEIGT EINE SICHTBAR ANDERE SITUATION ALS DAS BILD DAVOR UND ALS DER ANKER.',
  '- SCHAUPLATZ, KAMERAABSTAND UND BLICKWINKEL WECHSELN, SOBALD DER SPRECHBEAT ES ZULAESST.',
  '- EINE REQUISITE DARF NUR WIEDERKEHREN, WENN GENAU SIE DEN SPRECHBEAT ERKLAERT. DEKO WIEDERHOLT SICH NIE.',
  '- VARIANZ-QA JE BILD: WIRKT DAS BILD WIE EINE ZWEITE AUFNAHME DES ANKERS ODER DES VORIGEN BILDES, IST ES FAIL.',
  '- FAELLT DIESELBE BILDNUMMER ZWEIMAL DURCH DIE VARIANZ-QA, WIRD SIE OHNE ANKER-REFERENZ NUR MIT DEM GESCHRIEBENEN V9-LOCK NEU ERZEUGT.',
  '- LIEBER EINE NEUE, UEBERRASCHENDE UND UNTERHALTSAME SITUATION ALS EINE SICHERE WIEDERHOLUNG DER VORIGEN.',
  '',
].join('\n');

/** Schrittfolge für den Agenten. */
export const FLOW_AGENT_BLOCK = [
  FLOW_AGENT_PROTOCOL_MARKER,
  '',
  'AUSFUEHRUNGSPROTOKOLL — STYLE-ANKER, DANN BLOECKE ZU 5:',
  '0. Betrachte alle Bildbloecke zunaechst als GESPERRTE DATEN. Nur der Anker ist freigeschaltet.',
  '1. ANKER: Nimm ausschliesslich den Bildprompt von SZENE 01. Starte genau einen Bildjob.',
  '2. Warte vollstaendig auf das Ergebnis. Benenne die Datei sofort exakt um.',
  '3. Pruefe den Anker: Aussage, erlaubte Labels, stylized-3D-animated V9-Look, tiefschwarzer sauberer Hintergrund, sichtbares Gesicht falls Person, exakter Dateiname.',
  '4. QA FEHLER am Anker: erzeuge ausschliesslich dieselbe Bildnummer neu. Alles andere bleibt gesperrt.',
  '5. QA BESTANDEN: Der Anker ist ab jetzt die verbindliche STILREFERENZ fuer JEDES weitere Bild dieses Reels — nicht die Bildvorlage.',
  '6. BLOCK: Nimm die naechsten hoechstens 5 benoetigten Bildnummern in Dokumentreihenfolge.',
  '7. Starte fuer jedes Bild des Blocks einen eigenen Bildjob und gib dabei IMMER den Anker als Stilreferenz mit. Sage dem Generator ausdruecklich: uebernimm Licht, Material, Schwaerze und Figurenstil, uebernimm NICHT Schauplatz, Kamerawinkel, Moebel oder Requisiten.',
  '8. Benenne jedes zurueckgegebene Bild sofort exakt um.',
  '9. Pruefe jedes Bild einzeln: normale V9-QA PLUS Anker-Abgleich (Hintergrundschwaerze, Lichtrichtung, Materialwirkung, Figurenstil, Farbtemperatur).',
  '9b. Pruefe zusaetzlich die VARIANZ: anderer Schauplatz oder anderer Blickwinkel als beim Anker und beim vorigen Bild, keine wiederholte Deko-Requisite. Sieht es aus wie dieselbe Szene noch einmal, ist es FAIL.',
  '10. Durchgefallene Bilder einzeln mit demselben Anker neu erzeugen. Der Block ist erst fertig, wenn alle Bilder PASS sind.',
  '10b. Faellt dieselbe Bildnummer zweimal an der Varianz durch, erzeuge sie ohne Anker-Referenz nur mit dem geschriebenen V9-Lock neu.',
  '11. Erst dann den naechsten Block starten. Keine Nutzerfreigabe dazwischen.',
  '12. Bei "KEIN BILD XX ERZEUGEN" die Nummer ohne Bildjob ueberspringen.',
  '13. Erst NACH Abschluss aller Bloecke eine Abschlusszusammenfassung ueber alle finalen Dateien geben.',
  '',
  'HART VERBOTEN:',
  '- einen Block starten, bevor der Anker die QA bestanden hat',
  '- mehr als 5 Bilder in einem Block',
  '- mehrere Bildprompts zu einem Generierungsaufruf zusammenfassen',
  '- Referenz auf irgendein anderes Bild als den Anker',
  '- die Komposition, den Schauplatz, den Kamerawinkel oder die Requisiten des Ankers in ein weiteres Bild uebernehmen',
  '- dieselbe Szenerie in mehreren Bildern wiederholen, ohne dass der Sprechbeat genau diese Wiedererkennung verlangt',
  '- Kontaktbogen / Galerie / Collage / Multi-Panel als Ersatz fuer Einzelbilder',
  '- alle Bilder zuerst erzeugen und erst danach gesammelt umbenennen',
  '',
].join('\n');

/**
 * Kanonischer Anker-Hinweis, der ab scene-02 in jedem Bildblock steht.
 * Die alte Fassung nannte nur, was vom Anker kommt. Was NICHT vom Anker kommt,
 * stand nirgends — genau deshalb hat Flow die ganze Szene mitkopiert.
 */
export const STYLE_ANCHOR_NOTE = [
  'Der Anker ist NUR Stilreferenz.',
  'Vom Anker kommen Hintergrundschwaerze, Lichtrichtung, Materialwirkung,',
  'Figurenstil und Farbtemperatur.',
  'Vom Anker kommen NICHT Schauplatz, Kamerawinkel, Moebel und Requisiten.',
  'Szene, Blickwinkel und Objekte kommen ausschliesslich aus dem Prompt unten und',
  'muessen sich vom Anker und vom vorigen Bild sichtbar unterscheiden.',
].join('\n');

/** Alte Fassungen des Anker-Hinweises, die auf STYLE_ANCHOR_NOTE gehoben werden. */
export const LEGACY_STYLE_ANCHOR_NOTES = [
  [
    'Dieses Bild MUSS den Style-Anker als Referenz mitbekommen. Hintergrundschwaerze,',
    'Lichtrichtung, Materialwirkung, Figurenstil und Farbtemperatur kommen vom Anker.',
    'Nur die Bildaussage kommt aus dem Prompt unten.',
  ].join('\n'),
];

/** googleFlow-Felder im scene-index. */
export const flowAutonomyFields = () => ({
  executionModeId: FLOW_EXECUTION_MODE_ID,
  stateMachineId: FLOW_STATE_MACHINE_ID,
  autonomousFullRun: true,
  styleAnchorSceneId: 'scene-01',
  styleAnchorRequiredForEveryImage: true,
  styleAnchorMustPassQaBeforeBlocks: true,
  maxImagesPerBlock: FLOW_BLOCK_SIZE,
  referenceAnyOtherImageForbidden: true,
  anchorMatchQaRequired: true,
  styleAnchorTransfersStyleOnly: true,
  styleAnchorCompositionCopyForbidden: true,
  sceneVarianceLockId: SCENE_VARIANCE_LOCK_ID,
  sceneVarianceQaRequired: true,
  repeatedSetDressingForbidden: true,
  anchorFallbackWithoutReferenceAfterVarianceFail: true,
  multiImageRequestForbidden: true,
  queueLaterImagesForbidden: true,
  galleryOrContactSheetForbidden: true,
  currentStepGateRequired: true,
  nextStepLockedUntilCurrentResultReturned: true,
  renameBeforeUnlockNext: true,
  qaBeforeUnlockNext: true,
  userContinueSignalForbidden: true,
  userApprovalBetweenImagesForbidden: true,
  internalWaitForGenerationOnly: true,
  autoContinueAfterQa: true,
  hardBlockerOnlyStop: true,
  structureLockId: FLOW_STRUCTURE_LOCK_ID,
  preserveStructureThroughLastImage: true,
  preserveStyleThroughLastImage: true,
});

/** Bestandsreels sprachlich auf V3 heben. */
export const modernizeLegacyWaitWording = (master) => master
  .replaceAll('AUTONOMER GESAMTDURCHLAUF — VERBINDLICH', 'STRICT SINGLE-JOB STATE MACHINE — VERBINDLICH')
  .replaceAll('1. Lies die gesamte Datei einmal, arbeite danach strikt von oben nach unten immer nur am aktuellen Bildblock.', '0. Betrachte spätere Bildblöcke zunächst nur als GESPERRTE DATEN. Sie sind noch KEINE ausführbaren Bildaufträge.')
  .replaceAll('2. Erzeuge GENAU EIN Bild. Starte niemals mehrere Bilder gleichzeitig.', '1. Setze ACTIVE_STEP auf den ersten benötigten Bildblock und starte GENAU EINEN Bildjob. MAX_CONCURRENT_GENERATIONS = 1.')
  .replaceAll('3. Vollständig warten.', '2. INTERN auf die Rückgabe dieses einzelnen Bildjobs warten; keinen weiteren Job starten.')
  .replaceAll('3. Warte, bis dieses eine Bild vollständig erzeugt ist.', '2. INTERN auf die Rückgabe dieses einzelnen Bildjobs warten; keinen weiteren Job starten.')
  .replaceAll('7. Erst nach bestandener QA das nächste Bild.', '7. Erst nach bestandener QA den nächsten Bildblock freischalten; vorher bleibt er gesperrt.')
  .replaceAll('7. Erst nach bestandener QA darf der nächste Bildblock beginnen.', '7. Erst nach bestandener QA den nächsten Bildblock freischalten; vorher bleibt er gesperrt.');
