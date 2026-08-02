import React from 'react';
import {parseFinanceAnimationScene} from '../ingestion';
import {FinanceAnimationRenderer} from './FinanceAnimationRenderer';

export type SafeFinanceAnimationRendererProps = {
  input: unknown;
  fallback?: React.ReactNode;
};

/**
 * Sichere Integrationsgrenze für später eingehende KI- oder JSON-Daten.
 * Unbekannte Werte werden zuerst geparst und vollständig validiert. Erst eine
 * erfolgreiche Szene erreicht den eigentlichen Remotion-Renderer.
 */
export const SafeFinanceAnimationRenderer: React.FC<
  SafeFinanceAnimationRendererProps
> = ({input, fallback = null}) => {
  const result = parseFinanceAnimationScene(input);
  if (!result.ok) return <>{fallback}</>;
  return <FinanceAnimationRenderer scene={result.value} />;
};
