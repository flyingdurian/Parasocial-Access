import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {IRLEvent} from '../src/irl-v07.js';
import {venueStationApproachPoint,venueDebateAudienceSpot,moveVenue} from '../src/venue-nav.js';
import {debateExchangeDuration} from '../src/irl-debates-v088.js';
import {drawVenueCharacter,venueSpriteGeometry} from '../src/sprite-animation.js';
import {drawModularVenue} from '../src/venue-rig-v088b.js';
import {MODULAR_PROPS,MODULAR_GATES} from '../src/venue-geometry-v088b.js';

const engine=()=>({progress:{irlRecords:{destinyMeet:{attempts:0}}}});
function context(){
 const calls=[];
 return {calls,globalAlpha:1,save(){},restore(){},beginPath(){},rect(...a){calls.push(['rect',...a]);},clip(){},fill(){},stroke(){},ellipse(){},translate(){},scale(){},transform(){},rotate(){},moveTo(){},lineTo(){},arc(){},fillRect(...a){calls.push(['fillRect',...a]);},strokeRect(){},drawImage(...a){calls.push(['image',...a]);},fillText(...a){calls.push(['text',...a]);},measureText(s){return {width:String(s).length*3}},createLinearGradient(){return {addColorStop(){}}},createRadialGradient(){return {addColorStop(){}}}};
}
const assets={plate:{naturalWidth:1672,naturalHeight:941,complete:true},clerk:{naturalWidth:150,naturalHeight:190,complete:true},mascot:{naturalWidth:1220,naturalHeight:1289,complete:true}};

test('six new distinct crowd members are registered and all transparent artwork sheets exist',()=>{
 const e=new IRLEvent(engine());
 assert.deepEqual(e.crowd.filter(p=>p.kind>=30).map(p=>p.kind),[30,31,32,33,34,35]);
 for(const i of [1,2,3]){
  const b=readFileSync('assets/irl-cast new sheet '+i+'.png');
  assert.equal(b.toString('ascii',1,4),'PNG');
  assert.equal(b.readUInt32BE(16),1536);
  assert.equal(b.readUInt32BE(20),1024);
  assert.equal(b[25],6,'full RGBA, no opaque panel');
 }
 const img={naturalWidth:1536,naturalHeight:1024,complete:true};
 const sheets={back:img,walk:{...img},react:{...img}};
 const c=context();
 drawVenueCharacter(c,null,null,30,'walk',0,0,0,27,34,null,null,null,{direction:'north',stepDistance:10},null,null,null,null,null,sheets);
 assert(c.calls.some(x=>x[0]==='image'&&x[1]===sheets.back),'rear walk uses rear sheet');
 const d=context();
 drawVenueCharacter(d,null,null,35,'argue',0,0,0,27,34,null,null,null,{direction:'south'},null,null,null,null,null,sheets);
 assert(d.calls.some(x=>x[0]==='image'&&x[1]===sheets.react),'argument uses front reaction sheet');
});

test('contact shadow remains on real floor while spectator body jumps',()=>{
 const ground=venueSpriteGeometry(60,100,27,34,{walking:true,stepDistance:4});
 const jumping=venueSpriteGeometry(60,97,27,34,{walking:true,stepDistance:4,groundY:100});
 assert.equal(jumping.footY,ground.footY);
 assert(jumping.y<ground.y,'only visual body rises');
 assert(jumping.scale>=.91&&jumping.scale<=1.05);
});

test('arrival requires the reached target and cannot be forced by blocked route flag',()=>{
 const person={x:40,y:120,routeBlocked:true,stepDistance:0};
 const reached=moveVenue(person,300,120,.1,30);
 assert.equal(reached,false);
 assert(Math.hypot(person.x-300,person.y-120)>30);
});

test('photo visitor enters physically, poses before shutter, then walks out to the same doorway',()=>{
 const e=new IRLEvent(engine()),person=e.crowd[0];
 [person.x,person.y]=venueStationApproachPoint('photo',person.id,1);
 person.visits=1;person.target='photo';person.station='wander';person.dwell=0;
 const start=[person.x,person.y];e.crowdTick(.1);
 assert.equal(person.photoPhase,'enter');
 assert.equal(e.boothTransactions.photo,0,'no photo before physical entry');
 let seenMoving=false;
 for(let k=0;k<45&&person.photoPhase!=='pose';k++){e.elapsed+=.1;e.crowdTick(.1);seenMoving||=person.walking;}
 assert(seenMoving);
 assert.equal(person.photoPhase,'pose','visitor entered booth by walking');
 assert(Math.hypot(person.x-344,person.y-57)<1);
 assert.equal(e.boothTransactions.photo,1);
 assert(!e.stationActivity.photo.flashed);
 for(let k=0;k<60&&person.photoPhase;k++){e.elapsed+=.1;e.crowdTick(.1);}
 assert.equal(person.photoPhase,null);
 assert(Math.hypot(person.x-start[0],person.y-start[1])<1,'physically walked back, no rubber band');
});

test('all free spectators leave their activities and rush toward a dense stage ring, then walk back',()=>{
 const e=new IRLEvent(engine());e.departures=[{serial:4,debater:true,stageVisit:'exchange',exchangeClock:18}];
 const old=e.crowd.map(p=>[p.x,p.y]);
 for(let i=0;i<90;i++){e.elapsed+=.1;e.crowdTick(.1);}
 const reached=e.crowd.filter(p=>p.debateArrived).length;
 assert(reached>=e.crowd.length-1,'reached ring: '+reached+'/'+e.crowd.length);
 assert(e.crowd.every(p=>p.debateWatching),'all free spectators participate');
 assert(e.crowd.some(p=>p.animation==='argue'||p.animation==='cheer'));
 e.departures=[];
 for(let i=0;i<120;i++){e.elapsed+=.1;e.crowdTick(.1);}
 const back=e.crowd.filter((p,i)=>!p.returnFromDebate&&Math.hypot(p.x-old[i][0],p.y-old[i][1])<12).length;
 assert(back>=18,'returned toward previous activities: '+back);
});

test('debate durations are 15–20 seconds; final-boss aura and rapid meme chat persist',()=>{
 for(let difficulty=1;difficulty<=5;difficulty++)for(let serial=0;serial<12;serial++){
  const n=debateExchangeDuration({debateTopic:{difficulty},serial},2);
  assert(n>=15&&n<=20);
 }
 const e=new IRLEvent(engine());e.begin();e.nextArrival=999;e.clock=500;
 const d={id:'test-duel',serial:9,name:'Critic',kind:33,x:285,y:32,debater:true,stageVisit:'exchange',exchangeClock:18,exchangeDuration:18,ttl:30,hypeBeat:0,hypeClock:.1,debateTopic:{id:'sources',title:'SHOW SOURCES',difficulty:2},exchangeAction:'argue',facing:-1};
 e.departures=[d];
 let boss=0,challenger=0,chat=0;
 for(let i=0;i<160;i++){e.tick(.1);boss+=!!d.hostAuraActive;challenger+=!!d.challengerAuraActive;chat=Math.max(chat,d.hypeBeat);assert.equal(d.facing,-1);}
 assert(boss>=27&&boss<=54,'boss aura is dramatic, not constant');
 assert(challenger>=9&&challenger<=30,'rival aura is rare');
 assert(chat>=15,'chat changes across the longer bloodsports round');
});

test('claw holds one collectible and drops it down the pictured chute',()=>{
 const c=context(),event={elapsed:1.45,clawMachine:{activeUntil:2.3},gateControllers:{},departures:[],effects:[],stationActivity:{}};
 drawModularVenue(c,assets,event,1450,{});
 assert.equal(c.calls.filter(x=>x[0]==='image'&&x[1]===assets.mascot).length,1);
 const drop=context();event.elapsed=2.2;drawModularVenue(drop,assets,event,2200,{});
 const toys=drop.calls.filter(x=>x[0]==='image'&&x[1]===assets.mascot);
 assert.equal(toys.length,1,'no ghost plush remains inside glass');
 assert(toys[0][3]>=MODULAR_PROPS.claw.y+34,'one plush is now in the chute');
});

test('entrance uses narrow waist-high scanner arms with ticket access unchanged',()=>{
 const e=new IRLEvent(engine());
 const ctx=context();
 drawModularVenue(ctx,assets,e,100,{});
 const gateBands=ctx.calls.filter(c=>c[0]==='fillRect'&&Object.values(MODULAR_GATES).some(g=>c[1]>=g.lane.left-3&&c[1]<=g.lane.right+3&&c[2]>=g.lane.top&&c[2]<=g.lane.bottom));
 assert(gateBands.every(c=>c[4]<=5),'no full-height floating gate panels');
 assert.equal(e.gateControllers.left.openUntil<e.elapsed,true);
});
