#!/usr/bin/env bash
# 20000 错误审查能力测试
# 运行审查系统对 20000 错误文件的检测，统计捕获率
set -euo pipefail

echo "=========================================="
echo "  20000 错误审查能力测试"
echo "=========================================="

cd "$(dirname "$0")/.."

# 复制测试文件（用不匹配 ignore 的名字）
cp src/error-types-20000.ts src/_20000-metric.ts

echo ""
echo "[1/3] ESLint 检测..."
ESLINT_OUTPUT=$(npx eslint --config .eslintrc.cjs src/_20000-metric.ts 2>&1 || true)
ESLINT_ERRORS=$(echo "$ESLINT_OUTPUT" | grep -c "error " || echo "0")
ESLINT_WARNS=$(echo "$ESLINT_OUTPUT" | grep -c "warning " || echo "0")
echo "  ESLint 错误: $ESLINT_ERRORS"
echo "  ESLint 警告: $ESLINT_WARNS"

echo ""
echo "[2/3] TypeScript 检测..."
TS_OUTPUT=$(npx tsc --noEmit src/_20000-metric.ts 2>&1 || true)
TS_ERRORS=$(echo "$TS_OUTPUT" | grep -c "error TS" || echo "0")
echo "  TypeScript 错误: $TS_ERRORS"

echo ""
echo "[3/3] 汇总"
TOTAL=$(grep -c "^// #" src/error-types-20000.ts || echo "20000")
echo "  总错误模式: $TOTAL"
echo "  总捕获: $((ESLINT_ERRORS + TS_ERRORS))"
echo "  捕获率: $(echo "scale=1; ($ESLINT_ERRORS + $TS_ERRORS) * 100 / $TOTAL" | bc 2>/dev/null || echo "N/A")%"

# 清理
rm -f src/_20000-metric.ts
echo ""
echo "=========================================="
echo "  测试完成"
echo "=========================================="
