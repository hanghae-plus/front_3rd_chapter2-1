// https://typescript-eslint.io/packages/typescript-eslint/
// https://brunch.co.kr/@hongjyoun/118

import eslint from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser, parser: tseslint.parser },
    plugins: { react: eslintPluginReact, 'react-hooks': eslintPluginReactHooks },
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-var': 'error',
      'func-style': ['warn', 'expression'],
      'prefer-arrow-callback': 'warn',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always', // import 사이에 빈 줄 추가
        },
      ],
      'sort-imports': [
        'error',
        {
          ignoreCase: true, // 대소문자 구분
          ignoreDeclarationSort: true, // import 순서 무시
          ignoreMemberSort: false, // 멤버 정렬 {b, a} => {a, b}
          // a => none, * as a from => all, {a} from => single, {a, b} from => multiple
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],
      'import/resolver': {
        node: {
          paths: ['src'],
        },
      },
    },
  },
);
