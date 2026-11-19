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
    'differentiation differentiated stronger weaker anticipated anticipate problems problem solutions solution assistance').split(' ');
  function complete(prefix){
    if (!ORDER || !prefix || prefix.length < 3) return null;
    for (var t = 0; t < TEACH.length; t++) { var x = TEACH[t]; if (x.length >= prefix.length + 2 && x.lastIndexOf(prefix, 0) === 0 && x.indexOf('-') === -1) return x; }
    var n = Math.min(ORDER.length, 60000), need = prefix.length + 2;
    for (var i = 0; i < n; i++) { var w = ORDER[i]; if (w.length >= need && w.lastIndexOf(prefix, 0) === 0 && w.indexOf("'") === -1) return w; }
    return null;
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
        out.push([a + ch + b, (ch === b[0] || ch === a[a.length - 1]) ? 4 : 1]);                     // a letter missing (a double: likely)
      }
    }
    return out;
  }
  /* the real words among them, best first: commoner words and likelier slips score higher */
  function known(list){
    var best = {};
    for (var i = 0; i < list.length; i++) { var w = list[i][0], r = RANK.get(w); if (!r) continue;
      var sc = list[i][1] / r; if (!best[w] || sc > best[w].sc) best[w] = { w: w, r: r, sc: sc }; }
    return Object.keys(best).map(function(k){ return best[k]; }).sort(function(x, y){ return y.sc - x.sc; });
  }
  /* the guess for one lower-case word, or null */
  function guess(w){
    if (!RANK || !w || w.length < 3 || w.length > 16 || !/^[a-z]+$/.test(w) || RANK.has(w)) return null;
    var need = w.length <= 4 ? 10 : 3;
    var c = known(edits1(w));
    if (c.length) return (c.length === 1 || c[0].sc >= c[1].sc * need) && c[0].r <= 60000 ? c[0].w : null;
    if (w.length < 6) return null;
    var e1 = edits1(w), all = [];
    for (var i = 0; i < e1.length; i++) { var e2 = edits1(e1[i][0]); for (var k = 0; k < e2.length; k++) all.push([e2[k][0], e1[i][1] * e2[k][1]]); }
    c = known(all);
    if (!c.length) return null;
    return (c.length === 1 || c[0].sc >= c[1].sc * 10) && c[0].r <= 30000 ? c[0].w : null;
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
