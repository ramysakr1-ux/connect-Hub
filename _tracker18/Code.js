/**
 * IH Istanbul CELTA Candidate Tracker — rebuilt 8 Oct 2026.
 *
 * The C/17 tracker's Apps Script project was deleted (its web app answered
 * 404 and the project was gone from Drive). Its rule engine survived, ported
 * line for line into Connect Lite's hub-tracker.js on 20 Sep 2026, and so did
 * its data sheet. This is the tracker rebuilt on those: the same sheet layout
 * (Roster | Tracker, the same 32 columns, the same stored codes), so C/17's
 * sheet still reads in it, and a new sheet for C/18.
 *
 * Script properties (all optional; the defaults below are C/18's):
 *   SPREADSHEET_ID  the data sheet
 *   COURSE_CODE     shown in the masthead, title and copied summary
 *   LEVELS          "B1,A1": the level before and after SECOND_HALF_FROM
 *   SECOND_HALF_FROM  the first TP of the second half (5 on an 8-TP course)
 */
var DEFAULTS = {
  SPREADSHEET_ID: '1e-m_PWv3i6qdFZenCFBk5OJggGUhAjHO7jsod3PEG6s',
  COURSE_CODE: 'C18/2026',
  LEVELS: 'B1,A1',
  SECOND_HALF_FROM: '5'
};
var TP_TOTAL = 8;
var FIELDS = ['id', 'updated', 'exp', 'stage1', 'stage3',
  'tp1', 'tp2', 'tp3', 'tp4', 'tp5', 'tp6', 'tp7', 'tp8', 'stage2',
  'srt_r', 'srt_dm', 'fol_r', 'fol_dm', 'lrt_r', 'lrt_dm', 'lfc_r', 'lfc_dm',
  'failLetter', 'withdrawn',
  'tp1_aim', 'tp2_aim', 'tp3_aim', 'tp4_aim', 'tp5_aim', 'tp6_aim', 'tp7_aim', 'tp8_aim'];
var ROSTER_HEADER = ['group', 'candidate'];

/* What each kind of cell may hold. S, S+ and AS are the old TP scale, still in
   C/17's sheet: read as To standard / To standard / Above standard. */
var TP_OK = { '': 1, ABOVE: 1, STD: 1, NOTSTD: 1, S: 1, 'S+': 1, AS: 1 };
var GIVEN_OK = { '': 1, GIVEN: 1 };
var STAGE2_OK = { '': 1, NOTSTD: 1, STD: 1, ABOVE: 1 };
var ASSIGN_OK = { '': 1, PASS: 1, FAILRES: 1, RES: 1, FAIL: 1 };
var BOOL_OK = { '': 1, TRUE: 1, FALSE: 1 };
var AIMS = ['Grammar', 'Lexis', 'Functional language', 'Reading', 'Listening', 'Speaking', 'Writing'];

function prop_(k) {
  var v = PropertiesService.getScriptProperties().getProperty(k);
  return (v === null || v === undefined || v === '') ? DEFAULTS[k] : v;
}
function config_() {
  var lv = String(prop_('LEVELS')).split(',').map(function (s) { return s.trim(); });
  return {
    course: prop_('COURSE_CODE'),
    levels: { first: lv[0] || '', second: lv[1] || lv[0] || '' },
    secondHalfFrom: parseInt(prop_('SECOND_HALF_FROM'), 10) || 5,
    tpTotal: TP_TOTAL,
    aims: AIMS
  };
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle(config_().course + ' Candidate Tracker')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function spreadsheet_() { return SpreadsheetApp.openById(prop_('SPREADSHEET_ID')); }

/* Both tabs, created if missing, header written if it is not the expected one.
   A header that has grown columns at the end (a later field) is extended, never
   reordered: a field's column is its index in FIELDS. */
function sheet_(name) {
  var ss = spreadsheet_();
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  var header = name === 'Tracker' ? FIELDS : ROSTER_HEADER;
  var have = sh.getRange(1, 1, 1, header.length).getValues()[0];
  var same = header.every(function (h, i) { return have[i] === h; });
  if (!same) {
    sh.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function slug_(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function idFor_(group, name) { return slug_(group + '-' + name); }

function roster_() {
  var sh = sheet_('Roster');
  var last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, 2).getValues()
    .filter(function (r) { return String(r[1]).trim(); })
    .map(function (r) {
      var group = String(r[0]).trim(), name = String(r[1]).trim();
      return { id: idFor_(group, name), group: group, name: name };
    });
}
function rosterIds_() {
  var o = {};
  roster_().forEach(function (c) { o[c.id] = true; });
  return o;
}

function rows_() {
  var sh = sheet_('Tracker');
  var last = sh.getLastRow();
  var out = {};
  if (last < 2) return out;
  sh.getRange(2, 1, last - 1, FIELDS.length).getValues().forEach(function (r, i) {
    if (!String(r[0]).trim()) return;
    var rec = { _row: i + 2 };
    FIELDS.forEach(function (f, j) {
      var v = r[j];
      if (v instanceof Date) v = Utilities_formatDate_(v);
      if (v === true) v = 'TRUE'; else if (v === false) v = 'FALSE';
      rec[f] = v === null || v === undefined ? '' : String(v);
    });
    out[rec.id] = rec;
  });
  return out;
}
/* Sheets hands a typed-in date back as a Date object. */
function Utilities_formatDate_(d) {
  return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
}

function getData() {
  return { config: config_(), roster: roster_(), rows: rows_(), health: healthCheck() };
}

function okFor_(field, value) {
  if (/^tp\d+$/.test(field)) return !!TP_OK[value];
  if (/^tp\d+_aim$/.test(field)) return value === '' || AIMS.indexOf(value) >= 0;
  if (field === 'stage1') return !!GIVEN_OK[value];
  if (field === 'stage2' || field === 'stage3') return !!STAGE2_OK[value];
  if (/_r$/.test(field)) return !!ASSIGN_OK[value];
  if (/_dm$/.test(field) || field === 'withdrawn') return !!BOOL_OK[value];
  if (field === 'failLetter' || field === 'exp') return String(value).length <= 200;
  return false;
}

/* One cell, saved under the script lock. A tab left open on an old roster
   cannot write a row that matches no candidate: STALE_ROSTER (the C/17
   tracker's orphan-row fix of 23 Sep 2026, kept). */
function saveField(id, field, value) {
  value = value === true ? 'TRUE' : value === false ? 'FALSE' : String(value === null || value === undefined ? '' : value).trim();
  if (FIELDS.indexOf(field) < 1 || field === 'updated') throw new Error('UNKNOWN_FIELD ' + field);
  if (!okFor_(field, value)) throw new Error('BAD_VALUE ' + field + ' = ' + value);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (!rosterIds_()[id]) throw new Error('STALE_ROSTER');
    var sh = sheet_('Tracker');
    var rows = rows_();
    var rowNo = rows[id] ? rows[id]._row : Math.max(sh.getLastRow(), 1) + 1;
    if (!rows[id]) sh.getRange(rowNo, 1).setValue(id);
    var today = Utilities_formatDate_(new Date());
    sh.getRange(rowNo, FIELDS.indexOf(field) + 1).setValue(value);
    sh.getRange(rowNo, FIELDS.indexOf('updated') + 1).setValue(today);
    var rec = rows[id] || { id: id };
    rec[field] = value; rec.updated = today; delete rec._row;
    return rec;
  } finally {
    lock.releaseLock();
  }
}

/* Runs on every page load. Silent when healthy. Catches a row belonging to
   nobody and a cell holding something that is not one of the codes. */
function healthCheck() {
  var ids = rosterIds_();
  var rows = rows_();
  var orphans = [], bad = [];
  var names = {};
  roster_().forEach(function (c) { names[c.id] = c.name; });
  Object.keys(rows).forEach(function (id) {
    if (!ids[id]) { orphans.push(id); return; }
    FIELDS.forEach(function (f) {
      if (f === 'id' || f === 'updated') return;
      var v = rows[id][f];
      if (v !== '' && !okFor_(f, v)) bad.push({ name: names[id], field: f, value: v });
    });
  });
  return { orphans: orphans, bad: bad };
}

/* Start a new course: paste group + candidate, type the CURRENT course code to
   confirm (checked here, not only in the page), give the new code. Clears
   every grade and writes the new roster in one go. */
function startNewCourse(confirmCode, newCode, pasted) {
  var current = config_().course;
  if (String(confirmCode || '').trim() !== current) throw new Error('CONFIRM_MISMATCH');
  newCode = String(newCode || '').trim();
  if (!newCode) throw new Error('NO_NEW_CODE');
  var rows = parseRoster(pasted);
  if (!rows.length) throw new Error('EMPTY_ROSTER');
  var seen = {};
  rows.forEach(function (r) { var id = idFor_(r[0], r[1]); if (seen[id]) throw new Error('DUPLICATE ' + r[1]); seen[id] = true; });
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var tr = sheet_('Tracker'), ro = sheet_('Roster');
    if (tr.getLastRow() > 1) tr.getRange(2, 1, tr.getLastRow() - 1, FIELDS.length).clearContent();
    if (ro.getLastRow() > 1) ro.getRange(2, 1, ro.getLastRow() - 1, 2).clearContent();
    ro.getRange(2, 1, rows.length, 2).setValues(rows);
    PropertiesService.getScriptProperties().setProperty('COURSE_CODE', newCode);
  } finally {
    lock.releaseLock();
  }
  return getData();
}

/* A line with a TAB splits on tabs alone (commas live inside names); the name
   is the SECOND cell, never the rest glued together. */
function parseRoster(text) {
  return String(text || '').split(/\r?\n/).map(function (line) {
    if (!line.trim()) return null;
    var cells = line.indexOf('\t') >= 0 ? line.split('\t') : line.split(',');
    cells = cells.map(function (c) { return c.trim(); });
    if (cells.length < 2 || !cells[0] || !cells[1]) return null;
    if (/^group$/i.test(cells[0]) && /^(candidate|name)$/i.test(cells[1])) return null;
    return [cells[0], cells[1]];
  }).filter(Boolean);
}
