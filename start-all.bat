@echo off
cd /d "%~dp0"

echo ===================================================
echo Starting ZenTrade Trading Platform (Zerodha Clone)...
echo ===================================================

echo [1/3] Starting Backend (Port 3001)...
start "ZenTrade Backend [Port 3001]" cmd /k "cd backend && npm run dev"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Frontend [Port 5173]...
start "ZenTrade Frontend [Port 5173]" cmd /k "cd frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Dashboard [Port 5174]...
start "ZenTrade Dashboard [Port 5174]" cmd /k "cd dashboard && npm run dev"

echo.
echo All 3 servers are starting!
echo Frontend:  http://localhost:5173
echo Dashboard: http://localhost:5174
echo Backend:   http://localhost:3001
echo.
pause
