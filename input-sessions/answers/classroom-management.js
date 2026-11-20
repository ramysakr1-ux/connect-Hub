/* Connect Lite — Classroom management: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs classroom-management <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   2  So why pairs and groups?   the back of each of the six cards: the reason in bold, then why (6)
 *   4  Yes, no or maybe?          under each statement, the page's answer in bold and its reason (12)
 *   5  Spot the problem           under each of the fourteen moments (the page's paper list), the label that fits, in
 *                                 bold, and the page's own note on the line below (14)
 *   6  Grade your language        under each line, the clearer version (bold on the page) and its tip (6); the model
 *                                 behind "Compare with a model" (1)
 *   7  Instructions clinic        the box behind "Reveal answer" (.reveal-block, shown by the stylesheet) (1)
 * Parts 1 (would you rather), 2's sliders, 3 (the wheel) and 8 (take it into TP) are opinion, discussion or a choice
 * of one's own: there is no answer on the page, so none is printed.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page; nothing is copied into this file.
 *   Parts 2, 4 and 6: the page's own hidden blocks (.flip-back, .ynm-ans, .fix .good and .fix .tip, #model), shown.
 *   Part 5: the page's own lists, top-level in its script, read by name (quotes, defs). Each moment of the paper list
 *   (#matchPaper, built from quotes) is matched by its own words; the label is the page's own label button whose words
 *   are defs[d], and the note is the moment's own w. A moment that matches none, or more than one, gets no line. The
 *   screen's feedback line (#why) is put aside for this print, so the note is said once.
 * Nothing the trainee did is touched: no card is turned, no answer opened, no label pressed, the score stays.
 */
SessionAnswers.register(function(A){
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var words = function(el){ return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; };

  /* The page's own lists, read first. If the page is ever rebuilt without them, this stops here, before anything is
     written, and tools/answers-check.mjs reports the error. */
  var qs = quotes, labels = defs;

  /* 2 · So why pairs and groups? 4 · Yes, no or maybe? 6 · Grade your language: the page's own answers. */
  A.show('#advGrid .flip-back, #ynm .ynm-ans, #fixGrid .fix .good, #fixGrid .fix .tip, #model');

  /* 5 · Spot the problem: under each moment, the label that fits and the page's note. */
  var buttons = [].slice.call(document.querySelectorAll('#defs .def'));
  A.each('#matchPaper > li', function(li){
    var said = words(li);
    var hit = qs.filter(function(q){ return A.txt(q.l.map(function(x){ return '<span>' + x[0] + ':</span> ' + x[1]; }).join('<br>')) === said; });
    if (hit.length !== 1) return;
    var q = hit[0], b = buttons.filter(function(x){ return x.textContent === labels[q.d]; });
    if (b.length !== 1) return;
    A.line(li, '<b>' + esc(b[0].textContent) + '</b><br>' + esc(q.w));   /* on a line of its own: a label can end in ? or a quote mark */
  });
  A.hide('#why');
});
