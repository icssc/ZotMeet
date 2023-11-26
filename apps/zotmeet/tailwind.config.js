// @ts-check

import { join } from 'node:path'

import { skeleton } from '@skeletonlabs/tw-plugin'

import { zotmeetTheme } from './src/theme'

/**
 * @type {import('tailwindcss').Config}
 */
const config = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}'),
  ],
  plugins: [
    skeleton({
      themes: { custom: [zotmeetTheme] },
    }),
  ],
}

export default config
