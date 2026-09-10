import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bausteineDir = path.join(root, 'src', 'bausteine');
const files = (await readdir(bausteineDir)).filter(
  (name) => name.startsWith('fn_') && name.endsWith('.tsx') && name !== 'fn_pro.tsx',
);

const forbidden = [];
for (const name of files) {
  const source = await readFile(path.join(bausteineDir, name), 'utf8');
  if (/from\s+['"]\.\/fn_pro['"]/.test(source)) {
    forbidden.push(name);
  }
}

if (forbidden.length > 0) {
  console.error(
    `Baustein-Abhängigkeitsfehler: ${forbidden.join(', ')} importiert P oder andere Hilfen über fn_pro.tsx. ` +
      'Niedrige Bausteinmodule müssen Kernwerte direkt aus fn_core.tsx beziehen.',
  );
  process.exit(1);
}

console.log(`Baustein-Abhängigkeiten OK (${files.length} Module geprüft).`);
