import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {
  getFinanceAnimationLibraryCategory,
  getFinanceAnimationLibraryItemsByBatch,
} from './catalog';

export const FINANCE_ANIMATION_LIBRARY_BATCH_FOUR_ITEMS = getFinanceAnimationLibraryItemsByBatch(4);
export const FINANCE_ANIMATION_LIBRARY_BATCH_FOUR_ITEM_DURATION = 180;
export const FINANCE_ANIMATION_LIBRARY_BATCH_FOUR_DURATION =
  FINANCE_ANIMATION_LIBRARY_BATCH_FOUR_ITEMS.length * FINANCE_ANIMATION_LIBRARY_BATCH_FOUR_ITEM_DURATION;

export const FinanceAnimationLibraryBatchFourGallery: React.FC = () => (
  <AbsoluteFill style={{background: '#06110A'}}>
    {FINANCE_ANIMATION_LIBRARY_BATCH_FOUR_ITEMS.map((item, index) => (
      <Sequence
        key={item.id}
        from={index * FINANCE_ANIMATION_LIBRARY_BATCH_FOUR_ITEM_DURATION}
        durationInFrames={FINANCE_ANIMATION_LIBRARY_BATCH_FOUR_ITEM_DURATION}
        name={`${getFinanceAnimationLibraryCategory(item.category)?.title ?? item.category} · ${item.name}`}
      >
        {item.renderDemo()}
      </Sequence>
    ))}
  </AbsoluteFill>
);

const SOURCE_WIDTH = 1080;
const SOURCE_HEIGHT = 1920;
const CELL_WIDTH = 190;
const CELL_HEIGHT = 338;
const PREVIEW_SCALE = Math.min(CELL_WIDTH / SOURCE_WIDTH, CELL_HEIGHT / SOURCE_HEIGHT);

export const FinanceAnimationLibraryBatchFourOverview: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'linear-gradient(180deg, #030805 0%, #07120B 100%)',
      padding: 54,
      boxSizing: 'border-box',
      color: '#F5F7F4',
      fontFamily: 'Inter, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 28}}>
      <div>
        <div style={{fontSize: 24, letterSpacing: 2.4, color: '#5CFF9A', fontWeight: 850}}>FINANZNEO</div>
        <div style={{fontSize: 52, fontWeight: 950, marginTop: 6}}>Animationsbibliothek · Batch 4</div>
      </div>
      <div style={{fontSize: 25, color: '#AFC0B4'}}>{FINANCE_ANIMATION_LIBRARY_BATCH_FOUR_ITEMS.length} neue Animationen</div>
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
        gap: 24,
        flex: 1,
        minHeight: 0,
      }}
    >
      {FINANCE_ANIMATION_LIBRARY_BATCH_FOUR_ITEMS.map((item, index) => {
        const category = getFinanceAnimationLibraryCategory(item.category);
        return (
          <div
            key={item.id}
            style={{
              minWidth: 0,
              minHeight: 0,
              borderRadius: 28,
              padding: '16px 18px 18px',
              background: 'rgba(10,31,18,0.94)',
              border: '1px solid rgba(92,255,154,0.18)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start'}}>
              <div>
                <div style={{fontSize: 16, color: '#5CFF9A', fontWeight: 800, letterSpacing: 1.2}}>{category?.title}</div>
                <div style={{fontSize: 24, fontWeight: 900, marginTop: 3}}>{item.name}</div>
              </div>
              <div style={{fontSize: 20, fontWeight: 900, color: '#AFC0B4'}}>{String(index + 1).padStart(2, '0')}</div>
            </div>

            <div
              style={{
                position: 'relative',
                width: CELL_WIDTH,
                height: CELL_HEIGHT,
                margin: '10px auto 0',
                overflow: 'hidden',
                borderRadius: 16,
                background: '#06110A',
                flex: '0 0 auto',
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
                <Sequence durationInFrames={FINANCE_ANIMATION_LIBRARY_BATCH_FOUR_ITEM_DURATION} width={SOURCE_WIDTH} height={SOURCE_HEIGHT}>
                  {item.renderDemo()}
                </Sequence>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </AbsoluteFill>
);
