let granny = 0;
let clickMultiplier = 0.25;

let upgrade2xCost = 2;
let upgrade2xOwned = 0;

let upgradeAutoCost = 15;
let upgradeAutoOwned = 0;
let autoCps = 0;
let autoClickerInterval = null;

let timeToCatch = 0;
let initialTimeSet = 0;
let grannyTimerInterval = null;
let currentRoomKey = "";

let volumes = {
    music: 0.7,
    ambient: 0.6,
    voices: 0.8,
    clicks: 1.0
};
let soundPack = "granny";

let musicAudio = null;
let ambientAudio = null;
let currentVoiceAudio = null;

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

function setRandomBackground() {
    const backgroundData = {
        'attic': ['jail', 'mannequin_room', 'nursery', 'special_room', 'vent_tunnel'],
        'upper_floor': ['bathroom', 'bedroom_1', 'bedroom_2', 'bookshelf_old', 'bookshelf_room', 'starting_bedroom', 'walk_in_closet'],
        'ground_floor': ['backyard', 'dining_room', 'foyer', 'kitchen', 'living_room', 'playhouse', 'shed', 'stair_closet', 'study_room'],
        'basement': ['basement_area_tunnel', 'garage_tunnel', 'shed_tunnel', 'basement', 'dirt_room', 'garage', 'sauna'],
        'secret_area': ['secret_area_tunnel', 'hidden_closet', 'meat_room', 'secret_area_bottom_floor', 'secret_area_entrance', 'secret_area_middle_floor', 'secret_area_top_floor'],
        'sewer_area': ['old_house_closet', 'sewer_tunnel', 'old_house_dining_room', 'old_house_kitchen', 'sewer_cell', 'sewer_drain', 'sewer'],
        'spider_cellar': ['pipe_escape', 'pipe_tunnel', 'spider_cellar_corridors', 'spider_cellar_drain_bars', 'spider_cellar_elevator', 'spider_cellar_shelf', 'chest_room', 'pipe_room', 'spider_cellar_drain', 'spider_cellar_tunnel', 'spider_cellar', 'wheel_crank_tunnel']
    };
    
    const areas = Object.keys(backgroundData);
    const chosenArea = areas[Math.floor(Math.random() * areas.length)];
    const files = backgroundData[chosenArea];
    const chosenFile = files[Math.floor(Math.random() * files.length)];
    
    const bgElement = document.getElementById('bg');
    bgElement.style.backgroundImage = `url('../../assets/textures/backgrounds/${chosenArea}/${chosenFile}.webp')`;
}