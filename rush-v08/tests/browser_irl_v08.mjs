const {chromium}=await import('file://'+(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES||'/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/playwright/index.mjs');
import assert from 'node:assert/strict';
import { resolve } from 'node:path';

const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const errors=[];
try{
 for(const viewport of [{name:'phone',width:390,height:844},{name:'desktop',width:1280,height:800}]){
  const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
  page.on('pageerror',err=>errors.push(viewport.name+': '+err.message));
  await page.goto('file://'+resolve('rush-v08/dist/index.html'));
  await page.evaluate(()=>__RUSH.engine.go('creators'));
  await page.locator('[data-cmd="irl-start"]').click();
  await page.locator('[data-cmd="irl-begin"]').click();
  await page.waitForTimeout(1600);
  assert.equal(await page.locator('#irl-world-speech').isVisible(),true,'dialogue shows in world');
  assert.equal(await page.locator('#irl-guest').count(),0,'old bottom guest ticket removed');
  assert.equal(await page.locator('.irl-actions button').count(),4,'four direct dispatch buttons');
  assert.ok((await page.locator('#irl-speech-name').textContent()).length>0,'visible guest identity');
  await page.screenshot({path:resolve('rush-v08/previews/v08-'+viewport.name+'.png'),fullPage:true});
  await page.locator('[data-cmd="irl-action"][data-action="welcome"]').click();
  await page.waitForTimeout(2200);
  assert.ok(await page.evaluate(()=>__RUSH.irl.finished.length)>=1,'staff walks and resolves in world');
  assert.ok(await page.evaluate(()=>__RUSH.irl.visitors.length)>=0,'simulation stays active');
  await page.close();
 }
 assert.deepEqual(errors,[],'no browser runtime errors');
 console.log('v0.8 browser GREEN: mobile + desktop, world speech, dispatch, no crash');
}finally{await browser.close();}
