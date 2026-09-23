// Verbindlicher Google-Flow-Vertrag — eine Quelle für alle Reels.
// V3 bleibt eine Strict-Single-Job-State-Machine. Cover Anchor V1 ergänzt:
// scene-01 wird zuerst allein erzeugt, intern geprüft und danach einmalig vom
// Nutzer ausdrücklich freigegeben. Erst danach laufen alle Folge-Bilder
// autonom in 5er-Arbeitsblöcken weiter; scene-01 bleibt die einzige Referenz.

import {
  FLOW_AGENT_PROTOCOL_MARKER,
  FLOW_EXECUTION_MODE_ID,
  FLOW_EXECUTION_MODE_MARKER,
  FLOW_STATE_MACHINE_ID,
  FLOW_STATE_MACHINE_MARKER,
  FLOW_STRUCTURE_LOCK_ID,
  FLOW_STRUCTURE_LOCK_MARKER,
} from './reel-contract.mjs';
import {COVER_ANCHOR_BLOCK_SIZE, COVER_ANCHOR_FLOW_ID} from './cover-anchor-flow-v1.mjs';

const IMAGE_VISION_QA_ID = 'finanzneo-image-vision-qa-v1';

export const AUTONOMY_BLOCK = [
  FLOW_EXECUTION_MODE_MARKER,
  FLOW_STRUCTURE_LOCK_MARKER,
  FLOW_STATE_MACHINE_MARKER,
  `POST_GENERATION_VISION_QA: ${IMAGE_VISION_QA_ID}`,
  `COVER_ANCHOR_FLOW: ${COVER_ANCHOR_FLOW_ID}`,
  `FOLLOWUP_PLAN_BLOCK_SIZE: ${COVER_ANCHOR_BLOCK_SIZE}`,
  '',
  'STRICT SINGLE-JOB STATE MACHINE — VERBINDLICH',
  '- DIES IST KEIN BATCH-AUFTRAG. MAXIMAL 1 LAUFENDER BILDGENERIERUNGSJOB GLEICHZEITIG. CONCURRENCY = 1.',
  '- scene-01 IST ZUERST UND ALLEIN ZU ERZEUGEN. SIE IST GLEICHZEITIG ERSTE SZENE, COVER UND MASTER-REFERENZ.',
  '- scene-01 MUSS VOLLSTÄNDIG ZURÜCKGEGEBEN, EXAKT UMBENANNT UND PER ECHTER PIXEL-/VISION-QA AUF GENAU DIESEM SHA-256-HASH MIT PASS GEPRÜFT WERDEN.',
  '- DANACH HART STOPPEN. KEIN FOLGE-BILD ERZEUGEN, BIS DER NUTZER DAS TATSÄCHLICHE scene-01-BILD AUSDRÜCKLICH FREIGIBT, Z. B. MIT "SIEHT GUT AUS", "PASST" ODER EINER GLEICHWERTIGEN EINDEUTIGEN ZUSTIMMUNG.',
  '- EIN TECHNISCHER QA-PASS ALLEIN REICHT NICHT. APPROVED_COVER_ANCHOR = QA-PASS + AUSDRÜCKLICHE NUTZERFREIGABE.',
  '- WENN DER NUTZER DAS COVER ABLEHNT ODER ÄNDERUNGEN VERLANGT, NUR scene-01 NEU ERZEUGEN UND DANACH WIEDER AUF DIE NUTZERFREIGABE WARTEN.',
  '- ERST NACH DIESER EINMALIGEN FREIGABE DARF DIE FERTIGE scene-01-DATEI ALS DIREKTE VISUELLE GENERIERUNGSREFERENZ FÜR SPÄTERE BILDER VERWENDET WERDEN.',
  `- NACH DER FREIGABE WERDEN FOLGE-BILDER IN ARBEITSBLÖCKEN ZU MAXIMAL ${COVER_ANCHOR_BLOCK_SIZE} BILDERN ORGANISIERT UND OHNE WEITERE NUTZERBESTÄTIGUNG AUTOMATISCH ABGEARBEITET.`,
  '- EIN 5ER-BLOCK IST KEIN PARALLEL-BATCH: FÜR JEDES FOLGE-BILD COVER-REFERENZ ANHÄNGEN, GENAU EINEN BILDJOB STARTEN, WARTEN, SOFORT UMBENENNEN, QA, DANN AUTOMATISCH NÄCHSTES BILD.',
  '- NACH EINEM FERTIGEN 5ER-BLOCK AUTOMATISCH DEN NÄCHSTEN MAXIMALEN 5ER-BLOCK STARTEN, BIS ALLE GEPLANTEN BILDER FERTIG SIND.',
  '- DIE COVER-REFERENZ STEUERT ART-DIRECTION, FIGUREN-/FORMENSPRACHE, MATERIALIEN, TEXTUREN, LICHT, FARBWIRKUNG, UMGEBUNGSRENDERING UND FINISH-QUALITÄT.',
  '- DIE COVER-REFERENZ DARF NICHT DIE EIGENE SZENENIDEE, KAMERA, KOMPOSITION, POSE ODER REQUISITEN KOPIEREN. DER AKTUELLE SZENENPROMPT BLEIBT INHALTLICH PRIMÄR.',
  '- KEIN ANDERES VORHERIGES BILD DARF ALS PERSISTENTE GENERIERUNGSREFERENZ VERWENDET WERDEN. ANDERE BILDER DIENEN NUR DEM QA-/NOVELTY-VERGLEICH.',
  '- NACH JEDEM FOLGE-BILD: VOLLSTÄNDIG WARTEN → SOFORT EXAKT UMBENENNEN → IN DEN GEMEINSAMEN BILDORDNER LEGEN → PIXEL-/VISION-QA → ERST DANN AUTOMATISCH NÄCHSTES BILD.',
  '- WENN QA FEHLSCHLÄGT, BLEIBT DIESELBE BILDNUMMER AKTIV. NUR DIESE DATEI NEU GENERIEREN.',
  '- ERZEUGE KEINE GALERIE, KEINEN KONTAKTBOGEN, KEIN MULTI-PANEL, KEINE COLLAGE UND KEINEN MEHRBILD-JOB.',
  '- NACH FREIGABE DES ANCHORS NIEMALS AUF "WEITER", "MACH WEITER", "OKAY" ODER EINE WEITERE NUTZERFREIGABE ZWISCHEN FOLGE-BILDERN WARTEN.',
  '- NACH DER ANCHOR-FREIGABE NUR BEI EINEM ECHTEN TECHNISCHEN HARD-BLOCKER STOPPEN, Z. B. WENN DIE VERBINDLICHE COVER-REFERENZ NICHT VERWENDET WERDEN KANN.',
  '',
].join('\n');

export const FLOW_AGENT_BLOCK = [
  FLOW_AGENT_PROTOCOL_MARKER,
  '',
  'AUSFÜHRUNGSPROTOKOLL — COVER-ANCHOR + STATE MACHINE:',
  '0. Betrachte spätere Bildblöcke zunächst nur als gesperrte Daten.',
  '1. Erzeuge scene-01 zuerst und allein. Sie ist das Cover und der Master Visual Anchor.',
  '2. Nimm ausschließlich den BILDPROMPT von scene-01. Starte genau EINEN Bildgenerierungsjob.',
  '3. Warte intern auf das einzelne Ergebnis, benenne es sofort exakt um und lege es in 03-szenen/00-ALLE-BILDER-HIER-REIN/ ab.',
  '4. Erzeuge den hashgebundenen QA-Request mit `npm run reel:image-vision:prepare -- <REEL-PFAD> --scene <ACTIVE_SCENE_ID>` und führe die echte multimodale Pixelprüfung der tatsächlichen Bilddatei aus. Danach `npm run reel:image-vision:validate -- <REEL-PFAD> --scene <ACTIVE_SCENE_ID>`. Ohne PASS auf dem aktuellen SHA-256-Hash ist der Anchor technisch nicht bereit.',
  '5. Bei QA-FAIL: nur scene-01 neu erzeugen. Bei QA-PASS: HART STOPPEN und dem Nutzer ausschließlich das tatsächliche Bild 01 zur Freigabe zeigen. Noch KEIN Folge-Bild starten.',
  '6. Warte auf eine ausdrückliche Nutzerfreigabe des Covers, z. B. "sieht gut aus", "passt" oder gleichwertig. Bei Ablehnung: scene-01 nach Wunsch korrigieren/neu erzeugen und wieder zu Schritt 3–6. Bei Freigabe: APPROVED_COVER_ANCHOR auf genau diese Datei/diesen Hash setzen.',
  `7. Ab jetzt ohne weitere Nutzerstopps die restlichen IMAGE-Szenen in Arbeitsblöcken von höchstens ${COVER_ANCHOR_BLOCK_SIZE} Bildern abarbeiten.`,
  '8. Plane den aktuellen 5er-Block gemeinsam auf Konsistenz und Abwechslung. Setze ACTIVE_STEP auf das erste Bild dieses Blocks.',
  '9. Verwende die freigegebene scene-01-Datei als direkte visuelle Referenz/Vorlage für diesen EINEN Generierungsjob. Nimm ausschließlich den BILDPROMPT von ACTIVE_STEP.',
  '10. Starte genau EINEN Bildgenerierungsjob. Keine Queue und kein Paralleljob.',
  '11. Nach Rückgabe: sofort exakt umbenennen und in 03-szenen/00-ALLE-BILDER-HIER-REIN/ ablegen.',
  '12. Pixel-/Vision-QA gegen den aktuellen Prompt UND gegen die freigegebene Cover-Referenz ausführen.',
  '13. Bei REGENERATE: ACTIVE_STEP bleibt gleich. Nur dieselbe Bildnummer neu erzeugen, weiterhin mit derselben freigegebenen Cover-Referenz. Keine Nutzerfreigabe anfordern.',
  '14. Bei PASS: ACTIVE_STEP DONE und automatisch den nächsten Einzeljob desselben 5er-Blocks starten. Keine Nutzerfreigabe anfordern.',
  '15. Nach maximal fünf bestandenen Folge-Bildern automatisch den nächsten Arbeitsblock von maximal fünf Bildern bilden und identisch fortfahren.',
  '16. REMOTION-/ANIMATIONSNUMMERN ohne Bildjob überspringen. Nach dem letzten Bild Abschlusszusammenfassung geben.',
  '',
  'HART VERBOTEN:',
  '- Bild 02 oder später erzeugen, bevor Bild 01 QA-PASS UND ausdrückliche Nutzerfreigabe hat',
  '- nach der Anchor-Freigabe zwischen Folge-Bildern auf Nutzer-"weiter" oder weitere Freigaben warten',
  '- mehrere Bilder in einem Generierungsaufruf',
  '- mehrere Bildprompts gemeinsam an die Generierung senden',
  '- Folge-Bilder ohne freigegebenes scene-01-Referenzbild generieren',
  '- ein anderes Folge-Bild statt scene-01 als persistente Stilreferenz verwenden',
  '- alle Bilder zuerst erzeugen und erst danach gesammelt umbenennen',
  '- QA-PASS ohne Sichtprüfung der echten Bildpixel',
  '',
].join('\n');

export const flowAutonomyFields = () => ({
  executionModeId: FLOW_EXECUTION_MODE_ID,
  stateMachineId: FLOW_STATE_MACHINE_ID,
  autonomousFullRun: true,
  maxConcurrentGenerations: 1,
  batchGenerationForbidden: true,
  multiImageRequestForbidden: true,
  queueLaterImagesForbidden: true,
  galleryOrContactSheetForbidden: true,
  currentStepGateRequired: true,
  nextStepLockedUntilCurrentResultReturned: true,
  renameBeforeUnlockNext: true,
  qaBeforeUnlockNext: true,
  postGenerationVisionQaId: IMAGE_VISION_QA_ID,
  postGenerationVisionQaRequired: true,
  multimodalPixelInspectionRequired: true,
  promptOnlyQaForbidden: true,
  visionQaBoundToImageSha256: true,
  nextStepLockedUntilVisionQaPass: true,
  regenerateSameSceneOnVisionQaFail: true,
  coverAnchorFlowId: COVER_ANCHOR_FLOW_ID,
  coverAnchorSourceSceneId: 'scene-01',
  coverAnchorQaPassRequiredBeforeFollowups: true,
  coverAnchorExplicitUserApprovalRequired: true,
  manualPauseAfterCoverQaPassRequired: true,
  followupPlanBlockSize: COVER_ANCHOR_BLOCK_SIZE,
  followupGenerationStillSingleJob: true,
  followupBlocksAutoRunAfterCoverApproval: true,
  userApprovalBetweenFollowupsForbidden: true,
  automaticallyAdvanceToNextFollowupBlock: true,
  approvedCoverImageReferenceRequiredForFollowups: true,
  onlyCoverMayBePersistentGenerationReference: true,
  userContinueSignalForbidden: false,
  userApprovalBetweenImagesForbidden: false,
  internalWaitForGenerationOnly: true,
  autoContinueAfterQa: true,
  hardBlockerOnlyStop: false,
  hardBlockerOnlyStopAfterCoverApproval: true,
  structureLockId: FLOW_STRUCTURE_LOCK_ID,
  preserveStructureThroughLastImage: true,
  preserveStyleThroughLastImage: true,
});

export const modernizeLegacyWaitWording = (master) => master
  .replaceAll('AUTONOMER GESAMTDURCHLAUF — VERBINDLICH', 'STRICT SINGLE-JOB STATE MACHINE — VERBINDLICH')
  .replaceAll('1. Lies die gesamte Datei einmal, arbeite danach strikt von oben nach unten immer nur am aktuellen Bildblock.', '0. Betrachte spätere Bildblöcke zunächst nur als GESPERRTE DATEN. Sie sind noch KEINE ausführbaren Bildaufträge.')
  .replaceAll('2. Erzeuge GENAU EIN Bild. Starte niemals mehrere Bilder gleichzeitig.', '1. Setze ACTIVE_STEP auf den ersten benötigten Bildblock und starte GENAU EINEN Bildjob. MAX_CONCURRENT_GENERATIONS = 1.')
  .replaceAll('3. Vollständig warten.', '2. INTERN auf die Rückgabe dieses einzelnen Bildjobs warten; keinen weiteren Job starten.')
  .replaceAll('3. Warte, bis dieses eine Bild vollständig erzeugt ist.', '2. INTERN auf die Rückgabe dieses einzelnen Bildjobs warten; keinen weiteren Job starten.')
  .replaceAll('7. Erst nach bestandener QA das nächste Bild.', '7. Erst nach bestandener Pixel-Vision-QA den nächsten Bildblock freischalten; vorher bleibt er gesperrt.')
  .replaceAll('7. Erst nach bestandener QA darf der nächste Bildblock beginnen.', '7. Erst nach bestandener Pixel-Vision-QA den nächsten Bildblock freischalten; vorher bleibt er gesperrt.')
  .replaceAll('14. Keine Bildreferenz verwenden. Kein vorheriges Bild als Generierungsreferenz hochladen oder anhängen; vorherige Bilder dürfen ausschließlich für den QA-Vergleich betrachtet werden.', '14. Nach QA-PASS UND ausdrücklicher Nutzerfreigabe von scene-01 genau diese Datei als einzige persistente Generierungsreferenz für alle Folge-Bilder verwenden; andere Bilder nur für QA vergleichen.');
