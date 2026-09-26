#!/usr/bin/env python3
"""Stamp every shared script/stylesheet reference with a version, so a fresh
page never runs against a stale cached copy of hub-shared.js & co (GitHub
Pages caches for ~10 min; a page that referenced a new function in a cached
shared file crashed on 20 Sep 2026). Run before every push: python3 bump-assets.py"""
import re, glob, datetime, pathlib
stamp = datetime.datetime.now().strftime("%Y%m%d%H%M")
# Every shared file the pages link with ?v=. Three were missing from this list
# for as long as it has existed -- hub-house.css, hub-due.js, hub-exchange.js --
# so they were cached in sw.js but never re-stamped, and a change to the house
# style went out under a stamp from two days before it (26 Sep 2026, the field
# fill). The service worker's own VERSION bump does eventually clear them, but
# the ?v= is what makes it immediate, and an asset in one list and not the
# other is the kind of thing nobody notices until a page runs against a file
# that is older than the code expecting it.
assets = ["hub-shared.js", "hub-store.js", "hub-sync.js", "hub-tracker.js", "hub-due.js",
          "hub-exchange.js", "hub-crit-learn.js", "assignment-defaults.js",
          "hub-theme.css", "hub-house.css", "hub-record.css"]
for f in glob.glob("*.html"):
    p = pathlib.Path(f); s = p.read_text(); orig = s
    for a in assets:
        s = re.sub(r'(["\'])' + re.escape(a) + r'(\?v=[^"\']*)?(["\'])', lambda m: m.group(1) + a + "?v=" + stamp + m.group(3), s)
    if s != orig: p.write_text(s); print("stamped", f)
# The offline shell's cache is named by the same stamp, so each push retires the last one.
sw = pathlib.Path("sw.js"); t = sw.read_text()
t2 = re.sub(r"const VERSION = '[^']*'", "const VERSION = 'lite-" + stamp + "'", t)
if t2 != t: sw.write_text(t2); print("stamped sw.js")
