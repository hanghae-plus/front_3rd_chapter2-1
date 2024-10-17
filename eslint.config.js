import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['node_modules/', 'src/main.js', '**/__tests__/'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  {
    rules: {
      eqeqeq: 'error',
      'no-console': 'warn',
      curly: ['error', 'multi-or-nest'],
      'no-var': 'error',
      'no-undefined': 'error',
    },
  },
  eslintConfigPrettier,
];
