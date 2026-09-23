import fs from "node:fs";
import vm from "node:vm";
import { makeEnv } from "./fake.mjs";

const SRC = process.env.TRACKER_SRC || "../../CELTA connect-code prompt/../tracker/Code.js";
const { ss, globals } = makeEnv();
const ctx = vm.createContext({ ...globals, console });
vm.runInContext(fs.readFileSync(SRC, "utf8"), ctx);   // the REAL Code.js
const call = (fn, ...a) => vm.runInContext(`(${fn})`, ctx)(...a);

// ---- plant a course that looks like C/17 ---------------------------------
const HEADER = vm.runInContext("HEADER", ctx);
const roster = [
  ["B1","Christopher Douglas Deniz Jones"],["B1","Maedeh Ahmadizadeh"],["B1","Seyedeh Maryam Hosseini"],
  ["B1","Tunç Hüseyin Pekmen"],["B1","Süer Okan Sevindir"],
  ["A1","Ali Altay Özbüber"],["A1","Şeyda Taşkıner"],["A1","Maryam Moumivand"],
  ["A1","Ali Behnami"],["A1","Sima Piroutzade"],
];
const tracker = ss.insertSheet("Tracker");
tracker.getRange(1,1,1,HEADER.length).setValues([HEADER]);
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
roster.forEach(([g,n], i) => {
  const row = new Array(HEADER.length).fill("");
  row[0] = slug(g + "-" + n); row[1] = "9/23/2026"; row[2] = "GIVEN"; row[5] = "STD"; row[6] = "STD";
  tracker.getRange(2 + i, 1, 1, HEADER.length).setValues([row]);
});
const rs = ss.insertSheet("Roster");
rs.getRange(1,1,1,2).setValues([["group","candidate"]]);
rs.getRange(2,1,roster.length,2).setValues(roster);

let pass = 0, fail = 0;
const check = (label, cond, detail = "") => { (cond ? pass++ : fail++); console.log(`  ${cond ? "PASS" : "FAIL"}  ${label}${detail ? "  -- " + detail : ""}`); };
const throws = (label, fn, expect) => {
  try { fn(); check(label, false, "no error thrown"); }
  catch (e) { check(label, expect.test(e.message), e.message.slice(0, 80)); }
};

console.log("SETUP");
check("course code defaults to C17/2026", call("courseCode") === "C17/2026");
const pre = call("previewNewCourse");
check("preview counts the records", pre.gradeRows === 10 && pre.candidates === 10, `${pre.gradeRows} rows, ${pre.candidates} candidates`);

console.log("\nTHE GUARD -- each of these must change nothing");
const snapshot = () => JSON.stringify([tracker.cells, rs.cells, call("courseCode")]);
const before = snapshot();
throws("wrong confirmation code is refused", () => call("startNewCourse","C18/2026",[{group:"X",name:"Y"}],"c17/2026"), /type the current course code/i);
throws("empty confirmation is refused",     () => call("startNewCourse","C18/2026",[{group:"X",name:"Y"}],""), /type the current course code/i);
throws("no new code is refused",            () => call("startNewCourse","",[{group:"X",name:"Y"}],"C17/2026"), /needs a code/i);
throws("empty roster is refused",           () => call("startNewCourse","C18/2026",[],"C17/2026"), /No candidates/i);
throws("duplicate candidates refused",      () => call("startNewCourse","C18/2026",[{group:"B1",name:"Ada Lovelace"},{group:"B1",name:"Ada Lovelace"}],"C17/2026"), /share one record/i);
check("nothing was written by any refusal", snapshot() === before);

console.log("\nTHE REAL THING");
const res = call("startNewCourse", "C18/2026", [
  {group:"B2",name:"Ada Lovelace"},{group:"B2",name:"Grace Hopper"},{group:"A2",name:"Alan Turing"},
], "C17/2026");
check("reports the new course", res.courseCode === "C18/2026", JSON.stringify(res));
check("reports what it cleared", res.clearedRows === 10 && res.candidates === 3);
check("course code is now C18/2026", call("courseCode") === "C18/2026");
check("every old grade row is gone", Object.keys(call("getData")).length === 0);
check("the Tracker header survived", String(tracker.getRange(1,1,1,1).getValues()[0][0]) === "id");
const newRoster = call("getRoster");
check("roster is exactly the new list", newRoster.length === 3 && newRoster.every((r,i) => r.name === ["Ada Lovelace","Grace Hopper","Alan Turing"][i]), JSON.stringify(newRoster.map(r=>r.group+"/"+r.name)));
check("no trace of the old candidates", !JSON.stringify(rs.cells).includes("Behnami"));

console.log("\nAFTERWARDS -- the new course is usable");
call("saveField", slug("B2-Ada Lovelace"), "tp1", "STD");
check("a grade saves against a new candidate", call("getData")[slug("B2-Ada Lovelace")]?.tp1 === "STD");
throws("a stale id is still refused", () => call("saveField", slug("B1-Ali Behnami"), "tp1", "STD"), /STALE_ROSTER/);
const health = call("healthCheck");
check("health check is clean", health.problems.length === 0, JSON.stringify(health));
check("confirmation now expects the NEW code", (() => { try { call("startNewCourse","C19/2026",[{group:"Z",name:"Q"}],"C17/2026"); return false; } catch (e) { return /C18\/2026/.test(e.message); } })());

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
