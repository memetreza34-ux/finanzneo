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

export const FINANCE_ANIMATION_INPUT_LIMITS = Object.freeze({
  maxTextLength: 5000,
  maxLabels: 20,
  maxLabelLength: 160,
  maxDataFields: 64,
  maxStructuredArrayItems: 50,
});

const TEMPLATE_IDS = new Set<string>(
  FINANCE_ANIMATION_TEMPLATES.map((definition) => definition.id),
);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isPlainRecord = (value: unknown): value is Record<string, unknown> => {
  if (!isRecord(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const isTemplate = (value: unknown): value is FinanceAnimationTemplate =>
  typeof value === 'string' && TEMPLATE_IDS.has(value);

const isAllowedScalar = (value: unknown): value is FinanceAnimationScalar =>
  value === null ||
  value === undefined ||
  typeof value === 'string' ||
  typeof value === 'boolean' ||
  (typeof value === 'number' && Number.isFinite(value));

const isSafeStructuredArrayEntry = (value: unknown): boolean => {
  if (isAllowedScalar(value)) return true;
  if (!isPlainRecord(value)) return false;
  return Object.values(value).every(isAllowedScalar);
};

const uniqueMessages = (messages: readonly string[]): string[] =>
  [...new Set(messages)];

const validateTextLength = (
  value: unknown,
  fieldName: string,
  errors: string[],
): void => {
  if (
    typeof value === 'string' &&
    value.length > FINANCE_ANIMATION_INPUT_LIMITS.maxTextLength
  ) {
    errors.push(
      `${fieldName} überschreitet ${FINANCE_ANIMATION_INPUT_LIMITS.maxTextLength} Zeichen.`,
    );
  }
};

const parseData = (
  value: unknown,
  errors: string[],
): FinanceAnimationData | undefined => {
  if (value === undefined) return undefined;
  if (!isPlainRecord(value)) {
    errors.push('Animationsdaten müssen als einfaches Objekt vorliegen.');
    return undefined;
  }

  const entries = Object.entries(value);
  if (entries.length > FINANCE_ANIMATION_INPUT_LIMITS.maxDataFields) {
    errors.push(
      `Animationsdaten enthalten mehr als ${FINANCE_ANIMATION_INPUT_LIMITS.maxDataFields} Felder.`,
    );
  }

  const data: FinanceAnimationData = {};
  for (const [key, entry] of entries) {
    if (isAllowedScalar(entry)) {
      data[key] = entry;
      continue;
    }

    if (Array.isArray(entry)) {
      if (entry.length > FINANCE_ANIMATION_INPUT_LIMITS.maxStructuredArrayItems) {
        errors.push(
          `Animationsdatenfeld ${key} enthält mehr als ${FINANCE_ANIMATION_INPUT_LIMITS.maxStructuredArrayItems} Listeneinträge.`,
        );
        continue;
      }
      if (!entry.every(isSafeStructuredArrayEntry)) {
        errors.push(
          `Animationsdatenfeld ${key} enthält verschachtelte oder nicht unterstützte Listenwerte.`,
        );
        continue;
      }
      data[key] = entry;
      continue;
    }

    errors.push(`Animationsdatenfeld ${key} enthält ein nicht unterstütztes Objekt.`);
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
  if (value.length > FINANCE_ANIMATION_INPUT_LIMITS.maxLabels) {
    errors.push(
      `Labels enthalten mehr als ${FINANCE_ANIMATION_INPUT_LIMITS.maxLabels} Einträge.`,
    );
  }
  if (!value.every((label) => typeof label === 'string')) {
    errors.push('Jedes Label muss ein Text sein.');
    return undefined;
  }
  if (
    value.some(
      (label) => label.length > FINANCE_ANIMATION_INPUT_LIMITS.maxLabelLength,
    )
  ) {
    errors.push(
      `Ein Label überschreitet ${FINANCE_ANIMATION_INPUT_LIMITS.maxLabelLength} Zeichen.`,
    );
  }
  return value;
};

export const parseFinanceAnimationRequest = (
  input: unknown,
): FinanceAnimationParseResult<FinanceAnimationRequest> => {
  if (!isPlainRecord(input)) {
    return {
      ok: false,
      errors: ['Animationsanfrage muss als einfaches Objekt vorliegen.'],
      warnings: [],
    };
  }

  const structuralErrors: string[] = [];
  if (typeof input.message !== 'string') {
    structuralErrors.push('Kernaussage muss ein Text sein.');
  }
  if (typeof input.voiceText !== 'string') {
    structuralErrors.push('Voiceover muss ein Text sein.');
  }
  validateTextLength(input.message, 'Kernaussage', structuralErrors);
  validateTextLength(input.voiceText, 'Voiceover', structuralErrors);

  const labels = parseLabels(input.labels, structuralErrors);
  const data = parseData(input.data, structuralErrors);

  let preferredTemplate: FinanceAnimationTemplate | undefined;
  if (input.preferredTemplate !== undefined) {
    if (isTemplate(input.preferredTemplate)) {
      preferredTemplate = input.preferredTemplate;
    } else {
      structuralErrors.push('Bevorzugtes Animationstemplate ist unbekannt.');
    }
  }

  if (structuralErrors.length > 0) {
    return {ok: false, errors: uniqueMessages(structuralErrors), warnings: []};
  }

  const request: FinanceAnimationRequest = {
    message: input.message as string,
    voiceText: input.voiceText as string,
    ...(labels ? {labels} : {}),
    ...(data ? {data} : {}),
    ...(preferredTemplate ? {preferredTemplate} : {}),
  };
  const genericIssues = validateAnimationScene(request);
  const errors = genericIssues
    .filter((issue) => issue.level === 'error')
    .map((issue) => issue.message);
  const warnings = genericIssues
    .filter((issue) => issue.level === 'warning')
    .map((issue) => issue.message);

  if (errors.length > 0) {
    return {
      ok: false,
      errors: uniqueMessages(errors),
      warnings: uniqueMessages(warnings),
    };
  }

  return {
    ok: true,
    value: request,
    warnings: uniqueMessages(warnings),
  };
};

export const parseFinanceAnimationScene = (
  input: unknown,
): FinanceAnimationParseResult<FinanceAnimationScene> => {
  const requestResult = parseFinanceAnimationRequest(input);
  if (!requestResult.ok) return requestResult;
  if (!isPlainRecord(input)) {
    return {
      ok: false,
      errors: ['Animationsszene muss als einfaches Objekt vorliegen.'],
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
    return {
      ok: false,
      errors: uniqueMessages(errors),
      warnings: requestResult.warnings,
    };
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
    ...requestResult.warnings,
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
