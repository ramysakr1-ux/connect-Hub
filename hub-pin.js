/* Connect Lite — the PIN sheet.
 *
 * Ramy, 15 Oct 2026: "can we add a password to lite's link" ... "the first
 * time they click on it, it prompts them to choose a password and they enter
 * it twice. If they lose it, the course admin sends them another link and the
 * other one is terminated." A course switches PINs on; from then on a link
 * opens with this sheet in CHOOSE mode (typed twice), and every later open on
 * a new device asks for it. The STORE enforces it (Code.js v87: 'PIN needed',
 * 'PIN required', 'Wrong PIN'); hub-store.js asks here, keeps the answer on
 * this device, and retries. A course with PINs off never sees this sheet.
 *
 * hubPin.ask({ who: 'trainee' | 'tutor', wrong: bool, choose: bool }) -> Promise<string|null>
 */
(function () {
  'use strict';
  var pending = null;
  function css() {
    if (document.getElementById('hub-pin-css')) return;
    var st = document.createElement('style'); st.id = 'hub-pin-css';
    st.textContent =
      ".hub-pin-veil{position:fixed;inset:0;z-index:2147483000;background:oklch(23.5% 0.017 65 / .42);display:flex;align-items:center;justify-content:center;padding:20px;}" +
      ".hub-pin{width:min(380px,100%);background:var(--paper,#fdfcf9);border-radius:16px;padding:24px 24px 20px;box-shadow:0 24px 60px -20px oklch(23.5% 0.017 65 / .6);font-family:Karla,Helvetica,sans-serif;color:var(--ink,#2b2622);}" +
      ".hub-pin .brand{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px;}" +
      ".hub-pin .lock{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:9px;background:var(--teal,#1f4f4c);color:#fff;}" +
      ".hub-pin h2{font-family:Newsreader,Georgia,serif;font-weight:700;font-size:1.35rem;line-height:1.2;margin:0 0 6px;}" +
      ".hub-pin p{font-size:.92rem;line-height:1.55;color:var(--grey,#55524a);margin:0 0 14px;}" +
      ".hub-pin input{width:100%;box-sizing:border-box;font:700 1.6rem/1 Karla,Helvetica,sans-serif;letter-spacing:.32em;text-align:center;padding:12px 10px;border:1.5px solid var(--sand-line,#d9d2c3);border-radius:10px;background:var(--field,#fff);color:var(--ink,#2b2622);outline:none;}" +
      ".hub-pin input+input{margin-top:10px;}" +
      ".hub-pin input:focus{border-color:var(--teal,#1f4f4c);}" +
      ".hub-pin.wrong input{border-color:var(--brick,#8b2e2e);animation:hub-pin-shake .3s;}" +
      ".hub-pin .err{color:var(--brick,#8b2e2e);font-weight:600;min-height:1.3em;margin:8px 0 0;font-size:.88rem;}" +
      ".hub-pin .row{display:flex;gap:10px;margin-top:14px;}" +
      ".hub-pin button{font:700 .95rem Karla,Helvetica,sans-serif;border:0;border-radius:999px;padding:11px 18px;cursor:pointer;}" +
      ".hub-pin .go{flex:1;background:var(--teal,#1f4f4c);color:#fff;}" +
      ".hub-pin .go:disabled{opacity:.5;cursor:default;}" +
      ".hub-pin .no{background:none;color:var(--grey,#55524a);}" +
      "@keyframes hub-pin-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}" +
      "@media(prefers-reduced-motion:reduce){.hub-pin.wrong input{animation:none;}}";
    document.head.appendChild(st);
  }
  /* The Connect Lite lockup heads the sheet (the logo goes everywhere the
     name does, 8 Oct 2026): hub-shared.js draws it where the page has it;
     this copy stands in on a page that does not. */
  function lockup() {
    if (window.hubLockup) return window.hubLockup(22);
    return '<span class="hub-lockup" style="display:inline-flex;align-items:center;gap:7px"><span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:5px;background:oklch(30% 0.042 58)">' +
      '<svg viewBox="8 30 104 60" width="15" height="9" fill="none" aria-hidden="true"><path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="oklch(70% 0.12 72)" stroke-width="13" stroke-linecap="round"></path><path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="oklch(99.5% 0.004 90)" stroke-width="13" stroke-linecap="round"></path></svg></span>' +
      '<span style="font-family:\'Instrument Serif\',Georgia,serif;font-style:italic;font-size:17px;line-height:.85;color:oklch(63% 0.096 72)">Connect</span><span style="font-family:\'Instrument Sans\',Karla,sans-serif;font-weight:500;font-size:8px;letter-spacing:.24em;text-transform:uppercase;margin-left:-3px;color:var(--ink,#2b2622)">Lite</span></span>';
  }
  function ask(opts) {
    opts = opts || {};
    if (pending) return pending;
    css();
    pending = new Promise(function (resolve) {
      var veil = document.createElement('div'); veil.className = 'hub-pin-veil';
      var tutor = opts.who === 'tutor', choose = !!opts.choose;
      var head = choose
        ? (tutor ? 'Choose the teaching team’s PIN' : 'Choose a PIN for your link')
        : (tutor ? 'The teaching team’s PIN' : 'This link has a PIN');
      var line = choose
        ? (tutor
            ? 'You are the first tutor to open this link. Four to six digits, typed twice. Every tutor types it once on each device. If it is lost, course admin rotates the link.'
            : 'Four to six digits, typed twice. You will type it once on each device you use. If you lose it, your course admin sends you a new link.')
        : 'Type it once; this device remembers it.';
      veil.innerHTML =
        '<div class="hub-pin' + (opts.wrong ? ' wrong' : '') + '" role="dialog" aria-modal="true" aria-labelledby="hub-pin-h">' +
        '<div class="brand">' + lockup() + '<span class="lock" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></span></div>' +
        '<h2 id="hub-pin-h"></h2><p class="line"></p>' +
        '<form><label for="hub-pin-in" style="position:absolute;left:-9999px">PIN</label>' +
        '<input id="hub-pin-in" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{4,6}" maxlength="6" placeholder="••••" aria-label="PIN">' +
        (choose ? '<label for="hub-pin-in2" style="position:absolute;left:-9999px">PIN again</label><input id="hub-pin-in2" inputmode="numeric" autocomplete="off" pattern="[0-9]{4,6}" maxlength="6" placeholder="again" aria-label="PIN again">' : '') +
        '<p class="err"></p>' +
        '<div class="row"><button type="button" class="no">Not now</button><button type="submit" class="go" disabled></button></div></form></div>';
      veil.querySelector('h2').textContent = head;
      veil.querySelector('.line').textContent = line;
      veil.querySelector('.go').textContent = choose ? 'Set my PIN' : 'Open';
      if (opts.wrong) veil.querySelector('.err').textContent = 'Not that one. Try again.';
      document.body.appendChild(veil);
      var box = veil.firstChild, input = veil.querySelector('#hub-pin-in'), input2 = veil.querySelector('#hub-pin-in2'), go = veil.querySelector('.go'), no = veil.querySelector('.no'), form = veil.querySelector('form'), err = veil.querySelector('.err');
      function done(v) { pending = null; try { veil.remove(); } catch (e) {} resolve(v); }
      function check() {
        var ok = /^\d{4,6}$/.test(input.value);
        if (choose) {
          var same = input2.value === input.value;
          ok = ok && same;
          err.textContent = (input.value && input2.value.length >= input.value.length && !same) ? 'The two do not match.' : '';
        }
        go.disabled = !ok; box.classList.remove('wrong');
      }
      [input, input2].forEach(function (el) { if (el) el.addEventListener('input', function () { el.value = el.value.replace(/\D/g, '').slice(0, 6); check(); }); });
      form.addEventListener('submit', function (e) { e.preventDefault(); if (!go.disabled) done(input.value); });
      no.addEventListener('click', function () { done(null); });
      setTimeout(function () { try { input.focus(); } catch (e) {} }, 50);
    });
    return pending;
  }
  window.hubPin = { ask: ask };
})();
