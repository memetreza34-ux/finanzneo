import React from 'react';
import {describe, expect, it} from 'vitest';
import {FINANCE_ANIMATION_GALLERY_ITEMS} from './AnimationGallery';
import {
  AnimationFrameMatrix,
  FINANCE_ANIMATION_FRAME_MATRIX_ITEMS,
  FINANCE_ANIMATION_REVIEW_CHECKPOINTS,
} from './AnimationFrameMatrix';

describe('AnimationFrameMatrix', () => {
  it('contains start, middle and end checkpoints', () => {
    expect(FINANCE_ANIMATION_REVIEW_CHECKPOINTS).toEqual([
      {id: 'start', label: 'Start', frame: 0},
      {id: 'middle', label: 'Mitte', frame: 90},
      {id: 'end', label: 'Ende', frame: 179},
    ]);
  });

  it('contains three visual states for every gallery template', () => {
    expect(FINANCE_ANIMATION_FRAME_MATRIX_ITEMS).toHaveLength(
      FINANCE_ANIMATION_GALLERY_ITEMS.length * 3,
    );

    for (const galleryItem of FINANCE_ANIMATION_GALLERY_ITEMS) {
      const matchingItems = FINANCE_ANIMATION_FRAME_MATRIX_ITEMS.filter(
        (item) => item.template === galleryItem.template,
      );
      expect(matchingItems.map((item) => item.checkpoint.id)).toEqual([
        'start',
        'middle',
        'end',
      ]);
    }
  });

  it('uses unique deterministic matrix keys', () => {
    const keys = FINANCE_ANIMATION_FRAME_MATRIX_ITEMS.map((item) => item.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('creates a renderable matrix component', () => {
    expect(React.isValidElement(<AnimationFrameMatrix />)).toBe(true);
  });
});
