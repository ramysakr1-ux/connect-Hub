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

# ---- Writing the lesson plan (+8) --------------------------------------------------
ADD['writing-the-lesson-plan'] = dict(
    after='s6', id='laitem', label='One Language Analysis item', badge='Your turn', style='B',
    title='One Language Analysis item',
    html=lead('The Language Analysis sheet is where meaning, form and pronunciation go. Fill in one item of it, in pairs, in eight minutes, for this sentence from a B1 lesson: '
              '<span class="hl-tl">She’s been living in Madrid for three years.</span>') + '\n'
    + area('Meaning: the context in one sentence, and two CCQs.', 3) + '\n'
    + area('Form: the pattern, in chunks.', 2) + '\n'
    + area('Pronunciation: the stress, the weak forms, the contraction.', 2) + '\n'
    + area('Anticipated problems, each with a solution.', 3) + '\n'
    + reveal('laitemKey', '''<h4>One way to fill it in</h4>
<p><b>Meaning.</b> Elena moved to Madrid three years ago and still lives there. CCQs: Did she move to Madrid? (Yes, three years ago.) Does she live there now? (Yes.) Is the three years finished? (No.)</p>
<p><b>Form.</b> She’s been living | in Madrid | for three years. Subject + <i>has / have</i> + <i>been</i> + verb with <i>-ing</i> + <i>for</i> or <i>since</i>, then the time.</p>
<p><b>Pronunciation.</b> /ʃiːz bɪn ˈlɪvɪŋ/: the <i>’s</i> is contracted and <i>been</i> is weak, /bɪn/. The stress falls on <i>LIVing</i>, <i>MaDRID</i> and <i>THREE YEARS</i>. The voice falls at the end.</p>
<p><b>Anticipated problems.</b> (1) Learners say <i>She has living</i>, dropping <i>been</i>. Solution: board the pattern in chunks with <i>been</i> underlined, and drill the whole chunk. (2) <i>for</i> and <i>since</i>: <i>for</i> goes with a length of time, <i>since</i> with a starting point. Solution: two timelines. (3) <i>been</i> said as /biːn/. Solution: model it weak, in the chunk, not alone.</p>
<h4 style="margin-top:12px;">The check</h4>
<p>Is each of the four boxes about meaning, form or pronunciation only? Does a problem about the task or the room appear here? It belongs on the lesson plan.</p>'''))
