#!/usr/bin/env python3
"""分析代码审查系统对错误测试文件的检测覆盖情况，找出漏洞。"""

import re
import subprocess
import json

ERROR_FILE = 'src/error-types.ts'
ESLINT_CONFIG = '.eslintrc.cjs'

# ============================================================
# 1. 读取错误文件
# ============================================================
with open(ERROR_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
print("=" * 60)
print("  📊 代码审查系统漏洞分析报告")
print("=" * 60)

# ============================================================
# 2. 统计各类错误
# ============================================================
categories = {}
current_cat = "未分类"
total_patterns = 0

for line in lines:
    if '类别' in line and ':' in line:
        current_cat = line.strip().replace('//', '').strip()
    elif line.startswith('// ') and '=' not in line[2:5]:
        total_patterns += 1
        if current_cat not in categories:
            categories[current_cat] = []
        categories[current_cat].append(line)

print(f"\n📋 测试文件共有 {total_patterns} 个错误模式:")
for cat, items in categories.items():
    print(f"   {cat}: {len(items)} 个")

# ============================================================
# 3. 已配置的规则
# ============================================================
with open(ESLINT_CONFIG, 'r', encoding='utf-8') as f:
    eslint_content = f.read()

configured_rules = set()
for match in re.finditer(r"'([^']+)':\s*\[?'error", eslint_content):
    configured_rules.add(match.group(1))
for match in re.finditer(r'"([^"]+)":\s*\[?"error', eslint_content):
    configured_rules.add(match.group(1))

print(f"\n✅ 当前已配置的 ESLint error 规则: {len(configured_rules)} 条")
for r in sorted(configured_rules):
    print(f"   - {r}")

# ============================================================
# 4. 建议新增的规则（审查漏洞）
# ============================================================
new_rules = {
    # 安全相关
    'no-unsafe-negation': '不安全取反操作',
    'no-unsafe-optional-chaining': '不安全可选链',
    'no-unsafe-assignment': '不安全赋值（TS）',
    'no-loss-of-precision': '精度丢失',

    # 代码质量
    'no-unreachable-loop': '不可达的循环',
    'no-promise-executor-return': 'Promise executor 返回值',
    'no-constructor-return': '构造函数返回值',
    'no-dupe-else-if': '重复 if-else 条件',
    'no-setter-return': 'Setter 返回值',
    'no-useless-backreference': '无用正则反向引用',
    'no-nonoctal-decimal-escape': '禁止非八进制转义',
    'no-sparse-arrays': '禁止稀疏数组',
    'no-duplicate-case': '重复 case 标签',

    # TypeScript 增强
    '@typescript-eslint/no-duplicate-enum-values': '枚举重复值',
    '@typescript-eslint/prefer-as-const': '优先 as const',
    '@typescript-eslint/prefer-enum-initializers': '枚举必须初始化',
    '@typescript-eslint/prefer-reduce-type-parameter': 'reduce 类型参数',
    '@typescript-eslint/no-unnecessary-type-constraint': '不必要的泛型约束',
    '@typescript-eslint/switch-exhaustiveness-check': 'Switch 穷举检查',
    '@typescript-eslint/prefer-optional-chain': '优先可选链',
    '@typescript-eslint/no-confusing-non-null-assertion': '混淆的非空断言',

    # 复杂度
    '@typescript-eslint/no-unnecessary-condition': '不必要条件检查',
    '@typescript-eslint/strict-boolean-expressions': '严格布尔表达式',
}

print(f"\n🕵️ 发现的审查漏洞（建议新增 {len(new_rules)} 条规则）:")
print("-" * 60)
for rule, desc in sorted(new_rules.items()):
    if rule not in configured_rules:
        print(f"   📌 {rule}")
        print(f"      → {desc}")

# ============================================================
# 5. 针对 error-types.ts 中特定模式的建议
# ============================================================
patterns_in_file = {
    'no-with': 'with 语句',
    'no-eval': 'eval 调用',
    'no-debugger': 'debugger 语句',
    'no-new-wrappers': 'new String/Number/Boolean',
    'no-iterator': '__iterator__',
    'no-proto': '__proto__',
    'no-caller': 'arguments.callee',
    'no-implied-eval': 'new Function / setTimeout-string',
    'no-var': 'var 声明',
    'eqeqeq': '== 而非 ===',
    'prefer-template': '字符串 + 拼接',
    'no-empty': '空 catch 块 / 空块',
    'no-constant-condition': '常量条件',
    'no-unused-vars': '未使用变量',
    'no-throw-literal': '抛出字面量',
    'no-shadow': '变量遮蔽',
    'no-param-reassign': '修改函数参数',
}

print(f"\n🔍 当前错误文件中的已知模式（{len(patterns_in_file)} 种）:")
for rule, desc in sorted(patterns_in_file.items()):
    status = "✅ 已配置" if rule in configured_rules else "❌ 未配置"
    if rule in configured_rules:
        count = 0
        for line in lines:
            if ('new String' in line or 'new Number' in line or 'new Boolean' in line) and 'no-new-wrappers' == rule:
                count += 1
        print(f"   {status} | {desc} ({rule})")

print("\n" + "=" * 60)
print("  分析完成！")
print("=" * 60)
