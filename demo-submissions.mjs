/* The demo's four written assignments, written out in full (Ramy, 17 Oct 2026).
 *
 * Until now every demo submission was one 47-word placeholder paragraph, so a
 * tutor opening any of them on a demo read "47 words submitted, against
 * 750-1000 -- outside the range" beside a Pass. These are model answers to
 * Lite's own four briefs (assignment-defaults.js), section by section, each
 * inside 750-1,000 words as screen 9 and screen 10 count them: every text box
 * plus every analysis table.
 *
 * They are written for the demo's own world: Elmswood English Centre, two TP
 * groups (group 1 at A2, group 2 at B1, Speakout), the volunteers the seed
 * makes, tutors Jordan Blake and Diane Okonkwo. Nothing here is a real
 * trainee's work. Keys are the section INDEXES of the shipped wording; a
 * centre that rewrote its briefs is not a demo and never runs this.
 */

const P = (...lines) => lines.join('\n\n');

/* Focus on the Learner: written about the trainee's own TP group. */
function fol(group) {
  const a2 = group === '1';
  return {
    1: P(
      `My TP group has eight adult students, five women and three men, aged between 22 and 58. ${a2 ? 'They are an elementary (A2) group' : 'They are a lower intermediate (B1) group'}, placed by the centre's level test, and they come to two-hour lessons four afternoons a week.`,
      `Their first languages are Turkish (four students), Arabic (two), Russian (one) and French (one). ${a2 ? 'Mehmet' : 'Elena'} also speaks some German, and the two Arabic speakers learned French at school.`,
      `Their jobs vary: a pharmacist (${a2 ? 'Omar' : 'Ayşe'}), two university students, a retired engineer, a hotel receptionist, a nurse and two office workers. Most have finished secondary school and four have a degree.`,
      `Most are learning English for instrumental reasons, in Harmer's sense: for work, for study abroad, or to travel without depending on others. The retired engineer is learning for its own sake, so his motivation is more integrative and intrinsic.`,
      `Their previous learning was mostly grammar-translation at school, with long lists of rules and little speaking. Three studied in a private course for a year. They know a lot of grammar terminology but have had few chances to use English in real time.`,
      `In feedback slips after TP3 they said they like pair work, short speaking tasks with a clear purpose, and seeing the language written on the board before they use it. They dislike long listening texts and being corrected in front of the whole class. The activities I choose below follow these preferences.`,
    ),
    2: P(
      `The grammar problem is the ${a2 ? 'present simple third person singular -s' : 'past simple of irregular verbs in narrative'}.`,
      a2
        ? `Example 1: Mehmet said "My wife work in a bank" during the freer speaking stage of TP2 (spoken). The correct form is "My wife works in a bank".`
        : `Example 1: Elena said "Yesterday I goed to the market" during the freer speaking stage of TP2 (spoken). The correct form is "Yesterday I went to the market".`,
      a2
        ? `Example 2: Omar wrote "He drive to work every day" in the controlled practice of TP3 (written). The correct form is "He drives to work every day".`
        : `Example 2: Ayşe wrote "We buyed a cake for her" in the controlled practice of TP3 (written). The correct form is "We bought a cake for her".`,
      a2
        ? `The main reason is L1 interference: Turkish and Arabic mark person on the verb in different ways, and the English -s carries no meaning the learner needs, so it is easy to drop. It is also a matter of level: the students know the rule and can apply it in a gap-fill, but under the pressure of speaking they leave it out. Swan and Smith (2001) note that this error is common across many L1 groups and often fossilises without enough meaningful practice.`
        : `This is overgeneralisation rather than L1 interference: the learners have learned the regular -ed rule well and apply it to irregular verbs. It shows they are developing, not guessing. Thornbury (1999) describes this as a normal stage of interlanguage. The problem is a lack of enough practice: the irregular forms have been met in lists but not used often enough in context to become automatic.`,
    ),
    3: P(
      `The pronunciation problem is the ${a2 ? 'voiced and voiceless "th" sounds, /θ/ and /ð/' : 'vowel contrast between /ɪ/ and /iː/'}.`,
      a2
        ? `Example 1: Omar said /tɪŋk/ for "think"; the correct pronunciation is /θɪŋk/.`
        : `Example 1: Elena said /liːv/ ("leave") when she meant "live", /lɪv/, so the meaning changed.`,
      a2
        ? `Example 2: Mehmet said /zɪs/ for "this"; the correct pronunciation is /ðɪs/.`
        : `Example 2: Ayşe said /ʃiːp/ for "ship"; the correct pronunciation is /ʃɪp/.`,
      a2
        ? `The reason is L1 interference: neither Turkish nor Arabic as these students speak it has /θ/ or /ð/, so they replace them with the nearest sounds in their own systems, /t/ and /z/. Kelly (2000) lists this as a common substitution. It rarely blocks meaning, but it makes their speech harder to follow.`
        : `The reason is L1 interference: Turkish and Russian do not separate vowel length in the same way, so the learners hear one sound where English has two. Because it changes meaning (live and leave, ship and sheep), it matters more than many accent features. Kelly (2000) recommends minimal pairs that make learners both hear and produce the difference.`,
    ),
    4: P(
      `The task, attached as Appendix 1, is "Find someone who" from ${a2 ? 'Speakout A2, 3rd edition, unit 2' : 'Speakout B1, 3rd edition, unit 3'} (Pearson), adapted with the students' own topics.`,
      `It fits this group because they enjoy pair work and short speaking tasks with a clear purpose (section A), and because the error appeared in speaking, so the practice must be spoken too. At their level the task is controlled enough to focus on the form but still needs real questions and answers. Each student must report back about a classmate, ${a2 ? 'which forces the third person -s in a meaningful sentence' : 'which needs several past simple forms in sequence'}.`,
      `Procedure: I model one question and answer with a strong student and write the target form on the board, highlighting ${a2 ? 'the -s' : 'the irregular past forms'}. Students mingle for eight minutes, asking each classmate one question and noting names. I monitor quietly and note errors without interrupting, because the students dislike being corrected in public. Then pairs report two findings to each other for three minutes. In feedback I write four sentences I heard on the board, two correct and two not, and the class corrects them together, so no one is singled out.`,
    ),
    5: P(
      `The task, attached as Appendix 2, is a minimal-pairs bingo from Hancock, M. (2003) English Pronunciation in Use Intermediate, Cambridge University Press, unit ${a2 ? '23' : '3'}.`,
      `It fits the group because it is a short game in pairs, which they enjoy, and because every student must produce the sounds, not only hear them: the caller reads a word aloud and the partner marks the card, so if the sound is wrong the partner marks the wrong square. That gives immediate, private feedback, which suits learners who do not want public correction.`,
      `Procedure: first I drill the two sounds with a mirror and a gesture (${a2 ? 'tongue between the teeth for /θ/ and /ð/' : 'a long smile for /iː/, a short relaxed sound for /ɪ/'}) for three minutes, choral then individual. Then in pairs, student A reads ten words from a list while B marks the bingo card, then they swap, for six minutes. I monitor and listen for the target sounds, noting which words caused trouble. In feedback I drill those words again and ask two pairs to show a word that confused them, so the class hears the contrast again.`,
    ),
    6: P(
      `Harmer, J. (2015). The Practice of English Language Teaching (5th ed.). Pearson.`,
      `Kelly, G. (2000). How to Teach Pronunciation. Longman.`,
      `Swan, M. and Smith, B. (2001). Learner English (2nd ed.). Cambridge University Press.`,
      `Thornbury, S. (1999). How to Teach Grammar. Longman.`,
      `Hancock, M. (2003). English Pronunciation in Use Intermediate. Cambridge University Press.`,
      `Speakout, 3rd edition (2021-2022). Pearson.`,
    ),
  };
}

/* Language Related Tasks: four items from the letter, one table each. The
   picked items must match the options in the brief character for character. */
const LRT_PICKED = { 2: { A: ['I’ve tried'], C: ['settle in', 'delighted'] } };
const LRT_ITEMS = [
  /* I've tried */ [
    'Present perfect for experience: Deniz has done the activity at least once in her life up to now; when is not important. "I\'ve tried surfing twice now."',
    'CCQs: Has Deniz surfed? (Yes.) Do we know exactly when? (No.) Is it important when? (No.) Could she try again? (Yes, her life in Lisbon continues.) Timeline: a line from the past to now with two crosses, no dates. Personalised example: "I\'ve tried Turkish coffee, but I didn\'t like it."',
    'Subject + have/has + past participle. I + \'ve + tried. Question: Have you tried...? Negative: I haven\'t tried... "tried" is a regular past participle: try + -ed, y changes to i.',
    '/aɪv traɪd/. Contracted \'ve is weak and links to the verb; stress on "tried": I\'ve TRIED. The final /d/ is short and often unreleased before the next consonant.',
    'Very common in speech and informal writing to talk about experiences, often with "twice", "never", "ever", "before". Neutral to informal; the contraction is normal in a letter to a friend.',
    'Meaning: learners may use the past simple ("I tried surfing twice") when they mean experience up to now, or add a finished time ("I\'ve tried it last week"). Solution: the timeline and the CCQ about when. Form: learners may drop the auxiliary ("I tried") or use the past form after have; drill the form and show it on the board. Pronunciation: learners may say "I have" fully; drill the contraction chorally.',
    'Swan, M. (2016). Practical English Usage (4th ed.), 449-451. Parrott, M. (2010). Grammar for English Language Teachers (2nd ed.), 211-215.',
  ],
  /* Let's talk properly soon */ [
    'A friendly suggestion used to close a letter or conversation: the writer wants a longer, real conversation in the near future, not a short message.',
    'CCQs: Is Deniz ending the letter? (Yes.) Does she want to talk now? (No, later.) Does "properly" mean a short chat or a long one? (A long one.) Is it an order? (No, a friendly suggestion.) Example: at the end of a phone call, "I have to go, but let\'s talk properly soon."',
    'Let\'s + base verb + adverb + time adverb. Let + us (contracted to \'s) + talk + properly + soon. Fixed chunk: teach it as a whole phrase first, then show the parts.',
    '/lets tɔːk ˈprɒpəli suːn/. Main stresses on TALK, PROP- and SOON. "Let\'s" links into "talk"; the /t/ of "let\'s" is weak. Falling intonation at the end, warm and friendly.',
    'Informal; used with friends, family and colleagues you know well, usually at the end of a message or call. Not used in a formal letter, where "I look forward to speaking with you" fits better.',
    'Meaning: learners may think it means "now" or that it is an order; the CCQs about time and suggestion help. Form: learners may say "Let\'s to talk" or "Let us talking"; show that the verb is the base form. Pronunciation: learners may stress every word; drill the three stresses with back-chaining. Use: learners may use it in a formal email; contrast it with the formal equivalent.',
    'Swan, M. (2016). Practical English Usage (4th ed.), 318. McCarthy, M. and O\'Dell, F. (2017). English Collocations in Use, 92.',
  ],
  /* settle in */ [
    'Phrasal verb: to become comfortable and used to a new place, home or job. Her flatmates helped Deniz feel at home in her new life in Lisbon.',
    'CCQs: Is Deniz in a new place? (Yes.) At first, did she feel at home? (No.) Now, does she feel comfortable? (Yes.) Does it happen in one day? (No, it takes time.) Personalised example: "How long did it take you to settle in at this school?"',
    'settle (verb) + in (particle). Intransitive: "I\'ve settled in." With help: "They helped me settle in" (help + object + base verb). Past: settled in.',
    '/ˌsetl ˈɪn/. Stress on the particle: settle IN. The /l/ is syllabic and links to "in": settl-in. The /t/ is often a light tap.',
    'Neutral; very common for moving house, a new job, a new school or country. Used in speech and informal writing.',
    'Meaning: learners may confuse it with "settle down" (start a calmer, stable life); give one example of each. Form: learners may separate it ("settle me in") or add "to"; show the pattern on the board. Pronunciation: learners often stress the verb; drill with the stress on IN.',
    'Cambridge Dictionary, "settle in". McCarthy, M. and O\'Dell, F. (2017). English Phrasal Verbs in Use Intermediate (2nd ed.), unit 21.',
  ],
  /* delighted */ [
    'Adjective: very happy and pleased about something good that has happened. Marta is very happy about the new job.',
    'CCQs: Is Marta happy? (Yes.) A little happy or very happy? (Very.) Is it about something good? (Yes, the new job.) Would you be delighted if you lost your phone? (No.) Cline on the board: pleased, happy, delighted, over the moon.',
    'Adjective formed from the verb "delight" + -ed. Patterns: be delighted with something, delighted to + verb ("delighted to hear"), delighted that + clause. Here: "absolutely delighted": extreme adjectives take "absolutely", not "very".',
    '/dɪˈlaɪtɪd/. Three syllables, stress on the second: de-LIGHT-ed. The -ed is pronounced /ɪd/ because the verb ends in /t/.',
    'Neutral to slightly formal; common in speech and writing, and in polite formulas ("We are delighted to announce..."). Stronger than "happy".',
    'Meaning: learners may use it for small pleasures, or confuse it with "delightful" (describing the thing, not the person). Form: learners may say "very delighted"; teach "absolutely delighted". Pronunciation: learners may pronounce -ed as /d/ only; drill the three syllables and the stress.',
    'Cambridge Dictionary, "delighted". Oxford Learner\'s Dictionary, "delighted". Swan, M. (2016). Practical English Usage (4th ed.), 296.',
  ],
];
function lrtFields() {
  const out = {};
  LRT_ITEMS.forEach((item, ii) => item.forEach((v, fi) => { out[`s3_i${ii}_f${fi}`] = v; }));
  return out;
}
/* The four items as hubPickedItems lists them: A, then the fixed B, then C. */
const LRT_ORDER = ['I’ve tried', 'Let’s talk properly soon', 'settle in', 'delighted'];

/* Language Skills Related Tasks: Text B, for the class described. */
const LSRT = {
  5: P(
    `I chose Text B, "Five Tips for Great Language Exchanges".`,
    `Level: the English Profile shows most of its vocabulary is at A2-B1, with a few items such as "dependable" and "rigid" that the context makes clear, so it suits a B1 class.`,
    `Length: about 400 words, which these learners can read in the time a reading stage allows.`,
    `Interests: the class is studying English to advance their careers and to travel, and they spend time together outside class. A text about practising a language with a partner speaks directly to them, and two plan to take IELTS next year, so independent practice matters.`,
    `Genre: an online article with numbered tips, which they will meet on websites and in apps. It is organised in five clear points, so there is enough for a gist task, a detail task and a speaking task that grows from it.`,
    `I did not choose Text A, about the Aleutian Islands, because although it is about travel, it is mostly description with few ideas students could act on, so a productive task would feel forced. Text C, about customs abroad, would also work, but its many cultural examples need more pre-teaching of vocabulary than one reading stage allows.`,
  ),
  6: P(
    `Reading for gist means reading quickly to understand the general idea of a text, without stopping at unknown words (Harmer, 2015). It is what we do when we skim an article to decide whether it is worth reading.`,
    `My task (Appendix 2) gives three possible titles: "Why language exchanges fail", "How to get the most from a language exchange" and "A student's life in America". Students read in two minutes and choose the best one, then compare in pairs. The answer is the second title; the first is only one idea and the third uses a detail from the opening.`,
    `It develops gist reading because the time limit stops word-by-word reading and the options need the whole message, not one sentence. These learners skim articles online already, so it mirrors something they do outside class.`,
    `Procedure: I hand out the task face down, explain it, check with "How long do you have? (Two minutes.) Do you need every word? (No.)", then give the text. Students read alone, compare in pairs for one minute, and I take the answer from the class with a reason.`,
  ),
  7: P(
    `I chose reading for detail: reading carefully to understand exactly what the text says, including the reasons behind the advice (Scrivener, 2011).`,
    `My task (Appendix 3) has six true/false/not given statements, for example "Bryant says one partner is enough" (false: he recommends at least two) and "Qiu corrects every mistake" (false: only when a partner cannot finish a sentence). Each item needs a specific part of the text, and "not given" makes students check rather than guess.`,
    `It develops reading for detail because students must locate the relevant sentence and read it closely. True/false/not given is also an IELTS task type, which suits the two students preparing for it, and they can use the same strategy of underlining the key words in each statement before reading.`,
    `Procedure: students read the statements first, then read the text again for six minutes and answer alone. In pairs they compare and show each other the line that proves each answer. In feedback I nominate pairs and ask for the line, so the answer comes from the text, not from memory.`,
  ),
  8: P(
    `I chose speaking, because the class's spoken accuracy needs attention and they are keen to communicate.`,
    `A follow-up stage matters because it lets learners respond to the content and use the language they have just met for a real purpose (Harmer, 2015). Without it, the text stays an exercise; with it, the ideas become theirs.`,
    `My task (Appendix 4): in pairs, students plan their own language exchange. Each writes three questions they would prepare for a first meeting (tip four), then they hold a five-minute "first meeting", taking turns to ask and answer. Their partner gives one correction only at the end, as Bryant advises. They have a reason to listen because they must agree a time and a topic for their next meeting.`,
    `Procedure: I set up with an example question, give three minutes to prepare, then five minutes to talk. I monitor and note language for delayed error correction. Feedback: pairs tell the class the time and topic they agreed (task achieved), then I put three errors I heard on the board for the class to correct.`,
  ),
  9: P(
    `Bryant, A. "Five Tips for Great Language Exchanges". VOA Learning English, learningenglish.voanews.com.`,
    `Harmer, J. (2015). The Practice of English Language Teaching (5th ed.). Pearson.`,
    `Scrivener, J. (2011). Learning Teaching (3rd ed.). Macmillan.`,
    `English Profile. englishprofile.org/wordlists.`,
  ),
};

/* Lessons from the Classroom: the trainee's own course, with their tutor. */
function lfc(group) {
  const tutor = group === '1' ? 'Jordan' : 'Diane';
  const other = group === '1' ? 'Diane' : 'Jordan';
  return {
    1: P(
      `Strength 1 — Clear instructions. ${tutor} wrote: "Instructions were short, modelled and checked; everyone started the task straight away" (TP6). A peer noted the same in TP5: "Nobody looked lost." It helps the students because no time is lost and quieter students do not have to ask for help in front of others. At the start of the course my instructions were long, so this is a strength I have built through feedback, by scripting them and giving the handout only after the instruction check.`,
      `Strength 2 — Rapport. ${tutor} wrote: "You use names, smile and respond to what students say, not only how they say it" (TP7). Students feel safe to speak, which matters for a group that dislikes public correction. In the feedback slips after TP7, two students wrote that they liked being asked about their own lives, and they spoke more in the freer stage than in earlier lessons.`,
      `Strength 3 — Clarifying meaning. ${tutor} wrote: "Good CCQs and a clear timeline; the meaning was secure before the form" (TP5). Students understand before they practise, so the practice is meaningful rather than mechanical. I now plan CCQs with their answers in the language analysis sheet, which also makes the board work clearer, because I know exactly what I want to elicit.`,
    ),
    2: P(
      `Action point 1 — Teacher talking time. ${tutor} wrote: "You explained the answer yourself twice; let them get there" (TP6). Students lose speaking time, and the stronger ones wait while I talk. Suggestion: plan my feedback questions in advance, wait five seconds after asking, and let a peer answer before I confirm.`,
      `Action point 2 — Feedback on content after the productive task. ${tutor} wrote: "Feedback focused on errors only; ask what they found out first" (TP7). Students may feel their ideas did not matter. Suggestion: always start feedback with one content question before language, and write it in my plan so I do not skip it under time pressure.`,
      `Action point 3 — Timing of stages. ${tutor} wrote: "Controlled practice ran over and the freer task was cut" (TP5). Students get less freer practice, which is where they use the language for real. Suggestion: set a visible timer, give a two-minute warning, and mark in my plan which stage to shorten if I run late.`,
    ),
    3: P(
      `Example for action point 1 — In ${other}'s demonstration lesson she asked "Why do you think so?" and then waited, even through a silence, until a student answered. The students did the thinking and she spoke very little. Her silence was not awkward, because the students knew she was waiting for them.`,
      `Example for action point 2 — In TP7 my peer asked "So who is the best person to go on holiday with?" before any language feedback. Students laughed and compared answers, and then were happy to look at errors, because their ideas had been heard first.`,
      `Example for action point 3 — In the video observation of a lesson on travel (video 3), the teacher said "Two more minutes", stopped the practice on time even though some pairs had not finished, and moved on. The freer task had its full time, and the teacher used the last minute for content feedback, which is what I want to do.`,
    ),
    4: P(
      `Area 1 — Phonology. I still find it hard to write phonemic script quickly on the board, and students benefit when pronunciation is part of every lesson. I will work through Kelly, G. How to Teach Pronunciation, and Underhill, A. Sound Foundations, and use the phonemic chart in every class for the next year. I will also record one lesson a month and listen only for how I model and correct pronunciation.`,
      `Area 2 — Teaching young learners. Many jobs I am applying for include children's classes. I will take the Cambridge TKT Young Learners module within the year and read Pinter, A. Teaching Young Language Learners, because classroom management with children is very different from the adult classes I taught on this course.`,
      `Area 3 — Exam classes. Several students want IELTS. I will read Cullen, P. The Official Cambridge Guide to IELTS and observe an experienced IELTS teacher at my first school before I teach an exam class. I will also take a practice test myself, so I know from the inside what the reading and writing papers ask of a candidate.`,
    ),
    5: P(
      `Harmer, J. (2007). How to Teach English. Pearson.`,
      `Kelly, G. (2000). How to Teach Pronunciation. Longman.`,
      `Underhill, A. (2005). Sound Foundations. Macmillan.`,
      `Pinter, A. (2017). Teaching Young Language Learners (2nd ed.). Oxford University Press.`,
      `Cullen, P. (2014). The Official Cambridge Guide to IELTS. Cambridge University Press.`,
    ),
  };
}

/** The submission body for one assignment: { picked, text, fields }. */
export function demoSubmission(code, group) {
  if (code === 'fol') return { picked: {}, text: fol(group), fields: {} };
  if (code === 'lrt') return { picked: JSON.parse(JSON.stringify(LRT_PICKED)), text: {}, fields: lrtFields() };
  if (code === 'lsrt') return { picked: {}, text: { ...LSRT }, fields: {} };
  if (code === 'lfc') return { picked: {}, text: lfc(group), fields: {} };
  return null;
}

/** Words as screens 9 and 10 count them. */
export function countWords(sub) {
  const t = Object.values(sub.text || {}).join(' ') + ' ' + Object.values(sub.fields || {}).join(' ');
  return (t.match(/\S+/g) || []).length;
}

export { LRT_ORDER };
