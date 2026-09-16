#!/usr/bin/env python3
"""Empaqueta Scratchito en un único index.html autocontenido (sin recursos externos)."""
import pathlib, re, sys

d = pathlib.Path(__file__).parent
src = (d / 'src.html').read_text(encoding='utf-8')
css = (d / 'icons.css').read_text(encoding='utf-8') + '\n' + (d / 'styles.css').read_text(encoding='utf-8')
js = '\n'.join((d / f).read_text(encoding='utf-8')
               for f in ['assets.js', 'library.js', 'blocks.js', 'app.js', 'tutorial.js'])

out = src.replace('<link rel="stylesheet" href="icons.css">\n<link rel="stylesheet" href="styles.css">',
                  '<style>\n' + css + '\n</style>')
out = re.sub(r'\s*<script src="(assets|library|blocks|app|tutorial)\.js"></script>', '', out)
out = out.replace('</body>', '<script>\n' + js + '\n</script>\n</body>')

(d / 'index.html').write_text(out, encoding='utf-8')
kb = len(out.encode()) / 1024
print(f'index.html generado · {kb:.0f} KB · autocontenido (0 recursos externos)')
