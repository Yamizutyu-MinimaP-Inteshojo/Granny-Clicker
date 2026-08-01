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

function initLoopingAudio() {
    if (!musicAudio) {
        musicAudio = new Audio('../../assets/sounds/music/granny_house.mp3');
        musicAudio.loop = true;
        musicAudio.volume = volumes.music;
    }
    if (!ambientAudio) {
        ambientAudio = new Audio('../../assets/sounds/bg/main.wav');
        ambientAudio.loop = true;
        ambientAudio.volume = volumes.ambient;
    }
    
    musicAudio.play().catch(() => {});
    ambientAudio.play().catch(() => {});
}

function updateChannelVolume(channel, val) {
    let numericalVal = val / 100;
    volumes[channel] = numericalVal;

    const valIndicator = document.getElementById(`val-${channel}`);
    if (valIndicator) valIndicator.innerText = `${val}%`;

    if (channel === 'music' && musicAudio) musicAudio.volume = numericalVal;
    else if (channel === 'ambient' && ambientAudio) ambientAudio.volume = numericalVal;
    else if (channel === 'voices' && currentVoiceAudio) currentVoiceAudio.volume = numericalVal;
}

function playSound(path, channel = 'clicks') {
    const snd = new Audio(path);
    snd.volume = volumes[channel];
    snd.play().catch(() => {});
    return snd;
}

function playUiSound(name) {
    playSound(`../../assets/sounds/ui/${soundPack}/${name}.wav`, 'clicks');
}

function formatNumber(num, useFullNames = false) {
    if (!langData.suffixes) return num.toString();
    const thresholds = Object.keys(langData.suffixes).map(k => parseFloat(k)).sort((a, b) => b - a);

    for (let t of thresholds) {
        if (num >= t) {
            let baseValue = num / t;
            let intPart = Math.floor(baseValue);
            let intLength = intPart.toString().length;
            let decimals = 3 - (intLength - 1);
            if (decimals < 0) decimals = 0;

            let val = baseValue.toFixed(decimals);
            let key = `1e+${Math.log10(t)}`;
            let data = langData.suffixes[key];
            
            if (data) {
                let suffix = useFullNames ? data.full : data.symbol;
                const currentLang = localStorage.getItem('game_lang') || 'en';
                if (currentLang === 'ja') return val + suffix;
                else return val + (useFullNames ? " " : "") + suffix;
            }
        }
    }
    return parseFloat(num.toFixed(2)).toString();
}

function updateCoinsUI() {
    document.getElementById('granny-value').innerText = formatNumber(granny);
    
    const btn2x = document.getElementById('btn-upgrade-2x');
    if (btn2x) {
        if (granny < upgrade2xCost) btn2x.classList.add('disabled');
        else btn2x.classList.remove('disabled');
    }
    
    const btnAuto = document.getElementById('btn-upgrade-auto');
    if (btnAuto) {
        if (granny < upgradeAutoCost) btnAuto.classList.add('disabled');
        else btnAuto.classList.remove('disabled');
    }
}

window.resetGrannyTimer = function() {
    if (window.customJumpscareTime !== undefined && window.customJumpscareTime !== null) {
        timeToCatch = window.customJumpscareTime;
        initialTimeSet = window.customJumpscareTime;
        const loc = window.locations[Math.floor(Math.random() * window.locations.length)];
        currentRoomKey = loc.nameKey;
    } else {
        const loc = window.locations[Math.floor(Math.random() * window.locations.length)];
        timeToCatch = Math.floor(Math.random() * (loc.max - loc.min + 1)) + loc.min;
        initialTimeSet = timeToCatch;
        currentRoomKey = loc.nameKey;
    }

    updateTimerUI();

    if (grannyTimerInterval) clearInterval(grannyTimerInterval);
    grannyTimerInterval = setInterval(() => {
        timeToCatch--;
        updateTimerUI();

        if (timeToCatch <= 0) {
            clearInterval(grannyTimerInterval);
            triggerGrannyJumpscare();
        }
    }, 1000);
}

function updateTimerUI() {
    const roomName = langData[currentRoomKey] || "Unknown Room";
    let baseText = langData['timer_text'] || "Granny spawned in {room}! She will catch you at {time} seconds";
    
    let textElement = document.getElementById('granny-timer-text');
    if (textElement) {
        textElement.innerText = baseText.replace('{room}', roomName).replace('{time}', timeToCatch);
    }

    const fillElement = document.getElementById('granny-progress-fill');
    if (fillElement) {
        const percentage = (timeToCatch / initialTimeSet) * 100;
        fillElement.style.width = `${percentage}%`;
    }
}

function triggerGrannyJumpscare() {
    let loss = 0;
    if (granny > 5) {
        loss = granny - (granny / 1.25);
        granny = granny / 1.25;
        granny = parseFloat(granny.toFixed(2));
    }

    const container = document.getElementById('game-container');
    container.classList.add('shake-animation');

    const flash = document.getElementById('jumpscare-overlay');
    flash.classList.remove('hidden');
    
    playSound(`../../assets/sounds/granny/grannyjumpscare.wav`, 'voices');
    
    setTimeout(() => {
        flash.classList.add('hidden');
        container.classList.remove('shake-animation');
        
        updateCoinsUI();
        
        if (loss > 0) {
            createFloatingText(`-${formatNumber(loss)}`, false, null); 
        }
        window.resetGrannyTimer();
    }, 1500);
}

function createFloatingText(text, isPlus, event = null) {
    const wrapper = document.getElementById('granny-btn-wrapper');
    const fText = document.createElement('div');
    fText.className = `floating-text ${isPlus ? 'plus' : 'minus'}`;
    fText.innerText = text;

    if (event) {
        const rect = wrapper.getBoundingClientRect();
        fText.style.left = `${event.clientX - rect.left}px`;
        fText.style.top = `${event.clientY - rect.top}px`;
    } else {
        fText.style.left = `80px`;
        fText.style.top = `-40px`;
    }

    wrapper.appendChild(fText);
    setTimeout(() => fText.remove(), 800);
}

function showNotification(message) {
    const notif = document.getElementById('notification');
    notif.innerText = message;
    notif.classList.remove('hidden');
    
    playUiSound('notification');
    setTimeout(() => notif.classList.add('hidden'), 3000);
}

function openStore() {
    initLoopingAudio();
    document.getElementById('store-overlay').classList.remove('hidden');
    playUiSound('pause_01');
}

function closeStore() {
    document.getElementById('store-overlay').classList.add('hidden');
    playUiSound('start');
}

function openOptions() {
    initLoopingAudio();
    document.getElementById('options-overlay').classList.remove('hidden');
    playUiSound('pause_01');
}

function closeOptions() {
    document.getElementById('options-overlay').classList.add('hidden');
    playUiSound('start');
}

function switchOptionsTab(tabName) {
    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach(p => p.classList.add('hidden'));
    const buttons = document.querySelectorAll('#options-sidebar .sidebar-item');
    buttons.forEach(b => b.classList.remove('active'));

    document.getElementById(`tab-content-${tabName}`).classList.remove('hidden');
    document.getElementById(`tab-btn-${tabName}`).classList.add('active');
    playUiSound('click');
}

function setSoundPack(pack) {
    soundPack = pack;
    playUiSound('accept');
}

async function changeGameLanguage(lang) {
    localStorage.setItem('game_lang', lang);
    await loadLangFile(lang);
    applyTranslations(lang);
    
    updateCoinsUI();
    document.getElementById('cps-display').innerText = `+${formatNumber(autoCps)} / ${langData['per_second'] || 'sec'}`;
    playUiSound('accept');
}

function buyDoubleCoins() {
    if (granny >= upgrade2xCost) {
        granny -= upgrade2xCost;
        clickMultiplier *= 2;
        upgrade2xOwned++;
        clickMultiplier = parseFloat(clickMultiplier.toFixed(2));
        upgrade2xCost = Math.floor(upgrade2xCost * 3.5);
        
        document.getElementById('upgrade-2x-cost').innerText = formatNumber(upgrade2xCost);
        document.getElementById('upgrade-2x-owned').innerText = upgrade2xOwned;
        updateCoinsUI();
        playUiSound('accept');
    } else {
        const needed = upgrade2xCost - granny;
        let baseMsg = langData['need_more_message'] || '';
        showNotification(baseMsg.replace('{amount}', formatNumber(needed, true)));
        playUiSound('cancel');
    }
}

function buyAutoClicker() {
    if (granny >= upgradeAutoCost) {
        granny -= upgradeAutoCost;
        upgradeAutoOwned++;
        autoCps += 0.1;
        autoCps = parseFloat(autoCps.toFixed(2));
        upgradeAutoCost = Math.floor(upgradeAutoCost * 3.0);
        
        document.getElementById('upgrade-auto-cost').innerText = formatNumber(upgradeAutoCost);
        document.getElementById('upgrade-auto-owned').innerText = upgradeAutoOwned;
        document.getElementById('cps-display').innerText = `+${formatNumber(autoCps)} / ${langData['per_second'] || 'sec'}`;
        
        updateCoinsUI();
        playUiSound('accept');
        startAutoClicker();
    } else {
        const needed = upgradeAutoCost - granny;
        let baseMsg = langData['need_more_message'] || '';
        showNotification(baseMsg.replace('{amount}', formatNumber(needed, true)));
        playUiSound('cancel');
    }
}

function startAutoClicker() {
    if (autoClickerInterval) clearInterval(autoClickerInterval);
    autoClickerInterval = setInterval(() => {
        if (autoCps > 0) {
            granny += autoCps;
            granny = parseFloat(granny.toFixed(2));
            updateCoinsUI();
        }
    }, 1000);
}

function checkAntiCheat() {
    const now = performance.now();
    if (lastClickTime !== 0) {
        const interval = now - lastClickTime;
        clickIntervals.push(interval);
        if (clickIntervals.length > 20) clickIntervals.shift();

        if (clickIntervals.length >= 10) {
            const sum = clickIntervals.reduce((a, b) => a + b, 0);
            const avg = sum / clickIntervals.length;
            let varianceSum = 0;
            clickIntervals.forEach(val => varianceSum += Math.pow(val - avg, 2));
            const variance = varianceSum / clickIntervals.length;

            if (avg < 30 || variance < 2) {
                granny = 0;
                updateCoinsUI();
                showNotification(langData['cheat_detected'] || "Auto-clicker detected! Your finger is moving too unnaturally... Granny sees it!");
                clickIntervals = []; lastClickTime = now;
                return false;
            }
        }
    }
    lastClickTime = now;
    return true;
}

function playGrannyVoice() {
    const rand = Math.random();
    if (rand >= 0.15) return;

    if (voicePool.length === 0) voicePool = [...voiceFiles];
    const randomIndex = Math.floor(Math.random() * voicePool.length);
    const chosenVoice = voicePool.splice(randomIndex, 1)[0];

    if (currentVoiceAudio) {
        currentVoiceAudio.pause();
        currentVoiceAudio.currentTime = 0;
    }

    currentVoiceAudio = new Audio(`../../assets/sounds/granny/${chosenVoice}`);
    currentVoiceAudio.volume = volumes.voices;
    currentVoiceAudio.play().catch(() => {});
}

function clickGranny(event) {
    initLoopingAudio();
    if (!checkAntiCheat()) return;

    granny += clickMultiplier;
    granny = parseFloat(granny.toFixed(2));
    
    updateCoinsUI();
    createFloatingText(`+${formatNumber(clickMultiplier)}`, true, event);
    
    playUiSound('click');
    playGrannyVoice();
}

async function loadLangFile(lang) {
    try {
        const response = await fetch(`../../assets/lang/${lang}.json`);
        if (response.ok) langData = await response.json();
    } catch (e) {}
}

async function initGame() {
    setRandomBackground();
    let savedLang = localStorage.getItem('game_lang');
    if (!savedLang) {
        let browserLang = navigator.language || navigator.userLanguage;
        savedLang = browserLang.startsWith('pl') ? 'pl' : 'en';
    }
    await loadLangFile(savedLang);
    if (typeof applyTranslations === 'function') applyTranslations(savedLang);
    
    updateCoinsUI();
    document.getElementById('upgrade-2x-cost').innerText = formatNumber(upgrade2xCost);
    document.getElementById('upgrade-2x-owned').innerText = upgrade2xOwned;
    document.getElementById('upgrade-auto-cost').innerText = formatNumber(upgradeAutoCost);
    document.getElementById('upgrade-auto-owned').innerText = upgradeAutoOwned;
    
    const cpsDisp = document.getElementById('cps-display');
    if (cpsDisp) cpsDisp.innerText = `+${formatNumber(autoCps)} / ${langData['per_second'] || 'sec'}`;

    window.resetGrannyTimer();
    startAutoClicker();
}

window.onload = initGame;