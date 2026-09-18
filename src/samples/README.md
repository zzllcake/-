# 测试样本说明

## 分类样本（可检测类）

| 文件 | 类别 | 片段数 | error | warning | 预期规则 |
|------|------|--------|-------|---------|----------|
| `01-js-syntax.ts` | JS语法错误 | 8 | 5 | 3 | `eqeqeq`, `no-var`, `no-cond-assign`, `no-constant-condition`, `no-implicit-globals` |
| `02-undefined-vars.ts` | 未定义变量 | 6 | 3 | 3 | `no-undef`, `@typescript-eslint/no-unused-vars`, `no-shadow` |
| `03-naming.ts` | 变量命名不规范 | 6 | 0 | 6 | `@typescript-eslint/naming-convention` |
| `04-unsafe-api.ts` | 不安全函数使用 | 6 | 4 | 2 | `no-eval`, `no-new-func`, `no-restricted-syntax`, `security/detect-eval-with-expression` |
| `05-import-errors.ts` | 导入模块错误 | 5 | 3 | 2 | `import/no-unresolved`, `import/no-useless-path-segments` |
| `06-duplicate-import.ts` | 重复导入 | 4 | 2 | 2 | `import/no-duplicates` |
| `07-deprecated-api.ts` | 废弃API调用 | 5 | 0 | 5 | `no-restricted-properties`, `no-restricted-syntax`, `no-restricted-globals` |
| `08-null-safety.ts` | 空值未判空 | 5 | 3 | 2 | `@typescript-eslint/no-non-null-assertion`, `@typescript-eslint/no-unnecessary-condition` |
| `09-ts-types.ts` | TS类型错误 | 5 | 3 | 2 | `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unsafe-*`, `@typescript-eslint/no-inferrable-types` |
| `10-complexity.ts` | 复杂度与可维护性 | 4 | 0 | 4 | `max-params`, `complexity`, `max-depth`, `@typescript-eslint/no-unused-vars` |
| `11-async-patterns.ts` | 异步模式问题 | 4 | 2 | 2 | `@typescript-eslint/no-floating-promises`, `@typescript-eslint/require-await`, `no-await-in-loop` |


// ============================================================
// ⚠️ 不可检测类错误（静态分析无法识别，不用于测试）
// ------------------------------------------------------------
// · 业务逻辑错误（如：计算折扣时用了加法而不是乘法）
// · 条件写反（如：应该 >= 却写成 <=，语法合法）
// · 算法错误（如：排序逻辑错误，语法合法）
// · 死循环（while(true) 是合法语法，仅能检测"变量未更新"模式）
// · 内存泄漏、性能问题
//
// 这些需要：单元测试 / 人工审查 / 运行时监控 来发现
// ============================================================
