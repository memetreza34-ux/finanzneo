export const PROTECTED_EXACT_PATHS = new Set([
  'AGENTS.md',
  'CLAUDE.md',
  'MASTER-PROMPTS.md',
  'START-HIER.md',
  'package.json',
  'package-lock.json',
  'npm-shrinkwrap.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'docs/3-PHASEN-WORKFLOW.md',
  'docs/FINANZNEO-IMAGE-WORLD-V3.md',
  'docs/PLATFORM-PUBLISHING.md',
  'docs/YOUTUBE-LONGFORM-WORKFLOW.md',
  'reels/PRODUKTIONSSTANDARD.md',
  'youtube/PRODUKTIONSSTANDARD.md',
]);

export const PROTECTED_PATH_PREFIXES = [
  '.github/workflows/',
  'scripts/lib/',
  'src/brand/',
  'src/finance/',
];

export const PROTECTED_FILE_PATTERNS = [
  /^scripts\/(?:check|validate|scaffold)-.*\.(?:mjs|js)$/,
  /^scripts\/antigravity-repo-safety-check\.mjs$/,
  /^tests\/(?:reel|youtube|finance).*\.test\.ts$/,
];

export const isProtectedPath = (path) => (
  PROTECTED_EXACT_PATHS.has(path)
  || PROTECTED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))
  || PROTECTED_FILE_PATTERNS.some((pattern) => pattern.test(path))
);

export const isDirectMainPushLine = (line) => {
  const fields = line.trim().split(/\s+/);
  return fields.length >= 4 && fields[2] === 'refs/heads/main';
};
