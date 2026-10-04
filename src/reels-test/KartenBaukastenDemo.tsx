import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {
  IconAblauf,
  KartenHinweis,
  StichwortKarte,
  TabellenKarte,
  ZitatKarte,
  Zeitstrahl,
} from '../design-system';

/**
 * Demo des Karten-Baukastens (src/design-system/karten.tsx), 16:9.
 * Inhalt: Kreditkarten-Teilzahlung, Beispielrechnung 2.000 € offen, 17 % p. a.,
 * 100 € Rate — dieselben Werte wie im Skript des Kreditkarten-Projekts.
 */

const KARTE_FRAMES = 150;

const BEISPIEL = 'Beispielrechnung: 2.000 € offen, 17 % Jahreszins, 100 € Rate pro Monat';

const KARTEN: React.ReactNode[] = [
  <StichwortKarte key="stichwort" titel="Revolvierende Kreditkarte" zusatz="Ein Teil bleibt offen – darauf fallen Zinsen an" hervorheben="Zinsen" hervorhebenAb={42} />,
  <ZitatKarte key="zitat" zitat="Preis ist, was du zahlst. Wert ist, was du bekommst." autor="Warren Buffett" quelle="Aktionärsbrief 2008, nach Benjamin Graham" />,
  <React.Fragment key="tabelle">
    <TabellenKarte
      titel="Was von 100 € Rate wirklich tilgt"
      kopf={['Monat', 'Zinsen', 'Tilgung', 'Restschuld']}
      zeilen={[
        ['1', '28,33 €', '71,67 €', '1.928,33 €'],
        ['2', '27,32 €', '72,68 €', '1.855,65 €'],
        ['3', '26,29 €', '73,71 €', '1.781,94 €'],
        ['6', '23,11 €', '76,89 €', '1.554,48 €'],
        ['12', '16,34 €', '83,66 €', '**1.069,72 €**'],
      ]}
      hervorheben={4}
    />
    <KartenHinweis>{BEISPIEL}</KartenHinweis>
  </React.Fragment>,
  <React.Fragment key="ablauf">
    <IconAblauf
      schritte={[
        {icon: 'receipt', label: 'Einkauf'},
        {icon: 'document', label: 'Monatsabrechnung'},
        {icon: 'percent', label: 'Teilzahlung', hinweis: '**368 €** Zinsen insgesamt'},
        {icon: 'check', label: 'nach 24 Monaten bezahlt'},
      ]}
    />
    <KartenHinweis>{BEISPIEL}</KartenHinweis>
  </React.Fragment>,
  <React.Fragment key="zeitstrahl">
    <Zeitstrahl
      punkte={[
        {label: 'Start', wert: '2.000 €'},
        {label: 'Monat 6', wert: '1.554 €'},
        {label: 'Monat 12', wert: '1.070 €'},
        {label: 'Monat 18', wert: '542 €'},
        {label: 'Monat 24', wert: '0 €'},
      ]}
      hervorheben={4}
      sprung={{von: 0, nach: 4, label: '2.368 € gezahlt'}}
    />
    <KartenHinweis>{BEISPIEL}</KartenHinweis>
  </React.Fragment>,
];

export const KARTEN_DEMO_FRAMES = KARTEN.length * KARTE_FRAMES;

export const KartenBaukastenDemo: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000000'}}>
    {KARTEN.map((karte, index) => (
      <Sequence key={index} from={index * KARTE_FRAMES} durationInFrames={KARTE_FRAMES}>
        {karte}
      </Sequence>
    ))}
  </AbsoluteFill>
);
