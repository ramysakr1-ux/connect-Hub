// The five assignments as Cambridge words them (specs/for-claude-code-five-
// assignments-wording.md), shared by screens 8, 9, 10 and 11. Screen 8 is
// where a centre reworks them; the other three fall back to these when the
// browser holds no saved wording -- before this, a trainee or tutor on a
// fresh device saw "This assignment isn't set up yet" for every assignment
// until someone pressed Save on the wording editor in that same browser
// (Hub walk, 20 Sep 2026).
//
// The CRITERIA are now the syllabus's own, verbatim: Component 2, assignments
// 2.1-2.4 (21816-celta-syllabus.pdf, p. 17-18). They did not used to be, which
// came out on 25 Sep 2026 when these were checked against the four assignments
// IH Istanbul actually sets on C/17. Three faults, all in the same direction:
//
//   1. Every one carried an extra criterion, "The assignment meets the
//      750-1,000-word count requirement". Cambridge puts the length under the
//      DESIGN of each assignment, not among the things a candidate is judged
//      on, and the centre's cover sheets put it under "Submission
//      requirements" beside the declaration. A candidate could be failed here
//      on a count. Removed; screen 10 now prints the count where the cover
//      sheet does (see summarize()).
//   2. Cambridge states referencing and clear written language as ONE
//      criterion for FOL and LSRT. Lite split it in two, so a weak
//      bibliography could cost a candidate two Not-mets instead of one.
//   3. LRT's four were paraphrases ("Analyses language correctly" for
//      "analysing language correctly FOR TEACHING PURPOSES") and LFC's seven
//      rewrote Cambridge's four. An assessor reads the criteria on the
//      candidate's record against CELTA 5; a paraphrase invites the question.
//
// So: fol 6, lrt 4, lsrt 4, lfc 5. lsrt also gained its plural -- Cambridge
// and the cover sheet both say "Tasks". The one departure from the syllabus
// kept here is lsrt's second criterion, identifying receptive and productive
// skills, which Cambridge lists under the design; C/17 assesses it, and a
// centre may. a5 is not a Cambridge assignment and keeps its own wording.
//
// What is NOT copied from C/17 is the SHAPE of lrt and lsrt -- C/17 analyses
// one grammar item, one functional exponent and two vocabulary items, and
// designs two reading tasks plus a productive follow-up from a chosen text.
// The syllabus explicitly allows a variety of formats, so that is the centre's
// design, not a default. Reworking these for a centre is what screen 8 is for.
window.CONNECT_HUB_DEFAULT_WORDING = {
  lrt: { title:'Language Related Tasks', wordMin:750, wordMax:1000, format:'structured', criteria:[
      {text:'Analysing language correctly for teaching purposes', sectionIndex:null},
      {text:'Correctly using terminology relating to form, meaning and phonology when analysing language', sectionIndex:null},
      {text:'Accessing reference materials and referencing information they have learned about language to an appropriate source', sectionIndex:null},
      {text:'Using written language that is clear, accurate and appropriate to the task', sectionIndex:null},
    ], sections:[
    { type:'text', label:'Before you start', body:'You\u2019ll pick 2 items from Category A and 2 from Category B, then analyse each one \u2014 meaning, form, pronunciation and so on. Work through this one step at a time; nothing is submitted until the last step.' },
    { type:'picker', label:'Pick your items',
      catA:{ label:'Category A', options:['Grammar item 1','Grammar item 2','Grammar item 3'] },
      catB:{ label:'Category B', options:['Lexis item 1','Lexis item 2','Lexis item 3'] },
      pickCount:2 },
    { type:'fields', label:'Analyse each item', intro:'Repeat this for each item you picked above.', fields:[
      { label:'Meaning', hint:'The essential meaning of the item, in this context.' },
      { label:'Clarification of meaning', hint:'CCQs (with answers), and/or a timeline, diagram, or personalised example.' },
      { label:'Form', hint:'Break down each part. Use accurate, specific terminology.' },
      { label:'Pronunciation', hint:'Phonemic script \u2014 weak forms, stress, linking, problem sounds.' },
      { label:'Appropriacy', hint:'Only where relevant \u2014 register, more/less formal alternatives.' },
      { label:'Anticipated problems & solutions', hint:'Cover meaning, form, AND pronunciation \u2014 a solution for each problem you raise.' }
    ]},
    { type:'declaration', label:'Declaration', items:['This is my own work.', 'All sources are referenced, in the format (Author, Year, p. ##).'], aiToggle:true }
  ]},
  lsrt: { title:'Language Skills Related Tasks', wordMin:750, wordMax:1000, format:'structured', criteria:[
      {text:'Correctly using terminology that relates to language skills and sub-skills', sectionIndex:null},
      {text:'Identifying receptive and productive skills that could be practised in relation to the text', sectionIndex:null},
      {text:'Relating task design to language skills development, with a rationale', sectionIndex:null},
      {text:'Finding, selecting and referencing information from one or more sources, using written language that is clear, accurate and appropriate to the task', sectionIndex:null},
    ], sections:[
    { type:'text', label:'The material', body:'The lesson or extract you are analysing \u2014 not the whole unit, just the skills-focused part.' },
    { type:'text', label:'Sub-skills and task types', body:'Name the specific sub-skills the material targets (e.g. skimming for gist, listening for specific information, turn-taking, planning before writing) and how each task exercises them.' },
    { type:'text', label:'How the lesson stages the skill', body:'Lead-in, pre-task (vocabulary/prediction), the task itself, and post-task \u2014 what each stage is for, and how it prepares learners for the next.' },
    { type:'text', label:'Anticipated problems and solutions', body:'Problems with the skill itself (not language) \u2014 task difficulty, background knowledge, text length, unfamiliar text types \u2014 and how you would address each.' },
    { type:'declaration', label:'Declaration', items:['This is my own work.', 'All sources are referenced, in the format (Author, Year, p. ##).'], aiToggle:true }
  ]},
  fol: { title:'Focus on the Learner', wordMin:750, wordMax:1000, format:'prose', criteria:[
      {text:'Showing awareness of how the learner’s background, previous learning experience and learning preferences affect learning', sectionIndex:null},
      {text:'Identifying the learner’s language and/or skills needs', sectionIndex:null},
      {text:'Correctly using terminology relating to the description of language systems and language skills', sectionIndex:null},
      {text:'Selecting appropriate material and/or resources (at least one of which must be from published materials) to aid the learner’s language development', sectionIndex:null},
      {text:'Providing a rationale for using specific activities with the learner in mind', sectionIndex:null},
      {text:'Finding, selecting and referencing information from one or more sources, using written language that is clear, accurate and appropriate to the task', sectionIndex:null},
    ], sections:[
    { type:'text', label:'Before you start', body:'You\u2019ll describe your current TP group, then identify one grammar and one pronunciation difficulty they\u2019ve shown \u2014 two examples of each \u2014 and present one activity for each problem. Word count: 750\u20131,000 words of continuous prose, not counting the bibliography or appendices.' },
    { type:'text', label:'A \u2014 Your TP group', body:'Describe your group of learners, covering group size, gender, age range and level.' },
    { type:'text', label:'B \u2014 The grammar problem', body:'Name the grammar area you\u2019ve chosen to focus on, using correct terminology, with two examples.' },
    { type:'text', label:'C \u2014 The pronunciation problem', body:'Name the pronunciation area you\u2019ve chosen to focus on, using correct terminology and IPA script, with two examples.' },
    { type:'text', label:'D \u2014 The grammar task', body:'Attach one task in Appendix 1 that addresses the grammar problem above \u2014 just one, not a choice of options.' },
    { type:'text', label:'E \u2014 The pronunciation task', body:'Attach one task in Appendix 2 that addresses the pronunciation problem above. Repeating after the teacher or drilling doesn\u2019t count as a task.' },
    { type:'declaration', label:'Declaration', items:['This is my own work.', 'All sources are referenced, in the format (Author, Year, p. ##).'], aiToggle:true }
  ]},
  // Its NAME only, like the other three. It carried its own code as well, so
  // every place that prints the code beside the title doubled it up -- the
  // assessor pack's briefs read "LFC \u2014 LFC \u2014 Lessons from the Classroom" and a
  // candidate's assignment row read "LFC LFC \u2014 Lessons from the Classroom"
  // (walk, 21 Sep 2026). A centre that has already saved its own wording keeps
  // whatever it saved.
  lfc: { title:'Lessons from the Classroom', wordMin:750, wordMax:1000, format:'prose', criteria:[
      {text:'Identifying their own teaching strengths and weaknesses in light of feedback from learners, teachers and tutors, and how these affect the learners', sectionIndex:null},
      {text:'Identifying which ELT areas of knowledge and skills they need further development in, with practical ways to improve', sectionIndex:null},
      {text:'Reflecting on their observation of other teachers in relation to their own development', sectionIndex:null},
      {text:'Describing in a specific way how to develop ELT knowledge and skills beyond the course', sectionIndex:null},
      {text:'Using written language that is clear, accurate and appropriate to the task', sectionIndex:null},
    ], sections:[
    { type:'text', label:'Before you start', body:'This assignment is a reflection on your progress during the course. You\u2019ll summarise your main teaching strengths and action points, insights from observing peers and experienced teachers, and how you\u2019ll continue developing after the CELTA. Word count: 750\u20131,000 words of continuous prose, not counting the bibliography or appendices.' },
    { type:'text', label:'A \u2014 Identifying strengths', body:'Browse your 3 most recent TPs\u2019 feedback and identify 3 teaching strengths you\u2019ve shown.' },
    { type:'text', label:'B \u2014 Identifying action points', body:'Browse your 3 most recent TPs\u2019 feedback and identify 3 action points you still have.' },
    { type:'text', label:'C \u2014 Reflecting on observation of others', body:'For each action point from Part B, give one example of how another teacher addressed it \u2014 through peer observation, a tutor\u2019s live observation, or a video observation.' },
    { type:'text', label:'D \u2014 Post-course development', body:'Choose 3 areas you want to focus on after the course.' },
    { type:'declaration', label:'Declaration', items:['This is my own work.', 'All sources are referenced, in the format (Author, Year, p. ##).'], aiToggle:true }
  ]},
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
