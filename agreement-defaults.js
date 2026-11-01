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
    'This is the course agreement between you and {center} for your CELTA course: how the course is run, what we ask of you, and what you can ask of us. Cambridge requires every center to give it to candidates before the course begins, and your signature at the foot records that you have read and accept it.\n\n' +
    'We ask you to attend every timetabled session, on time, and to stay for the whole of it; to submit written assignments by the deadlines you are given; to take part in teaching practice and feedback as scheduled, including observing your peers; and to treat learners, tutors and other candidates with courtesy and respect at all times, in the room and online, whatever their background, nationality, gender, beliefs or ability. Discrimination, harassment or bullying of anyone on the course is not tolerated.\n\n' +
    'Tell us as early as you can if something is going to stop you meeting any of this. Almost everything can be worked around if we know in time, and very little can be once a deadline has passed.\n\n' +
    'If these expectations are not met, we will raise it with you directly first. If it continues, you will receive a written warning setting out what needs to change and by when, before any sanction is applied. You will never face a sanction on this course without first having been told in writing what the problem is and given a chance to put it right.',
  agrSpecialRequirements:
    'Special requirements are best arranged before the course. If you have a disability, a specific learning difficulty, a medical condition or anything else that affects how you learn, teach or are assessed, you told us at application, before your place was confirmed. Cambridge asks centers to request any arrangement that needs its agreement, such as additional time, before applicants are accepted onto the course, so the earlier you tell us, the better.\n\n' +
    'If something has changed since you applied, tell us now, before day one, and we will see what can still be arranged. If a report exists that describes the requirement, sharing it with us helps. When you sign this agreement you confirm whether you have a special requirement; that confirmation is how we make sure any adjustment is in place before you start.',
  agrPreCourse:
    'You have had the Cambridge pre-course task from us, as a document, and you work through it on paper. It is not assessed and is not handed in: you check it yourself. From the last working day before the course, the answer key is on your Connect Lite home, so you can check your own work, and on the same screen you pick a short getting-to-know-you activity to run with your students on day one. Those two things are all there is to do before the course.',
  agrAttendance:
    'CELTA is assessed continuously, and Cambridge expects 100% attendance. In the event of unavoidable absence, such as illness, family bereavement or unexpected family commitment, it is recorded in your CELTA 5 and the work from the session missed must be made up. Unexplained or inappropriate absences and late arrivals are recorded by the course tutor, and unexplained absence puts your place at risk.\n\n' +
    'If you cannot come, tell us the same morning, not afterwards. We record every absence and how the work was made up, and your tutor will tell you honestly where you stand.',
  agrPlagiarism:
    'Written assignments must be your own work. Quoting or drawing on a source is fine and expected; passing it off as yours is not. That covers work copied from the internet, from a previous candidate, from another center, or generated for you by AI. The source does not change how it is treated. AI may support your thinking, but the work you submit must be yours, and undeclared AI-written coursework is treated as plagiarism.\n\n' +
    'You confirm on every submission that the assignment is your own work. If we suspect plagiarism we open a malpractice case: you are told exactly what has been found, shown the evidence, and given the chance to respond in writing before any decision is taken. An upheld case fails the assignment, and where Cambridge’s rules require it we notify Cambridge; that is not a discretion we have.',
  agrResubmissions:
    'Each of the four written assignments is marked Pass or Fail against Cambridge’s criteria. If an assignment does not meet the criteria at first submission, you may resubmit it once, by the date your tutor sets when it comes back to you, and a resubmission that meets the criteria is recorded as Pass on resubmission. A pass on resubmission is a pass. There is no second resubmission.\n\n' +
    'A candidate who fails one assignment after resubmission may still pass the course on the evidence of the rest, but cannot be awarded a Pass A; a candidate who fails two cannot pass.',
  agrSpecialConsideration:
    'Special consideration is different from a special requirement: it is for something serious and unforeseen that happens during the course — a serious illness, a bereavement, or a technical failure outside your control — and affects your work or your assessment. Tell us at the time, not afterwards. There is a process for taking it into account, and it works far better while the course is running.\n\n' +
    'If you cannot complete within the course dates, see Extensions and deferrals below, and talk to us early.',
  agrFromUs:
    'From us you can expect tutors qualified and approved by Cambridge; written feedback on every assessed lesson; at least one tutorial on your progress and at least two progress reports, so you will never reach the final week and be surprised; clear deadlines set at the start; and an end-of-course report, which Cambridge requires us to give every candidate.\n\n' +
    'Your tutors are there to teach and assess you. They are not there to decide complaints about themselves; see the next section.',
  agrComplaints:
    'If you have a concern, raise it with your tutor first if you can. If that is not appropriate, or they do not resolve it, take it to the Main Course Tutor. If you are still not satisfied, your complaint goes to the head of the center, who is not a tutor on your course; Cambridge requires that the final step of our complaints procedure is outside the teaching team.\n\n' +
    'If you have been through every stage of our complaints procedure and are still dissatisfied with how the course was run, or with your final result once Cambridge has confirmed it, you may appeal to Cambridge. The appeal goes through the center, within two weeks of your result, and your tutor will give you the Appeals Procedure and the form.',
  agrData:
    'Your course record is kept on Connect Lite: your lesson plans, self-evaluations, feedback, assignments and CELTA 5, under a private link that is yours alone. Your tutors read it. Your portfolio is shared with Cambridge English for assessment and moderation: the Cambridge assessor reads it during the visit, and Cambridge’s moderators may read it at Grade Review. Nobody else can, and the link stays open for the whole course. We keep the record for six months after the course ends, as Cambridge requires, and then it is deleted, unless you ask us for a copy first.\n\n' +
    'Cambridge English receives your name and your grades, which is how your certificate is issued. Your end-of-course report is issued to you by the center. By signing this agreement you agree to this.',
  /* THE SIX 6.3 NAMES THAT HAD NO SECTION (1 Nov 2026, the agreement checked against Cambridge). The course mode and
     contact hours (6.3: centers "are required to include a section"), extensions and deferrals (7.8, 7.9) and the
     technology are Lite's to write, and Course admin fills the mode and the hours from the course as it drops them in
     (connectWording). Refunds and facilities are the center's own policies, so they have no wording here: Course admin
     shows them as still to write until the center has. */
  agrMode_f2f:
    'Your course is face-to-face. The input sessions, teaching practice and feedback take place in person at {center}, at the times on the timetable, and all {hours} hours of the course are contact hours with your tutors. You chose this mode when you applied. It does not appear on your certificate, but Cambridge requires your end-of-course report to state it, so that employers can see which course type you took.',
  agrMode_online:
    'Your course is online. The input sessions, teaching practice and feedback take place live, in the course’s online rooms, at the times on the timetable. Input is live with your tutors, not recorded, so all {hours} hours of the course are contact hours. You teach your teaching practice lessons online, to real learners. You chose this mode when you applied. It does not appear on your certificate, but Cambridge requires your end-of-course report to state it, so that employers can see which course type you took.',
  agrMode_mixed:
    'Your course is mixed mode: some of it takes place in person at {center} and some live in the course’s online rooms, and the timetable shows where each session is. Input is live with your tutors, in the room or online, so all {hours} hours of the course are contact hours. You chose this mode when you applied. It does not appear on your certificate, but Cambridge requires your end-of-course report to state it, so that employers can see which course type you took.',
  agrDeferrals:
    'If you cannot finish the course within its dates, talk to us as early as you can.\n\n' +
    'An extension lets you finish the assessment after the course ends, in exceptional circumstances, if you have completed a substantial part of the course or were granted additional time for a special requirement. The most it allows is one month after the end of the course. We register it with Cambridge in advance, and Cambridge confirms it.\n\n' +
    'A deferral is for a candidate who has completed part of the course but cannot finish it because of exceptional circumstances. You join a later course, normally starting no later than six months after this one ends (12 months for a part-time course), in the same mode unless you agree otherwise in writing. We consult Cambridge before we agree a deferral. If you have to leave in the first half of the course, we may let you start a new course from the beginning and carry over any assessment you have already passed.\n\n' +
    'You can ask to withdraw at any point; we will talk to you before it is actioned.',
  agrTechnology:
    'Your course record, lesson plans and written assignments are on Connect Lite, which runs in a web browser. You need a laptop or computer with a current browser (Chrome, Safari, Edge or Firefox) and a reliable internet connection. A phone is fine for checking, but plans and assignments are written on a laptop. You also need a word processor or Google Docs for your written work.',
  agrTechnologyOnline:
    'For the parts of the course that are online you also need a camera, a microphone or headset, and a quiet space to teach from where you will not be interrupted, and enough confidence with video calls to run a class. If you are unsure about any of this, tell us before the course starts and we will help you practise.',
  agrRefunds: '',
  agrFacilities: '',
  agrCentre: ''
};
