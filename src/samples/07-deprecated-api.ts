// ============================================================
// 错误类别: 废弃API调用
// 可检测: 是
// 预期命中规则: no-restricted-properties, no-restricted-syntax, no-restricted-globals
// 片段数: 5
// ============================================================

// 【07-deprecated-api-1】【等级: warning】substr 已废弃
export function useSubstr(s: string) { return s.substr(0, 5); }

// 【07-deprecated-api-2】【等级: warning】__proto__ 访问
export function useProto(o: object) { return o.__proto__; }

// 【07-deprecated-api-3】【等级: warning】escape 已废弃
export function useEscape() { return escape("hi"); }

// 【07-deprecated-api-4】【等级: warning】unescape 已废弃
export function useUnescape(s: string) { return unescape(s); }

// 【07-deprecated-api-5】【等级: warning】arguments.callee
export function useCallee() { return arguments.callee; }

export {};
