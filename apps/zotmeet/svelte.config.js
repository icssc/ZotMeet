// @ts-check

import adapter from '@svelte.kit/adapter-aws'
import { mdsvex } from 'mdsvex'
import { vitePreprocess } from '@sveltejs/kit/vite'

/**
 * @type {import('@sveltejs/kit').Config}
 */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [
    vitePreprocess({}),
    mdsvex({
      extensions: ['.md'],
    }),
  ],
  kit: {
    adapter: adapter(),
    env: {
      dir: '../..',
    },
  },
}

export default config
