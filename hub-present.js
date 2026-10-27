/* Connect Lite — the Connect demo's presenter bar (27 Oct 2026).
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy: "open a new course in front of everyone ... a tab on top that says fill in, and it would just fill in
 * everything quickly ... I want to see it live being filled in ... a tab that will switch between trainer, trainee,
 * volunteer students ... and one for the assessor at the end."
 *
 * Loaded by hub-shared.js on a Connect demo only (settings.presentToday). It draws one bar at the top of every page:
 *   - who you are, and a switch to the tutor, a trainee, a volunteer or the assessor (their real links, so each sees
 *     exactly what that person sees);
 *   - the course's day (Friday before, Day 1, TP1 ...), which the tutor can move: the demo's clock moves the same
 *     way, but here everything saves, so the tutor's tab and the trainee's tab talk to each other;
 *   - Fill in, on every page where somebody writes: it types the page's content in front of the room, from
 *     present-pack.js (the mid-course demo's plan, feedback, assignment and CELTA 5, invented people).
 * Nothing here exists on any other course.
 */
(function(){
  'use strict';
  if (window.HubPresent) return;
  var rd = function(k){ try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  var ls = function(k, v){ try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} };
  var cs = function(){ return rd('connect_course_settings') || {}; };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(cs().presentToday || ''))) return;
  var PAGE = (location.pathname.split('/').pop() || 'index.html');
  var S = window.HubStore || {};
  var role = function(){
    try {
      if (S.isTutor && S.isTutor()) return 'tutor';
      if (S.isAssessor && S.isAssessor()) return 'assessor';
      if (S.isVolunteer && S.isVolunteer()) return 'volunteer';
      if (S.token && S.token()) return 'trainee';
    } catch (e) {}
    return '';
  };
  var ROLE = role();
  var esc = function(s){ return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var sleep = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); };

  /* ---- what the switch needs, kept while the tutor is here -------------------------------------------- */
  if (ROLE === 'tutor') {
    ls('hub:present:k', localStorage.getItem('hub:k'));
    var ro = rd('connect_roster_v1');
    if (ro && ro.trainees) {
      var list = Object.keys(ro.trainees).map(function(t){ return { t: t, name: ro.trainees[t].name || '' }; }).filter(function(x){ return x.name; });
      if (list.length) ls('hub:present:trainees', JSON.stringify(list));
    }
    var vreg = rd('connect_volunteers_v1') || rd('connect_volunteer_register_v1');
    var vs = vreg && (vreg.students || vreg.volunteers);
    if (Array.isArray(vs)) { var v1 = vs.filter(function(x){ return x && x.token; })[0]; if (v1) ls('hub:present:v', JSON.stringify({ token: v1.token, name: v1.name || '' })); }
    if (!localStorage.getItem('hub:present:a') && S.call) S.call({ op: 'assessorLink' }).then(function(r){ if (r && r.key) ls('hub:present:a', r.key); }).catch(function(){});
  }
  /* Aiko first: the demo's content is hers */
  var trainees = function(){ var l = rd('hub:present:trainees') || []; return l.slice().sort(function(a, b){ return (/^Aiko/.test(b.name) ? 1 : 0) - (/^Aiko/.test(a.name) ? 1 : 0); }); };
  var go = {
    tutor: function(){ var k = localStorage.getItem('hub:present:k'); if (k) location.href = '5_tutor_dashboard.html?k=' + encodeURIComponent(k); },
    trainee: function(t){ if (t) { ls('hub:present:who', t); location.href = 'index.html?t=' + encodeURIComponent(t); } },
    volunteer: function(){ var v = rd('hub:present:v'); if (!v) { say('Add a volunteer student on the register first, then switch.'); return; }
      var url = S.volunteerLinkFor ? S.volunteerLinkFor(v.token) : ('26_volunteer.html?v=' + encodeURIComponent(v.token)); location.href = url; },
    assessor: function(){ var a = localStorage.getItem('hub:present:a'); if (!a) { say('Open the tutor once first, so the assessor link is known.'); return; }
      location.href = '12_assessor_pack.html?ak=' + encodeURIComponent(a); }
  };

  /* ---- the course's days, for the switch ---------------------------------------------------------------- */
  var iso = function(d){ return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  var dateOf = function(s){ var m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})$/); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
  var short = function(s){ var d = dateOf(s); return d ? d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : s; };
  function days(){
    var c = cs(), st = dateOf(c.start), en = dateOf(c.end), out = [];
    if (!st || !en) return out;
    var fri = new Date(st); do { fri.setDate(fri.getDate() - 1); } while (fri.getDay() !== 5);
    out.push({ date: iso(fri), label: 'Friday before · ' + short(iso(fri)) });
    var tt = rd('connect_timetable_v1') || {}, byDate = {};
    (tt.days || []).forEach(function(d){ if (d && d.date) byDate[d.date] = d; });
    var n = 0;
    for (var d = new Date(st); d <= en; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      n++; var k = iso(d), t = byDate[k];
      out.push({ date: k, label: 'Day ' + n + ' · ' + short(k) + (t && t.tp ? ' · TP' + t.tp : '') });
    }
    return out;
  }
  async function setDay(date){
    var next = Object.assign({}, cs(), { presentToday: date });
    try { await S.putCourse('settings', next); ls('connect_course_settings', JSON.stringify(next)); location.reload(); }
    catch (e) { say('The day could not be changed: ' + (e.message || e)); }
  }

  /* ---- typing in front of the room ----------------------------------------------------------------------- */
  function setVal(el, v){
    var proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    var desc = Object.getOwnPropertyDescriptor(proto, 'value'); if (desc && desc.set) desc.set.call(el, v); else el.value = v;
  }
  function fit(el){ if (el.tagName === 'TEXTAREA') { el.style.height = 'auto'; el.style.height = (el.scrollHeight + 4) + 'px'; } }
  /* list: [{ el, text }]. The whole page takes a few seconds however much there is, and each box is seen being
     written; the first ones go slower, so the room sees the typing. */
  async function typeAll(list){
    list = list.filter(function(x){ return x && x.el && String(x.text || '').length; });
    var total = list.reduce(function(n, x){ return n + String(x.text).length; }, 0) || 1;
    var budget = Math.min(16000, Math.max(3500, total * 4));
    for (var i = 0; i < list.length; i++) {
      var el = list[i].el, t = String(list[i].text);
      try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {}
      el.classList.add('hp-typing');
      var share = Math.max(250, budget * t.length / total) * (i < 2 ? 1.6 : 1);
      var steps = Math.max(1, Math.min(t.length, Math.round(share / 18)));
      for (var s = 1; s <= steps; s++) {
        setVal(el, t.slice(0, Math.round(t.length * s / steps))); fit(el);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        await sleep(18);
      }
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('blur'));
      el.classList.remove('hp-typing');
    }
  }
  /* What a page already drew, typed again in front of the room: every visible box with something in it. */
  function visibleBoxes(root){
    return [].slice.call((root || document).querySelectorAll('textarea, input[type=text], input:not([type])'))
      .filter(function(el){ return el.offsetParent !== null && !el.readOnly && !el.disabled && String(el.value || '').trim() && !el.closest('.hp-bar, #trainer, .actionbar, .dictbar'); });
  }
  async function retype(root){
    var boxes = visibleBoxes(root), list = boxes.map(function(el){ var t = el.value; setVal(el, ''); fit(el); return { el: el, text: t }; });
    await typeAll(list);
  }
  var VER = ((document.currentScript && document.currentScript.src || '').match(/[?&]v=([^&#]+)/) || [])[1] || '1';
  var pack = null;
  function loadPack(){
    if (pack) return Promise.resolve(pack);
    if (window.HUB_PRESENT_PACK) return Promise.resolve(pack = window.HUB_PRESENT_PACK);
    return new Promise(function(res, rej){
      var sc = document.createElement('script'); sc.src = 'present-pack.js?v=' + VER;
      sc.onload = function(){ pack = window.HUB_PRESENT_PACK; pack ? res(pack) : rej(new Error('no pack')); };
      sc.onerror = function(){ rej(new Error('The demo content could not be loaded.')); };
      document.head.appendChild(sc);
    });
  }
  var clone = function(o){ return JSON.parse(JSON.stringify(o)); };
  var $ = function(id){ return document.getElementById(id); };
  var has = function(name){ try { return typeof window.eval(name) !== 'undefined'; } catch (e) { return false; } };
  var g = function(name){ try { return window.eval(name); } catch (e) { return undefined; } };
  function nextMonday(){ var d = new Date(); d.setDate(d.getDate() + 3); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); return d; }

  /* ---- Fill in, page by page ------------------------------------------------------------------------------- */
  var FILL = {};
  FILL['6_centre_admin_dashboard.html'] = { who: 'tutor', label: 'Fill in', run: async function(P){
    var bulk = $('storeBulkNames');
    var rosterEmpty = !Object.keys((rd('connect_roster_v1') || {}).trainees || {}).length;
    if (bulk && rosterEmpty && cs().start) {
      if (bulk.offsetParent === null && $('toggleBulk')) $('toggleBulk').click();
      await sleep(200);
      await typeAll([{ el: $('storeBulkNames'), text: P.roster.map(function(r){ return r.name + ', ' + r.group + ', ' + r.email; }).join('\n') }]);
      say('The twelve trainees are in the box. Press Add them all.'); return;
    }
    var st = nextMonday(), en = new Date(st); en.setDate(en.getDate() + 25);
    var C = P.course, f = [];
    var put = function(id, v){ var el = $(id); if (el && v != null && String(v) !== '') f.push({ el: el, text: String(v) }); };
    put('courseName', C.courseName); put('courseNumber', C.courseNumber); put('tutorNames', C.tutorNames); put('totalHours', C.totalHours);
    put('planDueNote', C.planDueNote); put('selfDueNote', C.selfDueNote);
    Object.keys(C.agreement || {}).forEach(function(k){ put(k, C.agreement[k]); });
    var set = function(id, v){ var el = $(id); if (!el) return; setVal(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); if (el._flatpickr) el._flatpickr.setDate(v, true); };
    set('courseStart', iso(st)); set('courseEnd', iso(en)); set('tpCount', C.tpCount || '8');
    /* the demo shows a full plan and analysis from TP1 */
    set('planFrom', '1'); set('analysisFrom', '1');
    /* the Connect way before day one: Connect's pre-course set on, and both getting-to-know-you options for the trainee */
    var tick = function(id){ var el = $(id); if (el && !el.checked) { el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true })); } };
    tick('preCourseConnect'); set('gtkyFormat', 'both'); tick('interviewRecording');
    if ($('deliveryMode')) set('deliveryMode', C.deliveryMode || 'f2f');
    /* New York, on the 12-hour clock, and each tutor's input in a soft colour of their own */
    if ($('courseZone')) set('courseZone', C.timeZone || 'America/New_York');
    if ($('courseClock')) set('courseClock', C.clock || '12');
    var TC = g('TUTOR_COLOURS');
    if (TC && typeof TC === 'object') { Object.keys(C.tutorColours || {}).forEach(function(n){ TC[n] = C.tutorColours[n]; }); if (typeof g('renderTutorColours') === 'function') g('renderTutorColours')(); }
    await typeAll(f);
    if (typeof g('saveSettings') === 'function') {
      g('saveSettings')('Saved');
      /* the course's day starts on the Friday before it */
      var fri = new Date(st); fri.setDate(fri.getDate() - 3);
      await sleep(400); await setDayQuiet(iso(fri));
    }
    say('The course is set up: four weeks from ' + short(iso(st)) + '. Fill in again here to add the trainees.');
  }};
  async function setDayQuiet(date){ var next = Object.assign({}, cs(), { presentToday: date }); try { await S.putCourse('settings', next); ls('connect_course_settings', JSON.stringify(next)); paint(); } catch (e) {} }

  FILL['5_tutor_dashboard.html'] = { who: 'tutor', label: 'Fill in', run: async function(P){
    var box = $('streamText');
    if (!box || box.offsetParent === null) { say('Open the announcement box first.'); return; }
    await typeAll([{ el: box, text: P.announcement }]);
    say('An announcement to the whole course. Post it, then switch to a trainee to see it arrive.');
  }};

  FILL['25_volunteer_register.html'] = { who: 'tutor', label: 'Fill in', run: async function(P){
    var many = $('many');
    if (!many) { if ($('addOpen')) { $('addOpen').click(); await sleep(300); many = $('many'); } }
    if (!many) { say('Open Add a student first.'); return; }
    many.open = true; many.dispatchEvent(new Event('toggle')); await sleep(200);
    var rows = [].slice.call(document.querySelectorAll('.mrow')), list = [];
    P.volunteers.forEach(function(v, i){ var r = rows[i]; if (!r) return; list.push({ el: r.querySelector('.mName'), text: v[0] }); list.push({ el: r.querySelector('.mEmail'), text: v[1] }); });
    await typeAll(list);
    say('Five volunteer students. Add them: the addresses are made up, so no invitation leaves Lite.');
  }};

  FILL['23_timetable.html'] = { who: 'tutor', label: 'Fill in', run: async function(P){
    if (!has('TT') || typeof g('startFromCarried') !== 'function') { say('This page has nothing to fill in.'); return; }
    if (!cs().start) { say('Set the course dates in Course admin first.'); return; }
    var T = g('TT');
    if (!T) { window.__hp = {}; window.eval('TT = window.__hp'); T = g('TT'); }
    T.carried = { from: 'the last course', days: clone(P.timetable.days) };
    if (!T.slots || !T.slots.length) T.slots = clone(P.timetable.slots);
    g('startFromCarried')();
    say('Twenty days laid onto this course’s dates. Press Set when it looks right.');
  }};

  FILL['29_candidate_agreement.html'] = { who: 'trainee', label: 'Fill in', run: async function(){
    var b = $('signBtn'); if (!b) { say('Already signed.'); return; }
    b.click(); await sleep(400);
    var inp = document.querySelector('.ink-modal .ink-name input');
    if (inp && inp.offsetParent !== null) { var me = (trainees().filter(function(x){ return x.t === (S.token && S.token()); })[0] || {}).name || 'Aiko Tanaka'; await typeAll([{ el: inp, text: me }]); }
    say('Sign it in the box.');
  }};

  FILL['1_trainee_plan_and_analysis.html'] = { who: 'trainee', label: 'Fill in', run: async function(P){
    if (typeof g('draftApply') !== 'function' || typeof g('collect') !== 'function') { say('Nothing to fill in here.'); return; }
    var cur = g('collect')() || {}, st = clone(P.plan);
    st.meta = Object.assign({}, st.meta, { name: (cur.meta || {}).name || st.meta.name, tp: (cur.meta || {}).tp || st.meta.tp, date: (cur.meta || {}).date || st.meta.date });
    g('draftApply')(st);
    await sleep(150); await retype(document.querySelector('main') || document.body);
    var link = $('fMatsLink');
    if (link && !link.value.trim() && P.handout) { await typeAll([{ el: link, text: P.handout }]); }
    var share = $('fShareVol');
    if (share && !share.checked && share.offsetParent !== null) { share.checked = true; share.dispatchEvent(new Event('change', { bubbles: true })); }
    if (typeof g('autosave') === 'function') g('autosave')();
    say('The plan and the language analysis are written, and the handout is shared with the volunteers. Turn it in when you are ready.');
  }};

  FILL['2_trainee_self_evaluation.html'] = { who: 'trainee', label: 'Fill in', run: async function(P){
    if (typeof g('draftApply') !== 'function') { say('Nothing to fill in here.'); return; }
    g('draftApply')({ doc: g('DOC'), self: clone(P.self) });
    await sleep(150); await retype(document.querySelector('main') || document.body);
    if (typeof g('autosave') === 'function') g('autosave')();
    say('The self-evaluation is written.');
  }};

  FILL['3_tutor_feedback.html'] = { who: 'tutor', label: 'Fill in', run: async function(P){
    var notes = $('tNotes');
    if (notes && notes.offsetParent !== null && !notes.value.trim()) {
      await typeAll([{ el: notes, text: P.notes.join('\n') }]);
      say('Your notes from the lesson. Press Ask Connect, or Fill in again for the whole feedback.'); return;
    }
    if (typeof g('draftApply') !== 'function' || typeof g('draftState') !== 'function') return;
    var cur = g('draftState')(), F = clone(P.feedback);
    var keep = ['fTP', 'fDate', 'fTutor', 'fLevel', 'fTime']; keep.forEach(function(k){ if (cur.f && cur.f[k]) F.f[k] = cur.f[k]; });
    g('draftApply')({ f: F.f, lists: F.lists, tcomm: F.tcomm });
    await sleep(200);
    var boxes = visibleBoxes(document.querySelector('.fb-grid') || document.body).filter(function(el){ return el.tagName === 'TEXTAREA' && el.id !== 'tNotes'; });
    var list = boxes.map(function(el){ var t = el.value; setVal(el, ''); fit(el); return { el: el, text: t }; });
    await typeAll(list);
    if (typeof g('autosave') === 'function') g('autosave')();
    say('The feedback is written. Return it when you are ready.');
  }};

  FILL['9_assignment_submission.html'] = { who: 'trainee', label: 'Fill in', run: async function(P){
    if (g('CURRENT') !== P.assignment.key) { say('Open the LSRT to fill it in.'); return; }
    var A = clone(P.assignment.sub1);
    window.__hp = A;
    window.eval('PICKED = window.__hp.picked || {}; TEXT = window.__hp.text || {}; FIELDS = window.__hp.fields || {}; DECL = window.__hp.decl || {}; MATERIALSLINK = window.__hp.materialsLink || ""');
    if (typeof g('render') === 'function') g('render')();
    await sleep(200); await retype(document.querySelector('main') || document.body);
    if (typeof g('autosave') === 'function') g('autosave')();
    say('The LSRT is written. Submit it when you are ready.');
  }};

  FILL['10_tutor_assignment_marking.html'] = { who: 'tutor', label: 'Fill in', run: async function(P){
    if (g('CURRENT') !== P.assignment.key) { say('Open the LSRT to fill in its marking.'); return; }
    var sub = g('subFor')(P.assignment.key);
    if (!sub || !sub.sub1) { say('Nothing has been submitted yet.'); return; }
    sub.criteriaMarks = sub.criteriaMarks || { sub1: [], sub2: [] };
    sub.criteriaMarks.sub1 = clone((P.assignment.criteriaMarks || {}).sub1 || []);
    if (typeof g('saveSubs') === 'function') g('saveSubs')();
    if (typeof g('render') === 'function') g('render')();
    await sleep(200);
    var list = [];
    (P.marking.comments || []).forEach(function(t, i){ var el = document.querySelector('[data-crit-comment="' + i + '"]'); if (el) list.push({ el: el, text: t }); });
    if ($('comment')) list.push({ el: $('comment'), text: P.marking.general });
    await typeAll(list);
    say('Marked. Save it, and it goes back to the trainee.');
  }};

  FILL['20_celta5.html'] = { who: 'both', label: 'Fill in', run: async function(P){
    var list = [];
    /* Stage 1 drafts itself from TP1 and TP2's feedback; before TP2 is back, the demo's own Stage 1 */
    if (ROLE === 'tutor') {
      var s1 = P.celta5.stage1 || {};
      ['strengths', 'actionPlan'].forEach(function(k){ var el = document.querySelector('[data-o="s1"][data-k="' + k + '"]'); if (el && !el.readOnly && !el.value.trim() && s1[k]) list.push({ el: el, text: s1[k] }); });
      if (list.length) { await typeAll(list); say('Stage 1 is written. Choose whether the tutorial was given, then return it.'); return; }
    }
    if (ROLE === 'tutor' && has('TT')) {
      var T = g('TT'), s2 = P.celta5.stage2 || {};
      T.stage2 = Object.assign({}, T.stage2 || {}, { overall: s2.overall, marks: clone(s2.marks || {}) });
      if (typeof g('saveT') === 'function') g('saveT')();
      if (typeof g('render') === 'function') g('render')();
      await sleep(200);
      ['summary', 'notesWA', 'notesOther'].forEach(function(k){ var el = document.querySelector('[data-o="s2t"][data-k="' + k + '"]'); if (el && !el.readOnly) list.push({ el: el, text: s2[k] || '' }); });
    }
    if (ROLE === 'trainee') {
      ['notesWA', 'notesOther'].forEach(function(k){ var el = document.querySelector('[data-o="s2c"][data-k="' + k + '"]'); if (el && !el.readOnly) list.push({ el: el, text: P.celta5cand[k] || '' }); });
    }
    if (!list.length) { say('Stage 1 fills itself in from the TP1 and TP2 feedback. Stage 2 opens after TP4.'); return; }
    await typeAll(list);
    say('Written. Return it when you are ready.');
  }};

  /* ---- the bar --------------------------------------------------------------------------------------------- */
  function say(msg){
    var t = $('hpSay'); if (!t) return;
    t.textContent = msg; t.hidden = false; clearTimeout(say._t); say._t = setTimeout(function(){ t.hidden = true; }, 5200);
  }
  var css = '.hp-bar{position:fixed; top:8px; left:50%; transform:translateX(-50%); z-index:2600; display:flex; align-items:center; gap:6px; flex-wrap:wrap; justify-content:center;'
    + ' max-width:calc(100vw - 24px); padding:6px 8px; border-radius:999px; background:var(--a-forest); color:var(--paper, #fff); box-shadow:0 8px 28px -10px rgba(0,0,0,.45); font:600 0.78rem/1 Karla, sans-serif;}'
    + '.hp-bar .hp-tag{padding:0 8px 0 6px; letter-spacing:.06em; text-transform:uppercase; font-size:0.66rem; opacity:.85;}'
    + '.hp-bar button, .hp-bar select{font:inherit; border:0; border-radius:999px; padding:7px 12px; cursor:pointer; background:rgba(255,255,255,.12); color:inherit;}'
    + '.hp-bar button:hover, .hp-bar select:hover{background:rgba(255,255,255,.22);}'
    + '.hp-bar button.on{background:var(--paper, #fff); color:var(--a-forest);}'
    + '.hp-bar .hp-fill{background:var(--a-mustard); color:var(--ink);}'
    + '.hp-bar select option{color:var(--ink);}'
    + '.hp-bar .hp-day{max-width:230px;}'
    + '#hpSay{position:fixed; top:58px; left:50%; transform:translateX(-50%); z-index:2600; background:var(--paper, #fff); color:var(--ink); border-radius:12px; padding:9px 14px; box-shadow:0 8px 24px -10px rgba(0,0,0,.35); font:600 0.84rem/1.4 Karla, sans-serif; max-width:min(560px, calc(100vw - 24px)); text-align:center;}'
    + '.hp-typing{outline:2px solid var(--a-mustard) !important; outline-offset:2px;}'
    + 'body.hp-on{padding-top:52px;}'
    + '@media print{ .hp-bar, #hpSay{display:none !important;} body.hp-on{padding-top:0;} }'
    + '@media (max-width:640px){ .hp-bar{top:auto; bottom:84px; border-radius:16px;} body.hp-on{padding-top:0;} #hpSay{top:auto; bottom:150px;} }';
  function paint(){
    var bar = $('hpBar'); if (!bar) return;
    var c = cs(), today = c.presentToday, ds = days(), tr = trainees(), who = localStorage.getItem('hub:present:who') || '';
    var me = (S.token && S.token()) || '';
    var dayHtml = ROLE === 'tutor' && ds.length
      ? '<select class="hp-day" id="hpDay" aria-label="The course’s day">' + ds.map(function(d){ return '<option value="' + d.date + '"' + (d.date === today ? ' selected' : '') + '>' + esc(d.label) + '</option>'; }).join('')
        + (ds.some(function(d){ return d.date === today; }) ? '' : '<option value="' + esc(today) + '" selected>' + esc(short(today)) + '</option>') + '</select>'
      : '<span class="hp-tag" style="text-transform:none; letter-spacing:0; font-size:0.78rem;">' + esc((ds.filter(function(d){ return d.date === today; })[0] || { label: short(today) }).label) + '</span>';
    var trSel = tr.length > 1
      ? '<select id="hpTrainee" aria-label="Which trainee">' + tr.map(function(x){ return '<option value="' + esc(x.t) + '"' + ((me ? x.t === me : x.t === who) ? ' selected' : '') + '>' + esc(x.name.split(' ')[0]) + '</option>'; }).join('') + '</select>'
      : '';
    var f = FILL[PAGE], canFill = f && (f.who === 'both' || f.who === ROLE);
    bar.innerHTML = '<span class="hp-tag">Connect demo</span>'
      + '<button type="button" data-go="tutor" class="' + (ROLE === 'tutor' ? 'on' : '') + '">Tutor</button>'
      + '<button type="button" data-go="trainee" class="' + (ROLE === 'trainee' ? 'on' : '') + '">Trainee</button>' + trSel
      + '<button type="button" data-go="volunteer" class="' + (ROLE === 'volunteer' ? 'on' : '') + '">Volunteer</button>'
      + '<button type="button" data-go="assessor" class="' + (ROLE === 'assessor' ? 'on' : '') + '">Assessor</button>'
      + dayHtml
      + (canFill ? '<button type="button" class="hp-fill" id="hpFill">' + esc(f.label) + '</button>' : '');
    bar.querySelectorAll('[data-go]').forEach(function(b){ b.onclick = function(){
      var k = b.dataset.go;
      if (k === 'trainee') { var sel = $('hpTrainee'); var t = (sel && sel.value) || (tr[0] && tr[0].t); if (!t) { say('Add the trainees in Course admin first.'); return; } go.trainee(t); return; }
      go[k]();
    }; });
    var ts = $('hpTrainee'); if (ts) ts.onchange = function(){ if (ROLE === 'trainee') go.trainee(ts.value); else ls('hub:present:who', ts.value); };
    var dsel = $('hpDay'); if (dsel) dsel.onchange = function(){ setDay(dsel.value); };
    var fb = $('hpFill'); if (fb) fb.onclick = async function(){
      fb.disabled = true; var was = fb.textContent; fb.textContent = 'Filling in…';
      try { await f.run(await loadPack()); } catch (e) { say('Fill in stopped: ' + (e.message || e)); }
      fb.disabled = false; fb.textContent = was;
    };
  }
  function mount(){
    if ($('hpBar')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var bar = document.createElement('div'); bar.className = 'hp-bar'; bar.id = 'hpBar'; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'Connect demo');
    var sayEl = document.createElement('div'); sayEl.id = 'hpSay'; sayEl.hidden = true; sayEl.setAttribute('role', 'status');
    document.body.appendChild(bar); document.body.appendChild(sayEl); document.body.classList.add('hp-on');
    paint();
  }
  window.HubPresent = { paint: paint, fill: FILL, say: say };
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  document.addEventListener('hub:ready', function(){ ROLE = role(); paint(); });
})();
