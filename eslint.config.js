import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';

export default [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: typescriptEslintParser,
    },
    plugins: {
      react: eslintPluginReact,
      prettier: eslintPluginPrettier,
      '@typescript-eslint': typescriptEslintPlugin,
    },
    rules: {
      'prettier/prettier': 'error', // Prettier 규칙을 에러로 처리
      'react/react-in-jsx-scope': 'off', // React 17부터 JSX 자동 import
      'no-unused-vars': 'warn', // 사용되지 않는 변수 경고
      '@typescript-eslint/no-unused-vars': ['warn'], // TypeScript의 unused 변수 경고
    },
    settings: {
      react: {
        version: 'detect', // React 버전 자동 감지
      },
    },
    ignores: ['node_modules/**'], // node_modules 폴더 무시
  },
];
