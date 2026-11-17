import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {IRLEvent} from '../src/irl-v07.js';
import {isVenueWalkable,venueDebateAudienceSpot} from '../src/venue-nav.js';
import {MODULAR_STAGE} from '../src/venue-geometry-v088b.js';
import {MODULAR_GATES} from '../src/venue-geometry-v088b.js';
import {drawContactShadow,drawVenueCharacter,venueSpriteGeometry} from '../src/sprite-animation.js';
import {createBubbleLayout,drawAmbientBubble,drawDebateShout} from '../src/irl-atmosphere-v083.js';
import {drawDebateCombatEffects} from '../src/venue-effects-v086.js';
import {captureLiveAudienceFrame} from '../src/venue-rig-v088b.js';

const engine=()=>({
 progress:{
  irlRecords:{
   destinyMeet:{attempts:0}
  }
 }
});
function ctx(){
 const calls=[];
 return {
  calls,globalAlpha:1,canvas:{width:384,height:216},
  save(){},restore(){},beginPath(){},closePath(){},rect(){},clip(){},fill(){},stroke(){},
  ellipse(...args){calls.push(['ellipse',...args]);},moveTo(){},lineTo(){},
  fillRect(...args){calls.push(['rect',...args]);},strokeRect(){},
  drawImage(...args){calls.push(['image',...args]);},
  fillText(...args){calls.push(['text',...args]);},
  measureText(value){return {width:String(value).length*3};},
  createLinearGradient(){return {addColorStop(){}};},
  createRadialGradient(){return {addColorStop(){}};}
 };
}

test("first nineteen crowd positions form the owner's near-stage half ellipse",()=>{
 const spots=Array.from({length:19},(_,i)=>venueDebateAudienceSpot(i));
 assert(spots.every(([x,y])=>x+16>=188&&x+16<=345&&y+35>=99&&y+35<=141),'first wave FOOT CONTACT stays within stage apron, not at gates');
 assert(Math.max(...spots.map(([x])=>x))-Math.min(...spots.map(([x])=>x))>135,'crowd spans the entire stage width');
 assert(spots.every(([x,y])=>isVenueWalkable(x,y)),'all audience targets have a navigable footprint');
 assert(new Set(spots.map(p=>p.join(','))).size===spots.length,'pit slots do not overlap');
});

test('crowd enters actual first slots in order and turns toward stage when arrived',()=>{
 const e=new IRLEvent(engine());e.begin();e.nextArrival=999;
 e.departures=[{id:987,serial:4,debater:true,stageVisit:'approach',x:249,y:61,kind:4,ttl:99}];
 for(let t=0;t<200;t++){e.elapsed+=.1;e.crowdTick(.1);e.spreadCrowd();}
 const expected=venueDebateAudienceSpot(0),watcher=e.crowd[0];
 assert(watcher.debateWatching,'audience did join the debate');
 assert(Math.hypot(watcher.x-expected[0],watcher.y-expected[1])<3,'ID 13 uses slot 0, not slot 13');
 assert.equal(watcher.direction,'north','audience shows rear-facing stage-view sprite');
 assert(e.crowd.slice(0,19).filter(p=>p.debateArrived).length>=15,'first wave converges rather than staying at gate');
});

test('arrived spectators retain rear-view animation while cheering or pointing',()=>{
 const motion={debateWatching:true,debateArrived:true,direction:'north',facing:1};
 const back={complete:true,naturalWidth:600,naturalHeight:400};
 const front={complete:true,naturalWidth:600,naturalHeight:400};
 const newOne=ctx();drawVenueCharacter(newOne,null,null,30,'cheer',1000,200,120,30,40,null,null,null,motion,null,null,null,null,null,{back,react:front});
 assert(newOne.calls.some(call=>call[0]==='image'&&call[1]===back),'new cast never turns toward the player to cheer');
 const expanded=ctx();drawVenueCharacter(expanded,null,null,13,'point',1000,200,120,30,40,null,[front],[front],motion,[back],null,[front]);
 assert(expanded.calls.some(call=>call[0]==='image'&&call[1]===back),'expanded cast keeps rear-view cheering');
 const original=ctx();drawVenueCharacter(original,null,null,2,'argue',1000,200,120,30,40,null,null,null,motion,null,null,null,null,[back,back]);
 assert(original.calls.some(call=>call[0]==='image'&&call[1]===back),'original cast also watches the stage');
});

test('stage fan duos stand on front floor boards rather than LCD backdrop',()=>{
 assert(MODULAR_STAGE.autographHost[0]>=240&&MODULAR_STAGE.autographGuest[0]<=275);
 assert(MODULAR_STAGE.autographHost[1]>=36&&MODULAR_STAGE.autographGuest[1]>=36);
 assert(MODULAR_STAGE.photoGuest[0]>MODULAR_STAGE.photoHost[0]);
 assert(MODULAR_STAGE.photoGuest[0]-MODULAR_STAGE.tripod[0]<=0,'photo guest poses immediately next to camera');
 assert(MODULAR_STAGE.photoGuest[1]>=34,'photo duo is on front boards');
});

test('dynamic shadow is anchored at foot contact and tracks stage lighting',()=>{
 const box=venueSpriteGeometry(245,38,30,38,{walking:false});
 const floor=ctx(),stage=ctx();drawContactShadow(floor,box,1200,'hall');drawContactShadow(stage,box,3600,'stage');
 assert.equal(floor.calls.filter(c=>c[0]==='ellipse').length,2);
 assert.equal(stage.calls.filter(c=>c[0]==='ellipse').length,3);
 assert(stage.calls.every(c=>c[0]!=='ellipse'||c[2]<=box.footY),'shadows stay at or above actual feet');
 assert.notDeepEqual(floor.calls,stage.calls,'stage spotlights produce a different cast shadow');
});

test('ambient chatter uses the entire sentence and bubbles never escape their speaker',()=>{
 const text='I brought a signed photo for Destiny and waited in the queue';
 const c=ctx(),layout=createBubbleLayout();
 const placed=drawAmbientBubble(c,text,145,124,1,45,layout);
 assert(placed,'full ambient bubble rendered');
 assert(c.calls.filter(call=>call[0]==='text').map(call=>call[1]).join(' ').includes('waited in the queue'),'no hard 28-character truncation');
 const crowd={x:145,y:124,debateSpeechTime:1.8,debateSpeech:'Source? Show the whole source please!',animation:'argue'};
 const reserved=createBubbleLayout([{x:0,y:0,w:384,h:216}]);
 assert.equal(drawDebateShout(ctx(),crowd,reserved),null,'a fully blocked bubble disappears instead of teleporting across the hall');
});

test('arcade clashes and complete KO verdict have distinct visual states',()=>{
 const c=ctx(),g={debater:true,stageVisit:'exchange',x:272,clashPulse:.2,clashPower:2};
 drawDebateCombatEffects(c,{hostX:215,departures:[g]},1000);
 assert(c.calls.some(call=>call[0]==='text'&&call[1]==='BAM!'));
 const end=ctx();drawDebateCombatEffects(end,{departures:[],tvEvent:{type:'debate',won:true,ttl:2.9,maxTtl:3.4}},3000);
 assert(!end.calls.some(call=>call[0]==='text'&&call[1]==='DEBATE WON'),'KO only renders inside the physical TV');
});

test('camera feed is copied from the real crowd canvas, not atlas portraits',()=>{
 const c=ctx(),frame={width:176,height:78,getContext(){return {drawImage(...a){c.calls.push(['live',...a]);},set imageSmoothingEnabled(v){}};}};
 assert(captureLiveAudienceFrame(c,frame,{crowd:[{debateWatching:true}]}));
 assert(c.calls.some(call=>call[0]==='live'&&call[1]===c.canvas));
});

test('live campaign offers expert default, relaxed hints and equal fourth debate button',()=>{
 const ui=readFileSync('src/ui.js','utf8'),css=readFileSync('src/style.css','utf8');
 assert(ui.includes("let irlDifficulty='expert'")&&ui.includes('feedfall-destiny-difficulty'));
 assert(ui.includes('data-action="debate" class="irl-debate"')&&ui.includes('4 · CRITIC'));
 assert(ui.includes('data-action="security" class="irl-security"')&&ui.includes('5 · DANGER'));
 assert(ui.includes('Digit4:\'debate\',Digit5:\'security\''));
 assert(css.includes('.irl-actions{grid-template-columns:repeat(5,minmax(0,1fr))}'));
 assert(!ui.includes('irl-relaxed-hint')&&ui.includes('irl-suggested'),'relaxed mode only highlights the correct button');
});

test('admission gates close after a guest has cleared the scanner',()=>{
 const e=new IRLEvent(engine());e.begin();e.nextArrival=999;
 e.add({throughGate:true});
 const gate=e.arrivals[0].gate;
 assert(gate===MODULAR_GATES.left||gate===MODULAR_GATES.right);
 for(let i=0;i<135;i++)e.tick(.1);
 const state=e.gateControllers[gate.id];
 assert(e.arrivals.every(g=>g.gate!==gate||g.entryPhase!=='inside'),'authorized arrival clears its lane');
 assert(state.openUntil<e.elapsed,'idle entrance gate is closed, not held open for seconds');
});
