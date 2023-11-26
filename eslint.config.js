// @ts-check

import path from 'node:path'
import url from 'node:url'

import { FlatCompat } from '@eslint/eslintrc'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Backwards compatibility module.
 *
 * @see https://eslint.org/blog/2022/08/new-config-system-part-2/#backwards-compatibility-utility
 */
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
})

/**
 * @type{import('eslint').Linter.FlatConfig[]}
 */
const config = [
  ...compat.config({
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2020,
      extraFileExtensions: ['.svelte'],
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'standard-with-typescript',
      'airbnb-base',
      'airbnb-typescript/base',
      'plugin:svelte/recommended',
      'prettier',
    ],
    plugins: ['import', '@typescript-eslint'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc' },
          'newlines-between': 'always',
        },
      ],
    },
    overrides: [
      {
        files: ['*.svelte'],
        parser: 'svelte-eslint-parser',
        parserOptions: {
          parser: '@typescript-eslint/parser',
        },
      },
    ],
    ignorePatterns: ['.svelte-kit', '*.config.*'],
  }),
]

export default config
