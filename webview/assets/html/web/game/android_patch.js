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
    const currentLangData = window.langData || langData || {};
    const roomName = currentLangData[currentRoomKey] || "Unknown Room";
    let baseText = currentLangData['timer_text'] || "Granny spawned in {room}! She will catch you at {time} seconds";
    
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

async function changeGameLanguage(lang) {
    localStorage.setItem('game_lang', lang);
    if (typeof applyTranslations === 'function') await applyTranslations(lang);
    langData = window.langData || {};
    
    updateCoinsUI();
    document.getElementById('cps-display').innerText = `+${formatNumber(autoCps)} / ${langData['per_second'] || 'sec'}`;
    if (typeof updateSaveSlotsUI === 'function') {
        await updateSaveSlotsUI();
    }
    
    playUiSound('accept');
}

async function loadLangFile(lang) {}

async function initGame() {
    setRandomBackground();
    let savedLang = localStorage.getItem('game_lang');
    if (!savedLang) {
        let browserLang = navigator.language || navigator.userLanguage;
        savedLang = browserLang.startsWith('pl') ? 'pl' : 'en';
    }
    
    if (typeof applyTranslations === 'function') {
        await applyTranslations(savedLang);
    }
    
    if (typeof updateSaveSlotsUI === 'function') {
    	await applyTranslations(savedLang);
    }
    
    langData = window.langData || {};
    
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

window.addEventListener('touchmove', function(e) {
    let isScrollable = e.target.closest('#store-content') || 
                       e.target.closest('#options-content') || 
                       e.target.closest('#store-sidebar') || 
                       e.target.closest('#options-sidebar');
                       e.target.closest('#custom-game-modal');
                       
    if (!isScrollable) {
        e.preventDefault();
    }
}, { passive: false });