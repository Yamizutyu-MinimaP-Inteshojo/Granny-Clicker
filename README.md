# ![Game Logo](assets/textures/granny_clicker_logo.png) Granny Clicker

![Granny Clicker v1.0](https://via.placeholder.com/800x120/00FFFF/000000?text=Granny+Clicker+v1.0)
![Version Status](https://via.placeholder.com/800x80/FF8C00/000000?text=STATUS:+RELEASE)
*(Above are the placeholders for your cyan version 1.0 graphic and your orange version name/status graphic)*

## 🎮 What is the game about?
**Granny Clicker** is an addictive, dynamic *incremental/clicker* game with a unique thriller twist based on the popular character Granny[span_0](start_span)[span_0](end_span). Your goal is to click and collect currency (Granny Coins), upgrade your earnings, and avoid the terrifying jumpscare[span_1](start_span)[span_1](end_span).

**Core Mechanics:**
* **Clicking & Upgrades:** Earn coins and purchase multipliers (e.g., 2x more coins per click) and Auto-Clickers[span_2](start_span)[span_2](end_span).
* **Time Pressure (Jumpscare):** Granny has a hidden timer[span_3](start_span)[span_3](end_span). If you are not careful and the timer reaches zero, you will get caught and lose a portion of your collected coins[span_4](start_span)[span_4](end_span).
* **Progression (Coming soon in 1.1):** Player profiles, tiers with ranking points, shop modules, and encrypted password-protected save systems[span_5](start_span)[span_5](end_span).

## 📂 Project Structure
The project is built using a clean web stack (HTML5, CSS3, JS) extended with Windows automation scripts[span_6](start_span)[span_6](end_span). The structure is designed to easily compile the game into a standalone mobile app (.apk) or a PC game (.exe)[span_7](start_span)[span_7](end_span).

```text
📁 Granny-Clicker/
├── 📁 assets/               # Game assets and media files[span_8](start_span)[span_8](end_span)
│   ├── 📁 fonts/            # Custom game typography
│   ├── 📁 lang/             # Language localization files
│   ├── 📁 sounds/           # Audio, ambient background tracks, and Granny's voice lines[span_9](start_span)[span_9](end_span)
│   └── 📁 textures/         # UI elements, backgrounds, and the official game logo[span_10](start_span)[span_10](end_span)
├── 📁 errors/               # Critical error pop-ups and notifications (.vbs files)
├── 📁 web/                  # Web engine files and source code
│   ├── 📁 game/             # Game screen logic and rendering
│   ├── 📁 scripts/          # Auxiliary and helper JavaScript files
│   ├── 📁 styles/           # Layout and design style sheets (.css)
│   └── 📁 title/            # Title/Main Menu screen components
├── 📄 index.html            # Main engine entry point and game interface[span_11](start_span)[span_11](end_span)
├── 📄 launch.cmd            # Windows batch command script to initialize and launch the game
├── 📄 package.json          # Configuration file (e.g., for bundling with NW.js for PC)[span_12](start_span)[span_12](end_span)
└── 📄 README.md             # Project documentation[span_13](start_span)[span_13](end_span)