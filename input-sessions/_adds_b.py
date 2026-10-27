"""Added parts, second batch: Teaching exam classes, Guided discovery vs PPP, Connected speech,
Guided to less guided practice, Classroom management, Phonology: sounds, Teaching writing.
Connected speech and Phonology: sounds keep British spelling, as the build does. See _adds.py."""
from _adds import ADD, area, reveal, slips, lead

# ---- Teaching exam classes (+20) ---------------------------------------------
ADD['teaching-exam-classes'] = dict(
    after='s5', id='mark', label='Mark a sample', badge='Your turn',
    title='Mark a sample',
    html=lead('A writing task of the kind a B2 First candidate sits, and one answer to it. In pairs, give the answer a mark from 0 to 5 in each of the four categories the exam uses. '
              'Then each pair says its marks to the room, and the room agrees one set.') + slips([
        ('The task', '<p>You have received an email from your English friend Sam, who is thinking of studying English abroad. Sam asks which city to choose, how long to stay and whether to live with a family. Write your email.</p>', 'wide'),
        ('The answer', '''<p>Hi Sam,</p><p>Thanks for your email! It sounds like a great idea to study English abroad, and I’m very happy to help.</p>
<p>About the city, I would choose a smaller one, like Bath or Cambridge. In London there are too many people from your own country, so you will end up speaking your language all the time. In a small city you are obliged to use English everyday.</p>
<p>As for the length, I think a month is too short to see real progress. I did a course for three months and in the first weeks I understand almost nothing, but after that everything changed.</p>
<p>Finally, I definitely recommend staying with a family. It costs less than a hotel and you practice speaking every evening at dinner. Also, don’t forget to bring a warm jacket!</p>
<p>Let me know when you decide, and I’ll send you some links.</p><p>Best wishes,<br>Ana</p>''', 'wide'),
        ('The four categories', '<p><b>Content:</b> does the answer do everything the task asks, and nothing that is out of place?</p><p><b>Communicative achievement:</b> is the register right for a friend, and does it do what an email like this should?</p><p><b>Organisation:</b> is it in sensible paragraphs, joined up?</p><p><b>Language:</b> how wide is the range, and how accurate?</p>'),
        ('The scale', '<p>5 is fully achieved, with no real problems. 3 is achieved, with some weaknesses. 1 is hardly achieved at all. 4 and 2 sit between. 0 is nothing worth marking.</p>'),
    ]) + '\n' + area('Content (0 to 5), and the sentence that decided it:', 2) + '\n'
    + area('Communicative achievement (0 to 5), and why:', 2) + '\n'
    + area('Organisation (0 to 5), and why:', 2) + '\n'
    + area('Language (0 to 5), with two examples from the text:', 2) + '\n'
    + reveal('markKey', '''<h4>Where teachers usually land, and what the spread tells you</h4>
<p>For this made-up answer, marks of 4 for content, 4 for communicative achievement, 4 for organisation and 3 for language are reasonable. <b>These are classroom estimates for a made-up sample, not Cambridge’s marks.</b> The scale the exam uses is public: after you have marked, compare it with your own marks.</p>
<p><b>Content:</b> all three questions are answered, with a reason each, and one extra (the jacket). <b>Communicative achievement:</b> friendly and direct, right for a friend; the advice is clear. <b>Organisation:</b> short paragraphs, one per question, with simple linkers (<i>About</i>, <i>As for</i>, <i>Finally</i>).</p>
<p><b>Language:</b> a good range (<i>end up speaking</i>, <i>obliged to</i>, <i>costs less than</i>), with slips: <i>everyday</i> for <i>every day</i>, <i>I understand</i> for <i>I understood</i>, and <i>obliged to use</i> where <i>forced to use</i> or <i>have to use</i> would be natural.</p>
<h4 style="margin-top:12px;">The point for your classes</h4>
<p>If your marks differed by two or more, you are marking like a teacher and not like an examiner yet. That is normal, and it is why centers train examiners and give them the scale. Your learners need to know what each category means, because that is what they are marked on.</p>'''))

# ---- Guided discovery vs PPP (+20) -------------------------------------------
ADD['guided-discovery-vs-ppp'] = dict(
    after='s5', id='turn', label='Turn it round', badge='Your turn',
    title='Turn it round',
    html=lead('Here is the clarification stage of a PPP lesson, as the teacher would run it. In pairs, turn it into a guided discovery handout: the same target language, but the learners find the meaning and the form. '
              'Then swap with another pair and see whether yours works.') + slips([
        ('PPP: the clarification stage · should for advice · A2', '''<p>The teacher says: “My friend has a headache. What is my advice?” A student says: “Take a pill.” The teacher writes: <span class="hl-tl">You should take a pill.</span></p>
<p>“Does it say what to do, or what happened? Yes: it’s advice. Look at the board: <i>should</i> + the base verb. No <i>to</i>. No <i>-s</i>: it is the same for <i>he</i> and <i>she</i>.” The teacher drills: <i>You should see a doctor</i>, three times chorally, then individually.</p>''', 'wide'),
    ]) + '\n' + area('1. The text or dialogue the learners read first (at least four examples of the language, in a context).', 4) + '\n'
    + area('2. Three questions that lead them to the meaning, the form and one thing that catches people out. Do not give the answers.', 4) + '\n'
    + area('3. What the learners put on the board at the end, and how you make sure it is right.', 2) + '\n'
    + reveal('turnKey', '''<h4>One way to turn it round</h4>
<p><b>The text:</b> Ana: “I can’t sleep.” Ben: “You <span class="hl-tl">should</span> drink warm milk. You <span class="hl-tl">shouldn’t</span> use your phone in bed. And you <span class="hl-tl">should</span> go to bed at the same time every day.”</p>
<p><b>The questions:</b> (1) Is Ben giving Ana an order, or a good idea? What word tells you? (2) Look at the words after <i>should</i>. Is there a <i>to</i>? Does the verb change? (3) How does Ben say it about something Ana should not do? Now write one sentence about your own weekend with <i>should</i> or <i>shouldn’t</i>.</p>
<p><b>The board:</b> pairs write one rule each, in their own words. The class compares and the teacher confirms or corrects. The drill comes <i>after</i>, if it is needed.</p>
<h4 style="margin-top:12px;">What changed, and what did not</h4>
<p>The language, the context and the CCQs stay. What moves is who does the noticing: the learners work out “advice” and “no <i>to</i>” before the teacher says either. The cost is time and a risk of wrong answers. The gain is that the rule is theirs.</p>'''))

# ---- Connected speech (+17) --------------------------------------------------
ADD['connected-speech'] = dict(
    after='s6', id='gloss', label='Dictogloss', badge='Listen and rebuild',
    title='Dictogloss',
    html=lead('Your tutor will read a short text twice, at normal speed. The first time, only listen. The second time, write down every word you catch. '
              'Then, in pairs, rebuild the text so that it makes sense and is correct. It does not have to be word for word. Keep the text covered until you have finished.') + '\n'
    + area('Your words from the second reading.', 3) + '\n' + area('Your rebuilt text.', 5) + '\n'
    + lead('<b>Then look at the text.</b> Where did you miss words, and what was happening to them in the speech?') + '\n'
    + reveal('glossKey', '''<h4>The text, and what happened to it</h4>
<p>I’d have gone out last night, but my mum rang just as I was leaving. She’d lost her keys and couldn’t get into the flat. So I picked up a pizza, drove over, and spent half the evening looking for them. They were in the fridge, next to the milk.</p>
<table class="grid"><tr><th>In the speech</th><th>What happens</th></tr>
<tr><td>I’d have gone out</td><td><i>have</i> is weak, /əv/; <i>gone out</i> link: /ɡɒnaʊt/</td></tr>
<tr><td>last night</td><td>the /t/ of <i>last</i> is often lost: /lɑːs naɪt/</td></tr>
<tr><td>rang just as</td><td>the /t/ of <i>just</i> joins the next word: /dʒʌstəz/</td></tr>
<tr><td>She’d lost her keys</td><td><i>her</i> is weak, with no /h/: /lɒstə kiːz/</td></tr>
<tr><td>couldn’t get into</td><td>the /t/ in <i>couldn’t</i> almost disappears; <i>into</i> is /ɪntə/</td></tr>
<tr><td>picked up a pizza</td><td>four words that run together: /pɪktʌpə/</td></tr>
<tr><td>next to the milk</td><td>/nekstə/, with the /t/ lost, and <i>the</i> weak</td></tr></table>
<h4 style="margin-top:12px;">The question for the room</h4>
<p>Which of your missing words were weak forms, which were joined and which were dropped? What would you do with this text in a lesson?</p>''', show='Reveal the text', hide='Hide the text'))

# ---- Guided to less guided practice (+16) ------------------------------------
ADD['guided-to-less-guided-practice'] = dict(
    after='s8', id='bridge', label='Build the bridge', badge='Your turn',
    title='Build the bridge',
    html=lead('Here is a controlled exercise from a made-up coursebook. In pairs, write the two steps that come after it: one semi-controlled, one freer. '
              'The learners must be able to do each step with what the step before gave them.') + slips([
        ('Language: can and can’t for ability · A1 to A2', '''<p><b>Exercise 3.</b> Complete the sentences with <i>can</i> or <i>can’t</i>.</p>
<p>1. Ravi ____ play the piano, but he ____ sing. 2. Mei and Li ____ swim. They love the sea. 3. I ____ cook. I always eat out. 4. My brother ____ drive. He is only ten. 5. ____ you ride a bike? Yes, I ____.</p>''', 'wide'),
    ]) + '\n' + area('The semi-controlled step: what do the learners do, and what is still decided for them?', 3) + '\n'
    + area('The freer step: what do the learners do, and where does the language come up by itself?', 3) + '\n'
    + reveal('bridgeKey', '''<h4>One way to build it</h4>
<p><b>Semi-controlled.</b> Each learner has four cue cards (swim, cook, drive, play an instrument). They ask three classmates, “Can you…?”, and write what they find: “Marta can swim, but she can’t cook.” The question is given; the answers are real; the sentences are theirs.</p>
<p><b>Freer.</b> A school talent show. In groups of four, choose three acts for the show. Find out who in the room can do what, decide the order, and tell the class who is in the show and why. <i>Can</i> comes up by itself, and so does everything around it.</p>
<h4 style="margin-top:12px;">Check the bridge</h4>
<p>Each step takes something away: first the answers are the learners’, then the task and the language are. Can the learners do step two with what step one gave them? Does step three still need <i>can</i>, or has it become a task that any language could do?</p>'''))

# ---- Classroom management (+15) ----------------------------------------------
ADD['classroom-management'] = dict(
    after='s6', id='clinic', label='Instructions clinic', badge='Your turn',
    title='Instructions clinic',
    html=lead('Groups of three. Take one task from your next TP: the one you are least sure how to set up. One of you gives the instructions, one times them, and one notices. '
              'Swap until everyone has given theirs.') + '\n' + area('The task, in one line.', 1) + '\n'
    + area('Your instructions, as you will say them, and the ICQs you will ask.', 4) + '\n'
    + slips([
        ('The notices', '''<p>Did the instructions start with a way to get everyone’s attention?</p>
<p>Were the steps in the order the learners will do them, one at a time?</p>
<p>Did the teacher show it as well as say it?</p>
<p>How long did it take? Was it under half a minute?</p>
<p>Did the ICQs have answers you could hear? (“Do you understand?” is not one.)</p>
<p>Did the learners know what to do when they finish?</p>''', 'wide'),
    ]) + '\n' + reveal('clinicKey', '''<h4>One set of instructions that works</h4>
<p>“Everybody look here, please.” (Wait.) “You are going to work with your partner.” (Gesture to a pair.) “Student A, tell B about your weekend. B, listen, and ask one question. Then change.” (Show it with one student.) “You have four minutes.” (Write 4 on the board.)</p>
<p><b>ICQs:</b> “Who talks first?” (A.) “What does B do?” (Listens and asks one question.) “How many minutes?” (Four.) “What do you do when you finish?” (Change, or write the best thing you heard.)</p>
<h4 style="margin-top:12px;">What to take into TP</h4>
<p>Fewer words, one step at a time, shown not only said, and an ICQ whose answer you can hear. If the instructions took more than half a minute, cut a step. If you needed more than three ICQs, the task is too complicated: simplify the task, not the questions.</p>'''))

# ---- Phonology: sounds (+15) -------------------------------------------------
ADD['phonology-sounds'] = dict(
    after='s7', id='tpwords', label='Your TP words', badge='Your turn',
    title='Your TP words',
    html=lead('Choose five words that you will teach in your next TP, the ones you are least sure how to say. Write each in phonemic script, without looking anything up. '
              'Then check each one in a dictionary, mark what you got wrong and say why. Then drill them with your partner.') + '\n'
    + area('Your five words, in phonemic script, as you think they sound. One word, then its transcription, on each line.', 5) + '\n'
    + area('After the dictionary: which ones were wrong, and what was the difference?', 3) + '\n'
    + lead('<b>Drill them in pairs.</b> Say the word, and your partner repeats it; then the other way round. For a long word, start at the end and build it backwards: <i>-ble</i>, <i>-table</i>, <i>vegetable</i>. Listen for the schwa, the number of syllables, and any letter you do not say.') + '\n'
    + reveal('tpwordsKey', '''<h4>Three words, and what usually catches people</h4>
<p><b>neighbour</b> /ˈneɪbə/ &mdash; the <i>gh</i> is silent, and the ending is a schwa.</p>
<p><b>vegetable</b> /ˈvedʒtəbl/ &mdash; three syllables, not four. The second <i>e</i> is not pronounced.</p>
<p><b>comfortable</b> /ˈkʌmftəbl/ &mdash; also three, with the stress on the first. Many learners add a syllable after <i>comf</i>.</p>
<h4 style="margin-top:12px;">What to do with the ones you got wrong</h4>
<p>The mistakes you made are the ones your learners will make. Put those words first in your anticipated problems on the Language Analysis sheet, with the sounds written out and the stress marked.</p>'''))

# ---- Teaching writing (+15) --------------------------------------------------
ADD['teaching-writing'] = dict(
    after='s8', id='model', label='Write the model first', badge='Your turn',
    title='Write the model first',
    html=lead('Before you set a writing task, write it yourself, at the level your learners will. In pairs, write the answer an A2 learner could give to this task. '
              'Then underline the four or five chunks you would have to teach first.') + slips([
        ('The task · A2', '<p>Write a message to a friend to invite them to your birthday. Say where and when it is, and what to bring. Ask for an answer. About 40 to 60 words.</p>', 'wide'),
    ]) + '\n' + area('Your model answer.', 5) + '\n'
    + area('The chunks your learners need before they write.', 3) + '\n'
    + reveal('modelKey', '''<h4>One model, and the chunks in it</h4>
<p>Hi Lena, <span class="hl-tl">I’m having</span> a birthday dinner at my flat on Saturday 12th at 7 pm. It’s 14 Park Road. <span class="hl-tl">Can you come?</span> <span class="hl-tl">Please bring</span> a dessert if you can. <span class="hl-tl">Let me know by</span> Thursday. <span class="hl-tl">See you soon!</span> Kasia</p>
<p><b>Chunks to teach first:</b> <i>I’m having…</i>, <i>Can you come?</i>, <i>Please bring…</i>, <i>Let me know by…</i>, <i>See you soon!</i></p>
<h4 style="margin-top:12px;">Why write it first</h4>
<p>You find out how long the task really takes, and whether 40 to 60 words is possible at this level. You see which language the task needs before your learners do. And you have a model to show them, and a way to check your own instructions: if you could not do the task from the instructions, they could not.</p>'''))
