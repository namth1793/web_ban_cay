@echo off
echo === Khoi dong Web Ban Cay ===
echo Backend: http://localhost:5013
echo Frontend: http://localhost:5173
echo.
echo Nhan Ctrl+C de dung server
echo.

start "Backend - Web Ban Cay" cmd /k "cd /d "%~dp0backend" && node server.js"
timeout /t 2 /nobreak >nul
start "Frontend - Web Ban Cay" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 3 /nobreak >nul
start http://localhost:5173
