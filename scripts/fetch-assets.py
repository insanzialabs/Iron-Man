from pathlib import Path
import subprocess,json
from concurrent.futures import ThreadPoolExecutor
ROOT=Path(__file__).resolve().parents[1]
ASSETS={
'fonts/mona.woff2':'https://cdn.prod.website-files.com/67b5a02dc5d338960b17a7e9/67bc6274c5b4108b123aa4d5_MonaSans-VariableFont_wdth%2Cwght.woff2',
'fonts/brier.woff2':'https://cdn.prod.website-files.com/67b5a02dc5d338960b17a7e9/67b6113a220f85ad6497495a_Brier-Bold.woff2',
'images/hall-of-armor.jpg':'https://cdn.marvel.com/content/1x/ironman3_lob_mas_hlf_01_1.jpg',
'images/iron-man-film.jpg':'https://cdn.marvel.com/content/1x/ironman_lob_mas_hlf_01.jpg',
'images/iron-man-2-film.jpg':'https://cdn.marvel.com/content/1x/ironman2_lob_mas_hlf_01.jpg',
'images/workshop.jpg':'https://i.pinimg.com/originals/b4/98/46/b4984666739117d3c482291daab0515f.jpg',
'images/latveria.jpg':'https://cdn.prod.website-files.com/63cc34ceb9a0711ad777fc41/6a0ba49ddad426b183400ff6_Doctor-Doom-Looks-On-Castle-Doom.jpeg',
'images/armor-mark-vii.png':'https://vignette.wikia.nocookie.net/ironman/images/f/f2/Mark7F.png/revision/latest?cb=20150521170121',
'images/armor-mark-i.png':'https://static.wikia.nocookie.net/ironman/images/6/69/IronManMkIa-HOA.png/revision/latest?cb=20140625183404',
'images/armor-mark-v.png':'https://vignette.wikia.nocookie.net/ironman/images/8/82/5.png/revision/latest?cb=20180424135801',
'images/armor-mark-lxxxv.png':'https://vignette.wikia.nocookie.net/ironman/images/8/89/Iron_man_mark_85.png/revision/latest?cb=20190524153659',
}
def fetch(item):
 name,url=item
 p=ROOT/'public'/name if name.startswith('fonts/') else ROOT/'docs/source-assets'/Path(name).name
 p.parent.mkdir(parents=True,exist_ok=True)
 if p.exists() and p.stat().st_size:return name+' cached'
 result=subprocess.run(['curl','--fail','--location','--silent','--show-error','--max-time','35',url,'-o',str(p)],capture_output=True,text=True)
 return name+(' OK' if result.returncode==0 else ' FAILED '+result.stderr.strip())
if __name__=='__main__':
 with ThreadPoolExecutor(max_workers=4) as pool:
  for result in pool.map(fetch,ASSETS.items()):print(result)
 (ROOT/'docs/asset-sources.json').write_text(json.dumps(ASSETS,indent=2)+'\n')
