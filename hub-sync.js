// The Hub's pages were written against localStorage. This shim keeps them
// that way and moves the truth to the store: before a page's own script runs
// it fills the browser's storage from the store (the trainee's own records,
// or the whole roster for a tutor), and every write a page makes to a known
// key is pushed back to the store a moment later. Open the site with no link
// and nothing changes -- it stays the solo, one-browser tool.
//
// Each page's app script is a <script type="text/x-hub-app"> block; it is
// run once the preload has finished (or at once, in solo mode).
(function(){
  var S = window.HubStore;
  // Assessor mode (Ramy, 20 Sep 2026): boots like a tutor, writes nothing.
  var mode = !S ? 'solo' : S.isTutor() ? 'tutor' : S.isAssessor() ? 'assessor' : S.isTrainee() ? 'trainee' : 'solo';
  window.HubMode = mode;
  var TRAINEE_KEYS = { 'chub:plan':'plan', 'chub:selfeval':'selfeval', 'chub:feedback':'feedback', 'connect_assignment_submissions_v1':'assignments', 'chub:tpHistory':'tpHistory', 'chub:tracker':'tracker' };
  var TUTOR_ONLY = { feedback:1, tpHistory:1, tracker:1 };
  var COURSE_KEYS = { 'connect_assignment_wording_v2':'wording', 'connect_course_settings':'settings' };
  var origSet = localStorage.setItem.bind(localStorage), origRemove = localStorage.removeItem.bind(localStorage);
  var snapshot = {};   // tutor mode: token -> kind -> json, what the store holds
  var pill;

  function status(text, kind){
    if (mode === 'solo') return;
    if (!pill){ pill = document.createElement('div'); pill.id = 'hubSync'; pill.style.cssText = 'position:fixed;left:14px;bottom:14px;z-index:900;font:600 11px/1 Karla,sans-serif;padding:7px 11px;border-radius:999px;background:oklch(37.5% 0.058 195);color:#fff;opacity:.85;pointer-events:none;transition:opacity .3s;'; document.body.appendChild(pill); }
    pill.textContent = text; pill.style.background = kind === 'error' ? 'oklch(45% 0.15 27)' : kind === 'busy' ? 'oklch(51% 0.017 70)' : 'oklch(37.5% 0.058 195)';
    pill.style.opacity = '.85';
    if (kind === 'ok') setTimeout(function(){ if (pill.textContent === text) pill.style.opacity = '0'; }, 1800);
  }
  function parse(v){ try { return JSON.parse(v); } catch (e) { return null; } }
  function runApp(){
    var blocks = Array.prototype.slice.call(document.querySelectorAll('script[type="text/x-hub-app"]'));
    blocks.forEach(function(b){ var el = document.createElement('script'); el.textContent = b.textContent; b.parentNode.replaceChild(el, b); });
    document.dispatchEvent(new Event('hub:ready'));
    hideExchangeUi();
  }
  // The file-exchange controls belong to solo mode only.
  function hideExchangeUi(){
    if (mode === 'solo') return;
    ['exchangeBlock','importTriggerBtn','importWordingBtn','exportWordingBtn','exportBtn'].concat(mode === 'assessor' ? ['tutorOnly'] : []).forEach(function(id){ var el = document.getElementById(id); if (el) el.style.display = 'none'; });
    var ex = document.getElementById('exchangeNote'); if (ex) ex.style.display = '';
  }

  // ---- write-through --------------------------------------------------------
  // Writes are queued for 600 ms and sent together. A page that writes and
  // then navigates in the same breath ('Start next TP' clears three keys and
  // goes home) would lose them, so on pagehide whatever is still queued goes
  // out as beacons, which the browser delivers after the page is gone.
  var queue = {}, timer = null;
  function payloadFor(job){ var pl = Object.assign({}, job); if (key()) pl.key = key(); return pl; }
  function key(){ return S.key(); }
  function schedule(id, job){ queue[id] = job; clearTimeout(timer); timer = setTimeout(flush, 600); status('Saving…', 'busy'); }
  function flush(){
    var jobs = queue; queue = {}; clearTimeout(timer); timer = null;
    var keys = Object.keys(jobs);
    if (!keys.length) return Promise.resolve();
    // One at a time: Apps Script copes badly with a burst.
    var all = keys.reduce(function(chain, k){ return chain.then(function(){ return S.call(jobs[k]); }); }, Promise.resolve());
    all.then(function(){ status('Saved to the course', 'ok'); }).catch(function(err){ status('Not saved \u2014 ' + (err && err.message || err), 'error'); });
    return all;
  }
  // A page about to navigate awaits this, so nothing is left to the beacon.
  window.HubSync = { flushNow: function(){ return flush(); }, mode: mode };
  function flushBeacon(){
    var jobs = queue; queue = {}; clearTimeout(timer); timer = null;
    Object.keys(jobs).forEach(function(k){
      var body = JSON.stringify(payloadFor(jobs[k]));
      var sent = false;
      try { sent = navigator.sendBeacon(S.url, new Blob([body], { type: 'text/plain' })); } catch (e) {}
      if (!sent) { try { fetch(S.url, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: body, keepalive: true }); } catch (e) {} }
    });
  }
  window.addEventListener('pagehide', flushBeacon);
  function recordOf(tr){ return { plan: (tr.tp && tr.tp.plan) || null, selfeval: (tr.tp && tr.tp.selfeval) || null, feedback: (tr.tp && tr.tp.feedback) || null, tpHistory: (tr.tp && tr.tp.history) || {}, assignments: tr.assignments || {}, tracker: tr.tracker || {} }; }
  function route(key, value){
    if (mode === 'assessor') return; // read-only: nothing this browser does reaches the course
    var data = value == null ? null : parse(value);
    if (mode === 'trainee' && TRAINEE_KEYS[key]) {
      var kind = TRAINEE_KEYS[key];
      if (TUTOR_ONLY[kind] && !(kind === 'feedback' && data === null)) return; // the tutor's records: read here, never written
      schedule('t:' + kind, { op: 'put', token: S.token(), kind: kind, data: data });
    }
    if (mode === 'tutor' && COURSE_KEYS[key]) schedule('c:' + COURSE_KEYS[key], { op: 'putCourse', kind: COURSE_KEYS[key], data: data });
    if (mode === 'tutor' && key === 'connect_roster_v1' && data && data.trainees) {
      Object.keys(data.trainees).forEach(function(token){
        var rec = recordOf(data.trainees[token]);
        snapshot[token] = snapshot[token] || {};
        Object.keys(rec).forEach(function(kind){
          var json = JSON.stringify(rec[kind]);
          if (snapshot[token][kind] === json) return;
          snapshot[token][kind] = json;
          schedule('r:' + token + ':' + kind, { op: 'put', token: token, kind: kind, data: rec[kind] });
        });
      });
    }
  }
  localStorage.setItem = function(k, v){ origSet(k, v); route(k, v); };
  localStorage.removeItem = function(k){ origRemove(k); route(k, null); };

  // ---- preload ------------------------------------------------------------------
  // Apps Script answers in 1.5-13 s even for a ping (measured 20 Sep 2026), so
  // a page cannot wait for it. Once this browser has booted this link once, the
  // page runs at once from what it holds (the same localStorage keys) and the
  // boot runs behind it; if the course has moved on and nothing was written
  // here in the meantime, the page reloads itself -- instantly, from the fresh
  // copy. A write made before the boot answers wins: the boot then only
  // refreshes the keys it did not touch and leaves the page alone.
  if (mode === 'solo') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runApp); else runApp(); return; }
  var identity = mode + ':' + (mode === 'tutor' ? S.key() : mode === 'assessor' ? S.assessorKey() : S.token());
  var cached = false; try { cached = localStorage.getItem('hub:booted') === identity; } catch (e) {}
  var dirty = {}, started = false;
  var origRoute = route;
  route = function(k, v){ if (started) dirty[k] = true; origRoute(k, v); };

  // What a boot answer means for this browser's storage: key -> JSON or null.
  function plan(boot){
    boot = boot || {};
    var course = boot.course || {}, out = {};
    out['connect_assignment_wording_v2'] = course.wording ? JSON.stringify(course.wording) : null;
    out['connect_course_settings'] = course.settings ? JSON.stringify(course.settings) : null;
    if (mode === 'trainee') {
      var me = boot.me || { records: {} };
      out['hub:name'] = me.name || '';
      out['hub:me'] = JSON.stringify({ token: me.token, name: me.name, group: me.group });
      Object.keys(TRAINEE_KEYS).forEach(function(key){ var v = me.records[TRAINEE_KEYS[key]]; out[key] = v == null ? null : JSON.stringify(v); });
      return out;
    }
    if (mode === 'assessor') out['hub:assessor'] = JSON.stringify(boot.assessor || {});
    var roster = { trainees: {} };
    (boot.roster || []).forEach(function(t){
      var r = t.records || {};
      roster.trainees[t.token] = { id: t.token, name: t.name, group: t.group, importedAt: t.created, tp: { plan: r.plan || null, selfeval: r.selfeval || null, feedback: r.feedback || null, history: r.tpHistory || {} }, assignments: r.assignments || {}, tracker: r.tracker || {} };
    });
    out['connect_roster_v1'] = JSON.stringify(roster);
    return out;
  }
  function current(key){ try { return localStorage.getItem(key); } catch (e) { return null; } }
  // A page rewrites the roster in its own shape (extra fields, its own key
  // order), so the roster is compared record by record, not as a string.
  function rosterEqual(a, b){
    var ra = parse(a), rb = parse(b); if (!ra || !rb) return a === b;
    var ta = ra.trainees || {}, tb = rb.trainees || {};
    var ka = Object.keys(ta).sort(), kb = Object.keys(tb).sort();
    if (ka.join('|') !== kb.join('|')) return false;
    return ka.every(function(token){
      var x = ta[token], y = tb[token];
      if ((x.name || '') !== (y.name || '') || (x.group || '') !== (y.group || '')) return false;
      var rx = recordOf(x), ry = recordOf(y);
      return Object.keys(ry).every(function(kind){ return JSON.stringify(rx[kind]) === JSON.stringify(ry[kind]); });
    });
  }
  function same(key, incoming){ var now = current(key); if (key === 'connect_roster_v1') return rosterEqual(now, incoming); return now === incoming; }
  function apply(p, only){
    var changed = [];
    Object.keys(p).forEach(function(key){
      if (only && !only(key)) return;
      if (same(key, p[key])) return;
      changed.push(key);
      if (p[key] == null) origRemove(key); else origSet(key, p[key]);
    });
    return changed;
  }
  function rebuildSnapshot(){
    snapshot = {};
    var roster = parse(current('connect_roster_v1')); if (!roster || !roster.trainees) return;
    Object.keys(roster.trainees).forEach(function(token){
      var rec = recordOf(roster.trainees[token]); snapshot[token] = {};
      Object.keys(rec).forEach(function(kind){ snapshot[token][kind] = JSON.stringify(rec[kind]); });
    });
  }
  function exposeMeta(){
    if (mode === 'trainee') window.HubMe = parse(current('hub:me')) || {};
    if (mode === 'assessor') window.HubAssessor = parse(current('hub:assessor')) || {};
  }
  function bootWithRetries(){
    return S.boot().catch(function(){ return S.boot(); }).catch(function(){ return new Promise(function(res){ setTimeout(res, 1500); }).then(function(){ return S.boot(); }); });
  }
  function start(){ started = true; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runApp); else runApp(); }

  if (cached) {
    // Instant: the page runs from this browser's copy; the course is checked behind it.
    exposeMeta(); rebuildSnapshot(); start();
    status('Checking the course\u2026', 'busy');
    bootWithRetries().then(function(boot){
      var p = plan(boot);
      var untouched = Object.keys(p).every(function(k){ return !dirty[k]; });
      if (untouched) {
        var changed = apply(p);
        if (changed.length) { status('The course has moved on \u2014 refreshing', 'busy'); flushBeacon(); setTimeout(function(){ location.reload(); }, 150); return; }
      } else {
        apply(p, function(k){ return !dirty[k]; });
      }
      try { localStorage.setItem('hub:booted', identity); } catch (e) {}
      status(mode === 'assessor' ? 'Assessor view \u2014 read-only' : 'Live \u2014 saved to the course as you go', 'ok');
    }, function(err){ status('Could not reach the course \u2014 ' + (err && err.message || err) + ' (showing this browser\u2019s copy)', 'error'); });
    return;
  }

  // First time on this link in this browser: nothing to show yet, so wait.
  status('Loading from the course\u2026', 'busy');
  bootWithRetries().then(function(boot){
    apply(plan(boot)); exposeMeta(); rebuildSnapshot();
    try { localStorage.setItem('hub:booted', identity); } catch (e) {}
    status(mode === 'assessor' ? 'Assessor view \u2014 read-only' : 'Live \u2014 saved to the course as you go', 'ok');
  }, function(err){ status('Could not reach the course \u2014 ' + (err && err.message || err), 'error'); })
    .then(start);
})();
