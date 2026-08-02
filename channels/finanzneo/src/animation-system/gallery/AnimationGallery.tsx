import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {FINANCE_ANIMATION_FIXTURES} from '../fixtures/financeAnimationFixtures';
import {FinanceAnimationRenderer} from '../render/FinanceAnimationRenderer';

export const FINANCE_ANIMATION_CARD_DURATION = 180;

export type FinanceAnimationGalleryItem = {
  readonly name: string;
  readonly template: string;
  readonly render: () => React.ReactNode;
};

/**
 * Die Galerie läuft bewusst durch denselben zentralen Renderer, der später
 * auch bei einer kontrollierten Produktionsanbindung verwendet würde.
 * Dadurch prüfen die Vorschauen nicht nur die Templates, sondern auch die
 * Datenabbildung und die vorgeschaltete Template-Validierung.
 */
export const FINANCE_ANIMATION_GALLERY_ITEMS: readonly FinanceAnimationGalleryItem[] =
  FINANCE_ANIMATION_FIXTURES.map((fixture) => ({
    name: fixture.name,
    template: fixture.scene.template,
    render: () => <FinanceAnimationRenderer scene={fixture.scene} />,
  }));

export const FINANCE_ANIMATION_GALLERY_DURATION =
  FINANCE_ANIMATION_GALLERY_ITEMS.length * FINANCE_ANIMATION_CARD_DURATION;

export const AnimationGallery: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#06110A'}}>
    {FINANCE_ANIMATION_GALLERY_ITEMS.map((item, index) => (
      <Sequence
        key={item.template}
        from={index * FINANCE_ANIMATION_CARD_DURATION}
        durationInFrames={FINANCE_ANIMATION_CARD_DURATION}
        name={item.name}
      >
        {item.render()}
      </Sequence>
    ))}
  </AbsoluteFill>
);
