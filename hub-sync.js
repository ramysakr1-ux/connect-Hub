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
  var mode = !S ? 'solo' : S.isTutor() ? 'tutor' : S.isTrainee() ? 'trainee' : 'solo';
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
    ['exchangeBlock','importTriggerBtn','importWordingBtn','exportWordingBtn','exportBtn'].forEach(function(id){ var el = document.getElementById(id); if (el) el.style.display = 'none'; });
    var ex = document.getElementById('exchangeNote'); if (ex) ex.style.display = '';
  }

  // ---- write-through --------------------------------------------------------
  var queue = {}, timer = null;
  function schedule(key, fn){ queue[key] = fn; clearTimeout(timer); timer = setTimeout(flush, 600); status('Saving…', 'busy'); }
  function flush(){
    var jobs = queue; queue = {};
    var ps = Object.keys(jobs).map(function(k){ return jobs[k](); });
    Promise.all(ps).then(function(){ status('Saved to the course', 'ok'); }).catch(function(err){ status('Not saved — ' + (err && err.message || err), 'error'); });
  }
  function recordOf(tr){ return { plan: (tr.tp && tr.tp.plan) || null, selfeval: (tr.tp && tr.tp.selfeval) || null, feedback: (tr.tp && tr.tp.feedback) || null, tpHistory: (tr.tp && tr.tp.history) || {}, assignments: tr.assignments || {}, tracker: tr.tracker || {} }; }
  function route(key, value){
    var data = value == null ? null : parse(value);
    if (mode === 'trainee' && TRAINEE_KEYS[key]) {
      var kind = TRAINEE_KEYS[key];
      if (TUTOR_ONLY[kind] && !(kind === 'feedback' && data === null)) return; // the tutor's records: read here, never written
      schedule('t:' + kind, function(){ return S.put(kind, data); });
    }
    if (mode === 'tutor' && COURSE_KEYS[key]) schedule('c:' + COURSE_KEYS[key], (function(kind){ return function(){ return S.putCourse(kind, data); }; })(COURSE_KEYS[key]));
    if (mode === 'tutor' && key === 'connect_roster_v1' && data && data.trainees) {
      Object.keys(data.trainees).forEach(function(token){
        var rec = recordOf(data.trainees[token]);
        snapshot[token] = snapshot[token] || {};
        Object.keys(rec).forEach(function(kind){
          var json = JSON.stringify(rec[kind]);
          if (snapshot[token][kind] === json) return;
          snapshot[token][kind] = json;
          schedule('r:' + token + ':' + kind, (function(tok, kd, val){ return function(){ return S.put(kd, val, tok); }; })(token, kind, rec[kind]));
        });
      });
    }
  }
  localStorage.setItem = function(k, v){ origSet(k, v); route(k, v); };
  localStorage.removeItem = function(k){ origRemove(k); route(k, null); };

  // ---- preload ------------------------------------------------------------------
  if (mode === 'solo') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runApp); else runApp(); return; }
  status('Loading from the course…', 'busy');
  var work = S.boot().then(function(boot){
    var course = boot.course || {};
    if (course.wording) origSet('connect_assignment_wording_v2', JSON.stringify(course.wording)); else origRemove('connect_assignment_wording_v2');
    if (course.settings) origSet('connect_course_settings', JSON.stringify(course.settings)); else origRemove('connect_course_settings');
    if (mode === 'trainee') {
      var me = boot.me || { records: {} };
      window.HubMe = me;
      origSet('hub:name', me.name || '');
      Object.keys(TRAINEE_KEYS).forEach(function(key){
        var kind = TRAINEE_KEYS[key], v = me.records[kind];
        if (v == null) origRemove(key); else origSet(key, JSON.stringify(v));
      });
      return;
    }
    var roster = { trainees: {} };
    snapshot = {};
    (boot.roster || []).forEach(function(t){
      var r = t.records || {};
      roster.trainees[t.token] = { id: t.token, name: t.name, group: t.group, importedAt: t.created, tp: { plan: r.plan || null, selfeval: r.selfeval || null, feedback: r.feedback || null, history: r.tpHistory || {} }, assignments: r.assignments || {}, tracker: r.tracker || {} };
      var rec = recordOf(roster.trainees[t.token]); snapshot[t.token] = {};
      Object.keys(rec).forEach(function(kind){ snapshot[t.token][kind] = JSON.stringify(rec[kind]); });
    });
    origSet('connect_roster_v1', JSON.stringify(roster));
  });
  work.then(function(){ status('Live — saved to the course as you go', 'ok'); }, function(err){ status('Could not reach the course — ' + (err && err.message || err), 'error'); })
      .then(function(){ if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runApp); else runApp(); });
})();
