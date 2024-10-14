import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  pluginJs.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    languageOptions: { globals: globals.browser },
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
    },
  },
];
