import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  reactPlugin.configs.recommended,
  reactHooksPlugin.configs.recommended,
  {
    rules: {
      'no-var': 'error', // var 대신 let/const 사용 권장
      'prefer-const': 'error', // 재할당하지 않는 변수는 const로 선언
      eqeqeq: 'warn', // 일치 연산자 === 사용 권장
      'no-unused-vars': 'warn', // 사용되지 않는 변수가 있는지 경고
      'consistent-return': 'warn', // 함수에서 항상 값을 반환하도록 권장
      'no-redeclare': 'error', // 동일한 변수 재선언 금지
    },
  },
];
