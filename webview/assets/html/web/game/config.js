const GAME_VERSION = "1.1.0";

let granny = 0;
let clickMultiplier = 0.25;

let upgrade2xCost = 2;
let upgrade2xOwned = 0;

let upgradeAutoCost = 15;
let upgradeAutoOwned = 0;
let autoCps = 0;
let autoClickerInterval = null;

let moduleAuto2xCost = 500;
let moduleAuto2xOwned = 0;

let timeToCatch = 0;
let initialTimeSet = 0;
let grannyTimerInterval = null;
let currentRoomKey = "";
let jumpscareSpeedMultiplier = 1.0;

let volumes = { music: 0.7, ambient: 0.6, voices: 0.8, clicks: 1.0 };
let soundPack = "granny"; 

let musicAudio = null;
let ambientAudio = null;
let currentVoiceAudio = null;

let playerProfile = { username: "Player", avatar: "granny", pts: 0, tierIndex: 0 };
let tempProfile = { username: "", avatar: "" };

const TIERS = [
    { nameKey: "tier_bronze_0", icon: "../../assets/textures/ui/tiers/bronze/bronze_0.webp", step: 25 },
    { nameKey: "tier_bronze_1", icon: "../../assets/textures/ui/tiers/bronze/bronze_1.webp", step: 25 },
    { nameKey: "tier_bronze_2", icon: "../../assets/textures/ui/tiers/bronze/bronze_2.webp", step: 25 },
    { nameKey: "tier_bronze_3", icon: "../../assets/textures/ui/tiers/bronze/bronze_3.webp", step: 25 },
    { nameKey: "tier_bronze_4", icon: "../../assets/textures/ui/tiers/bronze/bronze_4.webp", step: 25 },
    { nameKey: "tier_silver_5", icon: "../../assets/textures/ui/tiers/silver/silver_5.webp", step: 50 },
];

let lastClickTime = 0;
let clickIntervals = [];

const voiceFiles = ['1.wav', '2.wav', '3.wav', 'laugh_1.wav', 'laugh_2.wav', 'laugh_3.wav', 'laugh_4.wav'];
let voicePool = [];
let langData = {};

window.locations = [
    { nameKey: "loc_basement", min: 35, max: 40 },
    { nameKey: "loc_living_room", min: 30, max: 35 },
    { nameKey: "loc_bedroom_2", min: 40, max: 45 },
    { nameKey: "loc_secret_area", min: 50, max: 60 }
];

let saveSequenceNumber = 1;