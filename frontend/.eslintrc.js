module.exports = {
  env: {
    browser: true,
    es6: true,
    mocha: true,
    jest: true
  },
  parser: "babel-eslint",
  extends: ["plugin:react/recommended", "airbnb-base", "prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["react", "prettier"],
  rules: {
    // "linebreak-style": ["error", "windows"],
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "prettier/prettier": ["error"]
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};
