import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

const testConfig = {
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
};

const basicConfig = {
  ...testConfig,
};

const advancedConfig = {
  root: './index.advanced.html',
  plugins: [react(), tsconfigPaths()],
  ...testConfig,
};

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    if (mode === 'advanced') {
      return advancedConfig;
    }
  }
  return basicConfig;
});
