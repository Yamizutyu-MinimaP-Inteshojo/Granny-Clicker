(function(){
  try {
    if (typeof require === 'function') {
      const path = require('path');
      const fs = require('fs');
      const exeDir = path.dirname(process.execPath || process.argv[0] || '.');
      const candidate = path.join(exeDir, 'assets');
      if (fs.existsSync(candidate)) {
        window.ASSET_BASE = 'file://' + candidate.replace(/\\/g, '/') + '/';
      }
    }
  } catch(e) {
  }
  if (!window.ASSET_BASE) window.ASSET_BASE = './assets/';

  window.ASSET_BASE = window.ASSET_BASE.replace(/\\/g,'/');
  if (!window.ASSET_BASE.endsWith('/')) window.ASSET_BASE += '/';

  window.getAsset = function(p){
    return window.ASSET_BASE + p.replace(/^(\.\.\/)+/, '').replace(/^assets\//, '');
  };
})();
