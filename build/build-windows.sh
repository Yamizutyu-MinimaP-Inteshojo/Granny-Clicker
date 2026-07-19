#!/usr/bin/env bash
set -euo pipefail

echo "Building package.nw..."
rm -f package.nw
# create zip with package.json, index.html and web/
zip -r package.nw package.json index.html web -x "assets/*"

echo "Make sure you have nw.exe (Windows runtime) available. This script will expect a path to it."
if [ -z "${NW_EXE:-}" ]; then
  echo "Set NW_EXE to path of nw.exe (win runtime). Example: export NW_EXE=/tmp/nw/nw.exe"
  exit 1
fi

echo "Concatenating..."
cat "$NW_EXE" package.nw > GrannyClicker.exe
echo "GrannyClicker.exe created."

echo "Optional: set icon + sign using rcedit / signtool on Windows."
