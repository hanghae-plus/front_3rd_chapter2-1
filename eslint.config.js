import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
// import importPlugin from 'eslint-plugin-import';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // importPlugin.flatConfig.recommended,
  pluginReact.configs.flat.recommended,
  eslintPluginPrettierRecommended,
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: globals.browser,
    },
  },
];
