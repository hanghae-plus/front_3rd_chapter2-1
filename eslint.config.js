import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  pluginJs.configs.recommended,
  {
    languageOptions: { globals: globals.browser },
    ignores: ['node_modules/', 'src/main.js'],
    rules: {
      eqeqeq: 'error',
      'no-console': 'warn',
      curly: 'error',
      // 'comma-dangle': ['error', 'always-multiline'],
      'no-var': 'error',
      'no-undefined': 'error',
    },
  },
];
