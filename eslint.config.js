// eslint.config.js
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{ts,tsx,js,jsx}'], // 린트할 파일 확장자
    ignores: ['node_modules', 'dist'], // 무시할 디렉터리
    languageOptions: {
      parser: tsParser, // TypeScript 파서 설정
      ecmaVersion: 2021, // 최신 ECMAScript 사용 가능
      sourceType: 'module', // ESM 모듈 방식 사용
    },
    plugins: {
      '@typescript-eslint': tsPlugin, // TypeScript 플러그인
      react: eslintPluginReact, // React 플러그인
      'react-hooks': eslintPluginReactHooks, // React Hooks 관련 린트
      import: eslintPluginImport, // import 관련 규칙
      prettier: eslintPluginPrettier,
    },
    rules: {
      // TypeScript 규칙들
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // React 규칙들
      'react/jsx-uses-react': 'off', // React 17+에서는 필요 없음
      'react/react-in-jsx-scope': 'off', // React 17+에서는 필요 없음
      'react-hooks/rules-of-hooks': 'error', // Hooks 규칙 강제
      'react-hooks/exhaustive-deps': 'warn', // 의존성 배열 검사

      // import 관련 규칙들
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            ['internal'],
            ['sibling', 'parent', 'index'],
          ],
          'newlines-between': 'always',
        },
      ],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      // 코드 스타일 관련 규칙 (Prettier와 호환)
      'prettier/prettier': 'error',

      // 기타 규칙들
      'no-console': 'warn', // console.log 사용 시 경고
      'no-debugger': 'error', // debugger 사용 금지
    },
    settings: {
      react: {
        version: 'detect', // 설치된 React 버전에 따라 자동 설정
      },
    },
  },
];
