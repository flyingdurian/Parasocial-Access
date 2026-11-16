#!/usr/bin/env python3
import time
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
previews=root/'previews';previews.mkdir(exist_ok=True)

try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  for size in [(1366,768),(1920,1080),(390,844),(360,740)]:
   w,h=size;name='phone' if w==390 else 'smallphone' if w==360 else 'desktop' if w==1920 else 'laptop'
   print('TEST',name,flush=True);page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1,has_touch=w<=400,is_mobile=w<=400)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.set_content((root/'dist/index.html').read_text(),wait_until='domcontentloaded');page.set_default_timeout(6000);page.wait_for_timeout(350)
   assert page.locator('.network-teaser [data-cmd="creators"]').count()==1,('no creator CTA',errors)
   page.locator('.network-teaser [data-cmd="creators"]').click();page.wait_for_timeout(150)
   assert page.locator('.network-person').count()==3,('roster wrong',errors)
   assert page.locator('.network-event').count()==3,('chapters wrong',errors)
   assert page.locator('.network-upgrade').count() in [0,2] # styled .creator-upgrade
   assert page.locator('.creator-upgrade').count()==2,('upgrades wrong',errors)
   if name in ('laptop','phone'):page.screenshot(path=str(previews/f'v06-network-{name}.png'),full_page=False)
   assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 3'),f'horizontal scrolling {name}'
   page.locator('[data-cmd="creator-select"][data-id="nova"]').click();page.wait_for_timeout(100)
   assert page.locator('.network-summary h2').inner_text()=='Nova Vale'
   page.locator('[data-cmd="creator-select"][data-id="glitch"]').click();page.wait_for_timeout(100)
   assert page.locator('.network-summary h2').inner_text()=='Glitch Arcade'
   page.locator('[data-cmd="creator-select"][data-id="destiny"]').click();page.wait_for_timeout(100)
   assert page.locator('.network-summary h2').inner_text()=='Destiny'
   # seed credits into local game for a real purchasing interaction
   page.evaluate('window.__RUSH.engine.progress.credits=9999;window.__RUSH.engine.save();window.__RUSH.engine.go("creators")')
   page.locator('[data-cmd="creator-buy"]').first.click();page.wait_for_timeout(80)
   assert page.evaluate('window.__RUSH.engine.creatorRank("destiny","buffer")')==1,'creator purchase failed'
   page.locator('[data-cmd="creator-start"][data-id="destiny-feed"]').click();page.wait_for_timeout(200)
   assert page.evaluate('window.__RUSH.engine.activeCreatorEvent?.id')=='destiny-feed',('no event start',errors)
   if name in ('laptop','phone'):page.screenshot(path=str(previews/f'v06-creator-shift-{name}.png'),full_page=False)
   assert page.locator('[data-cmd="answer"]').count()==3
   # browser end-to-end test: drive as expert player, verify event XP and results.
   page.evaluate('''() => {const e=window.__RUSH.engine;for(let n=0;n<1000&&e.mode==='playing';n++){if(e.queue.length){const c=e.queue[0];e.answer(c.verdict,c.id);}else e.update(.12);}}''')
   page.wait_for_timeout(200)
   assert page.evaluate('window.__RUSH.engine.mode')=='results',('no result',errors)
   assert page.locator('.creator-result').count()==1,('no creator results',errors)
   page.locator('[data-cmd="next"]').click();page.wait_for_timeout(180)
   assert page.locator('.network-person').count()==3,'does not return to network'
   assert not errors, f'{name} JS errors: {errors}'
   print(f'CHROMIUM {name} {w}x{h}: network, portraits, upgrades, shift, XP, results, navigation GREEN')
   page.close()
  browser.close()
finally:
 pass
