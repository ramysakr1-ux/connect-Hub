# Replay every logged edit to the old C/17 tracker, in order, against the
# 7 Sep page and the 12 Sep server file -- inside a sandbox. Only the file
# edits run: every write that is not the tracker's index.html / Code.js is
# thrown away, and no shell, clasp or git command is executed.
import builtins, io, os, re, sys, json, pathlib, traceback, glob

HERE = os.path.dirname(os.path.abspath(__file__))
SB = os.path.join(HERE, 'sandbox')
P = os.path.join(HERE, 'patches')
os.makedirs(SB, exist_ok=True)

if '--fresh' in sys.argv or not os.path.exists(os.path.join(SB, 'index.html')):
    open(os.path.join(SB, 'index.html'), 'w').write(open(os.path.join(HERE, 'index-0907.txt')).read())
    c = open(os.path.join(HERE, 'code-0912.txt')).read()
    open(os.path.join(SB, 'Code.js'), 'w').write(c[:c.find('=========== INDEX')].rstrip('\n') + '\n')

TRACKER_DIRS = ('/tmp/tracker-live', 'scratchpad/tracker', 'scratchpad/tracker2', 'scratchpad/tracker-src')
SKIP = ('12843', '13334', '13412', '22753', '22775', '22787', '18177', '18246')

real_open = builtins.open
def mapped(path):
    p = str(path)
    base = os.path.basename(p)
    if base in ('index.html', 'Code.js', 'Code.gs'):
        if any(d in p for d in TRACKER_DIRS) or not os.path.isabs(p):
            return os.path.join(SB, 'Code.js' if base == 'Code.gs' else base)
    return None
def sandbox_open(file, mode='r', *a, **k):
    m = mapped(file)
    if m: return real_open(m, mode, *a, **k)
    if any(x in mode for x in 'wa+'): return real_open(os.devnull, mode, *a, **k)
    return real_open(file, mode, *a, **k)

def run_python(src, label):
    g = {'__name__': '__main__'}
    old_open, old_io_open = builtins.open, io.open
    old_wt, old_rt = pathlib.Path.write_text, pathlib.Path.read_text
    builtins.open = sandbox_open; io.open = sandbox_open
    pathlib.Path.write_text = lambda self, data, *a, **k: sandbox_open(self, 'w', *a, **k).write(data)
    pathlib.Path.read_text = lambda self, *a, **k: sandbox_open(self, 'r', *a, **k).read()
    cwd = os.getcwd(); os.chdir(SB)
    try:
        exec(compile(src, label, 'exec'), g)
        return None
    except SystemExit:
        return None
    except BaseException as e:
        return ''.join(traceback.format_exception_only(type(e), e)).strip()
    finally:
        os.chdir(cwd)
        builtins.open, io.open = old_open, old_io_open
        pathlib.Path.write_text, pathlib.Path.read_text = old_wt, old_rt

HEREDOC = re.compile(r"python3 - (?:\"[^\"]*\" )*<<-?\s*'?(\w+)'?\n(.*?)\n\1(?:\n|$)", re.S)
files = sorted(f for f in os.listdir(P) if f.endswith('.txt'))
only = [a for a in sys.argv[1:] if not a.startswith('--')]
for f in files:
    if any(s in f for s in SKIP): continue
    body = open(os.path.join(P, f)).read()
    if only and not any(o in f for o in only): continue
    if f.endswith('-Edit.txt'):
        e = json.loads(body); p = mapped(e['file_path'])
        if not p: continue
        s = open(p).read()
        if e['old_string'] not in s: print('FAIL', f, 'Edit old_string not found'); continue
        open(p, 'w').write(s.replace(e['old_string'], e['new_string'], 1)); print('ok  ', f, '(Edit)'); continue
    if '17694' in f:   # 12 Sep sed: the aim codes for Speaking and Writing
        p = os.path.join(SB, 'index.html'); t = open(p).read()
        o = "{ key: 'Speaking', short: 'S' }, { key: 'Writing', short: 'W' }"
        print(('ok  ' if o in t else 'FAIL'), f, '(sed)'); open(p, 'w').write(t.replace(o, "{ key: 'Speaking', short: 'SP' }, { key: 'Writing', short: 'WR' }")); continue
    if '43180' in f:   # 18 Sep, typed into Monaco: the back-to-back rule only in the second half
        p = os.path.join(SB, 'index.html'); t = open(p).read()
        n = t.count('if (backToBack)')
        print(('ok  ' if n == 1 else 'FAIL'), f, '(monaco) occurrences', n); open(p, 'w').write(t.replace('if (backToBack)', 'if (backToBack && backToBack[1] >= SECOND_HALF_FROM)', 1)); continue
    if not any(d in body for d in TRACKER_DIRS): continue
    blocks = HEREDOC.findall(body)
    if not blocks:
        print('----', f, 'no python heredoc:', body[:120].replace('\n', ' ')); continue
    for tag, src in blocks:
        if not re.search(r"index\.html|Code\.js|Code\.gs", src): continue
        if not re.search(r"\.write\(|write_text|replace\(", src): continue
        err = run_python(src, f)
        print(('ok  ' if not err else 'FAIL'), f, '' if not err else err[:300])
print('index.html', len(open(os.path.join(SB, 'index.html')).read()), '| Code.js', len(open(os.path.join(SB, 'Code.js')).read()))
