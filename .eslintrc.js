module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended", // TypeScript 지원
    "plugin:prettier/recommended", // Prettier와 통합
    "prettier",
  ],
  parser: "@typescript-eslint/parser", // TypeScript 파서 지정
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error", // Prettier 규칙 위반 시 에러로 처리
    "react/react-in-jsx-scope": "off", // React 17부터 JSX에서 자동 import
    "no-unused-vars": "warn",
    "@typescript-eslint/no-unused-vars": ["warn"], // TypeScript의 unused 변수에 대한 경고
  },
};
