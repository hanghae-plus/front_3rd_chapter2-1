import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  pluginJs.configs.recommended,
  {
    languageOptions: { globals: globals.browser },
    rules: {
      eqeqeq: 'error',
      'no-console': 'warn',
      curly: 'error',
      // 'comma-dangle': ['error', 'always-multiline'],
      'no-var': 'error',
    },
  },
];
