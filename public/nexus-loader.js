/* Uiverse.io loader (by Vosoone) — NEXUS hub only.
   Usage on NEXUS hub: <script src="https://protocold7.ru/nexus-loader.js?v=2"></script> in <head>. */
(function () {
  if (window.__NX_LOADER__) return;
  window.__NX_LOADER__ = true;
  var startedAt = Date.now();
  var MIN_MS = 5000;
  var MAX_MS = 20000;

  function inject() {
    var wrap = document.createElement('div');
    wrap.id = 'nxl-wrap';
    wrap.innerHTML = '' +
      '<div class="main-container">' +
      '  <div class="loader">' +
      '    <svg id="browser" viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '      <defs>' +
      '        <linearGradient id="traceGradient1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00ccff"/><stop offset="1" stop-color="#0044ff"/></linearGradient>' +
      '        <linearGradient id="traceGradient2" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#7c4dff"/><stop offset="1" stop-color="#00ccff"/></linearGradient>' +
      '        <linearGradient id="traceGradient3" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00ff9d"/><stop offset="1" stop-color="#0077ff"/></linearGradient>' +
      '        <linearGradient id="traceGradient4" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff006e"/><stop offset="1" stop-color="#ff7a00"/></linearGradient>' +
      '      </defs>' +
      '      <line class="grid-line" x1="20" y1="110" x2="620" y2="110"/>' +
      '      <line class="grid-line" x1="20" y1="200" x2="620" y2="200"/>' +
      '      <line class="grid-line" x1="20" y1="290" x2="620" y2="290"/>' +
      '      <line class="grid-line" x1="200" y1="70" x2="200" y2="370"/>' +
      '      <line class="grid-line" x1="400" y1="70" x2="400" y2="370"/>' +
      '      <rect class="browser-frame" x="20" y="30" width="600" height="360" rx="10"/>' +
      '      <rect class="browser-top" x="20" y="30" width="600" height="40" rx="10"/>' +
      '      <circle cx="46" cy="50" r="4" fill="#3a4659"/>' +
      '      <circle cx="62" cy="50" r="4" fill="#3a4659"/>' +
      '      <circle cx="78" cy="50" r="4" fill="#3a4659"/>' +
      '      <text class="loading-text" x="598" y="55" text-anchor="end">NEXUS // HUB</text>' +
      '      <rect class="skeleton" x="40" y="92"  width="260" height="20" rx="4"/>' +
      '      <rect class="skeleton" x="40" y="126" width="180" height="12" rx="4"/>' +
      '      <rect class="skeleton" x="40" y="154" width="560" height="36" rx="4"/>' +
      '      <rect class="skeleton" x="40" y="206" width="420" height="36" rx="4"/>' +
      '      <rect class="skeleton" x="40" y="258" width="560" height="36" rx="4"/>' +
      '      <rect class="skeleton" x="40" y="310" width="320" height="36" rx="4"/>' +
      '      <g>' +
      '        <path class="trace-flow" d="M620 60 C 500 90, 430 40, 340 110 S 160 210, 60 150"/>' +
      '        <path class="trace-flow" d="M40 380 C 180 340, 260 400, 370 330 S 560 260, 620 300"/>' +
      '        <path class="trace-flow" d="M320 60 C 300 140, 380 200, 300 260 S 140 330, 60 300"/>' +
      '        <path class="trace-flow" d="M600 220 C 520 260, 470 330, 360 350 S 200 380, 100 360"/>' +
      '      </g>' +
      '    </svg>' +
      '    <div class="nxl-center"><span class="nxl-nexus">NEXUS</span></div>' +
      '  </div>' +
      '</div>';

    var css = document.createElement('style');
    css.textContent = '' +
      '/* From Uiverse.io by Vosoone */' +
      '.main-container{display:flex;justify-content:center;align-items:center;height:100%;width:100%;overflow:hidden}' +
      '.loader{width:min(320px,88vw);aspect-ratio:640/400}' +
      '#browser{overflow:hidden;width:100%;height:auto;display:block}' +
      '.grid-line{stroke:#222;stroke-width:0.5}' +
      '.browser-frame{fill:#111;stroke:#666;stroke-width:1;filter:drop-shadow(0 0 10px rgba(0,0,0,0.9))}' +
      '.browser-top{fill:#1a1a1a}' +
      '.loading-text{font-family:Haettenschweiler,sans-serif;font-size:14px;fill:#e4e4e4}' +
      '.skeleton{fill:#2d2d2d;rx:4;ry:4;animation:pulse 1.8s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,255,255,0.02))}' +
      '@keyframes pulse{0%{fill:#2d2d2d}50%{fill:#505050}100%{fill:#2d2d2d}}' +
      '.trace-flow{stroke-width:1;fill:none;stroke-dasharray:120 600;stroke-dashoffset:720;animation:flow 5s linear infinite;opacity:0.95;stroke-linejoin:round;filter:drop-shadow(0 0 8px currentColor) blur(0.5px);color:#00ccff}' +
      '.trace-flow:nth-child(1){stroke:url(#traceGradient1)}' +
      '.trace-flow:nth-child(2){stroke:url(#traceGradient2)}' +
      '.trace-flow:nth-child(3){stroke:url(#traceGradient3)}' +
      '.trace-flow:nth-child(4){stroke:url(#traceGradient4)}' +
      '@keyframes flow{from{stroke-dashoffset:720}to{stroke-dashoffset:0}}' +
      '@keyframes nxl-glow{0%,100%{text-shadow:0 0 18px rgba(0,170,255,.65),0 0 42px rgba(0,110,255,.4),0 0 80px rgba(0,204,255,.25)}50%{text-shadow:0 0 26px rgba(0,190,255,.85),0 0 58px rgba(0,130,255,.55),0 0 96px rgba(0,204,255,.35)}}' +
      '.nxl-center{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}' +
      '.nxl-nexus{font-family:Haettenschweiler,Impact,sans-serif;font-size:clamp(38px,9vw,72px);letter-spacing:.28em;text-indent:.28em;color:#f2f2f2;animation:nxl-glow 2.4s ease-in-out infinite}' +
      '#nxl-wrap{position:fixed;inset:0;z-index:99998;display:flex;background:#0a0a0a;transition:opacity .45s ease}' +
      '#nxl-wrap.nxl-hide{opacity:0;pointer-events:none}' +
      '@media (prefers-reduced-motion: reduce){.skeleton,.trace-flow,.nxl-nexus{animation:none}}' +
      '#browser{width:100%;height:auto;display:block}' +
      '.loader{max-width:600px;width:min(600px,94vw);height:auto;aspect-ratio:640/400;position:relative;display:block}' +
      '@media (max-height:520px) and (orientation:landscape){.loader{max-width:440px}}';
    document.head.appendChild(css);
    document.body.appendChild(wrap);

    var disposed = false;
    var dispose = function () {
      if (disposed) return;
      disposed = true;
      wrap.classList.add('nxl-hide');
      window.setTimeout(function () { wrap.remove(); }, 500);
    };
    window.setTimeout(dispose, Math.max(0, MIN_MS - (Date.now() - startedAt)));
    window.setTimeout(dispose, MAX_MS);
    ['keypress', 'wheel', 'touchstart'].forEach(function (ev) {
      wrap.addEventListener(ev, function () {}, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
