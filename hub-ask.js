/* Connect Lite — ask the tutor, in the session.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 28 Oct 2026: "hold to ask <the session's tutor> ... up to thirty seconds, or type it ... it lands in the tutor's
 * notebook ... the door opens ONLY during an input session". A trainee on an input session page, while that session is
 * on the timetable, sees "Ask <tutor> a question": hold to ask by voice, or type. It goes to the store as askQuestion
 * and reaches the tutor on the question wall (38_questions.html). Nothing here exists for a tutor, an assessor or a
 * volunteer, or on a page that is not an input session, or when the timetable has no such session today.
 *
 * Loaded after hub-store.js, hub-notebook.js and hub-rec.js on every input session page.
 */
(function(){
  'use strict';
  var S = window.HubStore, NB = window.HubNotebook, L = window.InputLib;
  if (!S || !S.isTrainee || !S.isTrainee() || !NB || !NB.context || !L || !window.HubRec) return;
  var ctx = NB.context(); if (!ctx || ctx.k !== 'input' || !ctx.id) return;

  function rd(k){ try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function esc(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function mins(hhmm){ var m = String(hhmm || '').match(/^(\d{1,2}):(\d{2})/); return m ? +m[1] * 60 + +m[2] : -1; }
  function cs(){ return rd('connect_course_settings') || {}; }
  function pinned(){ var c = cs(); return !!(c.demoToday || c.presentToday); }
  function tutors(){ var c = cs(); try { if (window.hubTutorNames) { var n = hubTutorNames(c); if (n && n.length) return n; } } catch (e) {} return String(c.tutorNames || '').split(/[,\n;]+/).map(function(x){ return x.trim(); }).filter(Boolean); }
  /* the minutes since midnight on the course's own clock */
  function courseMinutes(){
    var tz = cs().timeZone || undefined, n = new Date();
    try { var p = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: tz }).formatToParts(n), h = 0, m = 0;
      p.forEach(function(x){ if (x.type === 'hour') h = +x.value; if (x.type === 'minute') m = +x.value; }); return h * 60 + m; } catch (e) { return n.getHours() * 60 + n.getMinutes(); }
  }
  /* the tile that is this session, today, and on now (a pinned demo day counts the whole day) */
  function tile(){
    var tt = rd('connect_timetable_v1'), today = L.today(cs()), found = null;
    ((tt && tt.days) || []).forEach(function(d){
      if (!d || d.date !== today) return;
      (d.sessions || []).forEach(function(x){
        if (!x || x.k !== 'input' || !x.t || found) return;
        if (L.slugsFor(x.t).indexOf(ctx.id) === -1) return;
        if (pinned()) { found = { x: x, date: d.date }; return; }
        var now = courseMinutes(), a = mins(x.s), b = mins(x.e);
        if (a >= 0 && b >= 0 && now >= a - 15 && now <= b + 30) found = { x: x, date: d.date };
      });
    });
    return found;
  }
  var T = null;
  function css(){
    if (document.getElementById('hub-ask-css')) return;
    var st = document.createElement('style'); st.id = 'hub-ask-css';
    st.textContent = '.ask-pill{position:fixed;left:14px;bottom:calc(var(--sync-bottom,14px) + 40px);z-index:880;display:inline-flex;align-items:center;gap:8px;border:0;border-radius:999px;padding:11px 16px;background:var(--a-forest);color:var(--paper);font:700 .86rem/1 Karla,sans-serif;cursor:pointer;box-shadow:0 8px 22px -10px rgba(0,0,0,.45);}'
      + '.ask-pill:hover{background:var(--a-forest-2);} @media print{.ask-pill,.ask-back,.ask-sheet{display:none !important;}}'
      + '.ask-back{position:fixed;inset:0;z-index:1190;background:rgba(20,18,14,.45);opacity:0;transition:opacity .18s;} .ask-back.on{opacity:1;}'
      + '.ask-sheet{position:fixed;left:50%;bottom:0;z-index:1200;width:min(480px,100vw);transform:translate(-50%,100%);transition:transform .22s;background:var(--paper);border-radius:18px 18px 0 0;padding:20px 22px 24px;box-shadow:0 -10px 40px -12px rgba(0,0,0,.4);font-family:Karla,sans-serif;color:var(--ink);}'
      + '.ask-sheet.on{transform:translate(-50%,0);} .ask-sheet h2{font:700 1.3rem/1.15 Newsreader,Georgia,serif;margin:0 0 4px;} .ask-sheet .sub{margin:0 0 14px;font-size:.86rem;color:var(--grey);line-height:1.45;}'
      + '.ask-x{position:absolute;right:14px;top:12px;border:0;background:none;font-size:1.5rem;line-height:1;color:var(--grey);cursor:pointer;}'
      + '.ask-mic{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;border:0;border-radius:16px;padding:20px 14px;background:var(--a-forest);color:var(--paper);font:700 1.02rem/1.2 Karla,sans-serif;cursor:pointer;touch-action:none;user-select:none;-webkit-user-select:none;}'
      + '.ask-mic.on{background:var(--a-red);} .ask-mic .dot{width:12px;height:12px;border-radius:50%;background:var(--paper);} .ask-mic.on .dot{animation:askpulse 1s infinite;} @keyframes askpulse{50%{opacity:.25}}'
      + '.ask-or{margin:12px 0 6px;font-size:.74rem;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:var(--grey);text-align:center;}'
      + '.ask-sheet textarea{box-sizing:border-box;width:100%;min-height:72px;padding:10px 12px;border:1px solid var(--sand-line);border-radius:12px;background:var(--field);font:inherit;font-size:.95rem;color:var(--ink);resize:vertical;}'
      + '.ask-heard{display:none;margin:12px 0 0;padding:10px 12px;border-radius:12px;background:var(--sand);} .ask-heard.on{display:block;} .ask-heard audio{display:block;width:100%;margin-top:6px;} .ask-heard .rm{border:0;background:none;color:var(--a-red);font-weight:700;cursor:pointer;padding:0;margin-left:8px;}'
      + '.ask-go{margin-top:14px;width:100%;border:0;border-radius:999px;padding:13px;background:var(--a-mustard);color:var(--ink);font:700 1rem/1 Karla,sans-serif;cursor:pointer;} .ask-go:disabled{opacity:.45;cursor:default;}'
      + '.ask-msg{min-height:1.3em;margin:10px 0 0;font-size:.86rem;color:var(--grey);} .ask-msg.ok{color:var(--a-forest);font-weight:700;} .ask-msg.err{color:var(--a-red);}';
    document.head.appendChild(st);
  }
  function first(n){ return String(n || '').trim().split(/\s+/)[0]; }
  function toName(){ var by = T && T.x.by; var tn = tutors(); return (by !== undefined && by !== '' && by !== null && tn[+by]) ? tn[+by] : ''; }
  function open(){
    var to = toName(), who = to ? first(to) : 'your tutor';
    var back = document.createElement('div'); back.className = 'ask-back';
    var sh = document.createElement('div'); sh.className = 'ask-sheet'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-label', 'Ask ' + who + ' a question');
    sh.innerHTML = '<button type="button" class="ask-x" aria-label="Close">×</button><h2>Ask ' + esc(who) + '</h2>'
      + '<p class="sub">About ' + esc(T.x.t) + '. ' + esc(who) + ' sees it as you send it, and answers in the session.</p>'
      + '<button type="button" class="ask-mic"><span class="dot"></span><span class="lbl">Hold to ask</span></button>'
      + '<div class="ask-heard"><span class="len"></span><button type="button" class="rm">Take it again</button><audio controls></audio></div>'
      + '<p class="ask-or">or type it</p><textarea maxlength="500" placeholder="Your question"></textarea>'
      + '<button type="button" class="ask-go" disabled>Send</button><p class="ask-msg" role="status"></p>';
    document.body.appendChild(back); document.body.appendChild(sh);
    requestAnimationFrame(function(){ back.classList.add('on'); sh.classList.add('on'); });
    var mic = sh.querySelector('.ask-mic'), lbl = mic.querySelector('.lbl'), heard = sh.querySelector('.ask-heard'), ta = sh.querySelector('textarea'), go = sh.querySelector('.ask-go'), msg = sh.querySelector('.ask-msg');
    var got = null;
    function ready(){ go.disabled = !(got || ta.value.trim()); }
    function close(){ back.classList.remove('on'); sh.classList.remove('on'); setTimeout(function(){ back.remove(); sh.remove(); }, 240); }
    back.addEventListener('click', close); sh.querySelector('.ask-x').addEventListener('click', close);
    document.addEventListener('keydown', function k(e){ if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
    ta.addEventListener('input', ready);
    HubRec.hold(mic, { max: 30,
      onTick: function(s){ lbl.textContent = 'Recording · ' + s + 's of 30. Let go to keep it.'; },
      onDone: function(r){ got = r; lbl.textContent = 'Hold to ask again'; heard.classList.add('on'); heard.querySelector('.len').textContent = 'Your question, ' + r.seconds + ' seconds.'; heard.querySelector('audio').src = URL.createObjectURL(r.blob); msg.textContent = ''; ready(); },
      onError: function(m){ lbl.textContent = 'Hold to ask'; msg.className = 'ask-msg err'; msg.textContent = m; } });
    heard.querySelector('.rm').addEventListener('click', function(){ got = null; heard.classList.remove('on'); heard.querySelector('audio').removeAttribute('src'); ready(); });
    go.addEventListener('click', function(){
      if (go.disabled) return; go.disabled = true; go.textContent = 'Sending…'; msg.className = 'ask-msg'; msg.textContent = '';
      var body = { op: 'askQuestion', token: S.token(), text: ta.value.trim(), to: to, session: { k: 'input', id: ctx.id, title: T.x.t, date: T.date } };
      var step = got ? HubRec.b64(got.blob).then(function(b){ body.bytes = b; body.type = got.type; body.seconds = got.seconds; }) : Promise.resolve();
      step.then(function(){ return S.call(body, 120000); }).then(function(r){
        msg.className = 'ask-msg ok'; msg.textContent = (r && r.demo) ? 'This is a demo, so nothing was sent. On a real course ' + who + ' would have it now.' : 'Sent. ' + (to ? who : 'Your tutor') + ' has it.';
        go.textContent = 'Sent'; ta.value = ''; got = null; heard.classList.remove('on'); setTimeout(close, 2200);
      }, function(e){ go.disabled = false; go.textContent = 'Send'; msg.className = 'ask-msg err'; msg.textContent = 'Not sent: ' + ((e && e.message) || e); });
    });
  }
  function pill(){
    var old = document.querySelector('.ask-pill'); T = tile();
    if (!T) { if (old) old.remove(); return; }
    if (old) return;
    css();
    var b = document.createElement('button'); b.type = 'button'; b.className = 'ask-pill';
    b.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg><span></span>';
    b.querySelector('span').textContent = 'Ask ' + (toName() ? first(toName()) : 'your tutor') + ' a question';
    b.addEventListener('click', open);
    document.body.appendChild(b);
  }
  /* the timetable may arrive a moment after the page; look again, and each minute (a session starts and ends) */
  pill(); setTimeout(pill, 2500); setInterval(pill, 60000);
  document.addEventListener('hub:ready', pill);
})();
