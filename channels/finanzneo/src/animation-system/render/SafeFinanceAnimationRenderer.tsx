import React from 'react';
import {
  parseFinanceAnimationScene,
  type FinanceAnimationParseResult,
} from '../ingestion';
import type {FinanceAnimationScene} from '../contracts';
import {FinanceAnimationRenderer} from './FinanceAnimationRenderer';

export type FinanceAnimationFallbackContext = {
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
};

export type SafeFinanceAnimationRendererProps = {
  input: unknown;
  fallback?: React.ReactNode;
  renderFallback?: (
    context: FinanceAnimationFallbackContext,
  ) => React.ReactNode;
};

export const resolveFinanceAnimationFallbackContext = (
  result: Extract<FinanceAnimationParseResult<FinanceAnimationScene>, {ok: false}>,
): FinanceAnimationFallbackContext => ({
  errors: result.errors,
  warnings: result.warnings,
});

/**
 * Sichere Integrationsgrenze für später eingehende KI- oder JSON-Daten.
 * Unbekannte Werte werden zuerst geparst und vollständig validiert. Erst eine
 * erfolgreiche Szene erreicht den eigentlichen Remotion-Renderer.
 *
 * Ungültige Eingaben können entweder über einen statischen `fallback` oder
 * über `renderFallback` behandelt werden. Der Callback erhält ausschließlich
 * normalisierte Parserfehler und Warnungen. Das rohe untrusted Input-Objekt
 * wird absichtlich nicht weitergereicht und kann im Fallback weder gelesen
 * noch versehentlich ausgeführt werden.
 */
export const SafeFinanceAnimationRenderer: React.FC<
  SafeFinanceAnimationRendererProps
> = ({input, fallback = null, renderFallback}) => {
  const result = parseFinanceAnimationScene(input);
  if (!result.ok) {
    const context = resolveFinanceAnimationFallbackContext(result);
    return <>{renderFallback ? renderFallback(context) : fallback}</>;
  }
  return <FinanceAnimationRenderer scene={result.value} />;
};
