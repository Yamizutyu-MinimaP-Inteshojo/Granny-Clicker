#!/bin/bash

clear

# "=========================================="
# "      Granny Clicker - Build Script       "
# "=========================================="
# "=========================================="
# "      Starting the build process...       "
# "=========================================="

pkg update
pkg upgrade -y && pkg install nodejs zip rsync -y && termux-setup-storage && echo paste this command again

mkdir -p ~/granny-clicker
cd "/storage/emulated/0/Granny Clicker"
rsync -av ./ ~/granny-clicker/
cd ~/granny-clicker

npm i nw@0.114.0-sdk nw-builder -D
npm install-scripts approve nw@0.114.0-sdk
npm install-scripts approve nw-builder@4.18.0
npm rebuild

npm run prod

mkdir -p "/storage/emulated/0/Granny Clicker/dist"
cp ~/granny-clicker/build/package.json ~/granny-clicker/dist/win32
cp ~/granny-clicker/build/package.json ~/granny-clicker/dist/win64
cp ~/granny-clicker/build/package.json ~/granny-clicker/dist/win-arm64
cp ~/granny-clicker/build/package.json ~/granny-clicker/dist/osx64
cp ~/granny-clicker/build/package.json ~/granny-clicker/dist/osx-arm64
cp ~/granny-clicker/build/package.json ~/granny-clicker/dist/linux64
cp ~/granny-clicker/build/package.json ~/granny-clicker/dist/linux-arm64

# "Windows Packages..."

cd ~/granny-clicker/dist/win32
zip -r granny-clicker-v1.0.0-win32.zip .
mv granny-clicker-v1.0.0-win32.zip "/storage/emulated/0/Granny Clicker/dist"

cd ../win64
zip -r granny-clicker-v1.0.0-win64.zip .
mv granny-clicker-v1.0.0-win64.zip "/storage/emulated/0/Granny Clicker/dist"

cd ../win-arm64
zip -r granny-clicker-v1.0.0-win-arm64.zip .
mv granny-clicker-v1.0.0-win-arm64.zip "/storage/emulated/0/Granny Clicker/dist"

# "macOS Packages..."

cd ../osx64
zip -r -y granny-clicker-v1.0.0-osx64.zip .
mv granny-clicker-v1.0.0-osx64.zip "/storage/emulated/0/Granny Clicker/dist"

cd ../osx-arm64
zip -r -y granny-clicker-v1.0.0-osx-arm64.zip .
mv granny-clicker-v1.0.0-osx-arm64.zip "/storage/emulated/0/Granny Clicker/dist"

# "Linux Packages..."

cd ../linux64
tar -czvf granny-clicker-v1.0.0-linux64.tar.gz .
mv granny-clicker-v1.0.0-linux64.tar.gz "/storage/emulated/0/Granny Clicker/dist"

cd ../linux-arm64
tar -czvf granny-clicker-v1.0.0-linux-arm64.tar.gz .
mv granny-clicker-v1.0.0-linux-arm64.tar.gz "/storage/emulated/0/Granny Clicker/dist"

# "=========================================="
# "BUILD FINISHED SUCCESSFULLY!"
# "Files saved in: /storage/emulated/0/Granny Clicker/dist"
# "Package Build:"
# • package_build "win32" "Windows (32-bit)"
# • package_build "win64" "Windows (64-bit)"
# • package_build "win-arm64" "Windows (ARM64)"
# X package_build "osx32" "macOS (x86) (unavailable build)"
# • package_build "osx64" "macOS (x64)"
# • package_build "osx-arm64" "macOS (ARM64)"
# X package_build "linux32" "Linux (32-bit) (unavailable build)"
# • package_build "linux64" "Linux (64-bit)"
# • package_build "linux-arm64" "Linux (ARM64)"
# "=========================================="
read -rp "Press [Enter] to exit..."
