#!/usr/bin/env python3
"""生成 20000 种不同类型的代码错误，全面测试代码审查系统。"""

import os

OUTPUT = 'src/error-types-20000.ts'
errors = []
counter = [0]

def add(category, desc, code):
    counter[0] += 1
    n = counter[0]
    errors.append(f"// #{n}: [{category}] {desc}")
    errors.append(f"{code}")

# ================================================================
# 生成 20000 种错误
# ================================================================

# --- 1. 基础 JS 错误 (1-2500) ---
for i in range(1, 501):
    add("基础JS", f"== 而非 === 变种{i}", f"function e{i:05d}a(x, y) {{ return x == y; }}")
    add("基础JS", f"!= 而非 !== 变种{i}", f"function e{i:05d}b(x, y) {{ return x != y; }}")
    add("基础JS", f"未使用变量 变种{i}", f"const e{i:05d}c = '{'x' * (i%10+1)}';")
    add("基础JS", f"var 声明 变种{i}", f"var e{i:05d}d = {i};")
    add("基础JS", f"字符串拼接 变种{i}", f"function e{i:05d}e(n) {{ return 'a' + n + '{i}'; }}")

# --- 2. TypeScript 特有错误 (2501-5500) ---
for i in range(1, 501):
    add("TS类型", f"any 类型 变种{i}", f"function t{i:05d}a(data: any): any {{ return data; }}")
    add("TS类型", f"非空断言 变种{i}", f"function t{i:05d}b(x: string|undefined) {{ return x!.length; }}")
    add("TS类型", f"类型断言 变种{i}", f"const t{i:05d}c = {i} as any;")
    add("TS类型", f"冗余类型 变种{i}", f"const t{i:05d}d: number = {i};")
    add("TS类型", f"缺少参数类型 变种{i}", f"function t{i:05d}e(x) {{ return x; }}")
    add("TS类型", f"错误类型赋值 变种{i}", f"const t{i:05d}f: string = {i};")

# --- 3. 异步/Promise 错误 (5501-7500) ---
for i in range(1, 401):
    add("异步", f"async 无 await 变种{i}", f"async function p{i:05d}a() {{ return Promise.resolve({i}); }}")
    add("异步", f"未处理 Promise 变种{i}", f"function p{i:05d}b() {{ Promise.resolve({i}); }}")
    add("异步", f"空 Promise 变种{i}", f"function p{i:05d}c() {{ return new Promise<void>(() => {{}}); }}")
    add("异步", f"未捕获拒绝 变种{i}", f"function p{i:05d}d() {{ new Promise((_,r) => r(new Error('{i}'))); }}")
    add("异步", f"async 返回 void 变种{i}", f"async function p{i:05d}e(): Promise<void> {{ return; }}")

# --- 4. 安全漏洞 (7501-9500) ---
for i in range(1, 401):
    add("安全", f"new Function 变种{i}", f"const s{i:05d}a = new Function('return {i}');")
    add("安全", f"setTimeout 字符串 变种{i}", f"function s{i:05d}b() {{ setTimeout('alert({i})', {i}); }}")
    add("安全", f"eval 变种{i}", f"function s{i:05d}c(code) {{ return eval(code); }}")
    add("安全", f"__proto__ 变种{i}", f"const s{i:05d}d = {{}}.__proto__;")
    add("安全", f"arguments.callee 变种{i}", f"function s{i:05d}e() {{ return arguments.callee; }}")

# --- 5. 复杂度/可维护性 (9501-11500) ---
for i in range(1, 401):
    params = ','.join([f"p{j}: number" for j in range(i%8+2, i%8+10)])
    add("复杂度", f"参数过多 变种{i}", f"function c{i:05d}a({params}) {{ return 0; }}")
    add("复杂度", f"深度嵌套 变种{i}", 'if(' * (i%6+3) + 'true)' + '{}' + '}' * (i%6+3))
    add("复杂度", f"回调地狱 变种{i}", 'setTimeout(()=>{' * (i%4+2) + f"console.log({i})" + '},100)' * (i%4+2))
    add("复杂度", f"复杂条件 变种{i}", f"function c{i:05d}d(a,b,c,d) {{ return (a||b)&&(c||d)&&!(a&&c)||(b&&!d); }}")
    add("复杂度", f"长三元 变种{i}", f"function c{i:05d}e(x) {{ return x==={i}?'a':x==={i+1}?'b':x==={i+2}?'c':'d'; }}")

# --- 6. 代码风格 (11501-13500) ---
for i in range(1, 401):
    add("风格", f"嵌套三元 变种{i}", f"function q{i:05d}a(x) {{ return x>{i}?x<{i+10}?'s':'b':'n'; }}")
    add("风格", f"魔术数字 变种{i}", f"function q{i:05d}b(x) {{ return x * 3.14 + 0.{i}; }}")
    add("风格", f"无用的转义 变种{i}", f"const q{i:05d}c = '\\\'{i}\\'';")
    add("风格", f"多余分号 变种{i}", f"const q{i:05d}d = {i};;")
    add("风格", f"无用的连接 变种{i}", f"const q{i:05d}e = '{i}' + '{i+1}';")

# --- 7. Import/Module (13501-15000) ---
for i in range(1, 301):
    add("模块", f"重复导入 变种{i}", f"import {{ x{i:05d}a }} from 'fs'; import {{ x{i:05d}b }} from 'fs';")
    add("模块", f"未导入使用 变种{i}", f"import {{ readFile }} from 'fs'; const x{i:05d} = 1;")
    add("模块", f"路径过长 变种{i}", f"import '../../../src/utils/module{i}'")

# --- 8. 正则错误 (15001-16000) ---
for i in range(1, 201):
    add("正则", f"空正则 变种{i}", f"const r{i:05d}a = /()/;")
    add("正则", f"不安全正则 变种{i}", f"function r{i:05d}b(s) {{ return /([a-z]+)+$/.test(s); }}")
    add("正则", f"RegExp 构造函数 变种{i}", f"const r{i:05d}c = new RegExp('({i})');")

# --- 9. 边界/异常情况 (16001-17500) ---
for i in range(1, 301):
    add("边界", f"除零 变种{i}", f"function z{i:05d}a(x) {{ return x / 0; }}")
    add("边界", f"NaN 比较 变种{i}", f"function z{i:05d}b(x) {{ return x === NaN; }}")
    add("边界", f"void 操作 变种{i}", f"function z{i:05d}c(x) {{ return void({i}); }}")
    add("边界", f"逗号表达式 变种{i}", f"function z{i:05d}d() {{ return ({i}, {i+1}, {i+2}); }}")
    add("边界", f"赋值作为条件 变种{i}", f"function z{i:05d}e(x) {{ if(x={i}) return true; }}")

# --- 10. 生成组合错误 (17501-20000) ---
import itertools
categories_gen = ['any', 'var', 'unused', 'eqeq', 'null', 'undef', 'void', 'never']
values = range(1, 313)
for i, (cat, val) in enumerate(itertools.product(categories_gen, values), 1):
    if i > 2500: break
    if cat == 'any':
        add("组合", f"any 组合 #{i}", f"function g{i:05d}(x: any, y: any): any {{ return x; }}")
    elif cat == 'var':
        add("组合", f"var 组合 #{i}", f"var g{i:05d} = {val};")
    elif cat == 'unused':
        add("组合", f"未使用组合 #{i}", f"const g{i:05d} = '{'x' * (val % 50 + 1)}';")
    elif cat == 'eqeq':
        add("组合", f"== 组合 #{i}", f"function g{i:05d}(x) {{ return x == {val}; }}")
    elif cat == 'null':
        add("组合", f"null 比较 #{i}", f"function g{i:05d}(x) {{ return x == null; }}")
    elif cat == 'undef':
        add("组合", f"undefined 比较 #{i}", f"function g{i:05d}(x) {{ return x === undefined; }}")
    elif cat == 'void':
        add("组合", f"void 使用 #{i}", f"function g{i:05d}() {{ const x = void({val}); return x; }}")
    elif cat == 'never':
        add("组合", f"never 使用 #{i}", f"function g{i:05d}(): never {{ throw {val}; }}")

# 写入文件
content = "// =======================================================================\n"
content += f"// 20000 种不同类型的代码错误 - 代码审查系统极限测试\n"
content += f"// 生成时间: {__import__('datetime').datetime.now()}\n"
content += "// =======================================================================\n\n"
content += "// @ts-nocheck\n\n"
content += "\n".join(errors)
content += "\n\nexport {}\n"

with open(OUTPUT, 'w', encoding='utf-8') as f:
    f.write(content)

actual = counter[0]
lines = content.count('\n')
size = os.path.getsize(OUTPUT)
print(f"✅ 生成完成!")
print(f"   目标: 20000 种")
print(f"   实际: {actual} 种")
print(f"   行数: {lines}")
print(f"   大小: {size:,} 字节 ({size/1024:.0f} KB)")
print(f"   文件: {OUTPUT}")
