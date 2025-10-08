import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['src/tests/setup.ts'],
    },
    exclude: [...configDefaults.exclude, 'tests/e2e/**', 'playwright-report/**', 'playwright/.cache/**'],
  },
})
