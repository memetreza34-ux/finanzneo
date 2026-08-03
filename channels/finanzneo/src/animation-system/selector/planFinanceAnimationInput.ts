import type {
  FinanceAnimationRequest,
  FinanceAnimationTemplate,
} from '../contracts';
import type {FinanceAnimationFeatureFlags} from '../featureFlags';
import {
  parseFinanceAnimationRequest,
  type FinanceAnimationParseResult,
} from '../ingestion';
import {
  planFinanceAnimationScene,
  planFinanceAnimationSceneForTemplate,
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
 * Sichere manuelle Template-Auswahl für die erste Aktivierungsstufe.
 * Automatisches Routing kann deaktiviert bleiben; das untrusted Input-Objekt
 * durchläuft trotzdem Parser und vollständige Template-Validierung.
 */
export const planFinanceAnimationInputForTemplate = (
  input: unknown,
  template: FinanceAnimationTemplate,
  features: FinanceAnimationFeatureFlags,
): FinanceAnimationInputPlanResult => planParsedInput(
  input,
  (request) => planFinanceAnimationSceneForTemplate(
    request,
    template,
    features,
  ),
);

/**
 * Sichere End-to-End-Simulation der späteren automatischen Aktivierung.
 * Untrusted Input durchläuft zuerst dieselbe Parsergrenze und anschließend
 * Router, Planner und Template-Validierung mit expliziten Testflags. Globale
 * Produktionsflags werden dabei nicht verändert.
 */
export const planFinanceAnimationInputWithFeatures = (
  input: unknown,
  features: FinanceAnimationFeatureFlags,
): FinanceAnimationInputPlanResult => planParsedInput(
  input,
  (request) => planFinanceAnimationSceneWithFeatures(request, features),
);
