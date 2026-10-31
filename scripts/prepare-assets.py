from PIL import Image
from pathlib import Path
root=Path(__file__).resolve().parents[1]
for source,name in [('Tony Stark.png','tony'),('Iron Man.jpg','iron'),('Dr. Doom.jpg','doom')]:
 im=Image.open(root/source).convert('RGB'); im.save(root/f'public/images/{name}.webp','WEBP',quality=94,method=6)
for f in (root/'docs/source-assets').glob('*'):
 if f.suffix not in ['.jpg','.png']:continue
 try:
  im=Image.open(f);im.thumbnail((1600,1600));im.save(root/'public/images'/f.with_suffix('.webp').name,'WEBP',quality=90,method=6)
 except Exception: print('Unusable, omitted:',f.name)
