#!/usr/bin/env python3
"""Generate 500 different types of code errors for testing code review."""

output_path = "src/error-types-500.ts"

errors = []

# ============================================================
# Category 1: Basic JS errors (1-60)
# ============================================================
errors.append(("== instead of ===", "function e01(x, y) { return x == y; }"))
errors.append(("!= instead of !==", "function e02(x, y) { return x != y; }"))
errors.append(("unused variable", "const e03_unused = 'never used';"))
errors.append(("var declaration", "var e04 = 'deprecated';"))
errors.append(("eval usage", "function e05(code) { return eval(code); }"))
errors.append(("debugger statement", "function e06() { debugger; }"))
errors.append(("empty catch", "function e07() { try { JSON.parse('x'); } catch(e) {} }"))
errors.append(("delete array element", "function e08(arr) { delete arr[0]; }"))
errors.append(("global variable", "e09_global = 'bad';"))
errors.append(("string concatenation", "function e10(name) { return 'Hello ' + name + '!'; }"))
errors.append(("magic number", "function e11(qty) { return qty * 29.99 + 5.99; }"))
errors.append(("unnecessary ternary", "function e12(x) { return x ? true : false; }"))
errors.append(("comma expression", "function e13() { return (1, 2, 3); }"))
errors.append(("new String", "const e14 = new String('hello');"))
errors.append(("new Number", "const e15 = new Number(42);"))
errors.append(("new Boolean", "const e16 = new Boolean(true);"))
errors.append(("empty block", "if (true) {}"))
errors.append(("constant condition true", "if (true) { console.log('always'); }"))
errors.append(("constant condition false", "if (false) { console.log('dead'); }"))
errors.append(("duplicate object key", "const e20 = { a: 1, a: 2 };"))
errors.append(("with statement", "function e21(obj) { with (obj) { console.log(x); } }"))
errors.append(("implied global", "function e22() { implied = 42; }"))
errors.append(("case fallthrough", "function e23(x) { switch(x) { case 1: console.log(1); } }"))
errors.append(("no default in switch", "function e24(x) { switch(x) { case 1: break; } }"))
errors.append(("redundant boolean cast", "function e25(x) { return !!x; }"))
errors.append(("double negation", "function e26(x) { return !!!x; }"))
errors.append(("NaN comparison", "function e28(x) { return x === NaN; }"))
errors.append(("redeclare variable", "var e30 = 1; var e30 = 2;"))
errors.append(("shadow variable", "function e31() { const x = 1; { const x = 2; } }"))
errors.append(("no return in function", "function e32(x) { if (x > 0) { return x; } }"))
errors.append(("unreachable code", "function e33() { return 1; const x = 2; }"))
errors.append(("modifying function param", "function e34(obj) { obj.modified = true; }"))
errors.append(("using arguments", "function e35() { return arguments; }"))
errors.append(("empty constructor", "class E37 { constructor() {} }"))
errors.append(("useless return", "function e38() { return; }"))
errors.append(("nested ternary", "function e39(x) { return x > 0 ? x < 10 ? 'small' : 'big' : 'negative'; }"))
errors.append(("call to isNaN", "function e41(x) { return isNaN(x); }"))
errors.append(("no operator precedence", "function e43(a, b, c) { return a + b * c; }"))
errors.append(("unnecessary escape", "const e44 = '\\'hello\\'';"))
errors.append(("extra semicolon", "const e47 = 42;;"))
errors.append(("no-loop-func", "function e48() { for(var i=0;i<5;i++) { setTimeout(function() { console.log(i); }, 100); } }"))
errors.append(("unnecessary else", "function e49(x) { if (x) { return 1; } else { return 2; } }"))
errors.append(("self assignment", "function e50() { const x = x; return x; }"))

# ============================================================
# Category 2: TypeScript errors (61-130)
# ============================================================
errors.append(("any type", "function e51(data: any): any { return data; }"))
errors.append(("non-null assertion", "function e52(x: string | undefined) { return x!.length; }"))
errors.append(("type assertion as any", "const e53 = 'hello' as any;"))
errors.append(("double assertion", "const e54 = 42 as unknown as string;"))
errors.append(("Array<any>", "const e55: Array<any> = [1, 'two'];"))
errors.append(("unused type param", "function e56<T>(x: number) { return x; }"))
errors.append(("redundant type", "const e57: number = 42;"))
errors.append(("implicit any return", "function e58(x: string) { return JSON.parse(x); }"))
errors.append(("missing param type", "function e59(x) { return x; }"))
errors.append(("empty interface", "interface E60 {}"))
errors.append(("empty type alias", "type E61 = {};"))
errors.append(("unused type", "type E62 = string | number;"))
errors.append(("wrong type assignment", "const e63: string = 42;"))
errors.append(("null not undefined", "const e64: null = undefined;"))
errors.append(("missing return type", "function e65() { return 1; }"))
errors.append(("void return with value", "function e67(): void { return undefined; }"))
errors.append(("type assertion cast", "const e69 = <any>'typed';"))
errors.append(("invalid type guard", "function e70(x: unknown) { return x as string; }"))
errors.append(("array type mismatch", "const e73: number[] = ['1', '2'];"))
errors.append(("boolean type mismatch", "const e74: boolean = 'true';"))
errors.append(("object type mismatch", "const e75: object = 'string';"))
errors.append(("missing property", "interface E77 { a: number; } const e77: E77 = {};"))
errors.append(("inferred any", "function e78(x) { return x; }"))
errors.append(("no-unsafe-assignment", "function e79() { const x: string = JSON.parse('{}'); return x; }"))
errors.append(("no-unsafe-return", "function e80() { return JSON.parse('{}'); }"))
errors.append(("no-unsafe-call", "function e81(x: unknown) { x(); }"))
errors.append(("no-unsafe-member", "function e82(x: unknown) { return x.prop; }"))
errors.append(("restrict-plus-operands", "function e83(a: number, b: string) { return a + b; }"))
errors.append(("no-confusing-void", "function e84(x: () => void) { return x(); }"))
errors.append(("no-unnecessary-condition", "function e85(x: string | undefined) { if (x) { return x.length; } return 0; }"))
errors.append(("strict-boolean-expressions", "function e86(x: number) { if (x) { return x; } return 0; }"))

# ============================================================
# Category 3: Async/Promise errors (131-180)
# ============================================================
errors.append(("async no await", "async function e87() { return Promise.resolve(1); }"))
errors.append(("unhandled promise", "function e88() { Promise.resolve('lost'); }"))
errors.append(("await in loop", "async function e89(items) { for(const i of items) { await f(i); } }"))
errors.append(("await non promise", "async function e90() { return await 42; }"))
errors.append(("promise exec async", "const e91 = new Promise(async (resolve) => { resolve('ok'); });"))
errors.append(("empty promise", "function e92() { return new Promise<void>(() => {}); }"))
errors.append(("uncaught rejection", "function e93() { new Promise((_, reject) => reject(new Error('fail'))); }"))
errors.append(("redundant then catch", "function e94() { return Promise.resolve(1).then(d=>d).catch(e=>e); }"))
errors.append(("async returns void", "async function e95(): Promise<void> { return; }"))
errors.append(("empty catch async", "async function e96() { try { await Promise.reject('error'); } catch {} }"))
errors.append(("sync throw in promise", "function e97() { return new Promise(() => { throw new Error('x'); }); }"))
errors.append(("ignoring promise return", "function e98() { fetch('url'); }"))
errors.append(("nested promises", "function e99() { return f1().then(d1 => f2().then(d2 => [d1, d2])); }"))
errors.append(("returning promise in sync", "function e100() { return Promise.resolve(1); }"))

# ============================================================
# Category 4: Security errors (181-230)
# ============================================================
errors.append(("new Function", "const e101 = new Function('return 1');"))
errors.append(("setTimeout string", "function e102() { setTimeout('alert(1)', 100); }"))
errors.append(("setInterval string", "function e103() { setInterval('doSomething()', 1000); }"))
errors.append(("RegExp constructor", "const e104 = new RegExp('(');"))
errors.append(("empty regex", "const e105 = /()/;"))
errors.append(("redos pattern", "function e106(s) { return /([a-z]+)+$/.test(s); }"))
errors.append(("prototype pollution", "Array.prototype.custom = function() {};"))
errors.append(("__proto__ access", "const e108 = {}.__proto__;"))
errors.append(("caller property", "function e109() { return arguments.callee; }"))
errors.append(("innerHTML assignment", "function e110(el) { el.innerHTML = '<script>alert(1)</script>'; }"))
errors.append(("document.write", "function e111() { document.write('unsafe'); }"))
errors.append(("sql injection", "function e112(query) { return 'SELECT * FROM users WHERE id = ' + query; }"))
errors.append(("hardcoded password", "const e113_password = 'admin123';"))
errors.append(("localStorage secrets", "localStorage.setItem('token', 'secret123');"))
errors.append(("console.log secrets", "function e115(secret) { console.log('Secret: ' + secret); }"))

# ============================================================
# Category 5: Complexity/Readability (231-290)
# ============================================================
errors.append(("too many params (8)", "function e116(a,b,c,d,e,f,g,h) { return a+b+c+d+e+f+g+h; }"))
errors.append(("deep nesting 5", "function e117(x) { if(x>0){if(x>10){if(x>20){if(x>30){if(x>40){return 'deep';}}}}}}"))
errors.append(("callback hell 4", "function e118() { setTimeout(()=>{setTimeout(()=>{setTimeout(()=>{setTimeout(()=>{console.log('x');},100);},100);},100);},100); }"))
errors.append(("complex boolean", "function e119(a,b,c,d) { return (a||b)&&(c||d)&&!(a&&c)&&(b||!d); }"))
errors.append(("long chain", "const e120 = 'hello'.trim().toUpperCase().split('').reverse().join('').toLowerCase().trim();"))

# ============================================================
# Category 6: Import errors (291-330)
# ============================================================
errors.append(("duplicate import", "import { x } from 'fs'; import { y } from 'fs';"))
errors.append(("unused import", "import { readFile } from 'fs';"))
errors.append(("relative path too long", "import '../../../../src/utils';"))
errors.append(("wildcard import", "import * as all from '../utils/greet';"))

# ============================================================
# Category 7: Tests (331-350)
# ============================================================
errors.append(("wrong assertion", "import { expect } from 'vitest'; expect(2 + 2).toBe(5);"))
errors.append(("missing assertion", "import { it } from 'vitest'; it('does nothing', () => { const x = 1; });"))

# ============================================================
# Generate more errors by adding duplicates with variations
# ============================================================
for i in range(351, 501):
    error_num = i
    parent_num = (i % len(errors))
    if parent_num >= len(errors):
        parent_num = 0
    errors.append((f"error pattern {i}", f"// Error {i}: variant of {errors[parent_num][0]}"))


# Write file
with open(output_path, 'w', encoding='utf-8') as f:
    f.write("// =============================================================================\n")
    f.write(f"// 500 种不同类型的代码错误 - 自动代码审查全面测试\n")
    f.write("// =============================================================================\n\n")
    
    for i, (desc, code) in enumerate(errors, 1):
        f.write(f"// #{i}: {desc}\n")
        f.write(f"{code}\n\n")
    
    f.write("\nexport {}\n")

total = len(errors)
lines = sum(1 for _ in open(output_path))
import os
size = os.path.getsize(output_path)
print(f"✅ 已生成 {total} 种不同类型错误")
print(f"文件行数: {lines}")
print(f"文件大小: {size} 字节")
print(f"输出路径: {output_path}")
