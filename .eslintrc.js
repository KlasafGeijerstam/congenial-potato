const off = 0;
const warning = 1;
const error = 2;

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:react/jsx-runtime',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'react/jsx-filename-extension': [error, { extensions: ['.tsx', '.jsx'] }],
    'react/function-component-definition': [error, {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    }],
    'import/extensions': [off, 'never'],
    'no-unused-vars': off,
    '@typescript-eslint/no-unused-vars': [warning],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: [
          '.ts',
          '.tsx',
        ],
      },
    },
  },
};
