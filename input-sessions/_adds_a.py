"""Added parts, first batch: Error correction, Functional language, PPP, Text-based teaching,
Receptive skills, Teaching literacy, Teaching productive skills. See _adds.py."""
from _adds import ADD, area, reveal, slips, lead

# ---- Error correction (+30) ------------------------------------------------
ADD['error-correction'] = dict(
    after='s7', id='live', label='Correct me, live', badge='Your turn',
    title='Correct me, live',
    html=lead('Groups of four. One of you is the teacher and the other three are students; then swap, until each of you has taught. '
              'The teacher runs a three-minute controlled practice from the task card and listens. The students slip their error cards into what they say, '
              'one at a time, at a natural moment, with a straight face.') + '''
<div class="slips">
<div class="slip wide"><span class="who">The teacher’s task card</span>
<p><b>Target language:</b> <span class="hl-tl">used to</span> + verb. <b>On the board:</b> “When I was ten, I used to…”</p>
<p>Students make true sentences about themselves, then ask each other “Did you use to…?”. Correct only what you decide to correct, and decide before you act: deal with it or let it go? Now or later? You, the student or the class? You may not use the same technique more than twice.</p></div>
</div>
''' + slips([
        ('Student 1 · card a', '“When I was ten, I <b>use</b> to live near the sea.”'),
        ('Student 1 · card b', '“I’m agree with you: it was a good time.”'),
        ('Student 1 · card c', '“My teacher was very <b>sympathetic</b>.” (You mean she was nice. Say it with a smile.)'),
        ('Student 2 · card a', '“I <b>didn’t used</b> to like vegetables.”'),
        ('Student 2 · card b', '“We <b>did</b> a lot of photos.”'),
        ('Student 2 · card c', '“I used to have a sheep.” (Say it as <b>ship</b>, /ʃɪp/.)'),
        ('Student 3 · card a', '“<b>Did</b> you <b>used</b> to play outside?”'),
        ('Student 3 · card b', '“I used to walk to school… walked… <b>used</b> to walk.” (Correct yourself, at once, without being asked.)'),
        ('Student 3 · card c', '“Give me your pen!” (To the teacher, as a student would say it to a friend.)'),
    ]) + '''
<p class="lead" style="margin-top:14px">When the three minutes are up, the teacher writes down every error they noticed and what they decided to do about it. The students say which ones they thought would be corrected, and what the teacher did that they liked.</p>
''' + area('The errors you noticed, and for each one: deal with it or let it go? When? Who? Which technique?', 5) + '\n'
    + area('One thing you would do differently next time.', 2) + '\n'
    + reveal('liveKey', '''<h4>What a good decision looks like for each card</h4>
<p><b>1a, 2a, 3a: the target language.</b> Deal with these now: it is what the practice is for. Let the student fix it: finger correction (<i>use</i> / <i>used</i>), or ask the class: “Who can help?”</p>
<p><b>1b “I’m agree”:</b> not the target language and it did not stop the practice. Note it and deal with it later, with a few more mistakes of the same kind on the board.</p>
<p><b>1c “sympathetic”:</b> a vocabulary meaning problem. Later, on the board: <i>sympathetic</i> and <i>nice</i>, with one example of each.</p>
<p><b>2b “did photos”:</b> a collocation (<i>take photos</i>). Later, with other things we take: photos, a bus, a break.</p>
<p><b>2c “ship”:</b> the meaning is unclear, so check it: echo it with a rising tone (“A ship?”). If the student cannot fix it, point to a picture or put the two words on the board.</p>
<p><b>3b the self-repair:</b> leave it alone. The student did the job themselves. Praise it in the feedback.</p>
<p><b>3c “Give me your pen!”:</b> appropriacy. Later, and quickly: how would you ask a teacher? Two students try it aloud.</p>
<h4 style="margin-top:12px;">Questions for the group</h4>
<p>Which error did you let go, and why? Which technique did you use too often? Who corrected, and who could have?</p>'''))

# ---- Functional language (+30) ---------------------------------------------
ADD['functional-language'] = dict(
    after='s11', id='board', label='Board it, then teach it', badge='Your turn',
    title='Board it, then teach it',
    html=lead('In pairs, plan how the board will look for one function. Then teach it, in four minutes, to another pair. Each pair takes the function with their own number (with more than six pairs, two pairs share one). '
              'The other pair says one thing that worked and one thing that would confuse a learner.') + slips([
        ('Pair 1', '<b>Interrupting politely.</b> A colleague is halfway through a long point in a meeting. You need to ask a short question.'),
        ('Pair 2', '<b>Disagreeing politely.</b> A friend wants to eat at a place you know is bad.'),
        ('Pair 3', '<b>Refusing an invitation.</b> A neighbor asks you to a party on a night you are busy.'),
        ('Pair 4', '<b>Asking someone to repeat.</b> A bad phone line, and you have missed the address.'),
        ('Pair 5', '<b>Inviting.</b> You want a new classmate to come to lunch on Friday.'),
        ('Pair 6', '<b>Giving advice.</b> A friend cannot sleep and has an exam tomorrow.'),
    ]) + '''
<p class="lead" style="margin-top:14px">Write four things, the way you would put them on the board.</p>
''' + area('1. The marker sentence you will teach, and one more formal and one less formal way to say the same thing.', 3) + '\n'
    + area('2. The context in one sentence, and two CCQs.', 3) + '\n'
    + area('3. The form as chunks. Mark the stress and say whether the voice goes up or down.', 3) + '\n'
    + area('4. How you will check that they can use it: one question or task.', 2) + '\n'
    + reveal('boardKey', '''<h4>A worked example: making an offer (a function not on your list)</h4>
<p><b>Marker sentence:</b> <span class="hl-tl">Shall I carry that for you?</span> More formal: “May I carry that for you?” Less formal: “Want me to take that?”</p>
<p><b>Context:</b> Maria has two heavy bags and is on the stairs. Pedro is passing her.</p>
<p><b>CCQs:</b> Does Pedro want to help? (Yes.) Is he telling her to give him the bags? (No: he is asking.) Who decides, Maria or Pedro? (Maria.)</p>
<p><b>Form:</b> <i>Shall I</i> + base verb + object + <i>for you</i>? <b>Pronunciation:</b> <i>shall</i> is weak, /ʃəl/; the stress falls on <i>CARry</i>; the voice goes up at the end, because Pedro is asking, not announcing.</p>
<p><b>Check:</b> a card for each learner (a heavy box, a bag, a door): offer to help the person next to you.</p>
<h4 style="margin-top:12px;">What to look for in the other pair’s teaching</h4>
<p>Did the context come before the sentence? Did the CCQs check meaning and appropriacy, or only the words? Did they say who is speaking to whom? Was the intonation drilled as well as the words?</p>'''))

# ---- PPP (+30) --------------------------------------------------------------
ADD['ppp'] = dict(
    after='debrief', id='stagepage', label='Stage a real page', badge='Your turn', style='B', numbered=False,
    title='Stage a page',
    html=lead('A page from a made-up coursebook. In pairs, stage it as a PPP lesson for a 45-minute slot with A2 adults: write each stage with its minutes. '
              'Then swap with another pair and check theirs against the five questions below.') + '''
<div class="slips">
<div class="slip wide"><span class="who">Unit 5 · Weekend plans · A2</span>
<p><b>Grammar: be going to.</b> A photo of a family at a station with suitcases. <i>They’re going to visit their grandmother.</i> <i>Look at those clouds! It’s going to rain.</i> The form, shown in a box: <i>subject + am / is / are + going to + base verb</i>.</p>
<p><b>Exercise 1.</b> Match six plans to six pictures. <b>Exercise 2.</b> Complete eight sentences with <i>going to</i> and a verb in brackets. <b>Exercise 3.</b> In pairs, tell your partner four things you are going to do this weekend, and one you are not going to do.</p></div>
</div>
''' + area('Lead-in (minutes):', 2) + '\n' + area('Presentation: the context, how you show the meaning, the form, the pronunciation (minutes):', 3) + '\n'
    + area('Controlled practice (minutes):', 2) + '\n' + area('Freer practice and feedback (minutes):', 2) + '\n'
    + lead('<b>Check another pair’s plan.</b> Does it have a context in one sentence? Is the meaning checked before the form? Does controlled practice come before freer practice? '
           'Does the freer practice get at least ten minutes? Do the minutes add up to 45?') + '\n'
    + reveal('stagepageKey', '''<h4>One way to stage the page</h4>
<p><b>Lead-in, 5.</b> Show the station photo. Where are they? Where might they be going? (T–S, then PW.)</p>
<p><b>Presentation, 10.</b> Context: the family’s plans. Model <i>They’re going to visit their grandmother</i>. CCQs: Have they decided? (Yes.) Is it happening now? (No: soon.) Board the form in chunks. Drill <i>going to</i> as /ˈɡəʊɪŋ tə/ chorally, then individually.</p>
<p><b>Controlled practice, 12.</b> Exercise 1 in pairs, exercise 2 alone, then check in pairs. One worked item on the board first.</p>
<p><b>Freer practice, 13.</b> Exercise 3, after one minute alone to plan. Monitor and note errors.</p>
<p><b>Feedback and correction, 5.</b> Good language first, then three errors on the board for the class to fix.</p>
<h4 style="margin-top:12px;">Where plans usually go wrong</h4>
<p>Presentation takes twenty minutes and practice gets what is left. The freer task has no preparation time. The minutes add up to 50. The lesson ends on exercise 2 and the speaking is “if there is time”. In a PPP lesson the practice stages are where the learning happens, so protect their minutes first.</p>'''))

# ---- Text-based teaching (+30) ----------------------------------------------
ADD['text-based-teaching'] = dict(
    after='debrief', id='findit', label='Find it in the text', badge='Your turn', style='B', numbered=False,
    title='Find it in the text',
    html=lead('A short text, and a language point hidden in it. In pairs, write the task that gets learners to find the language themselves. Then write two CCQs for one sentence. '
              'Then swap with another pair and say whether each task works.') + '''
<div class="slips">
<div class="slip wide"><span class="who">Mira’s year in Lisbon · B1</span>
<p>Mira moved to Lisbon last September. She has lived in the same flat since then, and she has already made three close friends: her neighbor Tomás, who has played the guitar for twenty years, and two colleagues from the café where she works. She hasn’t found a job in her own field yet, but she has started a Portuguese course, and her teacher says she has made fast progress. “I’ve never felt so far from home,” she says, “or so happy.”</p></div>
</div>
''' + lead('The target language is the present perfect for things that connect the past with now. It is in the text several times. Your learners do not know that: your task is how they find it.') + '\n'
    + area('1. The task. What do the learners do with the text so that they find the target language? Write the instruction you would say aloud.', 3) + '\n'
    + area('2. Two CCQs for: “She has lived in the same flat since then.”', 2) + '\n'
    + reveal('finditKey', '''<h4>One way to do it</h4>
<p><b>Where it is:</b> <span class="hl-tl">has lived</span> … since then; <span class="hl-tl">has</span> already <span class="hl-tl">made</span>; <span class="hl-tl">has played</span> … for twenty years; <span class="hl-tl">hasn’t found</span> … yet; <span class="hl-tl">has started</span>; <span class="hl-tl">has made</span> fast progress; <span class="hl-tl">I’ve</span> never <span class="hl-tl">felt</span>.</p>
<p><b>The task:</b> “Read the text again. Find the sentences about things that started in the past and still matter now. Underline the verbs. What do they look like? Work with your partner.” Then pairs compare, and the teacher boards two of them.</p>
<p><b>CCQs:</b> Did she move to Lisbon in the past? (Yes: last September.) Does she live in the flat now? (Yes.) Is the time finished? (No: it continues.) Can we say “She lived in the same flat since then”? (No.)</p>
<h4 style="margin-top:12px;">Two traps to look for in the swap</h4>
<p><b>Naming it:</b> “Find the present perfect” tells the learners the answer. The task should send them to the meaning, and the form follows.</p>
<p><b>Too much:</b> “Underline all the verbs” gives them twenty things and no idea which matters. Narrow it to one meaning.</p>'''))

# ---- Receptive skills (+30) --------------------------------------------------
ADD['receptive-skills'] = dict(
    after='key', id='writetasks', label='Write the tasks', badge='Your turn', style='B', numbered=False,
    title='Write the tasks',
    html=lead('One short text. In pairs, write a gist task and a detail task for it. Then swap with another pair and do theirs, without looking at the text for longer than the task allows. '
              'Is their gist task really gist? Is their detail task really detail?') + '''
<div class="slips">
<div class="slip wide"><span class="who">The last bridge keeper · B1</span>
<p>Every morning at six, Anton Weiss unlocks the gate of the Ruda bridge, the last hand-turned bridge on the river. It has opened for boats for 112 years, and Anton has done the job for thirty-one of them. Boats must call him the day before: nobody will turn the bridge for fewer than two boats. In winter, when the river freezes, he spends his days painting the iron rails, one by one, so that the town never has to pay for a new bridge. “People ask me whether a machine could do it,” he says. “Of course it could. But then who would say good morning to the boats?”</p></div>
</div>
''' + area('The gist task: one question or instruction, and the time limit.', 2) + '\n'
    + area('The detail task: three questions or statements.', 4) + '\n'
    + lead('<b>When you swap:</b> do the other pair’s gist task first, and stop at the time limit. Could you answer it without reading every word? Then do the detail task. Could you answer any of it without the text?') + '\n'
    + reveal('writetasksKey', '''<h4>What to check, and one example of each</h4>
<p><b>A gist task</b> is answered from the whole text and ignores the details: “What is special about Anton’s job, and does he enjoy it?” One minute. If you need the numbers to answer it, it is a detail task.</p>
<p><b>A detail task</b> sends learners back to specific places: How many years has the bridge been opening? (112.) How long has Anton done the job? (31.) Why must boats call the day before? (Nobody will turn it for fewer than two.) What does he do in winter? (Paints the rails.)</p>
<h4 style="margin-top:12px;">The faults to look for</h4>
<p>A gist task that is really a detail question (“How many boats…?”). A gist task with no time limit, so learners read every word. A detail question the learners could guess without reading. Questions that follow the text in order, so the answers can be copied one after another. A task that tests vocabulary instead of reading.</p>'''))

# ---- Teaching literacy (+30) -------------------------------------------------
ADD['teaching-literacy'] = dict(
    after='s5b', id='adapt', label='Adapt a TP handout', badge='Your turn',
    title='Adapt a handout',
    html=lead('Here is a handout like the ones you will write for TP. It is for a group of adult beginners, and two of them are still decoding the Latin alphabet. '
              'In pairs, redesign it so that those two can use it. Sketch it on paper, then show it to the room as a gallery.') + '''
<div class="slips">
<div class="slip wide"><span class="who">The handout as written</span>
<p><b>Checking in at the hotel.</b> Read the dialogue. Then complete the form with the information from the dialogue.</p>
<p>Receptionist: Good evening. Have you got a reservation?<br>Guest: Yes, under the name Okafor.<br>Receptionist: Could you spell that, please?<br>Guest: O-K-A-F-O-R.<br>Receptionist: How long are you staying?<br>Guest: Three nights. Room for two.</p>
<p><b>Registration form.</b> Family name: ____________ Number of nights: ____ Number of guests: ____ Signature: ____________</p></div>
</div>
''' + area('What you changed, and why. List at least five changes: layout, the size and kind of letters, pictures, how much is on the page, what the learners write.', 5) + '\n'
    + lead('<b>In the gallery,</b> look at three other designs. For each one, say what a pre-literate learner could do on it, and what they could not.') + '\n'
    + reveal('adaptKey', '''<h4>What most good redesigns change</h4>
<p><b>Less on the page.</b> One short exchange, with the lines in separate boxes, and room around them.</p>
<p><b>Bigger and plainer letters.</b> Sans-serif, with space between the lines. Names printed in capitals, as the learners will meet them in real life.</p>
<p><b>Pictures carry the meaning.</b> A hotel desk, a suitcase, three moons for three nights. The learners can tell what the dialogue is about before they read a word.</p>
<p><b>The form needs less writing.</b> Tick or circle, not write: three boxes for the nights, two figures for the guests. The learner copies the name from a card, letter by letter.</p>
<p><b>Say it before you read it.</b> The dialogue is heard and repeated first. The text is a way to see what they already know.</p>
<h4 style="margin-top:12px;">The question for the room</h4>
<p>Which change would you make in your next TP handout, even with literate learners?</p>'''))

# ---- Teaching productive skills (+30) ---------------------------------------
ADD['teaching-productive-skills'] = dict(
    after='s7', id='runtask', label='Run the task', badge='Your turn', numbered=False,
    title='Run the task',
    html=lead('Groups of four. One of you is the teacher, two are the students and one is the observer. The teacher sets up the task, monitors it on the sheet below and gives feedback. '
              'Swap until everyone has taught.') + slips([
        ('The task card · B1', '<p><b>The best advice I ever got.</b></p><p>Think about the best piece of advice anyone has given you. Who gave it? What happened? Prepare for one minute, alone. Then tell your partners, and ask each other questions.</p>', 'wide'),
        ('The teacher', '<p>Set up the task in three sentences. Check that the students know what to do (an ICQ). Then walk, listen and write on the monitoring sheet. Do not correct anyone while they are speaking.</p>'),
        ('The observer', '<p>Sit outside the group. Write down what the teacher says in the instructions, where they stand, and the moment you thought the students needed something and did not get it.</p>'),
    ]) + '''
<p class="lead" style="margin-top:14px">The monitoring sheet. The teacher fills this in while the students speak, then uses it for feedback.</p>
''' + area('Good language I heard (one or two things to praise).', 2) + '\n'
    + area('Language to fix (two or three things, written exactly as said).', 3) + '\n'
    + area('Content: what the students told each other (so you can respond to it, not only to the language).', 2) + '\n'
    + reveal('runtaskKey', '''<h4>What good feedback sounds like</h4>
<p><b>Content first.</b> “Somebody told me about a teacher who said, ‘Don’t wait to feel ready.’ That’s good advice. Did you all agree?” Two minutes of real response, before any language.</p>
<p><b>Then language, on the board.</b> One thing done well, as said: “I’ve never told anyone this before.” Then two mistakes, written as heard, without names. “Which one is wrong? How would you fix it?” The students correct them; the teacher confirms.</p>
<p><b>Then the observer.</b> One thing the teacher did that helped, and one thing that would have helped more.</p>
<h4 style="margin-top:12px;">Look out for</h4>
<p>A teacher who corrected during the task. Feedback that was all language and no response to what the students said. Three errors on the board and no time to fix them. A monitoring sheet with nothing on it.</p>'''))
