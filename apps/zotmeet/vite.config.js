import { sveltekit } from '@sveltejs/kit/vite'
import { defineProject } from 'vitest/config'
import Icons from 'unplugin-icons/vite'

export default defineProject({
  plugins: [
    sveltekit(),
    Icons({
      compiler: 'svelte',
    }),
  ],
  test: {
    environment: 'jsdom',
  },
})
