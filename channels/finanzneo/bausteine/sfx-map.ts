// ════════════════════════════════════════════════════════════════════════════
//  SFX-MAP — ordnet jedem Finanz-Vokabular-Baustein (vokabular.tsx…vokabular5.tsx)
//  den passenden Sound aus dem kuratierten Mixkit-Set (channels/finanzneo/public/sfx/,
//  Lizenz-Log siehe public/ASSETS.md) + den Frame-Offset zum visuellen Höhepunkt zu.
//
//  offsetFrames ist relativ zum Start-Frame, den der Baustein selbst für seine
//  Einstiegs-Animation nimmt — bei den meisten die Prop `at`, bei ein paar
//  (Account, MoneyFlow, YearClock) die Prop `start`. Der Sound soll also bei
//  `<Sfx atSec={(at + SFX_MAP.X.offsetFrames) / fps} />` liegen, NICHT bei `at` selbst
//  — sonst klingt es vor der Bewegung statt im Moment des Einschlags/Auftauchens.
//
//  Benutzung in einer Szene:
//
//    import { staticFile } from 'remotion';
//    import { Sfx } from '@studio/core';
//    import { TaxStamp } from '../../bausteine/vokabular2';
//    import { SFX_MAP } from '../../bausteine/sfx-map';
//
//    const at = 30; // Frame, an dem TaxStamp startet
//    const cue = SFX_MAP.TaxStamp as SfxCue;
//    <TaxStamp at={at} />
//    <Sfx src={staticFile(cue.file)} atSec={(at + cue.offsetFrames) / fps} />
//
//  Mehrere Höhepunkte (z.B. SubscriptionStack: Stapel baut sich UND eine Karte wird
//  weggewischt) liefern ein Array — dann pro Eintrag ein eigenes <Sfx>.
//
//  Sparsam bleiben (SOUND.md): nicht bei jedem Baustein in der Szene automatisch
//  einen Sfx feuern — nur bei den Beats, die wirklich betont werden sollen.
//
//  Bewusst NICHT gemappt (rein dekorativ, kein diskreter Impact-Moment):
//  YearClock (läuft nur durch), Market (Candlesticks laufen durch),
//  RisingSteps (kontinuierliches Klettern), RetirementSun (kontinuierlicher Sonnenaufgang).
// ════════════════════════════════════════════════════════════════════════════

export type SfxCue = { file: string; offsetFrames: number; label?: string };

export const SFX_MAP: Record<string, SfxCue | SfxCue[]> = {
  // ── vokabular.tsx ──────────────────────────────────────────────────────────
  Coin: { file: 'sfx/coin-1.mp3', offsetFrames: 10, label: 'Münze landet' },
  Account: { file: 'sfx/coin-1.mp3', offsetFrames: 30, label: 'Konto fast voll' },
  Bank: { file: 'sfx/pop-2.mp3', offsetFrames: 10, label: 'Gebäude erscheint' },
  Person: { file: 'sfx/pop-1.mp3', offsetFrames: 10, label: 'Figur erscheint' },
  MoneyFlow: { file: 'sfx/coin-1.mp3', offsetFrames: 20, label: 'Münzen unterwegs (relativ zu start)' },
  Vault: { file: 'sfx/click-1.mp3', offsetFrames: 44, label: 'Zahlenschloss stoppt' },
  Basket: { file: 'sfx/pop-1.mp3', offsetFrames: 24, label: 'Positionen füllen Korb' },
  Debt: { file: 'sfx/riser-2.mp3', offsetFrames: 14, label: 'Kugel & Kette erscheinen' },
  InterestGear: { file: 'sfx/click-2.mp3', offsetFrames: 14, label: 'Zahnrad greift' },
  TrendArrow: { file: 'sfx/whoosh-2.mp3', offsetFrames: 16, label: 'Pfeil schießt hoch/runter' },
  // YearClock, Market: bewusst nicht gemappt (siehe Header)

  // ── vokabular2.tsx ─────────────────────────────────────────────────────────
  CardTap: { file: 'sfx/whoosh-1.mp3', offsetFrames: 18, label: 'Karte tippt aufs Terminal' },
  CoinFlip: { file: 'sfx/coin-2.mp3', offsetFrames: 50, label: 'Münze landet nach Flip' },
  GoldBarStack: { file: 'sfx/pop-1.mp3', offsetFrames: 16, label: 'Barren stapelt sich' },
  ShieldProtect: { file: 'sfx/chime-1.mp3', offsetFrames: 20, label: 'Haken pulst' },
  ATMWithdraw: { file: 'sfx/coin-1.mp3', offsetFrames: 26, label: 'Banknote fährt raus' },
  ContractSign: { file: 'sfx/chime-1.mp3', offsetFrames: 42, label: 'Unterschrift fertig' },
  ReceiptPrint: { file: 'sfx/whoosh-1.mp3', offsetFrames: 20, label: 'Bon schiebt sich raus' },
  TaxStamp: { file: 'sfx/impact-1.mp3', offsetFrames: 16, label: 'Stempel-Einschlag' },
  HandshakeDeal: { file: 'sfx/chime-2.mp3', offsetFrames: 20, label: 'Hände greifen' },
  WalletBulge: { file: 'sfx/pop-2.mp3', offsetFrames: 14, label: 'Scheine poppen raus' },
  CalculatorType: { file: 'sfx/click-1.mp3', offsetFrames: 10, label: 'Tasten tippen' },
  PaycheckSlide: { file: 'sfx/whoosh-1.mp3', offsetFrames: 16, label: 'Umschlag slidet rein' },
  TickerTape: { file: 'sfx/click-2.mp3', offsetFrames: 14, label: 'Kursband erscheint' },

  // ── vokabular3.tsx ─────────────────────────────────────────────────────────
  BullBearFigure: { file: 'sfx/pop-2.mp3', offsetFrames: 14, label: 'Figur wird hervorgehoben' },
  PortfolioPie: { file: 'sfx/pop-2.mp3', offsetFrames: 20, label: 'Erstes Segment baut sich' },
  RiskDial: { file: 'sfx/riser-1.mp3', offsetFrames: 30, label: 'Nadel schwingt zum Ziel' },
  DividendRain: { file: 'sfx/coin-2.mp3', offsetFrames: 35, label: 'Münzen landen im Depot' },
  IndexFundBlock: { file: 'sfx/pop-1.mp3', offsetFrames: 22, label: 'Quadrate fügen sich zusammen' },
  CryptoWallet: { file: 'sfx/pop-2.mp3', offsetFrames: 16, label: 'Wallet-Karte erscheint' },
  ExchangeArrows: { file: 'sfx/whoosh-2.mp3', offsetFrames: 14, label: 'Pfeile rotieren' },
  HouseKey: { file: 'sfx/whoosh-1.mp3', offsetFrames: 34, label: 'Schlüssel dreht ins Schloss' },
  GoalFlag: { file: 'sfx/pop-1.mp3', offsetFrames: 48, label: 'Flagge landet auf Gipfel' },
  EmergencyFund: { file: 'sfx/chime-1.mp3', offsetFrames: 20, label: 'Schirm klappt schützend auf' },
  CarUnlock: { file: 'sfx/click-1.mp3', offsetFrames: 16, label: 'Zentralverriegelung öffnet' },
  TravelPin: { file: 'sfx/whoosh-1.mp3', offsetFrames: 20, label: 'Pin fällt auf Ziel' },
  DreamBoard: { file: 'sfx/pop-1.mp3', offsetFrames: 22, label: 'Erstes Polaroid fliegt ein' },
  FamilyShield: { file: 'sfx/pop-2.mp3', offsetFrames: 36, label: 'Schild schwebt über Familie' },
  // RisingSteps, RetirementSun: bewusst nicht gemappt (siehe Header)

  // ── vokabular4.tsx ─────────────────────────────────────────────────────────
  CrackedPiggy: { file: 'sfx/impact-1.mp3', offsetFrames: 24, label: 'Riss bricht auf' },
  RedFlagPole: { file: 'sfx/riser-1.mp3', offsetFrames: 14, label: 'Flagge schießt hoch' },
  FeeLeak: { file: 'sfx/riser-2.mp3', offsetFrames: 20, label: 'Kontostand beginnt zu sinken' },
  InflationShrink: { file: 'sfx/riser-1.mp3', offsetFrames: 20, label: 'Schein schrumpft' },
  DebtSpiral: { file: 'sfx/impact-1.mp3', offsetFrames: 70, label: 'Münze verschwindet im Zentrum' },
  ScamAlert: { file: 'sfx/riser-2.mp3', offsetFrames: 14, label: 'Warnrahmen pulst' },
  MarketCrashArrow: { file: 'sfx/impact-2.mp3', offsetFrames: 20, label: 'Absturz-Linie schlägt ein' },
  PenaltyStamp: { file: 'sfx/impact-1.mp3', offsetFrames: 18, label: 'Stempel-Einschlag' },
  ShoppingCartFill: { file: 'sfx/pop-2.mp3', offsetFrames: 20, label: 'Artikel fallen in den Wagen' },
  SubscriptionStack: [
    { file: 'sfx/pop-1.mp3', offsetFrames: 14, label: 'Karten stapeln sich' },
    { file: 'sfx/whoosh-1.mp3', offsetFrames: 36, label: 'Oberste Karte wird weggewischt (count*6+12+12)' },
  ],
  BudgetJarsSplit: { file: 'sfx/pop-1.mp3', offsetFrames: 20, label: 'Erstes Glas füllt sich' },
  GroceryBagCoins: { file: 'sfx/coin-2.mp3', offsetFrames: 18, label: 'Münzen erscheinen in Tüte' },
  RentHouseArrow: { file: 'sfx/whoosh-2.mp3', offsetFrames: 24, label: 'Pfeil zieht Betrag heraus' },
  PayslipBreakdown: { file: 'sfx/chime-1.mp3', offsetFrames: 20, label: 'Netto-Balken vervollständigt' },

  // ── vokabular5.tsx ─────────────────────────────────────────────────────────
  BookToLightbulb: { file: 'sfx/chime-2.mp3', offsetFrames: 36, label: 'Glühbirne leuchtet auf' },
  CertificateSeal: { file: 'sfx/chime-1.mp3', offsetFrames: 18, label: 'Siegel prägt sich ein' },
  MentorArrow: { file: 'sfx/whoosh-2.mp3', offsetFrames: 34, label: 'Bogen erreicht Ziel-Punkt' },
  QuizCheckX: { file: 'sfx/chime-2.mp3', offsetFrames: 14, label: 'Antwort bewertet (correct=true; bei false eher impact-*.mp3 nutzen)' },
  TrustBadgeStar: { file: 'sfx/chime-2.mp3', offsetFrames: 46, label: 'Letzter Stern funkelt' },
  NewsHeadlineSlide: { file: 'sfx/whoosh-2.mp3', offsetFrames: 16, label: 'Balken slidet ein' },
};
