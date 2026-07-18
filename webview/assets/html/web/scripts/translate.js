async function applyTranslations(lang) {
    try {
        let translations;
        if (lang === 'pl') {
            translations = window.plLanguageData;
        } else if (lang === 'ja') {
            translations = window.jaLanguageData;
        } else {
            translations = window.enLanguageData;
        }

        // Jeśli dane nie istnieją, rzucamy błąd (tak jak brak pliku w fetch)
        if (!translations) throw new Error("Language data missing");

        window.langData = translations;
        
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            if (translations[key]) {
                el.innerText = translations[key];
            }
        });

        document.dispatchEvent(new Event('languageChanged'));
        
    } catch (error) {
        console.error("Translation error:", error);
    }
}