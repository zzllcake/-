// ============================================================
// 错误类别: 变量命名不规范
// 可检测: 是
// 预期命中规则: @typescript-eslint/naming-convention
// 片段数: 6
// ============================================================

// 【03-naming-1】【等级: warning】单字母变量
export const x = 42;

// 【03-naming-2】【等级: warning】snake_case 变量
export const user_age = 18;

// 【03-naming-3】【等级: warning】PascalCase 变量
export const UserName = "admin";

// 【03-naming-4】【等级: warning】无意义编号
export const data1 = 1;

// 【03-naming-5】【等级: warning】函数名过简
export function fn(a: number) { return a * 2; }

// 【03-naming-6】【等级: warning】参数无意义
export function calc(p: number, q: number) { return p + q; }

export {};
