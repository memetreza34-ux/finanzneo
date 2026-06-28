# FinanzNeo Remotion-Kit (Premium-Look)

Der PREMIUM-Weg für FinanzNeo (CSS/WebGL: Blur, Glow, Gradient, Glassmorphism, Spring) — Manim kann das nicht.
Marke: BG #0A1A0F, green #00D26A, gold #FFC83D, Fonts Bebas Neue + Inter.

## Dateien
- `fn_core.tsx` — Marke (C), Fonts, AuroraBG (driftende Blur-Blobs+Conic+Grain+Vignette), Glass (Glassmorphism)
- `fn_kit.tsx` — Basis-Bausteine: FNTitle, FNBigNumber, FNStatCard, FNCompareBars, FNGrowthCurve, FNDonut, FNHook, FNTicker, FNEndCard
- `fn_premium.tsx` — KOMPLEX/finanz-spezifisch: FNPortfolioGlobe (3D-Globe), FNWealthOrbit (Anlageklassen umkreisen),
  FNMoneyMorph (Partikel Chaos→Balken), FNWealthTower (iso 3D-Stapel), FNCompoundLoop (Zinseszins-Kreislauf+Puls),
  FNInflationErode (Wert zerbröselt), FNRiskReturn (Risiko/Rendite-Quadrant), FNCashflowSplit (Einkommen→Töpfe, fließende Partikel)
- `fn_text.tsx` — aus KI-Kit portiert (FN-Marke): FNShimmer, FNType, FNWordReveal, FNHighlight, FNKineticParagraph
- `fn_charts.tsx` — FNHBars, FNProgressRing, FNGauge, FNKPIGrid, FNSparkline, FNStackedBar, FNRanking, FNAreaChart
- `fn_diagrams.tsx` — FNProcess, FNTimeline, FNPipeline, FNChecklist, FNCallout, FNVS
- `fn_effects.tsx` — FNCheckmark, FNConfetti, FNRingPulse, FNFlashWord, FNMoneyCounter, FNCoinBurst
- `fn_hooks.tsx` — FNStopScroll, FNFactHook, FNWarning, FNQuestion, FNHotTake
- `fn_complex.tsx` — FNConceptMorph, FNDataStory, FNCard3DStack, FNExponential, FNParticleMorph, FNCompareStory
- **`StaticBG`** (in fn_core) — einfacher RUHIGER Hintergrund OHNE Animation (Armans Wunsch); für neue Showcases nutzen
- `fn_premium2.tsx` — RICHTIG PREMIUM: FNShineCard (Border-Beam+Sweep), FNCandles (Candlestick), FNGoldBars,
  FNNeonNumber, FNWealthMountain, FNPortfolioRings, FNBeamStat, FNMarketHeat. Showcase: FNPremium2Showcase.
- `fn_scenes.tsx` — VOLL-SZENEN (Split-Layout Visual+Text, ganze Fläche): FNCompoundScene, FNInflationScene,
  FNCompareScene, FNPortfolioScene, FNMarketScene. Helfer `Split` + `TextPanel` (Kicker/Title/Punkte/Stat) →
  neue Szenen einfach: `<Split left={<Visual/>} right={<TextPanel .../>} flip?/>`. Showcase: FNScenesShowcase.
- `fn_pro.tsx` — PRO: strenge Palette `P` (Grün+Gold+Neutral, KEIN Buntmix), dezenter Glow, viel Luft.
  FNHeroNumber, FNBarsClean, FNLineClean, FNStatTriptych, FNDonutClean, FNCompareClean, FNQuoteClean. Showcase: FNProShowcase.
- `fn_concepts.tsx` — KONZEPTE (komplex→einfach, Titel+Visual+Caption): FNSnowball (Zinseszins), FNCostAverage (Sparplan),
  FNDiversification, FNRiskReturn, FNDrawdown, FNNetWorth, FNFourPercent (4%-Regel), FNEmergencyFund. Showcase: FNConceptsShowcase.
- `fn_choreo.tsx` — CHOREO-Reel-Vorlage (Series-Beats, synchron): FNSparbuchVsETF.
- `fn_transitions.tsx` (8) — WipeIn/CircleReveal/SlideOver/ZoomBlur/BarsWipe/FadeThrough/PixelDissolve/BlurIn
- `fn_decor.tsx` (12) — Deko: WaveDivider/Marquee/GradientBar/DotsPattern/Spinner/TickerTape +
  Betonung: ArrowPointer/CircleHighlight/Underline/Spotlight/BigArrowUp/ZoomBox
- `fn_extra.tsx` (14) — Zeit: Countdown/Clock/Calendar/ProgressDays/Hourglass/Schedule +
  Maps: WorldDots/LocationPin/ConnectionArc/RegionHighlight + Personen: Avatar/PersonaCard/TeamGrid/CrowdGrow
- `fn_ui2.tsx` (8) — End-Cards: FollowBar/NextVideo/LogoSting/Thanks + UI: Badge/Chip/LowerThird/ListReveal
→ Showcase aller neuen: FNExtraShowcase.
- `fn_finance_core.tsx` (7) — FINANZ-ESSENTIALS: FNCompareTable, FNDualLine, FNFormula (Zinseszins),
  FNLoanAmort (Tilgung), FNPyramid (Anlage-Pyramide), FNTermCard (Begriffskarte), FNCalculator (Spar-Rechner).
  Showcase: FNFinanceCoreShowcase.
- `fn_chart_base.tsx` — **PremiumChart** (Fundament): echte beschriftete Achsen (X/Y + Titel), Gitternetz,
  großzügige Ränder (L210/B140), Legende, Glow. Props: title/xTitle/yTitle/xLabels/yMax/yTicks/yFmt/series.
  Fertige: FNLineChartPro, FNDualLinePro, FNCompoundPro, FNDrawdownPro. Showcase: FNChartProShowcase.
  → ALLE künftigen Kurven über PremiumChart bauen (NICHT die alten achsenlosen aus fn_concepts/fn_pro).
  **FN-Kit gesamt: 163 Bausteine.**
- Showcases: FNShowcase / FNKitShowcase / FNPremiumShowcase / **FNKit2Showcase** (Compositions in Root.tsx)

## Render
cd gehirn/remotion && npx tsc --noEmit && npx remotion render FNPremiumShowcase out/fn_premium.mp4 --concurrency=4
Einzeln: jede Composition-ID in Root.tsx. Format 1920x1080, 30fps.
