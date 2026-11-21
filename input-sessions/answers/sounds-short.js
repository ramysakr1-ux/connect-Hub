/* Connect Lite — Sounds (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs sounds-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   2  Terminology   under each of the six terms: the definition the page pairs with it
 *   7  Clap game     under each of the four pairs: the word each Play gives, in the page's own order, from the first
 *                    Play to the twelfth (the order then starts again)
 *   8  Dictation     under each of the three rows: the word the page says and counts as right
 * Part 1 (the lead-in) names its two words in their order in its own text. Parts 3, 4 and 6 are to hear and to read,
 * and part 5 is checked against the summary the page already shows beside each sound: the page holds no other answer
 * to any of them, so none is printed.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file.
 *   Part 2: the page's own list (MATCH, the one its matching goes by), read by name. A term is found by its own words.
 *   Part 7: the page's own lists and rule (PAIRS, MIX, wordFor: the ones its Play button goes by), read by name. A row
 *   is found by the two words on its own pads.
 *   Part 8: the page's own list (DICT; the first word of each item is the one its Play button says and its buttons
 *   mark against), read by name. A row is found by the words on its own buttons.
 * A row that cannot be found exactly once, or a list that is missing, gets no line: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: nothing is matched, played, clapped or chosen, and no round moves on. The page's
 * own print rules already put a matched pair, a clapped pad and a chosen word back on paper as they were untouched,
 * without "Correct", "Not quite" or the counts, so an answered page prints the same as an untouched one.
 */
SessionAnswers.register(function(A){
  /* the page's lists are top-level in its own script, so they are read by name; one that is missing writes nothing */
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var bold = function(t){ return '<b>' + esc(t) + '</b>'; };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  var isList = function(x){ return !!x && typeof x.forEach === 'function' && x.length > 0; };
  /* a row is laid out side by side, so the line is given the full width, to stand under the row and not beside it */
  var under = function(row, html){ var l = A.line(row, html); if (l) l.style.flex = '0 0 100%'; };

  /* 2 · Terminology. Each item of the page's list is [the term, its definition]. */
  var match = data(function(){ return MATCH; });
  if (isList(match)) match.forEach(function(m){
    if (!m || typeof m[0] !== 'string' || typeof m[1] !== 'string') return;
    var term = list('#mLeft .pill').filter(function(b){ return norm(b.textContent) === norm(m[0]); });
    if (term.length === 1) A.after(term[0], bold(m[1]));
  });

  /* 7 · Clap game. PAIRS holds the two words of each row; wordFor(row, round) says which of the two a Play gives, and
     the order runs for as many rounds as MIX is long before it starts again. The row is the one whose two pads carry
     the pair's two words (a pad reads "👏 word"). */
  var pairs = data(function(){ return PAIRS; }), mix = data(function(){ return MIX; }), rule = data(function(){ return wordFor; });
  if (isList(pairs) && isList(mix) && typeof rule === 'function') pairs.forEach(function(p, i){
    if (!isList(p) || p.length !== 2) return;
    var row = list('#clap .box').filter(function(box){
      var pads = list('.pad', box);
      return pads.length === 2 && pads.every(function(b, k){ return norm(b.textContent).split(' ').pop() === p[k]; });
    });
    if (row.length !== 1) return;
    var words = [];
    for (var r = 0; r < mix.length; r++) { var w = p[rule(i, r)]; if (typeof w !== 'string') return; words.push((r + 1) + ' ' + bold(w)); }
    under(row[0], words.join(' · '));
  });

  /* 8 · Dictation. Each item of the page's list is [the word said, [the three other words]]. The row is the one whose
     buttons carry exactly those four words; the answer is the row's own button for the word said. */
  var dict = data(function(){ return DICT; });
  if (isList(dict)) dict.forEach(function(d){
    if (!d || typeof d[0] !== 'string' || !isList(d[1])) return;
    var all = [d[0]].concat(d[1]).sort().join('|');
    var row = list('#dict .box').filter(function(box){ return list('.opt', box).map(function(b){ return b.textContent; }).sort().join('|') === all; });
    if (row.length !== 1) return;
    var hit = list('.opt', row[0]).filter(function(b){ return b.textContent === d[0]; });
    if (hit.length === 1) under(row[0], bold(hit[0].textContent));
  });
});
