# Szene 02 — Kauforder wird gematcht

**Typ:** vollständig vorprogrammierte Remotion-Animation

**Verwendete Komponente:** `PrebuiltEtfOrderMatchAnimation`

**Quellcode:**

```text
alles/channels/finanzneo/src/reels/2026-08-05-etf-kauf-100-euro/PrebuiltEtfAnimations.tsx
```

**Einbindung in das fertige Reel:**

```text
alles/channels/finanzneo/src/reels/2026-08-05-etf-kauf-100-euro/EtfKauf100EuroReel.tsx
```

**Voiceover:** Zuerst wird aus deinem Klick eine Kauforder. Der Broker schickt sie an den gewählten Handelsplatz, wo sie im Orderbuch auf ein passendes Verkaufsangebot trifft – oft von einem anderen Anleger oder einem Market Maker.

## Bereits programmierter Ablauf

1. Kauforder-Kapsel verlässt das Smartphone.
2. Sie passiert eine Broker-Schleuse.
3. Eine räumliche Börsenhalle wird sichtbar.
4. Physische Kauf- und Verkaufsangebote bewegen sich auf getrennten Schienen.
5. Die Kauforder sucht sichtbar nach einem passenden Gegenangebot.
6. Ein Verkaufsangebot fährt aus der Gegenschiene heran.
7. Beide Angebote rasten als ausgeführte Transaktion zusammen.
8. Das fertige Transaktionspaket verlässt die Szene.

## Regel für Codex

Codex darf diese Animation **nicht neu entwerfen oder neu programmieren**. Es soll nur den bestehenden Gesamtbefehl ausführen. Die Animationsphasen skalieren bereits automatisch zur endgültigen transkriptbasierten Szenendauer.

**Verboten:** Dashboard, Tabelle, statischer Zahlenzähler, Balkendiagramm oder Ersatz durch eine generische Vorlage.
