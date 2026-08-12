@echo off
echo ========================================
echo   EnterpriseHub AI - Fast Mode
echo   Starting all services...
echo ========================================
echo.

cd /d "%~dp0"

REM Check if MongoDB is running
echo [1/3] Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo MongoDB not running. Starting...
    start "MongoDB" mongod --dbpath "C:\data\db"
    timeout /t 3 >nul
) else (
    echo MongoDB already running!
)

REM Check if Redis is running
echo [2/3] Checking Redis...
tasklist /FI "IMAGENAME eq redis-server.exe" 2>NUL | find /I /N "redis-server.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo Redis not running. Starting...
    start "Redis" redis-server
    timeout /t 2 >nul
) else (
    echo Redis already running!
)

REM Start Backend
echo [3/3] Starting Backend (Fast Mode)...
cd backend
start "Backend-Fast" cmd /k "venv\Scripts\activate && python manage.py runserver 8000 --settings=config.settings.dev --noreload"

REM Wait for backend to start
timeout /t 3 >nul

REM Start Frontend
echo.
echo Starting Frontend...
cd ..\frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   All services started!
echo.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo.
echo   Press any key to stop all services...
echo ========================================
pause

REM Stop all services
taskkill /FI "WindowTitle eq Backend-Fast*" /F >nul 2>&1
taskkill /FI "WindowTitle eq Frontend*" /F >nul 2>&1
echo Services stopped.
