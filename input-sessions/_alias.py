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
    ("re:  \\{ccqs:\\['When did she start living there[^\\n]*", "  {ccqs:['When did he start working there? (Two years ago)','Does he still work there? (Yes)'], answer:'He’s been working there for two years. Does he still work there? Yes. (Also correct: He’s worked there for two years. Here the answer to “Does he still work there?” is Maybe.)'},"),
    ("re:  \\{ccqs:\\['Did he clean his suit himself[^\\n]*", "  {ccqs:['Did she wash her car herself? (No)','Did someone else wash it? (Yes)','Did she ask them to wash it? (Yes)'], answer:'She had her car washed. (or: She got her car washed.)'},"),
    ("re:  \\{ccqs:\\['Was it necessary for them to rush[^\\n]*", "  {ccqs:['Was it necessary for us to cook so much food? (No)','But did we cook it all? (Yes)'], answer:'We needn’t have cooked so much food. (Compare: We didn’t need to cook so much — which doesn’t tell us whether we did.)'}"),
    ("re:  \\{sentence:'He’s known Mary[^\\n]*", "  {sentence:'She’s known Tomás since school.', ccqs:['Did she know Leila?','Does she love Tomás?','Did she and Tomás study maths?'], answer:'None of them checks the meaning. They ask about things the sentence doesn’t say (Leila, love, maths). Check the concept instead: Does she know Tomás now? (Yes) When did she meet him? (At school) Has she known him all the time from school until now? (Yes)'},"),
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


# THE ANSWERS SPREAD ACROSS THE BUTTONS (Ramy, 26 Oct 2026: "the answers for number 4 are pretty much all in
# the middle ... the answers should not be like all in the middle or first or all last"). Applied after each
# page's own aliases, in this order. Classroom management's yes-no-maybe was eight No in twelve; four
# statements now turn the other way. Text-based teaching (two True in nine) and PPP (two in six) the same;
# the exam-class match and the lesson-framework scenarios had the right answer first four and five times.
_SPREAD = [
    ('classroom-management', "const ynm=[\n  ['It works well to point at a student when you want them to speak.','No','Pointing can feel rude, and in some cultures it is. Use their <b>name</b>, or an open hand.'],\n  ['You should look at the students all the time, in every stage.','No','Yes while you give instructions and feedback. <b>Look away</b> when they’re talking to each other, or they’ll talk to you instead.'],\n  ['It pays to plan your board layout before the lesson.','Yes','Decide what goes where before the lesson. A messy board makes a messy lesson.'],\n  ['To talk to one student, you should walk right up to them.','No','Stay further away. The student speaks up, and the whole class hears.'],\n  ['Writing in capitals on the board is a good idea because it is easier to read.','No','They’re harder to read, and they hide which words really take a capital. Write normally.'],\n  ['Students understand you better if you slow right down and use very simple, childlike language.','No','Grade your language, but keep it <b>natural</b>: “close… phone… please” teaches nothing.'],\n  ['When a student can’t hear what a classmate said, you should repeat it for them.','Maybe','Usually <b>no</b>: ask the student to say it again, louder. If you always repeat, they stop listening to each other.'],\n  ['You should be very polite and cautious when you ask students to move seats or switch groups.','No','Be friendly and <b>clear</b>. “Would you mind possibly moving…” just confuses. “Kofi, sit here, please.”'],\n  ['A teacher’s voice should stay at one level throughout the lesson.','No','Louder to get attention and give instructions, quieter when you join a pair.'],\n  ['Learners should be free to open their dictionaries at any moment.','Maybe','It depends on the stage. Not during a gist task. Often fine when they’re checking a word afterwards.'],\n  ['The best way to check that instructions are clear is to ask “Is everything clear?”','No','Everyone says yes. Ask a short question about the task instead: <b>“Are you writing or speaking?”</b>'],\n  ['If a student refuses to do an exercise, you should simply say “Fine, skip it.”','Maybe','Find out why first. Too hard? Too easy? Tired? Then decide.']\n];",
     "const ynm=[\n  ['When you want a student to speak, use their name or an open hand rather than pointing.','Yes','Pointing can feel rude, and in some cultures it is. A <b>name</b> or an open hand does the job.'],\n  ['Writing in capitals on the board is a good idea because it is easier to read.','No','They’re harder to read, and they hide which words really take a capital. Write normally.'],\n  ['When a student can’t hear what a classmate said, you should repeat it for them.','Maybe','Usually <b>no</b>: ask the student to say it again, louder. If you always repeat, they stop listening to each other.'],\n  ['While students talk to each other in pairs, it helps to look away from them.','Yes','Look at them while you give instructions and feedback. <b>Look away</b> when they’re talking to each other, or they’ll talk to you instead.'],\n  ['Students understand you better if you slow right down and use very simple, childlike language.','No','Grade your language, but keep it <b>natural</b>: “close… phone… please” teaches nothing.'],\n  ['It pays to plan your board layout before the lesson.','Yes','Decide what goes where before the lesson. A messy board makes a messy lesson.'],\n  ['Learners should be free to open their dictionaries at any moment.','Maybe','It depends on the stage. Not during a gist task. Often fine when they’re checking a word afterwards.'],\n  ['You should be very polite and cautious when you ask students to move seats or switch groups.','No','Be friendly and <b>clear</b>. “Would you mind possibly moving…” just confuses. “Kofi, sit here, please.”'],\n  ['To talk to one student, it often helps to stand further away from them.','Yes','The student speaks up, and the whole class hears.'],\n  ['The best way to check that instructions are clear is to ask “Is everything clear?”','No','Everyone says yes. Ask a short question about the task instead: <b>“Are you writing or speaking?”</b>'],\n  ['If a student refuses to do an exercise, you should simply say “Fine, skip it.”','Maybe','Find out why first. Too hard? Too easy? Tired? Then decide.'],\n  ['Your voice should change through the lesson.','Yes','Louder to get attention and give instructions, quieter when you join a pair.']\n];"),
    ('ppp', '    {s:"Students work out the rule themselves before the teacher confirms it.", t:false, fb:"False — in PPP the teacher gives the language directly at the presentation stage; it isn\'t discovered by students."},\n    {s:"Practice always splits into controlled, then freer.", t:true, fb:"True — controlled practice (one right answer) always comes before freer, production practice."},\n    {s:"Feedback on errors during production is usually immediate, not delayed.", t:false, fb:"False — the teacher monitors without interrupting during production, and error feedback is saved for the end."},\n    {s:"Pronunciation is covered as part of presentation, not skipped.", t:true, fb:"True — pronunciation (stress, weak forms, drilling) is covered as part of presentation, right after form."},\n    {s:"PPP suits a class where everyone already knows the target form.", t:false, fb:"False — PPP is built for presenting language that\'s new to the class, not for language they already know."},\n    {s:"The three stages can run in any order.", t:false, fb:"False — the text is explicit: the order is fixed because accuracy work has to come before fluency work."}',
     '    {s:"Students work out the rule themselves before the teacher confirms it.", t:false, fb:"False — in PPP the teacher gives the language directly at the presentation stage; it isn\'t discovered by students."},\n    {s:"Practice always splits into controlled, then freer.", t:true, fb:"True — controlled practice (one right answer) always comes before freer, production practice."},\n    {s:"PPP suits a class where everyone already knows the target form.", t:false, fb:"False — PPP is built for presenting language that\'s new to the class, not for language they already know."},\n    {s:"During production, feedback on errors is usually saved for the end.", t:true, fb:"True — the teacher monitors without interrupting during production, and error feedback is saved for the end."},\n    {s:"Pronunciation is covered as part of presentation, not skipped.", t:true, fb:"True — pronunciation (stress, weak forms, drilling) is covered as part of presentation, right after form."},\n    {s:"The three stages can run in any order.", t:false, fb:"False — the text is explicit: the order is fixed because accuracy work has to come before fluency work."}'),
    ('text-based-teaching', '    {s:"The target language is chosen before the text.", t:false, fb:"False — target language is lifted from the text itself, wherever it occurs, not pre-selected before the text is chosen."},\n    {s:"A gist task should be timed, to keep students reading fast.", t:true, fb:"True — gist reading is skim reading under a time limit (or hearing audio once), testing global understanding only."},\n    {s:"Students should look up every unknown word before reading for gist.", t:false, fb:"False — that would defeat the point of a gist task, which tests overall understanding, not every word."},\n    {s:"Detail tasks come before gist tasks.", t:false, fb:"False — gist comes first, and only once that\'s secure does a closer, slower detail task follow."},\n    {s:"Meaning is always checked with a teacher-led CCQ, never a handout task.", t:false, fb:"False — meaning can be checked with live CCQs or a guided-discovery handout task; either way, meaning comes before form."},\n    {s:"Form should always be given by the teacher, never elicited from students.", t:false, fb:"False — the teacher elicits form from students where possible, filling gaps rather than presenting the whole rule from scratch."},\n    {s:"Pronunciation can be skipped since students met the item in written or spoken text already.", t:false, fb:"False — pronunciation still gets direct attention: modelling, marking stress and weak forms, and drilling."},\n    {s:"The follow-on task should relate to the text\'s content.", t:true, fb:"True — the lesson closes with a follow-on task that responds to the text\'s content, such as a discussion, role play, or piece of writing."},\n    {s:"A text-based lesson can only use one language item from the text.", t:false, fb:"False — sometimes several different language items are drawn from the text, not just one."}',
     '    {s:"The target language is chosen before the text.", t:false, fb:"False — target language is lifted from the text itself, wherever it occurs, not pre-selected before the text is chosen."},\n    {s:"A gist task should be timed, to keep students reading fast.", t:true, fb:"True — gist reading is skim reading under a time limit (or hearing audio once), testing global understanding only."},\n    {s:"Gist tasks come before detail tasks.", t:true, fb:"True — gist comes first, and only once that\'s secure does a closer, slower detail task follow."},\n    {s:"Students should look up every unknown word before reading for gist.", t:false, fb:"False — that would defeat the point of a gist task, which tests overall understanding, not every word."},\n    {s:"Meaning is always checked with a teacher-led CCQ, never a handout task.", t:false, fb:"False — meaning can be checked with live CCQs or a guided-discovery handout task; either way, meaning comes before form."},\n    {s:"Where possible, the teacher elicits the form from students.", t:true, fb:"True — the teacher elicits form from students where possible, filling gaps rather than presenting the whole rule from scratch."},\n    {s:"A text-based lesson can draw more than one language item from the text.", t:true, fb:"True — sometimes several different language items are drawn from the text, not just one."},\n    {s:"Pronunciation can be skipped since students met the item in written or spoken text already.", t:false, fb:"False — pronunciation still gets direct attention: modelling, marking stress and weak forms, and drilling."},\n    {s:"The follow-on task should relate to the text\'s content.", t:true, fb:"True — the lesson closes with a follow-on task that responds to the text\'s content, such as a discussion, role play, or piece of writing."}'),
    ('teaching-exam-classes', '  {text:\'"I\\u2019m 9 and I want to learn English through games, nothing scary."\', options:[\'YLE (Starters/Movers)\',\'C2 Proficiency\',\'PTE Academic\'], answer:\'YLE (Starters/Movers)\'},\n  {text:\'"I want to study for a Bachelor\\u2019s degree in the United States."\', options:[\'A2 Key\',\'TOEFL iBT\',\'YLE\'], answer:\'TOEFL iBT\'},\n  {text:\'"I need a fast result. I have a visa deadline in one week and I\\u2019m comfortable on a computer."\', options:[\'PTE Academic\',\'C2 Proficiency\',\'B1 Preliminary\'], answer:\'PTE Academic\'},\n  {text:\'"I\\u2019m B2 and I want a widely recognised certificate that doesn\\u2019t expire."\', options:[\'B2 First\',\'IELTS\',\'A2 Key\'], answer:\'B2 First\'},\n  {text:\'"I\\u2019m moving to the UK for a skilled worker visa and need an official score, face-to-face speaking is fine."\', options:[\'IELTS\',\'TOEFL iBT\',\'YLE\'], answer:\'IELTS\'}',
     '  {text:\'"I\\u2019m 9 and I want to learn English through games, nothing scary."\', options:[\'C2 Proficiency\',\'PTE Academic\',\'YLE (Starters/Movers)\'], answer:\'YLE (Starters/Movers)\'},\n  {text:\'"I want to study for a Bachelor\\u2019s degree in the United States."\', options:[\'A2 Key\',\'TOEFL iBT\',\'YLE\'], answer:\'TOEFL iBT\'},\n  {text:\'"I need a fast result. I have a visa deadline in one week and I\\u2019m comfortable on a computer."\', options:[\'B1 Preliminary\',\'C2 Proficiency\',\'PTE Academic\'], answer:\'PTE Academic\'},\n  {text:\'"I\\u2019m B2 and I want a widely recognised certificate that doesn\\u2019t expire."\', options:[\'IELTS\',\'B2 First\',\'A2 Key\'], answer:\'B2 First\'},\n  {text:\'"I\\u2019m moving to the UK for a skilled worker visa and need an official score, face-to-face speaking is fine."\', options:[\'IELTS\',\'TOEFL iBT\',\'YLE\'], answer:\'IELTS\'}'),
    ('lesson-framework', 'options: ["Text-Based","PPP","Receptive Skills","Productive Skills"],',
     'options: ["PPP","Receptive Skills","Productive Skills","Text-Based"],'),
    ('lesson-framework', 'options: ["Language Practice","PPP","TTT","Text-Based"],',
     'options: ["PPP","TTT","Language Practice","Text-Based"],'),
    ('lesson-framework', 'options: ["Productive Skills","Receptive Skills","PPP","TTT"],',
     'options: ["Receptive Skills","Productive Skills","PPP","TTT"],'),
    ('lesson-framework', 'options: ["PPP","TTT","Language Practice","Text-Based"],\n    correct: "PPP"',
     'options: ["TTT","Language Practice","Text-Based","PPP"],\n    correct: "PPP"'),
]
for _slug, _old, _new in _SPREAD:
    ALIAS.setdefault(_slug, []).append((_old, _new))


# ANSWERS BEHIND A REVEAL (Ramy, 26 Oct 2026: "click to reveal answer for anything that is not already
# answered in the activity, and the trainer can just ask them not to click it").
_REVEAL = [
    ('teaching-speaking', '        <button class="btn secondary" onclick="resetOrder()">Reset</button>\n        <span class="feedback" id="orderFeedback"></span>\n      </div>',
     '        <button class="btn secondary" onclick="resetOrder()">Reset</button>\n        <button class="btn secondary" type="button" onclick="showOrder(this)">Reveal answer</button>\n        <span class="feedback" id="orderFeedback"></span>\n      </div>\n      <div class="reveal-box" id="orderKey"><h4>The order</h4><ol id="orderKeyList" style="margin:0;padding-left:22px;font-size:.92rem;line-height:1.6;"></ol></div>'),
    ('teaching-speaking', 'function resetOrder(){ buildOrder(); }',
     'function resetOrder(){ buildOrder(); }\n/* "Order, then reveal" had nothing to reveal unless the order came out right (Ramy, 26 Oct 2026) */\nfunction showOrder(btn){\n  const key = document.getElementById(\'orderKey\'), list = document.getElementById(\'orderKeyList\');\n  if (!list.children.length) [...stages].sort((a,b)=>a.correct-b.correct).forEach(st=>{ const li=document.createElement(\'li\'); li.textContent=st.text; list.appendChild(li); });\n  const open = key.classList.toggle(\'shown\');\n  document.getElementById(\'orderReveal\').classList.toggle(\'shown\', open);\n  btn.textContent = open ? \'Hide answer\' : \'Reveal answer\';\n}'),
    ('teaching-speaking', "    fb.textContent = 'Not quite. Reset and try again.';",
     "    fb.textContent = 'Not quite. Reset and try again, or reveal the answer.';"),
    ('teaching-speaking', 're:<div class="stage-title">What makes a fluency task work\\?.*?Which do you sometimes forget\\?</p>',
     '<div class="stage-title">What makes a fluency task work? <span class="badge">Diagnose, then rebuild</span></div>\n      <p class="lead">A trainee planned this speaking task for a B1 class. It flopped: two pairs finished in a minute, one student hardly spoke, and at the end there was nothing to say about it. In pairs, find everything that went wrong. Then rebuild the task so it works.</p>\n      <div style="margin:12px 0 0;padding:14px 18px;border-radius:var(--r-strip);background:var(--paper);border:1px solid var(--sand-line);">\n        <p style="margin:0 0 6px;font-size:.95rem;"><b>The teacher:</b> “OK, now talk to your partner about holidays. You’ve got ten minutes.”</p>\n        <p style="margin:0 0 6px;font-size:.95rem;">She sits down at her desk and marks homework while they talk.</p>\n        <p style="margin:0;font-size:.95rem;"><b>Ten minutes later:</b> “Finished? Good. Open your books at page 34.”</p>\n      </div>\n      <label class="field-label" style="margin-top:14px;">What went wrong?</label>\n      <textarea class="text-area" rows="4"></textarea>\n      <label class="field-label">Your rebuilt task</label>\n      <textarea class="text-area" rows="4"></textarea>\n      <div class="btn-row"><button class="btn secondary" type="button" onclick="this.textContent=document.getElementById(\'fluencyKey\').classList.toggle(\'shown\')?\'Hide answer\':\'Reveal answer\'">Reveal answer</button></div>\n      <div class="reveal-box" id="fluencyKey"><h4>Nine things that make a fluency task work</h4>\n        <ul class="checklist" style="margin:0;">\n          <li><b>A real reason to talk.</b> Nothing had to be found out, decided or finished, so there was no reason to keep going. Give it a task to complete.</li>\n          <li><b>A gap worth closing.</b> Nobody needed what their partner knew. An information or opinion gap makes them curious: “Find two things you’d both hate on a holiday.”</li>\n          <li><b>A clear context, set up first.</b> “Holidays” is a topic, not a situation. Set the scene before they start.</li>\n          <li><b>Clear roles.</b> Who asks, who answers, who decides? Nobody knew.</li>\n          <li><b>Free choice of language.</b> Fine here, and keep it: in a fluency task they use anything they know, not one target structure.</li>\n          <li><b>Everyone speaks.</b> Open pairs let one student lead. Roles, or a short task each, give the quiet one a turn.</li>\n          <li><b>The teacher monitors.</b> Marking homework meant nothing was heard: no ideas to pick up, no language to note.</li>\n          <li><b>Feedback on the task.</b> “Finished? Good.” says nothing. Ask about what they found out or decided.</li>\n          <li><b>A correction slot at the end.</b> A few sentences heard during the task, on the board, put right together.</li>\n        </ul>\n      </div>\n      <p class="lead" style="margin-top:14px;">Compare with what you said in the warm-up. Which of these do you already build into your lessons? Which do you sometimes forget?</p>\n      <!-- a task, not a list to read (Ramy, 26 Oct 2026: "we always train them that they should elicit answers\n           from the students. So we do the same thing with them ... turn it into a task"): they diagnose a task\n           that flopped, rebuild it, and the principles are the key -->'),
    ('teaching-speaking', '      <p class="lead" style="margin-top:14px;">Share your stage plan with another pair. Would their lead-in genuinely prepare students for their task?</p>',
     '      <p class="lead" style="margin-top:14px;">Share your stage plan with another pair. Would their lead-in genuinely prepare students for their task?</p>\n      <div class="btn-row"><button class="btn secondary" type="button" onclick="this.textContent=document.getElementById(\'planModel\').classList.toggle(\'shown\')?\'Hide answer\':\'Reveal answer\'">Reveal answer</button></div>\n      <div class="reveal-box" id="planModel"><h4>One way to plan it</h4>\n        <p style="margin:0 0 6px;font-size:.92rem;"><b>Topic:</b> a weekend away (B1).</p>\n        <p style="margin:0 0 6px;font-size:.92rem;"><b>Lead-in:</b> three photos of short trips (a city, a beach, a cabin in the woods). Pairs: which would you choose, and why? Two minutes, then a few answers.</p>\n        <p style="margin:0 0 6px;font-size:.92rem;"><b>Preparing to speak:</b> a minute to think about their last trip away: where, how they got there, the best and the worst moment. Notes, not full sentences.</p>\n        <p style="margin:0 0 6px;font-size:.92rem;"><b>Useful language:</b> “The best part was…”, “It turned out to be…”, “If I went again, I’d…”, on the board and said once or twice; not taught as new grammar.</p>\n        <p style="margin:0 0 6px;font-size:.92rem;"><b>Speaking task:</b> groups of three. Each tells the story of their trip; the others ask two follow-up questions each. Then the group picks the trip they would most like to go on and tells the class why.</p>\n        <p style="margin:0 0 6px;font-size:.92rem;"><b>Feedback / error correction:</b> content first (which trip won, and why), then four or five sentences heard during the task on the board, some good and some to fix, corrected in groups.</p>\n        <p style="margin:0;font-size:.92rem;">Check yours the same way: the lead-in opens the task’s topic, and the useful language is what the task needs.</p>\n      </div>'),
    ('functional-language', '      <ul class="checklist"><li>Can you pass me the salt?</li><li>Would you be so kind as to pass me the salt, please?</li><li>Pass the salt, please.</li><li>Salt.</li><li>Could you pass me the salt?</li><li>Would you mind passing the salt?</li></ul>\n      <textarea class="write-area" rows="3" placeholder="Your notes..."></textarea>',
     '      <ul class="checklist"><li>Can you pass me the salt?</li><li>Would you be so kind as to pass me the salt, please?</li><li>Pass the salt, please.</li><li>Salt.</li><li>Could you pass me the salt?</li><li>Would you mind passing the salt?</li></ul>\n      <textarea class="write-area" rows="3" placeholder="Your notes..."></textarea>\n      <div class="btn-row"><button class="btn secondary" onclick="toggleReveal(\'keyReq\',this)">Reveal answer</button></div>\n      <div class="reveal-block" id="keyReq"><h4>Points to cover</h4>\n        <p><b>Formality.</b> From “Salt.” (family only, and abrupt even there) through “Pass the salt, please.” and “Can you pass me the salt?” (everyday, neutral) to “Could you…?”, “Would you mind passing…?” and “Would you be so kind as to…?” (more polite and more distant; among friends the last one can sound sarcastic).</p>\n        <p><b>Appropriacy.</b> Who is asking whom, and how big the favour is, decide the choice. Passing the salt is a small favour, so the most formal ones sound odd at a family table.</p>\n        <p><b>Tone.</b> Intonation and “please” carry politeness as much as the words do. A flat “Could you pass the salt” can still sound rude.</p>\n        <p><b>Form and the answer.</b> “Would you mind” takes <i>-ing</i>, and you agree by saying no: “No, not at all.”</p>\n        <p><b>In class.</b> Put the six on a cline from least to most polite; learners place them. Then give situation cards (your brother, your manager, a stranger on a train) and they choose which to use, and say it.</p>\n      </div>'),
    ('eliciting-and-ccqs', 'const words = [\'intelligent\',\'hard working\',\'diligent\',\'clever\',\'funny\',\'has a good sense of humour\',\'laugh\',\'forget\',\'self-centred\',\'cool\',\'happy\',\'kind\'];\nconst wordArea = document.getElementById(\'wordArea\');\nwords.forEach((w,i)=>{\n  const pairIdx = Math.floor(i/2);\n  const d = document.createElement(\'div\'); d.className=\'word-card\';\n  d.innerHTML = \'<div class="wname">\'+w+\' <span class="pair-tag">Pair \'+(pairIdx+1)+\'</span></div>\'+\n    \'<label>How would you elicit it?</label><textarea class="write-area" rows="2" placeholder="Which technique, and what would you say/do?"></textarea>\'+\n    \'<label>Your CCQ</label><textarea class="write-area" rows="1" placeholder="Write one CCQ..."></textarea>\';\n  wordArea.appendChild(d);\n});',
     '/* each word carries one way to elicit it and a CCQ, behind Reveal answer (Ramy, 26 Oct 2026: "click to\n   reveal answer for anything that is not already answered in the activity"); one way among several */\nconst words = [\n  [\'intelligent\',\'<b>Definitions:</b> “She understands difficult ideas quickly and learns fast. She’s very…”\',\'Does an intelligent person understand things quickly? (Yes.) Is it about being kind or about using your mind? (Your mind.)\'],\n  [\'hard working\',\'<b>An anecdote:</b> a friend who starts work at seven, stays late and never stops. “She’s very…”\',\'Does a hard-working person do a lot of work? (Yes.) Are they lazy? (No.)\'],\n  [\'diligent\',\'<b>Antonyms / Synonyms:</b> “A more formal word for a hard-working, careful student.”\',\'Does a diligent student do their work carefully? (Yes.) Do they do it fast and badly? (No.) Is it formal or informal? (Fairly formal.)\'],\n  [\'clever\',\'<b>Drawing pictures:</b> a child solving a puzzle the adults can’t, with a light bulb over her head.\',\'Is clever a good thing? (Usually, yes.) Is it about the body or the mind? (The mind.) Is it more or less formal than intelligent? (Less.)\'],\n  [\'funny\',\'<b>Acting out — gestures &amp; mime:</b> tell a joke, then laugh. “My friend tells jokes all the time. He’s really…”\',\'Does a funny person make you laugh? (Yes.)\'],\n  [\'has a good sense of humour\',\'<b>Unfinished sentences:</b> “She doesn’t tell many jokes, but she loves them and laughs a lot. She has a good…”\',\'Does she enjoy jokes and funny things? (Yes.) Does she have to tell jokes herself? (No, not necessarily.)\'],\n  [\'laugh\',\'<b>Acting out — gestures &amp; mime:</b> laugh out loud at something on your phone.\',\'Do you make a sound when you laugh? (Yes.) Is it because something is funny or sad? (Funny.)\'],\n  [\'forget\',\'<b>Gap-fill exercises:</b> “I got to class and realised I’d ___ my homework at home. I didn’t remember it.”\',\'Did I remember my homework? (No.) Was it in my head at that moment? (No.)\'],\n  [\'self-centred\',\'<b>An anecdote:</b> a dinner where one guest talked only about himself all evening and asked nobody a question.\',\'Does he think much about other people? (No, not much.) Is it a positive or a negative word? (Negative.)\'],\n  [\'cool\',\'<b>Use visuals:</b> a photo of someone in sunglasses and a smart jacket. “Do you like his style? He looks…”\',\'Is cool about the temperature here? (No.) Is it positive or negative? (Positive.) Would you write it in a job application? (No, it’s informal.)\'],\n  [\'happy\',\'<b>Use visuals:</b> a photo of a smiling child with a birthday cake.\',\'Does she feel good or bad? (Good.)\'],\n  [\'kind\',\'<b>An anecdote:</b> a stranger who carried an old woman’s shopping up three flights of stairs.\',\'Does a kind person help other people? (Yes.) Is it about being clever or being nice to people? (Being nice.)\']\n];\nconst wordArea = document.getElementById(\'wordArea\');\nwords.forEach(([w,how,ccq],i)=>{\n  const pairIdx = Math.floor(i/2);\n  const d = document.createElement(\'div\'); d.className=\'word-card\';\n  d.innerHTML = \'<div class="wname">\'+w+\' <span class="pair-tag">Pair \'+(pairIdx+1)+\'</span></div>\'+\n    \'<label>How would you elicit it?</label><textarea class="write-area" rows="2" placeholder="Which technique, and what would you say/do?"></textarea>\'+\n    \'<label>Your CCQ</label><textarea class="write-area" rows="1" placeholder="Write one CCQ..."></textarea>\'+\n    \'<div class="btn-row"><button class="btn secondary" onclick="revealRow(this)">Reveal answer</button></div>\'+\n    \'<div class="reveal-card" style="cursor:default;margin-top:8px;"><div class="a"><b>One way to elicit it.</b> \'+how+\'<br><b>CCQs:</b> \'+ccq+\'</div></div>\';\n  wordArea.appendChild(d);\n});'),
]
for _slug, _old, _new in _REVEAL:
    ALIAS.setdefault(_slug, []).append((_old, _new))


# TASKS, NOT TELLING, AND LONGER SESSIONS (Ramy, 26 Oct 2026: "we always train them that they should elicit answers
# from the students. So we do the same thing with them ... turn it into a task"; "input sessions are 1 hour 15,
# 1 hour 30 minutes"; then "build all of them"). A part that only told trainees something asks them first, with the
# content behind Reveal answer; the shorter sessions gain a task.
_TASKS = [
    ('guided-to-less-guided-practice', 're:<div class="cue-instruction">Say goodbye\\.</div>\\s*<input type="text" placeholder="Write your line\\.\\.\\.">\\s*</div>\\s*</div>',
     '<div class="cue-instruction">Say goodbye.</div>\n        <input type="text" placeholder="Write your line...">\n      </div>\n    </div>\n    <!-- a model behind a reveal (Ramy, 26 Oct 2026: "click to reveal answer for anything that is not already answered") -->\n    <div class="btn-row"><button class="btn secondary" type="button" onclick="this.textContent=document.getElementById(\'phoneModel\').classList.toggle(\'shown\')?\'Hide answer\':\'Reveal answer\'">Reveal answer</button></div>\n    <div class="reveal-block" id="phoneModel"><h4>One way it could go</h4>\n      <p><b>A:</b> Hi, it’s Lina. How are you?<br><b>B:</b> Oh, hi Lina! I’m good, thanks. And you?<br>\n      <b>A:</b> Fine, thanks. What are you doing at the weekend? There’s a jazz concert on Saturday. Would you like to come?<br>\n      <b>B:</b> I’d love to, but I can’t on Saturday. I’m going to help my brother move house.<br>\n      <b>A:</b> Oh, OK. What about Sunday afternoon?<br><b>B:</b> Sorry, I’ve got a family lunch on Sunday. How about some time next month?<br>\n      <b>A:</b> I can’t next month, I’m afraid. I’m going abroad for work. What about a Friday evening?<br>\n      <b>B:</b> Friday’s great. Shall we meet at the café by the station at seven?<br><b>A:</b> Perfect. See you then. Bye!</p>\n      <p>Any lines that do the same jobs are right: inviting, refusing with a reason, suggesting another time, arranging, and <i>going to</i> for plans.</p>\n    </div>'),
    ('guided-to-less-guided-practice', 're:<div class="stage-title">More meaningful drills <span class="badge">Presentation</span></div>',
     '<div class="stage-title">More meaningful drills <span class="badge">Read, then make it meaningful</span></div>'),
    ('guided-to-less-guided-practice', 're:<div class="dialogue-line"><span class="who">L:</span> Do you need special equipment\\? \\.\\.\\.and so on\\.</div>\\s*</div>',
     '<div class="dialogue-line"><span class="who">L:</span> Do you need special equipment? ...and so on.</div>\n      </div>\n\n      <p class="lead" style="margin-top:18px;"><b>Your turn: make it meaningful.</b> Each drill below works, but nobody finds out anything about anyone. In pairs, turn each one into a meaningful drill, using one of the four ideas above.</p>\n      <div class="text-block">\n        <div class="dialogue-line"><b>1.</b> <span class="who">T:</span> buy a kettle <span class="who">L:</span> Have you bought a kettle yet? <i>(round the class, one prompt each)</i></div>\n        <div class="dialogue-line"><b>2.</b> <span class="who">T:</span> cook, last night <span class="who">L:</span> What did you cook last night? <i>(repeated after the teacher)</i></div>\n        <div class="dialogue-line"><b>3.</b> <span class="who">T:</span> swim <span class="who">L:</span> I can swim. <i>(each learner, one verb each)</i></div>\n      </div>\n      <textarea class="write-area" rows="2" placeholder="Drill 1, made meaningful..."></textarea>\n      <textarea class="write-area" rows="2" placeholder="Drill 2..."></textarea>\n      <textarea class="write-area" rows="2" placeholder="Drill 3..."></textarea>\n      <div class="btn-row"><button class="btn secondary" type="button" onclick="this.textContent=document.getElementById(\'drillKey\').classList.toggle(\'shown\')?\'Hide answer\':\'Reveal answer\'">Reveal answer</button></div>\n      <div class="reveal-block" id="drillKey"><h4>One way each</h4>\n        <p><b>1. An imaginary scenario.</b> “I’ve just moved into a flat with no money, so I’m buying things slowly.” The class asks “Have you bought a kettle yet?”, and the teacher answers from a list only she can see, until they find the three things she still needs.</p>\n        <p><b>2. A guessing drill.</b> One learner thinks of what they really ate last night; the others ask yes or no questions (“Did you cook pasta?”, “Did you eat out?”) until someone gets it.</p>\n        <p><b>3. Find someone who.</b> Each learner has six skills on a card (whistle, juggle, ride a horse…) and asks round the class, “Can you whistle?”, to find a name for each.</p>\n        <p>What makes each one meaningful: there is something to find out, and the answer is real.</p>\n      </div>'),
    ('writing-the-lesson-plan', 're:<h2>Recap</h2>\\s*<div class="recap">.*?Every problem gets a real solution</li>\\s*</ul></div>\\s*</div>',
     '<h2>Fix this plan</h2>\n    <p class="lead">A trainee wrote this for a B1 vocabulary lesson. It breaks at least six of the things you have looked at today. In pairs, find each problem and rewrite the line.</p>\n    <div class="card"><div class="body"><b>Main aim:</b> To teach vocabulary.\n<b>Personal aim:</b> To be more confident.\n<b>Lead-in</b> · 5 min · T–S: The teacher will show some pictures and the students will talk about them.\n<b>Clarification</b> · 15 min: Teach the words. CCQs.\n<b>Practice</b> · 10 min · PW / GW / OC: Gap-fill.\n<b>Anticipated problem</b> (on the lesson plan): Students may not know how to pronounce “cupboard”. <b>Solution:</b> Help them.</div></div>\n    <textarea class="write-area" rows="3" placeholder="The problems you found..."></textarea>\n    <textarea class="write-area" rows="4" placeholder="Your rewrite..."></textarea>\n    <div class="btn-row"><button class="btn secondary" type="button" onclick="this.textContent=document.getElementById(\'fixKey\').classList.toggle(\'shown\')?\'Hide answer\':\'Reveal answer\'">Reveal answer</button></div>\n    <div class="reveal-block" id="fixKey"><h4>Six problems, and one way to fix each</h4>\n      <p><b>1. The main aim names nothing.</b> Which words, and in what context? “To clarify and practise eight words for kitchen objects (kettle, cupboard, sink…) in the context of moving into a new flat.”</p>\n      <p><b>2. The personal aim can’t be checked</b>, and doesn’t come from an action point. “To check my instructions with an ICQ before I hand out the gap-fill (TP2 action point).”</p>\n      <p><b>3. The lead-in is prose about the teacher</b>, not instructions to follow. “Show four photos of kitchens. Ss in pairs: which kitchen would you like, and why? 2 min. OCFB: take two answers.”</p>\n      <p><b>4. “Teach the words. CCQs.” is a summary.</b> Write out which words, how each one is clarified, and the CCQs themselves.</p>\n      <p><b>5. Three interaction patterns for one stage</b>, and no instructions. “Ss do the gap-fill alone (Ind), check in pairs (PW). OCFB.” One pattern per step, honestly recorded.</p>\n      <p><b>6. The problem is on the wrong sheet</b>, and “help them” is not a solution. Pronunciation goes on the Language Analysis sheet, with the stress and the sounds marked. A lesson-plan problem would be: “Ss finish the gap-fill at different times. Solution: early finishers write two sentences of their own with the words.”</p>\n      <h4 style="margin-top:12px;">The checklist to keep</h4>\n      <p><b>Aims:</b> name the skill or the language exactly; always give the context; vocabulary aims list the items; personal aims come from your last action points. <b>Procedure:</b> bullet points and imperative verbs; write the instruction out; clear who does what, and for how long; a colleague could teach from it. <b>Interaction:</b> one pattern per stage, honestly recorded (Ind · PW · GW · T–S · S–S · OC · OCFB). <b>Anticipated problems:</b> management, tasks, tech and timing on the plan; meaning, form and pronunciation on the LA sheet; every problem gets a real solution.</p>\n    </div>\n  </section>\n\n  <section id="s6">\n    <h2>Your turn: write two stages</h2>\n    <p class="lead">A page from a made-up coursebook. Plan the first two stages of a reading lesson from it, a lead-in and a gist task, the way you would on your plan. Then swap with another pair and check theirs against today’s four decisions.</p>\n    <div class="card"><div class="body"><b>Unit 4 · Night work (B1)</b>\nA magazine article, about 350 words: “The baker who never sees the sun”, about a man who starts work at eleven at night in a city bakery. A photo of him at work, the street dark outside.\n<b>Exercise 1.</b> Would you like to work at night? Why, or why not?\n<b>Exercise 2.</b> Read the article quickly. Which sentence is the best summary? (three options)</div></div>\n    <textarea class="write-area" rows="2" placeholder="Main aim..."></textarea>\n    <textarea class="write-area" rows="5" placeholder="Stage 1, lead-in: stage aim, procedure, interaction, time..."></textarea>\n    <textarea class="write-area" rows="5" placeholder="Stage 2, gist: stage aim, procedure, interaction, time..."></textarea>\n    <div class="btn-row"><button class="btn secondary" type="button" onclick="this.textContent=document.getElementById(\'stageKey\').classList.toggle(\'shown\')?\'Hide answer\':\'Reveal answer\'">Reveal answer</button></div>\n    <div class="reveal-block" id="stageKey"><h4>One way to write it</h4>\n      <p><b>Main aim:</b> To give practice in reading for gist and for specific information, in the context of a magazine article about a baker who works at night.</p>\n      <p><b>Lead-in</b> · to raise interest in the topic and get ideas about night work · 5 min<br>• Show the photo. Ask: “What time is it? What’s his job?” (T–S)<br>• Ss in pairs: would you like to work at night? Why, or why not? 2 min. (PW)<br>• Take two or three answers. (OCFB)</p>\n      <p><b>Gist</b> · to give practice in reading for gist · 5 min<br>• Instruction: “Read the article quickly. Which sentence is the best summary? You have two minutes.”<br>• ICQs: “Do you read every word?” (No.) “How long have you got?” (Two minutes.)<br>• Ss read alone, 2 min. (Ind) Check in pairs, 1 min. (PW)<br>• Nominate one pair: which summary, and why? (OCFB)</p>\n      <p>Check theirs: is the aim exact, with a context? Bullet points and imperatives? Could a colleague teach it? One pattern per step?</p>\n    </div>'),
    ('teaching-speaking', 're:<div class="divider"><span>sorting</span></div>',
     '<div class="divider"><span>do it first</span></div>\n\n  <!-- the loop the session promises, done before anything is named (Ramy, 26 Oct 2026: sessions run 75 minutes to\n       two hours, and trainees do, then name) -->\n  <section id="s1b">\n    <div class="card">\n      <div class="stage-title">Do it first: the end-of-course party <span class="badge">A speaking task, as learners</span></div>\n      <p class="lead">Be the students for fifteen minutes. Your tutor runs it; follow the steps.</p>\n      <ol class="checklist" style="list-style:decimal;padding-left:22px;">\n        <li><b>One minute, in pairs.</b> What was the best party you have ever been to? What made it good?</li>\n        <li><b>Two minutes, on your own.</b> Your class has €200 for an end-of-course party. Note one idea each for: where, food, and one thing to do. Notes only, no sentences.</li>\n        <li><b>Language that might help.</b> How about…? · I’d rather… · That’s a good idea, but… · Why don’t we…? · OK, let’s go for…</li>\n        <li><b>Five minutes, in groups of three.</b> Agree on one party for the whole class. Everyone has to agree, and you must stay within €200.</li>\n        <li><b>Each group</b> tells the room its plan. The room votes. Then your tutor puts a few sentences heard during the task on the board, and you put them right together.</li>\n      </ol>\n      <textarea class="text-area" rows="3" placeholder="Your group\'s plan..."></textarea>\n      <p class="lead" style="margin-top:12px;">Keep this task in mind. Parts 5 and 6 come back to it.</p>\n    </div>\n  </section>\n\n  <div class="divider"><span>sorting</span></div>'),
    ('teaching-speaking', 're:<div class="stage-title">The productive skills shape <span class="badge">The framework</span>(<span class="time">[^<]*</span>)?</div>.*?if students lack essential vocabulary\\.</p>',
     '<div class="stage-title">The productive skills shape <span class="badge">Name it, then reveal</span></div>\n      <p class="lead">The party task, and the twelve stages you just ordered, fall into five bigger stages. In pairs, before you look: name the five, and say what each one is for. The same shape works for writing.</p>\n      <textarea class="text-area" rows="5" placeholder="1. ... 2. ... 3. ... 4. ... 5. ..."></textarea>\n      <div class="btn-row"><button class="btn secondary" type="button" onclick="this.textContent=document.getElementById(\'shapeKey\').classList.toggle(\'shown\')?\'Hide answer\':\'Reveal answer\'">Reveal answer</button></div>\n      <div class="reveal-box" id="shapeKey"><h4>The five stages</h4>\n      <p style="margin:0 0 10px;font-size:.92rem;">Main aim: <b>to practise oral (or written) fluency in the context of ___</b>. Stages are chosen as needed; not every lesson needs all five.</p>\n      <table class="framework">\n        <tr><th>Lead-in</th><td>Activates what students already know about the topic and raises interest. (The best party you’ve been to.)</td></tr>\n        <tr><th>Preparing to speak/write</th><td>Generates ideas: time to brainstorm, make notes and think about what to say. May include reading or listening to a model of the task. (Your notes on the €200 party.)</td></tr>\n        <tr><th>Useful language</th><td>Language they may find useful. <b>This is not target language.</b> It helps; they don’t have to use it. (How about…? I’d rather…)</td></tr>\n        <tr><th>Speaking/writing task</th><td>Develops fluency through the task itself. (Agree on one party within budget.)</td></tr>\n        <tr><th>Feedback / error correction</th><td>Content and outcome first, then generic errors. (The vote, then the sentences on the board.)</td></tr>\n      </table>\n      <p style="margin:0;font-size:.92rem;">Add a pre-teaching stage before the shape if students lack essential vocabulary.</p>\n      </div>'),
    ('teaching-speaking', 're:<div class="stage-title">Key takeaways( <span class="time">[^<]*</span>)?</div>\\s*<ul class="checklist">.*?</ul>',
     '<div class="stage-title">Key takeaways <span class="badge">Yours first</span></div>\n      <p class="lead">Write down the three things from today you will use in your next speaking lesson. Then compare with ours.</p>\n      <textarea class="text-area" rows="3" placeholder="1. ... 2. ... 3. ..."></textarea>\n      <div class="btn-row"><button class="btn secondary" type="button" onclick="this.textContent=document.getElementById(\'takeKey\').classList.toggle(\'shown\')?\'Hide answer\':\'Reveal answer\'">Reveal answer</button></div>\n      <div class="reveal-box" id="takeKey"><h4>Ours</h4>\n      <ul class="checklist" style="margin:0;">\n        <li>Free (fluency) speaking and controlled (accuracy) speaking need different staging and different teacher roles.</li>\n        <li>A good fluency task is purposeful, has a clear context, and gives every student a chance to speak.</li>\n        <li>“Useful language” helps students; it is never target language they must use.</li>\n        <li>Feedback on a speaking task covers content first, then generic errors.</li>\n        <li>Not every stage of the productive skills shape is needed every time; choose as necessary.</li>\n      </ul></div>'),
    ('receptive-skills', 're:<p class="lead">The staging is fixed; the tasks inside it are not\\. A bank to plan from, by stage\\. It is nowhere near complete\\.</p>\\s*<div class="types">',
     '<p class="lead">The staging is fixed; the tasks inside it are not. Before you see the bank: which stage does each of these tasks belong to? Decide in pairs.</p>\n  <style>\n    #typeSort .ts-row{display:grid; grid-template-columns:1fr 170px; gap:12px; align-items:center; padding:8px 0; border-bottom:1px solid var(--row-line); font-size:.92rem;}\n    #typeSort select{font:600 .86rem Karla,sans-serif; padding:6px 8px; border:1.5px solid var(--sand-line); border-radius:var(--r-control); background:var(--field); color:var(--ink);}\n    #typeSort select.ok{border-color:var(--teal);} #typeSort select.no{border-color:var(--brick);}\n    #typesBox{display:none;} #typesBox.shown{display:grid;}\n    @media(max-width:560px){ #typeSort .ts-row{grid-template-columns:1fr; gap:4px;} }\n  </style>\n  <div id="typeSort"><div class="ts-row"><span>1. Tick the topics that are mentioned</span><select data-k="g"><option value="">Which stage?</option><option value="b">Before the text</option><option value="g">Gist</option><option value="d">Detail</option><option value="a">After the text</option></select></div><div class="ts-row"><span>2. Discuss what students already know about the topic</span><select data-k="b"><option value="">Which stage?</option><option value="b">Before the text</option><option value="g">Gist</option><option value="d">Detail</option><option value="a">After the text</option></select></div><div class="ts-row"><span>3. A role play built on the text</span><select data-k="a"><option value="">Which stage?</option><option value="b">Before the text</option><option value="g">Gist</option><option value="d">Detail</option><option value="a">After the text</option></select></div><div class="ts-row"><span>4. True or false questions</span><select data-k="d"><option value="">Which stage?</option><option value="b">Before the text</option><option value="g">Gist</option><option value="d">Detail</option><option value="a">After the text</option></select></div><div class="ts-row"><span>5. Look at pictures and predict what the text will be about</span><select data-k="b"><option value="">Which stage?</option><option value="b">Before the text</option><option value="g">Gist</option><option value="d">Detail</option><option value="a">After the text</option></select></div><div class="ts-row"><span>6. Choose the best title for the text</span><select data-k="g"><option value="">Which stage?</option><option value="b">Before the text</option><option value="g">Gist</option><option value="d">Detail</option><option value="a">After the text</option></select></div><div class="ts-row"><span>7. Fill in a table with information from the text</span><select data-k="d"><option value="">Which stage?</option><option value="b">Before the text</option><option value="g">Gist</option><option value="d">Detail</option><option value="a">After the text</option></select></div><div class="ts-row"><span>8. Discuss the same situation in their own lives</span><select data-k="a"><option value="">Which stage?</option><option value="b">Before the text</option><option value="g">Gist</option><option value="d">Detail</option><option value="a">After the text</option></select></div><div class="ts-row"><span>9. Put the paragraphs in order</span><select data-k="g"><option value="">Which stage?</option><option value="b">Before the text</option><option value="g">Gist</option><option value="d">Detail</option><option value="a">After the text</option></select></div><div class="ts-row"><span>10. An inference task: reading between the lines</span><select data-k="d"><option value="">Which stage?</option><option value="b">Before the text</option><option value="g">Gist</option><option value="d">Detail</option><option value="a">After the text</option></select></div><div class="ts-row"><span>11. Pre-teach the words the tasks depend on, and only those</span><select data-k="b"><option value="">Which stage?</option><option value="b">Before the text</option><option value="g">Gist</option><option value="d">Detail</option><option value="a">After the text</option></select></div><div class="ts-row"><span>12. A writing task that grows out of the text</span><select data-k="a"><option value="">Which stage?</option><option value="b">Before the text</option><option value="g">Gist</option><option value="d">Detail</option><option value="a">After the text</option></select></div></div>\n  <div class="btn-row"><button class="btn secondary" type="button" onclick="var t=document.getElementById(\'typesBox\'),on=t.classList.toggle(\'shown\');document.querySelectorAll(\'#typeSort select\').forEach(function(s){s.classList.toggle(\'ok\',on&&s.value===s.dataset.k);s.classList.toggle(\'no\',on&&!!s.value&&s.value!==s.dataset.k);});this.textContent=on?\'Hide answer\':\'Reveal answer\'">Reveal answer</button></div>\n  <p class="lead" style="margin-top:12px;">Behind the answer: the whole bank, by stage, to plan from. It is nowhere near complete.</p>\n  <div class="types" id="typesBox">'),
    ('lesson-framework', 're:<div\\ class="fw\\-grid">.*?<h3>Productive Skills</h3>\\s*<ol>.*?</ol>\\s*</div>\\s*</div>',
     '<p class="lead" style="margin:0 0 12px;">Six lesson shapes. Before you look: in pairs, write the stages of each one, in order, as far as you know them. Then reveal.</p>\n    <style>\n      #fwGrid .fw-guess{width:100%; box-sizing:border-box; margin:6px 0 0; font:inherit; font-size:.86rem; padding:8px 10px; border:1.5px solid var(--sand-line); border-radius:var(--r-control); background:var(--field); resize:vertical;}\n      #fwGrid ol{display:none;} #fwGrid.shown ol{display:block;}\n      @media print{ #fwGrid ol{display:none !important;} }\n    </style>\n    <div class="fw-grid" id="fwGrid">\n      <div class="fw-card ppp"><div class="pin"></div>\n        <h3>PPP</h3>\n        <textarea class="fw-guess" rows="4" placeholder="The stages, in order..."></textarea>\n        <ol><li>Lead-in</li><li>Present (meaning, form, pron.)</li><li>Practice (accuracy)</li><li>Production (fluency)</li><li>Error correction</li></ol>\n      </div>\n      <div class="fw-card ttt"><div class="pin"></div>\n        <h3>Test-Teach-Test</h3>\n        <textarea class="fw-guess" rows="4" placeholder="The stages, in order..."></textarea>\n        <ol><li>Lead-in</li><li>First test (diagnostic)</li><li>Teach (clarify gaps)</li><li>Second test</li><li>Feedback</li></ol>\n      </div>\n      <div class="fw-card text"><div class="pin"></div>\n        <h3>Text-Based</h3>\n        <textarea class="fw-guess" rows="4" placeholder="The stages, in order..."></textarea>\n        <ol><li>Lead-in / build context</li><li>Reading or listening task</li><li>Highlight target language</li><li>Clarify TL</li><li>Practice</li><li>Feedback</li></ol>\n      </div>\n      <div class="fw-card practice"><div class="pin"></div>\n        <h3>Language Practice</h3>\n        <textarea class="fw-guess" rows="4" placeholder="The stages, in order..."></textarea>\n        <ol><li>Lead-in (optional)</li><li>Set up</li><li>Controlled practice</li><li>Freer practice</li><li>Feedback</li></ol>\n      </div>\n      <div class="fw-card receptive"><div class="pin"></div>\n        <h3>Receptive Skills</h3>\n        <textarea class="fw-guess" rows="4" placeholder="The stages, in order..."></textarea>\n        <ol><li>Lead-in</li><li>(Prediction task)</li><li>Pre-teach vocab</li><li>Gist, then detail, then specific information</li><li>Post-task response</li></ol>\n      </div>\n      <div class="fw-card productive"><div class="pin"></div>\n        <h3>Productive Skills</h3>\n        <textarea class="fw-guess" rows="4" placeholder="The stages, in order..."></textarea>\n        <ol><li>Lead-in</li><li>Preparing to write/speak</li><li>Useful language (optional)</li><li>Speaking/writing task</li><li>Feedback</li></ol>\n      </div>\n    </div>\n    <div class="btn-row"><button class="btn secondary" type="button" onclick="this.textContent=document.getElementById(\'fwGrid\').classList.toggle(\'shown\')?\'Hide answer\':\'Reveal answer\'">Reveal answer</button></div>'),
    ('teaching-exam-classes', 're:<div class="stage-title">Climb the CEFR ladder <span class="badge">Explore</span>(<span class="time">[^<]*</span>)?</div>\\s*<p class="lead">.*?</p>\\s*<div class="ladder" id="ladder"></div>',
     '<div class="stage-title">Climb the CEFR ladder <span class="badge">Place them, then reveal</span></div>\n      <p class="lead">Every exam in this session sits somewhere on this ladder. First, in pairs: which level is each of these learners?</p>\n      <style>\n        #cefrGuess .cg-row{display:grid; grid-template-columns:1fr 110px; gap:12px; align-items:center; padding:8px 0; border-bottom:1px solid var(--row-line); font-size:.92rem;}\n        #cefrGuess select{font:600 .86rem Karla,sans-serif; padding:6px 8px; border:1.5px solid var(--sand-line); border-radius:var(--r-control); background:var(--field); color:var(--ink);}\n        #cefrGuess select.ok{border-color:var(--teal);} #cefrGuess select.no{border-color:var(--brick);}\n      </style>\n      <div id="cefrGuess"><div class="cg-row"><span>1. Can deal with most situations while travelling, and give reasons for an opinion.</span><select data-k="B1"><option value="">Level?</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option></select></div><div class="cg-row"><span>2. Can introduce themselves and ask very simple questions.</span><select data-k="A1"><option value="">Level?</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option></select></div><div class="cg-row"><span>3. Can use the language flexibly at work and in academic study.</span><select data-k="C1"><option value="">Level?</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option></select></div><div class="cg-row"><span>4. Can talk about familiar, routine things in simple sentences.</span><select data-k="A2"><option value="">Level?</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option></select></div><div class="cg-row"><span>5. Can understand virtually everything they hear or read, and express themselves precisely.</span><select data-k="C2"><option value="">Level?</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option></select></div><div class="cg-row"><span>6. Can talk fluently with native speakers and write clear, detailed text.</span><select data-k="B2"><option value="">Level?</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option></select></div></div>\n      <div class="btn-row"><button class="btn secondary" type="button" onclick="var on=this.dataset.on!==\'1\';this.dataset.on=on?\'1\':\'\';document.querySelectorAll(\'#ladder .rung\').forEach(function(r){r.classList.toggle(\'open\',on);});document.getElementById(\'cefrKey\').classList.toggle(\'shown\',on);document.querySelectorAll(\'#cefrGuess select\').forEach(function(s){s.classList.toggle(\'ok\',on&&s.value===s.dataset.k);s.classList.toggle(\'no\',on&&!!s.value&&s.value!==s.dataset.k);});this.textContent=on?\'Hide answer\':\'Reveal answer\'">Reveal answer</button></div>\n      <div class="reveal-block" id="cefrKey"><p>1 B1 · 2 A1 · 3 C1 · 4 A2 · 5 C2 · 6 B2. The whole ladder is open below; click any rung to close it.</p></div>\n      <div class="ladder" id="ladder"></div>'),
    ('teaching-exam-classes', 're:<!-- 5: BE AN EXAMINER -->',
     '<!-- 4b: try it (Ramy, 26 Oct 2026: sessions run 75 minutes to two hours; trainees do, then name) -->\n  <section id="s4b">\n    <div class="card">\n      <div class="stage-title">Try it: a speaking part, as candidates <span class="badge">In threes</span></div>\n      <p class="lead">B2 First Speaking, Part 2: each candidate talks about two photographs for about a minute, then the other answers a short question. In threes: two candidates and an examiner. Then swap, so everyone has a turn in each role.</p>\n      <div style="margin:12px 0 0;padding:14px 18px;border-radius:var(--r-strip);background:var(--paper);border:1px solid var(--sand-line);font-size:.95rem;line-height:1.6;">\n        <b>Photo 1:</b> a group of friends studying together in a busy café. <b>Photo 2:</b> one person studying alone in a quiet library.<br>\n        <b>Candidate A</b>, about one minute: compare the photographs, and say why people might choose to study in these places.<br>\n        <b>Candidate B</b>, about thirty seconds: where do you prefer to study? Why?<br>\n        <b>The examiner</b> keeps the time and notes one strength and one thing to work on for each of the four areas: grammar and vocabulary, discourse management, pronunciation, interactive communication.</div>\n      <p class="lead" style="margin-top:14px;">Then, together: how would you prepare a class for this part? What would you teach first?</p>\n      <textarea class="write-area" rows="3" placeholder="Your ideas..."></textarea>\n      <div class="btn-row"><button class="btn secondary" type="button" onclick="this.textContent=document.getElementById(\'examPrepKey\').classList.toggle(\'shown\')?\'Hide answer\':\'Reveal answer\'">Reveal answer</button></div>\n      <div class="reveal-block" id="examPrepKey"><h4>Ways to prepare a class for it</h4>\n        <p><b>Compare, don’t describe.</b> The commonest mistake is describing each photo in turn. Teach the language of comparing: <i>whereas, while, both… but, in the first one… in the second…</i></p>\n        <p><b>Speculate.</b> <i>They might be…, it looks as if…, I’d imagine…</i> Nobody knows the real answer, so guessing well is the skill.</p>\n        <p><b>Answer the question.</b> The task asks why people choose these places. Learners who only compare run out of time before they answer it.</p>\n        <p><b>Practise to the clock.</b> A phone timer and one minute, again and again, until a minute feels like a minute.</p>\n        <p><b>Examine each other.</b> Learners in threes with the four areas, as you just did; then record a turn and listen back.</p>\n      </div>\n    </div>\n  </section>\n\n  <div class="divider"><span>your future</span></div>\n\n  <!-- 5: BE AN EXAMINER -->'),
    ('teaching-exam-classes', 're:<div class="divider"><span>your future</span></div>\\s*<!-- 4b: try it',
     '<div class="divider"><span>try it</span></div>\n\n  <!-- 4b: try it'),
    ('life-after-celta', 're:<h3>What\\ a\\ post\\-CELTA\\ CV\\ should\\ make\\ obvious\\ in\\ ten\\ seconds</h3>\\s*<ul>.*?</ul>',
     '<h3>Fix this CV</h3>\n    <p>The top of a new teacher’s CV, sent to a school a week after the course. A director of studies gives it ten seconds. In pairs: what would they miss, and how would you fix it?</p>\n    <div style="margin:10px 0 0;padding:14px 18px;border-radius:var(--r-strip);background:var(--paper);border:1px solid var(--sand-line);font-size:.92rem;line-height:1.65;">\n      <b>Lena Fischer</b> · lena.fischer@example.com<br>\n      <b>Profile:</b> Hard-working and enthusiastic person who loves languages and travel.<br>\n      <b>Experience:</b> 2019–2025 Marketing assistant, Hamburg. 2024 Volunteer at a summer camp for 10 to 14-year-olds.<br>\n      <b>Education:</b> BA Communication Studies, 2018.<br>\n      <b>Hobbies:</b> reading, hiking, cooking. Also did a teaching course in October.</div>\n    <textarea class="write-area" rows="3" placeholder="What they\'d miss, and your fix..."></textarea>\n    <div class="btn-row"><button class="btn secondary" type="button" onclick="this.textContent=document.getElementById(\'cvKey\').classList.toggle(\'shown\')?\'Hide answer\':\'Reveal answer\'">Reveal answer</button></div>\n    <div class="reveal-block" id="cvKey">\n      <p><b>The CELTA is hidden under her hobbies</b>, and not even named. It goes near the top, in full. Her teaching (levels, assessed hours, the age group, in person or online) is missing, and so are the coursebooks. What transfers is not drawn out either: German as a first language, years of presenting and writing for an audience in marketing, and the summer camp, which is experience with young learners. The profile could be anyone’s.</p>\n      <h4>What a post-CELTA CV should make obvious in ten seconds</h4>\n    <ul>\n      <li><b>The qualification</b>, in full: Cambridge CELTA, the centre, the date. Put it near the top, not at the bottom under hobbies.</li>\n      <li><b>What you actually taught</b>: the levels, the number of assessed hours, the age group, whether it was in-person or online. "Six assessed hours across A1–B2 adult groups" says far more than "completed teaching practice".</li>\n      <li><b>Coursebooks you\'ve handled</b>. Make a note of them before you forget — you will be asked.</li>\n      <li><b>Anything else that transfers</b>: other languages you speak, previous work with children or in training, admin or tech skills.</li>\n      <li><b>One page</b> if you can, two at most. Clean, no photo unless the country expects it.</li>\n    </ul>\n    </div>'),
    ('phonology-sounds', "{word:'vowel', letters:5, sounds:[4]}",
     "{word:'vowel', letters:5, sounds:[3,4]}"),
]
for _slug, _old, _new in _TASKS:
    ALIAS.setdefault(_slug, []).append((_old, _new))
