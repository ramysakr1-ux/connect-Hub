# The trainer notes, one block per session.
#
# Ramy, 13 Oct 2026: "We need to make trainer notes. Trainer notes that only
# trainers can see, obviously." Each block is what the tutor needs on the day
# and nothing the trainee should read: how to run it with timings, what to
# say at the turns, the answer key where the page keeps it from the trainee,
# and the traps. _house.py drops each one into its page as
# <section id="trainer" class="trainer-notes" hidden>; the tutor-link gate
# turns it on. Written in the same voice as the pages: plain sentences, one
# idea each, no arrows.

def T(rows, mins=False):
    """The running table: (minutes, stage, what you do). Ramy, 14 Oct 2026: the
    minutes stay only where the page itself gives them; a session whose page
    carries no times gets the stages and what to do, and no invented clock."""
    # Ramy, 15 Oct 2026: no lengths on the trainees' pages (strip_lengths in _house.py
    # sees to that). Ramy, 26 Oct 2026: time every session part by part, for the tutor:
    # the trainer notes carry the minutes, and only tutors open them.
    mins = True
    if not mins:
        return '<table class="tn-time"><tr><th>Stage</th><th>What you do</th></tr>' + ''.join(
            '<tr><td>%s</td><td>%s</td></tr>' % (r[1], r[2]) for r in rows) + '</table>'
    return '<table class="tn-time"><tr><th>Min</th><th>Stage</th><th>What you do</th></tr>' + ''.join(
        '<tr><td>%s</td><td>%s</td><td>%s</td></tr>' % r for r in rows) + '</table>'

NOTES = {}

NOTES['eliciting-and-ccqs'] = '''
<h4>Before</h4>
<p>Open the page on the screen; trainees follow on their own devices for the game, the two tasks and the worksheet. Print the handout gives the tasks and the worksheet with the answers hidden.</p>
<h4>Running it</h4>
''' + T([
    (5, 'Spot the elicitor', 'Read both teachers aloud yourself, with the voices. Ask the room who is eliciting before anyone clicks.'),
    (5, 'Why do we elicit?', 'Pairs list reasons in the box. Collect a few aloud, then reveal the five and the warning: you can\u2019t elicit what isn\u2019t there.'),
    (10, 'Name the technique', 'Pairs or two teams. One moment at a time; a point only for a first-time answer. See all eleven at the end, and ask for a twelfth of their own.'),
    (8, 'In the classroom', 'The film is three and a half minutes. Play it once; pairs write the techniques in order and the moment they would have told the class. Name the techniques yourself before the session: the page gives no key, so the room builds it.'),
    (10, 'Building CCQs', 'Walk the managed-to model on the board: the sentence, what it means, simpler statements, then questions. Task A in pairs (find the sentence), Task B as a class (what is wrong).'),
    (10, 'CCQ worksheet', 'Item 1 is done. Do item 2 together first: meaning in plain words, then CCQs. Pairs on 3 to 7; reveal as they finish.'),
    (5, 'Other ways to check meaning', 'Click through the eight. Ask which suits the language in their next TP.'),
    (15, 'Your turn', 'Pairs plan the elicitation and one CCQ for two words, then elicit them from another pair. Monitor for CCQs that use the target word.'),
]) + '''
<h4>The key</h4>
<p>Every task\u2019s answer is on the page behind its reveal. The practice words in Your turn have no key: any technique that gets the word out of a student is right, and any CCQ with a short answer that does not contain the word is right.</p>
<h4>Watch for</h4>
<ul>
<li>CCQs that contain the target language (\u201cDid he use to bite his nails?\u201d). Send them back to meaning.</li>
<li>\u201cDo you understand?\u201d dressed up as a CCQ. A CCQ has an answer you can hear.</li>
<li>CCQs about things the sentence doesn\u2019t say: Task B\u2019s first set is the model of that mistake.</li>
<li>Eliciting that becomes a guessing game with no context. The scenario does the work.</li>
</ul>'''

NOTES['error-correction'] = '''
<h4>Before</h4>
<p>Check the sound for the lead-in film (the Mitchell and Webb sketch, 3 minutes). The two practice tables print from the handout; a printed copy per pair saves the typing.</p>
<h4>Running it</h4>
''' + T(mins=False, rows=[
    (3, 'Lead-in', 'Read the two viewing questions aloud before you press play. After the film, pairs compare; take one or two answers to each. The errors are small and the correcting is relentless: that contrast is the session.'),
    (7, 'Attitudes', 'Each trainee ranks the nine alone, then compares in threes. No key. Draw out the two that split a room: "You’ll never learn if you are not corrected" and "Making a mistake means you’ve learnt it wrongly".'),
    (8, 'The decision flow', 'Part A in pairs on screen; the order is type, deal or not, when, who, technique. Part B the same. Ask which decision they skip in TP: usually "who": the teacher always does it.'),
    (7, 'Match the errors', 'Individually, then check. The eight are a mix on purpose: three grammar, three pronunciation, two vocabulary. Ask which ones a student could self-correct if pointed at, and which need telling.'),
    (8, 'How to correct', 'Click the twelve as a class. Demonstrate three on a volunteer: finger correction, the echo with a rising tone, the one-word question. They need to see them, not read them.'),
    (12, 'Practice 1 and 2', 'Pairs, one table each, then swap and check each other’s. The key is below; the page has none for these two tables, so it is yours to give.'),
]) + '''
<h4>The key: the practice tables</h4>
<table class="tn-time"><tr><th></th><th>Corrected</th><th>Type</th><th>A technique</th></tr>
<tr><td>A</td><td>They can swim very well.</td><td>Grammar: modal + bare infinitive</td><td>Finger correction, take out "to"</td></tr>
<tr><td>B</td><td>She went to the cinema yesterday.</td><td>Grammar: word order</td><td>Repeat up to the error, rising tone</td></tr>
<tr><td>C</td><td>He’s reading a book.</td><td>Grammar: article</td><td>Finger correction, a missing finger</td></tr>
<tr><td>D</td><td>How many photographs did you take?</td><td>Grammar: countable, much or many</td><td>One-word question: "Countable?"</td></tr>
<tr><td>E</td><td>She comes to school late every day.</td><td>Grammar: third person -s</td><td>Gesture: the S drawn in the air</td></tr>
<tr><td>F</td><td>I waited two hours for the bus yesterday.</td><td>Grammar: past simple</td><td>Timeline, or "Yesterday?" with a hand behind the shoulder</td></tr>
<tr><td>G</td><td>Can I borrow your pen?</td><td>Appropriacy: too formal between friends</td><td>"Your friend? Really?" and a raised eyebrow</td></tr>
<tr><td>H</td><td>…because she was pregnant.</td><td>Vocabulary: false friend (embarazada)</td><td>Tell them, with the smile; then CCQ the two words</td></tr>
<tr><td>I</td><td>I’m bored.</td><td>Vocabulary: -ed and -ing adjectives</td><td>Echo "I’m boring?" and point at yourself</td></tr>
<tr><td>J</td><td>…by ship.</td><td>Pronunciation: /iː/ and /ɪ/</td><td>Phonemic chart, or draw the sheep</td></tr>
<tr><td>K</td><td>…a boyfriend in England.</td><td>Pronunciation: the diphthong</td><td>Model and drill the one word</td></tr>
<tr><td>L</td><td>I really enjoy your lessons.</td><td>Grammar: enjoy is a verb, not an adjective</td><td>Board the sentence, let them find it</td></tr>
<tr><td>M</td><td>He’s watching TV.</td><td>Pronunciation: /tʃ/ and /ʃ/</td><td>Minimal pair on the board: wash, watch</td></tr></table>
<h4>Watch for</h4>
<ul>
<li>Trainees who correct everything in their TPs the week after this session. The attitudes task is where to plant "not every error, not every time".</li>
<li>The decision flow learnt as a list. Ask for it as a story: "A student says X. What do you decide first?"</li>
</ul>'''

NOTES['classroom-management'] = '''
<h4>Before</h4>
<p>Groups of three with one device each for the wheel; the rest is whole class on the screen. Nothing to print.</p>
<h4>Running it</h4>
''' + T(mins=False, rows=[
    (6, 'Would you rather', 'Six dilemmas, fast. Pick one, tell your partner why, next. The point is that they already have a theory of good teaching; this session gives it names.'),
    (8, 'Who is talking', 'Set the sliders to their TP class: the real number of students, the real minutes. Watch the bar. Then the six cards: ask them to predict the six reasons before clicking.'),
    (12, 'The wheel', 'Threes. Each group spins and talks for two minutes per area; they will get through five or six, not thirteen. Collect one line per group at the end.'),
    (10, 'Yes, no or maybe', 'Pairs decide, then reveal one at a time with the whole room. Number 7 (repeating what a student said) is the one to stop on: it is the echo they all do.'),
    (12, 'Spot the problem', 'Whole class on screen, one moment at a time, a different trainee each time. These are Scrivener’s fourteen; say so at the end, not the start.'),
    (8, 'Grade your language', 'The six fixes as a class, then the rescue in pairs. Compare two or three rewrites against the model on screen.'),
    (4, 'Into TP', 'Each trainee ticks two, not eight, and says which two.'),
]) + '''
<h4>The key</h4>
<p>Everything reveals on the page: the twelve yes-no-maybe answers with their reasons, the fourteen problems with their labels, the six graded instructions and the model rescue.</p>
<h4>Watch for</h4>
<ul>
<li>The wheel eating the session. Twelve minutes is the limit; stop it with the sentence from the page: "which of these is the hardest for you, and why?"</li>
<li>Capital letters on the board: they will argue. The reveal gives the reason (they hide which words take a capital); hold the line.</li>
<li>The rescue rewrite coming out as polite questions. Imperatives, and a check question that is not "do you understand?"</li>
</ul>'''

NOTES['functional-language'] = '''
<h4>Before</h4>
<p>The three exponents on the board before they arrive: "Can you pass me the sugar, please?", "You should stay in bed.", "If only I’d been more romantic with her." The Wordwall link in part 6 is a phone version of the matching; use it if the room has phones and the page is on the projector.</p>
<h4>Running it</h4>
''' + T(mins=False, rows=[
    (10, 'Exponent 1, together', 'Analyse the sugar sentence as a class: form as a chunk (not a grammar label), function, phonology, CCQs, context. Reveal the key and compare line by line. This is the model for the other two.'),
    (12, 'Exponents 2 and 3', 'Pairs: one takes "You should stay in bed", the other "If only I’d been more romantic", then they teach each other. Keys are at the end of the page (parts 10 and 11), not beside the task, on purpose.'),
    (5, 'The functions', 'Twelve functions; for each, one exponent they know and one other way of saying it. Thirty seconds a function, out loud, no writing.'),
    (8, 'Matching', 'Individually on the page or on Wordwall, then the key (part 7).'),
    (6, 'Requests', 'Six exponents of the same request. Rank them from most to least formal on the board, then ask who would say each to whom. Appropriacy is the point: a request can be perfect grammar and still wrong.'),
    (4, 'Responding', 'The gap is "respond". Collect accepting and declining exponents from the room before revealing the examples.'),
]) + '''
<h4>The key</h4>
<p>On the page: parts 2, 7, 10 and 11, and the examples in part 9. The gap in part 9 accepts respond, reply or answer.</p>
<h4>Watch for</h4>
<ul>
<li>Form written as a grammar lesson ("modal verb can + subject…"). For functional language the form is the chunk: "Can you + verb + me the + noun".</li>
<li>CCQs about grammar instead of function. "Is she asking politely?" is a function CCQ; "Is it present simple?" is not.</li>
<li>"If only I’d been more romantic": trainees analyse the third conditional and forget the regret. The function is the headline.</li>
</ul>'''

NOTES['phonology-sounds'] = '''
<h4>Before</h4>
<p>Test the sound on the room’s machine: press Play on the first word and turn the speakers up until the back row hears it. The words are recordings, so they sound the same on every machine and play without the internet once heard. The Seeing Speech link in part 3 needs the internet.</p>
<h4>Running it</h4>
''' + T([
    (8, 'Sounds and letters', 'Play each word twice; they write it, then count. Let the room disagree about "letter" (four or five sounds) before you reveal: the disagreement is the lesson.'),
    (7, 'Terms', 'Pairs match the six. Then say each definition in your own words with your hand on your throat for voiced.'),
    (10, 'Consonants', 'Everyone says the eight sounds aloud, hand to mouth, before choosing. Then Seeing Speech on the screen for two of them.'),
    (8, 'Voicing', 'Pairs: read the phonemic script aloud first, write the word, then first and last sound. Throat check for every answer.'),
    (7, 'The chart', 'Click round the vowels in rows; ask them to feel the jaw drop from /iː/ to /ɑː/. Then the three places the consonant rows go.'),
    (10, 'Script', 'Individually on their own devices, using the symbol keys. Check as a class; reveal only after.'),
    (10, 'Film titles', 'Pairs, first to finish. Then the question that matters: which of these would you use with a class, and at what level?'),
]) + '''
<h4>The key</h4>
<p>All on the page: Check answers under each task, Reveal for the script and the films. The obstruction answers are: b, m and p at the lips; v at the lower lip and top teeth; n and t at the tongue tip and ridge; r at the tongue tip near the ridge; k at the back of the tongue and soft palate.</p>
<h4>Watch for</h4>
<ul>
<li>The voice. The recordings model single words; they are not a model for connected speech, so say the words yourself too.</li>
<li>Trainees who stop at "I can’t do phonemic script". The keys on the page mean nobody has to draw a symbol; they only have to choose one.</li>
<li>American and British counts for "letter": both are right; the chart is British.</li>
</ul>'''

NOTES['ppp'] = '''
<h4>Before</h4>
<p>Do not say "PPP" before the debrief. The page is staged as a lesson and the point is that they live it first: pre-teach the terms, predict the staging, read to check, detail questions, then name it. Nothing to print.</p>
<h4>Running it</h4>
''' + T([
    (2, 'Lead-in', 'Hands up for the question. No discussion yet.'),
    (3, 'What is PPP?', 'The reveal card gives the three words; that is all they get for now.'),
    (8, 'Match the terms', 'Pairs. Five terms. When they finish, ask: what did I just do? (Pre-taught vocabulary.) Say nothing more.'),
    (3, 'Predict', 'A minute in pairs, then two predictions on the board.'),
    (12, 'Read', 'Silently, one minute against your watch, for the gist. Then: were your predictions right? That is the gist check.'),
    (8, 'Detail', 'Six true-or-false, individually, then pairs, then click. Number 6 is the one to argue about.'),
    (9, 'Debrief', 'Order the stages. Then the question: which stages of a PPP lesson did this session just model, and which did it skip (production: they will notice there was no freer stage, and that is a fair criticism of a short input).'),
]) + '''
<h4>The key</h4>
<p>On the page: the matches, the six true-or-false with reasons, the debrief order (pre-teach terms, predict the staging, read to check, detail check).</p>
<h4>Watch for</h4>
<ul>
<li>Trainees who know PPP already and want to skip the reading. Let them; the detail questions catch two things most of them get wrong (feedback is delayed in production; pronunciation is part of presentation).</li>
<li>The word "presentation" heard as a lecture. The text says context, model, CCQs; point at it.</li>
</ul>'''

NOTES['text-based-teaching'] = '''
<h4>Before</h4>
<p>As with PPP: the session is the lesson shape. Do not name it until the debrief. Nothing to print.</p>
<h4>Running it</h4>
''' + T([
    (2, 'Lead-in', 'Hands up. Grammar point first, or text first, in the last coursebook lesson they had as a student.'),
    (3, 'What makes a lesson text-based?', 'The reveal card. Then move on.'),
    (3, 'Predict', 'Pairs, a minute. Two orders on the board.'),
    (14, 'Read', 'The text is long on purpose; it carries the whole shape. Silently, one minute for the gist: a skim, not a full read. Then check the predictions.'),
    (10, 'Detail', 'Nine true-or-false. Individually, pairs, click. Numbers 6 and 7 (form elicited, pronunciation not skipped) are the ones trainees get wrong in TP.'),
    (10, 'Debrief', 'Order the four stages. Then ask them to map the text onto a TP: which coursebook page they teach next, and where the language would be lifted from.'),
    (3, 'Close', 'One difference between this and PPP, in one sentence each.'),
]) + '''
<h4>The key</h4>
<p>On the page: the nine true-or-false with reasons, and the debrief order.</p>
<h4>Watch for</h4>
<ul>
<li>"Text-based" heard as "reading lesson". The text supplies the language; the clarification is still direct teaching time. The last paragraph of the reading says so.</li>
<li>Trainees who lift one item from the text when the page says several may be lifted. Both are allowed; one is easier in 45 minutes.</li>
</ul>'''

NOTES['guided-to-less-guided-practice'] = '''
<h4>Before</h4>
<p>Sound for the film (the Pink Panther dialect-coach scene, 2 minutes). The nine techniques in part 2 are yours to demonstrate live in Your turn, so have the sentence ready: "I’m going to the cinema" does for all nine. Jazz chant: a beat, your hand on the table.</p>
<h4>Running it</h4>
''' + T(mins=False, rows=[
    (6, 'Cued dialogue', 'Pairs, before anything else. They build the phone call from the cues and act it. Then the question: how much help did the cues give you? That is less-guided practice, felt before it is named.'),
    (5, 'The film', 'Watch, then the question on the page. They will laugh; then ask what the coach did that worked (chunks, repetition, no explanation) and what did not (no meaning).'),
    (5, 'Why drill', 'Groups write first, then reveal. Add your own: confidence, and the sound of the sentence in the mouth before the brain is asked for it.'),
    (10, 'Techniques', 'Match the nine. Then Your turn: you demonstrate each technique live on one sentence, they write their own example, reveal the answers at the end.'),
    (10, 'Types of drill', 'Chain drill together, then thirteen to match in pairs. The examples appear after Check answers; read three aloud and run them on the room.'),
    (6, 'Meaningful drills', 'Four cards. Run the guessing drill for real: pick a sport, they ask yes-no questions.'),
    (4, 'Jazz chant', 'Beat first, then the chant, twice. Do not explain it.'),
    (5, 'Transformation and substitution', 'Run both on the room from the page, then they write two cues of their own.'),
    (8, 'Information gap', 'Pairs, A and B, lists hidden from each other. Then the question: where on the guided-to-free line does this sit, and why?'),
]) + '''
<h4>The key</h4>
<p>On the page: the nine technique matches, the thirteen drill types with an example each after checking, the exit ticket has none. The cued dialogue has no key; any line that fits the cue is right.</p>
<h4>Watch for</h4>
<ul>
<li>A drill that never reaches natural speed. Every drill on this page ends at the speed the sentence is said in the street.</li>
<li>Drilling without meaning. The film is the warning: perfect form, no idea what it means.</li>
<li>Time. Part 3 can take the whole hour; thirteen types in ten minutes means you read the examples, they do not.</li>
</ul>'''

NOTES['teaching-speaking'] = '''
<h4>Before</h4>
<p>This is a long one; if time is short, cut Plan a speaking lesson to ten minutes. Lesson Shape (F) is IH’s; the staging task and the framework table are on the page. Nothing to print.</p>
<h4>Running it</h4>
''' + T([
    (5, 'Warm-up', 'The two questions in pairs. Keep the answers: they come back in part 3.'),
    (10, 'Free or controlled', 'Ten features to sort, individually, then Check answers. Ask for a controlled speaking task they have seen this week and a free one.'),
    (10, 'What makes it work', 'Read the nine principles; tick the ones from the warm-up. Then: which one did your last TP miss?'),
    (15, 'Stage order', 'Pairs order the twelve stages on screen; the reveal names the shape. Ask which stages they would cut in a 45-minute TP and why.'),
    (10, 'The framework', 'The five stages of Shape (F) on the board. "Useful language is not target language": say it twice; it is the mistake they make.'),
    (10, 'Problems', 'Match the five problems to solutions, then the examples of coping strategies below.'),
    (15, 'Plan a stage', 'Pairs plan five stages for a topic. Swap plans with another pair and ask the question on the page.'),
    (5, 'Wrap-up', 'The five takeaways on screen; one each.'),
]) + '''
<h4>The key</h4>
<p>On the page: the sort (controlled: accuracy, non-communicative, one item, form, teacher intervention; free: the other five), the stage order (select the activity, set up the room, pre-teach, stimulus, instructions, check, groups, roles, preparation, activity, monitor, feedback), and the problems (confidence: atmosphere and small groups; vocabulary: preparation and task language; pronunciation: coping strategies; thinking quickly: preparation; dull topic: choose topics carefully and personalise).</p>
<p><b>Coping strategies, examples for the room:</b> paraphrase the word you can’t say ("the thing you open a bottle with"); swap it for one you can; spell it; show it with a gesture; slow down and chunk it; check it landed ("did you get that?"); ask ("how do you say…?"); hold the floor ("well, let me think…") so the pause is not a full stop. The message gets across when the pronunciation doesn’t, and the learner stays in the turn.</p>
<h4>Watch for</h4>
<ul>
<li>"Useful language" taught as the aim of the lesson. It is a crutch, offered and then ignored if they do not need it.</li>
<li>Feedback that starts with errors. Content first: did the task get done, what did they decide. Then language.</li>
</ul>'''

NOTES['teaching-exam-classes'] = '''
<h4>Before</h4>
<p>Check the exam facts against this year’s pages if you teach this more than a year after it was written; formats and names move (KET became A2 Key, and so on). Nothing to print.</p>
<h4>Running it</h4>
''' + T([
    (8, 'The CEFR ladder', 'Click each rung from the bottom. Ask where their TP students sit, and where they themselves would sit in a language they are learning.'),
    (8, 'Acronyms', 'Pairs match the eleven. Ask which they have heard students ask for.'),
    (15, 'The exams', 'Nine cards, at their own pace on their own devices. Then one fact each that surprised them.'),
    (8, 'Which exam?', 'Five corridor questions. Pairs choose, Check my recommendations, argue the ones that split.'),
    (10, 'Being an examiner', 'Two panels. Say what the route looks like from here: a teaching qualification, about two years, an approved centre, standardisation.'),
    (5, 'Wrap-up', 'The three questions on the page. The certificate is a joke; let it be one.'),
]) + '''
<h4>The key</h4>
<p>On the page: the acronym matches and the scenarios (YLE; TOEFL iBT; PTE Academic; B2 First; IELTS).</p>
<h4>Watch for</h4>
<ul>
<li>Trainees who want a lesson on how to teach each exam. This session is a map, not the territory; say so at the start.</li>
<li>Exam facts quoted as permanent. Everything here was right when written; the official pages win.</li>
</ul>'''

NOTES['teaching-writing'] = '''
<h4>Before</h4>
<p>Scraps of paper for the mystery present; the model letter is on the page. Part 4 needs the SpongeBob cartoon strip from your own materials: it is copyrighted, so it is not on the page. A wall for the running dictation, or do it on screen line by line. Online: the page carries the online version of each step in brackets.</p>
<h4>Running it</h4>
''' + T(mins=False, rows=[
    (8, 'The mystery present', 'Live, no screen. Everyone writes a present for someone in the room, you redistribute, elicit "say thank you", and they will write a thank-you letter to find the giver.'),
    (12, 'The thank-you letter', 'Show the model. Ask what the features are, and whether the present is named (it is only implied). They write; then the mingle: letters held up, read aloud, delivered.'),
    (6, 'Attitudes', 'Sort the eight on screen in pairs. Ask which attitude their students will have.'),
    (6, 'Before we write', 'Your strip, then the brainstorm, then the checklist reveal. Eleven considerations; they will get seven.'),
    (6, 'Product or process', 'Sort the ten. Then: which approach was the thank-you letter? (Product, with a model.)'),
    (8, 'Wall dictation', 'Running dictation if the room allows, line by line on screen if not. Then the comprehension questions; the key is on the page.'),
    (6, 'Parallel writing', 'The Joe and Barbara paragraph from the prompts; compare with the model.'),
    (4, 'Controlled to freer', 'Sort the five on the continuum.'),
    (4, 'Backs to the board', 'New term, describe it, guess it. Four or five terms is enough.'),
]) + '''
<h4>The key</h4>
<p>On the page: the three sorts (attitudes, product and process, controlled to freer), the considerations list, the dictation answers (the volleyball catch is in there), and the parallel-writing model.</p>
<h4>Watch for</h4>
<ul>
<li>The page gives the trainee each activity as a student would get it. The running of it (collecting and redistributing the presents, posting the dictation text on the wall, your copy of the SpongeBob strip) is yours, above.</li>
<li>The mingle needs the room. Online it is chat and breakout rooms, as the page says.</li>
</ul>'''

NOTES['lesson-framework'] = '''
<h4>Before</h4>
<p>Ten parts, about seventy-five minutes; parts 7 to 9 can go if time is short. Part 10 is one made-up page with all eight of its activities printed on it; no book is needed. Nothing to print.</p>
<h4>Running it</h4>
''' + T(mins=False, rows=[
    (5, 'The decision tree', 'Walk it from the top with one lesson they have taught this week. Language or skills, text or no text.'),
    (12, 'The six shapes', 'Pairs write the stages of each shape before anything is revealed; then reveal and compare. Ask which they have taught and which they have not.'),
    (7, 'Card sort', 'Six stages, six shapes, pairs on screen.'),
    (8, 'Quiz', 'Eight cards, flip and answer, whole class. Number 4 (underlining is not practice) is the one to stop on.'),
    (8, 'Scenarios', 'Six mini lessons; name the framework. The key is below.'),
    (6, 'Meaning or form', 'Six task types from the MFPA table. Say what each would look like on a handout.'),
    (6, 'The flaw', 'Two plans; what is structurally wrong. Read the fix aloud.'),
    (5, 'Pacing', 'Budget 45 minutes across three stages; the page checks the total. Then the question: which stage do you trim? (Practice, not clarification.)'),
    (7, 'Sequence', 'Pick a framework, order the stages, check. Four frameworks; two is enough.'),
    (10, 'One page, three lessons', 'Eight activities from one printed page, put into three lessons in pairs, then the shape of each named. Check, and ask where they would cut.'),
]) + '''
<h4>The key</h4>
<p>On the page for every task. The scenarios: TTT; text-based; language practice; productive skills; PPP; receptive skills. Meaning or form: gap-fill, sentence jumble and spot the mistake are form only; grammaring and transformation are meaning and form; contrastive analysis is meaning only. Pacing target: 10 to 12, 15, 15 to 18.</p>
<h4>Watch for</h4>
<ul>
<li>"Useful language" in productive skills treated as target language: the card sort and the flaw task both turn on it.</li>
<li>Frameworks learnt as rules. They are shapes, and a lesson can borrow from two; say that in part 2 and again in part 10.</li>
</ul>'''

NOTES['alternative-teaching-techniques'] = '''
<h4>Before</h4>
<p>This page is the lesson plan, step by step with your asides; the trainees see the lesson as their students would. Decide whether the story suits your group (somebody dies in it; the note in Before you start gives the softer version). Print the cut-ups for step 6: the practice tasks PDF has them, one set per pair, and the ranking cards for step 8. The picture is on the page.</p>
<h4>Running it</h4>
''' + T([
    (6, 'The story', 'Tell it, do not read it. The beats are under "The story, beat by beat". Six minutes; the clock note on the page is right.'),
    (6, 'Elicit', 'Who is most responsible? Then why, pushed to a full sentence. Take what they give you and shape it on the board. The one rule: do not explain the grammar first.'),
    (8, 'Meaning', 'Six CCQs on screen, answered by the room. Then the concept and the timeline.'),
    (8, 'Form', 'The gap-fill on screen, then the two clause orders. The strips on the board, swapped, the comma rubbed out.'),
    (4, 'Drilling', 'Backchain both halves. Weak have, contracted had. Natural speed or it does not count.'),
    (6, 'Controlled', 'The cut-ups in pairs; on screen to check. Ask who said each sentence.'),
    (7, 'Semi-controlled', 'Finish the sentences. Two or three endings for the same beginning.'),
    (10, 'Freer', 'Rank the five, defend with third conditionals only. Stay out; write down the errors for the end.'),
    (5, 'The twist', 'Love, work, desire, money, power. Light, then the delayed correction from step 8.'),
]) + '''
<h4>The key</h4>
<p>On the page: the CCQs, the form gap-fill, the cut-up matches, possible endings for the stems, and how to read the twist.</p>
<h4>Watch for</h4>
<ul>
<li>The teal asides on the page (the one rule, while you tell it, how to get it across, teach less than this, while they work) are yours; a trainee link never shows them. The page itself now reads as the lesson the class gets.</li>
<li>Step 1 overrunning. Ten minutes of story is a lecture.</li>
<li>"If she would have stayed": it will come; board it at the end, not in the middle of the ranking.</li>
</ul>'''

NOTES['teaching-literacy'] = '''
<h4>Framing this session</h4>
<p>Most trainees will never teach a fully pre-literate class on this course. The point isn’t to make them experts; it is to make them notice the possibility before they misread silence as low ability or disengagement.</p>
<h4>Running it</h4>
''' + T([
    (3, 'Lead-in', 'The Mongolian line on screen for two seconds, then away. Nobody can hold it; that is the feeling.'),
    (10, 'What literacy covers', 'Five cards, one at a time, whole class. Number 5 (where it shows up on this course) keeps it honest.'),
    (7, 'Spot the barrier', 'Four moments, pairs decide, click to check.'),
    (8, 'Adapt the handout', 'Two handouts, three versions each. Pairs pick; the notes under each option say why.'),
    (12, 'Techniques', 'Five techniques, week one or later, pairs, then the note.'),
    (5, 'Wrap-up', 'The one question. Protect it.'),
]) + '''
<h4>"Spot the barrier": there is no trick answer</h4>
<p>Scenario 3 (can’t hold a pen correctly) is deliberately the one most likely to be misjudged as babyish or irrelevant. It is a real signal in adult pre-literacy classes and worth a beat of discussion.</p>
<h4>"Adapt the handout": push past "make it simpler"</h4>
<p>The wrong-but-tempting answer is usually the version that is just shorter text; it still assumes fluent decoding. The right answer relies on images and realia doing the work language can’t yet.</p>
<h4>Techniques: there is genuine disagreement here</h4>
<p>Don’t present the notes as the only right sequencing. Some centres introduce letter names before letter sounds, or vice versa. Use disagreement in the room as the discussion, not a wrong-answer moment.</p>
<h4>Time is tight: protect the wrap-up</h4>
<p>Time is short for this much ground. If the handout activity runs long, cut to two of the three technique cards rather than skipping the wrap-up question. That question is the takeaway.</p>'''

NOTES['word-and-sentence-stress'] = '''
<h4>Before</h4>
<p>Sound for the Hamlet sketch (about five minutes: the page plays the first actor and then the second actor’s note (to be or not to BE), and jumps past the long chat about the skull and Hamlet to the next actor; it is a fan upload, so check it still plays, and the RSC’s own short cut is the fallback link under the frame). Nothing to print; the chant and the roses sentence are on screen.</p>
<h4>Running it</h4>
''' + T(mins=False, rows=[
    (8, 'Lead-in', 'Watch once: tick the word each actor lands on. Watch again in pairs: what does the line mean each time, which would you choose. Then the reveal. If you want a word-by-word key for the nine, add it after one viewing; the page does not claim one.'),
    (6, 'Rhythm', 'Clap the four beats and say the four lines over them, faster each time. The reveal names stress timing.'),
    (8, 'Word stress', 'Sixteen countries; say each before clicking. Have them sort the words into the bubble patterns first, then click. Pakistan and Montreal carry a secondary stress; make them hear it. Show how you mark stress on the board: bubbles, never accent marks.'),
    (8, 'Contrastive', 'The roses sentence seven ways, round the room, one word each. Reveal the implication after each.'),
    (7, 'In context', 'Step 1 alone: mark the five questions. Only then open the conversation (on paper, fold the page). Pairs read it with their own names and mark again. Ask what moved before the reveal.'),
    (7, 'The café', 'Pairs read the five exchanges aloud, the server leaning on a different word each time. Agree the stress, then reveal. Push for why: the stress answers what the customer just said.'),
    (7, 'Attitudinal', 'Five Paris exchanges in pairs: which word, before revealing.'),
    (8, 'Noun or verb', 'Eight quiz items individually. Then two more pairs of their own (import, present, record, object, contract, conduct).'),
    (6, 'Make it productive', 'Ask the room which tasks so far were receptive (all of them). Each trainee picks one and writes how Ss would say it. Hear three, then the reveal. Tie it to their next TP plan.'),
    (3, 'Round-up', 'Trainees write their three before opening. Collect them aloud; the reveal is the board summary.'),
]) + '''
<h4>The key</h4>
<p>On the page for every task. Primary stress: aus-TRA-lia, HUN-ga-ry, bra-ZIL, ja-PAN, IT-a-ly, LON-don, pak-i-STAN (secondary on pak), GER-ma-ny, chi-CA-go, mon-tre-AL (secondary on mon), tor-QUAY, TUR-key, IN-di-a, SWIT-zer-land, a-MER-i-ca, slo-VA-ki-a.</p>
<h4>Watch for</h4>
<ul>
<li>Stress shown by volume alone. Length and pitch carry it too; the chant is where they feel that.</li>
<li>Trainees who mark every word. One stress per thought group; contrastive stress moves it.</li>
<li>Australia and America in the sort. Some accents give them a syllable less; the main stress stays put. Accept both.</li>
</ul>
<h4>If you want another lead-in</h4>
<p>A published jazz chant built on echo questions ("Spectacles?" "Spectacles.") works well before the rhythm task. It is not reproduced on the page; bring your own copy.</p>'''

NOTES['connected-speech'] = '''
<h4>Before</h4>
<p>Nothing to print; everything is on screen. Say every example aloud yourself at natural speed before the trainees try it; a page cannot do that part.</p>
<h4>Running it</h4>
''' + T([
    (7, 'Lead-in', 'Six puzzles, said fast until the sentence appears. Reveal each.'),
    (8, 'Elision', 'Two phrases, the dropped /t/. Then two more from the room (next day, must be).'),
    (10, 'The dictation computer', 'Ten printed sentences, ten replies. Pairs match; the real sentence and the feature appear on a match. Show all answers at the end.'),
    (12, 'The link maze', 'Say the phrase in the cell, name the sound, click the way. The route is below if a group gets stuck.'),
    (8, 'Linking', 'Mark the links in the Holmes text, read it aloud smoothly, then the suggested links.'),
    (8, 'Weak forms', 'Five sentences; click the swallowed words; reveal.'),
    (5, 'All together', 'Five cards; say the examples first, then open each.'),
]) + '''
<h4>The key</h4>
<p>Lead-in: I hear you want to meet our son; He knows four people who wear their old clothes to work; Our jumper isn’t made yet; We’ve seen our glasses; My knees are quite all right; Her sister has got a tortoise. The dictation computer’s ten answers are on the page after each match.</p>
<p>The maze route, from the start cell: Draw a line (/r/) right to We saw a film (/r/) right to Two or three (/w/) up to A queue of people (/w/) up to Hello everybody (/w/) up to Three and a half (/j/) left to Tea or coffee (/j/) left to I agree (/j/) left to Give me a ring (/j/) left to Go ahead (/w/) up to Never again (/r/) right to Score a goal (/r/) right to Finish.</p>
<h4>Watch for</h4>
<ul>
<li>Reading the phonemic script letter by letter. The sound comes first; the script is a record of it.</li>
<li>The maze done by trial and error. Make them say the phrase out loud before every click; that is the activity.</li>
</ul>'''

NOTES['receptive-skills'] = '''
<h4>Before</h4>
<p>A loop input: do not name the stages until the debrief. Read the text on the page yourself; it carries the shape. The timer is on the page. Nothing to print; the answer key is at the end of the page and prints from your view.</p>
<h4>Running it</h4>
''' + T([
    (2, 'Lead-in', 'The reveal card: what is a receptive skill.'),
    (5, 'Pre-teach', 'Match the six terms in pairs. Say nothing about why you are doing this.'),
    (3, 'Predict', 'Pairs: how should a receptive skills lesson be taught. Two ideas on the board.'),
    (12, 'Read', 'Start the one-minute timer, silent gist read. Check the predictions.'),
    (10, 'Detail', 'Twelve true-or-false, individually, pairs, reveal. Numbers 1 and 3 are the ones they argue.'),
    (10, 'Debrief', 'Order the seven stages. Then ask them what you did between stages (peer check before whole-class feedback, every time).'),
    (3, 'Task types', 'The bank by stage, as reference. Reading and listening: what changes.'),
]) + '''
<h4>The key</h4>
<p>At the foot of the page (Answer key): the six terms, the twelve true-or-false with a line of reasoning each, and the stage order.</p>
<h4>Watch for</h4>
<ul>
<li>The gist read taken slowly. The timer is the point; stop them at one minute.</li>
<li>"Pre-teach vocabulary" heard as "teach all the hard words". Only the words the tasks depend on.</li>
</ul>'''

NOTES['writing-the-lesson-plan'] = '''
<h4>Before</h4>
<p>Their own lesson plan template and language analysis sheet open beside the page; every judgement on the page is about those two documents. Nothing to print.</p>
<h4>Running it</h4>
''' + T(mins=False, rows=[
    (12, 'Aims', 'The four criteria on screen. Each aim: Ready to teach from, or Needs work; the feedback says why. Do the first two together, the rest in pairs.'),
    (12, 'Procedure', 'Same again. The one to stop on: a procedure a colleague could not teach from.'),
    (6, 'Interaction patterns', 'Match each description to the pattern. Ind, PW, GW, T-S, S-S, OC, OCFB.'),
    (10, 'Anticipated problems', 'Lesson plan or language analysis sheet. The rule is on the page: management, tasks, materials, technology and timing on the plan; meaning, form and pronunciation on the sheet.'),
    (12, 'Fix this plan', 'Pairs find the six problems and rewrite each line. Take one fix per pair before the reveal.'),
    (15, 'Your turn', 'Pairs plan the lead-in and the gist task from the made-up page, then swap with another pair and check against the four decisions.'),
    (5, 'Recap', 'Read the four boxes aloud; they are the checklist for their next plan.'),
]) + '''
<h4>The key</h4>
<p>Every item carries its own feedback on the page. Start again resets a part.</p>
<h4>Watch for</h4>
<ul>
<li>Aims that start with the right words and say nothing. "By the end of the lesson students will be better able to…" followed by nothing specific is the one they all write.</li>
<li>Procedures in the future tense ("students will discuss"). Imperatives, bullet points, timed.</li>
</ul>'''

NOTES['life-after-celta'] = '''
<h4>Before</h4>
<p>The links were checked when the page was written; open two or three before the session to make sure they still are. Part 4 names the kinds of employer and leaves the names to you: say them in the room. As a worked example, Istanbul's are: language schools (International House, Britishside, American Kültür, British Culture, Dilko, English Time); private universities (Bilgi, Koç, Sabancı, Yeditepe, Kadir Has, Özyeğin, İstek, Bahçeşehir; Koç and Sabancı normally want an MA); state universities (İTÜ, YTÜ, Boğaziçi, İstanbul, Marmara); private schools (MEF, Hisar, Şişli Terakki, ACI, Bilfen, Doğa Koleji, Işık). Add the teacher groups and the blacklist group for your own city. Their CELTA report is their reference: say so early.</p>
<h4>Running it</h4>
''' + T(mins=False, rows=[
    (5, 'Where next', 'Three minutes in pairs on the four questions. The tip on the page is the frame for the whole session: CELTA gets you in, the next two years make you good.'),
    (8, 'CV and letter', 'Read the ten-second list aloud. Ask them to write the levels, books and hours they taught before they leave the room.'),
    (10, 'Where the jobs are', 'The boards by region. Two minutes on one board each, then report what it asks for.'),
    (8, 'Where you are', 'The table of employer types, with your city\u2019s names said aloud. Be honest about universities.'),
    (12, 'The interview', 'The ten questions: pairs interview each other, two minutes each way. Then the awkward ones.'),
    (5, 'Paperwork', 'Residence, work permit, insurance. Plain and short.'),
    (12, 'Carrying on', 'On your own, with others, with a certificate. The Delta table; the realistic first year.'),
    (10, 'Your plan', 'Four boxes, one or two things each. Print or download; it saves on the device.'),
]) + '''
<h4>The key</h4>
<p>None. The interview answers on the page are suggestions, not a key.</p>
<h4>Watch for</h4>
<ul>
<li>Despair at the university table. The note on the page is the answer: a year of classroom teaching changes what you can apply for.</li>
<li>The plan written as a wish list. One thing per box that they could do next week.</li>
</ul>'''

NOTES['drama-in-the-elt-classroom'] = '''
<h4>Before</h4>
<p>Space: chairs to the walls. The Activity Evaluation Sheet open on a device per trainee; they fill it in after each set. Music for From Seed to Plant if you have it. Say at the start that nobody has to do anything they do not want to; the See-saw and Blind need trust, so watch them.</p>
<h4>Running it</h4>
''' + T(mins=False, rows=[
    (6, 'Drama in ELT', 'Reveal the quotations; read three aloud. Ask which they believe.'),
    (16, 'Warm-ups', 'Shake hands as if (five or six of the eleven), Mirroring, the See-saw with you as a spotter, Eels in the grotto if the room allows, Blind in pairs.'),
    (18, 'Getting started', 'Miming a monster on two volunteers, then pairs. Listen and mime with Rod the frog: teach the actions, tell the story, they join in. The Hokey Pokey to finish, everybody.'),
    (8, 'Cooling down', 'Feeling my space, From seed to plant, Don’t break it. Quiet voice.'),
    (10, 'The birthday party', 'Out of the room, in one by one as guests; then Interplanetary greetings.'),
    (2, 'Close', 'The evaluation sheet: which three would you use with your TP class, and at what level?'),
]) + '''
<h4>The key</h4>
<p>None. The sources are on the page: Maley and Duff for the quotations, Phillips for the two children’s activities, Read and Soberón for Rod the frog.</p>
<h4>Watch for</h4>
<ul>
<li>The See-saw with the wrong partner. Same height, and you spot the first few falls.</li>
<li>Laughter turning to self-consciousness. Keep the pace up; the cool-down is where it settles.</li>
</ul>'''

NOTES['teaching-productive-skills'] = '''
<h4>Before</h4>
<p>Sound for the SpongeBob clip (it stops at 1:50, after he has written his first word). A loop input: do not name the five stages until the debrief. Nothing to print.</p>
<h4>Running it</h4>
''' + T([
    (2, 'Lead-in', 'The reveal, the clip, the question. One minute of talk, no more.'),
    (3, 'Preparing', 'Both prompts, a minute alone, then a partner. Point out afterwards that nobody was given any language first.'),
    (8, 'Useful language', 'Eight terms, click to reveal; the tag says which skill. The counter at the top tells you where they are.'),
    (7, 'The task types', 'Ten cards in two lanes. Pairs pick one for the opinion and one for the piece of writing from Stage 2, and say why.'),
    (8, 'Read and check', 'Silent read, then: were your ideas right? Where does writing go its own way? (The last paragraph.)'),
    (8, 'Detail, and the feedback split', 'Five questions, then six scenarios: task achievement or language feedback.'),
    (7, 'Debrief', 'Order the five stages. Then the table: four rows the same, one different.'),
    (2, 'Wrap-up', 'One sentence each: the difference between speaking and writing in one word. (Redraft.)'),
]) + '''
<h4>The key</h4>
<p>On the page: the five detail answers, the six scenarios (task achievement; language; task achievement; task achievement; language; language, and positive), the stage order (lead-in, preparing, useful language, task, feedback).</p>
<h4>Watch for</h4>
<ul>
<li>Useful language taught as a presentation. Optional, a handful of phrases, often carried by the model text.</li>
<li>Feedback that starts with errors. Task achievement first, every time.</li>
</ul>'''

assert len(NOTES) == 21, len(NOTES)

NOTES['guided-discovery-vs-ppp'] = '''
<h4>Before</h4>
<p>Sound for two films: the holiday clip (lead-in) and the filmed grammar lesson (five minutes, a file on the page, no ad). Do not say "guided discovery" or "PPP" until section 4; the nav says Lesson one and Lesson two for that reason, and the film's own title card is cut off the file. Nothing to print unless you want the handout for section 5.</p>
<h4>Running it</h4>
''' + T([
    (5, 'Lead-in', 'The holiday film, then pairs: what went wrong, what has happened to you. Keep it light; it only sets up travel.'),
    (3, 'Gist', 'One minute against your watch. "Unlucky or lucky?" in one sentence. Take two answers; do not teach anything yet.'),
    (10, 'Look at the sentences', 'Pairs, the ten questions, then Check. They have just done a guided discovery as learners. Say nothing about that.'),
    (6, 'Function and form', 'The rule, then the table. Check both. Still no name for what they did.'),
    (12, 'Lesson two', 'Before you play it: how many stages, where does each start, what happens in each. Three boxes to start, Add a stage for more. Play it once through. Pairs compare their stages. Take a count of hands: two stages, three, four.'),
    (8, 'Which was which', 'The five questions in pairs, then open. Question 5 is the one to hold: why must guided discovery sit inside a text? Then Show which was which.'),
    (10, 'The stages', 'Individually, then pairs, then Check. The spare word is "explain". Close on one line from each: which shape will you try in your next TP, and why.'),
]) + '''
<h4>The key</h4>
<p>On the page: the ten discovery answers, the rule (two, the same time, past continuous, past simple), the form table, and the two gap texts (guided discovery: context, unfamiliar, normal, marker, Avoid, controlled and freer, mirror; PPP: elicits, target vocabulary, gave, board, teacher talk, practice, further, 90%). The stage notes on the film have no key on the page; this is the lesson, for the room.</p>
<p><b>The filmed lesson</b> (present simple, third person, an ordinary day). <b>0:00 to about 1:00, the situation.</b> A magazine picture: this is Kamal; where does he work? A stall, not a supermarket. "I'm going to tell you about an ordinary day for Kamal. Every day." <b>1:00 to 3:10, presentation and drilling, one sentence at a time.</b> A clock drawn on the board; "He get up in five o'clock" from a student; the teacher takes the idea, asks for a better sentence, models "He gets up at five o'clock", choral and individual repetition, corrects "gates" and "five o'clock", then "Tell Daniel", "Tell Bruna". A cup drawn: "he takes a coffee" becomes "He drinks a cup of coffee", told to Francesca. A bicycle drawn: "How does he go to work?" "Your bike" becomes "He cycles to work", with "cycle" taken as the right verb in the wrong form, and "to walk" corrected to "to work". <b>About 3:10 to the end, the first move towards production.</b> "Go back to the beginning. Can you remember the first sentence about Kamal?" Kamal is written on the board; the class rebuilds the four sentences in order and tells the person next to them. So: a situation built from one picture and three drawings, each sentence elicited, corrected, modelled and drilled, then the whole set retold in pairs. The clip ends before anything freer; let them notice that production never fully arrives.</p>
<h4>Watch for</h4>
<ul>
<li>Trainees who name the approaches early. Let it pass; the point is the comparison, not the guessing.</li>
<li>The film: trainees who count every activity as a stage. Push them to the three big moves and what changes at each.</li>
<li>"Presentation" heard as a lecture. The teacher on film elicits from a picture and drawings; point at that.</li>
</ul>'''

# Course introduction (26 Oct 2026): its page is built by hand, so its notes were in the page;
# they live here now with the rest, so the store can serve them to tutors only.
NOTES['course-introduction'] = '''
<h4>What this session is for</h4>
<p>Day one, first thing. They meet each other, and they find out how the course runs on Lite by looking for the answers on their own laptops. Nothing here is a lecture; if you catch yourself explaining, turn it into a question and let a team find it.</p>
<h4>Before the session</h4>
<p>Put this session on the timetable as an Input tile titled <b>Course introduction</b> (or anything with “introduction” or “Connect Lite” in it): that is what opens it for the trainees on the day. Make sure the timetable is published, the TP points are released to each group, and the assignment deadlines are set, because Round 1 reads all three from the course. The bingo prompts are yours to change in Course admin, under Before the course: one a line, and Lite deals nine to each person. The twenty Lite ships with are generic on purpose; if you add ones about the people in the room, add only what they would be happy to have found out.</p>
<h4>Running it</h4>
<table class="tn-time"><tr><th>Min</th><th>Stage</th><th>What you do</th></tr>
<tr><td>12</td><td>Bingo</td><td>Laptops open, everyone up. Call time at ten minutes whatever the cards say. Then six or seven introductions to the room, not all of them. Teams of three form from each person’s first three names; sort out the leftovers yourself.</td></tr>
<tr><td>15</td><td>Round 1</td><td>Six questions, all answerable from their own home, timetable and TP points. Teams work on one laptop. Reveal is read from the course, so it is right for this course and only this course. Expect the lesson plan and language analysis TP numbers to surprise them.</td></tr>
<tr><td>13</td><td>Round 2</td><td>Ten questions on the rules. Each answer quotes the Handbook by section and page, or names where Lite does it. The failed-assignment pair (one, then two) is the one they get wrong; let the room argue before anyone clicks.</td></tr>
<tr><td>15</td><td>Round 3</td><td>Eight parts of the CELTA 5, who fills each in. After each click the team opens that part on one person’s own CELTA 5 page. Stage 2 is the one to dwell on: they rate themselves on every criterion before the tutorial.</td></tr>
<tr><td>10</td><td>The hunt</td><td>Six screens. The first team with one open calls it. The notebook and Take it back are the two most people have not seen.</td></tr>
<tr><td>5</td><td>Scores</td><td>Type the points on your own screen (the board saves nothing). Then one written question each; answer them now, or on the noticeboard by the end of the day.</td></tr></table>
<h4>What Lite says that Cambridge does not</h4>
<p>Three answers in Round 2 are Lite’s rules, not Cambridge’s, and the answer says so: a plan or material sent to you can be taken back until the day’s first TP starts (after that you give it back from the feedback page); nobody reads the pre-course task, they check it against the key; and there are no tutor references, the CELTA report is the reference.</p>
<h4>If a course has no timetable yet</h4>
<p>Round 1 then says so and gives the general answer for each question. Everything else works without a course, so the session can be run in the library too.</p>
'''
