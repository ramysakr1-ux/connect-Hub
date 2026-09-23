// A stand-in for the Apps Script sheet API, implementing ONLY the methods
// Code.js actually calls. If Code.js reaches for anything else it throws, so
// this cannot quietly paper over a misuse of the real API.
export function makeEnv() {
  const props = {};
  class Range {
    constructor(sheet, row, col, numRows, numCols) { Object.assign(this, { sheet, row, col, numRows, numCols }); }
    getValues() {
      const out = [];
      for (let r = 0; r < this.numRows; r++) {
        const row = [];
        for (let c = 0; c < this.numCols; c++) row.push(this.sheet.cells[this.row - 1 + r]?.[this.col - 1 + c] ?? '');
        out.push(row);
      }
      return out;
    }
    setValues(vals) {
      if (vals.length !== this.numRows) throw new Error(`setValues: ${vals.length} rows into a range of ${this.numRows}`);
      vals.forEach((row, r) => {
        if (row.length !== this.numCols) throw new Error(`setValues: ${row.length} cols into a range of ${this.numCols}`);
        row.forEach((v, c) => {
          const rr = this.row - 1 + r, cc = this.col - 1 + c;
          while (this.sheet.cells.length <= rr) this.sheet.cells.push([]);
          this.sheet.cells[rr][cc] = v;
        });
      });
      return this;
    }
    clearContent() {
      for (let r = 0; r < this.numRows; r++)
        for (let c = 0; c < this.numCols; c++) {
          const rr = this.row - 1 + r; if (this.sheet.cells[rr]) this.sheet.cells[rr][this.col - 1 + c] = '';
        }
      return this;
    }
    setValue(v) { return this.setValues([[v]]); }
    getValue() { return this.getValues()[0][0]; }
    setFontWeight() { return this; }
  }
  class Sheet {
    constructor(name) { this.name = name; this.cells = []; }
    getRange(row, col, numRows = 1, numCols = 1) {
      if (row < 1 || col < 1 || numRows < 1 || numCols < 1) throw new Error(`getRange out of bounds: ${row},${col},${numRows},${numCols}`);
      return new Range(this, row, col, numRows, numCols);
    }
    getLastRow() {
      let last = 0;
      this.cells.forEach((row, i) => { if ((row || []).some((v) => v !== '' && v != null)) last = i + 1; });
      return last;
    }
    setFrozenRows() { return this; }
  }
  class Spreadsheet {
    constructor() { this.sheets = {}; }
    getSheetByName(n) { return this.sheets[n] || null; }
    insertSheet(n) { return (this.sheets[n] = new Sheet(n)); }
    getUrl() { return "https://example.invalid/sandbox"; }
    getId() { return "sandbox-sheet-id"; }
  }
  const ss = new Spreadsheet();
  // Pre-set, so spreadsheet_() takes the openById branch a real deployment
  // takes rather than the create-a-new-sheet branch.
  props.SPREADSHEET_ID = "sandbox-sheet-id";
  return {
    ss,
    globals: {
      SpreadsheetApp: { openById: () => ss, create: () => ss },
      PropertiesService: { getScriptProperties: () => ({
        getProperty: (k) => (k in props ? props[k] : null),
        setProperty: (k, v) => { props[k] = String(v); },
      }) },
      LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
      HtmlService: { createHtmlOutputFromFile: () => ({ setTitle: () => ({ addMetaTag: () => ({}) }) }) },
      Logger: { log() {} },
      props,
    },
  };
}
