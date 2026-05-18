@echo off
REM MERN III Quick Start Script for Windows
REM This script will start both backend and frontend servers

echo.
echo ================================================
echo    MERN III - Quick Start Script (Windows)
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo.
echo [1/2] Starting Backend Server...
echo.
cd backend
call npm install >nul 2>&1
start "MERN Backend" cmd /k "npm run dev"
echo.
echo  Backend started
echo  http://localhost:5000
echo.

REM Wait for backend to start
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Server...
echo.
cd ..
call npm install >nul 2>&1
start "MERN Frontend" cmd /k "npm run dev"
echo.
echo  Frontend started
echo  http://localhost:3000
echo.

echo.
echo ================================================
echo    MERN III is Ready to Use!
echo ================================================
echo.
echo Open your browser:
echo   Frontend: http://localhost:3000
echo.
echo Test Accounts:
echo   User:  john@example.com / Test@123
echo   Admin: admin@example.com / Admin@123
echo.
echo Important Links:
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo.
echo Documentation:
echo   - PROJECT_STATUS.md
echo   - RAILWAY_DEPLOYMENT.md
echo.
echo Press any key to close this window...
pause >nul
