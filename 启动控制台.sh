#!/usr/bin/env bash
echo "🤖 正在启动代码审查控制台..."
cd "$(dirname "$0")"

# 获取 GitHub Token
TOKEN=$(gh auth token 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "⚠️ 未检测到 GitHub Token"
  echo "请先登录: gh auth login"
  exit 1
fi

echo "✅ Token 已获取"
echo "🚀 正在打开浏览器..."

# 启动浏览器并传入 token
if command -v start &>/dev/null; then
  start "" "index.html?token=$TOKEN"
elif command -v xdg-open &>/dev/null; then
  xdg-open "index.html?token=$TOKEN"
else
  echo "请手动打开 index.html?token=$TOKEN"
fi

echo "✅ 控制台已启动！"
