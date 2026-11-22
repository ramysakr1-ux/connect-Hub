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
    /* the second one (15 Nov 2026): a tile called Classroom management 2, or instruction practice, opens the 45-minute practice session, not the first again */
    [/classroom management\s*(2|two|ii)\b|classroom management: instructions|instruction practice/, 'instruction-practice-short'],
    [/classroom management(?!\s*(2|two|ii)\b|: instructions)|instructions and grouping/, 'classroom-management'],
    [/functional/, 'functional-language'],
    [/framework|lesson shape/, 'lesson-framework'],
    [/guided discovery.*(ttt|test.?teach)|(ttt|test.?teach).*guided discovery/, 'guided-discovery-vs-ttt'],   /* 15 Nov 2026, before the PPP one */
    [/guided discovery(?!.*(ttt|test.?teach))|language through text/, 'guided-discovery-vs-ppp'],
    [/^(?!.*guided discovery).*(test.?teach.?test|\bttt\b)/, 'test-teach-test'],   /* 4 Nov 2026 */
    [/(?<!vs |versus )\bppp\b|presenting grammar|presentation\W+practice/, 'ppp'],
    [/text.based/, 'text-based-teaching'],
    [/guided practice|less.guided|\bdrill/, 'guided-to-less-guided-practice'],
    [/speaking/, 'teaching-speaking'],
    [/\bexam/, 'teaching-exam-classes'],
    [/flat.?mat|speed flat/, 'speed-flat-mating'],   /* the demo lesson, 12 Nov 2026 */
    /* "Lesson planning" alone is the day's planning slot, not the session; it opens nothing (Ramy, 4 Nov 2026: the
       demo's This week read "Writing the lesson plan" five times). A title that says more, "Intro to lesson planning",
       "Lesson planning: the plan", still opens it. */
    [/^(lesson )?planning(\s*[:·–-].*)?$/, ''],
    [/lesson plan|^lp\b/, 'writing-the-lesson-plan'],   /* LP, the timetable's short name (30 Oct 2026) */
    /* the language analysis sheets (28 Oct 2026): Connect's "Language analysis 1", "Analysing language" */
    [/language analysis|analys[iz]ing language|analy[sz]e (the )?language|la sheets?/, 'language-analysis'],
    [/\btenses?\b|\baspect\b|verb forms/, 'tense-and-aspect'],   /* 4 Nov 2026 */
    /* Teaching vocabulary (29 Oct 2026): "Teaching vocabulary", "Vocabulary 1", "Lexis" */
    [/vocab|\blexis\b|lexical/, 'teaching-vocabulary'],
    /* Teaching one-to-one (29 Oct 2026): "one-to-one", "one to one", "1:1", "private lessons" */
    [/one.to.one|one.on.one|\b1\s*[:-]\s*1\b|private (lessons|students)/, 'teaching-one-to-one'],
    [/\bwriting\b(?! the lesson)/, 'teaching-writing'],
    [/alternative|third conditional/, 'alternative-teaching-techniques'],
    [/flip/, 'flipped-classroom'],   /* 4 Nov 2026 */
    [/mixed.(ability|level)|different levels|differentiat/, 'mixed-ability-classes'],   /* 4 Nov 2026 */
    [/receptive|reading|listening/, 'receptive-skills'],
    [/life after|jobs|interview|professional development/, 'life-after-celta'],
    [/drama|games/, 'drama-in-the-elt-classroom'],
    [/literacy/, 'teaching-literacy'],
    [/productive/, 'teaching-productive-skills']
  ];
  /* THE SHORT SESSIONS (Ramy, 15 Nov 2026: "a variation of long and short input sessions"). Connect's 45-minute sessions,
     rebuilt on Lite (input-sessions/_short.py). [page, the name the timetable and the library give it (the topic's own name:
     Ramy, 15 Nov 2026, "it doesn't need to read short ... they can see that it's 45 minutes"), minutes, the long
     session on the same topic, the library family it sits in, the card's line]. A short session opens when the timetable
     places it from the library (the tile carries its page); a title typed by hand still opens the long session, so no
     course that exists changes page. */
  var SHORTS = [
    ['receptive-skills-short', 'Receptive skills', 45, 'receptive-skills', 'Loop input', 'Staged like the lesson it teaches: pre-taught vocabulary, predict, read, detail, the debrief.'],
    ['listening-short', 'Listening', 45, 'receptive-skills', 'Loop input', 'A listening lesson as the learners get it: vocabulary, predict, a dialogue to listen to, the detail task.'],
    ['teaching-productive-skills-short', 'Teaching productive skills', 45, 'teaching-productive-skills', 'Loop input', 'Speaking and writing staged the same way: prepare ideas, get useful language, do the task, get feedback.'],
    ['ppp-short', 'PPP', 45, 'ppp', 'Loop input', 'Staged exactly like the framework it teaches: terms, predict, read, detail, debrief.'],
    ['text-based-teaching-short', 'Text-based teaching', 45, 'text-based-teaching', 'Loop input', 'A text first, the language from it, then the staging named.'],
    ['guided-discovery-short', 'Guided discovery', 45, 'guided-discovery-vs-ppp', 'Loop input', 'Staged exactly like the framework it teaches, ending in the order of its stages.'],
    ['test-teach-test-short', 'Test-teach-test', 45, 'test-teach-test', 'Loop input', 'Staged exactly like the framework it teaches: test, teach, test again, then name the stages.'],
    ['teaching-speaking-short', 'Teaching speaking', 45, 'teaching-speaking', 'Loop input', 'Prepare ideas, get useful language, do the task, get feedback: the speaking lesson in order.'],
    ['teaching-writing-short', 'Teaching writing', 45, 'teaching-writing', 'Loop input', 'Product, process, and the difference it makes to the lesson.'],
    ['drilling-techniques-short', 'Drilling techniques', 0, 'guided-to-less-guided-practice', 'Loop input', 'Six drill types, four more techniques, and which drill fixes which problem.'],
    ['language-practice-short', 'Language practice', 72, 'guided-to-less-guided-practice', 'Loop input', 'From controlled to free: the three stages of practice, sorted and designed.'],
    ['lesson-planning-short', 'Lesson planning, start to finish', 45, 'writing-the-lesson-plan', 'Planning', 'Why a plan, the jargon, then aims, problems and procedure for a real TP point.'],
    ['language-analysis-short', 'Language analysis', 45, 'language-analysis', 'Planning', 'Why analyze first, the jargon, then a live draft for your own next TP point.'],
    ['mfp-short', 'MFPA', 45, 'language-analysis', 'Planning', 'Meaning, form, pronunciation, appropriacy: all four for every item you teach.'],
    ['lesson-framework-short', 'Lesson frameworks', 45, 'lesson-framework', 'Planning', 'The decision tree, the six shapes, a card sort, a sequence to build and a stage timer.'],
    ['evaluating-your-plan-short', 'Evaluating your plan', 45, '', 'Planning', 'Your self-evaluation after TP: what was the plan, what was the teaching, and what changes next time.'],
    ['tense-and-aspect-short', 'Tense and aspect', 45, 'tense-and-aspect', 'Language awareness', 'Tense marks when, aspect marks how: match, choose, sort, then your own pairs.'],
    ['eliciting-and-concept-checking-short', 'Eliciting and concept checking', 60, 'eliciting-and-ccqs', 'Language awareness', 'Drawing language out of learners, and checking they have understood it.'],
    ['teaching-vocabulary-short', 'Teaching vocabulary', 45, 'teaching-vocabulary', 'Language awareness', 'A word is not one fact: the terms, choosing a technique, building collocations.'],
    ['functional-language-short', 'Functional language', 45, 'functional-language', 'Language awareness', 'Phrases that do the same social job, ranked by formality.'],
    ['sounds-short', 'Sounds', 45, 'phonology-sounds', 'Phonology, spoken aloud', 'Every phoneme and minimal pair spoken aloud: the chart, where sounds are made, a clap game, a dictation.'],
    ['phonology-sounds-short', 'Phonology: sounds', 60, 'phonology-sounds', 'Phonology, spoken aloud', 'Sounds against letters, where consonants are made, voicing, the whole chart spoken aloud.'],
    ['stress-and-intonation-short', 'Stress and intonation', 45, 'word-and-sentence-stress', 'Phonology, spoken aloud', 'Word stress and sentence tune, both spoken aloud.'],
    ['connected-speech-short', 'Connected speech', 50, 'connected-speech', 'Phonology, spoken aloud', 'Five features, one example each: weak forms, linking, intrusion, assimilation, elision.'],
    ['instruction-practice-short', 'Classroom management: instructions', 45, 'classroom-management', 'Classroom skills', 'A quick look at classroom management, then instructions and ICQs practiced in threes. On its own, or the day after the long one.'],
    ['classroom-management-short', 'Classroom management', 60, 'classroom-management', 'Classroom skills', 'Decisions in real time: a monitoring simulation, an instruction check, your internal clock.'],
    ['error-correction-short', 'Error correction', 45, 'error-correction', 'Classroom skills', 'Not whether to correct, but how to get the learner, or the person next to them, to do it.'],
    ['giving-feedback-on-tasks-short', 'Giving feedback on tasks', 45, '', 'Classroom skills', 'Feedback on the task itself: did they finish it, did they get it right, and in what order to ask.'],
    ['classroom-arrangements-short', 'Classroom arrangements', 45, '', 'Classroom skills', 'Four layouts, when to switch, and the materials in the learners’ hands.'],
    ['rapport-and-teacher-talk-short', 'Rapport and teacher talk', 45, '', 'Classroom skills', 'What you do to build rapport and how much you talk: count it, grade it, involve everyone.'],
    ['teaching-literacy-short', 'Teaching literacy', 45, 'teaching-literacy', 'The wider profession', 'When the barrier isn’t the language: spot it, adapt the handout, the techniques.'],
    ['teaching-exam-classes-short', 'Teaching exam classes', 50, 'teaching-exam-classes', 'The wider profession', 'The CEFR ladder, the acronyms, the exams, and which one to recommend.'],
    ['professional-development-short', 'Professional development', 30, 'life-after-celta', 'The wider profession', 'Lighter on purpose: four topic cards, a share-back, and a resource sheet to keep.']
  ];
  function slugsFor(title){
    var t = String(title || '').toLowerCase(), out = [];
    for (var i = 0; i < RULES.length; i++) if (RULES[i][0].test(t) && out.indexOf(RULES[i][1]) === -1) out.push(RULES[i][1]);
    if (out[0] === '') return [];   /* a title the rules say is no session at all */
    return out;
  }
  function rd(k){ try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function iso(d){ return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function dateOf(s){ var m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  /* a demo's pinned day, or a Connect demo's day (presentToday), or the real one */
  function today(cs){ var d = String((cs && (cs.demoToday || cs.presentToday)) || ''); return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : iso(new Date()); }
  /* The timetable's input sessions, oldest first, one entry per page a title
     names (slug), or one with slug '' when no page matches. */
  function inputsOf(tt){
    var out = [];
    ((tt && tt.days) || []).forEach(function(d){
      if (!d || !d.date) return;
      (d.sessions || []).forEach(function(x){
        if (!x || x.k !== 'input' || !x.t) return;
        /* A TUTOR'S OWN SESSION HAS NO PAGE HERE (Ramy, 17 Nov 2026, C/21: the second tutor "is going to do her own
           input sessions ... I don't want the trainees to see my input session on their card"). A session marked
           x.own names no Lite page, whatever its title: the trainee's card, the sessions list and the page's own
           opening rule all read this list, so none of them offers Lite's page for it. Her materials link travels. */
        var slugs = x.own ? [] : (x.lib ? [String(x.lib)] : slugsFor(x.t));   /* the page the session was placed from, first (R05, 31 Oct 2026) */
        if (!slugs.length) slugs = [''];
        slugs.forEach(function(sl){ out.push({ date: d.date, s: x.s || '', t: x.t, slug: sl, own: !!x.own, by: (x.by === undefined || x.by === null) ? '' : String(x.by), mat: x.own && /^https?:\/\//i.test(String(x.mat || '')) ? String(x.mat) : '' }); });
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
  /* WHICH SESSIONS A COURSE USES (Ramy, 27 Oct 2026: "if they add a link does that mean they're not using Connect's
     input sessions? ... can they use both?"). settings.inputSessions, chosen on Course admin:
       connect  Connect's sessions; a link of the center's own for an input session stays hidden from trainees
       own      the center's own links only; Connect's sessions stay hidden from trainees
       both     both, side by side -- and what a course that never chose has always had
     Either way a session opens when settings.inputOpen says (below). Tutors and the assessor see everything. */
  function mode(cs){ var m = String((cs && cs.inputSessions) || ''); return /^(connect|own|both)$/.test(m) ? m : 'both'; }
  function connectOn(cs){ return mode(cs) !== 'own'; }
  function ownOn(cs){ return mode(cs) !== 'connect'; }
  /* WHEN A SESSION OPENS (Ramy, 28 Oct 2026: "is there an option to reveal them earlier? ... on the weekend or
     something. Or not." / "good to have an option"). settings.inputOpen, chosen on Course admin:
       day      on the day the timetable gives it (what every course had before)
       before   the day before
       weekend  the whole week's sessions from the Saturday before that week
     A session stays open after. Tutors and the assessor see everything. */
  function openMode(cs){ var m = String((cs && cs.inputOpen) || ''); return /^(day|before|weekend)$/.test(m) ? m : 'day'; }
  function opensOn(date, cs){
    var d = dateOf(date), m = openMode(cs); if (!d || m === 'day') return String(date || '');
    if (m === 'before') d.setDate(d.getDate() - 1);
    else d.setDate(d.getDate() - ((d.getDay() + 6) % 7) - 2);
    return iso(d);
  }
  function isOpen(x, cs){ return !!(x && x.date) && opensOn(x.date, cs) <= today(cs); }
  function whenText(cs){ var m = openMode(cs); return m === 'before' ? 'the day before it is taught' : m === 'weekend' ? 'on the weekend before its week' : 'on the day it is taught'; }
  function isInputLink(l){ return /input session/i.test(String((l && l.card) || '') + ' ' + String((l && l.label) || '')); }
  /* the timetable's input sessions a link's name finds; Course admin shows the first under each row */
  function matchesFor(label, tt){
    var ln = norm(label), ls = slugsFor(label);
    return rawInputs(tt).filter(function(x){
      var tn = norm(x.t);
      if (ln && tn && (tn.indexOf(ln) !== -1 || ln.indexOf(tn) !== -1)) return true;
      return ls.length > 0 && slugsFor(x.t).some(function(sl){ return ls.indexOf(sl) !== -1; });
    }).sort(function(a, b){ return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
  }
  function linkOpen(l, tt, cs){
    if (!rawInputs(tt).length) return true;
    var now = today(cs);
    return matchesFor(l && l.label, tt).some(function(x){ return opensOn(x.date, cs) <= now; });
  }
  function homeLinkOk(l, tt, cs){ return !isInputLink(l) || (ownOn(cs) && linkOpen(l, tt, cs)); }

  /* WHEN THE COURSE ENDS (22 Nov 2026), the same rule as the store's courseEndsAt_: the end of the last timed session on
     the course's last day, in the course's own time zone; midnight if that day has none; settings.accessUntil, the
     owner's extension, to the end of that day. null when the course has no end, is a demo, or ended before this rule. */
  function zoneInstant(ymd, hm, tz){
    var guess = new Date(ymd + 'T' + hm + ':00Z'), shown;
    try { var p = {}; new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(guess).forEach(function(x){ p[x.type] = x.value; });
      shown = Date.parse(p.year + '-' + p.month + '-' + p.day + 'T' + p.hour + ':' + p.minute + ':00Z'); } catch (e) { shown = guess.getTime(); }
    return new Date(guess.getTime() + (guess.getTime() - shown));
  }
  function courseEnd(tt, cs){
    cs = cs || {}; if (cs.demoToday) return null;
    var ymd = function(v){ return /^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? String(v) : ''; };
    var tz = cs.timeZone || 'Europe/London';
    var until = ymd(cs.accessUntil);
    if (until) return new Date(zoneInstant(until, '23:59', tz).getTime() + 60000);
    var end = ymd(cs.end);
    if (!end || end < '2026-11-22') return null;
    var last = '';
    ((tt && tt.days) || []).forEach(function(d){ if (!d || d.date !== end || d.closed) return;
      (d.sessions || []).forEach(function(x){ var e = String((x && x.e) || ''); if (/^\d{1,2}:\d{2}$/.test(e)) { if (e.length === 4) e = '0' + e; if (e > last) last = e; } }); });
    return last ? zoneInstant(end, last, tz) : new Date(zoneInstant(end, '23:59', tz).getTime() + 60000);
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
    n.innerHTML = kind === 'nolink'
      ? '<div class="stage-title">Open this from your course</div><p class="lead" style="margin:0">Input sessions open from a course\u2019s own link. Open your course link first, then come back to this session.</p>'
      : kind === 'ended'
      ? '<div class="stage-title">This course has ended</div><p class="lead" style="margin:0">Its input sessions closed when the course finished.</p>'
      : kind === 'check'
      ? '<div class="stage-title">Your course link could not be checked</div><p class="lead" style="margin:0">Connect to the internet and reload this page.</p>'
      : kind === 'own'
      ? '<div class="stage-title">Your course has its own</div><p class="lead" style="margin:0">Your center teaches this session from its own material. Its link is on your Input sessions page on the day the timetable gives it.</p>'
      : kind === 'later'
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
     opens (and, since 29 Oct, the next one); the rest say it is a demo and point to them. */
  /* TWO OPEN, TO SHOW (Ramy, 29 Oct 2026: "I should have at least one or two.
     Showcase."): the latest session given and the next one coming. */
  function demoOpen(tt, cs){
    var now = today(cs), all = inputsOf(tt).filter(function(x){ return x.slug; });
    var given = all.filter(function(x){ return x.date <= now; }), coming = all.filter(function(x){ return x.date > now; });
    var out = [];
    if (given.length) { var last = given[given.length - 1].date; out = given.filter(function(x){ return x.date === last; }); }
    if (coming.length) { var next = coming[0].date; out = out.concat(coming.filter(function(x){ return x.date === next; })); }
    return out.length ? out : null;
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
    n.innerHTML = '<div class="stage-title">This is a demo course</div><p class="lead" style="margin:0">On a real course, each session opens on the day the timetable gives it. In the demo, the latest one and the next one open' + (links ? ': ' + links + '.' : '.') + '</p>';
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
      /* A PAGE THE TUTORS SHARED (Ramy, 15 Nov 2026): a demo lesson put on the course from the share box opens for the trainees,
         though the timetable gives it as a demo, not as an input session */
      var sh = rd('connect_shared_v1') || [];
      var mineShared = sh.filter(function(x){ return x && x.url && x.kind !== 'materials' && x.to !== 'students' && String(x.url).replace(/index\.html$/, '').replace(/\/$/, '').split('/').pop() === slug; });
      if (mineShared.length) {
        reveal();
        /* shared with the teaching notes: the trainee reads them too (the store checks the same share) */
        if (mineShared.some(function(x){ return x.notes; }) && H && H.call) {
          var sec = document.getElementById('trainer'), tb = document.getElementById('tnBody');
          if (sec && tb) H.call({ op: 'trainerNotes', token: H.token(), slug: slug }).then(function(r){ if (r && r.html) { tb.innerHTML = r.html; sec.hidden = false; var a = document.querySelector('nav.sticky-nav a.tn-link'); if (a) { a.hidden = false; a.textContent = 'Teaching notes'; } var t = sec.querySelector('.stage-title'); if (t) t.innerHTML = 'Teaching notes <span class="badge">Shared by your tutor</span>'; } }, function(){});
        }
        return;
      }
      if (!connectOn(cs)) { seal('own'); return; }
      var now = today(cs), mine = inputsOf(tt).filter(function(x){ return x.slug === slug; });
      /* a session a tutor teaches from her own material (x.own) names no Lite page, so it is not in `mine`; its page says so,
         not "Not on your course" (23 Nov 2026, walking TP3 day) */
      var ownHere = !mine.length && ((tt && tt.days) || []).some(function(d){ return d && (d.sessions || []).some(function(x){ return x && x.own && String(x.lib || '') === slug; }); });
      if (ownHere) { seal('own'); return; }
      if (mine.some(function(x){ return isOpen(x, cs); })) reveal(); else seal(mine.length ? 'later' : 'never');
    }
    if (!slug) { reveal(); return; }
    var demoCs = rd('connect_course_settings') || {};
    /* A SESSION OPENS ONLY FROM A LIVE COURSE LINK (22 Nov 2026). Ramy: "the input session as a link, as an interactive
       input session, that's where I want people to stop from having ... those links will stop working when the course
       link stops working". Until today a session's own address opened for anyone who held no course link at all, and
       for any browser that remembered a tutor's key, whether or not that course was still running: so the address
       outlived the course. Now: no link, no session; and the link is checked with the store, which refuses it once
       the course has ended (assertCourseOpen_ there). A link that was good in the last week keeps a session open
       when the store cannot be reached, so a bad connection in the classroom strands nobody; the course's own end
       date still closes it. On this computer's own test address the old rule stands, for the checks. */
    var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    var hasLink = !!(H && (H.isTutor() || H.isAssessor() || H.token() || (H.isVolunteer && H.isVolunteer())));   /* a volunteer student opens a lesson page the tutors shared with the class */
    function go(){
      if (!demoCs.demoToday && (!H || H.isTutor() || H.isAssessor() || !H.token())) { reveal(); return; }
      var tt = rd('connect_timetable_v1'), cs = rd('connect_course_settings');
      var haveLocal = !!(tt && tt.days && tt.days.length);
      if (haveLocal) decide(tt, cs || {});
      if (!H || !H.course) { if (!haveLocal) reveal(); return; }
      H.course().then(function(c){
        if (c && c.timetable && c.timetable.days && c.timetable.days.length) decide(c.timetable, c.settings || cs || {});
        else if (!haveLocal) reveal();
      }).catch(function(e){ if (ended(e)) { unstamp(); seal('ended'); } else if (!haveLocal) reveal(); });
    }
    if (local || demoCs.demoToday) { go(); return; }
    if (!hasLink) { seal('nolink'); return; }
    var WEEK = 7 * 864e5;
    function mark(){ var c = ''; try { c = String(H.cred ? JSON.stringify(H.cred()) : (H.token() || '')); } catch (e) {} var n = 0; for (var i = 0; i < c.length; i++) n = (n * 31 + c.charCodeAt(i)) >>> 0; return String(n); }
    function stamped(){ try { var v = JSON.parse(localStorage.getItem('hub:live') || 'null'); return !!(v && v.m === mark() && (Date.now() - v.t) < WEEK); } catch (e) { return false; } }
    function stamp(){ try { localStorage.setItem('hub:live', JSON.stringify({ m: mark(), t: Date.now() })); } catch (e) {} }
    function unstamp(){ try { localStorage.removeItem('hub:live'); } catch (e) {} }
    function ended(e){ return !!(e && e.refused && !e.pin && !e.adminPin && /has ended|is closed|expired|not on the course|no longer|not valid/i.test(String(e.message || ''))); }
    /* the course's own end, as this browser last saw it: a session does not open after it even with no connection */
    function pastEnd(){ try { var cs = rd('connect_course_settings') || {}, tt = rd('connect_timetable_v1'); var at = courseEnd(tt, cs); return !!(at && Date.now() > at.getTime() && !H.isTutor()); } catch (e) { return false; } }
    var ran = false;
    function open(){ if (ran) return; ran = true; go(); }
    if (pastEnd()) seal('ended');
    else if (stamped()) open();
    var ask = H.version ? H.version() : H.course();
    ask.then(function(){ stamp(); open(); })   /* the store says the link is live: that decides it, whatever this browser last knew */
       .catch(function(e){
         if (ended(e)) { unstamp(); seal('ended'); return; }
         if (e && e.refused) { stamp(); open(); return; }   /* a PIN is asked for: the link itself is good */
         if (!ran && !root.classList.contains('sealed')) seal('check');
       });
  }
  /* If the store never answers: a link that was good this week opens the page (go() ran above); one that was never
     checked gets the "could not be checked" card, not a blank page. */
  setTimeout(function(){ if (root.classList.contains('gating')) { if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) root.classList.remove('gating'); else seal('check'); } }, 8000);
  return { courseEnd: courseEnd, shorts: SHORTS, matchesFor: matchesFor, hasInputs: function(tt){ return rawInputs(tt).length > 0; }, openMode: openMode, opensOn: opensOn, isOpen: isOpen, whenText: whenText, mode: mode, connectOn: connectOn, ownOn: ownOn, linkOpen: linkOpen, homeLinkOk: homeLinkOk, isInputLink: isInputLink, slugsFor: slugsFor, inputsOf: inputsOf, today: today, rd: rd, iso: iso, dateOf: dateOf, gate: gate };
})();

/* The demo is view only (Ramy, 24 Oct 2026): a session's "Print the handout"
   says so on a demo course instead of printing. The sessions do not load
   hub-shared.js, which carries the same lock for every other screen. */
(function(){
  if (window.INPUTLIB_ONLY) return;   /* Course admin loads this file for the matching only */
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
  if (window.INPUTLIB_ONLY) return;
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
    [/, then tap to see the reason\./g, '.'],
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
      /* an answer option is part of the task, whatever word it starts with: "Show it" is the first choice of ten questions
         in Teaching vocabulary, and was left off the printed handout as if it were a control (20 Nov 2026) */
      if (b.classList.contains('opt')) return;
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
  st.textContent = '@media print{html.hub-paper-print .mhead span, html.hub-paper-print .lenlink{display:none !important;} html.hub-paper-print button{background:none !important;color:#000 !important;border:1px solid #999 !important;box-shadow:none !important;}'
    + 'html.hub-paper-print select{appearance:none;-webkit-appearance:none;background:none !important;border:0 !important;border-bottom:1px solid #999 !important;color:transparent !important;min-width:140px;}}';
  (document.head || document.documentElement).appendChild(st);
})();

/* TWO WAYS TO PRINT (Ramy, 15 Nov 2026: "I need to print clean ... without the trainer's notes, and without anything that is
   meant for the interactive input session only ... two options under print"). A tutor's page had one button, Print with the
   trainer notes. Every session now gives a tutor a second one, Print the handout: the paper the trainees get when they have no
   laptop. It prints the page as a trainee would see it: no trainer notes, no answers (the tutor's print adds them; this one does not), no answer keys or model answers, no tutor-only boxes,
   and the screen-only parts turned into paper (the paper print above). A trainee's own button already prints that way. */
(function(){
  if (window.INPUTLIB_ONLY) return;
  var st = document.createElement('style');
  st.textContent = '.print-btn.print-clean{display:none;} nav.sticky-nav .print-btn.print-clean{margin-left:18px;} body.tutor .print-btn.print-clean{display:block;} @media (max-width:560px){ body.tutor nav.sticky-nav .print-btn.print-clean{display:none;} }'
    + '@media print{' + ['#trainer', '.trainer-notes', '.tn-link', '.tutor-only', '.wrap .tutor', '.wrap .key', '.model', '.print-btn', '.reveal-card .a', '.answer-key', '.why', '.reveal-block', 'details.reveal .content', '.keyblock', '.mhead span'].map(function(x){ return 'html.hub-clean body ' + x; }).join(', ') + '{display:none !important;}}';
  (document.head || document.documentElement).appendChild(st);
  function add(){
    var b = document.querySelector('.print-btn'); if (!b || document.querySelector('.print-clean')) return;
    var c = document.createElement('button'); c.type = 'button'; c.className = b.className + ' print-clean'; c.textContent = 'Print the handout';
    c.addEventListener('click', function(){
      var h = document.documentElement; h.classList.add('hub-clean');
      var off = function(){ h.classList.remove('hub-clean'); window.removeEventListener('afterprint', off); };
      window.addEventListener('afterprint', off); window.print();
    });
    b.parentNode.insertBefore(c, b.nextSibling);   /* after it: the tutor's relabel finds the first .print-btn */
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
})();

/* THE ANSWERS PRINT HAS A DOOR AT THE TOP (Ramy, 20 Nov 2026: "trainees can't see print with answers option"). The card
   "Take the answers with you" sits at the end of a session's last part, and nothing at the top of the page said it was
   there. Where a page has the card, the strip now carries "Print with the answers" after the other print button, in the
   same words as the card's own button, and pressing it presses that button: one print, reached from the top or from the
   end. On a phone the strip carries no print buttons at all, as before; the card is still there. answers.js calls
   InputLibAnswersDoor once it has put a session's card in. */
(function(){
  if (window.INPUTLIB_ONLY) return;
  var st = document.createElement('style');
  st.textContent = 'nav.sticky-nav .print-btn.print-answers{margin-left:18px;}';
  (document.head || document.documentElement).appendChild(st);
  function add(){
    var card = document.getElementById('ansPrint'); if (!card || document.querySelector('.print-answers')) return;
    var all = document.querySelectorAll('nav.sticky-nav .print-btn'), last = all[all.length - 1]; if (!last) return;
    var c = document.createElement('button'); c.type = 'button'; c.className = 'print-btn print-answers'; c.textContent = 'Print with the answers';
    c.addEventListener('click', function(){ card.click(); });
    last.parentNode.insertBefore(c, last.nextSibling);
  }
  window.InputLibAnswersDoor = add;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
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

/* The section links on a phone are one row that scrolls sideways (session.css, 28 Oct 2026). As the page marks the
   section in view, the row slides so that link stays on screen. Sideways only: the page itself does not move. */
(function(){
  if (window.INPUTLIB_ONLY) return;
  function wire(){
    var nav = document.querySelector('nav.sticky-nav'); if (!nav || !window.MutationObserver) return;
    var last = null;
    new MutationObserver(function(){
      var a = nav.querySelector('a.on, a.active'); if (!a || a === last || nav.scrollWidth <= nav.clientWidth) return;
      last = a;
      var left = a.offsetLeft - nav.offsetLeft - 16;
      if (a.offsetLeft - nav.scrollLeft < nav.offsetLeft || a.offsetLeft + a.offsetWidth - nav.scrollLeft > nav.offsetLeft + nav.clientWidth) nav.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    }).observe(nav, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();

/* A strip that scrolls sideways says so (12 Nov 2026): while there is more to the right, the strip carries .more-r and
   session.css fades its right edge. On a phone the section links run off the screen and "Trainer notes" was unseen. */
(function(){
  function watch(el){ if (!el || el.__moreR) return; el.__moreR = 1;
    var set = function(){ el.classList.toggle('more-r', el.scrollWidth - el.clientWidth - el.scrollLeft > 6);
      if (el.offsetHeight) document.documentElement.style.setProperty('--strip-h', el.offsetHeight + 'px'); };   /* session.css: where a part lands under the strip */
    el.addEventListener('scroll', set, { passive: true }); window.addEventListener('resize', set); set(); setTimeout(set, 600); setTimeout(set, 2500); }
  function go(){ var n = document.querySelectorAll('nav.sticky-nav'); for (var i = 0; i < n.length; i++) watch(n[i]); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
  document.addEventListener('hub:ready', go);
})();

/* PRINT WITH THE ANSWERS (Ramy, 20 Nov 2026: "let's make sure that they can do that with all input sessions"). A
   session on this list has been gone through exercise by exercise, and has a file in answers/ that writes every answer
   under its task for the print (answers.js says how). A session that is not on the list gets no card: a print with
   half the answers would be worse than none. The number is the file's version; raise it when the file changes, so a
   browser that kept the old one fetches the new. "Writing the lesson plan" carries its own card on the page and is
   not listed. */
(function(){
  var READY = { 'phonology-sounds': 2, 'teaching-vocabulary': 2, 'connected-speech': 2, 'word-and-sentence-stress': 2, 'language-practice-short': 2, 'teaching-writing': 2, 'eliciting-and-ccqs': 3, 'drilling-techniques-short': 3, 'mfp-short': 3, 'guided-discovery-vs-ppp': 3, 'tense-and-aspect': 3, 'lesson-framework': 3, 'error-correction': 3, 'drama-in-the-elt-classroom': 3, 'teaching-literacy': 3, 'life-after-celta': 3, 'classroom-management': 3, 'language-analysis': 3, 'instruction-practice-short': 3, 'course-introduction': 3, 'teaching-speaking-short': 3, 'teaching-speaking': 3, 'ppp': 3, 'test-teach-test': 3, 'text-based-teaching': 3, 'classroom-arrangements-short': 3, 'classroom-management-short': 3, 'connected-speech-short': 3, 'alternative-teaching-techniques': 3, 'eliciting-and-concept-checking-short': 3, 'error-correction-short': 3, 'flipped-classroom': 3, 'evaluating-your-plan-short': 3, 'functional-language': 3, 'functional-language-short': 3, 'giving-feedback-on-tasks-short': 3, 'guided-discovery-short': 3, 'guided-discovery-vs-ttt': 3, 'language-analysis-short': 3, 'lesson-framework-short': 3, 'guided-to-less-guided-practice': 3, 'lesson-planning-short': 3, 'mixed-ability-classes': 3, 'listening-short': 3, 'phonology-sounds-short': 3, 'ppp-short': 3, 'rapport-and-teacher-talk-short': 3, 'receptive-skills-short': 3, 'sounds-short': 3, 'receptive-skills': 3, 'stress-and-intonation-short': 3, 'teaching-exam-classes-short': 3, 'teaching-exam-classes': 3, 'teaching-literacy-short': 3, 'teaching-one-to-one': 3, 'teaching-productive-skills': 3, 'teaching-productive-skills-short': 3, 'teaching-writing-short': 3, 'teaching-vocabulary-short': 3, 'tense-and-aspect-short': 3, 'test-teach-test-short': 3, 'text-based-teaching-short': 3 };   /* 2: answers.js gained the door at the top (20 Nov 2026) */
  var m = location.pathname.match(/\/input-sessions\/([^\/]+)\/(?:index\.html)?$/); if (!m) return;
  var v = READY[m[1]]; if (!v) return;
  var load = function(src, then){ var s = document.createElement('script'); s.src = src; if (then) s.onload = then; document.head.appendChild(s); };
  load('../answers.js?v=' + v, function(){ load('../answers/' + m[1] + '.js?v=' + v); });
})();
