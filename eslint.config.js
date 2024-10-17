import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/', 'src/main.js', '**/__tests__/'],
    languageOptions: { globals: globals.browser },
    plugins: {
      react: pluginReact,
    },
    settings: { react: { version: 'detect' } },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  eslintConfigPrettier,
  {
    rules: {
      eqeqeq: 'error',
      'no-console': 'warn',
      curly: ['error', 'multi-or-nest'],
      'no-var': 'error',
      'no-undefined': 'error',
    },
  },
];
