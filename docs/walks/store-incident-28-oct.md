# Store pointed at an empty sheet, 28 Oct 2026, about 00:08 UTC (03:08 Istanbul)

**What happened.** The Apps Script store opens its data spreadsheet with `openById`. When that call failed once, for a
moment, while a burst of requests was running, `spreadsheet_()` fell through to `SpreadsheetApp.create` and overwrote the
`SPREADSHEET_ID` script property. About twenty empty sheets called "Connect Lite (data)" were created in two seconds
(00:08:15 to 00:08:40 UTC, in the Drive of ramysakr1@gmail.com), and the store now reads an empty one. Every course has
vanished from the console's list and every Lite link will say the course cannot be opened.

**What is safe.** The real data sheet is untouched: `1e63JlE1EWjQkWzFOTgtGn9mYB4oG6b0UWeKXt05QLt0` (created 20 Sep,
about 2 MB, last edited 23:54 UTC on 27 Oct, sheets courses / course / records / trainees all present).
Nothing was deleted. Anything written in the minutes since went to an empty sheet.

**The fix, 30 seconds, by hand.** Apps Script editor for the store: Project settings > Script properties > set
`SPREADSHEET_ID` to `1e63JlE1EWjQkWzFOTgtGn9mYB4oG6b0UWeKXt05QLt0`. Then reload the console; the courses are back.

**The code fix, waiting.** `store/gas/Code.js` is changed but NOT deployed (a production deploy was refused, correctly):
`spreadsheet_()` now retries an `openById` that fails and then reports it, and only a store with no sheet at all makes
one; and a new owner op `setSpreadsheet` points the store back at a sheet that holds courses. To ship it: `cd store/gas &&
clasp push && clasp deploy -i <the deployment id> -d "v172 ..."`. If you deploy it first, you can repair with the op
instead of the editor: `{owner, op:'setSpreadsheet', id:'1e63JlE1EWjQkWzFOTgtGn9mYB4oG6b0UWeKXt05QLt0'}`.

**Tidy afterwards.** The empty sheets can go in Drive's bin once the property is back (search "Connect Lite (data)",
created 28 Oct, tiny). Not done by me: they are harmless and nothing should be deleted without you looking.

**What set it off.** A burst of page loads and calls from my testing against the live store that night. That is the
trigger, not the cause: the cause is the fall-through in `spreadsheet_()`, which has been there since the store began.
