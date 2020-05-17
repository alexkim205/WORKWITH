module.exports = {
  env: {
    browser: true,
    es6: true,
    mocha: true,
    jest: true
  },
  parser: 'babel-eslint',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    sourceType: 'module'
  },
  extends: ['airbnb-base', 'prettier', 'plugin:react/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'linebreak-style': ['error', 'windows'],
    'no-underscore-dangle': [0],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
  },
  settings: {
    react: {
      version: 'latest'
    }
  }
};
