@echo off
echo ========================================
echo   Starting EnterpriseHub AI Frontend
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Installing/checking dependencies...
call npm install --silent

echo.
echo [2/2] Starting Next.js development server...
echo.
echo ========================================
echo   Frontend will run on:
echo   http://localhost:3000
echo   
echo   Press Ctrl+C to stop
echo ========================================
echo.

call npm run dev

pause
