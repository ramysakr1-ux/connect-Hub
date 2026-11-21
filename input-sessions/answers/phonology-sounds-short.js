/* Connect Lite — Phonology: sounds (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs phonology-sounds-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   1  Sounds vs letters           under each of the five rows: the word, its letters, its sounds; then the answer to
 *                                  "Why doesn't the number of letters match the number of sounds?", inside its card
 *   2  Terminology                 under each of the six terms: the meaning the page pairs with it
 *   3  Where is the obstruction?   under each of the eight sounds: the place, in the words of its own dropdown
 *   4  Voiced or unvoiced?         under each of the eight words: the spelling, and whether its first and its last
 *                                  sound are voiced, in the words of its own buttons
 *   6  Write it in phonemic script the page's own card "Reveal the answers", open or shut
 *   7  Film titles                 the page's own card "Reveal the titles", open or shut
 * The answers of the three cards (parts 1, 6 and 7) are the page's own reveal cards: the stylesheet shows them in this
 * print by itself (.reveal-card .a), so nothing is written for them here.
 * Part 5 is the chart, to hear: nothing to answer. The closing question of part 7 ("which two sounds from today are
 * most likely to trouble your own TP group, and why?") is the trainee's own: the page holds no answer, so none is
 * printed.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file.
 *   Parts 1, 3 and 4: the page's own lists, the ones its Check buttons mark against, read by name (LEAD, OBS, VOICING).
 *   A row is found by what the page itself puts on it: the word its Play button says (part 1), its symbol (part 3),
 *   its phonemic script (part 4). The words of a place are those of the row's own dropdown, and "voiced" or
 *   "unvoiced" those of the row's own buttons.
 *   Part 2: the page keeps its six pairs inside the call that draws them, where this file cannot read them; but it
 *   gives a term and its meaning the same number (data-l on the term, data-r on the meaning), and that number is what
 *   its own matching goes by. The pair is read from there.
 * A row that cannot be found exactly once, or a list that is missing, gets no line: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: nothing is typed, chosen, matched, pressed, played, opened or shut. The page's
 * own print rules already put a typed box, a checked row, a chosen button and a matched pair back on paper as they
 * were untouched, without the scores, so an answered page prints the same as an untouched one.
 */
SessionAnswers.register(function(A){
  /* the page's lists are top-level in its own script, so they are read by name; one that is missing writes nothing */
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var bold = function(t){ return '<b>' + esc(t) + '</b>'; };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  var isList = function(x){ return !!x && typeof x.forEach === 'function' && x.length > 0; };
  /* the one row of a task that carries this, or none. A row is laid out side by side, so the line is given the full
     width, to stand under the row's boxes and not beside them. */
  var rowOf = function(id, test){ var hit = list('#' + id + ' .row').filter(test); return hit.length === 1 ? hit[0] : null; };
  var under = function(row, html){ var l = A.line(row, html); if (l) l.style.flex = '0 0 100%'; };

  /* 1 · Sounds vs letters. Each item of the page's list is { word, letters, sounds: [every count it accepts] }. The
     row is the one whose Play button says the word; "letters" and "sounds" are the row's own labels. */
  var lead = data(function(){ return LEAD; });
  if (isList(lead)) lead.forEach(function(k){
    if (!k || typeof k.word !== 'string' || !isList(k.sounds)) return;
    var row = rowOf('lead', function(r){ var p = r.querySelector('.play'); return !!p && p.getAttribute('data-speak') === k.word; });
    if (row) under(row, bold(k.word) + ' · letters ' + bold(k.letters) + ' · sounds ' + bold(k.sounds.join(' or ')));
  });

  /* 2 · Terminology: under each term, the meaning that carries the term's own number. */
  A.each('#match [data-l]', function(term){
    var n = term.getAttribute('data-l');
    var same = list('#match [data-l]').filter(function(x){ return x.getAttribute('data-l') === n; });
    var mean = list('#match [data-r]').filter(function(x){ return x.getAttribute('data-r') === n; });
    if (same.length === 1 && mean.length === 1) A.after(term, bold(norm(mean[0].textContent)));
  });

  /* 3 · Where is the obstruction? Each item of the page's list is { sound, word, answer: the value of the right
     option }. The row is the one that shows the symbol; the place is the label of that option on the row's dropdown. */
  var obs = data(function(){ return OBS; });
  if (isList(obs)) obs.forEach(function(o){
    if (!o) return;
    var row = rowOf('obs', function(r){ var s = r.querySelector('.sym'); return !!s && norm(s.textContent) === '/' + o.sound + '/'; });
    var opt = row ? list('select option', row).filter(function(x){ return x.value === String(o.answer); }) : [];
    if (opt.length === 1) under(row, bold(norm(opt[0].textContent)));
  });

  /* 4 · Voiced or unvoiced? Each item of the page's list is { ipa, word, first, last } ('v' or 'u'). The row is the
     one that shows the script; "first", "last", "voiced" and "unvoiced" are the words of the row's own buttons. */
  var voi = data(function(){ return VOICING; });
  if (isList(voi)) voi.forEach(function(v){
    if (!v || typeof v.word !== 'string') return;
    var row = rowOf('voi', function(r){ var s = r.querySelector('.ipa'); return !!s && norm(s.textContent) === v.ipa; });
    if (!row) return;
    var say = function(which, val){
      var b = list('[data-vu]', row).filter(function(x){ var d = x.getAttribute('data-vu').split(':'); return d[1] === which && d[2] === val; });
      return b.length === 1 ? norm(b[0].textContent) : '';
    };
    var first = say('first', v.first), last = say('last', v.last);
    if (first && last) under(row, bold(v.word) + ' · first ' + bold(first) + ' · last ' + bold(last));
  });

  /* "Click to reveal" is a word for the screen; here the answer stands under the question */
  A.hide('.reveal-card .hint');
});
