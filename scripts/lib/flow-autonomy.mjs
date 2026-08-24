// Der verbindliche Google-Flow-Autonomievertrag — eine Quelle für alle.
//
// Vorher erzeugte der Scaffold bewusst Formulierungen, die ein
// Nachrüst-Skript anschließend wieder ersetzte ("Warte, bis dieses eine Bild
// vollständig erzeugt ist" → "Warte INTERN …"). Erst falschen Output erzeugen
// und ihn danach reparieren ist fehleranfällig: Wer den Scaffold direkt
// aufruft, bekommt die alte Fassung.
//
// Jetzt erzeugt der Scaffold sofort den richtigen Text. Das Nachrüst-Skript
// nutzt dieselbe Definition und dient nur noch Bestandsreels.

import {
  FLOW_AGENT_PROTOCOL_MARKER,
  FLOW_EXECUTION_MODE_ID,
  FLOW_EXECUTION_MODE_MARKER,
  FLOW_STRUCTURE_LOCK_ID,
  FLOW_STRUCTURE_LOCK_MARKER,
} from './reel-contract.mjs';

/** Kopfblock: autonomer Gesamtdurchlauf ohne Nutzer-Zwischenstopps. */
export const AUTONOMY_BLOCK = [
  FLOW_EXECUTION_MODE_MARKER,
  FLOW_STRUCTURE_LOCK_MARKER,
  '',
  'AUTONOMER GESAMTDURCHLAUF — VERBINDLICH',
  '- ARBEITE DAS GESAMTE BILDSET OHNE NUTZER-ZWISCHENSTOPP BIS ZUM LETZTEN BENÖTIGTEN BILD AB.',
  '- WARTE NIEMALS AUF "WEITER", "MACH WEITER", "OKAY", EINE BESTÄTIGUNG ODER EINE FREIGABE DES NUTZERS.',
  '- "WARTEN" BEDEUTET AUSSCHLIESSLICH: INTERN WARTEN, BIS DIE AKTUELLE BILDERZEUGUNG TECHNISCH VOLLSTÄNDIG ABGESCHLOSSEN IST. ES BEDEUTET NIEMALS, AUF DEN NUTZER ZU WARTEN.',
  '- NACH JEDEM BILD AUTOMATISCH: vollständig erzeugen → sofort exakt umbenennen → QA prüfen → bei Fehler dieselbe Bildnummer neu erzeugen → bei bestandener QA DIREKT mit dem nächsten benötigten Bild fortfahren.',
  '- Remotion-/Animationsnummern automatisch überspringen; dafür kein Bild erzeugen.',
  '- Nur bei einem echten technischen Hard-Blocker stoppen. Geschmacksfragen, Zwischenfreigaben oder fehlendes "weiter" sind KEINE Stop-Gründe.',
  '- DIESE STRUKTUR, REIHENFOLGE, DATEINAMENLOGIK, BILDWELT, MATERIALLOGIK, FARBROLLEN, LICHTLOGIK UND QUALITÄTSREGELN BIS ZUM LETZTEN BILD KONSEQUENT BEIBEHALTEN.',
  '- Keine Stiländerung, keine neue Bildwelt und keine abweichende Prompt-Struktur mitten im Durchlauf. Jede Szene bekommt eine frische Komposition INNERHALB derselben festgeschriebenen Welt.',
  '',
].join('\n');

/** Schrittfolge für den Flow-Agenten — bereits autonomie-konform formuliert. */
export const FLOW_AGENT_BLOCK = [
  FLOW_AGENT_PROTOCOL_MARKER,
  '',
  'STRIKTER ARBEITSMODUS FÜR DEN GOOGLE-FLOW-KI-AGENTEN:',
  '1. Lies die gesamte Datei einmal, arbeite danach strikt von oben nach unten immer nur am aktuellen Bildblock.',
  '2. Erzeuge GENAU EIN Bild. Starte niemals mehrere Bilder gleichzeitig.',
  '3. Warte INTERN, bis dieses eine Bild vollständig erzeugt ist — niemals auf Nutzerfreigabe warten.',
  '4. Benenne es SOFORT exakt mit dem beim Bildblock angegebenen finalen Dateinamen um.',
  '5. Prüfe Motiv, kurze Labels, 3D-Stil, sichtbares Gesicht falls Person, nahtlosen Hintergrund und Dateiname.',
  '6. Wenn eine Prüfung scheitert: Erzeuge DIESELBE Bildnummer neu und ersetze die fehlerhafte Version.',
  '7. Nach bestandener QA beginnt der nächste benötigte Bildblock AUTOMATISCH und ohne Nutzer-Zwischenfreigabe.',
  '8. Bei "KEIN BILD XX ERZEUGEN" die Nummer ohne Generierung überspringen.',
  '9. Keine Bildreferenz verwenden. Kein vorheriges Bild hochladen oder anhängen.',
  '10. Jede Szene bekommt eine eigene frische Komposition; Einheitlichkeit entsteht nur durch den ausgeschriebenen Stil-Lock.',
  '11. Nach Abschluss müssen alle erzeugten und exakt benannten Bilder gemeinsam in 03-szenen/00-ALLE-BILDER-HIER-REIN/ liegen.',
  '',
].join('\n');

/** Die googleFlow-Felder, die den Autonomievertrag im scene-index abbilden. */
export const flowAutonomyFields = () => ({
  executionModeId: FLOW_EXECUTION_MODE_ID,
  autonomousFullRun: true,
  userContinueSignalForbidden: true,
  userApprovalBetweenImagesForbidden: true,
  internalWaitForGenerationOnly: true,
  autoContinueAfterQa: true,
  hardBlockerOnlyStop: true,
  structureLockId: FLOW_STRUCTURE_LOCK_ID,
  preserveStructureThroughLastImage: true,
  preserveStyleThroughLastImage: true,
});

/**
 * Hebt ältere Masterprompts auf den aktuellen Wortlaut.
 * Für Bestandsreels, die vor Einführung des Vertrags entstanden sind.
 */
export const modernizeLegacyWaitWording = (master) => master
  .replaceAll('3. Vollständig warten.', '3. INTERN warten, bis dieses eine Bild vollständig erzeugt ist — niemals auf Nutzerfreigabe warten.')
  .replaceAll('3. Warte, bis dieses eine Bild vollständig erzeugt ist.', '3. Warte INTERN, bis dieses eine Bild vollständig erzeugt ist — niemals auf Nutzerfreigabe warten.')
  .replaceAll('7. Erst nach bestandener QA das nächste Bild.', '7. Nach bestandener QA AUTOMATISCH und ohne Nutzer-Zwischenfreigabe mit dem nächsten benötigten Bild fortfahren.')
  .replaceAll('7. Erst nach bestandener QA darf der nächste Bildblock beginnen.', '7. Nach bestandener QA beginnt der nächste benötigte Bildblock AUTOMATISCH und ohne Nutzer-Zwischenfreigabe.');
