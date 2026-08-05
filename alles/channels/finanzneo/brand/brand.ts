// FinanzNeo — Kanal-Identität (Brand + Theme). Baut auf @studio/core, setzt das Eigene.
import { C, FONT } from '@studio/core';

export const BRAND = {
  name:     'FinanzNeo',
  handle:   '@Finanz_Neo',
  topic:    'Finanzen für Anfänger (Gesetze, Steuern, Investieren)',
  voice:    'professionell aber nahbar — immer „du"',
  font:     FONT,
  // Theme (für <ThemeProvider value={BRAND}>):
  accent:   C.green,         // 🟢 Grün — Wachstum (Signatur dieses Kanals)
  accentDk: C.greenDk,
  bg:       '#0A1A0F',       // dunkelgrün (FinanzNeo-eigen)
  bgDeep:   '#06120A',
} as const;
