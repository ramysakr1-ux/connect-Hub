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
// online-delivery issues, what to do with a concern, and the course mode.
// Since the 7 Oct 2026 audit the agreement has a section for each, in the
// Handbook's order, so a centre that fills them all meets 6.3; the booklet's
// four are among them. Connect has had a full
// agreement since August; this is that wording, cut to the four sections
// (Ramy, 7 Oct 2026: "let's use Connect, and give an option so they can use
// their own or they can use Connect's. For all the policies").
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
    'Attend every timetabled session, on time, and stay for the whole session. Submit written assignments by the deadlines you are given. Take part in teaching practice and feedback as scheduled, including observing your peers. Treat learners, tutors and other candidates with respect at all times.\n\n' +
    'Tell us as early as you can if something is going to stop you meeting any of this. Almost everything can be worked around if we know in time, and very little can be once a deadline has passed.\n\n' +
    'If expectations are not met, we will raise it with you directly first. If it continues, you will receive a written warning setting out what needs to change and by when, before any sanction is applied. You will never face a sanction on this course without having first been told in writing what the problem is and given a chance to put it right.',
  agrSpecialRequirements:
    'Tell us at application, or as soon as it arises, about anything affecting how you learn, teach or are assessed: a disability, a specific learning difficulty, a health condition, or anything else you want us to take into account. Cambridge has a formal Special Requirements process, and we can only apply it if we know in advance.',
  agrPreCourse:
    'You will receive the Cambridge pre-course task. It is not graded and is not counted as coursework, but your tutor reads it before day one. Your personal link opens a short tour of where everything is, so you can find your way around before the course starts.\n\n' +
    '[Your centre: what else you send before day one, and when — for example the group, the level and what happens on the first morning, two days before.]',
  agrAttendance:
    'CELTA is assessed continuously, and attendance is a condition of it. Cambridge expects you to attend the whole course: missed teaching practice and missed feedback cannot simply be made up later, because both are assessed. Attend every timetabled session, on time, and stay for the whole of it.\n\n' +
    'If you are ill, tell us the same morning, not afterwards. We record every absence and whether the work was made up, and your tutor will tell you honestly if your attendance is putting your place at risk. [Your centre: the point at which absence means a candidate cannot complete, and how illness is treated differently from unexplained absence.]',
  agrPlagiarism:
    'Written assignments must be your own work. Quoting or drawing on a source is fine and expected; passing it off as yours is not. That covers work copied from the internet, from a previous candidate, from another centre, or generated for you by AI. The source does not change how it is treated. AI may support your thinking, but the work you submit must be yours, and undeclared AI-written coursework is treated as plagiarism.\n\n' +
    'You confirm on every submission that the assignment is your own work. Suspected plagiarism is opened as a malpractice case: you will be told exactly what has been found, shown the evidence, and given the chance to respond in writing before any decision is taken. Where Cambridge’s rules require it, Cambridge is notified; that is not a discretion the centre has. [Your centre: the penalties where a case is upheld.]',
  agrResubmissions:
    'Each of the four written assignments is marked Pass or Fail against Cambridge’s criteria. If an assignment does not meet the criteria at first submission, you may resubmit it once, by a date your tutor sets, and a resubmission that meets the criteria is recorded as Pass on resubmission. A pass on resubmission is a pass. There is no second resubmission.\n\n' +
    'A candidate who fails one assignment after resubmission may still pass the course on the evidence of the rest, but cannot be awarded a Pass A; a candidate who fails two cannot pass. [Your centre: how long a candidate has to resubmit — for example, one week from the returned mark.]',
  agrDeferrals:
    'If you cannot complete within the course dates, talk to us early. Deferral is possible in some circumstances but is not automatic, and where Cambridge’s rules require it we must consult Cambridge before agreeing one.\n\n' +
    'You can ask to withdraw at any point. We will talk to you before it is actioned; a lot of people who are ready to withdraw in week two do not want to by week three.\n\n' +
    '[Your centre: the deferral and extension policy, any deadline, and any fee consequence.]',
  agrFees:
    '[Your centre: the fee, the deposit, when the balance is due, and the refund position at each stage — before the course, after it starts, and on withdrawal. Cambridge requires this to be stated and nothing in Lite can supply it.]',
  agrSpecialConsideration:
    'If something serious and unforeseen affects you during the course — serious illness, bereavement, or a technical failure outside your control — tell us at the time rather than afterwards. There is a process for taking it into account, and it works far better while the course is running.',
  agrFromUs:
    'Tutors qualified and approved by Cambridge. Written feedback on every assessed lesson. At least one tutorial advising you on your progress, and a minimum of two progress reports, so you will never reach the final week and be surprised. Clear deadlines set at the start. An end-of-course report, which Cambridge requires us to give every candidate.\n\n' +
    'Your tutors are there to teach and assess you. They are not there to decide complaints about themselves; see the complaints section.\n\n' +
    '[Your centre: the facilities and resources available, on site and online, and any technological requirements candidates must meet themselves — hardware, software, connection, and for online teaching a quiet space to teach from.]',
  agrComplaints:
    'Raise it with your tutor first if you can. If that is not appropriate, or they do not resolve it, take it to the Main Course Tutor. If you are still not satisfied, the complaint goes to someone who is not a tutor on your course: Cambridge requires that the final step of a centre’s complaints procedure is outside the teaching team. [Your centre: who that is — the Director of Studies, the principal — and how to reach them.]\n\n' +
    'Separately from all of the above, you have a right of appeal to Cambridge about an assessment decision. Your tutor will point you to the Appeals Procedure.',
  agrMode:
    'Your course is delivered face to face, online, or as a mix of the two. Which one you are on affects your contact hours, where your teaching practice happens, and what you need to provide yourself.\n\n' +
    '[Your centre: the mode this course is on, what it means in contact hours, whether input is live or through a platform, and for online delivery what the candidate must have — a quiet space to teach from and confidence with the technology.]'
};
