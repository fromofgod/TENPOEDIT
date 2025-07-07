module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'no-useless-escape': 'off', // 不要なエスケープ文字のエラーを無効化
    'no-unused-vars': 'warn', // 未使用変数を警告に変更
  }
};