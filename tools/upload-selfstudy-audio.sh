#!/bin/sh
# Uploads the Self-study listening lines made by make-selfstudy-audio.mjs to the R2 bucket the films use,
# served from films.connectlitefilms.com/selfstudy/<set>/<hash>.mp3. Names are hashes of what is said, so a file never
# changes: it is uploaded once and cached for good. Run: tools/upload-selfstudy-audio.sh <outdir> s1 s2 ...
OUT=$1; shift
for set in "$@"; do
  for f in "$OUT/$set"/*.mp3; do
    [ -f "$f" ] || continue
    k="selfstudy/$set/$(basename "$f")"
    if [ -f "$OUT/.uploaded" ] && grep -qx "$k" "$OUT/.uploaded"; then continue; fi
    npx wrangler r2 object put "lite-films/$k" --file "$f" --content-type audio/mpeg --cache-control "public, max-age=31536000, immutable" --remote >/dev/null 2>&1 && echo "$k" >> "$OUT/.uploaded" || echo "FAILED $k"
  done
  echo "$set uploaded"
done
