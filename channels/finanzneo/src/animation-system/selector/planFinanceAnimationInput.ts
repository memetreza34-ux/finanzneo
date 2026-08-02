import type {FinanceAnimationRequest} from '../contracts';
import {
  parseFinanceAnimationRequest,
  type FinanceAnimationParseResult,
} from '../ingestion';
import {
  planFinanceAnimationScene,
  type FinanceAnimationPlanResult,
} from './planFinanceAnimationScene';

export type FinanceAnimationInputPlanResult =
  | {
      ok: true;
      request: FinanceAnimationRequest;
      plan: FinanceAnimationPlanResult;
      warnings: string[];
    }
  | {
      ok: false;
      errors: string[];
      warnings: string[];
    };

const invalidInputResult = (
  result: Extract<FinanceAnimationParseResult<FinanceAnimationRequest>, {ok: false}>,
): FinanceAnimationInputPlanResult => ({
  ok: false,
  errors: result.errors,
  warnings: result.warnings,
});

/**
 * Sichere Planung für unbekannte KI- oder JSON-Eingaben.
 * Nur ein erfolgreich geparster Request erreicht Router und Planner.
 */
export const planFinanceAnimationInput = (
  input: unknown,
): FinanceAnimationInputPlanResult => {
  const parsed = parseFinanceAnimationRequest(input);
  if (!parsed.ok) return invalidInputResult(parsed);

  return {
    ok: true,
    request: parsed.value,
    plan: planFinanceAnimationScene(parsed.value),
    warnings: parsed.warnings,
  };
};
