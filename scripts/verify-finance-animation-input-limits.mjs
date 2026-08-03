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
  const limitsPath =
    'channels/finanzneo/src/animation-system/inputLimits.ts';
  const limits = await readRepositoryFile(limitsPath);
  requireTokens(limits, limitsPath, [
    'FinanceAnimationInputLimits',
    'Object.freeze',
    'maxTextLength',
    'maxLabels',
    'maxLabelLength',
    'maxDataFields',
    'maxStructuredArrayItems',
  ]);

  const parserPath =
    'channels/finanzneo/src/animation-system/ingestion/parseFinanceAnimationInput.ts';
  const parser = await readRepositoryFile(parserPath);
  requireTokens(parser, parserPath, [
    "import {FINANCE_ANIMATION_INPUT_LIMITS} from '../inputLimits';",
    "export {FINANCE_ANIMATION_INPUT_LIMITS} from '../inputLimits';",
    'FINANCE_ANIMATION_INPUT_LIMITS.maxTextLength',
    'FINANCE_ANIMATION_INPUT_LIMITS.maxLabels',
    'FINANCE_ANIMATION_INPUT_LIMITS.maxDataFields',
    'FINANCE_ANIMATION_INPUT_LIMITS.maxStructuredArrayItems',
  ]);
  if (parser.includes('export const FINANCE_ANIMATION_INPUT_LIMITS')) {
    fail('Der Parser definiert die Eingabegrenzen weiterhin doppelt.');
  }

  const validatorPath =
    'channels/finanzneo/src/animation-system/qa/validateAnimationScene.ts';
  const validator = await readRepositoryFile(validatorPath);
  requireTokens(validator, validatorPath, [
    "import {FINANCE_ANIMATION_INPUT_LIMITS} from '../inputLimits';",
    'message-too-long',
    'voice-text-too-long',
    'too-many-input-labels',
    'input-label-too-long',
    'too-many-data-fields',
  ]);

  const limitsTestPath =
    'channels/finanzneo/src/animation-system/inputLimits.test.ts';
  const limitsTest = await readRepositoryFile(limitsTestPath);
  requireTokens(limitsTest, limitsTestPath, [
    'is immutable at runtime',
    'defines finite positive technical boundaries',
    'uses one shared object in parser and typed validators',
    'PARSER_INPUT_LIMITS',
  ]);

  const validatorTestPath =
    'channels/finanzneo/src/animation-system/qa/validateAnimationScene.test.ts';
  const validatorTest = await readRepositoryFile(validatorTestPath);
  requireTokens(validatorTest, validatorTestPath, [
    'blockiert überlange Texte auch bei typisierten Direktaufrufen',
    'blockiert Labelanzahl und Labellänge über der Eingabegrenze',
    'blockiert zu viele Datenfelder bei typisierten Direktaufrufen',
  ]);

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`Finance animation input limit check failed: ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Finance animation input limit check passed.');
  console.log('Verified one immutable limit definition shared by parser and typed validators.');
};

run().catch((error) => {
  console.error(
    `Finance animation input limit check failed: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exitCode = 1;
});
