/* Connect Lite — Guided discovery versus TTT: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs guided-discovery-vs-ttt <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   2  Two sentences            under each of the ten questions, the answer the page keeps behind "Show the answer" (10)
 *   3  The rule                 under the rule, the word the page counts as right in each of its four pairs, in the
 *                               order of the pairs (4, on 1 line)
 *   3  The form                 under each of the four patterns, the words for its gaps, in the order of the gaps
 *                               (11, on 4 lines)
 *   4  Match the responses      under each of the twenty sentences, the letter of its response, in bold, and the
 *                               response (20)
 *   5  The uses                 under each of the five sentences, its use (5)
 *   5  Choose the tense         under each of the ten sentences, the form the page counts as right (10)
 *   7  The stages of each       under each of the six stages, the words for its gaps, in the order of the gaps
 *                               (13, on 6 lines); then the word of the box that no gap takes (1)
 *   8  Take out what does not fit   under each of the four groups, the stage the page takes out (4)
 * 1 (the trailer), 6 (What just happened?) and 9 (Which approach said it?) have no answer on the page: 1 and 6 are for
 * the trainee's own words, and the page does not mark the ten quotes of 9 or say which approach each is about. 10 is
 * to read. So nothing is printed for them.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page itself; nothing is copied into this file.
 *   The ten questions: each question's own answer in the markup (.ans). The page's print rule keeps that off the paper
 *   whether or not "Show the answer" has been pressed, so it is written out under its question.
 *   Everything else: the page's own lists, the ones its Check buttons mark against, read by name (RULE, FORM, PAIRS,
 *   USES, TENSES, OUT), and each gap's own key in the markup (data-a). An answer is only written if it is also on the
 *   page where the trainee would choose it: on exactly one of the pair's buttons, on exactly one option of the
 *   dropdown, on exactly one stage of the group. If a list is missing or does not fit the page, that task gets no
 *   line: nothing is ever guessed.
 *   The word of the box that no gap takes: the page says "one word is extra" and names it only in the line its Check
 *   button writes. It is found here as the one word of the box (BANK) that is the key of no gap, and written only if
 *   there is exactly one.
 *
 * Nothing the trainee did is touched: no button is pressed, no dropdown set, nothing shown or hidden, no mark or count
 * moves, and what was typed stays. The page's own print rules and library.js make every button the same plain word
 * whatever was pressed and every dropdown a line to write on, and the marks and counts do not print, so an answered
 * page prints the same as an untouched one and each answer is said once.
 */
SessionAnswers.register(function(A){
  /* the page's lists are top-level in its own script, so they are read by name; if one is missing, nothing is written */
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  var DOT = ' · ';
  /* a line under a row that is laid out side by side takes the full width, to stand under the row and not beside it */
  var wide = function(l){ if (l) { l.style.flex = '0 0 100%'; l.style.gridColumn = '1 / -1'; } return l; };
  /* the words of one dropdown's own option, if exactly one option carries the answer */
  var option = function(sel, want){
    var hit = [].filter.call(sel.options, function(o){ return o.value && o.value.toLowerCase() === String(want).toLowerCase(); });
    return hit.length === 1 ? norm(hit[0].textContent) : '';
  };
  /* the words of one button of a pair, the one whose data-v is the answer, if there is exactly one */
  var button = function(pick, v){
    var hit = list('button', pick).filter(function(b){ return b.getAttribute('data-v') === String(v); });
    return hit.length === 1 ? norm(hit[0].textContent) : '';
  };

  /* 2 · Two sentences: the ten questions, each with its own answer under it. */
  A.each('#qs .qrow', function(row){
    var ans = row.querySelector('.ans'); if (!ans || !A.txt(ans.innerHTML)) return;
    wide(A.line(row, '<b>' + ans.innerHTML + '</b>'));
  });

  /* 3 · The rule: the right word of each of the four pairs, in the order of the pairs, under the rule.
     Each item of RULE is [the first word, the second word, which of the two is right]. */
  var RULE_ = data(function(){ return RULE; }), rule = document.getElementById('rule');
  if (RULE_ && rule) {
    var picks = list('.pick', rule), said = [];
    picks.forEach(function(p, i){ var w = RULE_[i] ? button(p, RULE_[i][2]) : ''; if (w && w === norm(RULE_[i][RULE_[i][2]])) said.push('<b>' + esc(w) + '</b>'); });
    if (picks.length && said.length === picks.length && picks.length === RULE_.length) A.after(rule, said.join(DOT));
  }

  /* 3 · The form: under each pattern, the words for its gaps, in the order of the gaps. Each dropdown says which place
     of which pattern it is (data-f); FORM holds the word of that place. */
  var FORM_ = data(function(){ return FORM; });
  if (FORM_) A.each('#form .cells', function(cells){
    var sels = list('select.blank', cells), said = [];
    sels.forEach(function(sel){
      var at = (sel.getAttribute('data-f') || '').split('-'), row = FORM_[+at[0]], want = row && row[1] ? row[1][+at[1]] : null;
      var w = typeof want === 'string' ? option(sel, want) : '';
      if (w) said.push('<b>' + esc(w) + '</b>');
    });
    if (sels.length && said.length === sels.length) wide(A.line(cells, said.join(DOT)));
  });

  /* 4 · Match the responses: under each sentence, the letter the page marks as right and the words of that response.
     Each item of PAIRS is [sentence, sentence, response a, response b, the first one's letter, the second one's]. */
  var PAIRS_ = data(function(){ return PAIRS; });
  if (PAIRS_) A.each('#pairs .prow', function(row){
    var pick = row.querySelector('.pick'), at = pick ? (pick.getAttribute('data-p') || '').split('-') : [], p = PAIRS_[+at[0]];
    if (!p || at.length !== 2) return;
    var letter = p[4 + (+at[1])], resp = letter === 'a' ? p[2] : letter === 'b' ? p[3] : null;
    var s = row.querySelector('.s');
    if (resp == null || !s || norm(s.textContent).replace(/^\d+\.\s*/, '') !== norm(p[+at[1]])) return;   /* the row is that sentence */
    if (button(pick, letter) !== letter) return;
    wide(A.line(row, '<b>' + esc(letter) + '.</b> ' + esc(resp)));
  });

  /* 5 · The uses: under each sentence, its use. Each item of USES is [the sentence, its use]. */
  var USES_ = data(function(){ return USES; });
  if (USES_) A.each('#uses .urow', function(row){
    var sel = row.querySelector('select.blank'), u = sel ? USES_[+sel.getAttribute('data-u')] : null, s = row.querySelector('span');
    if (!u || !s || norm(s.textContent) !== norm(u[0])) return;
    var w = option(sel, u[1]);
    if (w) wide(A.line(row, '<b>' + esc(w) + '</b>'));
  });

  /* 5 · Choose the tense: under each sentence, the form the page counts as right.
     Each item of TENSES is [the start, the first form, the second form, the end, which of the two is right]. */
  var TENSES_ = data(function(){ return TENSES; });
  if (TENSES_) A.each('#tenses .trow', function(row){
    var pick = row.querySelector('.pick'), t = pick ? TENSES_[+pick.getAttribute('data-t')] : null;
    if (!t || (t[4] !== 0 && t[4] !== 1)) return;
    var w = button(pick, t[4]);
    if (w && w === norm(t[1 + t[4]])) A.line(row, '<b>' + esc(w) + '</b>');
  });

  /* 7 · The stages of each: under each stage, the words for its gaps, in the order the gaps stand. The answer of a gap
     is its own key (data-a), said in the words of that dropdown's own option; if one gap of a stage has none, the
     stage gets no line at all. A little room is left under the line, so that it reads as the end of its own stage. */
  var keys = [], whole = true;
  A.each('#stagesets p.st', function(p){
    var sels = list('select.blank', p), said = [];
    sels.forEach(function(sel){ var w = option(sel, sel.getAttribute('data-a') || ''); if (w) { said.push('<b>' + esc(w) + '</b>'); keys.push(w.toLowerCase()); } });
    if (!sels.length) return;
    if (said.length !== sels.length) { whole = false; return; }
    var l = A.after(p, said.join(DOT));
    if (l) l.style.marginBottom = '10px';
  });
  /* the word of the box that no gap takes ("one word is extra"), written under the last stage, if there is exactly one */
  var BANK_ = data(function(){ return BANK; }), sets = document.getElementById('stagesets');
  if (BANK_ && BANK_.filter && sets && whole && keys.length) {
    var extra = BANK_.filter(function(b){ return keys.indexOf(String(b).toLowerCase()) < 0; });
    var chip = extra.length === 1 ? list('#bank span').filter(function(s){ return norm(s.textContent) === norm(extra[0]); }) : [];
    if (chip.length === 1) A.line(sets, 'The extra word: <b>' + esc(norm(extra[0])) + '</b>');
  }

  /* 8 · Take out what does not fit: under each group, the stage (or stages) the page takes out.
     Each item of OUT is [the group's name, [[a stage, 1 if it is taken out], ...]]. */
  var OUT_ = data(function(){ return OUT; });
  if (OUT_) A.each('#out .outset', function(set){
    var said = [], ok = true;
    list('button[data-o]', set).forEach(function(b){
      var at = (b.getAttribute('data-o') || '').split('-'), g = OUT_[+at[0]], s = g && g[1] ? g[1][+at[1]] : null;
      if (!s || norm(s[0]) !== norm(b.textContent)) { ok = false; return; }
      if (s[1] === 1) said.push('<b>' + esc(norm(b.textContent)) + '</b>');
    });
    if (ok && said.length) A.line(set, said.join(DOT));
  });
});
