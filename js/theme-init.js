/* Web For All - js/theme-init.js
   Runs before the page paints so the saved theme, text size and brightness are already applied.
   This is what stops a light flash when you move between pages in dark mode. */

(function () {
  try {
    var html = document.documentElement;
    var saved = localStorage.getItem('wfa');
    var s = saved ? JSON.parse(saved) : {};
    if (!saved && matchMedia('(prefers-color-scheme:dark)').matches) s.theme = 'dark';
    if (s.theme) html.dataset.theme = s.theme;
    if (s.contrast) html.dataset.contrast = 'high';
    if (s.calm) html.dataset.calm = 'on';
    if (s.size) {
      html.style.setProperty('--ts', s.size / 100);
      html.style.setProperty('--tsn', Math.min(1.15, s.size / 100));
    }
    if (s.bright && s.bright != 100) html.style.filter = 'brightness(' + s.bright / 100 + ')';
    if (s.lang === 'fil') {
      html.dataset.pre = '1';
      setTimeout(function () { html.removeAttribute('data-pre'); }, 1500);
    }
  } catch (e) {}
})();