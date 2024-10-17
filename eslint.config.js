import eslint from "@eslint/js";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginPrettier from "eslint-plugin-prettier";
import globals from "globals";

export default [
  eslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      react: eslintPluginReact,
      prettier: eslintPluginPrettier,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Possible Errors
      "no-console": "warn",
      "no-constant-condition": "error",
      "no-dupe-args": "error",
      // Best Practices
      eqeqeq: ["error", "always"],
      "default-case": "error",
      "no-else-return": "warn",
      // Variables
      "no-unused-vars": "warn",
      "no-undef": "error",
      "prefer-const": "error",
      "no-var": "error",
      // Stylistic Issues
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      // ES6+ Features
      "arrow-parens": ["error", "always"],
      "no-duplicate-imports": "error",
      // Prettier Integration
      "prettier/prettier": ["error", { endOfLine: "auto" }], // Prettier 규칙을 ESLint에서 오류로 처리
    },
  },
];
