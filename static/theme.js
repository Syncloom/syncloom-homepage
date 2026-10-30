// applies the saved colour theme before first paint; an external file keeps the CSP strict
try { var t = localStorage.getItem('sl-theme'); if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t; } catch (e) {}
