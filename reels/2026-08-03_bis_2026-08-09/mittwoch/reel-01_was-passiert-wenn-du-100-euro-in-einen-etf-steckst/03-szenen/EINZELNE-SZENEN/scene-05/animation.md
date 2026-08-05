# Szene 05 — Neue ETF-Anteile entstehen

**Typ:** vollständig vorprogrammierte Remotion-Animation

**Verwendete Komponente:** `PrebuiltEtfCreationAnimation`

**Quellcode:**

```text
alles/channels/finanzneo/src/reels/2026-08-05-etf-kauf-100-euro/PrebuiltEtfAnimations.tsx
```

**Einbindung in das fertige Reel:**

```text
alles/channels/finanzneo/src/reels/2026-08-05-etf-kauf-100-euro/EtfKauf100EuroReel.tsx
```

**Voiceover:** Steigt die Nachfrage so stark, dass neue Anteile gebraucht werden, kann ein Authorized Participant einen passenden Wertpapierkorb an den Fonds liefern und dafür neue ETF-Anteile erhalten.

## Bereits programmierter Ablauf

1. Ein Authorized-Participant-Transporter nimmt einen gewichteten Wertpapierkorb auf.
2. Er fährt in einer seitlichen Lagerwelt zum Fonds-Tresor.
3. Die Tresortür öffnet sich.
4. Die Wertpapierbausteine verlassen nacheinander den Korb.
5. Die Bausteine verriegeln sich sichtbar im Fondsvermögen.
6. Auf der anderen Seite werden neue ETF-Anteilsscheiben geprägt.
7. Der abgeschlossene Tausch wird klar zusammengefasst.

## Regel für Codex

Codex darf diese Animation **nicht neu entwerfen oder neu programmieren**. Es soll nur den vorhandenen Build ausführen. Die Animation skaliert bereits automatisch zur endgültigen transkriptbasierten Szenendauer.

**Wichtig:** Die Animation kennzeichnet den Ablauf als möglichen Primärmarktprozess und nicht als Ablauf jedes einzelnen Privatanlegerkaufs.
