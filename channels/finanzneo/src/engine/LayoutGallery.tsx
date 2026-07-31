import React from 'react';
import type {Caption} from '@studio/core';
import {FinanceReel, getFinanceReelFrames} from './FinanceReel';
import type {FinanceAssetManifest, FinanceScene, FinanceScenePlan} from './contracts';

type GallerySceneInput = Omit<FinanceScene, 'decorativeOnly' | 'voiceText'> & {voiceText?: string};
const baseScene = (scene: GallerySceneInput): FinanceScene => ({
  ...scene,
  voiceText: scene.voiceText ?? scene.purpose,
  decorativeOnly: false,
});

const scenes: FinanceScene[] = [
  baseScene({
    id: 'full-bleed-hero', durationSec: 6, layout: 'full-bleed', variant: 'default',
    purpose: 'Starke Hook mit sofort sichtbarem Hauptmotiv.',
    visualAction: 'Motiv sofort zeigen und Kernaussage ergänzen.',
    visualPhases: [{at: 0, action: 'Hauptmotiv zeigen'}, {at: 0.55, action: 'Einordnung ergänzen'}],
    semanticChanges: ['Motiv sichtbar', 'Einordnung sichtbar'], assetIds: ['gallery-sparen'],
    content: {kicker: '1 · Full Bleed Hero', headline: 'Dein Geld arbeitet nicht automatisch', body: 'Das Hauptmotiv trägt die Hook.'},
    transition: 'cut', frameZeroMainMotif: true,
  }),
  baseScene({
    id: 'detail-focus', durationSec: 6, layout: 'full-bleed', variant: 'detail-focus',
    purpose: 'Aus einem Gesamtmotiv auf ein wichtiges Detail führen.',
    visualAction: 'Gesamtbild zeigen, Detail markieren und Bedeutung ergänzen.',
    visualPhases: [
      {at: 0, action: 'Gesamtmotiv zeigen'},
      {at: 0.42, action: 'Detail fokussieren', focus: {x: 0.68, y: 0.46, radius: 0.18, scale: 1.2}},
      {at: 0.76, action: 'Bedeutung zeigen'},
    ],
    semanticChanges: ['Gesamtbild', 'Detail', 'Bedeutung'], assetIds: ['gallery-kredit'],
    content: {kicker: '2 · Detail Focus', headline: 'Hier entstehen die Kosten', body: 'Der Fokus erklärt den Mechanismus.'},
    transition: 'match-move',
  }),
  baseScene({
    id: 'framed-editorial', durationSec: 6, layout: 'framed-image', variant: 'default',
    purpose: 'Ein Bild redaktionell einordnen.',
    visualAction: 'Bild groß zeigen und kurz einordnen.',
    visualPhases: [{at: 0, action: 'Bildkarte zeigen'}, {at: 0.55, action: 'Einordnung ergänzen'}],
    semanticChanges: ['Bild sichtbar', 'Einordnung sichtbar'], assetIds: ['gallery-markt'],
    content: {kicker: '3 · Framed Editorial', headline: 'Der Markt bewegt sich in Phasen', body: 'Großes Motiv statt kleiner Vorschau.'},
    transition: 'push',
  }),
  baseScene({
    id: 'split-image-text', durationSec: 6, layout: 'framed-image', variant: 'split-left',
    purpose: 'Motiv und Erklärung nebeneinander zeigen.',
    visualAction: 'Bild links und Zahl rechts aufbauen.',
    visualPhases: [{at: 0, action: 'Bildseite zeigen'}, {at: 0.5, action: 'Textseite aufbauen'}],
    semanticChanges: ['Bildseite', 'Erklärseite'], assetIds: ['gallery-sparen'],
    content: {kicker: '4 · Split Image/Text', headline: 'Motiv plus klare Einordnung', primaryNumber: '4,2 %', body: 'Eine Zahl erhält Raum neben dem Bild.'},
    transition: 'wipe',
  }),
  baseScene({
    id: 'multi-panel', durationSec: 6, layout: 'framed-image', variant: 'multi-3',
    purpose: 'Drei zusammenhängende Bildschritte zeigen.',
    visualAction: 'Drei Teilbilder aufbauen und das Ergebnis hervorheben.',
    visualPhases: [{at: 0, action: 'Teilbild eins'}, {at: 0.36, action: 'Teilbild zwei'}, {at: 0.72, action: 'Teilbild drei'}],
    semanticChanges: ['Ausgangslage', 'Veränderung', 'Ergebnis'],
    assetIds: ['gallery-sparen', 'gallery-markt', 'gallery-vergleich'],
    content: {kicker: '5 · Multi Panel 3', headline: 'Ausgangslage → Veränderung → Ergebnis', body: 'Teilbilder bilden eine echte Abfolge.'},
    transition: 'push',
  }),
  baseScene({
    id: 'big-number', durationSec: 6, layout: 'big-number', variant: 'default',
    purpose: 'Eine zentrale Zahl sofort verständlich machen.',
    visualAction: 'Hauptzahl zeigen und einordnen.',
    visualPhases: [{at: 0, action: 'Hauptzahl zeigen'}, {at: 0.58, action: 'Vergleich ergänzen'}],
    semanticChanges: ['Hauptzahl', 'Vergleich'], assetIds: [],
    content: {kicker: '6 · Big Number', headline: 'Die entscheidende Größenordnung', primaryNumber: '10.000 €', secondaryNumber: 'Ausgangsbetrag', body: 'Eine Zahl erhält klare Priorität.'},
    transition: 'zoom-through',
  }),
  baseScene({
    id: 'calculation-build', durationSec: 6, layout: 'big-number', variant: 'calculation',
    purpose: 'Eine Rechnung schrittweise aufbauen.',
    visualAction: 'Formel, Ergebnis und Einordnung zeigen.',
    visualPhases: [{at: 0, action: 'Formel zeigen'}, {at: 0.4, action: 'Ergebnis zeigen'}, {at: 0.74, action: 'Einordnung ergänzen'}],
    semanticChanges: ['Formel', 'Ergebnis', 'Einordnung'], assetIds: [],
    content: {kicker: '7 · Calculation Build', headline: 'So wird aus Prozent ein Eurobetrag', formula: '10.000 € × 0,25 %', primaryNumber: '25 €', secondaryNumber: 'pro Jahr', outcome: 'Drei nachvollziehbare Schritte.'},
    transition: 'match-move',
  }),
  baseScene({
    id: 'before-after', durationSec: 6, layout: 'split-comparison', variant: 'before-after',
    purpose: 'Zwei Zustände direkt vergleichen.',
    visualAction: 'Alte Kondition, neue Kondition und Unterschied zeigen.',
    visualPhases: [{at: 0, action: 'Ausgangszustand'}, {at: 0.42, action: 'Neuer Zustand'}, {at: 0.74, action: 'Unterschied'}],
    semanticChanges: ['Ausgangszustand', 'Neuer Zustand', 'Unterschied'], assetIds: [],
    content: {kicker: '8 · Before / After', headline: 'Gleicher Betrag, anderes Ergebnis', leftLabel: 'Alte Kondition', leftValue: '2,0 %', rightLabel: 'Neue Kondition', rightValue: '2,5 %', body: 'Unterschied: +0,5 Prozentpunkte.'},
    transition: 'wipe',
  }),
  baseScene({
    id: 'checklist', durationSec: 6, layout: 'process', variant: 'checklist',
    purpose: 'Konkrete Handlungsschritte darstellen.',
    visualAction: 'Drei Punkte nacheinander abhaken.',
    visualPhases: [{at: 0, action: 'Punkt eins'}, {at: 0.36, action: 'Punkt zwei'}, {at: 0.7, action: 'Punkt drei'}],
    semanticChanges: ['Punkt eins', 'Punkt zwei', 'Punkt drei'], assetIds: [],
    content: {kicker: '9 · Process / Checklist', headline: 'Prüfe diese drei Punkte', steps: ['Kosten ansehen', 'Alternativen vergleichen', 'Nutzen gegen Risiko abwägen'], outcome: 'Eine konkrete nächste Handlung.'},
    transition: 'push',
  }),
  baseScene({
    id: 'timeline', durationSec: 6, layout: 'chart', variant: 'timeline',
    purpose: 'Eine Entwicklung über Zeit erklären.',
    visualAction: 'Zeitachse aufbauen und Wendepunkt markieren.',
    visualPhases: [{at: 0, action: 'Zeitachse'}, {at: 0.38, action: 'Entwicklung'}, {at: 0.72, action: 'Wendepunkt'}],
    semanticChanges: ['Zeitachse', 'Entwicklung', 'Wendepunkt'], assetIds: [],
    content: {kicker: '10 · Chart / Timeline', headline: 'So verändert sich der Wert', chartValues: [2, 2.2, 2.4, 2.1, 2.7], chartLabels: ['Jan.', 'März', 'Mai', 'Juli', 'Sept.'], body: 'Die Entwicklung erklärt eine Geschichte.'},
    transition: 'match-move',
  }),
  baseScene({
    id: 'payoff', durationSec: 6, layout: 'text-punch', variant: 'payoff',
    purpose: 'Die zentrale Erkenntnis abschließen.',
    visualAction: 'Kernaussage zeigen und Schlüsselteil markieren.',
    visualPhases: [{at: 0, action: 'Kernaussage'}, {at: 0.44, action: 'Markierung'}, {at: 0.76, action: 'Einordnung'}],
    semanticChanges: ['Kernaussage', 'Markierung', 'Einordnung'], assetIds: [],
    content: {kicker: '11 · Text Punch / Payoff', headline: 'Nicht die Zahl allein entscheidet', body: 'Entscheidend ist die Wirkung auf deine Situation.'},
    transition: 'zoom-through',
  }),
  baseScene({
    id: 'cta', durationSec: 4, layout: 'cta', variant: 'default',
    purpose: 'Eine klare Handlung ohne Nachlauf auslösen.',
    visualAction: 'Keyword und Nutzen sofort zeigen.',
    visualPhases: [{at: 0, action: 'Keyword und Nutzen'}, {at: 0.55, action: 'Keyword reagiert'}],
    semanticChanges: ['Keyword', 'Nutzen'], assetIds: ['gallery-vergleich'],
    content: {headline: 'Hol dir die kompakte Finanz-Checkliste', ctaKeyword: 'CHECK', ctaBenefit: 'Ein klarer Nutzen, eine Handlung, kein Nachlauf.'},
    transition: 'push',
  }),
];

const plan: FinanceScenePlan = {
  version: 'finance-v1',
  slug: 'layout-gallery',
  title: 'Finance V1 Layout Gallery',
  fps: 30,
  centralQuestion: 'Sind alle Layoutmuster klar, abwechslungsreich und mobil lesbar?',
  payoff: 'Eine kleine technische Basis erzeugt zwölf unterscheidbare Muster.',
  sources: [],
  scriptText: scenes.map((scene) => scene.voiceText).join(' '),
  voiceoverInstruction: 'Neutrale technische Galerie ohne produktives Voiceover.',
  voiceoverAssetId: 'gallery-no-audio',
  captionsAssetId: 'gallery-test-captions',
  scenes,
};

const manifest: FinanceAssetManifest = {
  version: 'finance-v1',
  slug: 'layout-gallery',
  root: 'public/layout-gallery',
  generatedAt: '2026-07-26T00:00:00.000Z',
  assets: [
    {id: 'gallery-sparen', kind: 'image', role: 'gallery', file: 'sparen.svg', extension: '.svg', bytes: 0, width: 1080, height: 1920},
    {id: 'gallery-kredit', kind: 'image', role: 'gallery', file: 'kredit.svg', extension: '.svg', bytes: 0, width: 1080, height: 1920},
    {id: 'gallery-markt', kind: 'image', role: 'gallery', file: 'markt.svg', extension: '.svg', bytes: 0, width: 1080, height: 1920},
    {id: 'gallery-vergleich', kind: 'image', role: 'gallery', file: 'vergleich.svg', extension: '.svg', bytes: 0, width: 1080, height: 1920},
  ],
};

const words = 'Diese Test Caption prüft die sichere Untertitelzone auf dem Smartphone'.split(' ');
const captions: Caption[] = Array.from({length: 132}, (_, index) => ({
  text: `${index === 0 ? '' : ' '}${words[index % words.length]}`,
  startMs: index * 500,
  endMs: index * 500 + 480,
  timestampMs: index * 500 + 240,
  confidence: 1,
}));

export const FINANCE_LAYOUT_GALLERY_FRAMES = getFinanceReelFrames(plan);

export const FinanceLayoutGallery: React.FC = () => (
  <FinanceReel
    plan={plan}
    manifest={manifest}
    captions={captions}
    publicBasePath="layout-gallery"
    showCaptions
    debug={false}
  />
);
