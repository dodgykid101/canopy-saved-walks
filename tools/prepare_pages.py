"""Stage only verified viewer assets for GitHub Pages, excluding docs/tools."""
from pathlib import Path
import json,shutil,sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
from verify_static import ROOT,verify
verify()
destination=ROOT/'_site'
if destination.exists():raise SystemExit('_site already exists; use a fresh checkout/build directory')
manifest=json.loads((ROOT/'download-manifest.json').read_bytes())
for relative in [e['path'] for e in manifest['files']]+['download-manifest.json','.nojekyll']:
    source=ROOT/relative;target=destination/relative
    target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(source,target)
print('Verified static files staged in _site; no server/model inputs included.')
