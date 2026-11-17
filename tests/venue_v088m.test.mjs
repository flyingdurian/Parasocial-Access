import test from 'node:test';
import assert from 'node:assert/strict';
import {IRLEvent} from '../src/irl-v07.js';
import {VENUE_STAGE,venueRoamPoint,venueStationApproachPoint} from '../src/venue-nav.js';
import {stagePosition} from '../src/sprite-animation.js';
import {MODULAR_PROPS,MODULAR_GATES} from '../src/venue-geometry-v088b.js';
import {drawModularVenue,drawModularTV,drawTicketClerk} from '../src/venue-rig-v088b.js';

const engine=()=>({progress:{irlRecords:{destinyMeet:{attempts:0}}}});
function context(){
 const calls=[];
 return {calls,globalAlpha:1,
  save(){},restore(){},beginPath(){},rect(...a){calls.push(['rect',...a]);},clip(){},fill(){},stroke(){},
  ellipse(){},translate(){},scale(){},rotate(){},transform(){},moveTo(){},lineTo(){},
  fillRect(...a){calls.push(['rectFill',...a]);},strokeRect(){},
  drawImage(...a){calls.push(['image',...a]);},fillText(...a){calls.push(['text',...a]);},
  measureText(s){return {width:String(s).length*3}},
  createLinearGradient(){return {addColorStop(){}}},createRadialGradient(){return {addColorStop(){}}}
 };
}
const portrait={naturalWidth:256,naturalHeight:256};
const assets={plate:{naturalWidth:1672,naturalHeight:941,complete:true},clerk:{naturalWidth:150,naturalHeight:190,complete:true},mascot:{naturalWidth:1220,naturalHeight:1289,complete:true}};

test('idle audience roam destinations stay outside the reserved queue corridor',()=>{
 for(let i=0;i<240;i++){
  const [x,y]=venueRoamPoint(i*137);
  assert(!(x>160&&x<312&&y>92&&y<162),'ambient roam would block stage line '+[x,y]);
 }
});

test('challenger finishes on right-hand platform facing Destiny on left',()=>{
 assert(VENUE_STAGE.debate[0]>VENUE_STAGE.stairs[0]+25);
 assert(VENUE_STAGE.debate[1]<=34);
 assert(stagePosition('talk',12,true).x<219);
 assert(stagePosition('talk',12,true).y<=34);
 const event=new IRLEvent(engine(),{level:0});
 event.begin();event.nextArrival=999;event.clock=500;
 event.add({throughGate:false});event.resolve(event.visitors[0],true,'debate');
 const challenger=event.departures.at(-1);
 let prelude=false,exchange=false,crowded=false,shouts=false;
 for(let i=0;i<700;i++){
  event.tick(.1);
  prelude||=['approach','climbStairs'].includes(challenger.stageVisit);
  if(prelude&&challenger.stageVisit!=='exchange'){
   crowded||=event.crowd.filter(g=>g.debateWatching).length>=5;
   shouts||=event.crowd.some(g=>g.debateSpeechTime>0);
  }
  if(challenger.stageVisit==='exchange'){exchange=true;break;}
 }
 assert(prelude&&exchange,'debater moves via approach and stairs to stage');
 assert(crowded&&shouts,'crowd rushes in and shouts during prelude');
 assert(Math.abs(challenger.x-VENUE_STAGE.debate[0])<2&&Math.abs(challenger.y-VENUE_STAGE.debate[1])<2);
 assert.equal(challenger.facing,-1,'faces Destiny rather than the audience');
 assert(event.hostX+31<challenger.x,'opponents stand on opposite sides');
});

test('live stage screen cuts to actual solo fighter portraits and close crowd',()=>{
 const ctx=context(),crowd=[{kind:2,debateWatching:true},{kind:3,debateWatching:true},{kind:4,debateWatching:true}];
 const event={crowd,departures:[{debater:true,stageVisit:'exchange',kind:2,exchangeClock:7}]};
 const labels=[];
 for(const t of [0,1550,3100,4650,6200]){
  const c=context();
  drawModularTV(c,event,t,{host:portrait,cast:portrait,poses:[null,null,portrait]});
  labels.push(...c.calls.filter(x=>x[0]==='text').map(x=>String(x[1])));
  assert(c.calls.some(x=>x[0]==='image'),'camera actually draws a zoomed character');
 }
 for(const name of ['DESTINY CLOSE-UP','CHALLENGER CLOSE-UP','BLOODSPORTS LIVE','AUDIENCE CLOSE-UP'])assert(labels.includes(name),name);
 const p=context();drawModularTV(p,{departures:[{debater:true,stageVisit:'climbStairs',kind:2}],crowd},999,{host:portrait,cast:portrait});
 assert(p.calls.some(x=>x[0]==='text'&&String(x[1]).includes('DEBATE IS ABOUT TO BEGIN')),'prelude LCD announces upcoming round');
 assert(!labels.some(v=>/COPIUM|fact-check|Let him cook/.test(v)),'lore remains on physical audience speech only');
});

test('photo guest physically poses inside the booth before camera flashes',()=>{
 const event=new IRLEvent(engine(),{level:0});
 const guest=event.crowd[0];guest.visits=1;
 [guest.x,guest.y]=venueStationApproachPoint('photo',guest.id,guest.visits);
 guest.station='wander';guest.target='photo';guest.dwell=0;
 event.crowdTick(.1);
 assert.equal(guest.photoPhase,'enter','doorway engagement does not instantly trigger camera');
 for(let i=0;i<50&&guest.photoPhase!=='pose';i++){event.elapsed+=.1;event.crowdTick(.1);}
 assert(guest.photoPoseUntil>event.elapsed);
 assert(event.stationActivity.photo&&!event.stationActivity.photo.flashed);
 assert(!event.cameraFlashes.some(f=>f.x===360),'no picture of empty booth');
 event.begin();event.nextArrival=999;event.clock=500;
 for(let i=0;i<13;i++)event.tick(.1);
 assert(event.stationActivity.photo.flashed,'picture taken with visible subject');
 assert(event.cameraFlashes.some(f=>f.x===360&&f.y===66));
});

test('claw arm lifts a real dggL art sprite and drops it through prize chute',()=>{
 const cabinet=MODULAR_PROPS.claw;
 const c=context();
 const event={elapsed:1.45,clawMachine:{activeUntil:2.3},gateControllers:{},departures:[],effects:[],stationActivity:{}};
 assert(drawModularVenue(c,assets,event,1450,{}));
 const plush=c.calls.find(x=>x[0]==='image'&&x[1]===assets.mascot);
 assert(plush,'actual transparent mascot toy image gripped, not a rectangle placeholder');
 assert(plush[2]>=cabinet.x+2&&plush[2]<=cabinet.x+cabinet.w-5);
 const delivered=context();event.elapsed=2.2;
 drawModularVenue(delivered,assets,event,2200,{});
 assert(delivered.calls.some(x=>x[0]==='image'&&x[1]===assets.mascot&&x[3]>=cabinet.y+34),'real prize exits in cabinet chute');
});

test('security grille leaves fully enclose both lanes at idle',()=>{
 const c=context();
 const event={elapsed:6,clawMachine:{activeUntil:0},gateControllers:{left:{openedAt:-1,openUntil:0},right:{openedAt:-1,openUntil:0}},departures:[]};
 drawModularVenue(c,assets,event,6000,{});
 for(const gate of Object.values(MODULAR_GATES)){
  const lane=gate.lane;
  assert(c.calls.some(x=>x[0]==='rectFill'&&Math.abs(x[1]-lane.left)<.2&&x[3]>5&&x[4]>=20),'fixture has full left grille');
  assert(c.calls.some(x=>x[0]==='rectFill'&&Math.abs(x[1]-(lane.right-(lane.right-lane.left)/2-.7))<1.2&&x[3]>5&&x[4]>=20),'fixture has full right grille');
 }
});

test('ticket support staff really walk and clerk animates multiple service poses',()=>{
 const event=new IRLEvent(engine(),{level:0});event.begin();event.nextArrival=999;event.clock=500;
 const worker=event.staff[1],startX=worker.x;let walked=false;
 for(let i=0;i<180;i++){event.tick(.1);walked||=Math.abs(worker.x-startX)>3;}
 assert(walked,'staff walks via existing directional atlas frames');
 const c1=context(),c2=context();
 const clerk={ticketClerk:{x:179,y:153,lastScanAt:-20},elapsed:.1};
 drawTicketClerk(c1,assets,clerk);clerk.elapsed=.7;drawTicketClerk(c2,assets,clerk);
 assert.notDeepEqual(c1.calls.filter(x=>x[0]==='image'),c2.calls.filter(x=>x[0]==='image'),'counter worker has changing keyframe offsets');
});
