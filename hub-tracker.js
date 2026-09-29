// The candidate tracker, inside the Hub, fed by the Hub's own data.
//
// Ramy, 20 Sep 2026: "The tracker we have on Classroom is very manual... The
// one here should not be. The assignments should be just there... TP is the
// same thing... This all should be just pushed automatically. And the logic
// will be the same logic that we're using with the tracker."
//
// The rules below are the C17/2026 Candidate Tracker's readCandidate(),
// ported line for line (Handbook 10.2 and 11.6, CELTA 5 p22, and Ramy's own
// rulings of 12-15 Sep 2026 -- see the comments there). What differs is
// where the facts come from: TP grades and aims from the feedback the tutor
// returned, assignment outcomes and double marking from the marking screen,
// none of it keyed in. Only the three Stage records, the Fail letter and
// withdrawal are the tutor's to set here, as they are in the tracker.

window.HubTracker = (function(){
  // Course order (Ramy, 20 Sep 2026). SRT is the tracker's code for the LSRT;
  // the Hub shows the Hub's name.
  var ASSIGNMENTS = ['FOL', 'LRT', 'SRT', 'LFC'];
  var SHOW_AS = { SRT:'LSRT', FOL:'FOL', LRT:'LRT', LFC:'LFC' };
  var HUB_KEY_FOR = { SRT:'lsrt', FOL:'fol', LRT:'lrt', LFC:'lfc' };
  var TP_GRADES = [
    { key:'ABOVE', label:'Above standard', short:'AS' },
    { key:'STD', label:'To standard', short:'S' },
    { key:'NOTSTD', label:'Not to standard', short:'NS' }
  ];
  /* hub-tracker is loaded before hub-shared on one screen, so the bound is
     read at call time rather than captured at load. */
  function MAXTP(){ return window.HUB_MAX_TP || 24; }

  var HUB_GRADE = { 'Above standard':'ABOVE', 'To standard':'STD', 'Not to standard':'NOTSTD' };
  function tpGrade(v){ for (var i = 0; i < TP_GRADES.length; i++) if (TP_GRADES[i].key === v) return TP_GRADES[i]; return null; }
  var AIMS = [
    { key:'Grammar', short:'GR' }, { key:'Functional language', short:'FL' },
    { key:'Lexis', short:'LEX' }, { key:'Pronunciation', short:'PRON' },
    { key:'Reading', short:'R' }, { key:'Listening', short:'L' },
    { key:'Speaking', short:'SP' }, { key:'Writing', short:'WR' }
  ];
  function aimShort(key){ for (var i = 0; i < AIMS.length; i++) if (AIMS[i].key === key) return AIMS[i].short; return ''; }
  function aimFor(text){
    var t = String(text || '').toLowerCase();
    if (!t) return '';
    var rules = [
      [/function/, 'Functional language'],
      [/grammar|tense|modal|conditional|passive|article|perfect|past|present|future|used to|comparative|superlative|gerund|infinitive|reported|clause|verb|noun|adjective|adverb|preposition|question form|should|ought|can\b|could|would|might|must/, 'Grammar'],
      [/lexis|lexic|vocab|word/, 'Lexis'], [/pron|phonolog|stress|intonation|sound/, 'Pronunciation'],
      [/reading|read\b/, 'Reading'], [/listening|listen/, 'Listening'],
      [/speaking|speak|fluency|conversation/, 'Speaking'], [/writing|write/, 'Writing']
    ];
    for (var i = 0; i < rules.length; i++) if (rules[i][0].test(t)) return rules[i][1];
    return '';
  }
  var ASSIGN_LABEL = { '':'–', PASS:'PASS', FAILRES:'FAIL · resub pending', RES:'PASS on RES', FAIL:'FAIL', WAIT:'Awaiting marking', WAIT2:'Resub awaiting marking', UNMARKED:'Returned unmarked' };
  var GIVEN_CYCLE = ['', 'GIVEN'];
  var GIVEN_LABEL = { '':'–', GIVEN:'Record completed' };
  var STAGE2_CYCLE = ['', 'NOTSTD', 'STD', 'ABOVE'];
  var STAGE2_LABEL = { '':'–', NOTSTD:'Not to standard', STD:'To standard', ABOVE:'Above standard' };
  var STAGES = [
    { field:'stage1', label:'Stage 1', cycle:GIVEN_CYCLE, labels:GIVEN_LABEL },
    { field:'stage2', label:'Stage 2', cycle:STAGE2_CYCLE, labels:STAGE2_LABEL },
    { field:'stage3', label:'Stage 3', cycle:STAGE2_CYCLE, labels:STAGE2_LABEL }
  ];
  /* How many teaching practices this course gives each candidate, set by the
     centre on Course admin > Settings. Eight when unset, which is every course
     made before that field existed. */
  function tpTotal(){
    try { var cs = JSON.parse(localStorage.getItem('connect_course_settings') || 'null');
          var n = cs && parseInt(cs.tpCount, 10);
          if (n >= 1 && n <= MAXTP()) return n; } catch (e) {}
    return 8;
  }

  /* Handbook 10.2: Stage 1 is completed "in the first third of the course",
     Stage 2 "ordinarily aims to be at the halfway point", and Stage 3 "in the
     final third". Thirds of the course, not fixed teaching practice numbers --
     and the Handbook works its own example with NINE TP lessons, so it plainly
     does not assume eight either.
     First third rounds down and the final third rounds up, which reproduces
     the eight-TP bands the screens have always drawn (1-2 / 3-5 / 6-8) exactly,
     and gives 1-2 / 3-4 / 5-6 for a six-TP course and 1-3 / 4-6 / 7-9 shape for
     longer ones. Stage 1 keeps at least one TP however short the course. */
  function stageBands(total){
    var n = total || tpTotal();
    var s1End = Math.max(1, Math.floor(n / 3));
    var s3Start = Math.max(s1End + 1, n - Math.ceil(n / 3) + 1);
    return { s1End: s1End, s3Start: s3Start, total: n };
  }
  function stageOf(tp, total){
    var b = stageBands(total);
    return tp <= b.s1End ? 1 : tp < b.s3Start ? 2 : 3;
  }
  /* "The second half of the course", which Handbook 10.2 uses for the Stage 3
     triggers ("not making the expected progress in the second half"). Was a
     hardcoded 5, which is the second half of eight. */
  function secondHalfFrom(total){ return Math.floor((total || tpTotal()) / 2) + 1; }
  /* STAGE2_DUE_AFTER was a hardcoded 4 while stageBands and secondHalfFrom
     already respected the course's own length, so a six-TP course was prompted
     a lesson late. Stage 2 is now due from secondHalfFrom() - 1, i.e. as the
     course reaches its halfway point, which is what 10.2 asks for. */

  /** The TP number a returned feedback record is about, from its own header. */
  function tpNumberOf(fb){
    var f = fb && fb.state && fb.state.f;
    var n = parseInt(String((f && f.fTP) || (fb && fb.label) || '').replace(/\D/g, ''), 10);
    return n >= 1 && n <= MAXTP() ? n : 0;
  }
  /** Every returned TP the roster holds for a trainee, by number. */
  function tpHistory(tr){
    var h = {};
    var hist = (tr && tr.tp && tr.tp.history) || {};
    Object.keys(hist).forEach(function(k){ if (hist[k] && hist[k].status === 'returned') h[k] = hist[k]; });
    var cur = tr && tr.tp && tr.tp.feedback;
    if (cur && cur.status === 'returned') { var n = tpNumberOf(cur); if (n && !h[n]) h[n] = cur; }
    return h;
  }
  /** What the Hub knows about one assignment: the tracker's state code plus round and markers. */
  function assignmentState(sub){
    if (!sub) return { code:'', round:0, dm:false, markers:null };
    var outcome = (sub.feedback && sub.feedback.outcome) || '';
    var code = '';
    if (sub.stage === 'closed') code = outcome === 'Pass' ? 'PASS' : outcome === 'Pass (on resubmission)' ? 'RES' : /^Fail/.test(outcome) ? 'FAIL' : '';
    else if (sub.stage === 'resubmission_needed') code = 'FAILRES';
    else if (sub.stage === 'submitted') code = 'WAIT';
    else if (sub.stage === 'resubmitted') code = 'WAIT2';
    else if (sub.stage === 'returned_unmarked') code = 'UNMARKED';
    var round = sub.sub2 ? 2 : sub.sub1 ? 1 : 0;
    return { code:code, round:round, dm:!!(sub.markers && sub.markers.doubleMarked), markers:sub.markers || null };
  }
  /** The flat record the tracker's rules read, built from a roster trainee. */
  function recordFor(tr){
    var c = {};
    var manual = (tr && tr.tracker) || {};
    ['stage1','stage2','stage3','failLetter','withdrawn'].forEach(function(k){ c[k] = manual[k] || ''; });
    /* Handbook 15.1 DEFINES a potential Fail: "the portfolios of all candidates
       identified as potential Fails, i.e., Pass/Fail at the provisional
       grading meeting". The grade was sitting in tracker.grades.provisional
       and recordFor never read it, so a candidate the centre had just put on
       the Appian form as FAIL / PASS was a potential Fail nowhere in Lite
       (audit, 29 Sep 2026). */
    var grades = manual.grades || {};
    c.provisional = grades.provisional || '';
    c.finalGrade = grades.final || '';
    /* 11.4.1 turns on two facts Lite already holds: whether the candidate
       signed the CELTA 5's final declaration, and whether there is a portfolio. */
    c.finalDeclarationSigned = !!(tr && tr.celta5 && tr.celta5.final && tr.celta5.final.signed && tr.celta5.final.signed.at);
    var hist = tpHistory(tr);
    for (var n = 1; n <= MAXTP(); n++) {
      var fb = hist[n];
      var f = fb && fb.state && fb.state.f;
      c['tp'+n] = f ? (HUB_GRADE[String(f.fGrade || '').trim()] || '') : '';
      c['tp'+n+'_aim'] = f ? aimFor(f.fMain) : '';
      c['tp'+n+'_date'] = f ? (f.fDate || '') : '';
    }
    var subs = (tr && tr.assignments) || {};
    ASSIGNMENTS.forEach(function(code){
      var st = assignmentState(subs[HUB_KEY_FOR[code]]);
      var lc = code.toLowerCase();
      c[lc+'_r'] = (st.code === 'PASS' || st.code === 'FAILRES' || st.code === 'RES' || st.code === 'FAIL') ? st.code : '';
      c[lc+'_hub'] = st;
      c[lc+'_dm'] = st.dm;
    });
    return c;
  }

  // ---- The tracker's own rule engine, unchanged ----------------------------
  function readCandidate(c){
    var latest = null, latestN = 0, graded = 0, notStd = 0, above = 0, notStdAt = [], run = 0, backToBack = null;
    for (var k = 1; k <= MAXTP(); k++) {
      var g = tpGrade(c['tp'+k]);
      if (!g) continue;
      graded++; latest = g; latestN = k;
      if (g.key === 'NOTSTD') {
        notStd++; notStdAt.push(k); run++;
        if (run >= 2 && !backToBack) backToBack = [k-1, k];
      } else { run = 0; }
      if (g.key === 'ABOVE') above++;
    }
    var fails = [], resubs = [], pending = [];
    ASSIGNMENTS.forEach(function(code){
      var v = c[code.toLowerCase()+'_r'] || '';
      if (v === 'FAIL') fails.push(code);
      else if (v === 'FAILRES') pending.push(code);
      else if (v === 'RES') resubs.push(code);
    });
    var ceiling = fails.length > 1
      ? fails.join(', ') + ' failed — not eligible for a Pass (11.6)'
      : fails.length === 1
        ? fails[0] + ' failed — a Pass is still open on other evidence, but not Pass A (11.6)'
        : null;
    var standard = null, from = '';
    if (c.stage3) { standard = c.stage3; from = 'Stage 3'; }
    else if (c.stage2) { standard = c.stage2; from = 'Stage 2'; }
    else if (latest) { standard = latest.key; from = 'TP' + latestN; }
    /* WHAT MAKES A POTENTIAL FAIL. Cambridge gives one definition (15.1:
       "Pass/Fail at the provisional grading meeting") and Lite never used it.
       These are the triggers, each carrying the document it comes from; the
       back-to-back rule that used to sit here appears in NO Cambridge
       document, and 14.3 points the other way ("candidates cannot be judged
       on the basis of their performance on any one particular occasion"), so
       it is now a watch signal below and not a Fail trigger. */
    var provisionalPassFail = /FAIL/.test(c.provisional) && /PASS/.test(c.provisional);
    var failWhy = [];
    if (provisionalPassFail) failWhy.push('provisionally graded ' + c.provisional + ' — a potential Fail (15.1)');
    if (standard === 'NOTSTD' && from.indexOf('Stage') === 0) failWhy.push(from + ' not to standard');
    if (fails.length > 1) failWhy.push(fails.join(' and ') + ' failed — not eligible for a Pass (11.6)');
    var potentialFail = failWhy.length > 0;
    /* The centre's own early-warning signal, not Cambridge's, and labelled so.
       Two not-to-standard lessons running in the second half is worth a tutor's
       eye; it is not a rule and it does not make anyone a potential Fail. */
    var watch = (backToBack && backToBack[1] >= secondHalfFrom() && !potentialFail)
      ? 'TP' + backToBack[0] + ' and TP' + backToBack[1] + ' not to standard back to back — worth a look (the centre\'s own signal, not a Cambridge rule)'
      : null;
    var letterIssued = !!(c.failLetter && String(c.failLetter).trim());
    var letterDue = potentialFail && !letterIssued;
    /* How much teaching practice is left, which is what makes a Fail letter
       urgent rather than merely due. Was 8 - graded: on a six-TP course with
       all six taught it answered "2 lessons left to teach — the window is
       closing" when the window had shut (tutor walk, 22 Sep 2026). */
    var lessonsLeft = tpTotal() - graded;
    /* 10.2: a Fail letter "should" be issued, "ideally with at least two
       lessons left to teach". Said in Cambridge's words; never an order. */
    if (letterDue) failWhy.push('no Fail letter issued · ' + (lessonsLeft <= 0 ? 'no lessons left to teach' : lessonsLeft + ' lesson' + (lessonsLeft === 1 ? '' : 's') + ' left to teach') + ' — 10.2: one should be issued, ideally with at least two lessons left');
    /* letterAdvised used to fire on a single assignment awaiting its
       resubmission and say "a letter can go out now". 9.2.3 GUARANTEES that
       resubmission ("candidates must have the opportunity... on one occasion
       only") and 11.6 says one failed assignment still permits a Pass, so the
       advice cut against two sections. Removed (audit, 29 Sep 2026). */
    var letterAdvised = false;
    var lateNotStd = notStdAt.filter(function(k){ return k >= secondHalfFrom(); });
    var lateOnlyStd = [];
    if (c.stage2 === 'ABOVE') for (var k2 = secondHalfFrom(); k2 <= tpTotal(); k2++) { var g2 = tpGrade(c['tp'+k2]); if (g2 && g2.key === 'STD') lateOnlyStd.push(k2); }
    var stage3Why = null;
    if (!c.stage3) {
      if (c.stage2 === 'NOTSTD') stage3Why = 'not to standard at Stage 2';
      else if (c.stage2 === 'ABOVE' && lateOnlyStd.length && !lateNotStd.length && !fails.length)
        stage3Why = 'above standard at Stage 2, then TP' + lateOnlyStd.join(' and TP') + ' only to standard — progress not maintained';
      else if (c.stage2 && lateNotStd.length)
        stage3Why = (c.stage2 === 'ABOVE' ? 'above standard' : 'to standard') + ' at Stage 2, then TP' + lateNotStd.join(' and TP') + ' not to standard';
    }
    /* 10.2's Stage 3 triggers are all about TP standard and progress after
       Stage 2. The three that used to sit here -- back-to-back lessons with no
       Stage 2 record, a failed assignment, more than one failed assignment --
       have no authority in 10.2, so they no longer claim Cambridge's name.
       stage2Hint went the same way: it told a tutor what judgement to enter
       ("Stage 2 should be recorded as not to standard") on arithmetic no
       Cambridge document recognises. */
    var stage2Hint = null;
    /* Due dates come from the course's own bands, as 10.2 measures them --
       "the first third", "the halfway point" -- not from fixed lesson counts.
       stage1Due fired at 3 while the first third of an eight-TP course ends at
       2, so it only ever appeared after the deadline had passed; stage2Due's
       hardcoded 4 ignored the course length entirely (audit, 29 Sep 2026). */
    var bands = stageBands();
    var stage1Due = (graded >= bands.s1End && !c.stage1);
    var stage2Due = (graded >= secondHalfFrom() - 1 && !c.stage2);
    var recorded = graded > 0 || fails.length > 0 || resubs.length > 0 || !!c.stage2 || !!c.stage3;
    /* 11.4.1: "If an unsuccessful candidate attends until the end of the
       course and submits a portfolio for assessment (even if incomplete), the
       result is Fail rather than Withdrawn." Lite held the deciding fact --
       the signed final declaration -- and let a yes/no toggle override
       everything. The toggle stays (manual override), but a contradiction is
       now said out loud. */
    var withdrawnFlag = (c.withdrawn === true || c.withdrawn === 'true');
    var withdrawnQuery = (withdrawnFlag && c.finalDeclarationSigned)
      ? 'marked withdrawn, but the CELTA 5 final declaration is signed — 11.4.1 makes that a Fail unless the candidate withdrew from assessment in writing'
      : null;
    var state = withdrawnFlag ? 'withdrawn'
      : !recorded ? 'none'
      : standard === 'NOTSTD' ? 'notstd'
      : standard === 'ABOVE' ? 'above'
      : standard === 'STD' ? 'std'
      : 'none';
    return {
      state:state, from:from, graded:graded, notStd:notStd, above:above,
      fails:fails, resubs:resubs, pending:pending, ceiling:ceiling,
      potentialFail:potentialFail, failWhy:failWhy, letterDue:letterDue, letterAdvised:letterAdvised, letterIssued:letterIssued,
      provisional:c.provisional, provisionalPassFail:provisionalPassFail, watch:watch, withdrawnQuery:withdrawnQuery,
      lessonsLeft:lessonsLeft, stage3Why:stage3Why, stage2Hint:stage2Hint, stage1Due:stage1Due, stage2Due:stage2Due
    };
  }
  var STATE_CHIP = {
    withdrawn: { text:'WITHDRAWN', cls:'tk-none' },
    notstd:    { text:'NOT TO STANDARD', cls:'tk-notstd' },
    std:       { text:'TO STANDARD', cls:'tk-std' },
    above:     { text:'ABOVE STANDARD', cls:'tk-above' },
    none:      { text:'NOT STARTED', cls:'tk-none' }
  };
  return { ASSIGNMENTS:ASSIGNMENTS, SHOW_AS:SHOW_AS, HUB_KEY_FOR:HUB_KEY_FOR, TP_GRADES:TP_GRADES, tpGrade:tpGrade, AIMS:AIMS, aimShort:aimShort, aimFor:aimFor,
    tpTotal:tpTotal, stageBands:stageBands, stageOf:stageOf, secondHalfFrom:secondHalfFrom,
    ASSIGN_LABEL:ASSIGN_LABEL, STAGES:STAGES, tpNumberOf:tpNumberOf, tpHistory:tpHistory, assignmentState:assignmentState,
    recordFor:recordFor, readCandidate:readCandidate, STATE_CHIP:STATE_CHIP };
})();
