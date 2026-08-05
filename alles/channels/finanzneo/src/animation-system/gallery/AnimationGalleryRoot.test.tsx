import React from 'react';
import {describe, expect, it} from 'vitest';
import {
  FINANCE_ANIMATION_CARD_DURATION,
  FINANCE_ANIMATION_GALLERY_DURATION,
} from './AnimationGallery';
import {FinanceAnimationGalleryRoot} from './AnimationGalleryRoot';

describe('FinanceAnimationGalleryRoot', () => {
  it('registers sequence, overview and frame matrix compositions', () => {
    const root = FinanceAnimationGalleryRoot({});
    expect(React.isValidElement(root)).toBe(true);
    if (!React.isValidElement<{children: React.ReactNode}>(root)) return;

    const compositions = React.Children.toArray(root.props.children)
      .filter(React.isValidElement) as Array<React.ReactElement<{
        id: string;
        durationInFrames: number;
        width: number;
        height: number;
        fps: number;
      }>>;

    expect(compositions.map((composition) => composition.props.id)).toEqual([
      'FinanceAnimationGallery',
      'FinanceAnimationGalleryOverview',
      'FinanceAnimationFrameMatrix',
    ]);
    expect(compositions[0]?.props.durationInFrames).toBe(
      FINANCE_ANIMATION_GALLERY_DURATION,
    );
    expect(compositions[1]?.props.durationInFrames).toBe(
      FINANCE_ANIMATION_CARD_DURATION,
    );
    expect(compositions[2]?.props.durationInFrames).toBe(1);
    expect(compositions[0]?.props.width).toBe(1080);
    expect(compositions[0]?.props.height).toBe(1920);
    expect(compositions[1]?.props.width).toBe(2160);
    expect(compositions[1]?.props.height).toBe(3840);
    expect(compositions[2]?.props.width).toBe(2160);
    expect(compositions[2]?.props.height).toBe(3840);
    expect(compositions.every((composition) => composition.props.fps === 30)).toBe(true);
  });
});
