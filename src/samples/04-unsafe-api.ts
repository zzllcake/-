// ============================================================
// 错误类别: 不安全函数使用
// 可检测: 是
// 预期命中规则: no-eval, no-new-func, no-restricted-syntax, security/detect-eval-with-expression
// 片段数: 6
// ============================================================

// 【04-unsafe-api-1】【等级: error】eval 执行
export function useEval(code: string) { return eval(code); }

// 【04-unsafe-api-2】【等级: error】new Function
export const dynFn = new Function("return 1 + 1");

// 【04-unsafe-api-3】【等级: error】innerHTML 注入
export function setHtml(el: HTMLElement, html: string) { el.innerHTML = html; }

// 【04-unsafe-api-4】【等级: error】document.write
export function writeDoc() { document.write("<b>x</b>"); }

// 【04-unsafe-api-5】【等级: warning】outerHTML 覆盖
export function setOuter(el: HTMLElement) { el.outerHTML = "<div>x</div>"; }

// 【04-unsafe-api-6】【等级: warning】setTimeout 字符串
export function strTimer() { setTimeout("doWork()", 1000); }

export {};
