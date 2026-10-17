// Claude Motion Test 01 (tests/claude-motion): die Szene lebt als wiederverwendbarer
// Baustein unter src/youtube-motion/szenen/AboJahr.tsx.
import brief from '../../../tests/claude-motion/brief.json';
import {AboJahr} from '../szenen/AboJahr';

if (brief.monthly_cents !== 999 || brief.months !== 12) throw new Error('AboJahr rechnet mit 999 Cent × 12 — Brief geändert?');

export const SubscriptionYearTest = AboJahr;
