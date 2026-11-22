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
        if (!r || !Array.isArray(r.mine)) return tutor.cache();
        /* a demo keeps its writes on the device: what this visit wrote stays over the store's list.
           The cache is read again HERE, not when the call went out: a note written or connected while
           the store was answering was otherwise overwritten by the older copy (25 Oct 2026). */
        var mine = r.mine.slice(), cur = tutor.cache();
        if (demo()) (cur.mine || []).forEach(function(it){ if (it && it.local) { mine = mine.filter(function(x){ return x.id !== it.id; }); mine.push(it); } });
        mine.sort(function(a, b){ return String(a.at).localeCompare(String(b.at)); });
        var next = { who: w, mine: mine, shared: r.shared || [], at: Date.now() };
        tutor.keep(next); return next;
      }, function(){ return tutor.cache(); });
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
      /* the two linked arcs wear the mark's own colors, gold then ink (Ramy, 25 Oct 2026: "make sure the colors are right") */
      ? '<svg viewBox="8 28 104 64" width="' + Math.round(s * 1.6) + '" height="' + s + '" fill="none" aria-hidden="true"><path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="var(--a-mustard)" stroke-width="13" stroke-linecap="round"></path><path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="var(--ink)" stroke-width="13" stroke-linecap="round"></path></svg>'
      : '<svg viewBox="8 28 56 64" width="' + Math.round(s * 0.88) + '" height="' + s + '" fill="none" aria-hidden="true"><path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="currentColor" stroke-width="13" stroke-linecap="round"></path></svg>';
  }

  /* ---- the sheet ----------------------------------------------------------- */
  var CSS = ''
    + '.nbk-arc{position:fixed;box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent;right:18px;bottom:var(--nbk-bottom,var(--sync-bottom,16px));z-index:880;width:52px;height:52px;border-radius:50%;border:0;background:var(--a-forest);color:var(--paper);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 4px rgba(35,34,32,.1),0 14px 30px -12px rgba(35,34,32,.45);transition:transform .16s ease,box-shadow .16s ease,background-color .16s ease;background-image:linear-gradient(180deg,rgba(255,255,255,.1),transparent 60%);}'
    + '@media screen and (max-width:560px){body{padding-bottom:calc(var(--nbk-bottom,var(--sync-bottom,16px)) + 60px);}}'   /* room under the last line, so the page can scroll its last button clear of this one (12 Nov 2026) */
    + '.nbk-arc:focus-visible{outline:3px solid var(--a-gold-ink);outline-offset:2px;}'
    /* OUT OF THE WAY (Ramy, 4 Nov 2026: the pen sat over the lunch tile and a field label on a phone). While the page
       scrolls, and while a field has the keyboard, the arc tucks to the edge, a third of it showing; it comes back when
       the scrolling stops or the field is left, and a tap on the tucked edge opens it as ever. */
    + '.nbk-arc.nbk-tuck{transform:translateX(66%) !important;opacity:.72;}'
    + '.nbk-arc.nbk-tuck:hover{transform:translateX(0) !important;opacity:1;}'
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
    + '.nbk-who{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:12px;font-size:.84rem;color:var(--grey);}'
    + '.nbk-who button{font:700 .82rem Karla,sans-serif;padding:8px 13px;border-radius:999px;border:1.5px solid var(--sand-line);background:var(--paper);color:var(--ink);cursor:pointer;}'
    + '.nbk-who button:hover{border-color:var(--a-forest);} .nbk-who button.on{background:var(--a-forest);border-color:var(--a-forest);color:var(--paper);}'
    + '.nbk-mail{font:700 .86rem Karla,sans-serif;color:var(--a-forest);text-decoration:none;padding:11px 4px;} .nbk-mail:hover{text-decoration:underline;} .nbk-mail.off{color:var(--grey);cursor:default;text-decoration:none;}'
    + '.nbk-foot{padding:12px 22px 18px;border-top:1px solid var(--row-line);font-size:.84rem;color:var(--grey);display:flex;justify-content:space-between;gap:12px;align-items:center;}'
    + '.nbk-foot a{color:var(--a-forest);font-weight:700;text-decoration:none;} .nbk-foot a:hover{text-decoration:underline;}'
    + '.nbk-saved{color:var(--a-forest);font-weight:700;}'
    /* the one sheet (22 Nov 2026) */
    + '.nbk-sheet .nbk-head{align-items:center;padding:16px 20px 8px;} .nbk-ctx{margin:0;font-size:.9rem;color:var(--grey);flex:1;min-width:0;} .nbk-ctx b{color:var(--a-forest);}'
    + '.nbk-book{font:700 .8rem Karla,sans-serif;color:var(--a-forest);text-decoration:none;white-space:nowrap;} .nbk-book:hover{text-decoration:underline;}'
    + '.nbk-sheet .nbk-body{padding:4px 20px 16px;} .nbk-sheet .nbk-body > textarea{min-height:120px;border:0;background:var(--sand);border-radius:12px;}'
    + '.nbk-who{margin-top:12px;gap:6px;} .nbk-who button{padding:9px 13px;} .nbk-pick{font:600 .86rem Karla,sans-serif;padding:8px 10px;border-radius:999px;border:1.5px solid var(--sand-line);background:var(--paper);color:var(--ink);max-width:100%;}'
    + '.nbk-row{flex-wrap:nowrap;} .nbk-row .nbk-btn.go{flex:1;border-radius:999px;background:var(--a-lemon);color:var(--ink);background-image:none;padding:13px 18px;font-size:.95rem;} .nbk-row .nbk-btn.go:hover{background:var(--a-lemon);color:var(--ink);filter:brightness(.97);}'
    + '.nbk-row .nbk-btn.rec{border-radius:999px;border:1.5px solid var(--sand-line);box-shadow:none;padding:11px 14px;}'
    + '.nbk-msg{margin:10px 0 0;font-size:.84rem;color:var(--grey);min-height:1em;} .nbk-msg:empty{display:none;}'
    + '.nbk-talk{display:flex;flex-direction:column;} .nbk-thread{display:flex;flex-direction:column;gap:6px;margin-top:auto;}'
    + '.nbk-m{max-width:84%;padding:9px 12px;border-radius:14px;font-size:.93rem;line-height:1.42;white-space:pre-wrap;word-wrap:break-word;background:var(--sand);border-bottom-left-radius:4px;align-self:flex-start;}'
    + '.nbk-m.me{align-self:flex-end;background:var(--a-forest);color:var(--paper);border-radius:14px;border-bottom-right-radius:4px;} .nbk-m i{display:block;font-style:normal;font-size:.7rem;opacity:.72;margin-top:3px;}'
    + '.nbk-hear{display:block;margin-top:6px;font:700 .78rem Karla,sans-serif;padding:5px 10px;border-radius:999px;border:0;background:var(--paper);color:var(--ink);cursor:pointer;} .nbk-m .slot audio{max-width:100%;}'
    + '.nbk-none{color:var(--grey);font-size:.88rem;margin:0;}'
    + '.nbk-reply{display:flex;gap:8px;align-items:flex-end;padding:10px 20px 6px;border-top:1px solid var(--row-line);} .nbk-reply textarea{flex:1;min-height:0;border:0;background:var(--sand);border-radius:12px;padding:10px 12px;resize:none;}'
    + '.nbk-reply .nbk-btn.go{border-radius:999px;background:var(--a-lemon);color:var(--ink);background-image:none;padding:11px 18px;} .nbk-reply + .nbk-msg{padding:0 20px 12px;margin:0;}'
    + '@media (max-width:560px){.nbk-sheet{top:auto;left:0;width:100%;max-height:88vh;border-radius:16px 16px 0 0;transform:translateY(100%);} .nbk-sheet.on{transform:none;} .nbk-arc{width:48px;height:48px;right:14px;}}'
    + '@media (prefers-reduced-motion:reduce){.nbk-sheet,.nbk-back,.nbk-arc{transition:none;}}'
    + '@media print{.nbk-arc,.nbk-sheet,.nbk-back{display:none !important;}}';
  function css(){ if (document.getElementById('nbk-css')) return; var st = document.createElement('style'); st.id = 'nbk-css'; st.textContent = CSS; document.head.appendChild(st); }

  /* The returned feedback of the TP before this one, for a trainee writing about TP n: the tutor's
     action points, carried forward, with the one question that matters. */
  function stripTags(h){ var d = document.createElement('div'); d.innerHTML = String(h || ''); d.querySelectorAll('.tag').forEach(function(t){ t.remove(); }); return d.textContent.replace(/\s+/g, ' ').trim(); }
  function actionPoints(n){
    var held = window.hubHeldTp ? window.hubHeldTp() : 0;
    if (held && (held < 0 || String(held) === String(parseInt(n, 10)))) return null;   // that TP's feedback is not theirs to read yet (19 Nov 2026)
    var h = rd('chub:tpHistory') || {}, live = rd('chub:feedback');
    var e = h[n] || ((live && tpOf((live.state && live.state.f && live.state.f.fTP) || live.label) === String(n)) ? live : null);
    var l = e && e.state && e.state.lists && e.state.lists.lAP; if (!l || !l.length) return null;
    return l.map(function(x){ return stripTags(x.html); }).filter(Boolean);
  }
  /* the tutor to email: with classes, the class's tutor today; else every tutor (the same rule as the notebook page) */
  function tutorEmails(){
    var cs = rd('connect_course_settings') || {}, me = rd('hub:me') || {};
    try { var own = (window.hubClassPlan && hubClassPlan(cs, me.group) && window.hubTutorOn && window.hubTutorContact) ? hubTutorContact(cs, hubTutorOn(cs, me.group)) : null; if (own && own.email) return [own.email]; } catch (e) {}
    return (cs.tutorContacts || []).map(function(c){ return c && c.email; }).filter(Boolean);
  }
  function carryHTML(th){
    if (MODE !== 'trainee' || !th || th.k !== 'tp' || !th.id) return '';
    var prev = String(+th.id - 1); if (+prev < 1) return '';
    var pts = actionPoints(prev); if (!pts) return '';
    return '<div class="nbk-carry"><b>Action points from TP' + esc(prev) + '</b><ul>' + pts.map(function(p){ return '<li>' + esc(p) + '</li>'; }).join('') + '</ul><p class="q">What will you try this time?</p></div>';
  }

  /* ---- ONE SHEET, ONE STEP (Ramy, 22 Nov 2026: "the notebook and the message system ... needs to be one thing ... too
     many steps"; mock-up docs/mockups/notebook-and-feedback-2026-11-22/notebook.html). The arc opens a sheet over the
     page: write, tap who it is for, press one button, and the button says what it will do. A note that goes to someone
     does not close the sheet: it turns into the conversation with them, so a word back can go straight away.
     No new store op: a trainee never starts a note to a tutor (they answer one, with replyNote; see peers below); the
     tutor's note to a trainee is tutorConnectNote, sharing with the TP group or the course is
     shareNote, tutor to tutor is the shared flag.
     TAKEN OFF THE SHEET: the date as a heading, the box of action points from the TP before, "Email it to my tutor" (a
     note now reaches the tutor inside Lite; the email link stays on the notebook page), "Earlier in this thread", and
     the sentence at the foot. ---- */
  function first(n){ return String(n || '').trim().split(/\s+/)[0] || ''; }
  function same(a, b){ return String(a || '').trim().toLowerCase().replace(/\s+/g, ' ') === String(b || '').trim().toLowerCase().replace(/\s+/g, ' '); }
  function tutorNames(){ var cs = settings(); try { if (window.hubTutorNames) return window.hubTutorNames(cs) || []; } catch (e) {} return String(cs.tutorNames || '').split(/[,\n;]+/).map(function(x){ return x.trim(); }).filter(Boolean); }
  function otherTutorNames(){ var me = who(); return tutorNames().filter(function(n){ return !same(n, me); }); }
  function rosterList(){ var r = rd('connect_roster_v1'); return Object.keys((r && r.trainees) || {}).map(function(k){ var t = r.trainees[k] || {}; return { token: t.token || k, name: String(t.name || ''), group: String(t.group || '') }; }).filter(function(t){ return t.name; }).sort(function(a, b){ return a.name.localeCompare(b.name); }); }
  /* who a note can be for, as the chips of the sheet */
  function peers(th){
    if (MODE === 'trainee') {
      /* A TRAINEE DOES NOT START A NOTE TO A TUTOR (Ramy, 25 Oct 2026, and again 22 Nov 2026: "I don't want him messaging
         the tutor. They can message each other ... within the TP group. But the tutor can message them, and they can
         reply"). The tutor names were on this row for an hour on 22 Nov; they are off. */
      return [{ k: '', label: 'Only me' }, { k: 'group', label: 'My TP group' }, { k: 'course', label: 'Whole course' }];
    }
    var out = [{ k: '', label: 'Only me' }], others = otherTutorNames();
    out.push({ k: 'tutors', name: others.join(' and '), label: others.length ? others.map(first).join(' and ') : 'The other tutors' });
    if (th && th.k === 'trainee' && th.id) { var row = rosterList().filter(function(t){ return t.token === th.id; })[0] || { token: th.id, name: th.t, group: '' };
      out.push({ k: 'trainee', to: row.token, name: row.name, label: first(row.name) }); if (row.group) out.push({ k: 'tgroup', group: row.group, label: 'TP group ' + row.group }); }
    else if (rosterList().length) out.push({ k: 'pick', label: 'A trainee' });
    return out;
  }
  function goLabel(p){ return !p || !p.k ? 'Save' : p.k === 'group' ? 'Share with my TP group' : p.k === 'course' ? 'Share with the whole course' : p.k === 'tgroup' ? 'Send to ' + p.label : 'Send to ' + (p.label || 'my tutor'); }
  function peerTitle(p){ return p.k === 'group' ? 'My TP group' : p.k === 'course' ? 'The whole course' : p.k === 'tgroup' ? 'TP group ' + p.group : (p.name || p.label || 'My tutor'); }
  function peerKey(p){ return p.k + ':' + (p.k === 'trainee' ? p.to : p.k === 'tgroup' ? p.group : p.k === 'tutor' ? String(p.name || '').toLowerCase() : ''); }
  /* the conversation with one audience, oldest first, put together from the records both sides already hold */
  function messages(p){
    var out = [], add = function(me, n, text, at, by){ out.push({ me: me, text: text == null ? n.text : text, at: at || n.at, by: by || n.by || '', audio: text == null ? n.audio : null, note: n }); };
    if (MODE === 'trainee') {
      var mineN = load().notes, got = rd('connect_notes_v1') || [];
      if (p.k === 'tutor') {
        mineN.forEach(function(n){ if (n && n.sent && n.sent.scope === 'tutor' && (!p.name || same(n.sent.name, p.name))) add(true, n); });
        got.forEach(function(n){ if (!n || !n.fromTutor || n.scope !== 'trainee' || (p.name && !same(n.by, p.name))) return; add(false, n);
          (n.replies || []).forEach(function(r){ add(true, n, r.text, r.at, 'You'); }); });
      } else {
        mineN.forEach(function(n){ if (n && n.shared === p.k) add(true, n); });
        got.forEach(function(n){ if (n && n.scope === p.k) { add(false, n, null, null, (n.by || 'Someone') + (n.fromTutor ? ', tutor' : '')); (n.replies || []).forEach(function(r){ add(true, n, r.text, r.at, 'You'); }); } });
      }
    } else {
      var c = tutor.cache(), mineT = c.mine || [];
      if (p.k === 'tutors') { mineT.forEach(function(n){ if (n && n.shared) add(true, n); }); (c.shared || []).forEach(function(n){ if (n) add(false, n); }); }
      else if (p.k === 'trainee') {
        mineT.forEach(function(n){ if (!n) return;
          if (n.sent && n.sent.scope === 'trainee' && n.sent.to === p.to) { add(true, n); (n.replies || []).forEach(function(r){ add(false, n, r.text, r.at, r.by); }); }
          else if (/^q-/.test(String(n.id)) && same(n.by, p.name)) { var m = String(n.text || '').match(/^Question from [^:]*: “([\s\S]*)”/); add(false, n, m ? m[1] : n.text, n.at, n.by); } });
      } else if (p.k === 'tgroup') mineT.forEach(function(n){ if (n && n.sent && n.sent.scope === 'group' && String(n.sent.group) === String(p.group)) { add(true, n); (n.replies || []).forEach(function(r){ add(false, n, r.text, r.at, r.by); }); } });
    }
    return out.sort(function(a, b){ return String(a.at).localeCompare(String(b.at)); });
  }
  /* one note on its way: kept in the writer's own notebook, then sent where it is going */
  function deliver(note, p, voice){
    if (MODE === 'trainee') {
      if (p.k === 'group' || p.k === 'course') note.shared = p.k;
      var nb = load(); nb.notes.push(note);
      return save(nb).then(function(){
        if (p.k === 'group' || p.k === 'course') return S.call({ op: 'shareNote', token: S.token(), item: note, scope: p.k }).then(function(r){ if (r && r.notes) { try { localStorage.setItem('connect_notes_v1', JSON.stringify(r.notes)); } catch (e) {} } return r || {}; });
        return {};
      });
    }
    note.by = who();
    if (p.k === 'tutors') note.shared = true;
    if (p.k === 'trainee') note.sent = { scope: 'trainee', to: p.to, name: p.name };
    if (p.k === 'tgroup') note.sent = { scope: 'group', group: p.group };
    return tutor.put(note).then(function(){
      if (p.k === 'trainee' || p.k === 'tgroup') return S.call({ op: 'tutorConnectNote', who: who(), item: note, scope: p.k === 'trainee' ? 'trainee' : 'group', to: p.to || '', group: p.group || '' }).then(function(r){ return r || {}; });
      return {};
    });
  }
  /* a trainee's word back goes under the tutor's latest note to them; with no note from that tutor there is nothing to answer */
  function replyTarget(p){
    if (MODE !== 'trainee' || p.k !== 'tutor') return null;
    var got = (rd('connect_notes_v1') || []).filter(function(n){ return n && n.fromTutor && n.scope === 'trainee' && (!p.name || same(n.by, p.name)); });
    got.sort(function(a, b){ return String(a.at).localeCompare(String(b.at)); });
    return got[got.length - 1] || null;
  }

  var sheet = null, back = null, rec = null, recBlob = null, recSecs = 0, recTimer = null, recStream = null;
  function close(){
    if (!sheet) return;
    stopRec();
    sheet.classList.remove('on'); back.classList.remove('on');
    var s0 = sheet, b0 = back; sheet = null; back = null;
    setTimeout(function(){ s0.remove(); b0.remove(); }, 230);
  }
  function stopRec(){ try { if (rec && rec.state !== 'inactive') rec.stop(); } catch (e) {} if (recStream) { recStream.getTracks().forEach(function(t){ t.stop(); }); recStream = null; } clearInterval(recTimer); }
  function frame(label){
    css(); if (sheet) { stopRec(); sheet.remove(); back.remove(); }
    back = document.createElement('div'); back.className = 'nbk-back'; back.addEventListener('click', close);
    sheet = document.createElement('aside'); sheet.className = 'nbk-sheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', label);
    document.body.appendChild(back); document.body.appendChild(sheet);
    requestAnimationFrame(function(){ if (back) back.classList.add('on'); if (sheet) sheet.classList.add('on'); });
  }
  function bookHref(){ return (location.pathname.indexOf('/input-sessions/') !== -1 ? '../../' : '') + '37_notebook.html'; }
  function headHTML(inner){ return '<div class="nbk-head"><p class="nbk-ctx">' + inner + '</p>' + (/37_notebook/.test(location.pathname) ? '' : '<a class="nbk-book" href="' + bookHref() + '">Notebook</a>') + '<button type="button" class="nbk-x" aria-label="Close">&times;</button></div>'; }
  function noteFor(th, text){
    var d = today(), note = { id: newId(), at: nowISO(), day: d, thread: { k: th.k, id: th.id, t: th.k === 'day' ? dayLabel(d) : th.t }, text: text };
    if (th.sub) note.thread.sub = th.sub;
    note.where = (location.pathname.split('/').slice(-2).join('/') + location.search).slice(0, 200);
    return note;
  }
  function open(th, preset){
    th = th || context(); frame('A new note');
    var needName = MODE === 'tutor' && !who(), list = peers(th), cur = list[0];
    if (preset) cur = list.filter(function(p){ return peerKey(p) === peerKey(preset); })[0] || (list.push(preset), preset);
    var canRec = !!(mimePick() && navigator.mediaDevices);
    sheet.innerHTML = headHTML(th.k === 'day' ? 'A note for today' : 'Note on <b>' + esc(th.t) + (th.sub ? ' · ' + esc(th.sub) : '') + '</b>')
      + '<div class="nbk-body">'
      + (needName ? '<input class="nbk-name" type="text" placeholder="Your name, as on the dashboard" autocomplete="name" aria-label="Your name">' : '')
      + '<textarea placeholder="Write it down." aria-label="Your note"></textarea>'
      + '<div class="nbk-who" role="group" aria-label="Who it is for"></div>'
      + '<div class="nbk-row">' + (canRec ? '<button type="button" class="nbk-btn rec" aria-label="Record a voice note"><span class="dot"></span><span class="lbl">Voice</span></button>' : '') + '<button type="button" class="nbk-btn go" disabled>Save</button></div>'
      + '<div class="nbk-audio" hidden></div><p class="nbk-msg" aria-live="polite"></p></div>';
    var ta = sheet.querySelector('textarea'), go = sheet.querySelector('.nbk-btn.go'), rb = sheet.querySelector('.nbk-btn.rec'), au = sheet.querySelector('.nbk-audio'), nm = sheet.querySelector('.nbk-name'), msg = sheet.querySelector('.nbk-msg'), whoBox = sheet.querySelector('.nbk-who');
    function ready(){ go.disabled = !(ta.value.trim() || recBlob) || !!(nm && !nm.value.trim()) || cur.k === 'pick'; go.textContent = goLabel(cur); }
    function chips(){
      whoBox.innerHTML = list.map(function(p, i){ return '<button type="button" data-i="' + i + '" class="' + (p === cur ? 'on' : '') + '" aria-pressed="' + (p === cur) + '">' + esc(p.label) + '</button>'; }).join('')
        + (cur.k === 'pick' ? '<select class="nbk-pick" aria-label="Which trainee"><option value="">Which trainee?</option>' + rosterList().map(function(t){ return '<option value="' + esc(t.token) + '">' + esc(t.name) + '</option>'; }).join('') + '</select>' : '');
      Array.prototype.forEach.call(whoBox.querySelectorAll('button'), function(b){ b.addEventListener('click', function(){ cur = list[+b.getAttribute('data-i')]; chips(); ready(); }); });
      var sel = whoBox.querySelector('.nbk-pick'); if (sel) sel.addEventListener('change', function(){ var t = rosterList().filter(function(x){ return x.token === sel.value; })[0]; if (!t) return;
        var p = { k: 'trainee', to: t.token, name: t.name, label: first(t.name) }; list = list.filter(function(x){ return x.k !== 'pick' && x.k !== 'trainee'; }).concat([p, { k: 'pick', label: 'Another trainee' }]); cur = p; chips(); ready(); });
    }
    chips(); ready();
    sheet.querySelector('.nbk-x').addEventListener('click', close);
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
          rb.classList.remove('on'); rb.querySelector('.lbl').textContent = 'Again';
          au.hidden = false; au.innerHTML = '<span>Voice note, ' + secs(recSecs) + '</span><button type="button" class="rm">Remove</button><audio controls src="' + URL.createObjectURL(recBlob) + '"></audio>';
          au.querySelector('.rm').addEventListener('click', function(){ recBlob = null; recSecs = 0; au.hidden = true; au.innerHTML = ''; rb.querySelector('.lbl').textContent = 'Voice'; ready(); });
          ready();
        };
        var t0 = Date.now(); recSecs = 0;
        rec.start(250); rb.classList.add('on'); rb.querySelector('.lbl').textContent = 'Stop · 0:00';
        recTimer = setInterval(function(){ recSecs = Math.round((Date.now() - t0) / 1000); rb.querySelector('.lbl').textContent = 'Stop · ' + secs(recSecs); if (recSecs >= (MODE === 'trainee' && cur.k === 'tutor' ? 30 : MAX_SECONDS)) stopRec(); }, 250);
      }, function(){ msg.textContent = 'The microphone was not allowed. Type the note instead.'; });
    });
    go.addEventListener('click', function(){
      if (go.disabled) return;
      if (nm) { try { localStorage.setItem('chub:tutorName', nm.value.trim()); } catch (e) {} }
      var p = cur, label = go.textContent; go.disabled = true; go.textContent = p.k ? 'Sending…' : 'Saving…';
      var note = noteFor(th, ta.value.trim()), toTutor = false;
      /* a voice note to a tutor travels with the note itself (the store keeps it with the question); any other is filed first */
      var prep = !recBlob ? Promise.resolve(null) : toTutor ? b64(recBlob).then(function(bytes){ return { bytes: bytes, type: recBlob.type, seconds: recSecs }; }) : upload(recBlob, recSecs).then(function(a){ note.audio = a; return null; });
      prep.then(function(voice){ return deliver(note, p, voice); }).then(function(r){
        recBlob = null; paintCount();
        if (!p.k) { msg.innerHTML = '<span class="nbk-saved">Saved.</span>'; go.textContent = 'Saved'; ta.value = ''; au.hidden = true; au.innerHTML = ''; setTimeout(close, 1100); return; }
        talk(p, th, (r && r.demo) ? (S.isTemplate && S.isTemplate() ? 'Trainee view: nothing reaches the course.' : 'Demo: kept on this device only.') : '');
      }, function(e){ go.disabled = false; go.textContent = label; msg.textContent = 'Not sent — ' + ((e && e.message) || e); });
    });
    document.addEventListener('keydown', function esc_(e){ if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc_); } });
  }
  /* the conversation: what went each way, and a box for the next word */
  function talk(p, th, said){
    th = th || context(); frame('With ' + peerTitle(p));
    var el = sheet;
    function paint(note){
      if (sheet !== el) return;
      var ms = messages(p), short = MODE === 'trainee' && p.k === 'tutor';
      el.innerHTML = headHTML('With <b>' + esc(peerTitle(p)) + '</b>')
        + '<div class="nbk-body nbk-talk"><div class="nbk-thread">' + (ms.length ? ms.map(function(m, i){
            return '<div class="nbk-m ' + (m.me ? 'me' : 'them') + '">' + esc(m.text || '') + (m.audio ? '<button type="button" class="nbk-hear" data-i="' + i + '">Listen</button><span class="slot"></span>' : '')
              + '<i>' + esc((m.me ? 'You' : first(m.by) || 'Them') + ' · ' + (m.note && m.note.day !== today() ? dayLabel(String(m.at).slice(0, 10)) + ' ' : '') + timeLabel(m.at)) + '</i></div>'; }).join('') : '<p class="nbk-none">Nothing yet.</p>') + '</div></div>'
        + (short && !replyTarget(p) ? '' : '<div class="nbk-reply"><textarea rows="2" placeholder="Reply…" aria-label="Reply"' + (short ? ' maxlength="300"' : '') + '></textarea><button type="button" class="nbk-btn go" disabled>Send</button></div>') + '<p class="nbk-msg" aria-live="polite">' + esc(note || '') + '</p>';
      el.querySelector('.nbk-x').addEventListener('click', close);
      var box = el.querySelector('.nbk-thread'); box.scrollTop = box.scrollHeight; var body = el.querySelector('.nbk-talk'); body.scrollTop = body.scrollHeight;
      Array.prototype.forEach.call(el.querySelectorAll('.nbk-hear'), function(b){ b.addEventListener('click', function(){ var m = ms[+b.getAttribute('data-i')]; play(m.note, b.parentNode.querySelector('.slot'), b); }); });
      var ta = el.querySelector('textarea'), go = el.querySelector('.nbk-btn.go'), msg = el.querySelector('.nbk-msg'); if (!ta) return;
      ta.addEventListener('input', function(){ go.disabled = !ta.value.trim(); });
      go.addEventListener('click', function(){
        var text = ta.value.trim(); if (!text) return; go.disabled = true; go.textContent = 'Sending…';
        var under = replyTarget(p), job;
        if (MODE === 'trainee' && p.k === 'tutor' && !under) return;
        /* the store keeps one reply from a trainee on a note: a second word back is added under the first, not put in its place */
        var before = under ? ((under.replies || [])[0] || {}).text || '' : '', whole = before ? (before + '\n' + text).slice(0, 400) : text;
        if (under) job = S.call({ op: 'replyNote', token: S.token(), id: under.id, text: whole }).then(function(r){
          var got = (r && r.notes) || null;
          if (!got) { got = rd('connect_notes_v1') || []; var n = got.filter(function(x){ return x.id === under.id; })[0]; if (n) n.replies = [{ by: 'You', at: nowISO(), text: whole }]; }
          try { localStorage.setItem('connect_notes_v1', JSON.stringify(got)); } catch (e) {} return r || {}; });
        else job = deliver(noteFor(th, text), p, null);
        job.then(function(r){ paintCount(); paint((r && r.demo) ? (S.isTemplate && S.isTemplate() ? 'Trainee view: nothing reaches the course.' : 'Demo: kept on this device only.') : ''); },
          function(e){ go.disabled = false; go.textContent = 'Send'; msg.textContent = 'Not sent — ' + ((e && e.message) || e); });
      });
      if (!note) setTimeout(function(){ if (sheet === el) ta.focus(); }, 240);
    }
    paint(said || '');
    if (MODE === 'tutor' && who()) tutor.load().then(function(){ paint(''); }, function(){});
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
    /* tucked while scrolling and while typing, on a phone or a tablet; a desktop has the room */
    var tuckTimer = null, typing = false;
    var narrow = function(){ return window.innerWidth <= 900; };
    var tuck = function(on){ if (!arc) return; if (on && narrow()) arc.classList.add('nbk-tuck'); else if (!on && !typing) arc.classList.remove('nbk-tuck'); };
    window.addEventListener('scroll', function(){ if (!narrow()) return; tuck(true); clearTimeout(tuckTimer); tuckTimer = setTimeout(function(){ tuck(false); }, 650); }, { passive: true });
    var isField = function(el){ return !!(el && (el.matches && el.matches('input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]), textarea, select, [contenteditable=""], [contenteditable="true"]'))); };
    document.addEventListener('focusin', function(e){ if (isField(e.target)) { typing = true; tuck(true); } });
    document.addEventListener('focusout', function(e){ if (isField(e.target)) { typing = false; setTimeout(function(){ if (!typing) tuck(false); }, 250); } });
    document.addEventListener('hub:ready', function(){ setTimeout(place, 50); paintCount(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();

  window.HubNotebook = { mode: MODE, context: context, open: open, load: load, save: save, tutor: tutor, play: play, talk: talk, peers: peers, messages: messages, peerTitle: peerTitle, arc: arcSVG, who: who, today: today, dayLabel: dayLabel, timeLabel: timeLabel, threadKey: threadKey, actionPoints: actionPoints, newId: newId, nowISO: nowISO, secs: secs, place: place, count: paintCount };
})();
