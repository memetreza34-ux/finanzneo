#!/usr/bin/env node

import {validateVoiceoverProcessing} from './lib/voiceover-processing.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run audio:validate -- <reels/... oder youtube/...>');
  process.exit(1);
}

try {
  const result = validateVoiceoverProcessing(target);
  if (!result.ok) {
    console.error('\n✗ VOICEOVER-PACING NICHT FREIGEGEBEN');
    result.errors.forEach((error) => console.error(`- ${error}`));
    console.error('\nErst das Voiceover verarbeiten und die echten Wort-Timings aus voiceover.processed.wav neu erzeugen.');
    process.exit(1);
  }

  console.log('\n✓ VOICEOVER-PACING FREIGEGEBEN');
  console.log(`  Vertrag: ${result.project.standard.id}`);
  console.log(`  Master: ${result.project.outputFile}`);
  console.log('  Captions + Visual-Timeline: verarbeitetes Voiceover ist Timing-Autorität.');
  console.log('  Musik/SFX: vom Pacing-Prozess ausgeschlossen.');
} catch (error) {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
