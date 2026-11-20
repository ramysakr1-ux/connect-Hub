/* Connect Lite — Teaching literacy: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs teaching-literacy <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   2  What literacy covers     under each of the five ideas, what it looks like in the room, shown (5)
 *   3  Spot the barrier         under each of the four moments, the right button's own words, in bold, then the
 *                               page's own note (4)
 *   4  Adapt the handout        both handouts, whichever one the screen is on: the original, its three versions, the
 *                               one to give in bold with the page's own note (2)
 *   5  Techniques               under each of the five techniques, week one or later, and the page's note, shown (5)
 *   6  Plan it                  one way to plan it, behind "Reveal answer"
 *   7  Adapt a TP handout       what most good redesigns change, behind "Reveal answer"
 * The boxes behind a button are .reveal-block, which the stylesheet shows in this print without being asked.
 * The lead-in (what the Mongolian line says) and the wrap-up have no answer on the page, so none is printed.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page itself; nothing is copied into this file.
 *   Part 2: each idea's own hidden block (.concept .d), shown.
 *   Part 3: the page's own list, top-level in its script, read by name (SCENARIOS): a moment is matched by its own
 *   words; the right option is the button whose data-v is that moment's answer, and its label is read from the button.
 *   A moment that matches none, or more than one, gets no line. The page's own note (.why) is said in the line, and
 *   that block is put aside for this print so the note is said once.
 *   Part 4: the page's own list (ADAPT), read by name. The screen shows one handout at a time, so for this print the
 *   live one is put aside and both are written out, in the page's order: an answered task prints as an untouched one.
 *   Part 5: each technique's own hidden block (.tech .a), shown; it already says the answer in bold.
 * Nothing the trainee did is touched: no option is pressed, no card opened or shut, the handout on the screen stays
 * where it is, and what was typed stays as it is.
 */
SessionAnswers.register(function(A){
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var words = function(el){ return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; };

  /* 2 · What literacy covers: each idea's own explanation. */
  A.show('#concepts .concept .d');

  /* 3 · Spot the barrier: the right button's words, then the page's note (which starts with those same words). */
  var scen = data(function(){ return SCENARIOS; });
  if (Array.isArray(scen)) A.each('#scenarios .scen', function(row){
    var t = row.querySelector('.t'), opts = row.querySelector('.opts'); if (!t || !opts) return;
    var said = words(t).replace(/^\d+\.\s*/, '');
    var hit = scen.filter(function(s){ return s && A.txt(s.text) === said; }); if (hit.length !== 1) return;
    var s = hit[0], btn = [].filter.call(opts.querySelectorAll('.opt'), function(b){ return b.dataset.v === s.answer; });
    if (btn.length !== 1) return;
    var label = words(btn[0]), note = A.txt(s.note), head = label + '.';
    var rest = note.indexOf(head) === 0 ? note.slice(head.length).trim() : note;
    A.after(opts, '<b>' + esc(head) + '</b>' + (rest ? ' ' + esc(rest) : ''));
  });
  A.hide('#scenarios .ans-line + .why');

  /* 4 · Adapt the handout: both handouts, the one to give in bold with its note. */
  var adapt = data(function(){ return ADAPT; }), box = document.getElementById('adaptOptions');
  if (Array.isArray(adapt) && box) {
    var html = adapt.map(function(a, i){
      var good = (a.options || []).filter(function(o){ return o.good; }); if (good.length !== 1) return '';
      return '<div style="margin-top:' + (i ? '10px' : '0') + '"><b>Handout ' + (i + 1) + ' of ' + adapt.length + '.</b> Original handout: <i>' + esc(A.txt(a.original)) + '</i></div>'
        + a.options.map(function(o){ return o.good ? '<div><b>' + esc(A.txt(o.text)) + '</b> ' + esc(A.txt(o.note)) + '</div>' : '<div>' + esc(A.txt(o.text)) + '</div>'; }).join('');
    });
    if (html.every(Boolean)) {
      A.after(box, html.join(''));
      A.hide('#adaptLabel'); A.hide('#s4 p.label'); A.hide('#adaptOriginal'); A.hide('#adaptOptions');
    }
  }

  /* 5 · Techniques: each technique's own note, which names the answer in bold. */
  A.show('#techniques .tech .a');
});
