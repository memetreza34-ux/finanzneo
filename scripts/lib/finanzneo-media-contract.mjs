// Gemeinsame Marken- und Google-Flow-Konstanten für Reel und YouTube.
// So können beide Formate unterschiedliche Seitenverhältnisse nutzen, ohne
// bei Bildwelt oder Agentenablauf auseinanderzulaufen.

export const WORLD_ID = 'finanzneo-connected-studio-v3';
export const WORLD_ID_MARKER = `FINANZNEO_WORLD_ID: ${WORLD_ID}`;
export const SERIES_LOCK_ID = 'finanzneo-same-world-v1';
export const SERIES_LOCK_MARKER = `FINANZNEO_SERIES_LOCK: ${SERIES_LOCK_ID}`;
export const FLOW_AGENT_PROTOCOL_ID = 'finanzneo-flow-sequential-v1';
export const FLOW_AGENT_PROTOCOL_MARKER = `FLOW_AGENT_PROTOCOL: ${FLOW_AGENT_PROTOCOL_ID}`;
