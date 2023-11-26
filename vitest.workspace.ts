import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: './apps/zotmeet/vite.config.js',
    test: {
      environment: 'jsdom',
    },
  },
])
