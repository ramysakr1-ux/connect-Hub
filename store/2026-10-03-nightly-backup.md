# The nightly backup, rebuilt (3 Oct 2026) — on Head, not deployed

**Why.** Compiling the keys document on 3 Oct I checked the folder
`CELTA hub backups` and found the newest file dated **2 September 2026**. The
store's own header comment says the Sheet "is backed up nightly into a folder",
and `offer.html` is written on the assumption that it is. It was not.

The cause is not a broken trigger. There was **no backup anywhere**:

- `Code.gs` contained zero occurrences of `backup`.
- The project's Triggers page held exactly one trigger, `sendVolunteerReminders`.
- **My Triggers**, across the whole Google account, held that same one and
  nothing else.
- Apps Script had six projects and one trashed project, none of them a backup.

So whatever wrote `Connect Hub backup <date>` up to 2 September went with the
rewrite that became "Connect Lite store", and nobody noticed because a backup
that stops makes no noise. Thirty-one days with no second copy of the records,
over the period that included the multi-course migration and the whole of the
real C/17 course.

**What now.**

`nightlyBackup()` and `backupFolder_()`, appended to `Code.gs`:

```js
function nightlyBackup() {
  var props = PropertiesService.getScriptProperties();
  var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var name = 'Connect Lite backup ' + stamp;
  var folder = backupFolder_();
  if (folder.getFilesByName(name).hasNext()) { ... return name + ' was already there'; }
  var srcId = props.getProperty('SPREADSHEET_ID');
  if (!srcId) throw new Error('No SPREADSHEET_ID, so nothing to back up');
  DriveApp.getFileById(srcId).makeCopy(name, folder);
  /* prune */
}
```

Four decisions worth keeping:

- **It copies the file, it does not read the cells.** `makeCopy` on the Drive
  file is one call and cannot truncate a 50,000-character cell the way a
  read-and-rewrite could. A copied Google Sheet also costs no Drive quota.
- **`backupFolder_()` follows `matsRoot_()`.** Script property `BACKUP_FOLDER`,
  falling back to a folder named `CELTA hub backups`, re-made if deleted. The
  existing folder was adopted on the first run, so the history stays in one place.
- **It prunes only what it wrote.** `BACKUP_KEEP = 30`, and only files matching
  `^Connect Lite backup \d{4}-\d{2}-\d{2}$` are ever trashed. The old
  `Connect Hub backup` files are the pre-migration history and are left alone.
- **Running twice on one day is a no-op**, so a manual run before the timer
  fires costs nothing.

**The trigger.** Added from the project's Triggers page: `nightlyBackup`,
**Head**, time-driven, **Day timer, Midnight to 1am (GMT+03:00)**, failure
notification **immediately** rather than daily — the whole failure mode here
was silence. The stamp is taken in Istanbul time at run time, so the file
written just after midnight carries the new day's date and holds the previous
day's work.

**Proved.** Run once from the editor at 11:50, 3 Oct: completed in 4 s, and
`Connect Lite backup 2026-10-03` landed in `CELTA hub backups` at
**1,221,145 bytes** against the live Sheet's 1,226,646 — the whole thing, not
a stub.

**NOT deployed, on purpose.** The trigger runs against Head, and nothing on the
`doPost` path changed, so the live `/exec` needs no new version and was left
exactly as it was on v65. The next deploy carries this code along with it.
