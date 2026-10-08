var SHEET_NAME = 'Tracker';
var FIELDS = ['exp','stage1','stage3','tp1','tp2','tp3','tp4','tp5','tp6','tp7','tp8','stage2','srt_r','srt_dm','fol_r','fol_dm','lrt_r','lrt_dm','lfc_r','lfc_dm','failLetter','withdrawn'];
var HEADER = ['id','updated'].concat(FIELDS);

function doGet() {
return HtmlService.createHtmlOutputFromFile('index').setTitle('C17/2026 Candidate Tracker').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Not bound to a spreadsheet, so the project keeps its own: created once,
// remembered by id. Run dataSheetUrl() to find it.
function spreadsheet_() {
var props = PropertiesService.getScriptProperties();
var id = props.getProperty('SPREADSHEET_ID');
var ss = null;
if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
if (!ss) {
ss = SpreadsheetApp.create('C17/2026 Candidate Tracker (data)');
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

function saveField(id, field, value) {
if (FIELDS.indexOf(field) === -1) throw new Error('Unknown field: ' + field);
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
