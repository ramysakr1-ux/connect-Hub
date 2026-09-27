# Course materials folders live in one folder (27 Sep 2026)

**Why.** `materialsFolder_` called `DriveApp.createFolder(name)`, which makes a
folder at the **root** of the running account's Drive. So every course Lite has
ever had dropped another loose "Connect Lite materials — …" folder into
Ramy's My Drive, beside everything personal he keeps there.

Untidy today, and worse at the moment the data moves into a Shared Drive, which
is the plan (see the Drive-ownership note): the files would arrive scattered
instead of filed. This is the five lines that note said should be done **at
migration time** — done before it instead, so the move is a move of one folder.

**What.** `matsRoot_()` — one folder called **Connect Lite**, remembered as the
script property `MATS_ROOT`, created on first use and re-made if it is ever
deleted. `materialsFolder_` now creates each course's folder inside it:

```js
  var folder = matsRoot_().createFolder(name);
```

Remembered by id like everything else in this store, so moving that folder
later changes nothing — a folder keeps its id when it moves, including into a
Shared Drive. That is the same property the whole migration rests on.

**And the folders that already exist.** `tidyMaterialsFolders()`, run from the
editor, walks every `MATS_FOLDER_*` property and moves each folder under
`MATS_ROOT`. Safe to run twice: one already there is left alone, one that has
been deleted is counted rather than thrown. It logs how many moved.

**Deploying.** The change only affects folders created from now on, so it needs
the usual **Deploy → Manage deployments → pencil → New version → Deploy**.
`tidyMaterialsFolders()` runs from the editor and needs no deployment at all.

**What this does NOT do.** It does not move the spreadsheet, and it does not
touch the script. The records still live in a personal Drive; that is the
Workspace and Shared Drive step, and it is the one that needs buying something.
