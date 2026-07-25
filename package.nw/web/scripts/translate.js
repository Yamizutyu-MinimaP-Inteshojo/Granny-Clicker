async function applyTranslations(lang) {
    try {
        const response = await fetch(`../../assets/lang/${lang}.json`);
        if (!response.ok) throw new Error();
        const translations = await response.json();

        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[key]) {
                if (element.tagName === 'INPUT' && (element.type === 'button' || element.type === 'submit')) {
                    element.value = translations[key];
                } else {
                    element.innerText = translations[key];
                }
            }
        });
    } catch (e) {
        console.error("Failed to load translations.");
    }
}

async function initTranslations() {
    let lang = localStorage.getItem('game_lang');
    if (!lang) {
        lang = navigator.language || navigator.userLanguage;
        lang = lang.startsWith('pl') ? 'pl' : 'en';
    }
    applyTranslations(lang);
}