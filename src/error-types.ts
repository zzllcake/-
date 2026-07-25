// =============================================================================
// 全面代码审查 - 错误类型大全
// 100+ 不同类型的代码错误
// =============================================================================

// ========== 类别 A: 基础 JS 错误 (1-15) ==========
function a1(x, y) { return x == y; }
const a2 = "never used";
var a3 = "deprecated";
function a4(code) { return eval(code); }
function a5() { debugger; }
function a6() { try { JSON.parse("x"); } catch (e) {} }
function a7(arr) { delete arr[0]; }
a8_global = "bad";
function a9(name) { return "Hello " + name + "!"; }
function a10(qty) { return qty * 29.99 + 5.99; }
function a11(x) { return x ? true : false; }
function a12() { return (1, 2, 3); }
const a13 = new String("hello");
const a14 = new Number(42);
function a15(x, y) { return x; }

// ========== 类别 B: TypeScript 特有 (16-30) ==========
function b16(data: any): any { return data; }
function b17(x: string | undefined) { return x!.length; }
const b18 = "hello" as any;
const b19 = 42 as unknown as string;
const b20: Array<any> = [1, "two", true];
function b21<T>(x: number) { return x; }
const b22: number = 42;
function b23(x) { return JSON.parse(x); }
function b24(x) { return x; }
type B25 = {};
function b26<T extends string, U extends number>(x: T, y: U) {}
type B27 = string | number;
const b28 = <any>"typed";
const b29: string = 42;
const b30: null = undefined;

// ========== 类别 C: 异步/Promise (31-45) ==========
async function c31() { return Promise.resolve(1); }
function c32() { Promise.resolve("lost"); }
async function c33(items) { for (const item of items) { await new Promise(r => setTimeout(() => r(item), 100)); } }
async function c34() { return await 42; }
const c35 = new Promise(async (resolve) => { resolve("ok"); });
function c36() { return new Promise<void>(() => {}); }
function c37() { new Promise((_, reject) => reject(new Error("fail"))); }
function c38() { return Promise.resolve(1).then(d => d).catch(e => e); }
async function c39(): Promise<void> { return; }
async function c40() { try { await Promise.reject("error"); } catch {} }

// ========== 类别 D: 安全/规范 (46-60) ==========
const d46 = new Function("return 1");
function d47() { setTimeout("alert(1)", 100); }
const d48 = new RegExp("(");
Array.prototype.custom = function() {};
const d50 = {}.__proto__;
function d51() { const fns = []; for (var i = 0; i < 10; i++) { fns.push(function() { return i; }); } return fns; }
var d52 = 1; var d52 = 2;
function d53(x) { return x === true; }
function d54() { return arguments.callee; }
if (true) {}

// ========== 类别 E: 可维护性 (61-75) ==========
function e61(a, b, c, d, e, f, g, h) { return a + b + c + d + e + f + g + h; }
class E62 {} const E62 = 1;
export default function() { return 1; }
export function named() { return 2; }
if (false) { console.log("dead code"); }
function e66(a) { if (a > 0) { if (a > 10) { if (a > 20) { return "deep"; } } } }

// 导入问题
import { expect } from 'vitest';
import { describe, it } from 'vitest';
