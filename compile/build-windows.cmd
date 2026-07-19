@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo Cleaning previous builds...
if exist dist rmdir /s /q dist
mkdir dist

echo Creating package.nw (excluding large external assets)...
REM Using 7zip if available, otherwise use powershell Compress-Archive
where 7z >nul 2>&1 && (
  7z a -tzip package.nw package.json index.html web\* -xr!assets\*
) || (
  powershell -Command "Remove-Item -Force package.nw -ErrorAction SilentlyContinue; Compress-Archive -Path package.json,index.html,web\* -DestinationPath package.nw"
)

echo Place nw.exe from the NW.js runtime into this folder (nw.exe from matching version & arch).
if not exist ..\library\nw.js\nw.exe (
  echo nw.exe not found. Please download appropriate NW.js runtime and copy nw.exe here.
  pause
  exit /b 1
)

echo Concatenating nw.exe + package.nw -> GrannyClicker.exe
copy /b ..\library\nw.js\nw.exe+package.nw ..\build\dist\GrannyClicker.exe

if exist build\icon.ico (
  echo Setting icon with rcedit (if available)...
  if exist build\rcedit.exe (
    ..\library\rcedit\rcedit.exe dist\GrannyClicker.exe --set-icon build\icon.ico
  ) else (
    echo rcedit.exe not found. Skip icon setting.
  )
) else (
  echo No icon found at build\icon.ico
)

echo Optional: Sign the EXE using signtool:
echo signtool sign /f mycert.pfx /p <password> /fd SHA256 /tr http://timestamp.digicert.com /td SHA256 dist\GrannyClicker.exe

echo Build finished: dist\GrannyClicker.exe
pause
