import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugin: [react(), eslintPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});
