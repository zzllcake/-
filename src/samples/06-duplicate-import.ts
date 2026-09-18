// ============================================================
// 错误类别: 重复导入
// 可检测: 是
// 预期命中规则: import/no-duplicates
// 片段数: 4
// ============================================================

// 【06-duplicate-import-1】【等级: error】同模块导入3次
import { describe } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
export const t = [describe, it, expect];

// 【06-duplicate-import-2】【等级: error】相对路径重复
import { greet } from '../utils/greet.js';
import { farewell } from '../utils/greet.js';
export const g = [greet, farewell];

// 【06-duplicate-import-3】【等级: warning】默认+命名重复
import * as nsA from 'node:path';
import { join } from 'node:path';
export const p = { nsA, join };

// 【06-duplicate-import-4】【等级: warning】别名重复导入
import { greet as g1 } from '../utils/greet.js';
import { greet as g2 } from '../utils/greet.js';
export const gg = [g1, g2];

export {};
