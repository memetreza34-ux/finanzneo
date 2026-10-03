#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';

const path = 'scripts/scaffold-finanzneo-youtube.mjs';
let source = readFileSync(path, 'utf8');

const motionFrom = "motionStandard:{id:YOUTUBE_MOTION_STANDARD_ID,viewerChangeFirstRequired:true,openTechniqueSelection:true,";
const motionTo = "motionStandard:{id:YOUTUBE_MOTION_STANDARD_ID,viewerChangeFirstRequired:true,contentFirstTechniqueSelection:true,openTechniqueSelection:true,";
if (!source.includes(motionFrom)) throw new Error('motionStandard marker not found');
source = source.replace(motionFrom, motionTo);

if (!source.includes('horizontal 16:9 source image')) {
  source = source.replace(
    'Horizontal 16:9 source. Important subjects large enough for TV/laptop/mobile.',
    'horizontal 16:9 source image. Important subjects large enough for TV/laptop/mobile.'
  );
}

writeFileSync(path, source, 'utf8');
console.log('✓ YouTube V4 compatibility markers added.');
