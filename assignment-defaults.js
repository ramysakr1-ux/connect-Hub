// The assignments Connect Lite ships with.
// © 2026 Ramy Sakr. All rights reserved.
//
// Shared by screens 8, 9, 10, 11 and 12. Screen 8 is where a centre rewrites
// them; the others fall back to these when the browser holds no saved wording.
//
// These are COMPLETE assignments, not a skeleton -- the brief, what to write
// under each heading, the reading text, the criteria, the recommended reading
// and the declaration (Ramy, 25 Sep 2026: "it's like Connect Lite's default
// assignments and could be duplicated or the centre can write their own but
// they come with the package"). They are IH Istanbul's four, as set on C/17
// 2026, copied word for word from the centre's own documents, with three
// things reworded because the mechanism here is not a Word file:
//
//   1. "Use the white boxes" / "Use the blue boxes" -- on paper the two rounds
//      are two colours of box in one document. Here they are two rounds the app
//      runs and the candidate never picks, so the line says what the app does.
//   2. "Attach it as Appendix 2, laid out as a handout" -- there are no
//      appendices; a candidate attaches materials to the submission. The
//      appendix NUMBERS stay, because the briefs refer to them.
//   3. "submitted through Google Classroom" becomes submitted here.
//
// Two things are left exactly as the centre wrote them, and both are worth
// knowing before anyone copies them into another centre's course:
//
//   - "You must pass 3 of 4 assignments to be eligible for a PASS." The
//     Administration Handbook (11.6) requires all four, with the resubmission
//     chance. Three of four is not the rule. It is the centre's wording.
//   - The word count is a submission requirement, never a criterion -- which
//     is what the syllabus does too (Component 2). The criteria themselves are
//     the syllabus's own words, assignments 2.1-2.4.
//
// The three reading texts in the skills assignment are VOA Learning English,
// which states its texts are in the public domain and may be reprinted with
// credit; the credit line travels with each text.
//
// Trimmed the same afternoon (Ramy: "it's all too washed, it's just too much,
// too many words... I meant the grammar items, the functional exponents, the
// vocab items, the texts, but not all that writing"). What stays word for word:
// the letter, the class profile, the three texts, the items, the table rows,
// the reading lists, the declaration. What went: the "Referencing and use of
// AI" block on every assignment (the declaration already says it), the
// submission-requirements table restated in prose, and the "What to do / What
// to write" labels over bullets that the section heading already introduces.
// The bullets themselves are the assignment and stay.
//
// Cambridge makes the centre responsible for designing its four assignments,
// so every word here is meant to be rewritten on screen 8 by a centre that
// wants its own. That is the point of shipping them: a course that changes
// nothing still has four real assignments on day one.
window.CONNECT_HUB_DEFAULT_WORDING = {
  lrt: {
    "title": "Language Related Tasks",
    "wordMin": 750,
    "wordMax": 1000,
    "format": "structured",
    "criteria": [
      {
        "text": "Analysing language correctly for teaching purposes",
        "sectionIndex": null
      },
      {
        "text": "Correctly using terminology relating to form, meaning and phonology when analysing language",
        "sectionIndex": null
      },
      {
        "text": "Accessing reference materials and referencing information they have learned about language to an appropriate source",
        "sectionIndex": null
      },
      {
        "text": "Using written language that is clear, accurate and appropriate to the task",
        "sectionIndex": null
      }
    ],
    "sections": [
      {
        "type": "text",
        "label": "Before you start",
        "body": "Choose four items from the letter below — one grammar structure, one functional exponent, and two vocabulary items — and analyse each one: meaning, form, pronunciation and use, and what learners will find difficult. Analyse only the words in bold.\n\n750–1,000 words, not counting the letter. Research every item and name your sources, with a page number where you can. Passing on first or second submission does not affect your certificate grade.",
        "readonly": true
      },
      {
        "type": "text",
        "label": "The text — A letter from a friend abroad",
        "readonly": true,
        "body": "The target language is in bold.\n\nDear Marta,\n\nHow are you? Sorry it’s taken me so long to write — things have been hectic since the move. I can’t quite believe I’ve now been living in Lisbon for nearly a year!\n\nEverything’s going really well. I started at the language school in September and I’m teaching four classes. My **flatmates** are great — both Portuguese, both very patient with my terrible accent — and they’ve really helped me **settle in**.\n\nThe flat is tiny but it’s five minutes from the river, so I’m not complaining. I **’ve tried** surfing twice now, which was harder than it looks, and I’ve finally learned to order coffee without pointing at things.\n\nSome news: my brother’s coming over at Easter. He**’s staying** for two weeks, so we’re planning a trip down to the Algarve.\n\nAnd congratulations on the new job! Rui told me you’d been offered it back in March and didn’t say a word to anyone for a fortnight. You **must have been** in shock — you’d been after that role for years. Rui says you’re absolutely **delighted**. **Let’s talk properly soon**; I want to hear everything.\n\nAnyway, I should go — I’ve got marking to do and I’ve been putting it off all evening.\n\nWrite back when you can.\n\nLove,\nDeniz"
      },
      {
        "type": "picker",
        "label": "Choose your four items",
        "intro": "One grammar structure, one functional exponent, two vocabulary items. The functional exponent is the same for everyone.",
        "cats": [
          {
            "key": "A",
            "label": "Your grammar item",
            "pick": 1,
            "fixed": false,
            "options": [
              "I’ve tried",
              "He’s staying",
              "You must have been"
            ]
          },
          {
            "key": "B",
            "label": "Your functional exponent",
            "fixed": true,
            "options": [
              "Let’s talk properly soon"
            ]
          },
          {
            "key": "C",
            "label": "Your two vocabulary items",
            "pick": 2,
            "fixed": false,
            "options": [
              "flatmates",
              "settle in",
              "delighted"
            ]
          }
        ]
      },
      {
        "type": "fields",
        "label": "Analyse each item",
        "intro": "One table for each item you chose.",
        "fields": [
          {
            "label": "Meaning",
            "hint": "What does it mean in this context?"
          },
          {
            "label": "Clarification of meaning",
            "hint": "CCQs with answers, timelines, diagrams, personalised examples."
          },
          {
            "label": "Form",
            "hint": "Break down each part of the item, as you would on the board."
          },
          {
            "label": "Pronunciation",
            "hint": "Phonemic script, word and sentence stress, weak forms, linking, problem sounds."
          },
          {
            "label": "Use and appropriacy",
            "hint": "When and with whom is it used? Register, formality, typical contexts."
          },
          {
            "label": "Anticipated problems and solutions",
            "hint": "For meaning, form AND pronunciation. Include use where relevant."
          },
          {
            "label": "References used",
            "hint": "Name the source, with page number where you can."
          }
        ]
      },
      {
        "type": "text",
        "label": "Common reasons for resubmission",
        "body": "• CCQs that use the target item itself to check it, or have no answers.\n• Form named but not broken down.\n• Invented pronunciation notation instead of phonemic script, or no stress marked.\n• Anticipated problems that cover only one or two of meaning, form and pronunciation.\n• No real source named for an item.",
        "readonly": true
      },
      {
        "type": "text",
        "label": "Recommended Reference Materials",
        "body": "• Swan, M. (2016) Practical English Usage, 4th ed. Oxford University Press.\n• Parrott, M. (2010) Grammar for English Language Teachers, 2nd ed. Cambridge University Press.\n• Penston, T. (2005) A Concise Grammar for English Language Teachers. TP Publications.\n• Scrivener, J. (2010) Teaching English Grammar. Macmillan.\n• Thornbury, S. (2002) How to Teach Vocabulary. Pearson.\n• Cambridge Advanced Learner’s Dictionary — dictionary.cambridge.org\n• Oxford Learner’s Dictionaries — oxfordlearnersdictionaries.com (for phonemic transcription and stress)",
        "readonly": true
      },
      {
        "type": "declaration",
        "label": "Declaration",
        "aiToggle": true,
        "items": [
          "This assignment is my own work.",
          "I have referenced all sources I used, including any AI tools.",
          "My work is between 750 and 1,000 words."
        ]
      }
    ]
  },
  lsrt: {
    "title": "Language Skills Related Tasks",
    "wordMin": 750,
    "wordMax": 1000,
    "format": "prose",
    "criteria": [
      {
        "text": "Correctly using terminology that relates to language skills and sub-skills",
        "sectionIndex": null
      },
      {
        "text": "Identifying receptive and productive skills that could be practised in relation to the text",
        "sectionIndex": null
      },
      {
        "text": "Relating task design to language skills development, with a rationale",
        "sectionIndex": null
      },
      {
        "text": "Finding, selecting and referencing information from one or more sources, using written language that is clear, accurate and appropriate to the task",
        "sectionIndex": null
      }
    ],
    "sections": [
      {
        "type": "text",
        "label": "Before you start",
        "body": "Choose one of the three texts below for the class described, then design two reading tasks and one productive follow-up task, and explain your decisions.\n\n750–1,000 words of continuous prose, not counting the bibliography and appendices. Attach both reading tasks with their answer keys and the productive task with the materials link. Passing on first or second submission does not affect your certificate grade.",
        "readonly": true
      },
      {
        "type": "text",
        "label": "Your class",
        "readonly": true,
        "body": "An intermediate (B1) class of 10 students of mixed nationality — Italian, Spanish, German, Turkish and Thai. All are in their mid-20s. They are studying English to advance their careers and to travel, and two plan to take IELTS next year. They are keen to communicate and work well as a group, but find grammar tasks tedious, and their spoken accuracy needs attention. They are fairly autonomous and often spend time together outside class."
      },
      {
        "type": "text",
        "label": "Text A — Visiting Alaska’s Distant Aleutian Islands",
        "readonly": true,
        "body": "VOA Learning English\n\nHalfway between the United States and Japan is Alaska’s Adak Island. It is one of the remote Aleutian islands.\n\nIt is a place known for its natural beauty. The coast is home to rich wildlife. Purple lupine flowers can be seen along roads through grassy hills. Hot springs cover the landscape. Snow-topped mountains and the Great Sitkin volcano rise in the distance.\n\nIt is also a strange place, with an important military history. Adak became a U.S. Army airbase during World War II to protect against a feared Japanese invasion of Alaska. Because of its closeness to Russia, it remained an important military base throughout the Cold War.\n\nIt is not easy to get to. It requires a four-hour plane trip from Anchorage. People visit Adak to hunt, watch birds, climb mountains, or examine one of the many abandoned military bases.\n\nAmerican writer Nicole Evatt recently described her travels there. She describes two Adaks: one filled with beautiful nature and one filled with Cold War military remains.\n\nThe old navigation station is covered with graffiti and is falling apart. The doors and windows are broken. Evatt calls the inside of the buildings “spooky.” As she walked through dark, partly wet rooms, paint was coming off the surfaces and broken equipment sat in disrepair. Through broken windows, she saw the blue-black Bering Sea crashing into nearby Horseshoe Bay.\n\nIn town, fewer than 100 people live full-time in old military houses. These houses sit in mostly empty neighbourhoods with other buildings in need of repair. So why do people stay? Some love the quiet. Others say they feel safe. Some get extra pay for remote work. People who live there often do many different jobs.\n\nAdak locals learn to live with very limited supplies. The only food store is in the old daycare center, and it is open just a few hours on some evenings. The old high school and middle school now hold city hall, a healthcare center and the post office.\n\nFood choices are limited. Restaurants and stores are often closed. One eatery does not open often, but when it does, it serves a large pizza for $28. Evatt wrote that it was surprisingly tasty considering how far the tomato sauce and cheese had to travel.\n\nSource: ‘Visiting Alaska’s Distant Aleutian Islands’, VOA Learning English (learningenglish.voanews.com). Adapted by Anna Matteo from reporting by Nicole Evatt for the Associated Press. VOA Learning English texts are in the public domain and may be reprinted with credit."
      },
      {
        "type": "text",
        "label": "Text B — Five Tips for Great Language Exchanges",
        "readonly": true,
        "body": "VOA Learning English\n\nHarry Qiu began learning English as a young boy in Shanghai, China. He later came to the United States for college, where he is now learning two more languages.\n\nThrough his school, he talks one-on-one with native speakers online. When he meets his Japanese partner, Qiu helps his partner practise English. His partner helps him practise Japanese. We call this a language exchange.\n\nSuch exchanges can be one of the best ways to improve your conversation skills. Today, many websites and apps connect language learners around the world. But doing an exchange without knowing what to expect can lead to wasted time. So here are five tips.\n\nFirst, ask yourself some questions. Todd Bryant runs a language exchange website with more than 35,000 users. He says the most important question is why you want to learn the language. People who have a serious reason are usually more dependable partners. Also think about how much free time you really have, and whether you want speaking practice or written messages.\n\nSecond, find the right partner. Many websites have hundreds to choose from. Bryant says to look for people who have been active on the site and have a clear reason to learn the language. It is also better to find at least two partners, because one person may not be free every week.\n\nThird, state your expectations. Be clear in your first message about how long you would like meetings to be and how often you would like to meet. Bryant says this gives the partnership a better chance of working. But avoid being too rigid — offer more than one possible time.\n\nFourth, come prepared. Before each meeting, prepare some questions on a topic of your choice. This gives you the chance to look up related words, and it stops you running out of things to say ten minutes in.\n\nFifth, focus on communication. The main goal is conversation practice, so let your partner speak freely, even if they make mistakes. Bryant recommends giving only one or two corrections after each piece of dialogue. Qiu corrects a partner only if the person cannot finish a sentence.\n\nQiu’s advice to anyone who wants to try a language exchange is simple: don’t be afraid to make mistakes.\n\nSource: ‘Five Tips for Great Language Exchanges’ by Alice Bryant, VOA Learning English (learningenglish.voanews.com). VOA Learning English texts are in the public domain and may be reprinted with credit."
      },
      {
        "type": "text",
        "label": "Text C — When in Rome …",
        "readonly": true,
        "body": "VOA Learning English\n\nOne of the best things about travelling to a new country is learning about new traditions and customs. They can be very different from our own.\n\nWhen visiting a foreign country, it is smart to follow the local social rules and customs of the people who live there. This can make your stay easier and more enjoyable.\n\nThere is an expression for this that goes all the way back to ancient Rome: When in Rome, do as the Romans do.\n\nIt means that when we visit a place, we should follow the customs of that place. It shows an attitude: you are willing to change your way of doing things to fit in with those around you.\n\nThe place does not have to be a new country. It can simply be a new situation. For example, you may usually speak very loudly. But in an art museum or a library, you whisper. You follow the rules of that place.\n\nThe expression has another meaning too. When you are in an unfamiliar situation, you should follow the lead of those who know the rules. These people know how to behave with others, and how to work within the system. They blend in.\n\nBut what does Rome have to do with following other people’s customs? Here is how the story goes. More than 1500 years ago, a Christian leader, Saint Augustine, moved from Rome to Milan. In the new city, he found some parts of religious life to be different. In Rome he fasted, or did not eat, on Saturday. But in Milan, people did not fast on Saturday.\n\nAnother church leader, Saint Ambrose, gave him some advice. He said that when he goes to Rome he fasts on Saturdays, but when he is in Milan, he does not. Problem solved.\n\nThis advice has survived over the years. Some word experts say it first appeared in English around 500 years ago. We still use it today, either to give advice or to describe a situation where we have to change our behaviour to fit in.\n\nSource: ‘When in Rome …’ by Anna Matteo, Words and Their Stories, VOA Learning English (learningenglish.voanews.com). VOA Learning English texts are in the public domain and may be reprinted with credit."
      },
      {
        "type": "text",
        "label": "A.  Choosing Your Text",
        "body": "• Choose ONE text. Check it suits their level (englishprofile.org helps), is a sensible length, matches their interests, is a genre they would meet outside class, and gives you enough to build two reading tasks and one productive task from.\n• Write which text you chose, and why, against those points."
      },
      {
        "type": "text",
        "label": "B.  Your First Reading Task",
        "body": "• Design a reading-for-gist task and attach it as Appendix 2, laid out as a handout, with the answer key. It must need the text — not answerable by common sense — and focus on the message, not on vocabulary or grammar. Reading stage only: no lead-in, no pre-teaching.\n• Write what reading for gist is, with reference to your reading; how your task develops it, and whether these learners would do something similar outside class; and the procedure — set-up, what students do, interaction, timing, and how you handle feedback and wrong answers."
      },
      {
        "type": "text",
        "label": "C.  Your Second Reading Task",
        "body": "• Choose reading for specific information OR reading for detail. Design the task and attach it as Appendix 3, laid out as a handout, with the answer key. Same conditions as B.\n• Write which sub-skill you chose and what it is, with reference to your reading; how your task develops it; and the procedure, as in B."
      },
      {
        "type": "text",
        "label": "D.  Your Productive Follow-up Task",
        "body": "• Choose speaking OR writing. Design the task and attach it as Appendix 4, laid out as a handout. It must genuinely follow the text and have a communicative purpose — for speaking, learners need a reason to listen to each other.\n• Write which skill you chose and why, with reference to the learners’ needs; why a follow-up stage after reading matters, with reference to your reading; and the procedure, with feedback on whether the task was achieved."
      },
      {
        "type": "text",
        "label": "Bibliography",
        "body": "Every resource you used, in any consistent style. Example:  Scrivener, J. (2011). Learning Teaching (3rd ed.). MacMillan."
      },
      {
        "type": "text",
        "label": "Recommended Reading",
        "body": "• Scrivener, J. (2011). Learning Teaching (3rd ed.). MacMillan.\n• Harmer, J. (2015). The Practice of English Language Teaching. Pearson.\n• Harmer, J. (2012). Essential Teacher Knowledge. Pearson.\n• Harmer, J. (2007). How to Teach English. Pearson.\n• Harmer, J. (2004). How to Teach Writing. Pearson.\n• Thornbury, S. (2005). How to Teach Speaking. Pearson.\n• Silberstein, S. (1994). Techniques and Resources in Teaching Reading. Oxford University Press.\n• englishprofile.org — vocabulary and grammar mapped to CEFR levels.",
        "readonly": true
      },
      {
        "type": "declaration",
        "label": "Declaration",
        "aiToggle": true,
        "items": [
          "This assignment is my own work.",
          "I have referenced all sources I used, including any AI tools.",
          "My work is between 750 and 1,000 words."
        ]
      }
    ]
  },
  fol: {
    "title": "Focus on the Learner",
    "wordMin": 750,
    "wordMax": 1000,
    "format": "prose",
    "criteria": [
      {
        "text": "Showing awareness of how the learner’s background, previous learning experience and learning preferences affect learning",
        "sectionIndex": null
      },
      {
        "text": "Identifying the learner’s language and/or skills needs",
        "sectionIndex": null
      },
      {
        "text": "Correctly using terminology relating to the description of language systems and language skills",
        "sectionIndex": null
      },
      {
        "text": "Selecting appropriate material and/or resources — at least one from published materials — to aid the learner’s language development",
        "sectionIndex": null
      },
      {
        "text": "Providing a rationale for using specific activities with the learner in mind",
        "sectionIndex": null
      },
      {
        "text": "Finding, selecting and referencing information from one or more sources, using written language that is clear, accurate and appropriate to the task",
        "sectionIndex": null
      }
    ],
    "sections": [
      {
        "type": "text",
        "label": "Before you start",
        "body": "Describe your current TP group, identify one grammar and one pronunciation difficulty you have noticed in TP1–4, and present one activity for each. At least one activity must come from a published source.\n\n750–1,000 words of continuous prose, not counting the bibliography and appendices. Attach the two tasks with the materials link, each saying where it came from. Passing on first or second submission does not affect your certificate grade.",
        "readonly": true
      },
      {
        "type": "text",
        "label": "A.  Your TP Group",
        "body": "• How many students, their genders, age range and level.\n• Their first languages, and any others they speak.\n• Their jobs and education — first names in brackets, no surnames.\n• Why they are learning English. Use the terminology from your reading.\n• Their previous English learning — how long, and by what methods.\n• Their learning preferences. The activities you choose later must match these."
      },
      {
        "type": "text",
        "label": "B.  The Grammar Problem",
        "body": "• Name the grammar area, using the correct term.\n• Give two examples of the mistake. For each: who made it, spoken or written, which lesson stage, and the correct version.\n• Explain why they make it — L1 interference, level, fossilisation, not enough practice."
      },
      {
        "type": "text",
        "label": "C.  The Pronunciation Problem",
        "body": "• Name the area, using the correct term and IPA.\n• Give two examples. For each: who made it, and both the wrong and the correct pronunciation in IPA.\n• Explain why they make it, as in B."
      },
      {
        "type": "text",
        "label": "D.  The Grammar Task",
        "body": "• Attach ONE task as Appendix 1 and say where it is from. One task only — tutors cannot choose for you.\n• Explain why it fits: the group’s preferences from A, their level, and the context the mistakes were made in.\n• Describe the procedure: set-up, what students do, for how long, in what interaction, how you monitor, and how you give feedback."
      },
      {
        "type": "text",
        "label": "E.  The Pronunciation Task",
        "body": "• Attach ONE task as Appendix 2 and say where it is from. It must have students producing the sound, not just hearing it — repeating after the teacher is not a task.\n• Explain why it fits: the group’s preferences from A, and their level.\n• Describe the procedure, as in D."
      },
      {
        "type": "text",
        "label": "Bibliography",
        "body": "Every resource you used, in any consistent style. Example:  Scrivener, J. (2011). Learning Teaching (3rd ed.). MacMillan."
      },
      {
        "type": "text",
        "label": "Recommended Resources",
        "body": "• Swan, M. and Smith, B. (2001). Learner English (2nd ed.). Cambridge University Press.\n• englishprofile.org/english-grammar-profile — grammar mapped to CEFR levels.\n• Scrivener, J. (2011). Learning Teaching (3rd ed.). MacMillan.\n• Harmer, J. (2015). The Practice of English Language Teaching. Pearson.\n• englishclub.com/pronunciation/minimal-pairs.php\n• Hancock, M. (2001). Pronunciation Games. Cambridge University Press.\n• Baker, A. (2007). Tree or Three? Cambridge University Press.\n• Baker, A. (2008). Ship or Sheep? Cambridge University Press.\n• Murphy, R. (2007). Essential Grammar in Use — Elementary (3rd ed.). Cambridge University Press.\n• Murphy, R. (2004). English Grammar in Use — Intermediate (3rd ed.). Cambridge University Press.",
        "readonly": true
      },
      {
        "type": "declaration",
        "label": "Declaration",
        "aiToggle": true,
        "items": [
          "This assignment is my own work.",
          "I have referenced all sources I used, including any AI tools.",
          "My work is between 750 and 1,000 words."
        ]
      }
    ]
  },
  lfc: {
    "title": "Lessons from the Classroom",
    "wordMin": 750,
    "wordMax": 1000,
    "format": "prose",
    "criteria": [
      {
        "text": "Identifying their own teaching strengths and weaknesses in light of feedback from learners, teachers and tutors, and how these affect the learners",
        "sectionIndex": null
      },
      {
        "text": "Identifying which ELT areas of knowledge and skills they need further development in, with practical ways to improve",
        "sectionIndex": null
      },
      {
        "text": "Reflecting on their observation of other teachers in relation to their own development",
        "sectionIndex": null
      },
      {
        "text": "Describing in a specific way how to develop ELT knowledge and skills beyond the course",
        "sectionIndex": null
      },
      {
        "text": "Using written language that is clear, accurate and appropriate to the task",
        "sectionIndex": null
      }
    ],
    "sections": [
      {
        "type": "text",
        "label": "Before you start",
        "body": "A reflection on your progress during the course: your main teaching strengths and action points, what you learned from observing peers and experienced teachers, and how you plan to keep developing after the CELTA.\n\n750–1,000 words of continuous prose, not counting the bibliography. Passing on first or second submission does not affect your certificate grade.",
        "readonly": true
      },
      {
        "type": "text",
        "label": "A.  Your Strengths",
        "body": "• From the tutor feedback on your three most recent TPs, identify three teaching strengths you have shown.\n• Back each one with at least one tutor comment, saying which TP it is from, e.g. (TP6). Add a peer comment too if you can.\n• Explain how each strength benefits the students.\n\nStrength 1 —\nStrength 2 —\nStrength 3 —"
      },
      {
        "type": "text",
        "label": "B.  Your Action Points",
        "body": "• From the same feedback, identify three action points you still have, each backed with at least one tutor comment and the TP it is from.\n• Explain how each action point affects the students, and give one practical suggestion for addressing it.\n\nAction point 1 —\nAction point 2 —\nAction point 3 —"
      },
      {
        "type": "text",
        "label": "C.  What You Learned From Watching Others",
        "body": "• For each action point in B, give one example of another teacher avoiding that problem — from your peer observation tasks, tutors’ live lessons or video observations.\n• Say who (a tutor or peer by first name, or the video number), what they did, using their actual words where it helps, and why it worked.\n\nExample for action point 1 —\nExample for action point 2 —\nExample for action point 3 —"
      },
      {
        "type": "text",
        "label": "D.  After the Course",
        "body": "• Choose three areas to focus on after the course — your own language, a teaching context, a method, an area of language analysis, or similar.\n• For each: why it is a priority and how working on it will affect your students, and what you will actually do over the next year — books by author and title, an exam and why, a conference or course with a link."
      },
      {
        "type": "text",
        "label": "Bibliography",
        "body": "Any resources you drew on, in any consistent style. Example:  Scrivener, J. (2011). Learning Teaching (3rd ed.). MacMillan."
      },
      {
        "type": "text",
        "label": "Recommended Reading",
        "body": "• Harmer, J. (2007). How to Teach English. Pearson.\n• Harmer, J. (2015). The Practice of English Language Teaching. Pearson.\n• Scrivener, J. (2011). Learning Teaching (3rd ed.). MacMillan.\n• Thornbury, S. (2007). How to Teach Vocabulary. Pearson.",
        "readonly": true
      },
      {
        "type": "declaration",
        "label": "Declaration",
        "aiToggle": true,
        "items": [
          "This assignment is my own work.",
          "I have referenced any sources I used, including any AI tools.",
          "My work is between 750 and 1,000 words."
        ]
      }
    ]
  },
  a5: { title:'Assignment 5 \u2014 Plagiarism Reflection (centre sanction)', criteria:[
      {text:'Gives their own honest account of what happened and how it came about — not an apology, an account.', sectionIndex:null},
      {text:'Quotes the specific centre policy and Cambridge guidance clause breached, and explains why it applies here.', sectionIndex:null},
      {text:'Explains what it would mean for a learner, a colleague, or the centre if a teacher’s materials or claims were not their own.', sectionIndex:null},
      {text:'Describes specific, concrete changes to how they will work — source-noting, AI use and declaration — going forward.', sectionIndex:null},
      {text:'The assignment meets the 750-1,000-word count requirement.', sectionIndex:null},
    ], sections:[
    { type:'text', label:'Before you start', body:'This is not a research essay about plagiarism. It is an account of what happened in your own case, which rule it breached, and what you will do differently. Write it in your own words \u2014 a general essay on academic honesty will not pass, and will be scanned like everything else.\n\n750\u20131,000 words, due by the last day of the course.' },
    { type:'text', label:'What this does and does not affect', body:'It does not count toward the three-of-four rule, and it cannot raise or lower your certificate grade.\nOne chance, pass or fail \u2014 the same as the resubmission it accompanies.\nIt is a condition set by the centre, not a Cambridge assignment, and it is not numbered with the four.\nIt stays with the case in your file. An assessor asking how the centre handled this sees both the decision and what followed.' },
    { type:'text', label:'1 \u2014 What happened (~200 words)', body:'In your own words: what you submitted, and how it came about.\nAn account, not an apology. What you were doing, when, and what you were thinking.\nIf you disagree with the finding, say so here \u2014 that is allowed, and this section is where it goes.' },
    { type:'text', label:'2 \u2014 Which rule it breached (~200 words)', body:'Quote the clause from the centre\u2019s malpractice policy that applies, and say why it applies to what you did.\nQuote the relevant line from the Cambridge AI guidance and the candidate agreement you accepted when you set up your account.\nBoth documents are in the resource hub. You have already signed one of them.' },
    { type:'text', label:'3 \u2014 Why it matters here (~150 words)', body:'What it would mean for a learner, a colleague or a centre if a teacher\u2019s materials or claims were not their own.\nNot why plagiarism is wrong in general \u2014 why it matters for someone about to teach.' },
    { type:'text', label:'4 \u2014 What you will do differently (~250 words)', body:'How you will note sources while you read, so this cannot happen by accident.\nHow you will use AI tools and declare them, specifically.\nWhat you will do at 1am with a deadline in seven hours and nothing written. That is the situation this is really about.' },
    { type:'declaration', label:'Declaration', items:['This is my own work.', 'All sources are referenced, in the format (Author, Year, p. ##).'], aiToggle:true }
  ]}
};

/* A course's stored wording is a frozen COPY, made when the course was set up,
   so changing the defaults above reaches new courses and no existing one. That
   is right when a centre has rewritten its own wording on screen 8 -- their
   words must never be overwritten -- and wrong when the stored copy is simply
   an old shipped default and nobody has touched it.

   Nothing in the record says whether a centre edited anything, so this asks the
   only question that can be answered: is the stored copy still one of the
   defaults Lite used to ship, word for word? A LIST, not one snapshot, because
   the defaults changed twice on 25 Sep 2026 -- first the criteria were
   corrected against the syllabus, then the whole briefs were filled in -- and a
   course could be sitting on either. Every version Lite has ever shipped gets
   an entry here; nothing is ever removed, and the current defaults are never
   one of them.

   It asks twice per version, because the two answers mean different things:

     - criteria still a shipped default        -> replace the criteria.
     - sections ALSO still that same default   -> nobody touched this
       assignment at all, so replace the whole thing and the course gets the
       full brief: the reading text, what to write under each heading, the
       recommended reading.

   A centre that rewrote the sections but not the criteria keeps its sections.
   Once replaced, nothing matches any version, so this cannot fire twice.

   Three limits, enforced in hub-sync's plan(): the TUTOR adopts, never a
   trainee, so there is one writer and the store is healed for everyone; only
   while the course has NO assignment record at all, because criteriaMarks are
   POSITIONAL and a shorter list would move a Met onto a different criterion;
   and dueAt, resubDays and releaseAt are the centre's and are carried over
   untouched. */
window.CONNECT_HUB_SUPERSEDED_WORDING = [
  {
    "lrt": {
      "title": "Language Related Tasks",
      "criteria": [
        "Analyses language correctly",
        "Uses terminology correctly",
        "Shows evidence of having accessed appropriate reference materials, i.e. give the name of at least one book that you have used to research the area",
        "Uses clear, accurate and appropriate language",
        "The assignment meets the 750-1,000-word count requirement"
      ],
      "sections": [
        {
          "type": "text",
          "label": "Before you start",
          "body": "You’ll pick 2 items from Category A and 2 from Category B, then analyse each one — meaning, form, pronunciation and so on. Work through this one step at a time; nothing is submitted until the last step."
        },
        {
          "type": "picker",
          "label": "Pick your items",
          "catA": {
            "label": "Category A",
            "options": [
              "Grammar item 1",
              "Grammar item 2",
              "Grammar item 3"
            ]
          },
          "catB": {
            "label": "Category B",
            "options": [
              "Lexis item 1",
              "Lexis item 2",
              "Lexis item 3"
            ]
          },
          "pickCount": 2
        },
        {
          "type": "fields",
          "label": "Analyse each item",
          "intro": "Repeat this for each item you picked above.",
          "fields": [
            {
              "label": "Meaning",
              "hint": "The essential meaning of the item, in this context."
            },
            {
              "label": "Clarification of meaning",
              "hint": "CCQs (with answers), and/or a timeline, diagram, or personalised example."
            },
            {
              "label": "Form",
              "hint": "Break down each part. Use accurate, specific terminology."
            },
            {
              "label": "Pronunciation",
              "hint": "Phonemic script — weak forms, stress, linking, problem sounds."
            },
            {
              "label": "Appropriacy",
              "hint": "Only where relevant — register, more/less formal alternatives."
            },
            {
              "label": "Anticipated problems & solutions",
              "hint": "Cover meaning, form, AND pronunciation — a solution for each problem you raise."
            }
          ]
        },
        {
          "type": "declaration",
          "label": "Declaration",
          "items": [
            "This is my own work.",
            "All sources are referenced, in the format (Author, Year, p. ##)."
          ],
          "aiToggle": true
        }
      ]
    },
    "lsrt": {
      "title": "Language Skills Related Task",
      "criteria": [
        "Identifying receptive/productive skills that could be practised in relation to the text",
        "Correctly using terminology that relates to language skills and sub-skills",
        "Designing tasks in relation to the text with a rationale",
        "Finding, selecting and showing evidence of background reading in the topic area i.e. at least one sourced quote in the body of the assignment.",
        "Using written language that is clear, accurate and appropriate to the task",
        "The assignment meets the 750-1,000-word count requirement"
      ],
      "sections": [
        {
          "type": "text",
          "label": "The material",
          "body": "The lesson or extract you are analysing — not the whole unit, just the skills-focused part."
        },
        {
          "type": "text",
          "label": "Sub-skills and task types",
          "body": "Name the specific sub-skills the material targets (e.g. skimming for gist, listening for specific information, turn-taking, planning before writing) and how each task exercises them."
        },
        {
          "type": "text",
          "label": "How the lesson stages the skill",
          "body": "Lead-in, pre-task (vocabulary/prediction), the task itself, and post-task — what each stage is for, and how it prepares learners for the next."
        },
        {
          "type": "text",
          "label": "Anticipated problems and solutions",
          "body": "Problems with the skill itself (not language) — task difficulty, background knowledge, text length, unfamiliar text types — and how you would address each."
        },
        {
          "type": "declaration",
          "label": "Declaration",
          "items": [
            "This is my own work.",
            "All sources are referenced, in the format (Author, Year, p. ##)."
          ],
          "aiToggle": true
        }
      ]
    },
    "fol": {
      "title": "Focus on the Learner",
      "criteria": [
        "Showing awareness of how a learner’s background, previous learning experience and learning preferences affect learning.",
        "Identifying the learner’s language/skills needs",
        "Correctly using terminology relating to the description of language systems and language skills.",
        "Selecting appropriate material and/or resources (at least one of which must be from published materials) to aid the learners’ language development.",
        "Providing a rationale for using specific activities with the learners in mind.",
        "Finding, selecting and referencing information from one or more sources, within the body of the assignment.",
        "Using written language that is clear, accurate and appropriate to the task",
        "The assignment meets the 750-1,000-word count requirement"
      ],
      "sections": [
        {
          "type": "text",
          "label": "Before you start",
          "body": "You’ll describe your current TP group, then identify one grammar and one pronunciation difficulty they’ve shown — two examples of each — and present one activity for each problem. Word count: 750–1,000 words of continuous prose, not counting the bibliography or appendices."
        },
        {
          "type": "text",
          "label": "A — Your TP group",
          "body": "Describe your group of learners, covering group size, gender, age range and level."
        },
        {
          "type": "text",
          "label": "B — The grammar problem",
          "body": "Name the grammar area you’ve chosen to focus on, using correct terminology, with two examples."
        },
        {
          "type": "text",
          "label": "C — The pronunciation problem",
          "body": "Name the pronunciation area you’ve chosen to focus on, using correct terminology and IPA script, with two examples."
        },
        {
          "type": "text",
          "label": "D — The grammar task",
          "body": "Attach one task in Appendix 1 that addresses the grammar problem above — just one, not a choice of options."
        },
        {
          "type": "text",
          "label": "E — The pronunciation task",
          "body": "Attach one task in Appendix 2 that addresses the pronunciation problem above. Repeating after the teacher or drilling doesn’t count as a task."
        },
        {
          "type": "declaration",
          "label": "Declaration",
          "items": [
            "This is my own work.",
            "All sources are referenced, in the format (Author, Year, p. ##)."
          ],
          "aiToggle": true
        }
      ]
    },
    "lfc": {
      "title": "Lessons from the Classroom",
      "criteria": [
        "Show (convincing) evidence of an ability to identify their own teaching strengths and weaknesses in the light of feedback from learners, teachers and tutors.",
        "Show convincing understanding of how their strengths/weaknesses can affect the learners.",
        "Identify ways of improving their weaknesses (one or two practical solutions).",
        "Show reflection on their observation of other teachers in relation to their weaknesses.",
        "Describe in a specific way how to develop ELT knowledge and skills beyond the course (professional development post-CELTA).",
        "Able to write in clear, accurate and appropriate language.",
        "The assignment meets the 750-1,000-word count requirement and there is clear reference to the sources used."
      ],
      "sections": [
        {
          "type": "text",
          "label": "Before you start",
          "body": "This assignment is a reflection on your progress during the course. You’ll summarise your main teaching strengths and action points, insights from observing peers and experienced teachers, and how you’ll continue developing after the CELTA. Word count: 750–1,000 words of continuous prose, not counting the bibliography or appendices."
        },
        {
          "type": "text",
          "label": "A — Identifying strengths",
          "body": "Browse your 3 most recent TPs’ feedback and identify 3 teaching strengths you’ve shown."
        },
        {
          "type": "text",
          "label": "B — Identifying action points",
          "body": "Browse your 3 most recent TPs’ feedback and identify 3 action points you still have."
        },
        {
          "type": "text",
          "label": "C — Reflecting on observation of others",
          "body": "For each action point from Part B, give one example of how another teacher addressed it — through peer observation, a tutor’s live observation, or a video observation."
        },
        {
          "type": "text",
          "label": "D — Post-course development",
          "body": "Choose 3 areas you want to focus on after the course."
        },
        {
          "type": "declaration",
          "label": "Declaration",
          "items": [
            "This is my own work.",
            "All sources are referenced, in the format (Author, Year, p. ##)."
          ],
          "aiToggle": true
        }
      ]
    }
  },
  {
    "lrt": {
      "title": "Language Related Tasks",
      "criteria": [
        "Analysing language correctly for teaching purposes",
        "Correctly using terminology relating to form, meaning and phonology when analysing language",
        "Accessing reference materials and referencing information they have learned about language to an appropriate source",
        "Using written language that is clear, accurate and appropriate to the task"
      ],
      "sections": [
        {
          "type": "text",
          "label": "Before you start",
          "body": "You’ll pick 2 items from Category A and 2 from Category B, then analyse each one — meaning, form, pronunciation and so on. Work through this one step at a time; nothing is submitted until the last step."
        },
        {
          "type": "picker",
          "label": "Pick your items",
          "catA": {
            "label": "Category A",
            "options": [
              "Grammar item 1",
              "Grammar item 2",
              "Grammar item 3"
            ]
          },
          "catB": {
            "label": "Category B",
            "options": [
              "Lexis item 1",
              "Lexis item 2",
              "Lexis item 3"
            ]
          },
          "pickCount": 2
        },
        {
          "type": "fields",
          "label": "Analyse each item",
          "intro": "Repeat this for each item you picked above.",
          "fields": [
            {
              "label": "Meaning",
              "hint": "The essential meaning of the item, in this context."
            },
            {
              "label": "Clarification of meaning",
              "hint": "CCQs (with answers), and/or a timeline, diagram, or personalised example."
            },
            {
              "label": "Form",
              "hint": "Break down each part. Use accurate, specific terminology."
            },
            {
              "label": "Pronunciation",
              "hint": "Phonemic script — weak forms, stress, linking, problem sounds."
            },
            {
              "label": "Appropriacy",
              "hint": "Only where relevant — register, more/less formal alternatives."
            },
            {
              "label": "Anticipated problems & solutions",
              "hint": "Cover meaning, form, AND pronunciation — a solution for each problem you raise."
            }
          ]
        },
        {
          "type": "declaration",
          "label": "Declaration",
          "items": [
            "This is my own work.",
            "All sources are referenced, in the format (Author, Year, p. ##)."
          ],
          "aiToggle": true
        }
      ]
    },
    "lsrt": {
      "title": "Language Skills Related Tasks",
      "criteria": [
        "Correctly using terminology that relates to language skills and sub-skills",
        "Identifying receptive and productive skills that could be practised in relation to the text",
        "Relating task design to language skills development, with a rationale",
        "Finding, selecting and referencing information from one or more sources, using written language that is clear, accurate and appropriate to the task"
      ],
      "sections": [
        {
          "type": "text",
          "label": "The material",
          "body": "The lesson or extract you are analysing — not the whole unit, just the skills-focused part."
        },
        {
          "type": "text",
          "label": "Sub-skills and task types",
          "body": "Name the specific sub-skills the material targets (e.g. skimming for gist, listening for specific information, turn-taking, planning before writing) and how each task exercises them."
        },
        {
          "type": "text",
          "label": "How the lesson stages the skill",
          "body": "Lead-in, pre-task (vocabulary/prediction), the task itself, and post-task — what each stage is for, and how it prepares learners for the next."
        },
        {
          "type": "text",
          "label": "Anticipated problems and solutions",
          "body": "Problems with the skill itself (not language) — task difficulty, background knowledge, text length, unfamiliar text types — and how you would address each."
        },
        {
          "type": "declaration",
          "label": "Declaration",
          "items": [
            "This is my own work.",
            "All sources are referenced, in the format (Author, Year, p. ##)."
          ],
          "aiToggle": true
        }
      ]
    },
    "fol": {
      "title": "Focus on the Learner",
      "criteria": [
        "Showing awareness of how the learner’s background, previous learning experience and learning preferences affect learning",
        "Identifying the learner’s language and/or skills needs",
        "Correctly using terminology relating to the description of language systems and language skills",
        "Selecting appropriate material and/or resources (at least one of which must be from published materials) to aid the learner’s language development",
        "Providing a rationale for using specific activities with the learner in mind",
        "Finding, selecting and referencing information from one or more sources, using written language that is clear, accurate and appropriate to the task"
      ],
      "sections": [
        {
          "type": "text",
          "label": "Before you start",
          "body": "You’ll describe your current TP group, then identify one grammar and one pronunciation difficulty they’ve shown — two examples of each — and present one activity for each problem. Word count: 750–1,000 words of continuous prose, not counting the bibliography or appendices."
        },
        {
          "type": "text",
          "label": "A — Your TP group",
          "body": "Describe your group of learners, covering group size, gender, age range and level."
        },
        {
          "type": "text",
          "label": "B — The grammar problem",
          "body": "Name the grammar area you’ve chosen to focus on, using correct terminology, with two examples."
        },
        {
          "type": "text",
          "label": "C — The pronunciation problem",
          "body": "Name the pronunciation area you’ve chosen to focus on, using correct terminology and IPA script, with two examples."
        },
        {
          "type": "text",
          "label": "D — The grammar task",
          "body": "Attach one task in Appendix 1 that addresses the grammar problem above — just one, not a choice of options."
        },
        {
          "type": "text",
          "label": "E — The pronunciation task",
          "body": "Attach one task in Appendix 2 that addresses the pronunciation problem above. Repeating after the teacher or drilling doesn’t count as a task."
        },
        {
          "type": "declaration",
          "label": "Declaration",
          "items": [
            "This is my own work.",
            "All sources are referenced, in the format (Author, Year, p. ##)."
          ],
          "aiToggle": true
        }
      ]
    },
    "lfc": {
      "title": "Lessons from the Classroom",
      "criteria": [
        "Identifying their own teaching strengths and weaknesses in light of feedback from learners, teachers and tutors, and how these affect the learners",
        "Identifying which ELT areas of knowledge and skills they need further development in, with practical ways to improve",
        "Reflecting on their observation of other teachers in relation to their own development",
        "Describing in a specific way how to develop ELT knowledge and skills beyond the course",
        "Using written language that is clear, accurate and appropriate to the task"
      ],
      "sections": [
        {
          "type": "text",
          "label": "Before you start",
          "body": "This assignment is a reflection on your progress during the course. You’ll summarise your main teaching strengths and action points, insights from observing peers and experienced teachers, and how you’ll continue developing after the CELTA. Word count: 750–1,000 words of continuous prose, not counting the bibliography or appendices."
        },
        {
          "type": "text",
          "label": "A — Identifying strengths",
          "body": "Browse your 3 most recent TPs’ feedback and identify 3 teaching strengths you’ve shown."
        },
        {
          "type": "text",
          "label": "B — Identifying action points",
          "body": "Browse your 3 most recent TPs’ feedback and identify 3 action points you still have."
        },
        {
          "type": "text",
          "label": "C — Reflecting on observation of others",
          "body": "For each action point from Part B, give one example of how another teacher addressed it — through peer observation, a tutor’s live observation, or a video observation."
        },
        {
          "type": "text",
          "label": "D — Post-course development",
          "body": "Choose 3 areas you want to focus on after the course."
        },
        {
          "type": "declaration",
          "label": "Declaration",
          "items": [
            "This is my own work.",
            "All sources are referenced, in the format (Author, Year, p. ##)."
          ],
          "aiToggle": true
        }
      ]
    }
  },
  {
    "lrt": {
      "title": "Language Related Tasks",
      "criteria": [
        "Analysing language correctly for teaching purposes",
        "Correctly using terminology relating to form, meaning and phonology when analysing language",
        "Accessing reference materials and referencing information they have learned about language to an appropriate source",
        "Using written language that is clear, accurate and appropriate to the task"
      ],
      "sections": [
        {
          "type": "text",
          "label": "Before you start",
          "readonly": true,
          "body": "Analysing meaning, form, pronunciation and use, and anticipating what learners will find difficult.\n\nThis assignment is for you to practise researching and analysing language before you teach it. You will choose four items from the letter below and analyse each one in detail.\n\nWhat you analyse — four items in total: one grammar structure, one functional exponent, and two vocabulary items.\nWord count — 750–1,000 words, excluding the letter and these instructions.\nFirst submission — complete a table for each item and submit.\nSecond submission — if a resubmission is needed, your tutor returns this with their comments and the tables open again. Passing on first or second submission does not affect your certificate grade. You must pass 3 of 4 assignments to be eligible for a PASS.\nWhen resubmitting — your tutor’s comments stay where they are. Write your new analysis in the tables below each item.\n\nReferencing and use of AI\n• Analysing language means researching it. Use grammar references, learner dictionaries and pronunciation sources, and name them — with a page number where you can.\n• AI is allowed only for ideas, initial research and bibliography — not for writing or rewriting your text. Cite every use in the text (prompt, tool, year) and in your reference list with the conversation link, as set out in Your Own Work. AI is not a reference source for language analysis: check anything it tells you against a published grammar or dictionary."
        },
        {
          "type": "text",
          "label": "What to do",
          "readonly": true,
          "body": "• Read the letter below. The target language is in bold.\n• Choose FOUR items: one grammar structure, one functional exponent, two vocabulary items.\n• Analyse only the words in bold, not the sentence around them.\n• Complete a table for each. Each row tells you what it needs.\n\nCommon reasons for resubmission\n• CCQs that use the target item itself to check it, or have no answers.\n• Form named but not broken down.\n• Invented pronunciation notation instead of phonemic script, or no stress marked.\n• Anticipated problems that cover only one or two of meaning, form and pronunciation.\n• No real source named for an item."
        },
        {
          "type": "text",
          "label": "The text — A letter from a friend abroad",
          "readonly": true,
          "body": "The target language is in bold.\n\nDear Marta,\n\nHow are you? Sorry it’s taken me so long to write — things have been hectic since the move. I can’t quite believe I’ve now been living in Lisbon for nearly a year!\n\nEverything’s going really well. I started at the language school in September and I’m teaching four classes. My **flatmates** are great — both Portuguese, both very patient with my terrible accent — and they’ve really helped me **settle in**.\n\nThe flat is tiny but it’s five minutes from the river, so I’m not complaining. I **’ve tried** surfing twice now, which was harder than it looks, and I’ve finally learned to order coffee without pointing at things.\n\nSome news: my brother’s coming over at Easter. He**’s staying** for two weeks, so we’re planning a trip down to the Algarve.\n\nAnd congratulations on the new job! Rui told me you’d been offered it back in March and didn’t say a word to anyone for a fortnight. You **must have been** in shock — you’d been after that role for years. Rui says you’re absolutely **delighted**. **Let’s talk properly soon**; I want to hear everything.\n\nAnyway, I should go — I’ve got marking to do and I’ve been putting it off all evening.\n\nWrite back when you can.\n\nLove,\nDeniz"
        },
        {
          "type": "picker",
          "label": "Choose your four items",
          "intro": "One grammar structure, one functional exponent, two vocabulary items. The functional exponent is the same for everyone.",
          "cats": [
            {
              "key": "A",
              "label": "Your grammar item",
              "pick": 1,
              "fixed": false,
              "options": [
                "I’ve tried",
                "He’s staying",
                "You must have been"
              ]
            },
            {
              "key": "B",
              "label": "Your functional exponent",
              "fixed": true,
              "options": [
                "Let’s talk properly soon"
              ]
            },
            {
              "key": "C",
              "label": "Your two vocabulary items",
              "pick": 2,
              "fixed": false,
              "options": [
                "flatmates",
                "settle in",
                "delighted"
              ]
            }
          ]
        },
        {
          "type": "fields",
          "label": "Analyse each item",
          "intro": "Write the item you are analysing above, then complete each row. Repeat this for each item you chose.",
          "fields": [
            {
              "label": "Meaning",
              "hint": "What does it mean in this context?"
            },
            {
              "label": "Clarification of meaning",
              "hint": "CCQs with answers, timelines, diagrams, personalised examples."
            },
            {
              "label": "Form",
              "hint": "Break down each part of the item, as you would on the board."
            },
            {
              "label": "Pronunciation",
              "hint": "Phonemic script, word and sentence stress, weak forms, linking, problem sounds."
            },
            {
              "label": "Use and appropriacy",
              "hint": "When and with whom is it used? Register, formality, typical contexts."
            },
            {
              "label": "Anticipated problems and solutions",
              "hint": "For meaning, form AND pronunciation. Include use where relevant."
            },
            {
              "label": "References used",
              "hint": "Name the source, with page number where you can."
            }
          ]
        },
        {
          "type": "text",
          "label": "Recommended Reference Materials",
          "readonly": true,
          "body": "You are expected to research your items, not rely on intuition. These are good places to start.\n\n• Swan, M. (2016) Practical English Usage, 4th ed. Oxford University Press.\n• Parrott, M. (2010) Grammar for English Language Teachers, 2nd ed. Cambridge University Press.\n• Penston, T. (2005) A Concise Grammar for English Language Teachers. TP Publications.\n• Scrivener, J. (2010) Teaching English Grammar. Macmillan.\n• Thornbury, S. (2002) How to Teach Vocabulary. Pearson.\n• Cambridge Advanced Learner’s Dictionary — dictionary.cambridge.org\n• Oxford Learner’s Dictionaries — oxfordlearnersdictionaries.com (for phonemic transcription and stress)"
        },
        {
          "type": "declaration",
          "label": "Declaration",
          "aiToggle": true,
          "items": [
            "This assignment is my own work.",
            "I have referenced all sources I used, including any AI tools.",
            "My work is between 750 and 1,000 words."
          ]
        }
      ]
    },
    "lsrt": {
      "title": "Language Skills Related Tasks",
      "criteria": [
        "Correctly using terminology that relates to language skills and sub-skills",
        "Identifying receptive and productive skills that could be practised in relation to the text",
        "Relating task design to language skills development, with a rationale",
        "Finding, selecting and referencing information from one or more sources, using written language that is clear, accurate and appropriate to the task"
      ],
      "sections": [
        {
          "type": "text",
          "label": "Before you start",
          "readonly": true,
          "body": "Choosing a text, designing reading tasks, and building a productive follow-up.\n\nThis assignment is for you to practise designing receptive and productive skills tasks. You will choose one text from the three provided, then design two reading tasks and one productive follow-up task, and explain your decisions.\n\nWhat you submit — this assignment, with your tasks attached using the materials link.\nWord count — 750–1,000 words, in continuous prose, excluding the bibliography and appendices.\nFirst submission — write your answers in the boxes below and submit.\nSecond submission — if a resubmission is needed, your tutor returns this with their comments and the boxes open again. Passing on first or second submission does not affect your certificate grade. You must pass 3 of 4 assignments to be eligible for a PASS.\nWhen resubmitting — your tutor’s comments stay where they are. Do not delete old appendices — add new ones.\n\nSubmission requirements — check these before you submit.\n750–1,000 words. Continuous prose, excluding the bibliography and appendices.\nAppendices attached. Both reading tasks with answer keys, and the productive task.\nDeclaration completed. Including the AI conversation link, if a tool was used.\n\nReferencing and use of AI\n• Refer to at least one published source in the body of your assignment, and cite it clearly enough that a reader could find it. Any consistent style is fine. Recommended reading is listed at the end.\n• AI is allowed only for ideas, initial research and bibliography — not for writing or rewriting your text. Cite every use in the text (prompt, tool, year) and in your reference list with the conversation link, as set out in Your Own Work."
        },
        {
          "type": "text",
          "label": "Your class",
          "readonly": true,
          "body": "An intermediate (B1) class of 10 students of mixed nationality — Italian, Spanish, German, Turkish and Thai. All are in their mid-20s. They are studying English to advance their careers and to travel, and two plan to take IELTS next year. They are keen to communicate and work well as a group, but find grammar tasks tedious, and their spoken accuracy needs attention. They are fairly autonomous and often spend time together outside class."
        },
        {
          "type": "text",
          "label": "Text A — Visiting Alaska’s Distant Aleutian Islands",
          "readonly": true,
          "body": "VOA Learning English\n\nHalfway between the United States and Japan is Alaska’s Adak Island. It is one of the remote Aleutian islands.\n\nIt is a place known for its natural beauty. The coast is home to rich wildlife. Purple lupine flowers can be seen along roads through grassy hills. Hot springs cover the landscape. Snow-topped mountains and the Great Sitkin volcano rise in the distance.\n\nIt is also a strange place, with an important military history. Adak became a U.S. Army airbase during World War II to protect against a feared Japanese invasion of Alaska. Because of its closeness to Russia, it remained an important military base throughout the Cold War.\n\nIt is not easy to get to. It requires a four-hour plane trip from Anchorage. People visit Adak to hunt, watch birds, climb mountains, or examine one of the many abandoned military bases.\n\nAmerican writer Nicole Evatt recently described her travels there. She describes two Adaks: one filled with beautiful nature and one filled with Cold War military remains.\n\nThe old navigation station is covered with graffiti and is falling apart. The doors and windows are broken. Evatt calls the inside of the buildings “spooky.” As she walked through dark, partly wet rooms, paint was coming off the surfaces and broken equipment sat in disrepair. Through broken windows, she saw the blue-black Bering Sea crashing into nearby Horseshoe Bay.\n\nIn town, fewer than 100 people live full-time in old military houses. These houses sit in mostly empty neighbourhoods with other buildings in need of repair. So why do people stay? Some love the quiet. Others say they feel safe. Some get extra pay for remote work. People who live there often do many different jobs.\n\nAdak locals learn to live with very limited supplies. The only food store is in the old daycare center, and it is open just a few hours on some evenings. The old high school and middle school now hold city hall, a healthcare center and the post office.\n\nFood choices are limited. Restaurants and stores are often closed. One eatery does not open often, but when it does, it serves a large pizza for $28. Evatt wrote that it was surprisingly tasty considering how far the tomato sauce and cheese had to travel.\n\nSource: ‘Visiting Alaska’s Distant Aleutian Islands’, VOA Learning English (learningenglish.voanews.com). Adapted by Anna Matteo from reporting by Nicole Evatt for the Associated Press. VOA Learning English texts are in the public domain and may be reprinted with credit."
        },
        {
          "type": "text",
          "label": "Text B — Five Tips for Great Language Exchanges",
          "readonly": true,
          "body": "VOA Learning English\n\nHarry Qiu began learning English as a young boy in Shanghai, China. He later came to the United States for college, where he is now learning two more languages.\n\nThrough his school, he talks one-on-one with native speakers online. When he meets his Japanese partner, Qiu helps his partner practise English. His partner helps him practise Japanese. We call this a language exchange.\n\nSuch exchanges can be one of the best ways to improve your conversation skills. Today, many websites and apps connect language learners around the world. But doing an exchange without knowing what to expect can lead to wasted time. So here are five tips.\n\nFirst, ask yourself some questions. Todd Bryant runs a language exchange website with more than 35,000 users. He says the most important question is why you want to learn the language. People who have a serious reason are usually more dependable partners. Also think about how much free time you really have, and whether you want speaking practice or written messages.\n\nSecond, find the right partner. Many websites have hundreds to choose from. Bryant says to look for people who have been active on the site and have a clear reason to learn the language. It is also better to find at least two partners, because one person may not be free every week.\n\nThird, state your expectations. Be clear in your first message about how long you would like meetings to be and how often you would like to meet. Bryant says this gives the partnership a better chance of working. But avoid being too rigid — offer more than one possible time.\n\nFourth, come prepared. Before each meeting, prepare some questions on a topic of your choice. This gives you the chance to look up related words, and it stops you running out of things to say ten minutes in.\n\nFifth, focus on communication. The main goal is conversation practice, so let your partner speak freely, even if they make mistakes. Bryant recommends giving only one or two corrections after each piece of dialogue. Qiu corrects a partner only if the person cannot finish a sentence.\n\nQiu’s advice to anyone who wants to try a language exchange is simple: don’t be afraid to make mistakes.\n\nSource: ‘Five Tips for Great Language Exchanges’ by Alice Bryant, VOA Learning English (learningenglish.voanews.com). VOA Learning English texts are in the public domain and may be reprinted with credit."
        },
        {
          "type": "text",
          "label": "Text C — When in Rome …",
          "readonly": true,
          "body": "VOA Learning English\n\nOne of the best things about travelling to a new country is learning about new traditions and customs. They can be very different from our own.\n\nWhen visiting a foreign country, it is smart to follow the local social rules and customs of the people who live there. This can make your stay easier and more enjoyable.\n\nThere is an expression for this that goes all the way back to ancient Rome: When in Rome, do as the Romans do.\n\nIt means that when we visit a place, we should follow the customs of that place. It shows an attitude: you are willing to change your way of doing things to fit in with those around you.\n\nThe place does not have to be a new country. It can simply be a new situation. For example, you may usually speak very loudly. But in an art museum or a library, you whisper. You follow the rules of that place.\n\nThe expression has another meaning too. When you are in an unfamiliar situation, you should follow the lead of those who know the rules. These people know how to behave with others, and how to work within the system. They blend in.\n\nBut what does Rome have to do with following other people’s customs? Here is how the story goes. More than 1500 years ago, a Christian leader, Saint Augustine, moved from Rome to Milan. In the new city, he found some parts of religious life to be different. In Rome he fasted, or did not eat, on Saturday. But in Milan, people did not fast on Saturday.\n\nAnother church leader, Saint Ambrose, gave him some advice. He said that when he goes to Rome he fasts on Saturdays, but when he is in Milan, he does not. Problem solved.\n\nThis advice has survived over the years. Some word experts say it first appeared in English around 500 years ago. We still use it today, either to give advice or to describe a situation where we have to change our behaviour to fit in.\n\nSource: ‘When in Rome …’ by Anna Matteo, Words and Their Stories, VOA Learning English (learningenglish.voanews.com). VOA Learning English texts are in the public domain and may be reprinted with credit."
        },
        {
          "type": "text",
          "label": "A.  Choosing Your Text",
          "body": "What to do\n• Read the class profile and the three texts above. Choose ONE text.\n• Check it suits their level (englishprofile.org helps), is a sensible length, matches their interests, is a genre they would meet outside class, and gives you enough to build two reading tasks and one productive task from.\n\nWhat to write\n• Which text you chose, and why, against the points above."
        },
        {
          "type": "text",
          "label": "B.  Your First Reading Task",
          "body": "What to do\n• Design a reading-for-gist task. Attach it as Appendix 2, laid out as a handout, with the answer key.\n• It must need the text — not answerable by common sense — and focus on the message, not on vocabulary or grammar.\n• Reading stage only. No lead-in, no pre-teaching — they are not part of this assignment and use up your word count.\n\nWhat to write\n• What reading for gist is, with reference to your reading.\n• How your task develops it, and whether these learners would do something similar outside class.\n• The procedure: set-up, what students do, interaction, timing, and how you handle feedback and wrong answers."
        },
        {
          "type": "text",
          "label": "C.  Your Second Reading Task",
          "body": "What to do\n• Choose reading for specific information OR reading for detail.\n• Design the task. Attach it as Appendix 3, laid out as a handout, with the answer key.\n• Same conditions as B: it must need the text, and the reading stage only.\n\nWhat to write\n• Which sub-skill you chose and what it is, with reference to your reading.\n• How your task develops it, and whether these learners would do something similar outside class.\n• The procedure, as in B."
        },
        {
          "type": "text",
          "label": "D.  Your Productive Follow-up Task",
          "body": "What to do\n• Choose speaking OR writing. Design the task and attach it as Appendix 4, laid out as a handout.\n• It must genuinely follow the text — it should not work as a standalone task.\n• It must have a communicative purpose. For speaking, learners need a reason to listen to each other.\n\nWhat to write\n• Which skill you chose and why, with reference to the learners’ needs and what they do outside class.\n• Why a follow-up stage after reading matters, with reference to your reading.\n• The procedure: set-up, what students do, interaction, timing, and feedback on whether the task was achieved.\n\nAttach all three tasks, with the two answer keys, using the materials link on this submission."
        },
        {
          "type": "text",
          "label": "Bibliography",
          "body": "List every resource you used while writing this assignment. Any consistent style is fine. A generator such as mybib.com/tools/harvard-referencing-generator can help.\n\nExample:  Scrivener, J. (2011). Learning Teaching (3rd ed.). MacMillan."
        },
        {
          "type": "text",
          "label": "Recommended Reading",
          "readonly": true,
          "body": "• Scrivener, J. (2011). Learning Teaching (3rd ed.). MacMillan.\n• Harmer, J. (2015). The Practice of English Language Teaching. Pearson.\n• Harmer, J. (2012). Essential Teacher Knowledge. Pearson.\n• Harmer, J. (2007). How to Teach English. Pearson.\n• Harmer, J. (2004). How to Teach Writing. Pearson.\n• Thornbury, S. (2005). How to Teach Speaking. Pearson.\n• Silberstein, S. (1994). Techniques and Resources in Teaching Reading. Oxford University Press.\n• englishprofile.org — vocabulary and grammar mapped to CEFR levels."
        },
        {
          "type": "declaration",
          "label": "Declaration",
          "aiToggle": true,
          "items": [
            "This assignment is my own work.",
            "I have referenced all sources I used, including any AI tools.",
            "My work is between 750 and 1,000 words."
          ]
        }
      ]
    },
    "fol": {
      "title": "Focus on the Learner",
      "criteria": [
        "Showing awareness of how the learner’s background, previous learning experience and learning preferences affect learning",
        "Identifying the learner’s language and/or skills needs",
        "Correctly using terminology relating to the description of language systems and language skills",
        "Selecting appropriate material and/or resources — at least one from published materials — to aid the learner’s language development",
        "Providing a rationale for using specific activities with the learner in mind",
        "Finding, selecting and referencing information from one or more sources, using written language that is clear, accurate and appropriate to the task"
      ],
      "sections": [
        {
          "type": "text",
          "label": "Before you start",
          "readonly": true,
          "body": "Describing your TP group, identifying a grammar and a pronunciation problem, and choosing activities to address them.\n\nYou will describe your current TP group, identify one grammar and one pronunciation difficulty you have noticed in TP1–4, and present one activity for each. At least one activity must come from a published source; the other can be published, online or your own.\n\nWord count — 750–1,000 words, in continuous prose, excluding the bibliography and appendices.\nFirst submission — write your answers in the boxes below and submit.\nSecond submission — if a resubmission is needed, your tutor returns this with their comments and the boxes open again. Passing on first or second submission does not affect your certificate grade. You must pass 3 of 4 assignments to be eligible for a PASS.\nWhen resubmitting — your tutor’s comments stay where they are. Do not delete old appendices — add new ones.\n\nSubmission requirements — check these before you submit.\n750–1,000 words. Continuous prose, excluding the bibliography and appendices.\nAppendices attached. One grammar task and one pronunciation task, as handouts, each saying where it came from.\nDeclaration completed. Including any AI use, as set out in Your Own Work.\n\nReferencing and use of AI\n• Refer to at least one published source in the body of your assignment, and cite it clearly enough that a reader could find it. Any consistent style is fine. Recommended reading is at the end.\n• AI is allowed only for ideas, initial research and bibliography — not for writing or rewriting your text. Cite every use in the text (prompt, tool, year) and in your reference list with the conversation link, as set out in Your Own Work."
        },
        {
          "type": "text",
          "label": "A.  Your TP Group",
          "body": "What to write\n• How many students, their genders, age range and level.\n• Their first languages, and any others they speak.\n• Their jobs and education — first names in brackets, no surnames.\n• Why they are learning English. Use the terminology from your reading.\n• Their previous English learning — how long, and by what methods.\n• Their learning preferences. The activities you choose later must match these."
        },
        {
          "type": "text",
          "label": "B.  The Grammar Problem",
          "body": "What to write\n• Name the grammar area, using the correct term.\n• Give two examples of the mistake. For each: who made it, spoken or written, which lesson stage, and the correct version.\n• Explain why they make it — L1 interference, level, fossilisation, not enough practice.\n• Refer to your reading."
        },
        {
          "type": "text",
          "label": "C.  The Pronunciation Problem",
          "body": "What to write\n• Name the area, using the correct term and IPA.\n• Give two examples. For each: who made it, and both the wrong and the correct pronunciation in IPA.\n• Explain why they make it, as in B.\n• Refer to your reading."
        },
        {
          "type": "text",
          "label": "D.  The Grammar Task",
          "body": "What to write\n• Attach ONE task as Appendix 1 and say where it is from. One task only — tutors cannot choose for you.\n• Explain why it fits: the group’s preferences from A, their level, and the context the mistakes were made in (spoken or written, controlled or freer).\n• Describe the procedure: how you set it up, what students do, for how long, in what interaction, how you monitor, and how you give feedback.\n\nAttach the task itself with the materials link on this submission, and say in the box above where it came from."
        },
        {
          "type": "text",
          "label": "E.  The Pronunciation Task",
          "body": "What to write\n• Attach ONE task as Appendix 2 and say where it is from. One task only.\n• It must have students producing the sound, not just hearing it. Repeating after the teacher is not a task.\n• Explain why it fits: the group’s preferences from A, and their level.\n• Describe the procedure, as in D."
        },
        {
          "type": "text",
          "label": "Bibliography",
          "body": "List every resource you used. Any consistent style is fine. A generator such as mybib.com/tools/harvard-referencing-generator can help.\n\nExample:  Scrivener, J. (2011). Learning Teaching (3rd ed.). MacMillan."
        },
        {
          "type": "text",
          "label": "Recommended Resources",
          "readonly": true,
          "body": "• Swan, M. and Smith, B. (2001). Learner English (2nd ed.). Cambridge University Press.\n• englishprofile.org/english-grammar-profile — grammar mapped to CEFR levels.\n• Scrivener, J. (2011). Learning Teaching (3rd ed.). MacMillan.\n• Harmer, J. (2015). The Practice of English Language Teaching. Pearson.\n• englishclub.com/pronunciation/minimal-pairs.php\n• Hancock, M. (2001). Pronunciation Games. Cambridge University Press.\n• Baker, A. (2007). Tree or Three? Cambridge University Press.\n• Baker, A. (2008). Ship or Sheep? Cambridge University Press.\n• Murphy, R. (2007). Essential Grammar in Use — Elementary (3rd ed.). Cambridge University Press.\n• Murphy, R. (2004). English Grammar in Use — Intermediate (3rd ed.). Cambridge University Press."
        },
        {
          "type": "declaration",
          "label": "Declaration",
          "aiToggle": true,
          "items": [
            "This assignment is my own work.",
            "I have referenced all sources I used, including any AI tools.",
            "My work is between 750 and 1,000 words."
          ]
        }
      ]
    },
    "lfc": {
      "title": "Lessons from the Classroom",
      "criteria": [
        "Identifying their own teaching strengths and weaknesses in light of feedback from learners, teachers and tutors, and how these affect the learners",
        "Identifying which ELT areas of knowledge and skills they need further development in, with practical ways to improve",
        "Reflecting on their observation of other teachers in relation to their own development",
        "Describing in a specific way how to develop ELT knowledge and skills beyond the course",
        "Using written language that is clear, accurate and appropriate to the task"
      ],
      "sections": [
        {
          "type": "text",
          "label": "Before you start",
          "readonly": true,
          "body": "Reflecting on your teaching, what you learned from watching others, and where you go next.\n\nThis assignment is a reflection on your progress during the course. You will summarise your main teaching strengths and action points, what you learned from observing peers and experienced teachers, and how you plan to keep developing after the CELTA.\n\nWord count — 750–1,000 words, in continuous prose, excluding the bibliography.\nFirst submission — write your answers in the boxes below and submit.\nSecond submission — if a resubmission is needed, your tutor returns this with their comments and the boxes open again. Passing on first or second submission does not affect your certificate grade. You must pass 3 of 4 assignments to be eligible for a PASS.\nWhen resubmitting — your tutor’s comments stay where they are.\n\nSubmission requirements — check these before you submit.\n750–1,000 words. Continuous prose, excluding the bibliography.\nDeclaration completed. Including any AI use, as set out in Your Own Work.\n\nReferencing and use of AI\n• This is a reflection on your own teaching, so most of it will not need references. Where you draw on reading, cite it clearly enough that a reader could find it. Recommended reading is at the end.\n• AI is allowed only for ideas, initial research and bibliography — not for writing or rewriting your text. Cite every use in the text (prompt, tool, year) and in your reference list with the conversation link, as set out in Your Own Work."
        },
        {
          "type": "text",
          "label": "A.  Your Strengths",
          "body": "What to write\n• Look back at the tutor feedback on your three most recent TPs.\n• Identify three teaching strengths you have shown.\n• Back each one with at least one tutor comment, saying which TP it is from, e.g. (TP6). Add a peer comment too if you can.\n• Explain how each strength benefits the students.\n\nStrength 1 —\nStrength 2 —\nStrength 3 —"
        },
        {
          "type": "text",
          "label": "B.  Your Action Points",
          "body": "What to write\n• From the same feedback, identify three action points you still have.\n• Back each one with at least one tutor comment, saying which TP it is from. Add a peer comment too if you can.\n• Explain how each action point affects the students.\n• Give one practical suggestion for addressing each one.\n\nAction point 1 —\nAction point 2 —\nAction point 3 —"
        },
        {
          "type": "text",
          "label": "C.  What You Learned From Watching Others",
          "body": "What to write\n• Go through your peer observation tasks, tutors’ live lessons and video observations.\n• For each action point in B, give one example of another teacher avoiding that problem in their lesson.\n• Say who — a tutor or peer by first name, or the video number. Describe what they did, using their actual words where it helps (instructions, CCQs), and why it worked.\n\nExample for action point 1 —\nExample for action point 2 —\nExample for action point 3 —"
        },
        {
          "type": "text",
          "label": "D.  After the Course",
          "body": "What to write\n• Choose three areas to focus on after the course — your own language, experience in a particular teaching context, a teaching method, an area of language analysis, or similar. Say which.\n• Why each is a priority, and how working on it will affect your students.\n• What you will actually do over the next year. Be specific: books by author and title, a language exam and why, a conference or webinar with a link, a further course with a link.\n\nFor each of the three, give the area, why this area, and what you are going to do."
        },
        {
          "type": "text",
          "label": "Bibliography",
          "body": "List any resources you drew on. Any consistent style is fine. A generator such as mybib.com/tools/harvard-referencing-generator can help.\n\nExample:  Scrivener, J. (2011). Learning Teaching (3rd ed.). MacMillan."
        },
        {
          "type": "text",
          "label": "Recommended Reading",
          "readonly": true,
          "body": "• Harmer, J. (2007). How to Teach English. Pearson.\n• Harmer, J. (2015). The Practice of English Language Teaching. Pearson.\n• Scrivener, J. (2011). Learning Teaching (3rd ed.). MacMillan.\n• Thornbury, S. (2007). How to Teach Vocabulary. Pearson."
        },
        {
          "type": "declaration",
          "label": "Declaration",
          "aiToggle": true,
          "items": [
            "This assignment is my own work.",
            "I have referenced any sources I used, including any AI tools.",
            "My work is between 750 and 1,000 words."
          ]
        }
      ]
    }
  }
];

/* Names the assignments that were replaced, mutating `wording` in place.
   Empty when there was nothing to do, which is the normal case. */
window.CONNECT_HUB_ADOPT_CORRECTED_CRITERIA = function(wording){
  var versions = window.CONNECT_HUB_SUPERSEDED_WORDING, now = window.CONNECT_HUB_DEFAULT_WORDING, changed = [];
  if (!wording || !versions || !now) return changed;
  var same = function(a, b){ return JSON.stringify(a) === JSON.stringify(b); };
  (versions || []).forEach(function(was){
    Object.keys(was).forEach(function(k){
      var a = wording[k];
      if (!a || !a.criteria || !now[k] || changed.indexOf(k) >= 0) return;
      // Screen 8 has stored criteria as bare strings in the past; read both.
      var stored = a.criteria.map(function(c){ return typeof c === 'string' ? c : (c && c.text) || ''; });
      if (!same(stored, was[k].criteria)) return;

      /* Work out the replacement, then only write it if it differs. The
         versions overlap -- the criteria correction and the full briefs were
         two releases on one day, so the second version's CRITERIA are also the
         current ones -- and without this an assignment already up to date
         matched a version, was "replaced" with itself, and reported a change on
         every single boot. Comparing the result makes that impossible however
         the list grows. */
      var next;
      if (same(a.sections, was[k].sections)) {
        // Untouched end to end: give the course the whole shipped assignment,
        // keeping only what the centre set on this course.
        next = JSON.parse(JSON.stringify(now[k]));
        ['dueAt','resubDays','releaseAt'].forEach(function(f){ if (a[f] !== undefined) next[f] = a[f]; });
      } else {
        next = JSON.parse(JSON.stringify(a));
        next.criteria = now[k].criteria.map(function(c){ return { text: c.text, sectionIndex: null }; });
        if (next.title === was[k].title) next.title = now[k].title;
      }
      if (same(a, next)) return;

      Object.keys(a).forEach(function(f){ delete a[f]; });
      Object.keys(next).forEach(function(f){ a[f] = next[f]; });
      changed.push(k);
    });
  });
  return changed;
};
