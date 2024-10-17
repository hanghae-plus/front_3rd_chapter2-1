import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{ ignores: ['dist'] },
	{
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
			'no-console': 'error', // console.log 사용 금지
			'no-use-before-define': ['error', { functions: false }], // 함수 선언 전 사용 금지
			'comma-dangle': ['error', 'always-multiline'], // 마지막 요소 뒤에 쉼표 사용
			quotes: ['error', 'single'], // 싱글 쿼테이션 사용
			'eol-last': ['error', 'always'], // 파일 끝에 개행 문자 추가
			'no-trailing-spaces': 'error', // 빈 줄 끝에 공백 금지
			eqeqeq: ['error', 'always'], // 일치 연산자 사용
			'object-curly-spacing': ['error', 'always'], // 객체 리터럴 중괄호 사이에 공백 추가
			'no-unused-vars': ['error', { vars: 'all', args: 'none' }], // 사용하지 않는 변수 금지
			'prefer-const': ['error'], // const 사용 권장
			'no-var': 'error', // var 사용 금지
			'no-shadow': 'error', // 변수 중복 선언 금지
			'consistent-return': 'off', // 일관된 return 사용
			'arrow-body-style': ['error', 'as-needed'], // 필요할 때만 중괄호 사용
			'no-duplicate-imports': 'error', // 중복된 import 금지
			'prefer-template': 'error', // 문자열 연결 시 템플릿 리터럴 사용 권장
			'spaced-comment': ['error', 'always', { exceptions: ['-', '+'] }],
			'no-case-declarations': 'off',
		},
	},
);
