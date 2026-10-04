#!/usr/bin/env python3
"""
Read a coursebook PDF into text, including the scanned ones.

    python3 tools/read-book.py "<book.pdf>" out.json
    python3 tools/read-book.py "<book.pdf>" out.json --dpi 240 --pages 40-60

Most of the coursebooks in the library are scans with no text layer -- the
Language Hub Upper-Intermediate Teacher's Book is 234 pages of which only 21
could be read, which is why set three could not be built for a fortnight. This
reads the text layer where there is one and OCRs the rest with macOS's own
Vision framework (no install, no service, nothing leaves the machine).

Checked against a page that HAS a text layer: 97% of its words came back.
It also reads the reproduced Student's Book pages, which carry no text layer
at all, so the output is usually MORE than the publisher's own text gives --
which is why --ocr-all is worth using when you are writing TP points from it.

Output is a JSON list, one entry per page, so page N of the PDF is out[N-1].
Two-column pages are put back into reading order by splitting on the middle and
sorting each column top to bottom -- the same trick the answer-key parser uses.
"""
import fitz, subprocess, json, os, sys, shutil, argparse
from pathlib import Path

HERE = Path(__file__).resolve().parent
OCR_BIN, OCR_SRC = HERE / "ocr", HERE / "ocr.swift"

def ensure_ocr():
    """Vision lives behind Swift, so the helper is compiled on first use."""
    if OCR_BIN.exists() and OCR_BIN.stat().st_mtime >= OCR_SRC.stat().st_mtime:
        return True
    if not shutil.which("swiftc"):
        print("swiftc not found - install the Xcode command line tools "
              "(xcode-select --install) to read scanned books.", file=sys.stderr)
        return False
    r = subprocess.run(["swiftc", "-O", str(OCR_SRC), "-o", str(OCR_BIN),
                        "-framework", "Vision", "-framework", "AppKit"],
                       capture_output=True, text=True)
    if r.returncode:
        print(r.stderr, file=sys.stderr)
        return False
    return True

def columns(rows, split=0.48):
    left  = sorted([r for r in rows if r[0] <  split], key=lambda r: r[1])
    right = sorted([r for r in rows if r[0] >= split], key=lambda r: r[1])
    return "\n".join(t for _, _, t in left + right)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pdf"); ap.add_argument("out")
    ap.add_argument("--dpi", type=int, default=200)
    ap.add_argument("--pages", default="", help="1-based range, e.g. 40-60")
    ap.add_argument("--min-chars", type=int, default=400,
                    help="a page with fewer characters than this is treated as scanned")
    ap.add_argument("--ocr-all", action="store_true",
                    help="OCR every page, even ones with a text layer. On these books the "
                         "text layer carries only the teacher's notes, while OCR also reads "
                         "the reproduced Student's Book page beside them -- which is usually "
                         "what you actually want when writing TP points.")
    a = ap.parse_args()

    doc = fitz.open(a.pdf)
    n = len(doc)
    first, last = 0, n - 1
    if a.pages:
        lo, _, hi = a.pages.partition("-")
        first, last = int(lo) - 1, int(hi or lo) - 1
    pages = [""] * n
    todo = []
    for i in range(first, last + 1):
        t = "" if a.ocr_all else doc[i].get_text().strip()
        if len(t) >= a.min_chars:
            pages[i] = t              # the publisher's own text wins
        else:
            todo.append(i)
    print(f"{last-first+1} pages: {last-first+1-len(todo)} already readable, {len(todo)} to OCR")

    if todo:
        if not ensure_ocr(): sys.exit(1)
        tmp = HERE / ".ocrpages"; tmp.mkdir(exist_ok=True)
        BATCH = 10
        for s in range(0, len(todo), BATCH):
            chunk = todo[s:s+BATCH]
            files = []
            for i in chunk:
                f = tmp / f"p{i:04d}.png"
                doc[i].get_pixmap(dpi=a.dpi).save(str(f))
                files.append(str(f))
            raw = subprocess.run([str(OCR_BIN)] + files, capture_output=True, text=True).stdout
            cur, rows = None, []
            def flush():
                if cur is not None: pages[cur] = columns(rows)
            for line in raw.split("\n"):
                if line.startswith("###PAGE\t"):
                    flush(); cur = int(line.split("/p")[-1].split(".")[0]); rows = []
                elif line:
                    p = line.split("\t")
                    if len(p) == 3:
                        try: rows.append((float(p[0]), float(p[1]), p[2]))
                        except ValueError: pass
            flush()
            for f in files: os.remove(f)
            print(f"  {min(s+BATCH, len(todo))}/{len(todo)} OCR'd", flush=True)
        shutil.rmtree(tmp, ignore_errors=True)

    json.dump(pages, open(a.out, "w"))
    good = sum(1 for p in pages if len(p) > 200)
    print(f"wrote {a.out}: {good}/{n} pages with real text, "
          f"{os.path.getsize(a.out)//1024} KB")

if __name__ == "__main__":
    main()
