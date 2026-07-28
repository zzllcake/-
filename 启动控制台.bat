@echo off
chcp 65001 >nul
echo 🤖 正在启动代码审查控制台...
cd /d "%~dp0"

:: 获取 GitHub Token
for /f "delims=" %%t in ('gh auth token 2^>nul') do set TOKEN=%%t

if "%TOKEN%"=="" (
  echo ⚠️ 未检测到 GitHub Token
  echo 请先登录: gh auth login
  pause
  exit /b
)

echo ✅ Token 已获取
echo 🚀 正在打开浏览器...

:: 启动浏览器并传入 token
start "" "index.html?token=%TOKEN%"
echo ✅ 控制台已启动！
echo.
echo 按任意键关闭...
pause >nul
