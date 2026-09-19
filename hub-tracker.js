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
  var ASSIGNMENTS = ['SRT', 'FOL', 'LRT', 'LFC'];
  var HUB_KEY_FOR = { SRT:'lsrt', FOL:'fol', LRT:'lrt', LFC:'lfc' };
  var TP_GRADES = [
    { key:'ABOVE', label:'Above standard', short:'AS' },
    { key:'STD', label:'To standard', short:'S' },
    { key:'NOTSTD', label:'Not to standard', short:'NS' }
  ];
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
  var SECOND_HALF_FROM = 5;
  var STAGE2_DUE_AFTER = 4;

  /** The TP number a returned feedback record is about, from its own header. */
  function tpNumberOf(fb){
    var f = fb && fb.state && fb.state.f;
    var n = parseInt(String((f && f.fTP) || (fb && fb.label) || '').replace(/\D/g, ''), 10);
    return n >= 1 && n <= 8 ? n : 0;
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
    var hist = tpHistory(tr);
    for (var n = 1; n <= 8; n++) {
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
    for (var k = 1; k <= 8; k++) {
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
    var failWhy = [];
    if (standard === 'NOTSTD' && from.indexOf('Stage') === 0) failWhy.push(from + ' not to standard');
    if (backToBack && backToBack[1] >= SECOND_HALF_FROM) failWhy.push('TP' + backToBack[0] + ' and TP' + backToBack[1] + ' not to standard back to back');
    if (fails.length > 1) failWhy.push(fails.join(' and ') + ' failed — not eligible for a Pass');
    var potentialFail = failWhy.length > 0;
    var letterIssued = !!(c.failLetter && String(c.failLetter).trim());
    var letterDue = potentialFail && !letterIssued;
    var lessonsLeft = 8 - graded;
    if (letterDue) failWhy.push(lessonsLeft <= 2
      ? (lessonsLeft <= 0 ? 'no lessons left to teach — issue it today' : lessonsLeft + ' lesson' + (lessonsLeft === 1 ? '' : 's') + ' left to teach — the window is closing')
      : lessonsLeft + ' lessons left to teach');
    var letterAdvised = !potentialFail && !letterIssued && (fails.length + pending.length) >= 1 && fails.length <= 1;
    var lateNotStd = notStdAt.filter(function(k){ return k >= SECOND_HALF_FROM; });
    var lateOnlyStd = [];
    if (c.stage2 === 'ABOVE') for (var k2 = SECOND_HALF_FROM; k2 <= 8; k2++) { var g2 = tpGrade(c['tp'+k2]); if (g2 && g2.key === 'STD') lateOnlyStd.push(k2); }
    var stage3Why = null;
    if (!c.stage3) {
      if (c.stage2 === 'NOTSTD') stage3Why = 'not to standard at Stage 2';
      else if (c.stage2 === 'ABOVE' && lateOnlyStd.length && !lateNotStd.length && !fails.length)
        stage3Why = 'above standard at Stage 2, then TP' + lateOnlyStd.join(' and TP') + ' only to standard — progress not maintained';
      else if (c.stage2 && (lateNotStd.length || fails.length))
        stage3Why = (c.stage2 === 'ABOVE' ? 'above standard' : 'to standard') + ' at Stage 2, then ' +
          (lateNotStd.length ? 'TP' + lateNotStd.join(' and TP') + ' not to standard' : fails.join(' and ') + ' failed');
      else if (backToBack) stage3Why = 'TP' + backToBack[0] + ' and TP' + backToBack[1] + ' not to standard back to back';
      else if (fails.length > 1) stage3Why = fails.join(' and ') + ' failed — not eligible for a Pass';
    }
    var stage2Hint = (!c.stage2 && backToBack)
      ? 'TP' + backToBack[0] + ' and TP' + backToBack[1] + ' not to standard back to back — Stage 2 should be recorded as not to standard'
      : null;
    var stage1Due = (graded >= 3 && !c.stage1);
    var stage2Due = (graded >= STAGE2_DUE_AFTER && !c.stage2);
    var recorded = graded > 0 || fails.length > 0 || resubs.length > 0 || !!c.stage2 || !!c.stage3;
    var state = (c.withdrawn === true || c.withdrawn === 'true') ? 'withdrawn'
      : !recorded ? 'none'
      : standard === 'NOTSTD' ? 'notstd'
      : standard === 'ABOVE' ? 'above'
      : standard === 'STD' ? 'std'
      : 'none';
    return {
      state:state, from:from, graded:graded, notStd:notStd, above:above,
      fails:fails, resubs:resubs, pending:pending, ceiling:ceiling,
      potentialFail:potentialFail, failWhy:failWhy, letterDue:letterDue, letterAdvised:letterAdvised, letterIssued:letterIssued,
      stage3Why:stage3Why, stage2Hint:stage2Hint, stage1Due:stage1Due, stage2Due:stage2Due
    };
  }
  var STATE_CHIP = {
    withdrawn: { text:'WITHDRAWN', cls:'tk-none' },
    notstd:    { text:'NOT TO STANDARD', cls:'tk-notstd' },
    std:       { text:'TO STANDARD', cls:'tk-std' },
    above:     { text:'ABOVE STANDARD', cls:'tk-above' },
    none:      { text:'NOT STARTED', cls:'tk-none' }
  };
  return { ASSIGNMENTS:ASSIGNMENTS, HUB_KEY_FOR:HUB_KEY_FOR, TP_GRADES:TP_GRADES, tpGrade:tpGrade, AIMS:AIMS, aimShort:aimShort, aimFor:aimFor,
    ASSIGN_LABEL:ASSIGN_LABEL, STAGES:STAGES, tpNumberOf:tpNumberOf, tpHistory:tpHistory, assignmentState:assignmentState,
    recordFor:recordFor, readCandidate:readCandidate, STATE_CHIP:STATE_CHIP };
})();
