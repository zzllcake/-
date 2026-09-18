// ============================================================
// 错误类别: 复杂度与可维护性
// 可检测: 是
// 预期命中规则: max-params, complexity, max-depth, @typescript-eslint/no-unused-vars
// 片段数: 4
// ============================================================

// 【10-complexity-1】【等级: warning】参数过多
export function manyParams(a: number, b: number, c: number, d: number, e: number, f: number) { return a + b + c + d + e + f; }

// 【10-complexity-2】【等级: warning】过深嵌套
export function deepNest(x: number) { if (x > 0) { if (x > 10) { if (x > 20) { if (x > 30) { return "deep"; } } } } return "shallow"; }

// 【10-complexity-3】【等级: warning】圈复杂度过高
export function complex(a: number, b: number, c: number) { let r = 0; if (a > 0) { r += a; } else if (a < 0) { r -= a; } else { r += 1; } if (b > 0) { r += b; } else if (b < 0) { r -= b; } else { r += 2; } if (c > 0) { r += c; } else if (c < 0) { r -= c; } else { r += 3; } return r; }

// 【10-complexity-4】【等级: warning】长函数
export function longFn() { let s = 0; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; s += 1; return s; }

export {};
