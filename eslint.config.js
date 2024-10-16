import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  { ignores: ['node_modules/', 'src/main.js', '**/__tests__/'] },
  pluginJs.configs.recommended,
  {
    languageOptions: { globals: globals.browser },
    rules: {
      eqeqeq: 'error',
      'no-console': 'warn',
      curly: ['error', 'multi-or-nest'],
      'no-var': 'error',
      'no-undefined': 'error',
    },
  },
];
