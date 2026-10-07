// The candidate agreement Connect Lite ships with.
// © 2026 Ramy Sakr. All rights reserved.
//
// The CELTA 5 booklet asks for "a candidate agreement detailing, for example:
// the attendance policy, plagiarism information, the complaints policy, any
// policies on resubmissions of written work", and Lite had those four boxes.
// Administration Handbook 6.3 is longer and says MUST: expectations of the
// candidate and the consequences (written warnings before sanctions),
// pre-course familiarisation, attendance/illness, refunds, deferrals and
// extensions, plagiarism and its penalties, facilities and resources, special
// consideration, the conduct and role of tutors, technological requirements,
// online-delivery issues, what to do with a concern, the course mode, and
// (same section, last paragraphs) the security of personal information, its
// sharing with Cambridge, and a signed Candidate Declaration on special
// consideration -- which 29_candidate_agreement takes at signing.
// Since the 7 Oct 2026 audit the agreement has a section for each, in the
// Handbook's order, so a centre that fills them all meets 6.3; the booklet's
// four are among them. Connect has had a full
// agreement since August; this is that wording, cut to the four sections
// (Ramy, 7 Oct 2026: "let's use Connect, and give an option so they can use
// their own or they can use Connect's. For all the policies").
//
// THE VOICE. The centre speaks ("we", "us") to the candidate ("you"); the
// centre's name, {centre}, appears only where a name reads naturally and is
// filled in by Course admin when the wording is dropped in. A blank the
// centre must fill reads "[{centre} to add: ...]" so it is unmistakable to
// the admin and, if ever left, unmistakably unfinished to a trainee; Course
// admin counts the blanks still open. Rewritten 8 Oct 2026 after Ramy read
// it with the name in ("did you actually read what's written there?").
//
// SPECIAL REQUIREMENTS ARE NOT SPECIAL CONSIDERATION. Handbook 7.4: special
// requirements (a disability, a specific learning difficulty, a condition)
// are declared at application and requests to Cambridge for arrangements
// such as additional time are made before the applicant is accepted;
// nothing is granted after the course starts. Special consideration (6.3's
// list) is for the serious and unforeseen DURING the course. Two sections,
// kept apart, and the signing declaration asks about the first.
//
// It is a STARTING POINT, not a policy. Where a rule is the centre's own --
// the attendance threshold, who hears a complaint last, the resubmission
// deadline -- it is left as a visible blank in square brackets rather than
// invented: a drafted placeholder that reads as settled policy is worse than
// an obvious gap, because nobody goes back and fills in prose that already
// sounds finished. Course admin drops the wording into the box, the centre
// edits what is theirs, and only what they save goes to the trainees.
//
// The resubmission rule is the Handbook's: one resubmission per assignment,
// recorded as Pass on resubmission; a single failed assignment may still
// pass the course on the evidence of the rest but not at Pass A; two cannot
// pass (Handbook 11.6; the 29 Sep 2026 audit).
window.CONNECT_HUB_AGREEMENT_DEFAULTS = {
  agrExpectations:
    'This is the agreement between you and {centre} for your CELTA course. Cambridge requires every centre to give it to candidates before the course begins, and your signature at the foot records that you have read and accept it.\n\n' +
    'We expect you to attend every timetabled session, on time, and to stay for the whole of it; to submit written assignments by the deadlines you are given; to take part in teaching practice and feedback as scheduled, including observing your peers; and to treat learners, tutors and other candidates with respect at all times.\n\n' +
    'Tell us as early as you can if something is going to stop you meeting any of this. Almost everything can be worked around if we know in time, and very little can be once a deadline has passed.\n\n' +
    'If these expectations are not met, we will raise it with you directly first. If it continues, you will receive a written warning setting out what needs to change and by when, before any sanction is applied. You will never face a sanction on this course without first having been told in writing what the problem is and given a chance to put it right.',
  agrSpecialRequirements:
    'Special requirements are arranged before the course, not during it. If you have a disability, a specific learning difficulty, a medical condition or anything else that affects how you learn, teach or are assessed, you told us at application, before your place was confirmed; any arrangement that needs Cambridge’s agreement, such as additional time, has to be requested by us before the course starts, and Cambridge does not grant one once it has begun.\n\n' +
    'If something has changed since you applied, tell us now, before day one, and we will see what can still be arranged. If a report exists that describes the requirement, sharing it with us helps. When you sign this agreement you will be asked to confirm whether you have a special requirement; that confirmation is how we make sure any adjustment is in place before you start.',
  agrPreCourse:
    'You have had the Cambridge pre-course task from us, as a document, and you work through it on paper. It is not graded and is not handed in; your tutor reads it on day one. From two days before the course, the answer key is on your Connect Lite home, so you can check your own work, and on the same screen you pick a short getting-to-know-you activity to run with your students on day one. Those two things are all there is to do before the course.\n\n' +
    '[{centre} to add: anything else the candidate has had or will have from you before day one \u2014 the group, the level, what happens on the first morning.]',
  agrAttendance:
    'CELTA is assessed continuously, and attendance is a condition of it. Cambridge expects you to attend the whole course: missed teaching practice and missed feedback cannot simply be made up later, because both are assessed.\n\n' +
    'If you are ill, tell us the same morning, not afterwards. We record every absence and whether the work was made up, and your tutor will tell you honestly if your attendance is putting your place at risk. [{centre} to add: the point at which absence means a candidate cannot complete the course, and how illness with a doctor’s note is treated differently from unexplained absence.]',
  agrPlagiarism:
    'Written assignments must be your own work. Quoting or drawing on a source is fine and expected; passing it off as yours is not. That covers work copied from the internet, from a previous candidate, from another centre, or generated for you by AI. The source does not change how it is treated. AI may support your thinking, but the work you submit must be yours, and undeclared AI-written coursework is treated as plagiarism.\n\n' +
    'You confirm on every submission that the assignment is your own work. If we suspect plagiarism we open a malpractice case: you are told exactly what has been found, shown the evidence, and given the chance to respond in writing before any decision is taken. Where Cambridge’s rules require it, we notify Cambridge; that is not a discretion we have. [{centre} to add: the penalty where a case is upheld — for example, the assignment is failed and may not be resubmitted.]',
  agrResubmissions:
    'Each of the four written assignments is marked Pass or Fail against Cambridge’s criteria. If an assignment does not meet the criteria at first submission, you may resubmit it once, by a date your tutor sets, and a resubmission that meets the criteria is recorded as Pass on resubmission. A pass on resubmission is a pass. There is no second resubmission.\n\n' +
    'A candidate who fails one assignment after resubmission may still pass the course on the evidence of the rest, but cannot be awarded a Pass A; a candidate who fails two cannot pass. [{centre} to add: how long a candidate has to resubmit — for example, one week from the day the assignment comes back.]',
  agrDeferrals:
    'If you cannot complete within the course dates, talk to us early. A deferral to a later course is possible in some circumstances but is not automatic, and an extension beyond the end of the course can only be granted by Cambridge, in advance, in exceptional circumstances and for at most one month.\n\n' +
    'You can ask to withdraw at any point. We will talk to you before it is actioned; a lot of people who are ready to withdraw in week two do not want to by week three.\n\n' +
    '[{centre} to add: your deferral policy — whether a place on a later course is offered, by when it must be asked for, and any fee consequence.]',
  agrFees:
    '[{centre} to add: the course fee, the deposit, when the balance is due, and what is refunded at each stage — before the course, after it starts, and on withdrawal. Cambridge requires this to be stated here.]',
  agrSpecialConsideration:
    'Special consideration is different from a special requirement: it is for something serious and unforeseen that happens during the course — a serious illness, a bereavement, or a technical failure outside your control — and affects your work or your assessment. Tell us at the time, not afterwards. There is a process for taking it into account, and it works far better while the course is running.',
  agrFromUs:
    'From us you can expect tutors qualified and approved by Cambridge; written feedback on every assessed lesson; at least one tutorial on your progress and at least two progress reports, so you will never reach the final week and be surprised; clear deadlines set at the start; and an end-of-course report, which Cambridge requires us to give every candidate.\n\n' +
    'Your tutors are there to teach and assess you. They are not there to decide complaints about themselves; see the section on concerns and complaints.\n\n' +
    '[{centre} to add: the facilities and resources — classrooms, a room to work in, copying and printing, wi-fi, the coursebooks and reference library — and anything you must provide yourself, such as a laptop; for online teaching, a quiet space to teach from and a reliable connection.]',
  agrComplaints:
    'If you have a concern, raise it with your tutor first if you can. If that is not appropriate, or they do not resolve it, take it to the Main Course Tutor. If you are still not satisfied, your complaint goes to someone who is not a tutor on your course; Cambridge requires that the final step of our complaints procedure is outside the teaching team. [{centre} to add: who that is — the Director of Studies or the school’s director — and how to reach them.]\n\n' +
    'Separately from all of the above, you have a right of appeal to Cambridge about an assessment decision. Your tutor will point you to the Appeals Procedure.',
  agrMode:
    'A CELTA course is delivered face to face, online, or as a mix of the two, and the mode you are on affects your contact hours, where your teaching practice happens and what you need to provide yourself. [{centre} to add: the mode of this course, its contact hours and daily times, whether input is live or through a platform, and for online delivery what you must have — a quiet space to teach from and confidence with the technology.]',
  agrData:
    'Your course record is kept on Connect Lite: your lesson plans, self-evaluations, feedback, assignments and CELTA 5, under a private link that is yours alone. Your tutors and, during the visit, the Cambridge assessor read it; nobody else can, and the link stays open for the whole course. We keep the record for six months after the course ends, as Cambridge requires, and then it is deleted, unless you ask us for a copy first.\n\n' +
    'Cambridge English receives your name, your grades and your end-of-course report; that is how your certificate is issued, and by signing this agreement you agree to it. [{centre} to add: anything else you hold about a candidate — the application, payment records — where it is kept, and who can see it.]'
};
