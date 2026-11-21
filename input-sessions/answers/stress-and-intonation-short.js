/* Connect Lite — Stress and intonation (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs stress-and-intonation-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   1  Intonation: question or statement?   under each of the three lines: what the page shows behind its Reveal
 *   2  Marking stress for LRT               under each of the four words: the word with the syllable the page counts
 *                                           as right in bold, which is the page's own convention ("a bold syllable")
 *   3  Primary and secondary stress         under each of the six words: the circles as the page's Reveal draws them
 *                                           (small, middle, large), and the same said in words, because a row of
 *                                           circles alone is easy to misread on paper
 *   4  Stress carries attitude              under each of the three replies: every explanation the page holds for it,
 *                                           in the order of the words. The trainee's own choice is open; the page's
 *                                           explanations are its suggested readings, each naming the word it is for.
 *
 * WHERE THE ANSWERS COME FROM. All of it from the page's own lists (INTO, MARK, DBL with SIZE, CON), which are
 * top-level in its script and are read by name. Nothing is copied into this file. Each row on the page is matched to
 * its item by the row's own words (the line, the word's syllables, the word, the context line); a row that matches no
 * item, or more than one, gets no line: nothing is guessed.
 *
 * In 3 the words "primary stress" and "secondary stress" are the page's (its heading and lead), and "Syllable 1" is
 * the name each circle already carries.
 *
 * Nothing the trainee did is touched: nothing is pressed, revealed or reset. What an answered row shows on the screen
 * (a revealed tune, "Correct" or "Try again", bold and colored syllables, sized circles, the chosen word and its
 * explanation) is already put aside on paper by the page's own print rules, so an answered page prints the same as an
 * untouched one and each answer is said once.
 */
SessionAnswers.register(function(A){
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  var one = function(arr, test){ var hit = (arr && arr.filter) ? arr.filter(test) : []; return hit.length === 1 ? hit[0] : null; };
  /* a row here is laid side by side (a grid on a narrow screen), so its answer takes the full width, under the row */
  var under = function(box, html){ var l = A.line(box, html); if (l) { l.style.flex = '0 0 100%'; l.style.gridColumn = '1 / -1'; } return l; };

  var INTO_ = data(function(){ return INTO; }), MARK_ = data(function(){ return MARK; }),
      DBL_ = data(function(){ return DBL; }), SIZE_ = data(function(){ return SIZE; }), CON_ = data(function(){ return CON; });

  /* 1 · Intonation. Each item is [the line, rising or not, what Reveal shows, the recording's stress]. */
  A.each('#into .box', function(box){
    var p = box.querySelector('.line'); if (!p) return;
    var it = one(INTO_, function(x){ return x && '"' + norm(x[0]) + '"' === norm(p.textContent); });
    if (it && typeof it[2] === 'string') under(box, '<b>' + esc(it[2]) + '</b>');
  });

  /* 2 · Marking stress. Each item is [the syllables, which one carries the stress]. */
  A.each('#mark .box', function(box){
    var word = list('.syl', box).map(function(s){ return s.textContent; }).join('|');
    var it = one(MARK_, function(x){ return x && x[0] && x[0].join && x[0].join('|') === word; });
    if (!it || typeof it[1] !== 'number' || it[1] < 0 || it[1] >= it[0].length) return;
    under(box, it[0].map(function(s, i){ return i === it[1] ? '<b>' + esc(s) + '</b>' : esc(s); }).join(''));
  });

  /* 3 · Primary and secondary stress. Each item is [the word, how many syllables, a level for each: 0 none,
     1 secondary, 2 primary]. The circles are drawn at the page's own three sizes. */
  A.each('#dbl .box', function(box){
    var w = box.querySelector('.word'); if (!w) return;
    var it = one(DBL_, function(x){ return x && norm(x[0]) === norm(w.textContent); });
    if (!it || !it[2] || !it[2].map || it[2].length !== list('.dot', box).length) return;
    var size = function(lv){ return (SIZE_ && SIZE_[lv]) || [14, 22, 32][lv] || 14; };
    var dots = it[2].map(function(lv){
      return '<span style="display:inline-block;vertical-align:bottom;margin-right:8px;border:1.5px solid #333;border-radius:999px;width:' + size(lv) + 'px;height:' + size(lv) + 'px"></span>';
    }).join('');
    var said = [];
    it[2].forEach(function(lv, i){ if (lv === 1) said.push('Syllable ' + (i + 1) + ': secondary stress'); if (lv === 2) said.push('Syllable ' + (i + 1) + ': <b>primary stress</b>'); });
    under(box, dots + ' ' + said.join('. ') + '.');
  });

  /* 4 · Stress carries attitude. Each item is [the context, the reply, an explanation for some of its words]. */
  A.each('#con .box', function(box){
    var c = box.querySelector('.ctxl'); if (!c) return;
    var it = one(CON_, function(x){ return x && norm(x[0]) === norm(c.textContent); });
    if (!it || !it[2]) return;
    var keys = Object.keys(it[2]).map(Number).sort(function(a, b){ return a - b; });
    if (keys.length) A.line(box, keys.map(function(k){ return esc(it[2][k]); }).join('<br>'));
  });
});
