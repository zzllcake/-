#!/usr/bin/env python3
"""P2: 按错误类别拆分生成测试样本 + 逐类验证。

原则（用户要求）:
  - 只测「可检测类错误」：语法、未定义变量、不安全API、重复导入、废弃API、类型错误、命名
  - 不测「不可检测类错误」：业务逻辑、算法错误
  - 每类单独一个文件，便于逐一验证对应规则

输出: src/samples/<NN>-<category>.ts
"""
import os

OUT_DIR = 'src/samples'

# ============================================================
# 类别定义（只含可检测类错误）
# ============================================================
CATEGORIES = {
    '01-js-syntax': {
        'name': 'JS语法错误',
        'detectable': True,
        'expect_rules': ['eqeqeq', 'no-var', 'no-cond-assign', 'no-constant-condition', 'no-implicit-globals'],
        'samples': [
            ('error', '松散相等', 'export function looseEq(a: number, b: number) { return a == b; }'),
            ('error', '使用 var', 'export function useVar() { var x = 1; return x; }'),
            ('error', '条件赋值', 'export function condAssign(x: number) { if ((x = 5)) { return x; } return 0; }'),
            ('error', '常量条件', 'export function constCond() { if (true) { return 1; } return 2; }'),
            ('error', '隐式全局', 'export function implicitGlobal() { undeclaredName = 42; return 1; }'),
            ('warning', '嵌套三元', 'export function nestedTernary(x: number) { return x > 0 ? x < 10 ? "small" : "big" : "neg"; }'),
            ('warning', '多余分号', 'export function extraSemi() { const a = 1;; return a; }'),
            ('warning', '逗号表达式', 'export function commaOp() { const x = (1, 2, 3); return x; }'),
        ],
    },
    '02-undefined-vars': {
        'name': '未定义变量',
        'detectable': True,
        'expect_rules': ['no-undef', '@typescript-eslint/no-unused-vars', 'no-shadow'],
        'samples': [
            ('error', '引用未定义变量', 'export function useUndef() { return notDefinedVar; }'),
            ('error', '调用未定义函数', 'export function callUndef() { return missingFn(1, 2); }'),
            ('error', '拼写错误变量名', 'const cfg = { host: "localhost" };\nexport function readCfg() { return config.host; }'),
            ('warning', '未使用顶层变量', 'export const neverUsed = "value";'),
            ('warning', '未使用函数参数', 'export function unusedParams(a: number, b: number, c: number) { return a; }'),
            ('warning', '变量遮蔽', 'export function shadowed() { const v = 1; { const v = 2; return v; } }'),
        ],
    },
    '03-naming': {
        'name': '变量命名不规范',
        'detectable': True,
        'expect_rules': ['@typescript-eslint/naming-convention'],
        'samples': [
            ('warning', '单字母变量', 'export const x = 42;'),
            ('warning', 'snake_case 变量', 'export const user_age = 18;'),
            ('warning', 'PascalCase 变量', 'export const UserName = "admin";'),
            ('warning', '无意义编号', 'export const data1 = 1;'),
            ('warning', '函数名过简', 'export function fn(a: number) { return a * 2; }'),
            ('warning', '参数无意义', 'export function calc(p: number, q: number) { return p + q; }'),
        ],
    },
    '04-unsafe-api': {
        'name': '不安全函数使用',
        'detectable': True,
        'expect_rules': ['no-eval', 'no-new-func', 'no-restricted-syntax', 'security/detect-eval-with-expression'],
        'samples': [
            ('error', 'eval 执行', 'export function useEval(code: string) { return eval(code); }'),
            ('error', 'new Function', 'export const dynFn = new Function("return 1 + 1");'),
            ('error', 'innerHTML 注入', 'export function setHtml(el: HTMLElement, html: string) { el.innerHTML = html; }'),
            ('error', 'document.write', 'export function writeDoc() { document.write("<b>x</b>"); }'),
            ('warning', 'outerHTML 覆盖', 'export function setOuter(el: HTMLElement) { el.outerHTML = "<div>x</div>"; }'),
            ('warning', 'setTimeout 字符串', 'export function strTimer() { setTimeout("doWork()", 1000); }'),
        ],
    },
    '05-import-errors': {
        'name': '导入模块错误',
        'detectable': True,
        'expect_rules': ['import/no-unresolved', 'import/no-useless-path-segments'],
        'samples': [
            ('error', '导入不存在的包', "import { helper } from 'package-not-exists-xyz';\nexport const h = helper;"),
            ('error', '导入不存在文件', "import './no-such-file.js';\nexport const flag = 1;"),
            ('error', '导入不存在的导出', "import { notExistExport } from '../utils/greet.js';\nexport const n = notExistExport;"),
            ('warning', '相对路径过深', "import { greet } from '../../../src/utils/greet.js';\nexport const g = greet;"),
            ('warning', '缺少扩展名', "import { greet as gt } from '../utils/greet';\nexport const g2 = gt;"),
        ],
    },
    '06-duplicate-import': {
        'name': '重复导入',
        'detectable': True,
        'expect_rules': ['import/no-duplicates'],
        'samples': [
            ('error', '同模块导入3次', "import { describe } from 'vitest';\nimport { it } from 'vitest';\nimport { expect } from 'vitest';\nexport const t = [describe, it, expect];"),
            ('error', '相对路径重复', "import { greet } from '../utils/greet.js';\nimport { farewell } from '../utils/greet.js';\nexport const g = [greet, farewell];"),
            ('warning', '默认+命名重复', "import * as nsA from 'node:path';\nimport { join } from 'node:path';\nexport const p = { nsA, join };"),
            ('warning', '别名重复导入', "import { greet as g1 } from '../utils/greet.js';\nimport { greet as g2 } from '../utils/greet.js';\nexport const gg = [g1, g2];"),
        ],
    },
    '07-deprecated-api': {
        'name': '废弃API调用',
        'detectable': True,
        'expect_rules': ['no-restricted-properties', 'no-restricted-syntax', 'no-restricted-globals'],
        'samples': [
            ('warning', 'substr 已废弃', 'export function useSubstr(s: string) { return s.substr(0, 5); }'),
            ('warning', '__proto__ 访问', 'export function useProto(o: object) { return o.__proto__; }'),
            ('warning', 'escape 已废弃', 'export function useEscape() { return escape("hi"); }'),
            ('warning', 'unescape 已废弃', 'export function useUnescape(s: string) { return unescape(s); }'),
            ('warning', 'arguments.callee', 'export function useCallee() { return arguments.callee; }'),
        ],
    },
    '08-null-safety': {
        'name': '空值未判空',
        'detectable': True,
        'expect_rules': ['@typescript-eslint/no-non-null-assertion', '@typescript-eslint/no-unnecessary-condition'],
        'samples': [
            ('error', '非空断言后访问', 'export function unsafe(o: { n?: string }) { return o.n!.length; }'),
            ('error', '链式非空断言', 'export function chain(d: { u?: { n?: string } }) { return d.u!.n!.toUpperCase(); }'),
            ('error', '数组可能 undefined', 'export function arrAccess(a: number[] | undefined) { return a![0]; }'),
            ('warning', '未判空直接访问', 'export function noCheck(v: string | null) { if (v != null) { return v.length; } return 0; }'),
            ('warning', '可选属性未判空', 'export function optProp(o: { list?: string[] }) { return o.list?.length ?? 0; }'),
        ],
    },
    '09-ts-types': {
        'name': 'TS类型错误',
        'detectable': True,
        'expect_rules': ['@typescript-eslint/no-explicit-any', '@typescript-eslint/no-unsafe-*', '@typescript-eslint/no-inferrable-types'],
        'samples': [
            ('error', 'any 类型滥用', 'export function anyFn(d: any): any { return d; }'),
            ('error', '不安全赋值', 'export function unsafeAssign() { const s: string = JSON.parse("{}"); return s; }'),
            ('error', '不安全返回', 'export function unsafeReturn() { return JSON.parse("{}"); }'),
            ('warning', '双重类型断言', 'export function dblAssert(x: unknown) { return x as unknown as string; }'),
            ('warning', '可推断的类型标注', 'export const numValue: number = 42;'),
        ],
    },
    '10-complexity': {
        'name': '复杂度与可维护性',
        'detectable': True,
        'expect_rules': ['max-params', 'complexity', 'max-depth', '@typescript-eslint/no-unused-vars'],
        'samples': [
            ('warning', '参数过多', 'export function manyParams(a: number, b: number, c: number, d: number, e: number, f: number) { return a + b + c + d + e + f; }'),
            ('warning', '过深嵌套', 'export function deepNest(x: number) { if (x > 0) { if (x > 10) { if (x > 20) { if (x > 30) { return "deep"; } } } } return "shallow"; }'),
            ('warning', '圈复杂度过高', 'export function complex(a: number, b: number, c: number) { let r = 0; if (a > 0) { r += a; } else if (a < 0) { r -= a; } else { r += 1; } if (b > 0) { r += b; } else if (b < 0) { r -= b; } else { r += 2; } if (c > 0) { r += c; } else if (c < 0) { r -= c; } else { r += 3; } return r; }'),
            ('warning', '长函数', 'export function longFn() { let s = 0; ' + 's += 1; ' * 40 + 'return s; }'),
        ],
    },
    '11-async-patterns': {
        'name': '异步模式问题',
        'detectable': True,
        'expect_rules': ['@typescript-eslint/no-floating-promises', '@typescript-eslint/require-await', 'no-await-in-loop'],
        'samples': [
            ('error', '未处理 Promise', 'export function floating() { Promise.resolve("lost"); }'),
            ('warning', 'async 无 await', 'export async function noAwait() { return Promise.resolve(1); }'),
            ('warning', '循环内 await', 'export async function awaitLoop(items: number[]) { for (const i of items) { await Promise.resolve(i); } return items.length; }'),
            ('error', 'Promise executor 返回值', 'export const pe = new Promise<number>((resolve) => { return resolve(1); });'),
        ],
    },
}

# 不可检测类错误（不用于测试，仅作说明）
UNDETECTABLE_NOTE = """
// ============================================================
// ⚠️ 不可检测类错误（静态分析无法识别，不用于测试）
// ------------------------------------------------------------
// · 业务逻辑错误（如：计算折扣时用了加法而不是乘法）
// · 条件写反（如：应该 >= 却写成 <=，语法合法）
// · 算法错误（如：排序逻辑错误，语法合法）
// · 死循环（while(true) 是合法语法，仅能检测"变量未更新"模式）
// · 内存泄漏、性能问题
//
// 这些需要：单元测试 / 人工审查 / 运行时监控 来发现
// ============================================================
"""


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    total = 0
    stats = []
    rule_cover = {}

    for key, cat in CATEGORIES.items():
        lines = [
            '// ============================================================',
            f'// 错误类别: {cat["name"]}',
            f'// 可检测: {"是" if cat["detectable"] else "否"}',
            f'// 预期命中规则: {", ".join(cat["expect_rules"])}',
            '// 片段数: ' + str(len(cat['samples'])),
            '// ============================================================',
            '',
        ]

        err_n = warn_n = 0
        for i, (level, desc, code) in enumerate(cat['samples'], 1):
            if level == 'error':
                err_n += 1
            else:
                warn_n += 1
            lines.append(f'// 【{key}-{i}】【等级: {level}】{desc}')
            lines.append(code)
            lines.append('')

        lines.append('export {};')

        path = os.path.join(OUT_DIR, f'{key}.ts')
        with open(path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines) + '\n')

        total += len(cat['samples'])
        stats.append((cat['name'], len(cat['samples']), err_n, warn_n))
        for r in cat['expect_rules']:
            rule_cover[r] = rule_cover.get(r, 0) + 1

    # 写 README
    readme = ['# 测试样本说明', '', '## 分类样本（可检测类）', '',
              '| 文件 | 类别 | 片段数 | error | warning | 预期规则 |',
              '|------|------|--------|-------|---------|----------|']
    for (key, cat), (name, cnt, e, w) in zip(CATEGORIES.items(), stats):
        readme.append(f'| `{key}.ts` | {name} | {cnt} | {e} | {w} | `{"`, `".join(cat["expect_rules"])}` |')
    readme.append('')
    readme.append(UNDETECTABLE_NOTE)
    with open(os.path.join(OUT_DIR, 'README.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(readme))

    print(f'✅ 生成 {len(CATEGORIES)} 个类别文件，共 {total} 个样本')
    print(f'   输出目录: {OUT_DIR}/')
    print()
    print('📊 类别明细:')
    for name, cnt, e, w in stats:
        print(f'   {name:<20} {cnt} 个 (error {e} / warning {w})')


if __name__ == '__main__':
    main()
