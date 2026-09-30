// Verbindlicher Google-Flow-Vertrag — eine Quelle für alle Reels.
//
// Strict Single Job bleibt unverändert: niemals mehrere laufende Bildjobs.
// Neu: Arbeit erfolgt in Nutzer-kontrollierten 5er-Blöcken. Innerhalb eines
// Blocks läuft Flow autonom Bild für Bild; nach maximal 5 finalen Bildern ist
// ein bewusster Nutzer-Checkpoint Pflicht. Vor Block 1 kommen 3 Cover-Varianten.

import {
  FLOW_AGENT_PROTOCOL_MARKER,
  FLOW_EXECUTION_MODE_ID,
  FLOW_EXECUTION_MODE_MARKER,
  FLOW_STATE_MACHINE_ID,
  FLOW_STATE_MACHINE_MARKER,
  FLOW_STRUCTURE_LOCK_ID,
  FLOW_STRUCTURE_LOCK_MARKER,
} from './reel-contract.mjs';

export const AUTONOMY_BLOCK = [
  FLOW_EXECUTION_MODE_MARKER,
  FLOW_STRUCTURE_LOCK_MARKER,
  FLOW_STATE_MACHINE_MARKER,
  '',
  'STRICT SINGLE-JOB STATE MACHINE — VERBINDLICH',
  '- DIES IST KEIN BATCH-AUFTRAG. DIE GESAMTE DATEI DARF NIEMALS ALS EIN MEHRBILD-PROMPT AUSGEFÜHRT WERDEN.',
  '- MAXIMAL 1 LAUFENDER BILDGENERIERUNGSJOB GLEICHZEITIG. CONCURRENCY = 1.',
  '- BLOCKGRÖSSE = 5. DAS BEDEUTET MAXIMAL FÜNF NACHEINANDER FERTIGGESTELLTE BILDER PRO ARBEITSBLOCK, NICHT FÜNF GLEICHZEITIGE JOBS.',
  '- VOR DEM ERSTEN NORMALEN SZENENBLOCK: 3 COVER-VARIANTEN A/B/C STRIKT NACHEINANDER ERZEUGEN, DANN STOPP UND NUTZERWAHL.',
  '- DAS GEWÄHLTE COVER WIRD BILD 01 UND DIE EINZIGE VISUELLE STYLE-REFERENZ FÜR DIE RESTLICHEN FLOW-BILDER.',
  '- STARTE NIEMALS MEHRERE BILDER, MEHRERE GENERIERUNGSJOBS ODER MEHRERE SZENEN IN EINEM SCHRITT / TOOL-CALL / BATCH.',
  '- ERZEUGE KEINE GALERIE, KEINEN KONTAKTBOGEN, KEIN MULTI-PANEL, KEINE COLLAGE UND KEIN BILD MIT MEHREREN SZENEN.',
  '- ALLE SPÄTEREN BILDBLÖCKE SIND GESPERRT, BIS DER AKTUELLE BLOCK VOLLSTÄNDIG FERTIG UND VOM NUTZER FREIGEGEBEN IST.',
  '- INNERHALB EINES 5ER-BLOCKS DARF DER NÄCHSTE BILDSCHRITT ERST FREIGESCHALTET WERDEN, WENN DAS AKTUELLE BILD: (1) vollständig zurückgegeben, (2) exakt umbenannt und (3) per QA geprüft wurde.',
  '- WENN DAS AKTUELLE BILD DIE QA NICHT BESTEHT, ERZEUGE NUR DIESELBE BILDNUMMER NEU.',
  '- INNERHALB DES AKTUELLEN 5ER-BLOCKS KEINE NUTZERFREIGABE ZWISCHEN EINZELBILDERN ANFORDERN.',
  '- NACH MAXIMAL FÜNF FERTIGEN BILDERN: STOPP UND AUF NUTZERFREIGABE / "WEITER" FÜR DEN NÄCHSTEN BLOCK WARTEN.',
  '- REMOTION-/ANIMATIONSNUMMERN WERDEN OHNE GENERIERUNG ÜBERSPRUNGEN.',
  '- "WARTEN" WÄHREND EINES BILDES BEDEUTET INTERN AUF DIE RÜCKGABE DES AKTUELLEN EINZELNEN BILDJOBS WARTEN.',
  '- KEINE SPÄTEREN BILDER VORPLANEN, QUEUEN, PARALLEL STARTEN ODER VORAB GENERIEREN.',
  '- STRUKTUR, DATEINAMENLOGIK, V9-BILDWELT, FARBROLLEN, LICHT UND QA BIS ZUM LETZTEN BILD UNVERÄNDERT BEIBEHALTEN.',
  '',
].join('\n');

export const FLOW_AGENT_BLOCK = [
  FLOW_AGENT_PROTOCOL_MARKER,
  '',
  'AUSFÜHRUNGSPROTOKOLL — COVER-GATE + 5ER-BLÖCKE + SINGLE JOB:',
  '0. Erzeuge zuerst Cover A, dann B, dann C — immer einzeln und nacheinander. Danach STOPP und Nutzerwahl A/B/C abwarten.',
  '1. Benenne die gewählte Cover-Variante zum finalen Bild-01-Dateinamen um. Sie wird zugleich die einzige visuelle Style-Referenz für die restlichen Flow-Bilder.',
  '2. Setze ACTIVE_BLOCK auf den ersten 5er-Block. Spätere Blöcke bleiben gesperrt.',
  '3. Setze ACTIVE_STEP auf das erste benötigte Bild in ACTIVE_BLOCK.',
  '4. Nimm AUSSCHLIESSLICH den BILDPROMPT von ACTIVE_STEP. Sende niemals Text aus mehreren Bildblöcken gemeinsam an die Bildgenerierung.',
  '5. Starte GENAU EINEN Bildgenerierungsjob. MAX_CONCURRENT_GENERATIONS = 1.',
  '6. Starte KEINEN weiteren Job, solange dieser Job läuft oder noch kein Ergebnis zurückgegeben wurde.',
  '7. Sobald das Bild zurückgegeben wurde: benenne DIESE Datei SOFORT exakt auf den vorgegebenen finalen Dateinamen um.',
  '8. Prüfe ausschließlich dieses eine Bild: Aussage, erlaubte Labels, gewählter Cover-Style, klarer stylized-3D-animated V9-Look, tiefschwarzer sauberer Hintergrund und exakter Dateiname.',
  '9. QA FEHLER: ACTIVE_STEP bleibt unverändert. Erzeuge ausschließlich dieselbe Bildnummer neu.',
  '10. QA BESTANDEN: markiere ACTIVE_STEP als DONE. Innerhalb desselben Blocks darf jetzt exakt der nächste benötigte Bildschritt freigeschaltet werden.',
  '11. Bei "KEIN BILD XX ERZEUGEN" die Nummer ohne Bildjob überspringen.',
  '12. Nach maximal 5 DONE-Bildern in ACTIVE_BLOCK: STOPP. Warte auf Nutzerfreigabe / "weiter". Vorher darf der nächste Block nicht starten.',
  '13. Nach Nutzerfreigabe: nächsten Block aktivieren und Schritte 3–12 wiederholen.',
  '14. Nach dem letzten Block Abschlusszusammenfassung mit allen finalen Dateien geben.',
  '',
  'STYLE-REFERENZ:',
  '- einzig erlaubt: das vom Nutzer ausgewählte Cover',
  '- übernehmen: Materialgefühl, 3D-Formensprache, Licht, Kontrast, Farbcharakter, Kameragefühl, Render-Look',
  '- nicht übernehmen: Cover-Text, Cover-Layout, konkrete Objektanordnung oder Szeneninhalt',
  '',
  'HART VERBOTEN:',
  '- mehrere Bilder in einem Generierungsaufruf',
  '- mehrere Bildprompts zusammenfassen',
  '- Bilder vorab in eine Queue stellen',
  '- alle Bilder zuerst erzeugen und erst danach gesammelt umbenennen',
  '- Kontaktbogen / Galerie / Collage / Multi-Panel als Ersatz für Einzelbilder',
  '',
].join('\n');

export const flowAutonomyFields = () => ({
  executionModeId: FLOW_EXECUTION_MODE_ID,
  stateMachineId: FLOW_STATE_MACHINE_ID,
  autonomousFullRun: false,
  blockAutonomousRun: true,
  blockSize: 5,
  maxConcurrentGenerations: 1,
  batchGenerationForbidden: true,
  multiImageRequestForbidden: true,
  queueLaterImagesForbidden: true,
  galleryOrContactSheetForbidden: true,
  currentStepGateRequired: true,
  nextStepLockedUntilCurrentResultReturned: true,
  renameBeforeUnlockNext: true,
  qaBeforeUnlockNext: true,
  userContinueSignalForbidden: false,
  userApprovalBetweenImagesForbidden: true,
  userApprovalBetweenBlocksRequired: true,
  internalWaitForGenerationOnly: true,
  autoContinueAfterQaWithinBlock: true,
  coverVariantCount: 3,
  coverSelectionRequiredBeforeSceneImages: true,
  selectedCoverAsOnlyStyleReference: true,
  referenceCopiesLayoutForbidden: true,
  hardBlockerOnlyStopWithinBlock: true,
  structureLockId: FLOW_STRUCTURE_LOCK_ID,
  preserveStructureThroughLastImage: true,
  preserveStyleThroughLastImage: true,
});

export const modernizeLegacyWaitWording = (master) => master
  .replaceAll('AUTONOMER GESAMTDURCHLAUF — VERBINDLICH', 'STRICT SINGLE-JOB STATE MACHINE — VERBINDLICH')
  .replaceAll('WARTE NIEMALS AUF "WEITER", "MACH WEITER", "OKAY", BESTÄTIGUNG ODER FREIGABE DES NUTZERS.', 'INNERHALB EINES 5ER-BLOCKS KEINE NUTZERFREIGABE ZWISCHEN EINZELBILDERN; NACH MAXIMAL FÜNF BILDERN STOPP UND FREIGABE ABWARTEN.')
  .replaceAll('STOPP NUR BEI EINEM ECHTEN TECHNISCHEN HARD-BLOCKER. KEIN NUTZER-ZWISCHENSTOPP.', 'INNERHALB EINES BLOCKS STOPP NUR BEI HARD-BLOCKER; NACH JEDEM 5ER-BLOCK IST EIN NUTZER-ZWISCHENSTOPP PFLICHT.');
