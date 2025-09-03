import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: [path.resolve(__dirname, 'vitest.setup.tsx')],
    globals: true,
    css: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  css: {
    // Avoid loading project PostCSS config during tests
    postcss: { plugins: [] },
  },
  esbuild: {
    jsx: 'automatic',
  },
})


