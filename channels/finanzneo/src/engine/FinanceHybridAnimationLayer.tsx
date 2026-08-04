import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {
  SafeFinanceAnimationRenderer,
  type FinanceAnimationFallbackContext,
} from '../animation-system/activation';
import type {FinanceScenePlan} from './contracts';

export type FinanceHybridAnimationPresentation =
  | 'replace-image'
  | 'framed';

export type FinanceHybridAnimationAssignment = {
  readonly input: unknown;
  readonly presentation?: FinanceHybridAnimationPresentation;
  readonly debugLabel?: string;
};

export type FinanceHybridAnimationAssignments = Readonly<
  Record<string, FinanceHybridAnimationAssignment | undefined>
>;

export type FinanceHybridAnimationLayerProps = {
  plan: FinanceScenePlan;
  assignments?: FinanceHybridAnimationAssignments;
  showDebugLabels?: boolean;
};

export const getFinanceHybridAnimatedSceneIds = (
  assignments?: FinanceHybridAnimationAssignments,
): ReadonlySet<string> => new Set(
  Object.entries(assignments ?? {})
    .filter(([, assignment]) => assignment !== undefined)
    .map(([sceneId]) => sceneId),
);

const HybridAnimationFallback: React.FC<{
  sceneId: string;
  context: FinanceAnimationFallbackContext;
}> = ({sceneId, context}) => (
  <AbsoluteFill
    style={{
      background: 'linear-gradient(180deg, #111A14 0%, #07120B 100%)',
      color: '#F5F7F4',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 72,
      boxSizing: 'border-box',
      textAlign: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
    }}
  >
    <div style={{fontSize: 28, color: '#F2C14E', fontWeight: 900, letterSpacing: 2}}>
      BILDMODUS AKTIV
    </div>
    <div style={{fontSize: 58, fontWeight: 950, marginTop: 22}}>
      Animation für {sceneId} wurde sicher blockiert
    </div>
    <div style={{fontSize: 28, color: '#AFC0B4', lineHeight: 1.4, marginTop: 24, maxWidth: 860}}>
      {context.errors[0] ?? 'Unbekannte Animationsdaten.'}
    </div>
  </AbsoluteFill>
);

const presentationStyle = (
  presentation: FinanceHybridAnimationPresentation,
): React.CSSProperties => presentation === 'framed'
  ? {
      inset: 52,
      borderRadius: 44,
      overflow: 'hidden',
      boxShadow: '0 30px 90px rgba(0,0,0,0.48)',
      border: '2px solid rgba(92,255,154,0.28)',
    }
  : {
      inset: 0,
      overflow: 'hidden',
    };

export const FinanceHybridAnimationLayer: React.FC<
  FinanceHybridAnimationLayerProps
> = ({plan, assignments, showDebugLabels = false}) => {
  if (!assignments) return null;

  let cursorFrames = 0;
  const sequences: React.ReactNode[] = [];

  for (const scene of plan.scenes) {
    const from = cursorFrames;
    const durationInFrames = Math.round(scene.durationSec * plan.fps);
    cursorFrames += durationInFrames;

    const assignment = assignments[scene.id];
    if (!assignment) continue;

    const presentation = assignment.presentation ?? 'replace-image';
    sequences.push(
      <Sequence
        key={`${scene.id}-hybrid-animation`}
        from={from}
        durationInFrames={durationInFrames}
        premountFor={Math.round(plan.fps * 0.5)}
        name={`Animation sichtbar · ${scene.id}`}
      >
        <AbsoluteFill
          style={{
            zIndex: 20,
            background: '#07120B',
            isolation: 'isolate',
            pointerEvents: 'none',
          }}
        >
          <AbsoluteFill style={presentationStyle(presentation)}>
            <SafeFinanceAnimationRenderer
              input={assignment.input}
              renderFallback={(context) => (
                <HybridAnimationFallback sceneId={scene.id} context={context} />
              )}
            />
          </AbsoluteFill>
          {showDebugLabels && (
            <div
              style={{
                position: 'absolute',
                top: 30,
                right: 30,
                zIndex: 80,
                padding: '12px 18px',
                borderRadius: 999,
                background: 'rgba(4,18,10,0.88)',
                border: '1px solid rgba(92,255,154,0.55)',
                color: '#5CFF9A',
                fontFamily: 'Inter, Arial, sans-serif',
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: 1.2,
              }}
            >
              {assignment.debugLabel ?? `ANIMATION · ${scene.id}`}
            </div>
          )}
        </AbsoluteFill>
      </Sequence>,
    );
  }

  return <>{sequences}</>;
};
