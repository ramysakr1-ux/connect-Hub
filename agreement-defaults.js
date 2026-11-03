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
// Since 1 Nov 2026 (checked against 6.3 line by line: refunds, deferrals,
// facilities, technology, online delivery and the course mode had no section)
// the agreement has a section for every name on 6.3's list, in its order, so a
// center that fills them all meets 6.3; the booklet's four are among them.
// Refunds and facilities are the center's own policies and have no wording here. Connect has had a full
// agreement since August; this is that wording, cut to the four sections
// (Ramy, 7 Oct 2026: "let's use Connect, and give an option so they can use
// their own or they can use Connect's. For all the policies").
//
// THE VOICE. The center speaks ("we", "us") to the candidate ("you"); the
// center's name, {center}, appears once, in the opening line, and is filled
// in by Course admin when the wording is dropped in. No notes to the admin
// inside the text: a trainee reads and signs it as it stands.
//
// SPECIAL REQUIREMENTS ARE NOT SPECIAL CONSIDERATION. Handbook 7.4: special
// requirements (a disability, a specific learning difficulty, a condition)
// are declared at application and requests to Cambridge for arrangements
// such as additional time are made before the applicant is accepted;
// nothing is granted after the course starts. Special consideration is for
// the serious and unforeseen DURING the course. Two sections, kept apart,
// and the signing declaration asks about the first.
//
// It is a STARTING POINT, not a policy. Where a rule is the center's own --
// the attendance threshold, who hears a complaint last, the resubmission
// deadline -- it is left as a visible blank in square brackets rather than
// invented: a drafted placeholder that reads as settled policy is worse than
// an obvious gap, because nobody goes back and fills in prose that already
// sounds finished. Course admin drops the wording into the box, the center
// edits what is theirs, and only what they save goes to the trainees.
//
// The resubmission rule is the Handbook's: one resubmission per assignment,
// recorded as Pass on resubmission; a single failed assignment may still
// pass the course on the evidence of the rest but not at Pass A; two cannot
// pass (Handbook 11.6; the 29 Sep 2026 audit).
window.CONNECT_HUB_AGREEMENT_DEFAULTS = {
  agrExpectations:
    'This agreement explains how your CELTA course at {center} will run, what we ask of you, and what you can expect from us. Cambridge requires every center to give it to candidates before the course begins. By signing at the end, you confirm that you have read and accepted it.\n\n' +
    'CELTA is demanding, collaborative, and assessed throughout. To give yourself and the group the best chance of succeeding, you agree to attend every timetabled session, arrive on time, and stay until the end; meet the deadlines for written assignments; take part fully in teaching practice, feedback, and peer observation; and treat learners, tutors, and fellow candidates with courtesy and respect at all times, both in person and online.\n\n' +
    'Everyone on the course is entitled to a professional and inclusive learning environment. Discrimination, harassment, or bullying is not acceptable.\n\n' +
    'If anything is likely to prevent you from meeting these expectations, tell us as soon as you can. Early conversations give us the best chance of finding a solution; once a deadline has passed, our options are much more limited.\n\n' +
    'If there is a problem, we will raise it with you directly in the first instance. If it continues, you will receive a written warning explaining what needs to change and by when before any sanction is applied. We will not impose a sanction without telling you clearly, in writing, what the concern is and giving you a fair opportunity to address it.',
  agrSpecialRequirements:
    'The best time to arrange support is before the course begins. If you have a disability, specific learning difficulty, medical condition, or other circumstance that affects how you learn, teach, or are assessed, please tell us as early as possible, ideally when you apply and before your place is confirmed.\n\n' +
    'Some arrangements, such as additional time, need Cambridge’s approval. Cambridge asks centers to make those requests before a candidate is accepted onto the course, so early disclosure matters.\n\n' +
    'If your circumstances have changed since you applied, tell us before day one. We will look at what can still be put in place. If you have a report that explains the requirement, it can help us make the right arrangements. When you sign this agreement, you confirm whether you have a special requirement so that we can make sure any agreed adjustment is in place before you start.',
  agrPreCourse:
    'You will receive the Cambridge pre-course task to complete before the course begins. It is not assessed and does not need to be submitted. It is for you to check yourself.\n\n' +
    'From the last working day before the course, the answer key will be available on your Connect Lite home page. You can use it to check your work. On the same page, you will choose a short getting-to-know-you activity to use with your students on day one. Those are the only tasks you need to complete before the course begins.',
  agrAttendance:
    'CELTA is assessed continuously, and Cambridge expects 100% attendance. If you have an unavoidable absence — for example, because of illness, bereavement, or an unexpected family commitment — it will be recorded in your CELTA 5, and the missed work will need to be made up.\n\n' +
    'Your course tutor records unexplained or inappropriate absences and late arrivals. Unexplained absence may put your place on the course at risk.\n\n' +
    'If you cannot attend, let us know that morning, rather than afterwards. We will record the absence and the work completed in its place, and your tutor will be clear with you about where you stand.',
  agrPlagiarism:
    'Your written assignments must be your own work. Using and acknowledging sources is expected; presenting someone else’s work as your own is not. This includes work copied from the internet, from another candidate or center, or generated by AI.\n\n' +
    'AI may help you think, plan, or explore ideas, but it cannot do the assessed work for you. What you submit must represent your own understanding and writing. Undeclared AI-written coursework is treated as plagiarism.\n\n' +
    'With every submission, you confirm that the work is your own. If we suspect plagiarism, we will open a malpractice case. We will tell you exactly what we have found, show you the evidence, and give you the opportunity to respond in writing before we make a decision.\n\n' +
    'Any penalty for an upheld case is at the center’s discretion. Where Cambridge’s rules require it, we will tell Cambridge.',
  agrResubmissions:
    'Each of the four written assignments is assessed against Cambridge’s criteria and marked Pass or Fail. If an assignment does not meet the criteria on first submission, you may resubmit it once, by the deadline your tutor gives you when the work is returned.\n\n' +
    'If the resubmission meets the criteria, it is recorded as a Pass on resubmission. A pass on resubmission is a pass. There is no second resubmission.\n\n' +
    'A candidate who fails one assignment after resubmission may still pass the course on the strength of the remaining evidence, but cannot be awarded a Pass A. A candidate who fails two assignments cannot pass the course.',
  agrSpecialConsideration:
    'Special consideration is not the same as a special requirement. It applies when something serious and unforeseen happens during the course — such as a serious illness, bereavement, or a technical failure outside your control — and affects your work or assessment.\n\n' +
    'Tell us at the time, not after the course has finished. There is a process for taking serious circumstances into account, and it works best while the course is still running.\n\n' +
    'If you cannot complete the course within its dates, see Extensions and deferrals above and speak to us early.',
  agrFromUs:
    'You can expect tutors who are qualified and approved by Cambridge; written feedback on every assessed lesson; at least one tutorial about your progress; and at least two progress reports. You should not reach the final week without a clear picture of how you are doing.\n\n' +
    'You can also expect clear deadlines from the start of the course and an end-of-course report, which Cambridge requires us to give every candidate.\n\n' +
    'Your tutors are there to teach and assess you. They are not the people who decide complaints about themselves; see the next section.',
  agrComplaints:
    'If you have a concern, speak to your tutor first if that feels appropriate. If it does not, or if the matter is not resolved, take it to the Main Course Tutor. If you remain dissatisfied, your complaint goes to the head of the center, who is not a tutor on your course. Cambridge requires the final stage of our complaints procedure to sit outside the teaching team.\n\n' +
    'If you have completed every stage of our complaints procedure and are still dissatisfied with how the course was run, or with your final result after Cambridge has confirmed it, you may appeal to Cambridge. Appeals are made through the center within two weeks of your result. Your tutor will give you the Appeals Procedure and the form.',
  agrData:
    'Your course record is kept on Connect Lite. This includes your lesson plans, self-evaluations, feedback, assignments, and CELTA 5. It is held under a private link that belongs to you. Your tutors can access it.\n\n' +
    'Your portfolio is shared with Cambridge English for assessment and moderation. The Cambridge assessor reads it during the visit, and Cambridge’s moderators may read it during Grade Review. Nobody else can access it. The link remains open for the duration of the course.\n\n' +
    'We keep your course record for six months after the course ends, as Cambridge requires, and then delete it unless you ask us for a copy first.\n\n' +
    'Cambridge English receives your name and grades so that your certificate can be issued. The center issues your end-of-course report to you. By signing this agreement, you agree to this.',
  agrMode_f2f:
    'Your course is face-to-face. Input sessions, teaching practice, and feedback take place in person at {center}, at the times shown on your timetable. All {hours} hours are live contact hours with your tutors. You selected this mode when you applied.\n\n' +
    'The course mode does not appear on your certificate. Cambridge does, however, require it to be recorded in your end-of-course report, so that employers can see which course type you completed.',
  agrMode_online:
    'Your course is online. Input sessions, teaching practice, and feedback take place live in the course’s online rooms, at the times shown on your timetable. Input is delivered live by your tutors, not as recorded content, so all {hours} hours are contact hours. You teach your teaching practice lessons online to real learners. You selected this mode when you applied.\n\n' +
    'The course mode does not appear on your certificate. Cambridge does, however, require it to be recorded in your end-of-course report, so that employers can see which course type you completed.',
  agrMode_mixed:
    'Your course is mixed mode. Some sessions take place in person at {center}, and others take place live in the course’s online rooms. Your timetable shows where each session will be held. Input is delivered live by your tutors, whether in the room or online, so all {hours} hours are contact hours. You selected this mode when you applied.\n\n' +
    'The course mode does not appear on your certificate. Cambridge does, however, require it to be recorded in your end-of-course report, so that employers can see which course type you completed.',
  agrDeferrals:
    'If you think you may not be able to finish the course within its scheduled dates, speak to us as early as possible.\n\n' +
    'An extension allows you to complete assessment after the course ends. It is available only in exceptional circumstances, where you have completed a substantial part of the course or have been granted additional time for a special requirement. An extension can be for no more than one month after the course ends. We must register it with Cambridge in advance, and Cambridge must confirm it.\n\n' +
    'A deferral is for a candidate who has completed part of the course but cannot continue because of exceptional circumstances. You move to a later course, normally beginning no later than six months after this course ends, or 12 months after a part-time course ends. You normally continue in the same mode unless we agree otherwise with you in writing. We consult Cambridge before agreeing a deferral.\n\n' +
    'If you need to leave during the first half of the course, we may allow you to start a new course from the beginning and carry forward any assessment you have already passed.\n\n' +
    'You may ask to withdraw at any time. We will speak with you before this is finalized.',
  agrTechnology:
    'Your course record, lesson plans, and written assignments are held on Connect Lite, which runs in a web browser. You need a laptop or computer with a current browser — Chrome, Safari, Edge, or Firefox — and a reliable internet connection. A phone is useful for checking information, but lesson plans and written assignments are best done on a laptop or computer. You also need a word processor or Google Docs for your written work.',
  agrTechnologyOnline:
    'For the online parts of the course, you also need a camera, a microphone or headset, and a quiet place to teach where you will not be interrupted. You need to be comfortable enough with video calls to run a class. If you are unsure about any of this, tell us before the course begins and we will help you get ready.',
  agrRefunds: '',
  agrFacilities: '',
  agrCentre: ''
};
