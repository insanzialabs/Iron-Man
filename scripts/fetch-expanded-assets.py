from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json, subprocess
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
ASSETS={
'doom-throne':('https://i.pinimg.com/originals/f3/3f/de/f33fde04c6058087a78e80bdf22fda55.jpg','https://in.pinterest.com/pin/supers-bin--39899146691468113/','Marvel Doctor Doom comic illustration / respective artist'),
'doom-sorcery':('https://assets.moxfield.net/cards/card-r4yMK-art_crop.jpg','https://moxfield.com/decks/2n6DkpJK7kSoiwm9Hd9dKw','Doctor Doom card artwork / respective artist and rights holders'),
'doom-cinematic':('https://lumiere-a.akamaihd.net/v1/images/g_disneymovies_avengersdoomsday_dr_doom_6cc246af.jpeg?region=0%2C0%2C1300%2C730','https://movies.disney.com/avengers-doomsday','Marvel Studios / Disney official image gallery'),
'doom-stained-glass':('https://lumiere-a.akamaihd.net/v1/images/g_movies_avengersdoomsday_d23update_poster_8c2ab836.jpeg?region=0%2C0%2C1300%2C730','https://movies.disney.com/avengers-doomsday','Marvel Studios / Disney official poster gallery'),
'doom-tapestry':('https://lumiere-a.akamaihd.net/v1/images/g_movies_avengersdoomsday_drdoom_poster_2f49df7d.jpeg?region=0%2C0%2C1300%2C730','https://movies.disney.com/avengers-doomsday','Marvel Studios / Disney official poster gallery'),
'doom-monarch':('https://i.pinimg.com/originals/63/c6/6c/63c66cb4a30362ec31051c1c908848db.jpg','https://www.pinterest.com/marveljunkie/comic-art-doctor-doom/','Doctor Doom throne illustration / respective artist'),
'iron-repulsor':('https://images.squarespace-cdn.com/content/v1/51b3dc8ee4b051b96ceb10de/1555533288181-D6HEPZ2IP6D8BPWGACYO/ironman%2B2.jpg','https://geektyrant.com/news/iron-man-2-quote-that-could-have-a-bigger-connection-to-avengers-infinity-war-and-avengers-endgame-than-we-realized','Marvel film image reproduced in GeekTyrant editorial'),
'iron-prototype':('https://miro.medium.com/0%2A_gfWIuWdn7i6Sb27.jpg','https://medium.com/@dcfilmschool/','Iron Man prototype repulsor still / Marvel'),
'iron-flight':('https://s.abcnews.com/images/Entertainment/ironman-2008-ht-3-thg-180502_hpMain_4x3_992.jpg','https://www.goodmorningamerica.com/culture/story/back-iron-man-10-years-start-marvel-cinematic-54876151','Marvel / ABC News film retrospective'),
'iron-new-york':('https://s.hdnux.com/photos/13/01/52/2890419/4/rawImage.jpg','https://www.chron.com/life/article/An-Avengers-explosion-3529332.php','The Avengers publicity still / Marvel'),
'iron-nanotech':('https://cdn.futura-sciences.com/sources/avengers-infinity-war-iron-man-armure-dopee-nanorobots.jpg','https://www.futura-sciences.com/sciences/actualites/science-fiction-avengers-infinity-war-nouvelle-armure-iron-man-dopee-nanorobots-71141/','Avengers Infinity War still / Marvel'),
'armor-mark-iii':('https://static.wikia.nocookie.net/ironman/images/f/f8/Mark3.png/revision/latest?cb=20150521161133','https://ironman.fandom.com/wiki/Iron_Man_Mark_III','Marvel character render / Iron Man Wiki'),
'armor-mark-l':('https://dafunda.com/wp-content/uploads/2018/06/Marvel-avengers-infinity-war-iron-man-sixth-scale-figure-hot-toys-silo-903421.png','https://dafunda.com/movie/news-movies/kekuatan-ironman-mark-l-ironman-mark-50/','Hot Toys / Marvel Mark L figure render'),
'doom-supreme':('https://media.revistagq.com/photos/67a0531e81a0bacc2ce0e1c4/2%3A3/w_862%2Ch_1293%2Cc_limit/clean_1_136.jpg','https://www.revistagq.com/articulo/doctor-muerte-comics-thunderbolts-one-world-under-doom','One World Under Doom cover / Marvel'),

}
def fetch(item):
 name,(url,page,credit)=item
 source=ROOT/'docs/source-assets'/f'{name}.jpg'
 result=None if source.exists() else subprocess.run(['curl','-fLsS','--max-time','40',url,'-o',str(source)],capture_output=True)
 try:
  if result and result.returncode:raise RuntimeError(result.stderr.decode()[:100])
  im=Image.open(source);im.load();im.thumbnail((1600,1600));im.save(ROOT/'public/images'/f'{name}.webp','WEBP',quality=88,method=6)
  return {'name':name,'url':url,'page':page,'credit':credit,'size':im.size,'status':'ok'}
 except Exception as e:return {'name':name,'status':'failed','error':str(e)}
if __name__=='__main__':
 with ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(fetch,ASSETS.items()))
 print(json.dumps(results,indent=2));(ROOT/'docs/expanded-asset-sources.json').write_text(json.dumps(results,indent=2)+'\n')
