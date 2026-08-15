window.addEventListener('touchmove', function(e) {
    let isScrollable = e.target.closest('#store-content') || 
                       e.target.closest('#options-content') || 
                       e.target.closest('#store-sidebar') || 
                       e.target.closest('#options-sidebar');
                       
    if (!isScrollable) {
        e.preventDefault();
    }
}, { passive: false });

async function changeGameLanguage(lang) {
    localStorage.setItem('game_lang', lang);
    if (typeof applyTranslations === 'function') await applyTranslations(lang);
    langData = window.langData || {};

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
    
    langData = window.langData || {};