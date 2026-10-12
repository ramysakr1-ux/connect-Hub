# Join the screen-sized pieces of each tall shot into one picture (at 2x), any width.
import json, sys
from PIL import Image
D = sys.argv[1]; m = json.load(open(f'{D}/meta.json'))
for name, v in list(m.items()):
    if not isinstance(v, dict) or 'parts' not in v or len(v['parts']) < 2: continue
    first = v['top']; w = Image.open(v['parts'][0]['file']).width; H = int(round(v['h'] * 2)); out = Image.new('RGB', (w, H))
    for pt in v['parts']: out.paste(Image.open(pt['file']).convert('RGB'), (0, int(round((pt['top'] - first) * 2))))
    out.save(f'{D}/{name}.png'); print(name, len(v['parts']), out.size)
if 'others-1' in m and 'others-2' in m:   # film 3: the others section, heading to the end of the page
    a = m['others-1']; b = m['others-2']; w = Image.open(f'{D}/others-1.png').width
    H = int(round((b['top'] + 713 - a['top']) * 2)); out = Image.new('RGB', (w, H))
    for top, f in [(a['top'], f'{D}/others-1.png'), (b['top'], f'{D}/others-2.png')]: out.paste(Image.open(f).convert('RGB'), (0, int(round((top - a['top']) * 2))))
    out.save(f'{D}/others.png'); m['others'] = {'top': a['top'], 'h': H / 2}; json.dump(m, open(f'{D}/meta.json', 'w'), indent=1); print('others', out.size)
