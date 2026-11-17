// Browser smoke and optional visual snapshot of a 36-person stage-front debate.
// Run after serving repository root: node tests/browser_v088r.mjs
import assert from 'node:assert/strict';
const {chromium}=await import('file://'+(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES||'/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/playwright/index.mjs');

const base=process.env.FEEDFALL_TEST_URL||'http://127.0.0.1:8910/irl-sandbox.html';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const errors=[];
try{
 for(const viewport of [{name:'desktop',width:1320,height:850},{name:'phone',width:390,height:844}]){
  const page=await browser.newPage({viewport,deviceScaleFactor:1});
  page.on('pageerror',error=>errors.push(viewport.name+': '+error.message));
  await page.goto(base);
  await page.locator('#h-begin').click();
  await page.waitForTimeout(550);
  const snapshot=await page.evaluate(async()=>{
   const {venueDebateAudienceSpot}=await import('/src/venue-nav.js');
   const event=globalThis.__FEEDFALL_IRL_SANDBOX.event;
   event.paused=true;
   const original=[...event.crowd];
   event.departures=[{id:'qa-challenger',serial:77,name:'Challenger',kind:8,x:285,y:40,stageVisit:'exchange',debater:true,exchangeClock:18,exchangeDuration:18,exchangeAction:'argue',debateTopic:{title:'CROWD PLACEMENT',destiny:['Show your source!'],critic:['The stage is right here!']},clashPulse:0,clashPower:1}];
   event.hostX=198;event.hostY=36;
   event.crowd=Array.from({length:36},(_,i)=>{
    const actor={...original[i%original.length]};const [x,y]=venueDebateAudienceSpot(i);
    return {...actor,id:4000+i,kind:actor.kind||2,x,y,walking:false,debateWatching:true,debateArrived:true,direction:'north',animation:'cheer',debateSpeechTime:0,entryPhase:null};
   });
   return {footY:event.crowd.map(g=>g.y+35),footX:event.crowd.map(g=>g.x+16)};
  });
  assert(Math.max(...snapshot.footY)<140);
  assert(Math.min(...snapshot.footX)<200&&Math.max(...snapshot.footX)>335);
  await page.waitForTimeout(250);
  if(process.env.FEEDFALL_SCREENSHOT_DIR){
   await page.locator('#h-canvas').screenshot({path:`${process.env.FEEDFALL_SCREENSHOT_DIR}/v088r-${viewport.name}-stage.png`});
  }
  await page.close();
 }
 assert.deepEqual(errors,[],'browser animation remains exception-free at desktop and phone sizes');
 console.log('v0.8.8r browser smoke GREEN: 36 stage-front spectators, desktop/phone, zero page errors');
}finally{await browser.close();}
