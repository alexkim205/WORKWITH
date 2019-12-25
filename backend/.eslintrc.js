module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: ["airbnb-base", "prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  plugins: ["prettier"],
  rules: {
    // "linebreak-style": ["error", "windows"],
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "prettier/prettier": ["error"]
  }
};
