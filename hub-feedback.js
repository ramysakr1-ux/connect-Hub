/* Connect Lite -- a thumb, and a line if they want. Ramy, 1 Oct 2026: "some
   kind of likes feedback, connected to Google" -- demos and the offer page
   only, never a real course. One tap writes a row to the store's own sheet:
   when, page, course, role, thumb, the line. No name, no address, nothing a
   person identifies themselves by.

   On a Lite screen it appears only when the course is a pinned demo
   (settings.demoToday). On the offer page, always. */
(function(){
  var url = (window.HubStore && HubStore.url) || '';
  if (!url) return;
  var mode = (window.HubMode) || (window.HubStore && (HubStore.isTutor && HubStore.isTutor() ? 'tutor' : HubStore.isAssessor && HubStore.isAssessor() ? 'assessor' : HubStore.isTrainee && HubStore.isTrainee() ? 'trainee' : '')) || '';
  var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
  var cs = {}; try { cs = JSON.parse(localStorage.getItem('connect_course_settings') || '{}') || {}; } catch (e) {}
  var isOffer = page === 'offer';
  var isDemo = !!cs.demoToday;
  if (!isOffer && !isDemo) return;
  var course = isDemo ? String(cs.courseName || '') : '';
  var KEY = 'chub:feedback:' + page;
  var already = ''; try { already = localStorage.getItem(KEY) || ''; } catch (e) {}

  var css = document.createElement('style');
  css.textContent = '.hub-fb{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:28px 0 8px;padding:12px 14px;border:1px solid var(--sand-line,oklch(89.5% 0.012 82));border-radius:12px;background:var(--paper,oklch(98.5% 0.007 84));font:0.86rem Karla,system-ui,sans-serif;color:var(--grey,oklch(51% 0.017 70));}'
    + '.hub-fb b{color:var(--ink,oklch(23.5% 0.017 65));font-weight:600;}'
    + '.hub-fb button{font:inherit;font-size:1.05rem;line-height:1;padding:7px 12px;border-radius:999px;border:1.5px solid var(--sand-line,oklch(89.5% 0.012 82));background:transparent;cursor:pointer;color:inherit;}'
    + '.hub-fb button:hover{border-color:var(--teal,oklch(37.5% 0.058 195));}'
    + '.hub-fb button.on{background:var(--teal,oklch(37.5% 0.058 195));border-color:var(--teal,oklch(37.5% 0.058 195));color:#fff;}'
    + '.hub-fb input{flex:1 1 220px;min-width:0;font:inherit;padding:7px 10px;border:1px solid var(--sand-line,oklch(89.5% 0.012 82));border-radius:8px;background:var(--field,oklch(99% 0.004 90));color:var(--ink,oklch(23.5% 0.017 65));}'
    + '.hub-fb .send{font-size:0.82rem;font-weight:700;color:var(--teal,oklch(37.5% 0.058 195));border-color:var(--teal,oklch(37.5% 0.058 195));}'
    + '.hub-fb .thanks{color:var(--teal,oklch(37.5% 0.058 195));font-weight:600;}'
    + '@media print{.hub-fb{display:none;}}';
  document.head.appendChild(css);

  var box = document.createElement('div'); box.className = 'hub-fb';
  var anchor = document.querySelector('footer.foot, .foot') || document.body;
  anchor.parentNode.insertBefore(box, anchor);

  function paint(thumb, sent){
    if (sent) { box.innerHTML = '<span class="thanks">Thank you.</span> <span>Your note went to the centre' + (isOffer ? ' that built this' : '') + '.</span>'; return; }
    box.innerHTML = '<b>' + (isOffer ? 'Useful?' : 'Is this demo useful?') + '</b>'
      + '<button type="button" data-t="up" class="' + (thumb === 'up' ? 'on' : '') + '" aria-label="Yes">👍</button>'
      + '<button type="button" data-t="down" class="' + (thumb === 'down' ? 'on' : '') + '" aria-label="No">👎</button>'
      + (thumb ? '<input type="text" maxlength="400" placeholder="Anything you would add? (optional)"><button type="button" class="send">Send</button>' : '');
    box.querySelectorAll('[data-t]').forEach(function (b) { b.addEventListener('click', function () { send(b.dataset.t, ''); paint(b.dataset.t, false); var i = box.querySelector('input'); if (i) i.focus(); }); });
    var s = box.querySelector('.send'); if (s) s.addEventListener('click', function () { var i = box.querySelector('input'); send(thumb, (i && i.value || '').trim()); paint(thumb, true); });
    var inp = box.querySelector('input'); if (inp) inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { send(thumb, inp.value.trim()); paint(thumb, true); } });
  }
  function send(thumb, text){
    try { localStorage.setItem(KEY, thumb); } catch (e) {}
    var body = { op: 'feedback', page: page, course: course, role: mode || (isOffer ? 'visitor' : ''), thumb: thumb, text: text || '' };
    try { fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body), keepalive: true }).catch(function () {}); } catch (e) {}
  }
  paint(already || '', false);
})();
