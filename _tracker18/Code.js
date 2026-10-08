var SHEET_NAME = 'Tracker';
// A field's column is its position in this list, so new fields are APPENDED --
// inserting one mid-list would shift every grade already in the sheet.
var FIELDS = ['exp','stage1','stage3','tp1','tp2','tp3','tp4','tp5','tp6','tp7','tp8','stage2','srt_r','srt_dm','fol_r','fol_dm','lrt_r','lrt_dm','lfc_r','lfc_dm','failLetter','withdrawn','tp1_aim','tp2_aim','tp3_aim','tp4_aim','tp5_aim','tp6_aim','tp7_aim','tp8_aim'];
var HEADER = ['id','updated'].concat(FIELDS);

var DEFAULT_COURSE_CODE = 'C18/2026';
// C/18 (8 Oct 2026): the tracker restored from the C/17 project's history after
// that project was deleted, and pointed at C/18's own data sheet.
var DEFAULT_SPREADSHEET_ID = '1e-m_PWv3i6qdFZenCFBk5OJggGUhAjHO7jsod3PEG6s';

/**
 * The course this tracker is currently holding.
 *
 * Was hardcoded in three places -- the page title, the masthead and the copied
 * summary -- which was fine while the tracker only ever held C17/2026. Starting
 * a new course has to change it, and a value in three places changes in two.
 */
function courseCode() {
return PropertiesService.getScriptProperties().getProperty('COURSE_CODE') || DEFAULT_COURSE_CODE;
}

function getMeta() {
return { courseCode: courseCode() };
}

function doGet() {
return HtmlService.createHtmlOutputFromFile('index').setTitle(courseCode() + ' Candidate Tracker').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Not bound to a spreadsheet, so the project keeps its own: created once,
// remembered by id. Run dataSheetUrl() to find it.
function spreadsheet_() {
var props = PropertiesService.getScriptProperties();
var id = props.getProperty('SPREADSHEET_ID') || DEFAULT_SPREADSHEET_ID;
var ss = null;
if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
if (!ss) {
ss = SpreadsheetApp.create(courseCode() + ' Candidate Tracker (data)');
props.setProperty('SPREADSHEET_ID', ss.getId());
}
return ss;
}

function dataSheetUrl() {
var url = spreadsheet_().getUrl();
Logger.log(url);
return url;
}

function sheet_() {
var ss = spreadsheet_();
var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
if (sh.getLastRow() === 0) {
sh.getRange(1, 1, 1, HEADER.length).setValues([HEADER]).setFontWeight('bold');
sh.setFrozenRows(1);
} else {
// A sheet written before a column existed gets the new headers labelled.
var have = sh.getRange(1, 1, 1, HEADER.length).getValues()[0], changed = false;
for (var i = 0; i < HEADER.length; i++) if (String(have[i] || '') !== HEADER[i]) { have[i] = HEADER[i]; changed = true; }
if (changed) sh.getRange(1, 1, 1, HEADER.length).setValues([have]).setFontWeight('bold');
}
return sh;
}

function getData() {
var sh = sheet_();
var last = sh.getLastRow();
var data = {};
if (last < 2) return data;
var rows = sh.getRange(2, 1, last - 1, HEADER.length).getValues();
rows.forEach(function (row) {
var id = String(row[0]);
if (!id) return;
var rec = {};
FIELDS.forEach(function (f, i) {
var v = row[i + 2];
rec[f] = (v === true || v === false) ? v : String(v == null ? '' : v);
});
data[id] = rec;
});
return data;
}

/** Every id the current roster can produce. */
function rosterIds_() {
var out = {};
getRoster().forEach(function (r) { out[slug_(r.group + '-' + r.name)] = true; });
return out;
}

function saveField(id, field, value) {
if (FIELDS.indexOf(field) === -1) throw new Error('Unknown field: ' + field);
// The id comes from the PAGE, derived from the roster it rendered with. Rename
// a candidate and an open tab still holds the old one, so a grade typed there
// found no row and APPENDED one under the pre-rename id -- a row nothing maps
// to and nobody will ever read. Found on the 23 Sep 2026 walk: one orphan,
// b1-christoph-deniz-jones, written hours after that rename, holding a main
// aim somebody thought they had recorded.
//
// Refusing is the kind thing. The alternative is writing it somewhere it will
// never be seen, which looks identical to success.
if (!rosterIds_()[String(id)]) throw new Error('STALE_ROSTER');
var lock = LockService.getScriptLock();
lock.waitLock(10000);
try {
var sh = sheet_();
var last = sh.getLastRow();
var rowIndex = -1;
if (last >= 2) {
var ids = sh.getRange(2, 1, last - 1, 1).getValues();
for (var i = 0; i < ids.length; i++) {
if (String(ids[i][0]) === String(id)) { rowIndex = i + 2; break; }
}
}
if (rowIndex === -1) {
rowIndex = last + 1;
sh.getRange(rowIndex, 1).setValue(id);
}
sh.getRange(rowIndex, FIELDS.indexOf(field) + 3).setValue(value == null ? '' : value);
sh.getRange(rowIndex, 2).setValue(new Date());
} finally {
lock.releaseLock();
}
return true;
}

// ---- Roster -------------------------------------------------------------
// Ramy, 12 Sep 2026: "it should obviously be something that could be used with
// any number of trainees and any number of TP groups." The names used to be a
// literal in index.html, so a new course meant editing and redeploying the
// page. They live in the sheet now, on their own tab, which also means a tutor
// can fix a spelling there and the app follows.
var ROSTER_TAB = 'Roster';
var ROSTER_HEADER = ['group', 'candidate'];
var ROSTER_SEED = [
['ABC', 'Billur Manav'], ['ABC', 'Iris Ersoy'], ['ABC', 'Kian Pakravanan'],
['DEF', 'Koray Yeşilyayla'], ['DEF', 'Hiba Alimam'], ['DEF', 'Ebru Rifai']
];

function rosterSheet_() {
var ss = spreadsheet_();
var sh = ss.getSheetByName(ROSTER_TAB);
if (!sh) {
sh = ss.insertSheet(ROSTER_TAB);
sh.getRange(1, 1, 1, ROSTER_HEADER.length).setValues([ROSTER_HEADER]).setFontWeight('bold');
sh.setFrozenRows(1);
// Seeded once, with the course this tracker was built for, so an existing
// tracker keeps its groups and nobody has to retype them.
sh.getRange(2, 1, ROSTER_SEED.length, 2).setValues(ROSTER_SEED);
}
return sh;
}

/** [{ group, name }] in sheet order -- the client keeps that order. */
function getRoster() {
var sh = rosterSheet_();
var last = sh.getLastRow();
if (last < 2) return [];
return sh.getRange(2, 1, last - 1, 2).getValues()
.filter(function (r) { return String(r[0]).trim() && String(r[1]).trim(); })
.map(function (r) { return { group: String(r[0]).trim(), name: String(r[1]).trim() }; });
}

/** The client's id for a candidate. Must match slug() in index.html. */
function slug_(s) {
return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/**
 * Replaces the whole roster.
 *
 * A candidate's grades are keyed by slug(group + '-' + name), so correcting a
 * spelling here used to leave the grades behind under the old id -- the row
 * stayed in the sheet and the renamed candidate came back empty. The comment
 * that used to sit here said grades were "keyed by name and never touched",
 * which was half true and the wrong half: they are keyed by name, which is
 * exactly why they have to move. Rows are paired by position, so a rename in
 * place carries its grades and a reordered or resized roster does not pretend
 * to know better.
 */
function saveRoster(rows) {
var lock = LockService.getScriptLock();
lock.waitLock(10000);
try {
var sh = rosterSheet_();
var last = sh.getLastRow();
var before = last >= 2 ? sh.getRange(2, 1, last - 1, 2).getValues() : [];
if (last >= 2) sh.getRange(2, 1, last - 1, 2).clearContent();
var clean = (rows || [])
.filter(function (r) { return r && String(r.group).trim() && String(r.name).trim(); })
.map(function (r) { return [String(r.group).trim(), String(r.name).trim()]; });
if (clean.length) sh.getRange(2, 1, clean.length, 2).setValues(clean);

// Rows are paired by position, which is right for a rename in place and
// wrong for an add or a remove -- removing the first name shifts everyone
// up and makes the whole roster look renamed. So a pair only counts when
// the old id has genuinely left the roster and the new id has genuinely
// just arrived; after a removal every "pair" fails both tests and nothing
// moves.
var wasRows = before.filter(function (r) { return String(r[0]).trim() && String(r[1]).trim(); });
var wasIds = {}, nowIds = {};
wasRows.forEach(function (r) { wasIds[slug_(String(r[0]).trim() + '-' + String(r[1]).trim())] = true; });
clean.forEach(function (r) { nowIds[slug_(r[0] + '-' + r[1])] = true; });
var renames = [];
wasRows.forEach(function (r, i) {
if (i >= clean.length) return;
var from = slug_(String(r[0]).trim() + '-' + String(r[1]).trim());
var to = slug_(clean[i][0] + '-' + clean[i][1]);
if (from !== to && !nowIds[from] && !wasIds[to]) renames.push([from, to]);
});
if (renames.length) renameIds_(renames);
} finally {
lock.releaseLock();
}
return true;
}

/**
 * Repoints grade rows at new ids. Called under the roster lock. A rename onto
 * an id that already has a row is left alone rather than merged or clobbered:
 * two candidates' grades are not ours to reconcile.
 */
function renameIds_(pairs) {
var sh = sheet_();
var last = sh.getLastRow();
if (last < 2) return 0;
var col = sh.getRange(2, 1, last - 1, 1);
var ids = col.getValues();
var taken = {};
ids.forEach(function (row) { taken[String(row[0])] = true; });
var moved = 0;
pairs.forEach(function (pair) {
if (taken[pair[1]]) return;
for (var i = 0; i < ids.length; i++) {
if (String(ids[i][0]) !== pair[0]) continue;
ids[i][0] = pair[1];
taken[pair[1]] = true;
moved++;
break;
}
});
if (moved) col.setValues(ids);
return moved;
}

function resetAll() {
var lock = LockService.getScriptLock();
lock.waitLock(10000);
try {
var sh = sheet_();
var last = sh.getLastRow();
if (last >= 2) sh.getRange(2, 1, last - 1, HEADER.length).clearContent();
} finally {
lock.releaseLock();
}
return true;
}

/**
 * One-off, 23 Sep 2026: remove grade rows the roster can no longer produce.
 * The walk found one -- b1-christoph-deniz-jones, left behind when that
 * candidate was renamed and then written to again by a tab that had not been
 * reloaded. saveField refuses such a write now, so this is a tidy-up rather
 * than a recurring chore. Returns what it removed so nothing is deleted
 * silently.
 */
function removeOrphanRows() {
  var live = rosterIds_();
  var sh = sheet_();
  var last = sh.getLastRow();
  if (last < 2) return 'No rows.';
  var rows = sh.getRange(2, 1, last - 1, HEADER.length).getValues();
  var doomed = [];
  for (var i = rows.length - 1; i >= 0; i--) {
    var id = String(rows[i][0] || '');
    if (!id || live[id]) continue;
    var carried = rows[i].slice(2).filter(function (v) { return v !== '' && v !== null; }).length;
    doomed.push(id + '  (' + carried + ' value' + (carried === 1 ? '' : 's') + ')');
    sh.deleteRow(i + 2);
  }
  return doomed.length ? 'Removed:\n  ' + doomed.join('\n  ') : 'No orphans — every row matches a candidate.';
}

/**
 * Does the Tracker tab still agree with the Roster tab?
 *
 * Grade rows are keyed by slug(group + '-' + name), so the two tabs can drift
 * apart without anything complaining: a rename, a stale browser tab, a hand
 * edit. On 23 Sep 2026 exactly that had happened -- one row under a
 * pre-rename id, holding a main aim somebody believed they had recorded, and
 * nothing in the tracker said so. It took reading the raw sheet to find.
 *
 * Called by the page at boot and silent when healthy, because a check nobody
 * runs is not a check.
 */
function healthCheck() {
  var problems = [];

  var roster = getRoster();
  var live = {}, seenName = {};
  roster.forEach(function (r) {
    var id = slug_(r.group + '-' + r.name);
    if (live[id]) problems.push('Two candidates share a row: ' + r.group + ' / ' + r.name);
    live[id] = true;
    var nk = (r.group + '|' + r.name).toLowerCase();
    if (seenName[nk]) problems.push('Listed twice on the roster: ' + r.group + ' / ' + r.name);
    seenName[nk] = true;
  });

  var sh = sheet_();
  var last = sh.getLastRow();
  var rows = last >= 2 ? sh.getRange(2, 1, last - 1, HEADER.length).getValues() : [];

  var TP_OK = { 'ABOVE': 1, 'STD': 1, 'NOTSTD': 1, 'S': 1, 'S+': 1, 'AS': 1, '': 1 };
  var ASSIGN_OK = { 'PASS': 1, 'FAILRES': 1, 'RES': 1, 'FAIL': 1, '': 1 };
  var STAGE2_OK = { 'NOTSTD': 1, 'STD': 1, 'ABOVE': 1, '': 1 };
  var GIVEN_OK = { 'GIVEN': 1, 'NOTGIVEN': 1, '': 1 };

  var seenId = {};
  rows.forEach(function (row) {
    var id = String(row[0] || '').trim();
    if (!id) return;
    if (seenId[id]) problems.push('Two grade rows for the same candidate: ' + id);
    seenId[id] = true;
    if (!live[id]) problems.push('A grade row belongs to nobody on the roster: ' + id);

    var get = function (field) { return String(row[FIELDS.indexOf(field) + 2] || '').trim(); };
    for (var n = 1; n <= 8; n++) {
      var g = get('tp' + n);
      if (!TP_OK[g]) problems.push(id + ': TP' + n + ' holds "' + g + '", which is not a grade');
    }
    ['srt', 'fol', 'lrt', 'lfc'].forEach(function (a) {
      var v = get(a + '_r');
      if (!ASSIGN_OK[v]) problems.push(id + ': ' + a.toUpperCase() + ' holds "' + v + '", which is not an outcome');
    });
    if (!STAGE2_OK[get('stage2')]) problems.push(id + ': Stage 2 holds "' + get('stage2') + '"');
    if (!GIVEN_OK[get('stage1')]) problems.push(id + ': Stage 1 holds "' + get('stage1') + '"');
    // Stage 3 is a standard judgement like Stage 2 (the page cycles it with
    // STAGE2_CYCLE), not a given/not-given box like Stage 1. Checking it
    // against GIVEN_OK flagged every candidate whose Stage 3 read "to
    // standard" -- two on C/17 on 27 Sep 2026 -- for holding a correct value.
    if (!STAGE2_OK[get('stage3')]) problems.push(id + ': Stage 3 holds "' + get('stage3') + '"');
  });

  Object.keys(live).forEach(function (id) {
    if (!seenId[id]) return; // no row yet is normal -- nobody has been graded
  });

  return { problems: problems, candidates: roster.length, rows: rows.length };
}

/**
 * What starting a new course would destroy. READ-ONLY -- nothing is written.
 *
 * Separate from startNewCourse on purpose: the page can call this freely to
 * show the damage before anyone commits to it, and no accidental call can
 * cost anything.
 */
function previewNewCourse() {
var sh = sheet_();
var last = sh.getLastRow();
var gradeRows = 0;
if (last >= 2) {
var rows = sh.getRange(2, 1, last - 1, HEADER.length).getValues();
gradeRows = rows.filter(function (r) { return String(r[0] || '').trim(); }).length;
}
return { courseCode: courseCode(), gradeRows: gradeRows, candidates: getRoster().length };
}

/**
 * Clears the course and takes a new roster in one go.
 *
 * Guarded three ways, because this is the only call in the tracker that
 * destroys work that cannot be recovered:
 *
 *   1. `confirmCode` must equal the CURRENT course code. The page asks the
 *      person to type it, and the check is repeated here -- a client-side
 *      confirmation is a courtesy, not a lock.
 *   2. The new roster must be non-empty and free of duplicate group+name
 *      pairs. Two identical pairs share one id, so their grades would collide
 *      from the first lesson -- the same collision that stranded a row on
 *      23 Sep 2026, arriving by a different door.
 *   3. Everything happens under the script lock, so a second tab cannot be
 *      writing a grade into the course being cleared.
 *
 * Deliberately does NOT go through saveRoster: that pairs old and new rows by
 * position to carry grades through a rename, which is exactly wrong here.
 * There is nothing to carry -- the grades are going.
 */
function startNewCourse(newCode, rows, confirmCode) {
var current = courseCode();
if (String(confirmCode || '').trim() !== current) {
throw new Error('To start a new course, type the current course code exactly: ' + current);
}
var code = String(newCode || '').trim();
if (!code) throw new Error('The new course needs a code, e.g. C18/2026');

var clean = (rows || [])
.filter(function (r) { return r && String(r.group).trim() && String(r.name).trim(); })
.map(function (r) { return [String(r.group).trim(), String(r.name).trim()]; });
if (!clean.length) throw new Error('No candidates in that list');

var seen = {}, dupes = [];
clean.forEach(function (r) {
var k = slug_(r[0] + '-' + r[1]);
if (seen[k]) dupes.push(r[0] + ' / ' + r[1]); else seen[k] = true;
});
if (dupes.length) throw new Error('Two candidates would share one record: ' + dupes.join('; '));

var lock = LockService.getScriptLock();
lock.waitLock(10000);
var cleared = 0;
try {
var sh = sheet_();
var last = sh.getLastRow();
if (last >= 2) {
cleared = last - 1;
sh.getRange(2, 1, last - 1, HEADER.length).clearContent();
}
var rs = rosterSheet_();
var rlast = rs.getLastRow();
if (rlast >= 2) rs.getRange(2, 1, rlast - 1, 2).clearContent();
rs.getRange(2, 1, clean.length, 2).setValues(clean);
PropertiesService.getScriptProperties().setProperty('COURSE_CODE', code);
} finally {
lock.releaseLock();
}
return { courseCode: code, candidates: clean.length, clearedRows: cleared };
}
