/* A WORKED EXAMPLE INSIDE EACH ASSIGNMENT (Ramy, 18 Nov 2026, C/21's first week: "they can click on the example and
 * then it opens an example for them. Not a full assignment. It's part of it."). The lesson plan's language analysis has
 * had "See a worked example" since September; the four assignments had nothing. These are the centre's own samples
 * (the four "Sample" PDFs handed out with C/17 and C/18), one part of each, never a whole assignment:
 *
 *   lrt   one item analysed in full; the item is not in the letter
 *   lsrt  one reading task with its aim and rationale; the text is not one of the assignment's
 *   fol   the grammar problem, for an invented class
 *   lfc   one action point and what was learned from watching another teacher; every name is made up
 *
 * They belong to Lite, not to a course's wording, so every course shows them and no course's own brief is touched.
 * The page asks hubAsgExample(key, section) while it draws a section, and gets the link and its box, or nothing: the same
 * "See a worked example" link and gold-edged box as the lesson plan's language analysis sheet. */
(function (root) {
  'use strict';
  /* Ramy, 18 Nov 2026: "make sure there's a clear warning not to copy or use the same activities in the assignments.
     In red or something." The warning comes first, in the house red; `same` names what must not be reused. */
  var NOTE = function (what, same) {
    return '<p class="wex-warn"><b>Do not copy this example.</b> ' + same + ' Work that repeats it is treated as plagiarism.</p>'
      + '<p class="wex-note">' + what + '</p>';
  };
  var H = function (t) { return '<p class="wex-h">' + t + '</p>'; };
  var P = function (t) { return '<p>' + t + '</p>'; };

  var EX = {
    lrt: {
      at: function (s) { return s.type === 'fields'; },
      html: NOTE('It shows the depth expected for one item.', 'This item is not in your letter and cannot be one of your four. Do not reuse its wording, its CCQs or its solutions for your own items.')
        + '<p class="wex-item">I wish he’d come.</p>'
        + H('Meaning') + P('A regret about the past. He did not come; I wanted him to. The situation cannot now be changed.')
        + H('Clarification of meaning') + P('Did he come? (No.) Did I want him to come? (Yes.) Is this about the past or the future? (The past.) Can I change it now? (No.) How do I feel? (Sorry, disappointed.)')
        + H('Form') + P('wish + past perfect simple<br>subject + wish + had + past participle<br>I wish he had come. I wish he’d come.')
        + H('Pronunciation') + P('/aɪ wɪʃ hiːd kʌm/<br>Sentence stress: I WISH he’d COME.<br><i>had</i> contracts to <i>’d</i> and is unstressed. Linking between <i>wish</i> and <i>he’d</i>.')
        + H('Use and appropriacy') + P('Neutral register, common in speech and writing. Used to express regret about something finished, not to make a request.')
        + H('Anticipated problems and solutions')
        + P('<b>Meaning.</b> Learners may think the event could still happen. Solution: use the CCQs above and a timeline showing the event closed in the past.')
        + P('<b>Form.</b> <i>’d</i> read as <i>would</i>, producing *I wish he would have come. Solution: elicit what <i>’d</i> stands for, then build the form on the board in a grid.')
        + P('<b>Pronunciation.</b> Learners stress <i>had</i> and break the link. Solution: model the contracted, linked version and drill chorally, then individually.')
        + H('References used') + P('Swan, M. (2016) Practical English Usage, 4th ed. OUP, p. 630.<br>Penston, T. (2005) A Concise Grammar for English Language Teachers. TP Publications, p. 88.')
    },
    lsrt: {
      at: function (s) { return /first reading task/i.test(s.label || ''); },
      html: NOTE('It shows the detail expected for one task. The text is a newspaper article, ‘Britons are winning war on smoking’ (The Observer, 2 November 2003), for an intermediate group. It is not one of your texts.', 'Do not use this text, this task or this activity in your assignment. Your own tasks must be different ones, designed for the text you chose.')
        + H('Sub-skill') + P('Scanning for specific information.')
        + H('Procedure')
        + P('Write the title of the article on the whiteboard and underneath, write down these figures in random order: 2005, one out of 4, 170,000, 500,000, 2000, 26%, 1998.')
        + P('Ask students how they think these numbers relate to each other and to the title of the article. Let students discuss this in pairs for about 3 minutes.')
        + P('After about 3 minutes, stop the activity and ask students for feedback. See if they agree with each other and draw arrows on the board, connecting the numbers (if appropriate) according to what students think, e.g. in 2000, the number of smokers dropped by 26%.')
        + P('Give students the text and tell them they have 2 minutes to quickly go through it, find the numbers and see if their predictions were right.')
        + P('After 2 minutes stop the students and ask them to place the article face down. Run feedback and see how many statistics students guessed correctly, if any.')
        + H('Aim') + P('To develop students’ ability to predict and scan a text for specific information.')
        + H('Rationale')
        + P('By giving the intermediate level students the title of the article and some key figures, I hope to encourage them to talk about trends in smoking, and therefore predict much of what the article is about. The numbers are ambiguous enough to allow for different hypotheses so this should generate quite a lot of discussion among students.')
        + P('Numbers generally stand out in a text so it should be quite easy for the students to scan the text and find the numbers quickly, therefore weaning them off the ‘word for word’ approach to reading. By raising their awareness that it isn’t necessary to understand every word, we can make our students better readers of English (Scrivener 94:153).')
        + H('What makes this a passing answer')
        + '<ul><li>The task is linked to one named sub-skill, and the procedure really makes students scan: numbers to find, a time limit, the text turned face down.</li>'
        + '<li>The rationale says how this task develops that sub-skill and why it helps learners.</li>'
        + '<li>It refers to background reading and credits the source.</li>'
        + '<li>The handout and the answers go in the appendix.</li></ul>'
    },
    fol: {
      at: function (s) { return /grammar problem/i.test(s.label || ''); },
      html: NOTE('It shows the detail expected for this one section. The class is invented: an A2 group of eight adults in Valencia, six Spanish speakers and two Italian speakers.', 'Do not use this grammar area, these learners or these sentences. Your own answer describes your own TP group, with real examples from real learners.')
        + P('The area I have chosen is the present perfect simple used for recent past events with a present result, as opposed to the past simple.')
        + P('The first example came from Marta (Spanish L1) in TP2, during the freer speaking stage of a lesson on holidays. She said “I have visited my grandmother last weekend.” The correct version is “I visited my grandmother last weekend”: the finished time expression makes the past simple obligatory.')
        + P('The second came from Paolo (Italian L1) in TP3, in a written sentence during controlled practice: “I have started this job in January.” The correct version is “I started this job in January”, again a finished time reference.')
        + P('Both learners are transferring their L1 pattern. In Spanish, the pretérito perfecto is used for events within the current day or with a link to now, and in Italian the passato prossimo is the default past tense in speech; Swan and Smith (2001, pp. 97, 173) note that speakers of both languages tend to over-use the present perfect where English needs the past simple. At A2 the contrast has been presented but not yet practiced enough to be automatic, so this is a developmental error rather than a fossilized one. Neither learner made it in every case, which suggests more controlled practice with time expressions would help.')
        + H('What makes this a passing answer')
        + '<ul><li>The area is named specifically: not “tenses” but one contrast.</li>'
        + '<li>Both examples have a named student, spoken or written, a lesson stage, and a correction.</li>'
        + '<li>The explanation gives a cause (L1 interference), judges the error’s status (developmental, not fossilized), and cites a source.</li>'
        + '<li>It is about 190 words, roughly a fifth of the assignment, which is right for one section of five.</li></ul>'
    },
    lfc: {
      at: function (s) { return /action points/i.test(s.label || ''); },
      html: NOTE('It shows one action point, and what the same trainee then wrote about it in section C. The names are made up.', 'Do not use this action point, these comments or this example. Yours come from your own TPs, your tutors’ and classmates’ feedback and your own observation tasks.')
        + H('B. One action point: drilling')
        + P('I’d love to become better at drilling too, as in TP6 my tutor noted that “my drilling was mostly choral repetition”, and my peers (Lena) felt “it was a bit rushed”.')
        + P('As a practical solution to that, I would like to implement the drilling techniques Scrivener suggests (Scrivener, 2011, p. 171). There are 16 of them, so I could focus on 1–2 new techniques to try in my next class, then move on to another pair.')
        + H('C. What I learned from watching others, for the same action point')
        + P('Backchaining drill worked well in Tomas’s TP7, e.g. “travel more”, “I’d travel more”, “If I had time and money, I’d travel more”. This way the students focused on smaller bits, like the infinitive, the ‘would’ clause, and then the whole conditional clause.')
        + H('What makes this a passing answer')
        + '<ul><li>The action point is backed by a tutor’s comment, with the TP it comes from, and a classmate’s comment.</li>'
        + '<li>It gives one practical suggestion, with a source and a page number.</li>'
        + '<li>The example in C says who, what they did, and why it helped.</li></ul>'
    }
  };

  /* the folded box for this section of this assignment, or '' */
  root.hubAsgExample = function (key, section, open) {
    var e = EX[key];
    if (!e || !section) return '';
    try { if (!e.at(section)) return ''; } catch (x) { return ''; }
    return '<div class="wex" data-wex="' + key + '"><button type="button" class="wex-btn" aria-expanded="' + (open ? 'true' : 'false') + '">See a worked example</button>'
      + '<div class="example-box wex-box' + (open ? ' open' : '') + '">' + e.html + '</div></div>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
