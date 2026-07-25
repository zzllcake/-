// ============================================================
// 100 个错误的代码 - 测试自动代码审查
// 看看审查能抓到几个？
// ============================================================

// 错误 1-5: any 类型滥用
function processData(data: any): any {
  const result: any = data;
  return result;
}

// 错误 6-10: 未使用变量
const unused1 = "hello";
const unused2 = 42;
const unused3 = true;
const unused4 = null;
const unused5 = undefined;

// 错误 11-15: var 声明
var oldStyle1 = "bad";
var oldStyle2 = 123;
var oldStyle3 = false;
var oldStyle4 = {};
var oldStyle5 = [];

// 错误 16-20: 缺少返回类型
function addNumbers(a: number, b: number) {
  return a + b;
}
function subtractNumbers(a: number, b: number) {
  return a - b;
}
function multiplyNumbers(a: number, b: number) {
  return a * b;
}
function divideNumbers(a: number, b: number) {
  return a / b;
}
function concatStrings(a: string, b: string) {
  return a + b;
}

// 错误 21-25: 隐式 any
function implicitAny(thing) {
  return thing;
}
function processItems(items) {
  return items.map(item => item);
}
function handleError(err) {
  console.log(err);
}
function getLength(input) {
  return input.length;
}
function transform(value) {
  return JSON.parse(value);
}

// 错误 26-30: 空函数
function doNothing1() {}
function doNothing2() {}
function doNothing3() {}
function doNothing4() {}
function doNothing5() {}

// 错误 31-35: 使用 == 而非 ===
function looseCompare(a: any, b: any) {
  if (a == b) return true;
  if (a != b) return false;
  if (null == undefined) return "loose";
  if (0 == false) return "coerced";
  if ("" == false) return "empty";
}

// 错误 36-40: 数字字面量 + 魔术数字
function calculatePrice(quantity: number) {
  return quantity * 29.99 + 5.99 + 0.15 * quantity * 29.99;
}
function calculateDiscount(price: number) {
  return price * 0.1 + 5;
}
function getTimeout() {
  return 3000;
}

// 错误 41-45: 字符串拼接 vs 模板字符串
function buildMessage1(name: string) {
  return "Hello, " + name + "! Welcome to " + "our system" + ".";
}
function buildMessage2(first: string, last: string) {
  return "User: " + first + " " + last + " (ID: " + Math.random() + ")";
}

// 错误 46-50: eval 使用
function dangerousEval(code: string) {
  return eval(code);
}
function parseJSON(input: string) {
  return eval("(" + input + ")");
}

// 错误 51-55: 重复的变量声明
let duplicate = 1;
let duplicate = 2;
var overlapping = "first";
var overlapping = "second";

// 错误 56-60: 类型不匹配
const numArray: number[] = ["1", "2", "3"];
const strValue: string = 12345;
const boolValue: boolean = "true";
const objValue: object = "not an object";
const nullCheck: null = undefined;

// 错误 61-65: Promise 使用不当
function fetchData() {
  return new Promise((resolve) => {
    resolve("data");
  }).then(result => {
    console.log(result);
  });
}
async function getData() {
  return "cached";
}
async function processAsync() {
  return fetchData().then(data => data);
}

// 错误 66-70: 未处理的 Promise
function fireAndForget() {
  fetchData();
  new Promise((resolve) => setTimeout(() => resolve("done"), 1000));
  Promise.resolve("lost");
}

// 错误 71-75: 数组方法错误
const strings = ["a", "b", "c"];
const numbers = strings.map((item) => {
  return parseInt(item);
});
const filtered = strings.filter((item) => {
  if (item.length > 0) return true;
});
const found = strings.find((item) => {
  if (item === "a") return item;
});

// 错误 76-80: 对象方法简写问题
const calculator = {
  add: function(a: any, b: any) { return a + b; },
  subtract: function(a: any, b: any) { return a - b; },
};

// 错误 81-85: 回调嵌套（回调地狱）
function callbackHell() {
  setTimeout(() => {
    setTimeout(() => {
      setTimeout(() => {
        console.log("nested");
      }, 100);
    }, 100);
  }, 100);
}

// 错误 86-90: 循环中的闭包问题
function closureProblems() {
  const results = [];
  for (var i = 0; i < 5; i++) {
    results.push(function() {
      return i;
    });
  }
  return results;
}

// 错误 91-95: 类型断言滥用
const input1 = "hello" as any;
const input2 = "world" as unknown;
const input3 = (42 as any) as string;
const input4 = <any>"typed";
const input5 = <number><any>"number";

// 错误 96-100: 混合错误
// @ts-ignore
function withIgnore() {
  const x: number = "string";
  return x;
}

export {
  processData,
  addNumbers,
  buildMessage1,
  dangerousEval,
  fetchData,
  callbackHell,
  closureProblems,
  calculator,
};

// ============================================================
// 更多错误 (第二部分)
// ============================================================

// 101-105: 错误的数组类型
const list1: Array<string> = [1, 2, 3];
const list2: Array<number> = ["x", "y"];
const list3: boolean[] = [0, 1, "true"];
const list4: object[] = ["string", 42, true];

// 106-110: async 函数没有 await
async function noAwait1() {
  return Promise.resolve(1);
}
async function noAwait2() {
  return fetchData();
}
async function noAwait3() {
  const p = Promise.resolve("no await");
  return p;
}

// 111-115: 参数命名问题（太短）
function calc(a, b, c, d) {
  return a + b - c * d;
}
function x(p, q) {
  return p + q;
}

// 116-120: 函数过长（单行）
const longLine = "this is a very long string that should be broken into multiple lines for better readability " +
  "but instead it keeps going on and on and on and on and on and on and on and on and on and on and on " +
  "and on and on and on and on and on and on and on and on and on and on and on";

// 121-125: 不必要的三元表达式
function ternaryMadness(condition: boolean) {
  return condition ? true : false;
}
function nestedTernary(x: number) {
  return x > 0 ? x < 10 ? "small" : "big" : "negative";
}

// 126-130: 未使用的函数参数
function handler(event: any, context: any, callback: any) {
  console.log(event);
}

function middleware(req: any, res: any, next: any) {
  console.log(req.url);
}

function routeHandler(request: any, response: any) {
  return { status: 200 };
}

// 131-135: 错误的异常处理
function badTryCatch() {
  try {
    JSON.parse("invalid");
  } catch (e) {
    // 空的 catch 块
  }
}

function swallowError() {
  try {
    throw new Error("something");
  } catch (e) {}
}

// 136-140: 使用 arguments
function oldSchool() {
  return arguments;
}
function sumOld() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

// 141-145: 修改函数参数
function mutateParams(obj: any) {
  obj.modified = true;
  return obj;
}
function badParams(arr: any[]) {
  arr.push("extra");
  return arr;
}

// 146-150: 过多的条件嵌套
function deepNesting(x: number, y: number, z: number) {
  if (x > 0) {
    if (y > 0) {
      if (z > 0) {
        return "all positive";
      }
    }
  }
  return "something else";
}
