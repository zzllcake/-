#!/usr/bin/env python3
"""生成 500 个不同类型的代码错误，用于测试代码审查系统。"""

OUTPUT = 'src/error-test-500.ts'
errors = []
n = [0]

def add(cat, desc, code):
    n[0] += 1
    errors.append((n[0], cat, desc, code))

# ============================================================
# 类别 1: 基础 JS 错误 (100个)
# ============================================================
for i in range(1, 26):
    add("基础JS", f"== 松散比较 #{i}", f"function eq{i}(a, b) {{ return a == {i}; }}")
for i in range(26, 51):
    add("基础JS", f"!= 松散比较 #{i}", f"function neq{i}(a, b) {{ return a != {i}; }}")
for i in range(51, 76):
    add("基础JS", f"var 声明 #{i}", f"var legacyVar{i} = {i};")
for i in range(76, 101):
    add("基础JS", f"未使用变量 #{i}", f"const unusedConst{i} = 'value{i}';")

# ============================================================
# 类别 2: TypeScript 类型错误 (100个)
# ============================================================
for i in range(1, 26):
    add("TS类型", f"any 滥用 #{i}", f"function anyFunc{i}(data: any): any {{ return data; }}")
for i in range(26, 51):
    add("TS类型", f"非空断言 #{i}", f"function nonNull{i}(v: string | undefined) {{ return v!.length + {i}; }}")
for i in range(51, 76):
    add("TS类型", f"隐式 any 参数 #{i}", f"function implicitAny{i}(param) {{ return param; }}")
for i in range(76, 101):
    add("TS类型", f"类型不匹配 #{i}", f"const typeMismatch{i}: string = {i};")

# ============================================================
# 类别 3: 异步/Promise 错误 (80个)
# ============================================================
for i in range(1, 21):
    add("异步", f"async 无 await #{i}", f"async function asyncNoAwait{i}() {{ return Promise.resolve({i}); }}")
for i in range(21, 41):
    add("异步", f"未处理 Promise #{i}", f"function floatingPromise{i}() {{ Promise.resolve({i}); }}")
for i in range(41, 61):
    add("异步", f"空 Promise #{i}", f"function emptyPromise{i}() {{ return new Promise<void>(() => {{}}); }}")
for i in range(61, 81):
    add("异步", f"Promise 拒绝未捕获 #{i}", f"function uncaughtReject{i}() {{ new Promise((_, r) => r(new Error('err{i}'))); }}")

# ============================================================
# 类别 4: 安全漏洞 (70个)
# ============================================================
for i in range(1, 21):
    add("安全", f"eval 使用 #{i}", f"function useEval{i}(code: string) {{ return eval(code + '{i}'); }}")
for i in range(21, 41):
    add("安全", f"new Function #{i}", f"const dangerousFn{i} = new Function('return {i}');")
for i in range(41, 56):
    add("安全", f"__proto__ 访问 #{i}", f"const protoAccess{i} = {{ level: {i} }}.__proto__;")
for i in range(56, 71):
    add("安全", f"arguments.callee #{i}", f"function calleeUse{i}() {{ return arguments.callee; }}")

# ============================================================
# 类别 5: 复杂度/可维护性 (60个)
# ============================================================
for i in range(1, 21):
    add("复杂度", f"参数过多 #{i}", f"function manyParams{i}(a,b,c,d,e,f,g,h) {{ return a+b+c+d+e+f+g+h+{i}; }}")
for i in range(21, 41):
    add("复杂度", f"嵌套三元 #{i}", f"function nestedTernary{i}(x) {{ return x>{i}?x<{i+10}?'mid':'high':'low'; }}")
for i in range(41, 61):
    add("复杂度", f"魔术数字 #{i}", f"function magicNum{i}(qty) {{ return qty * 19.99 + 4.5 + {i}; }}")

# ============================================================
# 类别 6: 代码风格 (50个)
# ============================================================
for i in range(1, 26):
    add("风格", f"字符串拼接 #{i}", f"function concatStr{i}(name) {{ return 'Hello ' + name + ' #{i}'; }}")
for i in range(26, 51):
    add("风格", f"多余分号 #{i}", f"const extraSemi{i} = {i};;")

# ============================================================
# 类别 7: Import/模块 (20个)
# ============================================================
for i in range(1, 11):
    add("模块", f"重复导入 #{i}", f"import {{ readFileSync as rf{i} }} from 'fs';")
for i in range(11, 21):
    add("模块", f"未使用导入 #{i}", f"// unused import marker {i}")

# ============================================================
# 类别 8: 边界/异常 (20个)
# ============================================================
for i in range(1, 11):
    add("边界", f"NaN 比较 #{i}", f"function nanCompare{i}(x) {{ return x === NaN || x === {i}; }}")
for i in range(11, 21):
    add("边界", f"赋值作条件 #{i}", f"function assignCond{i}(x) {{ if ((x = {i})) return true; return false; }}")

# ============================================================
# 写入文件
# ============================================================
lines = [
    "// =====================================================================",
    f"// 500 个不同类型的代码错误 - 代码审查测试专用",
    f"// 共 {n[0]} 个错误，分 8 大类别",
    "// =====================================================================",
    "",
]

current_cat = None
for num, cat, desc, code in errors:
    if cat != current_cat:
        current_cat = cat
        lines.append("")
        lines.append(f"// ==================== {cat} ====================")
        lines.append("")
    lines.append(f"// #{num}: {desc}")
    lines.append(code)

lines.append("")
lines.append("export {};")

with open(OUTPUT, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')

import os
print(f"✅ 已生成 {n[0]} 个不同类型的错误")
print(f"   文件: {OUTPUT}")
print(f"   行数: {len(lines)}")
print(f"   大小: {os.path.getsize(OUTPUT):,} 字节")
print()
print("📊 类别分布:")
cats = {}
for _, cat, _, _ in errors:
    cats[cat] = cats.get(cat, 0) + 1
for cat, cnt in cats.items():
    print(f"   {cat}: {cnt} 个")
