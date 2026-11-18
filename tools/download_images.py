#!/usr/bin/env python3
"""
Download every image the site hotlinks from Wix (static.wixstatic.com) into assets/img/
and rewrite index.html to use the local copies.

Run this ONCE, on a computer with internet access, BEFORE you delete / unpublish the Wix site:

    python3 tools/download_images.py

It only uses the Python standard library. Re-running is safe (already-downloaded files are skipped).
"""
import hashlib, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(ROOT, 'index.html')
OUT = os.path.join(ROOT, 'assets', 'img')
URL_RE = re.compile(r'https://static\.wixstatic\.com/media/[^"\')\s<>]+')

def main():
    html = open(INDEX, encoding='utf-8').read()
    urls = sorted(set(URL_RE.findall(html)))
    os.makedirs(OUT, exist_ok=True)
    mapping, failed = {}, []
    for i, url in enumerate(urls, 1):
        ext = os.path.splitext(url.split('/v1/')[0])[1] or '.jpg'
        name = hashlib.sha1(url.encode()).hexdigest()[:16] + ext
        path = os.path.join(OUT, name)
        if not os.path.exists(path):
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=60) as r, open(path, 'wb') as f:
                    f.write(r.read())
            except Exception as e:  # keep going; the hotlink stays in place for failures
                failed.append((url, str(e)))
                continue
        mapping[url] = 'assets/img/' + name
        print('[%d/%d] %s' % (i, len(urls), name))
    for url, local in mapping.items():
        # keep the absolute URL for social-share (og:/twitter:) tags, which must be absolute
        html = re.sub(r'(?<!content=")' + re.escape(url), local, html)
    open(INDEX, 'w', encoding='utf-8').write(html)
    print('\nDone: %d downloaded/linked, %d failed.' % (len(mapping), len(failed)))
    for u, e in failed:
        print('FAILED', u, e)
    sys.exit(1 if failed else 0)

if __name__ == '__main__':
    main()
