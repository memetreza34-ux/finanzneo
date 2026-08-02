import React from 'react';
import {describe, expect, it} from 'vitest';
import {FINANCE_ANIMATION_FIXTURES} from '../fixtures/financeAnimationFixtures';
import {FINANCE_ANIMATION_TEMPLATES} from '../templates/registry';
import {
  FINANCE_ANIMATION_GALLERY_DURATION,
  FINANCE_ANIMATION_GALLERY_ITEMS,
  FINANCE_ANIMATION_CARD_DURATION,
} from './AnimationGallery';

describe('AnimationGallery', () => {
  it('contains one visual fixture for every registered template', () => {
    expect(FINANCE_ANIMATION_GALLERY_ITEMS).toHaveLength(
      FINANCE_ANIMATION_TEMPLATES.length,
    );
    expect(FINANCE_ANIMATION_GALLERY_ITEMS.map((item) => item.template)).toEqual(
      FINANCE_ANIMATION_TEMPLATES.map((item) => item.id),
    );
  });

  it('uses the canonical fixtures instead of separate gallery-only data', () => {
    expect(FINANCE_ANIMATION_GALLERY_ITEMS.map((item) => item.name)).toEqual(
      FINANCE_ANIMATION_FIXTURES.map((fixture) => fixture.name),
    );
  });

  it('uses unique names and template ids for all gallery items', () => {
    const names = FINANCE_ANIMATION_GALLERY_ITEMS.map((item) => item.name);
    const templates = FINANCE_ANIMATION_GALLERY_ITEMS.map((item) => item.template);
    expect(new Set(names).size).toBe(names.length);
    expect(new Set(templates).size).toBe(templates.length);
  });

  it('creates a valid central-renderer element for every gallery fixture', () => {
    for (const item of FINANCE_ANIMATION_GALLERY_ITEMS) {
      expect(React.isValidElement(item.render())).toBe(true);
    }
  });

  it('derives the total duration from item count and card duration', () => {
    expect(FINANCE_ANIMATION_GALLERY_DURATION).toBe(
      FINANCE_ANIMATION_GALLERY_ITEMS.length * FINANCE_ANIMATION_CARD_DURATION,
    );
  });
});
