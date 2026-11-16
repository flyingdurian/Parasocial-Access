#!/usr/bin/env python3
from pathlib import Path
import re,base64,json
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
css=(root/'src/style.css').read_text()
hero=base64.b64encode((root/'assets/hero-art.webp').read_bytes()).decode('ascii')
css=css.replace("../assets/hero-art.webp",f"data:image/webp;base64,{hero}")
avatars=['data:image/webp;base64,'+base64.b64encode((root/'assets/avatars'/f'{i}.webp').read_bytes()).decode('ascii') for i in range(18)]
irl_hall='data:image/webp;base64,'+base64.b64encode((root/'assets/irl-hall.webp').read_bytes()).decode('ascii')
irl_cast='data:image/webp;base64,'+base64.b64encode((root/'assets/irl-cast.webp').read_bytes()).decode('ascii')
code='const __RUSH_AVATARS='+json.dumps(avatars)+';globalThis.__RUSH_AVATARS=__RUSH_AVATARS;\n'
code+='globalThis.__IRL_HALL='+json.dumps(irl_hall)+';globalThis.__IRL_CAST='+json.dumps(irl_cast)+';\n'
for file in ('content','scenarios-v03','scenarios-v04','scenarios-v05','creators-v06','creator-identity-v061','generator','events-v04','engine','audio','irl-v07','ui'):
 s=(root/'src'/f'{file}.js').read_text()
 s=re.sub(r'^import .*?;\s*$', '',s,flags=re.M)
 s=re.sub(r'^export \{[^}]*\};\s*$', '',s,flags=re.M)
 s=re.sub(r'\bexport (const|class|function)\b',r'\1',s)
 code+='\n// MODULE: '+file+'\n'+s+'\n'
html=html.replace('<link rel="stylesheet" href="src/style.css">','<style>'+css+'</style>')
html=html.replace('<script type="module" src="src/ui.js"></script>','<script>'+code+'</script>')
assert 'src="src/' not in html and 'href="src/' not in html
(root/'dist').mkdir(exist_ok=True)
out=root/'dist/index.html';out.write_text(html)
release=root/'Feedfall-Rush-Hour-v0.8-Play-Now.html'
release.write_text(html)
print(f'v0.8 standalone {out.stat().st_size:,} bytes; overflow focus repair, dev menu, and world-space living convention')
