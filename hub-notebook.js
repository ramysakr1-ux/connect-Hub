/* Connect Lite — the notebook.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 25 Oct 2026: "We need a smart notebook. Connected to the rest of the
 * course, the rest of the platform." Then: "share with the whole course or
 * share with my TP group"; "one for the trainers as well, separate obviously";
 * "personal: tutors cannot see each other's notebook. They can share but they
 * cannot see each other's notes"; and the name of the thing: "instead of share
 * with others, you can say connect with others".
 *
 * ONE NOTEBOOK, KEPT BY THE COURSE. Nobody files anything. A note is stamped
 * with the day and the place it was written -- an input session, a TP, an
 * assignment, an observation task -- and the notebook page (37_notebook.html)
 * reads it two ways, by day and by thread. The ARC in the corner of every
 * page is how a note is written: the first half of the mark, cream on forest.
 * It opens a sheet already headed with where you are. A note kept to yourself
 * wears one arc; a note you connect to others wears the two, linked.
 *
 * A TRAINEE'S notes are their own `notebook` record (localStorage
 * chub:notebook, store kind notebook, private: the store never folds it into
 * a tutor's roster). Connecting one copies it into the course pool through
 * the store's shareNote op; what classmates connected arrives with the boot
 * as connect_notes_v1. A TUTOR'S notes are the course's `tutorNotes` pool,
 * one list per tutor name (the tutors share one key; the name the dashboard
 * asks for is the identity), fetched by name and never in the boot, so a
 * colleague's browser never holds them. A voice note is a file in a private
 * folder, played back through the store by the people the note reaches.
 *
 * Loaded after hub-store.js on every page a note can be written on, with or
 * without hub-sync.js (the input sessions have no sync layer: there the note
 * goes to the store from here). On a demo course the writes stay on the device,
 * as everywhere else in Lite.
 *
 *   HubNotebook.context()          where this page is, as a thread
 *   HubNotebook.open(thread)       the sheet
 *   HubNotebook.load() / save(nb)  the trainee's record
 *   HubNotebook.tutor.load() ...   the tutor's list (cache, then the store)
 *   HubNotebook.play(note, slot)   a voice note, into an <audio>
 */
(function(){
  'use strict';
  var S = window.HubStore; if (!S) return;
  var MODE = S.isTutor() ? 'tutor' : S.isTrainee() ? 'trainee' : '';
  if (!MODE) { window.HubNotebook = { context: function(){ return null; }, open: function(){} }; return; }
  var KEY = 'chub:notebook', TKEY = 'chub:tutorNotebook';
  var MAX_SECONDS = 90;

  function rd(k){ try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function esc(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function settings(){ return rd('connect_course_settings') || {}; }
  function demo(){ if (window.HUB_DEMO != null) return !!window.HUB_DEMO; return !!settings().demoToday; }
  function today(){
    if (window.hubToday) return window.hubToday();
    var d = String(settings().demoToday || ''); if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    var n = new Date(); return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0');
  }
  /* the moment, on the course's day (a demo course's clock is pinned) */
  function nowISO(){
    var d = today(), n = new Date();
    var local = new Date(d + 'T' + String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0') + ':' + String(n.getSeconds()).padStart(2, '0'));
    return isNaN(local) ? n.toISOString() : local.toISOString();
  }
  function newId(){ return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4); }
  function dayLabel(d, long){
    try { return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', long ? { weekday: 'long', day: 'numeric', month: 'long' } : { weekday: 'short', day: 'numeric', month: 'short' }); } catch (e) { return d; }
  }
  function timeLabel(iso){ try { var d = new Date(iso); if (isNaN(d)) return ''; var h = d.getHours(), m = String(d.getMinutes()).padStart(2, '0'); return (window.hubClockIs24 && !window.hubClockIs24()) ? ((h % 12) || 12) + ':' + m + (h < 12 ? ' am' : ' pm') : String(h).padStart(2, '0') + ':' + m; } catch (e) { return ''; } }
  function who(){ try { return (localStorage.getItem('chub:tutorName') || '').trim(); } catch (e) { return ''; } }

  /* ---- where am I: the thread a note written here belongs to -------------- */
  var params = new URLSearchParams(location.search);
  function tpOf(s){ var m = String(s || '').match(/\d+/); return m ? m[0] : ''; }
  function rosterName(tok){ var r = rd('connect_roster_v1'); var t = r && r.trainees && r.trainees[tok]; return t ? String(t.name || '') : ''; }
  function pageTitle(){ return String(document.title || '').replace(/^\d+\s*[·\-–]\s*/, '').replace(/\s*[—–-]\s*Connect Lite\s*$/, '').trim(); }
  function context(){
    var parts = location.pathname.split('/').filter(Boolean);
    var file = parts.length && /\.html?$/i.test(parts[parts.length - 1]) ? parts[parts.length - 1] : '';
    var dir = file ? (parts[parts.length - 2] || '') : (parts[parts.length - 1] || '');
    if (parts.indexOf('input-sessions') !== -1 && dir && dir !== 'input-sessions') {
      var h = document.querySelector('.header h1, h1'); return { k: 'input', id: dir, t: (h && h.textContent.trim()) || pageTitle() || 'Input session' };
    }
    var n;
    if (/^(1_|2_)/.test(file)) { var p = rd('chub:plan'); n = tpOf((p && p.state && p.state.f && p.state.f.fTP) || (document.getElementById('fTP') || {}).value); return n ? { k: 'tp', id: n, t: 'TP' + n } : { k: 'tp', id: '', t: 'Teaching practice' }; }
    if (/^4_/.test(file)) { var fb = rd('chub:feedback'); n = tpOf((fb && fb.state && fb.state.f && fb.state.f.fTP) || (fb && fb.label) || params.get('tp')); return n ? { k: 'tp', id: n, t: 'TP' + n } : { k: 'tp', id: '', t: 'Teaching practice' }; }
    if (/^3_/.test(file)) { var tok3 = params.get('trainee') || '', nm3 = rosterName(tok3) || ((document.getElementById('fName') || {}).value || ''); n = tpOf((document.getElementById('fTP') || {}).value); return nm3 ? { k: 'trainee', id: tok3 || nm3, t: nm3, sub: n ? 'TP' + n : '' } : { k: 'tp', id: n, t: n ? 'TP' + n : 'Teaching practice' }; }
    if (/^10_/.test(file)) { var tok10 = params.get('trainee') || '', nm10 = rosterName(tok10), a10 = String(params.get('a') || '').toUpperCase(); return nm10 ? { k: 'trainee', id: tok10, t: nm10, sub: a10 } : { k: 'asg', id: a10.toLowerCase(), t: a10 || 'Assignment' }; }
    if (/^7_/.test(file)) { var tok7 = params.get('trainee') || params.get('t') || '', nm7 = rosterName(tok7); return nm7 ? { k: 'trainee', id: tok7, t: nm7 } : { k: 'page', id: '7', t: 'Trainee tracker' }; }
    if (/^9_/.test(file)) { var a9 = String(params.get('a') || '').toUpperCase(); return a9 ? { k: 'asg', id: a9.toLowerCase(), t: a9 } : { k: 'asg', id: '', t: 'Written assignments' }; }
    if (/^18_/.test(file)) return { k: 'obs', id: 'observations', t: 'Observation tasks' };
    if (/^24_/.test(file)) { n = tpOf(params.get('tp')); return n ? { k: 'tp', id: n, t: 'TP' + n } : { k: 'page', id: '24', t: 'TP points' }; }
    if (/^23_/.test(file)) return { k: 'page', id: '23', t: 'Timetable' };
    if (/^20_/.test(file)) return { k: 'page', id: '20', t: 'CELTA 5' };
    if (/^21_/.test(file)) return { k: 'page', id: '21', t: 'TP7 & TP8 planning' };
    if (/^(31_)/.test(file)) return { k: 'page', id: '31', t: 'Getting to know you' };
    if (!file || /^index\.html$/i.test(file) || /^5_/.test(file) || /^37_/.test(file)) return { k: 'day', id: today(), t: 'Today' };
    return { k: 'page', id: file.replace(/\.html?$/i, ''), t: pageTitle() || 'This page' };
  }
  function threadKey(th){ return th ? (th.k + ':' + th.id) : 'day:'; }

  /* ---- the trainee's record ---------------------------------------------- */
  function load(){ var nb = rd(KEY); if (!nb || !Array.isArray(nb.notes)) nb = { v: 1, notes: [] }; return nb; }
  var ownPill = null;
  function status(text, kind){
    if (window.HubSync) return;   // the sync layer has its own pill
    if (!ownPill) { ownPill = document.createElement('div'); ownPill.style.cssText = 'position:fixed;left:14px;bottom:var(--sync-bottom,14px);z-index:900;font:600 11px/1 Karla,sans-serif;padding:7px 11px;border-radius:999px;color:var(--paper);opacity:.85;pointer-events:none;transition:opacity .3s;'; document.body.appendChild(ownPill); }
    ownPill.textContent = text; ownPill.style.background = kind === 'error' ? 'var(--a-red)' : kind === 'demo' ? 'oklch(52% 0.098 70)' : 'var(--a-forest)'; ownPill.style.opacity = '.85';
    setTimeout(function(){ if (ownPill.textContent === text) ownPill.style.opacity = '0'; }, kind === 'demo' ? 4000 : 1800);
  }
  function save(nb){
    try { localStorage.setItem(KEY, JSON.stringify(nb)); } catch (e) {}
    if (window.HubSync) return Promise.resolve(true);   // hub-sync routes the write to the store
    if (demo()) { status('Demo · kept on this device', 'demo'); return Promise.resolve(true); }
    return S.put('notebook', nb).then(function(){ status('Saved to the course', 'ok'); return true; }, function(e){ status('Not saved — ' + ((e && e.message) || e), 'error'); throw e; });
  }

  /* ---- the tutor's list: cache first, then the store --------------------- */
  var tutor = {
    cache: function(){ var c = rd(TKEY); return (c && c.who === who()) ? c : { who: who(), mine: [], shared: [], at: 0 }; },
    keep: function(c){ try { localStorage.setItem(TKEY, JSON.stringify(c)); } catch (e) {} },
    load: function(){
      var w = who(); if (!w) return Promise.reject(new Error('no name'));
      var c = tutor.cache();
      return S.call({ op: 'tutorNotes', who: w }).then(function(r){
        if (!r || !Array.isArray(r.mine)) return c;
        /* a demo keeps its writes on the device: what this visit wrote stays over the store's list */
        var mine = r.mine.slice();
        if (demo()) (c.mine || []).forEach(function(it){ if (it && it.local && !mine.some(function(x){ return x.id === it.id; })) mine.push(it); });
        var next = { who: w, mine: mine, shared: r.shared || [], at: Date.now() };
        tutor.keep(next); return next;
      }, function(){ return c; });
    },
    put: function(item){
      var w = who(); if (!w) return Promise.reject(new Error('Say which tutor you are first'));
      var c = tutor.cache(); c.who = w;
      c.mine = (c.mine || []).filter(function(x){ return x && x.id !== item.id; }); c.mine.push(item);
      c.mine.sort(function(a, b){ return String(a.at).localeCompare(String(b.at)); });
      if (demo()) item.local = true;
      tutor.keep(c);
      return S.call({ op: 'putTutorNote', who: w, item: item }).then(function(r){
        if (r && r.demo) { status('Demo · kept on this device', 'demo'); return c; }
        if (r && Array.isArray(r.mine)) { c.mine = r.mine; tutor.keep(c); }
        status('Saved to the course', 'ok'); return c;
      }, function(e){ status('Not saved — ' + ((e && e.message) || e), 'error'); throw e; });
    },
    drop: function(id){
      var w = who(); var c = tutor.cache();
      c.mine = (c.mine || []).filter(function(x){ return x && x.id !== id; }); tutor.keep(c);
      return S.call({ op: 'dropTutorNote', who: w, id: id }).then(function(r){ if (r && Array.isArray(r.mine)) { c.mine = r.mine; tutor.keep(c); } return c; }, function(){ return c; });
    }
  };

  /* ---- a voice note ------------------------------------------------------- */
  function b64(blob){ return new Promise(function(res, rej){ var r = new FileReader(); r.onload = function(){ res(String(r.result).split(',')[1] || ''); }; r.onerror = rej; r.readAsDataURL(blob); }); }
  function dataURL(blob){ return new Promise(function(res, rej){ var r = new FileReader(); r.onload = function(){ res(String(r.result)); }; r.onerror = rej; r.readAsDataURL(blob); }); }
  function mimePick(){
    var c = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
    for (var i = 0; i < c.length; i++) { try { if (window.MediaRecorder && MediaRecorder.isTypeSupported(c[i])) return c[i]; } catch (e) {} }
    return '';
  }
  /* The bytes go up when the note is saved: in a demo, or offline, they stay in the note as a data URL. */
  function upload(blob, seconds){
    if (demo()) return dataURL(blob).then(function(u){ return { local: u, seconds: seconds, mime: blob.type }; });
    return b64(blob).then(function(bytes){
      var body = { op: 'putNoteAudio', bytes: bytes, type: blob.type, seconds: seconds };
      if (MODE === 'trainee') body.token = S.token(); else body.who = who();
      return S.call(body, 120000).then(function(r){ return { id: r.id, seconds: seconds, mime: blob.type }; });
    });
  }
  var heard = {};
  function play(note, slot, btn){
    var a = note && note.audio; if (!a || !slot) return;
    function show(url){ slot.innerHTML = ''; var el = document.createElement('audio'); el.controls = true; el.src = url; el.style.cssText = 'display:block;width:100%;margin-top:6px;max-width:420px'; slot.appendChild(el); el.play().catch(function(){}); if (btn) { btn.textContent = 'Listen again'; btn.disabled = false; } }
    if (a.local) { show(a.local); return; }
    if (heard[a.id]) { show(heard[a.id]); return; }
    if (btn) { btn.disabled = true; btn.textContent = 'Loading…'; }
    var body = { op: 'getNoteAudio', id: a.id }; if (MODE === 'trainee') body.token = S.token(); else body.who = who();
    S.call(body, 90000).then(function(r){
      var bin = atob(r.bytes), n = bin.length, u8 = new Uint8Array(n); for (var i = 0; i < n; i++) u8[i] = bin.charCodeAt(i);
      heard[a.id] = URL.createObjectURL(new Blob([u8], { type: r.type || a.mime || 'audio/webm' })); show(heard[a.id]);
    }, function(e){ if (btn) { btn.textContent = 'Listen'; btn.disabled = false; } slot.textContent = (e && e.message) || 'Could not load the recording'; });
  }
  function secs(n){ n = Math.round(n || 0); return Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0'); }

  /* ---- the mark's first arc, and the two linked ---------------------------- */
  function arcSVG(two, size){
    var s = size || 22;
    return two
      /* the two linked arcs wear the mark's own colours, gold then ink (Ramy, 25 Oct 2026: "make sure the colours are right") */
      ? '<svg viewBox="8 28 104 64" width="' + Math.round(s * 1.6) + '" height="' + s + '" fill="none" aria-hidden="true"><path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="var(--a-mustard)" stroke-width="13" stroke-linecap="round"></path><path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="var(--ink)" stroke-width="13" stroke-linecap="round"></path></svg>'
      : '<svg viewBox="8 28 56 64" width="' + Math.round(s * 0.88) + '" height="' + s + '" fill="none" aria-hidden="true"><path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="currentColor" stroke-width="13" stroke-linecap="round"></path></svg>';
  }

  /* ---- the sheet ----------------------------------------------------------- */
  var CSS = ''
    + '.nbk-arc{position:fixed;box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent;right:18px;bottom:var(--nbk-bottom,var(--sync-bottom,16px));z-index:880;width:52px;height:52px;border-radius:50%;border:0;background:var(--a-forest);color:var(--paper);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 4px rgba(35,34,32,.1),0 14px 30px -12px rgba(35,34,32,.45);transition:transform .16s ease,box-shadow .16s ease,background-color .16s ease;background-image:linear-gradient(180deg,rgba(255,255,255,.1),transparent 60%);}'
    + '.nbk-arc:focus-visible{outline:3px solid var(--a-gold-ink);outline-offset:2px;}'
    + '.nbk-arc:hover{transform:translateY(-3px);background-color:var(--a-forest-2);box-shadow:0 2px 4px rgba(35,34,32,.1),0 20px 36px -14px rgba(35,34,32,.5) !important;}'
    + '.nbk-arc svg{display:block;}'
    + '.nbk-arc .nbk-n{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;border-radius:10px;background:var(--paper);color:var(--a-forest);font:700 11px/20px Karla,sans-serif;text-align:center;padding:0 5px;box-shadow:0 1px 3px rgba(35,34,32,.25);}'
    + '.nbk-back{position:fixed;inset:0;z-index:8900;background:rgba(35,34,32,.28);opacity:0;transition:opacity .2s;}'
    + '.nbk-back.on{opacity:1;}'
    + '.nbk-sheet{position:fixed;top:0;right:0;bottom:0;width:440px;max-width:100vw;z-index:8901;background:var(--paper);color:var(--ink);box-shadow:-10px 0 40px -18px rgba(35,34,32,.4);font-family:Karla,Helvetica,sans-serif;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .22s cubic-bezier(.2,.7,.2,1);}'
    + '.nbk-sheet.on{transform:none;}'
    + '.nbk-sheet .nbk-head{padding:18px 22px 10px;display:flex;align-items:flex-start;gap:12px;}'
    + '.nbk-sheet .nbk-eyebrow{font:600 10.5px/1 "Instrument Sans",Karla,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--a-red);margin:0 0 8px;}'
    + '.nbk-sheet h2{margin:0;font:400 1.55rem/1.15 Newsreader,Georgia,serif;color:var(--ink);}'
    + '.nbk-sheet .nbk-where{margin:6px 0 0;font-size:.86rem;color:var(--grey);display:flex;gap:8px;align-items:center;flex-wrap:wrap;}'
    + '.nbk-chip{display:inline-block;font:700 10.5px/1 Karla,sans-serif;letter-spacing:.1em;text-transform:uppercase;padding:5px 9px;border-radius:7px;background:var(--sand);color:var(--ink);}'
    + '.nbk-chip.tp,.nbk-chip.trainee{background:var(--a-red);color:var(--paper);} .nbk-chip.input{background:var(--a-forest);color:var(--paper);} .nbk-chip.asg{background:var(--a-navy);color:var(--paper);} .nbk-chip.obs{background:var(--a-slate);color:var(--paper);}'
    + '.nbk-x{margin-left:auto;flex:none;width:34px;height:34px;border-radius:50%;border:0;background:var(--sand);color:var(--ink);font-size:18px;line-height:34px;cursor:pointer;} .nbk-x:hover{background:var(--sand-deep);}'
    + '.nbk-body{padding:4px 22px 18px;overflow:auto;flex:1;}'
    + '.nbk-carry{background:color-mix(in oklab, var(--a-lemon) 32%, var(--paper));border-radius:12px;padding:12px 14px;margin:6px 0 14px;font-size:.88rem;line-height:1.5;}'
    + '.nbk-carry b{display:block;font:600 10.5px/1 Karla,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--grey);margin-bottom:6px;}'
    + '.nbk-carry ul{margin:0 0 6px;padding-left:18px;} .nbk-carry li{margin:2px 0;} .nbk-carry .q{margin:0;font-style:italic;color:var(--a-forest);font-family:Newsreader,Georgia,serif;font-size:1rem;}'
    + '.nbk-sheet textarea{width:100%;box-sizing:border-box;min-height:150px;resize:vertical;font:400 1rem/1.55 Karla,sans-serif;color:var(--ink);background:var(--paper);border:1.5px solid var(--sand-line);border-radius:10px;padding:12px 14px;}'
    + '.nbk-sheet textarea:focus{outline:none;border-color:var(--a-forest);box-shadow:0 0 0 3px rgba(30,59,47,.12);}'
    + '.nbk-sheet input.nbk-name{width:100%;box-sizing:border-box;font:400 1rem/1.4 Karla,sans-serif;border:1.5px solid var(--sand-line);border-radius:10px;padding:10px 14px;margin:0 0 12px;}'
    + '.nbk-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px;}'
    + '.nbk-btn{font:700 .88rem Karla,sans-serif;padding:11px 18px;border-radius:10px;border:0;cursor:pointer;background:var(--paper);color:var(--ink);box-shadow:0 1px 2px rgba(35,34,32,.05),0 10px 30px -14px rgba(35,34,32,.18);}'
    + '.nbk-btn:hover{color:var(--a-forest);} .nbk-btn:disabled{opacity:.5;cursor:default;}'
    + '.nbk-btn.go{background:var(--a-forest);color:var(--paper);background-image:linear-gradient(180deg,rgba(255,255,255,.08),transparent 60%);} .nbk-btn.go:hover{background-color:var(--a-forest-2);color:var(--paper);}'
    + '.nbk-btn.rec{display:inline-flex;align-items:center;gap:8px;} .nbk-btn.rec .dot{width:9px;height:9px;border-radius:50%;background:var(--a-red);display:inline-block;}'
    + '.nbk-btn.rec.on{background:var(--a-red);color:var(--paper);} .nbk-btn.rec.on .dot{background:var(--paper);animation:nbkpulse 1s infinite;}'
    + '@keyframes nbkpulse{0%,100%{opacity:1}50%{opacity:.35}}'
    + '.nbk-audio{margin-top:10px;font-size:.84rem;color:var(--grey);display:flex;gap:10px;align-items:center;flex-wrap:wrap;} .nbk-audio audio{display:block;width:100%;}'
    + '.nbk-audio .rm{font:600 .8rem Karla,sans-serif;background:none;border:0;color:var(--grey);text-decoration:underline;cursor:pointer;padding:0;}'
    + '.nbk-earlier{margin-top:22px;border-top:1px solid var(--row-line);padding-top:12px;}'
    + '.nbk-earlier h3{margin:0 0 8px;font:600 10.5px/1 Karla,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--grey);}'
    + '.nbk-earlier p{margin:0 0 8px;font-size:.88rem;line-height:1.5;color:var(--ink);} .nbk-earlier p small{display:block;color:var(--grey);font-size:.76rem;margin-bottom:2px;}'
    + '.nbk-foot{padding:12px 22px 18px;border-top:1px solid var(--row-line);font-size:.84rem;color:var(--grey);display:flex;justify-content:space-between;gap:12px;align-items:center;}'
    + '.nbk-foot a{color:var(--a-forest);font-weight:700;text-decoration:none;} .nbk-foot a:hover{text-decoration:underline;}'
    + '.nbk-saved{color:var(--a-forest);font-weight:700;}'
    + '@media (max-width:560px){.nbk-sheet{top:auto;left:0;width:100%;max-height:88vh;border-radius:16px 16px 0 0;transform:translateY(100%);} .nbk-sheet.on{transform:none;} .nbk-arc{width:48px;height:48px;right:14px;}}'
    + '@media (prefers-reduced-motion:reduce){.nbk-sheet,.nbk-back,.nbk-arc{transition:none;}}'
    + '@media print{.nbk-arc,.nbk-sheet,.nbk-back{display:none !important;}}';
  function css(){ if (document.getElementById('nbk-css')) return; var st = document.createElement('style'); st.id = 'nbk-css'; st.textContent = CSS; document.head.appendChild(st); }

  /* The returned feedback of the TP before this one, for a trainee writing about TP n: the tutor's
     action points, carried forward, with the one question that matters. */
  function stripTags(h){ var d = document.createElement('div'); d.innerHTML = String(h || ''); d.querySelectorAll('.tag').forEach(function(t){ t.remove(); }); return d.textContent.replace(/\s+/g, ' ').trim(); }
  function actionPoints(n){
    var h = rd('chub:tpHistory') || {}, live = rd('chub:feedback');
    var e = h[n] || ((live && tpOf((live.state && live.state.f && live.state.f.fTP) || live.label) === String(n)) ? live : null);
    var l = e && e.state && e.state.lists && e.state.lists.lAP; if (!l || !l.length) return null;
    return l.map(function(x){ return stripTags(x.html); }).filter(Boolean);
  }
  function carryHTML(th){
    if (MODE !== 'trainee' || !th || th.k !== 'tp' || !th.id) return '';
    var prev = String(+th.id - 1); if (+prev < 1) return '';
    var pts = actionPoints(prev); if (!pts) return '';
    return '<div class="nbk-carry"><b>Action points from TP' + esc(prev) + '</b><ul>' + pts.map(function(p){ return '<li>' + esc(p) + '</li>'; }).join('') + '</ul><p class="q">What will you try this time?</p></div>';
  }

  var sheet = null, back = null, rec = null, recBlob = null, recSecs = 0, recTimer = null, recStream = null;
  function close(){
    if (!sheet) return;
    stopRec();
    sheet.classList.remove('on'); back.classList.remove('on');
    setTimeout(function(){ if (sheet) { sheet.remove(); back.remove(); sheet = null; back = null; } }, 230);
  }
  function stopRec(){ try { if (rec && rec.state !== 'inactive') rec.stop(); } catch (e) {} if (recStream) { recStream.getTracks().forEach(function(t){ t.stop(); }); recStream = null; } clearInterval(recTimer); }
  function notesInThread(th){
    var key = threadKey(th);
    if (MODE === 'trainee') return load().notes.filter(function(n){ return threadKey(n.thread) === key; });
    return (tutor.cache().mine || []).filter(function(n){ return threadKey(n.thread) === key; });
  }
  function open(th){
    th = th || context(); css();
    if (sheet) close();
    back = document.createElement('div'); back.className = 'nbk-back'; back.addEventListener('click', close);
    sheet = document.createElement('aside'); sheet.className = 'nbk-sheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'A new note');
    var d = today(), needName = MODE === 'tutor' && !who();
    var earlier = notesInThread(th).slice(-3).reverse();
    sheet.innerHTML = '<div class="nbk-head"><div><p class="nbk-eyebrow">Your notebook</p><h2>' + esc(dayLabel(d, true)) + '</h2>'
      + '<div class="nbk-where">' + (th.k === 'day' ? '<span>A note for the day</span>' : '<span class="nbk-chip ' + esc(th.k) + '">' + esc(th.t) + '</span>' + (th.sub ? '<span>' + esc(th.sub) + '</span>' : '')) + '</div></div>'
      + '<button type="button" class="nbk-x" aria-label="Close">&times;</button></div>'
      + '<div class="nbk-body">'
      + (needName ? '<p style="margin:0 0 6px;font-size:.88rem;color:var(--grey)">The notebook is yours alone, so it needs your name once: the same one the dashboard asks for.</p><input class="nbk-name" type="text" placeholder="Your name" autocomplete="name">' : '')
      + carryHTML(th)
      + '<textarea placeholder="' + (th.k === 'input' ? 'What you want to remember from this session.' : th.k === 'tp' ? 'What you noticed. What to try.' : 'Write it down.') + '" aria-label="Your note"></textarea>'
      + '<div class="nbk-row">' + (mimePick() && navigator.mediaDevices ? '<button type="button" class="nbk-btn rec"><span class="dot"></span><span class="lbl">Record a voice note</span></button>' : '') + '<button type="button" class="nbk-btn go" disabled>Save the note</button></div>'
      + '<div class="nbk-audio" hidden></div>'
      + (earlier.length ? '<div class="nbk-earlier"><h3>Earlier in this thread</h3>' + earlier.map(function(n){ return '<p><small>' + esc(dayLabel(n.day)) + (n.audio ? ' · voice note' : '') + '</small>' + esc(String(n.text || '').slice(0, 220)) + (String(n.text || '').length > 220 ? '…' : '') + '</p>'; }).join('') + '</div>' : '')
      + '</div>'
      + '<div class="nbk-foot"><span class="nbk-msg">' + (MODE === 'trainee' ? 'Yours alone, unless you connect it.' : 'Yours alone, unless you connect it to the other tutors.') + '</span><a href="' + (location.pathname.indexOf('/input-sessions/') !== -1 ? '../../' : '') + '37_notebook.html">Open your notebook</a></div>';
    document.body.appendChild(back); document.body.appendChild(sheet);
    requestAnimationFrame(function(){ back.classList.add('on'); sheet.classList.add('on'); });
    var ta = sheet.querySelector('textarea'), go = sheet.querySelector('.nbk-btn.go'), rb = sheet.querySelector('.nbk-btn.rec'), au = sheet.querySelector('.nbk-audio'), nm = sheet.querySelector('.nbk-name'), msg = sheet.querySelector('.nbk-msg');
    sheet.querySelector('.nbk-x').addEventListener('click', close);
    function ready(){ go.disabled = !(ta.value.trim() || recBlob) || (nm && !nm.value.trim()); }
    ta.addEventListener('input', ready); if (nm) nm.addEventListener('input', ready);
    setTimeout(function(){ (nm || ta).focus(); }, 240);
    recBlob = null; recSecs = 0;
    if (rb) rb.addEventListener('click', function(){
      if (rec && rec.state === 'recording') { stopRec(); return; }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream){
        recStream = stream; var chunks = [], type = mimePick();
        rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
        rec.ondataavailable = function(e){ if (e.data && e.data.size) chunks.push(e.data); };
        rec.onstop = function(){
          recBlob = new Blob(chunks, { type: rec.mimeType || type || 'audio/webm' });
          rb.classList.remove('on'); rb.querySelector('.lbl').textContent = 'Record again';
          au.hidden = false; au.innerHTML = '<span>Voice note, ' + secs(recSecs) + '</span><button type="button" class="rm">Remove</button><audio controls src="' + URL.createObjectURL(recBlob) + '"></audio>';
          au.querySelector('.rm').addEventListener('click', function(){ recBlob = null; recSecs = 0; au.hidden = true; au.innerHTML = ''; rb.querySelector('.lbl').textContent = 'Record a voice note'; ready(); });
          ready();
        };
        var t0 = Date.now(); recSecs = 0;
        rec.start(250); rb.classList.add('on'); rb.querySelector('.lbl').textContent = 'Stop · 0:00';
        recTimer = setInterval(function(){ recSecs = Math.round((Date.now() - t0) / 1000); rb.querySelector('.lbl').textContent = 'Stop · ' + secs(recSecs); if (recSecs >= MAX_SECONDS) stopRec(); }, 250);
      }, function(){ msg.textContent = 'The microphone was not allowed. Type the note instead.'; });
    });
    go.addEventListener('click', function(){
      if (go.disabled) return;
      if (nm) { try { localStorage.setItem('chub:tutorName', nm.value.trim()); } catch (e) {} }
      go.disabled = true; go.textContent = 'Saving…';
      /* a day's thread is named by its date, so the page never reads "Today" for a day that has gone */
      var note = { id: newId(), at: nowISO(), day: d, thread: { k: th.k, id: th.id, t: th.k === 'day' ? dayLabel(d) : th.t }, text: ta.value.trim() };
      if (th.sub) note.thread.sub = th.sub;
      var where = location.pathname.split('/').slice(-2).join('/') + location.search; note.where = where.slice(0, 200);
      var ready2 = recBlob ? upload(recBlob, recSecs).then(function(a){ note.audio = a; }) : Promise.resolve();
      ready2.then(function(){
        if (MODE === 'trainee') { var nb = load(); nb.notes.push(note); return save(nb); }
        note.by = who(); return tutor.put(note);
      }).then(function(){
        msg.innerHTML = '<span class="nbk-saved">Saved.</span> It is in your notebook, under ' + esc(dayLabel(d)) + (th.k !== 'day' ? ' and ' + esc(th.t) : '') + '.';
        go.textContent = 'Saved'; ta.value = ''; recBlob = null; au.hidden = true; au.innerHTML = ''; if (rb) rb.querySelector('.lbl').textContent = 'Record a voice note';
        paintCount(); setTimeout(close, 1400);
      }, function(e){ go.disabled = false; go.textContent = 'Save the note'; msg.textContent = 'Not saved — ' + ((e && e.message) || e); });
    });
    document.addEventListener('keydown', function esc_(e){ if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc_); } });
  }

  /* ---- the arc in the corner ------------------------------------------------ */
  var arc = null;
  function countToday(){
    var d = today();
    var list = MODE === 'trainee' ? load().notes : (tutor.cache().mine || []);
    return list.filter(function(n){ return n && n.day === d; }).length;
  }
  function paintCount(){ if (!arc) return; var n = countToday(); var b = arc.querySelector('.nbk-n'); if (n) { if (!b) { b = document.createElement('span'); b.className = 'nbk-n'; arc.appendChild(b); } b.textContent = n; } else if (b) b.remove(); }
  /* The arc rides above whatever else is fixed in the bottom-right corner: the dictation bar on the
     writing screens, an action bar, the page's own say-something pill. Measured, not guessed. */
  function place(){
    if (!arc) return;
    var vh = window.innerHeight, vw = window.innerWidth, bottom = 16;
    try {
      var root = document.documentElement, sb = parseFloat(getComputedStyle(root).getPropertyValue('--sync-bottom')) || 0; if (sb) bottom = Math.max(bottom, sb);
      document.querySelectorAll('.dictbar, .actionbar, .say-pill, .install-chip, .install-hint, #hubAkBack').forEach(function(el){
        if (el === arc) return; var cs = getComputedStyle(el); if (cs.position !== 'fixed' || cs.display === 'none' || cs.visibility === 'hidden') return;
        var r = el.getBoundingClientRect(); if (!r.height || r.right < vw - 260 || r.top > vh) return;
        bottom = Math.max(bottom, vh - r.top + 12);
      });
    } catch (e) {}
    arc.style.setProperty('--nbk-bottom', Math.ceil(bottom) + 'px');
  }
  function mount(){
    if (arc || document.querySelector('.nbk-arc')) return;
    if (document.body.hasAttribute('data-no-notebook')) return;
    css();
    /* not a <button>: a turned-in plan disables every button on its page, and the shared hover rules
       wash every button; the arc is its own thing, with a button's role and keys */
    arc = document.createElement('span'); arc.className = 'nbk-arc'; arc.setAttribute('role', 'button'); arc.tabIndex = 0; arc.setAttribute('aria-label', 'Write a note in your notebook'); arc.title = 'Write a note';
    arc.innerHTML = arcSVG(false, 24);
    arc.addEventListener('click', function(){ open(context()); });
    arc.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(context()); } });
    document.body.appendChild(arc);
    paintCount(); place();
    window.addEventListener('resize', place); window.addEventListener('orientationchange', place);
    setTimeout(place, 600); setTimeout(place, 2500);
    document.addEventListener('hub:ready', function(){ setTimeout(place, 50); paintCount(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();

  window.HubNotebook = { mode: MODE, context: context, open: open, load: load, save: save, tutor: tutor, play: play, arc: arcSVG, who: who, today: today, dayLabel: dayLabel, timeLabel: timeLabel, threadKey: threadKey, actionPoints: actionPoints, newId: newId, nowISO: nowISO, secs: secs, place: place, count: paintCount };
})();
