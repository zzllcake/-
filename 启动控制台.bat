@echo off
chcp 65001 >nul
title 🤖 代码审查控制台

cd /d "%~dp0"

echo.
echo  ╔═══════════════════════════════════════╗
echo  ║    🤖 代码审查控制台                   ║
echo  ║                                       ║
echo  ║    正在启动服务器...                   ║
echo  ╚═══════════════════════════════════════╝
echo.

:: 检查 Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo ❌ 未找到 Node.js
  echo 请安装 Node.js: https://nodejs.org/
  pause
  exit /b
)

:: 启动服务器（隐藏窗口）
start /B "" node server.cjs > "%TEMP%\review-server.log" 2>&1

:: 等待服务器启动
echo 等待服务器就绪...
timeout /t 3 /nobreak >nul

:: 测试服务器是否启动
curl -s http://localhost:3456/api/status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo ⚠️ 服务器启动较慢，再等一会儿...
  timeout /t 3 /nobreak >nul
)

:: 打开浏览器
echo 打开浏览器...
start "" "http://localhost:3456"

echo.
echo ✅ 控制台已启动！
echo.
echo  🌐 浏览器: http://localhost:3456
echo.
echo  按任意键关闭本窗口（服务器在后台继续运行）
echo  如需停止服务器，请运行: taskkill /f /im node.exe
echo.
pause >nul
