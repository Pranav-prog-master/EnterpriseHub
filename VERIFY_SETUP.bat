@echo off
echo ========================================
echo   EnterpriseHub AI - Setup Verification
echo ========================================
echo.

cd /d "%~dp0"

echo Checking your setup...
echo.

REM Check MongoDB
echo [1/5] Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MongoDB is running!
) else (
    echo [X] MongoDB is NOT running!
    echo     Please start MongoDB: mongod --dbpath "C:\data\db"
)
echo.

REM Check Redis
echo [2/5] Checking Redis...
tasklist /FI "IMAGENAME eq redis-server.exe" 2>NUL | find /I /N "redis-server.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] Redis is running!
) else (
    echo [X] Redis is NOT running!
    echo     Please start Redis: redis-server
)
echo.

REM Check Backend
echo [3/5] Checking Backend...
tasklist /FI "IMAGENAME eq python.exe" 2>NUL | find /I /N "python.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] Backend Python process found!
) else (
    echo [X] Backend is NOT running!
    echo     Please start: cd backend ^& venv\Scripts\activate ^& python manage.py runserver
)
echo.

REM Check Frontend
echo [4/5] Checking Frontend...
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] Frontend Node.js process found!
) else (
    echo [X] Frontend is NOT running!
    echo     Please start: cd frontend ^& npm run dev
)
echo.

REM Check if virtual environment exists
echo [5/5] Checking Python Virtual Environment...
if exist "backend\venv\Scripts\activate.bat" (
    echo [OK] Virtual environment found!
) else (
    echo [X] Virtual environment NOT found!
    echo     Please create: cd backend ^& python -m venv venv
)
echo.

echo ========================================
echo   Verification Complete!
echo.
echo   Next Steps:
echo   1. Fix any [X] issues above
echo   2. Run: QUICK_PERFORMANCE_SETUP.bat (one-time)
echo   3. Run: START_FAST.bat (to start all services)
echo ========================================
echo.
pause
