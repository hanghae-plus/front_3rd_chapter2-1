import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import babelParser from '@babel/eslint-parser';

const compat = new FlatCompat();

export default [
  ...compat.extends('eslint-config-airbnb'),
  eslintPluginPrettierRecommended,
  {
    ignores: ['**/__tests__/*'],
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['@babel/preset-env'],
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'no-alert': 'off',
      radix: 'off',
      'no-param-reassign': 'off',
      'no-promise-executor-return': 'off',
      'no-plusplus': 'off',
    },
  },
];
