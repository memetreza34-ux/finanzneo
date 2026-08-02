import React from 'react';
import {describe, expect, it} from 'vitest';
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
  });

  it('uses unique names for all gallery items', () => {
    const names = FINANCE_ANIMATION_GALLERY_ITEMS.map((item) => item.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('creates a valid React element for every gallery fixture', () => {
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
