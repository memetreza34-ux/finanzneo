import {readFile} from 'node:fs/promises';
import process from 'node:process';

const repositoryRoot = new URL('../', import.meta.url);
const readRepositoryFile = async (relativePath) =>
  readFile(new URL(relativePath, repositoryRoot), 'utf8');

const failures = [];
const fail = (message) => failures.push(message);

const requireTokens = (content, filePath, tokens) => {
  for (const token of tokens) {
    if (!content.includes(token)) {
      fail(`${filePath} enthält ${token} nicht.`);
    }
  }
};

const run = async () => {
  const parserPath =
    'channels/finanzneo/src/animation-system/ingestion/parseFinanceAnimationInput.ts';
  const parser = await readRepositoryFile(parserPath);
  requireTokens(parser, parserPath, [
    'const freezeArray',
    'const freezeRecord',
    'freezeRecord(sanitized)',
    'data[key] = freezeArray(parsedEntries)',
    'return freezeRecord(data)',
    'return freezeArray([...value])',
    'const request = Object.freeze({',
    'const scene = Object.freeze({',
  ]);

  const immutabilityTestPath =
    'channels/finanzneo/src/animation-system/ingestion/parseFinanceAnimationImmutability.test.ts';
  const immutabilityTest = await readRepositoryFile(immutabilityTestPath);
  requireTokens(immutabilityTest, immutabilityTestPath, [
    'freezes parsed request, labels, data arrays and structured entries',
    'freezes a fully validated animation scene',
    'does not share mutable containers with the original input',
    'cannot be changed by mutating the original input after parsing',
    'Object.isFrozen',
  ]);

  const safeRendererPath =
    'channels/finanzneo/src/animation-system/render/SafeFinanceAnimationRenderer.tsx';
  const safeRenderer = await readRepositoryFile(safeRendererPath);
  requireTokens(safeRenderer, safeRendererPath, [
    'errors: Object.freeze([...result.errors])',
    'warnings: Object.freeze([...result.warnings])',
  ]);

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`Finance animation parser immutability check failed: ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Finance animation parser immutability check passed.');
  console.log('Verified frozen copied requests, scenes, labels, data arrays and structured entries.');
};

run().catch((error) => {
  console.error(
    `Finance animation parser immutability check failed: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exitCode = 1;
});
