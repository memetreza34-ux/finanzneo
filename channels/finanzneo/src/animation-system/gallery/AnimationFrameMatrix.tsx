import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {
  FINANCE_ANIMATION_CARD_DURATION,
  FINANCE_ANIMATION_GALLERY_ITEMS,
  type FinanceAnimationGalleryItem,
} from './AnimationGallery';

const SOURCE_WIDTH = 1080;
const SOURCE_HEIGHT = 1920;
const PREVIEW_HEIGHT = 500;
const PREVIEW_SCALE = PREVIEW_HEIGHT / SOURCE_HEIGHT;
const PREVIEW_WIDTH = SOURCE_WIDTH * PREVIEW_SCALE;

export type FinanceAnimationReviewCheckpoint = {
  readonly id: 'start' | 'middle' | 'end';
  readonly label: string;
  readonly frame: number;
};

export const FINANCE_ANIMATION_REVIEW_CHECKPOINTS: readonly FinanceAnimationReviewCheckpoint[] = [
  {id: 'start', label: 'Start', frame: 0},
  {
    id: 'middle',
    label: 'Mitte',
    frame: Math.floor(FINANCE_ANIMATION_CARD_DURATION / 2),
  },
  {
    id: 'end',
    label: 'Ende',
    frame: FINANCE_ANIMATION_CARD_DURATION - 1,
  },
] as const;

export type FinanceAnimationFrameMatrixItem = {
  readonly key: string;
  readonly templateName: string;
  readonly template: FinanceAnimationGalleryItem['template'];
  readonly checkpoint: FinanceAnimationReviewCheckpoint;
  readonly render: FinanceAnimationGalleryItem['render'];
};

export const FINANCE_ANIMATION_FRAME_MATRIX_ITEMS: readonly FinanceAnimationFrameMatrixItem[] =
  FINANCE_ANIMATION_GALLERY_ITEMS.flatMap((item) =>
    FINANCE_ANIMATION_REVIEW_CHECKPOINTS.map((checkpoint) => ({
      key: `${item.template}-${checkpoint.id}`,
      templateName: item.name,
      template: item.template,
      checkpoint,
      render: item.render,
    })),
  );

/**
 * Visueller QA-Kontaktbogen für Start-, Mittel- und Endframe jedes Templates.
 * Jede Zelle liegt in einer 180-Frame-Sequence mit originaler 9:16-Größe.
 * Dadurch erhalten `useVideoConfig()`-Aufrufer weiterhin die echte Szenendauer
 * und nicht die ein Frame lange Matrix-Composition. `freeze` setzt anschließend
 * den reproduzierbaren Prüfzeitpunkt.
 */
export const AnimationFrameMatrix: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'linear-gradient(180deg, #020604 0%, #07120B 100%)',
      color: '#F5F7F4',
      padding: 48,
      boxSizing: 'border-box',
      fontFamily: 'Inter, Arial, sans-serif',
    }}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
        gridTemplateRows: 'repeat(6, minmax(0, 1fr))',
        gap: 14,
        width: '100%',
        height: '100%',
      }}
    >
      {FINANCE_ANIMATION_FRAME_MATRIX_ITEMS.map((item, index) => (
        <div
          key={item.key}
          style={{
            minWidth: 0,
            minHeight: 0,
            borderRadius: 22,
            padding: '12px 12px 14px',
            background: 'rgba(10,31,18,0.95)',
            border: '1px solid rgba(92,255,154,0.18)',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              minHeight: 42,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              fontSize: 18,
              fontWeight: 850,
              lineHeight: 1.15,
            }}
          >
            <span>{item.templateName}</span>
            <span
              style={{
                flexShrink: 0,
                color: item.checkpoint.id === 'middle' ? '#5CFF9A' : '#F2C14E',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {item.checkpoint.label} · {item.checkpoint.frame}
            </span>
          </div>

          <div
            style={{
              position: 'relative',
              width: PREVIEW_WIDTH,
              height: PREVIEW_HEIGHT,
              margin: '8px auto 0',
              overflow: 'hidden',
              borderRadius: 14,
              background: '#07120B',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: SOURCE_WIDTH,
                height: SOURCE_HEIGHT,
                transform: `scale(${PREVIEW_SCALE})`,
                transformOrigin: 'top left',
              }}
            >
              <Sequence
                durationInFrames={FINANCE_ANIMATION_CARD_DURATION}
                width={SOURCE_WIDTH}
                height={SOURCE_HEIGHT}
                freeze={item.checkpoint.frame}
              >
                {item.render()}
              </Sequence>
            </div>
          </div>

          <div
            style={{
              marginTop: 7,
              textAlign: 'right',
              color: '#789083',
              fontSize: 15,
              fontWeight: 750,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {String(index + 1).padStart(2, '0')} / {FINANCE_ANIMATION_FRAME_MATRIX_ITEMS.length}
          </div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
