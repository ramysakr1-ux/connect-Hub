/* Connect Lite — Phonology: sounds, printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * What "Print with the answers" writes on this session (answers.js says how; 20 Nov 2026):
 *   1  Sounds against letters      under each box: the word, its letters, its sounds (5 words, 15 boxes)
 *   2  Match the terminology       under each term: its definition (6)
 *   3  Where is the obstruction?   under each sound: the place on its dropdown (8)
 *   4  Voiced or unvoiced?         under each box and dropdown: the spelling, the first sound, the last sound (8 words, 24)
 * The discussion in part 1, the phonemic script in part 6, the film titles in part 7 and the three words in part 8
 * keep their answers in the page's own answer blocks, and the print shows those by itself. Part 5 is the chart, with
 * nothing to answer.
 *
 * Every answer is read from the page's own lists (leadKey, terms, obs, voice), the ones its Check buttons mark
 * against, and is placed by the task's own words: a term by its name, a sound by its symbol, a word by its phonemic
 * script. The label of a dropdown answer is the dropdown's own. Nothing the trainee wrote or chose is touched.
 */
SessionAnswers.register(function(A){
  /* the page's lists are top-level in its own script, so they are read by name; one that is missing writes nothing */
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var words = function(el){ return el ? norm(el.textContent) : ''; };
  var bold = function(t){ return '<b>' + String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</b>'; };
  var only = function(list, test){ var hit = list.filter(test); return hit.length === 1 ? hit[0] : null; };
  /* the words on a dropdown's option, for the value the page counts as right */
  var label = function(sel, value){ var o = sel && only([].slice.call(sel.options), function(x){ return x.value === String(value); }); return o ? words(o) : ''; };

  /* 1. Sounds against letters. Row i holds leadKey[i], as the page's own check reads it; the row's Play button says that word. */
  var lead = data(function(){ return leadKey; });
  if (lead) lead.forEach(function(k, i){
    var w = document.getElementById('w' + i), l = document.getElementById('l' + i), c = document.getElementById('c' + i);
    var row = w && w.closest('tr'), play = row && row.querySelector('button.play');
    if (!play || (play.getAttribute('onclick') || '').indexOf("'" + k.word + "'") === -1) return;
    if (!l || !c || l.closest('tr') !== row || c.closest('tr') !== row) return;
    A.line(w.parentNode, bold(k.word));
    A.line(l.parentNode, bold(k.letters));
    A.line(c.parentNode, bold(k.sounds.join(' or ')));
  });

  /* 2. Match the terminology: under each term, the definition the page pairs with it. */
  var defs = data(function(){ return terms; });
  if (defs) A.each('#termLeft .pill', function(pill){
    var t = only(defs, function(x){ return norm(x.t) === words(pill); });
    if (t) A.after(pill, bold(t.d));
  });

  /* 3. Where is the obstruction? Under each sound, the place its dropdown calls right. */
  var sounds = data(function(){ return obs; });
  if (sounds) A.each('#obstructionGrid .sound-card', function(card){
    var o = only(sounds, function(x){ return norm(x.s) === words(card.querySelector('.sym')); });
    var place = o && label(card.querySelector('select'), o.a);
    if (place) A.line(card, bold(place));
  });

  /* 4. Voiced or unvoiced? Under each row's box and two dropdowns: the spelling, the first sound, the last sound. */
  var pairs = data(function(){ return voice; });
  if (pairs) A.each('#voiceTable tr', function(row){
    var v = only(pairs, function(x){ return norm(x.ipa) === words(row.querySelector('td.ipa')); });
    if (!v) return;
    var w = row.querySelector('input[id^="vw"]'), f = row.querySelector('select[id^="vf"]'), l = row.querySelector('select[id^="vl"]');
    var first = label(f, v.first), last = label(l, v.last);
    if (w) A.line(w.parentNode, bold(v.word));
    if (first) A.line(f.parentNode, bold(first));
    if (last) A.line(l.parentNode, bold(last));
  });
});
