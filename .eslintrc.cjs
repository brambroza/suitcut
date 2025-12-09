module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
  settings: {
    react: { version: 'detect' }
  },
  ignorePatterns: ['dist'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  rules: {
    'react-refresh/only-export-components': 'warn'
  },
  plugins: ['@typescript-eslint', 'react-refresh'],
  parser: '@typescript-eslint/parser'
};
