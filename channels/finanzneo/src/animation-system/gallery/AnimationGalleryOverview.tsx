import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FINANCE_ANIMATION_GALLERY_ITEMS} from './AnimationGallery';

const SOURCE_WIDTH = 1080;
const SOURCE_HEIGHT = 1920;
const PREVIEW_HEIGHT = 790;
const PREVIEW_SCALE = PREVIEW_HEIGHT / SOURCE_HEIGHT;
const PREVIEW_WIDTH = SOURCE_WIDTH * PREVIEW_SCALE;

/**
 * Kontaktbogen für die visuelle Prüfung aller vorbereiteten Templates.
 * Jedes Template wird in seiner ursprünglichen 9:16-Fläche gerendert und
 * anschließend nur für die Übersicht skaliert.
 */
export const AnimationGalleryOverview: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'linear-gradient(180deg, #030805 0%, #07120B 100%)',
      color: '#F5F7F4',
      padding: 72,
      boxSizing: 'border-box',
      fontFamily: 'Inter, Arial, sans-serif',
    }}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gridTemplateRows: 'repeat(4, minmax(0, 1fr))',
        gap: 24,
        width: '100%',
        height: '100%',
      }}
    >
      {FINANCE_ANIMATION_GALLERY_ITEMS.map((item, index) => (
        <div
          key={item.name}
          style={{
            minWidth: 0,
            minHeight: 0,
            borderRadius: 30,
            padding: '18px 20px 20px',
            background: 'rgba(10,31,18,0.94)',
            border: '1px solid rgba(92,255,154,0.2)',
            boxShadow: '0 18px 48px rgba(0,0,0,0.24)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: 42,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              fontSize: 24,
              fontWeight: 850,
              letterSpacing: 0.2,
            }}
          >
            <span>{item.name}</span>
            <span style={{color: '#5CFF9A', fontVariantNumeric: 'tabular-nums'}}>
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <div
            style={{
              position: 'relative',
              width: PREVIEW_WIDTH,
              height: PREVIEW_HEIGHT,
              margin: '6px auto 0',
              overflow: 'hidden',
              borderRadius: 20,
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
              {item.render()}
            </div>
          </div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
