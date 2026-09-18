// ====================================================================
// 代码审查测试样本 - 80 个独立片段
// 覆盖 11 类错误，区分 error / warning 等级
// 生成时间: 自动生成，共 80 个片段
// ====================================================================


// ============================================================
// 错误类型: JS语法错误
// ============================================================

// 【片段 1】【错误类型: JS语法错误】【等级: error】
// 说明: 使用 == 而非 ===
function looseEqual(a: number, b: number) { return a == b; }

// 【片段 2】【错误类型: JS语法错误】【等级: error】
// 说明: 使用已废弃的 var
function oldSchoolVar() { var counter = 0; return counter; }

// 【片段 3】【错误类型: JS语法错误】【等级: warning】
// 说明: 条件中赋值
function assignInCondition(x: number) { if ((x = 5)) { return x; } return 0; }

// 【片段 4】【错误类型: JS语法错误】【等级: error】
// 说明: 逗号运算符
function commaOperator() { const x = (1, 2, 3); return x; }

// 【片段 5】【错误类型: JS语法错误】【等级: warning】
// 说明: 多余分号
function uselessSemicolon() { const a = 1;; return a; }

// 【片段 6】【错误类型: JS语法错误】【等级: error】
// 说明: 常量条件
function constantCondition() { if (true) { return 1; } return 2; }

// 【片段 7】【错误类型: JS语法错误】【等级: warning】
// 说明: 嵌套三元表达式
function nestedTernary(x: number) { return x > 0 ? x < 10 ? "small" : "big" : "negative"; }

// 【片段 8】【错误类型: JS语法错误】【等级: error】
// 说明: 隐式全局变量
function implicitGlobalAssign() { undeclaredVar = 42; return undeclaredVar; }


// ============================================================
// 错误类型: 未定义变量
// ============================================================

// 【片段 9】【错误类型: 未定义变量】【等级: error】
// 说明: 引用未定义变量
function useUndefined() { return notDefinedAnywhere; }

// 【片段 10】【错误类型: 未定义变量】【等级: error】
// 说明: 未使用的顶层变量
const unusedTopLevel = "never used";

// 【片段 11】【错误类型: 未定义变量】【等级: warning】
// 说明: 未使用的函数参数
function unusedParams(a: number, b: number, c: number) { return a; }

// 【片段 12】【错误类型: 未定义变量】【等级: error】
// 说明: 调用未定义函数
function callMissingFn() { return missingFunction(1, 2); }

// 【片段 13】【错误类型: 未定义变量】【等级: warning】
// 说明: 声明未使用
function declaredNotUsed() { const temp = 100; const other = 200; return other; }

// 【片段 14】【错误类型: 未定义变量】【等级: error】
// 说明: 变量名拼写错误
const config = { host: "localhost", port: 8080 };
function readDb() { return databaseConfig.host; }

// 【片段 15】【错误类型: 未定义变量】【等级: warning】
// 说明: 变量遮蔽
function shadowOuter() { const value = 1; { const value = 2; return value; } }

// 【片段 16】【错误类型: 未定义变量】【等级: error】
// 说明: TDZ 引用
function useBeforeDeclare() { return laterConst; }
const laterConst = 5;


// ============================================================
// 错误类型: 变量命名不规范
// ============================================================

// 【片段 17】【错误类型: 变量命名不规范】【等级: warning】
// 说明: 单字母变量名
const x = 42;
const y = "text";

// 【片段 18】【错误类型: 变量命名不规范】【等级: warning】
// 说明: 命名风格不一致(PascalCase+snake_case)
let UserName = "admin";
let user_age = 18;

// 【片段 19】【错误类型: 变量命名不规范】【等级: warning】
// 说明: 无意义编号命名
const data1 = 1;
const data2 = 2;
const data3 = 3;

// 【片段 20】【错误类型: 变量命名不规范】【等级: warning】
// 说明: 函数名过于简略
function fn(a: number) { return a * 2; }

// 【片段 21】【错误类型: 变量命名不规范】【等级: warning】
// 说明: 命名重复仅大小写不同
const TEMP = "tmp";
const Temp = "tmp2";

// 【片段 22】【错误类型: 变量命名不规范】【等级: warning】
// 说明: 参数命名无意义
function f(x: number, y: number, z: number) { return x + y + z; }

// 【片段 23】【错误类型: 变量命名不规范】【等级: warning】
// 说明: 含无意义数字后缀
const test123 = "t";
const tempValue2 = "v";


// ============================================================
// 错误类型: 不安全函数使用
// ============================================================

// 【片段 24】【错误类型: 不安全函数使用】【等级: error】
// 说明: eval 执行任意代码
function dangerousEval(code: string) { return eval(code); }

// 【片段 25】【错误类型: 不安全函数使用】【等级: error】
// 说明: new Function 动态编译
const dynamicFn = new Function("return 1 + 1");

// 【片段 26】【错误类型: 不安全函数使用】【等级: error】
// 说明: innerHTML 注入风险
function renderHtml(container: HTMLElement, html: string) { container.innerHTML = html; }

// 【片段 27】【错误类型: 不安全函数使用】【等级: warning】
// 说明: outerHTML 覆盖
function outerHtml(el: HTMLElement) { el.outerHTML = "<div>replaced</div>"; }

// 【片段 28】【错误类型: 不安全函数使用】【等级: error】
// 说明: document.write 注入
function writeDoc() { document.write("<script>alert(1)</script>"); }

// 【片段 29】【错误类型: 不安全函数使用】【等级: warning】
// 说明: setTimeout 传字符串
function stringTimer() { setTimeout("doSomething()", 1000); }

// 【片段 30】【错误类型: 不安全函数使用】【等级: warning】
// 说明: 间接 eval 调用
function googleEval() { return eval("var x = 1; x"); }


// ============================================================
// 错误类型: 导入模块错误
// ============================================================

// 【片段 31】【错误类型: 导入模块错误】【等级: error】
// 说明: 导入但未使用
import { readFile } from 'node:fs';
function useUnused() { return 1; }

// 【片段 32】【错误类型: 导入模块错误】【等级: error】
// 说明: 导入不存在的导出
import { nonExistentExport } from './utils/greet.js';
const x = 1;

// 【片段 33】【错误类型: 导入模块错误】【等级: warning】
// 说明: 相对路径过深
import '../../../../src/utils/greet.js';

// 【片段 34】【错误类型: 导入模块错误】【等级: warning】
// 说明: 通配符导入
import * as everything from './utils/greet.js';
const y = 2;

// 【片段 35】【错误类型: 导入模块错误】【等级: error】
// 说明: 导入不存在的包
import { helper } from 'this-package-does-not-exist';
const z = helper;

// 【片段 36】【错误类型: 导入模块错误】【等级: warning】
// 说明: 缺少文件扩展名
import { greet } from './utils/greet';
const g = greet;

// 【片段 37】【错误类型: 导入模块错误】【等级: error】
// 说明: 导入不存在的文件
import './nonexistent-file.js';


// ============================================================
// 错误类型: 重复导入
// ============================================================

// 【片段 38】【错误类型: 重复导入】【等级: error】
// 说明: 同一模块导入3次
import { describe } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
const a = 1;

// 【片段 39】【错误类型: 重复导入】【等级: error】
// 说明: 相对路径重复导入
import { add } from './utils/math.js';
import { sub } from './utils/math.js';
const b = 2;

// 【片段 40】【错误类型: 重复导入】【等级: warning】
// 说明: 默认+命名混合重复
import defaultExport from './utils/math.js';
import { named } from './utils/math.js';
const c = 3;

// 【片段 41】【错误类型: 重复导入】【等级: error】
// 说明: Node内置模块重复
import { readFileSync } from 'node:fs';
import { writeFileSync } from 'node:fs';
const d = 4;

// 【片段 42】【错误类型: 重复导入】【等级: warning】
// 说明: 通配符+命名重复
import * as ns1 from 'node:path';
import { join } from 'node:path';
const e = 5;

// 【片段 43】【错误类型: 重复导入】【等级: error】
// 说明: 重复导入+别名
import { expect as ex1 } from 'vitest';
import { expect as ex2 } from 'vitest';
const f = 6;

// 【片段 44】【错误类型: 重复导入】【等级: warning】
// 说明: 副作用导入重复
import './styles.css';
import './styles.css';
const g = 7;


// ============================================================
// 错误类型: 废弃API调用
// ============================================================

// 【片段 45】【错误类型: 废弃API调用】【等级: error】
// 说明: new Buffer 已废弃
function makeBuffer() { return new Buffer(10); }

// 【片段 46】【错误类型: 废弃API调用】【等级: warning】
// 说明: substr 已废弃
function useSubstr(s: string) { return s.substr(0, 5); }

// 【片段 47】【错误类型: 废弃API调用】【等级: error】
// 说明: escape 已废弃
function useEscape() { return escape("hello"); }

// 【片段 48】【错误类型: 废弃API调用】【等级: warning】
// 说明: unescape 已废弃
function useUnescape(s: string) { return unescape(s); }

// 【片段 49】【错误类型: 废弃API调用】【等级: error】
// 说明: arguments.callee 严格模式禁用
function useCallee() { return arguments.callee; }

// 【片段 50】【错误类型: 废弃API调用】【等级: warning】
// 说明: __proto__ 访问器已废弃
function useProto(obj: object) { return obj.__proto__; }

// 【片段 51】【错误类型: 废弃API调用】【等级: warning】
// 说明: __defineGetter__ 已废弃
function useDefineGetter() { const o = {}; o.__defineGetter__("x", () => 42); return o; }


// ============================================================
// 错误类型: 空值未判空
// ============================================================

// 【片段 52】【错误类型: 空值未判空】【等级: error】
// 说明: 非空断言后直接访问
function unsafeAccess(obj: { name?: string }) { return obj.name!.length; }

// 【片段 53】【错误类型: 空值未判空】【等级: error】
// 说明: 链式非空断言
function unsafeChain(data: { user?: { name?: string } }) { return data.user!.name!.toUpperCase(); }

// 【片段 54】【错误类型: 空值未判空】【等级: warning】
// 说明: 未判空直接访问
function maybeNull(v: string | null) { return v.length; }

// 【片段 55】【错误类型: 空值未判空】【等级: error】
// 说明: 数组可能是 undefined
function arrayAccess(arr: number[] | undefined) { return arr![0]; }

// 【片段 56】【错误类型: 空值未判空】【等级: warning】
// 说明: 使用 != 而非显式判空
function looseNullCheck(v: string | null) { if (v != null) { return v; } return ""; }

// 【片段 57】【错误类型: 空值未判空】【等级: error】
// 说明: await 结果未判空
async function unsafeAsync() { const res = await fetch("/api"); const data = await res!.json(); return data; }

// 【片段 58】【错误类型: 空值未判空】【等级: warning】
// 说明: 可选属性未判空
function optionalNoCheck(o: { list?: string[] }) { return o.list.length; }


// ============================================================
// 错误类型: 死循环风险
// ============================================================

// 【片段 59】【错误类型: 死循环风险】【等级: error】
// 说明: 循环变量未递增
function infiniteWhile() { let i = 0; while (i < 10) { console.log(i); } return i; }

// 【片段 60】【错误类型: 死循环风险】【等级: error】
// 说明: 循环内 await 且无退出条件
async function awaitInLoop(items: number[]) { for (const item of items) { await Promise.resolve(item); } return items; }

// 【片段 61】【错误类型: 死循环风险】【等级: warning】
// 说明: 反向变化导致死循环
function noDecrement() { let n = 10; while (n > 0) { n = n + 1; } return n; }

// 【片段 62】【错误类型: 死循环风险】【等级: error】
// 说明: 循环变量重置
function constantLoop() { for (let i = 0; i < 5; i = 0) { break; } return 0; }

// 【片段 63】【错误类型: 死循环风险】【等级: warning】
// 说明: 条件变量未更新
function unmodifiedCondition(list: number[]) { let idx = 0; while (idx < list.length) { console.log(list[0]); } return idx; }

// 【片段 64】【错误类型: 死循环风险】【等级: error】
// 说明: 无限递归
function neverEndingRecursion(n: number): number { return neverEndingRecursion(n + 1); }

// 【片段 65】【错误类型: 死循环风险】【等级: warning】
// 说明: 浮点相等判断死循环
function floatLoop() { let f = 0; while (f !== 1) { f += 0.1; } return f; }


// ============================================================
// 错误类型: 代码格式混乱
// ============================================================

// 【片段 66】【错误类型: 代码格式混乱】【等级: warning】
// 说明: 空格混乱
function   messySpacing(  a:number,b:number   ){return a+b;}

// 【片段 67】【错误类型: 代码格式混乱】【等级: warning】
// 说明: 缩进不一致
const badlyIndented = 1;
      const stillBad = 2;
                const veryBad = 3;

// 【片段 68】【错误类型: 代码格式混乱】【等级: warning】
// 说明: 引号风格不统一
const doubleQuote = "双引号";
const singleQuote = '单引号';

// 【片段 69】【错误类型: 代码格式混乱】【等级: warning】
// 说明: 行超长
const veryLongLine = 'this is a very long string that should probably be broken into multiple shorter lines but instead it just keeps going and going and going';

// 【片段 70】【错误类型: 代码格式混乱】【等级: warning】
// 说明: 过多空行
function multiBlankLines() {
  const a = 1;



  const b = 2;
  return a + b;
}

// 【片段 71】【错误类型: 代码格式混乱】【等级: warning】
// 说明: 尾随逗号不规范
function trailingComma() {
  return [1, 2, 3,];
}

// 【片段 72】【错误类型: 代码格式混乱】【等级: warning】
// 说明: 函数名与括号间多余空格
function noSpaceBeforeParen (x: number) { return x; }

// 【片段 73】【错误类型: 代码格式混乱】【等级: warning】
// 说明: 对象/数组格式混乱
const objStyle = {a :1 ,b: 2};
const arrStyle = [ 1,2 ,3 ];


// ============================================================
// 错误类型: TS类型错误
// ============================================================

// 【片段 74】【错误类型: TS类型错误】【等级: error】
// 说明: any 类型绕过检查
function anyAbuse(data: any): any { return data; }

// 【片段 75】【错误类型: TS类型错误】【等级: error】
// 说明: 类型赋值不匹配
const wrongType: string = 42;

// 【片段 76】【错误类型: TS类型错误】【等级: error】
// 说明: 参数类型不匹配
function mismatchedArgs(a: number) { return a; }
const result = mismatchedArgs("string");

// 【片段 77】【错误类型: TS类型错误】【等级: warning】
// 说明: 隐式 any 参数
function implicitAnyParam(param) { return param; }

// 【片段 78】【错误类型: TS类型错误】【等级: error】
// 说明: 数组元素类型不匹配
const arrayTypeMismatch: number[] = ["1", "2", "3"];

// 【片段 79】【错误类型: TS类型错误】【等级: warning】
// 说明: 双重类型断言
function doubleAssert(x: unknown) { return x as unknown as string; }

// 【片段 80】【错误类型: TS类型错误】【等级: error】
// 说明: 接口属性类型不匹配
interface MixedShape { id: number; }
const badShape: MixedShape = { id: "not-a-number" };

export {};
