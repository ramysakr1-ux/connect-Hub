/* Connect Lite — Teaching literacy (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs teaching-literacy-short <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   2  What literacy covers     under each of the five ideas, what it looks like in the room, shown (5)
 *   3  Spot the barrier         under each of the four moments, the right button's own words, in bold, then the
 *                               page's own note (4)
 *   4  Adapt the handout        both handouts, whichever one the screen is on: under each, the version to give, in
 *                               bold, with the page's own note (2)
 *   5  Techniques               under each of the five techniques, week one or later, in bold, and the page's note (5)
 * 1 (Lead-in: what the Mongolian line says) has one right answer and the page does not hold it, and 6 (Wrap-up) is the
 * trainee's own sentence: nothing is printed for either.
 *
 * WHERE EACH ANSWER COMES FROM
 *   Part 2: each idea's own hidden block (.reveal-card .a), which the stylesheet shows in this print without being asked.
 *   Part 3: the page's own list, top-level in its script, read by name (SCENARIOS: the moment, its two options, which
 *   one is right, the note). A moment is matched by its own words; the right option's label is read from the list and
 *   must stand on exactly one of the moment's own buttons. The note begins with that same label, so the label is put
 *   in bold and not said twice. A moment answered on the screen shows the note with a tick or a cross: that is put
 *   aside for this print (the page keeps the two options for the paper), so it prints as an untouched one.
 *   Part 4: the page's own lists, read by name (ADAPT_ORIGINAL, ADAPT_OPTIONS). The page prints both handouts whole
 *   (.h-paper, for the paper only); each is matched by its original's own words, and the one version the list marks
 *   true is written under it, word for word, with its note.
 *   Part 5: the page's own list, read by name (TECHNIQUES: the technique, week one or not, the note). The two answers
 *   themselves are not in that list: the page writes them in the click that opens a row. They are COPIED below, word
 *   for word, from that line in teaching-literacy-short/index.html:
 *       (t[1] ? 'Week one. ' : 'Once basic decoding is established. ')
 *   IF EITHER CHANGES ON THE PAGE, CHANGE IT HERE TOO, and run the check again.
 * Anything that does not match exactly gets no line: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: no option is pressed, no card or row opened or shut, the handout on the screen
 * stays where it is.
 */
SessionAnswers.register(function(A){
  /* the page's lists are top-level in its own script, so they are read by name; if one is missing, nothing is written */
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var words = function(el){ return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };

  /* COPIED from the click that opens a technique row (see the note at the top) */
  var WEEK_ONE = 'Week one.', LATER = 'Once basic decoding is established.';

  /* 2 · What literacy covers: each idea's own explanation is .reveal-card .a, shown by the stylesheet. */

  /* 3 · Spot the barrier: [the moment, its options, the index of the right one, the note]. */
  var scen = data(function(){ return SCENARIOS; });
  if (Array.isArray(scen)) A.each('#scens .scen', function(row){
    var said = words(row.querySelector(':scope > p:not(.why)'));
    var hit = scen.filter(function(s){ return s && norm(s[0]) === said; }); if (hit.length !== 1) return;
    var s = hit[0], label = s[1] && s[1][s[2]]; if (typeof label !== 'string') return;
    var btn = [].filter.call(row.querySelectorAll('.opt'), function(b){ return words(b) === norm(label); });
    if (btn.length !== 1) return;
    var note = norm(s[3]), head = norm(label) + ':';
    var html = note.indexOf(head) === 0 ? '<b>' + esc(head) + '</b> ' + esc(note.slice(head.length).trim()) : '<b>' + esc(norm(label)) + '.</b> ' + esc(note);
    if (A.line(row, html)) A.each('.why', function(w){ w.classList.add('ans-hide'); }, row);   /* the tick or cross of an answered moment */
  });

  /* 4 · Adapt the handout: each option is [the version, whether it is the one to give, the note]. */
  var orig = data(function(){ return ADAPT_ORIGINAL; }), opts = data(function(){ return ADAPT_OPTIONS; });
  if (Array.isArray(orig) && Array.isArray(opts)) A.each('#hPaper .hset', function(set){
    var said = words(set.querySelector('.text-block p'));
    var at = orig.map(function(o, i){ return norm(o) === said ? i : -1; }).filter(function(i){ return i >= 0; });
    if (at.length !== 1 || !Array.isArray(opts[at[0]])) return;
    var good = opts[at[0]].filter(function(o){ return o && o[1] === true; }); if (good.length !== 1) return;
    var on = [].filter.call(set.querySelectorAll('.hopt'), function(b){ return words(b) === norm(good[0][0]); });
    if (on.length !== 1) return;
    A.line(set, '<b>' + esc(norm(good[0][0])) + '</b> ' + esc(norm(good[0][2])));
  });

  /* 5 · Techniques: [the technique, week one or not, the note]. */
  var tech = data(function(){ return TECHNIQUES; });
  if (Array.isArray(tech)) A.each('#techs .trow', function(row){
    var said = words(row.querySelector('span:not(.tn)'));
    var hit = tech.filter(function(t){ return t && norm(t[0]) === said; }); if (hit.length !== 1) return;
    var t = hit[0]; if (typeof t[1] !== 'boolean') return;
    A.after(row, '<b>' + esc(t[1] ? WEEK_ONE : LATER) + '</b> ' + esc(norm(t[2])));
  });
});
