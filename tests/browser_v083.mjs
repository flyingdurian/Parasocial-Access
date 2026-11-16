import assert from 'node:assert/strict';
const {chromium}=await import('file://'+(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES||'/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/playwright/index.mjs');

const origin=process.env.FEEDFALL_BASE_URL||'http://127.0.0.1:8783';
const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
const failures=[];
try{
 for(const viewport of [{width:1280,height:800},{width:390,height:844}]){
  const page=await browser.newPage({viewport});
  page.on('pageerror',error=>failures.push(error.message));
  page.on('response',response=>{if(response.status()>=400&&response.url().startsWith(origin))failures.push(`${response.status()} ${new URL(response.url()).pathname}`);});
  await page.goto(origin,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>__RUSH.engine.start(0,0));
  await page.waitForTimeout(300);
  const card=page.locator('.post-person img');
  await card.first().waitFor();
  assert.ok(await card.first().evaluate(image=>image.complete&&image.naturalWidth>0),'avatar must render');
  await page.evaluate(()=>__RUSH.engine.go('creators'));
  await page.locator('[data-cmd="irl-start"]').click();
  await page.locator('[data-cmd="irl-begin"]').click();
  await page.waitForTimeout(1400);
  assert.ok(await page.locator('#irl-world-speech').isVisible(),'focus bubble should remain prominent');
  await page.keyboard.press('g');
  assert.ok(await page.locator('#irl-graphics-panel').isVisible(),'graphics debug opens');
  await page.locator('#irl-graphics-texture').selectOption('chromatic');
  await page.locator('#irl-graphics-texture-strength').evaluate(input=>{input.value='45';input.dispatchEvent(new Event('input',{bubbles:true}));});
  await page.locator('#irl-graphics-chaos').check();
  await page.keyboard.press('g');
  assert.ok((await page.locator('#irl-canvas').evaluate(canvas=>canvas.width))>700,'sharp canvas');
  await page.evaluate(()=>{__RUSH.irl.next=6;__RUSH.irl.tick(.1);});
  assert.equal(await page.evaluate(()=>__RUSH.irl.crowd.length),19,'crowd expands in signing phase');
  await page.waitForTimeout(250);
  assert.equal(await page.locator('#irl-graphics-chaos').isChecked(),true);
  await page.close();
 }
 assert.deepEqual(failures,[],'no failed assets or app errors');
 console.log('BROWSER v0.8.3: PASS');
}finally{await browser.close();}
