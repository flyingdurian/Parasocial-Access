import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {IRLEvent} from '../src/irl-v07.js';
import {venueDebateAudienceSpot} from '../src/venue-nav.js';
import {MODULAR_PROPS,MODULAR_STAGE} from '../src/venue-geometry-v088b.js';
import {drawStageConversation,drawStageFanInteraction} from '../src/venue-effects-v086.js';
import {drawModularVenue} from '../src/venue-rig-v088b.js';
import {bubbleRectsOverlap} from '../src/irl-atmosphere-v083.js';
import {MODULAR_TV_BOUNDS} from '../src/venue-geometry-v088b.js';

const engine=()=>({progress:{irlRecords:{destinyMeet:{attempts:0}}}});
function canvas(){
 const calls=[];return {calls,globalAlpha:1,save(){},restore(){},beginPath(){},closePath(){},rect(...a){calls.push(['rect',...a]);},clip(){},fill(){},stroke(){},ellipse(){},translate(){},transform(){},scale(){},rotate(){},moveTo(){},lineTo(){},quadraticCurveTo(){},arc(){},fillRect(...a){calls.push(['fill',...a]);},strokeRect(){},drawImage(...a){calls.push(['image',...a]);},fillText(...a){calls.push(['text',...a]);},measureText(s){return {width:String(s).length*3}},createLinearGradient(){return {addColorStop(){}}},createRadialGradient(){return {addColorStop(){}}}};
}

test('first-wave spectators surround stage apron, not the front check-in desk',()=>{
 const points=Array.from({length:19},(_,id)=>venueDebateAudienceSpot(id));
 assert(points.every(p=>p[0]>=160&&p[0]<=350&&p[1]<=150),'all spectators stay within the stage pit');
 assert(points.some(p=>p[1]<107),'inner arc is close to performers');
 assert(Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0]))>125,'semicircle spans both ends of stage');
});

test('each stage dialogue bubble is horizontally tied to its own performer',()=>{
 for(const [who,hostX,guestX] of [['challenger',198,285],['Destiny',198,285]]){
  const event={hostX,hostY:32,departures:[{name:'Rival',x:guestX,y:32,stageVisit:'exchange',debater:true,exchangeClock:who==='challenger'?18:12,exchangeDuration:18,debateTopic:{title:'Topic',critic:['What is the source?','Why?'],destiny:['Here is the source.','My conclusion.']}}]};
  const c=canvas(),placed=drawStageConversation(c,event);
  const speakerX=who==='challenger'?guestX:hostX;
  assert(Math.abs(placed.x+placed.w/2-(speakerX+16))<=2,who+' bubble is above its speaker, not in a shared lane');
  assert(!bubbleRectsOverlap(placed,MODULAR_TV_BOUNDS),'does not obscure the in-world TV');
 }
});

test('autographs and photos are separate 5-second events with face-to-face positions',()=>{
 assert(Math.abs(MODULAR_STAGE.autographGuest[0]-MODULAR_STAGE.autographHost[0])<=26);
 assert(Math.abs(MODULAR_STAGE.photoGuest[0]-MODULAR_STAGE.photoHost[0])<=26);
 assert(MODULAR_STAGE.photoHost[1]<MODULAR_STAGE.tripod[1],'photo duo poses behind the camera');
 for(const kind of ['autograph','photo']){
  const e=new IRLEvent(engine());e.begin();e.clock=500;e.nextArrival=999;
  const g={id:982,serial:6,name:kind,kind:5,stageVisit:'climbStairs',x:249,y:61,ttl:30,exchangeClock:0,fanKind:kind,debater:false,facing:1};
  e.departures=[g];
  for(let i=0;i<80&&g.stageVisit!=='exchange';i++)e.tick(.1);
  assert.equal(g.stageVisit,'exchange');
  assert(g.exchangeDuration>=4&&g.exchangeDuration<=6);
  const rendered=canvas();drawStageFanInteraction(rendered,e,e.elapsed*1000);
  if(kind==='autograph')assert(rendered.calls.some(c=>c[0]==='fill'&&c[3]===14),'signing has a held print');
  else assert(rendered.calls.some(c=>c[0]==='text'&&String(c[1]).includes('CHEESE'))===false,'photo text follows the pose phase');
  for(let i=0;i<25;i++)e.tick(.1);
  const target=kind==='photo'?MODULAR_STAGE.photoHost:MODULAR_STAGE.autographHost;
  assert(Math.hypot(e.hostX-target[0],e.hostY-target[1])<4,'Destiny walks up beside the fan');
  if(kind==='photo')assert.equal(g.photoTaken,undefined,'camera must wait for the late pose');
  for(let i=0;i<25;i++)e.tick(.1);
  if(kind==='photo')assert(g.photoTaken,'photographer fires only after both have posed');
 }
});

test('single lifted plush falls centered in the physical dispenser',()=>{
 const mascot={complete:true,naturalWidth:220,naturalHeight:220};
 const assets={plate:{naturalWidth:1672,naturalHeight:941,complete:true},clerk:{naturalWidth:200,naturalHeight:300,complete:true},mascot};
 const e={elapsed:2.2,clawMachine:{activeUntil:2.3},gateControllers:{},departures:[],effects:[],stationActivity:{}};
 const c=canvas();drawModularVenue(c,assets,e,2200,{});
 const prizes=c.calls.filter(call=>call[0]==='image'&&call[1]===mascot);
 assert.equal(prizes.length,1,'single prize, no glass ghost');
 const p=prizes[0],centerX=p[2]+p[4]/2,chuteX=MODULAR_PROPS.claw.x+MODULAR_PROPS.claw.w*.51;
 assert(Math.abs(centerX-chuteX)<.1,'center of plush follows chute centerline');
 assert(p[3]>=MODULAR_PROPS.claw.y+34,'plush falls downward into prize slot');
});

test('both game routes expose an outside-canvas mobile decision card',()=>{
 const harness=readFileSync('src/irl-sandbox-v085.js','utf8');
 const ui=readFileSync('src/ui.js','utf8');
 const css=readFileSync('src/irl-sandbox-v085.css','utf8');
 const mainCss=readFileSync('src/style.css','utf8');
 assert(harness.includes('id="h-mobile-prompt"')&&harness.includes('reserveStageSpeech('));
 assert(ui.includes('id="irl-mobile-review"')&&ui.includes('drawStageFanInteraction('));
 assert(css.includes('.harness-prompt{display:none!important}'));
 assert(mainCss.includes('.irl-world-speech{display:none!important}'));
 assert(mainCss.includes('.irl-canvas-wrap{aspect-ratio:384/216}'),'mobile stage is not clipped/cropped');
});
