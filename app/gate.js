(function () {
  // A soft gate for THE ONE App preview: the page shows once the password's SHA-256 matches. Unlocked for this tab only.
  var HASH = '5a24f03a01d5b10cab6124f3c0e7086994ac9c869fc8e76e1463458f829fc864';
  var KEY = 'the-one-app-unlocked';

  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  function reveal() { document.body.style.visibility = 'visible'; }

  function showGate() {
    var overlay = document.createElement('div');
    overlay.id = 'gate-overlay';
    overlay.style.cssText =
      'visibility:visible;position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;' +
      'background:#0b0509;color:#fff4f8;padding:24px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;';
    overlay.innerHTML =
      '<form id="gate-form" style="width:100%;max-width:340px;text-align:center">' +
        '<p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#ff2e8b;margin:0 0 14px">The One &mdash; App preview</p>' +
        '<h1 style="font-size:20px;font-weight:800;margin:0 0 20px;line-height:1.3">Enter password to continue</h1>' +
        '<input id="gate-input" type="password" autocomplete="off" placeholder="Password" ' +
          'style="width:100%;box-sizing:border-box;padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);color:#fff4f8;font-size:16px;margin-bottom:12px" />' +
        '<button type="submit" style="width:100%;padding:12px 14px;border-radius:12px;border:none;background:#ff2e8b;color:#1a0610;font-weight:700;font-size:15px;cursor:pointer">Enter</button>' +
        '<p id="gate-error" style="color:#ff6b9d;font-size:13px;margin:12px 0 0;visibility:hidden">Wrong password.</p>' +
      '</form>';
    document.body.appendChild(overlay);
    reveal();

    var input = overlay.querySelector('#gate-input');
    var error = overlay.querySelector('#gate-error');
    overlay.querySelector('#gate-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!(window.crypto && crypto.subtle)) { error.textContent = 'Open this page over https.'; error.style.visibility = 'visible'; return; }
      crypto.subtle.digest('SHA-256', new TextEncoder().encode(input.value)).then(function (d) {
        if (hex(d) === HASH) {
          try { sessionStorage.setItem(KEY, '1'); } catch (x) {}
          location.reload(); // start the app from its first screen
        } else {
          error.style.visibility = 'visible';
          input.value = '';
          input.focus();
        }
      });
    });
    input.focus();
  }

  function init() {
    var unlocked = false;
    try { unlocked = sessionStorage.getItem(KEY) === '1'; } catch (x) {}
    if (unlocked) reveal(); else showGate();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
