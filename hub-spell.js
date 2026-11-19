/* THE SPELLING GUESS BEHIND THE TUTORS' AUTOCORRECT (Ramy, 19 Nov 2026: "autocorrect isn't really working. Needs to be
   better ... like Google"). hub-autocorrect.js used to know only a fixed list of a few hundred typos. This knows English:
   library/words-en.txt is about 141,000 words, commonest first (pyspellchecker's English frequency list, MIT, with the
   British spellings and the CELTA terms added, so "colour", "realise" and "CCQ" are words and never "fixed").

   A word is changed only when it is not a word at all and one answer clearly wins:
   - one letter away (a letter missing, extra, wrong, or two swapped): each candidate is scored by how common the word is
     and how likely the slip is (two letters swapped, a doubled letter, the key next door: likely); the best must score
     three times the next, ten times for a word of four letters or fewer;
   - two letters away, only for words of six letters or more and only when nothing is one letter away: the winner must
     score ten times the next.
   Otherwise the word is left as typed. Spelling only: no grammar, no style. Loaded by hub-autocorrect.js for tutors. */
(function(root){
  var RANK = null, loading = null;
  var A = 'abcdefghijklmnopqrstuvwxyz';

  var ORDER = null;   // the words, commonest first, for completing a word as it is typed
  function fromText(txt){
    var m = new Map(), lines = txt.split('\n');
    for (var i = 0; i < lines.length; i++) if (lines[i]) m.set(lines[i], i + 1);
    ORDER = lines.filter(Boolean);
    return m;
  }
  /* WORD COMPLETION (Ramy, 19 Nov 2026: "predict the word ... like Google"): the commonest word that starts with what has
     been typed, at least two letters longer, from the 60,000 commonest. */
  /* the words of TP feedback, offered before the general list, which comes from film subtitles and would offer
     "instrumental" for "instr" */
  var TEACH = ('instructions instruction instructed instructing elicited eliciting elicit elicitation monitored monitoring monitor ' +
    'nominated nominating nominate pronunciation pronounced vocabulary learners learner students student feedback activities activity ' +
    'appropriate appropriately effectively effective clarification clarified clarify clarifying meaning context contexts concept ' +
    'controlled practice practise practising practising freer production presentation demonstration demonstrated demonstrate ' +
    'interaction interactions interacted engaged engaging engagement encouraged encouraging confidence confident confidently ' +
    'rapport timing timed staging stages stage transitions transition objectives objective lesson lessons planning planned plan ' +
    'materials material worksheet worksheets handout handouts boardwork board grammar grammatical lexis lexical language ' +
    'structure structures sentences sentence examples example accuracy accurate accurately fluency fluent fluently correction ' +
    'corrected correcting errors error mistakes mistake checked checking questions question concept-checking understanding ' +
    'understood comprehension listening reading speaking writing skills subskills gist detail specific information predict ' +
    'prediction predicting discussion discuss discussed partners partner pairs groups grouped whole-class individually ' +
    'improvement improve improved improving development developing developed consider considered considering remember ' +
    'particularly especially generally overall excellent successful successfully clearly clear helpful useful supportive ' +
    'participation participate participated opportunity opportunities realistic relevant personalisation personalised ' +
    'personalization personalized intonation stress weak forms contractions drilled drilling drill highlighted highlight ' +
    'modelled modelling modeled modeling elicitation sequence sequencing balance variety pace pacing energy atmosphere ' +
    'differentiation differentiated stronger weaker anticipated anticipate problems problem solutions solution assistance study studied').split(' ');
  /* COMPLETION THAT READS THE WORD BEFORE (Ramy, 19 Nov 2026: "it doesn't understand structure and grammar ... 'to dec'
     ... it's going for decided"). No grammar model: a handful of rules for the patterns tutors write most, a verb test
     from the list itself (a word is a verb if its -ed and -ing forms are words too), the tutor's own two-word phrases,
     and silence when no one word clearly wins.
     - after to, a modal, do / does / did and their negatives: the base form of a verb ("to decide");
     - after have / has / had: a past participle ("have decided", "have taught");
     - after am / is / are / was / were / be / been: not a bare verb and not a verb with -s ("was decided", "is clear");
     - after the / a / an / this / your / their and the like: not a verb's -ed form. */
  var TEACHSET = {}; TEACH.forEach(function(w){ TEACHSET[w] = 1; });
  var BASE = {}, HAVE = {}, BE = {}, DET = {};
  ('to can could will would shall should may might must do does did dont doesnt didnt cant cannot wont wouldnt shouldnt couldnt mustnt lets help').split(' ').forEach(function(w){ BASE[w] = 1; });
  ('have has had having havent hasnt hadnt ive youve weve theyve').split(' ').forEach(function(w){ HAVE[w] = 1; });
  ('am is are was were be been being isnt arent wasnt werent im youre theyre were hes shes its').split(' ').forEach(function(w){ BE[w] = 1; });
  ('the a an this that these those my your his her its our their some any each every no another').split(' ').forEach(function(w){ DET[w] = 1; });
  var IRREG = ('been done gone seen given taken made said told taught thought brought bought found left kept felt heard understood begun ' +
    'written spoken chosen known shown grown drawn thrown broken forgotten got gotten put set let read run come become meant sent spent ' +
    'built held stood won lost led met paid sold sat slept caught fought sought dealt bent lent lit cut hit hurt shut spread ' +
    'drunk sung rung swum ridden driven risen fallen eaten beaten woken worn torn sworn hidden bitten forgiven').split(' ');
  var IRR = {}; IRREG.forEach(function(w){ IRR[w] = 1; });
  function has(w){ return !!(RANK && RANK.has(w)); }
  /* a verb's base form: its -ed (or -d) and -ing forms are words too */
  function verbBase(w){
    if (w.length < 3 || /(ed|ing|ly)$/.test(w)) return false;
    var ed = has(w + 'ed') || (/e$/.test(w) && has(w + 'd')) || (/[^aeiou]y$/.test(w) && has(w.slice(0, -1) + 'ied')) || has(w + w.slice(-1) + 'ed');
    var ing = has(w + 'ing') || (/e$/.test(w) && has(w.slice(0, -1) + 'ing')) || has(w + w.slice(-1) + 'ing');
    return ed && ing;
  }
  function edForm(w){
    if (!/ed$/.test(w)) return false;
    var a = w.slice(0, -2), b = w.slice(0, -1);
    return verbBase(a) || verbBase(b) || (/ied$/.test(w) && verbBase(w.slice(0, -3) + 'y')) || (a.length > 2 && a.slice(-1) === a.slice(-2, -1) && verbBase(a.slice(0, -1)));
  }
  function sForm(w){ return /s$/.test(w) && !/ss$/.test(w) && (verbBase(w.slice(0, -1)) || (/es$/.test(w) && verbBase(w.slice(0, -2)))); }
  /* an adjective as well as a verb (clear, open, free): it has an -ly form */
  function adjLike(w){ return has(w + 'ly') || (/y$/.test(w) && has(w.slice(0, -1) + 'ily')) || (/le$/.test(w) && has(w.slice(0, -1) + 'y')); }
  function fits(w, prev){
    if (!prev) return true;
    if (BASE[prev]) return verbBase(w);
    if (HAVE[prev]) return edForm(w) || !!IRR[w];
    if (BE[prev]) return !sForm(w) && !(verbBase(w) && !adjLike(w));   // "was decided", "is clear"; not "was decide"
    if (DET[prev]) return !edForm(w) && !(verbBase(w) && (rankOf(w + 'ed') < rankOf(w) * 3 || rankOf(w + 'd') < rankOf(w) * 3));   // "the lesson", "the plan"; not "the decide"
    return true;
  }
  function rankOf(w){ return (RANK && RANK.get(w)) || 1e9; }
  /* the word to offer for what has been typed, after the word before it; mine = { words: {w: n}, pairs: {'prev w': n} } */
  function complete(prefix, prev, mine){
    if (!ORDER || !prefix || prefix.length < 3) return null;
    prev = String(prev || '').toLowerCase().replace(/[’']/g, '');
    var need = prefix.length + 1, start = function(w){ return w.length >= need && w.lastIndexOf(prefix, 0) === 0 && !/['\-]/.test(w); };
    mine = mine || {};
    /* 1. a two-word phrase the tutor has used before wins */
    var pairs = mine.pairs || {}, bp = null, bn = 1;
    if (prev) for (var k in pairs) { var sp = k.indexOf(' '); if (k.slice(0, sp) === prev) { var w2 = k.slice(sp + 1); if (pairs[k] > bn && start(w2)) { bp = w2; bn = pairs[k]; } } }
    if (bp) return bp;
    /* 2. otherwise the candidates, each with a score: commoner is better; a TP feedback word and one the tutor uses often count as common */
    var cand = [], seen = {}, words = mine.words || {};
    var push = function(w, r){ if (seen[w] || !start(w) || !fits(w, prev)) return; seen[w] = 1; cand.push([w, r]); };
    for (var t = 0; t < TEACH.length; t++) if (start(TEACH[t])) push(TEACH[t], 30 + t);   // TP feedback words, in the list's order
    for (var mw in words) if (words[mw] >= 3 && start(mw)) push(mw, Math.min(rankOf(mw), 300 / Math.min(words[mw], 30) * 3));
    var n = Math.min(ORDER.length, 60000), found = 0;
    for (var i = 0; i < n && found < 40; i++) { var w = ORDER[i]; if (start(w)) { found++; push(w, i + 1); } }
    if (!cand.length) return null;
    cand.sort(function(a, b){ return a[1] - b[1]; });
    /* 3. only a clear winner: at least twice as likely as the next */
    /* forms of the same word (instruction, instructions) do not compete: the first one stands */
    var top = cand[0][0], fam = function(a, b){ var k = 0; while (k < a.length && a[k] === b[k]) k++; return k >= Math.max(a.length, b.length) - 4 && k >= Math.min(a.length, b.length) - 3; };
    var rival = null; for (var q = 1; q < cand.length; q++) if (!fam(top, cand[q][0])) { rival = cand[q]; break; }
    if (rival && rival[1] < cand[0][1] * 2) return null;
    /* a word one letter longer ("wer", were) wins but is not worth a Tab: offer nothing rather than something longer and wrong */
    if (top.length < prefix.length + 2 || rankOf(top) > 25000 && !TEACHSET[top]) return null;
    return top;
  }
  /* QWERTY neighbours: a slip to the next key is a likelier typo than a letter from across the keyboard */
  var ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'], NEAR = {};
  ROWS.forEach(function(r, y){ for (var x = 0; x < r.length; x++) { var n = '';
    [[y, x - 1], [y, x + 1], [y - 1, x], [y - 1, x + 1], [y + 1, x], [y + 1, x - 1]].forEach(function(p){ var row = ROWS[p[0]]; if (row && row[p[1]]) n += row[p[1]]; });
    NEAR[r[x]] = n; } });
  /* every word one edit away, with how likely that slip is */
  function edits1(w){
    var out = [], i, j, L = w.length;
    for (i = 0; i <= L; i++) {
      var a = w.slice(0, i), b = w.slice(i);
      if (b) out.push([a + b.slice(1), (i > 0 && w[i - 1] === b[0]) ? 4 : 0.2]);                    // a letter too many (a doubled one: likely)
      if (b.length > 1 && b[0] !== b[1]) out.push([a + b[1] + b[0] + b.slice(2), 4]);              // two letters swapped
      for (j = 0; j < 26; j++) {
        var ch = A[j];
        if (b && ch !== b[0]) out.push([a + ch + b.slice(1), NEAR[b[0]].indexOf(ch) > -1 ? 1.5 : /[aeiou]/.test(ch) && /[aeiou]/.test(b[0]) ? 1.5 : 0.3]); // a wrong letter
        out.push([a + ch + b, (ch === b[0] || ch === a[a.length - 1]) ? 4 : 2]);                     // a letter missing: the commonest slip (a double: likelier still)
      }
    }
    return out;
  }
  /* the real words among them, best first: commoner words and likelier slips score higher */
  function known(list){
    var best = {};
    for (var i = 0; i < list.length; i++) { var w = list[i][0], r = RANK.get(w); if (!r) continue;
      if (TEACHSET[w] && r > 3000) r = 3000;   // the words of TP feedback count as common: "elcited" is elicited, not excited
      var sc = list[i][1] / r; if (!best[w] || sc > best[w].sc) best[w] = { w: w, r: r, sc: sc }; }
    return Object.keys(best).map(function(k){ return best[k]; }).sort(function(x, y){ return y.sc - x.sc; });
  }
  /* the guess for one lower-case word, or null */
  function guess(w, strict){
    if (!RANK || !w || w.length < 3 || w.length > 16 || !/^[a-z]+$/.test(w) || RANK.has(w)) return null;
    /* Ramy, 19 Nov 2026: "it shouldn't really allow a word that looks like a word, but it's not a word": a non-word gets the
       best answer unless two are nearly level */
    var need = (w.length <= 4 ? 3 : 1.5) * (strict ? 2 : 1), cap = strict ? 20000 : 80000;   // strict: a capitalised first word, which may be a name
    var c = known(edits1(w));
    if (c.length) return (c.length === 1 || c[0].sc >= c[1].sc * need) && c[0].r <= cap ? c[0].w : null;
    if (strict) return null;
    if (w.length < 5) return null;
    var e1 = edits1(w), all = [];
    for (var i = 0; i < e1.length; i++) { var e2 = edits1(e1[i][0]); for (var k = 0; k < e2.length; k++) all.push([e2[k][0], e1[i][1] * e2[k][1]]); }
    c = known(all);
    if (!c.length) return null;
    return (c.length === 1 || c[0].sc >= c[1].sc * 3) && c[0].r <= 40000 ? c[0].w : null;
  }
  function load(url){
    if (RANK) return Promise.resolve(true);
    if (!loading) loading = fetch(url || 'library/words-en.txt').then(function(r){ if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function(t){ RANK = fromText(t); return true; }, function(){ loading = null; return false; });
    return loading;
  }
  var api = { load: load, guess: guess, complete: complete, isWord: function(w){ return !!(RANK && RANK.has(w)); }, ready: function(){ return !!RANK; },
              _useText: function(t){ RANK = fromText(t); } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.hubSpell = api;
})(this);
