import React from 'react';
import {
  FINANCE_EXAMPLES,
  getEmergencyFundTarget,
} from '../../design-system';
import {ReelTemplate} from './ReelTemplate';
import {
  getReelDurationInFrames,
  type ReelConfig,
} from './types';

const EMERGENCY_EXAMPLE = FINANCE_EXAMPLES.emergencyFund;
const EMERGENCY_FUND_TARGET = getEmergencyFundTarget();

export const REEL_TEMPLATE_DEMO_CONFIG: ReelConfig = {
  id: 'notgroschen-demo',
  title: 'Was ist ein Notgroschen?',
  fps: 30,
  disclaimer: 'BEISPIEL · KEINE ANLAGEBERATUNG',
  showSafeAreaGuide: true,
  beats: [
    {
      id: 'hook',
      type: 'hook',
      durationInFrames: 240,
      background: 'premium',
      kicker: 'FINANZGRUNDLAGE',
      headline: 'EINE RECHNUNG',
      accent: 'UND DU BIST IM MINUS',
      subline: 'Genau davor schützt dich ein Notgroschen.',
    },
    {
      id: 'problem',
      type: 'explain',
      durationInFrames: 300,
      background: 'standard',
      kicker: 'DAS PROBLEM',
      headline: 'UNERWARTETE KOSTEN KOMMEN PLÖTZLICH',
      body: 'Eine kaputte Waschmaschine oder eine hohe Nachzahlung wartet nicht darauf, dass dein Gehalt kommt.',
      motion: {
        visualMetaphor: 'Eine unerwartete Rechnung trifft auf ein ungeschütztes Monatsbudget.',
        startState: 'Das Monatsbudget ist vollständig, aber ohne Reserve.',
        action: 'Eine Reparaturrechnung zieht sichtbar Geld aus dem Budget.',
        endState: 'Das Budget rutscht ohne Sicherheitspuffer ins Minus.',
      },
      bullets: [
        'Reparatur oder Ersatz',
        'Nachzahlung oder Selbstbeteiligung',
        'Kurzfristiger Einkommensausfall',
      ],
    },
    {
      id: 'example-number',
      type: 'number',
      durationInFrames: 360,
      background: 'data',
      kicker: 'BEISPIEL',
      headline: 'WIE HOCH SOLLTE DER PUFFER SEIN?',
      label: `${EMERGENCY_EXAMPLE.targetMonths} notwendige Monatsausgaben`,
      value: EMERGENCY_FUND_TARGET,
      format: 'euro',
      detail: 'Das ist kein Pflichtwert, sondern ein verständlicher Startpunkt.',
      assumptions: `${EMERGENCY_EXAMPLE.monthlyNecessaryExpenses.toLocaleString('de-DE')} € notwendige Ausgaben × ${EMERGENCY_EXAMPLE.targetMonths} Monate`,
      sourceNote: EMERGENCY_EXAMPLE.disclosure,
      motion: {
        visualMetaphor: 'Monatsausgaben werden zu einem sichtbaren Sicherheitspuffer gestapelt.',
        startState: 'Ein Monatsblock steht als Ausgangswert bereit.',
        action: 'Drei gleich große Monatsblöcke bauen sich nacheinander auf.',
        endState: 'Der vollständige Beispiel-Puffer und seine Rechnung sind sichtbar.',
      },
    },
    {
      id: 'comparison',
      type: 'compare',
      durationInFrames: 390,
      background: 'data',
      kicker: 'DER UNTERSCHIED',
      headline: 'OHNE ODER MIT NOTGROSCHEN?',
      motion: {
        visualMetaphor: 'Dieselbe Rechnung trifft zwei unterschiedlich vorbereitete Haushalte.',
        startState: 'Beide Haushalte starten mit derselben unerwarteten Rechnung.',
        action: 'Links entsteht Kredit, rechts deckt der Puffer die Rechnung.',
        endState: 'Schulden und bezahlte Rechnung stehen klar gegenüber.',
      },
      left: {
        label: 'Ohne Puffer',
        value: 'KREDIT',
        detail: 'Die Rechnung wird zu neuen Schulden.',
        tone: 'negative',
      },
      right: {
        label: 'Mit Puffer',
        value: 'BEZAHLT',
        detail: 'Die Rechnung wird gedeckt, ohne neue Schulden.',
        tone: 'positive',
      },
    },
    {
      id: 'solution',
      type: 'checklist',
      durationInFrames: 390,
      background: 'standard',
      kicker: 'DIE LÖSUNG',
      headline: 'SO BAUST DU DEN NOTGROSCHEN AUF',
      motion: {
        visualMetaphor: 'Ein leerer Sicherheitsspeicher wird Schritt für Schritt gefüllt.',
        startState: 'Der persönliche Puffer ist noch leer.',
        action: 'Die vier konkreten Schritte füllen den Speicher nacheinander.',
        endState: 'Der Puffer ist getrennt, verfügbar und einsatzbereit.',
      },
      items: [
        'Notwendige Monatsausgaben berechnen',
        'Persönlichen Zielbetrag festlegen',
        'Automatischen Dauerauftrag einrichten',
        'Geld getrennt und schnell verfügbar halten',
      ],
    },
    {
      id: 'cta',
      type: 'cta',
      durationInFrames: 270,
      background: 'premium',
      kicker: 'DEIN NÄCHSTER SCHRITT',
      headline: 'BERECHNE DEINEN EIGENEN PUFFER',
      body: 'Starte klein. Entscheidend ist, dass du überhaupt einen finanziellen Abstand zu unerwarteten Rechnungen aufbaust.',
      keyword: 'NOTGROSCHEN',
      offer: 'Du erhältst die kostenlose Notgroschen-Checkliste.',
    },
  ],
};

export const REEL_TEMPLATE_DEMO_FRAMES = getReelDurationInFrames(
  REEL_TEMPLATE_DEMO_CONFIG,
);

export const ReelTemplateDemo: React.FC = () => (
  <ReelTemplate config={REEL_TEMPLATE_DEMO_CONFIG} />
);
