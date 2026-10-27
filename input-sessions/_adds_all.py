#!/usr/bin/env python3
"""Put every added part on its page and its trainer notes in the store file (see _adds.py)."""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import _adds, _adds_a, _adds_b, _adds_c   # noqa: F401  (each part file fills _adds.ADD)
from _adds import ADD, apply_all, store_notes

if __name__ == '__main__':
    from _house import number_from_nav
    from _notes import NOTES
    from _american import american
    done = apply_all(sys.argv[1:], number_from_nav, NOTES, american)
    store_notes(done, NOTES, american)
