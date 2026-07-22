#!/usr/bin/env bash
#
# setup.sh — 一键初始化自动代码审查项目
#
# 用法:
#   chmod +x setup.sh && ./setup.sh
#
# 功能:
#   1. 创建 src/ 目录及示例文件
#   2. 安装 npm 依赖
#   3. 初始化 Git 仓库（如尚未初始化）
# =============================================================================

set -euo pipefail

echo "============================================"
echo "  🚀 自动代码审查项目 — 初始化脚本"
echo "============================================"
echo ""

# --------------------------------------------------
# 1. 创建源码目录结构
# --------------------------------------------------
echo "📁 创建目录结构..."
mkdir -p src/utils
mkdir -p src/__tests__
mkdir -p reports

# 创建示例源文件
if [ ! -f src/index.ts ]; then
  cat > src/index.ts << 'EOF'
/**
 * 应用程序入口
 */
import { greet } from './utils/greet.js';

const message = greet('World');
console.log(message);

export { greet };
EOF
  echo "  ✅ src/index.ts"
fi

if [ ! -f src/utils/greet.ts ]; then
  cat > src/utils/greet.ts << 'EOF'
/**
 * 返回问候语
 * @param name 要问候的名字
 * @returns 格式化的问候语
 */
export function greet(name: string): string {
  return `Hello, ${name}!`;
}

/**
 * 返回带时间的问候语
 * @param name 要问候的名字
 * @returns 带时间的问候语
 */
export function greetWithTime(name: string): string {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return `${greeting}, ${name}!`;
}
EOF
  echo "  ✅ src/utils/greet.ts"
fi

# 创建示例测试文件
if [ ! -f src/__tests__/greet.test.ts ]; then
  cat > src/__tests__/greet.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import { greet } from '../utils/greet.js';

describe('greet', () => {
  it('should return a greeting with the given name', () => {
    const result = greet('World');
    expect(result).toBe('Hello, World!');
  });

  it('should handle empty string', () => {
    const result = greet('');
    expect(result).toBe('Hello, !');
  });

  it('should handle special characters', () => {
    const result = greet('Alice & Bob');
    expect(result).toBe('Hello, Alice & Bob!');
  });
});
EOF
  echo "  ✅ src/__tests__/greet.test.ts"
fi

# --------------------------------------------------
# 2. 安装 npm 依赖
# --------------------------------------------------
echo ""
echo "📦 安装 npm 依赖..."
npm install
echo "  ✅ 依赖安装完成"

# --------------------------------------------------
# 3. 验证安装
# --------------------------------------------------
echo ""
echo "🔍 验证工具链..."
npx eslint --version 2>/dev/null && echo "  ✅ ESLint" || echo "  ⚠️ ESLint 未安装"
npx prettier --version 2>/dev/null && echo "  ✅ Prettier" || echo "  ⚠️ Prettier 未安装"
npx tsc --version 2>/dev/null && echo "  ✅ TypeScript" || echo "  ⚠️ TypeScript 未安装"
npx vitest --version 2>/dev/null && echo "  ✅ Vitest" || echo "  ⚠️ Vitest 未安装"

# --------------------------------------------------
# 4. 初始化 Git 仓库
# --------------------------------------------------
if [ ! -d .git ]; then
  echo ""
  echo "🔧 初始化 Git 仓库..."
  git init
  git checkout -b main
  echo "  ✅ Git 仓库已初始化 (main 分支)"
else
  echo ""
  echo "  ℹ️  Git 仓库已存在，跳过初始化"
fi

# --------------------------------------------------
# 5. 完成
# --------------------------------------------------
echo ""
echo "============================================"
echo "  ✅ 初始化完成！"
echo "============================================"
echo ""
echo "下一步:"
echo "  1. 在 GitHub 上创建仓库"
echo "     gh repo create your-org/your-repo --source=. --push"
echo ""
echo "  2. 或者在本地运行检查测试:"
echo "     npm run check:all"
echo ""
echo "  3. 提交代码:"
echo "     git add ."
echo '     git commit -m "chore: initial setup with auto code review"'
echo "     git remote add origin <your-repo-url>"
echo "     git push -u origin main"
echo ""
echo "  4. 创建 PR，自动触发代码审查 🎉"
echo ""
