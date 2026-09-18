#!/usr/bin/env bash
echo "🤖 正在启动代码审查控制台..."
cd "$(dirname "$0")"

# 检查 Node.js
if ! command -v node &>/dev/null; then
  echo "❌ 未找到 Node.js，请先安装"
  exit 1
fi

# 启动服务器
echo "📡 启动本地服务器..."
node server.cjs &
SERVER_PID=$!
sleep 2

# 打开浏览器
echo "🌐 打开浏览器..."
if command -v start &>/dev/null; then
  start "http://localhost:3456"
elif command -v xdg-open &>/dev/null; then
  xdg-open "http://localhost:3456"
else
  echo "请手动打开: http://localhost:3456"
fi

echo ""
echo "✅ 控制台已启动！"
echo "  🌐 浏览器: http://localhost:3456"
echo "  📡 按 Ctrl+C 停止服务器"
echo ""

# 等待服务器进程
wait $SERVER_PID
