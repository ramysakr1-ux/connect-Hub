# The owner key can be rotated (27 Sep 2026)

**Why.** Every course key in the store can be rotated — `rotateKey` for a
tutor link, `rotateAssessorKey` for the assessor's — and the one key that
matters most could not. `OWNER_KEY` lists every course, mints them, deletes
them and sets seats. If it ever got out, the only remedy was to edit the Script
Property by hand.

It gets out more easily than the course keys do, because it is the one that
ends up in addresses while working: the film's opening console shot takes it as
`&o=`, so it lands in URLs, browser history and session transcripts. Ramy, 27
Sep 2026, seeing it printed: *"Maybe you're supposed to have the key in here. I
thought you were not supposed to."* He was right, and the fix is not only to
stop printing it — it is to make it replaceable.

**What.** One new owner-only op, beside `ownerCourses` and `seats`.

```js
    /* The owner's own key, rotated by a holder of the current one. Every copy
       in circulation dies at once -- including any left in a URL, a browser
       history or a transcript, which is why this exists (27 Sep 2026).
       There is NO LOCKOUT: ownerKey() in this editor reads the property and
       only mints when there is none, so a key lost between rotating and saving
       it is always readable from here. */
    case 'rotateOwnerKey': {
      requireOwner_(owner);
      var no = newKey_();
      PropertiesService.getScriptProperties().setProperty('OWNER_KEY', no);
      return { key: no, link: 'https://lite.celtaconnect.com/14_owner.html?o=' + no };
    }
```

**Where.** In the `switch (op)` block, among the owner's own ops — directly
after `case 'ownerCourses'` closes is the natural place. The anchor above it
reads:

```js
    case 'ownerCourses': {
      requireOwner_(owner);
      return { courses: ownerList_() };
    }
```

**One other edit while you are in there.** `ownerKey()` still builds its link
on `https://ramysakr1-ux.github.io/connect-Hub/` (line ~696). The site has had
its own domain since 26 Sep. Change that line to

```js
  var link = 'https://lite.celtaconnect.com/14_owner.html?o=' + k;
```

so the link it logs is the one to bookmark.

**Deploying.** Save, then **Deploy → Manage deployments → pencil → Version: New
version → Deploy**. Not "New deployment" — that mints a new `/exec` URL and
every link in circulation keeps pointing at the old code.

**Using it.** `node store/rotate-owner-key.mjs --rotate` calls the op with the
current key, writes the new one to `.owner-key`, and reads it back by listing
the courses with it. It refuses to write a key it cannot then use, and it
prints the new console link rather than the bare key.

**If it ever goes wrong.** Run `ownerKey()` in this editor. It reads
`OWNER_KEY` and only mints when the property is missing, so it returns whatever
the current key is. Nothing is lost.
