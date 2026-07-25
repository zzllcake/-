/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier', // 必须在最后，关闭与 Prettier 冲突的规则
  ],
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  rules: {
    // ============================================================
    // 允许
    // ============================================================
    'no-console': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // ============================================================
    // 错误级别（会阻断 CI）
    // ============================================================

    // ----- TypeScript 严格规则 -----
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-extraneous-class': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',

    // ----- 最佳实践规则 -----
    'no-var': 'error',
    'prefer-const': 'error',
    'eqeqeq': ['error', 'always', { null: 'never' }],
    'no-eval': 'error',
    'no-duplicate-imports': 'error',
    'prefer-template': 'error',
    'no-alert': 'error',
    'no-iterator': 'error',
    'no-caller': 'error',
    'no-proto': 'error',
    'no-new-wrappers': 'error',
    'no-implicit-globals': 'error',
    'no-param-reassign': 'error',
    'no-unused-expressions': 'error',
    'no-shadow': 'error',
    'no-throw-literal': 'error',
    'no-nested-ternary': 'warn',
    'no-useless-concat': 'error',
    'no-useless-rename': 'error',
    'object-shorthand': ['error', 'always'],

    // ----- 复杂度控制 -----
    'max-params': ['warn', 5],
    'max-depth': ['warn', 4],
    'max-nested-callbacks': ['warn', 3],
    'complexity': ['warn', 10],

    // ----- 代码风格 -----
    'prefer-template': 'error',
    'prefer-spread': 'error',
    'prefer-rest-params': 'error',
    'prefer-destructuring': ['warn', { array: false, object: true }],
    'no-useless-return': 'error',
    'no-useless-constructor': 'error',
    'default-case': 'error',

    // ----- Import 排序 -----
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-duplicates': 'error',
    'no-duplicate-imports': 'off', // 用 import/no-duplicates 替代
    'import/no-useless-path-segments': 'error',
  },
  ignorePatterns: ['dist', 'coverage', 'node_modules', '*.config.*', 'src/error-types.ts'],
};
