import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@basic': path.resolve(__dirname, 'src/basic'),
        '@advanced': path.resolve(__dirname, 'src/advanced'),
        '@redux': path.resolve(__dirname, 'src/advanced/redux'),
        '@atoms': path.resolve(__dirname, 'src/advanced/components/atoms'),
        '@molecules': path.resolve(
          __dirname,
          'src/advanced/components/molecules'
        ),
        '@templates': path.resolve(
          __dirname,
          'src/advanced/components/templates'
        ),
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
    },
  })
);
