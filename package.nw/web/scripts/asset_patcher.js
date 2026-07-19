(function(){
  function ensureBase() {
    if (!window.ASSET_BASE) window.ASSET_BASE = './assets/';
    window.ASSET_BASE = window.ASSET_BASE.replace(/\\/g,'/');
    if (!window.ASSET_BASE.endsWith('/')) window.ASSET_BASE += '/';
  }

  function replaceAttrs() {
    const attrs = ['src','href','data-src','poster'];
    attrs.forEach(attr => {
      document.querySelectorAll('['+attr+']').forEach(el => {
        const v = el.getAttribute(attr);
        if (!v) return;
        if (v.includes('%ASSET_BASE%')) {
          el.setAttribute(attr, v.replace(/%ASSET_BASE%/g, window.ASSET_BASE));
        } else if (v.match(/(?:\.\.\/)*assets\//)) {
          const rel = v.replace(/^(?:\.\.\/)*assets\//, '');
          el.setAttribute(attr, window.ASSET_BASE + rel);
        }
      });
    });
  }

  function replaceInlineStyles() {
    document.querySelectorAll('[style]').forEach(el => {
      let s = el.getAttribute('style');
      if (!s) return;
      if (s.includes('%ASSET_BASE%')) s = s.replace(/%ASSET_BASE%/g, window.ASSET_BASE);
      if (s.match(/(?:\.\.\/)*assets\//)) s = s.replace(/(?:\.\.\/)*assets\//g, window.ASSET_BASE);
      el.setAttribute('style', s);
    });
  }

  function replaceCSSRules() {
    for (let i=0;i<document.styleSheets.length;i++){
      const sheet = document.styleSheets[i];
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (!rules) continue;
        for (let r=0;r<rules.length;r++){
          const rule = rules[r];
          if (!rule.style) continue;
          ['background','backgroundImage','src','content'].forEach(prop => {
            const v = rule.style[prop];
            if (!v) return;
            let newV = v;
            if (newV.includes('%ASSET_BASE%')) newV = newV.replace(/%ASSET_BASE%/g, window.ASSET_BASE);
            if (newV.match(/(?:\.\.\/)*assets\//)) newV = newV.replace(/(?:\.\.\/)*assets\//g, window.ASSET_BASE);
            if (newV !== v) rule.style[prop] = newV;
          });
        }
      } catch (e) {
      }
    }
  }

  function run() {
    ensureBase();
    replaceAttrs();
    replaceInlineStyles();
    replaceCSSRules();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
