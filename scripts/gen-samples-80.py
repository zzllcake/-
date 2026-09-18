#!/usr/bin/env python3
"""生成 80 个测试代码片段，覆盖 11 类错误，区分 error/warning 等级。

要求: 所有代码必须可被 ESLint 正常解析（语义错误，非语法残缺）。
"""
import os

snippets = []
n = [0]


def add(err_type, level, code, note=''):
    """添加一个代码片段"""
    n[0] += 1
    snippets.append({
        'num': n[0],
        'type': err_type,
        'level': level,
        'code': code.strip(),
        'note': note,
    })


# ============================================================
# 1. JS 语法/风格类错误 (8 条)
# ============================================================
add('JS语法错误', 'error',
    'function looseEqual(a: number, b: number) { return a == b; }',
    '使用 == 而非 ===')

add('JS语法错误', 'error',
    'function oldSchoolVar() { var counter = 0; return counter; }',
    '使用已废弃的 var')

add('JS语法错误', 'warning',
    'function assignInCondition(x: number) { if ((x = 5)) { return x; } return 0; }',
    '条件中赋值')

add('JS语法错误', 'error',
    'function commaOperator() { const x = (1, 2, 3); return x; }',
    '逗号运算符')

add('JS语法错误', 'warning',
    'function uselessSemicolon() { const a = 1;; return a; }',
    '多余分号')

add('JS语法错误', 'error',
    'function constantCondition() { if (true) { return 1; } return 2; }',
    '常量条件')

add('JS语法错误', 'warning',
    'function nestedTernary(x: number) { return x > 0 ? x < 10 ? "small" : "big" : "negative"; }',
    '嵌套三元表达式')

add('JS语法错误', 'error',
    'function implicitGlobalAssign() { undeclaredVar = 42; return undeclaredVar; }',
    '隐式全局变量')

# ============================================================
# 2. 未定义变量 / 未使用变量 (8 条)
# ============================================================
add('未定义变量', 'error',
    'function useUndefined() { return notDefinedAnywhere; }',
    '引用未定义变量')

add('未定义变量', 'error',
    'const unusedTopLevel = "never used";',
    '未使用的顶层变量')

add('未定义变量', 'warning',
    'function unusedParams(a: number, b: number, c: number) { return a; }',
    '未使用的函数参数')

add('未定义变量', 'error',
    'function callMissingFn() { return missingFunction(1, 2); }',
    '调用未定义函数')

add('未定义变量', 'warning',
    'function declaredNotUsed() { const temp = 100; const other = 200; return other; }',
    '声明未使用')

add('未定义变量', 'error',
    'const config = { host: "localhost", port: 8080 };\nfunction readDb() { return databaseConfig.host; }',
    '变量名拼写错误')

add('未定义变量', 'warning',
    'function shadowOuter() { const value = 1; { const value = 2; return value; } }',
    '变量遮蔽')

add('未定义变量', 'error',
    'function useBeforeDeclare() { return laterConst; }\nconst laterConst = 5;',
    'TDZ 引用')

# ============================================================
# 3. 变量命名不规范 (7 条)
# ============================================================
add('变量命名不规范', 'warning',
    'const x = 42;\nconst y = "text";',
    '单字母变量名')

add('变量命名不规范', 'warning',
    'let UserName = "admin";\nlet user_age = 18;',
    '命名风格不一致(PascalCase+snake_case)')

add('变量命名不规范', 'warning',
    'const data1 = 1;\nconst data2 = 2;\nconst data3 = 3;',
    '无意义编号命名')

add('变量命名不规范', 'warning',
    'function fn(a: number) { return a * 2; }',
    '函数名过于简略')

add('变量命名不规范', 'warning',
    'const TEMP = "tmp";\nconst Temp = "tmp2";',
    '命名重复仅大小写不同')

add('变量命名不规范', 'warning',
    'function f(x: number, y: number, z: number) { return x + y + z; }',
    '参数命名无意义')

add('变量命名不规范', 'warning',
    'const test123 = "t";\nconst tempValue2 = "v";',
    '含无意义数字后缀')

# ============================================================
# 4. 不安全函数使用 (7 条)
# ============================================================
add('不安全函数使用', 'error',
    'function dangerousEval(code: string) { return eval(code); }',
    'eval 执行任意代码')

add('不安全函数使用', 'error',
    'const dynamicFn = new Function("return 1 + 1");',
    'new Function 动态编译')

add('不安全函数使用', 'error',
    'function renderHtml(container: HTMLElement, html: string) { container.innerHTML = html; }',
    'innerHTML 注入风险')

add('不安全函数使用', 'warning',
    'function outerHtml(el: HTMLElement) { el.outerHTML = "<div>replaced</div>"; }',
    'outerHTML 覆盖')

add('不安全函数使用', 'error',
    'function writeDoc() { document.write("<script>alert(1)</script>"); }',
    'document.write 注入')

add('不安全函数使用', 'warning',
    'function stringTimer() { setTimeout("doSomething()", 1000); }',
    'setTimeout 传字符串')

add('不安全函数使用', 'warning',
    'function googleEval() { return eval("var x = 1; x"); }',
    '间接 eval 调用')

# ============================================================
# 5. 导入模块错误 (7 条)
# ============================================================
add('导入模块错误', 'error',
    "import { readFile } from 'node:fs';\nfunction useUnused() { return 1; }",
    '导入但未使用')

add('导入模块错误', 'error',
    "import { nonExistentExport } from './utils/greet.js';\nconst x = 1;",
    '导入不存在的导出')

add('导入模块错误', 'warning',
    "import '../../../../src/utils/greet.js';",
    '相对路径过深')

add('导入模块错误', 'warning',
    "import * as everything from './utils/greet.js';\nconst y = 2;",
    '通配符导入')

add('导入模块错误', 'error',
    "import { helper } from 'this-package-does-not-exist';\nconst z = helper;",
    '导入不存在的包')

add('导入模块错误', 'warning',
    "import { greet } from './utils/greet';\nconst g = greet;",
    '缺少文件扩展名')

add('导入模块错误', 'error',
    "import './nonexistent-file.js';",
    '导入不存在的文件')

# ============================================================
# 6. 重复导入 (7 条)
# ============================================================
add('重复导入', 'error',
    "import { describe } from 'vitest';\nimport { it } from 'vitest';\nimport { expect } from 'vitest';\nconst a = 1;",
    '同一模块导入3次')

add('重复导入', 'error',
    "import { add } from './utils/math.js';\nimport { sub } from './utils/math.js';\nconst b = 2;",
    '相对路径重复导入')

add('重复导入', 'warning',
    "import defaultExport from './utils/math.js';\nimport { named } from './utils/math.js';\nconst c = 3;",
    '默认+命名混合重复')

add('重复导入', 'error',
    "import { readFileSync } from 'node:fs';\nimport { writeFileSync } from 'node:fs';\nconst d = 4;",
    'Node内置模块重复')

add('重复导入', 'warning',
    "import * as ns1 from 'node:path';\nimport { join } from 'node:path';\nconst e = 5;",
    '通配符+命名重复')

add('重复导入', 'error',
    "import { expect as ex1 } from 'vitest';\nimport { expect as ex2 } from 'vitest';\nconst f = 6;",
    '重复导入+别名')

add('重复导入', 'warning',
    "import './styles.css';\nimport './styles.css';\nconst g = 7;",
    '副作用导入重复')

# ============================================================
# 7. 废弃 API 调用 (7 条)
# ============================================================
add('废弃API调用', 'error',
    'function makeBuffer() { return new Buffer(10); }',
    'new Buffer 已废弃')

add('废弃API调用', 'warning',
    'function useSubstr(s: string) { return s.substr(0, 5); }',
    'substr 已废弃')

add('废弃API调用', 'error',
    'function useEscape() { return escape("hello"); }',
    'escape 已废弃')

add('废弃API调用', 'warning',
    'function useUnescape(s: string) { return unescape(s); }',
    'unescape 已废弃')

add('废弃API调用', 'error',
    'function useCallee() { return arguments.callee; }',
    'arguments.callee 严格模式禁用')

add('废弃API调用', 'warning',
    'function useProto(obj: object) { return obj.__proto__; }',
    '__proto__ 访问器已废弃')

add('废弃API调用', 'warning',
    'function useDefineGetter() { const o = {}; o.__defineGetter__("x", () => 42); return o; }',
    '__defineGetter__ 已废弃')

# ============================================================
# 8. 空值未判空 (7 条)
# ============================================================
add('空值未判空', 'error',
    'function unsafeAccess(obj: { name?: string }) { return obj.name!.length; }',
    '非空断言后直接访问')

add('空值未判空', 'error',
    'function unsafeChain(data: { user?: { name?: string } }) { return data.user!.name!.toUpperCase(); }',
    '链式非空断言')

add('空值未判空', 'warning',
    'function maybeNull(v: string | null) { return v.length; }',
    '未判空直接访问')

add('空值未判空', 'error',
    'function arrayAccess(arr: number[] | undefined) { return arr![0]; }',
    '数组可能是 undefined')

add('空值未判空', 'warning',
    'function looseNullCheck(v: string | null) { if (v != null) { return v; } return ""; }',
    '使用 != 而非显式判空')

add('空值未判空', 'error',
    'async function unsafeAsync() { const res = await fetch("/api"); const data = await res!.json(); return data; }',
    'await 结果未判空')

add('空值未判空', 'warning',
    'function optionalNoCheck(o: { list?: string[] }) { return o.list.length; }',
    '可选属性未判空')

# ============================================================
# 9. 死循环风险 (7 条)
# ============================================================
add('死循环风险', 'error',
    'function infiniteWhile() { let i = 0; while (i < 10) { console.log(i); } return i; }',
    '循环变量未递增')

add('死循环风险', 'error',
    'async function awaitInLoop(items: number[]) { for (const item of items) { await Promise.resolve(item); } return items; }',
    '循环内 await 且无退出条件')

add('死循环风险', 'warning',
    'function noDecrement() { let n = 10; while (n > 0) { n = n + 1; } return n; }',
    '反向变化导致死循环')

add('死循环风险', 'error',
    'function constantLoop() { for (let i = 0; i < 5; i = 0) { break; } return 0; }',
    '循环变量重置')

add('死循环风险', 'warning',
    'function unmodifiedCondition(list: number[]) { let idx = 0; while (idx < list.length) { console.log(list[0]); } return idx; }',
    '条件变量未更新')

add('死循环风险', 'error',
    'function neverEndingRecursion(n: number): number { return neverEndingRecursion(n + 1); }',
    '无限递归')

add('死循环风险', 'warning',
    'function floatLoop() { let f = 0; while (f !== 1) { f += 0.1; } return f; }',
    '浮点相等判断死循环')

# ============================================================
# 10. 代码格式混乱 (8 条)
# ============================================================
add('代码格式混乱', 'warning',
    'function   messySpacing(  a:number,b:number   ){return a+b;}',
    '空格混乱')

add('代码格式混乱', 'warning',
    'const badlyIndented = 1;\n      const stillBad = 2;\n                const veryBad = 3;',
    '缩进不一致')

add('代码格式混乱', 'warning',
    "const doubleQuote = \"双引号\";\nconst singleQuote = '单引号';",
    '引号风格不统一')

add('代码格式混乱', 'warning',
    "const veryLongLine = 'this is a very long string that should probably be broken into multiple shorter lines but instead it just keeps going and going and going';",
    '行超长')

add('代码格式混乱', 'warning',
    'function multiBlankLines() {\n  const a = 1;\n\n\n\n  const b = 2;\n  return a + b;\n}',
    '过多空行')

add('代码格式混乱', 'warning',
    'function trailingComma() {\n  return [1, 2, 3,];\n}',
    '尾随逗号不规范')

add('代码格式混乱', 'warning',
    'function noSpaceBeforeParen (x: number) { return x; }',
    '函数名与括号间多余空格')

add('代码格式混乱', 'warning',
    'const objStyle = {a :1 ,b: 2};\nconst arrStyle = [ 1,2 ,3 ];',
    '对象/数组格式混乱')

# ============================================================
# 11. TS 类型错误 (7 条)
# ============================================================
add('TS类型错误', 'error',
    'function anyAbuse(data: any): any { return data; }',
    'any 类型绕过检查')

add('TS类型错误', 'error',
    'const wrongType: string = 42;',
    '类型赋值不匹配')

add('TS类型错误', 'error',
    'function mismatchedArgs(a: number) { return a; }\nconst result = mismatchedArgs("string");',
    '参数类型不匹配')

add('TS类型错误', 'warning',
    'function implicitAnyParam(param) { return param; }',
    '隐式 any 参数')

add('TS类型错误', 'error',
    'const arrayTypeMismatch: number[] = ["1", "2", "3"];',
    '数组元素类型不匹配')

add('TS类型错误', 'warning',
    'function doubleAssert(x: unknown) { return x as unknown as string; }',
    '双重类型断言')

add('TS类型错误', 'error',
    'interface MixedShape { id: number; }\nconst badShape: MixedShape = { id: "not-a-number" };',
    '接口属性类型不匹配')

# ============================================================
# 生成文件
# ============================================================
OUT = 'src/review-samples-80.ts'
lines = [
    '// ====================================================================',
    '// 代码审查测试样本 - 80 个独立片段',
    '// 覆盖 11 类错误，区分 error / warning 等级',
    f'// 生成时间: 自动生成，共 {n[0]} 个片段',
    '// ====================================================================',
    '',
]

level_count = {'error': 0, 'warning': 0}
type_count = {}

current_type = None
for s in snippets:
    level_count[s['level']] += 1
    type_count[s['type']] = type_count.get(s['type'], 0) + 1

    if s['type'] != current_type:
        current_type = s['type']
        lines.append('')
        lines.append(f'// {"=" * 60}')
        lines.append(f'// 错误类型: {current_type}')
        lines.append(f'// {"=" * 60}')
        lines.append('')

    lines.append(f'// 【片段 {s["num"]}】【错误类型: {s["type"]}】【等级: {s["level"]}】')
    if s['note']:
        lines.append(f'// 说明: {s["note"]}')
    lines.append(s['code'])
    lines.append('')

lines.append('export {};')

with open(OUT, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')

print(f'✅ 生成 {n[0]} 个测试片段')
print(f'   error 级: {level_count["error"]} 个')
print(f'   warning 级: {level_count["warning"]} 个')
print(f'   文件: {OUT} ({os.path.getsize(OUT):,} 字节)')
print()
print('📊 各类别分布:')
for t, c in type_count.items():
    print(f'   {t}: {c} 个')
