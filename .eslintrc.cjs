module.exports = {
  "env": {
      "browser": true,
      "es2021": true
  },
  "extends": [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  "parser": '@typescript-eslint/parser',
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    'react',
    '@typescript-eslint',
  ],
  
  "settings": {
    "react": {
      "version": 'detect',
    }
  },
  "rules": {
      "no-unused-vars": "warn",
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "indent": ["error", 2],
      "comma-dangle": ["error", "always-multiline"]
  }
}
