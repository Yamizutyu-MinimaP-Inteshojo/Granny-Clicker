@echo off
title Granny Clicker Launcher
color 0c
cls

:menu
echo ========================================
echo         GRANNY CLICKER - 1.0
echo ========================================
echo.
echo I can hear you... Do you dare to enter?
echo.
set /p choice="Do you want to start the game? (Y/N): "

if /i "%choice%"=="Y" goto loading
if /i "%choice%"=="N" exit
goto menu

:loading
cls
echo [HOUSE]: Locking the front door...
timeout /t 1 >nul
echo [GRANNY]: Hiding items in rooms...
timeout /t 1 >nul
echo [SYSTEM]: Preparing creaky floorboards...
timeout /t 2 >nul
cls
echo ========================================
echo          SETUP: [##########] 100%
echo ========================================
echo.
echo Run...

if exist "web\title\title.html" (
    start "" "web\title\title.html"
    exit
) else (
    start "" "errors\M-0.vbs"
    exit
)