# 🛠️ Granny Clicker – Compilation & Build Guide

This document contains step-by-step instructions on how to compile and build **Granny Clicker** for both **Android** and **Windows (PC)** platforms.

---

## 📱 1. How to Build for Android (Mobile)

To build the mobile version of the game directly on your Android device using the **WebView App Builder** application, follow these steps:

### Prerequisites:
* An Android device with **WebView App Builder** installed from the Google Play Store.

### Step-by-Step Guide:
1. **Prepare the configuration file:** 
   * Go inside the `webview` folder.
   * Copy all assets from the game to `webview/assets/html/assets/`. The resulting path must be `webview/assets/html/assets/`. If you miss one level of the nested `assets/` directory, the game engine will fail to resolve asset paths...
   * Select **all the files inside this folder** (do NOT zip the folder itself, only its raw contents) and compress them into a standard `.zip` archive.
   * Rename the file extension of your newly created archive from `.zip` to **`.webviewproject`**.
2. **Import into the app:**
   * Open WebView App Builder on your phone, go to the **Projects** tab, and click **Import**.
   * Select your `.webviewproject` file. 
   * *Troubleshooting:* If the project does not appear after importing, double-check if you accidentally zipped the parent folder instead of selecting its internal contents.
3. **Compile the application:**
   * Click on your imported project within the app and select the option related to **Zip/APK/AAB**.
   * When the compilation window pops up, click on **APK** and wait for the process to finish.
4. **Locate your APK:** Once completed, the application automatically saves your compiled standalone mobile game in your device's internal storage under:
   `Download/WebViewBuilder/APK/`

> ⚠️ **Warning:** You can also export and modify the full source code, but this requires fixing complex Java errors manually inside Android Studio. **We strongly recommend NOT doing this** unless you are an advanced developer. Stick to the automated WebView App Builder method instead! And due WebView security CORS, we recommend to download from android branch in this this repository.

---

## 💻 2. How to Build for Windows (PC)

To convert the web stack into a standalone Windows executable (`.exe`), you have two main options. We recommend using **NW.js** with **Web2Executable** to secure your source code while keeping heavy assets outside the executable.

### Configuration (`package.json`)
Before building, ensure you have a `package.json` file in your root directory. It should look like this:
```json
{
  "name": "granny-clicker",
  "version": "1.0.0",
  "main": "index.html",
  "window": {
    "title": "Granny Clicker",
    "width": 1280,
    "height": 720,
    "frame": true,
    "resizable": true,
    "position": "center",
  },
  "//1": "In main you can use index.html or web/title/title.html, but DO NOT choose game.html!"
}
```
**Note:** Keep **resizable: true** so players can scale the window, and ensure the `.ico` file exists for Windows compatibility.

### Methods:
1. **Method A: Automated via **Web2Executable** (Recommended)** 
   * Download and run **Web2Executable** on your PC.
   * Select your main project folder (the one containing **`index.html`** and **`package.json`**) as the source.
   * Choose **Windows** as your target platform.
   * Click **Export/Build**. The program will automatically fetch the required NW.js binaries, package your code into a internal **`.nw`** structure, and compile it into a single executable.
2. **Method B: Keeping or not `assets/` outside the EXE (Manual Pro Method)**
   * **Package your source code:** Select only your code files (`index.html`, `package.json`, and the `web/` folder). DO NOT include or include the `assets/` folder.
   * **Create the package:** Compress these selected files into a `.zip` archive and rename it to **`package.nw`**.
   * **Merge with NW.js:** Download the official **NW.js** runtime for **Windows (x64)** and place your `package.nw` next to `nw.exe`. **Open Command Prompt (CMD)** in that directory and run:
```cmd
copy /b nw.exe+package.nw GrannyClicker.exe
```
   * **Final Directory Assembly:** Leave the structure as you see it. You can delete `nw.exe`, `swift...` folder, `credits.html` and `vulkan...`, but we recommend not to do this.
**Note:** If the assets don't load, you must changing paths for assets. You must use **Resource Hacker** to change icon, name, manifest and more.

---

## 🍏 🐧 🎮 📺 3. Other Platforms (iOS, macOS, Linux, Consoles, TV & Watches)

Currently, the official build pipelines are only documented and tested for **Android (Mobile)** and **Windows (PC)**. 

Since the main developer does not own devices running **macOS, iOS, or Linux**, we are currently unable to officially build, configure, and test WebView or native runtime setups for these operating systems. 

### Community Help & Video Tutorials Wanted!
If you manage to successfully build the game for any of these alternative platforms, **please consider recording a short video tutorial/guide** showing how you did it, and open a Pull Request! We would love to link your video and instructions here to help other players.

### What about other platforms?
* **macOS / Linux / Steam Deck:** You can easily adapt **Method A or B from the Windows guide** by downloading the corresponding macOS or Linux x64 binaries from the official [NW.js website](https://nwjs.io/). Since the Steam Deck runs on SteamOS (Linux), the Linux binary will allow the game to run perfectly in Desktop Mode or as a non-Steam game shortcut!
* **iOS:** You will need to wrap the source code using a native iOS WebView solution (such as Swift's `WKWebView` or Apache Cordova) inside Xcode.
* **Smart TVs & Android Watches:** Since many modern TVs (Android TV / Google TV) and Smart Watches (Wear OS) run on Android, the WebView App Builder configuration can be adapted to target these devices. Additionally, Samsung (Tizen) and LG (webOS) TVs natively support HTML5/JS apps, making a TV port highly feasible!
* **Xbox (One, Series X/S):** Microsoft supports UWP (Universal Windows Platform) apps. By using wrapper frameworks like Apache Cordova, the HTML5/JS source code can be bundled into an `.appx` package and deployed directly to an Xbox running in Developer Mode.
* **PlayStation 3 & PlayStation 4:** We are highly interested in homebrew ports! Both consoles use WebKit-based systems. Through homebrew exploits (CFW/HEN for PS3, Jailbreak for PS4), advanced developers can launch the game via internal browser structures or compile it into standalone `.pkg` applications.
* **Nintendo Switch:** Custom homebrew solutions on the Switch can run embedded web environments, allowing the clicker mechanics to run on the go via homebrew wrappers or browser launchers.

*Contributions, test results, custom build scripts, video guides, and platform tutorials are more than welcome! Help us bring Granny Clicker everywhere – from computers and phones to home consoles, TVs, and wristwatches!*