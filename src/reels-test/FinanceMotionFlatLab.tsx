import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {AnimationStage, C, CLAMP, FONT, REEL_STYLE, SceneHeader, SceneTransition} from '../brand';
import type {IconName, SceneHeaderTone} from '../brand';
import {
  FLACH,
  FlachText,
  IconReihe,
  JahresBalken,
  Punkteraster,
  Ueberzeile,
  WerteReihe,
  Zaehlwerk,
  ZielBalken,
  euroText,
  jahrVerlauf,
  kaufkraftFuerAnimation,
  sparplanFuerAnimation,
  sparplanWertBei,
} from '../design-system';

/**
 * Referenz für den flachen Datenbaukasten (src/design-system/flache-daten.tsx).
 *
 * Jede Szene ist so gebaut, wie eine Datenszene in einem Reel gebaut wird:
 * Zahlen aus der Zentralrechnung, Quellenzeile aus deren `hinweis`, Darstellung
 * nur aus Bausteinen des Baukastens.
 */

const SCENE = 180;

const SPARPLAN = sparplanFuerAnimation({monatlich: 500, renditeProzent: 7, jahre: 30});
const TAGESGELD = sparplanFuerAnimation({monatlich: 500, renditeProzent: 2, jahre: 30});
const KONTO = sparplanFuerAnimation({monatlich: 500, renditeProzent: 0, jahre: 30});
const KAUFKRAFT = kaufkraftFuerAnimation({betrag: 100, inflationProzent: 2, jahre: 30});

const anteil = (frame: number, von: number, bis: number) => interpolate(frame, [von, bis], [0, 1], CLAMP);

// 1 · Eingangswerte → Zählwerk → Jahresbalken
const SparplanSzene: React.FC = () => {
  const jahrBei = jahrVerlauf(56, 146, 30);
  return (
    <AbsoluteFill>
      <Ueberzeile>Beispielrechnung</Ueberzeile>
      <WerteReihe
        ausblendenAb={40}
        werte={[
          {wert: '500 €', label: 'pro Monat', ab: 4},
          {wert: '30', label: 'Jahre', ab: 14},
          {wert: '7 %', label: 'Rendite p. a.', ab: 24},
        ]}
      />
      <Zaehlwerk x={FLACH.mitteX} y={455} ab={48} wertBei={(f) => sparplanWertBei(SPARPLAN, jahrBei(f))} />
      <FlachText x={FLACH.mitteX} y={612} groesse={34} farbe={FLACH.gruen} ab={146}>
        davon {euroText(SPARPLAN.zinsenGesamt)} Zinsen
      </FlachText>
      <JahresBalken sparplan={SPARPLAN} jahrBei={jahrBei} ab={48} />
    </AbsoluteFill>
  );
};

// 2 · Punkteraster: 1 Punkt = 1.000 €
const PunkteSzene: React.FC = () => {
  const eigene = Math.round(SPARPLAN.eingezahltGesamt / 1000);
  const zinsen = Math.round(SPARPLAN.endwert / 1000) - eigene;
  const zinsAnteil = Math.round((SPARPLAN.zinsenGesamt / SPARPLAN.endwert) * 100);
  return (
    <AbsoluteFill>
      <Ueberzeile y={395}>1 Punkt = 1.000 €</Ueberzeile>
      <Zaehlwerk x={300} y={445} groesse={64} wertBei={(f) => SPARPLAN.eingezahltGesamt * anteil(f, 14, 60)} />
      <FlachText x={300} y={530} groesse={26} gewicht={600} farbe={FLACH.grau}>eingezahlt</FlachText>
      <Zaehlwerk x={780} y={445} groesse={64} farbe={FLACH.gruen} wertBei={(f) => SPARPLAN.zinsenGesamt * anteil(f, 66, 146)} />
      <FlachText x={780} y={530} groesse={26} gewicht={600} farbe={FLACH.grau}>Zinsen</FlachText>
      <Punkteraster
        gruppen={[
          {anzahl: eigene, farbe: FLACH.weiss, von: 14, bis: 60},
          {anzahl: zinsen, farbe: FLACH.gruen, von: 66, bis: 146},
        ]}
      />
      <FlachText x={FLACH.mitteX} y={1200} groesse={44} gewicht={800} farbe={FLACH.gruen} ab={148}>
        {zinsAnteil} % davon sind Zinsen
      </FlachText>
    </AbsoluteFill>
  );
};

// 3 · Icon-Reihe: Kaufkraft von 100 €
const JahrText: React.FC<{jahrBei: (frame: number) => number}> = ({jahrBei}) => {
  const jahr = Math.round(jahrBei(useCurrentFrame()));
  return (
    <FlachText x={FLACH.mitteX} y={622} groesse={28} gewicht={600} farbe={FLACH.grau}>
      {jahr === 0 ? 'heute' : jahr === 1 ? 'nach 1 Jahr' : `nach ${jahr} Jahren`}
    </FlachText>
  );
};

const KaufkraftSzene: React.FC = () => {
  const jahrBei = jahrVerlauf(24, 140, 30);
  const kaufkraftBei = (f: number) => kaufkraftFuerAnimation({betrag: 100, inflationProzent: 2, jahre: jahrBei(f)}).spaeter;
  return (
    <AbsoluteFill>
      <Ueberzeile>Was 100 € kaufen</Ueberzeile>
      <Zaehlwerk x={FLACH.mitteX} y={450} groesse={140} wertBei={kaufkraftBei} />
      <JahrText jahrBei={jahrBei} />
      <IconReihe anzahl={10} aktivBei={(f) => kaufkraftBei(f) / 10} />
      <FlachText x={FLACH.mitteX} y={1100} groesse={40} gewicht={800} farbe={FLACH.verlust} ab={142}>
        Fast die Hälfte ist weg
      </FlachText>
      <FlachText x={FLACH.mitteX} y={1160} groesse={28} gewicht={600} farbe={FLACH.grau} ab={142}>
        {Math.round(KAUFKRAFT.verlustProzent)} % weniger Kaufkraft
      </FlachText>
    </AbsoluteFill>
  );
};

// 4 · Zielbalken: drei Wege mit derselben Rate
const VergleichSzene: React.FC = () => {
  const faktor = (SPARPLAN.endwert / KONTO.endwert).toLocaleString('de-DE', {maximumFractionDigits: 1});
  return (
    <AbsoluteFill>
      <Ueberzeile>500 € im Monat · 30 Jahre</Ueberzeile>
      <FlachText x={FLACH.mitteX} y={448} groesse={36} farbe={FLACH.gruen} ab={148}>
        ETF: {faktor}× so viel wie das Konto
      </FlachText>
      <ZielBalken
        balken={[
          {label: 'Konto', untertitel: '0 %', wert: KONTO.endwert, von: 26, bis: 66},
          {label: 'Tagesgeld', untertitel: '2 %', wert: TAGESGELD.endwert, von: 56, bis: 96},
          {label: 'ETF', untertitel: '7 %', wert: SPARPLAN.endwert, farbe: FLACH.gruen, von: 86, bis: 146},
        ]}
      />
    </AbsoluteFill>
  );
};

type FlatScene = {title: string; icon: IconName; tone: SceneHeaderTone; note: string; Component: React.FC};

const SCENES: FlatScene[] = [
  {title: 'Was 500 € im Monat werden', icon: 'chart-up', tone: 'positive', note: SPARPLAN.hinweis, Component: SparplanSzene},
  {title: 'Das meiste sind Zinsen', icon: 'coins', tone: 'money', note: SPARPLAN.hinweis, Component: PunkteSzene},
  {title: 'Inflation frisst Kaufkraft', icon: 'percent', tone: 'warning', note: KAUFKRAFT.hinweis, Component: KaufkraftSzene},
  {
    title: 'Gleiche Rate, anderes Ergebnis',
    icon: 'target',
    tone: 'default',
    note: 'Beispielrechnung: 500 € monatlich über 30 Jahre, Einzahlung am Monatsende, vor Kosten, Steuern und Inflation. Keine Renditegarantie.',
    Component: VergleichSzene,
  },
];

export const FINANCE_MOTION_FLAT_LAB_FRAMES = SCENES.length * SCENE;

export const FinanceMotionFlatLab: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000000'}}>
    {SCENES.map(({title, icon, tone, note, Component}, index) => (
      <Sequence key={title} from={index * SCENE} durationInFrames={SCENE}>
        <SceneTransition durationFrames={SCENE}>
          <SceneHeader title={title} icon={icon} tone={tone} />
          <AnimationStage>
            <Component />
          </AnimationStage>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: REEL_STYLE.sourceNote.bottom,
              maxWidth: REEL_STYLE.sourceNote.maxWidth,
              margin: '0 auto',
              textAlign: 'center',
              fontFamily: FONT.body,
              fontSize: REEL_STYLE.sourceNote.fontSize,
              fontWeight: 600,
              lineHeight: 1.3,
              color: C.gray,
            }}
          >
            {note}
          </div>
        </SceneTransition>
      </Sequence>
    ))}
  </AbsoluteFill>
);
