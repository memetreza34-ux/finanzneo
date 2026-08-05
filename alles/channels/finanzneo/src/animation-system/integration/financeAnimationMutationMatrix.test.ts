import {describe, expect, it} from 'vitest';
import type {
  FinanceAnimationData,
  FinanceAnimationScene,
  FinanceAnimationTemplate,
} from '../contracts';
import {FINANCE_ANIMATION_FIXTURES} from '../fixtures';
import {FINANCE_ANIMATION_INPUT_LIMITS} from '../inputLimits';
import {parseFinanceAnimationScene} from '../ingestion';
import {FINANCE_ANIMATION_REQUIRED_DATA} from '../templates/requiredTemplateData';
import {FINANCE_ANIMATION_TEMPLATES} from '../templates/registry';

const jsonCopy = <TValue,>(value: TValue): TValue =>
  JSON.parse(JSON.stringify(value)) as TValue;

const withData = (
  scene: FinanceAnimationScene,
  data: FinanceAnimationData,
): FinanceAnimationScene => ({...scene, data});

const nextTemplate = (
  template: FinanceAnimationTemplate,
): FinanceAnimationTemplate => {
  const index = FINANCE_ANIMATION_TEMPLATES.findIndex(
    (definition) => definition.id === template,
  );
  return FINANCE_ANIMATION_TEMPLATES[
    (index + 1) % FINANCE_ANIMATION_TEMPLATES.length
  ]!.id;
};

describe('finance animation invalid mutation matrix', () => {
  it('rejects every fixture when each required field is removed individually', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      for (const requiredField of FINANCE_ANIMATION_REQUIRED_DATA[
        fixture.scene.template
      ]) {
        const mutated = jsonCopy(fixture.scene);
        const data = {...(mutated.data ?? {})};
        delete data[requiredField];

        const result = parseFinanceAnimationScene(withData(mutated, data));

        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.errors).toContain(`Pflichtwert fehlt: ${requiredField}`);
        }
      }
    }
  });

  it('rejects an unknown scalar field for every template', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const mutated = withData(jsonCopy(fixture.scene), {
        ...(jsonCopy(fixture.scene.data) ?? {}),
        unexpectedVisualValue: 42,
      });
      const result = parseFinanceAnimationScene(mutated);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors).toContain(
          `Unbekanntes Datenfeld für ${fixture.scene.template}: unexpectedVisualValue`,
        );
      }
    }
  });

  it('rejects every fixture when its data is assigned to another template', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const mutated: FinanceAnimationScene = {
        ...jsonCopy(fixture.scene),
        template: nextTemplate(fixture.scene.template),
      };
      const result = parseFinanceAnimationScene(mutated);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    }
  });

  it('rejects every fixture as an animation scene when mode is changed to image', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const result = parseFinanceAnimationScene({
        ...jsonCopy(fixture.scene),
        mode: 'image',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors).toContain(
          'Animationsszene benötigt den Modus hybrid oder full-animation.',
        );
      }
    }
  });

  it('rejects an oversized visible input label for every template', () => {
    const oversizedLabel = 'L'.repeat(
      FINANCE_ANIMATION_INPUT_LIMITS.maxLabelLength + 1,
    );

    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const result = parseFinanceAnimationScene({
        ...jsonCopy(fixture.scene),
        labels: [oversizedLabel],
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors).toContain(
          `Ein Label überschreitet ${FINANCE_ANIMATION_INPUT_LIMITS.maxLabelLength} Zeichen.`,
        );
      }
    }
  });

  it('rejects non-finite replacements for every numeric fixture field', () => {
    let checkedNumericFields = 0;

    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      for (const [field, value] of Object.entries(fixture.scene.data ?? {})) {
        if (typeof value !== 'number') continue;
        checkedNumericFields += 1;

        const result = parseFinanceAnimationScene(withData(
          jsonCopy(fixture.scene),
          {
            ...(jsonCopy(fixture.scene.data) ?? {}),
            [field]: Number.POSITIVE_INFINITY,
          },
        ));

        expect(result.ok).toBe(false);
      }
    }

    expect(checkedNumericFields).toBeGreaterThan(20);
  });

  it('keeps every unmodified canonical fixture valid after the mutation suite', () => {
    for (const fixture of FINANCE_ANIMATION_FIXTURES) {
      const result = parseFinanceAnimationScene(jsonCopy(fixture.scene));

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.template).toBe(fixture.scene.template);
      }
    }
  });
});
