import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // 사용되지 않는 변수가 있으면 경고를 표시합니다.
      'no-unused-vars': 'warn',

      // console.log() 등의 콘솔 메서드 사용 시 경고를 표시합니다.
      'no-console': 'warn',

      // alert(), prompt(), confirm() 등의 사용을 금지합니다.
      'no-alert': 'error',

      // 느슨한 비교(==, !=) 대신 항상 엄격한 비교(===, !==)를 사용하도록 강제합니다.
      eqeqeq: ['error', 'always'],

      // 재할당되지 않는 변수는 let 대신 const 사용을 강제합니다.
      'prefer-const': 'error',

      // var 키워드 대신 let 또는 const 사용을 강제합니다.
      'no-var': 'error',

      // 화살표 함수의 본문 스타일을 규정합니다. 가능한 경우 중괄호 없이 사용하도록 합니다.
      'arrow-body-style': ['error', 'as-needed'],

      // 화살표 함수의 매개변수에 항상 괄호를 사용하도록 합니다.
      'arrow-parens': ['error', 'always'],

      // 객체 리터럴에서 가능한 경우 항상 단축 구문을 사용하도록 합니다.
      'object-shorthand': 'error',

      // 문자열 연결 대신 템플릿 리터럴 사용을 권장합니다.
      'prefer-template': 'error',

      // 변수와 클래스를 사용하기 전에 선언하도록 강제합니다. 함수는 예외입니다.
      'no-use-before-define': [
        'error',
        { functions: false, classes: true, variables: true },
      ],

      // 한 줄의 최대 길이를 100자로 제한합니다. 초과 시 경고를 표시합니다.
      'max-len': ['warn', { code: 100 }],

      // 들여쓰기를 2칸으로 강제합니다.
      indent: ['error', 2],

      // 모든 문장의 끝에 세미콜론을 강제합니다.
      semi: ['error', 'always'],

      // 문자열에 작은따옴표 사용을 강제합니다.
      quotes: ['error', 'single'],

      // 여러 줄로 된 객체나 배열의 마지막 항목 뒤에 항상 콤마를 넣도록 강제합니다.
      'comma-dangle': ['error', 'always-multiline'],
    },
  },
];
