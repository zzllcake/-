// ============================================================
// 错误类别: 导入模块错误
// 可检测: 是
// 预期命中规则: import/no-unresolved, import/no-useless-path-segments
// 片段数: 5
// ============================================================

// 【05-import-errors-1】【等级: error】导入不存在的包
import { helper } from 'package-not-exists-xyz';
export const h = helper;

// 【05-import-errors-2】【等级: error】导入不存在文件
import './no-such-file.js';
export const flag = 1;

// 【05-import-errors-3】【等级: error】导入不存在的导出
import { notExistExport } from '../utils/greet.js';
export const n = notExistExport;

// 【05-import-errors-4】【等级: warning】相对路径过深
import { greet } from '../../../src/utils/greet.js';
export const g = greet;

// 【05-import-errors-5】【等级: warning】缺少扩展名
import { greet as gt } from '../utils/greet';
export const g2 = gt;

export {};
