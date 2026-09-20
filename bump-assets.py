#!/usr/bin/env python3
"""Stamp every shared script/stylesheet reference with a version, so a fresh
page never runs against a stale cached copy of hub-shared.js & co (GitHub
Pages caches for ~10 min; a page that referenced a new function in a cached
shared file crashed on 20 Sep 2026). Run before every push: python3 bump-assets.py"""
import re, glob, datetime, pathlib
stamp = datetime.datetime.now().strftime("%Y%m%d%H%M")
assets = ["hub-shared.js", "hub-store.js", "hub-sync.js", "hub-tracker.js", "assignment-defaults.js", "hub-theme.css"]
for f in glob.glob("*.html"):
    p = pathlib.Path(f); s = p.read_text(); orig = s
    for a in assets:
        s = re.sub(r'(["\'])' + re.escape(a) + r'(\?v=[^"\']*)?(["\'])', lambda m: m.group(1) + a + "?v=" + stamp + m.group(3), s)
    if s != orig: p.write_text(s); print("stamped", f)
