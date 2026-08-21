import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

const typescriptFiles = ['src/**/*.{ts,tsx}', 'tests/**/*.ts'];

export default tseslint.config(
  {
    ignores: ['build/**', 'dist/**', 'node_modules/**', 'out/**'],
  },
  {
    ...eslint.configs.recommended,
    files: ['scripts/**/*.mjs', 'eslint.config.mjs'],
    languageOptions: {
      ...eslint.configs.recommended.languageOptions,
      globals: globals.node,
    },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: typescriptFiles,
  })),
  {
    files: typescriptFiles,
    plugins: {
      'unused-imports': unusedImports,
    },
    languageOptions: {
      globals: {...globals.browser, ...globals.node},
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['error', {argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],
    },
  },
);
