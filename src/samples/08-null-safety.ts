// ============================================================
// 错误类别: 空值未判空
// 可检测: 是
// 预期命中规则: @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-condition
// 片段数: 5
// ============================================================

// 【08-null-safety-1】【等级: error】非空断言后访问
export function unsafe(o: { n?: string }) { return o.n!.length; }

// 【08-null-safety-2】【等级: error】链式非空断言
export function chain(d: { u?: { n?: string } }) { return d.u!.n!.toUpperCase(); }

// 【08-null-safety-3】【等级: error】数组可能 undefined
export function arrAccess(a: number[] | undefined) { return a![0]; }

// 【08-null-safety-4】【等级: warning】未判空直接访问
export function noCheck(v: string | null) { if (v != null) { return v.length; } return 0; }

// 【08-null-safety-5】【等级: warning】可选属性未判空
export function optProp(o: { list?: string[] }) { return o.list?.length ?? 0; }

export {};
