import { sveltekit } from '@sveltejs/kit/vite'
import { defineProject } from 'vitest/config'

export default defineProject({
  plugins: [sveltekit()],
  test: {
    environment: 'jsdom',
  },
})
