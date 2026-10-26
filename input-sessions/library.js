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
    /* day one's opener (26 Oct 2026): a tile called Course introduction, or anything naming the course on Lite */
    [/course intro|introduction to the course|welcome to the course|induction|connect lite|your celta on/, 'course-introduction'],
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

/* THE HANDOUT ON PAPER (Ramy, 26 Oct 2026: "printing the handout should be possible for all input sessions,
   and anything that is not meant to be printed will disappear, like click here"). Just before printing, the
   screen's instructions are swapped for paper ones ("Click a term, then click its definition" becomes
   "Match each term to its definition"), a label that only means something on screen ("Click to reveal")
   goes, and so do the buttons that work the page (Reveal, Play, Reset, Next). Answer choices stay, drawn as
   words to circle. Everything is put back the moment the print dialog closes. */
(function(){
  var SAY = [
    [/Click a term on the left, then click its definition on the right/g, 'Match each term on the left to its definition on the right'],
    [/Click a term, then click the meaning that goes with it/g, 'Match each term to its meaning'],
    [/Click a pill on the left, then click its matching example on the right/g, 'Match each one on the left to its example on the right'],
    [/Click a phrase on the left, then its function on the right/g, 'Match each phrase on the left to its function on the right'],
    [/Click one on the left, then its full name on the right/g, 'Match each one on the left to its full name on the right'],
    [/Click a word, then click a gap/g, 'Write each word in its gap'],
    [/Click each stage, in the order you think it happens, from first to last/g, 'Number the stages in the order you think they happen, from first to last'],
    [/Click each stage in the order/g, 'Number the stages in the order'],
    [/Click each one in the order/g, 'Number them in the order'],
    [/Click the boxes below in the order/g, 'Number the boxes below in the order'],
    [/Click the steps in order/g, 'Number the steps in order'],
    [/then tap the shuffled stages below in the order/g, 'then number the stages below in the order'],
    [/Tap a stage card below, then tap the shape it belongs to/g, 'Write the shape each stage belongs to'],
    [/Tap each word, then tap Positive or Negative to sort it/g, 'Sort each word: Positive or Negative'],
    [/Tap each statement, then tap Product or Process/g, 'Mark each statement Product or Process'],
    [/Tap each example, then tap the zone it belongs to on the/g, 'Place each example on the'],
    [/tap whether the focus is on/g, 'mark whether the focus is on'],
    [/then tap the framework you think it is/g, 'then circle the framework you think it is'],
    [/Click your answer for each/g, 'Circle your answer for each'],
    [/Click the word or words you think/g, 'Underline the word or words you think'],
    [/Click between two words to mark a link \(just like drawing a ◡ shape by hand\)/g, 'Draw a ◡ between two words to mark a link'],
    [/Before you click anything, say/g, 'First say'],
    [/Click in a box, then use the symbol keys to type/g, 'Write the symbols in the boxes'],
    [/On screen, click one from each column to join them/g, 'Join one from each column'],
    [/Click to build it, and say each chunk as it appears/g, 'Say it chunk by chunk'],
    [/Read both, then click to reveal who is eliciting and who is telling/g, 'Read both: who is eliciting, and who is telling?'],
    [/Say the examples on each card out loud first, then click the card to reveal what[^.]*\./g, 'Say the examples on each card out loud.'],
    [/Decide what.s structurally wrong before you tap .Reveal the fix.?/g, 'Decide what is structurally wrong'],
    [/Spin, then discuss:/g, 'Discuss each area:'],
    [/\s*·?\s*Quick quiz: tap a card to turn it/g, ' · Quick quiz'],
    /* sentences that only make sense on screen go altogether */
    [/\s*Click a rung to see what a learner at that level can actually do\.?/g, ''],
    [/\s*Click any card to open it:[^.]*\.(\s*Come back to any you like\.)?/g, ''],
    [/\s*Click whichever role interests you\.?/g, ''],
    [/\s*Click any sound to hear its example word\.?/g, ''],
    [/\s*Then click the words to check\.?/g, ''],
    [/\s*Click each word to check\.?/g, ''],
    [/\s*Click each idea to reveal a short explanation\.?/g, ''],
    [/\s*Click each (one )?to reveal[^.]*\.?/gi, ''],
    [/\s*Tap each one to see a clearer version\.?/g, ''],
    [/\s*Click the one that comes first\.?/g, ''],
    [/\s*Click each one\./g, ''],
    [/^Spin the wheel\s*$/, 'Thirteen areas'],
    [/^\s*(click|tap)( each)?( one| word| the words)?( to (reveal|hear|fix|turn)[^.]*)?\.?\s*$/i, ''],
    [/\s*Click to reveal which word is stressed, and why\.?/g, ''],
    [/\s*click to reveal( the phrase and fact)?\.?/gi, '']
  ];
  var CONTROL = /^(reveal|hide|show|check|reset|next|play|spin|start again|try again|reshuffle|print|add a stage|watch the film|compare|see all|play again|done|listen|hear it|again|clear|undo|new|shuffle|open on|open wordwall)/i;
  var undo = [];
  function paper(){
    undo = [];
    var root = document.querySelector('.wrap') || document.body;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n, list = [];
    while ((n = w.nextNode())) {
      var host = n.parentElement;
      if (!host || host.closest('#trainer, .sources, script, style, textarea, .hub-brand-foot')) continue;
      if (/click|tap|spin/i.test(n.nodeValue)) list.push(n);
    }
    list.forEach(function(t){
      var was = t.nodeValue, now = was;
      SAY.forEach(function(r){ now = now.replace(r[0], r[1]); });
      if (now === was) return;
      undo.push(function(){ t.nodeValue = was; });
      t.nodeValue = now;
      var el = t.parentElement;
      if (el && !el.textContent.trim()) { var d = el.style.getPropertyValue('display'), dp = el.style.getPropertyPriority('display'); el.style.setProperty('display', 'none', 'important'); undo.push(function(){ el.style.setProperty('display', d, dp); }); }
    });
    document.querySelectorAll('button, [role="button"], a.btn').forEach(function(b){
      var label = (b.textContent || '').trim();
      if (!CONTROL.test(label) && !b.classList.contains('reveal')) return;
      var d = b.style.getPropertyValue('display'), dp = b.style.getPropertyPriority('display'); b.style.setProperty('display', 'none', 'important'); undo.push(function(){ b.style.setProperty('display', d, dp); });
    });
    document.documentElement.classList.add('hub-paper-print');
    undo.push(function(){ document.documentElement.classList.remove('hub-paper-print'); });
  }
  function screen(){ while (undo.length) { try { undo.pop()(); } catch (e) {} } }
  window.addEventListener('beforeprint', paper);
  window.addEventListener('afterprint', screen);
  var st = document.createElement('style');
  /* an answer choice is a word to circle; a dropdown is a line to write on */
  st.textContent = '@media print{html.hub-paper-print button{background:none !important;color:#000 !important;border:1px solid #999 !important;box-shadow:none !important;}'
    + 'html.hub-paper-print select{appearance:none;-webkit-appearance:none;background:none !important;border:0 !important;border-bottom:1px solid #999 !important;color:transparent !important;min-width:140px;}}';
  (document.head || document.documentElement).appendChild(st);
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
