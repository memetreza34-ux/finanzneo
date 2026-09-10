import {mkdir, readdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'src');
const designSystemIndex = path.join(srcDir, 'design-system', 'index.ts');
const args = new Set(process.argv.slice(2));
const jsonOnly = args.has('--json');
const writeReport = args.has('--write');
const checkMode = args.has('--check');

const normalize = (value) => path.relative(root, value).split(path.sep).join('/');
const sourceExtension = /\.(?:[cm]?[jt]sx?)$/i;
const bausteinFile = /^fn_.*\.(?:ts|tsx)$/i;
const supportDirectory = /(^|\/)(?:__tests__|tests?|showcases?|demos?|examples?|previews?|mocks?)(\/|$)/i;
const supportFilename = /^(?:Mock.*|.*(?:Test|Demo|Showcase|Preview|Overview))\.(?:[jt]sx?)$/i;

const walk = async (dir) => {
  const entries = await readdir(dir, {withFileTypes: true});
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.isFile() && sourceExtension.test(entry.name)) files.push(full);
  }
  return files;
};

const scriptKindFor = (file) => {
  if (file.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (file.endsWith('.jsx')) return ts.ScriptKind.JSX;
  if (file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.cjs')) return ts.ScriptKind.JS;
  return ts.ScriptKind.TS;
};

const parse = (file, source) =>
  ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKindFor(file));

const hasModifier = (node, kind) => node.modifiers?.some((modifier) => modifier.kind === kind) ?? false;
const isExported = (node) => hasModifier(node, ts.SyntaxKind.ExportKeyword);
const isPascalCase = (name) => /^[A-Z][A-Za-z0-9]*$/.test(name);

const unwrapExpression = (node) => {
  let current = node;
  while (
    current &&
    (ts.isParenthesizedExpression(current) ||
      ts.isAsExpression(current) ||
      ts.isTypeAssertionExpression(current) ||
      ts.isSatisfiesExpression?.(current))
  ) {
    current = current.expression;
  }
  return current;
};

const looksLikeComponentInitializer = (initializer) => {
  const node = unwrapExpression(initializer);
  if (!node) return false;
  if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) return true;
  if (!ts.isCallExpression(node)) return false;

  const callee = node.expression;
  const name = ts.isIdentifier(callee)
    ? callee.text
    : ts.isPropertyAccessExpression(callee)
      ? callee.name.text
      : '';
  return ['memo', 'forwardRef'].includes(name);
};

const collectExportedComponents = (file, sourceFile) => {
  const components = [];
  for (const statement of sourceFile.statements) {
    if (ts.isVariableStatement(statement) && isExported(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (
          ts.isIdentifier(declaration.name) &&
          isPascalCase(declaration.name.text) &&
          looksLikeComponentInitializer(declaration.initializer)
        ) {
          components.push({
            name: declaration.name.text,
            source: normalize(file),
            definitionStart: declaration.name.getStart(sourceFile),
          });
        }
      }
    }

    if (
      ts.isFunctionDeclaration(statement) &&
      isExported(statement) &&
      statement.name &&
      isPascalCase(statement.name.text)
    ) {
      components.push({
        name: statement.name.text,
        source: normalize(file),
        definitionStart: statement.name.getStart(sourceFile),
      });
    }

    if (
      ts.isClassDeclaration(statement) &&
      isExported(statement) &&
      statement.name &&
      isPascalCase(statement.name.text)
    ) {
      components.push({
        name: statement.name.text,
        source: normalize(file),
        definitionStart: statement.name.getStart(sourceFile),
      });
    }
  }
  return components;
};

const collectIdentifiers = (sourceFile) => {
  const map = new Map();
  const visit = (node) => {
    if (ts.isIdentifier(node)) {
      const items = map.get(node.text) ?? [];
      items.push(node.getStart(sourceFile));
      map.set(node.text, items);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return map;
};

const isBausteinSource = (relative) => relative.startsWith('src/bausteine/');
const isDesignFacade = (relative) => relative === 'src/design-system/index.ts';
const isSupportSource = (relative) => supportDirectory.test(relative) || supportFilename.test(path.basename(relative));

const srcFiles = (await walk(srcDir)).sort();
const parsedFiles = new Map();
for (const file of srcFiles) {
  const source = await readFile(file, 'utf8');
  const sourceFile = parse(file, source);
  parsedFiles.set(normalize(file), {
    file,
    sourceFile,
    identifiers: collectIdentifiers(sourceFile),
  });
}

const designSource = await readFile(designSystemIndex, 'utf8');
const designAst = parse(designSystemIndex, designSource);
const publicNamespaces = new Map();
for (const statement of designAst.statements) {
  if (!ts.isExportDeclaration(statement) || !statement.moduleSpecifier || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
  const specifier = statement.moduleSpecifier.text;
  if (!specifier.startsWith('../bausteine/')) continue;

  const moduleName = path.basename(specifier);
  const namespace = statement.exportClause && ts.isNamespaceExport(statement.exportClause)
    ? statement.exportClause.name.text
    : '*';
  publicNamespaces.set(moduleName, namespace);
}

const components = [];
for (const [relative, parsed] of parsedFiles) {
  if (!isBausteinSource(relative) || !bausteinFile.test(path.basename(relative))) continue;
  components.push(...collectExportedComponents(parsed.file, parsed.sourceFile));
}
components.sort((a, b) => a.source.localeCompare(b.source) || a.name.localeCompare(b.name));

const namesToSources = new Map();
const definitionPositions = new Map();
for (const component of components) {
  const sources = namesToSources.get(component.name) ?? new Set();
  sources.add(component.source);
  namesToSources.set(component.name, sources);

  const key = `${component.source}::${component.name}`;
  const positions = definitionPositions.get(key) ?? new Set();
  positions.add(component.definitionStart);
  definitionPositions.set(key, positions);
}

const classifyReference = (relative) => {
  if (isDesignFacade(relative)) return 'facade';
  if (isBausteinSource(relative)) return 'internal';
  if (isSupportSource(relative)) return 'support';
  return 'productive';
};

const rows = components.map((component) => {
  const refs = {productive: [], support: [], internal: []};

  for (const [relative, parsed] of parsedFiles) {
    const positions = parsed.identifiers.get(component.name) ?? [];
    if (positions.length === 0 || isDesignFacade(relative)) continue;

    const definitions = definitionPositions.get(`${relative}::${component.name}`) ?? new Set();
    const realReferenceCount = positions.filter((position) => !definitions.has(position)).length;
    if (realReferenceCount <= 0) continue;

    const kind = classifyReference(relative);
    if (kind !== 'facade') refs[kind].push(relative);
  }

  for (const key of Object.keys(refs)) refs[key] = [...new Set(refs[key])].sort();

  const sourceModule = path.basename(component.source).replace(/\.(?:ts|tsx)$/i, '');
  const publicNamespace = publicNamespaces.get(sourceModule) ?? null;
  const ambiguousName = (namesToSources.get(component.name)?.size ?? 0) > 1;

  let status = 'unused';
  if (refs.productive.length > 0) status = 'active';
  else if (refs.internal.length > 0 || refs.support.length > 0) status = 'legacy';

  let deletionRisk = 'candidate';
  if (ambiguousName) deletionRisk = 'name-collision-review';
  else if (status === 'active') deletionRisk = 'protected-active';
  else if (status === 'legacy') deletionRisk = 'compatibility-use';
  else if (publicNamespace) deletionRisk = 'public-contract';

  return {
    name: component.name,
    source: component.source,
    status,
    publicNamespace,
    ambiguousName,
    deletionRisk,
    refs,
  };
});

const count = (predicate) => rows.filter(predicate).length;
const duplicateNames = [...namesToSources.entries()]
  .filter(([, sources]) => sources.size > 1)
  .map(([name, sources]) => ({name, sources: [...sources].sort()}))
  .sort((a, b) => a.name.localeCompare(b.name));

const publicModulesMissingFromDisk = [...publicNamespaces.keys()].filter(
  (moduleName) => !parsedFiles.has(`src/bausteine/${moduleName}.tsx`) && !parsedFiles.has(`src/bausteine/${moduleName}.ts`),
);

const summary = {
  total: rows.length,
  active: count((row) => row.status === 'active'),
  legacy: count((row) => row.status === 'legacy'),
  unused: count((row) => row.status === 'unused'),
  public: count((row) => row.publicNamespace !== null),
  unusedPublic: count((row) => row.status === 'unused' && row.publicNamespace !== null),
  deletionCandidates: count((row) => row.deletionRisk === 'candidate'),
  ambiguousNames: duplicateNames.length,
};

const report = {
  generatedBy: 'scripts/analyze-bausteine-usage.mjs',
  policy: {
    active: 'Referenced by production source outside src/bausteine and outside support/demo/test files.',
    legacy: 'Not production-active, but referenced by another baustein or support/demo/test source.',
    unused: 'No production, internal, or support reference found. Public namespace exposure is tracked separately.',
    deletionRule: 'Only deletionRisk=candidate is structurally unreferenced and not publicly exported; every deletion still requires semantic review.',
  },
  summary,
  duplicateNames,
  publicModulesMissingFromDisk,
  components: rows,
};

const markdown = () => {
  const lines = [
    '# Baustein Usage Report',
    '',
    `- Gesamt: **${summary.total}**`,
    `- Active: **${summary.active}**`,
    `- Legacy: **${summary.legacy}**`,
    `- Unused: **${summary.unused}**`,
    `- Davon öffentlich erreichbar: **${summary.unusedPublic}**`,
    `- Strukturelle Löschkandidaten: **${summary.deletionCandidates}**`,
    `- Mehrdeutige Exportnamen: **${summary.ambiguousNames}**`,
    '',
    '| Status | Komponente | Quelle | Public API | Löschrisiko |',
    '|---|---|---|---|---|',
    ...rows.map((row) =>
      `| ${row.status} | \`${row.name}\` | \`${row.source}\` | ${row.publicNamespace ? `\`${row.publicNamespace}\`` : '—'} | ${row.deletionRisk} |`,
    ),
    '',
    '> `unused` bedeutet nicht automatisch löschbar. Ein öffentlicher Namespace-Export bleibt ein Kompatibilitätsvertrag.',
    '',
  ];
  return lines.join('\n');
};

if (writeReport) {
  const outDir = path.join(root, 'out');
  await mkdir(outDir, {recursive: true});
  await writeFile(path.join(outDir, 'bausteine-usage.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(path.join(outDir, 'bausteine-usage.md'), markdown(), 'utf8');
}

const checkErrors = [];
if (rows.length === 0) checkErrors.push('Keine exportierten Baustein-Komponenten erkannt.');
if (rows.some((row) => !['active', 'legacy', 'unused'].includes(row.status))) {
  checkErrors.push('Mindestens eine Komponente hat keinen gültigen Status.');
}
if (publicModulesMissingFromDisk.length > 0) {
  checkErrors.push(`Design-System verweist auf fehlende Bausteinmodule: ${publicModulesMissingFromDisk.join(', ')}`);
}

if (jsonOnly) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(
    `Baustein-Nutzung: ${summary.total} Komponenten — active ${summary.active}, legacy ${summary.legacy}, unused ${summary.unused}.`,
  );
  console.log(
    `Public API: ${summary.public} Komponenten; unused+public ${summary.unusedPublic}; direkte strukturelle Löschkandidaten ${summary.deletionCandidates}.`,
  );
  if (duplicateNames.length > 0) {
    console.log(`Mehrdeutige Namen (${duplicateNames.length}): ${duplicateNames.map((item) => item.name).join(', ')}`);
  }
  if (writeReport) console.log('Report geschrieben: out/bausteine-usage.json und out/bausteine-usage.md');
}

if (checkMode && checkErrors.length > 0) {
  for (const error of checkErrors) console.error(`Baustein-Usage-Fehler: ${error}`);
  process.exit(1);
}

if (checkMode) console.log('Baustein-Usage-Klassifizierung ist vollständig und konsistent.');
