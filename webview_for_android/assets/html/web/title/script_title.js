function setRandomBackground() {
    const backgroundData = {
        'attic': [
            'jail',
            'mannequin_room',
            'nursery',
            'special_room',
            'vent_tunnel'
        ],
        'upper_floor': [
            'bathroom',
            'bedroom_1',
            'bedroom_2',
            'bookshelf_old',
            'bookshelf_room',
            'starting_bedroom',
            'walk_in_closet'
        ],
        'ground_floor': [
            'backyard',
            'dining_room',
            'foyer',
            'kitchen',
            'living_room',
            'playhouse',
            'shed',
            'stair_closet',
            'study_room'
        ],
        'basement': [
            'basement_area_tunnel',
            'garage_tunnel',
            'shed_tunnel',
            'basement',
            'dirt_room',
            'garage',
            'sauna'
        ],
        'secret_area': [
            'secret_area_tunnel',
            'hidden_closet',
            'meat_room',
            'secret_area_bottom_floor',
            'secret_area_entrance',
            'secret_area_middle_floor',
            'secret_area_top_floor'
        ],
        'sewer_area': [
            'old_house_closet',
            'sewer_tunnel',
            'old_house_dining_room',
            'old_house_kitchen',
            'sewer_cell',
            'sewer_drain',
            'sewer'
        ],
        'spider_cellar': [
            'pipe_escape',
            'pipe_tunnel',
            'spider_cellar_corridors',
            'spider_cellar_drain_bars',
            'spider_cellar_elevator',
            'spider_cellar_shelf',
            'chest_room',
            'pipe_room',
            'spider_cellar_drain',
            'spider_cellar_tunnel',
            'spider_cellar',
            'wheel_crank_tunnel'
        ]
    };
    
    const areas = Object.keys(backgroundData);
    const chosenArea = areas[Math.floor(Math.random() * areas.length)];
    
    const files = backgroundData[chosenArea];
    const chosenFile = files[Math.floor(Math.random() * files.length)];
    
    const bgElement = document.getElementById('bg');
    bgElement.style.backgroundImage = `url('../../assets/textures/backgrounds/${chosenArea}/${chosenFile}.webp')`;
}

function playClickSound() {
    const clickAudio = new Audio('../../assets/sounds/ui/granny/click.wav');
    clickAudio.volume = 0.6;
    clickAudio.play().catch(() => {});
}

function toggleLangDropdown() {
    playClickSound();
    const dropdown = document.getElementById('lang-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function selectLanguage(lang, event) {
    event.stopPropagation();
    playClickSound();
    localStorage.setItem('game_lang', lang);
    applyTranslations(lang);
    document.getElementById('lang-dropdown').style.display = 'none';
}

function initMenu() {
    setRandomBackground();
    
    let savedLang = localStorage.getItem('game_lang');
    if (!savedLang) {
        let browserLang = navigator.language || navigator.userLanguage;
        savedLang = browserLang.startsWith('pl') ? 'pl' : 'en';
    }
    applyTranslations(savedLang);
    
    document.body.addEventListener('click', () => {
        const music = document.getElementById('menuMusic');
        if (music.paused) {
            music.play().catch(() => {});
        }
    }, { once: true });

    document.addEventListener('click', (e) => {
        const panel = document.getElementById('lang-panel');
        if (!panel.contains(e.target)) {
            document.getElementById('lang-dropdown').style.display = 'none';
        }
    });
}

function startGame() {
    playClickSound();
    setTimeout(() => {
        window.location.href = '../game/game.html';
    }, 150);
}

window.onload = initMenu;

window.addEventListener('touchmove', function(e) {
    let isScrollable = e.target.closest('#store-content') || 
                       e.target.closest('#options-content') || 
                       e.target.closest('#store-sidebar') || 
                       e.target.closest('#options-sidebar');
                       
    if (!isScrollable) {
        e.preventDefault();
    }
}, { passive: false });