# Made-up names and examples for the library (Ramy, 15 Oct 2026: "go over all the
# input sessions and change the names and examples with something made up,
# without changing the meaning or the essence of the input. Better to protect
# ourselves.").
#
# ALIAS[slug] is a list of (old, new) literal strings, applied to a built page
# in order. Every `old` must be present, so a recipe change that moves a string
# fails loudly instead of leaving the old example on the page. Specific
# sentences come first and the bare names last, so a name is never replaced
# before the sentence that carries it. Keys that the page checks against
# (answer arrays, sort lists) sit inside the page text, so the same replacement
# changes the task and its key together.
ALIAS = {}

ALIAS['teaching-writing'] = [
    # the model thank-you letter: a different present, still only implied
    ("Dear Priya,", "Dear Noor,"),
    ("Thank you for your fabulous present. When I got it, I couldn't stop laughing. Although I don't smoke, I always have your marvellous gift on the living room table so everyone can use it. It's a lovely present and reminds me of you.",
     "Thank you for your splendid present. When I unwrapped it, I couldn't stop smiling. Although I've never had a garden, I hung your lovely gift outside my kitchen window, and now the sparrows visit me every morning. It's a thoughtful present and it reminds me of you."),
    ("Sofia.", "Theo."),
    # the wall dictation text, its questions and its key
    ("They work for Efes, the beer factory.", "They work for Sunbright, the biscuit factory."),
    ("like television and volleyball.", "like television and handball."),
    ("Do they like football? The text says volleyball, not football; check students catch this.", "Do they like basketball? The text says handball, not basketball; check students catch this."),
    ("<li>like football?</li>", "<li>like basketball?</li>"),
    ("<li>drink beer?</li>", "<li>eat biscuits?</li>"),
    ("Do they drink beer? No, they don't. They don't like it.", "Do they eat biscuits? No, they don't. They don't like them."),
    ("They don't drink beer.", "They don't eat biscuits."),
    ("but they live in Istanbul.", "but they live in Prague."),
    ("They live in Istanbul.", "They live in Prague."),
    ("Ankara", "Brno"),
    ("the volleyball catch", "the handball catch"),
    # the parallel writing task and its model
    ("<li>work / Cadbury's / chocolate factory</li>", "<li>work / Marlowe's / toy factory</li>"),
    ("<li>Joe and Barbara / like / music / tennis</li>", "<li>Joe and Barbara / like / cinema / cycling</li>"),
    ("<li>not eat chocolate</li>", "<li>not buy toys</li>"),
    ("They work for Cadbury's, the chocolate factory. Joe and Barbara like music and tennis. They don't eat chocolate.", "They work for Marlowe's, the toy factory. Joe and Barbara like cinema and cycling. They don't buy toys."),
    ("They don't like it!", "They don't like them!"),
    ("London", "Leeds"),
    ("Birmingham", "Bristol"),
    # the cartoon strip the tutor brings
    ("SpongeBob cartoon strip", "cartoon strip of someone stuck in front of a blank page"),
    ("your copy of the SpongeBob strip", "your copy of the cartoon strip"),
    ("Your tutor hands out a short cartoon strip of someone stuck in front of a blank page. Put the panels in order, then talk about his attitude", "Your tutor hands out a short cartoon strip of someone stuck in front of a blank page. Put the panels in order, then talk about the character's attitude"),
    # the sources line
    ("The Ali and Fatma text, the Joe and Barbara parallel-writing task and the product-process contrast are from the tutor's CELTA input materials; the thank-you letter activity is the tutor's own.",
     "The names, texts and examples on this page are made up for this session. Running dictation, parallel writing and the product and process approaches are standard techniques in language teaching."),
    # names last
    ("Ali and Fatma", "Tomas and Lena"),
    ("Ali &amp; Fatma", "Tomas &amp; Lena"),
    ("Joe and Barbara", "Dan and Ruth"),
]

ALIAS['eliciting-and-ccqs'] = [
    ('<b>She managed to close the door.</b>', '<b>He managed to open the jar.</b>'),
    ('She found it difficult to close the door, but she did close it.', 'He found it difficult to open the jar, but he did open it.'),
    ('She closed the door. It wasn&#8217;t easy.', 'He opened the jar. It wasn&#8217;t easy.'),
    ('Did she close the door? <b>(Yes)</b>', 'Did he open the jar? <b>(Yes)</b>'),
    ("re:  \\{ccqs:\\['When did she start living there[^\\n]*", "  {ccqs:['When did he start working there? (Two years ago)','Does he still work there? (Yes)'], answer:'He’s been working there for two years. (or: He’s worked there for two years.)'},"),
    ("re:  \\{ccqs:\\['Did he clean his suit himself[^\\n]*", "  {ccqs:['Did she wash her car herself? (No)','Did someone else wash it? (Yes)','Did she ask them to wash it? (Yes)'], answer:'She had her car washed. (or: She got her car washed.)'},"),
    ("re:  \\{ccqs:\\['Was it necessary for them to rush[^\\n]*", "  {ccqs:['Was it necessary for us to cook so much food? (No)','But did we cook it all? (Yes)'], answer:'We needn’t have cooked so much food. (Compare: We didn’t need to cook so much — which doesn’t tell us whether we did.)'}"),
    ("re:  \\{sentence:'He’s known Mary[^\\n]*", "  {sentence:'She’s known Tomás since school.', ccqs:['Did she know Leila?','Does she love Tomás?','Did she and Tomás study maths?'], answer:'None of them checks the meaning. They ask about things the sentence doesn’t say (Leila, love, maths). Check the concept instead: Does she know Tomás now? (Yes) When did she meet him? (At school) Is that a long time ago? (Yes)'},"),
    ("re:  \\{sentence:'If she hadn’t overslept[^\\n]*", "  {sentence:'If he hadn’t lost his keys, he would have caught the train.', ccqs:['What would have happened if he hadn’t lost his keys?'], answer:'It uses the target structure itself, so a student can answer without understanding it, and it is harder than the sentence. Use simple facts: Did he lose his keys? (Yes) Did he catch the train? (No) Why not? (Because he lost his keys)'},"),
    ("re:  \\{sentence:'He’s always falling asleep[^\\n]*", "  {sentence:'She’s always losing her phone!', ccqs:['Setting aside the possibility that the subject has some disorder of memory, does the speaker, in your estimation, imply that her tendency to mislay the device repeatedly, or perhaps even continually, borders on being a source of exasperation?'], answer:'The language is far harder than the sentence it checks. CCQs must be simpler than the target language. Try: Does she lose her phone often? (Yes) Does the speaker like this? (No — it’s annoying)'}"),
    ("re:  \\{name:'Concept checking questions'[^\\n]*", "  {name:'Concept checking questions', how:'Short, simple questions about the meaning.', ex:'She hesitated before answering. Did she answer? (Yes) Did she answer immediately? (No) At first, did she want to? (No)'},"),
    ("re:  \\{name:'Timelines'[^\\n]*", '  {name:\'Timelines\', how:\'A line with past, now and future. Useful mainly for tenses.\', ex:\'He moved to Lima two years ago: an X on the line two years before "now".\'},'),
    ("re:  \\{name:'Discriminating between two structures'[^\\n]*", "  {name:'Discriminating between two structures', how:'Students work out the difference between a pair of sentences. Especially useful at higher levels.', ex:'The film started when we arrived. / The film had started when we arrived.'},"),
    ("re:  \\{name:'Negative checking'[^\\n]*", '  {name:\'Negative checking\', how:\'Show when the language can’t be used.\', ex:\'"I’ve just broken your laptop." "Never mind!" ?! · Is this OK? I used to walk to school this morning.\'},'),
    ("re:  \\{name:'Extension or completion'[^\\n]*", "  {name:'Extension or completion', how:'Students carry the sentence on, or complete a dialogue.', ex:'T: She used to play the violin, but… S: …she doesn’t any more.'},"),
    ("re:  \\{structure:'1\\. She used to smoke[^\\n]*", "  {structure:'1. He used to bite his nails.', meaning:'He bit his nails. It was a habit. He doesn\\u2019t bite them now.', ccq:'Did he bite his nails? (Yes) / Did he bite them only once? (No) / Does he bite them now? (No)', done:true},"),
    ("re:  \\{structure:'2\\. He felt embarrassed[^\\n]*", "  {structure:'2. She felt embarrassed when she forgot the student\\u2019s name.', meaning:'She did not remember the name. Other people saw this. She felt uncomfortable and a little silly. It is not a good feeling, but she didn\\u2019t do anything wrong (that would be ashamed).', ccq:'Did she remember the name? (No) / Were other people there? (Yes) / Did she feel comfortable? (No) / Is it a good feeling? (No) / Did she do something wrong? (No)'},"),
    ("re:  \\{structure:'3\\. I wish I was at home[^\\n]*", "  {structure:'3. I wish I was on a beach.', meaning:'I am not on a beach now. I want to be on a beach now. I don\\u2019t want to be here.', ccq:'Am I on a beach? (No) / Do I want to be on a beach? (Yes) / Do I want to be here? (No)'},"),
    ("re:  \\{structure:'4\\. She\\\\u2019s looking forward[^\\n]*", "  {structure:'4. He\\u2019s looking forward to the school trip.', meaning:'The trip hasn\\u2019t happened yet. He thinks about it and feels happy. He wants it to come.', ccq:'Has the trip happened yet? (No) / Does he feel happy when he thinks about it? (Yes) / Does he want it to come? (Yes)'},"),
    ("re:  \\{structure:'5\\. She\\\\u2019s been to Timbuktu[^\\n]*", "  {structure:'5. She\\u2019s been to Reykjavik.', meaning:'She went there sometime in the past. We don\\u2019t know exactly when. She is not there now.', ccq:'Did she go there in the past? (Yes) / Do we know exactly when? (No) / Is she there now? (No)'},"),
    ("re:  \\{structure:'6\\. He couldn\\\\u2019t stand[^\\n]*", "  {structure:'6. She couldn\\u2019t stand his snoring.', meaning:'He snored a lot. She didn\\u2019t like it at all \\u2014 she hated it. This was in the past.', ccq:'Did he snore a lot? (Yes) / Did she like it? (No) / A little or a lot? (A lot \\u2014 she hated it) / Is this about standing on her legs? (No) / Are we talking about now or the past? (The past)'},"),
    ("re:  \\{structure:'7\\. When we arrived in Bangkok[^\\n]*", "  {structure:'7. When we arrived in Oslo, it had been snowing.', meaning:'It snowed for some time before we arrived. It had probably just stopped when we got there. We could see the evidence: the pavements were white.', ccq:'Did it snow before we arrived? (Yes) / For a short time or a while? (A while) / Was it still snowing when we arrived? (Probably not) / How do we know it snowed? (The pavements were white)'}"),
]

ALIAS['error-correction'] = [
    # the sources line first, while it still quotes the old examples
    ("The attitude statements, the error examples (\"Give me one butterbread!\", \"I'm going to heat you\") and the practice tables follow Mark Bartram and Richard Walton, <i>Correction: Mistake Management</i> (Language Teaching Publications, 1991). The decision flow and the correction ideas draw on Jim Scrivener, <i>Learning Teaching</i> (Macmillan), chapter on feedback and correction.",
     "The attitude statements, the errors and the practice tables are made up for this session. The ideas of a decision flow and of correction techniques are standard in teacher training; see Mark Bartram and Richard Walton, <i>Correction: Mistake Management</i> (Language Teaching Publications, 1991), and Jim Scrivener, <i>Learning Teaching</i> (Macmillan)."),
    # the nine attitude statements, same meanings in new words
    ('"Making errors and mistakes is good."', '"Getting things wrong is a good thing."'),
    ('"Making errors and mistakes is bad."', '"Getting things wrong is a bad thing."'),
    ('"People think making errors and mistakes is bad."', '"Most people think getting things wrong is a bad thing."'),
    ('"It\'s normal to make mistakes when we are learning something."', '"It is normal to slip up while you are learning something new."'),
    ('"People don\'t like making mistakes."', '"Nobody enjoys slipping up."'),
    ('"You always learn from your mistakes."', '"You always learn something from a slip."'),
    ('"Making a mistake means you haven\'t learnt something, or you\'ve learnt it \'wrongly\'."', '"A slip means you haven\'t learnt something yet, or you\'ve learnt it \'the wrong way\'."'),
    ('"You\'ll never learn if you are not corrected."', '"You will not improve unless somebody corrects you."'),
    ('"Mistakes people make let us know what they don\'t know."', '"The slips people make show us what they don\'t know yet."'),
    ('"You’ll never learn if you are not corrected" and "Making a mistake means you’ve learnt it wrongly"', '"You will not improve unless somebody corrects you" and "A slip means you’ve learnt it the wrong way"'),
    # the decision flow and the correction sequence, same order in new words
    ('"Decide on the type of error."', '"Work out what kind of error it is."'),
    ('"Will you deal with it or not?"', '"Decide whether to deal with it at all."'),
    ('"When will you deal with it?"', '"Decide when to deal with it."'),
    ('"Who will deal with it?"', '"Decide who will deal with it."'),
    ('"Decide on the technique to use."', '"Choose the technique to use."'),
    ('"Indicate to the student that an error has been made."', '"Signal to the student that something went wrong."'),
    ('"Give the student a chance to identify the error."', '"Let the student try to spot the error."'),
    ('"Teacher identifies the error for the student."', '"Point out the error yourself."'),
    ('"Give the student time to self-correct."', '"Allow time for the student to put it right."'),
    ('"Teacher models the correct version."', '"Say the correct version yourself."'),
    ('"Student repeats the correct version."', '"Have the student say it back."'),
    ('"Drill for pronunciation and correct use."', '"Drill it for sound and for use."'),
    ('"Give a mini practice."', '"Set a short practice."'),
    # the eight errors to match (same eight types)
    ('"He like this school."', '"My brother live near here."'),
    ('"Where you did go yesterday?"', '"What you did eat for lunch?"'),
    ('"The secretary is in the office. (secrEtary)"', '"The photographer is outside. (PHOtographer)"'),
    ('"Give me one butterbread!"', '"Give me one eat-box!"'),
    ('"I eat schocolate every day."', '"I walk to school every thay."'),
    ('"After three years they made a divorce."', '"She did a big mistake at work."'),
    ('"I am here since Tuesday."', '"He is working here since March."'),
    ('"I\'m going to heat you."', '"It\'s late; I\'m going to bad."'),
    # the correction ideas
    ('They went…?', 'We drove…?'),
    ('Did you go yesterday?', 'Did you drive last week?'),
    ("You cooked kitchen in the chicken? I've never eaten kitchen before!", "You took a bath in the cooker? That sounds hot!"),
    # practice table, part 1
    ("'They can to swim very well.'", "'We must to leave early today.'"),
    ("'She yesterday went to the cinema.'", "'He yesterday visited the museum.'"),
    ('"He\'s reading book."', '"She\'s wearing hat."'),
    ("'How much photographs did you take?'", "'How much bottles did you buy?'"),
    ("'She come to school late every day.'", "'He walk to work slowly every day.'"),
    ("'I wait two hours for the bus yesterday.'", "'I stay three days in the hotel last week.'"),
    ("I was wondering if I could possibly borrow your pen.", "I would be most grateful if you could lend me your umbrella."),
    # practice table, part 2
    ("'He had to get married to his girlfriend because she was embarrassed.'", "'I stayed at home because I was constipated.'"),
    ("\"Why are we doing this? I'm boring.\"", "\"This lecture never ends. I'm boring.\""),
    ("'People used to go to Australia by sheep.'", "'I always feel the tank on Fridays.'"),
    ("'I have a benfriend in England.'", "'I like to bek cakes on Sundays.'"),
    ("\"In your lessons I'm very enjoy.\"", "\"At the party she was very enjoy.\""),
    ("\"He's washing the TV.\"", "\"Please bring a share.\""),
    # the key (trainer notes): the corrected sentences and the techniques that named them
    ("<td>They can swim very well.</td>", "<td>We must leave early today.</td>"),
    ("<td>She went to the cinema yesterday.</td>", "<td>He visited the museum yesterday.</td>"),
    ("<td>He’s reading a book.</td>", "<td>She’s wearing a hat.</td>"),
    ("<td>How many photographs did you take?</td>", "<td>How many bottles did you buy?</td>"),
    ("<td>She comes to school late every day.</td>", "<td>He walks to work slowly every day.</td>"),
    ("<td>I waited two hours for the bus yesterday.</td>", "<td>I stayed three days in the hotel last week.</td>"),
    ('Timeline, or "Yesterday?" with a hand behind the shoulder', 'Timeline, or "Last week?" with a hand behind the shoulder'),
    ("<td>Can I borrow your pen?</td>", "<td>Can I borrow your umbrella?</td>"),
    ("<td>…because she was pregnant.</td><td>Vocabulary: false friend (embarazada)</td>", "<td>…because I had a cold.</td><td>Vocabulary: false friend (constipado)</td>"),
    ("<td>…by ship.</td><td>Pronunciation: /iː/ and /ɪ/</td><td>Phonemic chart, or draw the sheep</td>", "<td>…fill the tank on Fridays.</td><td>Pronunciation: /iː/ and /ɪ/</td><td>Phonemic chart, or draw a full tank</td>"),
    ("<td>…a boyfriend in England.</td>", "<td>…to bake cakes on Sundays.</td>"),
    ("<td>I really enjoy your lessons.</td>", "<td>At the party she enjoyed herself a lot.</td>"),
    ("<td>He’s watching TV.</td><td>Pronunciation: /tʃ/ and /ʃ/</td><td>Minimal pair on the board: wash, watch</td>", "<td>Please bring a chair.</td><td>Pronunciation: /tʃ/ and /ʃ/</td><td>Minimal pair on the board: share, chair</td>"),
]

ALIAS['classroom-management'] = [
    # the sources line first, while it still names the old material
    ("\"Spot the problem\" (the fourteen moments) and the yes-no-maybe statements follow Jim Scrivener, <i>Learning Teaching</i> (Macmillan), the chapter on classroom management. The rest of the session is the tutor's own.",
     "The moments in \"Spot the problem\" and the statements in yes, no or maybe are made up for this session. The ideas behind them draw on Jim Scrivener, <i>Learning Teaching</i> (Macmillan), the chapter on classroom management."),
    # the rescue prompt (straight apostrophes) before the shorter moment it echoes
    ("“Well, what I'm gonna do is I'm gonna ask you to get into pairs, but before that there are some things we've gotta work out. So just jot down if you've got a pen, could you write this, then when we've finished that we're going to do the next thing which involves…”",
     "“Right, so what we're gonna do is, er, I'm gonna put you into groups, but before that there are a few things we've gotta sort out. So just jot down, if you've got a pencil, could you write this, then when we've finished that we're going to move on to the next bit, which involves…”"),
    # spot the problem: fourteen made-up moments, each keeps its label
    ("['T','I try to be nice, but my classes always seem so dull.']", "['T','I keep it friendly, but my classes always feel flat.']"),
    ("['S','I think that smoking is…'],['T','…a bad thing. Yes, I agree. When I went into the pub…']", "['S','I think that mobile phones are…'],['T','…a distraction. Yes, I agree. When I was on the train yesterday…']"),
    ("['T','So, if you don’t mind, it would be very nice if you could just stop the activity if you feel that’s OK.']", "['T','Excuse me, if it isn’t too much trouble, perhaps you could possibly think about finishing the task, if everybody is ready.']"),
    ("['T','Well, what I’m gonna do is I’m gonna ask you to get into pairs, but before that there are some things we’ve gotta work out…']", "['T','Right, so what I’m gonna do now is, er, I’m gonna get you into groups, but first there are a few things we’ve gotta sort out…']"),
    ("['T','My instructions were clear, but all the students did different things, and none of them did what I asked.']", "['T','I explained it carefully, but every group did something different, and nobody did what I asked.']"),
    ("['S','I went to the cinema.'],['T','You went to the cinema. Good. You went to the cinema.']", "['S','I went to the market.'],['T','You went to the market. Good. You went to the market.']"),
    ("['T','Yes, now you can ask her your question. Mmm, that’s a good question. What do you think? What’s your answer going to be, Silvia? Yes, go on, tell her…']", "['T','Yes, now you can ask him your question. Mmm, that’s a good question. What do you think? What’s your answer going to be, Marta? Yes, go on, tell him…']"),
    ("['T','When nothing else is happening I open my mouth. I’ve no idea what I say most of the time, but it stops those horrible silences.']", "['T','Whenever a gap opens up I start talking. I couldn’t tell you what I say most of the time, but at least it fills the quiet.']"),
    ("['T','I wonder why they look so bored?']", "['T','I wonder why they seem so switched off?']"),
    ("['S','I am feeling bad. My grandfather he die last week and I am…'],['T','No, not die. Say died, because it’s in the past.']", "['S','I am feeling bad. My dog he run away last week and I am…'],['T','No, not run. Say ran, because it’s in the past.']"),
    ("['T','So now what I’m gonna do is I’m gonna move my chair over here and sit down and get comfortable, and now I’m gonna tear up these pieces of paper…']", "['T','So now what I’m gonna do is I’m gonna walk over here and put my bag down and find my markers, and now I’m gonna cut up these cards…']"),
    ("['S1','Only on Tuesdays, unless it’s raining.']", "['S1','Only at weekends, unless it’s a holiday.']"),
    # yes, no or maybe: twelve statements in new words, same answers
    ("It’s a good idea to point at students when you want them to speak.", "It works well to point at a student when you want them to speak."),
    ("You should keep eye contact with the students at every stage of the lesson.", "You should look at the students all the time, in every stage."),
    ("You should plan your whiteboard in advance.", "It pays to plan your board layout before the lesson."),
    ("If you’re talking to one student, you should walk up to them.", "To talk to one student, you should walk right up to them."),
    ("Capital letters on the board are a good idea because they’re easier to read.", "Writing in capitals on the board is a good idea because it is easier to read."),
    ("Students understand you better if you speak slowly and use “baby language”.", "Students understand you better if you slow right down and use very simple, childlike language."),
    ("If a student doesn’t hear what another student said, you should repeat it for them.", "When a student can’t hear what a classmate said, you should repeat it for them."),
    ("You should be extra polite when asking students to move chairs or change groups.", "You should be very polite and cautious when you ask students to move seats or switch groups."),
    ("“Ahmet, sit here, please.”", "“Kofi, sit here, please.”"),
    ("The teacher should keep their voice at the same level at every stage.", "A teacher’s voice should stay at one level throughout the lesson."),
    ("Students should be allowed to use their dictionaries whenever they want.", "Learners should be free to open their dictionaries at any moment."),
    ("The best way to check instructions is to ask “Do you understand?”", "The best way to check that instructions are clear is to ask “Is everything clear?”"),
    ("If a student doesn’t want to do an exercise, you should just say “OK then.”", "If a student refuses to do an exercise, you should simply say “Fine, skip it.”"),
]

ALIAS['connected-speech'] = [
    # the sources line first
    ("The dictation-computer sentences and the Sherlock Holmes linking text are classic CELTA input material (the computer puzzle follows Mark Hancock, <i>Pronunciation Games</i>, Cambridge University Press, 1995); the link maze and the elision trivia are the tutor's own.",
     "The lead-in puzzles, the dictation computer sentences, the linking text, the link maze and the elision trivia are made up for this session. The idea of a dictation computer that mishears connected speech follows Mark Hancock, <i>Pronunciation Games</i> (Cambridge University Press, 1995)."),
    # the six lead-in puzzles and their key
    (r"re:const decodeItems = \[.*?\n\];",
     """const decodeItems = [
 {puzzle:'Eyed like two by a knew pear of shoes.', answer:"I'd like to buy a new pair of shoes."},
 {puzzle:'Sheez waiting for the whether tea clear.', answer:"She's waiting for the weather to clear."},
 {puzzle:'Hour dog has an eaten his din her.', answer:"Our dog hasn't eaten his dinner."},
 {puzzle:'There shore yule love it.', answer:"They're sure you'll love it."},
 {puzzle:'Mine brothers bean two roam twice.', answer:"My brother's been to Rome twice."},
 {puzzle:'Peat nose the write answer.', answer:"Pete knows the right answer."}
];"""),
    ("Lead-in: I hear you want to meet our son; He knows four people who wear their old clothes to work; Our jumper isn’t made yet; We’ve seen our glasses; My knees are quite all right; Her sister has got a tortoise.",
     "Lead-in: I’d like to buy a new pair of shoes; She’s waiting for the weather to clear; Our dog hasn’t eaten his dinner; They’re sure you’ll love it; My brother’s been to Rome twice; Pete knows the right answer."),
    # the ten dictation computer sentences
    (r"re:const dcItems = \[.*?\n\];",
     """const dcItems = [
 { heard: 'Did you cola taxi?', real: 'Did you call a taxi?', reply: "Yes, it will be here in five minutes.", feature: "call a becomes 'cola': the /l/ joins onto the vowel and the two words run together" },
 { heard: 'We need a nice cream.', real: 'We need an ice cream.', reply: "Chocolate or vanilla?", feature: "an ice becomes 'a nice': the /n/ joins onto the next word and the word boundary moves" },
 { heard: 'Pudit on the shelf.', real: 'Put it on the shelf.', reply: "The top shelf or the bottom one?", feature: "put it becomes 'pudit': the /t/ between vowels turns into a quick /d/-like sound and joins the next word" },
 { heard: 'I had no eye deer of the time.', real: 'I had no idea of the time.', reply: "It is nearly midnight.", feature: "idea of becomes 'idear of': an intrusive /r/ joins the two vowels, so it sounds like 'eye deer of'" },
 { heard: 'A cupper tea would be lovely.', real: 'A cup of tea would be lovely.', reply: "I will put the kettle on.", feature: "cup of becomes 'cupper': 'of' weakens to /ə/ and joins onto 'cup'" },
 { heard: 'We lost the necks game.', real: 'We lost the next game.', reply: "Again? Who were you playing?", feature: "next game becomes 'necks game': the /t/ drops out between two consonants" },
 { heard: 'Whose on the phone?', real: 'Who is on the phone?', reply: "It is your sister.", feature: "who is becomes 'whose': the two words contract and sound like one" },
 { heard: 'Don chew love it?', real: "Don't you love it?", reply: "Not really, to be honest.", feature: "don't you becomes 'don chew': /t/ and /j/ merge into /tʃ/" },
 { heard: 'He tea sa lot of fruit.', real: 'He eats a lot of fruit.', reply: "Good for him. I prefer chocolate.", feature: "eats a becomes 'tea sa': the /s/ moves onto the next word" },
 { heard: 'Salten pepper, please.', real: 'Salt and pepper, please.', reply: "Of course. Anything else?", feature: "salt and becomes 'salten': 'and' weakens to /ən/ and joins onto 'salt'" }
];"""),
    # the linking text
    (r"re:const holmesText = \".*?\";",
     'const holmesText = "But before we could leave, the woman had come outside again. In the lamplight we could see that she had something heavy in her arms. She looked around to see if anybody was following her. Then there was a loud bang as she dropped the box on the stone steps. She was so busy that she didn\'t notice the two of us walking up behind her. Marta stepped in front of her and she stopped suddenly. Omar and I quietly moved closer to help Marta. I had a torch ready and soon it was impossible for the woman to get away.";'),
    ('<span class="badge">Sherlock Holmes</span>', '<span class="badge">A short story</span>'),
    ('Mark the links in the Holmes text', 'Mark the links in the story text'),
]

ALIAS['guided-to-less-guided-practice'] = [
    # the sources line first
    ("The drilling techniques follow Donn Byrne, <i>Teaching Oral English</i> (Longman, 1986). The jazz chant is Carolyn Graham's (<i>Jazz Chants</i>, Oxford University Press).",
     "The examples, the cued dialogue, the chant and the information gap on this page are made up for this session. The drilling techniques are standard in language teaching; see Donn Byrne, <i>Teaching Oral English</i> (Longman, 1986). Jazz chants were popularised by Carolyn Graham (<i>Jazz Chants</i>, Oxford University Press)."),
    # the cued phone call
    ("Ask what B is doing tonight. Invite him/her to go out for a meal.", "Ask what B is doing at the weekend. Invite him/her to a concert."),
    ("You can't tonight. Say what you're going to do.", "You can't on Saturday. Say what you're going to do."),
    ("Suggest tomorrow night.", "Suggest Sunday afternoon."),
    ("You can't. Say why. Suggest some time next week.", "You can't. Say why. Suggest some time next month."),
    ("You can't. You're going away on business. Suggest Saturday evening.", "You can't. You're going abroad for work. Suggest a Friday evening."),
    # the chant (and what is said about it)
    ("A way of drilling sentences to a beat, often set to music, published by Carolyn Graham (Oxford American English), most famously \"Small Talk\" and \"Jazz Chants\". Usually chanted in American English. Easy to create your own: follow the beat.",
     "A way of drilling sentences to a beat, often set to music, popularised by Carolyn Graham. Easy to create your own: follow the beat. This one is made up for this session."),
    ("Hi. How are you? <span class=\"who\" style=\"margin-left:20px;\">B:</span> Fine. How are you?", "Hello. How's it going? <span class=\"who\" style=\"margin-left:20px;\">B:</span> Good. How's it going?"),
    ("I'm fine. How's Bill? <span style=\"margin-left:60px;\">He's fine.</span>", "I'm good. How's Karim? <span style=\"margin-left:60px;\">He's good.</span>"),
    ("How's Mary? <span style=\"margin-left:110px;\">She's fine.</span>", "How's Lucia? <span style=\"margin-left:110px;\">She's good.</span>"),
    ("How are the children? <span style=\"margin-left:40px;\">They're fine.</span>", "How are the twins? <span style=\"margin-left:40px;\">They're good.</span>"),
    ("How's your job? <span style=\"margin-left:82px;\">It's fine.</span>", "How's your trip? <span style=\"margin-left:82px;\">It's good.</span>"),
    ("How's Jack? <span style=\"margin-left:114px;\">He's sick!</span>", "How's Anders? <span style=\"margin-left:114px;\">He's sick!</span>"),
    ("Oh no!!!!!", "Oh dear!!!!!"),
    ("'Hi, how are you? How's John?'", "'Hello, how's it going? How's Karim?'"),
    ("How are you? How's John? How long does it take?", "How's it going? How's Karim? How long does it take?"),
    # the transformation drill
    ("I get up early every day. (Ayşe)", "I get up early every day. (Mei)"),
    ("Ayşe gets up early every day.", "Mei gets up early every day."),
    # the shopping information gap
    ("Peter and Anne: a shopping information gap", "Carlos and Ingrid: a shopping information gap"),
    ("I'm just going to the shops. Do you want anything?", "I'm just going to the market. Do you need anything?"),
    ("No, I don't think so. Oh, hang on. We haven't got any sugar left.", "No, I don't think so. Oh, wait. We've run out of rice."),
    ("It's all right. It's on my list. I'm going to buy some.", "Don't worry. It's on my list. I'm going to get some."),
    ("What about bread?", "What about eggs?"),
    ("OK. I'll go to the baker's and buy a loaf.", "OK. I'll go to the farm stall and buy a dozen."),
    ("<li>coffee</li><li>sugar</li><li>lemons</li><li>biscuits</li><li>water</li><li>gin</li>", "<li>coffee</li><li>rice</li><li>lemons</li><li>biscuits</li><li>water</li><li>cheese</li>"),
    ("<li>milk</li><li>lemons</li><li>water</li><li>oranges</li><li>biscuits</li><li>vodka</li><li>tea</li>", "<li>milk</li><li>lemons</li><li>water</li><li>oranges</li><li>biscuits</li><li>juice</li><li>tea</li>"),
    ("<span class=\"who\">Peter:</span>", "<span class=\"who\">Carlos:</span>"),
    ("<span class=\"who\">Anne:</span>", "<span class=\"who\">Ingrid:</span>"),
    # the more meaningful drills
    ("e.g. guess a classmate's favourite sport, an illness, where someone is emigrating to, or what a classmate did last night.", "e.g. guess a classmate's favourite kind of film, a hidden object, where someone is travelling to next, or what a classmate cooked last night."),
    ("(\"It's a picture of a room. There are some people in it.\")", "(\"It's a photo of a street. There are some cyclists in it.\")"),
    ("\"I've just rented a new flat, but I haven't got much money, so I'm gradually buying furniture.\" Students ask \"Have you bought a bed yet?\" or use question tags.", "\"I've just moved to a new house, but I haven't got much money, so I'm gradually buying things for the kitchen.\" Students ask \"Have you bought a kettle yet?\" or use question tags."),
    ("The Meeting<div class=\"detail\">\"My boss wants a meeting, but if he rings me, I'll say I'm busy. What's your excuse?\"", "The Invitation<div class=\"detail\">\"My neighbour has invited me to a party, but if she phones me, I'll say I'm ill. What's your excuse?\""),
    # the drill type examples: international names, no Turkish ones
    ('I live in Istanbul.', 'I live in Lisbon.'),
    ('Ali, ask Zeynep a question.', 'Mateo, ask Chloe a question.'),
    ('Ali → Zeynep', 'Mateo → Chloe'),
    ('Zeynep: ', 'Chloe: '),
    # the sentence the nine techniques are shown on
    ("to the cinema", "to the market"),
]

ALIAS['alternative-teaching-techniques'] = [
    # the sources line first
    ("The story adapts \"The Alligator River Story\" from Sidney Simon, Leland Howe and Howard Kirschenbaum, <i>Values Clarification</i> (Hart, 1972), and the five-values reading that has travelled with it since. The lesson built on it is the tutor's own.",
     "The story is made up for this session. It is built on the shape of a well-known values-clarification exercise, \"The Alligator River Story\", in Sidney Simon, Leland Howe and Howard Kirschenbaum, <i>Values Clarification</i> (Hart, 1972), and on the five-values reading that has travelled with it since. The lesson built on it is the tutor's own."),
    # what the story is, and the note about it
    ("Somebody dies in it. Nothing is described in any detail. A class that would rather not hear that can be told she was attacked and badly hurt, and every sentence in the lesson still works.",
     "Somebody is attacked in it, and badly hurt. Nothing is described in any detail. Read the beats in step 1 before class and decide whether it suits your group."),
    ("(somebody dies in it; the note in Before you start gives the softer version)", "(somebody is attacked in it; see the note in Before you start)"),
    # the beats that change; the geography stays
    ("hears her crying, invites her to dinner.", "hears that she is low, invites her to a party."),
    ("She walks across the bridge, buys a bottle of wine, and goes to his house.", "She walks across the bridge, buys a gift for the host, and goes to his house."),
    ("One bottle, then another. One thing leads to another. They sleep together.", "The party is loud. The friend keeps filling her glass and keeps asking her to stay. She loses track of the time."),
    ("She wakes in the middle of the night, full of guilt, and leaves without waking him.", "She realises it is the middle of the night, feels ashamed to have stayed so long, and leaves without saying goodbye."),
    ("He is on the bridge. She dies there.", "He is on the bridge. He attacks her, and she is badly hurt."),
    # the question and the target sentence
    ("Ask: who is most responsible for her death?", "Ask: who is most responsible for what happened to her?"),
    ("she <u>would have survived</u>", "she <u>would have been safe</u>"),
    ("She would have survived <b>", "She would have been safe <b>"),
    ("she would have survived.", "she would have been safe."),
    ("If she stay home, she don't die.", "If she stay home, she not be hurt."),
    ("Did she survive?", "Was she safe?"),
    (">she survives<", ">she is safe<"),
    (">she died<", ">she was hurt<"),
    # form notes
    ("have survived.</i> ('d = <b>would</b>)", "have been safe.</i> ('d = <b>would</b>)"),
    ("have died.</i>", "have been hurt.</i>"),
    ("she <b>might</b> have survived", "she <b>might</b> have been safe"),
    ("she wouldn't have been killed", "she wouldn't have been hurt"),
    # the drill
    ("<li>survived <span class=\"ph\">/səˈvaɪvd/</span></li>", "<li>safe <span class=\"ph\">/ˈseɪf/</span></li>"),
    ("<li>have survived <span class=\"ph\">/əv səˈvaɪvd/</span></li>", "<li>have been safe <span class=\"ph\">/əv bɪn ˈseɪf/</span></li>"),
    ("<li>would have survived <span class=\"ph\">/ˈwʊd əv səˈvaɪvd/</span></li>", "<li>would have been safe <span class=\"ph\">/ˈwʊd əv bɪn ˈseɪf/</span></li>"),
    ("<li>she'd have survived <span class=\"ph\">/ʃid əv səˈvaɪvd/</span></li>", "<li>she'd have been safe <span class=\"ph\">/ʃid əv bɪn ˈseɪf/</span></li>"),
    ("<i>would have survived</i> → /ˈwʊdə səˈvaɪvd/", "<i>would have been safe</i> → /ˈwʊdə bɪn ˈseɪf/"),
    ("she'd have sur<b>VIVED</b>.", "she'd have been <b>SAFE</b>."),
    ("WOULD HAVE survived", "WOULD HAVE BEEN safe"),
    # the cut-up sentences
    ("she wouldn’t have been killed.", "she wouldn’t have been hurt."),
    ("I wouldn’t have had the chance to kill her.", "I wouldn’t have had the chance to hurt her."),
    ("['If I hadn’t been drunk,', 'I wouldn’t have let her leave the house alone.']", "['If I hadn’t kept filling her glass,', 'she wouldn’t have left so late.']"),
    # the ranking cards
    ("He opened the second bottle and let her walk home.", "He kept filling her glass and let her walk home."),
]

ALIAS['drama-in-the-elt-classroom'] = [
    # the sources line first
    ("The opening quotations are from Alan Maley and Alan Duff, <i>Drama Techniques in Language Learning</i> (Cambridge University Press). \"Miming a monster\" and \"Listen and mime\" are adapted from Sarah Phillips, <i>Drama with Children</i> (Oxford University Press); \"Rod the frog\" is by Carol Read and Ana Soberón. The warm-ups and cooling-down exercises are classic drama-in-ELT activities from the tutor's own collection.",
     "The statements, activity descriptions, story and action song on this page are written for this session. For further reading on drama in language teaching: Alan Maley and Alan Duff, <i>Drama Techniques in Language Learning</i> (Cambridge University Press); Sarah Phillips, <i>Drama with Children</i> (Oxford University Press)."),
    # the opening statements, in new words
    (r're:<div id="quoBox" class="hidden">.*?</div>\n    </div>\n\n    <div class="link">',
     '''<div id="quoBox" class="hidden">
      <div class="quote">Drama gives students room to put something of themselves into the language they are practising. It builds on what everyone can already do: imitate, copy a gesture, show a feeling, and use imagination and memory to bring a scene to life.</div>
      <div class="quote">Drama puts feeling and the body back into language, so that words carry meaning again. That does not mean acting wildly; it means paying closer attention to what is being said.</div>
      <div class="quote">Drama engages students' feelings directly, and that helps them notice how to say things more fittingly.</div>
      <div class="quote">Drama can turn the usual order round: begin with the meaning, then look for the language.</div>
      <div class="quote">The worry of having nothing to say, or not wanting to speak, mostly melts away.</div>
      <div class="quote">Its starting point is life, not language.</div>
      <div class="quote">Teachers who try these techniques usually report a strong boost to motivation.</div>
      <div class="quote">Drama can draw on music, history, art, maths, sport, photography, cooking, anything. Subject boundaries do not matter.</div>
      <div class="quote">It keeps a big class busy and involved for the whole lesson.</div>
      <div class="quote">It builds students' confidence.</div>
      <div class="quote">The relationship between students and teacher gets warmer.</div>
      <div class="quote">These activities build trust and a sense of being a group.</div>
      <div class="quote">The language that comes out sounds like real language.</div>
      <div class="quote">Drama helps by placing language in a believable situation, however imaginary that situation may be.</div>
    </div>

    <div class="link">'''),
    # the warm-ups
    (r're:<section id="warm">.*?</section>',
     '''<section id="warm">
  <div class="card teal">
    <div class="eyebrow">Warm-up</div>
    <h2>Non-verbal icebreakers and warm-up activities</h2>

    <div class="act">
      <h3>Greet as if…</h3>
      <ul>
        <li>You are meeting a possible landlord for the first time</li>
        <li>You suspect the other person owes you money</li>
        <li>You want to look as important as you can</li>
        <li>You are old friends who have not met for years</li>
        <li>You are both very rich guests at an expensive gala</li>
        <li>You think the other person has just been rude about you</li>
        <li>You are late for a train and must leave at once</li>
        <li>You are meeting your new head teacher and want to impress</li>
        <li>You think the other person is the funniest person you have ever met</li>
        <li>You are meeting your partner's grandparents for the first time</li>
        <li>You are meeting a famous footballer</li>
      </ul>
      <h4>Variations</h4>
      <ul>
        <li>Make the instructions calmer: <i>“Greet as if you are about to hear some important news,”</i> <i>“Greet as if you are about to start a driving test.”</i></li>
        <li>Make it spoken and turn it into a name-learning activity for a new class: <i>“My name is …….”</i></li>
      </ul>
    </div>

    <div class="act">
      <h3>Mirror Pairs</h3>
      <ul>
        <li>Stand in pairs, facing each other.</li>
        <li>Both raise their hands to shoulder height, palms towards the partner.</li>
        <li>Keep the palms close, without touching.</li>
        <li>One partner starts to move their hands slowly.</li>
        <li>The other copies the movements as exactly as possible, like a reflection.</li>
        <li>Swap roles so that both take a turn at leading.</li>
      </ul>
    </div>

    <div class="act">
      <h3>Trust Rocking</h3>
      <ul>
        <li>Work in threes.</li>
        <li>Two stand one behind the other. The one in front closes their eyes and leans back, and the one behind catches them and eases them upright.</li>
        <li>After a few turns, swap places.</li>
        <li>When everyone feels safe, the two outer people stand either side and gently rock the middle person between them.</li>
      </ul>
    </div>

    <div class="act">
      <h3>Fish in the Cave</h3>
      <ul>
        <li>Explain briefly what a cave is, if needed.</li>
        <li>Make groups of eight or ten.</li>
        <li>One group builds a cave with their bodies: a shape with gaps in it.</li>
        <li>The others are fish and wriggle through the gaps.</li>
      </ul>
    </div>

    <div class="act">
      <h3>Guide and Follow</h3>
      <div class="meta"><span><b>Type</b> Non-verbal or verbal</span></div>
      <ul>
        <li>Spread obstacles around the room: chairs, tables, books, bags and so on.</li>
        <li>Pair up your students.</li>
        <li>One partner closes their eyes, or wears a blindfold.</li>
        <li>The other partner guides them round the room by the arm. <b>No talking is allowed</b> if you are doing this as a non-verbal activity.</li>
        <li>Partners swap roles and repeat.</li>
      </ul>
      <h4>As a verbal activity</h4>
      <ul>
        <li>Useful for practising instructions, adverbs and <i>there is / there are</i>: <i>“There are lots of bags here, so walk carefully, lift your feet, turn right”</i> and so on.</li>
      </ul>
    </div>
  </div>
</section>'''),
    # getting started: the creature
    (r're:<h3>Miming a Monster</h3>.*?<div class="creditline">Adapted from Sarah Phillips[^\n]*</div>\n',
     '''<h3>Build a Creature</h3>
      <div class="meta">
        <span><b>Aims</b> parts of the body, teamwork, physical coordination</span>
        <span><b>Age</b> most ages</span>
        <span><b>Level</b> beginner or elementary</span>
      </div>
      <ul>
        <li>Go over parts of the body if you need to.</li>
        <li>Invite two volunteers to the front.</li>
        <li>Tell them they will become a creature as you describe it.</li>
        <li>Describe the creature slowly. The volunteers shape it with their bodies.</li>
        <li>Try again with the whole class.</li>
        <li>Let students work in pairs.</li>
      </ul>
      <h4>Possible follow-up</h4>
      <ul>
        <li>Students draw their creatures and put up a display.</li>
        <li>In groups, students build a creature: one reads out the description and the others act it.</li>
        <li>The teacher describes a creature and the class guesses which one it is.</li>
      </ul>
'''),
    (r're:<h3>Listen and Mime</h3>.*?<div class="creditline">Adapted from Sarah Phillips[^\n]*</div>\n',
     '''<h3>Hear It, Act It</h3>
      <div class="meta">
        <span><b>Aims</b> listening to a story for particular words, following directions</span>
        <span><b>Age</b> 6–12</span>
        <span><b>Level</b> beginner upwards</span>
      </div>
      <h4>Preparation</h4>
      <ul>
        <li>Choose a short story that suits the class.</li>
        <li>Practise telling it aloud to someone.</li>
        <li>Pick the key words and an action for each.</li>
        <li>Try the actions out with a colleague, to be sure they are short and easy, and neither dull nor risky.</li>
      </ul>
      <h4>Procedure</h4>
      <ul>
        <li>Tell the students they will hear a story, but first they will learn some actions.</li>
        <li>Stand in a circle, or behind desks if space is tight, and join in yourself.</li>
        <li>Teach a few words and actions at a time, and revise them before the story.</li>
        <li>Tell the story while the students perform the actions.</li>
        <li>Tell it again in a later lesson if it helps.</li>
      </ul>
      <h4>Possible follow-up</h4>
      <ul>
        <li>Make a comic strip or a small book of the story.</li>
        <li>Give a written version of the story with gaps.</li>
        <li>Hand out pictures for the students to put in order.</li>
        <li>Ask for a different ending.</li>
        <li>Turn the story into a short play, with props: masks, hats, old clothes, puppets.</li>
      </ul>
'''),
    # the story, with a new picture and new characters
    (r're:<h3>Rod the Frog</h3>.*?<div class="creditline">by Carol Read and Ana Soberon</div>\n',
     '''<h3>Nico the Snail</h3>
      <div class="meta"><span><b>Pictures</b> snail (brown), bird, rabbit, wizard, hill</span></div>
      <p>Tell the story using pictures. The basic version is like this:</p>
      <div class="story">
        <p>This is the story of Nico the snail.</p>
        <p>Nico the snail is a lovely brown snail, but he is very sad.</p>
        <p>‘Slow is horrible.'</p>
        <p>‘Hello, Nico. Why are you sad?' asks the bird.</p>
        <p>‘Slow is horrible. I want to be quick like you,' says Nico the snail.</p>
        <p>‘Go and see the wizard at the top of the hill. He can change the way you move.'</p>
        <p>‘That's a good idea. Goodbye.'</p>
        <p>‘Goodbye.'</p>
        <p>‘Hello, Nico. Why are you sad?' asks the rabbit.</p>
        <p>‘Slow is horrible. I want to be quick like you,' says Nico the snail.</p>
        <p>‘Go and see the wizard at the top of the hill. He can change the way you move.'</p>
        <p>‘That's a good idea. Goodbye.'</p>
        <p>‘Goodbye.'</p>
        <p class="n">Nico the snail climbs to the top of the hill.</p>
        <p>‘Hello, Nico. Why are you sad?' asks the wizard.</p>
        <p>‘Slow is horrible. I want to be quick like the bird or the rabbit,' says Nico the snail.</p>
        <p>‘Ha, ha, ha! No problem. I can make you quick. Are you ready?'</p>
        <p>‘One, two, three. Presto!' Whoosh, bang!</p>
        <p>‘Now I'm like the bird… Oh, no … I'm too high! It's horrible!'</p>
        <p>‘Let's try again. One, two, three. Presto!' Whoosh, bang!</p>
        <p>‘Now I'm like the rabbit… Oh, no … I can't stop! It's horrible! Oh, please, I want to be a snail! I want to be brown! I want to be ME!'</p>
        <p>‘OK, Nico. But this is the last time. One, two, three. Presto!' Whoosh, bang!</p>
        <p>‘Are you happy now?' asks the wizard.</p>
        <p>‘Oh, yes. I'm happy now. I'm a lovely brown snail! Thank you. Goodbye.'</p>
      </div>
'''),
    (r're:<h3>The Hokey Pokey</h3>.*?right arm &nbsp;·&nbsp; left leg &nbsp;·&nbsp; right foot\n      </div>',
     '''<h3>Wave and Turn</h3>
      <div class="song">
        You raise your left hand up,<br>
        You lower it back down;<br>
        Up, down, up, down, you wave it all around<br>
        You do the Wave and Turn,<br>
        And you spin around.<br>
        That's what it's all about!
        <div class="ch">Chorus</div>
        Hey, the Wave and Turn!<br>
        Hey, the Wave and Turn!<br>
        Hey, the Wave and Turn!<br>
        Knees bent, arms wide<br>
        Ha, ha, ha!
        <div class="ch">Then repeat with</div>
        right arm &nbsp;·&nbsp; left leg &nbsp;·&nbsp; right foot
      </div>'''),
    # cooling down
    (r're:<div class="act">\n      <h3>Feeling my Space</h3>.*?<h3>Don\'t Break it!</h3>.*?</ul>\n    </div>\n',
     '''<div class="act">
      <h3>Taking Up Space</h3>
      <ul>
        <li>Students lie down if they can, or sit, with their eyes closed.</li>
        <li>In a calm, steady voice, tell them to feel the space their body takes up.</li>
        <li>Ask them to stretch out as far as their arms and legs allow, to fill the space.</li>
        <li>Finally, ask them to make themselves as small as they can.</li>
      </ul>
    </div>

    <div class="act">
      <h3>Seed to Tree</h3>
      <ul>
        <li>Ask students to stand and find a space of their own.</li>
        <li>Tell them to curl up as small as they can.</li>
        <li>Now ask them to uncurl, very, very slowly, into a tree reaching up towards the light.</li>
        <li>You can add slow instrumental music.</li>
      </ul>
    </div>

    <div class="act">
      <h3>Carry the Giant Bowl</h3>
      <ul>
        <li>Students stand in circles of about ten.</li>
        <li>Ask them to imagine a huge, fragile bowl in the middle of the circle.</li>
        <li>Ask them to lift it together and carry it very carefully to another part of the room.</li>
      </ul>
    </div>
'''),
    # to finish
    (r're:<h2>The Birthday Party</h2>.*?</ul>\n\n    <div class="act">\n      <h3>Interplanetary Greetings</h3>.*?</ul>\n    </div>\n',
     '''<h2>The Birthday Party</h2>
    <ul>
      <li>Students wait outside the room.</li>
      <li>They come in one by one and greet the host (the teacher), pretending to be guests at a birthday party.</li>
      <li>Some pretend to bring presents.</li>
      <li>Some pretend to be old friends, and others are new and need to be introduced.</li>
      <li>Encourage everyone to mingle and chat about the party, about each other, and so on.</li>
      <li>For extra fun, ask everyone to imagine the party is taking place in another country: Brazil, Japan, Kenya and so on.</li>
    </ul>

    <div class="act">
      <h3>Greetings from Other Worlds</h3>
      <ul>
        <li>Pair up students; each pair represents a world of its own.</li>
        <li>Each pair decides on:
          <ul>
            <li>a name for their world</li>
            <li>a way of greeting each other there</li>
          </ul>
        </li>
        <li>Each pair shows its greeting to the others.</li>
        <li>The teacher then sets up a party, and students swap partners and greet each other in the manner of their worlds.</li>
      </ul>
    </div>
'''),
    # the trainer notes: the activities under their new names
    ("Music for From Seed to Plant if you have it.", "Music for Seed to Tree if you have it."),
    ("the See-saw and Blind need trust", "Trust Rocking and Guide and Follow need trust"),
    ("Reveal the quotations; read three aloud.", "Reveal the statements; read three aloud."),
    ("Shake hands as if (five or six of the eleven), Mirroring, the See-saw with you as a spotter, Eels in the grotto if the room allows, Blind in pairs.", "Greet as if (five or six of the eleven), Mirror Pairs, Trust Rocking with you as a spotter, Fish in the Cave if the room allows, Guide and Follow in pairs."),
    ("Miming a monster on two volunteers, then pairs. Listen and mime with Rod the frog: teach the actions, tell the story, they join in. The Hokey Pokey to finish, everybody.", "Build a Creature on two volunteers, then pairs. Hear It, Act It with Nico the snail: teach the actions, tell the story, they join in. Wave and Turn to finish, everybody."),
    ("Feeling my space, From seed to plant, Don’t break it. Quiet voice.", "Taking Up Space, Seed to Tree, Carry the Giant Bowl. Quiet voice."),
    ("then Interplanetary greetings.", "then Greetings from Other Worlds."),
    ("None. The sources are on the page: Maley and Duff for the quotations, Phillips for the two children’s activities, Read and Soberón for Rod the frog.", "None. The statements, activities, story and song are written for this session; the reading list is at the foot of the page."),
    ("The See-saw with the wrong partner.", "Trust Rocking with the wrong partner."),
]

ALIAS['lesson-framework'] = [
    # the sources line first
    ("The six shapes and the decision tree follow the International House CELTA lesson shapes; the MFPA table is the course's own.",
     "The six shapes, the decision tree and the coursebook spreads are made up for this session; they draw on common ways of shaping a language lesson."),
    # part 10: made-up coursebook spreads instead of pages from a real book
    ("10 · Build your own lessons from a coursebook page", "10 · Build lessons from a coursebook spread"),
    ("Pull up each page from your own copy of the coursebook using the reference on the card. As a group, decide: how many separate 45-minute lessons could you build from this page, and which framework would each one use? Tap the card to compare against a suggested breakdown.",
     "Each card describes one spread from a made-up coursebook. As a group, decide: how many separate 45-minute lessons could you build from this spread, and which framework would each one use? Tap the card to compare against a suggested breakdown."),
    ("The coursebook pages in part 10 are Speakout; have the book in the room.", "The coursebook spreads in part 10 are made up; no book is needed."),
    ("Part 10 only if time: with the book open, how many 45-minute lessons from this page, which framework each.", "Part 10 only if time: how many 45-minute lessons from each spread, which framework each."),
    (r"re:const cbItems = \[.*?\n\];",
     '''const cbItems = [
  {
    page: "Pages 6–7",
    title: "1.3 What's in the Fridge?",
    topic: "Vocabulary (food and containers) + Reading + Grammar: some/any, countable and uncountable nouns + Listening + Speaking",
    answer: "<strong>Suggested: 2–3 lessons</strong>Lesson 1 — Text-Based / Guided Discovery: the reading, 'A Week of Leftovers', is where some/any and countable and uncountable nouns are highlighted and checked, so stage lead-in, reading for gist and detail, TL highlighting, clarification, then controlled practice.<br><br>Lesson 2 — Receptive Skills: the supermarket listening (gist, detail, key words) stands alone well as a listening lesson.<br><br>Lesson 3 — Productive Skills: combine the food and containers vocabulary with the speaking task (planning a dinner for six) into one lesson, noting that this is a skills lesson, not grammar practice through speaking."
  },
  {
    page: "Pages 2–3",
    title: "1.1 Cities and Neighbours",
    topic: "Listening + Grammar: present simple be (+/-) + Pronunciation: sentence stress + Vocabulary: places in a city + Speaking",
    answer: "<strong>Suggested: 2 lessons</strong>Lesson 1 — Text-Based / Guided Discovery: the bus-stop conversation between Tomas and Priya is where present simple 'be' positive and negative is checked and clarified from the transcript, so stage listening for gist and detail into TL highlighting, clarification, and controlled practice (completing Mei's introduction).<br><br>Lesson 2 — Language Practice: focus on the places vocabulary and sentence stress through speaking pair work, as controlled-to-freer practice with the language already clarified."
  },
  {
    page: "Pages 14–15",
    title: "What's Your Hobby?",
    topic: "Video interviews + Grammar: like/love/hate + -ing, have/has + Speaking & Writing",
    answer: "<strong>Suggested: 2–3 lessons</strong>Lesson 1 — Receptive Skills: use the video-watching tasks (numbering speakers, matching hobbies to people) as a listening-for-gist/detail lesson.<br><br>Lesson 2 — PPP: the grammar (like/love/hate + -ing, have/has) is practised through standalone exercises rather than pulled from a text, so this fits a fresh presentation.<br><br>Lesson 3 — Productive Skills: combine the speaking task (a hobby survey) and the writing task (a short profile for a club noticeboard) into one or two lessons depending on your group's needs, noting that this is a skills lesson, not vocabulary or grammar practice through speaking."
  },
  {
    page: "Pages 10–11",
    title: "Two Weekends",
    topic: "Vocabulary (free-time activities) + Reading + Grammar: present simple (he/she/it)",
    answer: "<strong>Suggested: 2 lessons</strong>Lesson 1 — Text-Based / Guided Discovery: the 'Weekend Away' reading text is where the target grammar (present simple, third person) is checked and clarified, so stage it as gist and detail reading into TL highlighting and practice.<br><br>Lesson 2 — Language Practice or Productive Skills: the free-time vocabulary, pronunciation (word stress) and the speaking mime activity work well as a separate lesson, either as language practice or as a speaking lesson."
  },
  {
    page: "Pages 16–17",
    title: "Moods",
    topic: "Video interviews + Grammar: although/however + Speaking & Writing",
    answer: "<strong>Suggested: 2–3 lessons</strong>Lesson 1 — Receptive Skills: the video-watching tasks (matching adjectives, choosing correct meanings) make a solid listening lesson.<br><br>Lesson 2 — Text-Based / Guided Discovery: although and however are drawn directly from what the interviewees say, so this is a listening-text-based grammar lesson.<br><br>Lesson 3 — Productive Skills: split speaking (discussing how a day made you feel) and writing (a short diary entry) into separate lessons, or combine them if the group is strong."
  },
  {
    page: "Pages 22–23",
    title: "Weather Forecasts & Living Greener",
    topic: "Grammar: future probability (might, will probably) + Listening + Grammar: quantifiers",
    answer: "<strong>Suggested: 2 lessons</strong>Lesson 1 — Language Practice or PPP: the future probability language (might, will probably, is sure to) is practised through standalone sentence completion rather than a text, so treat this as controlled-to-freer practice, or a fresh PPP presentation if this is new language for your group.<br><br>Lesson 2 — Text-Based / Guided Discovery: the 'Cities That Grow Their Own Food' listening leads into the quantifier language via the listener comments, so stage it as listening comprehension into TL highlighting and clarification."
  }
];'''),
]

ALIAS['receptive-skills'] = [
    ("Pairs with: Speakout B2, TP1.1, Identity and personality.", "Pairs with: a unit on identity and personality in your course's coursebook."),
]

ALIAS['word-and-sentence-stress'] = [
    # the sources line first
    ("The rhythm chant, the countries, the roses sentence and the Paris question are classic CELTA input material; the noun-or-verb quiz is the tutor's own.",
     "The rhythm chant, the contrastive stress sentence, the question exchanges, the greetings conversation and the café are made up for this session; the word list, the noun-or-verb quiz and the round-up are the tutor's own."),
    # the rhythm chant: four content words on a steady beat
    ('<span class="stress">YOU</span> &nbsp; <span class="stress">ME</span> &nbsp; <span class="stress">HIM</span> &nbsp; <span class="stress">HER</span>',
     '<span class="stress">COOK</span> &nbsp; <span class="stress">BAKE</span> &nbsp; <span class="stress">FRY</span> &nbsp; <span class="stress">ROAST</span>'),
    ('<span class="stress">YOU</span> <span class="dim">and</span> <span class="stress">ME</span> <span class="dim">and</span> <span class="stress">HIM</span> <span class="dim">and</span> <span class="stress">HER</span>',
     '<span class="stress">COOK</span> <span class="dim">and</span> <span class="stress">BAKE</span> <span class="dim">and</span> <span class="stress">FRY</span> <span class="dim">and</span> <span class="stress">ROAST</span>'),
    ('<span class="stress">YOU</span> <span class="dim">and then</span> <span class="stress">ME</span> <span class="dim">and then</span> <span class="stress">HIM</span> <span class="dim">and then</span> <span class="stress">HER</span>',
     '<span class="stress">COOK</span> <span class="dim">and then</span> <span class="stress">BAKE</span> <span class="dim">and then</span> <span class="stress">FRY</span> <span class="dim">and then</span> <span class="stress">ROAST</span>'),
    ('<span class="stress">YOU</span> <span class="dim">and then it\'s</span> <span class="stress">ME</span> <span class="dim">and then it\'s</span> <span class="stress">HIM</span> <span class="dim">and then it\'s</span> <span class="stress">HER</span>',
     '<span class="stress">COOK</span> <span class="dim">and then it\'s</span> <span class="stress">BAKE</span> <span class="dim">and then it\'s</span> <span class="stress">FRY</span> <span class="dim">and then it\'s</span> <span class="stress">ROAST</span>'),
    ("stressed words here (you, me, him, her) are", "stressed words here (cook, bake, fry, roast) are"),
    # the contrastive sentence: seven words, seven readings
    ("var WORDS_ROSES = ['I', \"didn't\", 'buy', 'you', 'ten', 'red', 'roses'];", "var WORDS_ROSES = ['We', \"didn't\", 'bring', 'them', 'three', 'blue', 'balloons'];"),
    ("'implies someone else bought them',", "'implies someone else brought them',"),
    ("'a strong denial: I did not do this',", "'a strong denial: we did not do this',"),
    ("'implies I did something else with them: stole them, found them, was given them',", "'implies we did something else with them: made them, borrowed them, found them',"),
    ("'implies I bought them for someone else',", "'implies we brought them for someone else',"),
    ("'implies a different flower, or a different gift altogether',", "'implies a different item, or a different gift altogether',"),
    ("the chant and the roses sentence are on screen.", "the chant and the balloons sentence are on screen."),
    ("The roses sentence seven ways", "The balloons sentence seven ways"),
    # the five question exchanges
    ("Attitudinal stress: are you flying to Paris on Tuesday?", "Attitudinal stress: is she driving to Lisbon on Friday?"),
    ("five questions about Paris", "five questions about Lisbon"),
    ("Five Paris exchanges in pairs", "Five Lisbon exchanges in pairs"),
    ("{ q:['ARE',' you flying to Paris on Tuesday?'], stressedFirst:true, a:'Yes, of course I am. Stop worrying.', reveal:'The stress is on <b>ARE</b>:",
     "{ q:['IS',' she driving to Lisbon on Friday?'], stressedFirst:true, a:'Yes, of course she is. Stop worrying.', reveal:'The stress is on <b>IS</b>:"),
    ("{ q:['Are ','YOU',' flying to Paris on Tuesday?'], a:'No, John is.', reveal:'The stress is on <b>YOU</b>: the answer corrects <i>who</i> is flying.' },",
     "{ q:['Is ','SHE',' driving to Lisbon on Friday?'], a:'No, Amara is.', reveal:'The stress is on <b>SHE</b>: the answer corrects <i>who</i> is driving.' },"),
    ("{ q:['Are you ','FLYING',' to Paris on Tuesday?'], a:'No, taking the train.', reveal:\"The stress is on <b>FLYING</b>: the answer corrects <i>how</i> they¦re travelling.\" },",
     "{ q:['Is she ','DRIVING',' to Lisbon on Friday?'], a:'No, taking the train.', reveal:\"The stress is on <b>DRIVING</b>: the answer corrects <i>how</i> she¦s travelling.\" },"),
    ("{ q:['Are you flying to ','PARIS',' on Tuesday?'], a:'No, Prague.', reveal:\"The stress is on <b>PARIS</b>: the answer corrects <i>where</i> they¦re going.\" },",
     "{ q:['Is she driving to ','LISBON',' on Friday?'], a:'No, Porto.', reveal:\"The stress is on <b>LISBON</b>: the answer corrects <i>where</i> she¦s going.\" },"),
    ("{ q:['Are you flying to Paris on ','TUESDAY','?'], a:'No, on Wednesday.', reveal:'The stress is on <b>TUESDAY</b>: the answer corrects <i>when</i>.' },",
     "{ q:['Is she driving to Lisbon on ','FRIDAY','?'], a:'No, on Thursday.', reveal:'The stress is on <b>FRIDAY</b>: the answer corrects <i>when</i>.' },"),
]

ALIAS['functional-language'] = [
    # the sources line first
    ("The three exponents and the twelve functions are the tutor's CELTA input materials.",
     "The three exponents, their analyses and the matching phrases are made up for this session; the twelve functions are standard categories in language teaching."),
    # exponent 1
    ("<li>Sugar.</li>", "<li>Salt.</li>"),
    ("Two friends are drinking tea in a café. The table is a bit long and the other friend can't reach the sugar, so they need to ask for it.", "Two friends are eating lunch in a café. The table is quite wide and one friend can't reach the salt, so they need to ask for it."),
    ("sugar", "salt"),
    # exponent 2
    ("prepositional phrase (in + noun) — modal verb, present", "prepositional phrase (at + noun) — modal verb, present"),
    ("sentence stress on ‘stay’ and ‘bed’", "sentence stress on ‘rest’ and ‘home’"),
    ("stay in bed", "rest at home"),
    # exponent 3
    ("Is he talking about the past? (Yes) · Was he romantic with her? (No) · Can he change it now? (No) · Does he feel sorry about it? (Yes)", "Is she talking about the past? (Yes) · Was she patient with him? (No) · Can she change it now? (No) · Does she feel sorry about it? (Yes)"),
    ("A man is telling a friend about his ex-girlfriend, who has just left him. He’s thinking about what he could have done differently.", "A woman is telling a friend about her brother, who has just moved away after an argument. She’s thinking about what she could have done differently."),
    ("more romantic with her", "more patient with him"),
    ("more romantic", "more patient"),
    ("‘romantic’", "‘patient’"),
    # the matching phrases
    ("Would you like to go to see a film tonight?", "Would you like to come to a concert on Friday?"),
    ("Oh, thank you so much for the lovely hat you gave me!", "Oh, thank you so much for the lovely scarf you gave me!"),
    ("I think the red one's much more interesting.", "I think the green one's much more interesting."),
    ("You must be at work by 4pm.", "You must be at the airport by 6am."),
]

ALIAS['phonology-sounds'] = [
    # the sources line first
    ("The terminology and the voiced-unvoiced task follow the tutor's CELTA input materials; the phonemic chart is the standard British English chart of 44 phonemes (Adrian Underhill, <i>Sound Foundations</i>, Macmillan).",
     "The film titles, word lists and tasks are made up for this session. The terminology is standard in teacher training, and the phonemic chart is the standard British English chart of 44 phonemes (Adrian Underhill, <i>Sound Foundations</i>, Macmillan)."),
    # the film titles: invented, with their transcriptions
    (r"re:const films = \[.*?\n\];",
     """const films = [
  {ipa:'/muːn gɑːdən/',a:'moon garden'},{ipa:'/red brɪdʒ/',a:'red bridge'},{ipa:'/ðə saɪlənt ʃɑːk/',a:'the silent shark'},{ipa:'/naɪt treɪn/',a:'night train'},
  {ipa:'/gəʊldən reɪn/',a:'golden rain'},{ipa:'/peɪpə wɪŋz/',a:'paper wings'},{ipa:'/dʒʌŋgəl ʃædəʊ/',a:'jungle shadow'},{ipa:'/tʃiːz tʃeɪs/',a:'cheese chase'}
];"""),
]

ALIAS['teaching-speaking'] = [
    # the sources line first
    ("Lesson Shape (F) and the staging task follow the International House CELTA lesson shapes. The fluency principles follow Jim Scrivener, <i>Learning Teaching</i> (Macmillan).",
     "The shape and the staging task are made up for this session. The fluency principles follow Jim Scrivener, <i>Learning Teaching</i> (Macmillan)."),
    ("Lesson Shape (F), productive skills.", "The productive skills shape."),
    ("This is Lesson Shape (F): productive skills", "This is the productive skills shape"),
    ("Lesson Shape (F): productive skills <span", "The productive skills shape <span"),
    ("plan the five stages using Lesson Shape (F).", "plan the five stages using the productive skills shape."),
    ("Not every stage of Lesson Shape (F) is needed", "Not every stage of the productive skills shape is needed"),
    ("Lesson Shape (F) is IH’s; the staging task and the framework table are on the page.", "The staging task and the framework table are on the page."),
    ("Shape (F)", "the shape"),
]
