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
    if (bgElement) bgElement.style.backgroundImage = `url('../../assets/textures/backgrounds/${chosenArea}/${chosenFile}.webp')`;
}

window.resetGrannyTimer = function() {
    const loc = window.locations[Math.floor(Math.random() * window.locations.length)];
    let baseTime = Math.floor(Math.random() * (loc.max - loc.min + 1)) + loc.min;
    
    timeToCatch = Math.max(1, Math.floor(baseTime / jumpscareSpeedMultiplier));
    initialTimeSet = timeToCatch;
    currentRoomKey = loc.nameKey;

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
};

function triggerGrannyJumpscare() {
    let loss = 0;
    if (granny > 5) {
        loss = granny - (granny / 1.25);
        granny = parseFloat((granny / 1.25).toFixed(2));
    }

    const container = document.getElementById('game-container');
    const flash = document.getElementById('jumpscare-overlay');
    if (container) container.classList.add('shake-animation');
    if (flash) flash.classList.remove('hidden');
    
    playSound(`../../assets/sounds/granny/grannyjumpscare.wav`, 'voices');
    
    setTimeout(() => {
        if (flash) flash.classList.add('hidden');
        if (container) container.classList.remove('shake-animation');
        updateCoinsUI();
        if (loss > 0) createFloatingText(`-${formatNumber(loss)}`, false, null); 
        window.resetGrannyTimer();
    }, 1500);
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

            if (avg < 30 || (varianceSum / clickIntervals.length) < 2) {
                granny = 0;
                updateCoinsUI();
                showNotification(langData['cheat_detected'] || "Auto-clicker detected! Granny sees it!");
                clickIntervals = []; 
                lastClickTime = now;
                return false;
            }
        }
    }
    lastClickTime = now;
    return true;
}

function playGrannyVoice() {
    if (Math.random() >= 0.15) return;
    if (voicePool.length === 0) voicePool = [...voiceFiles];
    
    const chosenVoice = voicePool.splice(Math.floor(Math.random() * voicePool.length), 1)[0];
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

    granny = parseFloat((granny + clickMultiplier).toFixed(2));
    addRankPts(1);
    updateCoinsUI();
    createFloatingText(`+${formatNumber(clickMultiplier)}`, true, event);
    playUiSound('click');
    playGrannyVoice();
}

function startAutoClicker() {
    if (autoClickerInterval) clearInterval(autoClickerInterval);
    autoClickerInterval = setInterval(() => {
        if (autoCps > 0) {
            granny = parseFloat((granny + autoCps).toFixed(2));
            updateCoinsUI();
        }
    }, 1000);
}

async function initGame() {
    setRandomBackground();
    let savedLang = localStorage.getItem('game_lang') || (navigator.language.startsWith('pl') ? 'pl' : 'en');
    
    await loadLangFile(savedLang);
    if (typeof applyTranslations === 'function') applyTranslations(savedLang);
    
    if (typeof updateSaveSlotsUI === 'function') updateSaveSlotsUI();
    
    updateCoinsUI();
    window.resetGrannyTimer();
    startAutoClicker();
}

window.onload = initGame;