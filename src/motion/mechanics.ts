export const FINANZNEO_MECHANICS = {
  growthBuild: {
    id: 'fn-growth-build',
    intent: 'Kapital oder Bestand wächst durch Einzahlung, Ertrag oder schrittweisen Aufbau.',
    preferredPrimitives: ['PhysicalCoinStack', 'PhysicalAccount'],
    motionPattern: 'source-value -> visible buildup -> larger stable result',
    resultType: 'larger-balance',
  },
  costExtraction: {
    id: 'fn-cost-extraction',
    intent: 'Gebühren, Kosten, Steuern oder Abzüge reduzieren einen vorhandenen Wert sichtbar.',
    preferredPrimitives: ['PhysicalInvoice', 'PhysicalBanknote', 'PhysicalWasher'],
    motionPattern: 'value -> concrete cost mechanism -> reduced remainder',
    resultType: 'reduced-value',
  },
  rebalanceTransfer: {
    id: 'fn-rebalance-transfer',
    intent: 'Bestehender Wert wird zwischen bereits vorhandenen Töpfen neu gewichtet.',
    preferredPrimitives: ['PhysicalAccount', 'PhysicalBanknote', 'PhysicalCoinStack'],
    motionPattern: 'source decreases -> value travels -> destination increases',
    resultType: 'reweighted-state',
  },
  resultLock: {
    id: 'fn-result-lock',
    intent: 'Ein bereits erklärter Vorgang endet in einem klar bestätigten und stabilen Zielzustand.',
    preferredPrimitives: ['PhysicalAccount', 'PhysicalObject'],
    motionPattern: 'moving result -> settle -> confirmation -> hold',
    resultType: 'confirmed-state',
  },
  allocationSplit: {
    id: 'fn-allocation-split',
    intent: 'Ein Betrag oder Bestand wird in mehrere klar definierte Anteile aufgeteilt.',
    preferredPrimitives: ['PhysicalBanknote', 'PhysicalCoinStack', 'PhysicalObject'],
    motionPattern: 'single source -> physical split -> distinct destinations',
    resultType: 'split-allocation',
  },
  accountTransfer: {
    id: 'fn-account-transfer',
    intent: 'Geld verlässt einen konkreten Ort und kommt an einem anderen Ort an.',
    preferredPrimitives: ['PhysicalAccount', 'PhysicalBanknote'],
    motionPattern: 'source reacts -> transfer unit travels -> destination absorbs',
    resultType: 'destination-funded',
  },
  shockBuffer: {
    id: 'fn-shock-buffer',
    intent: 'Reserve, Versicherung oder Puffer fängt einen negativen externen Schock ab.',
    preferredPrimitives: ['PhysicalReserveTank', 'PhysicalInvoice', 'PhysicalAccount'],
    motionPattern: 'external shock -> buffer absorbs -> protected target remains stable',
    resultType: 'protected-state',
  },
  comparisonMass: {
    id: 'fn-comparison-mass',
    intent: 'Zwei Optionen entwickeln sich sichtbar zu unterschiedlichen Endbeständen.',
    preferredPrimitives: ['PhysicalCoinStack', 'PhysicalAccount'],
    motionPattern: 'same baseline -> divergent change -> visible size difference',
    resultType: 'comparative-result',
  },
  timeCompounding: {
    id: 'fn-time-compounding',
    intent: 'Zeit ist die zentrale Ursache dafür, dass derselbe Bestand über mehrere Zeitpunkte wächst.',
    preferredPrimitives: ['PhysicalCalendarPage', 'PhysicalCoinStack', 'PhysicalAccount'],
    motionPattern: 'time advances -> same principal persists -> result compounds',
    resultType: 'time-amplified-value',
  },
  positiveResolution: {
    id: 'fn-positive-resolution',
    intent: 'Eine konkrete Handlung überführt einen problematischen Zustand in einen stabilen Zielzustand.',
    preferredPrimitives: ['PhysicalObject', 'PhysicalAccount', 'PhysicalReserveTank'],
    motionPattern: 'problem state -> concrete corrective action -> stable positive result',
    resultType: 'resolved-state',
  },
} as const;

export type FinanzNeoMechanicKey = keyof typeof FINANZNEO_MECHANICS;
export type FinanzNeoMechanicId = (typeof FINANZNEO_MECHANICS)[FinanzNeoMechanicKey]['id'];

export const FINANZNEO_MECHANIC_IDS = Object.values(FINANZNEO_MECHANICS).map((mechanic) => mechanic.id) as FinanzNeoMechanicId[];

export const getFinanzNeoMechanic = (id: string) =>
  Object.values(FINANZNEO_MECHANICS).find((mechanic) => mechanic.id === id);
