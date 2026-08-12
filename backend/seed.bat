@echo off
echo ====================================
echo EnterpriseHub AI - Database Seeding
echo ====================================
echo.
echo This will create sample data in your database.
echo WARNING: This will delete existing data!
echo.
pause
echo.
echo Starting seed script...
echo.
python seed_database.py
echo.
pause
