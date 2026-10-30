# Connect Lite Complete Product Specification

Product architecture, complete requirements, design system and HTML mockup guide

## Purpose

This copyable specification defines the Connect Lite product model, areas, connections, implementation requirements and HTML mockup pack. It is report-only and does not change the existing product source.

## Product model

Connect Lite is a CELTA course operating system. It connects the timetable, teaching practice, reflection, feedback, assessment and formal record while leaving consequential decisions with people.

## Design rules

- **One real next move.** Show the next meaningful piece of work. Do not turn the home page into another source of pressure.
- **Hard gates only for sequence.** Use a gate when the learning or formal order matters, such as reflection before feedback or deliberate issue of a formal letter.
- **Explain rather than score.** Every attention or risk label must reveal its factual reason and the next human action. Never create an opaque learner score.
- **Show ownership and source.** An action, set, record and change should say who created it, what it is based on, and when it changed.
- **Keep public access honest.** The Pool is open for browsing and taking. Editorial review is the only gate, and it is on contribution, not consumption.
- **Make privacy visible.** Audience and record status belong beside the action. A person should not have to infer where a note or recording goes.
- **Preserve high stakes history.** Corrections are allowed, but an issued letter, grade decision or formal acknowledgement must leave an intelligible dated trail.

## Roles and boundaries

| Role | Responsibility | Main surfaces |
|---|---|---|
| Centre administrator | Course identity, dates, agreement version, roster, timetable publication and centre settings. | Course settings, timetable context, roster and readiness list. |
| Tutor | Planning, feedback, rotations, marking, records, daily course operation and human decisions. | Tutor dashboard, plans, feedback, assignments, tracker, grades, official record. |
| Trainee | Planning, teaching, self-evaluation, assignments, observations and personal course keeps. | Home, TP point, plan, self-evaluation, feedback, notebook, assignments and last page. |
| Assessor | Read-only review of the course, selected candidates and evidence during the visit. | Assessor pack, grades report and candidate documents. |
| Volunteer student | Attendance intention, class materials, consent and certificate progress. | Volunteer page, class materials, attendance and certificate. |
| Connect editor | Reviews incoming Pool submissions and publishes an approved version with centre credit. | Pool contribution queue and editorial publication view. |

## Areas and connections

| Area | Supplies | Feeds |
|---|---|---|
| Course setup | Centre details, agreement version, roster, dates and timezone | Course readiness, timetable and all course links |
| Timetable | Course dates, day shape, rooms and events | TP event duration, deadlines, room links, volunteer sessions and assessor visit |
| TP point set | Book, edition, lesson procedures, level, sources and set version | Rotation, trainee TP brief, plan scaffold and materials |
| TP rotation | Timetable sessions, group, set lessons and tutor edits | One released next TP for each trainee, tutor map and clash checks |
| Plan | TP brief, duration, prior action point and material links | Teaching record and self-evaluation context |
| Self-evaluation | Trainee reflection and plan context | Tutor feedback opening, carried action and learner record |
| Tutor feedback | Plan, teaching observation, trainee reflection and tutor judgment | Returned TP record, sourced action point, tracker evidence and future plan |
| Assignment | Versioned brief, criteria and trainee attempt | Tutor marking, resubmission rules, tracker and grades evidence |
| Official record | CELTA 5 stages, letters, acknowledgements, grade decision and handover | Portfolio timeline, assessor evidence and safe tutor handover |
| Pool | Connect sets and optional centre contributions | Course TP point set choice with source, credit and fixed version |
| Volunteer programme | Timetable classes, consent, attendance and carried hours | Volunteer page, class materials, certificate and assessor register |
| Close of course | Final course records, selected warm comments and anonymised feedback | Trainee last page, centre learning and retained course artefacts |

## Primary journey map

```text
Centre setup -> course readiness -> published timetable
TP point set -> rotation -> released TP -> plan -> teach -> self-evaluation -> tutor feedback -> carried action
Assignment brief version -> attempt -> marking -> tracker -> grade meeting -> final report
CELTA 5 or formal case -> issue decision -> acknowledgement -> official timeline -> handover
Timetable -> volunteer class -> attendance -> certificate and assessor register
Course completion -> trainee last page; protected course feedback -> centre learning
```

## Source of truth

| Entity | Essential content | Rule |
|---|---|---|
| Course | Centre identity, course dates, timezone, agreement version, settings. | Course Admin is authoritative. |
| Course readiness item | Named setup check, state, optional link to source. | Advisory only. It never blocks drafting. |
| Timetable event | Type, start, end, room, countsTowardContactHours, source links. | The event supplies duration and scheduling context. |
| TP point set | Book metadata, edition identity, contributor, version, lesson procedures, source rules. | A course takes a fixed version. |
| Pool contribution | Submitting centre, attestation, review state, editor note, published set reference. | Editorial queue. No membership state. |
| TP assignment | Trainee, event, set lesson, teaching group, release state, tutor edits. | Feeds plan and next TP brief. |
| Lesson plan | Aim, stages, material references, language analysis, readiness cues. | References TP assignment and duration. |
| Self evaluation | Reflection, selected plan reference, action import references. | Must precede opening current tutor feedback where configured. |
| Tutor feedback | Tutor notes, criteria, action points, source TP, returned time. | Action points have stable IDs for carry-forward. |
| Assignment attempt | Brief version, declaration, AI-use record, submitted content, marking result. | Earlier met sections can remain locked on resubmission. |
| Candidate record | Derived activity, TP feedback, assignment status, CELTA 5 and formal events. | Tracker reads it; it is not a separate manual scorecard. |
| Formal event | Type, version, issue status, acknowledgement, decision record, supersedes reference. | Append history rather than erase issued state. |
| Grade decision | Provisional/final values, meeting snapshot, participants, evidence references, amendments. | Final report reads the recorded decision. |
| Volunteer record | Consent, attendance, carried hours and provenance. | Actual attendance is confirmed by a tutor. |
| Audience label | Private, TP group, tutors, centre, assessor or public Pool. | Reusable UI component rather than a policy afterthought. |

## 1 Course setup and timetable

**Purpose.** Give the centre one dependable source for course identity and a live calendar that drives the rest of the course.

**Primary users.** Centre administrator, tutor, trainee and assessor.

**Inputs.** Centre details, course dates, timezone, agreement choice, roster, day shape, rooms and event schedule.

**Outputs.** Readiness status, published trainee view, event durations, deadlines, TP slots, volunteer classes and assessor visit.

### Functional requirements

- Course Admin owns course name, centre details, course dates, timezone and agreement version.
- Timetable owns meeting days, rooms, day shape and scheduled events. Shared fields show their ownership and do not silently diverge.
- Every timetable event has a type and an explicit countsTowardContactHours boolean. Break and lunch default to false.
- The contact-hours view shows a calculation breakdown, not only a total.
- Closing or relaying a day previews affected TP sessions, deadlines, room events and assessor activity before confirmation.
- Course readiness is advisory and distinct from basic saved state. A centre may safely draft before every item is ready.

### Acceptance checks

- Changing a break never changes the contact-hour total.
- Changing a course date from either approved location makes the linked owner and side effect explicit.
- A day-shift preview lists each affected downstream item before the centre commits the shift.

## 2 TP point sets and rotation

**Purpose.** Turn a coursebook or centre-authored teaching set into balanced, usable teaching-practice points.

**Primary users.** Tutors primarily; trainees receive the released next point.

**Inputs.** Timetable TP slots, groups, point-set version, lesson types, lesson duration and tutor edits.

**Outputs.** Rotation map, one released TP brief, plan context, clash checks and source materials.

### Functional requirements

- Each teaching group chooses one set from Connect, the Pool or a centre-authored set.
- Lesson length comes from the actual timetable event; stage timing reads the same source.
- The rotation checks repeated lesson types within a group and on a day, but flags human discussion rather than creating a false technical block.
- A trainee sees one next TP by default. Tutors can open an optional printable practice map.
- Re-dealing protects recorded tutor edits and make-up lessons unless the tutor explicitly changes them.
- Every point retains set version, book edition and source references so a live course remains reproducible.

### Acceptance checks

- A trainee cannot accidentally see a future point merely because the tutor is editing the map.
- A timetable duration update is reflected in the affected planning view.
- A course can identify the exact set edition and version used for any completed TP.

## 3 The TP Point Pool

**Purpose.** Share reviewed point sets without creating a marketplace, membership system or reward economy.

**Primary users.** Any browsing centre, contributing centre and Connect editor.

**Inputs.** Connect-authored sets and optional centre lesson-procedure submissions.

**Outputs.** Free reusable set choices, contributor credit and a transparent review history.

### Functional requirements

- Connect sets are free with Lite and identify Connect as contributor.
- Anyone can browse and take a Pool set. No membership or contribution requirement exists.
- A centre may offer its own lesson procedures. The contribution excludes scans, recordings, links, course names and publisher-owned procedures.
- The contributor stores an attestation confirming that the procedures are its own and contain no licensed asset.
- Connect reviews and edits each incoming submission before publication. Review state is Sent, Under review, Clarification requested, Published or Declined.
- Published sets display book title, publisher, edition/year, optional ISBN, Pool version, contributor credit and release notes.
- A course keeps its taken version until it explicitly opts into an available update.

### Acceptance checks

- A visitor can browse and take a set without logging into a contributor account.
- Two editions of the same book can coexist without being incorrectly treated as one duplicate.
- A contributor can see its review state without needing an email-chain interpretation.

## 4 Trainee home plan teach reflect

**Purpose.** Keep the learning cycle calm and ordered without hiding useful course work.

**Primary users.** Trainee, with tutor context when reviewing plans and feedback.

**Inputs.** Released TP assignment, timetable duration, plan, prior starred action and current course state.

**Outputs.** Lesson plan, reflection, feedback opening and a sourced next action.

### Functional requirements

- The home page has one primary next action and no more than two quiet secondary actions.
- Locked rooms are non-link controls with a reason or opening condition.
- Notebook is consistently marked Private to you and outside the assessed course record.
- Plan duration pre-fills from timetable. The main aim sits near learning evidence and readiness cues.
- Readiness cues are informative. They do not score the trainee or block ordinary drafting.
- The current self-evaluation saves before tutor feedback becomes available where the learning sequence requires it.
- A carried action retains origin feedback and action IDs. Refreshing an imported action is deliberate and does not create duplicates.
- Tutor-starred actions say that they carry to the next plan and self-evaluation.

### Acceptance checks

- A trainee can identify the single next step without scrolling.
- Reopening a self-evaluation does not duplicate imported actions.
- A user on mobile sees the same basic readiness picture as a desktop user.

## 5 Tutor feedback and operating queue

**Purpose.** Help tutors act on the oldest meaningful work while preserving their judgment and ownership of feedback.

**Primary users.** Tutors and course directors.

**Inputs.** Plans, reflections, teaching observations, marking submissions, CELTA 5 stages and course events.

**Outputs.** Returned feedback, actionable queue, daily brief and candidate evidence.

### Functional requirements

- Feedback separates planning evidence, teaching evidence, criteria and forward action points.
- Ask Connect states what data leaves the browser and cannot send or decide feedback for a tutor.
- Queue items order by time waiting within meaningful groups and display the waiting age.
- A browser-local Focus on my group filter reduces noise without implying a formal permission model.
- Rare critical work such as a CELTA 5 stage or assessor preparation appears in the same daily attention line.
- A shared draft can display socially useful ownership such as started by and last saved by, without pretending there is account-based exclusive locking.

### Acceptance checks

- The feedback writer retains an Undo route after an accidental action.
- A tutor can explain why a queue item is ahead of another item.
- The assistant disclosure appears before a tutor submits notes to it.

## 6 Assignments and authorship

**Purpose.** Manage assignment briefs, submissions, marking and resubmission fairly while treating authorship as a human judgment.

**Primary users.** Trainee and tutor.

**Inputs.** Versioned brief, criteria, authorised support rules, trainee submission and declaration.

**Outputs.** Marked attempt, selective resubmission, tracker evidence and any formal case record.

### Functional requirements

- A brief version and rendered snapshot are attached to each submitted attempt.
- Criteria met on an earlier attempt remain protected during a surgical resubmission where the centre chooses that policy.
- The product does not rely on a hidden word as an authorship test or automatic misconduct trigger.
- The AI-use record asks for tool, purpose, material used and what the trainee checked or changed. A conversation link is optional, not expected.
- Marking produces evidence and a human result. It does not create a malpractice sanction automatically.

### Acceptance checks

- A tutor can open the precise brief version that governed an attempt.
- A trainee can declare AI use without exposing unrelated private conversation content.
- No automated flag changes an assignment result or sends a warning letter.

## 7 Candidate tracker grades and final report

**Purpose.** Present a derived, factual view of candidate progress and preserve the human grade decision that supports final reporting.

**Primary users.** Tutors, course director and assessor read-only.

**Inputs.** TP feedback, assignments, CELTA 5, observation tasks, attendance, formal events and grade meeting notes.

**Outputs.** Actionable candidate drawer, grades report, final report and assessor copy-ready material.

### Functional requirements

- The tracker only shows evidence derived from its source records. It has no hidden risk score.
- An attention label exposes its reason and one next action.
- Provisional and final grades remain editable before decision capture, with standard save behaviour.
- Record grade meeting captures date, participants, assessor, final recommendation and evidence snapshot.
- An amendment after decision capture appends a reason, time and editor. It does not silently overwrite the meeting state.
- The final report reads the captured grade decision and is released to a trainee only as a later centre action.

### Acceptance checks

- Every displayed attention condition can be traced to an assignment, TP or formal record.
- A later grade correction is visible as an amendment with a reason.
- An assessor can copy grades read-only without editing the record.

## 8 Official records and handover

**Purpose.** Keep CELTA 5, formal letters, acknowledgements and tutor handover legible without turning normal learning notes into formal records.

**Primary users.** Tutor, course director and authorised assessor.

**Inputs.** CELTA 5 stages, formal-letter decision, issuance, trainee acknowledgement and tutor handover note.

**Outputs.** Individual official timeline and dependable course record.

### Functional requirements

- An individual portfolio includes a read-only official timeline with dated links to formal events.
- Peer observation notes remain separate and private by default; only selected shared material belongs elsewhere.
- Before a malpractice letter is issued, staff record evidence reviewed, decision maker, policy basis and whether a trainee conversation occurred.
- Once a fail or malpractice letter is issued, the staff record preserves that version, issue time and acknowledgement state.
- Withdrawing a formal letter records a withdrawal reason and time. A correction is issued as a superseding version, not by erasing v1.
- Handover notes are dated and attributed but do not expose private peer notes or notebook material.

### Acceptance checks

- A tutor taking over can understand formal status from one timeline without re-reading unrelated screens.
- Staff can distinguish draft, issued, acknowledged, withdrawn and superseded letter states.

## 9 Assessor experience

**Purpose.** Give the assessor read-only access to the actual course evidence while helping the centre prepare quietly.

**Primary users.** Assessor and centre team.

**Inputs.** Course records, selected candidates, grades, documents, volunteer register and visit time.

**Outputs.** Assessor pack and optional centre-side visit readiness list.

### Functional requirements

- The assessor pack exposes the whole relevant cohort and selected observed candidates without falsely narrowing course visibility.
- It provides direct doors to records rather than copying documents into another system.
- The centre can use a short pre-visit check with visit time, selected candidates, actual available documents and volunteer register.
- The assessor pack remains read-only and expires according to the existing course policy.

### Acceptance checks

- An assessor can open a selected candidate record and the grade report without needing staff editing access.
- The centre readiness list does not appear as a compliance judgement to the assessor.

## 10 Volunteer students

**Purpose.** Support real teaching-practice students with a welcoming attendance and materials experience.

**Primary users.** Volunteer students, tutors and centre staff.

**Inputs.** Timetable classes, volunteer consent, attendance, materials and earlier hours.

**Outputs.** Class page, materials, attendance history, certificate eligibility and assessor register.

### Functional requirements

- Volunteer students see their next class, materials and clear consent choices in a low-preparation experience.
- Attendance is manually confirmed after class by a person; intention is a planning signal only.
- No response is labelled Likely or No reply yet, never Expected as if it were a commitment.
- Carried hours retain source centre/course, date and entered or confirmed by information.
- Certificate eligibility reads confirmed attendance and documented carried hours.

### Acceptance checks

- A tutor can explain every hour on a certificate total.
- The assessor register and volunteer page agree on confirmed class attendance.

## 11 Community materials and questions

**Purpose.** Allow useful exchange of material and questions without making private course work public by accident.

**Primary users.** Trainees, tutors and volunteer students where material is intentionally shared.

**Inputs.** Trainee handout share action, tutor materials, question text/audio and input-session connection.

**Outputs.** Shared materials library and live question wall.

### Functional requirements

- Every share control carries an audience label immediately beside the action.
- A trainee can stop sharing a handout and the product confirms who will no longer see it.
- Questions connect to a specific input session where possible and can be shown on a room wall or list.
- The question wall is a facilitation tool. Answered status is not a learner performance record.

### Acceptance checks

- A trainee knows whether a file is private, shared with TP group, shared with tutors or shared with volunteer students.
- A stopped share disappears from audience views without deleting the owner’s personal source material.

## 12 End of course and feedback

**Purpose.** Close the learner journey warmly while giving the centre useful feedback without breaking anonymity.

**Primary users.** Trainee, tutors and centre leadership.

**Inputs.** Completed course records, selected warm comments, class photo, trainee course feedback and response count.

**Outputs.** Last page, personal keeps, feedback summary and optional CSV/PDF route.

### Functional requirements

- The last page contains no grade or pass/fail outcome. It may contain course facts, a class photo and selected warm comments.
- Trainee personal keeps are explicit: course card, notebook and feedback record are separate links.
- Feedback tells trainees that answers are anonymous unless a name is deliberately added.
- Free-text feedback and small subgroup breakouts remain hidden until a configurable response threshold is reached; default recommendation is five responses for narrative comments.
- Centre exports retain the privacy rule and do not accidentally expose the identity of a small respondent group.

### Acceptance checks

- A trainee cannot infer a final grade from the last page.
- A tutor cannot see anonymous narrative comments below the centre threshold.

## Complete recommendation register

| ID | Priority | Change | Specification |
|---|---|---|---|
| R01 | P0 | Contact-hour rule | Use a single countsTowardContactHours property and show the total calculation. |
| R02 | P1 | Settings ownership | Course Admin owns dates and timezone; timetable owns day shape and events. |
| R03 | P1 | Timetable impact preview | List TP, deadline and visit effects before closing or shifting a day. |
| R04 | P1 | Readiness versus saved | Show advisory invitation readiness separately from basic saved state. |
| R05 | P2 | Actual session links | Link input material to a precise timetable session, not a matching title. |
| R06 | P2 | Home hierarchy | Keep one primary action and two quiet secondary actions. |
| R07 | P2 | Honest locked rooms | Use non-links with opening conditions for unavailable rooms. |
| R08 | P2 | Notebook boundary | State that Notebook is private and outside the assessed record. |
| R09 | P2 | Duration prefill | Read plan duration from the timetable event. |
| R10 | P2 | Plan readiness | Show quiet readiness and learning evidence together without scoring. |
| R11 | P2 | Mobile readiness | Preserve the summary on narrow screens. |
| R12 | P1 | Sourced imported actions | Use stable action references and an explicit refresh path. |
| R13 | P2 | Star meaning | Explain that a starred action carries into the next plan and reflection. |
| R14 | P0 | Assistant disclosure | State what Ask Connect sends, where it goes and that the tutor keeps judgment. |
| R15 | P2 | Neutral feedback reveal | Use one calm returned-feedback state before outcome detail. |
| R16 | P2 | Earlier TP index | Index prior records by TP number and date. |
| R17 | P1 | Waiting age | Order tutor work by time waiting inside each meaningful group. |
| R18 | P2 | Group focus | Add a browser-local tutor group filter. |
| R19 | P2 | Rare obligations | Bring CELTA 5 and visit preparation into the daily attention line. |
| R20 | P2 | Draft ownership | Show started by and last saved by without implying account-based locks. |
| R21 | P2 | Tracker next action | Show one derived next action and explain why an attention label appears. |
| R22 | P1 | Optional practice map | Keep one next TP by default and offer a print or tutor map on demand. |
| R23 | P1 | Edition-aware Pool identity | Use full book and edition metadata plus a set version. |
| R24 | P1 | Stable taken set | Do not change a live course set until the centre opts into a new version. |
| R25 | P1 | Contribution attestation | Store a clear own-procedure and no-licensed-assets confirmation. |
| R26 | P1 | Contribution lifecycle | Show Sent, Under review, Clarification requested, Published or Declined in-course. |
| R27 | P2 | Keep Pool language plain | Do not add rewards, rankings or membership language. |
| R28 | P0 | Remove hidden-word trap | Use transparent human-reviewed authorship evidence. |
| R29 | P0 | Structured AI-use record | Collect purpose and verification; do not expect a private conversation link. |
| R30 | P1 | Brief version snapshot | Attach the governing assignment brief version to every attempt. |
| R31 | P0 | Grade decision history | Capture grade meeting snapshot and append amendments with reasons. |
| R32 | P0 | Feedback anonymity threshold | Hold narrative feedback and small breakouts below the configured response minimum. |
| R33 | P0 | Formal-letter versions | Keep issued versions, withdrawal event and superseding version history. |
| R34 | P0 | Case decision before malpractice issue | Record evidence, decision maker, policy basis and trainee conversation before issue. |
| R35 | P1 | Official timeline | Present dated formal events in one portfolio timeline. |
| R36 | P1 | Audience labels | Reuse a clear audience label across sharing surfaces. |
| R37 | P2 | Keep peer-observation boundary | Retain private-by-default and reversible selected sharing. |
| R38 | P1 | Volunteer-hour provenance | Record source, date and person for carried hours. |
| R39 | P2 | Attendance wording | Call no-reply attendance likely, not expected. |
| R40 | P2 | Centre visit check | Add a modest internal assessor-visit readiness view. |
| R41 | P2 | Protect warm ending | Keep grade and action points off the final trainee page. |
| R42 | P2 | Personal keeps | Make course card, notebook and feedback record explicit end-of-course links. |

## Visual design specification

| Element | Treatment | Use |
|---|---|---|
| Paper | Warm cream surface | Primary content panels and long-form records. |
| Teal | Course structure | Navigation, stable course state and primary learning context. |
| Gold | Next action | One purposeful primary action per local context. |
| Brick | Real risk | Formal concern, decision required or an operational warning. Never a decorative alert colour. |
| Audience line | Small muted label | Place beside share, record and send actions. |
| Status pill | Short factual state | Use for state, not motivational scoring. Pair it with reason if attention is needed. |
| Card | Paper record fragment | Use for a course artefact or meaningful work unit, not every paragraph. |

## Implementation order

1. **Release 1 Record integrity and privacy.** Contact hours, assistant disclosure, transparent authorship and AI-use record, feedback anonymity threshold, formal letter versioning, case decision and grade snapshot.
2. **Release 2 Operational clarity.** Readiness, timetable change preview, tutor work queue, Pool provenance and lifecycle, official timeline.
3. **Release 3 Learning polish.** Home hierarchy, plan/readiness cues, sourced actions, optional map, audience labels, volunteer provenance and personal keeps.

## HTML mockup files

- `connect-lite-lifecycle-mockups.html` contains twelve proposed course lifecycle stages.
- `tp-points-and-sets-mockup.html` contains TP Point Courseboard and Set studio directions.
- Both are standalone files and can be opened directly in a browser or copied into a design handoff.
