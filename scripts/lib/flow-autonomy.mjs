// Verbindlicher Google-Flow-Vertrag — eine Quelle für alle Reels.
// V3 bleibt eine Strict-Single-Job-State-Machine. Cover Anchor V1 ergänzt nur
// die persistente visuelle Referenz: scene-01 wird zuerst freigegeben und ist
// danach die einzige erlaubte Generierungsreferenz für alle Folge-Bilder.

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
  '- scene-01 IST ZUERST ZU ERZEUGEN. SIE IST GLEICHZEITIG ERSTE SZENE, COVER UND MASTER-REFERENZ.',
  '- scene-01 MUSS VOLLSTÄNDIG ZURÜCKGEGEBEN, EXAKT UMBENANNT UND PER ECHTER PIXEL-/VISION-QA AUF GENAU DIESEM SHA-256-Hash MIT PASS FREIGEGEBEN WERDEN.',
  '- ERST NACH DIESEM PASS DARF DIE FERTIGE scene-01-DATEI ALS DIREKTE VISUELLE GENERIERUNGSREFERENZ FÜR SPÄTERE BILDER VERWENDET WERDEN.',
  `- NACH DEM COVER WERDEN DIE FOLGE-BILDER IN PLANBLÖCKEN ZU MAXIMAL ${COVER_ANCHOR_BLOCK_SIZE} BILDERN ORGANISIERT. DAS IST NUR PLANUNG; DIE GENERIERUNG BLEIBT STRENG EINZELN.`,
  '- FÜR JEDES FOLGE-BILD: COVER-REFERENZ ANHÄNGEN/ALS VISUELLE VORLAGE VERWENDEN, DANN GENAU EINEN BILDJOB STARTEN.',
  '- DIE COVER-REFERENZ STEUERT ART-DIRECTION, FIGUREN-/FORMENSPRACHE, MATERIALIEN, TEXTUREN, LICHT, FARBWIRKUNG, UMGEBUNGSRENDERING UND FINISH-QUALITÄT.',
  '- DIE COVER-REFERENZ DARF NICHT DIE EIGENE SZENENIDEE, KAMERA, KOMPOSITION, POSE ODER REQUISITEN KOPIEREN. DER AKTUELLE SZENENPROMPT BLEIBT INHALTLICH PRIMÄR.',
  '- KEIN ANDERES VORHERIGES BILD DARF ALS PERSISTENTE GENERIERUNGSREFERENZ VERWENDET WERDEN. ANDERE BILDER DIENEN NUR DEM QA-/NOVELTY-VERGLEICH.',
  '- NACH JEDEM BILD: VOLLSTÄNDIG WARTEN → SOFORT EXAKT UMBENENNEN → IN DEN GEMEINSAMEN BILDORDNER LEGEN → PIXEL-/VISION-QA → ERST DANN NÄCHSTES BILD.',
  '- WENN QA FEHLSCHLÄGT, BLEIBT DIESELBE BILDNUMMER AKTIV. NUR DIESE DATEI NEU GENERIEREN.',
  '- ERZEUGE KEINE GALERIE, KEINEN KONTAKTBOGEN, KEIN MULTI-PANEL, KEINE COLLAGE UND KEINEN MEHRBILD-JOB.',
  '- WARTE NIEMALS AUF "WEITER", "MACH WEITER", "OKAY" ODER NUTZERFREIGABE ZWISCHEN DEN BILDERN.',
  '- STOPP NUR BEI EINEM ECHTEN TECHNISCHEN HARD-BLOCKER, Z. B. WENN DIE VERBINDLICHE COVER-REFERENZ FÜR FOLGEBILDER NICHT VERWENDET WERDEN KANN.',
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
  '4. Erzeuge den hashgebundenen QA-Request mit `npm run reel:image-vision:prepare -- <REEL-PFAD> --scene <ACTIVE_SCENE_ID>` und führe die echte multimodale Pixelprüfung der tatsächlichen Bilddatei aus. Danach `npm run reel:image-vision:validate -- <REEL-PFAD> --scene <ACTIVE_SCENE_ID>`. Ohne PASS auf dem aktuellen SHA-256-Hash ist der Anchor NICHT freigegeben.',
  '5. Bei FAIL: nur scene-01 neu erzeugen. Bei PASS: APPROVED_COVER_ANCHOR auf genau diese Datei/diesen Hash setzen.',
  `6. Organisiere danach die nächsten benötigten IMAGE-Szenen in einem Planblock von höchstens ${COVER_ANCHOR_BLOCK_SIZE} Bildern. Diese fünf dürfen gemeinsam auf Konsistenz geplant, aber niemals gemeinsam generiert werden.`,
  '7. Setze ACTIVE_STEP auf das erste Bild dieses Blocks. Verwende die freigegebene scene-01-Datei als direkte visuelle Referenz/Vorlage für diesen EINEN Generierungsjob.',
  '8. Nimm ausschließlich den BILDPROMPT von ACTIVE_STEP. Die Referenz gibt nur die visuelle DNA vor; Inhalt, Kamera und Komposition kommen aus ACTIVE_STEP.',
  '9. Starte genau EINEN Bildgenerierungsjob. Keine Queue und kein Paralleljob.',
  '10. Nach Rückgabe: sofort exakt umbenennen und in 03-szenen/00-ALLE-BILDER-HIER-REIN/ ablegen.',
  '11. Pixel-/Vision-QA gegen den aktuellen Prompt UND gegen die freigegebene Cover-Referenz ausführen.',
  '12. Bei REGENERATE: ACTIVE_STEP bleibt gleich. Nur dieselbe Bildnummer neu erzeugen, weiterhin mit derselben freigegebenen Cover-Referenz.',
  '13. Bei PASS: ACTIVE_STEP DONE; erst jetzt den nächsten Einzeljob desselben 5er-Planblocks starten.',
  '14. Nach maximal fünf bestandenen Folge-Bildern den nächsten Planblock von maximal fünf Bildern bilden und identisch fortfahren.',
  '15. REMOTION-/ANIMATIONSNUMMERN ohne Bildjob überspringen. Nach dem letzten Bild Abschlusszusammenfassung geben.',
  '',
  'HART VERBOTEN:',
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
  followupPlanBlockSize: COVER_ANCHOR_BLOCK_SIZE,
  followupGenerationStillSingleJob: true,
  approvedCoverImageReferenceRequiredForFollowups: true,
  onlyCoverMayBePersistentGenerationReference: true,
  userContinueSignalForbidden: true,
  userApprovalBetweenImagesForbidden: true,
  internalWaitForGenerationOnly: true,
  autoContinueAfterQa: true,
  hardBlockerOnlyStop: true,
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
  .replaceAll('14. Keine Bildreferenz verwenden. Kein vorheriges Bild als Generierungsreferenz hochladen oder anhängen; vorherige Bilder dürfen ausschließlich für den QA-Vergleich betrachtet werden.', '14. Nach PASS von scene-01 genau diese Datei als einzige persistente Generierungsreferenz für alle Folge-Bilder verwenden; andere Bilder nur für QA vergleichen.');
