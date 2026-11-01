/* NEXUS network loader — 5s branded intro with browser-skeleton SVG.
   Usage: <script src="https://protocold7.ru/nexus-loader.js?v=1" data-code="SKYHOLD"></script>
   Placed before the app scripts so it appears instantly. */
(function () {
  if (window.__NX_LOADER__) return;
  window.__NX_LOADER__ = true;
  var CODE = (document.currentScript && document.currentScript.getAttribute('data-code')) || 'NEXUS';
  var startedAt = Date.now();
  var MIN_MS = 5000;   // stay at least 5 seconds
  var MAX_MS = 20000;  // never trap the user forever

  function inject() {
    var el = document.createElement('div');
    el.id = 'nx-loader';
    el.innerHTML = '' +
      '<div class="nxl-stage">' +
      '  <div class="nxl-frame-wrap">' +
      '    <svg class="nxl-svg" viewBox="0 0 640 420" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '      <defs>' +
      '        <linearGradient id="nxl-g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00ccff"/><stop offset="1" stop-color="#0044ff"/></linearGradient>' +
      '        <linearGradient id="nxl-g2" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#7c4dff"/><stop offset="1" stop-color="#00ccff"/></linearGradient>' +
      '        <linearGradient id="nxl-g3" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00ff9d"/><stop offset="1" stop-color="#0077ff"/></linearGradient>' +
      '        <linearGradient id="nxl-g4" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff006e"/><stop offset="1" stop-color="#ff7a00"/></linearGradient>' +
      '      </defs>' +
      '      <rect class="nxl-browser-frame" x="20" y="28" width="600" height="364" rx="10"/>' +
      '      <rect class="nxl-browser-top" x="20" y="28" width="600" height="40" rx="10"/>' +
      '      <rect x="20" y="52" width="600" height="16"/>' +
      '      <circle cx="46" cy="48" r="5" class="nxl-dot"/>' +
      '      <circle cx="64" cy="48" r="5" class="nxl-dot"/>' +
      '      <circle cx="82" cy="48" r="5" class="nxl-dot"/>' +
      '      <rect class="nxl-addr" x="120" y="40" width="220" height="16" rx="8"/>' +
      '      <rect class="nxl-skeleton" x="44"  y="92"  width="250" height="20" rx="4"/>' +
      '      <rect class="nxl-skeleton nx-d2" x="44"  y="124" width="170" height="12" rx="4"/>' +
      '      <rect class="nxl-skeleton nx-d3" x="44"  y="152" width="500" height="34" rx="4"/>' +
      '      <rect class="nxl-skeleton nx-d2" x="44"  y="202" width="380" height="34" rx="4"/>' +
      '      <rect class="nxl-skeleton nx-d4" x="44"  y="252" width="500" height="34" rx="4"/>' +
      '      <rect class="nxl-skeleton nx-d3" x="44"  y="302" width="300" height="34" rx="4"/>' +
      '      <rect class="nxl-skeleton nx-d4" x="44"  y="352" width="420" height="20" rx="4"/>' +
      '      <path class="nxl-trace nxl-t1" d="M620 60 C 500 90, 430 40, 340 110 S 160 210, 60 150"/>' +
      '      <path class="nxl-trace nxl-t2" d="M40 380 C 180 340, 260 400, 370 330 S 560 260, 620 300"/>' +
      '      <path class="nxl-trace nxl-t3" d="M320 60 C 300 140, 380 200, 300 260 S 140 330, 60 300"/>' +
      '      <path class="nxl-trace nxl-t4" d="M600 220 C 520 260, 470 330, 360 350 S 200 380, 100 360"/>' +
      '    </svg>' +
      '    <div class="nxl-center">' +
      '      <div class="nxl-brand">NEXUS</div>' +
      '      <div class="nxl-code">' + CODE + '</div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="nxl-status">СОЕДИНЕНИЕ С СЕТЬЮ<span class="nxl-ell"><i>.</i><i>.</i><i>.</i></span></div>' +
      '</div>';
    var css = document.createElement('style');
    css.textContent = '' +
      '#nx-loader{position:fixed;inset:0;z-index:99998;display:flex;align-items:center;justify-content:center;' +
        'background:radial-gradient(1200px 700px at 50% 38%,#0d1524 0%,#070b12 62%,#05070c 100%);' +
        'transition:opacity .45s ease;font-family:Outfit,system-ui,-apple-system,sans-serif;color:#9aa7c4;overflow:hidden}' +
      '#nx-loader.nxl-hide{opacity:0;pointer-events:none}' +
      '.nxl-stage{display:flex;flex-direction:column;align-items:center;gap:22px;width:min(640px,92vw)}' +
      '.nxl-frame-wrap{position:relative;width:100%}' +
      '.nxl-svg{width:100%;height:auto;display:block}' +
      '.nxl-dot{fill:#3a4659}.nxl-dot:nth-of-type(1){fill:#63d297}' +
      '.nxl-dot + circle + circle{fill:#e0a060}' +
      '.nxl-addr{fill:#20293a}.nxl-badge{fill:#2a3444}' +
      '.nxl-code{color:#5b6b8c;letter-spacing:.34em;font-size:clamp(9px,1.6vw,12px);font-family:JetBrains Mono,ui-monospace,monospace;text-transform:uppercase}' +
      '.nxl-status{font-family:JetBrains Mono,ui-monospace,monospace;font-size:clamp(9px,1.6vw,11px);letter-spacing:.28em;color:#3f4c66;text-transform:uppercase}' +
      '.nxl-status i{animation:nxl-b 1.2s infinite;font-style:normal}.nxl-status i:nth-child(2){animation-delay:.2s}.nxl-status i:nth-child(3){animation-delay:.4s}' +
      '.nxl-browser-frame{fill:#0b0f17;stroke:#2a3446;stroke-width:1.2;filter:drop-shadow(0 0 24px rgba(0,110,255,.16))}' +
      '.nxl-browser-top{fill:#131a28}' +
      '.nxl-skeleton{fill:#1c2433;animation:nxl-pulse 1.8s ease-in-out infinite}' +
      '.nxl-skeleton.nx-d2{animation-delay:.25s}.nxl-skeleton.nx-d3{animation-delay:.5s}.nxl-skeleton.nx-d4{animation-delay:.75s}' +
      '.nxl-trace{fill:none;stroke-width:1.6;stroke-dasharray:120 600;stroke-dashoffset:720;animation:nxl-flow 5s linear infinite;' +
        'opacity:.95;stroke-linejoin:round;stroke-linecap:round;filter:drop-shadow(0 0 8px currentColor)}' +
      '.nxl-t1{stroke:url(#nxl-g1);color:rgba(0,204,255,.85)}' +
      '.nxl-t2{stroke:url(#nxl-g2);color:rgba(124,77,255,.85);animation-delay:.6s}' +
      '.nxl-t3{stroke:url(#nxl-g3);color:rgba(0,255,157,.8);animation-delay:1.1s}' +
      '.nxl-t4{stroke:url(#nxl-g4);color:rgba(255,0,110,.8);animation-delay:1.6s}' +
      '.nxl-brand{font-family:Outfit,system-ui,sans-serif;font-weight:800;letter-spacing:.5em;text-indent:.5em;' +
        'font-size:clamp(30px,7vw,54px);color:#eef3ff;text-shadow:0 0 18px rgba(0,170,255,.65),0 0 42px rgba(0,110,255,.4),0 0 80px rgba(0,204,255,.25);animation:nxl-glow 2.4s ease-in-out infinite}' +
      '.nxl-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;pointer-events:none}' +
      '@keyframes nxl-pulse{0%{fill:#1c2433}50%{fill:#37424f}100%{fill:#1c2433}}' +
      '@keyframes nxl-flow{from{stroke-dashoffset:720}to{stroke-dashoffset:0}}' +
      '@keyframes nxl-glow{0%,100%{text-shadow:0 0 18px rgba(0,170,255,.65),0 0 42px rgba(0,110,255,.4),0 0 80px rgba(0,204,255,.25)}' +
        '50%{text-shadow:0 0 26px rgba(0,190,255,.85),0 0 58px rgba(0,130,255,.55),0 0 96px rgba(0,204,255,.35)}}' +
      '@keyframes nxl-b{0%,80%,100%{opacity:.2}40%{opacity:1}}' +
      '@media (prefers-reduced-motion: reduce){.nxl-trace,.nxl-skeleton,.nxl-brand{animation:none}}';
    document.head.appendChild(css);
    document.body.appendChild(el);

    var disposed = false;
    var dispose = function () {
      if (disposed) return;
      disposed = true;
      el.classList.add('nxl-hide');
      window.setTimeout(function () { el.remove(); }, 500);
    };
    // intro always lasts the full 5 seconds
    window.setTimeout(dispose, Math.max(0, MIN_MS - (Date.now() - startedAt)));
    // absolute safety net in case the tab was suspended mid-intro
    window.setTimeout(dispose, MAX_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
