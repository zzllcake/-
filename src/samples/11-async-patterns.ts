// ============================================================
// 错误类别: 异步模式问题
// 可检测: 是
// 预期命中规则: @typescript-eslint/no-floating-promises, @typescript-eslint/require-await, no-await-in-loop
// 片段数: 4
// ============================================================

// 【11-async-patterns-1】【等级: error】未处理 Promise
export function floating() { Promise.resolve("lost"); }

// 【11-async-patterns-2】【等级: warning】async 无 await
export async function noAwait() { return Promise.resolve(1); }

// 【11-async-patterns-3】【等级: warning】循环内 await
export async function awaitLoop(items: number[]) { for (const i of items) { await Promise.resolve(i); } return items.length; }

// 【11-async-patterns-4】【等级: error】Promise executor 返回值
export const pe = new Promise<number>((resolve) => { return resolve(1); });

export {};
