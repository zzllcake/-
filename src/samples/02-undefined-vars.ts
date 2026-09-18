// ============================================================
// 错误类别: 未定义变量
// 可检测: 是
// 预期命中规则: no-undef, @typescript-eslint/no-unused-vars, no-shadow
// 片段数: 6
// ============================================================

// 【02-undefined-vars-1】【等级: error】引用未定义变量
export function useUndef() { return notDefinedVar; }

// 【02-undefined-vars-2】【等级: error】调用未定义函数
export function callUndef() { return missingFn(1, 2); }

// 【02-undefined-vars-3】【等级: error】拼写错误变量名
const cfg = { host: "localhost" };
export function readCfg() { return config.host; }

// 【02-undefined-vars-4】【等级: warning】未使用顶层变量
export const neverUsed = "value";

// 【02-undefined-vars-5】【等级: warning】未使用函数参数
export function unusedParams(a: number, b: number, c: number) { return a; }

// 【02-undefined-vars-6】【等级: warning】变量遮蔽
export function shadowed() { const v = 1; { const v = 2; return v; } }

export {};
