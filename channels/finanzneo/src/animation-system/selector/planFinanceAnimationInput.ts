import type {FinanceAnimationRequest} from '../contracts';
import type {FinanceAnimationFeatureFlags} from '../featureFlags';
import {
  parseFinanceAnimationRequest,
  type FinanceAnimationParseResult,
} from '../ingestion';
import {
  planFinanceAnimationScene,
  planFinanceAnimationSceneWithFeatures,
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

const planParsedInput = (
  input: unknown,
  planner: (request: FinanceAnimationRequest) => FinanceAnimationPlanResult,
): FinanceAnimationInputPlanResult => {
  const parsed = parseFinanceAnimationRequest(input);
  if (!parsed.ok) return invalidInputResult(parsed);

  return {
    ok: true,
    request: parsed.value,
    plan: planner(parsed.value),
    warnings: parsed.warnings,
  };
};

/**
 * Sichere Planung für unbekannte KI- oder JSON-Eingaben.
 * Nur ein erfolgreich geparster Request erreicht Router und Planner.
 */
export const planFinanceAnimationInput = (
  input: unknown,
): FinanceAnimationInputPlanResult => planParsedInput(
  input,
  planFinanceAnimationScene,
);

/**
 * Sichere End-to-End-Simulation der späteren Aktivierung. Untrusted Input
 * durchläuft zuerst dieselbe Parsergrenze und anschließend Router, Planner und
 * Template-Validierung mit expliziten Testflags. Globale Produktionsflags
 * werden dabei nicht verändert.
 */
export const planFinanceAnimationInputWithFeatures = (
  input: unknown,
  features: FinanceAnimationFeatureFlags,
): FinanceAnimationInputPlanResult => planParsedInput(
  input,
  (request) => planFinanceAnimationSceneWithFeatures(request, features),
);
