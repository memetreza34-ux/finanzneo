// Verbindlicher Google-Flow-Vertrag — eine Quelle für alle Reels.
//
// V3 behebt einen echten Produktionsfehler: Ein Agent interpretierte den alten
// "autonomen Gesamtdurchlauf" trotz "GENAU EIN Bild" als Batch-Auftrag und
// startete mehrere Bilder auf einmal. Autonomie ist deshalb ausdrücklich eine
// STATE MACHINE mit maximal EINEM laufenden Generierungsjob.

import {
  FLOW_AGENT_PROTOCOL_MARKER,
  FLOW_EXECUTION_MODE_ID,
  FLOW_EXECUTION_MODE_MARKER,
  FLOW_STATE_MACHINE_ID,
  FLOW_STATE_MACHINE_MARKER,
  FLOW_STRUCTURE_LOCK_ID,
  FLOW_STRUCTURE_LOCK_MARKER,
} from './reel-contract.mjs';

const IMAGE_VISION_QA_ID = 'finanzneo-image-vision-qa-v1';

/** Kopfblock: autonom bis zum Ende, aber NIEMALS Batch-Generierung. */
export const AUTONOMY_BLOCK = [
  FLOW_EXECUTION_MODE_MARKER,
  FLOW_STRUCTURE_LOCK_MARKER,
  FLOW_STATE_MACHINE_MARKER,
  `POST_GENERATION_VISION_QA: ${IMAGE_VISION_QA_ID}`,
  '',
  'STRICT SINGLE-JOB STATE MACHINE — VERBINDLICH',
  '- DIES IST KEIN BATCH-AUFTRAG. DIE GESAMTE DATEI DARF NIEMALS ALS EIN MEHRBILD-PROMPT AUSGEFÜHRT WERDEN.',
  '- MAXIMAL 1 LAUFENDER BILDGENERIERUNGSJOB GLEICHZEITIG. CONCURRENCY = 1.',
  '- STARTE NIEMALS MEHRERE BILDER, MEHRERE GENERIERUNGSJOBS ODER MEHRERE SZENEN IN EINEM SCHRITT / TOOL-CALL / BATCH.',
  '- ERZEUGE KEINE GALERIE, KEINEN KONTAKTBOGEN, KEIN MULTI-PANEL, KEINE COLLAGE UND KEIN BILD MIT MEHREREN SZENEN.',
  '- INITIAL IST NUR DER ERSTE BENÖTIGTE BILDBLOCK FREIGESCHALTET. ALLE SPÄTEREN BILDBLÖCKE SIND GESPERRT.',
  '- EIN SPÄTERER BILDBLOCK DARF ERST FREIGESCHALTET WERDEN, WENN DAS AKTUELLE BILD: (1) vollständig zurückgegeben, (2) exakt umbenannt und (3) per echter Pixel-Vision-QA auf genau diesem Datei-Hash mit PASS geprüft wurde.',
  '- PROMPT-/METADATEN-QA ALLEIN IST KEIN PIXEL-PASS. DER MULTIMODALE EVALUATOR MUSS DIE TATSÄCHLICH ERZEUGTE BILDDATEI SEHEN.',
  '- WENN SICH DIE BILDDATEI ÄNDERT, IST DER ALTE QA-PASS UNGÜLTIG, WEIL DER SHA-256-HASH NICHT MEHR PASST.',
  '- WENN DAS AKTUELLE BILD DIE QA NICHT BESTEHT, BLEIBT DER NÄCHSTE BILDBLOCK GESPERRT. ERZEUGE NUR DIESELBE BILDNUMMER NEU.',
  '- NACH BESTANDENER PIXEL-QA WIRD GENAU DER NÄCHSTE BENÖTIGTE BILDBLOCK IN DOKUMENTREIHENFOLGE FREIGESCHALTET. NICHT VORHER.',
  '- REMOTION-/ANIMATIONSNUMMERN WERDEN OHNE GENERIERUNG ÜBERSPRUNGEN.',
  '- WARTE NIEMALS AUF "WEITER", "MACH WEITER", "OKAY", BESTÄTIGUNG ODER FREIGABE DES NUTZERS.',
  '- "WARTEN" BEDEUTET NUR: INTERN AUF DIE RÜCKGABE DES AKTUELLEN EINZELNEN BILDJOBS WARTEN.',
  '- KEINE SPÄTEREN BILDER VORPLANEN, QUEUEN, PARALLEL STARTEN ODER VORAB GENERIEREN.',
  '- STRUKTUR, DATEINAMENLOGIK, V9-BILDWELT, FARBROLLEN, LICHT UND QA BIS ZUM LETZTEN BILD UNVERÄNDERT BEIBEHALTEN.',
  '- STOPP NUR BEI EINEM ECHTEN TECHNISCHEN HARD-BLOCKER. KEIN NUTZER-ZWISCHENSTOPP.',
  '',
].join('\n');

/** Schrittfolge für den Agenten. */
export const FLOW_AGENT_BLOCK = [
  FLOW_AGENT_PROTOCOL_MARKER,
  '',
  'AUSFÜHRUNGSPROTOKOLL — STATE MACHINE, NICHT BATCH:',
  '0. Betrachte spätere Bildblöcke zunächst nur als GESPERRTE DATEN. Sie sind noch KEINE ausführbaren Bildaufträge.',
  '1. Setze ACTIVE_STEP auf den ersten benötigten Bildblock in Dokumentreihenfolge.',
  '2. Nimm AUSSCHLIESSLICH den BILDPROMPT von ACTIVE_STEP. Sende niemals Text aus mehreren Bildblöcken gemeinsam an die Bildgenerierung.',
  '3. Starte GENAU EINEN Bildgenerierungsjob für ACTIVE_STEP. MAX_CONCURRENT_GENERATIONS = 1.',
  '4. Starte KEINEN weiteren Job, solange dieser Job läuft oder noch kein Ergebnis zurückgegeben wurde.',
  '5. Sobald das einzelne Bild zurückgegeben wurde: benenne DIESE Datei SOFORT exakt auf den vorgegebenen finalen Dateinamen um und lege sie in 03-szenen/00-ALLE-BILDER-HIER-REIN/ ab.',
  '6. Erzeuge danach den hashgebundenen QA-Request: npm run reel:image-vision:prepare -- <REEL-PFAD> --scene <ACTIVE_SCENE_ID>.',
  '7. PIXEL-QA: Ein multimodaler Evaluator muss die tatsächliche Bilddatei öffnen/sehen und gegen den Request prüfen: Sprechbeat/Regie, Hauptaktion, Kamera/Shot Scale, Ort/Hauptmotiv, Hook, Visual Interest, V9-Welt, Deep Black, Text/Labels, Klarheit und visuelle Neuheit gegenüber den bereits erzeugten Bildern. Nur Prompttext zu lesen ist verboten.',
  '8. Schreibe das Ergebnis exakt in die im Request genannte results/<scene>.json und führe aus: npm run reel:image-vision:validate -- <REEL-PFAD> --scene <ACTIVE_SCENE_ID>.',
  '9. QA FEHLER / REGENERATE: ACTIVE_STEP bleibt unverändert. Erzeuge ausschließlich dieselbe Bildnummer neu, ersetze die Datei, erzeuge wegen des neuen SHA-256-Hashs einen neuen Request und prüfe erneut. Alle späteren Schritte bleiben gesperrt.',
  '10. QA BESTANDEN: markiere ACTIVE_STEP als DONE. Erst JETZT darfst du den nächsten benötigten Bildblock in Dokumentreihenfolge freischalten.',
  '11. Bei "KEIN BILD XX ERZEUGEN" die Nummer ohne Bildjob überspringen und zum nächsten benötigten Bildblock gehen.',
  '12. Wiederhole 2–11, bis jedes erwartete Bild einzeln DONE ist. Keine Nutzerfreigabe dazwischen.',
  '13. Erst NACH Abschluss aller Einzeljobs darfst du eine Abschlusszusammenfassung über alle finalen Dateien geben.',
  '14. Keine Bildreferenz verwenden. Kein vorheriges Bild als Generierungsreferenz hochladen oder anhängen; vorherige Bilder dürfen ausschließlich für den QA-Vergleich betrachtet werden.',
  '',
  'HART VERBOTEN:',
  '- mehrere Bilder in einem Generierungsaufruf',
  '- mehrere Bildprompts zusammenfassen',
  '- Bilder vorab in eine Queue stellen',
  '- alle Bilder zuerst erzeugen und erst danach gesammelt umbenennen',
  '- Kontaktbogen / Galerie / Collage / Multi-Panel als Ersatz für Einzelbilder',
  '- QA-PASS ohne Sichtprüfung der echten Bildpixel',
  '- Wiederverwendung eines QA-PASS für eine Datei mit anderem SHA-256-Hash',
  '',
].join('\n');

/** googleFlow-Felder im scene-index. */
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
  .replaceAll('7. Erst nach bestandener QA das nächste Bild.', '7. Erst nach bestandener Pixel-Vision-QA den nächsten Bildblock freischalten; vorher bleibt er gesperrt.')
  .replaceAll('7. Erst nach bestandener QA darf der nächste Bildblock beginnen.', '7. Erst nach bestandener Pixel-Vision-QA den nächsten Bildblock freischalten; vorher bleibt er gesperrt.');
