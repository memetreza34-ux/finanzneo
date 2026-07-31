import {spawnSync} from 'node:child_process';

/**
 * Führt interne CLI-Befehle synchron und plattformübergreifend aus.
 * Windows benötigt für .cmd/.bat-Dateien eine Shell; ohne sie wirft Node EINVAL.
 */
export const runCommand = (command, args = [], options = {}) => {
  const needsWindowsShell = process.platform === 'win32' && /\.(cmd|bat)$/i.test(command);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    ...options,
    shell: options.shell ?? needsWindowsShell,
  });

  if (result.error) {
    throw new Error(`Befehl konnte nicht gestartet werden: ${command}\n${result.error.message}`, {
      cause: result.error,
    });
  }

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} fehlgeschlagen: Exit-Code ${result.status}`);
  }

  return result;
};
