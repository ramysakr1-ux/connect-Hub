/* Connect Lite — Teaching vocabulary: the answers, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs teaching-vocabulary <folder> shows what it prints).
 *
 * WHERE EACH ANSWER COMES FROM
 *   The nine tasks with options (69 questions). The page builds them in its own script and keeps the right option
 *   inside that script, where this file cannot read it. So the right option for each question is COPIED below, word
 *   for word, from the buildTask(...) calls in teaching-vocabulary/index.html, under the question's own words. A
 *   question whose words are not in the table gets no line, and neither does one whose copied answer is not on one of
 *   its own buttons: nothing is ever guessed. IF A QUESTION OR ITS RIGHT OPTION CHANGES ON THE PAGE, CHANGE IT HERE
 *   TOO, and run the check again. The explanation is not copied: it is read from the page (the question's own .why),
 *   and that block is hidden for this print so the explanation is said once, beside its answer.
 *   The gap fill (8 gaps): each gap's own data-a.
 *   The board (7 lines): each line's own data-f (1 is one of the five problems) and data-w (the reason).
 *   The five boxes behind a button (the reckon sentences, the odd one out, rank it, plan the review, your turn):
 *   shown as they stand on the page.
 * Nothing the trainee did is touched: no option is pressed, no gap filled, no line of the board marked.
 */
SessionAnswers.register(function(A){
  var KEY = {
    whyTask: {
      "You could picture it: carrot, spider.": "Helped",
      "It was long and abstract: terminological.": "Didn't help",
      "It belonged with others: carrot, cabbage, lettuce, cucumber.": "Helped",
      "You said it to yourself again and again.": "It depends",
      "It was funny or odd to say: razzmatazz, groovy.": "It depends",
      "You already knew it in another language: coffee, lemon.": "Helped",
      "You read it once and moved on.": "Didn't help"
    },
    missTask: {
      "Ana writes, \"There was a lot of strong rain yesterday.\"": "Collocation",
      /* the next one reads: Kenji says /ˈkʌp bɔːd/ for cupboard. (the phonemic letters are written as codes so the match never depends on how the file is read) */
      "Kenji says /ˈkʌp bɔːd/ for cupboard.": "Pronunciation",
      "Lucas emails his manager: \"Hey buddy, can I swap my shift?\"": "Register",
      "Amira says, \"He explained me the rule.\"": "Grammar",
      "Tomasz says his aunt is eccentric, and means she is mentally ill.": "Connotation",
      "Mei writes, \"I didn't recieve your message.\"": "Spelling"
    },
    hardTask: {
      "an insult and to insult": "Pronunciation",
      "photograph, photographer, photographic": "Pronunciation",
      "glove, stove, prove": "Spelling and sound",
      "thin, slim, skinny, slender": "Connotation",
      "tell a lie, make an apology, say a prayer": "Collocation",
      "actually, for a speaker of Spanish or French": "False friend",
      "enjoy and hope": "Grammar",
      "look after and look up": "Grammar",
      "pass away": "Register"
    },
    chunkTask: {
      "You can say that again.": "Yes",
      "She has been working here since May.": "No",
      "If I were you, I'd ...": "Maybe",
      "by the way": "Yes",
      "Do you like it?": "No",
      "make a decision": "Yes",
      "The sooner, the better.": "Maybe"
    },
    chooseTask: {
      "hardly": "Teach before the text",
      "giving up": "Leave it for them to guess",
      "cinnamon": "Gloss it if it comes up",
      "a line around the block": "Leave it for them to guess",
      "employs": "Leave it for them to guess",
      "dough": "Gloss it if it comes up",
      "landlord": "Teach before the text",
      "cozy": "Teach before the text"
    },
    cheapTask: {
      "a button": "Show it",
      "to snatch": "Act it",
      "to make a fuss": "A situation",
      "enormous": "A word they know",
      "celery": "Show it",
      "a tool": "A word they know",
      "to shrug": "Act it",
      "to get away with": "A situation",
      "democracy": "Translation",
      "to pass away": "A word they know"
    },
    transTask: {
      "Translation is the quickest way to a meaning, when the two words really match.": "True",
      "A word given in translation is easier to remember than one you worked out.": "False",
      "Explaining in English works whatever words you explain it with.": "False",
      "After presenting in English, asking \"How do you say it in your language?\" can check understanding.": "True",
      "In a class with many first languages, translation is the teacher's job.": "False",
      "Students who always go through their own language may never build English links of their own.": "True"
    },
    typeTask: {
      "Underline every word about the weather in the text.": "Identify",
      "Put these ten jobs in order, from best paid to worst paid.": "Rank",
      "Put these adjectives into two groups: positive and negative.": "Sort",
      "Join each verb to the noun it goes with.": "Match",
      "Choose five words from today's lesson that describe you.": "Select",
      "Listen and raise your hand every time you hear a food.": "Identify",
      "Turn over two cards; keep them if they are opposites.": "Match",
      "Choose the odd one out and say why.": "Select"
    },
    memTask: {
      "A word stands a good chance of sticking after about seven meetings, spaced out.": "True",
      "Teaching ten words with nearly the same meaning together helps students tell them apart.": "False",
      "Most forgetting happens in the first day.": "True",
      "Saying a word aloud many times puts it in long-term memory.": "It depends",
      "A sentence a student writes about themselves helps more than one they copy.": "True",
      "Pulling a word out of memory makes the next time easier.": "True",
      "Words should be reviewed at the same interval every time.": "False",
      "A picture helps only if the teacher draws it.": "False"
    }
  };
  var own = function(o, k){ return Object.prototype.hasOwnProperty.call(o, k); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  /* The nine tasks with options: the right option's own label, then the page's explanation, under the options. */
  Object.keys(KEY).forEach(function(id){
    A.each('#' + id + ' .qrow', function(row){
      var q = row.querySelector('.q'), opts = row.querySelector('.opts'), why = row.querySelector('.why');
      if (!q || !opts) return;
      var words = A.txt(q.innerHTML).replace(/^\d+\.\s*/, '');            /* the question without its number */
      if (!own(KEY[id], words)) return;
      var ans = KEY[id][words];
      var onAButton = [].some.call(opts.querySelectorAll('.opt'), function(b){ return b.textContent === ans; });
      if (!onAButton) return;
      var reason = why ? why.textContent.replace(/\s+/g, ' ').trim() : '';
      A.after(opts, '<b>' + esc(ans) + '.</b>' + (reason ? ' ' + esc(reason) : ''));
    });
  });
  /* the explanation is in the line now; its own block would say it a second time */
  A.hide('.qrow .ans-line + .why');

  /* Knowing a word: the word for each gap, under its sentence. */
  A.each('#knowGaps .gap', function(gap){
    var li = gap.closest('li'), word = gap.getAttribute('data-a');
    if (li && word) A.line(li, '<b>' + esc(word) + '</b>');
  });

  /* The board: under each line, whether it is one of the five problems or fine, and the page's reason. */
  A.each('#spotArea .sp', function(sp){
    var row = sp.closest('.brow') || sp.parentNode, reason = sp.getAttribute('data-w') || '';
    A.line(row, sp.getAttribute('data-f') === '1' ? '<b>A problem.</b> ' + esc(reason) : '<b>Fine:</b> ' + esc(reason));
  });
  /* what the trainee found on screen is listed under the board; the lines above already say all seven */
  A.hide('#spotFb');

  /* The boxes behind a button: the five sentences for reckon and what happened, the odd one out, rank it, one way to
     plan the review, and what to check your own rows against. */
  A.show('#reckonKey, #oddKey, #rankKey, #reviewKey, #yoursKey');
});
