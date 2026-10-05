/* WHAT ONE TEACHING PRACTICE COSTS, IN CLICKS.
 *
 * Ramy, 5 Oct 2026: "69% is not fair. I'm pretty sure it's almost 80. You're
 * just not very clear on how much work there is when you have it on the Drive.
 * Look at how many clicks you have to do every time."
 *
 * He is right, and the reason is the unit. The comparison counted ACTIONS, and
 * a whole journey down the tree counted as one of them:
 *
 *     "Back to Portfolios > candidate > TEACHING PRACTICE > TP1"   = 1 action
 *
 * That is four clicks charged as one, and it happens on the Drive side over and
 * over. Lite's steps really are one click each, so almost the entire undercount
 * sat on one side of the comparison.
 *
 * MEASURED, from the real C/17 folder (numbers only, never names): 133 folders,
 * 613 files, SEVEN levels deep; one candidate's portfolio holds 156 files with
 * 127 of them six folders down. That is what makes a navigation step expensive
 * and it is why a tutor feels it.
 *
 * THE RULES, so this can be argued with rather than believed:
 *  - A click is a click: opening a folder, a menu item, a button, a tab.
 *  - Reading and writing are the WORK. They cost the same on both sides and are
 *    counted the same on both sides -- the page's own rule since 30 Sep.
 *  - Nothing is charged for waiting, chasing or messaging. Ramy cut those from
 *    the Drive side himself on 30 Sep ("make sure the logic is not exaggerated")
 *    and they stay cut.
 *  - Where a step could be done two ways, it is costed the CHEAPER way.
 *
 * AND THEN THE TIME, which is the thing an owner hears. Clicks are abstract;
 * "three and a half hours a course" is not. Each step carries the seconds it
 * really takes -- the click, the page load, finding the thing with your eyes --
 * costed low, every one of them. A folder that opens in three seconds is a fast
 * folder. A file upload in forty is a quick one. The reading and the writing
 * are left out of the time entirely, on both sides, because they are the job.
 *
 *   node film/clicks.mjs
 */

/* [what it is, clicks, why it costs that] -- work steps carry `work: true` and
   the same cost on both sides, so the ratio is about the filing, not the job. */
const DRIVE = [
  ['Open Portfolios', 1],
  ['Open the candidate', 1],
  ['Open TEACHING PRACTICE', 1],
  ['Open TP1', 1],
  ['Download the plan, a Word document', 2, 'right-click, Download'],
  ['Open it', 1],
  ['Read the plan', 2, null, true],
  ['Write the comments and the feedback into it', 2, null, true],
  ['Check the aims again', 1, 'scroll back up the document'],
  ['Enter the date, the time and the level', 1],
  ['Go and find the register', 4, 'up to the course root, Admin, open the sheet'],
  ['Count the students, enter the number', 1],
  ['Change the file name to TP1_<name>_feedback', 2, 'rename, confirm'],
  ['Back to Portfolios > candidate > TEACHING PRACTICE > TP1', 4, 'four levels, every time'],
  ['Download the self-evaluation', 2],
  ['Open it', 1],
  ['Read it', 1, null, true],
  ['Write comments on it', 2, null, true],
  ['Paste everything into one document', 2, 'copy, paste'],
  ['Convert to PDF', 3, 'File, Download, PDF'],
  ['Upload it to the TP folder', 4, 'New, File upload, choose, confirm'],
  ['Tell the candidate it is back', 1],
  ['Open the candidate’s CELTA 5 and record the TP', 3, 'up a level, open the doc, find the row'],
  ['Remind the candidate to record it in theirs', 1],
  ['Open Candidate profiles in Admin and enter the grade', 5, 'course root, Admin, the sheet, find the row, type'],
];

const LITE = [
  ['The dashboard says the plan is in. Open the candidate.', 1],
  ['The plan and the self-evaluation are beside the form. Read them.', 3, null, true],
  ['Check the aims against what was taught.', 0, 'they are on the same screen'],
  ['Write the feedback, tagged with the criteria.', 2, null, true],
  ['Comment on their self-evaluation, in its own box.', 2, null, true],
  ['Return it. Their home says it is back.', 1],
  ['The CELTA 5 table and the tracker read it.', 0, 'nothing to record twice'],
];

/* seconds per step -- the click, the load, and finding it with your eyes.
   Work steps are not in here: the job takes as long as the job takes. */
const SECS = {"Open Portfolios": 3, "Open the candidate": 3, "Open TEACHING PRACTICE": 3, "Open TP1": 3, "Download the plan, a Word document": 15, "Open it": 8, "Check the aims again": 10, "Enter the date, the time and the level": 20, "Go and find the register": 25, "Count the students, enter the number": 20, "Change the file name to TP1_<name>_feedback": 15, "Back to Portfolios > candidate > TEACHING PRACTICE > TP1": 15, "Download the self-evaluation": 15, "Paste everything into one document": 30, "Convert to PDF": 20, "Upload it to the TP folder": 40, "Tell the candidate it is back": 20, "Open the candidate’s CELTA 5 and record the TP": 45, "Remind the candidate to record it in theirs": 20, "Open Candidate profiles in Admin and enter the grade": 45, "The dashboard says the plan is in. Open the candidate.": 3, "Check the aims against what was taught.": 0, "Return it. Their home says it is back.": 5, "The CELTA 5 table and the tracker read it.": 0};
const secs = list => list.reduce((n, s) => n + (s[3] ? 0 : (SECS[s[0]] || 0)), 0);

const sum = (list, only) => list.reduce((n, s) => n + ((only === undefined || !!s[3] === only) ? s[1] : 0), 0);
const show = (name, list) => {
  console.log('\n' + name);
  for (const [what, n, why, work] of list) {
    console.log('  ' + String(n).padStart(2) + '  ' + (work ? '·' : ' ') + ' ' + what + (why ? '   (' + why + ')' : ''));
  }
  console.log('  ' + String(sum(list)).padStart(2) + '    TOTAL   — ' + sum(list, false) + ' filing, ' + sum(list, true) + ' the work itself');
};

show('GOOGLE DRIVE — one teaching practice, one candidate', DRIVE);
show('CONNECT LITE — the same', LITE);

const d = sum(DRIVE), l = sum(LITE);
const dF = sum(DRIVE, false), lF = sum(LITE, false);
console.log('\n  ' + d + ' clicks against ' + l + ' — ' + Math.round((1 - l / d) * 100) + ' per cent fewer');
console.log('  the filing alone: ' + dF + ' against ' + lF + ' — ' + Math.round((1 - lF / dF) * 100) + ' per cent fewer');
console.log('  of the Drive’s ' + d + ', ' + DRIVE.filter(s => /Open|Back|find|root/.test(s[0]) || /level|root/.test(s[2] || '')).reduce((n, s) => n + s[1], 0) + ' are getting to the file and back');

/* A course is not one teaching practice. Four candidates, eight practices each. */
const TP = 8, CAND = 4;
console.log('\n  across a course of ' + CAND + ' candidates × ' + TP + ' practices:');
console.log('    Drive ' + (d * TP * CAND).toLocaleString() + ' clicks   Lite ' + (l * TP * CAND).toLocaleString() +
  '   — ' + Math.round((1 - l / d) * 100) + ' per cent fewer');
const ds = secs(DRIVE), ls = secs(LITE);
const hrs = n => (n / 3600) < 1 ? Math.round(n / 60) + ' minutes' : (n / 3600).toFixed(1) + ' hours';
console.log('\n  AND IN TIME, the filing only — the reading and writing are left out of both:');
console.log('    one teaching practice, one candidate:  Drive ' + Math.round(ds / 60) + ' min   Lite ' + ls + ' sec');
console.log('    a course of ' + CAND + ':                        Drive ' + hrs(ds * TP * CAND) + '   Lite ' + hrs(ls * TP * CAND));
console.log('    a course of 12:                       Drive ' + hrs(ds * TP * 12) + '   Lite ' + hrs(ls * TP * 12));
console.log('\n  (teaching practice only. Assignments, the pack and the close-out are on top,');
console.log('   and they are worse on the Drive side, not better.)');
