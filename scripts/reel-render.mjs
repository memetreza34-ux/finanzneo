#!/usr/bin/env node
import { spawnSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, basename } from 'path';

function showHelp() {
  console.log(`
Usage:
  node scripts/reel-render.mjs <reelPath> [options]

Arguments:
  <reelPath>          Path to the reel directory (e.g. reels/2026-08-10_bis_2026-08-16/mittwoch/reel-01_etf-vs-fonds-kosten-v2)

Options:
  --scale=<X>         Set the scale for Remotion render (e.g. --scale=0.5 for preview)
  --post-render       Enable QA mode flag
  --composition=<ID>  Override the composition ID
  --help              Show this help message
`);
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

const reelPath = args[0];
if (reelPath.startsWith('--')) {
  console.error("Error: First argument must be the reel path.");
  showHelp();
  process.exit(1);
}

let scale = null;
let postRender = false;
let compositionOverride = null;

for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith('--scale=')) {
    scale = arg.split('=')[1];
  } else if (arg === '--post-render') {
    postRender = true;
  } else if (arg.startsWith('--composition=')) {
    compositionOverride = arg.split('=')[1];
  } else if (arg === '--composition' && i + 1 < args.length) {
    compositionOverride = args[++i];
  }
}

// Check scene-index.json
const sceneIndexPath = join(reelPath, '03-szenen', 'scene-index.json');
let compositionId = compositionOverride;

if (!compositionId) {
  let extractedTitle = null;
  if (existsSync(sceneIndexPath)) {
    try {
      const sceneData = JSON.parse(readFileSync(sceneIndexPath, 'utf-8'));
      if (sceneData.title) {
        extractedTitle = sceneData.title;
      }
    } catch (err) {
      console.warn("Could not read scene-index.json:", err.message);
    }
  }

  // Also check ProductionCompositions.tsx
  const compPath = join(process.cwd(), 'src', 'root', 'ProductionCompositions.tsx');
  if (existsSync(compPath)) {
    const compData = readFileSync(compPath, 'utf-8');
    const compositionIds = [];
    const regex = /<Composition\s+id="([^"]+)"/g;
    let match;
    while ((match = regex.exec(compData)) !== null) {
      compositionIds.push(match[1]);
    }

    if (extractedTitle) {
      // Try to convert title to PascalCase
      const pascalTitle = extractedTitle.replace(/[-_ ]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toUpperCase());
      if (compositionIds.includes(pascalTitle)) {
        compositionId = pascalTitle;
      }
    }

    if (!compositionId) {
      // Fallback heuristic: Try to match folder name to Composition ID
      const folderName = basename(reelPath).toLowerCase().replace(/^(reel-\d+_)/, ''); // e.g. etf-vs-fonds-kosten-v2
      const folderWords = folderName.split(/[-_]/);
      let bestMatch = null;
      let bestScore = 0;

      for (const id of compositionIds) {
        const idLower = id.toLowerCase();
        let score = 0;
        for (const word of folderWords) {
          if (word.length > 2 && idLower.includes(word)) {
            score++;
          }
        }
        if (score > bestScore) {
          bestScore = score;
          bestMatch = id;
        }
      }

      if (bestMatch && bestScore > 0) {
        compositionId = bestMatch;
        console.log(\`Heuristically selected composition ID: \${compositionId} (Score: \${bestScore})\`);
      }
    }
  }
}

if (!compositionId) {
  console.error("Error: Could not determine Composition ID automatically.");
  console.error("Please provide it using --composition <ID>");
  process.exit(1);
}

const reelFolderName = basename(reelPath);
const isPreview = scale !== null;
const suffix = isPreview ? '-preview.mp4' : '.mp4';
const outputFile = join(reelPath, reelFolderName + suffix);

console.log(\`Rendering Composition: \${compositionId}\`);
console.log(\`Output: \${outputFile}\`);

const remotionArgs = ['remotion', 'render', 'src/index.ts', compositionId, outputFile];
if (scale !== null) {
  remotionArgs.push(\`--scale=\${scale}\`);
}
// Note: postRender flag does not go to remotion itself, per the requirements it's a "QA mode flag" maybe we pass it or just ignore for remotion.
// I will not pass --post-render to remotion, just note it.
if (postRender) {
  console.log("QA Mode: --post-render flag provided.");
  // Add any QA steps if needed here, or if the actual remotion command accepts it? 
  // Remotion CLI does not have a --post-render flag, so we'll just log it or pass it.
  // The instruction said: "Accept optional flags: --scale=0.5 (preview), --post-render (QA mode)"
  // "Derive output filename... Run: npx remotion render ..."
}

console.log(\`Running: npx \${remotionArgs.join(' ')}\`);
const result = spawnSync('npx', remotionArgs, { stdio: 'inherit' });

if (result.error) {
  console.error("Failed to start remotion:", result.error);
  process.exit(1);
}

if (result.status !== 0) {
  console.error(\`Render failed with exit code \${result.status}\`);
  process.exit(result.status);
}

console.log("Render completed successfully.");
