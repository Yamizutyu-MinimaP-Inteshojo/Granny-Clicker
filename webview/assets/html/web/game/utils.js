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
    if (!langData || !langData.suffixes) return parseFloat(num.toFixed(2)).toString();
    const thresholds = Object.keys(langData.suffixes).map(k => parseFloat(k)).sort((a, b) => b - a);

    for (let t of thresholds) {
        if (num >= t) {
            let baseValue = num / t;
            let decimals = Math.max(0, 3 - (Math.floor(baseValue).toString().length - 1));
            let val = baseValue.toFixed(decimals);
            let key = `1e+${Math.log10(t)}`;
            let data = langData.suffixes[key];
            
            if (data) {
                let suffix = useFullNames ? data.full : data.symbol;
                const currentLang = localStorage.getItem('game_lang') || 'en';
                return currentLang === 'ja' ? val + suffix : val + (useFullNames ? " " : "") + suffix;
            }
        }
    }
    return parseFloat(num.toFixed(2)).toString();
}

function xorCipher(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}

async function loadLangFile(lang) {
    try {
        const response = await fetch(`../../assets/lang/${lang}.json`);
        if (response.ok) langData = await response.json();
    } catch (e) {}
}