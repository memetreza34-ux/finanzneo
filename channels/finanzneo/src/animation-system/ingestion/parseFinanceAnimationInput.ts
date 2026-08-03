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

export const FINANCE_ANIMATION_FORBIDDEN_KEYS = Object.freeze([
  '__proto__',
  'prototype',
  'constructor',
] as const);

const FORBIDDEN_KEY_SET = new Set<string>(FINANCE_ANIMATION_FORBIDDEN_KEYS);
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

const uniqueMessages = (messages: readonly string[]): string[] =>
  [...new Set(messages)];

const copyPlainDataProperties = (
  value: Record<string, unknown>,
  scope: string,
  errors: string[],
): Record<string, unknown> => {
  const copy = Object.create(null) as Record<string, unknown>;
  const symbolKeys = Object.getOwnPropertySymbols(value);
  if (symbolKeys.length > 0) {
    errors.push(`${scope} enthält nicht unterstützte Symbol-Schlüssel.`);
  }

  const descriptors = Object.getOwnPropertyDescriptors(value);
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (FORBIDDEN_KEY_SET.has(key)) {
      errors.push(`${scope} verwendet den gesperrten Schlüssel ${key}.`);
      continue;
    }
    if (!('value' in descriptor)) {
      errors.push(`${scope} enthält einen Getter oder Setter: ${key}.`);
      continue;
    }
    copy[key] = descriptor.value;
  }
  return copy;
};

const parsePlainObject = (
  value: unknown,
  scope: string,
  errors: string[],
): Record<string, unknown> | undefined => {
  if (!isPlainRecord(value)) return undefined;
  return copyPlainDataProperties(value, scope, errors);
};

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

type StructuredEntryParseResult =
  | {ok: true; value: unknown}
  | {ok: false};

const parseStructuredArrayEntry = (
  value: unknown,
  path: string,
  errors: string[],
): StructuredEntryParseResult => {
  if (isAllowedScalar(value)) return {ok: true, value};

  const record = parsePlainObject(value, path, errors);
  if (!record) return {ok: false};

  const sanitized = Object.create(null) as Record<string, FinanceAnimationScalar>;
  let valid = true;
  for (const [key, entry] of Object.entries(record)) {
    if (!isAllowedScalar(entry)) {
      errors.push(`${path}.${key} enthält einen nicht unterstützten Wert.`);
      valid = false;
      continue;
    }
    sanitized[key] = entry;
  }

  return valid ? {ok: true, value: sanitized} : {ok: false};
};

const parseData = (
  value: unknown,
  errors: string[],
): FinanceAnimationData | undefined => {
  if (value === undefined) return undefined;
  const source = parsePlainObject(value, 'Animationsdaten', errors);
  if (!source) {
    errors.push('Animationsdaten müssen als einfaches Objekt vorliegen.');
    return undefined;
  }

  const entries = Object.entries(source);
  if (entries.length > FINANCE_ANIMATION_INPUT_LIMITS.maxDataFields) {
    errors.push(
      `Animationsdaten enthalten mehr als ${FINANCE_ANIMATION_INPUT_LIMITS.maxDataFields} Felder.`,
    );
  }

  const data = Object.create(null) as FinanceAnimationData;
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

      const parsedEntries: unknown[] = [];
      let valid = true;
      for (const [index, item] of entry.entries()) {
        const parsed = parseStructuredArrayEntry(
          item,
          `Animationsdatenfeld ${key}[${index}]`,
          errors,
        );
        if (!parsed.ok) {
          valid = false;
          continue;
        }
        parsedEntries.push(parsed.value);
      }

      if (!valid) {
        errors.push(
          `Animationsdatenfeld ${key} enthält verschachtelte oder nicht unterstützte Listenwerte.`,
        );
        continue;
      }
      data[key] = parsedEntries;
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
  return [...value];
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
  const requestInput = copyPlainDataProperties(
    input,
    'Animationsanfrage',
    structuralErrors,
  );

  if (typeof requestInput.message !== 'string') {
    structuralErrors.push('Kernaussage muss ein Text sein.');
  }
  if (typeof requestInput.voiceText !== 'string') {
    structuralErrors.push('Voiceover muss ein Text sein.');
  }
  validateTextLength(requestInput.message, 'Kernaussage', structuralErrors);
  validateTextLength(requestInput.voiceText, 'Voiceover', structuralErrors);

  const labels = parseLabels(requestInput.labels, structuralErrors);
  const data = parseData(requestInput.data, structuralErrors);

  let preferredTemplate: FinanceAnimationTemplate | undefined;
  if (requestInput.preferredTemplate !== undefined) {
    if (isTemplate(requestInput.preferredTemplate)) {
      preferredTemplate = requestInput.preferredTemplate;
    } else {
      structuralErrors.push('Bevorzugtes Animationstemplate ist unbekannt.');
    }
  }

  if (structuralErrors.length > 0) {
    return {ok: false, errors: uniqueMessages(structuralErrors), warnings: []};
  }

  const request: FinanceAnimationRequest = {
    message: requestInput.message as string,
    voiceText: requestInput.voiceText as string,
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
  const sceneInput = copyPlainDataProperties(input, 'Animationsszene', errors);
  if (sceneInput.mode !== 'hybrid' && sceneInput.mode !== 'full-animation') {
    errors.push('Animationsszene benötigt den Modus hybrid oder full-animation.');
  }
  if (!isTemplate(sceneInput.template)) {
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
    mode: sceneInput.mode as FinanceAnimationScene['mode'],
    template: sceneInput.template as FinanceAnimationTemplate,
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
