// FinanzNeo Design System — einziger öffentlicher Importpfad für neue Produktion.
//
// Beispiel:
// import {C, FONT, REEL_LAYOUT, SentenceKaraokeCaptions, FinanceBackground, PremiumCharts} from '../design-system';

// Bewährtes Kernsystem: Tokens, Layout, Captions, Charts, Templates und Branding.
export * from '../brand';

// Reproduzierbare Finanzberechnungen und zentrale Beispielannahmen.
export * from '../finance/calculations';
export * from '../finance/examples';

// Verbindliche Hintergrundauswahl und visuelle Safe-Area-Prüfung.
export {FinanceBackground, VerticalSafeAreaGuide} from './FinanceBackground';
export type {FinanceBackgroundVariant} from './FinanceBackground';

// Premium-Erweiterungen bleiben bewusst in Namensräumen.
// Dadurch entstehen keine Export-Kollisionen zwischen alten und neuen Komponenten.
export * as PremiumCore from '../bausteine/fn_core';
export * as PremiumBackgrounds from '../bausteine/fn_backgrounds';
export * as PremiumCharts from '../bausteine/fn_chart_base';
export * as ChartBlocks from '../bausteine/fn_charts';
export * as FinanceConcepts from '../bausteine/fn_concepts';
export * as FinanceBlocks from '../bausteine/fn_finance_core';
export * as TextBlocks from '../bausteine/fn_text';
export * as DiagramBlocks from '../bausteine/fn_diagrams';
export * as EffectBlocks from '../bausteine/fn_effects';
export * as HookBlocks from '../bausteine/fn_hooks';
export * as ComplexBlocks from '../bausteine/fn_complex';
export * as PremiumBlocks from '../bausteine/fn_premium';
export * as PremiumBlocks2 from '../bausteine/fn_premium2';
export * as ProBlocks from '../bausteine/fn_pro';
export * as SceneBlocks from '../bausteine/fn_scenes';
export * as StoryBlocks from '../bausteine/fn_story';
export * as Choreography from '../bausteine/fn_choreo';
export * as TransitionBlocks from '../bausteine/fn_transitions';
export * as DecorationBlocks from '../bausteine/fn_decor';
export * as ExtraBlocks from '../bausteine/fn_extra';
export * as UIBlocks from '../bausteine/fn_ui2';
export * as GlassBlocks from '../bausteine/fn_glass';
export * as GlobeBlocks from '../bausteine/fn_globe';
export * as LegacyKit from '../bausteine/fn_kit';
