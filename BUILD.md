# 🛠️ Granny Clicker – Compilation & Build Guide

This document contains step-by-step instructions on how to compile and build **Granny Clicker** for both **Android** and **Windows (PC)** platforms.

---

## 📱 1. How to Build for Android (Mobile)

To build the mobile version of the game directly on your Android device using the **WebView App Builder** application, follow these steps:

### Prerequisites:
* An Android device with **WebView App Builder** installed from the Google Play Store.

### Step-by-Step Guide:
1. **Prepare the configuration file:** 
   * Go inside the `webview_for_android/` folder.
   * Copy all assets from the game to `webview_for_android/assets/html/assets/`. The resulting path must be `webview_for_android/assets/html/assets/`. If you miss one level of the nested `assets/` directory, the game engine will fail to resolve asset paths...
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

> ⚠️ **Warning:** You can also export and modify the full source code, but this requires fixing complex Java errors manually inside Android Studio. **We strongly recommend NOT doing this** unless you are an advanced developer. Stick to the automated WebView App Builder method instead!

---

## 💻 2. How to Build for Windows, MacOS & Linux (PC)

To convert the web stack into a standalone application (`.exe, .app, .elf`), you have one main options.

### Configuration (`package.json`)
Before building, ensure you have a `package.json` file in your root directory. It should look like this:
```json
{
  "name": "granny-clicker",
  "version": "'version'",
  "main": "index.html",
  "window": {
    "title": "Granny Clicker",
    "width": 1280,
    "height": 720,
    "frame": true,
    "resizable": true,
    "position": "center",
  }
}
```
**Note:** Keep **resizable: true** so players can scale the window.

### Method:
1. **Method A:**
   * Watch this tutorial [here](https://youtu.be/5UsGnjPYxLU?is=N8hQup3vKo0XF2uW).
   * Sorry that I can't write here but this is the only way to build a game in Windows, MacOS and Linux at the same time in e.g. Windows.

---

## 🍏 🎮 📺 3. Other Platforms (iOS, Consoles, TV & Watches)

Currently, the official build pipelines are only documented and tested for **Android (Mobile)** and **Windows, MacOS & Linux (PC)**. 

Since the main developer does not own devices running **MacOS, iOS**, we are currently unable to officially build, configure, and test WebView or native runtime setups for these operating systems. 

### Community Help & Video Tutorials Wanted!
If you manage to successfully build the game for any of these alternative platforms, **please consider recording a short video tutorial/guide** showing how you did it, and open a Pull Request! We would love to link your video and instructions here to help other players.

### What about other platforms?
* **iOS:** You will need to wrap the source code using a native iOS WebView solution (such as Swift's `WKWebView` or Apache Cordova) inside Xcode.
* **Smart TVs & Android Watches:** Since many modern TVs (Android TV / Google TV) and Smart Watches (Wear OS) run on Android, the WebView App Builder configuration can be adapted to target these devices. Additionally, Samsung (Tizen) and LG (webOS) TVs natively support HTML5/JS apps, making a TV port highly feasible!
* **Xbox (One, Series X/S):** Microsoft supports UWP (Universal Windows Platform) apps. By using wrapper frameworks like Apache Cordova, the HTML5/JS source code can be bundled into an `.appx` package and deployed directly to an Xbox running in Developer Mode.
* **PlayStation 3 & PlayStation 4:** We are highly interested in homebrew ports! Both consoles use WebKit-based systems. Through homebrew exploits (CFW/HEN for PS3, Jailbreak for PS4), advanced developers can launch the game via internal browser structures or compile it into standalone `.pkg` applications.
* **Nintendo Switch:** Custom homebrew solutions on the Switch can run embedded web environments, allowing the clicker mechanics to run on the go via homebrew wrappers or browser launchers.

*Contributions, test results, custom build scripts, video guides, and platform tutorials are more than welcome! Help us bring Granny Clicker everywhere – from computers and phones to home consoles, TVs, and wristwatches!*
