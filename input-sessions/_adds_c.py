"""Added parts, third batch: Alternative teaching techniques, Drama in the ELT classroom, Eliciting and CCQs,
Word and sentence stress, Life after CELTA, Writing the lesson plan.
Word and sentence stress keeps British spelling, as the build does. See _adds.py."""
from _adds import ADD, area, reveal, slips, lead

# ---- Alternative teaching techniques (+15) ------------------------------------
ADD['alternative-teaching-techniques'] = dict(
    after='twist', id='ownstory', label='Your own story', badge='Your turn', style='B',
    title='Your own story',
    html=lead('The third conditional came from a story, with nothing on the board. Now do the same for the language of your next TP. In pairs, plan a story lead-in. '
              'Then tell it to another pair, books closed, and ask your one question.') + '\n'
    + area('1. The target language: one item from your next TP point.', 1) + '\n'
    + area('2. The story, in five to seven sentences. It will be told, not read.', 5) + '\n'
    + area('3. The one question the story is built for: the one learners cannot answer well without the language.', 2) + '\n'
    + area('4. What goes on the board or on a picture, in five words or fewer.', 1) + '\n'
    + lead('<b>When you tell it,</b> the other pair says what they would need to say to answer your question, before you give them any language.') + '\n'
    + reveal('ownstoryKey', '''<h4>One story, for <span class="hl-tl">used to</span></h4>
<p><b>The story.</b> Henrik is eighty. In his village today there is a road, a bakery and a school bus. When he was a boy there was nothing. He walked six kilometers to school every day, in winter too. His mother baked all the bread. His father fished in the river. And in the evening the whole family sang, because there was no television.</p>
<p><b>The question.</b> “What did Henrik’s family do every day when he was young, that nobody does now?” To answer it well, learners need <i>used to</i>, or they fall back on <i>when I was young, I walked</i>, which loses the point that it was a habit that has stopped.</p>
<p><b>The board.</b> A drawing of a village, with a road crossed out.</p>
<h4 style="margin-top:12px;">Test your own story</h4>
<p>Can a learner answer the question well with only the past simple? If so, the question is wrong. Does the story give the language three times, in natural sentences, without a lecture? Is it short enough to remember and tell? Does the question come before any rule?</p>'''))

# ---- Drama in the ELT classroom (+15) -----------------------------------------
ADD['drama-in-the-elt-classroom'] = dict(
    after='party', id='aim', label='Give it an aim', badge='Your turn', style='B', numbered=False,
    title='Give it an aim',
    html=lead('A drama activity with no language aim is a warm-up. Choose one activity from this page: a greeting game, My monster, Taking up space or The birthday party. '
              'Then take one item of language from your next TP and write the activity so that the learners need it.') + '\n'
    + area('The activity, and the level.', 1) + '\n'
    + area('The language aim: what the learners will say, in one line.', 2) + '\n'
    + area('The moment you stop the activity to feed language in, and what you give them.', 3) + '\n'
    + area('How you will give feedback afterwards.', 2) + '\n'
    + lead('<b>Then run it</b> for another pair for three minutes, as if they were your class. Stop where you wrote that you would stop.') + '\n'
    + reveal('aimKey', '''<h4>One way to write it: The birthday party, A2</h4>
<p><b>Language aim:</b> to introduce yourself and make small talk: <span class="hl-tl">Nice to meet you. How do you know the host? Have you been here before?</span></p>
<p><b>Run it once with no help.</b> Learners arrive one at a time and greet the host. Listen for what they say.</p>
<p><b>Stop after the first round.</b> Ask the learners what they said that worked, and what they wished they could say. Give them the three questions above and one answer for each.</p>
<p><b>Run it again.</b> The guests now have the language. They meet different people and use the questions. The host closes with a toast.</p>
<p><b>Feedback.</b> One good thing you heard, and two things to fix, written as said. The learners correct them.</p>
<h4 style="margin-top:12px;">Why the stop matters</h4>
<p>Without it, the activity is fun and nothing is learned. With it, the learners have a reason to need the language before they are given it.</p>'''))

# ---- Eliciting and CCQs (+10) ---------------------------------------------------
ADD['eliciting-and-ccqs'] = dict(
    after='s6', id='blind', label='The blind test', badge='Your turn',
    title='The blind test',
    html=lead('Your CCQs should let a learner work out the meaning without seeing the sentence. Test that. In pairs, each of you takes three items of language from your next TP. '
              'For each one, write the sentence on a slip and fold it, and write your CCQs on the page. Your partner answers the CCQs aloud, then writes the sentence they think it was. Open the slip and compare.') + '\n'
    + area('The three items, and your CCQs for each.', 6) + '\n'
    + area('What your partner wrote, and what was different from the slip.', 3) + '\n'
    + reveal('blindKey', '''<h4>How to read the result</h4>
<p><b>The sentence you taught:</b> I’ve been living here for two years.</p>
<p><b>CCQs that work:</b> Do I live here now? (Yes.) Did I start living here in the past? (Yes: two years ago.) Is the time finished? (No: it goes on to now.) </p>
<p><b>A partner who wrote “I lived here for two years”:</b> your CCQs missed “Do I live here now?” That one question turns a finished time into a time that continues.</p>
<p><b>A partner who wrote “I live here”:</b> your CCQs did not mention the past, so the two years never came up. Add: When did it start?</p>
<h4 style="margin-top:12px;">Rewrite one</h4>
<p>If your partner did not get your sentence, find the missing question and add it. If they got it exactly, check that the CCQs did not contain the language itself.</p>'''))

# ---- Word and sentence stress (+7) ---------------------------------------------
ADD['word-and-sentence-stress'] = dict(
    after='s6', id='markdrill', label='Mark it, drill it', badge='Your turn',
    title='Mark it, drill it',
    html=lead('Take two sentences of the target language from your next TP. Mark the stress, then drill each one with a partner. Then swap, and check each other’s marks before you drill.') + '\n'
    + area('Your two sentences, with the stressed words in capitals.', 3) + '\n'
    + lead('<b>To drill:</b> say the sentence to a beat and have your partner repeat it, keeping the beat. Clap on the stressed syllables. If it is long, build it from the end, and keep the stress where it falls in the whole sentence.') + '\n'
    + reveal('markdrillKey', '''<h4>One example</h4>
<p>I’ve been LIVing here for TWO YEARS.</p>
<p>Three stressed words, so three beats. <i>I’ve been</i> is quick and weak, /aɪv bɪn/; <i>here</i> and <i>for</i> are squeezed to fit. To drill it from the end: <i>two YEARS</i>, <i>for two YEARS</i>, <i>LIVing here for two YEARS</i>, then the whole sentence on the beat.</p>
<h4 style="margin-top:12px;">What to check in your partner’s marks</h4>
<p>Is each stress on a content word? Are the grammar words left unstressed? Would the stress change if the sentence answered a different question?</p>'''))

# ---- Life after CELTA (+5) ---------------------------------------------------------
ADD['life-after-celta'] = dict(
    after='cv', id='cvline', label='One CV line', badge='Your turn', style='B', numbered=False,
    title='One CV line',
    html=lead('Write the CELTA line of your CV, in one or two lines. Then swap with a partner. Your partner finds one detail that is missing, and asks about it.') + '\n'
    + area('Your CELTA line.', 3) + '\n'
    + reveal('cvlineKey', '''<h4>A weak line and a stronger one</h4>
<p><b>Weak:</b> CELTA qualified. Good at teaching.</p>
<p><b>Stronger:</b> CELTA (Cambridge English), 2026. Six hours of assessed teaching practice with adult learners at two levels: lessons in reading, grammar, vocabulary and speaking, each planned with its own aims and anticipated problems.</p>
<h4 style="margin-top:12px;">What made it stronger</h4>
<p>It names the course and the year. It says how much, and with whom. It names what you taught, so a school can see you have taught it. It does not claim anything about a grade and it does not say “references on request”: your CELTA report is your reference, and you send it with the application.</p>'''))

# ---- Writing the lesson plan ----------------------------------------------------
# Ramy, 19 Nov 2026: the LA item is gone ("remove the language analysis item from the plan") and "Your turn: write two
# stages" became a quicker choice ("we can make it easier. Maybe you choose the right answer"), so the session runs
# 50 to 55 minutes and leaves time for the lesson frameworks. The last part leads into those, teaching none of them.
ADD['writing-the-lesson-plan'] = dict(
    after='s5', id='s6', label='Which line goes on the plan?', badge='Your turn', style='B',
    title='Which line goes on the plan?',
    html='<p class="lead">One B1 reading lesson, about a baker who works at night, stage by stage. For each stage there are two ways to write it. In pairs, choose the one that belongs on your plan.</p>\n<div class="scorebar"><span>Chosen: <span id="wlN">0</span> of 5</span><button type="button" id="wlReset">Start again</button></div>\n<div class="card wl-pick" data-ok="B"><span class="cat">Lead-in</span><div class="body"><b>A</b><br>T shows a photo of a baker at night and asks the students what they think about it.<br><br><b>B</b><br>• Show the photo. Ask: “What time is it? What’s his job?” (T–S)<br>• Pairs: would you like to work at night? Why, or why not? 2 min. (PW)<br>• Take two answers. (OCFB)</div><div class="btns"><button type="button" data-p="A">A goes on the plan</button><button type="button" data-p="B">B goes on the plan</button></div><div class="fb"><b></b>B. Imperatives, the questions written out, a pattern on each step and a time. A is about the teacher, in prose, and nobody could teach from it.</div></div>\n<div class="card wl-pick" data-ok="B"><span class="cat">Pre-teach</span><div class="body"><b>A</b><br>Pre-teach the vocabulary. CCQs.<br><br><b>B</b><br>• Pre-teach <i>dough</i> and <i>shift</i>, meaning only.<br>• <i>Dough</i>: show a picture. <i>Shift</i>: “His shift starts at 11 pm and ends at 7 am.” CCQ: Does he work all day? (No. Only those hours.) (T–S)</div><div class="btns"><button type="button" data-p="A">A goes on the plan</button><button type="button" data-p="B">B goes on the plan</button></div><div class="fb"><b></b>B. It names the words, says how each meaning is shown, and writes the CCQ with its answer. A is a summary.</div></div>\n<div class="card wl-pick" data-ok="A"><span class="cat">Gist</span><div class="body"><b>A</b><br>• Instruction: “Read quickly. Which summary is best? You have two minutes.”<br>• ICQ: “Do you read every word?” (No.)<br>• Ss read alone (Ind), check in pairs (PW). 3 min.<br>• Nominate one pair: which one, and why? (OCFB)<br><br><b>B</b><br>Ss read the text for gist and then for detail. Ind / PW / OC. 10 min.</div><div class="btns"><button type="button" data-p="A">A goes on the plan</button><button type="button" data-p="B">B goes on the plan</button></div><div class="fb"><b></b>A. One task, the instruction and the ICQ written out, one pattern per step. B puts two stages in one line and three patterns on it.</div></div>\n<div class="card wl-pick" data-ok="B"><span class="cat">Detail</span><div class="body"><b>A</b><br>Ss do exercise 3. 20 min.<br><br><b>B</b><br>• Ss answer ex. 3 (six true or false) alone. 5 min. (Ind)<br>• Check in pairs. 2 min. (PW)<br>• OCFB: nominate; Ss show the line in the text that tells them.</div><div class="btns"><button type="button" data-p="A">A goes on the plan</button><button type="button" data-p="B">B goes on the plan</button></div><div class="fb"><b></b>B. The task is named, the time fits, and feedback is planned. In A, twenty minutes for six questions leaves no time for anything after it.</div></div>\n<div class="card wl-pick" data-ok="A"><span class="cat">Speaking</span><div class="body"><b>A</b><br>• Groups of three: would you work at night for more money? 6 min. (GW)<br>• Monitor and note four or five errors.<br>• Correction slot: board the errors, Ss correct in pairs. 3 min. (PW, OCFB)<br><br><b>B</b><br>Free speaking about jobs.</div><div class="btns"><button type="button" data-p="A">A goes on the plan</button><button type="button" data-p="B">B goes on the plan</button></div><div class="fb"><b></b>A. It grows out of the text, is timed, and plans the monitoring and the correction. B could be any lesson.</div></div>\n<div class="reveal-block" id="wlNext"><h4>Look down the left</h4><p>Lead-in, pre-teach, gist, detail, speaking. Every good line above sits inside a stage, and the stages come in an order. Why that order, and what the order is for other kinds of lesson, is the next part of today: the lesson frameworks.</p></div>\n<script>(function(){\n  var cards = [].slice.call(document.querySelectorAll(\'#s6 .wl-pick\')), n = 0, out = document.getElementById(\'wlN\'), next = document.getElementById(\'wlNext\');\n  cards.forEach(function(c){ [].forEach.call(c.querySelectorAll(\'button\'), function(b){ b.addEventListener(\'click\', function(){\n    if (c.dataset.done) return; c.dataset.done = \'1\'; n++; out.textContent = n;\n    var ok = b.dataset.p === c.dataset.ok; b.classList.add(ok ? \'pick-ok\' : \'pick-no\');\n    if (!ok) c.querySelector(\'[data-p="\' + c.dataset.ok + \'"]\').classList.add(\'pick-ok\');\n    [].forEach.call(c.querySelectorAll(\'button\'), function(x){ x.disabled = true; });\n    var f = c.querySelector(\'.fb\'); f.classList.add(\'on\', ok ? \'ok\' : \'no\'); f.querySelector(\'b\').textContent = ok ? \'Yes.\' : \'Not quite.\';\n    if (n === cards.length) next.classList.add(\'shown\');\n  }); }); });\n  document.getElementById(\'wlReset\').addEventListener(\'click\', function(){ n = 0; out.textContent = \'0\'; next.classList.remove(\'shown\');\n    cards.forEach(function(c){ delete c.dataset.done; [].forEach.call(c.querySelectorAll(\'button\'), function(x){ x.disabled = false; x.classList.remove(\'pick-ok\', \'pick-no\'); });\n      var f = c.querySelector(\'.fb\'); f.classList.remove(\'on\', \'ok\', \'no\'); }); });\n})();</script>')
