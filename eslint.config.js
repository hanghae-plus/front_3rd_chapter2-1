import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  pluginJs.configs.recommended,
  {
    languageOptions: { globals: globals.browser },
    rules: {
      semi: ['error', 'always'],
      eqeqeq: ['error', 'always'],
      'no-unused-vars': ['warn'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-trailing-spaces': 'error',
    },
  },
];
