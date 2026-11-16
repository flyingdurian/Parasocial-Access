"""v0.6.1 Chrome mobile/desktop checks: actual buttons, signature overlays,
creator content and fairness. No live network or fictional event claims needed."""
from playwright.sync_api import sync_playwright
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];HTML=(ROOT/'dist/index.html').read_text()
PRE=ROOT/'previews';PRE.mkdir(exist_ok=True)
errors=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,h,tag in [(1366,768,'laptop'),(1920,1080,'desktop'),(390,844,'phone'),(360,740,'small-phone')]:
  page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1,has_touch=w<700,is_mobile=w<700)
  page.on('pageerror',lambda exc:errors.append(str(exc)))
  page.set_default_timeout(9000)
  page.set_content(HTML,wait_until='domcontentloaded');page.wait_for_timeout(90)
  assert page.locator('.world-card').count()==4
  page.locator('[data-cmd=creators]').first.click()
  assert page.locator('.network-person').count()==3
  page.screenshot(path=str(PRE/f'v061-roster-{tag}.png'),full_page=False)
  assert page.evaluate('document.documentElement.scrollWidth-window.innerWidth')<=2,tag
  for who in ['destiny','nova','glitch']:
   page.locator(f'[data-cmd=creator-select][data-id={who}]').click()
   assert page.locator('.network-summary h2').inner_text()=={'destiny':'Destiny','nova':'Nova Vale','glitch':'Glitch Arcade'}[who]
   page.locator(f'[data-cmd=creator-start][data-id={who}-feed]').click();page.wait_for_timeout(90)
   assert page.locator('.playing-page.creator-'+who).count()==1,('missing creator skin',who,errors)
   assert page.locator('.creator-signature.sig-'+who).count()==1
   assert page.locator('[data-cmd=answer]').count()==3
   assert page.evaluate('document.documentElement.scrollWidth-window.innerWidth')<=2
   if tag in ['phone','laptop']:
    page.screenshot(path=str(PRE/f'v061-{who}-{tag}.png'))
   coords=page.locator('[data-cmd=answer]').evaluate_all('(xs)=>xs.map(el=>{const r=el.getBoundingClientRect();return [r.left,r.right,r.top,r.bottom];})')
   assert all(x[0]>=-2 and x[1]<=w+2 and x[2]>=-2 and x[3]<=h+2 for x in coords),('buttons not visible',tag,who,coords)
   if who=='destiny':
    assert page.locator('.debate-context').count()==1
    page.evaluate('''() => {const e=__RUSH.engine;for(let n=0;n<2;n++){const c=e.queue[0];e.answer(c.verdict,c.id);}}''')
    assert page.evaluate('__RUSH.engine.debateClashes')==1
   if who=='nova':
    page.evaluate('''() => {const e=__RUSH.engine;let n=0;while(!e.communityCelebrations&&n++<20){const c=e.queue[0];e.answer(c.verdict,c.id);}}''')
    assert page.evaluate('__RUSH.engine.communityCelebrations')>=1
    assert int(page.locator('#community-celebrations').inner_text())>=1
   if who=='glitch':
    page.evaluate('''() => {const e=__RUSH.engine;let n=0;while(e.tournament.round===1&&n++<20){const c=e.queue[0];e.answer(c.verdict,c.id);}}''')
    assert page.locator('.round-arcade').count()==1
    assert page.evaluate('__RUSH.engine.tournament.breakRemaining')>0
    if tag=='phone':page.screenshot(path=str(PRE/'v061-glitch-round-phone.png'))
    page.evaluate('''() => {const e=__RUSH.engine;for(let i=0;i<18;i++)e.update(.12)}''')
    assert page.locator('.round-arcade').count()==0
   page.evaluate('''() => __RUSH.engine.go('creators')''')
  # The Destiny Arena chapter is gated to preserve campaign progress.
  page.evaluate('''() => {const e=__RUSH.engine;e.progress.arenaUnlocked=true;e.progress.worlds[1].unlocked=4;e.progress.creators.destiny.xp=180;e.progress.creators.destiny.records['destiny-feed']={stars:3,best:1000,attempts:1};e.startCreatorEvent('destiny-arena')}''')
  page.evaluate('''() => {const e=__RUSH.engine;let n=0;while(!e.signatureActive&&e.mode==='playing'&&n++<800){if(e.queue.length){const c=e.queue[0];e.answer(c.verdict,c.id)}else e.update(.12)}}''')
  assert page.evaluate('__RUSH.engine.signatureActive'),('train did not appear',errors)
  assert page.locator('.emote-arcade').count()==1,('minigame overlay missing',errors)
  assert page.locator('[data-choice=merge]').count()==1 and page.locator('[data-choice=route]').count()==1
  if tag=='phone':page.screenshot(path=str(PRE/'v061-destiny-emote-phone.png'))
  if tag=='laptop':page.screenshot(path=str(PRE/'v061-destiny-emote-laptop.png'))
  action=page.evaluate("__RUSH.engine.emoteTrain.current.match?'merge':'route'")
  before=page.evaluate('({health:__RUSH.engine.hearts,index:__RUSH.engine.emoteTrain.index,clock:__RUSH.engine.clock})')
  page.locator(f'[data-choice={action}]').click()
  after=page.evaluate('({health:__RUSH.engine.hearts,index:__RUSH.engine.emoteTrain.index,clock:__RUSH.engine.clock})')
  assert after['index']==before['index']+1 and after['health']==before['health']
  assert after['clock']==before['clock']
  page.evaluate('''() => {const e=__RUSH.engine;while(e.signatureActive){const c=e.emoteTrain.current;e.routeEmote(c.match?'merge':'route')}}''')
  assert page.locator('.emote-arcade').count()==0
  assert page.evaluate('__RUSH.engine.emoteTrain.peak')>=100
  assert not errors,(tag,errors)
  print('CHROMIUM',tag,'FOUR WORLDS · THREE CREATOR IDENTITIES · THREE MECHANICS · EMOTE TRAIN CLICK · NO JS ERRORS')
  page.close()
 browser.close()
print('RUSH v0.6.1 BROWSER GREEN: 4 viewports, identity distinction, actual minigame interaction, accessible actions')
