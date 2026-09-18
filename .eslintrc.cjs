/* eslint-env node */
/**
 * 代码审查规则配置
 * ============================================================
 * 分级策略:
 *   error   - 安全漏洞、类型错误、未定义变量、无效导入（阻断合并）
 *   warning - 命名规范、代码风格、复杂度、废弃 API（不阻断，但返回前端）
 *   info    - 由工作流层补充（解析失败、跳过的文件等）
 * ============================================================
 */
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
  plugins: ['@typescript-eslint', 'import', 'security'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:security/recommended-legacy',
    'prettier', // 必须最后，关闭与 Prettier 冲突的规则
  ],
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  rules: {
    // ============================================================
    // 关闭（个人偏好/误报多）
    // ============================================================
    'no-console': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/restrict-template-expressions': 'off',

    // ============================================================
    // ❌ ERROR 级：安全与正确性（阻断，必须修）
    // ============================================================

    // --- 安全漏洞 ---
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-child-process': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-pseudoRandomBytes': 'error',

    // --- 正确性 ---
    'no-undef': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always', { null: 'never' }],
    'no-cond-assign': 'error',
    'no-constant-condition': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-unreachable': 'error',
    'no-unreachable-loop': 'error',
    'no-loss-of-precision': 'error',
    'no-self-compare': 'error',
    'no-sparse-arrays': 'error',
    'no-promise-executor-return': 'error',
    'no-constructor-return': 'error',
    'no-setter-return': 'error',
    'no-dupe-else-if': 'error',
    'no-unsafe-negation': 'error',
    'no-unsafe-optional-chaining': 'error',
    'no-nonoctal-decimal-escape': 'error',
    'no-useless-backreference': 'error',
    'no-async-promise-executor': 'error',
    'no-template-curly-in-string': 'error',
    'require-atomic-updates': 'error',
    'no-ex-assign': 'error',
    'no-import-assign': 'error',

    // --- 类型安全 ---
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-confusing-non-null-assertion': 'error',
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
    '@typescript-eslint/no-duplicate-enum-values': 'error',
    '@typescript-eslint/no-redundant-type-constituents': 'error',

    // --- 导入正确性 ---
    'import/no-unresolved': 'error',
    'import/no-duplicates': 'error',
    'import/no-absolute-path': 'error',
    'import/no-self-import': 'error',
    'import/no-cycle': 'error',
    'import/no-useless-path-segments': 'error',

    // ============================================================
    // ⚠️ WARNING 级：规范与可维护性（不阻断，仍返回前端）
    // ============================================================

    // --- 未使用 ---
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
    ],

    // --- 命名规范 ---
    '@typescript-eslint/naming-convention': [
      'warn',
      { selector: 'default', format: ['camelCase'], leadingUnderscore: 'allow', trailingUnderscore: 'allow' },
      { selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase'] },
      { selector: 'function', format: ['camelCase', 'PascalCase'] },
      { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
      { selector: 'typeLike', format: ['PascalCase'] },
      // 允许内容变量族（i/j/k 等索引）和短名
      { selector: 'variable', modifiers: ['const'], format: null, filter: { regex: '^[a-z]$', match: true } },
    ],

    // --- 废弃 API ---
    'no-restricted-properties': [
      'warn',
      { object: 'util', property: 'isArray', message: 'util.isArray 已废弃，请用 Array.isArray' },
      { object: 'util', property: 'isDate', message: 'util.isDate 已废弃' },
      { object: 'util', property: 'isError', message: 'util.isError 已废弃' },
      { property: 'substr', message: 'substr 已废弃，请用 slice/substring' },
      { property: '__proto__', message: '__proto__ 已废弃，请用 Object.getPrototypeOf' },
      { property: '__defineGetter__', message: '__defineGetter__ 已废弃' },
      { property: '__defineSetter__', message: '__defineSetter__ 已废弃' },
      { property: 'escape', message: 'escape 已废弃，请用 encodeURIComponent' },
      { property: 'unescape', message: 'unescape 已废弃，请用 decodeURIComponent' },
    ],
    'no-restricted-globals': [
      'warn',
      { name: 'escape', message: 'escape 已废弃，请用 encodeURIComponent' },
      { name: 'unescape', message: 'unescape 已废弃，请用 decodeURIComponent' },
      { name: 'event', message: '全局 event 已废弃，请用参数传递' },
    ],
    'no-restricted-syntax': [
      'warn',
      { selector: "NewExpression[callee.name='Buffer']", message: 'new Buffer() 已废弃，请用 Buffer.from()' },
      { selector: "MemberExpression[object.name='document'][property.name='write']", message: 'document.write 存在注入风险且已不推荐' },
      { selector: "AssignmentExpression[left.property.name='innerHTML']", message: 'innerHTML 存在 XSS 风险，请用 textContent 或 sanitize' },
      { selector: "AssignmentExpression[left.property.name='outerHTML']", message: 'outerHTML 存在 XSS 风险' },
      { selector: "MemberExpression[object.name='arguments'][property.name='callee']", message: 'arguments.callee 在严格模式禁用' },
    ],

    // --- 复杂度控制 ---
    'max-params': ['warn', 5],
    'max-depth': ['warn', 4],
    'max-nested-callbacks': ['warn', 3],
    'complexity': ['warn', 10],
    'max-lines-per-function': ['warn', 80],
    'max-lines': ['warn', 600],

    // --- 风格与可读性 ---
    'no-nested-ternary': 'warn',
    'prefer-const': 'warn',
    'prefer-template': 'warn',
    'prefer-spread': 'warn',
    'prefer-rest-params': 'warn',
    'prefer-object-spread': 'warn',
    'object-shorthand': ['warn', 'always'],
    'no-else-return': 'warn',
    'no-lonely-if': 'warn',
    'no-useless-concat': 'warn',
    'no-useless-rename': 'warn',
    'no-useless-return': 'warn',
    'no-useless-constructor': 'warn',
    'no-unused-expressions': 'warn',
    'no-shadow': 'warn',
    'no-param-reassign': 'warn',
    'no-array-constructor': 'warn',
    'no-new-object': 'warn',
    'no-new-wrappers': 'warn',
    'no-proto': 'warn',
    'no-caller': 'warn',
    'no-iterator': 'warn',
    'no-alert': 'warn',
    'no-implicit-globals': 'warn',
    'no-await-in-loop': 'warn',
    'no-loop-func': 'warn',
    'default-case': 'warn',
    'prefer-destructuring': ['warn', { array: false, object: true }],

    // --- 类型增强（建议级）---
    '@typescript-eslint/no-unnecessary-condition': 'warn',
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    '@typescript-eslint/no-inferrable-types': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/prefer-as-const': 'warn',
    '@typescript-eslint/prefer-includes': 'warn',
    '@typescript-eslint/prefer-for-of': 'warn',
    '@typescript-eslint/prefer-function-type': 'warn',
    '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
    '@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
    '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
    '@typescript-eslint/no-meaningless-void-operator': 'warn',
    '@typescript-eslint/no-unnecessary-template-expression': 'warn',
    '@typescript-eslint/switch-exhaustiveness-check': 'warn',
    '@typescript-eslint/unified-signatures': 'warn',
    '@typescript-eslint/consistent-generic-constructors': ['warn', 'constructor'],
    '@typescript-eslint/consistent-indexed-object-style': ['warn', 'record'],
    '@typescript-eslint/method-signature-style': ['warn', 'method'],

    // --- 异步规范 ---
    '@typescript-eslint/require-await': 'warn',

    // --- 导入风格 ---
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'type'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-default-export': 'off',
    'no-duplicate-imports': 'off', // 用 import/no-duplicates 替代
  },
  overrides: [
    {
      // 测试文件放宽部分规则
      files: ['**/*.test.ts', '**/*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        'max-lines-per-function': 'off',
        '@typescript-eslint/naming-convention': 'off',
      },
    },
    {
      // 测试样本/生成文件不参与审查
      files: ['src/error-types*.ts', 'src/error-test*.ts'],
      rules: {},
    },
  ],
  ignorePatterns: [
    'dist',
    'coverage',
    'node_modules',
    '*.config.*',
    'scripts/',
    '*.py',
    'src/error-types*.ts',
    'src/error-test*.ts',
  ],
};
