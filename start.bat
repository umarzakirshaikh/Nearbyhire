@echo off
echo ===================================================
echo           Starting NearbyHire Full-Stack
echo ===================================================
echo.

echo Starting Backend Server on http://localhost:5000 ...
start "NearbyHire Backend" cmd /k "cd /d %~dp0backend && npm.cmd start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server on http://localhost:5173 ...
start "NearbyHire Frontend" cmd /k "cd /d %~dp0frontend && npm.cmd run dev"

echo.
echo Both servers started!
echo Opening browser at http://localhost:5173 ...
timeout /t 2 /nobreak >nul
start http://localhost:5173

exit
