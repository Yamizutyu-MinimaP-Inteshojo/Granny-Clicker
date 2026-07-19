function setRandomFavicon() {
    const rand = Math.random();
    let chosenChar = 'granny';
    
    if (rand < 0.05) {
        chosenChar = 'kasane_teto';
    }
    
    const sizes = [16, 24, 32, 48, 64, 96, 128, 256, 512];
    
    const oldIcons = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
    oldIcons.forEach(icon => icon.remove());

    sizes.forEach(size => {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        link.sizes = `${size}x${size}`;
        link.href = `../../assets/textures/ui/icons/${chosenChar}.ico`;
        document.getElementsByTagName('head')[0].appendChild(link);
    });

    const appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    appleIcon.href = `../../assets/textures/ui/icons/${chosenChar}_512.png`;
    document.getElementsByTagName('head')[0].appendChild(appleIcon);
}

setRandomFavicon();
