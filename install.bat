@echo off
echo === Cai dat Web Ban Cay ===
echo.
echo [1/2] Cai dat Backend...
cd /d "%~dp0backend"
call npm install
if errorlevel 1 (echo LOI: Khong the cai dat backend & pause & exit /b 1)

echo.
echo [2/2] Cai dat Frontend...
cd /d "%~dp0frontend"
call npm install
if errorlevel 1 (echo LOI: Khong the cai dat frontend & pause & exit /b 1)

echo.
echo === Cai dat hoan tat! Chay start.bat de khoi dong ===
pause
