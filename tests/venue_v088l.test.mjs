import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {IRLEvent} from '../src/irl-v07.js';
import {drawVenueMascot,drawModularTV} from '../src/venue-rig-v088b.js';
import {drawDebateShout} from '../src/irl-atmosphere-v083.js';
import {VENUE_STATIONS,venueStationApproachPoint,isVenueWalkable} from '../src/venue-nav.js';
import {MODULAR_PROPS,MODULAR_GATES,MODULAR_BLOCKERS} from '../src/venue-geometry-v088b.js';
import {sound} from '../src/audio.js';

const engine=()=>({progress:{irlRecords:{destinyMeet:{attempts:0}}}});
function context(){
 const calls=[];
 return {calls,globalAlpha:1,
  save(){},restore(){},beginPath(){},rect(...v){calls.push(['rect',...v]);},clip(){},
  fillRect(...v){calls.push(['fillRect',...v]);},strokeRect(){},fill(){},stroke(){},
  ellipse(){},translate(){},scale(){},rotate(){},transform(){},moveTo(){},lineTo(){},
  drawImage(...v){calls.push(['image',...v]);},fillText(...v){calls.push(['text',...v]);},
  measureText(s){return {width:String(s).length*3.2}},
  createLinearGradient(){return {addColorStop(){}}},createRadialGradient(){return {addColorStop(){}}}
 };
}

test('unified art has actual 1672x941 PNG pixels and independent transparent mascot',()=>{
 const plate=readFileSync(new URL('../assets/Neon Convention Hall Claw Machine.png',import.meta.url));
 const mascot=readFileSync(new URL('../assets/Adorable blue mascot clutching a red heart.png',import.meta.url));
 assert.equal(plate.toString('ascii',1,4),'PNG');
 assert.equal(plate.readUInt32BE(16),1672);
 assert.equal(plate.readUInt32BE(20),941);
 assert.equal(mascot.toString('ascii',1,4),'PNG');
 assert.equal(mascot.readUInt32BE(16),1220);
 assert.equal(mascot.readUInt32BE(20),1289);
 assert.equal(mascot[25],6,'mascot is RGBA, not baked into the venue');
 const event=new IRLEvent(engine(),{level:0});
 const ctx=context();
 assert(drawVenueMascot(ctx,{mascot:{naturalWidth:1220,naturalHeight:1289}},event,500));
 assert.equal(ctx.calls.filter(c=>c[0]==='image').length,1,'mascot is independent one-sprite draw');
});

test('every physical booth completes a visible transaction; vending is absent',()=>{
 assert(!('vending' in VENUE_STATIONS));
 assert(!('vending' in MODULAR_PROPS));
 assert(!MODULAR_BLOCKERS.some(o=>o.name==='vending'));
 const event=new IRLEvent(engine(),{level:0});
 for(const station of ['merch','claw','snacks','photo']){
  const actor=event.crowd[0];actor.visits=1;
  [actor.x,actor.y]=venueStationApproachPoint(station,actor.id,actor.visits);
  assert(isVenueWalkable(actor.x,actor.y),'approach is collision-safe: '+station);
  actor.station='wander';actor.target=station;actor.dwell=0;
  const previous=event.boothTransactions[station]||0;
  event.crowdTick(.1);
  assert(event.boothTransactions[station]>previous,station+' purchase happened');
  assert(event.stationActivity[station].activeUntil>event.elapsed,station+' has live fixture animation');
  assert(event.effects.some(f=>f.kind==='booth'&&f.station===station),'receipt at '+station);
 }
 assert.equal(event.boothTransactions.drinks,event.boothTransactions.snacks,'food counter serves drinks');
 assert(event.clawMachine.activeUntil>event.elapsed,'grapple animation triggered');
 assert(event.clawMachine.plays>0,'prize mechanic triggered');
 assert(event.crowd[0].photoPoseUntil>event.elapsed,'photo guest poses inside the booth before flash');
 assert(!event.stationActivity.photo.flashed,'camera waits until the subject is inside');
});

test('gate monitor patrols entry lanes while dedicated clerk remains at desk',()=>{
 const event=new IRLEvent(engine(),{level:0});event.begin();event.clock=500;event.nextArrival=999;
 const patrol=event.staff.filter(s=>s.gateMonitor);
 assert.equal(patrol.length,1);
 assert(event.staff.filter(s=>!s.gateMonitor).length>=2,'dispatchers remain available');
 assert(!event.freeWorker('check')?.gateMonitor,'patrol not assigned to dispatch');
 let different=false,gateObserved=false;
 const startX=patrol[0].x;
 for(let k=0;k<350;k++){
  event.tick(.1);
  different ||=Math.abs(patrol[0].x-startX)>20;
  gateObserved ||=!!patrol[0].monitoring;
  assert(isVenueWalkable(patrol[0].x,patrol[0].y),'no gate staff collision');
 }
 assert(different,'monitor patrols scanner lanes');
 assert(gateObserved,'monitor is visibly watching gates');
 assert.equal(event.ticketClerk.x,179,'ticket-processing clerk is stationed at the single-monitor desk');
 for(const gate of Object.values(MODULAR_GATES)){
  const gap=gate.lane.right-gate.lane.left;
  assert(gap>=39&&gap<=43);
 }
});

test('dggL walks separately, scatters hearts, and excites nearby guests',()=>{
 const event=new IRLEvent(engine(),{level:0});event.begin();event.clock=500;event.nextArrival=999;
 const x=event.mascot.x;let traveled=false,hearts=false;
 for(let k=0;k<280;k++){
  event.tick(.1);
  traveled ||=Math.abs(event.mascot.x-x)>15;
  hearts ||=event.mascot.heartBurst>0;
 }
 assert(traveled,'mascot autonomously visits areas');
 assert(hearts,'mascot releases decorative hearts');
});

test('stage debate produces world-space meme bubbles while TV only films the people',()=>{
 const event=new IRLEvent(engine(),{level:0});event.begin();event.clock=500;event.nextArrival=999;
 event.add({throughGate:false});event.resolve(event.visitors[0],true,'debate');
 const debater=event.departures.at(-1);
 let audience=0,shouts=0,h=0,c=0,samples=0,started=false;
 for(let k=0;k<650;k++){
  event.tick(.1);
  if(debater.stageVisit==='exchange'){
   started=true;samples++;h+=Number(!!debater.hostAuraActive);c+=Number(!!debater.challengerAuraActive);
   audience=Math.max(audience,event.crowd.filter(p=>p.debateWatching).length);
   shouts+=event.crowd.some(p=>p.debateWatching&&p.debateSpeechTime>0)?1:0;
  }
  if(started&&debater.stageVisit!=='exchange')break;
 }
 assert(samples>=55&&samples<=125,'6-12 seconds of argument');
 assert(audience>=3,'audience gathers around stage');
 assert(shouts>8,'actual NPCs shout debate memes');
 assert(Math.abs(h/samples-.25)<.075,'Destiny aura near 25% of round');
 assert(Math.abs(c/samples-.10)<.07,'challenger aura near 10% of round');
 const ctx=context(),portrait={naturalWidth:256,naturalHeight:256};
 drawModularTV(ctx,{crowd:[{kind:0,debateWatching:true},{kind:1,debateWatching:true}],departures:[{debater:true,stageVisit:'exchange',kind:2,exchangeClock:8}]},6500,{host:portrait,cast:portrait,poses:[portrait]});
 assert(!ctx.calls.some(x=>x[0]==='text'&&/COPIUM|ShrimpleAs|Let him cook|fact-check/.test(String(x[1]))),'no memes in TV');
 const shout=context();
 drawDebateShout(shout,{x:180,y:108,debateSpeech:'Let him cook!',debateSpeechTime:1.2,debateSpeechProgress:20,animation:'point'},null);
 assert(shout.calls.some(x=>x[0]==='text'&&String(x[1]).includes('Let')),'speech displayed over world spectator');
});

test('retro boxer gibberish is synthesized, beat-limited and respects mute',()=>{
 const oldOsc=sound.osc,oldSfx=sound.sfxEnabled;
 let count=0;sound.osc=()=>{count++};
 try{
  sound.sfxEnabled=true;sound.irlDebateVoice(4);
  assert(count>=6&&count<=12,'short multi-syllable sounds, not per-frame spam');
  const countWhenOn=count;
  sound.sfxEnabled=false;sound.irlDebateVoice(5);
  assert.equal(count,countWhenOn,'no voices when muted');
 }finally{sound.osc=oldOsc;sound.sfxEnabled=oldSfx;}
});