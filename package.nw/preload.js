const path = require('path');
const fs = require('fs');

(function(){
  try {
    const exePath = path.dirname(process.execPath || process.argv[0]);
    const candidate = path.join(exePath, 'assets');
    if (fs.existsSync(candidate)) {
      global.ASSET_BASE = 'file://' + candidate.replace(/\\/g, '/') + '/';
    } else {
      global.ASSET_BASE = './assets/';
    }
  } catch (e) {
    global.ASSET_BASE = './assets/';
  }
  
  window.ASSET_BASE = global.ASSET_BASE;
})();
