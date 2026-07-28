@echo off
chcp 65001 >nul
title 🤖 代码审查控制台

cd /d "%~dp0"

echo.
echo  ╔═══════════════════════════════════════╗
echo  ║    🤖 正在启动代码审查控制台           ║
echo  ╚═══════════════════════════════════════╝
echo.

:: 检查 Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo ❌ 未找到 Node.js，请先安装
  pause
  exit /b
)

:: 启动服务器
echo 📡 启动本地 API 服务器...
start /B node server.cjs
if %ERRORLEVEL% NEQ 0 (
  echo ❌ 服务器启动失败
  pause
  exit /b
)

:: 等服务器就绪
timeout /t 2 /nobreak >nul

:: 打开浏览器
start "" "http://localhost:3456"

echo ✅ 控制台已启动！
echo.
echo 🌐 浏览器已打开: http://localhost:3456
echo 📡 按 Ctrl+C 停止服务器
echo.
echo 按任意键关闭本窗口（服务器会继续在后台运行）
pause >nul
