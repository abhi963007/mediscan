@echo off
echo Starting MediScan HMS Development Servers...

REM Start Django Backend via a new Terminal Window
start cmd /k "python manage.py runserver"

REM Start Vite React Frontend via the current Terminal
echo Starting Frontend UI...
npm run dev
