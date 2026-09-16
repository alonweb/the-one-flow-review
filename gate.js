(function () {
  var PASSWORD = 'mati2027';
  var KEY = 'the-one-gate-unlocked';

  function reveal() {
    document.body.style.visibility = 'visible';
  }

  function showGate() {
    var overlay = document.createElement('div');
    overlay.id = 'gate-overlay';
    overlay.style.cssText =
      'visibility:visible;position:fixed;inset:0;z-index:999999;' +
      'display:flex;align-items:center;justify-content:center;' +
      'background:#070A11;color:#F4F6FA;padding:24px;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;';
    overlay.innerHTML =
      '<form id="gate-form" style="width:100%;max-width:340px;text-align:center">' +
        '<p style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#F5B849;margin:0 0 14px">The One &mdash; Flow Review</p>' +
        '<h1 style="font-size:20px;font-weight:800;margin:0 0 20px;line-height:1.3">Enter password to continue</h1>' +
        '<input id="gate-input" type="password" autocomplete="off" placeholder="Password" ' +
          'style="width:100%;box-sizing:border-box;padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);color:#F4F6FA;font-size:15px;margin-bottom:12px" />' +
        '<button type="submit" style="width:100%;padding:12px 14px;border-radius:12px;border:none;background:#F5B849;color:#1A1205;font-weight:700;font-size:15px;cursor:pointer">Enter</button>' +
        '<p id="gate-error" style="color:#FF3D7F;font-size:13px;margin:12px 0 0;visibility:hidden">Wrong password.</p>' +
      '</form>';
    document.body.appendChild(overlay);
    reveal();

    var input = overlay.querySelector('#gate-input');
    var error = overlay.querySelector('#gate-error');
    overlay.querySelector('#gate-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (input.value === PASSWORD) {
        try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
        overlay.remove();
      } else {
        error.style.visibility = 'visible';
        input.value = '';
        input.focus();
      }
    });
    input.focus();
  }

  function init() {
    var unlocked = false;
    try { unlocked = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
    if (unlocked) {
      reveal();
    } else {
      showGate();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
