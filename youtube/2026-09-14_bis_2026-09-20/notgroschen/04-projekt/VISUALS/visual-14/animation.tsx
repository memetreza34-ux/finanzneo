import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, frameAt, Icon, MotionStage, PhysicalObject, progressBetween, YouTubePhysicalStage} from '../../motion-kit';

export const MECHANIC_ID = 'personal-risk-questionnaire';
export const VISUAL_TECHNIQUE_ID = 'question-to-profile-map';
export const COMPOSITION_FAMILY_ID = 'document-motion';
export const ANIMATION_NARRATIVE = {START:'Vier leere Karten', MECHANISM:'Jede Antwort legt eine Karte auf den Stapel und hebt den Pegel', RESULT:'Aus vier Antworten entsteht ein persoenliches Profil'};

const QUESTIONS = [
  {tag: 'Notfälle', icon: 'warning' as const},
  {tag: 'Fixkosten', icon: 'receipt' as const},
  {tag: 'Einkommen', icon: 'wallet' as const},
  {tag: 'Puffer', icon: 'clock' as const},
];

export const YouTubeVisual14Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Vier Antworten fallen als echte Karten auf einen Stapel. Die Hoehe des
  // Stapels IST das Profil — kein Haken, keine Checkliste, keine Ergebnistafel.
  const cards = QUESTIONS.map((question, index) => {
    const at = 0.10 + index * 0.16;
    const drop = progressBetween(frame, durationInFrames, at, at + 0.10);
    const settle = spring({frame: frame - frameAt(durationInFrames, at + 0.10), fps, config: {damping: 15, stiffness: 140}});
    return {...question, drop, settle, index};
  });

  const stacked = cards.reduce((sum, card) => sum + card.settle, 0);
  const profile = progressBetween(frame, durationInFrames, 0.74, 0.92);

  return <MotionStage>
    <YouTubePhysicalStage>
      {cards.map((card) => (
        <PhysicalObject
          key={card.tag}
          x={520}
          y={interpolate(card.drop, [0, 1], [200, 690 - card.index * 52])}
          width={520}
          height={70}
          material={card.settle > 0.5 ? 'positive' : 'neutral'}
          opacity={card.drop}
        >
          <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', paddingLeft: 28, fontSize: 32, fontWeight: 800}}>
            {card.tag}
          </div>
        </PhysicalObject>
      ))}
    </YouTubePhysicalStage>

    {cards.map((card) => (
      <div key={`${card.tag}-icon`} style={{
        position: 'absolute',
        left: 420,
        top: interpolate(card.drop, [0, 1], [206, 696 - card.index * 52]),
        opacity: card.drop,
      }}>
        <Icon name={card.icon} size={40} color={card.settle > 0.5 ? COLORS.green : COLORS.gray} stroke={2.1} />
      </div>
    ))}

    {/* Die Saeule rechts waechst mit jeder gelegten Karte. Sie ist das Ergebnis. */}
    <div style={{position: 'absolute', left: 1220, top: 300, width: 120, height: 450, borderRadius: 24, border: `3px solid ${COLORS.line}`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${(stacked / QUESTIONS.length) * 100}%`, backgroundColor: COLORS.green}} />
    </div>
    <div style={{position: 'absolute', left: 1180, top: 780, width: 200, textAlign: 'center', fontSize: 30, fontWeight: 900, color: COLORS.green, opacity: profile, transform: `translateY(${interpolate(profile, [0, 1], [14, 0])}px)`}}>
      dein Profil
    </div>
  </MotionStage>;
};
