/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

// Define ignores first to prevent any processing of ignored files
const ignores = [
  '**/node_modules/**',
  '**/dist/**',
  '**/coverage/**',
  '**/build/**',
  '**/public/**',
  'jest.config.js',
  'test/jest-e2e.config.js',
];

// Get all TypeScript ESLint configs
const tsConfigs = tseslint.configs.recommended;

module.exports = [
  // Ignore patterns should be applied first
  { ignores },

  // Base ESLint recommended config
  eslint.configs.recommended,

  // Apply all TypeScript ESLint configs
  ...tsConfigs,

  // Custom TypeScript configuration for .ts files only
  {
    files: ['**/*.ts'],
    plugins: {
      prettier: prettierPlugin,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
  },

  // Apply prettier config
  prettierConfig,
];
