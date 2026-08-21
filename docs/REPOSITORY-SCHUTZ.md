# FinanzNeo — Repository-Schutz

## Aktive Schutzebenen

1. `AGENTS.md` verbietet KI-Agenten unbeauftragte Änderungen an Kernregeln, Assets und bestehenden Projekten.
2. `.githooks/pre-commit` blockiert versehentliche Commits geschützter Dateien.
3. `.githooks/pre-push` blockiert direkte Pushes auf `main`.
4. `.github/CODEOWNERS` fordert Arman bei Änderungen automatisch als verantwortlichen Reviewer an.
5. Die Pull-Request-Checkliste erzwingt eine sichtbare Prüfung von Formaten, Löschungen und Validatoren.
6. `npm run antigravity:safety -- <Start-HEAD>` erkennt geschützte Änderungen und Löschungen innerhalb eines Arbeitsauftrags.

## Schutz installieren

Nach einem neuen Clone einmal ausführen:

```bash
npm run protect:install
```

`npm install` und `npm ci` aktivieren den Schutz ebenfalls automatisch. Der Clone ist danach über `core.hooksPath=.githooks` geschützt.

## Bewusste Ausnahme

Nur wenn eine Änderung ausdrücklich beauftragt und vollständig geprüft wurde:

```bash
FINANZNEO_ALLOW_PROTECTED_CHANGES=1 git commit
```

Ein direkter Push auf `main` bleibt unabhängig davon gesperrt. Für einen ausdrücklich beabsichtigten Notfall existiert eine separate Einmalfreigabe:

```bash
FINANZNEO_ALLOW_MAIN_PUSH=1 git push ...
```

Die Umgebungsvariablen werden nicht dauerhaft gespeichert.

## GitHub-Einschränkung

Das Repository ist privat. Serverseitiger GitHub-Branch-Schutz ist im aktuellen Tarif nicht verfügbar. Die lokalen Git-Hooks, CODEOWNERS und Pull-Request-Regeln sind deshalb die stärkste derzeit ohne Tarif- oder Sichtbarkeitsänderung verfügbare Absicherung.
