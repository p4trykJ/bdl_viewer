module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ['prettier'],
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    'plugin:prettier/recommended',
  ],
  rules: {
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 20,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
    'vue/no-unused-vars': 'off',
    'no-plusplus': ['error', {allowForLoopAfterthoughts: true}],
    'no-param-reassign': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'warn',
    'prettier/prettier': 'warn',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
