# Code.gs v74 — the centre book: a number fills in its centre

Ramy, 6 Oct 2026: *"What if I misspell it or type it wrong? It has to be
attached to the number. If I write TR073, it should automatically give me
International House Istanbul."*

Cambridge publishes no register anyone can query, so there is nothing to
validate against — and no need to invent one. Connect already knows every
centre it has sold to, because the number and the name were both typed when
the course was minted. The store keeps that pair; the console fills the name
in from the number.

It **learns**: the first course for a centre is typed in full, every course
after it fills itself. The value is the typo check — TR073 fills *International
House Istanbul*, and TRO73 with a letter O fills nothing, which is the mistake
showing itself.

Three pastes. The console side is already live and does nothing until the
store answers.

**Deploy:** Save → Deploy → **Manage deployments** → the pencil → Version:
**New version** → Deploy.

---

## 1 · the sheet

Find: `HEADERS[SHEET_REPORTS]  = ['at', 'kind', 'page', 'where', 'text', 'role', 'course', 'state'];`

Add directly under it:

```js
/* v74 (6 Oct 2026): the centres Connect has sold to, number -> name. Written
   when a course is made, read by the console to fill the name in. Not a
   register of Cambridge's and never presented as one: it is this account's
   own record of who it has sold to. */
HEADERS[SHEET_CENTRES] = ['number', 'name', 'first', 'courses'];
```

## 2 · the name of it, and the two helpers

Find: `var SHEET_REPORTS = 'reports';`

Add directly under that line:

```js
var SHEET_CENTRES = 'centres';   // number | name | first seen | courses made
```

Then find `function nextCourseId_() {` and paste these **above** it:

```js
/* v74: every centre this account has made a course for. */
function centreBook_() {
  var sh = sheet_(SHEET_CENTRES), last = sh.getLastRow();
  var out = {};
  if (last < 2) return out;
  sh.getRange(2, 1, last - 1, 2).getValues().forEach(function (r) {
    var n = String(r[0] || '').trim().toUpperCase();
    if (n && String(r[1] || '').trim()) out[n] = String(r[1]).trim();
  });
  return out;
}
/* Remember a number and its centre. A name typed over an old one wins: the
   owner correcting the book is the only way it is ever corrected. */
function centreRemember_(number, name) {
  number = String(number || '').trim().toUpperCase();
  name = String(name || '').trim().slice(0, 120);
  if (!number) return;
  var sh = sheet_(SHEET_CENTRES), last = sh.getLastRow();
  var rows = last >= 2 ? sh.getRange(2, 1, last - 1, 4).getValues() : [];
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0] || '').trim().toUpperCase() !== number) continue;
    var made = (parseInt(rows[i][3], 10) || 0) + 1;
    sh.getRange(i + 2, 2, 1, 3).setValues([[name || rows[i][1], rows[i][2] || new Date(), made]]);
    return;
  }
  if (name) sh.appendRow([number, name, new Date(), 1]);
}
```

## 3 · the op, and createCourse remembering

Find: `case 'ownerCourses': {`

Paste this **above** it:

```js
    /* v74: the centre book, for the console's number -> name fill. Owner only:
       it is a list of who this account has sold to. */
    case 'centres': {
      requireOwner_(owner);
      return { centres: centreBook_() };
    }
```

Then, inside `case 'createCourse':`, find:

```js
      courseWrite_(cid, 'settings', seed);
```

and add directly under it:

```js
      /* v74: the book learns from every course made. */
      try { centreRemember_(centreNumber, centreName); } catch (e) {}
```

Finally, in the `return` of that same case, change:

```js
      return { id: cid, name: cname, tutorKey: courseKey_('tutor', cid), assessorKey: courseKey_('assessor', cid), courses: ownerList_() };
```

to:

```js
      return { id: cid, name: cname, tutorKey: courseKey_('tutor', cid), assessorKey: courseKey_('assessor', cid), courses: ownerList_(), centres: centreBook_() };
```

---

## 4 · the centre number's two shapes (a bug this found)

`createCourse` accepts only two letters followed by digits:

```js
      if (!/^[A-Z]{2}\d{3,5}$/.test(centreNumber)) throw new Error('A course needs its Cambridge centre number, e.g. TR001');
```

A UK centre number is **plain digits** — `10294` is International House
London, `00009` Teaching House Stratford-upon-Avon — and 141 of the 479
centres on Cambridge's list are that shape. Every one of them would be
refused. Cambridge also issues a trailing letter (`MX026b`, `CN800a`,
`GE007b`). Replace that line with:

```js
      if (!/^([A-Z]{2})?\d{3,5}[A-Z]?$/.test(centreNumber)) throw new Error('A course needs its Cambridge centre number, e.g. TR001 or 10294');
```

The console's own check was widened to match and is already live.

## Seeding it from a list

The book fills itself from here on, but it starts empty. **`store/centres-seed.tsv`
in this repository holds all 479 centres on Cambridge's list** (read off
CELTATrainers.com on 6 Oct 2026), ready to paste.

1. Deploy the four changes above. The first call to the console creates an
   empty **centres** sheet in the data spreadsheet.
2. Open that sheet, click **A1**, and paste the file's contents. It is
   tab-separated with the header row already on it, so it lands in four
   columns: number, name, first, courses.
3. Reload the console. Type `TR073` and the name fills itself.

TR073 — International House Istanbul — is in the file but **was not on
CELTATrainers' list**, which jumps TR067 → TR076. It is seeded from Ramy's
own CELTA 5s and assessor reports, which carry it on every page. Two other
pairs from those records cross-check against the site exactly (TR054 →
International Training Institute, TR013 → International House, Izmir), so
both sources agree wherever they overlap.

## What to expect

- Type a known number on the console's make-a-course row and the name fills
  itself, with a line saying *"TR073 is International House Istanbul. Type
  over the name to correct it — Connect will remember the correction."*
- Type an unknown one and the name box stays empty: *"Connect has not sold to
  TR073 before. Type the centre's name and it will fill itself next time — if
  you expected it to be known, check the number."*
- A name typed over a filled one is remembered against that number.
