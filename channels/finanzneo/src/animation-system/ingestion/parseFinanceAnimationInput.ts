import type {
  FinanceAnimationData,
  FinanceAnimationRequest,
  FinanceAnimationScalar,
  FinanceAnimationScene,
  FinanceAnimationTemplate,
} from '../contracts';
import {validateAnimationScene} from '../qa/validateAnimationScene';
import {validateTemplateData} from '../render/validateTemplateData';
import {FINANCE_ANIMATION_TEMPLATES} from '../templates/registry';

export type FinanceAnimationParseResult<TValue> =
  | {
      ok: true;
      value: TValue;
      warnings: string[];
    }
  | {
      ok: false;
      errors: string[];
      warnings: string[];
    };

const TEMPLATE_IDS = new Set<string>(
  FINANCE_ANIMATION_TEMPLATES.map((definition) => definition.id),
);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isTemplate = (value: unknown): value is FinanceAnimationTemplate =>
  typeof value === 'string' && TEMPLATE_IDS.has(value);

const isAllowedScalar = (value: unknown): value is FinanceAnimationScalar =>
  value === null ||
  value === undefined ||
  typeof value === 'string' ||
  typeof value === 'boolean' ||
  (typeof value === 'number' && Number.isFinite(value));

const uniqueMessages = (messages: readonly string[]): string[] =>
  [...new Set(messages)];

const parseData = (
  value: unknown,
  errors: string[],
): FinanceAnimationData | undefined => {
  if (value === undefined) return undefined;
  if (!isRecord(value)) {
    errors.push('Animationsdaten müssen als Objekt vorliegen.');
    return undefined;
  }

  const data: FinanceAnimationData = {};
  for (const [key, entry] of Object.entries(value)) {
    if (isAllowedScalar(entry) || Array.isArray(entry)) {
      data[key] = entry;
    } else {
      errors.push(`Animationsdatenfeld ${key} enthält ein nicht unterstütztes Objekt.`);
    }
  }
  return data;
};

const parseLabels = (
  value: unknown,
  errors: string[],
): string[] | undefined => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) {
    errors.push('Labels müssen als Textliste vorliegen.');
    return undefined;
  }
  if (!value.every((label) => typeof label === 'string')) {
    errors.push('Jedes Label muss ein Text sein.');
    return undefined;
  }
  return value;
};

export const parseFinanceAnimationRequest = (
  input: unknown,
): FinanceAnimationParseResult<FinanceAnimationRequest> => {
  if (!isRecord(input)) {
    return {
      ok: false,
      errors: ['Animationsanfrage muss als Objekt vorliegen.'],
      warnings: [],
    };
  }

  const errors: string[] = [];
  if (typeof input.message !== 'string') {
    errors.push('Kernaussage muss ein Text sein.');
  }
  if (typeof input.voiceText !== 'string') {
    errors.push('Voiceover muss ein Text sein.');
  }

  const labels = parseLabels(input.labels, errors);
  const data = parseData(input.data, errors);

  let preferredTemplate: FinanceAnimationTemplate | undefined;
  if (input.preferredTemplate !== undefined) {
    if (isTemplate(input.preferredTemplate)) {
      preferredTemplate = input.preferredTemplate;
    } else {
      errors.push('Bevorzugtes Animationstemplate ist unbekannt.');
    }
  }

  if (errors.length > 0) {
    return {ok: false, errors: uniqueMessages(errors), warnings: []};
  }

  return {
    ok: true,
    value: {
      message: input.message as string,
      voiceText: input.voiceText as string,
      ...(labels ? {labels} : {}),
      ...(data ? {data} : {}),
      ...(preferredTemplate ? {preferredTemplate} : {}),
    },
    warnings: [],
  };
};

export const parseFinanceAnimationScene = (
  input: unknown,
): FinanceAnimationParseResult<FinanceAnimationScene> => {
  const requestResult = parseFinanceAnimationRequest(input);
  if (!requestResult.ok) return requestResult;
  if (!isRecord(input)) {
    return {
      ok: false,
      errors: ['Animationsszene muss als Objekt vorliegen.'],
      warnings: [],
    };
  }

  const errors: string[] = [];
  if (input.mode !== 'hybrid' && input.mode !== 'full-animation') {
    errors.push('Animationsszene benötigt den Modus hybrid oder full-animation.');
  }
  if (!isTemplate(input.template)) {
    errors.push('Animationsszene enthält ein unbekanntes Template.');
  }
  if (errors.length > 0) {
    return {ok: false, errors: uniqueMessages(errors), warnings: []};
  }

  const scene: FinanceAnimationScene = {
    ...requestResult.value,
    mode: input.mode as FinanceAnimationScene['mode'],
    template: input.template as FinanceAnimationTemplate,
  };

  const genericIssues = validateAnimationScene(scene);
  const templateValidation = validateTemplateData(scene);
  const validationErrors = [
    ...genericIssues
      .filter((issue) => issue.level === 'error')
      .map((issue) => issue.message),
    ...templateValidation.errors,
  ];
  const warnings = [
    ...genericIssues
      .filter((issue) => issue.level === 'warning')
      .map((issue) => issue.message),
    ...templateValidation.warnings,
  ];

  if (validationErrors.length > 0) {
    return {
      ok: false,
      errors: uniqueMessages(validationErrors),
      warnings: uniqueMessages(warnings),
    };
  }

  return {
    ok: true,
    value: scene,
    warnings: uniqueMessages(warnings),
  };
};
