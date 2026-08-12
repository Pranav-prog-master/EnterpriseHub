@echo off
echo ========================================
echo   Quick Performance Setup
echo   EnterpriseHub AI
echo ========================================
echo.

echo This will optimize your project for maximum performance!
echo.
pause

cd /d "%~dp0"

echo [1/5] Creating MongoDB indexes...
cd backend
call venv\Scripts\activate.bat
python manage.py create_indexes
echo.

echo [2/5] Installing performance packages...
pip install gunicorn gevent django-redis
echo.

echo [3/5] Optimizing frontend...
cd ..\frontend
call npm install --legacy-peer-deps
echo.

echo [4/5] Building optimized frontend...
call npm run build
echo.

echo [5/5] Creating startup scripts...
cd ..
echo All done!
echo.

echo ========================================
echo   Performance Setup Complete!
echo.
echo   Next steps:
echo   1. Run: START_FAST.bat
echo   2. Open: http://localhost:3000
echo ========================================
pause
