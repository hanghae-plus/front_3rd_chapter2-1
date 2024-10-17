// eslint.config.js
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'], // 린트할 파일 확장자
    ignores: ['node_modules', 'dist'], // 무시할 디렉터리
    languageOptions: {
      parser: tsParser, // TypeScript 파서 설정
      ecmaVersion: 'latest', // 최신 ECMAScript 사용 가능
      sourceType: 'module', // ESM 모듈 방식 사용
      globals: globals.browser, // 브라우저 글로벌 설정
    },
    plugins: {
      '@typescript-eslint': tsPlugin, // TypeScript 플러그인
      react: eslintPluginReact, // React 플러그인
      'react-hooks': reactHooks, // React Hooks 관련 린트
      import: eslintPluginImport, // import 관련 규칙
      prettier: eslintPluginPrettier, // Prettier 관련 규칙
      'react-refresh': reactRefresh, // React Refresh 관련 규칙
    },
    rules: {
      // TypeScript 규칙들
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],

      // React 규칙들
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

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
      'no-undef': 'error',
      '@typescript-eslint/no-explicit-any': 'warn', // any 사용 시 경고
      '@typescript-eslint/explicit-module-boundary-types': 'warn', // 함수 및 모듈의 반환 타입을 명시하도록 요구
      '@typescript-eslint/no-empty-function': 'warn', // 빈 함수 정의를 경고
      '@typescript-eslint/no-inferrable-types': 'warn', // 타입이 유추 가능한 경우 명시하지 않도록 경고
    },
    settings: {
      react: {
        version: 'detect', // 설치된 React 버전에 따라 자동 설정
      },
    },
  },
];
