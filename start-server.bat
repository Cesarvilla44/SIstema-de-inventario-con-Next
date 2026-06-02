@echo off
echo Iniciando servidor Next.js...
echo.
cd /d "%~dp0"
npm run dev -- --turbopack --port 3000
pause
