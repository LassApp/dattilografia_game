/* Script classico nel <head>: imposta data-theme prima del primo paint (nessun flash). Chiave duplicata da config.js (STORAGE_NS). */
(function(){var t='light';try{var p=(JSON.parse(localStorage.getItem('dt:settings')||'{}').theme)||'auto';
t=(p==='dark'||(p==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches))?'dark':'light';}catch(e){}
document.documentElement.setAttribute('data-theme',t);})();
