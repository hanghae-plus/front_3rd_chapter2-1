import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugin: [react(), eslintPulgin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});
