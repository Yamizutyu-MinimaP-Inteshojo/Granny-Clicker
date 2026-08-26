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

function updateVolumesUI() {
    
    const channels = ['music', 'ambient', 'voices', 'clicks'];
    
    channels.forEach(channel => {
        let rawValue = volumes[channel] !== undefined ? volumes[channel] : 1.0;
        
        let percentValue = rawValue <= 1 ? Math.round(rawValue * 100) : Math.round(rawValue);
        
        const input = document.querySelector(`input[type="range"][oninput*="${channel}"]`);
        if (input) {
            input.value = percentValue;
        }
        
        const span = document.getElementById(`val-${channel}`);
        if (span) {
            span.textContent = percentValue + '%';
        }
    });
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
function openOptions() { initLoopingAudio(); toggleOverlay('options-overlay', true); playUiSound('pause_01'); updateSaveSlotsUI(); }
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
    
    if (typeof updateSaveSlotsUI === 'function') updateSaveSlotsUI();
        
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

function showCustomModal(title, contentHTML, onAccept, onCancel) {
    if (typeof playUiSound === 'function') playUiSound('click');
    
    let existingModal = document.getElementById('custom-game-modal');
    if (existingModal) existingModal.remove();

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'custom-game-modal';

    modalOverlay.innerHTML = `
        <div class="custom-modal-box">
            <h3>${title}</h3>
            <div class="custom-modal-body">
                ${contentHTML}
            </div>
            <div class="custom-modal-buttons">
                <button id="modal-cancel-btn" class="custom-modal-btn">${langData['btn_cancel'] || 'Cancel'}</button>
                <button id="modal-accept-btn" class="custom-modal-btn accept">${langData['btn_accept'] || 'Accept'}</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    document.getElementById('modal-cancel-btn').onclick = () => {
        if (typeof playUiSound === 'function') playUiSound('cancel');
        modalOverlay.remove();
        if (onCancel) onCancel();
    };

    document.getElementById('modal-accept-btn').onclick = () => {
        if (typeof playUiSound === 'function') playUiSound('accept');
        const inputs = modalOverlay.querySelectorAll('input, select, textarea');
        let formData = {};
        inputs.forEach(input => {
            if (input.id || input.name) {
                formData[input.id || input.name] = input.value;
            }
        });

        if (onAccept && onAccept(formData) === false) return;
        modalOverlay.remove();
    };
}