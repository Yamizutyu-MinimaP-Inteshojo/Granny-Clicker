function exportSaveFile() {
    playUiSound('click');
    const now = new Date();
    const xsfStructure = {
        Header: { 
            game: "Granny Clicker", 
            version: GAME_VERSION, 
            versionKey: `${GAME_VERSION.split('.')[0]}.${GAME_VERSION.split('.')[1]}.x`,
            saveName: document.getElementById('save-name-input') ? document.getElementById('save-name-input').value || (langData['save_default_name'] || "Granny Clicker Save") : (langData['save_default_name'] || "Granny Clicker Save"),
            saveDesc: document.getElementById('save-desc-input') ? document.getElementById('save-desc-input').value || "" : ""
        },
        Body: { granny, clickMultiplier, upgrade2xCost, upgrade2xOwned, upgradeAutoCost, upgradeAutoOwned, autoCps, moduleAuto2xOwned, moduleAuto2xCost, jumpscareSpeedMultiplier, playerProfile, timeToCatch, initialTimeSet, currentRoomKey },
        Data: { timestamp: now.getTime(), dateFormatted: now.toISOString().split('T')[0], timeFormatted: now.toTimeString().split(' ')[0] },
        Additional: { volumes, soundPack, saveSequence: saveSequenceNumber }
    };

    const jsonString = JSON.stringify(xsfStructure);
    let outputString = "RAW:" + btoa(unescape(encodeURIComponent(jsonString)));

    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([outputString], { type: "application/xsf" }));
    a.download = `granny-save_${now.toISOString().split('T')[0]}_${saveSequenceNumber++}.xsf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importSaveFile(event) {
    playUiSound('click');
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.xsf')) {
        showNotification(langData['msg_file_invalid'] || "File isn't in extension .xsf");
        event.target.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const rawContent = e.target.result.trim();
            let jsonString = "";
            let isUnencoded = false;
            
            if (rawContent.startsWith("RAW:")) {
                jsonString = decodeURIComponent(escape(atob(rawContent.replace("RAW:", ""))));
            } else if (rawContent.startsWith("{")) {
                jsonString = rawContent;
                isUnencoded = true;
            } else {
                showNotification(langData['msg_save_corrupted'] || "Save is corrupted");
                event.target.value = "";
                return;
            }
            
            let xsfData;
            try {
                xsfData = JSON.parse(jsonString);
            } catch (err) {
                showNotification(langData['msg_save_corrupted'] || "Save is corrupted");
                event.target.value = "";
                return;
            }
            
            if (!xsfData.Header || !xsfData.Header.game) {
                showNotification(langData['msg_save_corrupted'] || "Save is corrupted");
                event.target.value = "";
                return;
            }

            if (xsfData.Header.game !== "Granny Clicker") {
                showNotification((langData['msg_wrong_game'] || "Save is from {game} not on this game").replace("{game}", xsfData.Header.game));
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
                showNotification((langData['msg_version_higher'] || "The save file is for {saveVer} not {currentVer}").replace("{saveVer}", saveVer).replace("{currentVer}", currentVer));
                event.target.value = "";
                return;
            }
            
            applySaveData(xsfData);

            if (isUnencoded) {
                showNotification(langData['msg_xsf_known'] || "You're know .xsf file, great!");
            } else if (saveVer !== currentVer) {
                showNotification((langData['msg_save_loaded_version'] || "Save loaded successfully but version was {saveVer}").replace("{saveVer}", saveVer));
            } else {
                showNotification(langData['msg_save_loaded'] || "Save loaded successfully");
            }

        } catch (err) {
            showNotification(langData['msg_save_corrupted'] || "Save is corrupted");
        }
        event.target.value = "";
    };

    reader.readAsText(file);
}

function applySaveData(xsfData) {
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
        if (xsfData.Additional.volumes) {
            volumes = xsfData.Additional.volumes;
            if (typeof updateVolumesUI === 'function') updateVolumesUI();
        }
        if (xsfData.Additional.soundPack) {
            soundPack = xsfData.Additional.soundPack;
            if (typeof updateSoundPackUI === 'function') updateSoundPackUI();
        }
    }

    updateCoinsUI();
    updateTimerUI();
    updateProfileUI();
    recalculateAutoCps();
    if (typeof updateSaveSlotsUI === 'function') updateSaveSlotsUI();
}

function getSaveSlots() {
    let slots = localStorage.getItem('granny_save_slots');
    if (!slots) {
        return [null, null, null, null, null];
    }
    try {
        return JSON.parse(slots);
    } catch (e) {
        return [null, null, null, null, null];
    }
}

function saveSlotsToStorage(slots) {
    localStorage.setItem('granny_save_slots', JSON.stringify(slots));
}

function buildCurrentSaveObject(customName, customDesc) {
    const now = new Date();
    return {
        Header: { 
            game: "Granny Clicker", 
            version: GAME_VERSION, 
            versionKey: `${GAME_VERSION.split('.')[0]}.${GAME_VERSION.split('.')[1]}.x`,
            saveName: customName || langData['save_default_name'] || "Granny Clicker Save",
            saveDesc: customDesc || ""
        },
        Body: { granny, clickMultiplier, upgrade2xCost, upgrade2xOwned, upgradeAutoCost, upgradeAutoOwned, autoCps, moduleAuto2xOwned, moduleAuto2xCost, jumpscareSpeedMultiplier, playerProfile, timeToCatch, initialTimeSet, currentRoomKey },
        Data: { timestamp: now.getTime(), dateFormatted: now.toISOString().split('T')[0], timeFormatted: now.toTimeString().split(' ')[0] },
        Additional: { volumes, soundPack }
    };
}

function updateSaveSlotsUI() {
    let slots = getSaveSlots();
    const container = document.getElementById('save-slots-container');
    if (!container) return;
    
    let html = '';
    slots.forEach((slot, index) => {
        let slotTitle = (langData['save_slot_title'] || "Slot {id}").replace("{id}", index + 1);
        let slotDesc = slot && slot.Header && slot.Header.saveName ? slot.Header.saveName : (langData['save_empty_slot'] || "Empty Slot");
        
        html += `
        <div class="save-slot-card" data-slot="${index}">
            <div class="slot-info">
                <span class="slot-title">${slotTitle}</span>
                <span class="slot-desc">${slotDesc}</span>
            </div>
            <div class="slot-actions">
                <button class="slot-action-btn" onclick="handleSlotAction(${index})" title="${langData['btn_save_slot'] || 'Save'}"><img src="../../assets/textures/ui/options/save/save.webp" alt="Save"></button>
                <button class="slot-action-btn" onclick="loadSlot(${index})" title="${langData['btn_load_slot'] || 'Load'}"><img src="../../assets/textures/ui/options/save/load.webp" alt="Load"></button>
                <button class="slot-action-btn" onclick="inspectSlot(${index})" title="${langData['btn_inspect_slot'] || 'Inspect'}"><img src="../../assets/textures/ui/options/save/save_content.webp" alt="Inspect"></button>
                <button class="slot-action-btn" onclick="copySlot(${index})" title="${langData['btn_copy_slot'] || 'Copy'}"><img src="../../assets/textures/ui/options/save/copy.webp" alt="Copy"></button>
                <button class="slot-action-btn" onclick="copyEncryptedSlot(${index})" title="${langData['btn_copy_encrypted'] || 'Copy Encrypted'}"><img src="../../assets/textures/ui/options/save/copy_save_text.webp" alt="Copy Encrypted"></button>
                <button class="slot-action-btn" onclick="pasteEncryptedSlot(${index})" title="${langData['btn_paste_encrypted'] || 'Paste Encrypted'}"><img src="../../assets/textures/ui/options/save/paste_save_text.webp" alt="Paste Encrypted"></button>
                <button class="slot-action-btn" onclick="deleteSlot(${index})" title="${langData['btn_delete_slot'] || 'Delete'}"><img src="../../assets/textures/ui/options/save/delete.webp" alt="Delete"></button>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

function handleSlotAction(slotIndex) {
    playUiSound('click');
    let slots = getSaveSlots();
    
    let defaultSaveName = langData['save_default_name'] || "Granny Clicker Save";
    let namePlaceholderText = langData['save_name_placeholder'] || "Enter save name...";
    let descPlaceholderText = langData['save_desc_placeholder'] || "Enter save description...";
    let modalTitle = (langData['modal_save_title'] || "Save Game to Slot {id}").replace("{id}", slotIndex + 1);

    let contentHTML = `
        <div style="margin-bottom: 12px;">
            <label style="display: block; font-size: 13px; margin-bottom: 4px; color: #ccc;">${langData['label_save_name'] || 'Save Name:'}</label>
            <input type="text" id="custom-save-name" value="${defaultSaveName}" placeholder="${namePlaceholderText}" style="width: 100%; padding: 6px; background: #111; border: 1px solid #cc0000; color: #fff; box-sizing: border-box; font-family: 'Monotype Corsiva', serif; font-size: 18px;">
        </div>
        <div>
            <label style="display: block; font-size: 13px; margin-bottom: 4px; color: #ccc;">${langData['label_save_desc'] || 'Description (optional):'}</label>
            <textarea id="custom-save-desc" placeholder="${descPlaceholderText}" style="width: 100%; padding: 6px; background: #111; border: 1px solid #cc0000; color: #fff; height: 60px; box-sizing: border-box; resize: none; font-family: 'Monotype Corsiva', serif; font-size: 18px;"></textarea>
        </div>
    `;

    showCustomModal(modalTitle, contentHTML, () => {
        let nameInput = document.getElementById('custom-save-name').value.trim() || defaultSaveName;
        let descInput = document.getElementById('custom-save-desc').value.trim();

        if (slots[slotIndex] !== null) {
            showCustomModal(langData['modal_overwrite_title'] || "Overwrite Slot?", `<p>${langData['msg_select_slot_save'] || "Select a slot to save or overwrite your progress:"}</p>`, () => {
                executeSave(slotIndex, nameInput, descInput);
            });
            return false;
        } else {
            executeSave(slotIndex, nameInput, descInput);
        }
    });
}

function executeSave(slotIndex, nameInput, descInput) {
    let slots = getSaveSlots();
    slots[slotIndex] = buildCurrentSaveObject(nameInput, descInput);
    saveSlotsToStorage(slots);
    showNotification((langData['msg_slot_saved'] || "Game progress saved to Slot {id}!").replace("{id}", slotIndex + 1));
    if (typeof updateSaveSlotsUI === 'function') updateSaveSlotsUI();
}

function loadSlot(slotIndex) {
    playUiSound('click');
    let slots = getSaveSlots();
    if (!slots[slotIndex]) {
        showNotification(langData['msg_no_saves'] || "You don't have any saved games!");
        return;
    }
    applySaveData(slots[slotIndex]);
    showNotification((langData['msg_slot_loaded'] || "Game progress loaded from Slot {id}!").replace("{id}", slotIndex + 1));
}

function inspectSlot(slotIndex) {
    playUiSound('click');
    let slots = getSaveSlots();
    let slot = slots[slotIndex];
    if (!slot) {
        showNotification(langData['msg_no_saves'] || "You don't have any saved games!");
        return;
    }
    let h = slot.Header || {};
    let b = slot.Body || {};
    let infoHTML = `
        <div style="font-size: 14px; line-height: 1.6;">
            <p><strong>${langData['inspect_game'] || 'Game'}:</strong> ${h.game || "Granny Clicker"}</p>
            <p><strong>${langData['inspect_version'] || 'Version'}:</strong> ${h.version || "1.0.0"}</p>
            <p><strong>${langData['inspect_coins'] || 'Granny Coins'}:</strong> ${b.granny || 0}</p>
            <p><strong>${langData['inspect_multiplier'] || 'Multiplier'}:</strong> ${b.clickMultiplier || 0}</p>
            <p><strong>${langData['inspect_cps'] || 'Auto CPS'}:</strong> ${b.autoCps || 0}</p>
            <p><strong>${langData['inspect_pts'] || 'PTS'}:</strong> ${b.playerProfile ? b.playerProfile.pts : 0}</p>
            <p><strong>${langData['inspect_desc'] || 'Description'}:</strong> ${h.saveDesc || "-"}</p>
        </div>
    `;
    showCustomModal((langData['inspect_title'] || "Save Slot {id} Details").replace("{id}", slotIndex + 1), infoHTML, null, null);
    let cancelBtn = document.getElementById('modal-cancel-btn');
    if (cancelBtn) cancelBtn.style.display = 'none';
    let acceptBtn = document.getElementById('modal-accept-btn');
    if (acceptBtn) acceptBtn.innerText = langData['btn_ok'] || 'OK';
}

function copySlot(slotIndex) {
    playUiSound('click');
    let slots = getSaveSlots();
    if (!slots[slotIndex]) {
        showNotification(langData['msg_no_saves'] || "You don't have any saved games!");
        return;
    }
    
    let contentHTML = `
        <div style="margin-bottom: 10px;">
            <label style="display: block; font-size: 13px; margin-bottom: 4px; color: #ccc;">${langData['label_target_slot'] || 'Enter target slot number (1-5):'}</label>
            <input type="number" id="copy-target-slot" min="1" max="5" value="1" style="width: 100%; padding: 6px; background: #111; border: 1px solid #cc0000; color: #fff; box-sizing: border-box; font-family: 'Monotype Corsiva', serif; font-size: 18px;">
        </div>
    `;

    showCustomModal(langData['modal_copy_title'] || "Copy Slot", contentHTML, () => {
        let targetVal = document.getElementById('copy-target-slot').value;
        let targetIndex = parseInt(targetVal) - 1;
        if (isNaN(targetIndex) || targetIndex < 0 || targetIndex > 4) {
            showNotification(langData['msg_invalid_slot'] || "Invalid slot number!");
            return;
        }

        slots[targetIndex] = JSON.parse(JSON.stringify(slots[slotIndex]));
        saveSlotsToStorage(slots);
        showNotification((langData['msg_slot_copied'] || "Slot {id} copied to Slot {target}!").replace("{id}", slotIndex + 1).replace("{target}", targetIndex + 1));
        if (typeof updateSaveSlotsUI === 'function') updateSaveSlotsUI();
    });
}

function deleteSlot(slotIndex) {
    playUiSound('click');
    let slots = getSaveSlots();
    if (!slots[slotIndex]) return;
    
    let confirmMsg = (langData['msg_confirm_delete'] || "Are you sure you want to delete Slot {id}?").replace("{id}", slotIndex + 1);
    
    showCustomModal(langData['modal_delete_title'] || "Confirm Deletion", `<p>${confirmMsg}</p>`, () => {
        slots[slotIndex] = null;
        saveSlotsToStorage(slots);
        showNotification((langData['msg_slot_deleted'] || "Slot {id} has been deleted.").replace("{id}", slotIndex + 1));
        if (typeof updateSaveSlotsUI === 'function') updateSaveSlotsUI();
    });
}

function copyEncryptedSlot(slotIndex) {
    playUiSound('click');
    let slots = getSaveSlots();
    if (!slots[slotIndex]) {
        showNotification(langData['msg_no_saves'] || "You don't have any saved games!");
        return;
    }
    let str = "RAW:" + btoa(unescape(encodeURIComponent(JSON.stringify(slots[slotIndex]))));
    navigator.clipboard.writeText(str).then(() => {
        showNotification(langData['msg_encrypted_copied'] || "Encrypted save string copied to clipboard!");
    }).catch(() => {
        showCustomModal(langData['modal_copy_enc_title'] || "Copy Encrypted Save", `<textarea readonly style="width:100%; height:80px; background:#1a1a1a; color:#fff; border:1px solid #555; padding:5px;">${str}</textarea>`, null, null);
        let cancelBtn = document.getElementById('modal-cancel-btn');
        if (cancelBtn) cancelBtn.style.display = 'none';
        let acceptBtn = document.getElementById('modal-accept-btn');
        if (acceptBtn) acceptBtn.innerText = langData['btn_ok'] || 'OK';
    });
}

function pasteEncryptedSlot(slotIndex) {
    playUiSound('click');
    let contentHTML = `
        <div style="margin-bottom: 10px;">
            <label style="display: block; font-size: 13px; margin-bottom: 4px; color: #ccc;">${langData['label_paste_enc'] || 'Paste encrypted save string:'}</label>
            <textarea id="paste-enc-string" style="width: 100%; padding: 6px; background: #111; border: 1px solid #cc0000; color: #fff; 4px; height: 80px; box-sizing: border-box; resize: none; font-family: 'Monotype Corsiva', serif; font-size: 18px;"></textarea>
        </div>
    `;

    showCustomModal(langData['modal_paste_enc_title'] || "Paste Encrypted Save", contentHTML, () => {
        let str = document.getElementById('paste-enc-string').value.trim();
        if (!str) return;
        try {
            let jsonStr = "";
            if (str.startsWith("RAW:")) {
                jsonStr = decodeURIComponent(escape(atob(str.replace("RAW:", ""))));
            } else {
                jsonStr = decodeURIComponent(escape(atob(str)));
            }
            let parsed = JSON.parse(jsonStr);
            let slots = getSaveSlots();
            slots[slotIndex] = parsed;
            saveSlotsToStorage(slots);
            showNotification((langData['msg_encrypted_pasted'] || "Encrypted save successfully pasted and saved to Slot {id}!").replace("{id}", slotIndex + 1));
            if (typeof updateSaveSlotsUI === 'function') updateSaveSlotsUI();
        } catch (e) {
            showNotification(langData['msg_save_corrupted'] || "Save is corrupted");
        }
    });
}