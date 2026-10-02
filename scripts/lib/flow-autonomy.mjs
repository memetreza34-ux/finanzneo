// Verbindlicher Google-Flow-Vertrag — eine Quelle für alle Reels.
//
// Ablauf: 3 Cover-Kandidaten nacheinander -> Nutzer wählt A/B/C -> gewähltes
// Cover wird finaler Cover-/Scene-01-Asset und einziger Style-Anker -> danach
// alle übrigen Bilder in organisatorischen 5er-Blöcken, technisch weiterhin
// exakt ein Bildjob zur Zeit -> sofort Rename + QA -> finaler Datei-Audit.

import {
  FLOW_AGENT_PROTOCOL_MARKER,
  FLOW_COVER_WORKFLOW_ID,
  FLOW_COVER_WORKFLOW_MARKER,
  FLOW_EXECUTION_MODE_ID,
  FLOW_EXECUTION_MODE_MARKER,
  FLOW_IMAGE_BLOCK_SIZE,
  FLOW_IMAGE_BLOCK_SIZE_MARKER,
  FLOW_STATE_MACHINE_ID,
  FLOW_STATE_MACHINE_MARKER,
  FLOW_STRUCTURE_LOCK_ID,
  FLOW_STRUCTURE_LOCK_MARKER,
} from './reel-contract.mjs';

/** Kopfblock: nur Cover-Auswahl braucht Nutzerinput; danach autonom. */
export const AUTONOMY_BLOCK = [
  FLOW_EXECUTION_MODE_MARKER,
  FLOW_STRUCTURE_LOCK_MARKER,
  FLOW_STATE_MACHINE_MARKER,
  FLOW_COVER_WORKFLOW_MARKER,
  FLOW_IMAGE_BLOCK_SIZE_MARKER,
  '',
  'COVER = SZENE 01',
  'KEIN separates Cover erzeugen. Die drei Cover-Kandidaten sind nur die Auswahlphase für dasselbe finale Scene-01-/Cover-Asset.',
  'KEIN Bild 00 erzeugen.',
  '',
  'STRICT SINGLE-JOB STATE MACHINE — VERBINDLICH',
  '- DIES IST KEIN BATCH-AUFTRAG. DIE GESAMTE DATEI DARF NIEMALS ALS EIN MEHRBILD-PROMPT AUSGEFÜHRT WERDEN.',
  '- MAXIMAL 1 LAUFENDER BILDGENERIERUNGSJOB GLEICHZEITIG. CONCURRENCY = 1.',
  '- PHASE 0 IST DAS COVER-GATE: COVER A, B UND C NACHEINANDER ERZEUGEN; JEDES COVER MUSS SICHTBAREN, LESBAREN TEXT ENTHALTEN.',
  '- NACH DEN DREI COVER-KANDIDATEN STOPPEN UND NUR AUF DIE AUSWAHL A/B/C DES NUTZERS WARTEN. DIES IST DIE EINZIGE NUTZERFREIGABE IM FLOW.',
  '- DAS GEWÄHLTE COVER WIRD FINALER COVER-ASSET UND SZENE 01. NICHT NOCH EINMAL SEPARAT ALS SZENE 01 GENERIEREN.',
  '- DAS GEWÄHLTE COVER IST DIE EINZIGE VISUELLE STYLE-REFERENZ FÜR ALLE WEITEREN FLOW-BILDER.',
  '- VON DER STYLE-REFERENZ NUR MATERIALGEFÜHL, 3D-FORMSPRACHE, LICHT, KONTRAST, FARBCHARAKTER UND KAMERAGEFÜHL ÜBERNEHMEN. TEXT, LAYOUT, OBJEKTANORDNUNG UND SZENENINHALT NICHT KOPIEREN.',
  '- NACH DER COVER-WAHL WERDEN DIE ÜBRIGEN BILDER IN ORGANISATORISCHEN 5ER-BLÖCKEN ABGEARBEITET. EIN 5ER-BLOCK IST NIEMALS EIN 5-BILD-BATCH.',
  '- INNERHALB JEDES 5ER-BLOCKS UND ZWISCHEN DEN BLÖCKEN GILT WEITERHIN CONCURRENCY = 1.',
  '- JEDES BILD MUSS NACH DER RÜCKGABE SOFORT EXAKT UMBENANNT, IN DEN FINALEN BILDORDNER GELEGT UND PER QA GEPRÜFT WERDEN.',
  '- WENN DAS AKTUELLE BILD DIE QA NICHT BESTEHT, BLEIBT DER NÄCHSTE SCHRITT GESPERRT. ERZEUGE NUR DIESELBE BILDNUMMER NEU.',
  '- NACH BESTANDENER QA WIRD GENAU DAS NÄCHSTE BILD FREIGESCHALTET. NACH FÜNF BESTANDENEN BILDERN BEGINNT DER NÄCHSTE 5ER-BLOCK AUTOMATISCH.',
  '- REMOTION-/ANIMATIONSNUMMERN WERDEN OHNE BILDGENERIERUNG ÜBERSPRUNGEN UND BLEIBEN ALS SZENENNUMMERN RESERVIERT.',
  '- NACH DER COVER-WAHL: WARTE NIEMALS AUF "WEITER", "MACH WEITER", "OKAY" ODER EINE WEITERE NUTZERFREIGABE.',
  '- "WARTEN" BEDEUTET DANACH NUR: INTERN AUF DIE RÜCKGABE DES AKTUELLEN EINZELNEN BILDJOBS WARTEN.',
  '- KEINE SPÄTEREN BILDER VORPLANEN, QUEUEN, PARALLEL STARTEN ODER VORAB GENERIEREN.',
  '- NACH DEM LETZTEN BILD IST EIN FINALER INVENTORY-QA PFLICHT: VOLLSTÄNDIGKEIT, EXAKTE DATEINAMEN, KEINE DOPPELTEN DATEIEN, KEINE FEHLENDEN BILDER, KEINE ANIMATIONSNUMMERN ALS FLOW-BILD.',
  '- ALLE FINALEN FLOW-BILDER MÜSSEN AM ENDE GEMEINSAM IM EINEN FINALEN BILDORDNER LIEGEN. COVER-KANDIDATEN A/B/C SIND NUR TEMPORÄR; NUR DAS GEWÄHLTE COVER WIRD FINAL ÜBERNOMMEN.',
  '- STRUKTUR, DATEINAMENLOGIK, V9-BILDWELT, FARBROLLEN, LICHT UND QA BIS ZUM LETZTEN BILD UNVERÄNDERT BEIBEHALTEN.',
  '- STOPP NACH DER COVER-AUSWAHL NUR NOCH BEI EINEM ECHTEN TECHNISCHEN HARD-BLOCKER.',
  '',
].join('\n');

/** Schrittfolge für den Agenten. */
export const FLOW_AGENT_BLOCK = [
  FLOW_AGENT_PROTOCOL_MARKER,
  '',
  'AUSFÜHRUNGSPROTOKOLL — COVER-GATE + 5ER-BLÖCKE + SINGLE JOB:',
  '0. COVER-PHASE: Erzeuge Cover A, dann B, dann C — strikt nacheinander, jeweils als einzelner Job und jeweils mit sichtbarem Cover-Text.',
  '1. Prüfe jeden Cover-Kandidaten direkt nach Rückgabe auf Lesbarkeit, V9-Bildwelt und klare Abgrenzung zu den anderen Varianten.',
  '2. Sobald A, B und C vorhanden sind: STOPP. Zeige die drei Kandidaten und fordere ausschließlich die Auswahl A/B/C an.',
  '3. Gewählte Variante: sofort auf den finalen Scene-01-/Cover-Dateinamen umbenennen und in den finalen Bildordner legen. Ungewählte Kandidaten bleiben außerhalb des finalen Bildordners oder werden verworfen.',
  '4. Setze das gewählte Cover als EINZIGE Style-Referenz. Übernimm nur Material, 3D-Formensprache, Licht, Kontrast, Farbcharakter und Kameragefühl; kopiere niemals Cover-Text, Layout, Objektpositionen oder konkrete Szene.',
  '5. Scene 01 gilt damit als DONE. Sie darf nicht erneut generiert werden.',
  `6. Teile alle übrigen IMAGE-Szenen in Reihenfolge in Blöcke mit maximal ${FLOW_IMAGE_BLOCK_SIZE} Bildern. Animationsszenen zählen nicht als Bild und bleiben reserviert.`,
  '7. Setze ACTIVE_STEP auf das erste Bild des aktuellen Blocks. Sende ausschließlich dessen BILDPROMPT an die Bildgenerierung.',
  '8. Starte GENAU EINEN Bildgenerierungsjob. MAX_CONCURRENT_GENERATIONS = 1.',
  '9. Warte intern auf genau dieses Ergebnis. Kein weiterer Bildjob darf vorher starten.',
  '10. Nach Rückgabe: Datei SOFORT exakt auf den vorgesehenen finalen Dateinamen umbenennen und in den einen finalen Bildordner legen.',
  '11. Danach QA nur für dieses Bild: Aussage/Beat-Zuordnung, erlaubte Labels, V9-Stil, Style-Konsistenz zum gewählten Cover, tiefschwarzer Hintergrund, Datenintegrität falls Chart/Diagramm und exakter Dateiname.',
  '12. QA FEHLER: ACTIVE_STEP bleibt gleich. Ausschließlich dieselbe Bildnummer neu erzeugen.',
  '13. QA BESTANDEN: ACTIVE_STEP = DONE. Erst jetzt das nächste Bild des Blocks freischalten.',
  '14. Nach maximal fünf DONE-Bildern ist der Block abgeschlossen. Den nächsten Block automatisch beginnen — keine Nutzerfreigabe und kein "weiter".',
  '15. Wiederhole 7–14, bis alle erwarteten IMAGE-Szenen DONE sind.',
  '16. FINAL INVENTORY QA: erwartete Dateiliste gegen finalen Ordner prüfen. Fehlend, falsch benannt oder doppelt = FAIL. Korrekte Bilder nicht neu erzeugen.',
  '17. Abschluss nur bei PASS: alle erwarteten finalen Bilder liegen exakt benannt gemeinsam im finalen Bildordner; keine temporären Cover-Kandidaten und keine Animationsnummern zählen als finale Flow-Bilder.',
  '',
  'HART VERBOTEN:',
  '- mehrere Bilder in einem Generierungsaufruf',
  '- mehrere Bildprompts zusammenfassen',
  '- Bilder vorab in eine Queue stellen',
  '- alle Bilder zuerst erzeugen und erst danach gesammelt umbenennen',
  '- fünf Bilder eines 5er-Blocks gleichzeitig starten',
  '- Kontaktbogen / Galerie / Collage / Multi-Panel als Ersatz für Einzelbilder',
  '- nach der Cover-Auswahl erneut auf Nutzer-"weiter" oder Zwischenfreigabe warten',
  '- ein späteres Szenenbild als neue Style-Referenz verwenden',
  '',
].join('\n');

/** googleFlow-Felder im scene-index. */
export const flowAutonomyFields = () => ({
  executionModeId: FLOW_EXECUTION_MODE_ID,
  stateMachineId: FLOW_STATE_MACHINE_ID,
  coverFivePackWorkflowId: FLOW_COVER_WORKFLOW_ID,
  autonomousFullRun: false,
  autonomousAfterCoverSelection: true,
  maxConcurrentGenerations: 1,
  batchGenerationForbidden: true,
  multiImageRequestForbidden: true,
  queueLaterImagesForbidden: true,
  galleryOrContactSheetForbidden: true,
  currentStepGateRequired: true,
  nextStepLockedUntilCurrentResultReturned: true,
  renameBeforeUnlockNext: true,
  qaBeforeUnlockNext: true,
  coverVariantCount: 3,
  coverTextRequired: true,
  coverSelectionRequiredBeforeSceneImages: true,
  userApprovalOnlyForCoverSelection: true,
  selectedCoverPromotedToFinalCover: true,
  selectedCoverPromotedToScene01: true,
  selectedCoverAsOnlyStyleReference: true,
  laterImagesMayNotBecomeStyleReference: true,
  styleReferenceTextLayoutContentCopyForbidden: true,
  imageBlockSize: FLOW_IMAGE_BLOCK_SIZE,
  blockAutonomousRun: true,
  autoContinueBetweenBlocks: true,
  userContinueSignalForbidden: true,
  userApprovalBetweenImagesForbidden: true,
  userApprovalBetweenBlocksForbidden: true,
  internalWaitForGenerationOnly: true,
  autoContinueAfterQa: true,
  hardBlockerOnlyStop: true,
  immediateRenameRequired: true,
  finalInventoryQaRequired: true,
  finalFileNameQaRequired: true,
  finalSingleDirectoryQaRequired: true,
  structureLockId: FLOW_STRUCTURE_LOCK_ID,
  preserveStructureThroughLastImage: true,
  preserveStyleThroughLastImage: true,
});

/** Bestandsreels sprachlich auf den aktuellen Ablauf heben. */
export const modernizeLegacyWaitWording = (master) => master
  .replaceAll('AUTONOMER GESAMTDURCHLAUF — VERBINDLICH', 'STRICT SINGLE-JOB STATE MACHINE — VERBINDLICH')
  .replaceAll('1. Lies die gesamte Datei einmal, arbeite danach strikt von oben nach unten immer nur am aktuellen Bildblock.', '0. Betrachte spätere Bildblöcke zunächst nur als GESPERRTE DATEN. Sie sind noch KEINE ausführbaren Bildaufträge.')
  .replaceAll('2. Erzeuge GENAU EIN Bild. Starte niemals mehrere Bilder gleichzeitig.', '1. Setze ACTIVE_STEP auf den ersten benötigten Bildblock und starte GENAU EINEN Bildjob. MAX_CONCURRENT_GENERATIONS = 1.')
  .replaceAll('3. Vollständig warten.', '2. INTERN auf die Rückgabe dieses einzelnen Bildjobs warten; keinen weiteren Job starten.')
  .replaceAll('3. Warte, bis dieses eine Bild vollständig erzeugt ist.', '2. INTERN auf die Rückgabe dieses einzelnen Bildjobs warten; keinen weiteren Job starten.')
  .replaceAll('7. Erst nach bestandener QA das nächste Bild.', '7. Erst nach bestandener QA den nächsten Bildblock freischalten; vorher bleibt er gesperrt.')
  .replaceAll('7. Erst nach bestandener QA darf der nächste Bildblock beginnen.', '7. Erst nach bestandener QA den nächsten Bildblock freischalten; vorher bleibt er gesperrt.');
