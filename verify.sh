#!/usr/bin/env bash
# 代码审查系统完整性验证脚本
export PATH="/c/Users/张张/node-v20.17.0-win-x64:/c/Program Files/GitHub CLI:$PATH"

cd "$(dirname "$0")"

PASS=0
FAIL=0

check() {
  if eval "$2" > /dev/null 2>&1; then
    echo "  ✅ $1"
    PASS=$((PASS + 1))
  else
    echo "  ❌ $1"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   🔍 代码审查系统完整性验证                 ║"
echo "╚════════════════════════════════════════════╝"
echo ""

echo "📁 配置文件"
check "工作流文件存在" "[ -f .github/workflows/code-review.yml ]"
check "ESLint 配置存在" "[ -f .eslintrc.cjs ]"
check "Prettier 配置存在" "[ -f .prettierrc ]"
check "TypeScript 配置存在" "[ -f tsconfig.json ]"
check "Vitest 配置存在" "[ -f vitest.config.ts ]"
check "package.json 存在" "[ -f package.json ]"
echo ""

echo "📦 依赖安装"
check "node_modules 已安装" "[ -d node_modules ]"
check "ESLint 可用" "npx eslint --version"
check "TypeScript 可用" "npx tsc --version"
check "Vitest 可用" "npx vitest --version"
echo ""

echo "🔍 本地检查链"
check "ESLint 通过" "npm run lint"
check "Prettier 通过" "npm run format:check"
check "TypeScript 通过" "npm run typecheck"
check "测试通过" "npm test"
echo ""

echo "🌐 GitHub 配置"
check "GitHub 已认证" "gh auth status"
check "工作流已启用" "gh workflow list | grep -q active"
check "分支保护已配置" "gh api repos/zzllcake/-/branches/main/protection"
check "远程仓库可访问" "git ls-remote origin HEAD"
echo ""

echo "📊 测试数据"
TEST_COUNT=$(npm test 2>&1 | grep -oE "Tests.*[0-9]+ passed" | grep -oE "[0-9]+ passed" | head -1 || echo "0 passed")
echo "  📝 测试用例: $TEST_COUNT"

COVERAGE=$(npm run test:coverage 2>&1 | grep "All files" | awk -F'|' '{gsub(/ /,"",$2); print $2}' || echo "?")
echo "  📈 覆盖率: ${COVERAGE}%"
echo "  📏 审查规则: $(grep -c 'error' .eslintrc.cjs) 条"

ERROR_FILES=$(ls src/error-types*.ts 2>/dev/null | wc -l || echo 0)
echo "  🐛 错误测试文件: $ERROR_FILES 个"
echo ""

echo "════════════════════════════════════════════"
echo "  验证结果: ✅ $PASS 通过  ❌ $FAIL 失败"
echo "════════════════════════════════════════════"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "🎉 系统完整，可以正常使用！"
else
  echo "⚠️  有 $FAIL 项需要修复"
fi
echo ""
