# ![Game Logo](package.nw/assets/textures/granny_clicker_logo.webp) Granny Clicker

![Version](https://img.shields.io/badge/Version-v1.0.0--Release-cyan)
![Status](https://img.shields.io/badge/Status-Release-orange)

## 🎮 What is the game about?
**Granny Clicker** is an addictive, dynamic *incremental/clicker* game with a unique thriller twist based on the popular character Granny. Your goal is to click and collect currency (Granny Coins), upgrade your earnings, and avoid the terrifying jumpscare.

**Core Mechanics:**
* **Clicking & Upgrades:** Earn coins and purchase multipliers (e.g., 2x more coins per click) and Auto-Clickers.
* **Time Pressure (Jumpscare):** Granny has a hidden timer. If you are not careful and the timer reaches zero, you will get caught and lose a portion of your collected coins.
* **Progression (Coming soon in 1.1):** Player profiles, tiers with ranking points, shop modules, and encrypted password-protected save systems.

## 📂 Project Structure
The project is built using a clean web stack (HTML5, CSS3, JS) extended with Windows automation scripts. The structure is designed to easily compile the game into a standalone mobile app (.apk), a PC game (.exe) or other platforms.

```text
📁 Granny-Clicker/
├── 📁 assets/               # Game assets and media files
│   ├── 📁 fonts/            # Custom game typography
│   ├── 📁 lang/             # Language localization files
│   ├── 📁 sounds/           # Audio, ambient background tracks, and Granny's voice lines
│   └── 📁 textures/         # UI elements, backgrounds, and the official game logo
├── 📁 errors/               # Critical error pop-ups and notifications (.vbs files)
├── 📁 web/                  # Web engine files and source code
│   ├── 📁 game/             # Game screen logic and rendering
│   ├── 📁 scripts/          # Auxiliary and helper JavaScript files
│   ├── 📁 styles/           # Layout and design style sheets (.css)
│   └── 📁 title/            # Title/Main Menu screen components
├── 📄 index.html            # Main engine entry point and game interface
├── 📄 launch.cmd            # Windows batch command script to initialize and launch the game
├── 📄 package.json          # Configuration file (e.g., for bundling with NW.js for PC)
└── 📄 README.md             # Project documentation
```

# 🎮 Supported Platforms & Compatibility Matrix
This document outlines the target platforms, native file package formats, support status, and cross-platform compatibility exceptions for this project.
---
## 📱 Platform Overview
Below is the exhaustive list of supported and targeted operating systems along with their respective native package extensions.
### 1. 📱 Mobile
- [x] ![Android](https://img.shields.io/badge/Android-3DDC84?style=flat-square&logo=android&logoColor=white) **Android** (`.apk`, `.aab`) — *(Tested)*. Standard package output.
- [ ] ![iOS](https://img.shields.io/badge/iOS-000000?style=flat-square&logo=apple&logoColor=white) **iOS** (`.ipa`) — *(Not supported yet...)*
- [ ] ![HarmonyOS](https://img.shields.io/badge/HarmonyOS-000000?style=flat-square&logo=huawei&logoColor=white) **HarmonyOS** (`.hap`, `.apk`) — *(Not supported yet...)*
- [ ] ![KaiOS](https://img.shields.io/badge/KaiOS-6F02B5?style=flat-square&logo=kaios&logoColor=white) **KaiOS** (`.zip` web app packages) — *(Not supported yet...)*
- [ ] ![Sailfish OS](https://img.shields.io/badge/Sailfish_OS-002F6C?style=flat-square&logo=sailfishos&logoColor=white) **Sailfish OS** (`.rpm`) — *(Not supported yet...)*
- [ ] ![Ubuntu Touch](https://img.shields.io/badge/Ubuntu_Touch-E95420?style=flat-square&logo=ubuntu&logoColor=white) **Ubuntu Touch** (`.click`, `.snap`) — *(Not supported yet...)*
- [ ] ![Tizen OS](https://img.shields.io/badge/Tizen-1271B5?style=flat-square&logo=tizen&logoColor=white) **Tizen OS** (`.wgt`, `.tpk`) — *(Not supported yet...)*
- [ ] ![Windows Mobile](https://img.shields.io/badge/Windows_Phone-00ADEF?style=flat-square&logo=windows&logoColor=white) **Windows Phone / Mobile** (`.xap`, `.appx`) — *(Legacy, not supported)*
### 2. 🖥️ Desktop / PC
- [x] ![Windows](https://img.shields.io/badge/Windows-0078D6?style=flat-square&logo=windows&logoColor=white) **Windows** (`.exe`, `.msi`) — *(Tested)*
- [ ] ![macOS](https://img.shields.io/badge/macOS-000000?style=flat-square&logo=apple&logoColor=white) **macOS** (`.dmg`, `.app`, `.pkg`) — *(Built, not tested yet)*
- [ ] ![Linux](https://img.shields.io/badge/Linux-FCC624?style=flat-square&logo=linux&logoColor=black) **Linux** (Binary ELF, `.AppImage`, `.flatpak`, `.snap`) — *(Built, not tested yet)*
- [ ] ![ChromeOS](https://img.shields.io/badge/ChromeOS-4285F4?style=flat-square&logo=googlechrome&logoColor=white) **ChromeOS** (Web Apps / `.apk`, `.deb`) — *(Not supported yet...)*
- [ ] ![BSD](https://img.shields.io/badge/FreeBSD-AB2B28?style=flat-square&logo=freebsd&logoColor=white) **BSD / FreeBSD** (Binary ELF, native `.pkg` / `.tgz`) — *(Not supported yet...)*
- [ ] ![Solaris](https://img.shields.io/badge/Solaris-E01A22?style=flat-square&logo=oracle&logoColor=white) **Solaris / Illumos** (Binary ELF, `.p5p`, `.pkg`) — *(Not supported yet...)*
- [ ] ![Haiku OS](https://img.shields.io/badge/Haiku-336699?style=flat-square&logo=haiku&logoColor=white) **Haiku OS** (`.hpkg`, Binary ELF) — *(Not supported yet...)*
### 3. 🎮 Consoles
- [ ] ![PlayStation](https://img.shields.io/badge/PlayStation-003791?style=flat-square&logo=playstation&logoColor=white) **PlayStation 4 / 5** (`.pkg`) — *(Not supported yet...)*
- [ ] ![Nintendo Switch](https://img.shields.io/badge/Nintendo_Switch-E60012?style=flat-square&logo=nintendoswitch&logoColor=white) **Nintendo Switch** (`.nsp`, `.xci`) — *(Not supported yet...)*
- [ ] ![Xbox](https://img.shields.io/badge/Xbox-107C41?style=flat-square&logo=xbox&logoColor=white) **Xbox One / Series X|S** (`.appx`, `.msixvc`) — *(Not supported yet...)*
- [ ] ![Steam Deck](https://img.shields.io/badge/Steam_Deck-171A21?style=flat-square&logo=steamdeck&logoColor=white) **Steam Deck / SteamOS** (Binary ELF, `.AppImage`, Flatpak) — *(Not supported yet...)*
- [ ] ![PlayStation Vita](https://img.shields.io/badge/PS_Vita-003791?style=flat-square&logo=playstation&logoColor=white) **PlayStation Vita** (`.vpk`) — *(Legacy, not supported)*
- [ ] ![Wii U / 3DS](https://img.shields.io/badge/Nintendo-E60012?style=flat-square&logo=nintendo&logoColor=white) **Nintendo Wii U / 3DS** (`.rpx`, `.cia`) — *(Legacy, not supported)*
### 4. 📺 Smart TV & Streaming Devices
- [ ] ![Android TV](https://img.shields.io/badge/Android_TV-3DDC84?style=flat-square&logo=android&logoColor=white) **Android TV / Google TV** (`.apk`) — *(Not supported yet...)*
- [ ] ![webOS](https://img.shields.io/badge/LG_webOS-A50034?style=flat-square&logo=lg&logoColor=white) **LG webOS** (`.ipk`) — *(Not supported yet...)*
- [ ] ![Tizen TV](https://img.shields.io/badge/Samsung_Tizen-1271B5?style=flat-square&logo=samsung&logoColor=white) **Samsung Tizen TV** (`.wgt`, `.tpk`) — *(Not supported yet...)*
- [ ] ![Fire OS](https://img.shields.io/badge/Fire_TV-FF9900?style=flat-square&logo=amazon&logoColor=white) **Amazon Fire TV** (`.apk`) — *(Not supported yet...)*
- [ ] ![tvOS](https://img.shields.io/badge/tvOS-000000?style=flat-square&logo=apple&logoColor=white) **Apple tvOS** (`.ipa`) — *(Not supported yet...)*
### 5. ⌚ Wearables & Smartwatches
- [ ] ![Wear OS](https://img.shields.io/badge/Wear_OS-4285F4?style=flat-square&logo=wearos&logoColor=white) **Wear OS** (`.apk`) — *(Not supported yet...)*
- [ ] ![watchOS](https://img.shields.io/badge/watchOS-000000?style=flat-square&logo=apple&logoColor=white) **Apple watchOS** (`.ipa`) — *(Not supported yet...)*
- [ ] ![Tizen Watch](https://img.shields.io/badge/Tizen_Watch-1271B5?style=flat-square&logo=samsung&logoColor=white) **Tizen OS Watch** (`.wgt`) — *(Legacy, not supported)*
- [ ] ![Fitbit](https://img.shields.io/badge/Fitbit_OS-00B0B9?style=flat-square&logo=fitbit&logoColor=white) **Fitbit OS** (`.fba`) — *(Legacy, not supported)*
### 6. 🚗 Automotive & Smart Displays
- [ ] ![Android Automotive](https://img.shields.io/badge/Android_Automotive-3DDC84?style=flat-square&logo=android&logoColor=white) **Android Automotive OS** (`.apk`) — *(Not supported yet...)*
### 7. 🌐 Web & Browsers
- [x] ![WebAssembly](https://img.shields.io/badge/WebAssembly-654FF0?style=flat-square&logo=webassembly&logoColor=white) **WebAssembly / HTML5** (`.wasm`, `.js`, `.html`) — *(WebAssembly)*
---
## ⚡ Cross-Platform Compatibility Exceptions Matrix
Even when two operating systems share the same file extension (e.g., `.apk` or `.ipa`), cross-device execution is subject to runtime dependencies, binary ABI matching, and UI target considerations.
The table below describes valid cross-execution scenarios between platforms sharing package formats or binary containers:

| Source Package Format | Source Platform | Target System | Execution Compatibility | Conditions & Architectural Notes |
| :--- | :--- | :--- | :--- | :--- |
| **`.apk`** | Android Phone | **Android TV / Fire TV** | ⚠️ Partial | **Sideloadable.** Requires an external mouse/AirMouse if touch-only UI components are present. |
| **`.apk`** | Android Phone | **Wear OS (Smartwatch)** | ⚠️ Limited | **Sideloadable via ADB.** Execution works, but screen layout will clip on round displays unless responsive. |
| **`.apk`** | Android Phone | **HarmonyOS** | ✅ Native | **Direct support.** Works natively on EMUI/HarmonyOS (excluding HarmonyOS NEXT). |
| **`.apk`** | Android Phone | **ChromeOS** | ✅ Supported | **Native container.** Runs via built-in Android subsystem (ARC++ / ARCVM). |
| **`.ipa` / `.app`** | iOS (iPhone / iPad) | **macOS (Apple Silicon)** | ✅ Native | **Universal Binary.** Runs natively on M-series chips unless blocked by developer settings. |
| **`.ipa`** | iOS (iPhone) | **visionOS / tvOS** | ✅ Supported | Requires build target configured as Universal App in Xcode. |
| **`.exe` / `.msi`** | Windows (x86_64) | **Windows 11 (ARM64)** | ✅ Emulated | Runs seamlessly via Microsoft's built-in x86/x64-to-ARM64 binary translation layer. |
| **`.msix` / `.appx`** | Windows PC | **Xbox One / Series X\ | S** | ✅ Native | Universal Windows Platform (UWP) apps run across both desktop and console. |
| **Binary ELF** | Linux | **FreeBSD** | ⚠️ Emulated | Requires **Linux ABI Emulation** (`linux.ko` kernel module) enabled on FreeBSD. |
| **`.AppImage` / `.flatpak`** | Linux (Ubuntu/Debian) | **Steam Deck / Other Linux** | ✅ Universal | Fully portable. Containers bundle all required system libraries internally. |

---
### 🔍 Architectural Technical Notes
1. **ABI & Instruction Set Alignment:**
   A package compiled for ARM64 (`arm64-v8a`) will fail on `x86_64` targets unless an emulation sub-system is present (such as Rosetta 2 on macOS or ARCVM on ChromeOS).
2. **Android App Bundles (`.aab`):**
   Deployments targeting the Google Play Store use `.aab` to dynamically slice binaries, delivering only target-specific dynamic libraries and resolution assets to end devices.
3. **Portable Linux Packages (`.AppImage`, `.flatpak`):**
   These containers resolve distribution dependency hell by encapsulating `glibc` wrappers and shared object (`.so`) dependencies directly within the execution mount.
   
