@echo off
echo ========================================
echo   STARTING BACKEND AND FRONTEND
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0solar-backend && npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0solar-frontend && npm run dev"

echo.
echo ========================================
echo   SERVERS ARE STARTING!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
echo (Keep the server windows open!)
pause > nul
