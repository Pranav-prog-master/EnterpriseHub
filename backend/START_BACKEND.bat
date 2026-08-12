@echo off
echo ========================================
echo   Starting EnterpriseHub AI Backend
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo [2/3] Checking for issues...
python manage.py check --settings=config.settings.dev

echo.
echo [3/3] Starting Django development server...
echo.
echo ========================================
echo   Backend will run on:
echo   http://localhost:8000
echo   
echo   Press Ctrl+C to stop
echo ========================================
echo.

python manage.py runserver 8000 --settings=config.settings.dev

pause
