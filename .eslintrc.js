export default {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],

  extends: ["eslint:recommended", "prettier", "plugin:prettier/recommended"],
  rules: {
    indent: ["error", 2],
    semi: ["error", "always"], // 항상 세미콜론을 붙이도록 설정,
    quotes: ["error", "double"], // 기본 규칙을 작은 따옴표 사용으로 설정,
    camelcase: "error", // camelCase 변수명 강제,
    "max-len": ["error", { code: 500 }], // 한 줄에 500자 이상 금지
    "no-unused-vars": "warn", // 선언했지만 사용하지 않는 변수에 대해 경고
    "prefer-const": "error", // 상수는 let 대신 const로 선언,
    "space-before-function-paren": ["error", "always"], // 함수 선언 괄호 앞에 공백 추가
    "func-call-spacing": ["error", "never"], // 함수식별자와 호출사이에는 공백이 없어야 합니다.
    "rest-spread-spacing": ["error", "never"], // 스프레드 연산자와 표현식 사이에 공백이 없어야 합니다.
    "key-spacing": ["error", { beforeColon: false, afterColon: true }], // 콜론과 키 값 쌍의 값 사이에 공백을 추가해야 합니다.
    "keyword-spacing": [
      "error",
      {
        before: true, // 키워드 앞에 공백을 요구
        after: true, // 키워드 뒤에 공백을 요구
      },
    ],
    "prefer-arrow-callback": "error", // 콜백 함수에서 화살표 함수를 사용하도록 강제,
    "func-style": ["error", "expression"], // 함수 표현식을 강제
    "prettier/prettier": ["error", { printWidth: 200 }],
  },
  ignorePatterns: ["node_modules/", "dist/", "build/*", "*.test.js"],
  overrides: [],
};
