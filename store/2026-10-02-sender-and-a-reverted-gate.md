# The reminders' sender, and a gate that went out twice (versions 61 and 62, 2 Oct 2026)

## What a volunteer sees
Ramy: "those should be coming from the centre... make it info."

The mail already carried the centre's NAME and the centre's own reply-to; only
the envelope was the account running the script (his personal Gmail). No mail
system would let Lite send as the centre's own domain, so the envelope becomes
Connect's own address instead of a private one:

```js
var FROM_ = 'info@celtaconnect.com';
function sendAs_(msg) { ... GmailApp.sendEmail(msg.to, msg.subject, '', { htmlBody, name, replyTo, from: FROM_ }) }
```

`sendAs_` checks `GmailApp.getAliases()` once and falls back to `MailApp` if
the account does not hold the address as a verified "send mail as" alias — so
nothing breaks before that is set up. Anchor: `MailApp.sendEmail(msg);` inside
`sendVolunteerReminders`, replaced by `sendAs_(msg);`.

**Still to do:** add `info@celtaconnect.com` under Gmail → Settings → Accounts
→ "Send mail as" on whichever account runs the script. Until then the mails go
out as before.

## Version 61 was built on a stale editor tab
v61 was composed in a browser tab that had loaded Code.gs BEFORE v60, so
saving it reverted the centre-number gate: `createCourse` accepted a course
with no number again (two junk courses were made and deleted), `ownerList_`
stopped carrying `centreNumber`, and `putCourse` stopped re-imposing it.
**Version 62 restores all of it** on top of the sender change. See
[2026-10-01-centre-number.md](2026-10-01-centre-number.md) for the gate itself.

Verified live after v62: `createCourse` with no number and with a bad number
refused; `ownerCourses` → c1 TR073, c2 TR073, c4/c6/c7 TR999.
