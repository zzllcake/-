// ============================================================
// 错误类别: TS类型错误
// 可检测: 是
// 预期命中规则: @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-*, @typescript-eslint/no-inferrable-types
// 片段数: 5
// ============================================================

// 【09-ts-types-1】【等级: error】any 类型滥用
export function anyFn(d: any): any { return d; }

// 【09-ts-types-2】【等级: error】不安全赋值
export function unsafeAssign() { const s: string = JSON.parse("{}"); return s; }

// 【09-ts-types-3】【等级: error】不安全返回
export function unsafeReturn() { return JSON.parse("{}"); }

// 【09-ts-types-4】【等级: warning】双重类型断言
export function dblAssert(x: unknown) { return x as unknown as string; }

// 【09-ts-types-5】【等级: warning】可推断的类型标注
export const numValue: number = 42;

export {};
