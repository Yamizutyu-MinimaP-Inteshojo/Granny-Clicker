function updateModulesUI() {
    const costAuto2x = document.getElementById('module-auto2x-cost');
    const ownedAuto2x = document.getElementById('module-auto2x-owned');
    const btnAuto2x = document.getElementById('btn-module-auto2x');

    if (costAuto2x) costAuto2x.innerText = formatNumber(moduleAuto2xCost);
    if (ownedAuto2x) ownedAuto2x.innerText = moduleAuto2xOwned;
    if (btnAuto2x) btnAuto2x.classList.toggle('disabled', granny < moduleAuto2xCost);
}

function updateCoinsUI() {
    const valueElem = document.getElementById('granny-value');
    if (valueElem) valueElem.innerText = formatNumber(granny);

    const elements = [
        ['upgrade-2x-cost', formatNumber(upgrade2xCost)],
        ['upgrade-2x-owned', upgrade2xOwned],
        ['upgrade-auto-cost', formatNumber(upgradeAutoCost)],
        ['upgrade-auto-owned', upgradeAutoOwned]
    ];
    elements.forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    });

    const btn2x = document.getElementById('btn-upgrade-2x');
    const btnAuto = document.getElementById('btn-upgrade-auto');
    if (btn2x) btn2x.classList.toggle('disabled', granny < upgrade2xCost);
    if (btnAuto) btnAuto.classList.toggle('disabled', granny < upgradeAutoCost);

    updateModulesUI();
}

function updateTimerUI() {
    const roomName = langData[currentRoomKey] || "Unknown Room";
    let baseText = langData['timer_text'] || "Granny spawned in {room}! She will catch you at {time} seconds";
    let textElement = document.getElementById('granny-timer-text');
    if (textElement) textElement.innerText = baseText.replace('{room}', roomName).replace('{time}', timeToCatch);

    const fillElement = document.getElementById('granny-progress-fill');
    if (fillElement) fillElement.style.width = `${Math.max(0, Math.min(100, (timeToCatch / initialTimeSet) * 100))}%`;
}

function createFloatingText(text, isPlus, event = null) {
    const wrapper = document.getElementById('granny-btn-wrapper');
    if (!wrapper) return;

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
    if (notif) {
        notif.innerText = message;
        notif.classList.remove('hidden');
        setTimeout(() => notif.classList.add('hidden'), 3000);
    }
    playUiSound('notification');
}

function openStore() { initLoopingAudio(); toggleOverlay('store-overlay', true); playUiSound('pause_01'); }
function closeStore() { toggleOverlay('store-overlay', false); playUiSound('start'); }
function openOptions() { initLoopingAudio(); toggleOverlay('options-overlay', true); playUiSound('pause_01'); }
function closeOptions() { toggleOverlay('options-overlay', false); playUiSound('start'); }
function openProfile() { initLoopingAudio(); tempProfile = { ...playerProfile }; toggleOverlay('profile-overlay', true); updateProfileUI(); playUiSound('pause_01'); }
function closeProfile() { toggleOverlay('profile-overlay', false); playUiSound('start'); }

function toggleOverlay(id, show) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', !show);
}

function switchOptionsTab(tabName) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('#options-sidebar .sidebar-item').forEach(b => b.classList.remove('active'));

    const content = document.getElementById(`tab-content-${tabName}`);
    const btn = document.getElementById(`tab-btn-${tabName}`);
    if (content) content.classList.remove('hidden');
    if (btn) btn.classList.add('active');
    playUiSound('click');
}

async function changeGameLanguage(lang) {
    localStorage.setItem('game_lang', lang);
    await loadLangFile(lang);
    if (typeof applyTranslations === 'function') applyTranslations(lang);
    
    updateCoinsUI();
    const cpsDisp = document.getElementById('cps-display');
    if (cpsDisp) cpsDisp.innerText = `+${formatNumber(autoCps)} / ${langData['per_second'] || 'sec'}`;
    playUiSound('accept');
}

function buyDoubleCoins() {
    if (granny >= upgrade2xCost) {
        granny -= upgrade2xCost;
        clickMultiplier = parseFloat((clickMultiplier * 2).toFixed(2));
        upgrade2xOwned++;
        upgrade2xCost = Math.floor(upgrade2xCost * 3.5);
        updateCoinsUI();
        playUiSound('accept');
    } else {
        showNotification((langData['need_more_message'] || '').replace('{amount}', formatNumber(upgrade2xCost - granny, true)));
        playUiSound('cancel');
    }
}

function buyAutoClicker() {
    if (granny >= upgradeAutoCost) {
        granny -= upgradeAutoCost;
        upgradeAutoOwned++;
        autoCps = parseFloat((autoCps + 0.1).toFixed(2));
        upgradeAutoCost = Math.floor(upgradeAutoCost * 3.0);
        
        const cpsDisp = document.getElementById('cps-display');
        if (cpsDisp) cpsDisp.innerText = `+${formatNumber(autoCps)} / ${langData['per_second'] || 'sec'}`;
        
        updateCoinsUI();
        playUiSound('accept');
        startAutoClicker();
    } else {
        showNotification((langData['need_more_message'] || '').replace('{amount}', formatNumber(upgradeAutoCost - granny, true)));
        playUiSound('cancel');
    }
}

function buyModuleAuto2x() {
    if (granny >= moduleAuto2xCost) {
        granny -= moduleAuto2xCost;
        moduleAuto2xOwned++;
        moduleAuto2xCost = Math.floor(moduleAuto2xCost * 2.5);
        if (jumpscareSpeedMultiplier === 1.0) jumpscareSpeedMultiplier = 1.25;

        updateCoinsUI();
        recalculateAutoCps();
        playUiSound('accept');
    } else {
        showNotification((langData['need_more_message'] || '').replace('{amount}', formatNumber(moduleAuto2xCost - granny, true)));
        playUiSound('cancel');
    }
}

function recalculateAutoCps() {
    let baseCps = upgradeAutoOwned * 0.1;
    if (moduleAuto2xOwned > 0) baseCps *= Math.pow(2, moduleAuto2xOwned);
    autoCps = parseFloat(baseCps.toFixed(2));
    
    const cpsDisp = document.getElementById('cps-display');
    if (cpsDisp) cpsDisp.innerText = `+${formatNumber(autoCps)} / ${langData['per_second'] || 'sec'}`;
}

function updateProfileUI() {
    const setElem = (id, prop, val) => { const el = document.getElementById(id); if (el) el[prop] = val; };
    
    setElem('top-bar-username', 'innerText', playerProfile.username);
    setElem('top-bar-avatar', 'src', `../../assets/textures/ui/profile/${playerProfile.avatar}.webp`);
    
    setElem('profile-avatar-current', 'src', `../../assets/textures/ui/profile/${tempProfile.avatar || playerProfile.avatar}.webp`);
    setElem('profile-name-input', 'value', tempProfile.username || playerProfile.username);

    const isMax = playerProfile.tierIndex >= TIERS.length - 1;
    const currentTier = TIERS[playerProfile.tierIndex];
    
    setElem('rank-icon', 'src', currentTier.icon);
    setElem('rank-name-text', 'innerText', langData[currentTier.nameKey] || currentTier.nameKey);

    const pct = isMax ? 100 : Math.floor((playerProfile.pts / currentTier.step) * 100);
    setElem('pts-value-text', 'innerText', isMax ? "MAX" : `${playerProfile.pts} / ${currentTier.step} PTS`);
    setElem('rank-percent-text', 'innerText', isMax ? "MAX" : `${pct}%`);
    
    const rankFill = document.getElementById('rank-progress-fill');
    if (rankFill) rankFill.style.width = `${pct}%`;
}

function switchStoreTab(tab) {
    playUiSound('click');
    const isUpgrades = tab === 'upgrades';
    
    const upgradesList = document.getElementById('upgrades-list');
    const modulesList = document.getElementById('modules-list');
    if (upgradesList) upgradesList.classList.toggle('hidden', !isUpgrades);
    if (modulesList) modulesList.classList.toggle('hidden', isUpgrades);

    const tabBtnUpgrades = document.getElementById('tab-btn-upgrades');
    const tabBtnModules = document.getElementById('tab-btn-modules');
    if (tabBtnUpgrades) tabBtnUpgrades.classList.toggle('active', isUpgrades);
    if (tabBtnModules) tabBtnModules.classList.toggle('active', !isUpgrades);
}

function toggleAvatarDropdown() {
    playUiSound('click');
    const menu = document.getElementById('avatar-dropdown-menu');
    if (menu) menu.classList.toggle('hidden');
}

function selectAvatar(name) {
    playUiSound('click');
    tempProfile.avatar = name;
    const currentAvatar = document.getElementById('profile-avatar-current');
    if (currentAvatar) currentAvatar.src = `../../assets/textures/ui/profile/${name}.webp`;
    
    const menu = document.getElementById('avatar-dropdown-menu');
    if (menu) menu.classList.add('hidden');
}

function saveProfileChanges() {
    playUiSound('accept');
    const nameInput = document.getElementById('profile-name-input');
    if (nameInput && nameInput.value.trim().length > 0) tempProfile.username = nameInput.value.trim();
    
    playerProfile = { ...tempProfile };
    updateProfileUI();
    closeProfile();
    showNotification(langData['profile_saved_message'] || 'Profile saved successfully!');
}

function addRankPts(amount) {
    if (playerProfile.tierIndex >= TIERS.length - 1) return;
    
    playerProfile.pts += amount;
    let currentTier = TIERS[playerProfile.tierIndex];
    
    while (playerProfile.pts >= currentTier.step && playerProfile.tierIndex < TIERS.length - 1) {
        playerProfile.pts -= currentTier.step;
        playerProfile.tierIndex++;
        currentTier = TIERS[playerProfile.tierIndex];
        
        let translatedTierName = langData[currentTier.nameKey] || currentTier.nameKey;
        let rankUpMsg = langData['rank_up_message'] || 'Rank Up! New Tier: {rank}';
        
        showNotification(rankUpMsg.replace('{rank}', translatedTierName));
    }
    updateProfileUI();
}

function setSoundPack(pack) {
    soundPack = pack;
    updateSoundPackUI();
    playUiSound('accept');
}

function updateSoundPackUI() {
    const radios = document.getElementsByName('soundpack');
    radios.forEach(radio => {
        radio.checked = (radio.value === soundPack);
    });
}

function exportSaveFile() {
    const passwordInput = document.getElementById('save-password-input');
    const password = passwordInput ? passwordInput.value : '';
    const now = new Date();

    const xsfStructure = {
        Header: { game: "Granny Clicker", version: GAME_VERSION, versionKey: `${GAME_VERSION.split('.')[0]}.${GAME_VERSION.split('.')[1]}.x` },
        Body: { granny, clickMultiplier, upgrade2xCost, upgrade2xOwned, upgradeAutoCost, upgradeAutoOwned, autoCps, moduleAuto2xOwned, moduleAuto2xCost, jumpscareSpeedMultiplier, playerProfile, timeToCatch, initialTimeSet, currentRoomKey },
        Data: { timestamp: now.getTime(), dateFormatted: now.toISOString().split('T')[0], timeFormatted: now.toTimeString().split(' ')[0] },
        Additional: { volumes, soundPack, saveSequence: saveSequenceNumber }
    };

    const jsonString = JSON.stringify(xsfStructure);
    let outputString = password ? "ENC:" + btoa(unescape(encodeURIComponent(xorCipher(jsonString, password)))) : "RAW:" + btoa(unescape(encodeURIComponent(jsonString)));

    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([outputString], { type: "application/xsf" }));
    a.download = `granny-save_${now.toISOString().split('T')[0]}_${saveSequenceNumber++}.xsf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importSaveFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.xsf')) {
        alert("File isn't in extension .xsf");
        event.target.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const rawContent = e.target.result.trim();
            let jsonString = "";
            let isUnprefixed = false;
            
            if (rawContent.startsWith("ENC:")) {
                const passwordInput = document.getElementById('save-password-input');
                let password = passwordInput ? passwordInput.value : prompt("This file is password-protected. Enter password:");
                if (!password) {
                    event.target.value = "";
                    return;
                }

                try {
                    jsonString = xorCipher(decodeURIComponent(escape(atob(rawContent.substring(4)))), password);
                } catch (err) {
                    alert("Wrong password");
                    event.target.value = "";
                    return;
                }
            } else if (rawContent.startsWith("RAW:")) {
                jsonString = decodeURIComponent(escape(atob(rawContent.replace("RAW:", ""))));
            } else if (rawContent.startsWith("{")) {
                jsonString = rawContent;
                isUnencoded = true;
            } else {
                alert("Save is corrupted");
                event.target.value = "";
                return;
            }
            
            let xsfData;
            try {
                xsfData = JSON.parse(jsonString);
            } catch (err) {
                if (rawContent.startsWith("ENC:")) {
                    alert("Wrong password");
                } else {
                    alert("Save is corrupted");
                }
                event.target.value = "";
                return;
            }
            
            if (!xsfData.Header || !xsfData.Header.game) {
                alert("Save is corrupted");
                event.target.value = "";
                return;
            }

            if (xsfData.Header.game !== "Granny Clicker") {
                alert(`Save is from ${xsfData.Header.game} not on this game`);
                event.target.value = "";
                return;
            }
            
            const currentVer = GAME_VERSION;
            const saveVer = xsfData.Header.version || "1.0.0";

            const parseVer = (v) => v.split('.').map(Number);
            const [cMajor, cMinor, cPatch] = parseVer(currentVer);
            const [sMajor, sMinor, sPatch] = parseVer(saveVer);

            let isHigher = false;
            if (sMajor > cMajor) isHigher = true;
            else if (sMajor === cMajor && sMinor > cMinor) isHigher = true;
            else if (sMajor === cMajor && sMinor === cMinor && sPatch > cPatch) isHigher = true;

            if (isHigher) {
                alert(`The save file is for ${saveVer} not ${currentVer}`);
                event.target.value = "";
                return;
            }
            
            const body = xsfData.Body || {};
            granny = body.granny || 0;
            clickMultiplier = body.clickMultiplier || 0.25;
            upgrade2xCost = body.upgrade2xCost || 2;
            upgrade2xOwned = body.upgrade2xOwned || 0;
            upgradeAutoCost = body.upgradeAutoCost || 15;
            upgradeAutoOwned = body.upgradeAutoOwned || 0;
            autoCps = body.autoCps || 0;
            moduleAuto2xOwned = body.moduleAuto2xOwned || 0;
            moduleAuto2xCost = body.moduleAuto2xCost || 500;
            jumpscareSpeedMultiplier = body.jumpscareSpeedMultiplier || 1.0;
            timeToCatch = body.timeToCatch || 30;
            initialTimeSet = body.initialTimeSet || 30;
            if (body.currentRoomKey) currentRoomKey = body.currentRoomKey;
            if (body.playerProfile) playerProfile = body.playerProfile;
            
            if (xsfData.Additional) {
                if (xsfData.Additional.volumes) volumes = xsfData.Additional.volumes;
                if (xsfData.Additional.soundPack) soundPack = xsfData.Additional.soundPack;
            }

            updateCoinsUI();
            updateTimerUI();
            updateProfileUI();
            recalculateAutoCps();

            if (isUnencoded) {
                alert("You're know .xsf file, great!");
            } else if (saveVer !== currentVer) {
                alert(`Save loaded successfully but version was ${saveVer}`);
            } else {
                alert("Save loaded successfully");
            }

        } catch (err) {
            alert("Save is corrupted");
        }
        event.target.value = "";
    };

    reader.readAsText(file);
}