/* The input session library's one brain (Ramy, 15 Oct 2026). It matches a
   timetable session's title to the pages on the shelf, and it keeps a trainee
   out of a session the timetable has not given yet, or one the course does not
   have. The shelf and every session page load this, so the two cannot drift.

   A tutor, an assessor, or a browser with no link sees every page: the rule is
   for trainees, and it is about the order of the course, not about secrecy.
   If the course cannot be read, the page opens rather than shuts. */
window.InputLib = (function(){
  /* A title can name more than one session ("Lesson frameworks · PPP & guided
     discovery"), so every rule that matches counts. The rules are tight on
     purpose: a title must not open a page it does not name. */
  var RULES = [
    [/\bstress\b/, 'word-and-sentence-stress'],
    [/connected speech|intonation/, 'connected-speech'],
    [/\bsounds\b|phonemic|the chart/, 'phonology-sounds'],
    [/error correction|oral error|monitoring/, 'error-correction'],
    [/concept check|ccq|elicit/, 'eliciting-and-ccqs'],
    [/classroom management|instructions and grouping/, 'classroom-management'],
    [/functional/, 'functional-language'],
    [/framework|lesson shape/, 'lesson-framework'],
    [/\bppp\b|presenting grammar|presentation\W+practice/, 'ppp'],
    [/text.based/, 'text-based-teaching'],
    [/guided practice|less.guided|\bdrill/, 'guided-to-less-guided-practice'],
    [/speaking/, 'teaching-speaking'],
    [/\bexam/, 'teaching-exam-classes'],
    [/lesson plan/, 'writing-the-lesson-plan'],
    [/\bwriting\b(?! the lesson)/, 'teaching-writing'],
    [/alternative|third conditional/, 'alternative-teaching-techniques'],
    [/receptive|reading|listening/, 'receptive-skills'],
    [/life after|jobs|interview|professional development/, 'life-after-celta'],
    [/drama|games/, 'drama-in-the-elt-classroom'],
    [/literacy/, 'teaching-literacy'],
    [/productive/, 'teaching-productive-skills']
  ];
  function slugsFor(title){
    var t = String(title || '').toLowerCase(), out = [];
    for (var i = 0; i < RULES.length; i++) if (RULES[i][0].test(t) && out.indexOf(RULES[i][1]) === -1) out.push(RULES[i][1]);
    return out;
  }
  function rd(k){ try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function iso(d){ return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function dateOf(s){ var m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  function today(cs){ var d = String((cs && cs.demoToday) || ''); return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : iso(new Date()); }
  /* The timetable's input sessions, oldest first, one entry per page a title
     names (slug), or one with slug '' when no page matches. */
  function inputsOf(tt){
    var out = [];
    ((tt && tt.days) || []).forEach(function(d){
      if (!d || !d.date) return;
      (d.sessions || []).forEach(function(x){
        if (!x || x.k !== 'input' || !x.t) return;
        var slugs = slugsFor(x.t);
        if (!slugs.length) slugs = [''];
        slugs.forEach(function(sl){ out.push({ date: d.date, s: x.s || '', t: x.t, slug: sl }); });
      });
    });
    out.sort(function(a, b){ return (a.date + a.s) < (b.date + b.s) ? -1 : (a.date + a.s) > (b.date + b.s) ? 1 : 0; });
    return out;
  }
  /* ---- a centre's own input session link ---- */
  /* Ramy, 15 Oct 2026: "trainees should see those links only on the day the
     timetable gives that session, as with Connect's sessions." A link opens for
     a trainee once a timetable input session of the same name has come round:
     the names match when one contains the other, or when they name the same
     Connect page. A link no timetable session names stays shut. A course with
     no input sessions on its timetable is left as it was, so nothing vanishes
     for a centre that never filled it in. */
  function norm(s){ return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/^ | $/g, ''); }
  function rawInputs(tt){
    var out = [];
    ((tt && tt.days) || []).forEach(function(d){
      if (!d || !d.date) return;
      (d.sessions || []).forEach(function(x){ if (x && x.k === 'input' && x.t) out.push({ date: d.date, t: x.t }); });
    });
    return out;
  }
  function isInputLink(l){ return /input session/i.test(String((l && l.card) || '') + ' ' + String((l && l.label) || '')); }
  function linkOpen(l, tt, cs){
    var inputs = rawInputs(tt);
    if (!inputs.length) return true;
    var now = today(cs), ln = norm(l && l.label), ls = slugsFor(l && l.label);
    return inputs.some(function(x){
      if (x.date > now) return false;
      var tn = norm(x.t);
      if (ln && tn && (tn.indexOf(ln) !== -1 || ln.indexOf(tn) !== -1)) return true;
      return ls.length > 0 && slugsFor(x.t).some(function(sl){ return ls.indexOf(sl) !== -1; });
    });
  }
  function homeLinkOk(l, tt, cs){ return !isInputLink(l) || linkOpen(l, tt, cs); }

  /* ---- the gate on a session page ---- */
  var root = document.documentElement;
  function reveal(){ root.classList.remove('gating'); root.classList.remove('sealed'); }
  function seal(kind){
    var wrap = document.querySelector('.wrap'); if (!wrap) { reveal(); return; }
    var n = wrap.querySelector('.seal');
    if (!n) {
      n = document.createElement('div'); n.className = 'seal card';
      var after = wrap.querySelector('a.back') || wrap.querySelector('.chrome');
      if (after && after.parentNode === wrap) wrap.insertBefore(n, after.nextSibling); else wrap.insertBefore(n, wrap.firstChild);
    }
    n.innerHTML = kind === 'later'
      ? '<div class="stage-title">Not open yet</div><p class="lead" style="margin:0">This session comes later on your course. It opens here once it has been given.</p>'
      : '<div class="stage-title">Not on your course</div><p class="lead" style="margin:0">This session is not on the timetable of your course.</p>';
    root.classList.add('sealed'); root.classList.remove('gating');
  }
  function pageSlug(){
    var p = location.pathname.split('/').filter(Boolean);
    if (p.length && /\.html?$/.test(p[p.length - 1])) p.pop();
    return p[p.length - 1] || '';
  }
  /* THE DEMO OPENS ONE SESSION (Ramy, 24 Oct 2026: "they can maybe open ...
     today's input session ... the other ones, they should not be able to open
     them ... this is a demo course"). On a demo course, for every link, the
     sessions are all listed but only the latest one the timetable has given
     opens; the rest say it is a demo and point to that one. */
  function demoOpen(tt, cs){
    var now = today(cs), given = inputsOf(tt).filter(function(x){ return x.slug && x.date <= now; });
    if (!given.length) return null;
    var last = given[given.length - 1].date;
    return given.filter(function(x){ return x.date === last; });
  }
  function sealDemo(open){
    var wrap = document.querySelector('.wrap'); if (!wrap) { reveal(); return; }
    var n = wrap.querySelector('.seal');
    if (!n) {
      n = document.createElement('div'); n.className = 'seal card';
      var after = wrap.querySelector('a.back') || wrap.querySelector('.chrome');
      if (after && after.parentNode === wrap) wrap.insertBefore(n, after.nextSibling); else wrap.insertBefore(n, wrap.firstChild);
    }
    var esc = function(t){ return String(t).replace(/[&<>"]/g, function(c){ return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]; }); };
    var links = (open || []).map(function(x){ return '<a href="../' + esc(x.slug) + '/">' + esc(x.t) + '</a>'; }).join(' and ');
    n.innerHTML = '<div class="stage-title">This is a demo course</div><p class="lead" style="margin:0">On a real course, each session opens on the day the timetable gives it. In the demo, only the latest one opens' + (links ? ': ' + links + '.' : '.') + '</p>';
    root.classList.add('sealed'); root.classList.remove('gating');
  }
  function gate(){
    var H = window.HubStore, slug = pageSlug();
    function decide(tt, cs){
      if (cs && cs.demoToday) {
        var open = demoOpen(tt, cs) || [];
        if (open.some(function(x){ return x.slug === slug; })) reveal(); else sealDemo(open);
        return;
      }
      if (!H || H.isTutor() || H.isAssessor() || !H.token()) { reveal(); return; }
      var now = today(cs), mine = inputsOf(tt).filter(function(x){ return x.slug === slug; });
      if (mine.some(function(x){ return x.date <= now; })) reveal(); else seal(mine.length ? 'later' : 'never');
    }
    if (!slug) { reveal(); return; }
    var demoCs = rd('connect_course_settings') || {};
    if (!demoCs.demoToday && (!H || H.isTutor() || H.isAssessor() || !H.token())) { reveal(); return; }
    var tt = rd('connect_timetable_v1'), cs = rd('connect_course_settings');
    var haveLocal = !!(tt && tt.days && tt.days.length);
    if (haveLocal) decide(tt, cs || {});
    if (!H || !H.course) { if (!haveLocal) reveal(); return; }
    H.course().then(function(c){
      if (c && c.timetable && c.timetable.days && c.timetable.days.length) decide(c.timetable, c.settings || cs || {});
      else if (!haveLocal) reveal();
    }).catch(function(){ if (!haveLocal) reveal(); });
  }
  /* If anything goes wrong the page opens: a gate that can strand a trainee
     on a blank page is worse than no gate. */
  setTimeout(function(){ if (root.classList.contains('gating')) root.classList.remove('gating'); }, 8000);
  return { linkOpen: linkOpen, homeLinkOk: homeLinkOk, isInputLink: isInputLink, slugsFor: slugsFor, inputsOf: inputsOf, today: today, rd: rd, iso: iso, dateOf: dateOf, gate: gate };
})();

/* The demo is view only (Ramy, 24 Oct 2026): a session's "Print the handout"
   says so on a demo course instead of printing. The sessions do not load
   hub-shared.js, which carries the same lock for every other screen. */
(function(){
  function demo(){ try { return !!(JSON.parse(localStorage.getItem('connect_course_settings') || '{}') || {}).demoToday; } catch (e) { return false; } }
  var real = window.print;
  window.print = function(){
    if (!demo()) return real.apply(window, arguments);
    var t = document.getElementById('hubDemoLock');
    if (!t) { t = document.createElement('div'); t.id = 'hubDemoLock'; t.setAttribute('role', 'status');
      t.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2000;max-width:calc(100vw - 32px);background:#1f1a14;color:#fdfcf9;font:600 0.88rem/1.4 Karla,sans-serif;padding:11px 18px;border-radius:10px;text-align:center;';
      document.body.appendChild(t); }
    t.textContent = 'This is a demo course. Printing is turned off.'; t.hidden = false;
    clearTimeout(t._h); t._h = setTimeout(function(){ t.hidden = true; }, 3200);
  };
  var st = document.createElement('style');
  st.textContent = '@media print{html.hub-demo-lock body > *{display:none !important;} html.hub-demo-lock body::before{content:"This is a demo course. Printing is turned off.";display:block;padding:40px;font:16px Karla,sans-serif;}}';
  (document.head || document.documentElement).appendChild(st);
  window.addEventListener('beforeprint', function(){ document.documentElement.classList.toggle('hub-demo-lock', demo()); });
})();

/* The offline copy (sw.js at the site root). The input sessions do not load hub-shared.js,
   which is where every other screen registers it, so a visitor who opened a session first
   never got the worker. Registered here, with the address worked out from this script. */
try {
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    var __me = document.currentScript && document.currentScript.src;
    if (__me) navigator.serviceWorker.register(new URL('../sw.js', __me).href);
  }
} catch (e) {}
