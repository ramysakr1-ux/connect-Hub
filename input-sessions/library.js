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
  function gate(){
    var H = window.HubStore, slug = pageSlug();
    if (!H || !slug || H.isTutor() || H.isAssessor() || !H.token()) { reveal(); return; }
    function decide(tt, cs){
      var now = today(cs), mine = inputsOf(tt).filter(function(x){ return x.slug === slug; });
      if (mine.some(function(x){ return x.date <= now; })) reveal(); else seal(mine.length ? 'later' : 'never');
    }
    var tt = rd('connect_timetable_v1'), cs = rd('connect_course_settings');
    var haveLocal = !!(tt && tt.days && tt.days.length);
    if (haveLocal) decide(tt, cs || {});
    H.course().then(function(c){
      if (c && c.timetable && c.timetable.days && c.timetable.days.length) decide(c.timetable, c.settings || cs || {});
      else if (!haveLocal) reveal();
    }).catch(function(){ if (!haveLocal) reveal(); });
  }
  /* If anything goes wrong the page opens: a gate that can strand a trainee
     on a blank page is worse than no gate. */
  setTimeout(function(){ if (root.classList.contains('gating')) root.classList.remove('gating'); }, 8000);
  return { slugsFor: slugsFor, inputsOf: inputsOf, today: today, rd: rd, iso: iso, dateOf: dateOf, gate: gate };
})();
