// ============================================================
// 错误类别: JS语法错误
// 可检测: 是
// 预期命中规则: eqeqeq, no-var, no-cond-assign, no-constant-condition, no-implicit-globals
// 片段数: 8
// ============================================================

// 【01-js-syntax-1】【等级: error】松散相等
export function looseEq(a: number, b: number) { return a == b; }

// 【01-js-syntax-2】【等级: error】使用 var
export function useVar() { var x = 1; return x; }

// 【01-js-syntax-3】【等级: error】条件赋值
export function condAssign(x: number) { if ((x = 5)) { return x; } return 0; }

// 【01-js-syntax-4】【等级: error】常量条件
export function constCond() { if (true) { return 1; } return 2; }

// 【01-js-syntax-5】【等级: error】隐式全局
export function implicitGlobal() { undeclaredName = 42; return 1; }

// 【01-js-syntax-6】【等级: warning】嵌套三元
export function nestedTernary(x: number) { return x > 0 ? x < 10 ? "small" : "big" : "neg"; }

// 【01-js-syntax-7】【等级: warning】多余分号
export function extraSemi() { const a = 1;; return a; }

// 【01-js-syntax-8】【等级: warning】逗号表达式
export function commaOp() { const x = (1, 2, 3); return x; }

export {};
